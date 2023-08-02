const ctaPropertyId = 7;
let dealerIdClicked;
function openModelPopup(dealerId, makeId) {
    dealerIdClicked = dealerId;
    let url = `/api/dealerModels/?dealerId=${dealerId}&makeId=${makeId}`;
    let make = [{
        "makeId": makeId,
        "makeName": pageMakeName,
        "maskingName": makeMaskingName,
        "hostUrl": "https://imgd.aeplcdn.com/",
        "logoUrl": logoUrl,
        "IsDeleted": false,
        "Used": false,
        "New": false,
        "Indian": false,
        "Imported": false,
        "Futuristic": false,
        "PriorityOrder": 0
    }];

    $.ajax({
        url: url,
        type: "GET",
        headers: { 'ServerDomain': 'CarWale' },
        success: function (data) {
            showModelPopup(make, data.modelDetails);
        },
        error: function (response, status) {
            console.error("Error in fetching modelDetails");
        },
    });
}

function showModelPopup(make, models) {
    renderByMmvData({
        allMakes: make,
        allModels: models,
        handleModelClick: openLeadForm
    });
    document.querySelector(`[data-make-id="${make[0].makeId}"]`)?.click();
    document.getElementById("global-mmv-popup-close-button").onclick = function () {
        closeModelPopup()
    };
    document.getElementById("selected-make").onclick = null;
    displayMmvPopup();
}

function openLeadForm() {
    let modelClicked = event.target;
    let { modelId, modelName, versionId } = modelClicked.dataset;
    let campaignDataElement = document.getElementById(dealerIdClicked);
    campaignDataElement.dataset.modelid = modelId;
    campaignDataElement.dataset.model = modelName;
    closeModelPopup();
    leadFormPopup.click_camp_call(versionId, ctaPropertyId, dealerIdClicked);
}

function closeModelPopup() {
    // add scroll to body
    document.body.style.overflowY = "auto";
    mmvPopupContainer.classList.add("display-none");
    if (typeof blackoutWindow !== 'undefined' && blackoutWindow) {
        blackoutWindow.classList.add("display-none");
    }
    carsContainer.innerHTML = "";
    unselectModel();
}
