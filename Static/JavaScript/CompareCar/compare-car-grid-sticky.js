const stickyCarGrid = document.querySelector(".car-stick-top");

function compareCarTopSticky() {
    try {
        var distance = $('.js-comparison-content-starts').position().top - 5;
        $(window).scroll(function () {
            var scrollDistance = $(window).scrollTop();
            if (scrollDistance >= distance) {
                if (scrollDistance >= $(".js-comparison-content-ends").position().top) {
                    stickyCarGrid.classList.add("height-0");
                }
                else {
                    stickyCarGrid.classList.remove("height-0");
                }
            } else if ($(window).scrollTop() < distance) {
                stickyCarGrid.classList.add("height-0");
            }
        });
    } catch (e) {
        console.log(e);
    }
}

document.addEventListener("DOMContentLoaded", compareCarTopSticky);
