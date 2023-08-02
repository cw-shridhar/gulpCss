$(document).ready(function() {
    $(".js-inspection-report-tooltip").click(function(event) {
        event.preventDefault();
        var halfbodyheight = window.innerHeight/2;
        var tooltip = $(this).find(".js-inspection-tool-tip-wrapper");
        var tooltipBlock = $(this).find(".inspection-tool-tip-block");
        var tooltipYCoordinate = $(".js-inspection-report-tooltip")[0].getBoundingClientRect().y;
        if(tooltipYCoordinate <= halfbodyheight){
            tooltip.addClass("bottom-inspection-tool-tip-wrapper");
            tooltip.removeClass("top-inspection-tool-tip-wrapper");
        } else {
            tooltip.addClass("top-inspection-tool-tip-wrapper");
            tooltip.removeClass("bottom-inspection-tool-tip-wrapper");
        }
        tooltipBlock.addClass("tooltip--visible");
        tooltipBlock.show();
    });
    $(document).click((e) => {
        if(!$(e.target).hasClass("js-inspection-report-tooltip") && $(this).find(".inspection-tool-tip-block").hasClass("tooltip--visible")){
            $(this).find(".inspection-tool-tip-block").removeClass("tooltip--visible");
            $(this).find(".inspection-tool-tip-block").hide();
        }
    })
});
