import { Component, createElement } from "./framewok.js"
import { Carousel } from './carousel.js'
import { Timeline, Animation } from './animation.js'

let d = [
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog1.jpg",
        url: 'https://time.geekbang.org/'

    },
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog2.jpg",
        url: 'https://time.geekbang.org/'
    },
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog3.jpg",
        url: 'https://time.geekbang.org/'
    },
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog4.jpg",
        url: 'https://time.geekbang.org/'
    },
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog5.jpg",
        url: 'https://time.geekbang.org/'
    }
]

let a = <Carousel src={d}
    onChange={event => console.log(event.detail.position)}
    onClick={event => window.location.href = event.detail.data.url}
></Carousel >

a.mountTo(document.body)

// let tl = new Timeline();
// tl.add(new Animation({ set a(v) { console.log(v) } }, "a", 0, 100, 1000, null))
// tl.start()