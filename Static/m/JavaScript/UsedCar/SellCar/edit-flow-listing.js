var EditCarListing = {
  editSellcarDocReady: function () {
    EditCarListing.setSelectors();
    EditCarListing.historyReplaceState();
    EditCarListing.registerEvents();
  },
  cachedInquiryId: "", // used for caching inquiries recieved
  s3fetchUrl: "",
  //Variables declared for selectors
  setSelectors: function () {
    EditCarListing.stopAdPopup = ".stop-showing-ad-popup-container";
    EditCarListing.reasonsInputBox = "#reasonsInputBox";
    EditCarListing.reasonsSelectBox = "#getReason";
    EditCarListing.modalBg = "#modalBg";
    EditCarListing.adBottomSlidePopup = ".ad-bottom-slide-popup";
    EditCarListing.stopAdContainer = ".stop-showing-ad-popup-container";
    EditCarListing.acknwoledgementSlider = ".acknowledgement-msg-card";
    EditCarListing.modalBgLayout = ".modal-bg-layout";
    EditCarListing.soldToSelectBox = "#soldTo";
    EditCarListing.soldPriceInput = ".deal-price";
    EditCarListing.notSellingInput = "#notSelling-input";
    EditCarListing.otherPlatformInput = "#otherPlatform-Input";
  },

  historyReplaceState: function () {
    var queryParams = location.search.substring(1);
    if (queryParams) {
      var queryStringObj = JSON.parse(
        '{"' +
          decodeURI(queryParams)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
      if (queryStringObj["otpCode"]) {
        var str = [];
        for (var key in queryStringObj) {
          if (key !== "authtoken" && key !== "otpCode") {
            str.push(
              encodeURIComponent(key) +
                "=" +
                encodeURIComponent(queryStringObj[key])
            );
          }
        }
        str.push(
          encodeURIComponent("authtoken") +
            "=" +
            encodeURIComponent($.cookie("encryptedAuthToken") || "")
        );
        var otpPageUrl = str.join("&");
        history.replaceState(null, null, "?" + otpPageUrl);
      }
    }
  },

  //All events for the selectors
  registerEvents: function () {
    $(document).on("click", "#remove-car", function () {
      var inqId = $(this).attr("data-listingid");
      EditCarListing.removeCar(inqId);
    });
    $(document).on(
      "click",
      ".mylistingContainer .modal-box .modal__close",
      function () {
        history.back();
        $("body").removeClass("lock-browser-scroll");
      }
    );

    $(document).on("click", ".stop-ad-link", function () {
      var inqId = $(this).attr("data-listingid");
      EditCarListing.stopShowingAd(inqId);
    });

    $(document).on("click", ".js-delete-my-ad", function () {
      var inqId = $(this).attr("data-listingid");
      EditCarListing.deleteMyAd(inqId);
    });

    $(document).on("click", ".close-icon", function () {
      EditCarListing.onClickCloseIcon();
    });
    $(document).on("click", "#view-ad-detail", function () {
      EditCarListing.viewAdDetailList($(this).attr("data-listingid"));
    });
    $(document).on("click", ".modal-bg-layout, #ad-inq-close", function () {
      history.back();
    });
    $(document).on("change", EditCarListing.reasonsSelectBox, function () {
      EditCarListing.onChangeReasonSelected();
    });

    $(document).on("change", EditCarListing.soldToSelectBox, function () {
      EditCarListing.onChangeSoldTo();
    });

    $(document).on("input", EditCarListing.soldPriceInput, function () {
      EditCarListing.onInputPrice();
    });

    $(document).on("input", EditCarListing.notSellingInput, function () {
      EditCarListing.onInputNotSelling();
    });

    $(document).on("input", EditCarListing.otherPlatformInput, function () {
      EditCarListing.onInputPlatform();
    });

    $(document).on("click", "#cancel-reason", function () {
      iphoneInputFocus.OutFocus();
      EditCarListing.resetStopAdPopUp();
    });

    // event listeners for Ackwolegdement slider
    $(document).on("click", ".cross-btn", function () {
      EditCarListing.hideAcknowledgementSlider();
    });
    // end

    if ($(".sellcar-edit-list-container").length) {
      editCarTracking.trackForMobile(
        editCarTracking.actionType.listingViewLoad,
        "ListingViewLoad"
      );
    }
    $(".success-msg__btn-close").on("click", function () {
      $(".success-msg__block").hide();
      if (typeof clientCache !== "undefined") {
        clientCache.remove("congratsSlug", true);
      }
    });

    if (typeof clientCache !== "undefined") {
      var returnValue = clientCache.get("congratsSlug", true);
      if (returnValue && returnValue.id) {
        $(".success-msg__block").show();
        setTimeout(function () {
          $(".success-msg__block").fadeOut("slow", function () {
            clientCache.remove("congratsSlug", true);
          });
        }, 3000);
      }
    }
  },

  removeCar: function (inqId) {
    if (EditCarListing.validateDeleteRequest()) {
      editCarCommon.setLoadingScreen();
      var selectedVal = $("#getReason option:selected").val();
      var deleteDetails = EditCarListing.populateDelistingJsonObj();
      var xmlhttp = new XMLHttpRequest();
      var userResponse = {};
      userResponse.InquiryId = inqId;
      userResponse.SelectedValue = selectedVal;
      userResponse.DeleteComments = deleteDetails;
      userResponse.UserComments = document.getElementById("comment").value;
      xmlhttp.open(
        "POST",
        "/sell-used-car/myaccount/stop-user-ad/?authtoken=" +
          ($.cookie("encryptedAuthToken") ? $.cookie("encryptedAuthToken") : "")
      );
      xmlhttp.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
          if (xmlhttp.status == 200) {
            window.location.reload();
          } else {
            editCarCommon.removeLoadingScreen();
          }
        }
      };
      xmlhttp.timeout = 10000;
      xmlhttp.ontimeout = function () {
        editCarCommon.removeLoadingScreen();
      };
      xmlhttp.send(JSON.stringify(userResponse));
    } else {
      field.setError(
        $(EditCarListing.reasonsSelectBox),
        "Please choose a reason to continue"
      );
    }
  },

  stopShowingAd: function (inqId) {
    $("#modalPopUp").attr("data-current", "stop-showing-ad-popup-container");
    $("#remove-car").attr("data-listingid", inqId);
    editCarTracking.trackForMobile(editCarTracking.actionType.stopAdd, inqId);
    popUp.showPopUp(
      setTimeout(function () {
        if ($(".form-control-box").find(".chosen-container").length > 0) {
          $(".chosen-select").next("").remove();
        }
        ChosenInit($(".stop-showing-ad-popup-container"));
      }, 0)
    );

    iphoneInputFocus.OnFocus();
    history.pushState("stopAdPopup", "");
  },

  deleteMyAd: function (inqId) {
    editCarCommon.setLoadingScreen();
    editCarTracking.trackForMobile(editCarTracking.actionType.deleteAdd, inqId);
    var settings = {
      url:
        "/api/listings/" +
        inqId +
        "/archivelisting/?authToken=" +
        ($.cookie("encryptedAuthToken") ? $.cookie("encryptedAuthToken") : ""),
      type: "POST",
      headers: {
        ServerDomain: "CarWale",
      },
    };

    $.ajax(settings)
      .done(function (response) {
        window.location.reload();
      })
      .fail(function (xhr) {
        editCarCommon.removeLoadingScreen();
        editCarCommon.showModal(xhr.responseText);
      });
    iphoneInputFocus.OutFocus();
  },

  onChangeReasonSelected: function () {
    var reasonSelected = $(EditCarListing.reasonsSelectBox).val();
    var buyerType = $('input[type=radio][name="sellinquiry-buyer"]').val();
    if (reasonSelected === "2" || reasonSelected === "3") {
      $("#buyer-select-box").show();
      $("#deal-price-box").show();
      $("#notSelling-inputBox").hide();
      $(".notSelling-reason-text").hide();
      if (reasonSelected === "3") {
        $("#soldToInputBox").show();
        if ($("#soldTo").val() === "7") {
          $("#otherPlatform-InputBox").show();
        }
      } else {
        $("#soldToInputBox").hide();
        $("#otherPlatform-Input").val("");
        $("#otherPlatform-InputBox").hide();
      }
    } else {
      if (reasonSelected === "6") {
        $("#notSelling-inputBox").show();
        $(".notSelling-reason-text").hide();
      }

      if (buyerType === "1") {
        document.getElementById("individual").checked = false;
      }
      if (buyerType === "2") {
        document.getElementById("dealer").checked = false;
      }
      $(".deal-price").val("");
      $("#soldTo").val("0");
      $("#otherPlatform-Input").val("");
      $(".buyer-error-text").hide();
      $(".price-error-text").hide();
      $("#buyer-select-box").hide();
      $("#deal-price-box").hide();
      $(".soldto-error-text").hide();
      $("#soldToInputBox").hide();
      $("#otherPlatform-InputBox").hide();
      $(".otherPlatform-error-text").hide();
    }
    EditCarListing.removeReasonValidationError();
  },

  onChangeSoldTo: function () {
    const soldTo = $("#soldTo").val();
    if (soldTo) {
      $(".soldto-error-text").hide();
      if (soldTo === "7") {
        $("#otherPlatform-InputBox").show();
      } else {
        $("#otherPlatform-InputBox").hide();
        $(".otherPlatform-error-text").hide();
      }
    }
  },

  onInputPrice: function () {
    var price = $(EditCarListing.soldPriceInput).val();
    if (price) {
      $(".price-error-text").hide();
    }
  },

  onInputNotSelling: function () {
    var notSellingText = $(EditCarListing.notSellingInput).val();
    if (notSellingText && notSellingText.trim() !== "") {
      $(".notSelling-reason-text").hide();
    }
  },

  onInputPlatform: function () {
    var otherPlatform = $(EditCarListing.otherPlatformInput).val();
    if (otherPlatform && otherPlatform.trim() !== "") {
      $(".otherPlatform-error-text").hide();
    }
  },

  onClickCloseIcon: function () {
    iphoneInputFocus.OutFocus();
    if ($(EditCarListing.acknwoledgementSlider).hasClass("ack-slider-active")) {
      EditCarListing.hideAcknowledgementSlider();
    } else if (
      $(EditCarListing.adBottomSlidePopup).hasClass("expandedBottom")
    ) {
      EditCarListing.hideAdDetailList();
    } else {
      EditCarListing.resetStopAdPopUp();
    }
    if (Common.utils.getValueFromQS("editable")) {
      EditCarListing.removeDisabledEditPopup();
    }
    $("body").removeClass("lock-browser-scroll");
  },

  // show acknowledgement slider
  showAcknowledgementSlider: function () {
    var paymentStatus = Common.utils.getValueFromQS("payst");
    if (paymentStatus && $("[data-payst='" + paymentStatus + "']").length) {
      setTimeout(function () {
        $(EditCarListing.modalBgLayout).show();
      }, 0);
      $("[data-payst='" + paymentStatus + "']")
        .removeClass("closed")
        .removeClass("hide")
        .addClass("ack-slider-active");
      history.pushState("ackslidershown", null, null);
    }
  },
  // hide acknowledgement sreen, replace url to avoid browser back
  hideAcknowledgementSlider: function () {
    var url = EditCarListing.utils.removeFromQS("payst", window.location.href);
    history.replaceState(null, document.title, url);
    location.reload();
  },
  resetStopAdPopUp: function () {
    formField.emptySelect($(EditCarListing.reasonsSelectBox));
    $(".js-comment-box").val("");
    EditCarListing.removeReasonValidationError();
    $(".select-box").removeClass("done");
    popUp.hidePopUp();
  },

  //Function for validating Reason selection
  reasonSelectionVal: function () {
    if ($(EditCarListing.reasonsSelectBox).val() !== "0") {
      return true;
    }

    return false;
  },

  buyerTypeChange: function (event) {
    var buyerType = event.value;
    if (buyerType === "1" || buyerType === "2") {
      $(".buyer-error-text").hide();
    }
  },

  sellCarExperienceChange: function (event) {
    var customerExperience = event.value;
    if (customerExperience === "good" || customerExperience === "average") {
      $(".comment-textarea").show();
      $(".comment-label").text("Let us know what we can improve");
    } else if (customerExperience === "bad") {
      $(".comment-textarea").show();
      $(".comment-label").text("Please let us know what went wrong");
    } else {
      $(".comment-textarea").hide();
    }
  },

  populateDelistingJsonObj: function () {
    var jsonObj = [];
    if ($(EditCarListing.reasonsSelectBox).val() !== "0") {
      var item = {};
      item["questionId"] = 1;
      item["answer"] = $(EditCarListing.reasonsSelectBox).val();
      jsonObj.push(item);
    }
    if ($(EditCarListing.reasonsSelectBox).val() === "6") {
      var item5 = {};
      item5["questionId"] = 6;
      item5["answer"] = $("#notSelling-input").val();
      jsonObj.push(item5);
    }
    if ($(EditCarListing.soldToSelectBox).val() !== "0") {
      var item1 = {};
      item1["questionId"] = 2;
      item1["answer"] = $(EditCarListing.soldToSelectBox).val();
      jsonObj.push(item1);
      if ($(EditCarListing.soldToSelectBox).val() === "7") {
        var item6 = {};
        item6["questionId"] = 7;
        item6["answer"] = $("#otherPlatform-Input").val();
        jsonObj.push(item6);
      }
    }
    var buyerType = "";
    if (document.getElementById("individual").checked) {
      buyerType = "1";
    } else if (document.getElementById("dealer").checked) {
      buyerType = "2";
    }
    if (buyerType.trim() !== "") {
      var item2 = {};
      item2["questionId"] = 3;
      item2["answer"] = buyerType;
      jsonObj.push(item2);
    }
    if ($(".deal-price").val()) {
      var item3 = {};
      item3["questionId"] = 4;
      item3["answer"] = $(".deal-price").val();
      jsonObj.push(item3);
    }
    var experience = "";
    if (document.getElementById("good-experience").checked) {
      experience = "good";
    } else if (document.getElementById("avg-experience").checked) {
      experience = "average";
    } else if (document.getElementById("bad-experience").checked) {
      experience = "bad";
    } else {
      //nothing to do.
    }
    if (experience.trim() !== "") {
      var item4 = {};
      item4["questionId"] = 5;
      item4["answer"] = experience;
      item4["comments"] = $("#comment").val();
      jsonObj.push(item4);
    }
    var deListingDetails = {};
    deListingDetails["DeListingInfo"] = jsonObj;
    return JSON.stringify(deListingDetails);
  },

  validateSellingPrice: function (validationStatus) {
    var expectedPrice = $(".deal-price").val();
    var actualPrice = document
      .getElementById("listing_price")
      .getAttribute("data-actualPrice");
    if (!expectedPrice) {
      validationStatus = false;
      $(".price-error-text").text("please enter price");
      $(".price-error-text").show();
    } else if (!parseInt(expectedPrice.trim()) > 0) {
      validationStatus = false;
      $(".price-error-text").text("please enter valid price");
      $(".price-error-text").show();
    } else if (parseInt(expectedPrice.trim()) < parseInt(actualPrice) / 2) {
      validationStatus = false;
      $(".price-error-text").text(
        "Price seems too low, please input the right selling price."
      );
      $(".price-error-text").show();
    } else {
      //no condition.
    }
    return validationStatus;
  },

  validateDeleteRequest: function () {
    var validationStatus = true;
    var reasonSelected = $(EditCarListing.reasonsSelectBox).val();
    var otherPlaform = $("#otherPlatform-Input").val();
    if (reasonSelected === "0") {
      validationStatus = false;
      $(".reason-error-text").text("Please select a reason.");
      $(".reason-error-text").show();
    } else if (reasonSelected === "2" || reasonSelected === "3") {
      validationStatus = EditCarListing.validateSoldThroughPlatform(
        reasonSelected,
        otherPlaform,
        validationStatus
      );
      if (
        !document.getElementById("individual").checked &&
        !document.getElementById("dealer").checked
      ) {
        validationStatus = false;
        $(".buyer-error-text").text("Please select the buyer type.");
        $(".buyer-error-text").show();
      }
      validationStatus = EditCarListing.validateSellingPrice(validationStatus);
    } else if (reasonSelected === "6") {
      var reasonInput = $("#notSelling-input").val();
      if (!reasonInput || reasonInput.trim() === "") {
        validationStatus = false;
        $(".notSelling-reason-text").text(
          "Please enter the reason for not selling"
        );
        $(".notSelling-reason-text").show();
      }
    } else {
      //no statement.
    }
    return validationStatus;
  },

  validateSoldThroughPlatform: function (
    reasonSelected,
    otherPlaform,
    validationStatus
  ) {
    if (reasonSelected === "3") {
      if ($(EditCarListing.soldToSelectBox).val() === "0") {
        validationStatus = false;
        $(".soldto-error-text").text("Please select the platform.");
        $(".soldto-error-text").show();
      }
      if (
        $(EditCarListing.soldToSelectBox).val() === "7" &&
        (!otherPlaform || otherPlaform.trim() === "")
      ) {
        validationStatus = false;
        $(".otherPlatform-error-text").text(
          "Please enter the platform where you sold"
        );
        $(".otherPlatform-error-text").show();
      }
    }
    return validationStatus;
  },

  removeReasonValidationError: function () {
    $(".reason-error-text").hide();
  },
  removeDisabledEditPopup: function () {
    var url = EditCarListing.utils.removeFromQS(
      "editable",
      window.location.href
    );
    $("#modalPopUp").empty();
    window.history.replaceState(null, document.title, url);
    if (!document.referrer) {
      history.pushState("editFromAutoLogin", null, null);
    }
    history.back();
  },

  removeCachedInquiry: function () {
    EditCarListing.cachedInquiryId = "";
  },
  //Function to hide Ad Details popup
  hideAdDetailList: function () {
    $(EditCarListing.adBottomSlidePopup).removeClass("expandedBottom");
    $(EditCarListing.modalBg).hide();
    scrollLockFunc.unlockScroll();
  },
  utils: {
    removeFromQS: function (name, url) {
      var prefix = name + "=";
      var pars = url.split(/[&;]/g);
      for (var i = pars.length; (i = i - 1) > 0; ) {
        if (pars[i].indexOf(prefix) > -1) {
          pars.splice(i, 1);
        }
      }
      url = pars.join("&");
      return url;
    },
  },
  fetchReceiptAwsUrl: function (url, key, expiredInMins) {
    if (key !== "" && url) {
      return $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: false,
        headers: { key: key, expiredInMins: expiredInMins },
      }).done(function (response) {
        if (response !== null && response !== "") {
          return response;
        }
        return null;
      });
    }
    return null;
  },
};

$(document).ready(function () {
  EditCarListing.editSellcarDocReady();
  EditCarListing.showAcknowledgementSlider();
});
