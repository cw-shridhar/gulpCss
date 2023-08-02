let currentPageNo = 1;

const currentFilters = {
  fuelTypeIds: [],
  budget: [],
  carMakeIds: [],
  transmissionTypeIds: [],
  bodyStyleIds: [],
  seats: [],
  additionalFeatures: [],
};

var ordering = -1;

const defaultFilters = {
  fuelFilter: {
    fuel_petrol: "1",
    fuel_diesel: "2",
    fuel_cng: "3",
    fuel_electric: "5",
  },
  bodyTypeFilter: {
    body_type_hatchback: "3",
    body_type_sedan: "1",
    body_type_suv: "6",
    body_type_muv: "9",
    body_type_coupe: "2",
    body_type_convertible: "5",
  },
  transmissionFilter: {
    transmission_manual: "2",
    transmission_automatic: "1",
    transmission_semi_automatic: "5",
  },
  budgetFilter: {
    "price_0-3": "0-3",
    "price_2-5": "2-5",
    "price_5-8": "5-8",
    "price_6-10": "6-10",
    "price_8-12": "8-12",
    "price_10-15": "10-15",
    "price_10-20": "10-20",
    "price_20-30": "20-30",
    "price_30-40": "30-40",
    "price_40-50": "40-50",
    "price_50-100": "50-100",
    "price_100-": "100-10000",
  },
  makes: {
    make_maruti_suzuki: "10",
    make_hyundai: "8",
    make_kia: "70",
    make_tata: "16",
    make_toyota: "17",
    make_honda: "7",
    make_mahindra: "9",
    make_renault: "45",
    make_ford: "5",
    make_mg: "72",
    make_audi: "18",
    make_bmw: "1",
    make_mercedes_benz: "11",
    make_skoda: "15",
    make_nissan: "21",
    make_volkswagen: "20",
    make_land_rover: "23",
    make_jeep: "43",
    make_datsun: "56",
    make_ferrari: "33",
    make_jaguar: "44",
    make_lamborghini: "30",
    make_maserati: "36",
    make_mini: "51",
    make_porsche: "19",
    make_bentley: "22",
    make_citroen: "74",
    make_volvo: "37",
    make_aston_martin: "49",
    make_lexus: "34",
    make_isuzu: "61",
    make_rolls_royce: "25",
    make_mclaren: "77",
  },
  seats: {
    seating_cap_l5: "0-5",
    seating_cap_5: "5-5",
    seating_cap_67: "6-7",
    "seating_cap_8+": "8-80",
  },
  featuresFilter: {
    fetatures_sunroof: "113",
    fetatures_rear_ac: "507",
    fetatures_cruise_control: "210",
    fetatures_alloy_wheels: "201",
    fetatures_four_wheel_drive: "280",
    fetatures_touchscreen_display: "316",
    fetatures_music_system: "92",
    fetatures_locking: "149",
    fetatures_hill_hold_control: "60",
    fetatures_reverse_camera: "227",
    fetatures_ventilates_seats: "302",
    fetatures_wireless_charging: "149",
  },
};

$(document).ready(function () {
  $(".view_brands").click(function () {
    if ($(".view_brands").text() == "View All Brands") {
      $("#view_all_brands").removeClass("min-cls");
      $("#view_all_brands").addClass("max-cls");
      $(".view_brands").text("View Less Brands");
      $(".view_brands").removeClass("min-read");
      $(".view_brands").addClass("max-read");
    } else {
      $("#view_all_brands").removeClass("max-cls");
      $("#view_all_brands").addClass("min-cls");
      $(".view_brands").text("View All Brands");
      $(".view_brands").removeClass("max-read");
      $(".view_brands").addClass("min-read");
    }
  });
});

function check_all() {
  while (currentFilters.carMakeIds.length > 0) {
    currentFilters.carMakeIds.pop();
  }
  const checkAllBtn = document.querySelector(".js-check-all");
  if (checkAllBtn.textContent == "Check All") {
    checkAllBtn.textContent = "Uncheck All";

    Object.keys(defaultFilters.makes).forEach(id => {
      document.getElementById(id).checked = true;
      currentFilters.carMakeIds.push(defaultFilters.makes[id]);
    });
  } else {
    Object.keys(defaultFilters.makes).forEach(id => {
      document.getElementById(id).checked = false;
    });
    checkAllBtn.textContent = "Check All";
  }
  applyFilters();
}

function slide_refine_categories(v) {
  var cls = "." + v + "";
  if ($(cls).hasClass("refUpArrow")) {
    $(cls).next("div.ct_leftbar").slideDown();
    $(cls).addClass("refDownArrow");
    $(cls).removeClass("refUpArrow");
  } else {
    $(cls).next("div.ct_leftbar").slideUp();
    $(cls).addClass("refUpArrow");
    $(cls).removeClass("refDownArrow");
  }
}

function handleFilterChange(filterValue, filterCategory) {
  if (currentFilters[filterCategory].includes(filterValue)) {
    for (let i = 0; i < currentFilters[filterCategory].length; i++) {
      if (currentFilters[filterCategory][i] === filterValue) {
        currentFilters[filterCategory].splice(i, 1);
      }
    }
  } else {
    currentFilters[filterCategory].push(filterValue);
  }
}

function createFilterQueryString() {
  let query = "";
  let count = 0;
  Object.keys(currentFilters).forEach(filter => {
    if (Array.isArray(currentFilters[filter])) {
      if (currentFilters[filter].length > 0) {
        if (count > 0) {
          query += "&";
        }
        query += filter + "=" + currentFilters[filter].join();
        count += 1;
      }
    } else {
      if (count > 0) {
        query += "&";
      }
      query += filter + "=" + currentFilters[filter];
      count += 1;
    }
  });
  return query;
}

function applyFilters() {
  // in case of filter change fetch the first page data
  currentPageNo = 1;
  let query = createFilterQueryString();
  if (query !== "") {
    if (window.location.search.length == 0) {
      window.location.replace("/new-cars/by-price?" + query);
    }
    window.history.replaceState({}, "", "/new-cars/by-price?" + query);
  } else {
    window.location.href = "/new-cars/by-price";
  }
  $(".searchloaderpage").show();
  getFilterPageData(query)
    .then(function (response) {
      $(".searchloaderpage").hide();
      if (response && response.includes("</li>")) {
        let modelListContainer = document.getElementById("searchFilters");
        modelListContainer.innerHTML = response;
        const pageMarker = document.getElementById("next-page-marker");
        let markerContainer = document.getElementById(
          "next-page-marker-container"
        );
        if (!pageMarker && markerContainer) {
          markerContainer.innerHTML = '<span id="next-page-marker"></span>';
          addPageMarkerObserver();
        }
      } else {
        document.getElementById("afterratebox").style.display = "block";
        $(".review_bg").show();
      }
    })
    .catch(function (error) {
      $(".searchloaderpage").hide();
      console.log("Error in calling filter page api: ", error);
    });
}

function applyFiltersMobile() {
  hide_filters();
  applyFilters();
  updateCount();
}

function preSelect(filterObj, filterIds) {
  currentFilters[filterIds].forEach(value => {
    Object.keys(filterObj).forEach(id => {
      var filterCheckbox = document.getElementById(id);
      if (filterObj[id] === value && filterCheckbox) {
        filterCheckbox.checked = true;
      }
    });
  });
}

function preSelectFiltersFromQS(searchQuery) {
  if (!searchQuery) {
    return;
  }
  var params = searchQuery
    .substr(1)
    .split("&")
    .reduce(function (qs, query) {
      var chunks = query.split("=");
      var key = chunks[0];
      var value = decodeURIComponent(chunks[1] || "");
      return (qs[key] = value), qs;
    }, {});
  Object.keys(params).forEach(function (key) {
    params[key].split(",").forEach(item => {
      currentFilters[key].push(item);
    });
  });
  preSelect(defaultFilters.fuelFilter, "fuelTypeIds");
  preSelect(defaultFilters.budgetFilter, "budget");
  preSelect(defaultFilters.bodyTypeFilter, "bodyStyleIds");
  preSelect(defaultFilters.transmissionFilter, "transmissionTypeIds");
  preSelect(defaultFilters.makes, "carMakeIds");
  preSelect(defaultFilters.seats, "seats");
  preSelect(defaultFilters.featuresFilter, "additionalFeatures");
}

function clearAllFilters() {
  $(".chkclass").each(function () {
    $(this).prop("checked", false);
  });
  Object.keys(currentFilters).forEach(key => {
    while (currentFilters[key].length > 0) {
      currentFilters[key].pop();
    }
  });
}

function updateCount() {
  let count = 0;
  Object.keys(currentFilters).forEach(key => {
    if (currentFilters[key].length > 0) {
      count += 1;
    }
  });
  if (count > 0) {
    document.getElementById("popupCount").innerHTML =
      "<span class='count'>" + count + "</span>";
  }
}

function handleFilterChangeDesktop(filterValue, filterCategory) {
  handleFilterChange(filterValue, filterCategory);
  applyFilters();
}

function closeleadbox() {
  window.location.href = "/new-cars/by-price";
}

function addPageMarkerObserver() {
  const options = {
    rootMargin: '1500px',
    threshold: [0.8],
  };
  let observer = new IntersectionObserver(handleIntersect, options);
  let marker = document.querySelector("#next-page-marker");
  if (marker) {
    observer.observe(marker);
  }
}

function handleIntersect(entries, observer) {
  let order = "";
  if (ordering == 0) {
    order += "&order=0";
    ordering = 0;
  }
  if (ordering == 1) {
    order += "&order=1";
    ordering = 1;
  }
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      currentPageNo = currentPageNo + 1;
      let query = createFilterQueryString();
      query += order;
      if (document.getElementById("IsMileagePage").value == "1") {
        query += "&filterType=17";
      }
      const queryWithPageNo = query
        ? `${query}&pageNo=${currentPageNo}`
        : `pageNo=${currentPageNo}`;
      $("#loder_img").show();
      getFilterPageData(queryWithPageNo)
        .then(function (response) {
          $("#loder_img").hide();
          if (!response || !response.includes("</li>")) {
            let pageMarker = document.getElementById("next-page-marker");
            if (pageMarker) {
              pageMarker.remove();
            }
          } else {
            let modelListContainer = document.getElementById("searchFilters");
            modelListContainer.insertAdjacentHTML("beforeend", response);
          }
        })
        .catch(function (error) {
          $("#loder_img").hide();
          console.log("Error in calling filter page api: ", error);
        });
    }
  }
}

function getFilterPageData(query) {
  let apiUrl = `/api/filterpage/models?${query}`;
  return fetch(apiUrl, {
    method: "GET",
    headers: { ServerDomain: "CarWale" },
  })
    .then(function (response) {
      if (!response.ok) {
        throw response;
      }
      return response.text();
    })
    .catch(function (error) {
      console.log("Error in calling filter page api: ", error);
    });
}

function reorder(value) {
  let order = "";
  ordering = -1;
  if (value == "l2h") {
    order += "&order=0";
    ordering = 0;
  }
  if (value == "h2l") {
    order += "&order=1";
    ordering = 1;
  }
  currentPageNo = 1;
  let query = createFilterQueryString();
  query += order;
  const queryWithPageNo = query
    ? `${query}&pageNo=${currentPageNo}`
    : `pageNo=${currentPageNo}`;
  $("#loder_img").show();
  getFilterPageData(queryWithPageNo)
    .then(function (response) {
      $("#loder_img").hide();
      //let modelListContainer = document.getElementById("searchFilters");
      //modelListContainer.replaceChildren(response);
      $("#searchFilters").empty();
      $("#searchFilters").append(response);
    })
    .catch(function (error) {
      $("#loder_img").hide();
      console.log("Error in calling filter page api: ", error);
    });
}
