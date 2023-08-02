var buyerFormV2Desktop = (function () {
  var userCookies = buyerFormV2.formcookies();
  var pageId = $("#pageId").val();
  var originId = 0;
  var profileIds = "";
  if (parseInt(pageId, 10) === 5)
  {
    originId = DESKTOP_USED_SEARCH_PAGE_CROSS_SELLING_ORIGIN_ID;
  } else {
    originId = DESKTOP_USED_CAR_DETAILS_PAGE_CROSS_SELLING_ORIGIN_ID;
  }
  var cityName = userCookies["cd-city-ct"];
  if (!cityName) {
    cityName = "India"
  }
  function showBuyerFormHtml() {
    $("#cl-loaderblk").hide();
    $(".buyer-process-bg-modal").show();
    $(".buyer-process-container").show();
  }

  function addBodyScroll() {
    $("body").css("overflow-y", "scroll");
  }

  function removeBodyScroll() {
    $("body").css("overflow-y", "hidden");
  }

  function setMobileNumberHtml(sellerDetails) {
    var sellerHtml =
      "<img width=\"38\" src=\"" + window.CloudfrontCDNHostURL + "/images4/call_sub.png\"><strong id=\"seller_mobile\">" +
      sellerDetails.mobile +
      "</strong><br class=\"bgdown\"> <span>View Seller Details</span>";
    var leadData = buyerFormV2.getLeadData();
    if (!buyerFormV2.viewSimilarCarButtonOpened) {
      if (
        leadData["popuptype"] === "fl-fr" ||
        leadData["popuptype"] === "frchat"
      ) {
        $(
          "[data-listingid=\"" +
          leadData["listingid"] +
          "\"][data-popuptype=\"fl-fr\"]"
        )
          .addClass("view-more-btn")
          .html(sellerHtml)
          .not("[data-view-similar=\"btn\"]");
      } else if (
        leadData["popuptype"] === "fl" ||
        leadData["popuptype"] === "flchat"
      ) {
        $(
          "[data-listingid=\"" +
          leadData["listingid"] +
          "\"][data-popuptype=\"fl\"]"
        )
          .addClass("view-more-btn")
          .html(sellerHtml)
          .not("[data-view-similar=\"btn\"]");
      } else if (
        leadData["popuptype"] === "fl-dl" ||
        leadData["popuptype"] === "dlchat"
      ) {
        $(
          "[data-listingid=\"" +
          leadData["listingid"] +
          "\"][data-popuptype=\"fl-dl\"]"
        )
          .addClass("view-more-btn")
          .html(sellerHtml)
          .not("[data-view-similar=\"btn\"]");
      } else if (
        leadData["popuptype"] === "check_right" ||
        leadData["popuptype"] === "image_gallery"
      ) {
        document.querySelector("#inline-form").style.display = "none";
        document.querySelector("#seller_dealer").style.display = "block";
        var htmlPart =
          "<strong>" +
          sellerDetails.name +
          "</strong><br>" +
          sellerDetails.address +
          "<br><br><div class=\"phicond phds\">" +
          sellerDetails.mobile +
          "</div>";
        $("#dealer_details").html(htmlPart);
      } else {
        $(
          "[data-listingid=\"" +
          leadData["listingid"] +
          "\"][data-popuptype=\"normal\"],[data-listingid=\"" +
          leadData["listingid"] +
          "\"][data-popuptype=\"new\"],[data-listingid=\"" +
          leadData["listingid"] +
          "\"][data-popuptype=\"similar\"],[data-listingid=\"" +
          leadData["listingid"] +
          "\"][data-popuptype=\"fl\"]"
        )
          .addClass("view-more-btn")
          .html(sellerHtml)
          .not("[data-view-similar=\"btn\"]");
      }
    } else {
      $(
        "[data-listingid=\"" +
        leadData["listingid"] +
        "\"][data-popuptype=\"similar\"]"
      )
        .addClass("view-more-btn")
        .html(sellerHtml)
        .not("[data-view-similar=\"btn\"]");
    }
  }

  function setOneClickViewDetailsHtml() {
    $(".contact-seller-btn-class").each(function () {
      $(".one-click").html(
        '<span class="onetime">1-CLICK</span>&nbsp;<span class="onetimeview">VIEW DETAILS</span>'
      );
    });
  }

  function setNoSimilarCarsHtml() {
    $("#PL_similar_car_container").html(
      '<div class="error-msg"> <em>Sorry, no similar cars found.</em></div>'
    );
    $("#person-lead-panel #full-loader").addClass("hide");
  }

  function setSimilarCarsHtml(data) {
    var card_template = "";
    for (n in data) {
      var ind_cars = data[n];
      card_template = $("#card-template").html();
      var matches = card_template.match(/\{\{(.*?)\}\}/gi);
      for (i in matches) {
        var map_val = matches[i].replace(/\{|\}/g, "").trim();
        if (map_val.length > 0) {
          if (map_val === "imagefullurl") {
            card_template = card_template.replaceAll(
              "{{" + map_val + "}}",
              "src=" + ind_cars["imageFullUrl"]
            );
          } else if (map_val === "certifiedLogoUrl") {
            if (
              ind_cars["certifiedLogoUrl"] &&
              ind_cars["certifiedLogoUrl"].length > 0
            ) {
              card_template = card_template.replaceAll(
                "{{" + map_val + "}}",
                "<img src=" + ind_cars["certifiedLogoUrl"] + ">"
              );
            } else {
              card_template = card_template.replaceAll(
                "{{" + map_val + "}}",
                ""
              );
            }
          } else {
            card_template = card_template.replaceAll(
              "{{" + map_val + "}}",
              ind_cars[map_val]
            );
          }
        }
      }
      card_html += card_template;
    }
    $("#PL_similar_car_container").html(card_html);
    $("#person-lead-panel #full-loader").addClass("hide");
    setTimeout(function () {
      $("#person-lead-panel #full-loader").hide();
    }, 500);
  }

  function showSimilarCarsHtml(leadData, response) {
    $("#left-person-lead-panel").addClass("clicksmbtnout");
    $("#cl-loaderblk").show();
    $("#PL_person_thumb").attr("src", response.stock.mainImageUrl);
    $("#PL_person_car_title").html(
      response.stock.carName + " (" + response.stock.year + ")"
    );
    $("#PL_person_car_price").html(
      '<span class="rupee_font">&#x20B9;</span>&nbsp;' + response.stock.price
    );
    document.querySelector(".clicksmbtn").style.display = "block";

    $("#PL_person_details").html(
      '<strong id="PL_person_name">' +
      response.seller.name +
      "</strong><br>" +
      response.seller.address +
      '<br><strong style="color:#D10;">Mobile: </strong><span id="PL_person_mobile">' +
      response.seller.mobile +
      '</span><br><br><span class="buyer-form-disclaimer">' +
      response.sellerDetailsWarningTipText +
      "</span><br>"
    );
    $("#cl-loaderblk").hide();
    $("#pl_over_lay,#person-lead-panel").addClass("open");
  }

  function hideBuyerFormHtml() {
    $(".buyer-process-bg-modal").hide();
    $(".buyer-process-container").hide();
  }

  function bindDisableOTPCRP() {
    $(document).on("click", ".check-right-back-otp", function (event) {
      otpFieldEnabled = false;
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
  }

  function showNameErrorMsg(errorMessage) {
    if (errorMessage !== "") {
      $("#invalidNameText").html(errorMessage);
    } else {
      $("#invalidNameText").html("");
    }
  }

  function showCrpNameErrorMsg(errorMessage) {
    if (errorMessage !== "") {
      $("#invalidCrpNameText").html(errorMessage);
    } else {
      $("#invalidCrpNameText").html("");
    }
  }

  function showMobileErrorMsg(errorMessage) {
    if (errorMessage !== "") {
      $("#invalidMobileText").html(errorMessage);
    } else {
      $("#invalidMobileText").html("");
    }
  }

  function showCrpMobileErrorMsg(errorMessage) {
    if (errorMessage !== "") {
      $("#invalidCrpMobileText").html(errorMessage);
    } else {
      $("#invalidCrpMobileText").html("");
    }
  }

  function showOtpErrorMsg(errorMessage) {
    $("#cl-loaderblk").hide();
    if (errorMessage !== "") {
      $("#invalidOtpText").html(errorMessage);
    } else {
      $("#invalidOtpText").html("");
    }
  }

  function stockLeadSuccess(response) {
    $("#cl-loaderblk").hide();
    buyerFormV2.handleStockLeadSuccess(
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
      PLATFORM.DESKTOP,
    );
    if (setMobileNumberHtml
        && response.seller
        && !!response.stock && response.stock.isDealer
        )
      {
        setMobileNumberHtml(response.seller);
      }
    buyerFormV2.handleSetOneClickViewDetails(setOneClickViewDetailsHtml);
  }

  function setSimilarCarLeadData(response) {
    document.querySelector("#dealerdts").style.display = "block";
    $(".PL-csellerPop").addClass("responce");
    $(".PL-csellerPop").addClass("open");
    $(".PL-csellerPop").addClass("right-15");
    $("#dealerdts").html(
      "<strong>" +
      response.seller.name +
      "</strong><br>" +
      response.seller.address +
      '<br><strong style="color:#D10;">Mobile: </strong><span id="dealerdts_mobile">' +
      response.seller.mobile +
      '</span><br><div class="buyerform-similarcars-disclaimer">' +
      response.sellerDetailsWarningTipText +
      "</div>"
    );
  }

  function setSimilarCarsEvents() { }

  function callResetFormWithTracking() {
    $('.whatsapp-consent-container').show();
    buyerFormV2.resetFormWithTracking(
      showNameErrorMsg,
      showMobileErrorMsg,
      showOtpErrorMsg
    );
  }

  function showOTPFieldHtml() {
    $(".buyer-process__change-number").on("click", callResetFormWithTracking);
    $("#otpInputField").removeClass("buyer-process__input--hide");
    $(".verifyOtp").show();
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

  function showModal() {
    $(document).on("click", ".get-seller-details", function (event) {
      $("#pl-similar_cars").removeClass("open").removeClass("response");
      //remove while migrating similar cars for buy buyerformv2
      $("#left-person-lead-panel").removeClass("clicksmbtnout");
      resetLeadPopupText()
      buyerFormV2.prefilBuyerDetails();
      buyerFormV2.setLeadData(event);
      if (buyerFormV2.updateCookiesValues()) {
        closeSellerDetailsPopup();
        $("#cl-loaderblk").show();
        buyerFormV2.getPreVerifiedDetails(stockLeadSuccess, stockLeadError);
      } else {
        var buyProcessContainer = $(".buyerProcessContainerTitle");
        var buyerProcessContainerSubTitle = $(".buyerProcessContainerSubTitle");
        if (
          buyProcessContainer &&
          buyerProcessContainerSubTitle&&
          event &&
          event.currentTarget &&
          event.currentTarget.dataset &&
          event.currentTarget.dataset["popuptype"] === "HomeTestDrive"
        ) {
          buyProcessContainer.text("Contact for Test Drive");
          buyerProcessContainerSubTitle.text("Enter your name and mobile number to instantly see this seller's details.");
          buyerProcessContainerSubTitle.text("Please get in touch with the seller for more details.");
        }
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.DESKTOP);
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
      PLATFORM.DESKTOP
    );
  }

  function closeModalEventListener() {
    $(".buyer-process__close").on("click", callCloseBuyerFormWithTracking);
  }

  function setResendOtpTimer(countDown) {
    $(".buyer-process__resend--count").text(
      "Resend OTP in " + countDown + " sec"
    );
  }

  function showResendOtpButton() {
    $(".buyer-process__resend--count").hide();
    $(".buyer-process__resend-otp").show();
  }

  function OtpLimitReached() {
    $(".buyer-process__resend-otp").text("OTP sent to Mobile");
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
    $(".buyer-process__resend-otp").hide();
    $(".buyer-process__resend--count").text(
      "Resend OTP in 30 sec"
    );
    $(".buyer-process__resend--count").show();
  }

  function bindResendOtpLinkEvent() {
    $(".buyer-process__resend-otp").off("click", resendOtp);
    $(".buyer-process__resend-otp").on("click", resendOtp);
  }

  function bindInputFieldValues() {
    $(".buyer-details-input input").off("input", _inputEvent);
    $(".buyer-details-input input").on("input", _inputEvent);
    $(".buyer-details-input input").off("blur", _bindInputBlur);
    $(".buyer-details-input input").on("blur", _bindInputBlur);
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
    $(".buyer-details-input input").off("input", _inputEvent);
    $(".buyer-details-input input").on("input", _inputEvent);
    $(".buyer-details-input input").off("blur", _bindInputBlur);
    $(".buyer-details-input input").on("blur", _bindInputBlur);
  }

  function bindInputChangeEvents() {
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

  function hideNegotiatePopupAndbodyScroll() {
    $("#negotiate-popup-script").hide();
    $("#idbybody").css({
      overflow: "visible",
    });
  }

  function bindNegotiationLead() {
    $(document).on("click", "#negotiatesubmit", function (e) {
      e.preventDefault();
      $("#cl-loaderblk").show();
      buyerFormV2.removeBodyScroll();
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
        PLATFORM.DESKTOP
      );
      if (shouldShowBuyerForm) {
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.DESKTOP);
        showBuyerFormHtml();
      }
    });
  }

  function bindSimilarContactSellerClick() {
    $(document).on("click", ".similar-contact-seller-btn", function (event) {
      closeSellerDetailsPopup();
      var shouldShowBuyerForm = buyerFormV2.handleSimilarContactSellerClick(
        this,
        stockLeadSuccess,
        stockLeadError,
        event
      );
      if (shouldShowBuyerForm) {
        buyerFormV2.handleShowBuyerFormPopup(PLATFORM.DESKTOP);
        showBuyerFormHtml();
      }
    });
  }

  function bindSellerDetailsClose() {
    $(document).on("click", "#similar-popup-close", function () {
      buyerFormV2.addBodyScroll();
      $("#pl_over_lay,#person-lead-panel").removeClass("open");
      closeSellerDetailsPopup();
    });
    $(document).on("click", "#pl-similar_cars", closeSellerDetailsPopup);
  }

  function closeRecommendationsPopup() {
    addBodyScroll();
    $("#recommendations-background").hide();
    $(".recommendation-list").empty();
    $("#recommendation-popup-wrapper").hide();
  }

  $(window).on("popstate", function () {
    if ($("#recommendation-popup-wrapper").is(":visible")) {
      onSkipRecommendationsClick();
    }
  });

  function openRecommendationsPopup(data, leadInfo) {
    if (!data) {
      return;
    }
    removeBodyScroll();
    $("#recommendations-background").show();
    $("#recommendation-popup-wrapper").show();
    if(!!leadInfo && leadInfo.isIndividual)
    {
      setIndividualLeadResponseScreen();
    }
    if (data.length !== 0) {
      data = data.slice(0, 4);
      var recommendationList = "";
      for (var index in data) {
        recommendationList += getRecommendationHtml(data[index], index);
        profileIds += " " + data[index].profileId + ",";
      }
      if (profileIds.length > 1) { // Remove last comma
        profileIds = profileIds.substring(0, profileIds.length - 1);
      }
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
      $('#recommendation-checkbox').prop('checked', true);
      $(".recommendation-card__stock_name").addClass("margin-right-18");
      $(".recommendation-card__seller-details").hide();
      $(".recommendation-card__interested-button").hide();
      $(".recommendation-submit-button-wrapper").show();
      $(".recommendation-submit-button").show();
      $(".recommendation-end-button").hide();
      $('.recommendation-title').show();
      $(".recommendation-card").show();
      $(".recommendation-card__selection").show();
      window.history.pushState(null, "");
      analytics.trackAction(
        "CTInteractive",
        getCategoryBasedOnOriginId(originId),
        "LeadRecommendationsShown",
        "City: " + cityName + " | ProfileID:" + profileIds
      );
      recommendationCardChecksListener();
    }else{
      analytics.trackAction(
        "CTInteractive",
        getCategoryBasedOnOriginId(originId),
        "LeadRecommendationsNotAvailable",
        "City:" + cityName + " | ProfileID:"
      );
      $('.recommendation-card__selection').hide();
      $('.recommendation-head').hide();
      $('.recommendation-submit-button-wrapper').show();
      $(".recommendation-submit-button").hide();
      $("#skip-recommendation").hide();
      $("#recommendation-done").show();
    }
    $(".recommendation_popup_background").css("display", "block");
    $("body").css("overflow", "hidden");
    $(".recommendation-container").show().scrollTop(0);
    window.history.pushState(null, ""); // push state of recommendation view
  }

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

  function recommendationCardChecksListener() {
    $(".recommendation-card-select > input[type='checkbox']").change(function () {
      var selectedRecommendationCount = $(".recommendation-list  input[type='checkbox']:checked").length;
      if (this.checked) {
        onRecommendationCardCheck(selectedRecommendationCount);
      } else {
        onRecommendationCardUncheck(selectedRecommendationCount);
      }
    });
  }

  function onRecommendationCardCheck(selectedRecommendationCount) {
    var recommendationsShown = $(".recommendation-list").children().length;
    $(".recommendation-submit-button").show();
    $("#skip-recommendation").hide();
    if (selectedRecommendationCount == recommendationsShown) {
      $('#recommendation-checkbox').prop('checked', true);
    }
  }

  function onRecommendationCardUncheck(selectedRecommendationCount) {
    if (selectedRecommendationCount === 0) {
      $("#skip-recommendation").show();
      $(".recommendation-submit-button").hide();
    }
    $('#recommendation-checkbox').prop('checked', false);
  }

  function recommendationSelectAllListener() {
    $('#recommendation-checkbox').change(function () {
      if (this.checked) {
        onSelectAllCheck();
      } else {
        onSelectAllUncheck();
      }
    });
  }

  function onSelectAllCheck() {
    $('.recommendation-card-select input[type="checkbox"]').each(function () {
      this.checked = true;
    });
    $(".recommendation-submit-button").show();
    $("#skip-recommendation").hide();
  }

  function onSelectAllUncheck() {
    $('.recommendation-card-select input[type="checkbox"]').each(function () {
      this.checked = false;
    });
    $("#skip-recommendation").show();
    $(".recommendation-submit-button").hide();
  }

  function handleSingleCardInterestedButtonLeadResponse(response, requestBody) {
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

  function onSingleCardInterestedButtonClick(profileId, rank) {
    $("#recommendation-card-" + profileId + " .recommendation-card__interested-button").hide();
    $("#recommendation-card-" + profileId + " .seller-details-loader").show();
    buyerFormV2.setLeadDataV2(profileId, originId, "recommendation", 0, rank + 1);
    analytics.trackAction(
      "CTInteractive",
      getCategoryBasedOnOriginId(originId),
      "LeadRecommendationsClicked",
      "City: " + cityName + " | ProfileID:" + profileId
    );
    buyerFormV2.getPreVerifiedDetails(handleSingleCardInterestedButtonLeadResponse, handleSingleCardInterestedButtonLeadResponse);
  }

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
    $(".recommendation-skeleton-loader").hide();
    $(".recommendation-card__stock_name").removeClass("margin-right-18");
    $(".recommendation-card").show();
    $(".recommendation-list .recommendation-skeleton-loader").remove();
  }

  function onRecommendationsInterestSubmit() {
    var skeletonLoaderList = "";
    for (var i = 0; i < 4; i++) {
      skeletonLoaderList += $(".recommendation-skeleton-loader-template").html();
    }
    $(".recommendation-card").hide();
    $(".recommendation-card__selection").hide();
    $(".recommendation-list").append(skeletonLoaderList);
    $(".recommendation-skeleton-loader").show();
    $(".recommendation-container").animate({scrollTop : 0}, 500);
    sortRecommendationsCards();
    loadRecommendationCards();
    $(".recommendation-submit-button").hide();
    $("#recommendation-skip").hide();
    $("#recommendation-done").show();
  }

  function loadRecommendationCards() {
    $('.recommendation-list .recommendation-card-select input[type="checkbox"]').each(function () {
      var selectedProfileIds = "";
      if (!this.value) {
        return;
      }
      if (!this.checked) {
        $("#recommendation-card-" + this.value + " .recommendation-card__interested-button").show();
        return;
      }
      selectedProfileIds += this.value;
      var rank = parseInt(this.getAttribute('data-index'), 10) + 1;
      buyerFormV2.setLeadDataV2(this.value, originId, "recommendation", 0, rank);
      analytics.trackAction(
        "CTInteractive",
        getCategoryBasedOnOriginId(originId),
        "LeadRecommendationsClicked",
        "City: " + cityName + " | ProfileID:" + selectedProfileIds
      );
      buyerFormV2.getPreVerifiedDetails(handleRecommendationLeadResponse, handleRecommendationLeadResponse);
    });
  }

  function sortRecommendationsCards() {
      $(".recommendation-list")
      .append($(".recommendation-list .recommendation-card")
        .sort((currentCard, compareCard) => recommendationCardSortingComparator(currentCard, compareCard)));
  }

  function recommendationCardSortingComparator(currentCard, compareCard) {
    const currentCardIndex = currentCard.getAttribute("data-index"), compareCardIndex = compareCard.getAttribute("data-index");
    const currentCardIsSelected = $("#" + currentCard.id + " input[type='checkbox']:checked").length === 1;
    const compareCardIsSelected = $("#" + compareCard.id + " input[type='checkbox']:checked").length === 1;
    if (currentCardIsSelected && compareCardIsSelected) {
      return currentCardIndex - compareCardIndex;
    }
    else if (currentCardIsSelected || compareCardIsSelected) {
      return currentCardIsSelected ? -1 : 1;
    }
    return currentCardIndex - compareCardIndex;
  }

  function onSkipRecommendationsClick() {
    var isRecommendationsGiven = $('#recommendation-done').is(":visible");
    if (profileIds && !isRecommendationsGiven) {
      analytics.trackAction(
        "CTInteractive",
        getCategoryBasedOnOriginId(originId),
        "LeadRecommendationsSkipped",
        "City: " + cityName + " | ProfileID:" + profileIds
      );
    }
    closeRecommendationsPopup();
  }

  function bindSellerDetails(sellerDetails) {
    if (sellerDetails) {
      sellerDetails.name && $('#seller-shop-name').text(sellerDetails.name);
      sellerDetails.contactPerson && $('#seller-contact-name').text(sellerDetails.contactPerson);
      sellerDetails.mobile && $('#seller-mobile').text(sellerDetails.mobile);
    }
  }

  function setOneClickViewDetails() {
    buyerFormV2.handleSetOneClickViewDetails(setOneClickViewDetailsHtml);
  }

  function setOneClickCrpHtml() {
    $("#oneclickcheckright").removeClass("open");
    $("#oneclickcheckright").addClass("close");
    $("#inline-form").removeClass("no-form");
    $(".input-group").removeClass("close");
  }

  function bindOneClickCheckRight() {
    $("#oneclickcheckright").click(function (e) {
      buyerFormV2.handleOneClickCrp(
        e,
        this,
        stockLeadSuccess,
        stockLeadError,
        setOneClickCrpHtml
      );
    });
  }

  function bindAbsureLead() {
    if (document.getElementById("absureLead")) {
      $(document).on("click", "#absureLead", function (e) {
        e.preventDefault();
        buyerFormV2.removeBodyScroll();
        closeSellerDetailsPopup();
        $("#cl-loaderblk").show();
        resetLeadPopupText();
        var shouldShowBuyerForm = buyerFormV2.submitAbsureLead(
          e.currentTarget,
          stockLeadSuccess,
          stockLeadError
        );
        if (shouldShowBuyerForm) {
          buyerFormV2.handleShowBuyerFormPopup(PLATFORM.DESKTOP);
          showBuyerFormHtml();
        }
      });
    }
  }

  function getMakeOffer(
    profileid,
    carname,
    price,
    priceNumeric,
    rank,
    slotId,
    originId,
    deliveryCity
  ) {
    deliveryCity = deliveryCity || 0;
    closeSellerDetailsPopup();
    getExistingOffer(
      profileid,
      carname,
      price,
      priceNumeric,
      rank,
      slotId,
      originId,
      deliveryCity
    );
  }

  function checkMarketPriceClick(element) {
    var shouldCloseBuyerForm = !buyerFormV2.handleMarketPriceClick(
      element,
      showCrpNameErrorMsg,
      showCrpMobileErrorMsg,
      showOtpErrorMsg,
      stockLeadSuccess,
      stockLeadError
    );
    if (shouldCloseBuyerForm) {
      closeSellerDetailsPopup();
    }
  }

  function bindPriceGuideMakeOffer()
  {
    $(document).on("click", "#priceGuideMakeOffer", function (e) {
      e.preventDefault();
      analytics.trackAction(
        "CWInteractive",
        $(this).data("cat"),
        "MakeOfferPriceGuideClicked",
        $(this).data("label")
      );
      getMakeOffer(
        $(this).data("profileid"),
        $(this).data("carname"),
        $(this).data("priceformatted"),
        $(this).data("pricenumeric"),
        '', '',
        $(this).data("originid"),
        $(this).data("deliverycityid"));
    });
  }

  function setIndividualLeadResponseScreen()
  {
    let sellerDetailsSlug = $(".js-seller-details"),
    sharedInfoSlug = $(".js-shared-info-slug"),
    sellerDetailsScreen = $("#sellerDetailsScreen"),
    dealerDetailsScreen = $("#dealer_details"),
    personDetailsScreen = $("#PL_person_details"),
    individualLeadResponseScreen = $("#individualLeadResponseScreen"),
    individualGalleryLeadScreen = $("#individualGalleryLeadScreen"),
    individualScreenTitle = $(".js-individual-lead-screen-heading");
    if(sellerDetailsSlug.length > 0)
    {
      sellerDetailsSlug.hide();
    }
    if(sharedInfoSlug.length > 0)
    {
      sharedInfoSlug.hide();
    }
    if(sellerDetailsScreen.length > 0 && individualLeadResponseScreen.length > 0)
    {
      sellerDetailsScreen.html(individualLeadResponseScreen.html());
    }
    if(dealerDetailsScreen.length > 0 && individualGalleryLeadScreen.length > 0)
    {
      dealerDetailsScreen.html(individualGalleryLeadScreen.html());
    }
    if(personDetailsScreen.length > 0 && individualGalleryLeadScreen.length > 0)
    {
      personDetailsScreen.html(individualGalleryLeadScreen.html())
    }
    let cookies = getCookies();
    if(!!cookies && cookies["cookie_buyform_name"])
    {
      individualScreenTitle.text("Thank you " + cookies["cookie_buyform_name"] + "!");
    }
  }

  function registerEvents() {
    bindDisableOTPCRP();
    showModal();
    closeModalEventListener();
    bindResendOtpLinkEvent();
    bindInputFieldValues();
    bindInputChangeEvents();
    bindLeadFormSubmit();
    bindNegotiationLead();
    bindSimilarContactSellerClick();
    bindSellerDetailsClose();
    setOneClickViewDetails();
    bindOneClickCheckRight();
    bindAbsureLead();
    bindPriceGuideMakeOffer();
    recommendationSelectAllListener();
    recommendationCardChecksListener();
  }

  return {
    registerEvents: registerEvents,
    checkMarketPriceClick: checkMarketPriceClick,
    verifyBuyerOtp: verifyBuyerOtp,
    setOneClickViewDetails: setOneClickViewDetails,
    getMakeOffer: getMakeOffer,
    closeRecommendationsPopup: closeRecommendationsPopup,
    openRecommendationsPopup: openRecommendationsPopup,
    bindSellerDetails: bindSellerDetails,
    onRecommendationsInterestSubmit: onRecommendationsInterestSubmit,
    onSingleCardInterestedButtonClick: onSingleCardInterestedButtonClick,
    onSkipRecommendationsClick: onSkipRecommendationsClick,
    setIndividualLeadResponseScreen
  };
})();

$(document).ready(function () {
  buyerFormV2Desktop.registerEvents();
});