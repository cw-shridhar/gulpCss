const cmsSearch = (function() {
  const searchInput = document.querySelector(".js-cms-search");
  const searchDropDown = document.querySelector(".js-search-drop-down");
  const debounceDelay = 500;
  const api = "/api/v3/autocomplete/?source=1,2,3&size=5&showFeatured=false&isNcf=false";

  _populateCars = (cars) => {
    cars.forEach(car => {
      const payload = car.payload;
      if(payload) {
        const makeMaskingName = payload.makeMaskingName;
        const modelMaskingName = car.suggestionType === 2 || car.suggestionType === 3 ? payload.maskingName : "";
        const text = `${payload.makeName} ${payload.modelName}`.trim();
        const item = document.createElement("a");
        item.textContent = text;
        item.title = text;
        item.href = cmsUrls.getListingUrl(makeMaskingName, modelMaskingName);
        item.classList.add("search-drop-down-item");
        item.dataset.testingId = "news-listing-search-menu-item";
        searchDropDown.appendChild(item);
      }
    });
  }

  _resetSearchDropDown = () => {
    searchDropDown.innerHTML = "";
    searchDropDown.classList.add("display-none");
  }

  const _handleSearch = debounce(async () => {
    const term = searchInput.value;
    _resetSearchDropDown();

    if(!term || term.length === 0) {
      return;
    }

    searchDropDown.classList.remove("display-none");

    const url = api + "&value=" + term;

    fetch(url, {
      headers : {
        'ServerDomain': 'CarWale',
        'Content-Type': 'application/json'
      },
    })
    .then(res => {
      if (!res.ok) {
        _resetSearchDropDown();
        return [];
      }

      return res.json();
    })
    .then(data => {
      _populateCars(data);
    })
    .catch(e => {
      _resetSearchDropDown();
    });
  }, debounceDelay);

  search = () => {
    _handleSearch();
  }

  return {
    search
  };
})();