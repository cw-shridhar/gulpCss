function viewhide() {
    if ($(".view_m_brnd").html() == "Show Less") {
        $(".mre_brnds ul").slideToggle(100);
        setTimeout(function () {
            var pos_div = $(".car_brnds").offset().top;
            $("html, body").animate({
                scrollTop: (pos_div - 40) + "px"
            }, 500);
            $(".view_m_brnd").html("Show All");
        }, 100);
    } else {
        $(".mre_brnds ul").slideToggle(400);
        setTimeout(function () {
            $(".view_m_brnd").html("Show Less");
        }, 100);
    }
}
