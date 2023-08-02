function toggleEmiCalculator() {
	const emiToggleBtn = document.querySelector(".js-emi-toggle-btn");
	const emiToggleBtnText = document.querySelector("#emi-toggle-btn-text");
	const emiCalcContainer = document.querySelector(".js-emi-calc-container");
	const collapsedClass = "collapsed";

	if (emiToggleBtn && emiCalcContainer) {
		if (emiToggleBtn.classList.contains(collapsedClass)) {
			// Expand emi calc
			emiCalcContainer.classList.remove(collapsedClass);
			emiToggleBtn.classList.remove(collapsedClass);
			emiToggleBtnText.innerHTML = "Collapse EMI Calculator";
		} else {
			// Collapse emi calc
			emiCalcContainer.classList.add(collapsedClass);
			emiToggleBtn.classList.add(collapsedClass);
			emiToggleBtnText.innerHTML = "Expand EMI Calculator";
		}
	}
}

function updateLoanTenureType(tenureType) {
	const tenureBtns = document.querySelectorAll(".js-loantenure-btn");
	const tenureBtnClass = "js-loantenure-" + tenureType;
	if (!tenureBtns) {
		return;
	}

	// update btn
	tenureBtns.forEach(btn => {
		if (btn.classList.contains(tenureBtnClass)) {
			btn.classList.add("active");
		} else {
			btn.classList.remove("active");
		}
	});

	const tenureTypeHeading = document.querySelector(".current-loantenure-type");
	const tenureValueText = document.querySelector(".js-loantenure-value");
	const tenureRange = document.querySelector(".js-loantenture-range");
	if (tenureTypeHeading && tenureValueText && tenureRange) {
		if (tenureType === "year") {
			// update heading text
			tenureTypeHeading.textContent = "Years";

			// update value
			const tenureValue = (parseFloat(tenureValueText.value) / 12).toFixed(1);
			tenureValueText.value = tenureValue;
			tenureValueText.min = 3;
			tenureValueText.max = 10;

			// update range attr
			tenureRange.step = 1;
			tenureRange.min = 3;
			tenureRange.max = 10;
			tenureRange.value = tenureValue;
		} else {
			// update heading text
			tenureTypeHeading.textContent = "Months";

			// update value
			const tenureValue = Math.floor(parseFloat(tenureValueText.value) * 12);
			tenureValueText.value = tenureValue;
			tenureValueText.min = 36;
			tenureValueText.max = 120;

			// update range attr
			tenureRange.step = 6;
			tenureRange.min = 36;
			tenureRange.max = 120;
			tenureRange.value = tenureValue;
		}

		updateEmiRange("loantenture");
	}
}

function updateEmiRange(type) {
	const targetClass = `.${type}_range`;
	const target = document.querySelector(targetClass);
	if (!target) {
		return;
	}
	const min = target.min;
	const max = target.max;
	const val = target.value;
	target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
	if (type === "loantenture") {
		const isMonthsSet = document.querySelector(".js-loantenure-month").classList.contains("active");
		const tenureValue = parseFloat(document.querySelector(".js-loantenure-value").value);
		const years = isMonthsSet ? (tenureValue / 12).toFixed(1) : tenureValue;
		document.querySelector(".loan-tenure-text").textContent = years;
	}
	updateEmi();
}

function commaSeperatedPrice(inputPrice) {
	if (!inputPrice) {
		return 0;
	}
	inputPrice = inputPrice.toString();
	let formattedPrice = "";
	let breakPoint = 3;
	for (let i = inputPrice.length - 1; i >= 0; i--) {
		formattedPrice = inputPrice[i] + formattedPrice;
		if ((inputPrice.length - i) == breakPoint && inputPrice.length > breakPoint) {
			formattedPrice = "," + formattedPrice;
			breakPoint = breakPoint + 2;
		}
	}
	return formattedPrice;
}

function getEmiValue(loanAmount, rateOfInterest, months) {
	const num = loanAmount * (rateOfInterest / 100) * Math.pow(1 + (rateOfInterest / 100), months);
	const den = Math.pow(1 + (rateOfInterest / 100), months) - 1;
	const emi = num / den;
	return emi;
}

function updateEmi() {
	const downPayment = parseInt(document.querySelector(".js-downpayment-value").value);
	const onRoadPrice = parseInt(document.querySelector(".js-downpayment-value").dataset.onroad);
	const isMonthsSet = document.querySelector(".js-loantenure-month").classList.contains("active");
	const tenureValue = parseInt(document.querySelector(".js-loantenture-range").value);
	const rateOfInterest = parseFloat(document.querySelector(".js-interestrate-range").value) / 12;
	const months = isMonthsSet ? tenureValue : tenureValue * 12;
	const cityId = GetCookieByName("cookie_cw_cityid");
	let loanAmount = 0;
	if (cityId > 0 || onRoadPrice > 0) {
		loanAmount = onRoadPrice - downPayment;
	}
	else {
		loanAmount = parseInt(document.getElementById("version-exshowroom-price").dataset.price) - downPayment;
	}
	const emi = getEmiValue(loanAmount, rateOfInterest, months);
	document.querySelectorAll(".emi-value").forEach(e =>
        e.textContent = commaSeperatedPrice(Math.round(emi))
    );

	if(typeof modelEmi != "undefined") {
		modelEmi.updateEmiVersionTable({
			selectedDownPayment: downPayment,
			interestRate: document.querySelector(".js-interestrate-range").value,
			tenureInMonths : months
		});
		modelEmi.updateRepaymentScheduleTable({
			rateOfInterest,
			emi,
			loanAmount,
			months,
		});
        typeof updateEmiGraph === 'function' && updateEmiGraph(emi, onRoadPrice - downPayment);
	}
}
