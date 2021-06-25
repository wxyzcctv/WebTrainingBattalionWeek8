import { Component } from "./framewok.js";
import { enableGesture } from "./gesture/gesture.js";
import { Timeline, Animation } from './animation.js';
import { ease } from './ease.js';
export class Carousel extends Component {
    constructor() {
        super();
        this.attribute = Object.create(null);
    }
    setAttribute(name, value) {
        this.attribute[name] = value;
    }
    rander() {
        this.root = document.createElement("div");
        this.root.classList.add("Carousel");
        for (let recode of this.attribute.src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url(${recode})`;
            this.root.appendChild(child)
        }
        enableGesture(this.root);
        let timeline = new Timeline();
        timeline.start();

        let children = this.root.children;

        let position = 0;

        this.root.addEventListener('pan', event => {
            let x = event.clientX - event.startX
            let current = position - ((x - x % 520) / 520);

            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                children[pos].style.transition = 'none';
                children[pos].style.transform = `translateX(${- pos * 520 + offset * 520 + x % 520}px)`;
            }
        })

        this.root.addEventListener('panend', event => {
            let x = event.clientX - event.startX;
            position = position - Math.round(x / 520);

            for (const offset of [0, - Math.sign(Math.round(x / 520) - x + 260 * Math.sign(x))]) {
                let pos = position + offset;
                pos = (pos + children.length) % children.length;
                children[pos].style.transition = '';
                children[pos].style.transform = `translateX(${- pos * 520 + offset * 520}px)`;
            }
        })

        setInterval(() => {
            let children = this.root.children;
            let nextIndex = (position + 1) % children.length;//此时current会在1~children.length 之间不断循环

            let current = children[position];
            let next = children[nextIndex];

            next.style.transition = "none";
            next.style.transform = `translateX(${520 - nextIndex * 520}px)`;

            timeline.add(new Animation(current.style, "transform", - position * 520, - 520 - position * 520, 500, 0, ease, v => `translateX(${v}px)`))
            timeline.add(new Animation(next.style, "transform", 520 - nextIndex * 520, - nextIndex * 520, 500, 0, ease, v => `translateX(${v}px)`))

            position = nextIndex;
            // 16毫秒正好是浏览器刷新一帧的时间
        }, 3000)

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
    mountTo(parent) {
        parent.appendChild(this.rander())
    }
}