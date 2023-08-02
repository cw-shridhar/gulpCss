var urlParams = new URLSearchParams(window.location.search);
var parameter = urlParams.get("q");
$(document).ready(function () {
    GetGlobalSearchCampaigns.bindRecentlyViewModels(makeName, modelName, currentModelId);
    if (parameter === 'city') {
        redirectToPic();
    }
    //fire impression tracking events
    let category = "Desktop-Model_NewCarLead";
    leadFormTracking.fireCampaignCallEvent(true, category, "NewCarLeadCampaignCalled_on_PageLoad", leadFormPopup.getEventLabel(true, campaignTargetType, makeName, modelName));
    leadFormTracking.fireCampaignReturnEvent(true, category, makeName, modelName, campaignTargetType);
});
