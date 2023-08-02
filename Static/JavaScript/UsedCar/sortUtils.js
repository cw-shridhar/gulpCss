var sortUtils = (function () {
    const SORT_CRITERIA = {
        DEFAULT: -1,
        YEAR: 0,
        PRICE: 2,
        KMS: 3,
    }

    const SORT_ORDER = {
        DEFAULT: -1,
        ASCENDING: 0,
        DESCENDING: 1,
    }

    const DEFAULT_SORT_CHECKED_VALUE = "best";

    let radioInputValueToSortValueMapping = {
        default: {
            sc: SORT_CRITERIA.DEFAULT,
            so: SORT_ORDER.DEFAULT
        },
        price1: {
            sc: SORT_CRITERIA.PRICE,
            so: SORT_ORDER.ASCENDING
        },
        price2: {
            sc: SORT_CRITERIA.PRICE,
            so: SORT_ORDER.DESCENDING
        },
        kms1: {
            sc: SORT_CRITERIA.KMS,
            so: SORT_ORDER.ASCENDING
        },
        kms2: {
            sc: SORT_CRITERIA.KMS,
            so: SORT_ORDER.DESCENDING
        },
        year: {
            sc: SORT_CRITERIA.YEAR,
            so: SORT_ORDER.DESCENDING
        }
    }

    return {
        radioInputValueToSortValueMapping,
        getSortValue: function (sortInputValue) {
            if (!sortInputValue || !radioInputValueToSortValueMapping.hasOwnProperty(sortInputValue)) {
                return radioInputValueToSortValueMapping.default;
            }
            return radioInputValueToSortValueMapping[sortInputValue];
        },
        getRadioInputValue: function ({ soValue, scValue }) {
            let radioInputValueObject = Object.keys(radioInputValueToSortValueMapping)
                .find(key => radioInputValueToSortValueMapping[key].sc === scValue
                    && radioInputValueToSortValueMapping[key].so === soValue);
            if (!radioInputValueObject) {
                return DEFAULT_SORT_CHECKED_VALUE;
            }
            return radioInputValueObject;
        }
    }
})();
