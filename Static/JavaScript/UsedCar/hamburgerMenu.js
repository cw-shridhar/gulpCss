$(document).ready(function () {
  $(".js-hamburger-icon").click(function (event) {
    var displayValue = $(".js-side-nav-overlay").css("display");
    if (displayValue == "none") {
      $(".side-nav-container").toggleClass("side-nav-container-active");
      $(".js-side-nav-overlay").toggle();
      $("body").css("overflow", "hidden");
    }
  });

  $(".js-side-nav-overlay").click(function (event) {
    var displayValue = $(".js-side-nav-overlay").css("display");
    if (displayValue == "block") {
      $(".js-side-nav-overlay").toggle();
      $(".side-nav-container").toggleClass("side-nav-container-active");
      $("body").css("overflow", "");
    }
  });
});
