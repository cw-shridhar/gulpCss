function getStockLeadRequestData(request) {
  var formattedRequest = {
    profileId: request.listingId,
    buyer: {
      name: request.name,
      mobile: request.phone,
      shouldGrantWhatsAppConsent: request.shouldGrantWhatsAppConsent,
    },
    leadTrackingParams: {
      originId: request.originId,
      leadType: request.leadType,
      rank: request.rank,
      slotId: request.slotId,
      leadCity: request.cityId,
    },
  };
  if (request.negotiateAmount) {
    formattedRequest["negotiatePrice"] = request.negotiateAmount;
  }
  return formattedRequest;
}
//Todo change name when buyerFormDesktop is migrated completely
function getLeadTypeForPopup(popupType) {
  if (popupType === "wc") {
    return 2;
  } else if (popupType === "ng") {
    return 5;
  } else if (popupType === "CERT") {
    return 3;
  } else if (popupType === "shortlist-type") {
    return 6;
  } else if (popupType === "HomeTestDrive") {
    return 9;
  }
  return 0;
}
var PLATFORM = {
  DESKTOP: "302",
  MSITE: "301",
};

//TODO change name when buyerFormDesktop is migrated completely
//TODO to discuss if we can use same cookie
function getLeadCityIdV2(deliveryCityId) {
  var cookieCityId = Common.utils.getCookieByName("cd-city-id");
  var cityId = 0;
  if (Number(cookieCityId) > 0) {
    cityId = Number(cookieCityId);
  } else if (deliveryCityId) {
    cityId = deliveryCityId;
  } else {
    cityId = 0;
  }
  return cityId;
}

function getSourceId() {
  return $(".pageSourceId").text();
}

function getVerifyOtpEndpoint(mobile, otpNumber) {
  return (
    "/buy-used-cars/api/v1/mobile/" +
    mobile +
    "/verification/verifyotp/?otpCode=" +
    otpNumber +
    "&sourceModule=1"
  );
}

function fireInteractiveGATracking(eventCategory, eventAction, eventLabel) {
  if (eventAction == null || eventLabel == null) {
    return;
  }
  if (eventCategory == null) {
    eventCategory = getTrackingCategory();
  }
  analytics.trackAction(
    interactiveTrackingEvent,
    eventCategory,
    eventAction,
    eventLabel
  );
}

function getTrackingCategory() {
  return window.location.href.includes(".html")
    ? "UsedCarDetails"
    : "UsedCarSearch";
}

function getCategoryBasedOnOriginId(originId) {
  switch (originId) {
    case MSITE_USED_SEARCH_PAGE_CROSS_SELLING_ORIGIN_ID:
      return SEARCH_PAGE_TRACKING_CATEGORY;
    case MSITE_USED_CAR_DETAILS_PAGE_CROSS_SELLING_ORIGIN_ID:
      return USEDCARDETAILS_CATEGORY;
    case DESKTOP_USED_SEARCH_PAGE_CROSS_SELLING_ORIGIN_ID:
      return SEARCH_PAGE_TRACKING_CATEGORY;
    case DESKTOP_USED_CAR_DETAILS_PAGE_CROSS_SELLING_ORIGIN_ID:
      return USEDCARDETAILS_CATEGORY;
    default:
      return "";
  }
}

function getTrackingLabel(leadData) {
  return (
    "profileId=" +
    leadData.listingid +
    "|originId=" +
    leadData.originid +
    "|rank=" +
    leadData.rank +
    "|platform=" +
    leadData.platform
  );
}

function getSimilarCarsEndpoint(leadData) {
  var userCityId = Common.utils.getCookieByName("cd-city-id");
  // if no city is selected by the user (India case).
  if (!userCityId) {
    userCityId = leadData.cityid ? leadData.cityid : -1;
  }
  return (
    "/buy-used-cars/api/stockrecommendations/?profileId=" +
    leadData["listingid"] +
    "&rootid=" +
    leadData["rootid"] +
    "&cityid=" +
    userCityId +
    "&price=" +
    leadData["price"] +
    "&recommendationsCount=25&versionSubSegmentId=" +
    leadData["versionsubsegmentid"]
  );
}

function _inputEvent(event) {
  if (event.target.value) {
    $(event.currentTarget).attr("data-input", event.target.value);
  } else {
    $(event.currentTarget).removeAttr("data-input");
  }
}

function _bindInputBlur(event) {
  if (!event.target.value) {
    $(event.currentTarget).removeAttr("value");
  }
}

function _getWhatsappMessageUrl(mobile, message) {
  return "https://api.whatsapp.com/send?phone=91" + mobile + "&text=" + message;
}
