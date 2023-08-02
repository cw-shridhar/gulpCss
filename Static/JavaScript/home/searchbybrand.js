function viewMore() {
    var text = $(".view_m_brnd").html() == "View Less" ? "View All" : "View Less";

    $(".mre_brnds_dis").slideToggle(600);
    setTimeout(function () {
        $(".view_m_brnd").html(text);
    }, 100);
}
