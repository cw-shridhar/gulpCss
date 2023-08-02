const versionTable = (function () {
    const discontinuedContainer = document.querySelector(".disc_blk");
    const noMoreVersionContainer = document.querySelector(".js-no-version");
    const moreVersionsContainer = document.querySelector("#moreversions");
    const trackingCategory = isMobile ? "VariantTable_Msite" : "VariantTable_Desk";
    let readMoreButton = document.querySelector(".ver_read_more");
    let versionSummary = document.querySelector("#ver_more_des");

    if (readMoreButton) {
        readMoreButton.addEventListener("click", function () {
            if (readMoreButton.textContent == "+ More") {
                versionSummary?.classList.remove("min_cls");
                versionSummary?.classList.add("max_cls");
                readMoreButton.textContent = "Read Less";
                readMoreButton.classList.remove("min_read");
                readMoreButton.classList.add("max_read");
            } else {
                versionSummary?.classList.remove("max_cls");
                versionSummary?.classList.add("min_cls");
                readMoreButton.textContent = "+ More";
                readMoreButton.classList.remove("max_read");
                readMoreButton.classList.add("min_read");
            }
        });
    }

    const view_versions = document.getElementById("js-view-all-versions");
    let activeVersions = "vrsn-info-block";
    view_versions?.addEventListener("click", function () {
        viewAllVersions(activeVersions);
    });

    let selected_fuel_types = [];
    let selected_trans_types = [];
    let selected_seat_types = [];

    showSpecificTypes = (data_types, on_class, add_class) => {
        document.querySelectorAll(`.${on_class}`).forEach(e => {
            for (let type of data_types) {
                if (e.classList.contains(type)) {
                    e.classList.add(add_class);
                }
            }
        });
    }

    removeSpecificValue = (selected_array, category) => {
        for (let i = 0; i < selected_array.length; i++) {
            if (selected_array[i] == category) {
                selected_array.splice(i, 1);
                break;
            }
        }
    }

    getFilteredData = (type, category) => {
        const versionTablesContainer = document.querySelectorAll(".vrsn-info-block");
        versionTablesContainer.forEach(versionTable => {
            versionTable.classList.remove("fuel", "trans", "seat");
            versionTable.classList.add("display-none");
        });

        if (type === "fueltypes") {
            if (document.querySelector(`#fuel_${category}`).classList.contains("active")) {
                document.querySelector(`#fuel_${category}`).classList.remove("active");
                removeSpecificValue(selected_fuel_types, category);
            } else {
                document.querySelector(`#fuel_${category}`).classList.add("active");
                selected_fuel_types.push(category);
                analytics.trackAction("CTInteractive", trackingCategory, `FuelType_${category}`);
                ctTracking.trackEvent({
                    'category': trackingCategory,
                    'action': `FuelType_${category}`
                });
            }
        }
        if (type === "transtypes") {
            if (document.querySelector(`#trans_${category}`).classList.contains("active")) {
                document.querySelector(`#trans_${category}`).classList.remove("active");
                removeSpecificValue(selected_trans_types, category);
            } else {
                document.querySelector(`#trans_${category}`).classList.add("active");
                selected_trans_types.push(category);
                analytics.trackAction("CTInteractive", trackingCategory, `Transmission_${category}`);
                ctTracking.trackEvent({
                    'category': trackingCategory,
                    'action': `Transmission_${category}`
                });
            }
        }
        if (type === "seattypes") {
            if (document.querySelector(`#seat_${category}`).classList.contains("active")) {
                document.querySelector(`#seat_${category}`).classList.remove("active");
                removeSpecificValue(selected_seat_types, category);
            } else {
                document.querySelector(`#seat_${category}`).classList.add("active");
                selected_seat_types.push(category);
                analytics.trackAction("CTInteractive", trackingCategory, `SeatingCapacity_${category}`);
                ctTracking.trackEvent({
                    'category': trackingCategory,
                    'action': `SeatingCapacity_${category}`
                });
            }
        }

        let on_class = "vrsn-info-block", add_class;
        if (selected_fuel_types.length > 0) {
            add_class = "fuel";
            showSpecificTypes(selected_fuel_types, on_class, add_class);
            on_class = add_class;
        }

        if (selected_trans_types.length > 0) {
            add_class = "trans";
            showSpecificTypes(selected_trans_types, on_class, add_class);
            on_class = add_class;
        }
        if (selected_seat_types.length > 0) {
            add_class = "seat";
            showSpecificTypes(selected_seat_types, on_class, add_class);
            on_class = add_class;
        }
        activeVersions = on_class;

        document.querySelectorAll(`.${activeVersions}`).forEach(version =>
            version.classList.remove("display-none")
        );
        viewSpecificVersions(activeVersions);
    }

    viewSpecificVersions = (activeVersions) => {
        const versionTable = document.getElementById('version-table');
        if (!versionTable) {
            return;
        }
        var isDiscontinued = versionTable.getAttribute("data-isdiscontinued").toLowerCase();
        const activeVersionList = document.querySelectorAll(`.${activeVersions}`);
        if (activeVersionList?.length > 6) {
            let class_count = 0;
            activeVersionList.forEach(version => {
                class_count < 6 ? version.classList.remove("display-none")
                    : version.classList.add("display-none");
                class_count++;
            });
            if (discontinuedContainer) {
                discontinuedContainer.classList.add("display-none");
            }
            moreVersionsContainer.style.display = "block";
            noMoreVersionContainer.style.display = "none";
        } else if (activeVersionList?.length == 0) {
            if (isDiscontinued === "true" && discontinuedContainer) {
                discontinuedContainer.classList.remove("display-none");
            } else {
                noMoreVersionContainer.style.display = "block";
            }
            moreVersionsContainer.style.display = "none";
        } else {
            activeVersionList.forEach(version => version.classList.remove("display-none"));
            if (discontinuedContainer) {
                discontinuedContainer.classList.remove("display-none");
            }
            moreVersionsContainer.style.display = "none";
            noMoreVersionContainer.style.display = "none";
        }
    }

    viewAllVersions = (activeVersions) => {
        document.querySelectorAll(`.${activeVersions}`).forEach(ele => {
            ele.classList.remove("display-none");
        });
        if (discontinuedContainer) {
            discontinuedContainer.classList.remove("display-none");
        }
        moreVersionsContainer.style.display = "none";
        noMoreVersionContainer.style.display = "none";
    }

    return {
        getFilteredData,
        viewSpecificVersions,
        activeVersions
    };
})();

window.onload = function () {
    versionTable.viewSpecificVersions(versionTable.activeVersions);
};
