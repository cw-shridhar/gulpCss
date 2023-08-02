var slider2Dom = document.getElementById("slider2")
var slider2 = new Slider(slider2Dom, ".z-slide-item", {
        interval: 6,
        minPercentToSlide: .2
    });
slider2Dom.addEventListener("tap", function () {
    var e = document.querySelector("ul.event-list li:nth-child(1) span");
    //e.textContent = "yes, time:" + Date.now()
}), slider2Dom.addEventListener("sort", function () {
    var e = document.querySelector("ul.event-list li:nth-child(2) span");
    //e.textContent = "yes, time:" + Date.now()
}), slider2Dom.addEventListener("slideend", function () {
    var e = document.querySelector("ul.event-list li:nth-child(3) span");
    //e.textContent = "yes, time:" + Date.now()
}), slider2Dom.addEventListener("sortend", function () {
    var e = document.querySelector("ul.event-list li:nth-child(4) span");
    //e.textContent = "yes, time:" + Date.now()
}), slider2Dom.addEventListener("swipestart", function () {
    var e = document.querySelector("ul.event-list li:nth-child(5) span");
    //e.textContent = "yes, time:" + Date.now()
}), slider2Dom.addEventListener("swipe", function () {
    var e = document.querySelector("ul.event-list li:nth-child(6) span");
    //e.textContent = "yes, time:" + Date.now()
}), slider2Dom.addEventListener("swipeend", function () {
    var e = document.querySelector("ul.event-list li:nth-child(7) span");
    //e.textContent = "yes, time:" + Date.now()
});