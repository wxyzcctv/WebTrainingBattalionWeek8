const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMARION = Symbol('ANIMARION');

export class Timeline {
    constructor() {

        this[ANIMARION] = new Set()
    }

    start() {
        let startTime = Date.now();
        this[TICK] = () => {
            let t = Date.now() - startTime
            for (const animation of this[ANIMARION]) {
                let t0 = t;
                if (animation.duration < t) {
                    this[ANIMARION].delete(animation)
                    t0 = animation.duration
                }
                animation.receive(t0);
            }
            requestAnimationFrame(this[TICK])
        }
        this[TICK]()
    }

    pause() { }
    resume() { }

    restart() { }

    add(animation) {
        this[ANIMARION].add(animation)
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, timingFunction) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }
    receive(time) {
        let range = this.endValue - this.startValue;
        this.object[this.property] = this.startValue + range * time / this.duration
    }
}