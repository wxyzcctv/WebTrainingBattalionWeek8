import { Component, createElement } from "./framewok.js"
import { Carousel } from './carousel.js'
import { Timeline, Animation } from './animation.js'

let d = [
    "./static/dog1.jpg",
    "./static/dog2.jpg",
    "./static/dog3.jpg",
    "./static/dog4.jpg",
    "./static/dog5.jpg",
]

let a = <Carousel src={d}></Carousel>

a.mountTo(document.body)

let tl = new Timeline();
tl.add(new Animation({ set a(v) { console.log(v) } }, "a", 0, 100, 1000, null))
tl.start()