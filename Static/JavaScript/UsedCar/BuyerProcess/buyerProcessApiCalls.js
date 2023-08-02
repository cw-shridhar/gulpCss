function callStockLeadApi(requestBody, successCallback, errorCallback) {
  $.ajax({
    url: stockLeadEndpoint,
    data: JSON.stringify(requestBody),
    type: "post",
    contentType: "application/json",
    headers: { sourceId: getSourceId() },
    success: function (results) {
      if (successCallback) {
        successCallback(results);
        if($('.whatsapp-consent-container').is(":visible")) {
          $('.whatsapp-consent-container').hide();
        }
      }
    },
    error: function (xhr) {
      if (errorCallback) {
        errorCallback(xhr, requestBody);
        if($('.whatsapp-consent-container').is(":visible")) {
          $('.whatsapp-consent-container').hide();
        }
      }
    },
  });
}

function initiateOtp(mobile) {
  var bodyDataObj = {};
  bodyDataObj.mobileVerificationByType = 1; // for otp verification
  $.ajax({
    url: "/buy-used-cars/api/v1/mobile/" + mobile + "/verification/start/",
    data: JSON.stringify(bodyDataObj),
    type: "post",
    contentType: "application/json",
    headers: { sourceId: getSourceId() },
  });
}

function resendOtpApi(mobile, successCallback, errorCallback) {
  var requestBody = {
    mobile: mobile,
    sourceModule: 1,
    mobileVerificationByType: 3,
  };
  $.ajax({
    url: "/buy-used-cars/api/v1/resendotp/",
    data: JSON.stringify(requestBody),
    type: "post",
    async: false,
    contentType: "application/json",
    success: function (results) {
      if (successCallback) {
        successCallback(results);
      }
    },
    error: function (xhr) {
      if (errorCallback) {
        errorCallback(xhr);
      }
    },
  });
}

function callSimilarCarsApi(
  similarCarsUrl,
  successCallback,
  setNoSimilarCarsHtml,
  setSimilarCarsHtml,
  setSimilarCarsEvents
) {
  $.ajax({
    url: similarCarsUrl,
    headers: { sourceId: getSourceId() },
    success: function (results) {
      if (successCallback) {
        successCallback(
          results,
          setNoSimilarCarsHtml,
          setSimilarCarsHtml,
          setSimilarCarsEvents
        );
      }
    },
  });
}

function callVerifyOtpApi(
  mobile,
  otpNumber,
  successCallback,
  stockLeadSuccess,
  stockLeadError,
  showOtpErrorMsg
) {
  $.ajax({
    url: getVerifyOtpEndpoint(mobile, otpNumber),
    type: "get",
    async: false,
    success: function (response) {
      if (successCallback) {
        successCallback(
          response,
          stockLeadSuccess,
          stockLeadError,
          showOtpErrorMsg
        );
      }
    },
  });
}

function callSaveNegotiationApi(profileId, data) {
  $.ajax({
    url: "/buy-used-cars/api/stocks/" + profileId + "/negotiate/",
    type: "PUT",
    data: JSON.stringify(data),
    contentType: "application/json",
    headers: {
      applicationId: 3,
    },
  }).done(function (data) {});
}