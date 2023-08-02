var sellCarTracking = (function () {
    var GATrackingCategoryMsite = "Sell Car - Mobile";
    var sellCarCategory = "UsedCarSell";
    var GATrackingCategoryDesktop = "DesktopSell";

    var trackingActions = {
        pageLoad: "Page Load",
        cityPinDone: "City PIN Done",
        maxLimitReached: "MaxLimitReached",
        citySelectionDone: "CitySelectionDone",
        contactDetailsDone: "Contact Details Done",
        mfgMonthAndYearDone: "MFG month and  year done",
        makeModelVariantandFuelDone: "Car Selection done",
        colorSelectionDone: "Color Selection done",
        ownerSelectionDone: "Owner Selection done",
        kmsAdded: "KMs Added",
        recommendedPriceShown: "RecommendedPriceShown",
        recommendedPriceSelected: "RecommendedPriceSelected",
        expectedPriceFilled: "Expected Price Filled",
        otpShown: "OtpShown",
        otpNumberChanged: "OtpNumberChanged",
        otpVerified: "OTP verified",
        listingLive: "Listing Live",
        regNumberError: "RegistrationNumberError",
        imageUploaded: "Image Uploaded",
        accidentalQuestion: "AccidentalQuestion",
        partsReplacedQuestion: "PartsReplacedQuestion",
        insuranceClaimedQuestion: "InsuranceClaimedQuestion",
        serviceQuestion: "ServiceQuestion",
        loanQuestion: "LoanQuestion",
        tyreConditionQuestion: "TyreConditionQuestion",
        wearTearQuestion: "WearTearQuestion",
        mechanicalIssueQuestion: "MechanicalIssueQuestion",
        congratsPageShown: "CongratsPageShown",
        voucherShown: "VoucherShown",
        voucherClicked: "VoucherClicked",
        viewAdClicked: "ViewAdClicked",
        priceLimitHit: "PriceLimitHit",
        userNavigateAway: "UserNavigateAway",
        topNavigationClicked:"TopNavigationClicked",
        //desktop extra tracking action
        mfgYearDone: "MfgYearDone",
        mfgMonthDone: "MfgMonthDone",
        makeSelectionDone: "MakeSelectionDone",
        modelSelectionDone: "ModelSelectionDone",
        versionSelectionDone: "VersionSelectionDone",
        alternateFuelSelectionDone: "AlternateFuelSelectionDone",
        freeEvaluationShown: "FreeEvaluationShown",
        versionScreenWithFuelSelection: "MakeModelVariantandFuelSeenNew"
    }


    function forMobile(action, label) {
        switch (action.toLowerCase()) {
            case "pageload":
                Common.utils.trackAction("NonInteractive", GATrackingCategoryMsite, trackingActions.pageLoad, "No Referrer");
                break;
            case "maxlimitreached":
                Common.utils.trackAction("NonInteractive", GATrackingCategoryMsite, trackingActions.maxLimitReached, label);
                break;
            case "pin":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.cityPinDone, label);
                break;
            case "contact":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.contactDetailsDone, label);
                break;
            case "mfgyear":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.mfgMonthAndYearDone, label);
                break;
            case "mmv":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.makeModelVariantandFuelDone, label);
                break;
            case "color":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.colorSelectionDone, label);
                break;
            case "owner":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.ownerSelectionDone, label);
                break;
            case "kms":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.kmsAdded, label);
                break;
            case "recompriceshown":
                Common.utils.trackAction("NonInteractive", GATrackingCategoryMsite, trackingActions.recommendedPriceShown, label);
                break;
            case "recompriceselect":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.recommendedPriceSelected, label);
                break;
            case "expectprice":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.expectedPriceFilled, label);
                break;
            case "otpshown":
                Common.utils.trackAction("NonInteractive", GATrackingCategoryMsite, trackingActions.otpShown, label);
                break;
            case "otpnumberchanged":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.otpNumberChanged, label);
                break;
            case "otpverified":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.otpVerified, label);
                break;
            case "live":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.listingLive, label);
                break;
            case "regnumbererror":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.regNumberError, label);
                break;
            case "images":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.imageUploaded, label);
                break;
            case "accidentalquestion":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.accidentalQuestion, label);
                break;
            case "partsreplacedquestion":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.partsReplacedQuestion, label);
                break;
            case "insuranceclaimedquestion":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.insuranceClaimedQuestion, label);
                break;
            case "servicequestion":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.serviceQuestion, label);
                break;
            case "loanquestion":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.loanQuestion, label);
                break;
            case "tyreconditionquestion":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.tyreConditionQuestion, label);
                break;
            case "weartearquestion":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.wearTearQuestion, label);
                break;
            case "mechanicalissuequestion":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.mechanicalIssueQuestion, label);
                break;
            case "congrats":
                Common.utils.trackAction("NonInteractive", GATrackingCategoryMsite, trackingActions.congratsPageShown, "CongratsPageShown");
                break;
            case "vouchershown":
                Common.utils.trackAction("NonInteractive", GATrackingCategoryMsite, trackingActions.voucherShown, "VoucherShown");
                break;
            case "voucherclicked":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.voucherClicked, "VoucherClicked");
                break;
            case "viewad":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.viewAdClicked, "ViewAdClicked");
                break;
            case "close":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.userNavigateAway, label);
                var lbl = dataForBhrigu(action, label);
                if(document.getElementById("reason-to-leave"))
                {
                    lbl = lbl + "|reason=" + document.getElementById("reason-to-leave").value;
                }
                break;  
            case "topnavigationclicked":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.topNavigationClicked, label);
                break;
            case "pricelimithit":
                Common.utils.trackAction("Interactive", sellCarCategory, trackingActions.priceLimitHit, label);
                break;
            case "freeevaluationshown":
                Common.utils.trackAction("Interactive", GATrackingCategoryMsite, trackingActions.freeEvaluationShown, dataForBhrigu());
                break;
            case "versionscreenwithfuelselection":
                Common.utils.trackAction("CWNonInteractive", GATrackingCategoryMsite, trackingActions.versionScreenWithFuelSelection, trackingActions.versionScreenWithFuelSelection);
                break;
        }
    };
    function forDesktop(action, label) {        
        switch (action.toLowerCase()) {
            case "pageload":
                Common.utils.trackAction("CWNonInteractive", GATrackingCategoryDesktop, trackingActions.pageLoad, "PageLoad");
                break;
            case "maxlimitreached":
                Common.utils.trackAction("CWNonInteractive", GATrackingCategoryDesktop, trackingActions.maxLimitReached, "MaxLimitReached");
                break;
            case "city":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.citySelectionDone, "CitySelectionDone");
                break;
            case "contact":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.contactDetailsDone, label);
                break;
            case "caryearform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.mfgYearDone, "MfgYearDone");
                break;
            case "carmonthform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.mfgMonthDone, "MfgMonthDone");
                break;
            case "carmakeform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.makeSelectionDone, "MakeSelectionDone");
                break;
            case "carmodelform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.modelSelectionDone, "ModelSelectionDone");
                break;
            case "carversionform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.versionSelectionDone, "VersionSelectionDone");
                break;
            case "bodycolorform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.colorSelectionDone, "ColorSelectionDone");
                break;
            case "alternatefuelform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.alternateFuelSelectionDone, "AlternateFuelSelectionDone");
                break;
            case "bodyownerform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.ownerSelectionDone, "OwnerSelectionDone");
                break;
            case "recompriceshown":
                Common.utils.trackAction("CWNonInteractive", GATrackingCategoryDesktop, trackingActions.recommendedPriceShown, "RecommendedPriceShown");
                break;
            case "recompriceselect":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.recommendedPriceSelected, "RecommendedPriceSelected");
                break;
            case "expectprice":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.expectedPriceFilled, label);
                break;
            case "otpshown":
                Common.utils.trackAction("CWNonInteractive", GATrackingCategoryDesktop, trackingActions.otpShown, "OtpShown");
                break;
            case "otpnumberchanged":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.otpNumberChanged, "OtpNumberChanged");
                break;
            case "otpverified":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.otpVerified, "OtpVerified");
                 break;
            case "live":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.listingLive, "ListingLive");
                 break;
            case "carinsuranceform":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, "CarInsuranceDone", "CarInsuranceDone");
                break;
            case "images":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.imageUploaded, label);
                break;
            case "accidentalquestion":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.accidentalQuestion, label);
                break;
            case "partsreplacedquestion":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.partsReplacedQuestion, label);
                break;
            case "insuranceclaimedquestion":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.insuranceClaimedQuestion, label);
                break;
            case "servicequestion":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.serviceQuestion, label);
                break;
            case "loanquestion":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.loanQuestion, label);
                break;
            case "tyreconditionquestion":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.tyreConditionQuestion, label);
                break;
            case "weartearquestion":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.wearTearQuestion, label);
                break;
            case "mechanicalissuequestion":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.mechanicalIssueQuestion, label);
                break;
            case "congrats":
                Common.utils.trackAction("CWNonInteractive", GATrackingCategoryDesktop, trackingActions.congratsPageShown, "CongratsPageShown");
                break;
            case "vouchershown":
                Common.utils.trackAction("CWNonInteractive", GATrackingCategoryDesktop, trackingActions.voucherShown, "VoucherShown");
                break;
            case "voucherclicked":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.voucherClicked, "VoucherClicked");
                break;
            case "viewad":
                Common.utils.trackAction("CWInteractive", GATrackingCategoryDesktop, trackingActions.viewAdClicked, "ViewAdClicked");
                break;
            case "pricelimithit":
                analytics.trackAction("CWInteractive", sellCarCategory, trackingActions.priceLimitHit, label);
                break;
        }
    };

    function dataForBhrigu(action, label) {
        var trackingParam = {};
        trackingParam['tmpid'] = $.cookie("TempInquiry");
        trackingParam['inqid'] = $.cookie("SellInquiry");
        trackingParam['source'] = parentContainer.getSourceId();
        trackingParam['abtest'] = $.cookie("_abtest");
        if (action && label) {
            if (action == "close") {
                trackingParam[action] = label.replace(/ /g, '').toLowerCase();
            }
            else {
                trackingParam[action] = label;
            }
        }
        return cwTracking.prepareLabel(trackingParam);
    };
    return {
        forMobile: forMobile,
        forDesktop : forDesktop
    };
})();