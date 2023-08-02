function debounce(callback, delay = 1000) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            callback.apply(context, args)
        }, delay);
    }
}
