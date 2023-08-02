function specHelper(element) {
    element.find(".individual-specification-listing:lt(1)").removeClass("hide");
    element.find(".upDownArrow:lt(1)").addClass("rotateArrow");
    element.find('.specification-heading').on('click', function () {
        var specHeading = $(this);
        if (specHeading.next(".individual-specification-listing").is(':visible')) {
            specHeading.find(".upDownArrow").removeClass("rotateArrow");
            specHeading.next(".individual-specification-listing").removeClass("margin-bottom20").addClass("hide");
        }
        else {
            $(".individual-specification-listing").addClass("hide");
            $(".specArrow").find(".upDownArrow").removeClass("rotateArrow");
            specHeading.find(".upDownArrow").addClass("rotateArrow");
            specHeading.next(".individual-specification-listing").removeClass("hide");
        }
    });
}

$(document).ready(function () {
    specHelper($(".specification-list"));
});