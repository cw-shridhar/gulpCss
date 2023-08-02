$(document).ready(function () {
    $(".des_read_more").click(function () {
        if ($(".des_read_more").text() == "Read More") {
            $("#read_more_des").removeClass("min_cls_desktop");
            $("#read_more_des").addClass("max_cls_desktop");
            $(".des_read_more").text("Read Less");

        } else {
            $("#read_more_des").removeClass("max_cls_desktop");
            $("#read_more_des").addClass("min_cls_desktop");
            $(".des_read_more").text("Read More");
        }
    });
});