const priceBlock = (() => {
    const PropertyId = {
        Get_Emi_Offers: 48,
        Get_Best_Price: 66,
        Get_A_Call_From_Dealer: 20
    }

    const pricePagePropertyId = 66;

    // Version id => Key
    // Variant Detailed Price => Value
    let detailedPriceData = "{}";

    function changePriceBlockTab(id) {
        const cityId = GetCookieByName("cookie_cw_cityid");
        if (id === "price-breakup" && !cityId) {
            handleLocationPopup();
            return;
        }

        // Update price block tabs
        const targetPriceBlockTabId = `js-price-block-tab-${id}`;
        const priceBlockTabs = document.querySelectorAll(".js-price-block-tab");
        priceBlockTabs.forEach(tab => {
            if (tab.id === targetPriceBlockTabId) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });

        // update section
        const priceTabContents = document.querySelectorAll(".js-pricetab-content");
        priceTabContents.forEach(tabContent => {
            if (tabContent.id === id) {
                tabContent.classList.remove("display-none");
            } else {
                tabContent.classList.add("display-none");
            }
        });
    }

    function updateDownpaymentRange(mmvstatus, downPayment, onRoadPrice, versionName) {
        if (mmvstatus != 3) {
            document.querySelector("#emi-text-heading").textContent = `${modelName} ${versionName} EMI`;
            const minDownPayment = parseInt(downPayment);
            const onRoadPriceValue = parseInt(onRoadPrice);
            const downPaymentStep = 10000;
            let maxDownPayment = 0;
            const cityId = GetCookieByName("cookie_cw_cityid");
            if (cityId > 0) {
                maxDownPayment = minDownPayment + (downPaymentStep * Math.floor((onRoadPriceValue - minDownPayment) / downPaymentStep));
            }
            else {
                maxDownPayment = minDownPayment + (downPaymentStep * Math.floor((parseInt(document.getElementById("version-exshowroom-price").dataset.price) - minDownPayment) / downPaymentStep));
            }
            const downPaymentInput = document.querySelector(".js-downpayment-value");
            const downPaymentRange = document.querySelector(".js-downpayment-range");

            downPaymentInput.dataset.onroad = onRoadPriceValue;
            downPaymentInput.value = minDownPayment;
            downPaymentRange.value = minDownPayment;
            downPaymentRange.min = minDownPayment;
            downPaymentRange.max = maxDownPayment;
            updateEmiRange('downpayment');
        }
    }

    function updateFormattedPrice(formattedPrice) {
        document.querySelector(".js-version-price").textContent = formattedPrice;
    }

    function updatePriceBreakUp(onroadPrice, exShowroom, registrationCost, insurance, otherCharges) {
        const onroadPriceValue = parseInt(onroadPrice);
        const exShowroomValue = parseInt(exShowroom);
        const rtoValue = parseInt(registrationCost);
        const insuranceValue = parseInt(insurance);
        const otherChargesValue = parseInt(otherCharges);

        document.querySelector("#exshowroom-value").textContent = commaSeperatedPrice(exShowroomValue);
        document.querySelector("#onroad-value").textContent = commaSeperatedPrice(onroadPriceValue);
        document.querySelector("#rto-value").textContent = commaSeperatedPrice(rtoValue);
        document.querySelector("#insurance-value").textContent = commaSeperatedPrice(insuranceValue);
        document.querySelector("#othercharges-value").textContent = commaSeperatedPrice(otherChargesValue);
    }

    function updateOnclickCampCall(versionId) {
        var dealerCallCta = document.getElementById("price-block-dealer-call-cta");
        if (dealerCallCta) {
            dealerCallCta.onclick = function () {
                leadFormPopup.click_camp_call(versionId, PropertyId.Get_A_Call_From_Dealer);
            };
        }
        var getBestPriceCta = document.getElementById("price-block-getbestprice-cta");
        if (getBestPriceCta) {
            getBestPriceCta.onclick = function () {
                leadFormPopup.click_camp_call(versionId, PropertyId.Get_Best_Price);
            };
        }
        var emiOffersCta = document.getElementById("price-block-emi-offers-cta");
        if (emiOffersCta) {
            emiOffersCta.onclick = function () {
                var campaignElement = document.querySelector(".price-page-campaign-data");
                if (campaignElement) {
                    campaignElement.id = versionId;
                    document.querySelector(".get-best-price-btn").onclick = () => leadFormPopup.click_camp_call(versionId, pricePagePropertyId);
                }
                leadFormPopup.click_camp_call(versionId, PropertyId.Get_Emi_Offers);
            };
        }
    }

    function getVersionDetailedPrice(versionName, versionId, modelId, mmvStatus, formattedPrice, price) {
        let versionExshowroomPrice = document.getElementById("version-exshowroom-price");
        if (versionExshowroomPrice) {
            versionExshowroomPrice.dataset.price = price;
        }

        document.querySelector("#priceblock-version").textContent = versionName;
        updateFormattedPrice(formattedPrice);
        updateOnclickCampCall(versionId);
        let selectedVersions = decodeURIComponent(GetCookieByName("price_block_selected_versions"));
        if (!selectedVersions) {
            // If cookie does not exist
            selectedVersions = "{}";
        }
        const selectedVersionsJson = JSON.parse(selectedVersions);
        // update price block selected version cookie
        const updatedSelectedVersionsJson = { ...selectedVersionsJson };
        updatedSelectedVersionsJson[modelId] = versionId;
        SetCookieInDays("price_block_selected_versions", encodeURIComponent(JSON.stringify(updatedSelectedVersionsJson)), 365);

        const detailedPriceJson = JSON.parse(detailedPriceData);
        if (versionId in detailedPriceJson) {
            // detailed price for version is available
            const versionDetailedPrice = JSON.parse(detailedPriceJson[versionId]);
            updateDownpaymentRange(mmvStatus, versionDetailedPrice["DownPayment"], versionDetailedPrice["OnRoadPrice"], versionName);
            updatePriceBreakUp(versionDetailedPrice["OnRoadPrice"], versionDetailedPrice["ExShowRoomPrice"], versionDetailedPrice["RegistrationCost"], versionDetailedPrice["Insurance"], versionDetailedPrice["OtherCharges"]);
        } else {
            if (cityId > 0 && mmvStatus != MmvStatus.Discontinued) {
                fetch("/api/version/detailedprice/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ServerDomain': 'CarWale'
                    },
                    body: JSON.stringify({
                        modelId: modelId,
                        versionId: versionId,
                        cityId: cityId,
                        mmvStatus: mmvStatus,
                        applicationId: Application.CarTrade,
                    })
                })
                .then((response) => response.json())
                .then((data) => {
                    // Update json data
                    const updatedDetailedPriceData = { ...detailedPriceJson };
                    updatedDetailedPriceData[versionId] = data;
                    detailedPriceData = JSON.stringify(updatedDetailedPriceData);

                    //modify html
                    const versionDetailedPrice = JSON.parse(data);
                    updateDownpaymentRange(mmvStatus, versionDetailedPrice["DownPayment"], versionDetailedPrice["OnRoadPrice"], versionName);
                    updatePriceBreakUp(versionDetailedPrice["OnRoadPrice"], versionDetailedPrice["ExShowRoomPrice"], versionDetailedPrice["RegistrationCost"], versionDetailedPrice["Insurance"], versionDetailedPrice["OtherCharges"]);
                })
                .catch(() => {
                    console.error("Error in getting detailed price");
                });
            }
            else {
                updateDownpaymentRange(mmvStatus, 0, 0, versionName);
            }
        }
    }

    function handleLocationPopup() {
        locationPopup.showLocationPopUp(true, false, function () {
            const cityId = GetCookieByName("cookie_cw_cityid");
            if (cityId > 0) {
                const url = window.location.origin + window.location.pathname + "?q=openPriceBlock";
                window.location.href = url;
            }
        });
    }

    return {
        changePriceBlockTab,
        getVersionDetailedPrice
    };
})();

function handleGetVersionDetailedPrice(version) {
    const { versionName, versionId, modelId, status, priceOverview } = version;
    const formattedPrice = priceOverview && priceOverview.formattedPrice ? priceOverview.formattedPrice.replace(/L/g, "l").replace(/C/g, "c") : "N/A";
    const price = priceOverview && priceOverview.price ? priceOverview.price : 0;
    priceBlock.getVersionDetailedPrice(versionName, versionId, modelId, status, formattedPrice, price)
}

document.addEventListener("DOMContentLoaded", function () {
    const params = new URL(window.location).searchParams;
    const q = params.get("q");
    if (!q) {
        return;
    }

    if (q === "openPriceBlock") {
        priceBlock.changePriceBlockTab('price-breakup');
        window.history.replaceState(null, null, `${window.location.origin}${window.location.pathname}`);
        $('html,body').animate({ scrollTop: $("#price-block-container").offset().top - 60 }, "fast");
    }
    else if (q === "openMonthlyEmi") {
        window.history.replaceState(null, null, `${window.location.origin}${window.location.pathname}`);
        $('html,body').animate({ scrollTop: $("#price-block-container").offset().top - 60 }, "fast");
    }
    else if (q === "openEmiCalculator") {
        toggleEmiCalculator();
        window.history.replaceState(null, null, `${window.location.origin}${window.location.pathname}`);
        $('html,body').animate({ scrollTop: $("#price-block-container").offset().top - 60 }, "fast");
    }
    else if (q === "openVersionPopup") {
        let modelJson =
        {
            "modelId": currentModelId,
        };
        openVersionSelectionPopup(modelJson, handleGetVersionDetailedPrice);
        window.history.replaceState(null, null, `${window.location.origin}${window.location.pathname}`);
    }
});
