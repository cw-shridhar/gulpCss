$(document).ready(function () {
    $(".des_read_more_quickfacts").click(function () {
        if ($(".des_read_more_quickfacts").text() == "Read More") {
            $("#read_more_des_quickfacts").removeClass("min_cls_quickfacts");
            $("#read_more_des_quickfacts").addClass("max_cls_quickfacts");
            $(".des_read_more_quickfacts").text("Read Less");
            $(".des_read_more_quickfacts").removeClass("min_read_quickfacts");
            $(".des_read_more_quickfacts").addClass("max_read_quickfacts");

        } else {
            $("#read_more_des_quickfacts").removeClass("max_cls_quickfacts");
            $("#read_more_des_quickfacts").addClass("min_cls_quickfacts");
            $(".des_read_more_quickfacts").text("Read More");
            $(".des_read_more_quickfacts").removeClass("max_read_quickfacts");
            $(".des_read_more_quickfacts").addClass("min_read_quickfacts");
        }
    });
});