var errorIds = ['spnKm', 'spnPrice', 'spnColor', 'spnComments', 'spnWarranties', 'spnMileage', 'spnVersion'];
var carData = {};
let maxKmsPerYearLimitInput;
$(document).ready(function () {
    maxKmsPerYearLimitInput = $("#maxKmsPerYearLimit");
    document.getElementById("txtRegistrationNoStateCode").addEventListener("input", function (event) {
        var stateCode = event.target.value;
        if (!event.ctrlKey && !event.altKey && !event.shiftKey ) {
            if (typeof(carRegistrationNumber) !== 'undefined' && stateCode && !carRegistrationNumber.isStateCodeValid(stateCode)) {
                showRegistrationNoError(true);
            } else {
                showRegistrationNoError(false);
            }
            if (event.target.value.length >= 2 && event.inputType === "insertText") {
                document.getElementById("txtRegistrationNoRTOCode").focus();
            }
        }
    });

    document.getElementById("txtRegistrationNoRTOCode").addEventListener("input", function (event) {
        var rtoCode = event.target.value;
        var registrationNoStateField = document.getElementById("txtRegistrationNoStateCode");
        var stateCode = registrationNoStateField.value;

        if (
            (!stateCode && rtoCode) ||
            (typeof (carRegistrationNumber) !== 'undefined' && rtoCode && !carRegistrationNumber.isRtoCodeValid(rtoCode))
        ) {
            showRegistrationNoError(true);
        } else if (typeof (carRegistrationNumber) !== 'undefined' && rtoCode && rtoCode.length === 2) {
            showRegistrationNoError(
                !carRegistrationNumber.isValidRegisterationNo(
                    stateCode + rtoCode
                )
            );
        } else {
            showRegistrationNoError(false);
        }
        
        
        if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.inputType === "insertText" && event.target.value.length >= 2) {
            document.getElementById("txtRegistrationNo").focus();
        }
    });

    document.getElementById("txtRegistrationNo").addEventListener("input", function (event) {
        var registrationNoRtoField =  document.getElementById("txtRegistrationNoRTOCode");
        var registrationNoStateField = document.getElementById("txtRegistrationNoStateCode");
        var rtoCode = registrationNoRtoField.value;
        var stateCode = registrationNoStateField.value;
        var carNumber = event.target.value;
        if (
            ((!stateCode || !rtoCode) && carNumber) || ( typeof (carRegistrationNumber) !== 'undefined' && 
            !carRegistrationNumber.isValidRegisterationNo(
                stateCode + rtoCode
            )) ||
            (typeof (carRegistrationNumber) !== 'undefined' && carNumber && !carRegistrationNumber.isNumberValid(carNumber))
        ) {
            showRegistrationNoError(true);
        } else {
            showRegistrationNoError(false);
        }
        if (event.target.value.length > 7) {
            event.target.value = event.target.value.substr(0, 7);
        }
    });

    document.getElementById("txtRegistrationNo").addEventListener("keydown", function (event) {
        var registrationNoRtoField = document.getElementById("txtRegistrationNoRTOCode");
        var registrationNoStateField = document.getElementById("txtRegistrationNoStateCode");
        var stateCode = registrationNoStateField.value;
        var rtoCode = registrationNoRtoField.value;
        var carNumber = event.target.value;

        if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.keyCode === 8 && !carNumber) {
            if (rtoCode) {
                var len = rtoCode.length;
                registrationNoRtoField.focus();
                registrationNoRtoField.setSelectionRange(len, len);
            } else {
                moveCursorToStateField(stateCode, registrationNoStateField);
            }
        }
    });

    document.getElementById("txtRegistrationNoRTOCode").addEventListener("keydown", function (event) {
        var rtoCode = event.target.value;
        var registrationNoStateField = document.getElementById("txtRegistrationNoStateCode");
        var stateCode = registrationNoStateField.value;
        if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.keyCode === 8 && !rtoCode) {
            moveCursorToStateField(stateCode, registrationNoStateField);
        }
    });

});

function moveCursorToStateField(stateCode, registrationNoStateField) {
    var len = stateCode.length;
    registrationNoStateField.focus();
    registrationNoStateField.setSelectionRange(len, len);
}

function showRegistrationNoError(show) {
    if (show) {
        document.getElementById("spnReg").innerText = "Please Provide Valid Registration No.";
    }
    else{
        document.getElementById("spnReg").innerText = "";
    }
}

function validateRegistrationNo() {
    var isValid = true;
    var regRto = document.getElementById("txtRegistrationNoRTOCode").value;
    var regState = document.getElementById("txtRegistrationNoStateCode").value;
    var regNum = document.getElementById("txtRegistrationNo").value;
    if (typeof (carRegistrationNumber) !== 'undefined' && (
        !regState ||
        !regRto ||
        !regNum ||
        !carRegistrationNumber.isStateCodeValid(regState) ||
        !carRegistrationNumber.isRtoCodeValid(regRto) ||
        !carRegistrationNumber.isNumberValid(regNum) ||
        !carRegistrationNumber.isValidRegisterationNo(regState + regRto))
    ) {
        document.getElementById("spnReg").innerText = "Please Provide Valid Registration No.";
        isValid = false;
    } else {
        document.getElementById("spnReg").innerText = "";
    }
    return isValid;
}

function clearErrors() {
    for(var index =0 ; index<errorIds.length; index++){
        document.getElementById(errorIds[index]).innerHTML = "";
    }
    $("#spnOwners").html("");
    $("#spnRegistrationType").html("");
}

function checkEmptyValues(){
    var isValid =true;
    if (document.getElementById('txtKilometers').value === "") {
        document.getElementById('spnKm').innerHTML = "Required";
        isValid = false;
    }
    if (document.getElementById('txtPrice').value === "") {
        document.getElementById('spnPrice').innerHTML = "Required";
        isValid = false;
    }
    if (document.getElementById('txtColor').value === "") {
        document.getElementById('spnColor').innerHTML = "Required";
        isValid = false;
    }
    return isValid;
}

function isValidKms(carInfo)
{
  var isValid = true;
  var integerPattern = /^[0-9]*$/;
  let kmsText = document.getElementById('txtKilometers').value;
  if(!kmsText)
  {
    return false;
  }
  let kmsErrorField = document.getElementById('spnKm');
  if(!kmsErrorField)
  {
    return false;
  }
  if (!integerPattern.test(kmsText)) {
    kmsErrorField.innerHTML = "Numbers Only";
    isValid = false;
  }
  else if (!!carInfo && !validateKmsPerYear({ kms: parseInt(kmsText, 10), carInfo })) {
    isValid = false;
    kmsErrorField.innerHTML = "Maximum 3 Lacs km are allowed per year. Please enter appropriate value.";
  }
  return isValid;
}

function validateKmsPerYear({ kms, carInfo }) {
  let isValid = true;
  if(!carInfo)
  {
    return isValid;
  }
  if (!maxKmsPerYearLimitInput) {
    return isValid;
  }
  var maxKmsPerYearLimit = getIntFromString(maxKmsPerYearLimitInput.val());
  if (isNaN(maxKmsPerYearLimit)) {
    return isValid;
  }
  var currentYear = new Date().getFullYear();
  var makeYear = carInfo.MakeYear;
  var carAge = !!makeYear ? currentYear - makeYear.getFullYear() + 1 : 0;
  if (carAge === 0) {
    return isValid;
  }
  isValid = kms <= (carAge * maxKmsPerYearLimit);
  return isValid;
}

function isValidPrice(customerSellInquiryVehicleData, makeYear, owners) {
  var integerPattern = /^[0-9]*$/;
  if (!integerPattern.test(document.getElementById("txtPrice").value)) {
    document.getElementById("spnPrice").innerHTML = "Numbers Only";
    return false;
  }
  if (!$("#UserCityId")) {
    return true;
  }
  var userCityId = parseInt($("#UserCityId").val());
  const { VersionId, Price } = customerSellInquiryVehicleData;
  const currentYear = new Date().getFullYear();
  var carAge = currentYear - makeYear;
  var basicCarPrice = fetchBasicPrice(VersionId, userCityId);
  var valuationPrice = fetchValuationPrice(
    customerSellInquiryVehicleData,
    makeYear,
    owners,
    userCityId,
    currentYear
  );
  var isPriceBelowLowerLimit = cardetailsUtil.priceValidator.isBelowLowerLimit(
    basicCarPrice,
    Price,
    valuationPrice,
    carAge
  );
  if (isPriceBelowLowerLimit) {
    document.getElementById("spnPrice").innerHTML =
      "Price is too low for the car";
    return false;
  }
  var isPriceAboveUpperLimit = cardetailsUtil.priceValidator.isAboveUpperLimit(
    basicCarPrice,
    Price,
    valuationPrice,
    carAge
  );
  if (isPriceAboveUpperLimit) {
    document.getElementById("spnPrice").innerHTML =
      "Price is too high for the car";
    return false;
  }
  return true;
}

function fetchBasicPrice(versionId, cityId) {
  let modelId = 0, makeId = 0;
  if (maxKmsPerYearLimitInput) {
    modelId = getIntFromString(maxKmsPerYearLimitInput.attr("data-model-id"));
    makeId = getIntFromString(maxKmsPerYearLimitInput.attr("data-make-id"));
  }
  var url = "/api/version/" + versionId + "/price-range/?cityId=" + cityId + "&modelId=" + modelId + "&makeId=" + makeId;
  var basicCarPrice = 0;
  $.ajax({
    type: "GET",
    url: url,
    async: false,
    headers: { ServerDomain: "CarWale" },
  }).done(function (response) {
    basicCarPrice = !!response ? parseInt(response.maxPrice, 10) : 0;
  });
  return basicCarPrice;
}

function fetchValuationPrice(
  customerSellInquiryVehicleData,
  year,
  owners,
  userCityId,
  currentYear
) {
  const { VersionId, Kilometers } = customerSellInquiryVehicleData;
  var requestBody = {
    versionId: VersionId,
    owners: owners,
    makeYear: year,
    cityId: userCityId,
    kilometers: Kilometers,
    entryYear: currentYear,
    valuationType: 2,
  };
  var valuationPrice = 0;
  $.ajax({
    type: "GET",
    url: "/api/used/valuation",
    headers: { ServerDomain: "CarWale" },
    data: requestBody,
    async: false,
  }).done(function (response) {
    if (response) {
      valuationPrice = parseInt(response.Price);
    }
  });
  return valuationPrice;
}

function isValidText (){
    var isValidTextRequest = true;
    var reg = /<(.|\n)*?>/g;
    var commentTextNode = document.getElementById('txtComments');
    if (commentTextNode) {
      var commentText = commentTextNode.value;
      if (reg.test(commentText)) {
        document.getElementById("spnComments").innerHTML =
          "Only alphabets/numbers allowed";
        isValidTextRequest = false;
      } else if (commentText.length > 1000) {
        document.getElementById("spnComments").innerHTML =
          "Maximum 1000 varters";
        isValidTextRequest = false;
      }
      setSpamDetectionResult(commentText);
      var queryParameters = getValuesFromUrl();
      if (queryParameters != null) {
        let profileId = queryParameters["id"];
        if (carData && carData.isOwnerCommentsSpam) {
          editCarTracking.trackForDesktop(
            editCarTracking.actionType.spamComment,
            "profileId=" + profileId
          );
        }
        if (commentText) {
          editCarTracking.trackForDesktop(
            editCarTracking.actionType.commentsAdded,
            "profileId=" + profileId
          );
        }
      }
    }

    if(carData.isOwnerCommentsSpam){
        document.getElementById('spnComments').innerHTML = "Please enter valid comments";
        isValidTextRequest = false;
    }

    if (reg.test(document.getElementById('txtWarranties').value)) {
        document.getElementById('spnWarranties').innerHTML = "Only alphabets/numbers allowed";
        isValidTextRequest = false;
    }
    else if (document.getElementById('txtWarranties').value.length > 1000) {
        document.getElementById('spnWarranties').innerHTML = "Maximum 1000 varters";
        isValidTextRequest = false;
    }
    return isValidTextRequest;
}

function setSpamDetectionResult(text) {
    if(!text)
    {
      carData.isOwnerCommentsSpam = false;
      return;
    }
    $.when(
      spamDetectionAjaxCall(text)
        .done(function (response) {
          if (response) {
            carData.isOwnerCommentsSpam = response.isSpam;
          }
        })
        .fail(function () {
            carData.isOwnerCommentsSpam = false;
        })
    );
  }

  function spamDetectionAjaxCall(text) {
    if(text)
    {
      return $.ajax({
        type: "GET",
        url: "/api/detect-spam",
        data: {text: text},
        async: false,
      });
    }
  }


function getValuesFromUrl()
{
    var dictionary = [],keyValuePairs,pair;
    var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
    keyValuePairs=queryString.split("&");
    for(var i = 0; i < keyValuePairs.length; i++)
    {
        pair = keyValuePairs[i].split('=');
        dictionary.push(pair[0]);
        dictionary[pair[0]] = pair[1];
    }
    return dictionary;
}

function updateCarDetails(customerId) {
    var customerSellInquiryVehicleData = {};
    var sellInquiriesOtherDetails = {};
    var sellCarConditions = {};
    var stateCode = document.getElementById("txtRegistrationNoStateCode").value;
    var rtoCode = document.getElementById("txtRegistrationNoRTOCode").value;
    var regNo = document.getElementById("txtRegistrationNo").value;
    sellInquiriesOtherDetails.CustomerId=customerId;
    sellInquiriesOtherDetails.RegistrationNumber = stateCode+rtoCode+regNo;
    var regType = document.getElementById("drpCarRegistrationType");
    sellInquiriesOtherDetails.RegType = regType.options[regType.selectedIndex].value;
    sellInquiriesOtherDetails.Color = document.getElementById("txtColor").value;
    sellInquiriesOtherDetails.RegistrationPlace = document.getElementById("txtRegistrationPlace").value;
    var drpOwners = document.getElementById("drpOwners");
    sellInquiriesOtherDetails.Owners = drpOwners.options[drpOwners.selectedIndex].value;
    var drpInsurance = document.getElementById("drpInsurance");
    sellInquiriesOtherDetails.Insurance = drpInsurance.options[drpInsurance.selectedIndex].value;
    var selectInsuranceDay = document.getElementById("selectInsuranceDay");
    selectInsuranceDay = selectInsuranceDay.options[selectInsuranceDay.selectedIndex].value;
    var selectInsuranceMonth = document.getElementById("selectInsuranceMonth");
    selectInsuranceMonth = selectInsuranceMonth.options[selectInsuranceMonth.selectedIndex].value;
    var insuranceYear = document.getElementById("insuranceYear").value;
    sellInquiriesOtherDetails.InsuranceExpiry = new Date (insuranceYear,selectInsuranceMonth-1, selectInsuranceDay );
    sellCarConditions.InteriorColor = document.getElementById("txtIColor").value;
    var drpAdditionalFuel = document.getElementById("drpAdditionalFuel");
    drpAdditionalFuel = drpAdditionalFuel.options[drpAdditionalFuel.selectedIndex].value;
    sellCarConditions.AdditionalFuel = drpAdditionalFuel;
    sellCarConditions.CityMileage = document.getElementById("txtMileage").value;
    sellCarConditions.Warranties = document.getElementById("txtWarranties").value;
    var keyValuePairs=getValuesFromUrl();
    sellCarConditions.InquiryId = keyValuePairs["id"];
    sellInquiriesOtherDetails.Comments = document.getElementById("txtComments").value;
    clearErrors();
    var selectedMonth = document.getElementById("selectMonth");
    var selectedMonthValue = selectedMonth.options[selectedMonth.selectedIndex].value;
    var yearValue = document.getElementById("makeYear").value;
    customerSellInquiryVehicleData.VersionId = document.getElementById('cmbVersion').value;
    customerSellInquiryVehicleData.MakeYear = new Date(yearValue, selectedMonthValue-1);
    customerSellInquiryVehicleData.Kilometers = document.getElementById('txtKilometers').value;
    customerSellInquiryVehicleData.Price = document.getElementById('txtPrice').value;

    var isValidRequest = true;
    if (document.getElementById('cmbVersion').options[0].selected) {
        document.getElementById('spnVersion').innerHTML = "Select Version";
        isValidRequest = false;
    }
    isValidRequest = isValidText();
    var pattern = /^-?\d*(\.\d+)?$/;
    if (!pattern.test(document.getElementById('txtMileage').value)) {
        document.getElementById('spnMileage').innerHTML = "Numbers Only";
        isValidRequest = false;
    }
    else if (document.getElementById('txtMileage').value > 50) {
        document.getElementById('spnMileage').innerHTML = "Car mileage invalid.";
        isValidRequest = false;
    }

    if ($("#drpOwners").val() < 1) {
        $("#spnOwners").html("Owners Required");
        isValidRequest = false;
    }

    if ($("#drpCarRegistrationType").val() < 1) {
        $("#spnRegistrationType").html("Registration Type Required");
        isValidRequest = false;
    }
    if(checkEmptyValues()
        && isValidRequest
        && isValidKms(customerSellInquiryVehicleData)
        && isValidPrice(customerSellInquiryVehicleData,yearValue,sellInquiriesOtherDetails.Owners))
    {
        //ajax call
        var sellCarDetails = {};
        sellCarDetails.SellCarConditions=sellCarConditions;
        sellCarDetails.SellInquiriesOtherDetails= sellInquiriesOtherDetails;
        sellCarDetails.CustomerSellInquiryVehicleData = customerSellInquiryVehicleData;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/sell-used-car/myaccount/update-sell-car/?authToken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : ""));
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
        );
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState === XMLHttpRequest.DONE) {
                var status = xmlhttp.status;
                if (status === 200) {
                    window.location.href="/sell-used-car/mysellinquiry/confirm-message/?t=d&inquiryId=s" + sellCarConditions.InquiryId;
                } 
                
            }
        }
        xmlhttp.send(JSON.stringify(sellCarDetails));
    }

    
}