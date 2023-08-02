function redirect() {
    if (document.getElementById("model-selected").innerHTML == "Select Model") {
      document.getElementById("select_model").style.display = "block";
    }
    else {
      var makeMaskingName = document.getElementById("make-selected").dataset.mask;
      var modelMaskingName = document.getElementById("model-selected").dataset.mask;
      var url = cmsUrls.createModelVideoUrl(makeMaskingName, modelMaskingName);
      window.location.href = url;
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
          var popular_label = "<span class='optionLabel'>Most Popular</span>";
          var other_label = "<span class='optionLabel'>Others</span>";
          $(popular_label).appendTo('#make-dropdown');
          $.each(response, function (key, item) {
            if (key == 10) {
              $(other_label).appendTo('#make-dropdown');
            }
            var div_data = "<span class='custom-option' data-value=" + response[key].makeId + " data-mask=" + response[key].maskingName + " onclick='mmvDropdown.selectMake(this)'>" + response[key].makeName + "</span>";
            $(div_data).appendTo('#make-dropdown');
          });
        },
        error: function (error) {
          reject(error);
        }
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
          $(popular_label).appendTo('#make-list');
          $.each(response, function (key, item) {
            if (key == 10) {
              $(other_label).appendTo('#make-list');
            }
            var li_data = "<li data-value=" + response[key].makeId + " data-mask=" + response[key].maskingName + " onclick='mmvDropdown.selectMakeForM(this)'>" + response[key].makeName + "</li>";
            $(li_data).appendTo('#make-list');
          });
        },
        error: function (error) {
          reject(error);
        }
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
            var div_data = "<span class='custom-option' data-value=" + response[key].ModelId + " data-mask=" + response[key].MaskingName + " onclick='mmvDropdown.selectModel(this)'>" + response[key].ModelName + "</span>";
            $(div_data).appendTo('#model-dropdown');
          });
        },
        error: function (error) {
          reject(error);
        }
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
            var li_data = "<li data-value=" + response[key].ModelId + " data-mask=" + response[key].MaskingName + " onclick='mmvDropdown.selectModelForM(this)'>" + response[key].ModelName + "</li>";
            $(li_data).appendTo('#model-list');
          });
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  }
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
    var makeId = obj.dataset.value;
    mmvDropdown.removeAllChildren(document.getElementById("model-list"));
    GetMMVData.getModelsForM(makeId);
    document.getElementById("make_popup").style.display = "none";
    document.getElementById("model_popup").style.display = "block";
  },
  selectModelForM: function (obj) {
    document.getElementById("m_select_model").style.display = "none";
    var modelField = document.getElementById("model-select");
    modelField.innerHTML = obj.textContent;
    modelField.dataset.value = obj.dataset.value;
    modelField.dataset.mask = obj.dataset.mask;
    document.getElementById("model_popup").style.display = "none";
    document.getElementById("main_drp").style.display = "none";
  }
};
var dropdowns = document.querySelectorAll(".custom-select-wrapper");
for (var i = 0; i < dropdowns.length; i++) {
  dropdowns[i].addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open');
  });
	}
window.addEventListener('click', function (e) {
  var selects = document.querySelectorAll(".custom-select");
    for (var i = 0; i < selects.length; i++) {
        if (!selects[i].contains(e.target)) {
            selects[i].classList.remove('open');
        }
    }
});

function show_makes() {
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("make_popup").style.display = "block";
}
function show_models() {
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("model_popup").style.display = "block";
}

function back_btn() {
  if (document.getElementById("make_popup").style.display == "block") {
    document.getElementById("make_popup").style.display = "none";
    document.getElementById("main_drp").style.display = "none";
  }
  if (document.getElementById("model_popup").style.display == "block") {
    document.getElementById("model_popup").style.display = "none";
    document.getElementById("make_popup").style.display = "block";
  }
}
function redirectForM() {
  if (document.getElementById("model-select").innerHTML == "Select Model") {
    document.getElementById("m_select_model").style.display = "block";
  }
  else {
    var makeMaskingName = document.getElementById("make-select").dataset.mask;
    var modelMaskingName = document.getElementById("model-select").dataset.mask;
    var url = cmsUrls.createModelVideoUrl(makeMaskingName, modelMaskingName);
    window.location.href = url; 
  }
}