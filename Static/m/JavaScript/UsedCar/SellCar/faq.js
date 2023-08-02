/*global $ */
/*eslint no-var: off*/
$(document).ready(function () {
    faqHelper($(".js-faq-section"));
});

function faqHelper(element) {
    element.find(".js-faq-wrapper:lt(4)").removeClass("hide");
    element.find(".js-answer:lt(1)").removeClass("hide");
    element.find(".js-up-down-arrow:lt(1)").attr("class", "js-up-down-arrow rotate-faq-arrow270");
    element.find('.js-view-more-wrapper').on('click', function () {
        $(this).addClass("hide");
        element.find(".js-faq-wrapper").removeClass("hide");
    });
    element.find('.js-question').on('click', function () {
        if ($(this).next(".js-answer").is(':visible')) {
            $(this).find(".js-up-down-arrow").attr("class", "js-up-down-arrow rotate-faq-arrow90");
            $(this).next(".js-answer").removeClass("show").addClass("hide");
        }
        else {
            $(this).find(".js-up-down-arrow").attr("class", "js-up-down-arrow rotate-faq-arrow270");
            $(this).next(".js-answer").removeClass("hide").addClass("show");
        }
    });
}
