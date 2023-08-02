/* global $ */

const fuelSelection = (function () {
    let SELECTORS = {
        FUEL_SELECTION: "#fuelSelection",
        FUEL_SELECTION_PILL: ".js-fuel-selection-pill"
    };
    let FUEL_TYPES = {
        PETROL: "petrol",
        DIESEL: "diesel",
        OTHERS: "others"
    }
    let FUEL_PILL_CLASSES = {
        INACTIVE: "selection-pill--inactive",
        ACTIVE: "selection-pill--active"
    };
    function handleFuelSelectionPillClick({ event }) {
        if (!event || !event.target) {
            return;
        }
        let currentPill = $(event.target);
        let fuelSelection = $(SELECTORS.FUEL_SELECTION);
        let selectedFuelType = currentPill.attr("data-fuel-type");
        let fuelType = getSelectedFuelType();
        if (fuelType !== selectedFuelType) {
            $(SELECTORS.FUEL_SELECTION_PILL).addClass(FUEL_PILL_CLASSES.INACTIVE);
            $(SELECTORS.FUEL_SELECTION_PILL).removeClass(FUEL_PILL_CLASSES.ACTIVE);
            currentPill.addClass(FUEL_PILL_CLASSES.ACTIVE);
            currentPill.removeClass(FUEL_PILL_CLASSES.INACTIVE);
            fuelSelection.attr("data-fuel-type", selectedFuelType)
        }
        else {
            currentPill.removeClass(FUEL_PILL_CLASSES.ACTIVE);
            currentPill.addClass(FUEL_PILL_CLASSES.INACTIVE);
            fuelSelection.attr("data-fuel-type", "")
        }
    }

    function getSelectedFuelType() {
        return $(SELECTORS.FUEL_SELECTION).attr("data-fuel-type");
    }

    function resetFuelType() {
        $(SELECTORS.FUEL_SELECTION_PILL).removeClass(FUEL_PILL_CLASSES.ACTIVE);
        $(SELECTORS.FUEL_SELECTION_PILL).addClass(FUEL_PILL_CLASSES.INACTIVE);
        $(SELECTORS.FUEL_SELECTION).attr("data-fuel-type", "")
    }

    function fuelTypeFilterCheck(version, fuelType) {
        switch (fuelType) {
            case FUEL_TYPES.OTHERS:
                return (
                    (!!version.FuelType &&
                        version.FuelType.toLowerCase() !== FUEL_TYPES.PETROL
                        && version.FuelType.toLowerCase() !== FUEL_TYPES.DIESEL)
                    || !version.FuelType);
            case FUEL_TYPES.PETROL:
            case FUEL_TYPES.DIESEL:
                return !!version.FuelType && version.FuelType.toLowerCase() === fuelType;
            default:
                return false;

        }
    }

    function getVersionListByFuelType(versionList) {
        if (!Array.isArray(versionList)) {
            return [];
        }
        let fuelType = getSelectedFuelType();
        let activeVersionList = versionList;
        if (!!fuelType) {
            activeVersionList = versionList.filter(v => !!v && fuelTypeFilterCheck(v, fuelType));
        }
        return activeVersionList;
    }
    return {
        handleFuelSelectionPillClick,
        getVersionListByFuelType,
        resetFuelType,
    }
})();
