const modelEmi = (function () {
    const selectedVersionName = document.getElementById("priceblock-version");
    const selectedVersionOnRoadPrice = document.querySelector(".js-version-onroadprice");
    const downPaymentInput = document.querySelector(".js-downpayment-value");
    const downPaymentRange = document.querySelector(".js-downpayment-range");
    const emiTableRows = document.querySelectorAll(".js-emi-version-table-row");
    const emiTableInterestRate = document.querySelectorAll(".js-emi-version-table-interestRate");
    const emiTableTenure = document.querySelectorAll(".js-emi-version-table-tenure");
    const emiTableDownpayment = document.querySelectorAll(".js-emi-version-table-downpayment");
    const loanRepaymentInterval = 12;
    const scheduleTable = document.querySelector(".js-loan-repayment");
    const rupeeSymbol = "₹";

    // Version id => Key
    // Variant Detailed Price => Value
    let detailedPriceData = "{}";

    getVersionDetailedPrice = (versionName, versionId, modelId, mmvStatus, price) => {

        selectedVersionName.textContent = versionName;

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
            updateDownpaymentRange(versionDetailedPrice["DownPayment"], versionDetailedPrice["OnRoadPrice"]);
            updatePriceBreakUp(versionDetailedPrice["OnRoadPrice"]);
            updateLoanWidgetParameters(versionDetailedPrice);
        }
        else {
            fetch('/api/version/detailedprice/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ServerDomain': 'CarWale'
                },
                body: JSON.stringify({
                    modelId: modelId,
                    versionId: versionId,
                    cityId: cityIdForModelEmiPage,
                    mmvStatus: mmvStatus,
                    applicationId: Application.CarTrade,
                })
            })
                .then((response) => response.json())
                .then(
                    (data) => {
                        // Update json data
                        const updatedDetailedPriceData = { ...detailedPriceJson };
                        updatedDetailedPriceData[versionId] = data;
                        detailedPriceData = JSON.stringify(updatedDetailedPriceData);

                        //modify html
                        const versionDetailedPrice = JSON.parse(data);
                        updateDownpaymentRange(versionDetailedPrice["DownPayment"], versionDetailedPrice["OnRoadPrice"]);
                        updatePriceBreakUp(versionDetailedPrice["OnRoadPrice"]);
                        updateLoanWidgetParameters(versionDetailedPrice);
                    }
                )
                .catch((error) => {
                    console.error('Error in getting version detailed price:', error);
                });
        }
    }

    updateLoanWidgetParameters = (versionDetailedPrice) => {
        const onRoadPrice = parseInt(versionDetailedPrice["OnRoadPrice"], 10);
        const exshowRoomPrice = parseInt(versionDetailedPrice["ExShowRoomPrice"], 10);
        const downPayment = parseInt(versionDetailedPrice["DownPayment"], 10);
        const emi = parseInt(versionDetailedPrice["Emi"], 10);
        
        document.querySelector(".js-onroad-price").textContent = `₹ ${commaSeperatedPrice(onRoadPrice)}`;
        document.querySelector(".js-exshowroom-price").textContent = `₹ ${commaSeperatedPrice(exshowRoomPrice)}`;
        document.querySelector(".js-max-loan-amount").textContent = `₹ ${commaSeperatedPrice(exshowRoomPrice)}`;
        document.querySelector(".js-selected-downpayment-value").textContent = `₹ ${commaSeperatedPrice(downPayment)}`;
        document.querySelector(".js-loan-amount").textContent = `₹ ${commaSeperatedPrice(onRoadPrice - downPayment)}`;        
    }

    updateDownpaymentRange = (downPayment, onRoadPrice) => {
        const minDownPayment = parseInt(downPayment, 10);
        const onRoadPriceValue = parseInt(onRoadPrice, 10);
        const downPaymentStep = 10000;
        let maxDownPayment = minDownPayment + (downPaymentStep * Math.floor((onRoadPriceValue - minDownPayment) / downPaymentStep));

        downPaymentInput.dataset.onroad = onRoadPriceValue;
        downPaymentInput.value = minDownPayment;
        downPaymentRange.value = minDownPayment;
        downPaymentRange.min = minDownPayment;
        downPaymentRange.max = maxDownPayment;
        updateEmiRange('downpayment');
    }

    updatePriceBreakUp = (onroadPrice) => {
        const onroadPriceValue = parseInt(onroadPrice, 10);

        selectedVersionOnRoadPrice.textContent = `₹ ${commaSeperatedPrice(onroadPriceValue)}`;
    }

    getFormattedPrice = price => {
        return `${rupeeSymbol}${commaSeperatedPrice(parseInt(price))}`;
    }

    updateRepaymentScheduleTable = ({rateOfInterest, emi, loanAmount, months}) => {
        if(!scheduleTable) {
            return;
        }

        if (rateOfInterest <= 0 || emi <= 0 || loanAmount <= 0 || months <= 0) {
            document.getElementById("loan-repayment").classList.add("display-none");
        }
        document.querySelectorAll(".value-row").forEach(row => row.remove());
        let remainingLoan = loanAmount;
        let totalInterestPaid = 0;
        let totalPrincipalPaid = 0;
        let rowIdx = 0;
        for (let month = 1; month < months + 1; month++) {
            const interestPaid = rateOfInterest * remainingLoan / 100;
            const principalPaid = emi - interestPaid;
            totalInterestPaid += interestPaid;
            totalPrincipalPaid += principalPaid;
            remainingLoan -= principalPaid;
            if (month % loanRepaymentInterval === 0 || month == months) {
                if (month == months) {
                    remainingLoan = 0;
                }
                const rowElement = document.createElement("tr");
                rowElement.classList.add("value-row", "border-bottom-whisper");
                rowElement.dataset.testingId = `loan-repayment-row-${rowIdx}`;
                rowIdx++;

                const tdClasses = `${isMobile ? "pl-3" : "pr-3"} pt-3 pb-3 border-right color-comet font-13`;
                const monthTd = document.createElement("td");
                monthTd.setAttribute("class", tdClasses);
                monthTd.classList.add("border-left-whisper");
                monthTd.textContent = month;
                rowElement.appendChild(monthTd);

                const principalTd = document.createElement("td");
                principalTd.setAttribute("class", tdClasses);
                principalTd.textContent = getFormattedPrice(totalPrincipalPaid);
                rowElement.appendChild(principalTd);

                const interestTd = document.createElement("td");
                interestTd.setAttribute("class", tdClasses);
                interestTd.textContent = getFormattedPrice(totalInterestPaid);
                rowElement.appendChild(interestTd);

                const remainingLoanTd = document.createElement("td");
                remainingLoanTd.setAttribute("class", tdClasses);
                remainingLoanTd.textContent = getFormattedPrice(remainingLoan);
                rowElement.appendChild(remainingLoanTd);

                scheduleTable.appendChild(rowElement);
                totalInterestPaid = 0;
                totalPrincipalPaid = 0;
            }
        }
        document.getElementById("loan-repayment").classList.remove("display-none");
    }

    updateLoanWidgetParamsOnDownPaymentChange = () => {
        const selectedDownPayment = document.querySelector(".js-selected-downpayment-value");
        const loanAmount = document.querySelector(".js-loan-amount");
        
        const downPaymentInputs = document.querySelectorAll("#downpayment_value, .js-downpayment-range");
        downPaymentInputs.forEach(e => e.addEventListener("input", () => {
            const onRoadPrice = parseInt(downPaymentInput.dataset.onroad, 10);
            const downPayment = parseInt(downPaymentInput.value, 10);
            if(selectedDownPayment){
                selectedDownPayment.textContent = `₹ ${commaSeperatedPrice(downPayment)}`;
            }
            if(loanAmount){
                loanAmount.textContent = `₹ ${commaSeperatedPrice(onRoadPrice - downPayment)}`;
            }
        }));
    }

    updateEmiVersionTableDesc = ({selectedDownPayment, interestRate, tenureInYears}) => {
        emiTableInterestRate.forEach(x => {
            x.textContent = interestRate;
        });

        emiTableTenure.forEach(x => {
            x.textContent = tenureInYears;
        });

        emiTableDownpayment.forEach(x => {
            x.textContent = commaSeperatedPrice(selectedDownPayment);
        });
    }

    updateEmiVersionTable = ({selectedDownPayment, interestRate, tenureInMonths}) => {
        if(emiTableRows.length === 0) {
            return;
        }

        updateEmiVersionTableDesc({
            selectedDownPayment,
            interestRate,
            tenureInYears : tenureInMonths / 12
        })

        emiTableRows.forEach(row => {
            const onroadValue = row.querySelector(".js-emi-version-table-row-price").dataset.value;
            const downpayment = row.querySelector(".js-emi-version-table-row-downpayment");
            const downpaymentValue = downpayment.dataset.value;
            const emi = row.querySelector(".js-emi-version-table-row-emi");

            const loan = onroadValue - Math.max(selectedDownPayment, downpaymentValue);
            const emiValue = getEmiValue(loan, parseFloat(interestRate) / 12, tenureInMonths);

            downpayment.textContent = `${rupeeSymbol}${commaSeperatedPrice(Math.max(selectedDownPayment, downpaymentValue))}`;
            emi.textContent = `${rupeeSymbol}${commaSeperatedPrice(Math.round(emiValue))}`;
        });
    }

    updateLoanWidgetParamsOnDownPaymentChange();
    return {
        getVersionDetailedPrice,
        updateEmiVersionTable,
        updateRepaymentScheduleTable: debounce(updateRepaymentScheduleTable),
    }
})();


function handleGetVersionDetailedPrice(version) {
    const { versionName, versionId, modelId, status, priceOverview, modelName } = version;
    const price = priceOverview && priceOverview.price ? priceOverview.price : 0;
    document.querySelector(".js-emi-widget-heading").innerHTML = ` ${modelName} ${versionName} EMI`;
    document.querySelector(".js-selected-version-name").innerHTML = versionName;
    modelEmi.getVersionDetailedPrice(versionName, versionId, modelId, status, price)
}
