$(document).ready(function () {
    faqHelper($(".faqSection"));
});

function faqHelper(element) {
    element.find(".faqWrapper:lt(4)").removeClass("hide");
    element.find(".answer:lt(1)").removeClass("hide");
    element.find(".upDownArrow:lt(1)").addClass("rotateFaqArrow");
    element.find('.viewMoreWrapper').on('click', function () {
        $(this).addClass("hide");
        element.find(".faqWrapper").removeClass("hide");
    });
    element.find('.question').on('click', function () {
        if ($(this).next(".answer").is(':visible')) {
            $(this).find(".upDownArrow").removeClass("rotateFaqArrow");
            $(this).next(".answer").removeClass("show").removeClass("margin-bottom20").addClass("hide");
        }
        else {
            $(this).find(".upDownArrow").addClass("rotateFaqArrow");
            $(this).next(".answer").removeClass("hide").addClass("show");
        }
    });
}
function bindFaqs(searchUrl) {
    var responseOBJ = {
        faqs: {}
    };
    $.when(
        $.ajax({
            context: this,
            type: "GET",
            headers: { sourceId: "302" },
            url: "/buy-used-cars/api/used/faqs/?" + searchUrl,
            contentType: "application/html;charset=utf-8",
            dataType: "html",
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (response) {
                responseOBJ.faqs = response;
            },
        })
    ).then(function () {
        json = responseOBJ.faqs;
        $(".outer-faqwrapper").empty();
        if (!json) {
            return;
        }
        else {
            var response = $.parseJSON(json);
            var numberFaqs = response.length;
            $('.faqSection').addClass("hide");
            var faqHtmlBinding = [];
            for (var i = 0; i < numberFaqs; i++) {
                faqHtmlBinding
                    .push('<div class="hide faqWrapper">' +
                        '<div class="carDescWrapper question">' +
                        '<p class="questionText">' + response[i].question +
                        '</p>' +
                        '<span class="questionArrow"><svg class="rotateFaqArrow90 upDownArrow" width="17px" height="17px" viewBox="0 0 16 16" fill="#56586a" tabindex="-1" focusable="false" ' +
                        'aria-hidden="true" role="img"><path d="M4.59 15.8a1 1 0 01-.69-.29 1 1 0 010-1.37L10 8 3.9 1.86a1 1 0 010-1.37 1 1 0 011.38 0l6.82 6.82a1 1 0 010 1.38l-6.82 6.82a1 1 0 01-.69.29z">' +
                        '</path></svg></span>' +
                        '</div>' +
                        '<div class="answer hide">' +
                        '<p class="answerText">' + response[i].answer + '</p>' +
                        '</div>' +
                        '</div>'
                    );
                if (numberFaqs > 4 && i === 3) {
                    faqHtmlBinding.push(
                        "<div class=\"viewMoreWrapper\">" +
                        "<span class=\"viewMore\" data-testing-id=\"view-all-questions-button\">" + "<span>" +
                        "View More FAQ" + "</span>"
                        + "</span>" +
                        "</div>");
                }
            }
            $(".outer-faqwrapper").append(faqHtmlBinding.join(""));
            faqHelper($(".faqSection"));
            var viewmorecomponent = $(".faqSection").find(".viewMore");
            var showMoreFaqsHidden = viewmorecomponent.hasClass("hide");
            $(".faqSection").removeClass("hide");
            if (numberFaqs > 4) {
                if (showMoreFaqsHidden) {
                    $(".faqSection").find(".viewMore").removeClass("hide");
                }
            }
            else {
                if (!showMoreFaqsHidden) {
                    $(".faqSection").find(".viewMore").addClass("hide");
                }
            }
        }
    });
}