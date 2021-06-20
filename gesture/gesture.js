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

let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;

let start = (point) => {
    // console.log("start", point.clientX, point.clientY);
    startX = point.clientX, startY = point.clientY;

    isTap = true;
    isPan = false;
    isPress = false;

    handler = setTimeout(() => {
        isTap = false;
        isPan = false;
        isPress = true;
        handler = null;
        console.log('press');
    }, 500);
}
let move = (point) => {
    let dx = point.clientX, dy = point.clientY;
    if (!isPan && dx ** 2 + dy ** 2 > 100) {
        isTap = false;
        isPan = true;
        isPress = false;
        console.log('panstart');
        clearTimeout(handler)
    }
    if (isPan) {
        console.log(dx, dy);
        console.log('pan');
    }
    // console.log("move", point.clientX, point.clientY);
}
let end = (point) => {
    if (isTap) {
        console.log('tap');
        clearTimeout(handler);
    }
    if (isPan) {
        console.log('panend');
    }
    if (isPress) {
        console.log("pressend");
    }
    // console.log("end", point.clientX, point.clientY);
}
let cancel = (point) => {
    clearTimeout(handler);
    console.log("cancel", point.clientX, point.clientY);
}