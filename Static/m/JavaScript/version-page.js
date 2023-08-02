$(document).ready(function () {
    //fire impression tracking events
    const lead = "-Version_NewCarLead";
    let category = (isMobile ? "Mobile" : "Desktop") + lead;
    if(window.isAndroidWebView === "True") {
        category = "Android" + lead;
    } else if (window.isIosWebView === "True") {
        category = "Ios" + lead;
    }
    leadFormTracking.fireCampaignCallEvent(true, category, "NewCarLeadCampaignCalled_on_PageLoad", leadFormPopup.getEventLabel(true, campaignTargetType, makeName, modelName));
    leadFormTracking.fireCampaignReturnEvent(true, category, makeName, modelName, campaignTargetType);
});
