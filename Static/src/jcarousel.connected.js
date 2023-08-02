(function ($) {
  // This is the connector function.
  // It connects one item from the navigation carousel to one item from the
  // stage carousel.
  // The default behaviour is, to connect items with the same index from both
  // carousels. This might _not_ work with circular carousels!
  var connector = function (itemNavigation, carouselStage) {
    return carouselStage.jcarousel("items").eq(itemNavigation.index());
  };

  var carouselStage = $(".carousel-stage").jcarousel({
    transitions: {
      transforms: true,
      transforms3d: true,
      easing: "ease",
    },
  });
  var carouselNavigation = $(".carousel-navigation").jcarousel({
    transitions: {
      transforms: true,
      transforms3d: true,
      easing: "ease",
    },
  });
  var pageurl;

  $(function () {
    // Setup the carousels. Adjust the options for both carousels here.
    // We loop through the items of the navigation carousel and set it up
    // as a control for an item from the stage carousel.
    carouselNavigation.jcarousel("items").each(function () {
      var item = $(this);

      // This is where we actually connect to items.
      var target = connector(item, carouselStage);

      item
        .on("jcarouselcontrol:active", function () {
          pageurl = item[0].dataset.pageurl;
          var url = pageurl + item[0].dataset.name;
          var currentUrl = window.location.pathname;
          var pattern = ".*images(\/)?$";
          var matches = String(currentUrl).match(pattern);
          if (matches == null || matches == undefined || item.index() > 0) {
            window.history.replaceState("", "", url);
          }
          carouselNavigation.jcarousel("scrollIntoView", this);
          $("#count-text").text(item.index() + 1);
          item.addClass("active");
        })
        .on("jcarouselcontrol:inactive", function () {
          item.removeClass("active");
        })
        .jcarouselControl({
          target: target,
          carousel: carouselStage,
        });
    });

    // Setup controls for the stage carousel
    $(".prev-stage")
      .on("jcarouselcontrol:inactive", function () {
        $(this).addClass("inactive");
      })
      .on("jcarouselcontrol:active", function () {
        $(this).removeClass("inactive");
      })
      .jcarouselControl({
        target: "-=1",
      });

    $(".next-stage")
      .on("jcarouselcontrol:inactive", function () {
        $(this).addClass("inactive");
      })
      .on("jcarouselcontrol:active", function () {
        $(this).removeClass("inactive");
      })
      .jcarouselControl({
        target: "+=1",
      });

    // Setup controls for the navigation carousel
    $(".prev-navigation")
      .on("jcarouselcontrol:inactive", function () {
        $(this).addClass("inactive");
      })
      .on("jcarouselcontrol:active", function () {
        $(this).removeClass("inactive");
      })
      .jcarouselControl({
        target: "-=1",
      });

    $(".next-navigation")
      .on("jcarouselcontrol:inactive", function () {
        $(this).addClass("inactive");
      })
      .on("jcarouselcontrol:active", function () {
        $(this).removeClass("inactive");
      })
      .jcarouselControl({
        target: "+=1",
      });
  });
  //onload set url
  setTimeout(function () {
    if (onLoadTarget && onLoadTarget != null && onLoadTarget > 0) {
      carouselStage.jcarousel("scroll", "+=" + onLoadTarget);
    } else {
      window.history.replaceState("", "", pageurl);
    }
  }, 0);
})(jQuery);

const carouselWrapper = document.getElementById("carousel-wrapper");
if (carouselWrapper) {
  carouselWrapper.addEventListener("touchstart", handleTouchStart, false);
  carouselWrapper.addEventListener("touchmove", handleTouchMove, false);
}
var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}

function handleTouchStart(evt) {
  var firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* left swipe */
      document.getElementById("next-button").click();
    } else {
      /* right swipe */
      document.getElementById("prev-button").click();
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
    } else {
      /* down swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}
