function hideNearbyCities() {
  $(".nearbyCities-section").addClass("hide");
  $(".nearbyCities-section-client").addClass("hide");
}
function getNearbyCities(queryString) {
  cityId = getValueFromQS("city", queryString);
  $.ajax({
    url: "/buy-used-cars/api/popular-nearby-cities/?cityId=" + cityId,
    method: "GET",
    success: function (response) {
      if (!response) {
        return;
      }
      else {
        $(".nearbyCities-section-client .nearbyCityList").empty();
        var numberOfCities = response.length;
        if (numberOfCities <= 0) {
          return;
        }
        var nearByCitiesHtmlBinding = [];
        var currentCityName = Common.utils.getCookieByName("cd-city-ct");
        $(".nearbyCityTitle").text("Used Cars Near " + currentCityName);
        for (var i = 0; i < numberOfCities; i++) {
          nearByCitiesHtmlBinding
            .push("<li data-event=\"CWInteractive\" data-action=\"ClickedNearByCity\"" +
                  "data-cat=\"UsedCarSearch\" data-role=\"click-tracking\"" +
                  "data-label=\"currentCity=" + currentCityName + "|nearbyCity=" + response[i].Name + "\">" +
                  "<a href=\"" + getSearchPagePath(response[i].MaskingName) + "\" title=\"Used Cars in " + 
                  response[i].Name + "\">Used Cars in " + response[i].Name + "</a></li>");
        }
        $(".nearbyCities-section-client .nearbyCityList").append(nearByCitiesHtmlBinding.join(""));
        $(".nearbyCities-section-client").removeClass("hide");
      }
    }
  });
}