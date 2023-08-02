const leadFormTracking = (() => {
    function fireCampaignCallEvent(onPageLoad, category, action, label) {
        let eventLabel = (onPageLoad ? label : leadFormPopup.getEventLabel(true, -1, makeName, modelName)) + leadFormPopup.getCityAreaLabelText(currentCityName, currentAreaName, currentCityId);
        analytics.trackAction("CTNonInteractive", category, action, eventLabel);
        ctTracking.trackEvent({
            'category': category,
            'action': action,
            'label': eventLabel
        });
    }

    function fireCampaignReturnEvent(onPageLoad, category, makeName, modelName, campaignTargetType) {
        let action = "NewCarLeadCampaign" + (campaignTargetType >= 0 ? "" : "Not") + "Displayed_on_" + (onPageLoad ? "PageLoad" : "LocationSelection")
        let eventLabel = leadFormPopup.getEventLabel(false, campaignTargetType, makeName, modelName) + leadFormPopup.getCityAreaLabelText(currentCityName, currentAreaName, currentCityId);
        analytics.trackAction("CTNonInteractive", category, action, eventLabel);
        ctTracking.trackEvent({
            'category': category,
            'action': action,
            'label': eventLabel
        });
    }

    function fireOpenLeadFormCtaClickEvent() {
        analytics.trackAction("CTInteractive", category, "CTA_Clicked", label);
        ctTracking.trackEvent({
            'category': category,
            'action': "CTA_Clicked",
            'label': label
        });
    }

    function fireCitySelectionFormDisplayEvent() {
        analytics.trackAction("CTNonInteractive", category, "LocationSelection_LeadForm_Displayed", label);
        ctTracking.trackEvent({
            'category': category,
            'action': "LocationSelection_LeadForm_Displayed",
            'label': label
        });
    }

    function fireCitySelectionFormCloseEvent() {
        analytics.trackAction("CTNonInteractive", category, "LocationSelection_LeadFormClosed", label);
        ctTracking.trackEvent({
            'category': category,
            'action': "LocationSelection_LeadFormClosed",
            'label': label
        });
    }

    function fireLeadFormDisplayEvent() {
        let eventLabel = leadFormPopup.getEventLabel(false, targetType, makeName, modelName, widgetName) + leadFormPopup.getCityAreaLabelText(currentCityName, currentAreaName, currentCityId);
        analytics.trackAction("CTNonInteractive", category, "PrimaryLead_Form_Displayed", eventLabel);
        ctTracking.trackEvent({
            'category': category,
            'action': "PrimaryLead_Form_Displayed",
            'label': eventLabel
        });
    }

    function fireSubmitButtonClickEvent() {
        let eventLabel = leadFormPopup.getEventLabel(false, targetType, makeName, modelName, widgetName) + leadFormPopup.getCityAreaLabelText(currentCityName, currentAreaName, currentCityId);
        analytics.trackAction("CTInteractive", category, "PrimaryLead_Submit_Clicked", eventLabel);
        ctTracking.trackEvent({
            'category': category,
            'action': "PrimaryLead_Submit_Clicked",
            'label': eventLabel
        });
    }

    function fireLeadFormCloseEvent() {
        let label = leadFormPopup.getEventLabel(false, targetType, makeName, modelName, widgetName) + leadFormPopup.getCityAreaLabelText(currentCityName, currentAreaName, currentCityId);
        analytics.trackAction("CTInteractive", category, "PrimaryLead_FormClosed", label);
        ctTracking.trackEvent({
            'category': category,
            'action': "PrimaryLead_FormClosed",
            'label': label
        });
    }

    function fireOnSubmitLeadTrackingEvent() {
        let label = leadFormPopup.getEventLabel(false, targetType, makeName, modelName, widgetName) + leadFormPopup.getCityAreaLabelText(currentCityName, currentAreaName, currentCityId);
        analytics.trackAction("CTInteractive", category, "PrimaryLead_Submitted", label);
        ctTracking.trackEvent({
            'category': category,
            'action': "PrimaryLead_Submitted",
            'label': label
        });
    }

    function fireErrorOnLeadSubmitEvent(error, actionType, label) {
        analytics.trackAction("CTNonInteractive", "Error: " + error, actionType + "_Error_on_Lead_Submit", label);
        ctTracking.trackEvent({
            'category': "Error: " + error,
            'action': actionType + "_Error_on_Lead_Submit",
            'label': label
        });
    }

    function fireSellCarSlugShownEvent() {
        analytics.trackAction(
            "CTNonInteractive",
            "SellCarLinkages",
            "UsedCarSellSlugShown",
            "UsedCarSellSlugShown"
        );
        ctTracking.trackEvent({
            'category': "SellCarLinkages",
            'action': "UsedCarSellSlugShown",
            'label': "UsedCarSellSlugShown"
        });
    }

    function fireLeadConversionEvent() {
        cwTracking.trackAction("CTInteractive", "LeadForm", "submit-lead-event");
        ctTracking.trackEvent({
            'category': "LeadForm",
            'action': "submit-lead-event"
        });
    }

    return {
        fireCampaignCallEvent,
        fireCampaignReturnEvent,
        fireOpenLeadFormCtaClickEvent,
        fireCitySelectionFormDisplayEvent,
        fireCitySelectionFormCloseEvent,
        fireLeadFormDisplayEvent,
        fireSubmitButtonClickEvent,
        fireLeadFormCloseEvent,
        fireOnSubmitLeadTrackingEvent,
        fireErrorOnLeadSubmitEvent,
        fireSellCarSlugShownEvent,
        fireLeadConversionEvent,
    }
})();