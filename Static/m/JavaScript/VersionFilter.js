$(document).ready(function () {
  $(".js-key-specs .vrsn-info").click(function (event) {
    var bodywidth = $("body").width();
    var halfbodywidth = bodywidth / 2;
    var position = $(this).position().left;
    var tooltip = $(this).find(".js-tool-tip");
    var tooltipBlock = $(this).find(".tool-tip-block");
    var clickX = event.currentTarget.offsetLeft;

    if (position <= halfbodywidth) {
      var value = 32 - clickX;
      tooltip.addClass("left-tool-tip");
      tooltip.css('--left', -value + "px");
      tooltipBlock.css("left", value + "px");
      tooltip.removeClass("right-tool-tip");
    }
    else {
      var value = clickX - bodywidth + 48;
      tooltip.addClass("right-tool-tip");
      tooltip.css('--right', -value + "px");
      tooltipBlock.css("right", value + "px");
      tooltip.removeClass("left-tool-tip");
    }
  });
});

function setVersionAccordion() {
  var ver_acc = document.getElementsByClassName("version_accordion");
  var i;
  for (i = 0; i < ver_acc.length; i++) {
    ver_acc[i].addEventListener("click", function () {
      this.classList.toggle("current");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}

function get_filtered_data_pic(e) {
  var select_flag = "";
  var activeClassName = "filter-active";
  if (e.classList.contains(activeClassName)) {
    e.classList.remove(activeClassName);
    select_flag = "Deselected";
  } else {
    e.classList.add(activeClassName);
    select_flag = "Selected";
  }
  var activeFiltersArray = $("." + activeClassName).toArray();
  var inputData = activeFiltersArray.map(function (v) {
    return {
      value: v.attributes["name"].value,
      specsId: v.attributes["data-specsId"].value,
    };
  });

  if (select_flag) {
    apiCallForFilteredData(inputData);
  }
}

function apiCallForFilteredData(filters) {
  $.ajax({
    url: "/api/versionwidget/list/",
    type: "post",
    contentType: "application/json",
    headers: { 'ServerDomain': 'CarWale' },
    data: JSON.stringify({
      Filters: filters,
      VersionList: versionDetailList,
      DealerAd: dealerAdData,
      PageName: pageName,
      TrimWiseVersionKeyFeatureStrings: trimWiseVersionKeyFeatureStrings,
      BaseTrimId : baseTrimId,
      IsDicontinuedReplacedModel : isDicontinuedReplacedModel
    }),
    success: function (data) {
      apiSuccessCall(data);
    },
    error: function (response, status) {
      defaultErrorHandling(response, status);
    },
  });
}

function apiSuccessCall(data) {
  $(".js-version-list-section").html(data);
  setVersionAccordion();
}

function defaultErrorHandling(response, status) {
  var node = document.createElement("div");
  node.textContent = "No Records Found!";
  $(".js-version-list-section").html(node);
}

setVersionAccordion();
