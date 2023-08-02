var editCarTracking = (function () {
    var gaTrackingCategoryMsite = "MsiteEditCar";
    var eventType = {
        cwInteractive: "CWInteractive",
        cwNonInteractive: "CWNonInteractive"
    }
    var actionType = {
        searchPageLoad: "SearchPageLoad",
        mobileSearch: "MobileSearch",
        profileSearch: "ProfileSearch",
        otpScreenLoad: "OtpScreenLoad",
        otpResent: "OtpResent",
        otpVerified: "OtpVerified",
        listingViewLoad: "ListingViewLoad",
        editCar: "EditCar",
        stopAdd: "StopAdd",
        deleteAdd: "DeleteAdd",
        viewInq: "ViewInq",
        editPageLoad: "EditPageLoad",
        editBack: "EditBack",
        editContinue: "EditContinue",
        imagePageLoad: "ImagePageLoad",
        imageBack: "ImageBack",
        imageSave:"ImageSave",
        spamComment: "SpamComments",
        commentsAdded: "CommentsAdded"
    }

    function trackForMobile(action, label) {
        switch (action) {
            case actionType.searchPageLoad:
                Common.utils.trackAction(eventType.cwNonInteractive, gaTrackingCategoryMsite, actionType.searchPageLoad, label);
                break;
            case actionType.listingViewLoad:
                Common.utils.trackAction(eventType.cwNonInteractive, gaTrackingCategoryMsite, actionType.listingViewLoad, label);
                break;
            case actionType.mobileSearch:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.mobileSearch, label);
                break;
            case actionType.profileSearch:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.profileSearch, label);
                break;
            case actionType.editCar:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.editCar, label);
                break;
            case actionType.otpScreenLoad:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.otpScreenLoad, label);
                break;
            case actionType.stopAdd:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.stopAdd, label);
                break;
            case actionType.otpResent:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.otpResent, label);
                break;
            case actionType.deleteAdd:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.deleteAdd, label);
                break;
            case actionType.otpVerified:
                Common.utils.trackAction(eventType.cwNonInteractive, gaTrackingCategoryMsite, actionType.otpVerified, label);
                break;
            case actionType.viewInq:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.viewInq, label);
                break;
            case actionType.editPageLoad:
                Common.utils.trackAction(eventType.cwNonInteractive, gaTrackingCategoryMsite, actionType.editPageLoad, label);
                break;
            case actionType.editBack:
                Common.utils.trackAction(eventType.cwInteractive,gaTrackingCategoryMsite,actionType.editBack,label);
                break;
            case actionType.editContinue:
                Common.utils.trackAction(eventType.cwInteractive,gaTrackingCategoryMsite,actionType.editContinue,label);
                break;
            case actionType.imagePageLoad:
                Common.utils.trackAction(eventType.cwNonInteractive, gaTrackingCategoryMsite, actionType.imagePageLoad, label);
                break;
            case actionType.imageBack:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.imageBack, label);
                break;
            case actionType.imageSave:
                Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.imageSave, label);
                break;
            case actionType.spamComment:
                    Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.spamComment, label);
                    break;
            case actionType.commentsAdded:
                    Common.utils.trackAction(eventType.cwInteractive, gaTrackingCategoryMsite, actionType.commentsAdded, label);
                    break;
            default:
        }
    }

    return {
        trackForMobile: trackForMobile,
        actionType: actionType
    }
})();