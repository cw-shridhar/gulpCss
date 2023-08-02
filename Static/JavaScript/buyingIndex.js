var buyingIndex = (function () {
    var queryParam = {};

    if (typeof events !== 'undefined') {
        events.subscribe("versionChanged", addQueryParam);
        events.subscribe("yearChanged", addQueryParam);
        events.subscribe("cityChanged", addQueryParam);
        events.subscribe("ownersChanged", addQueryParam);
        events.subscribe("kmsChanged", addQueryParam);
    }

    function addQueryParam(eventObj) {
        queryParam = appState.setSelectedData(queryParam, eventObj);
        fetchBuyingIndex();
    }

    function fetchBuyingIndex() {
        if (validateParam()) {
          if (parseInt(queryParam["owners"]) >= 4) {
            queryParam["owners"] = "4+";
          }
          $.when(
            get()
              .done(function (response) {
                if (typeof events != "undefined") {
                  events.publish("buyingIndexSuccess", response);
                }
              })
              .fail(function (response) {
                if (typeof events != "undefined") {
                  events.publish("buyingIndexFailed", response);
                }
              })
          );
        }
    }

    function get() {
      var requestBody = {
        versionId: queryParam.versionId,
        owners: queryParam.owners,
        entryYear: new Date().getFullYear(),
        makeYear: queryParam.year,
        cityId: queryParam.cityId,
        kilometers: queryParam.kms_driven,
        valuationType: 2,
      };
      return $.ajax({
        type: "GET",
        url: "/api/used/valuation",
        data: requestBody,
        async: true,
      });
    }

    function validateParam() {
        return queryParam.makeId > "0" &&
            queryParam.modelId > "0" &&
            queryParam.versionId > "0" &&
            queryParam.year > "0" &&
            queryParam.owners > "0" &&
            queryParam.cityId > "0" &&
            queryParam.kms_driven > "0";
    }
})();