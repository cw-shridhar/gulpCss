var EditCarFlowForm = (function () {
  var editVersionInputBox,
    editMonthInputBox,
    editOwnerInputBox,
    editInsuranceYearInputBox,
    editInsuranceMonthInputBox,
    editInsuranceDayInputBox,
    ownerSelectField,
    colorField,
    expPriceField,
    kmDrivenField,
    formControlBox,
    selectBox,
    editInsurance,
    insuranceYearUnit,
    insuranceMonthUnit,
    registrationTypeField,
    registrationNoNumberField,
    registrationNoRtoField,
    registrationNoStateField,
    drpAdditionalFuel,
    cityMileageField,
    warrantiesField,
    commentsField,
    maxKmsPerYearLimitInput;
  var oldCarData;
  var priceData = {};
  var editForm = ".edit-flow-form";
  function editSellcarDocReady() {
    setSelectors();
    registerEvents();
    oldCarData = getCarData();
    editCarTracking.trackForMobile(
      editCarTracking.actionType.editPageLoad,
      "s" + $(editForm).attr("data-profileid")
    );
  }
  //Variables declared for selectors
  function setSelectors() {
    editVersionInputBox = $("#editVersion");
    editMonthInputBox = $("#editMonth");
    editColorInputBox = $("#editColor");
    editOwnerInputBox = $("#editOwner");
    editInsuranceYearInputBox = $("#editInsuranceYear");
    editInsuranceMonthInputBox = $("#editInsuranceMonth");
    editInsuranceDayInputBox = $("#editInsuranceDay");
    ownerSelectField = $("#ownerSelect");
    colorField = $("#colorValue");
    expPriceField = $("#getExpectedPrice");
    kmDrivenField = $("#getkmDriven");
    registrationTypeField = $("#editRegistrationType");
    registrationNoNumberField = document.getElementById("registration-no");
    registrationNoRtoField = document.getElementById("registration-rto");
    registrationNoStateField = document.getElementById("registration-state");
    formControlBox = $(".form-control-box");
    selectBox = ".select-box";
    editInsurance = "#editInsurance";
    otherColorUnit = $(".other-color-unit");
    insuranceYearUnit = $("#insuranceYear");
    insuranceMonthUnit = $(".insurance-month-unit");
    commentsField = $("#getComments");
    warrantiesField = $("#getWarranties");
    drpAdditionalFuel = document.getElementById("drpAdditionalFuel");
    cityMileageField = $("#getMileage");
    maxKmsPerYearLimitInput = $("#maxKmsPerYearLimit");
  }

  function getValuesFromUrl() {
    var dictionary = [],
      keyValuePairs,
      pair;
    var queryString = window.location.href.slice(
      window.location.href.indexOf("?") + 1
    );
    keyValuePairs = queryString.split("&");
    for (var i = 0; i < keyValuePairs.length; i++) {
      pair = keyValuePairs[i].split("=");
      dictionary.push(pair[0]);
      dictionary[pair[0]] = pair[1];
    }
    return dictionary;
  }

  //All events for the selectors
  function registerEvents() {
    formControlBox.children(selectBox).on("change", "select", function () {
      if ($(this).val() !== "0") {
        field.hideError($(this));
        $(this).parent().addClass("done");
      }
    });

    $(".input-box input").blur(function () {
      var currentVal = "";
      if ($(this).parent()[0].id === "registerNumber") {
        currentVal =
          registrationNoNumberField.value +
          registrationNoRtoField.value +
          registrationNoStateField.value;
      } else {
        currentVal = $(this).val();
      }
      if (currentVal.length > 0) {
        $(this).parent().addClass("done");
      } else {
        $(this).parent().removeClass("done");
      }
    });

    $(document).on("click", ".modal-box .modal__close", function () {
      history.back();
    });
    $(document).on("click", "#modalBg, .close-icon", function () {
      popUp.hidePopUp();
    });

    $(window).scroll(function () {
      fixButton();
    });

    $("#prevBtn").on("click", function () {
      editCarTracking.trackForMobile(
        editCarTracking.actionType.editBack,
        editCarTracking.actionType.editBack
      );
      window.history.back();
    });
    $("#nextBtn").on("click", function () {
      if (validateAllFields()) {
        var sellCarInfo = getCarData();
        trackChanges(sellCarInfo);
        var keyValuePairs = getValuesFromUrl();
        var sellCarConditions = {};
        sellCarConditions.InteriorColor = sellCarInfo.InteriorColor;
        sellCarConditions.AdditionalFuel = sellCarInfo.AdditionalFuel;
        sellCarConditions.CityMileage = sellCarInfo.CityMileage;
        sellCarConditions.Warranties = sellCarInfo.Warranties;
        sellCarConditions.InquiryId = keyValuePairs["id"];
        var sellInquiriesOtherDetails = {};
        sellInquiriesOtherDetails.CustomerId = parseInt(sellCarInfo.CustomerId);
        sellInquiriesOtherDetails.RegistrationNumber =
          sellCarInfo.RegistrationNumber;
        sellInquiriesOtherDetails.RegistrationPlace =
          sellCarInfo.RegistrationPlace;
        sellInquiriesOtherDetails.RegType = sellCarInfo.RegType;
        sellInquiriesOtherDetails.Color = sellCarInfo.Color;
        sellInquiriesOtherDetails.Owners = sellCarInfo.Owners;
        sellInquiriesOtherDetails.Insurance = sellCarInfo.Insurance;
        sellInquiriesOtherDetails.InsuranceExpiry = new Date(
          sellCarInfo.InsuranceExpiryYear,
          sellCarInfo.InsuranceExpiryMonth - 1,
          sellCarInfo.InsuranceExpiryDay
        );
        sellInquiriesOtherDetails.Comments = sellCarInfo.Comments;
        var customerSellInquiryVehicleData = {};
        customerSellInquiryVehicleData.VersionId = sellCarInfo.VersionId;
        customerSellInquiryVehicleData.MakeYear = new Date(
          sellCarInfo.ManufactureYear,
          sellCarInfo.ManufactureMonth
        );
        customerSellInquiryVehicleData.Kilometers = sellCarInfo.KmsDriven;
        customerSellInquiryVehicleData.Price = sellCarInfo.ExpectedPrice;

        var sellCarDetails = {};
        sellCarDetails.SellCarConditions = sellCarConditions;
        sellCarDetails.SellInquiriesOtherDetails = sellInquiriesOtherDetails;
        sellCarDetails.CustomerSellInquiryVehicleData = customerSellInquiryVehicleData;

        // ajax call
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(
          "POST",
          "/sell-used-car/myaccount/update-sell-car/?authToken=" +
            ($.cookie("encryptedAuthToken")
              ? $.cookie("encryptedAuthToken")
              : "")
        );
        xmlhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            var status = xmlhttp.status;
            if (status === 200) {
              window.location.href =
                "/sell-used-car/myaccount/upload-images/?car=s" +
                sellCarConditions.InquiryId +
                "&authtoken=" +
                $.cookie("encryptedAuthToken");
            }
          }
        };
        xmlhttp.send(JSON.stringify(sellCarDetails));
      }
    });
    //events for registrationNo
    registerEventsForRegistrationNo();

    $("#versionSelect").on("change", function () {
      $.ajax({
        url:
          "/api/versions/colors/?vids=" +
          $("#editVersion option:selected").val(),
        type: "GET",
        success: function (resp) {},
      });
    });

    formControlBox.children(editInsurance).on("change", "select", function () {
      if ($("#insuranceSelect option:selected").text() === "Expired") {
        insuranceYearUnit.hide();
        insuranceMonthUnit.hide();
      } else {
        insuranceYearUnit.show();
        insuranceMonthUnit.show();
      }
    });
    kmDrivenField.on("keypress", function (e) {
      var charCode = e.which ? e.which : e.keyCode;
      return charCode > 31 && (charCode < 48 || charCode > 57) ? false : true;
    });
    kmDrivenField.on("input propertychange", withComma);
    kmDrivenField.on("input propertychange", handleCommaDelete);
    expPriceField.on("keypress", function (e) {
      var charCode = e.which ? e.which : e.keyCode;
      return charCode > 31 && (charCode < 48 || charCode > 57) ? false : true;
    });
    expPriceField.on("input propertychange", withComma);
    expPriceField.on("input propertychange", handleCommaDelete);

    $(".chosen-container").on("mousedown", function (event) {
      $("input").blur(); //remove focus event for already selected dropdown in case user switches to another dropdown
    });
    $("input").on("focus", function () {
      var fieldPosition = $(this).offset().top - 50;
      $("html, body").animate(
        {
          scrollTop: fieldPosition,
        },
        200
      );
    });
  }

  //Register Events for Registration No
  function registerEventsForRegistrationNo() {
    registrationNoStateField.addEventListener("keyup", function (event) {
      var stateCode = event.target.value;
      if (event.keyCode !== 8) {
        //Moving to the next text field
        if (stateCode.length >= 2) {
          registrationNoRtoField.focus();
        }
        if (
          stateCode &&
          typeof carRegistrationNumber !== "undefined" &&
          !carRegistrationNumber.isStateCodeValid(stateCode)
        ) {
          showRegistrationNoError(true);
        } else {
          showRegistrationNoError(false);
        }
      }
    });

    registrationNoRtoField.addEventListener("keyup", function (event) {
      var rtoCode = event.target.value;
      var stateCode = registrationNoStateField.value;

      if (event.keyCode === 8 && !rtoCode) {
        moveCursorToStateField(stateCode);
      }
      //Moving to the next text field
      if (rtoCode.length >= 2) {
        registrationNoNumberField.focus();
      }
      if (
        (!stateCode && rtoCode) ||
        (rtoCode &&
          typeof carRegistrationNumber !== "undefined" &&
          !carRegistrationNumber.isRtoCodeValid(rtoCode))
      ) {
        showRegistrationNoError(true);
      } else if (
        rtoCode &&
        rtoCode.length === 2 &&
        typeof carRegistrationNumber !== "undefined"
      ) {
        showRegistrationNoError(
          !carRegistrationNumber.isValidRegisterationNo(stateCode + rtoCode)
        );
      } else {
        showRegistrationNoError(false);
      }
    });

    registrationNoNumberField.addEventListener("keyup", function (event) {
      var rtoCode = registrationNoRtoField.value;
      var stateCode = registrationNoStateField.value;
      var carNumber = event.target.value;
      if (event.keyCode === 8 && !carNumber) {
        if (rtoCode) {
          var len = rtoCode.length;
          registrationNoRtoField.focus();
          registrationNoRtoField.setSelectionRange(len, len);
        } else {
          moveCursorToStateField(stateCode);
        }
      }
      //Making sure that data in text field never exceeds the max length of 7
      if (carNumber.length > 7) {
        event.target.value = carNumber.substr(0, 7);
      }
      if (
        (event.keyCode !== 8 && (!stateCode || !rtoCode) && carNumber) ||
        (typeof carRegistrationNumber !== "undefined" &&
          (!carRegistrationNumber.isValidRegisterationNo(stateCode + rtoCode) ||
            (carNumber && !carRegistrationNumber.isNumberValid(carNumber))))
      ) {
        showRegistrationNoError(true);
      } else if (event.keyCode !== 8) {
        showRegistrationNoError(false);
      }
    });
  }

  function moveCursorToStateField(stateCode) {
    var len = stateCode.length;
    registrationNoStateField.focus();
    registrationNoStateField.setSelectionRange(len, len);
  }
  //Function for fixing buttons
  function fixButton() {
    $(document)
      .find(".extraDivHt")
      .height($(".floating-container").outerHeight());
    setButtonsScroll();
  }
  //Function for scrolling buttons
  function setButtonsScroll() {
    var scrollPosition =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;
    if (
      $(window).scrollTop() + $(window).height() >
      $(document).height() - 100
    ) {
      $(".extraDivHt").hide();
      $(".floating-container").removeClass("float-fixed").addClass("float");
    } else {
      $(".extraDivHt").show();
      $(".floating-container").removeClass("float").addClass("float-fixed");
    }
  }
  //Function for validating Owner
  function validateOwner() {
    if (editOwnerInputBox.find("#ownerSelect").val() === "0") {
      field.setError(editOwnerInputBox, "Please select owner type");
      return false;
    }
    return true;
  }
  //Function for validating registration type
  function validateRegistrationType() {
    if (registrationTypeField.find("#registrationTypeSelect").val() === "0") {
      field.setError(registrationTypeField, "Please select registration type");
      return false;
    }
    return true;
  }
  //Function for validating Version
  function validateVersion() {
    if (editVersionInputBox.find("#versionSelect").val() === "0") {
      field.setError(editVersionInputBox, "Please select version type");
      return false;
    }
    return true;
  }
  //Function for validating Color
  function validateColor() {
    if (colorField.val() === "") {
      field.setError(colorField, "Please enter color");
      return false;
    }
    return true;
  }
  //Function for validating Insurance Type
  function validateInsurance() {
    if ($(editInsurance).find("#insuranceSelect").val() === "0") {
      field.setError($(editInsurance), "Please select insurance type");
      return false;
    }
    return true;
  }
  //Function for validating Insurance Year
  function validateYear() {
    if ($("#insuranceYear").val() === "0") {
      field.setError(editInsuranceYearInputBox, "Please enter insurance year");
      return false;
    }
    return true;
  }
  //Function for validating Insurance Month
  function validateMonth() {
    if (
      editInsuranceMonthInputBox.find("#insuranceMonthSelect").val() === "0" &&
      $("#insuranceSelect option:selected").text() !== "Expired"
    ) {
      field.setError(
        editInsuranceMonthInputBox,
        "Please select insurance month"
      );
      return false;
    }
    return true;
  }

  function validateMfgMonth() {
    var isValid = false;
    var date = new Date();
    var currentMonth = date.getMonth();
    var currentYear = date.getFullYear();
    var monthField = editMonthInputBox.find("#monthSelect");
    var mfgYear = parseInt($(".js-year-in-number").attr("data-value-year"));
    if (monthField && parseInt(monthField.val()) <= 0) {
      field.setError(monthField, "Select month");
    } else if (
      mfgYear === currentYear &&
      parseInt(monthField.val(), 10) > currentMonth + 1
    ) {
      field.setError(monthField, "Please select a past month");
    } else {
      field.hideError(monthField);
      isValid = true;
    }
    return isValid;
  }

  function getOnRoadPrice({ versionId, cityId }) {
    let makeId = 0, modelId = 0;
    if(maxKmsPerYearLimitInput)
    {
      modelId = getIntFromString(maxKmsPerYearLimitInput.attr("data-model-id"));
      makeId = getIntFromString(maxKmsPerYearLimitInput.attr("data-make-id"));
    }
    $.when(
      getOnRoadPriceAjaxCall({ versionId, cityId, makeId, modelId })
        .done(function (response) {
          priceData = appState.setSelectedData(priceData, {
            OnRoadPrice: !!response ? response.maxPrice : 0,
          });
        })
        .fail(function (response) {})
    );
  }

  function getOnRoadPriceAjaxCall({ versionId, cityId, modelId, makeId }) {
    return $.ajax({
      type: "GET",
      url: "/api/version/" + versionId + "/price-range/?cityId=" + cityId + "&modelId=" + modelId + "&makeId=" + makeId,
      headers: { ServerDomain: "CarWale" },
      async: false,
    });
  }

  function spamDetectionAjaxCall(text) {
    if (text) {
      return $.ajax({
        type: "GET",
        url: "/api/detect-spam",
        data: { text: text },
        async: false,
      });
    }
  }

  function getRecommendedPriceAjaxCall(sellCarInfo) {
    var requestBody = {
      versionId: sellCarInfo.VersionId,
      owners: sellCarInfo.Owners,
      entryYear: new Date().getFullYear(),
      makeYear: sellCarInfo.ManufactureYear,
      cityId: sellCarInfo.CityId,
      kilometers: sellCarInfo.KmsDriven,
      valuationType: 2,
    };
    return $.ajax({
      type: "GET",
      url: "/api/used/valuation",
      data: requestBody,
      async: false,
      headers: { ServerDomain: "CarWale" },
    });
  }

  function getRecommendedPrice(sellCarInfo) {
    $.when(
      getRecommendedPriceAjaxCall(sellCarInfo)
        .done(function (response) {
          if (response) {
            priceData = appState.setSelectedData(
              priceData,
              { RecommendedPrice: response.Price },
              true
            );
          }
        })
        .fail(function (response) {})
    );
  }
  //Function for validating Expected Price
  function validateExpPrice() {
    var sellCarInfo = getCarData();
    sellCarInfo.CityId = parseInt($(editForm).attr("data-city-id"));
    var expectedPrice = sellCarInfo.ExpectedPrice;
    var currentYear = new Date().getFullYear();
    var carAge = 0;
    var makeYear = sellCarInfo.ManufactureYear;
    if (isNaN(expectedPrice)) {
      field.setError(expPriceField, "Please enter price");
      return false;
    }
    if (!isNaN(makeYear)) {
      carAge = currentYear - makeYear;
    }
    getRecommendedPrice(sellCarInfo);
    getOnRoadPrice({
      versionId: sellCarInfo.VersionId,
      cityId: sellCarInfo.CityId
    });
    var isPriceBelowLowerLimit = cardetailsUtil.priceValidator.isBelowLowerLimit(
      priceData.OnRoadPrice,
      expectedPrice,
      priceData.RecommendedPrice,
      carAge
    );
    if (isPriceBelowLowerLimit) {
      field.setError(expPriceField, "Price too low");
      return false;
    }
    var isPriceAboveUpperLimit = cardetailsUtil.priceValidator.isAboveUpperLimit(
      priceData.OnRoadPrice,
      expectedPrice,
      priceData.RecommendedPrice,
      carAge
    );
    if (isPriceAboveUpperLimit) {
      field.setError(expPriceField, "Price too high");
      return false;
    }
    return true;
  }

  function setSpamDetectionResult(text) {
    if (!text) {
      oldCarData.isOwnerCommentsSpam = false;
      return;
    }
    $.when(
      spamDetectionAjaxCall(text)
        .done(function (response) {
          if (response) {
            oldCarData.isOwnerCommentsSpam = response.isSpam;
          }
        })
        .fail(function () {
          oldCarData.isOwnerCommentsSpam = false;
        })
    );
  }

  //Function for validating Kilometer Driven
  function validateKmDriven() {
    var isValid = false;
    var kms = parseInt(kmDrivenField.attr("data-value"));
    if (isNaN(kms)) {
      field.setError(kmDrivenField, "Enter kilometers driven");
    } else if (kms < 100) {
      field.setError(kmDrivenField, "KMs driven should be more than 100");
    } else if (kms > 900000) {
      field.setError(kmDrivenField, "KMs driven should be below 9 Lakh kms ");
    } else if(!validateKmsPerYear({ kms })) {
      field.setError(
        kmDrivenField,
        "Maximum 3 Lacs km are allowed per year. Please enter appropriate value."
      );
      $("#expectedPriceInputBox").css("margin-top", "22px");
    } else {
      isValid = true;
      field.hideError(kmDrivenField);
    }

    return isValid;
  }

  function validateKmsPerYear({ kms }) {
    let isValid = true;
    var sellCarInfo = getCarData();
    if (!sellCarInfo) {
      return isValid;
    }
    if (!maxKmsPerYearLimitInput) {
      return isValid;
    }
    var maxKmsPerYearLimit = parseInt(maxKmsPerYearLimitInput.val(), 10);
    if (isNaN(maxKmsPerYearLimit)) {
      return isValid;
    }
    var currentYear = new Date().getFullYear();
    var makeYear = sellCarInfo.ManufactureYear;
    var carAge = !isNaN(makeYear) ? currentYear - makeYear + 1 : 0;
    if (carAge === 0) {
      return isValid;
    }
    isValid = kms <= (carAge * maxKmsPerYearLimit);
    return isValid;
  }

  function getCarData() {
    var carData = {
      ManufactureYear: $(".js-year-in-number").attr("data-value-year"),
      ManufactureMonth: parseInt(editMonthInputBox.find("#monthSelect").val()),
      VersionId: editVersionInputBox.find("#versionSelect").val(),
      Owners: ownerSelectField.val(),
      KmsDriven: kmDrivenField.attr("data-value"),
      ExpectedPrice: expPriceField.attr("data-value"),
      Insurance: $(editInsurance).find("#insuranceSelect").val(),
      RegistrationNumber:
        registrationNoStateField.value.trim() +
        registrationNoRtoField.value.trim() +
        registrationNoNumberField.value.trim(),
      Color: colorField.val(),
      InteriorColor: $("#getInteriorColor").val(),
      AdditionalFuel:
        drpAdditionalFuel.options[drpAdditionalFuel.selectedIndex].value,
      CityMileage: cityMileageField.val(),
      Warranties: document.getElementById("getWarranties").value,
      CustomerId: $("#getCustomerId").val(),
      RegType: registrationTypeField
        .find("#registrationTypeSelect option:selected")
        .text(),
      Comments: document.getElementById("getComments").value,
    };
    if (carData.Insurance && carData.Insurance != 3) {
      carData.InsuranceExpiryYear = $("#insuranceYear").val();
      carData.InsuranceExpiryMonth = editInsuranceMonthInputBox
        .find("#insuranceMonthSelect")
        .val();
      carData.InsuranceExpiryDay = editInsuranceDayInputBox
        .find("#insuranceDaySelect")
        .val();
    }
    return carData;
  }

  function trackChanges(currentData) {
    if (oldCarData && currentData) {
      var label = "";
      for (var key in currentData) {
        if (oldCarData[key] !== currentData[key]) {
          if (label) {
            label = label + "|" + key + "change";
          } else {
            label = key + "change";
          }
        }
      }
      if (label) {
        editCarTracking.trackForMobile(
          editCarTracking.actionType.editContinue,
          label
        );
      }
    }
  }
  //Function for validating Registration Number
  function showRegistrationNoError(show) {
    var regNo = document.querySelector("#registerNumber");
    if (show) {
      regNo.classList.add("invalid");
      regNo.querySelector(".error-text").textContent =
        "Please Provide Valid Registration No.";
    } else {
      regNo.classList.remove("invalid");
      regNo.querySelector(".error-text").textContent = "";
    }
  }

  function validateRegisterNo() {
    var isValid = true;
    var registrationNoVal = registrationNoNumberField.value.trim();
    var registrationRtoVal = registrationNoRtoField.value.trim();
    var registrationStateVal = registrationNoStateField.value.trim();

    if (
      !registrationStateVal ||
      !registrationRtoVal ||
      !registrationNoVal ||
      (carRegistrationNumber !== "undefined" &&
        (!carRegistrationNumber.isStateCodeValid(registrationStateVal) ||
          !carRegistrationNumber.isRtoCodeValid(registrationRtoVal) ||
          !carRegistrationNumber.isNumberValid(registrationNoVal) ||
          !carRegistrationNumber.isValidRegisterationNo(
            registrationStateVal + registrationRtoVal
          )))
    ) {
      isValid = false;
    }
    showRegistrationNoError(!isValid);
    return isValid;
  }

  function validateComment() {
    var isValidTextRequest = true;
    var reg = /<(.|\n)*?>/g;
    var ownerCommentsElement = document.getElementById("getComments");
    var ownerComments = ownerCommentsElement ? ownerCommentsElement.value : "";
    if (reg.test(ownerComments)) {
      field.setError(commentsField, "Only alphabets/numbers allowed");
      isValidTextRequest = false;
    } else if (ownerComments.length > 1000) {
      field.setError(commentsField, "Maximum 1000 characters");
    }
    setSpamDetectionResult(ownerComments);
    let profileId = $(editForm).attr("data-profileid");
    if (oldCarData && oldCarData.isOwnerCommentsSpam) {
      editCarTracking.trackForMobile(
        editCarTracking.actionType.spamComment,
        "profileId=" + profileId,
        ownerComments
      );
    }
    if (ownerComments && ownerComments !== oldCarData.Comments) {
      editCarTracking.trackForMobile(
        editCarTracking.actionType.commentsAdded,
        "profileId=" + profileId,
        ownerComments
      );
    }
    if (oldCarData) {
      isValidTextRequest = !oldCarData.isOwnerCommentsSpam;
      oldCarData.isOwnerCommentsSpam = false;
    }
    if (!isValidTextRequest) {
      showCommentError(true);
    } else {
      showCommentError(false);
    }
    return isValidTextRequest;
  }

  function showCommentError(show) {
    var commentArea = document.querySelector("#getComments");
    var errorBox = document.querySelector("#commentErrorText");
    if (show) {
      commentArea.classList.add("invalid");
      commentArea.classList.remove("mb-20");
      errorBox.classList.add("mb-20");
      errorBox.textContent = "Please enter valid comments";
    } else {
      commentArea.classList.remove("invalid");
      commentArea.classList.add("mb-20");
      errorBox.classList.remove("mb-20");
      errorBox.textContent = "";
    }
  }

  function validateAllFields() {
    return (
      validateOwner() &&
      validateMfgMonth() &&
      validateVersion() &&
      validateColor() &&
      validateInsurance() &&
      validateYear() &&
      validateMonth() &&
      validateExpPrice() &&
      validateKmDriven() &&
      validateRegistrationType() &&
      validateComment()
    );
  }
  function withComma() {
    var fieldValue = this.value,
      caretPos = this.selectionStart,
      lenBefore = fieldValue.length;
    fieldValue = fieldValue.replace(/[^\d]/g, "").replace(/^0+/, "");
    this.setAttribute("data-value", fieldValue);
    this.value = Common.utils.formatNumeric(fieldValue);
    var selEnd = caretPos + this.value.length - lenBefore;
    if (this.value[selEnd - 1] === ",") {
      selEnd--;
    }
    this.selectionEnd = selEnd > 0 ? selEnd : 0;
  }
  function handleCommaDelete(event) {
    var fieldValue = this.value;
    if (event.keyCode === 8) {
      //backspace
      if (fieldValue[this.selectionEnd - 1] === ",") {
        this.selectionEnd--;
      }
    } else if (event.keyCode === 46) {
      //delete
      if (fieldValue[this.selectionEnd] === ",") {
        this.selectionStart++;
      }
    }
  }

  $(document).ready(function () {
    EditCarFlowForm.editSellcarDocReady();
    ChosenInit($(editForm));
  });

  $(window).on("popstate", function () {
    if (editCarCommon.isVisible()) {
      editCarCommon.hideModal();
    }
  });

  return {
    editSellcarDocReady: editSellcarDocReady,
    withComma: withComma,
    handleCommaDelete: handleCommaDelete,
  };
})();
