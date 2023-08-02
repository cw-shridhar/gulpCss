$(document).ready(function () {
    const lead = "-PIC_NewCarLead";
    let category = (isMobile ? "Mobile" : "Desktop") + lead;
    if(window.isAndroidWebView === "True") {
        category = "Android" + lead;
    } else if (window.isIosWebView === "True") {
        category = "Ios" + lead;
    }
    //fire impression tracking events
    leadFormTracking.fireCampaignCallEvent(true, category, "NewCarLeadCampaignCalled_on_PageLoad", leadFormPopup.getEventLabel(true, campaignTargetType, makeName, modelName));
    leadFormTracking.fireCampaignReturnEvent(true, category, makeName, modelName, campaignTargetType);
});
