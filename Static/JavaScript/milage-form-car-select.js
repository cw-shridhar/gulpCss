$(document).ready(function () {
    var makeId = document.getElementById("make-select").dataset.value;
    var modelId = document.getElementById("model-select").dataset.value;
    var modelMask = document.getElementById("model-select").dataset.mask;
    GetMMVData.getMakesForM();
    modelId && modelId > 0 && GetMMVData.getversionsForM(modelId, modelMask);
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
    getMakesForM: function () {
        var url = GetMMVData.getMakeUrl();
        return new Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: url,
            headers: { 'ServerDomain': 'CarWale' },
            success: function (response) {
            var popular_label = "<div class='optionLabel'>Most Popular</div>";
            var other_label = "<div class='optionLabel'>Others</div>";
            $(popular_label).appendTo(".mostPopular");
            $.each(response, function (key, item) {
                if (key == 10) {
                $(other_label).appendTo(".others");
                }
                var div_data =
                "<div class='option' data-value=" +
                response[key].makeId +
                " data-mask=" +
                response[key].maskingName +
                " onclick='mmvDropdown.selectMakeForM(this)'>" +
                response[key].makeName +
                "</div>";
            if (key >= 10) {
                $(div_data).appendTo(".others");
            }
            else {
                $(div_data).appendTo(".mostPopular");

            }
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
                var div_data =
                "<div class='option' data-value=" +
                response[key].ModelId +
                " data-mask=" +
                response[key].MaskingName +
                " onclick='mmvDropdown.selectModelForM(this)'>" +
                response[key].ModelName +
                "</div>";
                $(div_data).appendTo("#model-drop");
            });
            },
            error: function (error) {
            reject(error);
            },
        });
        });
    },
    getVersionsForM: function (modelId) {
        var url = GetMMVData.getVersionUrl(modelId);
        return new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            url: url,
            contentType: "application/json",
            headers: { 'ServerDomain': 'CarWale' },
            success: function (response) {
            $.each(response.variants, function (key, item) {
                var div_data =
                "<div class='option' data-value=" +
                response.variants[key].versionId +
                " data-mask=" +
                response.variants[key].versionMaskingName +
                " onclick='mmvDropdown.selectVersionForM(this)'>" +
                response.variants[key].versionName +
                "</div>";
                $(div_data).appendTo("#version-drop");
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
        modelField.innerHTML = "Select Model *";
        modelField.classList.add("seleted");
        var makeId = obj.dataset.value;
        mmvDropdown.removeAllChildren(document.getElementById("model-drop"));
        GetMMVData.getModelsForM(makeId);
        document.getElementById("make-drop").style.display = "none";
    },
    selectModelForM: function (obj) {
        var modelField = document.getElementById("model-select");
        modelField.innerHTML = obj.textContent;
        modelField.dataset.value = obj.dataset.value;
        modelField.dataset.mask = obj.dataset.mask;
        var versionField = document.getElementById("version-select");
        versionField.classList.add("seleted");
        versionField.innerHTML = "Select Version *";
        var modelId = obj.dataset.value;
        mmvDropdown.removeAllChildren(document.getElementById("version-drop"));
        GetMMVData.getVersionsForM(modelId);
        document.getElementById("model-drop").style.display = "none";
    },
    selectVersionForM: function (obj) {
        var versionField = document.getElementById("version-select");
        versionField.innerHTML = obj.textContent;
        versionField.dataset.value = obj.dataset.value;
        versionField.dataset.mask = obj.dataset.mask;
        document.getElementById("version-drop").style.display = "none";
    }
};

function show_makes() {
    document.getElementById("make-drop").style.display = "block";
    document.getElementById("model-drop").style.display = "none";
    document.getElementById("version-drop").style.display = "none";    

}
function show_models() {
    document.getElementById("model-drop").style.display = "block";
    document.getElementById("version-drop").style.display = "none";    
    document.getElementById("make-drop").style.display = "none";
}

function show_versions() {
    document.getElementById("version-drop").style.display = "block";    
    document.getElementById("model-drop").style.display = "none";
    document.getElementById("make-drop").style.display = "none";
}

  