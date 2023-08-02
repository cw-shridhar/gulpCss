var pageId = parseInt($("#pageId").val(), 10);
var originId = 0;
var cityName = $("#cityName").val();
var redirectToWhatsapp = null;
if (!cityName) {
  cityName = "India"
}
if (pageId === 5) {
  originId = checkPlatform.IsAndroid() ? ANDROID_USED_SEARCH_PAGE_CROSS_SELLING_ORIGIN_ID : MSITE_USED_SEARCH_PAGE_CROSS_SELLING_ORIGIN_ID;
} else if (pageId === 6) {
  originId = checkPlatform.IsAndroid() ? ANDROID_USED_CAR_DETAILS_PAGE_CROSS_SELLING_ORIGIN_ID : MSITE_USED_CAR_DETAILS_PAGE_CROSS_SELLING_ORIGIN_ID;
}

var profileIds = "";

var buyerFormV2Msite = (function () {
  var toastElementId = "toast";
  var cookies = buyerFormV2.formcookies();
  var isRecommendationScreenActive = false;

  function showBuyerFormHtml() {
    $("#overlay2").css("display", "none");
    $("#cl-loaderblk").hide();
    $("#PL_popup_background").hide();
    $("#PL_popup").hide();
    $("body").css({ overflow: "hidden" });
    $(".lead-form-popup").show();
    var leadData = buyerFormV2.getLeadData();
    if (leadData.carname && leadData.carname !== "") {
      $(".buyer-process__subtitle").text(leadData.carname);
    }
  }

  function showNameErrorMsg(errorMessage) {
    if (errorMessage !== "") {
      $("#invalidNameText").html(errorMessage);
    } else {
      $("#invalidNameText").html("");
    }
  }

  function showMobileErrorMsg(errorMessage) {
    if (errorMessage !== "") {
      $("#invalidMobileText").html(errorMessage);
    } else {
      $("#invalidMobileText").html("");
    }
  }

  function setOneClickViewDetailsHtml() {
    $(".contact-seller-btn-class").each(function () {
      $(".one-click").html(
        '<span class="onetime">1-CLICK</span>&nbsp;<span class="onetimeview">VIEW DETAILS</span>'
      );
    });
  }

  //Function to display the recommendation list
  function showRecommendationHtml(data, redirectToWhatsapp = undefined) {
    window.redirectToWhatsapp = redirectToWhatsapp;
    if (!data) {
      return;
    }
    if (data.length === 0) {
      analytics.trackAction(
        "CTInteractive",
        getCategoryBasedOnOriginId(originId),
        "LeadRecommendationsNotAvailable",
        "City:" + cityName + " | ProfileID:"
      );
      if (window.redirectToWhatsapp) {
        window.redirectToWhatsapp();
        return;
      }
      $('.recommendation-card__selection').hide();
      $('.recommendation-title').hide();
      $(".recommendation-submit-button").hide();
    }
    else {
      data = data.slice(0, 4);
      var recommendationList = "";
      profileIds = "";
      for (var index in data) {
        recommendationList += getRecommendationHtml(data[index], index);
        profileIds += " " + data[index].profileId + ",";
      }
      if (profileIds.length > 1) { // Remove last comma 
        profileIds = profileIds.substring(0, profileIds.length - 1);
      }
      //Condition to check if atleast one of them is a Dealer Stock
      var isDealerStock = data.some(stock => stock.profileId.toUpperCase().includes("D"));
      if (!isDealerStock) {
        analytics.trackAction(
          "CTInteractive",
          getCategoryBasedOnOriginId(originId),
          "LeadRecommendationsIndividualCars",
          "City: " + cityName + " | ProfileID:" + profileIds
        );
      }
      var parentContainer = $(".recommendation-list");
      parentContainer.empty();
      parentContainer.append(recommendationList);
      $('#recommendation__checkbox').prop('checked', true);
      $(".recommendation-card__stock_name").addClass("margin-right-18");
      $(".recommendation-card__seller-details").hide();
      $(".recommendation-card__interested-button").hide();
      $(".recommendation-submit-button-wrapper").show();
      $(".recommendation-submit-button").show();
      $(".recommendation-end-button").hide();
      $('.recommendation-title').show();
      analytics.trackAction(
        "CTInteractive",
        getCategoryBasedOnOriginId(originId),
        "LeadRecommendationsShown",
        "City: " + cityName + " | ProfileID:" + profileIds
      );
      recommendationCardChecksListener();
    }
    $(".recommendation_popup_background").css("display", "block");
    $("body").css("overflow", "hidden");
    $(".recommendation-container").show();
    if (redirectToWhatsapp) {
      $(".seller-details-slug").hide();
      $(".recommendation-title").hide();
      $(".buyer-process__title").text("Cars suggested for you from other Dealers");
      $("#recommendation-submit").text("Interested");
      $("#recommendation-done").text("Proceed to WhatsApp")
      $("#recommendation-skip").text("Skip Similar Cars and Proceed to WhatsApp");
      $(".recommendation-title-wrapper").css("flex-direction", "row-reverse");
      $(".recommendation-card__selection").addClass("mt-3");
      $(".recommendation-card__selection").addClass("mb-11");
      $(".close_recommendation_popup").addClass("mb-16");
      $(".whatsapp-lead-text-wrapper").show();
    }
    window.history.pushState(null, ""); // push state of recommendation view
    isRecommendationScreenActive = true;
  }

  //Function to get the recommendation card template
  function getRecommendationHtml(stockData, index) {
    var nodeString = $(".recommendation-card-template").html();
    if (stockData) {
      nodeString = nodeString.replaceAll(/\{\{cardIndex\}\}/gi, index);
      nodeString = nodeString.replaceAll(/\{\{stockMainImage\}\}/gi, stockData.imageFullUrl);
      nodeString = nodeString.replaceAll("data-src", "src");
      nodeString = nodeString.replaceAll(/\{\{makeYear\}\}/gi, stockData.makeYear);
      nodeString = nodeString.replaceAll(/\{\{carName\}\}/gi, stockData.carName);
      nodeString = nodeString.replaceAll(/\{\{carPrice\}\}/gi, stockData.price);
      nodeString = nodeString.replaceAll(/\{\{kms\}\}/gi, stockData.kms);
      nodeString = nodeString.replaceAll(/\{\{fuel\}\}/gi, stockData.fuel);
      nodeString = nodeString.replaceAll(/\{\{cityName\}\}/gi, stockData.cityName);
      nodeString = nodeString.replaceAll(/\{\{profileId\}\}/gi, stockData.profileId);
    }
    var node = $("<div></div>").append(nodeString);
    return node.html();
  };

  //Callback function for recommendation lead response on individual button click
  function handleInterestedButtonLeadResponse(response, requestBody) {
    var seller = response.seller;
    if (!seller) {
      $("#recommendation-card-" + requestBody.profileId + " .seller-details-loader").hide();
      $("#recommendation-card-" + requestBody.profileId + " .recommendation-card__interested-button").show();
      buyerFormV2.handleRecommendationError(response);
      return;
    }
    var profileId = response.stock.profileId;
    var nodeString = $("#recommendation-card-" + profileId + " .recommendation-card__seller-details").html();
    nodeString = nodeString.replaceAll(/\{\{sellerName\}\}/gi, seller.name);
    nodeString = nodeString.replaceAll(/\{\{sellerPhoneNumber\}\}/gi, seller.mobile);
    $("#recommendation-card-" + profileId + " .recommendation-card__seller-details").empty();
    $("#recommendation-card-" + profileId + " .recommendation-card__seller-details").html(nodeString);
    $("#recommendation-card-" + profileId + " .seller-details-loader").hide();
    $("#recommendation-card-" + profileId + " .recommendation-card__seller-details").show();
  }

  //Function to handle interested button click of individual recommendation cards
  function interestedRecommendation(profileId, rank) {
    $("#recommendation-card-" + profileId + " .recommendation-card__interested-button").hide();
    $("#recommendation-card-" + profileId + " .seller-details-loader").show();
    buyerFormV2.setLeadDataV2(profileId, originId, "recommendation", 0, rank + 1);
    analytics.trackAction(
      "CTInteractive",
      getCategoryBasedOnOriginId(originId),
      "LeadRecommendationsClicked",
      "City: " + cityName + " | ProfileID:" + profileId
    );
    buyerFormV2.getPreVerifiedDetails(handleInterestedButtonLeadResponse, handleInterestedButtonLeadResponse);
  }

  var totalRecommendationCount = 0;
  //Callback function for recommendation lead response for selected cards
  function handleRecommendationLeadResponse(response, requestBody) {
    var seller = response.seller;
    if (seller == null) {
      $("#recommendation-card-" + requestBody.profileId + " .recommendation-card__interested-button").show();
      buyerFormV2.handleRecommendationError(response);
    }
    else {
      var nodeString = $("#recommendation-card-" + response.stock.profileId + " .recommendation-card__seller-details").html();
      nodeString = nodeString.replaceAll(/\{\{sellerName\}\}/gi, seller.name);
      nodeString = nodeString.replaceAll(/\{\{sellerPhoneNumber\}\}/gi, seller.mobile);
      $("#recommendation-card-" + response.stock.profileId + " .recommendation-card__seller-details").empty();
      $("#recommendation-card-" + response.stock.profileId + " .recommendation-card__seller-details").html(nodeString);
      $("#recommendation-card-" + response.stock.profileId + " .recommendation-card__seller-details").show();
    }
    totalRecommendationCount--;
    if (totalRecommendationCount === 0) {
      $(".recommendation-skeleton-loader").hide();
      $(".recommendation-card__stock_name").removeClass("margin-right-18");
      $(".recommendation-card").show();
      $(".recommendation-list .recommendation-skeleton-loader").remove();
      $(".recommendation-submit-button").hide();
      $("#recommendation-skip").hide();
      $("#recommendation-done").show();
    }
    if (window.redirectToWhatsapp) {
      return;
    }
  }

  //Function to submit selected recommendation cards as lead on interested button click
  function submitRecommendationsInterest() {
    var skeletonLoaderList = "";
    for (var i = 0; i < 4; i++) {
      skeletonLoaderList += $(".recommendation-skeleton-loader-template").html();
    }
    var popUpType = "wc";
    $(".recommendation-card").hide();
    $(".recommendation-card__selection").hide();
    $(".recommendation-list").append(skeletonLoaderList);
    $(".recommendation-skeleton-loader").show();

    //Sort recommendation cards based on selection
    $(".recommendation-list")
      .append($(".recommendation-list .recommendation-card")
        .sort((currentCard, compareCard) => {
          const currentCardIndex = currentCard.getAttribute("data-index"), compareCardIndex = compareCard.getAttribute("data-index");
          const currentCardIsSelected = $("#" + currentCard.id + " input[type='checkbox']:checked").length === 1;
          const compareCardIsSelected = $("#" + compareCard.id + " input[type='checkbox']:checked").length === 1;
          if (currentCardIsSelected && compareCardIsSelected) { // Both card is selected than sequence is based on same pervious index
            return currentCardIndex - compareCardIndex;
          }
          else if (currentCardIsSelected || compareCardIsSelected) { // If on of current and compare card is selected 
            return currentCardIsSelected ? -1 : 1; // than current is selected than current
            // will be above compare card else current card will be below it (-1 is for above) and (1 is for below)
          }
          return currentCardIndex - compareCardIndex; // No selection than It will same
        }));
    if (!window.redirectToWhatsapp) {
      popUpType = "recommendation";
    }
    var selectedProfileIds = "";
    $('.recommendation-list .recommendation-card-select input[type="checkbox"]').each(function () {
      if (!this.value) {
        return;
      }
      if (!this.checked) {
        $("#recommendation-card-" + this.value + " .recommendation-card__interested-button").show();
        return;
      }
      selectedProfileIds += this.value;
      totalRecommendationCount++;
      var rank = parseInt(this.getAttribute('data-index'), 10) + 1;
      buyerFormV2.setLeadDataV2(this.value, originId, popUpType, 0, rank);
      buyerFormV2.getPreVerifiedDetails(handleRecommendationLeadResponse, handleRecommendationLeadResponse); // handle error case
    });
    analytics.trackAction(
      "CTInteractive",
      getCategoryBasedOnOriginId(originId),
      "LeadRecommendationsClicked",
      "City: " + cityName + " | ProfileID:" + selectedProfileIds
    );
  }

  //Function to handle select all functionality for recommendations
  function recommendationSelectAllListener() {
    $('#recommendation__checkbox').change(function () {
      if (this.checked) {
        $('.recommendation-card-select input[type="checkbox"]').each(function () {
          this.checked = true;
        });
        $(".recommendation-submit-button").show();
        $("#recommendation-skip").hide();
      } else {
        $('.recommendation-card-select input[type="checkbox"]').each(function () {
          this.checked = false;
        });
        $("#recommendation-skip").show();
        $(".recommendation-submit-button").hide();
      }
    });
  }

  //Function to handle individual card selection of recommendations
  function recommendationCardChecksListener() {
    var recommendationsShown = $(".recommendation-list").children().length;
    $(".recommendation-card-select > input[type='checkbox']").change(function () {
      var recommendationsChecked = $(".recommendation-list  input[type='checkbox']:checked").length;
      if (this.checked) {
        $(".recommendation-submit-button").show();
        $("#recommendation-skip").hide();
        if (recommendationsChecked == recommendationsShown) {
          $('#recommendation__checkbox').prop('checked', true);
        }
      } else {
        if (recommendationsChecked === 0) {
          $("#recommendation-skip").show();
          $(".recommendation-submit-button").hide();
        }
        $('#recommendation__checkbox').prop('checked', false);
      }
    });
  }

  //Function to reset recommendations component
  function resetRecommendationCards() {
    $(".recommendation-card__selection").show();
    $(".recommendation-end-button").hide();
    $(".recommendation-submit-button").show();
    $(".recommendation-card__seller-details").hide();
    $(".recommendation-card__interested-button").hide();
    isRecommendationScreenActive = false;
  }

  function showSimilarCarsHtml(leadData, response) {
    var leadData = buyerFormV2.getLeadData();
    $("#PL_popup").css("display", "block");
    $("#PL_popup_background").show();
    $("body").css("overflow", "hidden");
    isRecommendationScreenActive = true;
    $("#cl-loaderblk").show();
    var type = "#PL";
    if (leadData["popuptype"] == "similar") {
      type = "#SM";
    }
    //if dealer
    var seller = response.seller;
    $("#similar_car_popup_close").hide();
    $("#popshareIcon").hide();
    $(type + "_popup_company").html(seller.name); // if individual => $(type + '_popup_company').html('');
    $(type + "_popup_seller_name").html(seller.contactPerson); // if individual => $(type + '_popup_seller_name').html(var_response['seller_name']);
    $(type + "_popup_address").html(seller.address); // if individual => $(type + '_popup_address').html(var_response['city']);
    $(type + "_popup_phone_icon_text").html(seller.mobile);
    $(type + "_popup_phone_icon_href").attr("href", "tel:" + seller.mobile);
    $(type + "_popup_call_href").attr("href", "tel:" + seller.mobile);
    $(type + "_warning_text").html(response.sellerDetailsWarningTipText);
    $(type + "_popup_form_block").hide();
    $(type + "_popup_response_block").show();
    if (type == "#PL") {
      $("#PL_popup").show();
    }
    $("#similar-cars,#similar-title").remove();
    $("#PL_popup").append(
      '<a id="close_view_similar_car_popup" href="javascript:void(0)" onclick="buyerFormV2Msite.close_view_similar_cars()" style="position: absolute;top: 18px;right: 20px;background: url(' + window.CloudfrontCDNHostURL + '/images-mobiles/btn_close-32x32_black.png) no-repeat top center;background-size: cover;width: 16px;height: 16px;font-size: 0px !important;display: block;"></a>'
    );
    $("#close_view_similar_car_popup").addClass("closeSimPopup2");
    $("#PL_popup").append(
      '<div id="similar-title">similar cars</div><div class="similar-cars" id="similar-cars"><div id="full-loader"><div class="mbldr"><img src="' + window.CloudfrontCDNHostURL + '/images-mobiles/mcloader2.png" width="300px" height="180px"></div><div class="mbldr"><img src="' + window.CloudfrontCDNHostURL + '/images-mobiles/mcloader2.png" width="300px" height="180px"></div><div class="mbldr"><img src="' + window.CloudfrontCDNHostURL + '/images-mobiles/mcloader2.png" width="300px" height="180px"></div></div></div>'
    );
    $("#PL_popup").attr("data-total-rows", 1).removeClass("keyboard");
    $("#cl-loaderblk").hide();
  }

  function setNoSimilarCarsHtml() {
    $("#similar-cars").append(
      '<div class="no-cars-msg"> <i> Sorry, no similar cars found.</i></div>'
    );
    $("#full-loader").addClass("hide");
  }

  function hideBuyerFormHtml() {
    if (!isRecommendationScreenActive) {
      $("body").css({ overflow: "scroll" });
    }
    $(".lead-form-popup").hide();
  }

  function hideBuyerFormOtpHtml() {
    if (!isRecommendationScreenActive) {
      $("body").css({ overflow: "scroll" });
    }
  }

  function setSimilarCarsHtml(data) {
    $("#PL_popup").addClass("move-top");
    var ind_cars, card_template, matches;
    var originId = 12;
    for (var carData in data) {
      ind_cars = data[carData];
      card_template = $("#card-template").html();
      matches = card_template.match(/\{\{(.*?)\}\}/gi);
      for (i in matches) {
        var map_val = matches[i].replace(/\{|\}/g, "").trim();
        if (map_val.length > 0) {
          card_template = card_template.replaceAll(
            "{{" + map_val + "}}",
            ind_cars[map_val]
          );
        }
      }
      var popup_type = "similar";
      var contact_data =
        'data-listingid="' +
        ind_cars["profileId"] +
        '" data-usertype="' +
        ind_cars["seller"] +
        '" data-userid="' +
        "" +
        '" data-popuptype="' +
        popup_type +
        '" data-city="' +
        ind_cars["cityName"] +
        '" data-cityId="' +
        ind_cars["cityId"] +
        '" data-mfgyear="' +
        ind_cars["makeYear"] +
        '" data-make="' +
        ind_cars["makeName"] +
        '" data-model="' +
        ind_cars["modelName"] +
        '" data-url="' +
        ind_cars["url"] +
        '" data-originid="' +
        originId +
        '" data-rank="' +
        (parseInt(carData) + 1) +
        '"';
      card_template = card_template.replaceAllManual(
        "[contact-data]",
        contact_data
      );
      card_html += card_template;
    }
    card_html = card_html.replaceAll(
      "data-src",
      "src"
    );
    $("#similar-cars").append(
      '<ul class="cards-list" data-testing-id="similar-cars-section">' +
      card_html +
      "</ul>"
    );
    $("#full-loader").addClass("hide");
  }

  String.prototype.replaceAllManual = function (search, replacement) {
    var index = 0;
    var string = this;
    do {
      string = string.replace(search, replacement);
    } while ((index = string.indexOf(search, index + 1)) > -1);
    return string;
  };

  function setResetForm() {
    $(".buyer-process__verified-otp").addClass("hide");
    $(".buyer-process__resend-otp--link").text("Resend OTP");
    $(".buyer-process__resend-otp--link").show();
    $(".buyer-process__resend-otp-count-down").hide();
    $("#buyerName").removeClass("buyer-process__input--disabled");
    $("#buyerMobile").removeClass("buyer-process__input--disabled");
    $(".buyer-process__change-number").addClass("hide");
  }

  function bindDisableOTPCRP() {
    $(document).on("click", ".check-right-back-otp", function (event) {
      $("#buyerName").prop("disabled", false);
      $("#buyerMobile").prop("disabled", false);
      $(".otp_from").css("display", "none");
      $(".step2_buttons").css("display", "none");
      $(".step1_buttons").css("display", "block");
      $("#buyerName,#buyerMobile").removeClass("disab");
      $(".error_alert").html("");
      buyerFormV2.handleDisableOTPCRP();
      var resendText = document.getElementById("resend_txt");
      resendText.innerHTML = "";
    });
  }

  function closeSellerDetailsPopup() {
    $("#pl-similar_cars").removeClass("open").removeClass("response");
    $("#SM_popup_response_block,#overlay2").hide();
  }

  function stockLeadSuccess(response) {
    $(".cl-loaderblk").hide();
    buyerFormV2.handleStockLeadSuccess(
      response,
      showSimilarCarsHtml,
      setNoSimilarCarsHtml,
      setSimilarCarsHtml,
      hideBuyerFormHtml,
      showNameErrorMsg,
      showMobileErrorMsg,
      showOtpErrorMsg,
      bindSimilarContactSellerClick,
      setSimilarCarLeadData,
      PLATFORM.MSITE,
      showRecommendationHtml,
      hideBuyerFormOtpHtml
    );
    var leadData = buyerFormV2.getLeadData();
    if (leadData["popuptype"] === "shortlist-type") {
      processShortlistAfterSuccess(
        leadData.listingid,
        response.shortListMessage
      );
    }
    buyerFormV2.handleSetOneClickViewDetails(setOneClickViewDetailsHtml);
  }

  function processShortlistAfterSuccess(profileId, shortListMessage) {
    var idLeadFavourite = "#shortlist_button_" + profileId;
    if ($(idLeadFavourite).hasClass("shortlist-icon--inactive")) {
      $(idLeadFavourite).removeClass("shortlist-icon--inactive");
    }
    $(idLeadFavourite).addClass("shortlist-icon--active");
    if (checkFncIsDefined(handleShortListingLocalStorage)) {
      handleShortListingLocalStorage(profileId, true);
    }
    if (typeof showToast !== 'undefined' && typeof showToast === "function") {
      showToast(shortListMessage, toastElementId);
    }
    analytics.trackAction(
      "CWInteractive",
      getTrackingCategory(),
      shortlistSelectedTrackingAction,
      "profileId=" + profileId + "|platformid=301"
    );
  }

  function setSimilarCarLeadData(response, leadData) {
    var leadData = buyerFormV2.getLeadData();
    if (leadData["popuptype"] === "shortlist-type") {
      return;
    }
    $("#PL_popup").show();
    $("#PL_popup_background").show();
    $("body").css("overflow", "hidden");
    isRecommendationScreenActive = true;
    $("#cl-loaderblk").show();
    var type = "#PL";
    if (leadData["popuptype"] == "similar") {
      type = "#SM";
    }
    //if dealer
    var seller = response.seller;
    $('[data-listingid="' + leadData['listingid'] + '"]').not('[data-popuptype="absp"],[data-popuptype="view-similar-car"],[data-popuptype="short"],[data-popuptype="shortlist-type"],[data-popuptype="chat"],[data-popuptype="wc"],[data-popuptype="ng"],[data-leadtype="booknow"]').html('<img src="' + window.CloudfrontCDNHostURL + '/images-mobiles/icons/callSeller-white.png" class="callseller">' + seller.mobile);
    $("#similar_car_popup_close").hide();
    $("#popshareIcon").hide();
    $(type + "_popup_company").html(seller.name); // if individual => $(type + '_popup_company').html('');
    $(type + "_popup_seller_name").html(seller.contactPerson); // if individual => $(type + '_popup_seller_name').html(var_response['seller_name']);
    $(type + "_popup_address").html(seller.address); // if individual => $(type + '_popup_address').html(var_response['city']);
    $(type + "_popup_phone_icon_text").html(seller.mobile);
    $(type + "_popup_phone_icon_href").attr("href", "tel:" + seller.mobile);
    $(type + "_popup_call_href").attr("href", "tel:" + seller.mobile);
    $(type + "_warning_text").html(response.sellerDetailsWarningTipText);
    $(type + "_popup_form_block").hide();
    $(type + "_popup_response_block").show();
    $("#cl-loaderblk").hide();
  }

  function popupPhoneClick(calltype) {
    if (calltype == "callred") {
      _gtm_push('Used Cars Results Page', "Red color button clicked", location.href, 'event Used Cars');
    } else if (calltype == "call") {
      _gtm_push('Used Cars Results Page', "Call button clicked", location.href, 'event Used Cars');
    }
  }

  function callResetFormWithTracking() {
    buyerFormV2.resetFormWithTracking(
      showNameErrorMsg,
      showMobileErrorMsg,
      showOtpErrorMsg
    );
  }
  function ShowHideViewSimilarCarLink() {
    try {
      var cookies = formcookies();
      if (cookies["cookie_similarcar_lead_received"] != "ok") {
        var d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = "cookie_first_similarcars_show=1; expires=" + expires + "; path=/";
      }
      if (cookies["cookie_first_lead_submit"] != "dealer" && cookies["cookie_similarcar_lead_received"] != "ok") {
        $(".view-similar-cars-btn").css("display", "block");
      }
    } catch (e) { }
  }

  function PL_remove_focus_on_form_fields() {
    try {
      document.getElementById("PL_temp_focus").focus();
      $('#PL_popup_form input').removeClass('error').removeClass('success');
      $('#PL_popup_form PL_popup_alert').html('').removeClass('open');
    } catch (e) {
      console.log("ERROR:" + e);
    }
  }

  function closeSimilarLeadPopup(param) {
    //debugger;
    try { ShowHideViewSimilarCarLink(); } catch (e) { }
    PL_remove_focus_on_form_fields();
    try {
      leadData = buyerFormV2.getLeadData();
      listing_id = leadData['listingid'];
      $('#SM_popup_response_block,#overlay2').hide();
      var sellerMobile = buyerFormV2.getLastSellerMobile();
      if (sellerMobile) {
        $('[data-listingid="' + leadData['listingid'] + '"]').not('[data-popuptype="view-similar-car"],[data-popuptype="short"],[data-popuptype="chat"],[data-popuptype="wc"],[data-popuptype="shortlist-type"]').html('<img src="' + window.CloudfrontCDNHostURL + '/images-mobiles/icons/callSeller-white.png" class="callseller">' + sellerMobile);
      }
      if (param !== 1) {
        _gtm_push('Used Cars Results Page', "Done button clicked", location.href, 'event Used Cars');
      }
    } catch (e) {
      console.log("ERROR:" + e);
    }
  }

  function clickShare(type) {
    $(type + '_share-container').append($('#sh_share_id'));
    PL_prepare_share_icon();

    $('#sh_share_id').toggleClass('open');
    if ($('#sh_share_id').hasClass('open')) {
      _gtm_push('Used Cars Results Page', 'Share button clicked', 'click on share button', 'event Used Cars Results Page');
    }
  }

  function showOTPFieldHtml() {
    $(".buyer-process__change-number").on("click", callResetFormWithTracking);
    $("#otpInputField").removeClass("buyer-process__input--hide");
    $(".verifyOtp").show();
    $(document).on("blur", "#buyerOtp", function () {
      let leadData = buyerFormV2.getLeadData();
      fireInteractiveGATracking(null, otpEntryTrackingAction, getTrackingLabel(leadData));
    });
    $(".submitDetails").hide();
    $("#buyerName").addClass("buyer-process__input--disabled");
    $("#buyerMobile").addClass("buyer-process__input--disabled");
    $(".buyer-process__change-number").removeClass("hide");
  }

  function stockLeadError(xhr, requestBody) {
    $("#cl-loaderblk").hide();
    buyerFormV2.handleStockLeadError(
      xhr,
      requestBody,
      showBuyerFormHtml,
      showOTPFieldHtml
    );
  }

  function showModal() {
    $(document).on("click", ".get-seller-details", function (event) {
      event.preventDefault();
      $("#pl-similar_cars").removeClass("open").removeClass("response");
      //remove while migrating similar cars for buy buyerformv2
      $("#left-person-lead-panel").removeClass("clicksmbtnout");
      closeAbsurePopupOnBuyerProcessOpen($(this).data().originid);
      resetLeadPopupText();
      buyerFormV2.prefilBuyerDetails();
      buyerFormV2.setLeadData(event);
      if (buyerFormV2.updateCookiesValues()) {
        closeSellerDetailsPopup();
        $(".cl-loaderblk").show();
        buyerFormV2.getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
      } else {
        var buyProcessContainer = $(".buyer-process__title");
        var buyerProcessContainerSubTitle = $(".buyer-process__subtitle");
        if (
          buyProcessContainer &&
          buyerProcessContainerSubTitle &&
          event &&
          event.currentTarget &&
          event.currentTarget.dataset &&
          event.currentTarget.dataset["popuptype"] === "HomeTestDrive"
        ) {
          buyProcessContainer.text("Contact for Test Drive");
          buyerProcessContainerSubTitle.text("Please get in touch with the seller for more details.");
        }
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.MSITE);
        showBuyerFormHtml();
      }
    });
  }

  function handleShortListing() {
    $(document).on("click", ".shortlist-lead-btn", function (event) {
      event.preventDefault();
      window.location.hash = "SHL";
      var profileId = $(event.currentTarget).data().listingid;
      var idLeadFavourite = "#shortlist_button_" + profileId;
      if ($(idLeadFavourite).hasClass("shortlist-icon--active")) {
        $(idLeadFavourite).removeClass("shortlist-icon--active");
        $(idLeadFavourite).addClass("shortlist-icon--inactive");
        if (checkFncIsDefined(handleShortListingLocalStorage)) {
          handleShortListingLocalStorage(profileId, false);
        }
        analytics.trackAction(
          "CWInteractive",
          getTrackingCategory(),
          shortlistRemovedTrackingAction,
          "profileId=" + profileId + "|platformid=301"
        );
        return;
      }
      buyerFormV2.prefilBuyerDetails();
      buyerFormV2.setLeadData(event);
      if (buyerFormV2.updateCookiesValues()) {
        closeSellerDetailsPopup();
        $("#cl-loaderblk").show();
        buyerFormV2.getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
      } else {
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.MSITE);
        showBuyerFormHtml();
      }
    });
  }

  function handleChatLead() {
    $(document).on("click", ".chat-lead-btn", function (event) {
      event.preventDefault();
      window.location.hash = "CP";
      closeAbsurePopupOnBuyerProcessOpen($(this).data().originid);
      buyerFormV2.prefilBuyerDetails();
      buyerFormV2.setLeadData(event);
      if (buyerFormV2.updateCookiesValues()) {
        closeSellerDetailsPopup();
        $("#cl-loaderblk").show();
        buyerFormV2.getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
      } else {
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.MSITE);
        showBuyerFormHtml();
      }
    });
  }

  function callCloseBuyerFormWithTracking() {
    buyerFormV2.handleCloseBuyerFormWithTracking(
      hideBuyerFormHtml,
      showNameErrorMsg,
      showMobileErrorMsg,
      showOtpErrorMsg,
      PLATFORM.MSITE
    );
  }

  function closeModalEventListener() {
    $(".lead-form-close-btn").on("click", callCloseBuyerFormWithTracking);
  }

  function setResendOtpTimer(countDown) {
    $(".buyer-process__resend-otp-count-down").text(
      "Resend OTP in " + countDown + " sec"
    );
  }

  function resendOtp() {
    if (
      !buyerFormV2.handleResendOtp(
        setResendOtpTimer,
        showResendOtpButton,
        OtpLimitReached
      )
    ) {
      return;
    }
    $(".buyer-process__resend-otp--link").hide();
    $(".buyer-process__resend-otp-count-down").text(
      "Resend OTP in 30 sec"
    );
    $(".buyer-process__resend-otp-count-down").show();
  }

  function bindResendOtpLinkEvent() {
    $(".buyer-process__resend-otp--link").off("click", resendOtp);
    $(".buyer-process__resend-otp--link").on("click", resendOtp);
  }

  function showResendOtpButton() {
    $(".buyer-process__resend-otp-count-down").hide();
    $(".buyer-process__resend-otp--link").show();
  }

  function OtpLimitReached() {
    $(".buyer-process__resend-otp--link").text("OTP sent to Mobile");
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

  function bindInputFieldValues() {
    $(".buyer-process__input-container input").off("input", _inputEvent);
    $(".buyer-process__input-container input").on("input", _inputEvent);
    $(".buyer-process__input-container input").off("blur", _bindInputBlur);
    $(".buyer-process__input-container input").on("blur", _bindInputBlur);
  }

  function bindInputChangeEvents() {
    $(document).on("blur", "#buyerName", function () {
      let leadData = buyerFormV2.getLeadData();
      fireInteractiveGATracking(null, formNameTrackingAction, getTrackingLabel(leadData));
    });
    $(document).on("blur", "#buyerMobile", function () {
      let leadData = buyerFormV2.getLeadData();
      fireInteractiveGATracking(null, formPhoneTrackingAction, getTrackingLabel(leadData));
    });
    $(document).on("keyup blur", "input#buyerName", function (event) {
      buyerFormV2.validateName(this.value, showNameErrorMsg);
    });
    $(document).on("keyup blur", "input#buyerMobile", function (event) {
      buyerFormV2.validateMobile(this.value, showMobileErrorMsg);
    });
  }

  function openOTPForm() {
    buyerFormV2.handleOpenOTPForm(
      stockLeadSuccess,
      stockLeadError,
      showNameErrorMsg,
      showMobileErrorMsg,
      showOtpErrorMsg
    );
  }

  function showOtpErrorMsg(errorMessage) {
    $(".cl-loaderblk").hide();
    if (errorMessage !== "") {
      $("#invalidOtpText").html(errorMessage);
    } else {
      $("#invalidOtpText").html("");
    }
  }

  function verifyBuyerOtp() {
    buyerFormV2.handleVerifyBuyerOtp(
      stockLeadSuccess,
      stockLeadError,
      showOtpErrorMsg,
      showNameErrorMsg,
      showMobileErrorMsg
    );
  }

  function bindLeadFormSubmit() {
    $(document).on("click", ".submitDetails", openOTPForm);
    $(document).on("click", ".verifyOtp", verifyBuyerOtp);
  }

  function bindNegotiationLead() {
    $(document).on("click", "#negotiatesubmit", function (e) {
      e.preventDefault();
      $(".cl-loaderblk").show();
      closeSellerDetailsPopup();
      if ($("#negotiateprice").val() === "") {
        document.getElementById("error_price").style.color = "red";
        return false;
      }
      var shouldShowBuyerForm = buyerFormV2.negotiationSubmitLead(
        e.currentTarget,
        stockLeadSuccess,
        stockLeadError,
        hideNegotiatePopupAndbodyScroll,
        PLATFORM.MSITE
      );
      buyerFormV2.setLeadData(e);
      if (shouldShowBuyerForm) {
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.MSITE);
        showBuyerFormHtml();
      }
    });
  }

  function close_view_similar_cars() {
    $("body").css("overflow", "scroll");
    $("#PL_popup,#PL_popup_background,#PL_popup_response_block").hide();
    //$("#close_view_similar_car_popup").remove();
    $(".ol-loader").hide();
    $("body").removeClass("ver-hidden");
    if (buyerFormV2.viewSimilarCarButtonOpened) {
      _gtm_push(
        "Used Cars Results Page",
        "Similar Car|close",
        location.href,
        "event close"
      );
    }
    isRecommendationScreenActive = false;
  }

  //Called for skipping recommendation popup with tracking
  function skipRecommendations() {
    var isRecommendationsGiven = $('#recommendation-done').is(":visible");
    if (profileIds && !isRecommendationsGiven) {
      analytics.trackAction(
        "CTInteractive",
        getCategoryBasedOnOriginId(originId),
        "LeadRecommendationsSkipped",
        "City: " + cityName + " | ProfileID:" + profileIds
      );
    }
    closeViewRecommendationCars();
    if (window.redirectToWhatsapp) {
      window.redirectToWhatsapp();
    }
  }

  function closeViewRecommendationCars() {
    $("body").css("overflow", "scroll");
    $(".recommendation-container").hide();
    $(".recommendation-list").empty();
    $(".recommendation_popup_background").hide();
    $(".seller-details-slug").show();
    $(".recommendation-title").show();
    $(".buyer-process__title").text("Seller Details");
    $("#recommendation-submit").text("Interested");
    $("#recommendation-done").text("DONE");
    $("#recommendation-skip").text("Skip");
    $(".recommendation-title-wrapper").css("flex-direction", "");
    $(".recommendation-card__selection").removeClass("mt-3");
    $(".recommendation-card__selection").removeClass("mb-11");
    $(".close_recommendation_popup").removeClass("mb-16");
    $(".whatsapp-lead-text-wrapper").hide();
    resetRecommendationCards();
    if (window.redirectToWhatsapp) {
      window.redirectToWhatsapp();
      return;
    }
  }

  function bindSimilarContactSellerClick() {
    $(document).on("click", ".similar-contact-seller-btn", function (e) {
      e.preventDefault();
      buyerFormV2.setLeadData(this);
      $(this).html('Loading....');
      var shouldShowBuyerForm = buyerFormV2.handleSimilarContactSellerClick(
        this,
        stockLeadSuccess,
        stockLeadError,
        e
      );
      if (shouldShowBuyerForm) {
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.MSITE);
        showBuyerFormHtml();
      }
      window.location.hash = 'PL&SL';
      $('#overlay2').show();
    });
  }

  function bindSellerDetailsClose() {
    $(document).on("click", "#similar-popup-close", function () {
      $("#pl_over_lay,#person-lead-panel").removeClass("open");
      closeSellerDetailsPopup();
    });
    $(document).on("click", "#pl-similar_cars", closeSellerDetailsPopup);
  }

  function setOneClickViewDetails() {
    buyerFormV2.handleSetOneClickViewDetails(setOneClickViewDetailsHtml);
  }

  // get profileid of shortlisted cars and active them on page load
  function getFavouritesFromStorage() {
    var favourites = getValue(shortListingStorageKey);
    for (var i in favourites) {
      var idLeadFavourite =
        "#shortlist_button_" + favourites[i].toUpperCase().trim();
      $(idLeadFavourite)
        .removeClass("shortlist-icon--inactive")
        .addClass("shortlist-icon--active");
    }
  }

  function closeAbsurePopupOnBuyerProcessOpen(originId) {
    if (parseInt(originId, 10) === 82) {
      $("#popup__absurescript").hide();
    }
  }

  function hideNegotiatePopupAndbodyScroll() {
    $("#negotiate_popup-script").hide();
    $("#idbybody").css({
      overflow: "visible",
    });
  }

  function resetLeadPopupText() {
    var buyProcessContainer = $(".buyerProcessContainerTitle");
    var buyerProcessContainerSubTitle = $(".buyerProcessContainerSubTitle");
    if (!buyProcessContainer || !buyerProcessContainerSubTitle) {
      return;
    }
    buyProcessContainer.text("See Seller Details");
    buyerProcessContainerSubTitle.text(
      "Enter your name and mobile number to instantly see this seller's details."
    );
  }

  function bindAbsureLead() {
    $("#link__getthesebenifits").on("click", function (e) {
      e.preventDefault();
      buyerFormV2.prefilBuyerDetails();
      buyerFormV2.setLeadData(e);
      if (buyerFormV2.updateCookiesValues()) {
        closeSellerDetailsPopup();
        $("#cl-loaderblk").show();
        buyerFormV2.getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
      } else {
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.MSITE);
        showBuyerFormHtml();
      }
    });
  }

  function requestPhoto() {
    $(document).on("click", "#listingPhotoRequestButton", function (event) {
      event.preventDefault();
      var requestButton = event.target || event.srcElement;
      var elementSelector = $(requestButton).parent().children();
      var loader = elementSelector.closest('#listingResponseFetchingLoader');
      var errorToast = elementSelector.closest('#listingPhotoRequestErrorToast');
      var successMessage = elementSelector.closest('#listingPhotoRequestSuccessText');
      $(requestButton).hide();
      $(loader).css('display', 'block');
      var profileId = $("#listingPhotoRequestButton").attr("profile-id");
      var settings = {
        url: "/api/stocks/" + profileId + "/images/uploadrequest/",
        type: "POST",
        headers: { ServerDomain: "CarWale" },
      };
      $.ajax(settings)
        .done(function (response) {
          $(loader).hide();
          $(successMessage).show();
        })
        .fail(function (xhr) {
          $(loader).hide();
          $(errorToast).show().delay(3000).fadeOut();
          $(requestButton).show();
        });
    });
  }

  function registerEvents() {
    bindDisableOTPCRP();
    showModal();
    handleShortListing();
    handleChatLead();
    closeModalEventListener();
    bindResendOtpLinkEvent();
    bindInputFieldValues();
    bindInputChangeEvents();
    bindLeadFormSubmit();
    bindNegotiationLead();
    bindSimilarContactSellerClick();
    bindSellerDetailsClose();
    setOneClickViewDetails();
    bindAbsureLead();
    requestPhoto();
    recommendationSelectAllListener();
  }

  return {
    registerEvents: registerEvents,
    close_view_similar_cars: close_view_similar_cars,
    getFavouritesFromStorage: getFavouritesFromStorage,
    closeSimilarLeadPopup: closeSimilarLeadPopup,
    popupPhoneClick: popupPhoneClick,
    closeViewRecommendationCars: closeViewRecommendationCars,
    submitRecommendationsInterest: submitRecommendationsInterest,
    interestedRecommendation: interestedRecommendation,
    skipRecommendations: skipRecommendations
  };
})();

$(document).ready(function () {
  buyerFormV2Msite.registerEvents();
  buyerFormV2Msite.getFavouritesFromStorage();
});