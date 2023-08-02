const specsData = JSON.parse(document.getElementById("mileage_data").innerHTML);
const fuelTypeItemId = 26;
const mileageItemId = 12;
const transmissionItemId = 29;
const displacementItemId = 14;
const maxCards = 8;
document.getElementsByClassName("fuel_type_filter")[0]?.click();

function applyFilter() {
  const fuelType = this.innerHTML;
  document.getElementById("fuel-type-selected").innerHTML = fuelType;
  const tabs = document.getElementsByClassName("fuel_type_filter");
  const topModelId = this.id;
  if (!isMobile) {
    const carousel = document.getElementsByClassName("jcarousel-wrapper");
    for (let i = 0; i < carousel.length; i++) {
      carousel[i].style.display = "none";
    }
    document.getElementById(fuelType + "_carousel").style.display = "block";
  }
  getTopModelAtFront(topModelId, fuelType);
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }
  this.classList.add("active");
  let count = 0;
  document
    .querySelectorAll(".similar_model_card_list .mileage_value")
    .forEach(e => {
      if (count === maxCards && isMobile) {
        e.parentElement.parentElement.parentElement.style.display = "none";
        return;
      }
      let minMileage = Number.MAX_VALUE;
      let maxMileage = Number.MIN_VALUE;
      let transmissionList = new Set();
      let displacementList = new Set();
      const modelSpecs = specsData[e.id];
      for (const versionId in modelSpecs) {
        if (
          modelSpecs[versionId].some(
            spec => spec.ItemId === fuelTypeItemId && spec.Value === fuelType
          )
        ) {
          let mileageValue = modelSpecs[versionId].find(
            spec => spec.ItemId === mileageItemId
          )?.Value;
          if (mileageValue) {
            mileageValue = parseFloat(mileageValue);
            minMileage = Math.min(minMileage, mileageValue);
            maxMileage = Math.max(maxMileage, mileageValue);
          }
          let transmissionValue = modelSpecs[versionId].find(
            spec => spec.ItemId == transmissionItemId
          )?.Value;
          if (transmissionValue) {
            transmissionList.add(transmissionValue);
          }
          let displacementData = modelSpecs[versionId].find(
            spec => spec.ItemId == displacementItemId
          );
          if (displacementData?.Value) {
            displacementList.add(displacementData.Value + " " + displacementData.UnitType);
          }
        }
      }
      if (minMileage !== Number.MAX_VALUE) {
        e.parentElement.parentElement.parentElement.style.display = "block";
        ++count;
        e.innerHTML =
          minMileage < maxMileage
            ? minMileage + " - " + maxMileage + " kmpl"
            : minMileage + " kmpl";
      } else {
        e.parentElement.parentElement.parentElement.style.display = "none";
      }
      e.parentElement.parentElement.querySelector('.specs_text').innerHTML = setSpecString(fuelType, transmissionList, displacementList);
    });
  updateAverageMileage(fuelType);
}

function updateAverageMileage(fuelType) {
  let totalMileage = 0;
  let mileageCount = 0;
  for (const modelId in specsData) {
    for (const versionId in specsData[modelId]) {
      if (
        specsData[modelId][versionId].some(
          spec => spec.ItemId === fuelTypeItemId && spec.Value === fuelType
        )
      ) {
        let mileageValue = specsData[modelId][versionId].find(
          spec => spec.ItemId == mileageItemId
        )?.Value;
        if (mileageValue && !isNaN(parseFloat(mileageValue))) {
          totalMileage += parseFloat(mileageValue);
          ++mileageCount;
        }
      }
    }
  }
  const averageMileage =
    mileageCount !== 0
      ? (totalMileage / mileageCount).toFixed(2) + " kmpl"
      : "NA";
  document.querySelector(
    ".average_mileage_container .average_mileage > span"
  ).innerHTML = averageMileage;
}

function getTopModelAtFront(topModelId, fuelType) {
  const firstCard = document.querySelectorAll(".similar_model_card_list > .car_card")[0];
  firstCard.classList.remove("ml-4");
  let parentElement = "";
  let topElement = "";
  if (!isMobile) {
    parentElement = document.getElementsByClassName(fuelType + "_model_list")[0];
    topElement = document.getElementById(fuelType + "_model_" + topModelId);
  }
  else {
    parentElement = document.getElementsByClassName("similar_model_card_list")[0];
    topElement = document.getElementById("model_" + topModelId);
  }
  $(".highest_mileage_label").remove();
  let spanLabel = document.createElement("span");
  spanLabel.setAttribute("class", "highest_mileage_label");
  spanLabel.innerHTML = "HIGHEST MILEAGE CAR";
  topElement.prepend(spanLabel);
  topElement.remove();
  parentElement.prepend(topElement);
  document.querySelectorAll(".similar_model_card_list > .car_card")[0].classList.add("ml-4");
}

function setSpecString(fuelType, transmissionList, displacementList) {
  let specString = fuelType;
  if (displacementList.size > 0) {
    specString += " | " + [...displacementList].join(", ");
  }
  if (transmissionList.size > 0) {
    specString += " | " + [...transmissionList].join(", ");
  }
  return specString;
}