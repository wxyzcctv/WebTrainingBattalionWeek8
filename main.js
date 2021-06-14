import { Component, createElement } from "./framewok.js"

class Carousel extends Component {
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
        return this.root;
    }
    mountTo(parent) {
        parent.appendChild(this.rander())
    }
}

let d = [
    "./static/dog1.jpg",
    "./static/dog2.jpg",
    "./static/dog3.jpg",
    "./static/dog4.jpg",
    "./static/dog5.jpg",
]

let a = <Carousel src={d}></Carousel>

a.mountTo(document.body)