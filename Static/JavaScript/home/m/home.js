function show_pop_new_used(type) {
    $("#idbybody").css("overflow", "hidden");
    $(".sortPopup").show();
    $(".refine_sort_bg").show();
    if (type == "newcar") {
        $(".shd").addClass("current");
        $(".contentBlock").hide();
        $("#nw_tab").show();
    }
}

function hide_pop_new_used() {
    $("#idbybody").css("overflow", "visible");
    $(".sortPopup").hide();
    $(".refine_sort_bg").hide();
}