import { createElement } from "./framewok.js"
import { Carousel } from './Carousel.js'
import { Button } from './Button.js'
import { List } from './List.js'

let d = [
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog1.jpg",
        url: 'https://time.geekbang.org/',
        title: "标题1"

    },
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog2.jpg",
        url: 'https://time.geekbang.org/',
        title: "标题2"
    },
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog3.jpg",
        url: 'https://time.geekbang.org/',
        title: "标题3"
    },
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog4.jpg",
        url: 'https://time.geekbang.org/',
        title: "标题4"
    },
    {
        img: "https://raw.githubusercontent.com/wxyzcctv/WebTrainingBattalionWeek8/main/static/dog5.jpg",
        url: 'https://time.geekbang.org/',
        title: "标题5"
    }
]
/*
let a = <Carousel src={d}
    onChange={event => console.log(event.detail.position)}
    onClick={event => window.location.href = event.detail.data.url}
></Carousel >

*/
let a = <List data={d}>
    {(record) =>
        <div>
            <img src={record.img} />
            <a href={record.url}>{record.title}</a>
        </div>
    }
</List>

a.mountTo(document.body);