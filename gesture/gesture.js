let element = document.documentElement;

let isListeningMouse = false;

element.addEventListener('mousedown', event => {
    // mousedown事件中event.butten表示鼠标按下按键的数字
    // 1 << event.button和button << 1移位操作能等到数字对应的2的倍数
    let context = Object.create(null);
    contexts.set('mouse' + (1 << event.button), context)
    start(event, context);

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
                move(event, context);
            }
            button = button << 1
        }
    }
    let mouseup = event => {
        let context = contexts.get('mouse' + (1 << event.button));
        end(event, context);
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

let contexts = new Map();

element.addEventListener("touchstart", event => {
    for (const toch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(toch.identifier, context)
        start(toch, context)
    }
})

element.addEventListener("touchmove", event => {
    for (const toch of event.changedTouches) {
        let context = contexts.get(toch.identifier)
        move(toch, context)
    }
})

element.addEventListener("touchend", event => {
    for (const toch of event.changedTouches) {
        let context = contexts.get(toch.identifier)
        end(toch, context)
        contexts.delete(toch.identifier)
    }
})
element.addEventListener("touchcancel", event => {
    for (const toch of event.changedTouches) {
        let context = contexts.get(toch.identifier)
        cancel(toch, context);
        contexts.delete(toch.identifier);
    }
})

let start = (point, context) => {
    // console.log("start", point.clientX, point.clientY);
    context.startX = point.clientX, context.startY = point.clientY;

    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    context.handler = setTimeout(() => {
        context.isTap = false;
        context.isPan = false;
        context.isPress = true;
        context.handler = null;
        console.log('press');
    }, 500);
}
let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
        context.isTap = false;
        context.isPan = true;
        context.isPress = false;
        console.log('panstart');
        clearTimeout(context.handler)
    }
    if (context.isPan) {
        console.log(dx, dy);
        console.log('pan');
    }
    // console.log("move", point.clientX, point.clientY);
}
let end = (point, context) => {
    if (context.isTap) {
        dispatch('tap', {})
        clearTimeout(context.handler);
    }
    if (context.isPan) {
        console.log('panend');
    }
    if (context.isPress) {
        console.log("pressend");
    }
    // console.log("end", point.clientX, point.clientY);
}
let cancel = (point, context) => {
    clearTimeout(context.handler);
    console.log("cancel", point.clientX, point.clientY);
}

function dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
        event[name] = properties[name]
    }
    element.dispatchEvent(event)
}