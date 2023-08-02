var _target = 3;

$(function () {
    if (typeof videoSlider != "undefined") {
        _target = 1;
    }

    $(".jcarousel:not(.transform)").jcarousel({
        vertical: false
      });
    
      $(".jcarousel.transform").jcarousel({
        vertical: false,
        transitions: {
          transforms:true,
          easing:"ease",
        },
      });

    $(".jcarousel-control-prev")
        .on("jcarouselcontrol:active", function () {
            $(this).removeClass("inactive");
        })
        .on("jcarouselcontrol:inactive", function () {
            $(this).addClass("inactive");
        })
        .jcarouselControl({
            target: "-=" + _target
        });
    $(".jcarousel-control-next")
        .on("jcarouselcontrol:active", function () {
            $(this).removeClass("inactive");
        })
        .on("jcarouselcontrol:inactive", function () {
            $(this).addClass("inactive");
        })
        .jcarouselControl({
            target: "+=" + _target
        });

    var swipeCount = $(".dynamic-carousel").attr("data-swipeCount");

    $(".dynamic-carousel .jcarousel-control-prev")
        .on("jcarouselcontrol:active", function () {
            $(this).removeClass("inactive");
        })
        .on("jcarouselcontrol:inactive", function () {
            $(this).addClass("inactive");
        })
        .jcarouselControl({
            target: "-=" + swipeCount
        });

    $(".dynamic-carousel .jcarousel-control-next")
        .on("jcarouselcontrol:active", function () {
            $(this).removeClass("inactive");
        })
        .on("jcarouselcontrol:inactive", function () {
            $(this).addClass("inactive");
        })
        .jcarouselControl({
            target: "+=" + swipeCount
        });

    $(".jcarousel-pagination")
        .on("jcarouselpagination:active", "a", function () {
            $(this).addClass("active");
        })
        .on("jcarouselpagination:inactive", "a", function () {
            $(this).removeClass("active");
        })
        .on("click", function (e) {
            e.preventDefault();
        })
        .jcarouselPagination({
            item: function (page) {
                return '<a href="#' + page + '">' + page + "</a>";
            }
        });
});