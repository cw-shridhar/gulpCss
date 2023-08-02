const dragToScroll = (function () {
    let mouseDown = false;
    let startX, scrollLeft;

    startDragging = () => {
        mouseDown = true;
        startX = event.pageX - event.currentTarget.offsetLeft;
        scrollLeft = event.currentTarget.scrollLeft;
    };

    stopDragging = () => {
        mouseDown = false;
    };

    mouseMoveHandler = () => {
        event.preventDefault();
        if(!mouseDown) {
            return;
        }
        const x = event.pageX - event.currentTarget.offsetLeft;
        const scroll = x - startX;
        event.currentTarget.scrollLeft = scrollLeft - scroll;
    };

    return {
        mouseMoveHandler,
        startDragging,
        stopDragging
    }
})();
