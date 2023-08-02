function featureHelper(element) {
    element.find(".individual-feature-listing:lt(1)").removeClass("hide");
    element.find(".upDownArrow:lt(1)").addClass("rotateArrow");
    element.find('.features-heading').on('click', function () {
        if ($(this).next(".individual-feature-listing").is(':visible')) {
            $(this).find(".upDownArrow").removeClass("rotateArrow");
            $(this).next(".individual-feature-listing").removeClass("margin-bottom20").addClass("hide");
        }
        else {
            $(".individual-feature-listing").addClass("hide");
            $(".featureArrow").find(".upDownArrow").removeClass("rotateArrow");
            $(this).find(".upDownArrow").addClass("rotateArrow");
            $(this).next(".individual-feature-listing").removeClass("hide");
        }
    });
}

$(document).ready(function () {
    featureHelper($(".features-list"));
});