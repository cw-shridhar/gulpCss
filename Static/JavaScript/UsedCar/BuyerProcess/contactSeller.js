var buyerFormV2 = (function () {
  var myTimer = "";
  var mobileNumber = "";
  var whatsappMessage = "";
  var isWhatsAppClicked = false;
  var isLeadFormActive = false;
  var leadData = {};
  var formData = {};
  var otpCount = 3;
  var setTimeOutId;
  var setIntervalId;
  var cookieFlag = 0;
  var platform = "";
  var oneClickViewBtnText = false;
  var viewSimilarCarButtonOpened = false;
  var LEAD_STATUS = {
    MOBILE_UNVERIFIED: "MobileUnverified",
    MOBILE_VERIFIED: "mobileVerified",
  };
  var otpFieldEnabled = false;
  var otpVerified = false;
  var lastSellerMobile = "";
  var toastElementId = "error-toast";
  var userCookies = formcookies();
  var abTestValue = userCookies["_abtest"];

  function resetData(showNameErrorMsg, showMobileErrorMsg, showOtpErrorMsg) {
    isLeadFormActive = false;
    leadData = {};
    resetForm(showNameErrorMsg, showMobileErrorMsg, showOtpErrorMsg);
  }

  function resetFormWithTracking(
    showNameErrorMsg,
    showMobileErrorMsg,
    showOtpErrorMsg
  ) {
    analytics.trackAction(
      "CWInteractive",
      getTrackingCategory(),
      contactDetailsEditedTrackingAction,
      "profileId=" + leadData.listingid
    );
    resetForm(showNameErrorMsg, showMobileErrorMsg, showOtpErrorMsg);
  }

  function resetForm(showNameErrorMsg, showMobileErrorMsg, showOtpErrorMsg) {
    otpFieldEnabled = false;
    disableOTPField();
    otpCount = 3;
    formData = {};
    platform = "";
    window.clearTimeout(setTimeOutId);
    window.clearInterval(setIntervalId);
    $(".buyer-process__resend-otp--link").text("Resend OTP");
    $(".buyer-process__resend-otp--link").show();
    $(".buyer-process__resend-otp-count-down").hide();
    $("#buyerName").removeClass("buyer-process__input--disabled");
    $("#buyerMobile").removeClass("buyer-process__input--disabled");
    $(".buyer-process__change-number").addClass("hide");
    showNameErrorMsg("");
    showMobileErrorMsg("");
    showOtpErrorMsg("");
  }

  function handleOpenOTPForm(
    stockLeadSuccess,
    stockLeadError,
    showNameErrorMsg,
    showMobileErrorMsg,
    showOtpErrorMsg
  ) {
    if (platform == PLATFORM.MSITE) {
      var isOptInSelected = $('.buyer-process__consent-checkbox').is(":checked")
      fireInteractiveGATracking(null, getOtpClickTrackingAction, getTrackingLabel(leadData));
      fireInteractiveGATracking(null, isOptInSelected ? whatsAppOptInSelected : whatsAppOptInDeselected, "");
      if($('.buyer-process__consent').is(":visible")) {
        $('.buyer-process__consent').hide();
      }
    } else {
      analytics.trackAction(
        "CWInteractive",
        getTrackingCategory(),
        contactDetailsTrackingAction,
        "profileId=" + leadData.listingid
      );``
    }
    formData = document.buyer_form;
    var buyerName = formData.name.value;
    var buyerMobile = formData.mobile.value;
    var listingId = leadData.listingid;
    if (
      !validateLeadFormData(
        formData,
        otpFieldEnabled,
        showNameErrorMsg,
        showMobileErrorMsg,
        showOtpErrorMsg
      )
    ) {
      return false;
    }
    var requestData = {
      listingId: listingId,
      name: buyerName,
      phone: buyerMobile,
      originId: leadData.originid,
      leadType: getLeadTypeForPopup(leadData.popuptype),
      rank: leadData.rank,
      slotId: leadData.slotid,
      cityId: getLeadCityIdV2(),
      shouldGrantWhatsAppConsent: $('.buyer-process__consent-checkbox').is(":checked") || $('.whatsapp-consent-checkbox').is(":checked"),
    };
    if (leadData["negotiateAmount"] > 0) {
      requestData.negotiateAmount = leadData["negotiateAmount"];
    }
    var request = getStockLeadRequestData(requestData);
    $("#cl-loaderblk").show();
    callStockLeadApi(request, stockLeadSuccess, stockLeadError);
  }

  function getNameFromCookie() {
    var cookies = formcookies();
    return cookies["cookie_buyform_name"] || "";
  }

  function getMoblieNoFromCookie() {
    var cookies = formcookies();
    return cookies["cookie_buyform_mobile"] || "";
  }

  function setLeadData(event) {
    leadData = $(event.currentTarget).data() || {};
    platform = leadData.platform;
    formData = document.buyer_form;
  }

  function setLeadDataV2(listingId, originId, popupType, slotId, rank) {
    leadData["listingid"] = listingId;
    leadData["originid"] = originId;
    leadData["popuptype"] = popupType;
    leadData["slotid"] = slotId;
    leadData["rank"] = rank;
    platform = leadData.platform;
    formData = document.buyer_form;
  }

  function prefilBuyerDetails() {
    var mobile = getMoblieNoFromCookie();
    if (mobile) {
      $("input#buyerMobile").val(mobile);
      $("input#buyerMobile").attr("data-input", mobile);
    }
    var name = getNameFromCookie();
    if (name) {
      $("input#buyerName").val(name);
      $("input#buyerName").attr("data-input", name);
    }
  }

  function moveSimilarCarsSellerDetailsPop() {
    if (getSourceId() === "301") {
      return;
    }
    document.getElementById("rhtarw").classList.add("directionrht");
    if (leadData["popuptype"] === "similar") {
      $("#similar-contact-seller-container-" + leadData["listingid"]).html(
        $("#pl-similar_cars")
      );
    } else if (
      leadData["popuptype"] === "fl-fr" ||
      leadData["popuptype"] === "frchat" ||
      leadData["popuptype"] === "fl" ||
      leadData["popuptype"] === "flchat" ||
      leadData["popuptype"] === "fl-dl" ||
      leadData["popuptype"] === "dlchat"
    ) {
      $("#fl-contact-seller-container-" + leadData["listingid"]).html(
        $("#pl-similar_cars")
      );
    } else if (leadData["popuptype"] === "CERT") {
      document.getElementById("rhtarw").classList.remove("directionrht");
      $("#fl-contact-seller-container-cert-side-" + leadData["listingid"]).html(
        $("#pl-similar_cars")
      );
    } else if (leadData["popuptype"] === "CERTSIDE") {
      $("#fl-contact-seller-container-cert-side-" + leadData["listingid"]).html(
        $("#pl-similar_cars")
      );
    } else if (leadData["popuptype"] === "ng") {
      $("#negotiate-popup-script").hide();
      if (
        $("#fl-contact-seller-container-" + leadData["listingid"]).length > 0
      ) {
        $("#fl-contact-seller-container-" + leadData["listingid"]).html(
          $("#pl-similar_cars")
        );
      } else {
        $("#contact-seller-container-" + leadData["listingid"]).html(
          $("#pl-similar_cars")
        );
      }
    } else {
      $("#contact-seller-container-" + leadData["listingid"]).html(
        $("#pl-similar_cars")
      );
    }
    if (leadData["popuptype"] === "CERT") {
      $("#pl-lead-title").html("Print Certification Report");
    }
    $("#pl-similar_cars").attr("data-popup-type", leadData["popuptype"]);
  }

  function downloadPdf(Url) {
    //for browser compatibility,
    //setting location.href after timeout, instead of directly setting it.
    setTimeout(function () {
      location.href = Url;
    }, 0);
  }

  function redirectToWhatsapp(){
    $("#PL_popup_background").show();
    var whatsAppMessageUrl = _getWhatsappMessageUrl(
      mobileNumber,
      whatsAppMessage
    );
    setTimeout(function () {
      window.open(whatsAppMessageUrl, "_self");
    }, 0);
  }

  function handleStockLeadSuccess(
    response,
    showSimilarCarsHtml,
    setNoSimilarCarsHtml,
    setSimilarCarsHtml,
    hideBuyerFormHtml,
    showNameErrorMsg,
    showMobileErrorMsg,
    showOtpErrorMsg,
    setSimilarCarsEvents,
    setSimilarCarLeadData,
    platform,
    showRecommendationHtml
  ) {
    if (platform == PLATFORM.MSITE) {
      fireInteractiveGATracking(validLeadEventCategory, validLeadTrackingAction, getTrackingLabel(leadData))
    } else {
      /* Not removed ga tracking since ga requires additional event.
      It will be removed once new ga tag is added on ga console*/
      analytics.trackAction(
        "CTInteractive",
        "UsedStockLead",
        "Valid",
        "profileId=" + leadData.listingid
      );
    }
    /* Event is pushed to data layer to trigger lead
       conversion ad */
    if (typeof window !== "undefined") {
      window.dataLayer.push({
        event: "CTInteractive",
        category: "UsedStockLead",
        action: "Valid"
      });
    }
    if (typeof recentlyViewedCars !== "undefined") {
      recentlyViewedCars.addProfileIdToLocalStorage(leadData.listingId);
    }
    var cookies = formcookies();
    if (
      cookies &&
      formData.mobile &&
      cookies["cookie_buyform_mobile"] !== formData.mobile.value
    ) {
      updateCookie(formData.name.value, formData.mobile.value);
    }
    if (
      cookies &&
      formData.name &&
      cookies["cookie_buyform_name"] !== formData.name.value
    ) {
      updateCookie(formData.name.value, formData.mobile.value);
    }
    if (response.stock && response.stock.dealerId) {
      updateDealerLists(response.stock.dealerId);
    }
    if (response && response.certificationReportUrl) {
      downloadPdf(response.certificationReportUrl);
    } else {
      if (leadData["negotiateAmount"] > 0) {
        saveNegotiationData(
          leadData["listingid"],
          formData.mobile.value,
          leadData["negotiateAmount"]
        );
      }
      if (leadData["popuptype"] === "wc") {
        var mobileList = response.seller.mobile.split(",");
          isWhatsAppClicked = true;
          loadRecommendationPopup(response, showRecommendationHtml);
          mobileNumber = mobileList[0];
          whatsAppMessage = response.whatsAppMessage;
      }
      else if (
        leadData["popuptype"] !== similarPopupType &&
        leadData["popuptype"] !== shortListPopupType &&
        platform === '302'
      ) {
        loadDesktopRecommendationsPopup(response, buyerFormV2Desktop.openRecommendationsPopup);
      }
      else if (leadData["popuptype"] !== similarPopupType &&
        leadData["popuptype"] !== shortListPopupType &&
        platform === '301') {
        isWhatsAppClicked = false;
        loadRecommendationPopup(response, showRecommendationHtml)
      }
      else {
        lastSellerMobile = response.mobile;
        setSimilarCarLeadData(response, leadData);
      }
    }
      setTimeout(function () {
        //check if input needed
        closeBuyerForm(
          hideBuyerFormHtml,
          showNameErrorMsg,
          showMobileErrorMsg,
          showOtpErrorMsg,
          platform
        );
      }, 500);
  }

  function handleSetOneClickViewDetails(setOneClickViewDetailsHtml) {
    var cookies = formcookies();
    try {
      var userName = hanUndefined(
        decodeURIComponent(cookies["cookie_buyform_name"])
      );
      var userMobile = hanUndefined(
        decodeURIComponent(cookies["cookie_buyform_mobile"])
      );
      if (userMobile !== "" && userName !== "" && !oneClickViewBtnText) {
        setOneClickViewDetailsHtml();
        oneClickViewBtnText = true;
      }
    } catch (e) {
      console.log("1 click view display function" + e);
    }
  }

  function loadDesktopRecommendationsPopup(
    response,
    openRecommendationsPopup
  ) {
    if (leadData["popuptype"] !== "check_right") {
      leadData = $("#contact_seller_button_" + response.stock.profileId).data();
    }
    if (!!response && !!response.stock && !response.stock.isDealer) {
      buyerFormV2Desktop.setIndividualLeadResponseScreen();
    }
    else
    {
      buyerFormV2Desktop.bindSellerDetails(!!response ? response.seller : {});
    }
    updateCookiesValues();
    var recommendedCarsUrl = getSimilarCarsEndpoint(leadData);
    callSimilarCarsApi(
      recommendedCarsUrl,
      recommendationsSuccessDesktopCallback,
      openRecommendationsPopup,
    );
}

  function loadRecommendationPopup(
    response,
    showRecommendationHtml
  ) {
    if (leadData["popuptype"] !== "check_right") {
      leadData = $("#contact_seller_button_" + response.stock.profileId).data();
    }
    bindSellerDetails(response.seller);
    $("#simcarhead").html("SIMILAR CARS");
    updateCookiesValues();
    var recommendedCarsUrl = getSimilarCarsEndpoint(leadData);
    callSimilarCarsApi(
      recommendedCarsUrl,
      recommendationsSuccessCallback,
      showRecommendationHtml
    );
}

  function bindSellerDetails(sellerDetails) {
    if (sellerDetails) {
      sellerDetails.name && $('#seller-shop-name').text(sellerDetails.name);
      sellerDetails.contactPerson && $('#seller-contact-name').text(sellerDetails.contactPerson);
      sellerDetails.mobile && $('#seller-mobile').text(sellerDetails.mobile) && $("#seller-mobile").attr("href", "tel:" + sellerDetails.mobile);
    }
  }

  function recommendationsSuccessDesktopCallback(data,
    openRecommendationsPopup
  ) {
    try{
      openRecommendationsPopup(data);
    } catch (e) {
      console.log(e);
    }
  }

  function recommendationsSuccessCallback(
    data,
    showRecommendationHtml
  ) {
    try {
      if(isWhatsAppClicked){
        showRecommendationHtml(data, redirectToWhatsapp);
      }else{
        showRecommendationHtml(data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleStockLeadError(
    xhr,
    requestBody,
    showBuyerFormHtml,
    showOTPFieldHtml
  ) {
    if (!isLeadFormActive) {
      showBuyerFormHtml();
    }
    if (xhr.status === 403) {
      var jsonResponseModelState =
        xhr.responseJSON && xhr.responseJSON.ModelState;
      if (
        jsonResponseModelState && jsonResponseModelState.hasOwnProperty(LEAD_STATUS.MOBILE_UNVERIFIED)
      ) {
        enableOTPField(showOTPFieldHtml);
        initiateOtp(requestBody.buyer.mobile);
      }
      else {
        if (typeof showToast !== 'undefined' && typeof showToast === "function") {
          showToast(xhr.responseJSON.Message, toastElementId);
        }
      }
    }
  }

  function handleRecommendationError(
    response
  ) {
    if (response && response.status === 403 && response.responseJSON) {
      var jsonResponseModelState = response.responseJSON.ModelState;
      if (!(jsonResponseModelState &&
        jsonResponseModelState.hasOwnProperty(LEAD_STATUS.MOBILE_UNVERIFIED)) &&
        showToast && typeof showToast === "function"
      ) {
        showToast(response.responseJSON.Message, toastElementId);
      }
    }
  }

  function validateLeadFormData(
    formData,
    otpFieldEnabled,
    showNameErrorMsg,
    showMobileErrorMsg,
    showOtpErrorMsg
  ) {
    var isValid = validateName(formData.name.value, showNameErrorMsg);
    isValid =
      isValid && validateMobile(formData.mobile.value, showMobileErrorMsg);
    if (otpFieldEnabled === true) {
      isValid = isValid && validateOtp(5, formData.otp.value, showOtpErrorMsg);
    }
    return isValid;
  }

  function validateName(name, showNameErrorMsg) {
    var nameErrorMsg = "";
    var isValid = true;
    if (name.length === 0 || name === "") {
      isValid = false;
      nameErrorMsg = "Please enter your Name";
    } else if (name.length < 3 || name.length > 50) {
      isValid = false;
      nameErrorMsg = "Please enter your correct Name";
    } else if (!NewisName(name, 3, 50)) {
      isValid = false;
      nameErrorMsg = "Please enter your correct Name";
    }
    $("#invalidNameText").val("");

    if (!isValid) {
      showNameErrorMsg(nameErrorMsg);
      return false;
    } else {
      showNameErrorMsg("");
      return true;
    }
  }

  function validateMobile(mobile, showMobileErrorMsg) {
    var nameErrorMsg = "";
    var isValid = true;
    if (mobile.length === 0) {
      isValid = false;
      nameErrorMsg = "Please enter your Mobile No.";
    } else if (!startNum(mobile[0])) {
      isValid = false;
      nameErrorMsg = "Please enter your correct Mobile No.";
      mobile = mobile.replace(/[^6-9]/g, "");
    } else if (mobile.length < 10) {
      isValid = false;
      nameErrorMsg = "Please enter your correct Mobile No.";
    } else if (!NewisNum(mobile, 10, 10)) {
      isValid = false;
      nameErrorMsg = "Please enter your correct Mobile No.";
      mobile = mobile.replace(/[^0-9]/g, "");
    }
    var mobilec = mobile.substring(0, 10);
    $("#invalidMobileText").val(mobilec);

    if (mobilec !== mobile && startNum(mobile[0])) isValid = true;

    if (!isValid) {
      showMobileErrorMsg(nameErrorMsg);
      return false;
    } else {
      showMobileErrorMsg("");
      return true;
    }
  }

  function validateOtp(limit, otp, showOtpErrorMsg) {
    var isValid = false;
    var nameErrorMsg = "";
    if (otp.length > limit) {
      otp = otp.substr(0, otp.length - 1);
    }
    if (otp === "") {
      nameErrorMsg = "Please enter OTP";
      isValid = true;
    } else {
      var RegExp = /^[0-9]{5}$/;
      if (!RegExp.test(otp)) {
        nameErrorMsg = "Enter correct OTP";
        isValid = true;
      }
    }
    if (isValid) {
      showOtpErrorMsg(nameErrorMsg);
      return false;
    } else {
      return true;
    }
  }

  function showCRPOtpErrorMsg(errorMessage) {
    $("#otp").addClass("border_style");
    $("#otp").next().html(errorMessage);
    $("#otp").next().addClass("open");
  }

  function startNum(txt) {
    var RegExp = /^[9|8|7|6]$/;
    return RegExp.test(txt);
  }

  //Below function is only for desktop
  function handleDisableOTPCRP() {
    otpFieldEnabled = false;
    if (myTimer) {
      clearInterval(myTimer);
    }
  }

  function enableOTPField(showOTPFieldHtml) {
    otpFieldEnabled = true;
    if (leadData.popuptype === "check_right") {
      $("#buyerName").prop("disabled", true);
      $("#buyerMobile").prop("disabled", true);
      $("#buyerName,#buyerMobile").addClass("disab");
      $(".otp_from").css("display", "block");
      $("#oneclickcheckright").removeClass("open");
      $("#oneclickcheckright").addClass("close");
      $("#inline-form").removeClass("no-form");
      $(".input-group").removeClass("close");
      $(".step1_buttons").css("display", "none");
      $(".step2_buttons").css("display", "block");
      var resendText = document.getElementById("resend_txt");
      var timeCounter = 30;
      if (myTimer) {
        clearInterval(myTimer);
      }
      myTimer = setInterval(function () {
        if (timeCounter !== 0) {
          resendText.innerHTML = "Resend OTP in " + timeCounter + "s";
          timeCounter = timeCounter - 1;
        } else {
          clearInterval(myTimer);
          resendText.innerHTML =
            '<span  onClick="buyerFormV2.resendOTPCRP()">Resend OTP</span>';
        }
      }, 1000);
    } else {
      showOTPFieldHtml();
    }
  }

  function disableOTPField() {
    $("#otpInputField").addClass("buyer-process__input--hide");
    $("input#buyerOtp").val("");
    $("input#buyerOtp").removeAttr("data-input");
    $(".verifyOtp").hide();
    $(".submitDetails").show();
  }

  function formcookies() {
    var cookies = {};
    if (parent.document.cookie && parent.document.cookie !== "") {
      var split = document.cookie.split(";");
      for (var i = 0; i < split.length; i++) {
        var name_value = split[i].split("=");
        name_value[0] = name_value[0].replace(/^ /, "");
        cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(
          name_value[1]
        );
      }
    }
    return cookies;
  }

  function handleShowBuyerFormPopup(platform) {
    if (platform == PLATFORM.MSITE) {
      fireInteractiveGATracking(null, formShownTrackingAction, getTrackingLabel(leadData))
      fireInteractiveGATracking(null, whatsAppOptInShown, "")
      if($('.buyer-process__consent').is(":hidden")) {
        $('.buyer-process__consent').show();
      }
    } else {
      analytics.trackAction(
        "CWInteractive",
        getTrackingCategory(),
        buyerFormViewedTrackingAction,
        "profileId=" + leadData.listingid
      );
    }
    if (platform && platform === PLATFORM.DESKTOP) {
      removeBodyScroll();
    }
    isLeadFormActive = true;
  }

  function handleVerifyBuyerOtp(
    stockLeadSuccess,
    stockLeadError,
    showOtpErrorMsg,
    showNameErrorMsg,
    showMobileErrorMsg
  ) {
    if (
      !validateLeadFormData(
        formData,
        otpFieldEnabled,
        showNameErrorMsg,
        showMobileErrorMsg,
        showOtpErrorMsg
      )
    ) {
      return false;
    }
    $("#cl-loaderblk").show();
    submitVerfiyOtp(stockLeadSuccess, stockLeadError, showOtpErrorMsg);
  }

  function submitVerfiyOtp(stockLeadSuccess, stockLeadError, showOtpErrorMsg) {
    var mobile = formData.mobile.value;
    var otpNumber = formData.otp.value;
    otpVerified = false;
    callVerifyOtpApi(
      mobile,
      otpNumber,
      verifyOtpSuccessCallback,
      stockLeadSuccess,
      stockLeadError,
      showOtpErrorMsg
    );
  }

  function verifyOtpSuccessCallback(
    response,
    stockLeadSuccess,
    stockLeadError,
    showOtpErrorMsg
  ) {
    if (!response) {
      return false;
    }
    if (response["responseCode"] === "1") {
      if (platform == PLATFORM.MSITE) {
        fireInteractiveGATracking(null, otpVerifiedTrackingAction, getTrackingLabel(leadData))
      }
      $(".verified-otp").removeClass("hide");
      otpVerified = true;
      updateCookie(formData.name.value, formData.mobile.value);
      getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
    } else if (response["responseCode"] === "3") {
      if (platform == PLATFORM.MSITE) {
        fireInteractiveGATracking(null, otpNotVerifiedTrackingAction, getTrackingLabel(leadData))
      }
      if (leadData.popuptype === "check_right") {
        showCRPOtpErrorMsg("Invalid OTP"); //CRP = Check Right Price
      } else {
        showOtpErrorMsg("Invalid OTP");
        if (otpFieldEnabled === false) {
          initiateOtp(mobile);
        }
      }
    }
  }

  function getPreVerifiedDetails(stockLeadSuccess, stockLeadError) {
    formData = getFormData();
    var requestData = {
      listingId: leadData.listingid,
      name: formData.name.value,
      phone: formData.mobile.value,
      originId: leadData.originid,
      leadType: getLeadTypeForPopup(leadData.popuptype),
      rank: leadData.rank,
      slotId: leadData.slotid,
      cityId: getLeadCityIdV2(),
      shouldGrantWhatsAppConsent: $('.buyer-process__consent-checkbox').is(":checked") || $('.whatsapp-consent-checkbox').is(":checked"),
    };
    if (leadData["negotiateAmount"] > 0) {
      requestData.negotiateAmount = leadData["negotiateAmount"];
    }
    var request = getStockLeadRequestData(requestData);
    callStockLeadApi(request, stockLeadSuccess, stockLeadError);
  }

  function handleCloseBuyerFormWithTracking(
    hideBuyerFormHtml,
    showNameErrorMsg,
    showMobileErrorMsg,
    showOtpErrorMsg,
    platform
  ) {
    if (platform == PLATFORM.MSITE && otpFieldEnabled) {
      fireInteractiveGATracking(null, otpScreenCloseButtonTrackingAction, getTrackingLabel(leadData))
    } else if (platform == PLATFORM.MSITE && !otpFieldEnabled) {
      fireInteractiveGATracking(null, leadFormCloseButtonTrackingAction, getTrackingLabel(leadData))
    } else {
      analytics.trackAction(
        "CWInteractive",
        getTrackingCategory(),
        closeButtonTrackingAction,
        "profileId=" + leadData.listingid
      );
    }
    closeBuyerForm(
      hideBuyerFormHtml,
      showNameErrorMsg,
      showMobileErrorMsg,
      showOtpErrorMsg,
      platform
    );
  }

  function closeBuyerForm(
    hideBuyerFormHtml,
    showNameErrorMsg,
    showMobileErrorMsg,
    showOtpErrorMsg,
    platform
  ) {
    if (platform && platform === PLATFORM.DESKTOP) {
      addBodyScroll();
      $('.whatsapp-consent-checkbox').prop('checked', false);
      $('.whatsapp-consent-container').show();
    }
    $('.buyer-process__consent-checkbox').prop('checked', false);
    hideBuyerFormHtml();
    resetData(showNameErrorMsg, showMobileErrorMsg, showOtpErrorMsg);
  }

  function hanUndefined(val) {
    if (val === undefined || val === "undefined") {
      return "";
    }
    return val;
  }

  function resendOTPCRP() {
    resendOtpApi(
      formData.mobile.value,
      resendSuccessCallback,
      resendErrorCallback
    );
  }

  function resendSuccessCallback(data) {
    if (data === "Success") {
      document.getElementById("resend_txt").innerHTML = "OTP sent to Mobile";
    }
  }

  function resendErrorCallback() {
    var resendText = document.getElementById("resend_txt");
    resendText.style.display = "block";
    resendText.inneHTML = " Please try after some time";
  }

  function handleResendOtp(
    setResendOtpTimer,
    showResendOtpButton,
    OtpLimitReached
  ) {
    analytics.trackAction(
      "CWInteractive",
      getTrackingCategory(),
      resendOtpTrackingAction,
      "profileId=" + leadData.listingid
    );
    if (otpCount < 1) {
      return false;
    }
    otpCount--;
    resendOtpApi(formData.mobile.value);
    var countDown = 29;
    if (setIntervalId) {
      window.clearTimeout(setIntervalId);
    }
    setIntervalId = window.setInterval(function () {
      setResendOtpTimer(countDown);
      countDown--;
    }, 1000);
    if (setTimeOutId) {
      window.clearTimeout(setTimeOutId);
    }
    setTimeOutId = window.setTimeout(function () {
      window.clearInterval(setIntervalId);
      window.clearTimeout(setTimeOutId);
      showResendOtpButton();
    }, 30000);
    if (otpCount < 1) {
      OtpLimitReached();
    }

    return true;
  }

  function updateCookiesValues() {
    formData = document.buyer_form;
    cookieFlag = 0;
    var cookies = getCookies();

    if (
      cookies["cookie_buyform_name"] &&
      cookies["cookie_buyform_name"] !== ""
    ) {
      formData.name.value = cookies["cookie_buyform_name"]
        .replace(/\+/g, " ")
        .trim();
      cookieFlag++;
    }
    if (
      cookies["cookie_buyform_mobile"] &&
      cookies["cookie_buyform_mobile"] !== ""
    ) {
      formData.mobile.value = cookies["cookie_buyform_mobile"];
      cookieFlag++;
    }
    if (cookieFlag === 2) {
      return true;
    }
    return false;
  }

  function submitAbsureLead(currElement, stockLeadSuccess, stockLeadError) {
    leadData = {};
    leadData = $(currElement).data();
    viewSimilarCarButtonOpened = false;
    addBodyScroll();
    $("#left-person-lead-panel").removeClass("clicksmbtnout");
    if (updateCookiesValues()) {
      getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
      return false;
    }
    return true;
  }

  function negotiationSubmitLead(
    currElement,
    stockLeadSuccess,
    stockLeadError,
    hideNegotiatePopupAndbodyScroll,
    platform
  ) {
    leadData = {};
    leadData = $(currElement).data();
    var negotiateAmount = Number(document.getElementById('negotiateprice').value);
    if (negotiateAmount == '') {
      leadData.negotiateAmount = 0;
    }
    else {
      leadData.negotiateAmount = negotiateAmount;
    }
    analytics.trackAction
      (
        "CWInteractive",
        getTrackingCategory(),
        NegotiateSubmitClickTrackingAction,
        "profileId=" + leadData.listingid + "|originId=61|platformid=301"
      );
    if (
      typeof hideNegotiatePopupAndbodyScroll !== "undefined" &&
      typeof hideNegotiatePopupAndbodyScroll === "function"
    ) {
      hideNegotiatePopupAndbodyScroll();
    }
    viewSimilarCarButtonOpened = false;
    if (platform && platform === PLATFORM.DESKTOP) {
      addBodyScroll();
    }
    $("#left-person-lead-panel").removeClass("clicksmbtnout");
    if (updateCookiesValues()) {
      getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
      return false;
    } else {
      return true;
    }
  }

  function removeBodyScroll() {
    document.body.style.top = document.body.getBoundingClientRect().top + "px";
    document.body.style.position = "fixed";
  }

  function addBodyScroll() {
    var currentPostion = document.body.getBoundingClientRect().top;
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(currentPostion, 10) * -1);
  }

  function getFormData() {
    var buyerName = formData.name
      ? formData.name.value || getNameFromCookie()
      : getNameFromCookie();
    var buyerMobile = formData.mobile
      ? formData.mobile.value || getMoblieNoFromCookie()
      : getMoblieNoFromCookie();
    return {
      name: { value: buyerName },
      mobile: { value: buyerMobile },
    };
  }

  function handleSimilarContactSellerClick(
    currentElement,
    stockLeadSuccess,
    stockLeadError,
    event
  ) {
    leadData = {};
    leadData = $(currentElement).data();
    event.preventDefault();
    if (updateCookiesValues()) {
      moveSimilarCarsSellerDetailsPop();
      getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
      return false;
    } else {
      return true;
    }
  }

  function unsetOneCLickViewText() {
    oneClickViewBtnText = false;
  }

  function isOneClickViewTextSet() {
    return oneClickViewBtnText;
  }

  function saveNegotiationData(profileId, mobile, negotiationPrice) {
    var data = {
      mobileNumber: mobile,
      priceOffered: negotiationPrice,
      profileId: profileId,
    };
    callSaveNegotiationApi(profileId, data);
  }

  function updateCookie(name, mobile) {
    var date, expires;
    date = new Date();
    date.setTime(date.getTime() + 15 * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
    document.cookie = "cookie_buyform_name=" + name + expires + "; path=/";
    document.cookie = "cookie_buyform_mobile=" + mobile + expires + "; path=/";
  }

  function handleOneClickCrp(
    e,
    currentElement,
    stockLeadSuccess,
    stockLeadError,
    setOneClickCrpHtml
  ) {
    e.preventDefault();
    leadData = {};
    leadData = $(currentElement).data();
    if (updateCookiesValues()) {
      getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
    } else {
      setOneClickCrpHtml();
    }
  }

  function handleMarketPriceClick(
    element,
    showNameErrorMsg,
    showMobileErrorMsg,
    showOtpErrorMsg,
    stockLeadSuccess,
    stockLeadError
  ) {
    isLeadFormActive = true;
    formData = document.cmp_buyer_form;
    var buyerName = formData.name.value;
    var buyerMobile = formData.mobile.value;
    leadData = element.dataset;
    var listingId = leadData.listingid;
    if (
      !validateLeadFormData(
        formData,
        otpFieldEnabled,
        showNameErrorMsg,
        showMobileErrorMsg,
        showOtpErrorMsg
      )
    ) {
      return false;
    }
    var requestData = {
      listingId: listingId,
      name: buyerName,
      phone: buyerMobile,
      originId: leadData.originid,
      leadType: getLeadTypeForPopup(leadData.popuptype),
      rank: leadData.rank,
      slotId: leadData.slotid,
      cityId: getLeadCityIdV2(),
      shouldGrantWhatsAppConsent: $('.buyer-process__consent-checkbox').is(":checked"),
    };
    var request = getStockLeadRequestData(requestData);
    callStockLeadApi(request, stockLeadSuccess, stockLeadError);
  }

  function getLeadData() {
    return leadData;
  }

  function getLastSellerMobile() {
    return lastSellerMobile;
  }

  function gtmShare(type) {
    if (__share_open) {
      sh_share_open('');
    } else {
      sh_share('fb');
    }
    if (type == 'fb') {
      _gtm_push('Used Cars Results Page', 'Social share', 'facebook share', 'eventUsed Cars Results Page');
      return true;
    }
    if (type == 'gp') {
      _gtm_push('Used Cars Results Page', 'Social share', 'google plus share', 'eventUsed Cars Results Page');
      return true;
    }
    if (type == 'tw') {
      _gtm_push('Used Cars Results Page', 'Social share', 'twitter share', 'eventUsed Cars Results Page');
      return true;
    }
    if (type == 'wp') {
      _gtm_push('Used Cars Results Page', 'Social share', 'whatsapp share', 'eventUsed Cars Results Page');
      return true;
    }
    if (type == 'email') {
      _gtm_push('Used Cars Results Page', 'Social share', 'email share', 'eventUsed Cars Results Page');
      return true;
    }
    if (type == 'sms') {
      _gtm_push('Used Cars Results Page', 'Social share', 'sms share', 'eventUsed Cars Results Page');
      return true;
    }
    return false;
  }

function getOtp() {
  return document.getElementById("buyerOtp");
}

  return {
    isOneClickViewTextSet: isOneClickViewTextSet,
    unsetOneCLickViewText: unsetOneCLickViewText,
    validateName: validateName,
    validateMobile: validateMobile,
    resendOTPCRP: resendOTPCRP,
    handleDisableOTPCRP: handleDisableOTPCRP,
    setLeadData: setLeadData,
    prefilBuyerDetails: prefilBuyerDetails,
    updateCookiesValues: updateCookiesValues,
    handleStockLeadSuccess: handleStockLeadSuccess,
    handleStockLeadError: handleStockLeadError,
    resetForm: resetForm,
    resetFormWithTracking: resetFormWithTracking,
    handleShowBuyerFormPopup: handleShowBuyerFormPopup,
    handleCloseBuyerFormWithTracking: handleCloseBuyerFormWithTracking,
    handleResendOtp: handleResendOtp,
    handleOpenOTPForm: handleOpenOTPForm,
    removeBodyScroll: removeBodyScroll,
    negotiationSubmitLead: negotiationSubmitLead,
    handleSimilarContactSellerClick: handleSimilarContactSellerClick,
    addBodyScroll: addBodyScroll,
    handleSetOneClickViewDetails: handleSetOneClickViewDetails,
    getPreVerifiedDetails: getPreVerifiedDetails,
    handleVerifyBuyerOtp: handleVerifyBuyerOtp,
    handleOneClickCrp: handleOneClickCrp,
    submitAbsureLead: submitAbsureLead,
    moveSimilarCarsSellerDetailsPop: moveSimilarCarsSellerDetailsPop,
    handleMarketPriceClick: handleMarketPriceClick,
    getLeadData: getLeadData,
    getLastSellerMobile: getLastSellerMobile,
    gtmShare: gtmShare,
    setLeadDataV2: setLeadDataV2,
    handleRecommendationError: handleRecommendationError,
    formcookies: formcookies,
    getOtp: getOtp,
  };
})();