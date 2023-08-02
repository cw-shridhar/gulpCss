$(document).ready(function () {
  var makeId = document.getElementById("make-select").dataset.value;
  var modelId = document.getElementById("model-select").dataset.value;
  var modelMask = document.getElementById("model-select").dataset.mask;
  GetMMVData.getMakesForM();
  makeId && modelId > 0 && GetMMVData.getversionsForM(modelId, modelMask);
  if (modelName !== "" && (selectedVersionName === undefined || selectedVersionName === "")) {
    show_versions();
  }
});

var GetMMVData = {
  getMakeUrl: function () {
    return "/api/v2/makes/?shouldSortByPopularity=true";
  },
  getModelUrl: function (makeId) {
    return "/api/models/?type=new&makeId=" + makeId;
  },
  getVersionUrl: function (modelId) {
    return (
      "/api/v3/versions/" +
      "?modelId=" +
      modelId +
      "&type=new&itemIds=29,26&application=1"
    );
  },
  getMakes: function () {
    var url = GetMMVData.getMakeUrl();
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "GET",
        url: url,
        headers: { 'ServerDomain': 'CarWale' },
        success: function (response) {
          var popular_label = "<span class='optionLabel'>Most Popular</span>";
          var other_label = "<span class='optionLabel'>Others</span>";
          $(popular_label).appendTo("#make-dropdown");
          $.each(response, function (key, item) {
            if (key == 10) {
              $(other_label).appendTo("#make-dropdown");
            }
            var div_data =
              "<span class='custom-option' data-value=" +
              response[key].makeId +
              " data-mask=" +
              response[key].maskingName +
              " onclick='mmvDropdown.selectMake(this)'>" +
              response[key].makeName +
              "</span>";
            $(div_data).appendTo("#make-dropdown");
          });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
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
              "<li data-value=" +
              response[key].makeId +
              " data-mask=" +
              response[key].maskingName +
              " onclick='mmvDropdown.selectMakeForM(this)'>" +
              response[key].makeName +
              "</li>";
            $(li_data).appendTo("#make-list");
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
          $.each(response, function (key, item) {
            var div_data =
              "<span class='custom-option' data-value=" +
              response[key].ModelId +
              " data-mask=" +
              response[key].MaskingName +
              " onclick='mmvDropdown.selectModel(this)'>" +
              response[key].ModelName +
              "</span>";
            $(div_data).appendTo("#model-dropdown");
          });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  },
  getModelsForM: function (makeId) {
    var url = GetMMVData.getModelUrl(makeId);
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "GET",
        url: url,
        headers: { 'ServerDomain': 'CarWale' },
        success: function (response) {
          $.each(response, function (key, item) {
            var li_data =
              "<li data-value=" +
              response[key].ModelId +
              " data-mask=" +
              response[key].MaskingName +
              " onclick='mmvDropdown.selectModelForM(this)'>" +
              response[key].ModelName +
              "</li>";

            $(li_data).appendTo("#model-list");
          });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  },
  getVersions: function (modelId) {
    var url = GetMMVData.getVersionUrl(modelId);
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "get",
        url: url,
        contentType: "application/json",
        headers: { 'ServerDomain': 'CarWale' },
        success: function (response) {
          $.each(response, function (key, item) {
            var div_data =
              "<span class='custom-option' data-value=" +
              response[key].versionId +
              " data-mask=" +
              response[key].versionMaskingName +
              " onclick='mmvDropdown.selectversion(this)'>" +
              response[key].versionName +
              "</span>";
            $(div_data).appendTo("#version-dropdown");
          });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  },
  getversionsForM: function (modelId, maskingName) {
    var url = GetMMVData.getVersionUrl(modelId);
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        headers: { 'ServerDomain': 'CarWale' },
        success: function (response) {
          var modelPresent = document.getElementById("model-present");
          var modelNotPresent = document.getElementById("no-car-present");
          modelPresent.style.display = "flex";
          modelNotPresent.style.display = "none";
          var makeModelImage = document.getElementById("make-model__img");
          makeModelImage.src =
            `${window.ImgdCDNHostURL}/393x221` + response.variants[0].imagePath;
          $.each(response.variants, function (key, item) {
            var li_data =
              "<li data-value=" +
              response.variants[key].versionId +
              " data-mask=" +
              response.variants[key].versionName +
              " data-modelmask=" +
              maskingName +
              " onclick='mmvDropdown.selectVersionForM(this)'>" +
              response.variants[key].versionName +
              "</li>";
            $(li_data).appendTo("#version-list");
          });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  },
};
var mmvDropdown = {
  selectMake: function (obj) {
    var makeField = document.getElementById("make-selected");
    makeField.innerHTML = obj.textContent;
    makeField.dataset.value = obj.dataset.value;
    makeField.dataset.mask = obj.dataset.mask;
    var modelField = document.getElementById("model-selected");
    modelField.innerHTML = "Select Model";
    var makeId = obj.dataset.value;
    mmvDropdown.removeAllChildren(document.getElementById("model-dropdown"));
    GetMMVData.getModels(makeId);
  },
  selectModel: function (obj) {
    document.getElementById("select_model").style.display = "none";
    var modelField = document.getElementById("model-selected");
    modelField.innerHTML = obj.textContent;
    modelField.dataset.value = obj.dataset.value;
    modelField.dataset.mask = obj.dataset.mask;
  },
  selectVersion: function (obj) {
    document.getElementById("select_version").style.display = "none";
    var versionField = document.getElementById("version-selected");
    versionField.innerHTML = obj.textContent;
    versionField.dataset.value = obj.dataset.value;
    versionField.dataset.mask = obj.dataset.mask;
  },
  removeAllChildren: function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  },
  selectMakeForM: function (obj) {
    var makeField = document.getElementById("make-select");
    makeField.innerHTML = obj.textContent;
    makeField.dataset.value = obj.dataset.value;
    makeField.dataset.mask = obj.dataset.mask;
    var modelField = document.getElementById("model-select");
    modelField.innerHTML = "Select Model";
    var makeModelSelect = document.getElementById("make-mode-select");
    makeModelSelect.innerHTML = "Select " + obj.textContent + " Make";
    var makeId = obj.dataset.value;
    mmvDropdown.removeAllChildren(document.getElementById("model-list"));
    GetMMVData.getModelsForM(makeId);
    document.getElementById("make_popup").style.display = "none";
    document.getElementById("model_popup").style.display = "block";
  },
  selectModelForM: function (obj) {
    var modelField = document.getElementById("model-select");
    modelField.innerHTML = obj.textContent;
    var modelVersionSelect = document.getElementById("model-version-select");
    modelVersionSelect.innerHTML =
      "Select " + obj.textContent + " " + " Version";
    modelField.dataset.value = obj.dataset.value;
    modelField.dataset.mask = obj.dataset.mask;
    var versionField = document.getElementById("version-select");
    versionField.innerHTML = "Select Version";
    var modelId = obj.dataset.value;
    mmvDropdown.removeAllChildren(document.getElementById("version-list"));
    GetMMVData.getversionsForM(modelId, obj.dataset.mask);
    document.getElementById("model_popup").style.display = "none";
    document.getElementById("version_popup").style.display = "block";
  },
  selectVersionForM: function (obj) {
    window.onbeforeunload = null;
    var modelMask = obj.dataset.modelmask;
    var versionId = obj.dataset.value;
    window.location.href = "?model=" + modelMask + "&versionId=" + versionId;
  },
};
var dropdowns = document.querySelectorAll(".custom-select-wrapper");
for (var i = 0; i < dropdowns.length; i++) {
  dropdowns[i].addEventListener("click", function () {
    this.querySelector(".custom-select").classList.toggle("open");
  });
}
window.addEventListener("click", function (e) {
  var selects = document.querySelectorAll(".custom-select");
  for (var i = 0; i < selects.length; i++) {
    if (!selects[i].contains(e.target)) {
      selects[i].classList.remove("open");
    }
  }
});

function show_makes() {
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("make_popup").style.display = "block";
  document.getElementById("blackOutWindow").style.display = "block";
}
function show_models() {
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("model_popup").style.display = "block";
  document.getElementById("blackOutWindow").style.display = "block";
}

function show_versions() {
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("version_popup").style.display = "block";
  document.getElementById("blackOutWindow").style.display = "block";
}

function back_btn() {
  if (document.getElementById("make_popup").style.display == "block") {
    document.getElementById("make_popup").style.display = "none";
    document.getElementById("main_drp").style.display = "none";
    document.getElementById("blackOutWindow").style.display = "none";
  }
  if (document.getElementById("model_popup").style.display == "block") {
    document.getElementById("model_popup").style.display = "none";
    document.getElementById("make_popup").style.display = "block";
  }
  if (document.getElementById("version_popup").style.display == "block") {
    document.getElementById("model_popup").style.display = "block";
    document.getElementById("version_popup").style.display = "none";
  }
}
function redirectForM() {
  if (document.getElementById("model-select").innerHTML == "Select Model") {
    document.getElementById("m_select_model").style.display = "block";
  } else {
    if (
      document.getElementById("version-select").innerHTML == "Select Version"
    ) {
      document.getElementById("m_select_model").style.display = "block";
    }
    var makeMaskingName = document.getElementById("make-select").dataset.mask;
    var modelMaskingName = document.getElementById("model-select").dataset.mask;
    var versionMaskingName = document.getElementById("version-select").dataset
      .mask;
    var url = createModelVideoUrl(makeMaskingName, modelMaskingName);
    window.location.href = url;
  }
}