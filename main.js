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
        for (let recode of this.attribute.src) {
            let child = document.createElement("img");
            child.src = recode;
            this.root.appendChild(child)
        }
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