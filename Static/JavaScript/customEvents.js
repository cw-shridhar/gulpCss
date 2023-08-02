// Events [publish,subscribe] pattern
var events = {
    eventsList: {},
    subscribe: function (eventName, eventHandler) {
        this.eventsList[eventName] = typeof this.eventsList[eventName] === 'undefined' ? [] : this.eventsList[eventName];
        this.eventsList[eventName].push(eventHandler);
    },
    unsubscribe: function (eventName, eventHandler) {
        for (var i = 0; i < this.eventsList[eventName].length; i++) {
            if (this.eventsList[eventName][i] === eventHandler) {
                this.eventsList[eventName].splice(i, 1);
                break;
            }
        }
    },
    publish: function (eventName, data) {
        if (this.eventsList[eventName]) {
            this.eventsList[eventName].forEach(function (eventHandler) {  /// use map instead of foreach
                eventHandler(data);
            });
        }
    }
}