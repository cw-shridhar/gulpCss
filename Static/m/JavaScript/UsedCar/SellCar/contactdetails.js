//dependency:-
// 1. static/m/js/used/sellcar/common.js
// 2. easy-autocomplete js

var contactForm = (function () {
    var container, getName, getMobile, shareToCarWaleCheckBox;
  
    var contactData = {};
    var contactDetailsHistoryActive = [];
    var isModalPopuShown = false;
    var isHistoryReset = false;
  
    if (typeof events !== "undefined") {
      events.subscribe("citySubmit", setSelectors);
      events.subscribe("citySubmit", registerDomEvents);
  
      events.subscribe("submitExpectedPrice", contactFormLoadHandler);
      events.subscribe("setExpectedPriceScreen", setExpectedPriceScreen);
      events.subscribe("takenLive", setInsuranceScreen);
  
      events.subscribe("historyIndexPoped", removeFromHistoryIndex);
      events.subscribe("setContactScreen", setContactScreen);
      events.subscribe("historyIndexChanged", pushHistoryIndex);
      events.subscribe("contactDetailsTabClick", contactDetailsTabClickHandler);
      events.subscribe("carDetailsTabClick", carDetailsTabClickHandler);
      events.subscribe("historynull", resetHistory);
    }
  
    function resetHistory() {
      contactDetailsHistoryActive = [];
      isHistoryReset = true;
    }
  
    function getContactHistoryLength() {
      return contactDetailsHistoryActive.length;
    }
  
    function setSelectors() {
      container = $("#formContact");
      getName = $("#getName");
      getMobile = $("#getMobile");
      shareToCarWaleCheckBox = $("#cwAdChecboxM");
    }
  
    function registerDomEvents() {
      documentReadyFormReset();
      var name = localStorage.getItem("LeadForm.BuyerInfo.Name");
      var mobile = localStorage.getItem("LeadForm.BuyerInfo.Mobile");
      if (name !== null) {
        $("#getName").val(name.replace(/['"]+/g, ""));
        document.getElementById("nameInputBox").classList.add("done");
      }
      if (mobile !== null) {
        $("#getMobile").val(mobile.replace(/['"]+/g, ""));
        document.getElementById("mobileInputBox").classList.add("done");
      }
      window.addEventListener("beforeunload", parentContainer.onPageUnload);
    }
  
    function pushHistoryIndex(historyData) {
      if (
        parentContainer.isTabActive("formContact") &&
        historyData &&
        historyData.index &&
        !parentContainer.isPresentInArray(
          historyData.index,
          contactDetailsHistoryActive
        )
      ) {
        console.log(
          "ContactDetails History Array inserted with history index : " +
            historyData.index
        );
        contactDetailsHistoryActive.push(historyData.index);
        console.log(
          "And Forms New Contact details active Array : " +
            JSON.stringify(contactDetailsHistoryActive)
        );
      }
    }
  
    function removeFromHistoryIndex(historyData) {
      var maxContactHistroyIndex = 2;
      if (
        parentContainer.isTabActive("formContact") &&
        historyData &&
        historyData.index > maxContactHistroyIndex &&
        parentContainer.isPresentInArray(
          historyData.index,
          contactDetailsHistoryActive
        )
      ) {
        contactDetailsHistoryActive.pop();
        console.log(
          "ContactDetails History Array Poped and Remaining array : " +
            JSON.stringify(contactDetailsHistoryActive)
        );
      }
    }
  
    function documentReadyFormReset() {
      if (getName.val().length > 0) {
        getName.text("");
      }
  
      if (getMobile.val().length > 0) {
        getMobile.text("");
      }
    }
  
    function contactFormLoadHandler(eventObj) {
      if (eventObj && eventObj.data) {
        contactData = appState.setSelectedData(contactData, eventObj.data);
      }
      setContactScreen();
    }
  
    function submitForm() {
      var name = $("#getName").val();
      var mobile = $("#getMobile").val();
      if (name !== null) {
        localStorage.setItem("LeadForm.BuyerInfo.Name", "\"" + name + "\"");
      }
      if (mobile !== null) {
        localStorage.setItem("LeadForm.BuyerInfo.Mobile", "\"" + mobile + "\"");
      }
  
      if (validateContactForm()) {
        var sellCarInfo = {};
        parentContainer.setLoadingScreen();
        var carDetailsData = carDetailsForm.getCarDetailsData();
  
        sellCarInfo.sellCarCustomer = appState.setSelectedData(
          sellCarInfo.sellCarCustomer,
          {
            name: $.trim(getName.val()),
            mobile: $.trim(getMobile.val()),
            cityId: carDetailsData.cityId,
          }
        );
  
        carDetailsData = appState.setSelectedData(carDetailsData, {
          showOnCarwale: shareToCarWaleCheckBox.is(":checked"),
          shareToCT: true,
          applicationId: 3,
        });
        sellCarInfo = appState.setSelectedData(sellCarInfo, carDetailsData);
  
        // Create additional Car Detail Object also
        var url = "/api/used/sell/contactcardetails/";
        var settings = {
          url: url,
          type: "POST",
          data: sellCarInfo,
          headers: { ServerDomain: "CarWale" },
        };
        $.ajax(settings)
          .done(function (response) {
            doneContactCarDetailsAjax(response, sellCarInfo);
            parentContainer.removeLoadingScreen();
          })
          .fail(function (xhr) {
            modalPopup.showModalJson(xhr.responseText);
            sellCarTracking.forMobile("maxLimitReached", "Sell Car|" + cityForm.getCityData().cityName);
            historyObj.addToHistory("showModal");
            parentContainer.removeLoadingScreen();
          });
        $("#modalPopUp").attr("data-current", "otp-popup-container");
      }
    }
  
    function doneContactCarDetailsAjax(response, sellCarInfo) {
      if (response && response.tempInquiryId) {
        sellCarCookie.deleteSellInquiryCookie();
        sellCarCookie.setTempInquiryCookie(response.tempInquiryId);
        if (typeof events !== "undefined") {
          var eventObj = {
            data: sellCarInfo,
            callback: onMobileVerified,
          };
          events.publish("contactSubmitForIos", eventObj);
        }
      }
    }
  
    function onMobileVerified(response, data) {
      if (response.isMobileVerified) {
        if (typeof events !== "undefined") {
          var eventObj = {
            data: data,
          };
          events.publish("mobileVerified", eventObj);
        }
      } else {
        if (typeof events !== "undefined") {
          var eventObj1 = {
            data: data,
          };
          historyObj.addToHistory("hideOtp");
          events.publish("mobileUnverified", eventObj1);
        }
      }
    }
  
    function validateContactForm() {
      var isValid = false;
      isValid = validateForm.userName(getName);
      isValid &= validateForm.userMobile(getMobile);  
      return isValid;
    }
  
    var validateForm = {
      userName: function (nameField) {
        var isValid = false,
          nameValue = nameField.val(),
          reName = /^([-a-zA-Z ']*)$/;
  
        if (nameValue === "") {
          validate.field.setError(nameField, "Please provide your name");
        } else if (!reName.test(nameValue)) {
          validate.field.setError(nameField, "Please provide only alphabets");
        } else if (nameValue.length === 1) {
          validate.field.setError(nameField, "Please provide your complete name");
        } else {
          validate.field.hideError(nameField);
          isValid = true;
        }
  
        return isValid;
      },
  
      userMobile: function (mobileField) {
        var isValid = false,
          mobileValue = mobileField.val(),
          reMobile = /^[6789]\d{9}$/;
  
        if (mobileValue === "") {
          validate.field.setError(
            mobileField,
            "Please provide your mobile number"
          );
        } else if (mobileValue.length !== 10) {
          validate.field.setError(
            mobileField,
            "Enter your 10 digit mobile number"
          );
        } else if (!reMobile.test(mobileValue)) {
          validate.field.setError(
            mobileField,
            "Please provide a valid 10 digit Mobile number"
          );
        } else {
          validate.field.hideError(mobileField);
          isValid = true;
        }
  
        return isValid;
      },
  
      userEmail: function (emailField) {
        var isValid = false,
          emailValue = emailField.val(),
          reEmail = /^[a-z0-9._-]+@([a-z0-9-]+\.)+[a-z]{2,6}$/;
  
        if (emailValue === "") {
          validate.field.setError(emailField, "Please provide your Email Id");
        } else if (!reEmail.test(emailValue.toLowerCase())) {
          validate.field.setError(emailField, "Invalid Email Id");
        } else {
          validate.field.hideError(emailField);
          isValid = true;
        }
  
        return isValid;
      },
    };
  
    function setContactScreen() {
      var isOtpModalSuccessfullyClosed = true;
      isOtpModalSuccessfullyClosed = !modalPopup.isOtpModalPopupVisible();
      if (
        !closeActiveSummary() &&
        !modalPopup.closeActiveModalPopup() &&
        isOtpModalSuccessfullyClosed
      ) {
        container.show();
        parentContainer.setNavigationTab("formContact");
  
        // show validation
  
        parentContainer.setButtonText("", "Post Your Ad");
        events.publish("updateNavigationTabClick", {
          tabNameArray: ["formContact", "formCarDetail"],
          value: true,
        });
  
        parentContainer.setButtonTarget(
          "history.back()",
          "contactForm.submitForm()"
        );
      }
    }
  
    function contactDetailsTabClickHandler() {
      setTabClickAttribute(true);
      var relativeIndex =
        contactDetailsHistoryActive[contactDetailsHistoryActive.length - 1] -
        historyHelper.getHistoryIndex();
      historyObj.goToIndex(relativeIndex);
      events.publish("updateHistoryIndex", { index: relativeIndex }); // No History Index values getting updated from popstate
    }
  
    function carDetailsTabClickHandler() {
      setTabClickAttribute(false);
      container.hide();
    }
  
    function setExpectedPriceScreen() {
      container.hide();
    }
  
    function closeActiveSummary() {
      if (summary.isSummaryActive()) {
        summary.closeSummary();
        return true;
      }
      return false;
    }
  
    function setTabClickAttribute(value) {
      container.attr("tabclick", value);
    }
  
    function getContactDetailshistoryActive() {
      return contactDetailsHistoryActive;
    }
  
    function setInsuranceScreen() {
      container.hide();
    }
  
    return {
      submitForm: submitForm,
      getContactHistoryLength: getContactHistoryLength,
      getContactDetailshistoryActive: getContactDetailshistoryActive,
    };
  })();
  
  var cityForm = (function () {
    var container,
      cityField,
      popularCityList,
      cityTagList,
      pincodeInputBox,
      pincodeField,
      sellCarTabs;
  
    var sourceType = parentContainer.getSourceId();
  
    var cityData = {};
  
    if (typeof events !== "undefined") {
      events.subscribe("cityDetailsDocReady", setSelectors);
      events.subscribe("cityDetailsDocReady", registerDomEvents);
      events.subscribe("cityDetailsDocReady", detectCity);
      events.subscribe("cityDetailsDocReady", disableAutoComplete);
      events.subscribe("historynull", pillCancelClickHandler);
      events.subscribe("setPincodeScreen", setPincodeScreen);
    }
    function disableAutoComplete() {
      $("#cityInputBox")
        .find(".easy-autocomplete #getCity")
        .attr("autocomplete", "sell-car-m-city");
      $("#pincodeInputBox")
        .find("#getPincode_chosen .chosen-drop .chosen-search input")
        .attr("autocomplete", "sell-car-m-pincode");
    }
    function detectCity() {
      var cityId = "";
      if (
        typeof getQueryStringParam != "undefined" &&
        (cityId = getQueryStringParam("city")) !== ""
      ) {
        var settings = {
          url: "/webapi/GeoCity/GetCityNameById/?cityid=" + cityId,
          type: "GET",
        };
        $.ajax(settings).done(function (cityName) {
          if (cityName) {
            processCitySelection(cityId, cityName.replace(/^"(.*)"$/, "$1"));
          }
        });
      } else if (!setCityFromGlobal()) {
        setCityFromGeoLocation();
      }
    }
    function setCityFromGlobal() {
      var cityId = $.cookie("_CustCityIdMaster");
      var cityName = $.cookie("_CustCityMaster");
      var isCityDetected = false;
  
      if (cityId && cityId !== "-1" && cityName) {
        processCitySelection(cityId, cityName);
        isCityDetected = true;
      }
      return isCityDetected;
    }
  
    function isProcessCitySelection(city) {
      return city && city.id && city.name && !cityField.val();
    }
  
    function setCityFromGeoLocation() {
      if (typeof geoLocation !== "undefined") {
        if (sourceType === "74") {
          geoLocation.getAndroidNativeCurrentCity();
        } else if (sourceType === "83") {
          geoLocation.getIosNativeCurrentCity();
        } else {
          geoLocation
            .getCurrentCity()
            .then(function (city) {
              setTimeout(function () {
                // to avoid race condition between user city selection and automatic city selection
                if (isProcessCitySelection(city))
                  processCitySelection(city.id, city.name);
              }, 100);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    }
  
    function setSelectors() {
      container = $("#formCity");
      cityField = $("#bodyCitySelect #getCity");
      popularCityList = $("#popularCityList");
      cityTagList = $("#cityTagList");
      pincodeInputBox = $("#pincodeInputBox");
      pincodeField = $("#getPincode");
      sellCarTabs = $("#sellCarTabs");
    }
  
    function registerDomEvents() {
      if (cityField.val().length > 0) {
        cityField.text("");
      }
  
      popularCityList
        .find('input[name="citySelect"]:checked')
        .prop("checked", false);
  
      $(cityField).cw_easyAutocomplete({
        inputField: $(cityField),
        resultCount: 5,
        source: ac_Source.globalCityLocation,
  
        click: function (event) {
          var cityPayload = $(cityField).getSelectedItemData().payload;
          var selectionLabel = $.trim(cityPayload.cityName);
          var selectionId = $.trim(cityPayload.cityId);
          processCitySelection(selectionId, selectionLabel);
        },
  
        keyup: function () {
          if ($(cityField).val().length === 0) {
            popularCityList.show();
          }
        },
  
        afterFetch: function (result, searchText) {
          if (result.length <= 0) {
            validate.field.setError(
              cityField,
              "Sorry! No matching results found. Try again."
            );
          } else {
            validate.field.hideError(cityField);
          }
          popularCityList.hide();
        },
  
        focusout: function () {
          if (!container.hasClass("city-select-done")) {
            popularCityList.show();
          }
        },
      });
      $(cityField).on("focus", function () {
        $("html, body").animate({
          scrollTop: container.offset().top,
        });
      });
  
      $(cityTagList).on("click", ".pill--active", function () {
        history.back();
      });
  
      $(popularCityList).on("change", "input[name=citySelect]", function () {
        if ($(this).val().length !== "0") {
          var selectionLabel = $.trim(
            $(this).next("label").find(".list-item__label").text()
          );
          var selectionVal = $.trim($(this).val());
  
          processCitySelection(selectionVal, selectionLabel);
          $("html, body").animate({
            scrollTop: container.offset().top,
          });
          disableNavigationTab();
        }
      });
  
      $(pincodeField).on("change", function () {
        var areaId = $.trim($(this).val());
        var selectedText = $(this).find("option:selected").text();
        var pincode = $.trim(selectedText.split(",")[0]);
        pincodeInputBox.attr("data-pincode", pincode);
        pincodeInputBox.attr("data-areaid", areaId);
        disableNavigationTab();
      });
  
      $(pincodeInputBox).on("keydown", ".chosen-container input", function (e) {
        var eventKeyCode = e.keyCode || e.which;
  
        if (eventKeyCode === 9 || eventKeyCode === 13) {
          setPincodeUserValue($(this));
        }
      });
  
      $(pincodeInputBox).on("keyup", ".chosen-container input", function (e) {
        var inputValue = $(this).val();
        var eventKeyCode = e.keyCode || e.which;
        pincodeKeyUp(inputValue, eventKeyCode);
      });
  
      $(pincodeInputBox).on("blur", ".chosen-container input", function (e) {
        setPincodeUserValue($(this));
      });
  
      $(pincodeInputBox).on("click", ".no-results", function () {
        var inputField = $(this).closest(".chosen-container").find("input");
        chosenSelect.noResultSelection(pincodeField, inputField);
      });
  
      $("#submitCityBtn").on("click", function () {
        submitCityBtnClick();
      });
  
      bindChoosenToPincode();
  
      $(sellCarTabs).on("click", ".cw-tabs .cw-tabs__item", function () {
        var scrollPosition = sellCarTabs.offset().top;
  
        $("html, body").animate({
          scrollTop: scrollPosition,
        });
      });
    }
  
    function pincodeKeyUp(inputValue, eventKeyCode) {
      if (eventKeyCode !== 13 && eventKeyCode !== 9 && inputValue.length < 7) {
        $(this).val("");
        $(this).val(inputValue);
        pincodeInputBox.attr("data-pincode", inputValue);
        pincodeInputBox.attr("data-areaid", -1);
      } else {
        var truncateValue = inputValue.substr(0, 6);
        $(this).val(truncateValue);
        $(this)
          .closest(".chosen-container")
          .find(".no-results span")
          .text(truncateValue);
      }
    }
  
    function submitCityBtnClick() {
      if (validatePinCode()) {
        $(".footer").hide();
        cityData = setPincodeData(
          pincodeInputBox.attr("data-pincode"),
          pincodeInputBox.attr("data-areaid")
        );
        var settings = {
          url:
            "/api/used/sell/c2bcity/?cityId=" + cityForm.getCityData().cityId,
          headers: { ServerDomain: "CarWale" },
          type: "GET",
        };
        parentContainer.setLoadingScreen();
        $.ajax(settings)
          .done(function (response) {
            parentContainer.removeIntroScreen(response); // set Navigation Tab for CarDetails or ContactDetails
            //calculate height of window and set it as a reference point when screen resizes
            //using setTimeout since keyboard remains open in previous screen while selecting pincode
            setTimeout(function () {
              events.publish("calculateAvailableHeight");
            }, 0);
          })
          .fail(function (xhr) {
            modalPopup.showModalJson(xhr.responseText);
          });
        parentContainer.removeLoadingScreen();
        $("#formContact").hide();
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitYear()"
        );
        cityClick();
        sellCarTracking.forMobile("pin", "Sell Car|" + cityForm.getCityData().cityName);
      }
    }
  
    function cityClick() {
      var isCarDetailsExists = document.getElementById("formCarDetail");
      if (isCarDetailsExists !== null) {
        parentContainer.removeIntroScreen(true);
        var goIndex1 = 1;
        historyObj.goToIndex(goIndex1);
        events.publish("updateHistoryIndex", { index: goIndex1 });
      } else {
        var settings1 = {
          url: "/sell-used-car/used/sell/cardetails/",
        };
        $.ajax(settings1)
          .done(function (response) {
            historyObj.addToHistory("selectMakeYear");
            $(".partialCarDetails").html(response);
            if (typeof events !== "undefined") {
              parentContainer.setButtonText("Prev", "Next");
              var eventObj = {
                data: cityData,
              };
              events.publish("citySubmit", eventObj);
            }
          })
          .fail(function (xhr) {
            parentContainer.removeLoadingScreen();
            modalPopup.showModal(xhr.responseText);
          });
      }
    }
  
    function processCitySelection(cityId, cityName) {
      fetchPincode(cityId).done(function (resp) {
        bindPincodeDropDown(pincodeField, resp);
      });
      cityData = appState.setSelectedData(cityData, {
        cityId: cityId,
        cityName: cityName,
      });
      if (typeof events !== "undefined") {
        events.publish("cityChanged", { cityId: cityData.cityId });
      }
      if (selectionTag.isCityNamePillVisible()) {
        selectionTag.updateCityNamePill(cityTagList, cityName);
      } else {
        citySelectionDone();
        selectionTag.attach(cityTagList, cityName);
      }
    }
  
    function validatePinCode() {
      return validateForm.pincode(pincodeInputBox.find("#getPincode"));
    }
  
    function setPincodeData(pincode, areaId) {
      if (pincode) {
        cityData = appState.setSelectedData(cityData, { pincode: pincode });
      } else {
        cityData = appState.deleteObjectProperties(cityData, ["pincode"]);
      }
      if (areaId !== "-1") {
        cityData = appState.setSelectedData(cityData, { areaId: areaId });
      } else {
        cityData = appState.deleteObjectProperties(cityData, ["areaId"]);
      }
      return cityData;
    }
  
    function clearAllProperties(obj) {
      obj = {};
      return obj;
    }
  
    function fetchPincode(cityId) {
      var url = "/api/locations/areacode/?cityId=" + cityId;
      var headers = { ServerDomain: "CarWale" };
      return ajaxRequest.getJsonPromiseV1(url,headers);
    }
  
    function bindPincodeDropDown(pincodeField, resp) {
      if (resp) {
        var bindingObj = resp.map(function (obj) {
          return { val: obj.AreaId, text: obj.Pincode + ", " + obj.AreaName };
        });
        var empty_option = pincodeField[0][0];
        pincodeField.empty();
        pincodeField.append(empty_option);
        pincodeField.append(templates.fillDropDownTemplate(bindingObj).join(""));
        pincodeField.trigger("chosen:updated");
      }
    }
  
    function setPincodeUserValue(inputField) {
      var inputValue = inputField.val();
  
      if (inputValue && inputValue.length === 6) {
        inputField.val(inputValue);
        chosenSelect.noResultSelection(pincodeField, inputField);
        sellCarTracking.forMobile("pin", "Sell Car|" + cityForm.getCityData().cityName);
      }
    }
  
    function citySelectionDone() {
      container.addClass("city-select-done");
      historyObj.addToHistory("selectPincode");
      popularCityList.show();
    }
  
    function resetForm() {
      container.removeClass("city-select-done");
      formField.resetInput(cityField);
      popularCityList.find("input[type=radio]:checked").attr("checked", false);
      formField.resetSelect(pincodeField);
    }
  
    function bindChoosenToPincode() {
      $(pincodeField).chosen({
        width: "100%",
        no_results_text: "Select:",
      });
      $(pincodeField)
        .closest(".select-box")
        .find(".chosen-search input")
        .prop("type", "text");
    }
  
    function setPincodeScreen() {
      termsAndConditions.closeModal();
      parentContainer.setIntroScreen();
    }
  
    function pillCancelClickHandler() {
      selectionTag.detach($(cityTagList).find(".pill--active"));
      cityData = clearAllProperties(cityData);
      resetForm();
    }
  
    function getCityData() {
      return cityData;
    }
  
    var validateForm = {
      pincode: function (pincodefield) {
        var fieldData = pincodeInputBox.attr("data-pincode");
        var isValid = false;
        if (!userPincode.validate(fieldData)) {
          validate.field.setError(
            pincodefield,
            fieldData && fieldData.trim()
              ? "Select correct Pincode"
              : "Please provide valid pincode"
          );
          pincodefield.closest(".field-box").addClass("done");
        } else {
          isValid = true;
        }
        return isValid;
      },
    };
  
    return {
      getCityData: getCityData,
      isProcessCitySelection: isProcessCitySelection,
      processCitySelection: processCitySelection,
    };
  })();
  
  function disableNavigationTab() {
    events.publish("updateNavigationTabClick", {
      tabNameArray: ["formCarDetail"],
      value: false,
    });
  }
  
  $(document).ready(function () {
    if (typeof events !== "undefined") {
      events.publish("cityDetailsDocReady");
    }
    sellCarCookie.deleteSellInquiryCookie();
    sellCarCookie.deleteTempInquiryCookie();
    sellCarTracking.forMobile("pageLoad");
  });
  