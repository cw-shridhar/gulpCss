// dependency
// 1. static/m/js/used/sellcar/common.js
// 2. staic/js/used/sellcar/utilities.js

var carDetailsForm = (function () {
    var container,
      screenGroup,
      monthField,
      yearField,
      manufactureYearForm,
      carSelectForm,
      popularMakeList,
      carMakeField,
      carModelField,
      carVersionField,
      carSelectionTagList,
      alternateFuelBody,
      colorSelectionForm,
      otherColorField,
      ownerSelectionForm,
      kmsField,
      expectedPriceForm,
      insuranceForm,
      getExpectedPrice,
      registrationForm,
      insuranceMonthField,
      insuranceYearField,
      registrationStateCode,
      registrationRtoCode,
      registrationNumberCode;
    var isCarImagesViewLoaded = false;
  var carDetailsData = {};
  var basicCarPrice = 0;
    var registrationType;
    var carDetailsHistoryActive = []; // this array will contains values from 3 to 7
    var modelId, rootName, versionId; // used to show prefilled value
    var carDetailsScreenVisitedArray = [1, 0, 0, 0, 0, 0, 0];
    var isForwardFlow = false; // isForwardFlow is used to make sure that history index is not reduced when setscreen functions are called and the flow is forward
    if (typeof events !== "undefined") {
      // this form will load async, hence no document ready function
      //The caller needs to publish 'contactSubmit' event to show the form
  
      events.subscribe("citySubmit", setSelectors);
      events.subscribe("citySubmit", registerDomEvents);
      events.subscribe("citySubmit", carDetailsFormLoadHandler);
  
      events.subscribe("setContactScreen", setContactScreen);
      events.subscribe("setInsuranceScreen", setInsuranceScreen);
      events.subscribe("setYearScreen", setYearScreen);
      events.subscribe("setCarSelectionScreen", setCarSelectionScreen);
      events.subscribe("setColorScreen", setColorScreen);
      events.subscribe("setOwnerScreen", setOwnerScreen);
      events.subscribe("setKmsScreen", setKmsScreen);
      events.subscribe("setExpectedPriceScreen", setExpectedPriceScreen);
      events.subscribe("carImageHtmlSuccess", onCarImageHtmlSucces);
      events.subscribe("updateCarDetails", updateCarDetails);
      events.subscribe("buyingIndexSuccess", buyingIndexSuccess);
      events.subscribe("buyingIndexFailed", buyingIndexFailed);
      events.subscribe("takenLive", setInsuranceScreen);
      events.subscribe("preventBack", preventBack);
      events.subscribe("navigateAwayInsurance", navigateAwayInsurance);
      events.subscribe("navigateAwayCarDetails", navigateAwayCarDetails);
      events.subscribe("historyIndexChanged", pushHistoryIndex);
      events.subscribe("carDetailsTabClick", carDetailsTabClickHandler);
      events.subscribe("contactDetailsTabClick", contactDetailsTabClickHandler);
      events.subscribe("historyIndexPoped", removeFromHistoryIndex);
      events.subscribe("historynull", clearHistory);
      events.subscribe("contactDetailsChanged", updateCarDetailsFromContact);
    }
  
    function navigateAwayCarDetails() {
      window.removeEventListener("beforeunload", parentContainer.onPageUnload);
      var historyIndex = historyHelper.getHistoryIndex();
      history.go(-historyIndex);
      setTimeout(function () {
        var sellCarPath = "/sell-used-car";
        if (location.search && location.search !== "") {
          sellCarPath += location.search;
        }
        location.href = sellCarPath;
      }, 0);
    }
  
    function navigateAwayInsurance() {
      parentContainer.setLoadingScreen();
      events.publish("navigateAway", { container: container });
    }
  
    function carDetailsFormLoadHandler(eventObj) {
      init();
      container.show();
      $("#bodyYearform").addClass("active");
  
      if (eventObj && eventObj.data) {
        carDetailsData = appState.setSelectedData(carDetailsData, eventObj.data);
      }
    }
  
    function updateCarDetailsFromContact(eventObj) {
      if (eventObj && eventObj.data) {
        carDetailsData = appState.setSelectedData(carDetailsData, eventObj.data);
      }
    }
  
    function updateCarDetails(eventObj) {
      if (eventObj) {
        carDetailsData = appState.setSelectedData(eventObj, true);
        $("#summaryToolbar")
          .find("li[data-field-id='getMobile'] .item-value__data")
          .text(eventObj.sellCarCustomer.mobile);
      }
    }
  
    function setSelectors() {
      container = $("#formCarDetail");
      screenGroup = $("#formCarDetail.form-screen-group");
      monthField = $("#getMonth");
      yearField = $("#getYear");
      manufactureYearForm = $("#bodyYearform");
      carSelectForm = $("#bodyCarForm");
      popularMakeList = $("#popularMakeList");
      carMakeField = $("#getCarMake");
      carModelField = $("#getCarModel");
      carVersionField = $("#getCarVersion");
      carSelectionTagList = $("#carSelectionTagList");
      alternateFuelBody = $("#alternateFuelBody");
      colorSelectionForm = $("#bodyColorForm");
      otherColorField = $("#otherColorField");
      ownerSelectionForm = $("#bodyOwnerForm");
      kmsField = $("#getKms");
      expectedPriceForm = $("#bodyExpectedPrice");
      getExpectedPrice = $("#getExpectedPrice");
      insuranceForm = $("#bodyInsurance");
      insuranceMonthField = $("#getInsuranceMonth");
      insuranceYearField = $("#getInsuranceYear");
      registrationForm = $("#getRegistration");
      registrationType = $("#getRegistraionType");
      registrationStateCode = document.getElementById("registerStateCode");
      registrationRtoCode = document.getElementById("registerRtoCode");
      registrationNumberCode = document.getElementById("registerCarNumber");
    }
  
    function init() {
      var selectBox = container.find(".select-box");
  
      selectBox.each(function () {
        var element = $(this);
  
        element.find(".chosen-select").chosen({
          width: "100%",
        });
        if (element.hasClass("select-box-no-input")) {
          chosenSelect.removeInputField(element);
        }
      });
      parentContainer.removeLoadingScreen();
    }
  
    function registerDomEvents() {
      popularMakeList.on("change", "input[type=radio]", function () {
        if ($(this).val() !== "0") {
          var selectionId = $(this).val();
          carSelectForm.find("#getCarMake").val(selectionId).change();
        }
      });
  
      manufactureYearForm.on("change", ".select-box select", function () {
        if (carSelectForm.find("#getCarMake").val() !== "0") {
          resetCarSelectionForm();
          resetCarSelectionScreen();
          resetColorForm();
          resetOwnerForm();
          resetExpectedPriceForm();
        }
        if ($(this).attr("id") === "getMonth") {
          $(".js-mfg__month--optional").addClass("mfg__month");
        }
        else {
          yearField.trigger("chosen:open");
        }
      });

      carSelectForm.on("click", ".js-fuel-selection-pill", function(event)
      {
        fuelSelection.handleFuelSelectionPillClick({ event });
        parentContainer.setLoadingScreen();
        formField.resetSelect(carVersionField);
        let activeVersionList = fuelSelection.getVersionListByFuelType(carDetailsData.allVersionList);
        if(!Array.isArray(activeVersionList) || activeVersionList.length <= 0)
        {
          bindVersionDropDown([], carVersionField);
          parentContainer.removeLoadingScreen();
          validateScreen.setError("No version found for this selection");
          return;
        }
        bindVersionDropDown(activeVersionList, carVersionField);
        parentContainer.removeLoadingScreen();
        carVersionField.trigger("chosen:results_without_focus");
        prefillVersion();
        carSelectForm.animate({
          scrollTop: carSelectForm.height(),
        });
      });
  
      carSelectForm.on("focus", ".chosen-container input", function () {
        var scrollPosition =
          $("#bodyCarForm .screen__head").outerHeight(true) +
          $("#carSelectionTagList").height();
        $(carSelectForm).animate({
          scrollTop: scrollPosition,
        });
      });
  
      carSelectForm.on("change", ".step-group select", function () {
        selectMMV($(this));
      });
  
      carSelectionTagList.on("click", ".pill--active", function () {
        onChangeMMV($(this));
      });
  
      otherColorField.on("focus", "input", function () {
        var scrollPosition =
          colorSelectionForm.find(".screen__head").outerHeight(true) +
          colorSelectionForm.find("#getColor").height();
        $(colorSelectionForm).animate({
          scrollTop: scrollPosition,
        });
      });
  
      colorSelectionForm.on("change", "input[name=carColour]", function () {
        if ($(this).val() === "0") {
          otherColorField.show();
          colorSelectionForm.animate({
            scrollTop: colorSelectionForm.height(),
          });
        } else {
          otherColorField.hide();
          submitColour();
        }
        validateScreen.hideError();
      });
  
      ownerSelectionForm.on("change", "input[name=carOwner]", function () {
        validateScreen.hideError();
        submitOwner();
        resetExpectedPriceForm();
      });
  
      formatValue.formatValueOnInput(kmsField);
      $("#kmsInputBox").on("focus", "input", function () {
        $("#floatButton").hide();
      });
      $("#kmsInputBox").on("blur", "input", function () {
        $("#floatButton").delay(200).fadeIn();
      });
  
      formatValue.formatValueOnInput(getExpectedPrice);
  
      $("#expectedPriceInputBox").on("focus", "input", function () {
        var scrollPosition =
          expectedPriceForm.find(".screen__head").outerHeight(true) +
          expectedPriceForm.find(".recommend-price-box").outerHeight(true) -
          40;
        $("#bodyExpectedPrice").animate({
          scrollTop: scrollPosition,
        });
      });
  
      // insurance
      insuranceForm.on("change", "input[name=carInsurance]", function () {
        if ($(this).val() !== "3") {
          $("#insuranceValidity").show();
          insuranceForm.addClass("validity-active");
          var scrollPosition =
            insuranceForm.find(".screen__head").outerHeight(true) +
            insuranceForm.find("#getInsurance").height() -
            20;
          insuranceForm.animate({
            scrollTop: scrollPosition,
          });
        } else {
          $("#insuranceValidity").hide();
          insuranceForm.removeClass("validity-active");
          formField.emptySelect(insuranceMonthField);
          formField.emptySelect(insuranceYearField);
        }
      });
  
      insuranceForm.on("change", "#getInsuranceMonth", function () {
        if (parseInt($(this).val()) > 0) {
          insuranceForm.find(".register--input-1").blur();
          insuranceYearField.trigger("chosen:open");
        }
      });
  
      insuranceForm.on("change", "#getInsuranceYear", function () {
        if (parseInt($(this).val()) > 0) {
          insuranceForm.find(".register--input-1").focus();
        }
      });
  
      insuranceForm.on("keyup", ".register--input-1", function () {
        if ($(this).val().length === "2") {
          $(this).next(".register--input-2").focus();
        }
      });
  
      insuranceForm.on("mouseup", ".chosen-container", function () {
        $("#registrationNumber").find("input").blur();
      });
  
      $("#registrationNumber").on("focus", "input", function () {
        var scrollPosition =
          insuranceForm.find(".screen__head").outerHeight(true) +
          insuranceForm.find("#getInsurance").height() +
          insuranceForm.find("#insuranceValidity").height() +
          80;
        $(insuranceForm).animate({
          scrollTop: scrollPosition,
        });
      });
  
      $("#registrationType").on("change", "#getRegistraionType", function () {
        var registrationType = $("#registrationType");
        if ($(this).val() !== "0" && registrationType.hasClass("invalid")) {
          registrationType.removeClass("invalid").find(".error-text").text("");
        }
        if ($(this).val() !== "0") {
          registrationType.find(".select-label").hide();
        }
      });
      registrationStateCode.addEventListener("keyup", function (event) {
        onKeyUpRegistrationState(event);
      });
      registrationRtoCode.addEventListener("keyup", function (event) {
        onKeyUpRegistrationRto(event);
      });
    }
  
    function showRegistrationNoError(show) {
      if (show) {
        registrationForm
          .addClass("invalid")
          .find(".error-text")
          .text("Please Provide Valid Registration No.");
        var stateCode = $("#registerStateCode").val();
        var rtoCode = $("#registerRtoCode").val();
        sellCarTracking.forMobile("regnumbererror", "statecode=" + stateCode + "|citycode=" + rtoCode);
      } else {
        registrationForm.removeClass("invalid").find(".error-text").text("");
      }
    }
  
    function resetBuyingIndexPrice(expectedPriceField) {
      expectedPriceField.find(".js-price-range").hide();
    }
  
    function bindBuyingIndexPrice(resp, expectedPriceField) {
      expectedPriceField.find(".js-price-range").show();
      expectedPriceField
      .find("#fairConditionPriceText")
      .text("₹ " + resp.fairConditionPrice);
      expectedPriceField
      .find("#goodConditionPriceText")
      .text("₹ " + resp.goodConditionPrice);
    }
  
    function buyingIndexSuccess(resp) {
      if (resp && resp.Price) {
        bindBuyingIndexPrice(resp, expectedPriceForm);
        carDetailsData = appState.setSelectedData(carDetailsData, {
          RecommendedPrice: $.trim(resp.Price),
        });
        sellCarTracking.forMobile("recomPriceShown", "Sell Car|" + cityForm.getCityData().cityName);
      } else {
        resetBuyingIndexPrice(expectedPriceForm);
      }
    }
  
    function buyingIndexFailed(response) {
      resetBuyingIndexPrice(expectedPriceForm);
    }
  
    function preventBack() {
      historyObj.addToHistory("selectInsurance");
      parentContainer.setNavigateAwayModal("formCarInsurance");
    }
  
    function selectMMV(target) {
      var selectedItem = target.find("option:selected");
  
      if (selectedItem.val() !== "0") {
        var selectionText = target.find("option:selected").text(),
          selectionId = $.trim(target.find("option:selected").val()),
          groupItem = target.closest(".step-group__item");
  
        var tagListContainer = target
            .closest(".step-group")
            .find(".step-group__selected"),
          tagItem =
            '<li class="btn-pill pill--auto-12 pill--active" data-id="' +
            target.attr("id") +
            '">' +
            selectionText +
            '<span class="pill__cross"></span></li>';
  
        tagListContainer.show().find("ul").append(tagItem);
  
        groupItem.hide().next(".step-group__item").show();
  
        switch (target.attr("id")) {
          case "getCarMake":
            carDetailsData = appState.setSelectedData(carDetailsData, {
              makeId: selectionId,
            });
            parentContainer.setLoadingScreen();
            fetchModel(selectionId, yearField.val())
              .done(function (resp) {
                bindModelDropDown(resp, carModelField);
                parentContainer.removeLoadingScreen();
                carModelField.trigger("chosen:results_without_focus");
                prefillModel();
                // scroll
                carSelectForm.animate({
                  scrollTop: carSelectForm.height(),
                });
              })
              .fail(function () {
                parentContainer.removeLoadingScreen();
                validateScreen.setError("No model found for this selection");
              });
            alternateFuelBody.hide();
            break;
  
          case "getCarModel":
            var modelsList = document.getElementById("getCarModel");
            var selectedOption = modelsList.options[modelsList.selectedIndex];
            var selectedRoot = selectedOption.getAttribute("data-attribute-model");	
						carDetailsData = appState.setSelectedData(carDetailsData, {
              modelId: selectionId,
              rootName: selectedRoot
            });
            parentContainer.setLoadingScreen();
            fetchVersion(selectionId, yearField.val())
              .done(function (resp) {
                carDetailsData.allVersionList = resp;
                let activeVersionList = fuelSelection.getVersionListByFuelType(carDetailsData.allVersionList);
                sellCarTracking.forMobile("versionScreenWithFuelSelection");
                bindVersionDropDown(activeVersionList, carVersionField);
                parentContainer.removeLoadingScreen();
                carVersionField.trigger("chosen:results_without_focus");
                prefillVersion();
                // scroll
                carSelectForm.animate({
                  scrollTop: carSelectForm.height(),
                });
              })
              .fail(function () {
                parentContainer.removeLoadingScreen();
                validateScreen.setError("No version found for this selection");
              });
            alternateFuelBody.hide();
            break;
  
          case "getCarVersion":
            carDetailsData = appState.setSelectedData(carDetailsData, {
              versionId: selectionId,
            });
            if (typeof events !== "undefined") {
              events.publish("versionChanged", {
                makeId: carDetailsData.makeId,
                modelId: carDetailsData.modelId,
                versionId: carDetailsData.versionId,
              });
            }
            var colorSelectionUl = colorSelectionForm.find(".option-list");
            colorSelectionUl.html("");
            fetchColor(selectionId).done(function (resp) {
              bindColor(resp, colorSelectionUl);
            });
            fetchPrice({
							versionId: selectionId,
							cityId: cityForm.getCityData().cityId,
							modelId: carDetailsData.modelId,
							makeId: carDetailsData.makeId
						}).done(function (resp) {
              basicCarPrice = !!resp ? resp.maxPrice : 0;
            }).fail(function() {
              basicCarPrice = 0;
            });
            alternateFuelBody.show();
            break;
  
          default:
            break;
        }
        resetColorForm();
        resetOwnerForm();
        resetExpectedPriceForm();
      }
  
      validateScreen.hideError();
    }
  
    function onKeyUpRegistrationRto(event) {
      var rtoCode = event.target.value;
      if (event.target.value.length >= 2) {
        registrationNumberCode.focus();
      }
      if (event.keyCode === 8 && !rtoCode) {
        registrationStateCode.focus();
      }
    }
    function onFocusOutRegistrationRto(event) {
      var rtoCode = event.target.value;
      var stateCode = registrationStateCode.value;
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
    }
  
    function onKeyUpRegistrationState(event) {
      if (event.target.value.length >= 2) {
        registrationRtoCode.focus();
      }
    }
    function onFocusOutRegistrationState(event) {
      var stateCode = event.target.value;
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
  
    function onFocusOutRegistrationNumber(event) {
      var rtoCode = registrationRtoCode.value;
      var stateCode = registrationStateCode.value;
      var carNumber = event.target.value;
      if (event.keyCode === 8 && !carNumber) {
        if (stateCode) {
          registrationRtoCode.focus();
        } else {
          registrationStateCode.focus();
        }
      }
      if (carNumber.length > 7) {
        event.target.value = carNumber.value.substr(0, 7);
      }
  
      if (
        ((!stateCode || !rtoCode) && carNumber) ||
        (typeof carRegistrationNumber !== "undefined" &&
          (!carRegistrationNumber.isValidRegisterationNo(stateCode + rtoCode) ||
            (carNumber && !carRegistrationNumber.isNumberValid(carNumber))))
      ) {
        showRegistrationNoError(true);
      } else {
        showRegistrationNoError(false);
      }
    }
  
    function onChangeMMV(target) {
      var stepGroup = target.closest(".step-group"),
        fieldId = target.attr("data-id");
  
      target.nextAll().remove();
      if (!target.siblings().length) {
        carSelectionTagList.hide();
      }
      target.remove();
  
      switch (fieldId) {
        case "getCarMake":
          carDetailsData = appState.deleteObjectProperties(carDetailsData, [
            "makeId",
          ]);
          resetCarSelectionForm();
          fuelSelection.resetFuelType();
          break;
  
        case "getCarModel":
          carDetailsData = appState.deleteObjectProperties(carDetailsData, [
            "modelId",
          ]);
          formField.resetSelect(carVersionField);
          fuelSelection.resetFuelType();
          break;
  
        case "getCarVersion":
          carDetailsData = appState.deleteObjectProperties(carDetailsData, [
            "versionId",
          ]);
          break;
  
        default:
      }
  
      stepGroup.find(".step-group__item").hide();
  
      var selectField = stepGroup.find("#" + fieldId);
      selectField.closest(".step-group__item").show();
      selectField
        .closest(".field-box")
        .removeClass("done")
        .find(".chosen-container")
        .removeClass("chosen-container-active");
      selectField.val("0").change();
      selectField.trigger("chosen:updated");
      if (fieldId !== "getCarMake") {
        selectField.trigger("chosen:results_without_focus");
      }
  
      alternateFuelBody.hide();
  
      resetColorForm();
      resetOwnerForm();
      resetExpectedPriceForm();
    }
  
    function bindColor(resp, colorField) {
      var colorLi = [];
      if (resp && resp.carColors && resp.carColors[0].length > 0) {
        var colorListLength = resp.carColors[0].length;
        var uniqueColorList = resp.carColors[0]
          .map(function (item) {
            return (
              item.name.split("/")[0] +
              "_" +
              item.displayName.split(",")[0] +
              "_" +
              item.value.split(",")[0]
            );
          }) // give an array ["name_displayName_value","name_displayName_value"]
          .filter(function (item, index, self) {
            return self.indexOf(item) === index;
          }) // filter duplicate "name_value" string
          .map(function (item, index) {
            var colorVal = index + 1;
            //other color
          if (index === colorListLength - 1) {
            colorVal = 0;
          }
            var colorId = "color" + colorVal;
            var data = item.split("_");
            return {
              colorId: colorId,
              colorVal: colorVal,
              colorHash: data[2],
              colorName: data[0],
              colorDisplayName: data[1],
            };
          }); // give an array for bindig with template
        colorLi = templates.fillColorTemplate(uniqueColorList);
      }
      colorField.append(colorLi.join(""));
    }
  
    function fetchColor(versionId) {
      var url = "/api/versions/colors/?vids=" + versionId;
      return ajaxRequest.getJsonPromiseV1(url);
  }
  
  function fetchPrice({ versionId, cityId, makeId, modelId }) {
    var url = "/api/version/" + versionId + "/price-range/?cityId=" + cityId + "&modelId=" + modelId + "&makeId=" + makeId;
    var headers = { ServerDomain: "CarWale" };
    return ajaxRequest.getJsonPromiseV1(url, headers);
  }
  
    function bindVersionDropDown(resp, versionField) {
      var bindingObj = resp.map(function (obj) {
        return { val: obj.ID, text: obj.Name };
      });
      versionField.append(templates.fillDropDownTemplate(bindingObj).join(""));
      versionField.trigger("chosen:updated");
    }
  
    function fetchVersion(modelId, year) {
      var versionType = "used";
      var url =
        "/webapi/carversionsdata/GetCarVersions/?isActive=true&type=" +
        versionType +
        "&modelId=" +
        modelId +
        "&year=" +
        year;
      return ajaxRequest.getJsonPromiseV1(url);
    }
  
    function bindModelDropDown(resp, modelField) {
      var bindingObj = resp.map(function (obj) {
        return { val: obj.ModelId, text: obj.ModelName, rootName: obj.RootName };
      });
      bindingObj = cardetailsUtil.removeModelYear(bindingObj);
      modelField.append(templates.fillDropDownTemplate(bindingObj).join(""));
      modelField.trigger("chosen:updated");
    }
  
    function fetchModel(makeId, year) {
      var modelType = "used";
      var url =
        "/webapi/carmodeldata/GetCarModelsByType/?type=" +
        modelType +
        "&makeId=" +
        makeId +
        "&year=" +
        year +
        "&isActive=" +
        true;
      return ajaxRequest.getJsonPromiseV1(url);
    }
  
    function closeActiveSummary() {
      if (summary.isSummaryActive()) {
        summary.closeSummary();
        return true;
      }
      return false;
    }
  
    function updateNavigationTab() {
      parentContainer.setNavigationTab("formCarDetail");
      parentContainer.setButtonText("Prev", "Next");
      events.publish("popHistory");
      events.publish("updateNavigationTabClick", {
        tabNameArray: ["formCarDetail"],
        value: true,
      });
    }
  
    function setYearScreen() {
      console.log("setYearScreen method called");
      if (!closeActiveSummary() && !modalPopup.closeActiveModalPopup()) {
        if ($("#bodyYearform").hasClass("active")) {
          // remove active from all other children with set carDetails on Manufacturer Year Screen
          $("#formCarDetail.form-screen-group")
            .children("div")
            .removeClass("active");
        }
  
        summary.showToolbar();
        validateScreen.show();
        prefillYearAndMonth();
  
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitYear()"
        );
  
        $("#bodyYearform").addClass("active");
  
        container.show();
        isForwardFlow = false;
        updateNavigationTab();
      }
    }
  
    function setCarSelectionScreen() {
      console.log("setCarSelection Screen called.");
      if (
        !closeActiveSummary() &&
        !modalPopup.isOtpModalPopupVisible() &&
        !modalPopup.closeActiveModalPopup()
      ) {
        if (!isForwardFlow) {
          slideToTopIfNoTabclicked();
          parentContainer.setNavigationTab("formCarDetail");
          events.publish("popHistory");
        }
        parentContainer.setButtonText("Prev", "Next");
        isForwardFlow = false;
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitCarDetails()"
        );
      }
    }
  
    function setColorScreen() {
      if (
        !closeActiveSummary() &&
        !modalPopup.isOtpModalPopupVisible() &&
        !modalPopup.closeActiveModalPopup()
      ) {
        if (!isForwardFlow) {
          slideToTopIfNoTabclicked();
          parentContainer.setNavigationTab("formCarDetail");
          events.publish("popHistory");
        }
        parentContainer.setButtonText("Prev", "Next");
  
        isForwardFlow = false;
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitColour()"
        );
      }
    }
  
    function setOwnerScreen() {
      console.log("setOwner Screen called.");
      if (
        !closeActiveSummary() &&
        !modalPopup.isOtpModalPopupVisible() &&
        !modalPopup.closeActiveModalPopup()
      ) {
        if (!isForwardFlow) {
          slideToTopIfNoTabclicked();
          parentContainer.setNavigationTab("formCarDetail");
          events.publish("popHistory");
        }
        parentContainer.setButtonText("Prev", "Next");
        isForwardFlow = false;
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitOwner()"
        );
      }
    }
  
    function setKmsScreen() {
      console.log("setKMS Screen called.");
      if (
        !closeActiveSummary() &&
        !modalPopup.isOtpModalPopupVisible() &&
        !modalPopup.closeActiveModalPopup()
      ) {
        if (!isForwardFlow) {
          slideToTopIfNoTabclicked();
          parentContainer.setNavigationTab("formCarDetail");
          events.publish("popHistory");
        }
        parentContainer.setButtonText("Prev", "Next");
        isForwardFlow = false;
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitKmsDriven()"
        );
      }
    }
  
    function setExpectedPriceScreen() {
      console.log("setExpectedPrice Screen called.");
      if (!closeActiveSummary() && !modalPopup.closeActiveModalPopup()) {
        if (!isForwardFlow) {
          parentContainer.setAllScreenActive(screenGroup);
          parentContainer.setNavigationTab("formCarDetail");
          events.publish("popHistory");
          while (carDetailsHistoryActive.length < 7) {
            var lastValue = carDetailsHistoryActive.length;
            carDetailsHistoryActive.push(lastValue + 1);
          }
        }
        container.show();
        parentContainer.setButtonText("Prev", "Next");
        setTabClickAttribute(false);
  
        isForwardFlow = false;
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitExpectedPrice()"
        );
      }
    }
  
    function setInsuranceScreen() {
      console.log("Set Insurance Screen called");
      if (!closeActiveSummary() && !modalPopup.closeActiveModalPopup()) {
        historyObj.replaceHistory("preventBack");
        historyObj.addToHistory("selectInsurance");
        parentContainer.setAllScreenActive(screenGroup);
        parentContainer.slideNextScreen(screenGroup);
        parentContainer.setButtonText("", "Next");
        summary.hideToolbar();
        $("#formContainer").show();
        container.show();
        $("body").addClass("insurance-form-active");
        $("#formCarImage").hide();
        parentContainer.setButtonTarget(null, "carDetailsForm.submitInsurance()");
      }
    }
    function removeQuotes(value) {
      return value.replace(/^"(.*)"$/, "$1");
    }
    function prefillYearAndMonth() {
      var month, year;
      month = getQueryStringParam("month");
      year = getQueryStringParam("year");
      if (monthField && monthField.val() <= 0) {
        monthField.val(removeQuotes(month)).change().trigger("chosen:updated");
      }
      if (year && yearField.val() <= 0) {
        yearField
          .val(removeQuotes(year))
          .change()
          .trigger("chosen:updated")
          .trigger("chosen:close");
      }
    }
  
    function prefillMake() {
      var car;
      if (
        carMakeField.val() === "0" &&
        (car = getQueryStringParam("car")) !== ""
      ) {
        // prefil only if no make is not selected
        var settings = {
          type: "GET",
          url:
            "/webapi/CarVersionsData/GetCarDetailsByVersionId/?versionid=" + car,
          dataType: "Json",
        };
        $.ajax(settings).done(function (resp) {
          if (resp) {
            modelId = resp.ModelId;
            versionId = resp.VersionId;
            carMakeField.val(resp.MakeId).change().trigger("chosen:update");
          }
        });
      }
    }
    function prefillModel() {
      if (carModelField.val() === "0") {
        // prefill only if no model is not selected
        carModelField.val(modelId);
        if (carModelField.val(modelId)) {
          // trigger change only if value is selected
          carModelField.change().trigger("chosen:updated");
        }
      }
    }
  
    function prefillVersion() {
      if (carVersionField.val() === "0") {
        // prefil only if no version is selected
        carVersionField.val(versionId);
        if (carVersionField.val()) {
          // trigger change only if value is selected
          carVersionField
            .change()
            .trigger("chosen:updated")
            .trigger("chosen:close");
        }
      }
    }
  
    function prefillOwners() {
      var owner = "";
      if (
        !ownerSelectionForm.find("input[name=carOwner]").is(":checked") &&
        (owner = getQueryStringParam("owner")) !== ""
      ) {
        // prefil only if owners is not selected
        owner = owner > 4 ? 4 : owner;
        ownerSelectionForm
          .find("input[name=carOwner]#owner" + owner)
          .prop("checked", true);
      }
    }
  
    function prefillKms() {
      var kms = "";
      if (!kmsField.val() && (kms = getQueryStringParam("kms")) !== "") {
        // prefill only if kilometers are not selected
        kmsField.val(kms);
        kmsField.trigger("propertychange");
        kmsField.closest(".field-box").addClass("done");
      }
    }
    // submit buttons
  function submitYear() {
    var currentMonth = new Date().getMonth();
    if (monthField && monthField.val() <= 0)
    {
      monthField.val(currentMonth + 1);
    }
      if (monthField && validateYearForm()) {
        carDetailsData = appState.setSelectedData(carDetailsData, {
          manufactureMonth: $.trim(monthField.find("option:selected").val()),
        });
        carDetailsData = appState.setSelectedData(carDetailsData, {
          manufactureYear: $.trim(yearField.find("option:selected").val()),
        });
        if (typeof events !== "undefined") {
          events.publish("yearChanged", { year: carDetailsData.manufactureYear });
        }
  
        summary.setSummary(manufactureYearForm);
  
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitCarDetails()"
        );
        prefillMake();
        if (carDetailsScreenVisitedArray[1]) {
          historyObj.goToIndex(1);
          isForwardFlow = true;
          events.publish("pushHistory");
        } else {
          historyObj.addToHistory("selectCar");
          carDetailsScreenVisitedArray[1] = 1;
        }
        parentContainer.slideNextScreen(screenGroup);
        sellCarTracking.forMobile("mfgYear", "Sell Car|" + cityForm.getCityData().cityName);
      }
    }
  
    function setTabClickAttribute(value) {
      container.attr("tabclick", value);
    }
  
    function isTabClicked() {
      return container && container.attr("tabclick") === "true";
    }
  
    function validateYearForm() {
      var isValid;
      isValid = validateManufacture.monthField();
      isValid &= validateManufacture.yearField();
  
      return isValid;
    }
  
    var validateManufacture = {
      monthField: function () {
        var isValid = false;
        var date = new Date();
        var currentMonth = date.getMonth();
        var currentYear = date.getFullYear();
        if (!monthField.val()) {
          validate.field.setError(monthField, "Select month");
        } 
        else if(parseInt(yearField.val(), 10) === currentYear && monthField.val() > currentMonth + 1)
        {
          validate.field.setError(monthField, "Please select a past month");
        }
        else {
            isValid = true;
          }
  
        return isValid;
      },
  
      yearField: function () {
        var isValid = false;
  
        if (yearField.val() <= 0) {
          validate.field.setError(yearField, "Select year");
        } else {
          isValid = true;
        }
  
        return isValid;
      },
    };
  
    function submitCarDetails() {
      if (validateCarSelection()) {
        var selectedOption = alternateFuelBody.find(
          "input[name=alternateFuel]:checked"
        );
      var selectionFuelOption = document.getElementById(
        selectedOption.attr("id")
      );
      var selectedOptionLabel = "";
      if (selectionFuelOption) {
        selectedOptionLabel = $.trim(
          selectionFuelOption.getAttribute("data-attribute-alternate-fuel")
        );
      }
        if (selectedOption.val() !== "0")
          carDetailsData = appState.setSelectedData(carDetailsData, {
            alternateFuel: selectedOptionLabel,
          });
        else
          carDetailsData = appState.deleteObjectProperties(carDetailsData, [
            "alternateFuel",
          ]);
        carDetailsData = appState.setSelectedData(carDetailsData, {
          referrer: document.referrer,
          sourceId: parentContainer.getSourceId(),
        });
  
        if (carDetailsScreenVisitedArray[2]) {
          historyObj.goToIndex(1);
          isForwardFlow = true;
          events.publish("pushHistory");
        } else {
          historyObj.addToHistory("selectColor");
          carDetailsScreenVisitedArray[2] = 1;
        }
        sellCarTracking.forMobile("mmv", "Sell Car|" + cityForm.getCityData().cityName);
        parentContainer.slideNextScreen(screenGroup);
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitColour()"
        );
        summary.setSummary(carSelectForm);
      }
    }
  
    function validateCarSelection() {
      var isValid = false;
  
      var makeValue = $("#getCarMake").val(),
        modelValue = $("#getCarModel").val(),
        versionValue = $("#getCarVersion").val();
  
      if (makeValue !== "0" && modelValue !== "0" && versionValue !== "0") {
        isValid = true;
      } else {
        validateScreen.setError("Please select car");
      }
  
      return isValid;
    }
  
    function resetCarSelectionForm() {
      var makeField = carSelectForm.find("#getCarMake");
  
      makeField.val("0").change().trigger("chosen:updated");
      makeField.closest(".field-box").removeClass("done");
  
      formField.resetSelect(carModelField);
      formField.resetSelect(carVersionField);
  
      popularMakeList
        .find("input[name=popularMake]:checked")
        .attr("checked", false);
      alternateFuelBody
        .hide()
        .find("input[name=alternateFuel]")
        .val("0")
        .attr("checked", true);
    }
  
    function resetCarSelectionScreen() {
      carSelectionTagList.hide().find("ul").html("");
      carSelectForm.find(".step-group__item").hide();
      carSelectForm.find("#carMakeBody").show();
    }
  
    function submitColour() {
      if (validateColorForm()) {
        var selectedOption = colorSelectionForm.find(
          "input[name=carColour]:checked"
        );
        var selectedColor = document.getElementById(selectedOption.attr('id')).getAttribute("data-attribute-color");
        if (selectedOption.val() !== "0")
          carDetailsData = appState.setSelectedData(carDetailsData, {
            color: selectedColor,
          });
        else
          carDetailsData = appState.setSelectedData(carDetailsData, {
            color: $.trim($("#getOtherColour").val()),
          });
  
        if (carDetailsScreenVisitedArray[3]) {
          historyObj.goToIndex(1);
          isForwardFlow = true;
          events.publish("pushHistory");
        } else {
          historyObj.addToHistory("selectOwners");
          carDetailsScreenVisitedArray[3] = 1;
        }
  
        parentContainer.slideNextScreen(screenGroup);
        sellCarTracking.forMobile("color", "Sell Car|" + cityForm.getCityData().cityName);
  
        prefillOwners();
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitOwner()"
        );
        setColorSummary();
      }
    }
  
  function validateTextOnly(textValue) {
    return /^[a-zA-Z]+$/.test(textValue);
}
  
    function validateColorForm() {
      var isValid = false,
        checkedOption = colorSelectionForm.find("input[name=carColour]:checked");
  
      if (checkedOption.length === 0) {
        validateScreen.setError("Please select colour");
      } else if (checkedOption.val() === "0") {
        var color = $("#getOtherColour").val().trim();
        if (color.length === 0) {
          validate.field.setError($("#getOtherColour"), "Please enter a colour");
        } else if (!validateTextOnly(color)) {
          validate.field.setError(
            $("#getOtherColour"),
            "Please enter a valid colour"
          );
        } else {
          isValid = true;
        }
      } else {
        isValid = true;
      }
  
      return isValid;
    }
  
    function resetColorForm() {
      colorSelectionForm
        .find("input[name=carColour]:checked")
        .attr("checked", false);
      colorSelectionForm.find("#otherColorField").hide();
    }
  
    function setColorSummary() {
      var selectedColor = colorSelectionForm.find(
        "input[name=carColour]:checked"
      );
  
      var summaryList = summary.setList(colorSelectionForm);
  
      var fieldObj;
      if (selectedColor.val() === "0") {
        fieldObj = summary.getFieldDetails($("#otherColorField"));
        $("#summaryDetailed").find('li[data-field-id="getColor"]').remove();
      } else {
        fieldObj = summary.getFieldDetails($("#getColor"));
        $("#summaryDetailed")
          .find('li[data-field-id="otherColorField"]')
          .remove();
      }
  
      summary.setListItem(summaryList, fieldObj);
    }
  
    function submitOwner() {
      if (validateOwner()) {
        var owners = $.trim(
          ownerSelectionForm.find("input[name=carOwner]:checked").val()
        );
        carDetailsData = appState.setSelectedData(carDetailsData, {
          owners: owners,
        });
  
        // Navigate via existing history or create history
        if (carDetailsScreenVisitedArray[4]) {
          historyObj.goToIndex(1);
          isForwardFlow = true;
          events.publish("pushHistory");
        } else {
          historyObj.addToHistory("enterKms");
          carDetailsScreenVisitedArray[4] = 1;
        }
  
        parentContainer.slideNextScreen(screenGroup);
        sellCarTracking.forMobile("owner", "Sell Car|" + cityForm.getCityData().cityName);
        resetBuyingIndexPrice(expectedPriceForm);
        if (typeof events !== "undefined") {
          events.publish("ownersChanged", { owners: owners });
        }
  
        prefillKms();
  
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitKmsDriven()"
        );
        summary.setSummary(ownerSelectionForm);
      }
    }
  
    function validateOwner() {
      var isValid = false;
  
      if (ownerSelectionForm.find("input[name=carOwner]:checked").length === 0) {
        validateScreen.setError("Please select Number of owners");
      } else {
        isValid = true;
      }
  
      return isValid;
    }
  
    function resetOwnerForm() {
      ownerSelectionForm
        .find("input[name=carOwner]:checked")
        .attr("checked", false);
    }
  
    function submitKmsDriven() {
      if (validateKms()) {
        var kms = $.trim(kmsField.attr("data-value"));
        carDetailsData = appState.setSelectedData(carDetailsData, {
          kmsDriven: kms,
        });
  
        if (carDetailsScreenVisitedArray[5]) {
          historyObj.goToIndex(1);
          isForwardFlow = true;
          events.publish("pushHistory");
        } else {
          historyObj.addToHistory("enterPrice");
          carDetailsScreenVisitedArray[5] = 1;
        }
  
        parentContainer.slideNextScreen(screenGroup);
        summary.setSummary($("#bodyKilometer"));
  
        parentContainer.setButtonTarget(
          "history.back()",
          "carDetailsForm.submitExpectedPrice()"
        );
        sellCarTracking.forMobile("kms", "Sell Car|" + cityForm.getCityData().cityName);
  
        // need to verify if this event is used or not as this eventName is not subscribed anywhere
        if (typeof events !== "undefined") {
          events.publish("kmsChanged", { kms_driven: kms });
        }
      }
    }
  
    function validateKms() {
      var isValid = false;
      var kms = parseInt(kmsField.attr("data-value"));
      if (isNaN(kms)) {
        validate.field.setError(kmsField, "Enter kilometers driven");
      } else if (kms < 100) {
        validate.field.setError(kmsField, "KMs driven should be more than 100");
      } else if (kms > 900000) {
        validate.field.setError(
          kmsField,
          "KMs driven should be below 9 Lakh kms "
        );
      } else if (!validateKmsPerYear({ kms })) {
        validate.field.setError(
          kmsField,
          "Maximum 3 Lacs km are allowed per year. Please enter appropriate value."
        );
      } else {
        isValid = true;
      }
  
      return isValid;
    }

    function validateKmsPerYear({ kms }) {
      let isValid = true;
      var maxKmsPerYearLimitInput = $("#maxKmsPerYearLimit");
      if (!maxKmsPerYearLimitInput) {
        return isValid;
      }
      var maxKmsPerYearLimit = parseInt(maxKmsPerYearLimitInput.val(), 10);
      if (isNaN(maxKmsPerYearLimit)) {
        return isValid;
      }
      var currentYear = new Date().getFullYear();
      var makeYear = parseInt(carDetailsData.manufactureYear, 10);
      var carAge = !isNaN(makeYear) ? currentYear - makeYear + 1 : 0;
      if (carAge === 0) {
        return isValid;
      }
      isValid = kms <= (carAge * maxKmsPerYearLimit);
      return isValid;
    }
  
    function submitExpectedPrice() {
      parentContainer.setLoadingScreen();
  
      if (validateExpectedPrice()) {
        var price = $.trim(getExpectedPrice.attr("data-value"));
        carDetailsData = appState.setSelectedData(carDetailsData, {
          expectedPrice: price,
        });
  
        // ===> Tracking Starts Here
        expPriceTracking();
        // ===> Tracking Ends Here
  
        summary.setSummary(expectedPriceForm);
        container.hide();
  
        if (carDetailsScreenVisitedArray[6]) {
          historyObj.goToIndex(1);
          events.publish("updateHistoryIndex", { index: 1 });
        } else {
          checkAbsureOfferAvailablity();
          events.publish("setContactScreen"); // sequence of code matters here
          historyObj.addToHistory("contactDetails");
          carDetailsScreenVisitedArray[6] = 1;
        }
  
        parentContainer.removeLoadingScreen();
      } else {
        parentContainer.removeLoadingScreen();
      }
    }
  
    function expPriceTracking() {
      if ($(".recommend-price-box").is(":visible")) {
          sellCarTracking.forMobile(
            "expectPrice",
            (
              carDetailsData.recommendedPrice -
              $("#getExpectedPrice").attr("data-value")
            ).toString()
          );
      } else {
        sellCarTracking.forMobile("expectPrice", "Sell Car|" + cityForm.getCityData().cityName);
      }
    }
  
    function validateExpectedPrice() {
      var expectedPrice = parseInt(getExpectedPrice.attr("data-value"), 10);
      var date = new Date();
      var currentYear = date.getFullYear();
      var carAge = 0;
      var makeYear = carDetailsData.manufactureYear;
      if(isNaN(expectedPrice)){
        validate.field.setError(
          getExpectedPrice,
          "Please enter price"
        );
        return false;
      }
      if (!isNaN(makeYear))
      {
        carAge = currentYear - makeYear;
      }
      var rootName = carDetailsData.rootName;
      var recoPrice = carDetailsData.recommendedPrice;
      var isPriceBelowLowerLimit = cardetailsUtil.priceValidator.isBelowLowerLimit(
        basicCarPrice,
        expectedPrice,
        recoPrice,
        carAge
      );
      if (isPriceBelowLowerLimit) {
        validate.field.setError(
          getExpectedPrice,
          "Price seems low for a " +
            makeYear +
            " " +
            rootName +
            ", please enter appropriate price"
        );
        sellCarTracking.forMobile("pricelimithit", "lower_limit");
        return false;
      }
      var isPriceAboveUpperLimit = cardetailsUtil.priceValidator.isAboveUpperLimit(
        basicCarPrice,
        expectedPrice,
        recoPrice,
        carAge
      );
      if (isPriceAboveUpperLimit) {
        validate.field.setError(
          getExpectedPrice,
          "Price seems high for a " +
            makeYear +
            " " +
            rootName +
            ", please enter appropriate price"
        );
        sellCarTracking.forMobile("pricelimithit", "upper_limit");
        return false;
      }
      return true;
    }
  
    function resetExpectedPriceForm() {
      getExpectedPrice.val("").closest(".field-box").removeClass("done");
      getExpectedPrice.attr("data-value", "");
    }

    function validateRegistrationNumber() {
      var regexEnglishAndNumerics = /^[A-Za-z0-9]*$/;
      var regState = registrationStateCode.value;
      var regNum = registrationNumberCode.value;
      var regRto = registrationRtoCode.value;
      if (
        !(
          regexEnglishAndNumerics.test(regRto) &&
          regexEnglishAndNumerics.test(regState) &&
          regexEnglishAndNumerics.test(regNum)
        )
      ) {
        registrationForm
          .addClass("invalid")
          .find(".error-text")
          .text("Please Provide Valid Registration No.");
        return false;
      }
      registrationForm.removeClass("invalid").find(".error-text").text("");
      return true;
    }

    function submitInsurance() {
      if (
        !(
          validateInsurance() &&
          validateRegistrationType() &&
          validateRegistrationNumber()
        )
      ) {
        return false;
      }
      var insuranceValue = insuranceForm
        .find("input[name=carInsurance]:checked")
        .val();
      carDetailsData = appState.setSelectedData(carDetailsData, {
        insurance: insuranceValue,
      });
      if (insuranceValue && insuranceValue !== "3") {
        var insuranceExpiryMonth = $.trim(
          insuranceMonthField.find("option:selected").val()
        );
        var insuranceExpiryYear = $.trim(
          insuranceYearField.find("option:selected").val()
        );
        carDetailsData = appState.setSelectedData(carDetailsData, {
          insuranceExpiryYear: insuranceExpiryYear,
          insuranceExpiryMonth: insuranceExpiryMonth,
        });
      } else {
        carDetailsData = appState.deleteObjectProperties(carDetailsData, [
          "insuranceExpiryYear",
          "insuranceExpiryMonth",
        ]);
      }
  
      var regState = registrationStateCode.value;
      var regNum = registrationNumberCode.value;
      var regRto = registrationRtoCode.value;
      carDetailsData = appState.setSelectedData(carDetailsData, {
        registrationNumber: $.trim(regState) + $.trim(regRto) + $.trim(regNum),
        regType: registrationType.val(),
        takeLive: true,
      });
      parentContainer.setLoadingScreen();
      // use PUT API here
      var inquiryCookie = sellCarCookie.getSellInquiryCookie();
      if (inquiryCookie) {
        var settings = {
          url:
            "/api/v1/used/sell/cardetails/?encryptedId=" +
            encodeURIComponent(inquiryCookie),
          type: "PUT",
          data: carDetailsData,
          headers: {
            'ServerDomain': 'CarWale',
          },
        };
        $.ajax(settings)
          .done(function (response) {
            parentContainer.removeLoadingScreen();
            var eventObj = {
              data: carDetailsData,
              isCarImagesViewLoaded: isCarImagesViewLoaded,
            };
            if (typeof events !== "undefined") {
              events.publish("insuranceSubmitted", eventObj);
            }
          })
          .fail(function (xhr) {
            parentContainer.removeLoadingScreen();
            modalPopup.showModalJson(xhr.responseText);
          });
      }
      return true;
    }
  
    function onCarImageHtmlSucces(eventObj) {
      container.hide();
      if (eventObj.response) {
        $(".partialCarImages").html(eventObj.response);
        if (typeof events !== "undefined") {
          var eObj = {
            data: eventObj.data,
          };
          events.publish("carImageLoaded", eObj);
        }
      } else if (typeof events !== "undefined") {
        events.publish("setImageScreen");
      }
      historyObj.addToHistory("uploadImage");
      sellCarTracking.forMobile("live", "Sell Car|" + cityForm.getCityData().cityName);
      isCarImagesViewLoaded = true;
      parentContainer.setButtonText("", "Next");
    }
  
    function validateInsurance() {
      var isValid = true;
      var insuranceValue = insuranceForm
        .find("input[name=carInsurance]:checked")
        .val();
      if (insuranceValue && insuranceValue !== "3") {
        var insuranceExpiryMonth = insuranceForm
          .find("#getInsuranceMonth option:selected")
          .val();
        var insuranceExpiryYear = insuranceForm
          .find("#getInsuranceYear option:selected")
          .val();
        if (parseInt(insuranceExpiryMonth) <= 0) {
          isValid = false;
          validate.field.setError(insuranceMonthField, "Select month");
        }
        if (parseInt(insuranceExpiryYear) <= 0) {
          isValid = false;
          validate.field.setError(insuranceYearField, "Select year");
        }
      }
      return isValid;
    }
  
    function validateRegistrationNo() {
      var isValid = true;
      var regRto = registrationRtoCode.value;
      var regState = registrationStateCode.value;
      var regNum = registrationNumberCode.value;
      if (
        !regState ||
        !regRto ||
        !regNum ||
        (typeof carRegistrationNumber !== "undefined" &&
          (!carRegistrationNumber.isStateCodeValid(regState) ||
            !carRegistrationNumber.isRtoCodeValid(regRto) ||
            !carRegistrationNumber.isNumberValid(regNum) ||
            !carRegistrationNumber.isValidRegisterationNo(regState + regRto)))
      ) {
        registrationForm
          .addClass("invalid")
          .find(".error-text")
          .text("Please Provide Valid Registration No.");
        isValid = false;
      } else {
        registrationForm.removeClass("invalid").find(".error-text").text("");
      }
      return isValid;
    }
  
    function validateRegistrationType() {
      var regType = registrationType.val();
      var regTypeContainer = $("#registrationType");
      if (regType === "0") {
        regTypeContainer
          .addClass("invalid")
          .find(".error-text")
          .text("Select Registration type");
        return false;
      }
      regTypeContainer.removeClass("invalid").find(".error-text").text("");
      return true;
    }
    function pushHistoryIndex(historyData) {
      if (
        parentContainer.isTabActive("formCarDetail") &&
        historyData &&
        historyData.index &&
        !parentContainer.isPresentInArray(
          historyData.index,
          carDetailsHistoryActive
        )
      ) {
        console.log(
          "CarDetails History Array inserted with history index : " +
            historyData.index
        );
        carDetailsHistoryActive.push(historyData.index);
        console.log(
          "And Forms New Car details active Array : " +
            JSON.stringify(carDetailsHistoryActive)
        );
      }
    }
  
    function removeFromHistoryIndex(historyData) {
      if (
        parentContainer.isTabActive("formCarDetail") &&
        historyData &&
        historyData.index &&
        parentContainer.isPresentInArray(
          historyData.index,
          carDetailsHistoryActive
        )
      ) {
        carDetailsHistoryActive.pop();
        console.log(
          "CarDetails History Array Poped and Remaining array : " +
            JSON.stringify(carDetailsHistoryActive)
        );
      }
    }
  
    function clearHistory() {
      carDetailsHistoryActive = [1]; //city selection screen is visible
    }
  
    function slideToTopIfNoTabclicked() {
      if (!isTabClicked()) {
        parentContainer.slideTopMostScreen(screenGroup);
      }
      setTabClickAttribute(false);
    }
  
    function carDetailsTabClickHandler() {
      var relativeIndex = 0;
      if (
        carDetailsHistoryActive.length &&
        !parentContainer.isPresentInArray(
          historyHelper.getHistoryIndex(),
          carDetailsHistoryActive
        )
      ) {
        if (carDetailsHistoryActive.length) {
          relativeIndex =
            carDetailsHistoryActive[carDetailsHistoryActive.length - 1] -
            historyHelper.getHistoryIndex();
        }
      } else {
        relativeIndex = 1;
      }
  
      container.show();
      setTabClickAttribute(true);
      historyObj.goToIndex(relativeIndex);
  
      events.publish("updateHistoryIndex", {
        index: relativeIndex + 1,
      }); // need to +1 because goToIndex reduces history index by 1 because of popstate
    }
  
    function contactDetailsTabClickHandler() {
      setTabClickAttribute(false);
      setContactScreen(); // this function will hide cardetail screen
    }
  
    function setContactScreen() {
      if (
        container &&
        !modalPopup.isOtpModalPopupVisible() &&
        !modalPopup.closeActiveModalPopup()
      ) {
        container.hide();
      }
    }
    function checkAbsureOfferAvailablity()
    {
      const CTEApiCode = "p2345a789r1564n456i45t12h45a89";
      const CTEApiAction = "check_absure_dealer";
      var carDetails={
        action: CTEApiAction,
        dealer_city: carDetailsData.cityId,
        make: carDetailsData.makeId,
        year: carDetailsData.manufactureYear,
        owner: carDetailsData.owners,
        budget: carDetailsData.expectedPrice,
        wish_kmsdriven: carDetailsData.kmsDriven,
        api_code: CTEApiCode,
      }
      var settings ={
        type : "POST",
        data : carDetails,
        dataType: "Json",
        url : CTEUrl
      }
      $.ajax(settings).done(function(response){
          if(response.absureDealer)
          {
            showFreeEvaluationText();
          }
        });
    }

    function showFreeEvaluationText()
  {
    $("#textAboveContactDetails").show().addClass("text-above-contact-details");
    sellCarTracking.forMobile("FreeEvaluationShown");
  }
  
    function getCarDetailsHistoryActive() {
      return carDetailsHistoryActive;
    }
  
    function getCarDetailsHistoryActiveLength() {
      return carDetailsHistoryActive.length;
    }
  
    function getCarDetailsData() {
      return carDetailsData;
    }
  
    function getForwardFlow() {
      return isForwardFlow;
    }
  
    return {
      submitYear: submitYear,
      submitCarDetails: submitCarDetails,
      submitColour: submitColour,
      submitOwner: submitOwner,
      submitKmsDriven: submitKmsDriven,
      submitExpectedPrice: submitExpectedPrice,
      submitInsurance: submitInsurance,
      getCarDetailsHistoryActive: getCarDetailsHistoryActive,
      getCarDetailsHistoryActiveLength: getCarDetailsHistoryActiveLength,
      getCarDetailsData: getCarDetailsData,
      getForwardFlow: getForwardFlow,
    };
  })();
  