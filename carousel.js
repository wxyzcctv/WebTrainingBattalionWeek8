import { Component, STATE, ATTRIBUTE } from "./framewok.js";
import { enableGesture } from "./gesture/gesture.js";
import { Timeline, Animation } from './animation.js';
import { ease } from './ease.js';

export { STATE, ATTRIBUTE } from './framewok.js'

export class Carousel extends Component {
    constructor() {
        super();
    }
    render() {
        this.root = document.createElement("div");
        this.root.classList.add("Carousel");
        for (let recode of this[ATTRIBUTE].src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url(${recode.img})`;
            this.root.appendChild(child)
        }
        enableGesture(this.root);
        let timeline = new Timeline();
        timeline.start();

        let children = this.root.children;

        let handler = null;

        this[STATE].position = 0;

        let t = 0;
        let ax = 0;

        this.root.addEventListener('start', event => {
            timeline.pause();
            clearInterval(handler);
            if (Date.now() - t < 1500) {
                let progress = (Date.now() - t) / 1500;
                ax = ease(progress) * 520 - 520;
            } else {
                ax = 0;
            }
        })

        this.root.addEventListener('tap', event => {
            console.log(this[ATTRIBUTE].src[this[STATE].position])
            this.triggerEvent('click', {
                data: this[ATTRIBUTE].src[this[STATE].position],
                position: this[STATE].position
            })
        })

        this.root.addEventListener('pan', event => {
            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 520) / 520);

            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                children[pos].style.transition = 'none';
                children[pos].style.transform = `translateX(${- pos * 520 + offset * 520 + x % 520}px)`;
            }
        })

        this.root.addEventListener('end', event => {
            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000)

            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 520) / 520);

            let direction = Math.round((x % 520) / 520);

            if (event.isFlick) {
                if (event.velocity < 0) {
                    direction = Math.ceil((x % 520) / 520);
                } else {
                    direction = Math.floor((x % 520) / 520);
                }
            }

            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;

                children[pos].style.transition = 'none';
                timeline.add(new Animation(children[pos].style, "transform",
                    - pos * 520 + offset * 520 + x % 520,
                    - pos * 520 + offset * 520 + direction * 520,
                    1500, 0, ease, v => `translateX(${v}px)`))
            }

            this[STATE].position = this[STATE].position - ((x - x % 520) / 520) - direction;
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
            this.triggerEvent('change', { position: this[STATE].position })

        })

        let nextPicture = () => {
            let children = this.root.children;
            let nextIndex = (this[STATE].position + 1) % children.length;//此时current会在1~children.length 之间不断循环

            let current = children[this[STATE].position];
            let next = children[nextIndex];

            t = Date.now();

            timeline.add(new Animation(current.style, "transform", - this[STATE].position * 520, - 520 - this[STATE].position * 520, 1500, 0, ease, v => `translateX(${v}px)`))
            timeline.add(new Animation(next.style, "transform", 520 - nextIndex * 520, - nextIndex * 520, 1500, 0, ease, v => `translateX(${v}px)`))

            this[STATE].position = nextIndex;
            this.triggerEvent('change', { position: this[STATE].position })
            // 16毫秒正好是浏览器刷新一帧的时间
        }

        handler = setInterval(nextPicture, 3000);

        /*
        this.root.addEventListener('mousedown', event => {
            let children = this.root.children;
            let startX = event.clientX;

            let move = event => {
                let x = event.clientX - startX;

                let current = position - ((x - x % 520) / 520);

                for (const offset of [-1, 0, 1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${- pos * 520 + offset * 520 + x % 520}px)`;
                }
            }

            let up = event => {
                let x = event.clientX - startX;
                position = position - Math.round(x / 520);

                for (const offset of [0, - Math.sign(Math.round(x / 520) - x + 260 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = '';
                    children[pos].style.transform = `translateX(${- pos * 520 + offset * 520}px)`;
                }
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }
            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
            // 在document上监听move和up主要是为了能解决鼠标移出指定区域之后无法监听move和up的bug
        })
        */

        /*
        let currentIndex = 0;
        setInterval(() => {
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length;//此时current会在1~children.length 之间不断循环

            let current = children[currentIndex];
            let next = children[nextIndex];

            next.style.transition = "none";
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

            setTimeout(() => {
                next.style.transition = "";
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${-nextIndex * 100}%)`;
                currentIndex = nextIndex;
            }, 16)
            // 16毫秒正好是浏览器刷新一帧的时间
        }, 3000)
        */
        return this.root;
    }
}