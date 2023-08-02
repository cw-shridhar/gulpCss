// dependency
// 1. static/js/used/sellcar/common.js
// 2. staic/js/used/sellcar/utilities.js

var carDetailsForm = (function () {
	var container,
    yearField,
    carSelectForm,
    carMakeField,
    carModelField,
    carVersionField,
    colorSelectionForm,
	ownerSelectionForm,
	monthSelectionForm,
	yearSelectionForm,
	carMakeForm,
	carModelForm,
	carVersionForm,
    kmsField,
    expectedPriceForm,
    getExpectedPrice,
    insuranceForm,
    insuranceMonthField,
    insuranceYearField,
    registrationForm,
    registrationRtoField,
    registrationStateField,
    registrationCarNoField;
	var isCarImagesViewLoaded = false;
	var carDetailsData = {};
	var basicCarPrice = 0;
	var registrationTypeSelectionForm;
	var isCarPresentInQS, modelId, rootName, versionId;

	if (typeof events !== 'undefined') {
		// this form will load async, hence no document ready function
		// The caller needs to publish 'contactSubmit' event to show the form
	    events.subscribe("contactSubmit", carDetailsFormLoadHandler);
	    events.subscribe("updateCarDetails", updateCarDetails);
	    events.subscribe("carImageLoaded", setCarImageViewParam);
        events.subscribe("contactDetailsChanged", reInit);
		events.subscribe("buyingIndexSuccess", buyingIndexSuccess);
	    events.subscribe("buyingIndexFailed", buyingIndexFailed);
	    events.subscribe("navigateAwayFromCardetails", onNavigateAwayFromCardetails);
		events.subscribe("takenLive", getInsuranceHtml);
	};

	function onNavigateAwayFromCardetails() {
	    window.removeEventListener("beforeunload", parentContainer.onPageUnload);
	    history.back();
	}

	function getSelectedData(obj, prop) {
		if (obj.hasOwnProperty(prop)) {
			return obj[prop];
		}
		return null;
	};

	function setCarImageViewParam() {
	    isCarImagesViewLoaded = true;
	}

	function carDetailsFormLoadHandler(eventObj) {
	    setSelectors();
		registerDomEvents();
		init();
		horizontalForm.setInitialSteps(container.find('.horizontal-form'));

		$('.partialCarDetails').find('.accordion__head').attr('data-access', 1).trigger('click');
		$('.partialContactDetails').find('.accordion__head').attr('data-access', 1);
		
		summary.resetToolbar(container.closest('.accordion__item'));

		updateContactData(eventObj);
		prefillData();
		window.addEventListener("beforeunload", parentContainer.onPageUnload);
	};

	function updateContactData(eventObj) {
	    if (eventObj && eventObj.data) {
	        carDetailsData = appState.setSelectedData(carDetailsData, {
	            sellCarCustomer: eventObj.data,
	            showOnCarwale: eventObj.data.showOnCarwale,
	            areaId: eventObj.data.areaId,
	            pincode: eventObj.data.pincode,
	            referrer: document.referrer,
	            sourceId: parentContainer.getSourceId()
	        });
	    }
	}

	function prefillData() {
	    //set selectors in case its available in query string
	    var yearId, month, car;
	    if (yearId = getQueryStringParam('year')) {
	        $("#getYear").find("input#year" + yearId).prop('checked', true).change();
	    }
	    if (month = getQueryStringParam('month')) {
	        $("#getMonth").find("input#month" + month).prop('checked', true).change();
	    }
	    if (car = getQueryStringParam('car')) {
	        isCarPresentInQS = true;
	        var settings = {
	            type: 'GET',
	            url: '/webapi/CarVersionsData/GetCarDetailsByVersionId/?versionid=' + car,
	            dataType: 'Json',
	        };
	        $.ajax(settings).done(function (resp) {
	            if (resp) {
	                modelId = resp.ModelId;
	                versionId = resp.VersionId;
	                $("#getCarMake").find("input#carMake" + resp.MakeId).prop('checked', true).change();
	            }
	        });
	    }
	}

	function updateCarDetails(eventObj) {
	    if (eventObj) {
	        carDetailsData = appState.setSelectedData(eventObj, true);
	    }
	}

	function setSelectors() {
		container = $('#formCarDetail');
		monthField = $('#getMonth');
		yearField = $('#getYear');
		carSelectForm = $('#bodyCarForm');
		carMakeField = $('#getCarMake');
		carModelField = $('#getCarModel');
		carVersionField = $('#getCarVersion');
		alternateFuelBody = $('#alternateFuelForm');
		colorSelectionForm = $('#bodyColorForm');
		otherColorField = $('#otherColorField');
		ownerSelectionForm = $('#bodyOwnerForm');
		monthSelectionForm = $('#carMonthForm');
		yearSelectionForm = $('#carYearForm');
		carMakeForm = $('#getCarMake');
		carModelForm = $('#getCarModel');
		carVersionForm = $('#getCarVersion');
		kmsField = $('#getKms');
		expectedPriceForm = $('#bodyExpectedPrice');
		getExpectedPrice = $('#getExpectedPrice');
		insuranceForm = $('#bodyInsurance');
		insuranceMonthField = $('#getInsuranceMonth');
		insuranceYearField = $('#getInsuranceYear');
		registrationForm = $('#getRegistration');
		registrationTypeSelectionForm = $('#bodyRegistrationType');
		registrationRtoField = document.getElementById("registerRtoCode");
		registrationStateField = document.getElementById("registerStateCode");
		registrationCarNoField = document.getElementById("registerCarNumber");
	};

	function init() {
		parentContainer.removeLoadingScreen();

		// set standard colours
		var colorSelectionUl = colorSelectionForm.find(".color-option-list");
		colorSelectionUl.html('');
		bindColor({}, colorSelectionUl);
	};

	function reInit(eventObj) {
	    parentContainer.removeLoadingScreen();
	    updateContactData(eventObj);
	}

	function registerDomEvents() {
		// yearForm
		$('#bodyYearform').on('change', '.radio-box input[type="radio"]', function () {
			if (!carSelectForm.find('input[name=carMake]:checked').length) {
				resetExpectedPriceForm();
			}
			
			var formStep = $(this).closest('.form__step');

			horizontalForm.setStepSelection(formStep);

			carDetailsData = appState.setSelectedData(carDetailsData, {
				manufactureMonth: $.trim(monthField.find('input[name=makeMonth]:checked').val()),
				manufactureYear: $.trim(yearField.find('input[name=makeYear]:checked').val())
			});
			if (typeof events != 'undefined') {
			    events.publish('yearChanged', { year: carDetailsData.manufactureYear });
			}
			setEditToolTip();
		});

		$('#bodyYearform').on('click', '.step__selection', function () {
			var formStep = $(this).closest('.form__step');

			horizontalForm.resetFormStep(formStep);
		});

		// carForm
		// make
		carSelectForm.on('change', '.radio-box input[type="radio"]', function () {
			var formStep = $(this).closest('.form__step');

			horizontalForm.setStepSelection(formStep);
		});

		carSelectForm.on('click', '.step__selection', function () {
			var formStep = $(this).closest('.form__step');

			horizontalForm.resetFormStep(formStep);
		});

		carSelectForm.on('change', '.radio-box input[type=radio]', function () {
			var selectedItem = $(this);

			if (selectedItem.val() !== "0") {
				var selectionText = $(this).next('label').text(),
					selectionId = $.trim($(this).val()),
					stepBody = $(this).closest('.form-step__body');

				switch (stepBody.attr('id')) {
					case 'getCarMake':
						carDetailsData = appState.setSelectedData(carDetailsData, {
							makeId: selectionId
						});
						parentContainer.setLoadingScreen();
					    fetchModel(selectionId, yearField.find('input[name=makeYear]:checked').val()).done(function (resp) {
					        bindModelRadioList(resp, carModelField);
					        if (isCarPresentInQS) {
					            $("#getCarModel").find("input#carModel" + modelId).prop('checked', true).change();
					        }
							parentContainer.removeLoadingScreen();
					       
						}).fail(function () {
							parentContainer.removeLoadingScreen();
							horizontalForm.setError($('#carModelForm'), 'No model found for this selection');
						});

						formField.emptyRadioList(carModelField.find('input[name=carModel]').closest('.radio-box'));
						formField.emptyRadioList(carVersionField.find('input[name=carVersion]').closest('.radio-box'));

						break;

					case 'getCarModel':
						var selectedOption = $('#getCarModel').find('input[name=carModel]:checked');
			            var selectedRoot = document.getElementById(selectedOption.attr('id')).getAttribute("data-attribute-model");
						carDetailsData = appState.setSelectedData(carDetailsData, {
							modelId: selectionId,
							rootName: selectedRoot
						});
					break;
					case 'versionFuelSelection':
						parentContainer.setLoadingScreen();
						fetchVersion(carDetailsData.modelId, yearField.find('input[name=makeYear]:checked').val()).done(function (resp) {
							bindVersionRadioList(resp, carVersionField , selectionId);
							if (isCarPresentInQS) {
								$("#getCarVersion").find("input#carVersion" + versionId).prop('checked', true).change();
							}
							parentContainer.removeLoadingScreen();
						}).fail(function () {
							parentContainer.removeLoadingScreen();
							horizontalForm.setError($('#carVersionForm'), 'No version found for this selection');
						});
						formField.emptyRadioList(carVersionField.find('input[name=carVersion]').closest('.radio-box'));
						break;
					case 'getCarVersion':
						carDetailsData = appState.setSelectedData(carDetailsData, {
							versionId: selectionId
						});
						if (typeof events != 'undefined') {
						    events.publish('versionChanged', { makeId:carDetailsData.makeId,modelId:carDetailsData.modelId,versionId: carDetailsData.versionId, });
						}
						parentContainer.setLoadingScreen();
						var colorSelectionUl = colorSelectionForm.find(".color-option-list");
						colorSelectionUl.html('');
						fetchColor(selectionId).done(function (resp) {
							bindColor(resp, colorSelectionUl);
							parentContainer.removeLoadingScreen();
						}).fail(function() {
							parentContainer.removeLoadingScreen();
							//validateScreen.setError('No colour found');
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
						var tempInquiry = $.cookie("TempInquiry") || '';
						var settings = {
						    url: '/api/used/sell/cardetails/?tempid=' + encodeURIComponent(tempInquiry),
							type: "POST",
							headers: { ServerDomain: "CarWale" },
						    data: carDetailsData
						}
						$.ajax(settings)
						break;

					default:
						break;
				}

				//resetColorForm();
				//resetOwnerForm();
				resetExpectedPriceForm();
			}

			//validateScreen.hideError();
		});

		// colour
		colorSelectionForm.on('change', 'input[name=carColour]', function () {
			if ($(this).val() === "0") {
				$('#otherColorField').show();
				var listContainer = $(this).closest('.step--scrollbar');
				listContainer.animate({
					scrollTop: listContainer.height()
				});
			}
			else {
				var formStep = $(this).closest('.form__step');
				$('#otherColorField').hide().val('');
				submitColour();
				horizontalForm.setStepSelection(formStep);
			}
		});

		colorSelectionForm.on('click', '.step__selection', function () {
			var formStep = $(this).closest('.form__step');

			horizontalForm.resetFormStep(formStep);
		});

		$('#submitOtherColour').on('click', function () {
			submitColour();
		});

		// alternateFuelForm
		alternateFuelBody.on('change', 'input[name=alternateFuel]', function () {
			var formStep = $(this).closest('.form__step');
			var owner, kms;
			submitCarDetails();
			horizontalForm.setStepSelection(formStep);

		    //check if owner present
			if (owner = getQueryStringParam('owner')) {
			    $("#bodyOwnerForm").find("input#carOwner" + owner).prop('checked', true).change();
			}
			if (kms = getQueryStringParam('kms')) {
			    kmsField.val(kms);
			    kmsField.trigger('propertychange');
			}
		});

		alternateFuelBody.on('click', '.step__selection', function () {
			var formStep = $(this).closest('.form__step');

			horizontalForm.resetFormStep(formStep);
		});

		// bodyOwnerForm
		ownerSelectionForm.on('change', 'input[name=carOwner]', function () {
			submitOwner();
		});

		//carMonthForm
	    monthSelectionForm.on('change', 'input[name=makeMonth]', function () {
			analytics.trackAction("CWInteractive", "Sell Car - Desktop", "MfgMonthDone", cityForm.getCityData().cityName);
		});

       //carYearForm
	    yearSelectionForm.on('change', 'input[name=makeYear]', function () {
			analytics.trackAction("CWInteractive", "Sell Car - Desktop", "MfgYearDone", cityForm.getCityData().cityName);
		});

		//carMakeForm
		carMakeForm.on('change', 'input[name=carMake]', function () {
			analytics.trackAction("CWInteractive", "Sell Car - Desktop", "MakeSelectionDone", cityForm.getCityData().cityName);
		});

		//carModelForm
		carModelForm.on('click', '.step__option-list', function () {
			analytics.trackAction("CWInteractive", "Sell Car - Desktop", "ModelSelectionDone", cityForm.getCityData().cityName);
		});

		//carVersionForm
		carVersionForm.on('click', '.step__option-list', function () {
			analytics.trackAction("CWInteractive", "Sell Car - Desktop", "VersionSelectionDone", cityForm.getCityData().cityName);
		});
		
		ownerSelectionForm.on('click', '.step__selection', function () {
			var formStep = $(this).closest('.form__step');

			horizontalForm.resetFormStep(formStep);
		});

		registrationTypeSelectionForm.on('change', 'input[name=carRegistrationType]', function () {
		    submitRegistrationType();
		});

		registrationTypeSelectionForm.on('click', '.step__selection', function () {
		    var formStep = $(this).closest('.form__step');
		    horizontalForm.resetFormStep(formStep);
		});
		// kilometers driven
		formatValue.formatValueOnInput(kmsField);
		kmsField.on("focusout", function () {
		    if (typeof events != 'undefined') {
		        events.publish("kmsChanged", { kms_driven: $.trim(kmsField.attr('data-value')) });
		    }
		});

		// recommended price
		expectedPriceForm.on('change', '#recommendedCheckbox', function () {
			if ($(this).is(':checked')) {
				getExpectedPrice.val(Common.utils.formatNumeric($(this).val()));
				getExpectedPrice.attr('data-value', $(this).val());
				validate.field.hideError(getExpectedPrice);
				formatValue.readableTextFromNumber(getExpectedPrice);
			}
			else {
				getExpectedPrice.attr('data-value', '');
				getExpectedPrice.val('').closest('.field-box').removeClass('done');
				getExpectedPrice.siblings("div .getNumbersInWord").text("");
			}

			disableInsuranceStep();
		});

		expectedPriceForm.on('keyup', '#getExpectedPrice', function () {
			var recommendedCheckbox = expectedPriceForm.find('#recommendedCheckbox');

			if (recommendedCheckbox.is(':checked')) {
				recommendedCheckbox.prop('checked', false);
			}
		});

		formatValue.formatValueOnInput(getExpectedPrice);

		$('#submitKilometerExpectedPrice').on('click', function() {
			submitKmsExpectedPriceForm();
		});

		$('#bodyKilometer, #expectedPriceInputBox').on('input propertychange', function () {
			disableInsuranceStep();
		});

		// insurance
		insuranceForm.on('change', 'input[name=carInsurance]', function () {
			var formStep = $(this).closest('.form__step');

			horizontalForm.setStepSelection(formStep);

			if ($(this).val() != 3) {
				$('#insuranceValidity').show();
				insuranceForm.addClass('validity-active');
			}
			else {
				resetInsuranceForm();
			}

			$('#submitInsurance').show();
		});

		insuranceForm.on('click', '.step__selection', function () {
			var formStep = $(this).closest('.form__step');

			resetInsuranceForm();
			horizontalForm.resetFormStep(formStep);
		});
		
		insuranceForm.on('change', '#getInsuranceMonth', function () {
			if (parseInt($(this).val()) > 0) {
				insuranceForm.find('.register--input-1').blur();
				insuranceYearField.trigger('chosen:open');
			}
		});

		insuranceForm.on('change', '#getInsuranceYear', function () {
			if (parseInt($(this).val()) > 0) {
				insuranceForm.find('.register--input-1').focus();
			}
		});

		insuranceForm.on('keyup', '.register--input-1', function () {
			if ($(this).val().length == 2) {
				$(this).next('.register--input-2').focus();
			}
		});

		insuranceForm.on('mouseup', '.chosen-container', function () {
			$('#registrationNumber').find('input').blur();
		});

		$('#submitInsurance').on('click', function() {
		    submitInsurance();
		});

	  registrationStateField.addEventListener("keyup", function(event) {
			onKeyUpRegistrationState(event);
		});

	registrationRtoField.addEventListener("keyup", function(event) {
		onKeyUpRegistrationRto(event);
	});	
	};

	function onKeyUpRegistrationState(event)
	{
		var stateCode = event.target.value;
			if (stateCode.length >= 2) {
				registrationRtoField.focus();
			}
	}

	function onFocusOutRegistrationState(event) 
	{
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

	function onKeyUpRegistrationRto(event)
	{
		var rtoCode = event.target.value;
		//Moving to the next text field
      if (rtoCode.length >= 2) {
		  registrationCarNoField.focus();
	  }
	}

	function onFocusOutRegistrationRto(event)
	{
		var rtoCode = event.target.value;
		var stateCode = registrationStateField.value;
      if (
        !stateCode ||
        ((rtoCode &&
          typeof carRegistrationNumber !== "undefined" &&
          !carRegistrationNumber.isRtoCodeValid(rtoCode)) ||
          !carRegistrationNumber.isStateCodeValid(stateCode))
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

	function onFocusOutRegistrationNumber(event)
	{
		var rtoCode = registrationRtoField.value;
    var stateCode = registrationStateField.value;
    var carNumber = event.target.value;
    //Making sure that data in text field never exceeds the max length of 7
    if (carNumber.length > 7) {
      event.target.value = carNumber.substr(0, 7);
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
	function showRegistrationNoError(show) {
        if (show) {
              registrationForm.addClass("invalid").find(".error-text").removeClass("hide");
			  var stateCode= $("#registerStateCode").val();
			  var rtoCode = $("#registerRtoCode").val();
			  analytics.trackAction("CWInteractive", "SellCar", "RegistrationNumberError", "statecode=" + stateCode+"|citycode=" + rtoCode);
			 } else {
              registrationForm
                .removeClass("invalid")
                .find(".error-text")
                .addClass("hide");
        }
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
	};

	function bindModelRadioList(resp, modelField) {
	    var bindingObj = resp.map(function (obj) {
			return { val: obj.ModelId, text: obj.ModelName, rootName: obj.RootName };
	    });
	    bindingObj = cardetailsUtil.removeModelYear(bindingObj);
		modelField.find('.step__option-list').html(templates.fillRadioListTemplate(modelField, bindingObj).join(''));
	};

	function fetchVersion(modelId, year) {
		var versionType = "used";
		var url = "/webapi/carversionsdata/GetCarVersions/?isActive=true&type=" + versionType + "&modelId=" + modelId + "&year=" + year;
		return ajaxRequest.getJsonPromiseV1(url);
	};

	function bindVersionRadioList(resp, versionField, selectedFuelType) {
		if (!Array.isArray(resp) || resp.length === 0) {
			horizontalForm.setError(
				$("#carVersionForm"),
				"No version found for this selection"
			);
			return;
		}
		var filterFuelListElement = $(".js-version-fuel-selection-element");
		if (filterFuelListElement && filterFuelListElement.length > 0) {
			var filterFuelList = [];
			for (var i = 0; i < filterFuelListElement.length; i++) {
				var currFuelElement = filterFuelListElement[i];
				if (!currFuelElement || !currFuelElement["value"]) {
					continue;
				}
				filterFuelList.push(currFuelElement["value"]);
			}
			var bindingObj = resp.filter(function (obj) {
				var isFuelTypeValid = obj != null && selectedFuelType && obj.FuelType;
				if (!isFuelTypeValid) {
					return isFuelTypeValid;
				}
				var versionFuelType = obj.FuelType.toLowerCase();
				selectedFuelType = selectedFuelType.toLowerCase();
				if (selectedFuelType === "others") {
					isFuelTypeValid = !filterFuelList.includes(versionFuelType);
				} else {
					isFuelTypeValid = versionFuelType === selectedFuelType;
				}
				return isFuelTypeValid;
			});
		}
		bindingObj = bindingObj.map(function (obj) {
			return { val: obj.ID, text: obj.Name };
		});
		if (!Array.isArray(bindingObj) || bindingObj.length === 0) {
			horizontalForm.setError(
				$("#carVersionForm"),
				"No version found for this selection"
			);
			return;
		}
		versionField
			.find(".step__option-list")
			.html(templates.fillRadioListTemplate(versionField, bindingObj).join(""));
	};

	function fetchColor(versionId) {
		var url = "/api/versions/colors/?vids=" + versionId;
		return ajaxRequest.getJsonPromiseV1(url);
	};

	function fetchPrice({ versionId, cityId, makeId, modelId }) {
	var url = "/api/version/" + versionId + "/price-range/?cityId=" + cityId + "&modelId=" + modelId + "&makeId=" + makeId;
    var headers = { ServerDomain: "CarWale" };
    return ajaxRequest.getJsonPromiseV1(url, headers);
  }

	function bindColor(resp, colorField) {
		var colorLi = [];
		if (resp && resp.carColors && resp.carColors[0].length > 0) {
			var colorListLength = resp.carColors[0].length;
			var uniqueColorList = resp.carColors[0]
				.map(function (item) {
					return item.name.split('/')[0] + "_" + item.displayName.split(',')[0] + "_" + item.value.split(',')[0];
				}) // give an array ["name_displayName_value","name_displayName_value"]
				.filter(function (item, index, self) {
					return self.indexOf(item) === index;
				})// filter duplicate "name_value" string
				.map(function (item, index) {
					var colorVal = index + 1;
					//other color
					if (index === colorListLength - 1) {
						colorVal = 0;
					  }
					var colorId = 'color' + colorVal;
					var data = item.split('_');
					return {
						colorId: colorId, colorVal: colorVal, colorHash: data[2], colorName: data[0], colorDisplayName: data[1]
					};
				});// give an array for bindig with template
			colorLi = templates.fillColorTemplate(uniqueColorList)

		}
		colorField.html(colorLi.join(''));
	};

	function submitCarDetails(){
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
		if (selectedOption.val() !== "0") {
			carDetailsData = appState.setSelectedData(carDetailsData, {
				alternateFuel: selectedOptionLabel
			});
		}
		else {
			carDetailsData = appState.deleteObjectProperties(carDetailsData, ["alternateFuel"]);
		}

		carDetailsData = appState.setSelectedData(carDetailsData, {
			referrer: document.referrer,
			sourceId: parentContainer.getSourceId()
		});
		
		analytics.trackAction("CWInteractive", "Sell Car - Desktop", "AlternateFuelSelectionDone", cityForm.getCityData().cityName);
		//trackSellCar.track('selectColor');
	};

	function submitColour() {
		if (validateColorForm()) {
			var selectedOption = colorSelectionForm.find('input[name=carColour]:checked');
			var selectedColor = document.getElementById(selectedOption.attr('id')).getAttribute("data-attribute-color");

			if (selectedOption.val() !== "0") {
				carDetailsData = appState.setSelectedData(carDetailsData, {
					color: selectedColor
				});
			}
			else {
				carDetailsData = appState.setSelectedData(carDetailsData, {
					color: $.trim($('#getOtherColour').val())
				});
			}
			//trackSellCar.track('selectOwners');
			analytics.trackAction("CWInteractive", "Sell Car - Desktop", "ColorSelectionDone", cityForm.getCityData().cityName);
			colorSelectionForm.addClass('step--done').find('.selection__label').text($('#getOtherColour').val());
			horizontalForm.setNextStep(colorSelectionForm);
		}
	};

	function validateColorForm() {
	    var isValid = false;
	    var otherColorField = $('#getOtherColour');
		var checkedOption = colorSelectionForm.find('input[name=carColour]:checked');

		if (checkedOption.val() == 0) {
		   if (otherColorField.val().length === 0) {
		        validate.field.setError(otherColorField, 'Please enter a colour');
		    } else if (!validate.validateTextOnly(otherColorField.val())) {
			    validate.field.setError(otherColorField,'Please enter valid color');
			}
			else {
			    isValid = true;
			}
		} else {
		    isValid = true;
		}

		return isValid;
	};

	function submitOwner() {
		if (validateOwner()) {
			var owners = $.trim(ownerSelectionForm.find('input[name=carOwner]:checked').val());
			carDetailsData = appState.setSelectedData(carDetailsData, {
				owners: owners
			});
			//trackSellCar.track('enterKms');
			analytics.trackAction("CWInteractive", "Sell Car - Desktop", "OwnerSelectionDone", cityForm.getCityData().cityName);
			resetBuyingIndexPrice(expectedPriceForm);
			if (typeof events != 'undefined') {
			    events.publish("ownersChanged", { owners: owners });
			}
			resetExpectedPriceForm();
			resetInsuranceForm();
			horizontalForm.setStepSelection(ownerSelectionForm);
		}
	};

	function validateOwner() {
		var isValid = false;

		if (ownerSelectionForm.find('input[name=carOwner]:checked').length === 0) {
			validateScreen.setError('Please select Number of owners');
		}
		else {
			isValid = true;
		}

		return isValid;
	};

	function submitRegistrationType() {
	    if (validateRegistrationType()) {
	        var regType = $.trim(registrationTypeSelectionForm.find('input[name=carRegistrationType]:checked').val());
	        carDetailsData = appState.setSelectedData(carDetailsData, {
	            regtype: regType
	        });
	        resetInsuranceForm();
	        horizontalForm.setStepSelection(registrationTypeSelectionForm);
	    }
	}

	function resetBuyingIndexPrice(expectedPriceField) {
		expectedPriceField.find('#recommendedCheckbox').val('');
		expectedPriceField.find('#recommendedPriceText').text('');
		expectedPriceField.find('.recommend-price-box').hide();
	}

	function bindBuyingIndexPrice(resp, expectedPriceField) {
    expectedPriceField.find("#recommendedCheckbox").val(resp.price);
    expectedPriceField
      .find("#recommendedPriceText")
      .text(Common.utils.formatNumeric(resp.price));
    expectedPriceField.find(".recommend-price-box").show();
  }

  function buyingIndexSuccess(response) {
    if (response && response.price > 0) {
      bindBuyingIndexPrice(response, expectedPriceForm);
      carDetailsData = appState.setSelectedData(carDetailsData, {
        RecommendedPrice: $.trim(response.price),
      });
      analytics.trackAction(
        "CWInteractive",
        "Sell Car - Desktop",
        "RecommendedPriceShown",
        cityForm.getCityData().cityName
      );
    } else {
      resetBuyingIndexPrice(expectedPriceForm);
    }
  }

	function buyingIndexFailed(response) {
	    resetBuyingIndexPrice(expectedPriceForm);
	}

	function submitKmsExpectedPriceForm() {
		if(validateKms() && validateExpectedPrice()) {
			submitKmsDriven();
			submitExpectedPrice();
			$('#modalBg').attr("data-current", "otp-popup-container");
			saveCarDetails(carDetailsData);
		}
	};

	function getInsuranceHtml () {
		horizontalForm.setNextStepGroups($('#bodyExpectedPrice'));
		setInsuranceDropdown();
	}

	function submitKmsDriven() {
		var kms = $.trim(kmsField.attr('data-value'));
		carDetailsData = appState.setSelectedData(carDetailsData, {
			kmsDriven: kms
		});

		$('#bodyKilometer').find('.selection__label').text(kmsField.val());
	};

	function validateKms() {
		var isValid = false;
		var kms = parseInt(kmsField.attr('data-value'));

		if (isNaN(kms)) {
			validate.field.setError(kmsField, 'Enter kilometers driven');
		}
		else if (kms < 100) {
			validate.field.setError(kmsField, 'KMs driven should be more than 100');
		}
		else if (kms > 900000) {
			validate.field.setError(kmsField, 'KMs driven should be below 9 Lakh kms ');
		} else if (!validateKmsPerYear({ kms })) {
			validate.field.setError(
				kmsField,
				"Maximum 3 Lacs km are allowed per year. Please enter appropriate value."
			);
		} else {
			isValid = true;
		}

		return isValid;
	};

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
		var price = $.trim(getExpectedPrice.attr('data-value'));
		carDetailsData = appState.setSelectedData(carDetailsData, {
			expectedPrice: price
		});

		$('#bodyExpectedPrice').find('.selection__label').text(getExpectedPrice.val());
		if ($(".recommend-price-box").is(":visible")) {
		    if ($("#recommendedCheckbox").is(":checked")) {
				analytics.trackAction("CWInteractive", "Sell Car - Desktop", "RecommendedPriceSelected", cityForm.getCityData().cityName);
		    }
		    else {
				analytics.trackAction("CWInteractive", "Sell Car - Desktop", "ExpectedPriceFilled", cityForm.getCityData().cityName);
		    }
		}
		else {
			analytics.trackAction("CWInteractive", "Sell Car - Desktop", "ExpectedPriceFilled", cityForm.getCityData().cityName);
		}
	};

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
		var isPriceBelowLowerLimit = cardetailsUtil.priceValidator.isBelowLowerLimit(
		  basicCarPrice,
		  expectedPrice,
		  $("#recommendedCheckbox").val(),
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
		  sellCarTracking.forDesktop("pricelimithit", "lower_limit");
		  return false;
		}
		var isPriceAboveUpperLimit = cardetailsUtil.priceValidator.isAboveUpperLimit(
		  basicCarPrice,
		  expectedPrice,
		  $("#recommendedCheckbox").val(),
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
		  sellCarTracking.forDesktop("pricelimithit", "upper_limit");
		  return false;
		}
		return true;
	  }

	function resetExpectedPriceForm() {
		expectedPriceForm.find('#recommendedCheckbox').attr('checked', false);
		getExpectedPrice.val('').closest('.field-box').removeClass('done');
		getExpectedPrice.attr('data-value', '');
		getExpectedPrice.siblings("div .getNumbersInWord").text("");
	};

	function setInsuranceDropdown() {
		var selectBox = $('#insuranceValidity').find('.select-box');

		selectBox.each(function () {
			var element = $(this);

			element.find('.chosen-select').chosen({
				width: '100%'
			});

			if (element.hasClass('select-box-no-input')) {
				chosenSelect.removeInputField(element);
			}
		});
	};
	function validateRegistrationNumber() {
		var regexEnglishAndNumerics = /^[A-Za-z0-9]*$/;
		var regState = registrationStateField.value;
		var regRto = registrationRtoField.value;
		var regNum = registrationCarNoField.value;
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
			.removeClass("hide");
		return false;
		}
		registrationForm
		.removeClass("invalid")
		.find(".error-text")
		.addClass("hide");
		return true;
  	}
	function submitInsurance() {
		parentContainer.setLoadingScreen();
		if (
			!(
			validateInsurance() &&
			validateRegistrationType() &&
			validateRegistrationNumber()
			)
		) {
			parentContainer.removeLoadingScreen();
			return false;
		}
		var insuranceValue = insuranceForm.find('input[name=carInsurance]:checked').val();
		carDetailsData = appState.setSelectedData(carDetailsData, {
			insurance: insuranceValue
		});

		if (insuranceValue && insuranceValue !== '3') {
			var insuranceExpiryMonth = $.trim(insuranceMonthField.find('option:selected').val());
			var insuranceExpiryYear = $.trim(insuranceYearField.find('option:selected').val());

			carDetailsData = appState.setSelectedData(carDetailsData, {
				insuranceExpiryYear: insuranceExpiryYear,
				insuranceExpiryMonth: insuranceExpiryMonth
			});
		}
		else {
			carDetailsData = appState.deleteObjectProperties(carDetailsData, ['insuranceExpiryYear', 'insuranceExpiryMonth']);
		}

		var regState = registrationStateField.value;
		var regRto = registrationRtoField.value;
		var regNum = registrationCarNoField.value;
		var registrationNo = $.trim(regState) + $.trim(regRto) + $.trim(regNum);

		carDetailsData = appState.setSelectedData(carDetailsData, {
		  registrationNumber: registrationNo,
		  takeLive: true
		});

		$('#registrationNumber').find('.selection__label').text(registrationNo.toUpperCase());
		saveInsuranceDetails(carDetailsData);
		return true;
	};

	function saveInsuranceDetails(carDetailsData) {
    var inquiryCookie = sellCarCookie.getSellInquiryCookie();
    var settings = {
      url:
        "/api/used/sell/insurancedetails/?encryptedId=" +
        encodeURIComponent(inquiryCookie),
      type: "PUT",
      data: carDetailsData,
      headers: {
        ServerDomain: "CarWale",
      },
    };
    if (inquiryCookie) {
      $.ajax(settings)
        .done(function (response) {
          parentContainer.removeLoadingScreen();
          var eventObj = {
            data: carDetailsData,
          };
          if (typeof events != "undefined") {
            if (isCarImagesViewLoaded) {
              events.publish("cardetailsUpdated", eventObj);
            } else {
              events.publish("insuranceSubmitted", eventObj);
            }
          }
        })
        .fail(function (xhr) {
          parentContainer.removeLoadingScreen();
          modalPopup.showModalJson(xhr.responseText);
        });
    }
    setFormSummary();
  }

	function saveCarDetails(carDetailsData)
	{
		var tempInquiry = $.cookie("TempInquiry") || '';
		carDetailsData = appState.setSelectedData(carDetailsData, {
			shareToCT: true,
			applicationId: 3,
			showOnCarwale: carDetailsData.sellCarCustomer.showOnCarwale,
		});
		var settings = {
		url: "/api/used/sell/cardetails/?tempid=" + encodeURIComponent(tempInquiry),
		type: "POST",
		data: carDetailsData,
		headers: { ServerDomain: "CarWale" },
		}
		var inquiryCookie = sellCarCookie.getSellInquiryCookie();
		if (inquiryCookie) {
		settings.url = "/api/v2/used/sell/cardetails/?encryptedId=" + encodeURIComponent(inquiryCookie);
		settings.type = "PUT";
		$.ajax(settings).done(function (response) {
			parentContainer.removeLoadingScreen();
			if (typeof events != 'undefined') {
				events.publish("takenLive");
			}
		}).fail(function (xhr) {
			parentContainer.removeLoadingScreen();
			modalPopup.showModalJson(xhr.responseText);
		});
		} else {
		    $.ajax(settings).done(function (response, msg, xhr) {
		        if (typeof events !== 'undefined') {
		            var eventObj = {
		                data: carDetailsData,
		                callback: onMobileverified
					};
		            events.publish("carDetailsPosted", eventObj);
		        }
		    }).fail(function (xhr) {
		        parentContainer.removeLoadingScreen();
		        modalPopup.showModalJson(xhr.responseText);
		    });
		}
		setFormSummary();
	}

	function onMobileverified(response,data) {
	    if (response.isMobileVerified) {
	        if (typeof events !== 'undefined') {
	            var eventObj = {
	                data: data,
				};
				events.publish("mobileVerified", eventObj);
	        }
	    }
	    else {
	        //show OTP screen
	        if (typeof events !== 'undefined') {
	            var eventObj = {
	                data: data,
				};
	            events.publish("mobileUnverified", eventObj);
	        }

	    }
	}

	function resetInsuranceForm() {
		$('#insuranceValidity').hide();
		insuranceForm.removeClass('validity-active');
		formField.emptySelect(insuranceMonthField);
		formField.emptySelect(insuranceYearField);
		$('#submitInsurance').hide();
	};

	function disableInsuranceStep() {
		if (insuranceForm.hasClass('step-group--active')) {
			horizontalForm.resetFormStep($('#bodyExpectedPrice'));
			resetInsuranceForm();
		}
	}

	function setFormSummary() {
		var formStepGroup = $('#formCarDetail').find('.form__step-group'),
			formSummary = [];

		formStepGroup.each(function() {
			var formStep = $(this).find('.form__step');

			formStep.each(function() {
				if ($(this).closest('.group-box').length) {
					var groupBox = $(this).closest('.group-box'),
						combinedFieldText = '';

					if(!groupBox.hasClass('step--accessed')) {
						groupBox.find('.form__step').each(function() {
							var formSelection = $(this).find('.selection__label');

							if (formSelection.length) {
								combinedFieldText += formSelection.text() + ' ';
							}
						});

						groupBox.addClass('step--accessed');
						formSummary.push(combinedFieldText);
					}
				}
				else {
					var fieldSelection = $(this).find('.selection__label');

					if (fieldSelection.length) {
						var fieldText = summary.getSelectionText(fieldSelection);

						if (fieldText.length) {
							formSummary.push(fieldText);
						}
					}
				}
			})
		});

		var summaryText = formSummary.join(' | '),
			accordionHead = $('.body__car-details').closest('.accordion__item').find('.accordion__head');
		
		summary.setToolbar(summaryText, accordionHead);
		summary.resetGroupAccessFlag($('#formCarDetail'));
	};

	function validateInsurance() {
		var isValid = true;
		var insuranceValue = insuranceForm.find('input[name=carInsurance]:checked').val();
		if (insuranceValue && insuranceValue != 3) {
			var insuranceExpiryMonth = insuranceForm.find('#getInsuranceMonth option:selected').val();
			var insuranceExpiryYear = insuranceForm.find('#getInsuranceYear option:selected').val();

			if (parseInt(insuranceExpiryMonth) <= 0) {
				isValid = false;
				validate.field.setError(insuranceMonthField, 'Select month');
			}
			if (parseInt(insuranceExpiryYear) <= 0) {
				isValid = false;
				validate.field.setError(insuranceYearField, 'Select year');
			}
		}
		return isValid;
	}

	function validateRegistrationType() {
	    var isValid = false;

	    if (registrationTypeSelectionForm.find('input[name=carRegistrationType]:checked').length === 0) {
	        validateScreen.setError('Please select registration type');
	    }
	    else {
	        isValid = true;
	    }
	    return isValid;
	}

	function validateRegistrationNo() {
    var isValid = true;
    var regRto = registrationRtoField.value;
    var regState = registrationStateField.value;
    var regNum = registrationCarNoField.value;

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
        .removeClass("hide");
      isValid = false;
    } else {
      registrationForm
        .removeClass("invalid")
        .find(".error-text")
        .addClass("hide");
    }
    return isValid;
  }

	function setEditToolTip() {
		if (!yearField.hasClass('tooltip-set') && carSelectForm.hasClass('step-group--active')) {
			yearField.addClass('tooltip-set');

			var tooltip = modalTooltip.getTemplate('Click again to change', 'edit-tooltip');

			modalTooltip.setTooltip($('#editTooltipContent'), tooltip);
			
			$('.edit-tooltip').fadeIn();
			var tooltipTimeOut = setTimeout(function () {
				$('.edit-tooltip').fadeOut();
				clearTimeout(tooltipTimeOut);
			}, 3000);
		}
	}

})();

var horizontalForm = (function () {
    function setStepSelection(formStep) {       
        var optionList = formStep.find('.step__option-list');
        var currentStep = formStep.attr('id');
        if (currentStep) {
            sellCarTracking.forDesktop(currentStep);
        }
		if (optionList.hasClass('radio-box')) {
			var selectionText = optionList.find('input[type="radio"]:checked').next('label').text();
			formStep.find('.selection__label').text(selectionText);
		}
		formStep.addClass('step--done');
		setNextStep(formStep);
	}

	function setNextStep(formStep) {
		var nextStep = formStep.next('.form__step');

		if (nextStep.length) {
			nextStep.addClass('step--active');
			if (nextStep.find('.step__error').length) {
				nextStep.find('.step__error').text('');
			}
			setScrollbar(nextStep);
		}
		else {
			setNextStepGroups(formStep);
		}
	}

	function setNextStepGroups(formStep) {
		var nextStepGroup = formStep.closest('.form__step-group').next('.form__step-group'),
			previewStepGroup = nextStepGroup.next('.form__step-group');

		nextStepGroup.removeClass('step-group--preview').addClass('step-group--active');
		previewStepGroup.addClass('step-group--preview');
		previewStepGroup.find('.form__step').first().addClass('step--active');

		setScrollbar(nextStepGroup.find('.form-step__body').first());
	}

	// reset
	function resetFormStep(formStep) {
		resetStep(formStep);
		resetNextSteps(formStep);
		resetOtherColor();
	}

	function resetStep(formStep) {
		var optionList = formStep.find('.step__option-list');

		formStep.removeClass('step--done').find('.selection__label').text('');

		if (optionList.hasClass('radio-box')) {
			optionList.find('input[type="radio"]:checked').prop('checked', false);
		}
	}

	function resetNextSteps(formStep) {
		var nextAllSteps = formStep.nextAll('.form__step.step--active');
			
		nextAllSteps.each(function () {
			$(this).removeClass('step--active');
			resetStep($(this));
		});

		resetNextStepGroups(formStep);
	}

	function resetOtherColor() {
	    var otherColorBox = $("#otherColorField");
	    var otherColorField = $("#getOtherColour");
	    otherColorField.val('');
	    validate.field.hideError(otherColorField);
	    otherColorBox.hide();
	}
	function resetNextStepGroups(formStep) {
		var nextStepGroup = formStep.closest('.form__step-group').next('.form__step-group');
		nextStepGroup.removeClass('step-group--active').addClass('step-group--preview');

		var nextActiveSteps = nextStepGroup.find('.form__step');
		nextActiveSteps.each(function () {
			if (!$(this).index()) {
				$(this).addClass('step--active');
			}
			else {
				$(this).removeClass('step--active');
			}
			resetStep($(this));
		});

		// next2NextStepGroup
		var next2NextStepGroup = nextStepGroup.nextAll('.form__step-group');
		next2NextStepGroup.removeClass('step-group--active step-group--preview');

		var next2NextActiveSteps = next2NextStepGroup.find('.form__step.step--active');
		next2NextActiveSteps.each(function () {
			$(this).removeClass('step--active');
			resetStep($(this));
		});
	}

	function setInitialSteps(formContainer) {
		var firstFormGroup = formContainer.find('.form__step-group').first(),
			secondFormGroup = firstFormGroup.next('.form__step-group');

		firstFormGroup.addClass('step-group--active');
		secondFormGroup.addClass('step-group--preview');
		$(firstFormGroup).find('.form__step').first().addClass('step--active');
		$(secondFormGroup).find('.form__step').first().addClass('step--active');

		setScrollbar(firstFormGroup.find('.form__step').first().find('.form-step__body'));
	}

	function setScrollbar(formStep) {
		var formStepBody = formStep.find('.form-step__body').length ? formStep.find('.form-step__body') : formStep;

		if (formStepBody.hasClass('step--scrollbar')) {
			var formContainer = formStep.closest('.horizontal-form'),
				listHeight = ($(formContainer).height() - 25) - (formStep.offset().top - $(formContainer).offset().top);

			formStepBody.css({
				'height': listHeight + 'px',
				'overflow-y': 'scroll'
			});
		}
		
	}

	function setError(formStep, message) {
		formStep.find('.step__error').text(message);
	}

	function hideError(formStep) {
		formStep.find('.step__error').text('');
	}

	return {
		setInitialSteps: setInitialSteps,
		setStepSelection: setStepSelection,
		setNextStep: setNextStep,
		setNextStepGroups: setNextStepGroups,
		resetFormStep: resetFormStep,
		setError: setError,
		hideError: hideError
	}

})();

