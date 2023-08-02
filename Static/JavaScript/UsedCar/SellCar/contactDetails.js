//dependency:-
// 1. static/m/js/used/sellcar/common.js
// 2. easy-autocomplete js
var contactForm = (function () {
    var container, getName, getMobile, shareToCarWaleCheckBox, isCarDetailsViewFetched = false;

    var contactData = {};

    if (typeof events !== 'undefined') {
        events.subscribe("contactDetailsDocReady", setSelectors);
        events.subscribe("contactDetailsDocReady", registerDomEvents);
        events.subscribe("citySubmit", contactFormLoadHandler);
        events.subscribe("updateContactDetails", updateContactDetails);
    }

    function setSelectors() {
        container = $('#formContact');
        getName = $('#getName');
        getMobile = $('#getMobile');
        shareToCarWaleCheckBox = $('#cwAdChecbox');
    }

    function registerDomEvents() {
        documentReadyFormReset();

        $('#submitCityContactForm').on('click', function () {
            submitForm();
        });
    }

    function documentReadyFormReset() {
        if (getName.val().length > 0) {
            getName.text('');
        }

        if (getMobile.val().length > 0) {
            getMobile.text('');
        }
    }

    function contactFormLoadHandler(eventObj) {
        if (eventObj && eventObj.data) {
            contactData = appState.setSelectedData(contactData, eventObj.data);
        }
    };

    function submitForm() {
        if (validateCityContactForm()) {

            parentContainer.setLoadingScreen();
            cityForm.setFormData();

            contactData = appState.setSelectedData(contactData, {
                name: $.trim(getName.val()),
                mobile: $.trim(getMobile.val()),
                showOnCarwale: shareToCarWaleCheckBox.is(':checked'),
                cityId: cityForm.getCityData().cityId
            });

            var partialCardetails = $('.partialCarDetails');
            var settings = {
                url: "/api/used/sell/contactdetails/" + ($.cookie("TempInquiry") ? ("?tempid=" + encodeURIComponent($.cookie("TempInquiry"))) : ""),
                type: "POST",
                data: contactData,
                headers: { ServerDomain: "CarWale" },
            }

            $.ajax(settings).done(function (response) {
                if (response && response.tempInquiryId) {

                    if (!isCarDetailsViewFetched) {
                        sellCarCookie.deleteSellInquiryCookie();
                        sellCarCookie.setTempInquiryCookie(response.tempInquiryId);
                        var settings = {
                            url: '/sell-used-car/used/sell/cardetails/'
                        };
                        $.ajax(settings).done(function (response) {
                            analytics.trackAction("CWInteractive", "Sell Car - Desktop", "Contact Details Done", cityForm.getCityData().cityName);
                            partialCardetails.find('.accordion__body').html(response);
                            if (typeof events !== 'undefined') {
                                var eventObj = {
                                    data: contactData
                                };
                                events.publish("contactSubmit", eventObj);
                            }
                        }).fail(function (xhr) {
                            parentContainer.removeLoadingScreen();
                            modalPopup.showModal(xhr.responseText);
                        });
                        isCarDetailsViewFetched = true;
                    }
                    else {
                        $('.partialCarDetails').find('.accordion__head').attr('data-access', 1).trigger('click');
                        if (typeof events !== 'undefined') {
                            var eventObj = {
                                data: contactData
                            };
                            events.publish("contactDetailsChanged", eventObj)
                        }
                    }
                }
            }).fail(function (xhr) {
                parentContainer.removeLoadingScreen();
                analytics.trackAction("CWInteractive", "Sell Car - Desktop", "Max Limit Reached", cityForm.getCityData().cityName);
                modalPopup.showModalJson(xhr.responseText);
            });

            setFormSummary();
        }
        else {
            parentContainer.focusDocument($('#formContainer'));
        }
    };

    function updateContactDetails(eventObj) {
        var data = {};
        if (eventObj && eventObj.data) {
            data = appState.setSelectedData(data, eventObj.data);
            getMobile.val(data.sellCarCustomer.mobile);
            setFormSummary();
        }
    }
    function validateCityContactForm() {
        var isValid = false;
        isValid = cityForm.validateCityForm();
        isValid &= validateForm.userName(getName);
        isValid &= validateForm.userMobile(getMobile);
        return isValid;
    };

    var validateForm = {
        userName: function (nameField) {
            var isValid = false,
				nameValue = nameField.val(),
				reName = /^([-a-zA-Z ']*)$/;

            if (nameValue == "") {
                validate.field.setError(nameField, 'Please provide your name');
            } else if (!reName.test(nameValue)) {
                validate.field.setError(nameField, 'Please provide only alphabets');
            } else if (nameValue.length == 1) {
                validate.field.setError(nameField, 'Please provide your complete name');
            }
            else {
                validate.field.hideError(nameField);
                isValid = true;
            }

            return isValid;
        },

        userMobile: function (mobileField) {
            var isValid = false,
				mobileValue = mobileField.val(),
				reMobile = /^[6789]\d{9}$/;

            if (mobileValue == "") {
                validate.field.setError(mobileField, 'Please provide your mobile number');
            } else if (mobileValue.length != 10) {
                validate.field.setError(mobileField, 'Enter your 10 digit mobile number');
            } else if (!reMobile.test(mobileValue)) {
                validate.field.setError(mobileField, 'Please provide a valid 10 digit Mobile number');
            }
            else {
                validate.field.hideError(mobileField);
                isValid = true;
            }

            return isValid;
        },
    };

    function setFormSummary() {
        var fieldBox = $('.body__contact-details').find('.field-box');

        var formSummary = [];
        fieldBox.each(function () {
            var fieldSelection = summary.getFieldDetails($(this));

            if (fieldSelection.fieldValue.length) {
                formSummary.push(fieldSelection.fieldValue);
            }
        });

        var summaryText = formSummary.join(' | '),
			accordionHead = $('.body__contact-details').closest('.accordion__item').find('.accordion__head');

        summary.setToolbar(summaryText, accordionHead);
    };

    return {
        submitForm: submitForm
    };

})();

var cityForm = (function () {
    var container, cityField, popularCityList, pincodeInputBox, pincodeField;

    var cityData = {};

    if (typeof events !== 'undefined') {
        events.subscribe("contactDetailsDocReady", setSelectors);
        events.subscribe("contactDetailsDocReady", registerDomEvents);
        //events.subscribe("contactDetailsDocReady", detectCity);
        events.subscribe("contactDetailsDocReady",disableAutoComplete);
    }
    function disableAutoComplete()
    {
        $("#cityInputBox").find("#getCity").attr("autocomplete","sell-car-d-city");
        $("#pincodeInputBox").find("#getPincode_chosen .chosen-drop .chosen-search input").attr("autocomplete","sell-car-d-pincode");
    }
    function setSelectors() {
        container = $('#formCity');
        cityField = $('#getCity');
        cityFieldWrapper: $('#cityFieldWrapper');
        popularCityList = $('#popularCityList');
        pincodeInputBox = $('#pincodeInputBox');
        pincodeField = $('#getPincode');
    }

    function detectCity() {
        var globalCity = getGlobalCity();
        var cityId;
        if (cityId = getQueryStringParam('city')) {
            var settings = {
                url: '/webapi/GeoCity/GetCityNameById/?cityid=' + cityId,
                type: "GET"
            }
            $.ajax(settings).done(function (cityName) {
                if (cityName) {
                    selectCity(cityId, cityName.replace(/^"(.*)"$/, '$1'));
                }
            });
        }
        else if (globalCity && globalCity.id && globalCity.name) {
            selectCity(globalCity.id, globalCity.name);
        }
        else {
            geoLocation.getCurrentCity().then(function (city) {
                if (!cityField.val() && city && city.id && city.name)
                    selectCity(city.id, city.name);
            });
        }
    }

    function getGlobalCity() {
        var name = $.cookie('_CustCityMaster');
        var id = $.cookie('_CustCityIdMaster');

        if (id && id != -1 && name) {
            return { id: id, name: name };
        }
        return {};
    }

    function registerDomEvents() {
        if (cityField.val().length > 0) {
            cityField.text('');
        }

        cityField.cw_autocomplete({
            resultCount: 5,
            source: ac_Source.globalCityLocation,
            afterfetch: function (result, searchtext) {
                if (result && result.length > 0) {
                    validate.field.hideError(cityField);
                }
                else {
                    validate.field.setError(cityField, 'Sorry! No matching results found. Try again.');
                }
                popularCityList.hide();
            },

            keyup: function () {
                if (cityField.val().length == 0) {
                    suggestionList.open(cityFieldWrapper);
                }
                else {
                    suggestionList.close(cityFieldWrapper);
                }
            },

            click: function (event, ui, orgTxt) {
                var cityPayload = ui.item.payload;
                var selectionLabel = $.trim(cityPayload.cityName);
                var selectionId = $.trim(cityPayload.cityId);
                selectCity(selectionId, selectionLabel);
            },

            focusout: function () {
                if (!container.hasClass('city-select-done')) {
                    popularCityList.show();
                }
            }
        }).autocomplete("widget").addClass('city-field-autocomplete');

        $(cityField).on('focus', function () {
            if (!cityField.val().length) {
                suggestionList.open(cityFieldWrapper);
            }
        });

        $(popularCityList).on('change', 'input[name=citySelect]', function () {
            if ($(this).val().length !== 0) {

                var selectionLabel = $.trim($(this).next('label').text());
                var selectionVal = $.trim($(this).val());

                selectCity(selectionVal, selectionLabel);

                suggestionList.close(cityFieldWrapper);
                $(this).prop('checked', false);
            }
        });

        $(pincodeField).on('change', function () {
            var areaId = $.trim($(this).val());
            var selectedText = $(this).find('option:selected').text();
            var pincode = $.trim(selectedText.split(',')[0]);
            pincodeInputBox.attr('data-pincode', pincode);
            pincodeInputBox.attr('data-areaid', areaId);
            
        });

        $(pincodeInputBox).on('keydown', '.chosen-container input', function (e) {
            var eventKeyCode = e.keyCode || e.which;
            if (eventKeyCode == 9 || eventKeyCode == 13) {
                setPincodeUserValue($(this));
            }
        })

        $(pincodeInputBox).on('keyup', '.chosen-container input', function (e) {
            var inputValue = $(this).val();
            var eventKeyCode = e.keyCode || e.which;
            
            if (eventKeyCode != 13 && eventKeyCode != 9 && inputValue.length < 7) {
                $(this).val('');
                $(this).val(inputValue);
                pincodeInputBox.attr('data-pincode', inputValue);
                pincodeInputBox.attr('data-areaid', -1);
            }
            else {
                var truncateValue = inputValue.substr(0, 6);
                $(this).val(truncateValue);
                $(this).closest('.chosen-container').find('.no-results span').text(truncateValue);
            }
        });

        $(pincodeInputBox).on('blur', '.chosen-container input', function (e) {
            setPincodeUserValue($(this));
        })
        
        $(pincodeInputBox).on('click', '.no-results', function () {
            var inputField = $(this).closest('.chosen-container').find('input');
            chosenSelect.noResultSelection(pincodeField, inputField);
        });

        // popular city list
        $('.suggestion-dropdown-list li').mouseenter(function () {
            $(this).siblings('.state--focus').removeClass('state--focus');
            $(this).addClass('state--focus');
        }).mouseleave(function () {
            $(this).removeClass('state--focus');
        });

        $(document).on("click", ".suggestion-list-active", function (e) {
            if (!$(".ui-autocomplete-input").is(":focus")) {
                if (!$(e.target).hasClass('suggestion-list-title')) {
                    suggestionList.close(cityFieldWrapper);
                }
            }
        });

        cityField.on('keydown', function (event) {
            suggestionList.keyboardSelection($(this), popularCityList, event);
        });

        bindChoosenToPincode();
    }

    var suggestionList = {
        open: function (inputContainer) {
            $(inputContainer).find('.suggestion-dropdown-list').show();
            $("body").addClass("suggestion-list-active");
        },

        close: function (inputContainer) {
            var list = $(inputContainer).find('.suggestion-dropdown-list');

            list.hide().find('li.state--focus').removeClass('state--focus');
            $("body").removeClass("suggestion-list-active");
        },

        keyboardSelection: function (inputField, suggestionDropdown, event) {
            if (suggestionDropdown.is(':visible')) {
                var dropdownList = suggestionDropdown.find('.suggestion-list'),
					activeItem = dropdownList.find('.state--focus'),
					eventKeyCode = event.keyCode || event.which;

                switch (eventKeyCode) {
                    case 38:
                        var prevItem = activeItem.prev('li');

                        if (!activeItem.length) {
                            dropdownList.find('li').last().addClass('state--focus');
                        }
                        else {
                            activeItem.removeClass('state--focus');

                            if (!prevItem.length) {
                                dropdownList.find('li').last().addClass('state--focus');
                            }
                            else {
                                activeItem.prev('li').addClass('state--focus');
                            }
                        }
                        break;

                    case 40:
                        var nextItem = activeItem.next('li');

                        if (!activeItem.length) {
                            dropdownList.find('li').first().addClass('state--focus');
                        }
                        else {
                            activeItem.removeClass('state--focus');

                            if (!nextItem.length) {
                                dropdownList.find('li').first().addClass('state--focus');
                            }
                            else {
                                activeItem.next('li').addClass('state--focus');
                            }
                        }
                        break;

                    case 13:
                        inputField.blur();
                        if (activeItem.find('input').length) {
                            activeItem.find('input').prop('checked', true).trigger('change');
                        }
                        activeItem.removeClass('state--focus');
                        break;

                    default:
                        break;
                }
            }
        }
    }

    function selectCity(selectionId, selectionLabel) {
        validate.field.hideError(cityField);
        cityField.val(selectionLabel);

        fetchPincode(selectionId).done(function (resp) {
            bindPincodeDropDown(pincodeField, resp)
        });
        cityData = appState.setSelectedData(cityData, {
            cityId: selectionId,
            cityName: selectionLabel
        });
	    if (typeof events != 'undefined') {
	        events.publish("cityChanged", { cityId: cityData.cityId });
	    }
        citySelectionDone();
    }

    function fetchPincode(cityId) {
        var url = "/api/locations/areacode/?cityId=" + cityId;
        var headers = { ServerDomain: "CarWale" };
        return ajaxRequest.getJsonPromise(url,headers);
    };

    function bindPincodeDropDown(pincodeField, resp) {
        if (resp) {
            var bindingObj = resp.map(function (obj) {
                return {
                    val: obj.AreaId,
                    text: obj.Pincode + ', ' + obj.AreaName
                };
            });
            pincodeField.append(templates.fillDropDownTemplate(bindingObj).join(''));
            pincodeField.trigger('chosen:updated');
        }
	};

    function setPincodeUserValue(inputField) {
        var inputValue = inputField.val();

        if (inputValue && inputValue.length == 6) {
            inputField.val(inputValue);
            chosenSelect.noResultSelection(pincodeField, inputField);
        }
    }

    function citySelectionDone() {
        container.addClass('city-select-done');
        formField.resetSelect(pincodeField);
        analytics.trackAction("CWInteractive", "Sell Car - Desktop", "CitySelectionDone", cityData.cityName);
    };

    function getCityData() {
        return cityData;
    }

    function bindChoosenToPincode() {
        $(pincodeField).chosen({
            width: '100%',
            no_results_text: 'Select:'
        })
        $(pincodeField).closest('.select-box').find('.chosen-search input').prop('type', 'number').prop('tabindex', '2');
    };

    function setFormData() {
        cityData = setPincodeData(pincodeInputBox.attr('data-pincode'), pincodeInputBox.attr('data-areaid'));
        //parentContainer.removeIntroScreen();

        //trackSellCar.track('contactDetails');
        if (typeof events !== 'undefined') {
            var eventObj = {
                data: cityData
            };
            events.publish('citySubmit', eventObj);
        }
    };

    function setPincodeData(pincode, areaId) {
        if (pincode) {
            cityData = appState.setSelectedData(cityData, { pincode: pincode });
        }
        else {
            cityData = appState.deleteObjectProperties(cityData, ["pincode"])
        }
        if (areaId !== "-1") {
            cityData = appState.setSelectedData(cityData, { areaId: areaId });
        }
        else {
            cityData = appState.deleteObjectProperties(cityData, ["areaId"])
        }
        return cityData;
    };

    function validateCityForm() {
        var isValid = false;
        isValid = validateForm.city(cityField);
        isValid &= validateForm.pincode(pincodeField);

        return isValid;
    };

    var validateForm = {
        city: function () {
            var isValid = false;

            if (!cityField.val().length) {
                validate.field.setError(cityField, 'Select city');
            }
            else {
                isValid = true;
            }

            return isValid;
        },

        pincode: function () {
            var fieldData = pincodeInputBox.attr('data-pincode');
            var isValid = false;
            if (!userPincode.validate(fieldData)) {
                validate.field.setError(pincodeField, fieldData && fieldData.trim() ? 'Select correct Pincode' : 'Select pincode');
                pincodeField.closest('.field-box').addClass('done');
            }
            else {
                isValid = true;
            }
            return isValid;
        }
    };

    return {
        validateCityForm: validateCityForm,
        setFormData: setFormData,
        getCityData: getCityData
    }

})();

$(document).ready(function () {
    if (typeof events !== 'undefined') {
        events.publish("contactDetailsDocReady");
    }
    sellCarCookie.deleteSellInquiryCookie();
    sellCarCookie.deleteTempInquiryCookie();
});
