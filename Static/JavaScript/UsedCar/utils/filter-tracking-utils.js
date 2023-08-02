/*global analytics, $, FILTER_KEYS */
function fireFilterSelectionTracking({action, label})
{
    if(!action)
    {
        return;
    }
    analytics.trackAction(
        "CTInteractive",
        "UCP|Filter",
        action,
        label
    );
}

function getAllCheckedMakeValues(makeModelQueryValue)
{
    let makeIds = []
    if(!makeModelQueryValue)
    {
        return makeIds;
    }
    makeModelQueryValue.split(" ").forEach(function(m)
    {
        makeIds.push(m.split(".")[0]);
    });
    let makeNameMapping = {}
    makeIds.forEach(function(m)
    {
        makeNameMapping[($(`.js-make-collapsible[id='${m}'`).attr("data-make-name"))] = true;
    });
    return Object.keys(makeNameMapping).filter(m => makeNameMapping[m]);
}

function getAllCheckedTransmissionValues()
{
    let checkedTransmission = $('input[name="gearbox[]"]:checked');
    let transmissionNames = [];
    if(!checkedTransmission)
    {
        return transmissionNames;
    }
    checkedTransmission.each(function () {
        transmissionNames.push($(this).val());
    });
    return transmissionNames;
}

function getAllCheckedVerifiedValues()
{
    let checkedVerified = $("input[name='certification']:checked");
    let checkedAdditionalFilters = $("input[name='additional-tags']:checked");
    let verifiedNames = [];
    if(!checkedVerified || !checkedAdditionalFilters)
    {
        return verifiedNames;
    }
    checkedVerified.each(function () {
        verifiedNames.push($(this).attr("data-name"));
    });
    checkedAdditionalFilters.each(function(){
        verifiedNames.push($(this).attr("data-name"));
    })
    return verifiedNames;
}

function getAllCheckedColorValues()
{
    let checkedColorElements = $("input[name='filter-colors']:checked");
    let selectedColorsList = [];
    if(!checkedColorElements)
    {
        return selectedColorsList;
    }
    checkedColorElements.each(function () {
        selectedColorsList.push($(this).attr("data-name"));
    });
    return selectedColorsList;

}

function getAllCheckedBodytypeValues()
{
    let checkedBodytypes = $('input[name="bodytype[]"]:checked');
    let bodytypeNames = [];
    if(!checkedBodytype)
    {
        return bodytypeNames;
    }
    checkedBodytypes.each(function () {
        bodytypeNames.push($(this).attr("data-name"));
    });
    return bodytypeNames;
}

function getActionAndLabelForFilters(key, value)
{
    if(!key || !value)
    {
        return {};
    }
    switch(key)
    {
        case "budget":
            return { action: "Budget", label: value.replace("-", "|")};
        case "kms":
            return { action: "KMs", label: value.replace("-", "|") };
        case "car":
            return { action: "Make", label: getAllCheckedMakeValues(value).join("|")};
        case "trans":
            return { action: "Transmission", label: getAllCheckedTransmissionValues().join("|")};
        case "age":
            return { action: "Age", label: value.replace("-", "|")};
        case "owners":
            return { action: "Owners", label: value.replace(" ", "|") };
        case "bodytype":
            return { action: "BodyType", label: getAllCheckedBodytypeValues().join("|") };
        case "filterbyadditional":
            return { action: "Verified", label: getAllCheckedVerifiedValues().join("|") }
        case "color":
            return { action: "Color", label: getAllCheckedColorValues().join("|") }
        case "city":
            let currentSelectedCity = $('input[type=radio][name=city][id=' + value + ']');
            let currentSelectedCityName = currentSelectedCity ? currentSelectedCity.val() : "";
            if (!previousSelectedCityName || !currentSelectedCityName) {
                return { action: "", label: "" };
            }
            return { action: "CityChanged", label: previousSelectedCityName + "|" + currentSelectedCityName };
        default:
            return { action: "", label: ""};
    }
}

function fireTrackingForAppliedFilters(queryObject)
{
    if(!queryObject)
    {
        return;
    }
    Object.keys(queryObject).forEach(key => {
        if (key === "additionaltags") {
          if (queryObject["filterbyadditional"] != null) {
            return;
          }
          key = "filterbyadditional";
        }
        let trackingData = getActionAndLabelForFilters(key, queryObject[key]);
        let { action, label } = trackingData ? trackingData : {};
        if (key && action && label) {
            if(FILTER_KEYS.includes(key)) {
                fireFilterSelectionTracking({ action, label });
            }
        }
    });
}
