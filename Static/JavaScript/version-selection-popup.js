const versionSelectionPopup = document.querySelector(".js-version-selection-popup");
const versionsList = document.querySelector(".js-version-selection-car-list.version-list");
const filterTabsList = document.querySelector(".js-version-selection-filter-tabs");
const versionSearchInput = document.querySelector(".js-version-selection-search");
const versionSelectionNoContent = document.querySelector(".js-version-selection-no-content");
const makeLabel = document.querySelector(".js-version-popup-makename");
const modelLabel = document.querySelector(".js-version-popup-modelname");
const requiredSpecsList = [Items.FuelType, Items.TransmissionType, Items.MileageARAI, Items.Displacement, Items.SeatingCapacity];
const versionsSpecList = [Items.FuelType, Items.TransmissionType, Items.MileageARAI, Items.Displacement];
const queryString = requiredSpecsList.join(",");
let availableVersions = [];
let previousModelId = 0;
let isBlackoutWindowPresent = typeof blackoutWindow !== 'undefined' && blackoutWindow;

/**
 * @param {Object} model
 * @param {Function} versionOnClickCallBack - Used when populating version list
 */
function openVersionSelectionPopup(model, versionOnClickCallBack) {
	if (isBlackoutWindowPresent) {
		blackoutWindow.classList.remove("display-none");
	}
	versionSelectionPopup.classList.remove("display-none");
	typeof showLoadingScreen !== 'undefined' && showLoadingScreen();

	// remove scroll from body
	document.body.style.overflowY = "hidden";

	const cityId = GetCookieByName("cookie_cw_cityid") || 0;

	if (typeof selectedMakeId !== 'undefined' && model.makeId) {
		selectedMakeId = model.makeId;
	}
	const modelId = model.modelId;
	populateMakeModelLabels(model.makeName, model.modelName);
	// To prevent multiple network calls
	if (modelId !== previousModelId) {
		versionsList.innerHTML = "";
		previousModelId = modelId;
		fetch(
			`/api/v3/versions/?modelId=${modelId}&itemIds=${queryString}&cityId=${cityId}&application=3`,
			{ headers: { 'ServerDomain': 'CarWale' } }
		)
			.then(res => res.json())
			.then(data => {
				if (typeof versionsIdToRemoveFromPopup !== 'undefined') {
					for (let i = 0; i < versionsIdToRemoveFromPopup.length; i++) {
						let index = data.variants.findIndex(version => version.versionId === versionsIdToRemoveFromPopup[i]);
						if (index >= 0) {
							data.variants.splice(index, 1)
						}
					}
				}
				const versions = filterVersionsBasedOnStatus(data.variants);
				const specsMapList = getListOfSpecsMap(versions);
				populateVersionSelectionFilterTabs(specsMapList);
				populateVersionsList(versions, specsMapList, versionOnClickCallBack);
				typeof hideLoadingScreen !== 'undefined' && hideLoadingScreen();
			})
			.catch(err => {
				console.error("Error occured", err);
			});
	} else {
		typeof hideLoadingScreen !== 'undefined' && hideLoadingScreen();
	}
}

function populateMakeModelLabels(makeName, modelName) {
	if (makeName) {
		makeLabel.innerHTML = makeName;
		makeLabel.parentNode.classList.remove("visibility-hidden");
	}
	if (modelName) {
		modelLabel.innerHTML = modelName;
		modelLabel.parentNode.classList.remove("visibility-hidden");
	}
}

function closeVersionSelectionPopup() {
	// add scroll to body
	document.body.style.overflowY = "auto";
	versionSelectionPopup.classList.add("display-none");
	typeof closeMmvPopup !== 'undefined' && closeMmvPopup();
	if (isBlackoutWindowPresent) {
		blackoutWindow.classList.add("display-none");
	}
}

/**
 * @param {Array} versions
 * @returns {Array} Returns live versions (if any are present). Otherwise returns discontinued versions
 */
function filterVersionsBasedOnStatus(versions) {
	if (!versions || versions.length === 0) {
		return [];
	}
	const discontinuedVersions = [];
	const liveVersions = [];
	for (let i = 0; i < versions.length; i++) {
		if (versions[i].status === MmvStatus.New) {
			liveVersions.push(versions[i]);
		}

		if (versions[i].status === MmvStatus.Discontinued) {
			discontinuedVersions.push(versions[i]);
		}
	}

	if (liveVersions.length > 0) {
		return liveVersions;
	}

	if (discontinuedVersions.length > 0) {
		return discontinuedVersions;
	}

	return versions;
}

/**
 * @param {Array} specs
 * @returns {Map} - Itemid mapped to spec
 */
function createSpecMap(specs) {
	const specsMap = {};
	specs.forEach(spec => {
		specsMap[spec.itemId] = spec;
	});
	return specsMap;
}

/**
 * @param {Array} versions
 * @returns {Array} - Array containing map of specs of each version
 */
function getListOfSpecsMap(versions) {
	const specsMapList = [];
	versions.forEach(version => {
		specsMapList.push(createSpecMap(version.specsSummary));
	});
	return specsMapList;
}

/**
 * @param {String} textContent
 * @param {String} type - fuel/transmission/seats
 * @returns {HTMLLIElement}
 */
function getFilterTab(textContent, type) {
	const filterTab = document.createElement("li");
	filterTab.classList.add("version-selection-filter-tab");
	filterTab.textContent = textContent;
	filterTab.dataset.value = textContent.replace(/[\s()]/g, "_");
	filterTab.dataset.type = type;
	filterTab.addEventListener("click", () => {
		filterTab.classList.toggle("active");
		filterVersions();
	}, false);
	return filterTab;
}

/**
 * @param {Array} specsMapList - Array containing map of specs of each version
 */
function populateVersionSelectionFilterTabs(specsMapList) {
	const fuelTypes = new Set();
	const transmissionTypes = new Set();
	const seatingCapacityTypes = new Set();

	specsMapList.forEach(map => {
		const fuelSpec = map[Items.FuelType];
		const transmissionSpec = map[Items.TransmissionType];
		const seatingCapacitySpec = map[Items.SeatingCapacity];

		if (fuelSpec && fuelSpec.value) {
			fuelTypes.add(fuelSpec.value);
		}

		if (transmissionSpec && transmissionSpec.value) {
			transmissionTypes.add(transmissionSpec.value);
		}

		if (seatingCapacitySpec && seatingCapacitySpec.value) {
			seatingCapacityTypes.add(seatingCapacitySpec.value);
		}
	});

	// Reset filer tabs list
	filterTabsList.innerHTML = "";

	// Add filter tabs
	fuelTypes.forEach(fuel => {
		const filterTab = getFilterTab(fuel, "fuel");
		filterTabsList.appendChild(filterTab);
	});

	if (transmissionTypes.size > 0 && filterTabsList.innerHTML) {
		filterTabsList.lastElementChild.classList.add("tab-divider");
	}
	transmissionTypes.forEach(transmission => {
		const filterTab = getFilterTab(transmission, "transmission");
		filterTabsList.appendChild(filterTab);
	});

	if (seatingCapacityTypes.size > 0 && filterTabsList.innerHTML) {
		filterTabsList.lastElementChild.classList.add("tab-divider");
	}
	seatingCapacityTypes.forEach(seatingCapacity => {
		const filterTab = getFilterTab(seatingCapacity + " Seater", "seats");
		filterTabsList.appendChild(filterTab);
	});
}

/**
 * @param {Array} specs - Specs of version
 * @returns Comma separated specs of a version
 */
function getVersionSpecsString(specs) {
	const versionSpecs = [];
	specs.forEach(spec => {
		if (versionsSpecList.includes(spec.itemId) && spec.value) {
			versionSpecs.push(`${spec.value}${spec.unitType}`);
		}
	});
	return versionSpecs.join(", ");
}

/**
 * @param {string} className
 * @param {string} textContent
 * @returns {HTMLParagraphElement}
 */
function getVersionListItemContent(className, textContent) {
	const content = document.createElement("p");
	content.classList.add(className);
	content.textContent = textContent;
	return content;
}

/**
 * @param {Array} versions
 * @param {Array} specsMapList - Array containing map of specs of each version
 * @param {Function} versionOnClickCallBack
 */
function populateVersionsList(versions, specsMapList, versionOnClickCallBack) {
	// remove existing li
	versionsList.innerHTML = "";

	// reset available versions
	availableVersions = [];

	for (let i = 0; i < versions.length; i++) {
		const version = versions[i];
		const li = document.createElement("li");
		li.classList.add("version-selection-car-list-item");

		const carName = getVersionListItemContent("car-name", version.versionName);
		li.appendChild(carName);

		const carPriceText = version.priceOverview && version.priceOverview.formattedPrice ? version.priceOverview.formattedPrice : "N/A";
		const carPrice = getVersionListItemContent("car-price", carPriceText);
		li.appendChild(carPrice);

		const carSpecs = getVersionListItemContent("car-specs", getVersionSpecsString(version.specsSummary));
		li.appendChild(carSpecs);

		li.dataset.testingId = `mmv-version-${i}`;

		const fuel = specsMapList[i][Items.FuelType];
		if (fuel.value) {
			const fuelValue = fuel.value.replace(/[\s()]/g, "_");
			li.classList.add(fuelValue);
		}

		const transmission = specsMapList[i][Items.TransmissionType];
		if (transmission.value) {
			const transmissionValue = transmission.value.replace(/[\s()]/g, "_");
			li.classList.add(transmissionValue);
		}

		const seatingCapacity = specsMapList[i][Items.SeatingCapacity];
		if (seatingCapacity.value) {
			const seatingCapacityValue = seatingCapacity.value.replace(/[\s()]/g, "_");
			li.classList.add(seatingCapacityValue + "_Seater");
		}

		if (versionOnClickCallBack) {
			li.addEventListener("click", () => {
				versionOnClickCallBack(version);
				closeVersionSelectionPopup();
			}, false);
		}

		versionsList.appendChild(li);
		availableVersions.push(li);
	}
}

/**
 * Checks if any of the active filter is present in the class list
 * @param {Array} activeFilters
 * @param {Array} versionClassList
 * @returns {boolean}
 */
function hasActiveFilter(activeFilters, versionClassList) {
	for (let i = 0; i < activeFilters.length; i++) {
		if (versionClassList.contains(activeFilters[i])) {
			return true;
		}
	}

	return false;
}

function getVersionsByFilter(activeFilters, versions) {
	if (activeFilters.length === 0) {
		return versions;
	}

	const activeVersions = [];
	for (let i = 0; i < versions.length; i++) {
		if (hasActiveFilter(activeFilters, versions[i].classList)) {
			activeVersions.push(versions[i]);
		}
	}

	return activeVersions;
}

/**
 * Filters and updates the available aversion list based on the active filter tabs
 */
function filterVersions() {
	const versions = document.querySelectorAll(".version-selection-car-list-item");
	const activeFiltersTabs = document.querySelectorAll(".version-selection-filter-tab.active");
	const activeFuelFilters = [];
	const activeTransmissionFilters = [];
	const activeSeatsFilters = [];

	// Reset available versions
	availableVersions = [];

	activeFiltersTabs.forEach(tab => {
		const { value, type } = tab.dataset;
		if (type === "fuel") {
			activeFuelFilters.push(value);
		}
		if (type === "transmission") {
			activeTransmissionFilters.push(value);
		}
		if (type === "seats") {
			activeSeatsFilters.push(value);
		}
	});

	versions.forEach(version => {
		version.classList.add("display-none");
	});

	// Set available versions based on active filters
	availableVersions = getVersionsByFilter(activeFuelFilters, versions);
	availableVersions = getVersionsByFilter(activeTransmissionFilters, availableVersions);
	availableVersions = getVersionsByFilter(activeSeatsFilters, availableVersions);

	searchVersion();
}

/**
 * Filters the available version list based on the search input
 */
function searchVersion() {
	const searchText = versionSearchInput.value.toLowerCase();
	const pattern = new RegExp(searchText);
	let isVersionAvailable = false;
	// show version list
	versionSelectionNoContent.classList.add("display-none");

	// remove no content text
	versionsList.classList.remove("display-none");

	availableVersions.forEach(version => {
		const carName = version.childNodes[0].textContent.toLowerCase();
		if (pattern.test(carName)) {
			version.classList.remove("display-none");
			isVersionAvailable = true;
		} else {
			version.classList.add("display-none");
		}
	});

	if (!isVersionAvailable) {
		// hide version list
		versionsList.classList.add("display-none");

		// show no content
		versionSelectionNoContent.classList.remove("display-none");
	}
}
