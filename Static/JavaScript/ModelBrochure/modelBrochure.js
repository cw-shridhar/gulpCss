function setoptionmake(val) {
  // set make
  $("#defaultmake").text(val.textContent);
  $("#brochure_make").attr("data-mask", val.dataset.mask);
  $("#brochure_make").attr("data-value", val.dataset.value);
  $("#model_select").empty();
  document.getElementById("exp_model_er").style.display = "none";
  GetMMVData.getModels(val.dataset.value);

  // reset model
  document.getElementById("focus_text_model").style.display = "none";
  $("#defaultmodel").text("Select Model");
  $("#brochure_model").attr("data-mask", "");
  $("#brochure_model").attr("data-value", "");
  if (document.getElementById("model_select").style.display === "block") {
    document.getElementById("model_select").style.display = "none";
  }
}

function setoptionmodel(val) {
  var model = val.textContent;
  $("#defaultmodel").text(model);
  $("#brochure_model").attr("data-value", val.dataset.value);
  $("#brochure_model").attr("data-mask", val.dataset.mask);
  document.getElementById("focus_text_model").style.display = "block";
  document.getElementById("exp_model_er").style.display = "none";
  if (document.getElementById("make_select").style.display === "block") {
    document.getElementById("make_select").style.display = "none";
  }
}

var GetMMVData = {
  getMakeUrl: function () {
    return "/api/v2/makes/?shouldSortByPopularity=true";
  },
  getModelUrl: function (makeId) {
    return "/api/models/?type=new&makeId=" + makeId;
  },
  getMakes: function () {
    var url = GetMMVData.getMakeUrl();
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "GET",
        url: url,
        headers: { 'ServerDomain': 'CarWale' },
        success: function (response) {
          var popular_label =
            "<div class='group optionLabel'>Most Popular</div>";
          var other_label = "<div class='group optionLabel'>Others</div>";
          var dropDownId = "#make_select";
          $(popular_label).appendTo(dropDownId);
          $.each(response, function (key, item) {
            if (key == 10) {
              $(other_label).appendTo(dropDownId);
            }
            var div_data =
              "<div class='option' data-value=" +
              response[key].makeId +
              " data-mask=" +
              response[key].maskingName +
              " onclick=setoptionmake(this)>" +
              response[key].makeName +
              "</div>";
            $(div_data).appendTo(dropDownId);
          });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  },
  getModels: function (makeId) {
    var url = GetMMVData.getModelUrl(makeId);
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "GET",
        url: url,
        headers: { 'ServerDomain': 'CarWale' },
        success: function (response) {
          var dropDownId = "#model_select";
          $.each(response, function (key, item) {
            var div_data =
              "<div class='option' data-value=" +
              response[key].ModelId +
              " data-mask=" +
              response[key].MaskingName +
              " onclick=setoptionmodel(this)>" +
              response[key].ModelName +
              "</div>";
            $(div_data).appendTo(dropDownId);
          });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  },
};

GetMMVData.getMakes();
GetMMVData.getModels(makeId);
function handleDropDown(id) {
  var ele = document.getElementById(id);
  if (ele) {
    if (ele.style.display === "block") {
      ele.style.display = "none";
    } else {
      ele.style.display = "block";
    }
  }
}

function brochuremakemodel_link() {
  var makeMaskingName = $("#brochure_make").attr("data-mask");
  var modelMaskingName = $("#brochure_model").attr("data-mask");
  if (
    modelMaskingName === undefined ||
    modelMaskingName === null ||
    modelMaskingName === ""
  ) {
    document.getElementById("exp_model_er").style.display = "block";
  } else {
    var url =
      "/" + makeMaskingName + "-cars/" + modelMaskingName + "/brochures/";
    window.location.href = url;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const downloadBrochureBtn = document.getElementById("download-brochure");
  if (downloadBrochureBtn) {
    downloadBrochureBtn.addEventListener("click", function () {
      forceDownload(this, "pdf");
    });
  }
});