let editedVersionId = -1;
let shouldAddCar = false;

setTimeout("showMmvPopup(true)", 1000);

function editCar(model, versionCallBack, versionId) {
    shouldAddCar = false;
    editedVersionId = versionId;
    openVersionSelectionPopup(model, versionCallBack);
}

function addCar() {
    shouldAddCar = true;
    showMmvPopupInResetState()
}

function checkIfSameModels(comparingVersions) {
    let firstModelId = comparingVersions[0].modelId;
    return comparingVersions.every(version => version.modelId === firstModelId);
}

function createUrlForSameModelsComparison(comparingVersions) {
    //ascending versionIds
    let redirectUrl = "";

    let orderedVersions = comparingVersions.sort(function (a, b) {
        return parseInt(a.versionId) - parseInt(b.versionId);
    });

    redirectUrl = "/compare-cars/" + orderedVersions[0].makeMaskingName + "-" + orderedVersions[0].modelMaskingName + "-" +
        orderedVersions[0].versionMaskingName + "-vs-" + orderedVersions[1].versionMaskingName;
    let versionIdsString = orderedVersions[0].versionId + "-" + orderedVersions[1].versionId;
    if (orderedVersions.length > 2) {
        redirectUrl += "-vs-" + orderedVersions[2].versionMaskingName;
        versionIdsString += "-" + orderedVersions[2].versionId;
    }
    redirectUrl += "-" + versionIdsString + "/";
    return redirectUrl;
}

function createUrlForComparison(comparingVersions) {
    let redirectUrl = "";
    //descending modelIds
    let orderedModels = comparingVersions.sort(function (a, b) {
        return parseInt(b.modelId) - parseInt(a.modelId);
    });
    redirectUrl = "/compare-cars/" + orderedModels[0].makeMaskingName + "-" + orderedModels[0].modelMaskingName +
        "-vs-" + orderedModels[1].makeMaskingName + "-" + orderedModels[1].modelMaskingName;
    let versionIdsString = "?c1=" + orderedModels[0].versionId + "&c2=" + orderedModels[1].versionId;
    if (orderedModels.length > 2) {
        redirectUrl += "-vs-" + orderedModels[2].makeMaskingName + "-" + orderedModels[2].modelMaskingName;
        versionIdsString += "&c3=" + orderedModels[2].versionId;
    }
    redirectUrl += "/" + versionIdsString;
    return redirectUrl;
}

function redirectToCompareDetailsPage(version) {
    let originalComparingVersions = [...comparingVersions];
    if (!shouldAddCar) {
        let index = comparingVersions.findIndex(version => version.versionId === editedVersionId);
        if (index >= 0) {
            comparingVersions.splice(index, 1);
        }
    }
    comparingVersions.push(version);

    let redirectUrl = "";
    let isSameModels = checkIfSameModels(comparingVersions);

    if (isSameModels) {
        redirectUrl = createUrlForSameModelsComparison(comparingVersions);

    }
    else {
        redirectUrl = createUrlForComparison(comparingVersions);

    }
    comparingVersions = originalComparingVersions;
    location.href = redirectUrl;
}
