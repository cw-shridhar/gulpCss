var isDisplayedRecentlyViewed = false;
$(document).ready(function () {
  var profileid = document.getElementById("recentlyviewedcars_profileid")
    .innerHTML;
  if (typeof recentlyViewedCars !== "undefined") {
    recentlyViewedCars.addProfileIdToLocalStorage(profileid);
  }
  if (
    typeof setLeadButtonText !== "undefined" &&
    typeof setLeadButtonText === "function"
  ) {
    setLeadButtonText();
  }
  $(document).on("click", "#photoRequestButton", function () {
    $("#photoRequestButton").hide();
    $("#responseFetchingLoader").show();
    var profileid = document.getElementById("recentlyviewedcars_profileid")
      .innerHTML;
    var settings = {
      url: "/api/stocks/" + profileid + "/images/uploadrequest/",
      type: "POST",
      headers: { ServerDomain: "CarWale" },
    };
    $.ajax(settings)
      .done(function (response) {
        $("#responseFetchingLoader").hide();
        $("#photoRequestSuccessText").show();
      })
      .fail(function (xhr) {
        $("#responseFetchingLoader").hide();
        $("#photoRequestErrorToast").show().delay(3000).fadeOut();
        $("#photoRequestButton").show();
      });
  });
});
$(window).on("scroll", function () {
  scrollPosition = $(this).scrollTop();
  if (
    scrollPosition + $(window).height() > $(".detspgdetails").offset().top &&
    !isDisplayedRecentlyViewed
  ) {
    if (typeof recentlyViewedCars !== "undefined") {
      var profileid = document.getElementById("recentlyviewedcars_profileid")
        .innerHTML;
      recentlyViewedCars.callRecentlyViewedCarsApi(
        profileid,
        "msiteDetailsPage"
      );
    }
    isDisplayedRecentlyViewed = true;
  }
});
function goback() {
  history.back();
}

window.onpopstate = function () {
  window.redirectToWhatsapp = null;
  buyerFormV2Msite.skipRecommendations();
}
