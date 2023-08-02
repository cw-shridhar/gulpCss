$('.readMore').click(function () {
    show_more_expert_reviews();
    if ($('#expert_review_block2').length != 0) {

        $(window).on('scroll', function () {
            if ($(this).scrollTop() <= $('#expert_review_block2').position().top) {
                $(".btnClose").removeClass("closeSticky");
            } else if ($(window).scrollTop() >= $('#expert_review_block2').offset().top + $('#expert_review_block2').outerHeight() - window.innerHeight) {
                $(".btnClose").removeClass("closeSticky");
            } else {
                $(".btnClose").addClass("closeSticky");
            }
        });
    }

});
$('.btnClose').click(function () {
    hide_more_expert_reviews();
    if ($('#expert_review_block1').length != 0) {

        setTimeout(function () {
            var pos_div = $("#expert_review_block1").offset().top;
            $("html, body").animate({
                scrollTop: (pos_div - 40) + "px"
            }, 500);

        }, 100);
        $(".btnClose").removeClass("closeSticky");
    }
});
function initial_jquery_readmore_expertrev() {
    if (typeof jQuery != 'undefined' && (document.readyState == "interactive" || document.readyState == 'complete')) {
        var searchParam = new URLSearchParams(location.search);
        $(document).ready(function () {
            var amp_redirect = 'expert';
            if (searchParam.get("q") == "expert")
                show_more_expert_reviews();
            if ($('#expert_review_block2').length != 0) {

                $(window).on('scroll', function () {
                    if ($(this).scrollTop() <= $('#expert_review_block2').position().top) {
                        $(".btnClose").removeClass("closeSticky");
                    } else if ($(window).scrollTop() >= $('#expert_review_block2').offset().top + $('#expert_review_block2').outerHeight() - window.innerHeight) {
                        $(".btnClose").removeClass("closeSticky");
                    } else {
                        $(".btnClose").addClass("closeSticky");
                    }
                });
            }
        });
    } else {
        setTimeout("initial_jquery_readmore_expertrev()", 1000);
    }
}
setTimeout("initial_jquery_readmore_expertrev()", 1000);
function show_more_expert_reviews() {
    $("#expert_review_block1").hide();
    $("#expert_review_block2").show();
}
function hide_more_expert_reviews() {
    $("#expert_review_block2").hide();
    $("#expert_review_block1").show();
}