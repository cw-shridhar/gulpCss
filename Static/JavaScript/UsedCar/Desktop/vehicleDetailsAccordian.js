function featureHelper(element) {
  if (!element) {
    return;
  }
  element.find(".feature-details__item-content:lt(1)").removeClass("hide");
  element.find(".upDownArrow:lt(1)").addClass("rotateArrow");
  element
    .find(".feature-details__item-heading:first")
    .addClass("feature-details__item--no-topborder");
  element.find(".feature-details__item-heading").on("click", function () {
    if ($(this).next(".feature-details__item-content").is(":visible")) {
      $(this).find(".upDownArrow").removeClass("rotateArrow");
      $(this)
        .next(".feature-details__item-content")
        .removeClass("margin-bottom20")
        .addClass("hide");
    } else {
      $(".feature-details__item-content").addClass("hide");
      $(".feature-details .upDownArrow").removeClass("rotateArrow");
      $(this).find(".upDownArrow").addClass("rotateArrow");
      $(this).next(".feature-details__item-content").removeClass("hide");
    }
  });
}

$(document).ready(function () {
  featureHelper($(".feature-details__feature-list"));
});
