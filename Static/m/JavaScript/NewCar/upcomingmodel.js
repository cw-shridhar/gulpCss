$(document).ready(function () {
  GetMMVData.getMakesForM();
});
var GetMMVData = {
  getMakeUrl: function () {
    return "/api/v2/makes/?shouldSortByPopularity=true";
  },
  getMakesForM: function () {
    var url = GetMMVData.getMakeUrl();
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "GET",
        url: url,
        headers: { 'ServerDomain': 'CarWale' },
        success: function (response) {
          var popular_label = "<li class='listGroupTitle'>Popular Brands</li>";
          var other_label = "<li class='listGroupTitle'>Other Brands</li>";
          $(popular_label).appendTo("#make-list");
          $.each(response, function (key, item) {
            if (key == 10) {
              $(other_label).appendTo("#make-list");
            }
            var li_data =
              "<a data-value=" +
              response[key].makeId +
              " data-mask=" +
              response[key].maskingName +
              " href=/upcoming-cars/" +
              response[key].maskingName +
              "/ >" +
              response[key].makeName +
              "</a>";
            $(li_data).appendTo("#make-list");
          });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  },
}
function show_makes() {
  document.getElementById("main_drp").style.display = "block";
}

function back_btn() {
  document.getElementById("main_drp").style.display = "none";
}
function show_makes_desk() {
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("blackOutWindow").style.display = "block";
}
function back_btn_desk() {
  document.getElementById("main_drp").style.display = "none";
  document.getElementById("blackOutWindow").style.display = "none";
}