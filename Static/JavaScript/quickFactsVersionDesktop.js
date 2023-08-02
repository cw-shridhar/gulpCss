$(".des_read_more").click(function () {
    if ($(".des_read_more").text() == "Read More") {
        $("#read_more_des_version_desktop_quickfacts").removeClass("min_cls");
        $("#read_more_des_version_desktop_quickfacts").addClass("max_cls");
        $(".des_read_more").text("Read Less");
        $(".des_read_more").removeClass("min_read");
        $(".des_read_more").addClass("max_read");

    } else {
        $("#read_more_des_version_desktop_quickfacts").removeClass("max_cls");
        $("#read_more_des_version_desktop_quickfacts").addClass("min_cls");
        $(".des_read_more").text("Read More");
        $(".des_read_more").removeClass("max_read");
        $(".des_read_more").addClass("min_read");
    }
});