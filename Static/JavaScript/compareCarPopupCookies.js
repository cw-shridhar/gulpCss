// Sets the hidden input attributes and cookies when compare checkbox is clicked
function setCarAttributes(vall, makeMaskingName, modelMaskingName, versionMaskingName, imageUrl, priceText) {
    var fcar = document.getElementById("car1").value;
    var scar = document.getElementById("car2").value;
    var tcar = document.getElementById("car3") ? document.getElementById("car3").value : null;   // present in desktop compare popup

    var index = 0;
  
    if(fcar === vall) {
        index = 1;
    } else if (scar === vall) {
        index = 2;
    } else if (tcar && tcar === vall) {
        index = 3;
    }
  
    if(index === 0) {
      return;
    }
  
    var cardetails = vall.split("||");
    var makeName = cardetails[0];
    var modelName = cardetails[1];
    var variantName = cardetails[2];
    var variantId = cardetails[3];
    document.getElementById("car" + index).value = vall;
    document.getElementById("car" + index + "img").value = imageUrl;
    document.getElementById("version_id" + index).value = variantId;
    document.getElementById("make" + index).value = makeName;
    document.getElementById("make" + index).dataset.mask = makeMaskingName;
    document.getElementById("model" + index).value = modelName;
    document.getElementById("model" + index).dataset.mask = modelMaskingName;
    document.getElementById("variant" + index).value = variantName;
    document.getElementById("variant" + index).dataset.mask = versionMaskingName;

    SetCookieInDays("compcar" + index, vall, 365);
    SetCookieInDays("compcar" + index + "img", imageUrl, 365);
    SetCookieInDays("compcar" + index + "masking", makeMaskingName + "||" + modelMaskingName + "||" + versionMaskingName, 365);
    
    // Present in msite compare popup
    if(document.getElementById("price" + index) && priceText) {
        document.getElementById("price" + index).value = priceText;
        SetCookieInDays("compcar" + index + "price", priceText, 365);
    }

}

function getCheckbox(value)
{
    var allInputs = document.getElementsByTagName("input");
    var result = null;
    for(var x=0;x<allInputs.length;x++) {
        if(allInputs[x].type == "checkbox" && allInputs[x].value == value) {
            result = allInputs[x];
            break;
        }
    }
    return result;
}

function loadComparePopupCookies() {
    var isDesktop = document.getElementById("car3");
    var count = 2;
    if(isDesktop) {
        count = 3;
    }

    for(var i = 1 ; i <= count ; i++) {
        var vall = GetCookieByName("compcar" + i);
        if(!vall) {
            continue;
        }

        var checkbox = getCheckbox(vall);
        if(checkbox) {
            checkbox.checked = true;
        }

        var imgUrl = GetCookieByName("compcar" + i + "img");
        var maskingNames = GetCookieByName("compcar" + i + "masking").split("||");
        var makeMaskingName = maskingNames[0];
        var modelMaskingName = maskingNames[1];
        let versionMaskingName = maskingNames[2];

        if(isDesktop) {
            addtocomparelist3(vall, imgUrl, true);
            setCarAttributes(vall, makeMaskingName, modelMaskingName, versionMaskingName, imgUrl);
        } else {
            var priceText = GetCookieByName("compcar" + i + "price");
            var versionId = vall.split("||")[3];
            versions_addtocomparelist(vall, imgUrl, true, priceText, versionId);
            setCarAttributes(vall, makeMaskingName, modelMaskingName, versionMaskingName, imgUrl, priceText);
            $(".compare_btm_block").addClass("top_cls");
        }
    }
}

loadComparePopupCookies();