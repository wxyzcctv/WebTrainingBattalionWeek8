export class Dispatcher {
    constructor(element) {
        this.element = element
    }
    dispatch(type, properties) {
        let event = new Event(type);
        for (let name in properties) {
            event[name] = properties[name]
        }
        this.element.dispatchEvent(event)
    }
}

// listener=>recognize=>dispatch

// new Listener(new Recognizer(dispatch))

export class Listener {
    constructor(element, recognizer) {
        let isListeningMouse = false;

        let contexts = new Map();

        element.addEventListener('mousedown', event => {
            // mousedown事件中event.butten表示鼠标按下按键的数字
            // 1 << event.button和button << 1移位操作能等到数字对应的2的倍数
            let context = Object.create(null);
            contexts.set('mouse' + (1 << event.button), context)
            recognizer.start(event, context);

            let mousemove = event => {
                // mousemove事件中event.buttens二进制掩码表示鼠标按下按键的数字，0b0001 === 2， 0b0011 = 3
                let button = 1;
                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        let key;
                        // 左键和中键相反了
                        if (button === 2) {
                            key = 4;
                        } else if (button === 4) {
                            key = 2
                        } else {
                            key = button
                        }
                        let context = contexts.get('mouse' + key);
                        recognizer.move(event, context);
                    }
                    button = button << 1
                }
            }
            let mouseup = event => {
                let context = contexts.get('mouse' + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete('mouse' + (1 << event.button));
                if (event.buttons === 0) {
                    document.removeEventListener('mousemove', mousemove)
                    document.removeEventListener('mouseup', mouseup);
                    isListeningMouse = false;
                }
            }
            if (!isListeningMouse) {
                document.addEventListener("mousemove", mousemove)
                document.addEventListener("mouseup", mouseup);
                isListeningMouse = true;
            }
        })


        element.addEventListener("touchstart", event => {
            for (const toch of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(toch.identifier, context)
                recognizer.start(toch, context)
            }
        })

        element.addEventListener("touchmove", event => {
            for (const toch of event.changedTouches) {
                let context = contexts.get(toch.identifier)
                recognizer.move(toch, context)
            }
        })

        element.addEventListener("touchend", event => {
            for (const toch of event.changedTouches) {
                let context = contexts.get(toch.identifier)
                recognizer.end(toch, context)
                contexts.delete(toch.identifier)
            }
        })
        element.addEventListener("touchcancel", event => {
            for (const toch of event.changedTouches) {
                let context = contexts.get(toch.identifier)
                recognizer.cancel(toch, context);
                contexts.delete(toch.identifier);
            }
        })
    }
}
export class Recognizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher
    }

    start(point, context) {
        context.startX = point.clientX, context.startY = point.clientY;
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY,
        }]

        context.isTap = true;
        context.isPan = false;
        context.isPress = false;

        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;
            this.dispatcher.dispatch('press', {})
        }, 500);
    }
    move(point, context) {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy)
            this.dispatcher.dispatch('panstart', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
            clearTimeout(context.handler)
        }
        if (context.isPan) {
            this.dispatcher.dispatch('pan', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500)
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY,
        })
    }
    end(point, context) {
        if (context.isTap) {
            this.dispatcher.dispatch('tap', {})
            clearTimeout(context.handler);
        }

        if (context.isPress) {
            this.dispatcher.dispatch('pressend', {})
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500);

        let d, v;
        if (!context.points.length) {
            v = 0;
        } else {
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
            v = d / (Date.now() - context.points[0].t);
        }
        if (v > 1.5) {
            console.log("flick");
            this.dispatcher.dispatch('panend', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
            context.isFlick = true;
        } else {
            context.isFlick = false;
        }
        if (context.isPan) {
            this.dispatcher.dispatch('panend', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            })
        }
    }
    cancel(point, context) {
        clearTimeout(context.handler);
        this.dispatcher.dispatch('cancel', {})
    }
}

export function enableGesture(element) {
    new Listener(element, new Recognizer(new Dispatcher(element)))
}