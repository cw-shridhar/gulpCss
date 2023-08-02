$(document).ready(function () {
    var makeId = document.getElementById("make_main").dataset.value;
    var modelId = document.getElementById("model_main").dataset.value;
    GetMMVData.getMakesForM();
});

var GetMMVData = {
    getMakeUrl: function () {
        return "/api/v2/makes/?shouldSortByPopularity=true";
    },
    getModelUrl: function (makeId) {
        return "/api/v1/models/?type=new&application=3&makeId=" + makeId;
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
                            response[key].modelId +
                            " data-mask=" +
                            response[key].maskingName +
                            " data-makemaskingname=" + response[key].makeMaskingName +
                            " onclick='mmvDropdown.selectModelForM(this)'>" +
                            response[key].modelName +
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
};
var mmvDropdown = {
    removeAllChildren: function (parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    },
    selectMakeForM: function (obj) {
        var makeField = document.getElementById("make_main");
        makeField.innerHTML = obj.textContent;
        makeField.dataset.value = obj.dataset.value;
        makeField.dataset.mask = obj.dataset.mask;
        makeField.style.color = "#56586a";
        var modelField = document.getElementById("model_main");
        modelField.innerHTML = "Select Model";
        modelField.dataset.value = "";
        modelField.dataset.mask = "";
        var makeModelSelect = document.getElementById("make-mode-select");
        makeModelSelect.innerHTML = "Select Model";
        var makeVal = document.getElementById("make_val");
        makeVal.innerHTML = obj.textContent;
        var makeId = obj.dataset.value;
        mmvDropdown.removeAllChildren(document.getElementById("model-list"));
        GetMMVData.getModelsForM(makeId);
        document.getElementById("make_popup").style.display = "none";
        document.getElementById("model_popup").style.display = "block";
        var makeMaskingName = $("#make_main").attr("data-mask");
        if (
            makeMaskingName !== undefined &&
            makeMaskingName !== null &&
            makeMaskingName !== ""
        ) {
            document.getElementById("exp_make_er").style.display = "none";
        }
    },
    selectModelForM: function (obj) {
        var modelField = document.getElementById("model_main");
        modelField.innerHTML = obj.textContent;
        modelField.dataset.value = obj.dataset.value;
        modelField.dataset.mask = obj.dataset.mask;
        var makeField = document.getElementById("make_main");
        makeField.dataset.mask = obj.dataset.makemaskingname;
        modelField.style.color = "#56586a";
        document.getElementById("main_drp").style.display = "none";
        var modelMaskingName = $("#model_main").attr("data-mask");
        if (
            modelMaskingName !== undefined &&
            modelMaskingName !== null &&
            modelMaskingName !== ""
        ) {
            document.getElementById("exp_model_er").style.display = "none";
        }
        document.getElementById("blackOutWindow").style.display = "none";
    },
};

function show_makes() {
    document.getElementById("make_val").innerHTML = "Select Car";
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("make_popup").style.display = "block";
    document.getElementById("blackOutWindow").style.display = "block";
}
function show_models() {
    var makeId = document.getElementById("make_main").dataset.value;
    if (!makeId) {
        return;
    }
    document.getElementById("make_val").innerHTML = document.getElementById("make_main").textContent;
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("model_popup").style.display = "block";
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
        var makeVal = document.getElementById("make_val");
        makeVal.innerHTML = "Select Car";
    }
}

function checkOnRoadPriceClick() {
    event.preventDefault();
    var validmake = false;
    var validmodel = false;
    var makeMaskingName = $("#make_main").attr("data-mask");
    if (
        makeMaskingName === undefined ||
        makeMaskingName === null ||
        makeMaskingName === ""
    ) {
        document.getElementById("exp_make_er").style.display = "block";
    }
    else {
        validmake = true;
    }
    var modelMaskingName = $("#model_main").attr("data-mask");
    if (
        modelMaskingName === undefined ||
        modelMaskingName === null ||
        modelMaskingName === ""
    ) {
        document.getElementById("exp_model_er").style.display = "block";
    }
    else {
        validmodel = true;
    }

    if (validmake && validmodel) {
        var modelurl = "/" + makeMaskingName + "-cars/" + modelMaskingName + "/";
        locationPopup.checkOnRoadPrice(modelurl);
    }
}