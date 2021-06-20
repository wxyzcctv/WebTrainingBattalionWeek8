let element = document.documentElement;

element.addEventListener('mousedown', event => {
    start(event);
    let mousemove = event => {
        move(event);
    }
    let mouseup = event => {
        end(event);
        element.removeEventListener('mousemove', mousemove)
        element.removeEventListener('mouseup', mouseup)
    }
    element.addEventListener("mousemove", mousemove)
    element.addEventListener("mouseup", mouseup)
})

element.addEventListener("touchstart", event => {
    for (const toch of event.changedTouches) {
        start(toch)
    }
})

element.addEventListener("touchmove", event => {
    for (const toch of event.changedTouches) {
        move(toch)
    }
})

element.addEventListener("touchend", event => {
    for (const toch of event.changedTouches) {
        end(toch)
    }
})
element.addEventListener("touchcancel", event => {
    for (const toch of event.changedTouches) {
        cancel(toch)
    }
})

let start = (point) => {
    console.log("start", point.clientX, point.clientY);
}
let move = (point) => {
    console.log("move", point.clientX, point.clientY);
}
let end = (point) => {
    console.log("end", point.clientX, point.clientY);
}
let cancel = (point) => {
    console.log("cancel", point.clientX, point.clientY);
}