$(document).ready(function () {
    const lead = "-Compare_NewCarLead";
    let category = (isMobileDevice ? "Mobile" : "Desktop") + lead;
    if(window.isAndroidWebView === "True") {
        category = "Android" + lead;
    } else if (window.isIosWebView === "True") {
        category = "Ios" + lead;
    }
    //fire impression tracking events
    document.querySelectorAll('.js-cmp_model_card')
        .forEach(e => {
            let makeName = e.getAttribute("data-make");
            let modelName = e.getAttribute("data-model");
            let targetType = parseInt(e.getAttribute("data-targetType"));
            //fire impression tracking events
            leadFormTracking.fireCampaignCallEvent(true, category, "NewCarLeadCampaignCalled_on_PageLoad", leadFormPopup.getEventLabel(true, targetType, makeName, modelName));
            leadFormTracking.fireCampaignReturnEvent(true, category, makeName, modelName, targetType);
        });
});
