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
    getMakes: function (idx) {
        var url = GetMMVData.getMakeUrl();
        return new Promise(function (resolve, reject) {
            $.ajax({
            type: "GET",
            url: url,
            headers: { 'ServerDomain': 'CarWale' },
            success: function (response) {
                var popular_label = "<div class='dropdown-label'>Most Popular</div>";
                var other_label = "<div class='dropdown-label'>Others</div>";
                var dropDownId = "#make-list" + idx;
                $(popular_label).appendTo(dropDownId);
                $.each(response, function (key, item) {
                if (key == 10) {
                    $(other_label).appendTo(dropDownId);
                }
                var div_data =
                    "<div class='dropdown-option' data-value=" +
                    response[key].makeId +
                    " data-mask=" +
                    response[key].maskingName +
                    " onclick=mmvDropdown.selectMake(this," + idx + ")>" + 
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
    getModels: function (idx, makeId) {
        var url = GetMMVData.getModelUrl(makeId);
        return new Promise(function (resolve, reject) {
            $.ajax({
            type: "GET",
            url: url,
            headers: { 'ServerDomain': 'CarWale' },
            success: function (response) {
                var dropDownId = "#model-list" + idx;
                $.each(response, function (key, item) {
                    var div_data =
                        "<span class='dropdown-option' data-value=" +
                        response[key].ModelId +
                        " data-mask=" +
                        response[key].MaskingName +
                        " onclick=mmvDropdowm.selectModel(this," + idx + ")>" + 
                        response[key].ModelName +
                        "</span>";
                    $(div_data).appendTo(dropDownId);
                });
            },
            error: function (error) {
                reject(error);
            },
            });
        });
    },
    getVersions: function (idx, modelId) {
        var url = GetMMVData.getVersionUrl(modelId);
        return new Promise(function (resolve, reject) {
            $.ajax({
            type: "get",
            url: url,
            contentType: "application/json",
            headers: { 'ServerDomain': 'CarWale' },
            success: function (response) {
                var dropDownId = "#variant-list" + idx;
                $.each(response, function (key, item) {
                var div_data =
                    "<span class='dropdown-option' data-value=" +
                    response[key].versionId +
                    " data-mask=" +
                    response[key].versionMaskingName +
                    " onclick=mmvDropdowm.selectVariant(this," + idx + ")>" + 
                    response[key].versionName +
                    "</span>";
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

var mmvDropdown = {

    showMakes: function(idx) {
        var makeDropdowm = "#make-list" + idx;
        $(makeDropdowm).show();
    },

    showModels: function(idx) {
        var modelDropdowm = "#model-list" + idx;
        $(modelDropdowm).show();
    },

    showVariants: function(idx) {
        var variantDropdowm = "#variant-list" + idx;
        $(variantDropdowm).show();
    },

    selectMake: function (obj, idx) {

        // close drop down
        var makeDropdowm = "#make-list" + idx;
        $(makeDropdowm).css("display", "none");

        // update value
        var makeSelect = "#make-select" + idx;
        console.log(obj.value);
        console.log(obj.textContent);
        $(makeSelect).text(obj.textContent);
        
        // reset
        var modelSelect = "#model-select" + idx;
        $(modelSelect).innerHTML = "Select Model";

        var variantSelect = "#variant-select" + idx;
        $(variantSelect).innerHTML = "Select Variant";

        // populate
        GetMMVData.getModels(idx, obj.dataset.value);
        
        // remove disb
        var modelForm = "#model-form" + idx;
        $(modelForm).removeClass("disb");
    },

    selectModel: function(obj, idx) {
        // update value
        var modelSelect = "#model-select" + idx;
        $(modelSelect).innerHTML = obj.value;
        
        // reset
        var variantSelect = "#variant-select" + idx;
        $(variantSelect).innerHTML = "Select Variant";

        // populate
        GetMMVData.getVersions(idx, obj.dataset.value);
        var variantForm = "#variant-form" + idx;
        
        // remove disb
        $(variantForm).removeClass("disb");

        // close drop down
        var modelDropdowm = "#model-list" + idx;
        $(modelDropdowm).hide();
    },

    selectVariant: function(obj, idx) {
        // update value
        var variantSelect = "#variant-select" + idx;
        $(variantSelect).innerHTML = obj.value;

        // update new block
        if(idx < 3) {
            var imageCar = "#image_car" + (idx + 1);
            $(imageCar).attr("src", "/images4/addcaractive.svg");
            GetMMVData.getMakes(idx + 1);
        }

        // reset block
        var compareBlock = "#compare-car-block" + idx;
        $(compareBlock).css("border", "border: 1px solid #d2d2d5;");

        // close drop down
        var variantDropdowm = "#variant-list" + idx;
        $(variantDropdowm).hide();
    }
}

GetMMVData.getMakes(1); 

// getMakesForM: function (idx) {
//     var url = GetMMVData.getMakeUrl();
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//         type: "GET",
//         url: url,
//         success: function (response) {
//             var popular_label = "<li class='listGroupTitle'>Popular Brands</li>";
//             var other_label = "<li class='listGroupTitle'>Other Brands</li>";
//             var dropDownId = "#make-list" + idx;
//             $(popular_label).appendTo(dropDownId);
//             $.each(response, function (key, item) {
//             if (key == 10) {
//                 $(other_label).appendTo(dropDownId);
//             }
//             var li_data =
//                 "<li data-value=" +
//                 response[key].makeId +
//                 " data-mask=" +
//                 response[key].maskingName +
//                 " onclick='mmvDropdown.selectMakeForM(this)'>" +
//                 response[key].makeName +
//                 "</li>";
//             $(li_data).appendTo(dropDownId);
//             });
//         },
//         error: function (error) {
//             reject(error);
//         },
//         });
//     });
// },


// getModelsForM: function (idx, makeId) {
//     var url = GetMMVData.getModelUrl(makeId);
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//         type: "GET",
//         url: url,
//         success: function (response) {
//             var dropDownId = "#model-list" + idx;
//             $.each(response, function (key, item) {
//             var li_data =
//                 "<li data-value=" +
//                 response[key].ModelId +
//                 " data-mask=" +
//                 response[key].MaskingName +
//                 " onclick='mmvDropdown.selectModelForM(this)'>" +
//                 response[key].ModelName +
//                 "</li>";

//             $(li_data).appendTo(dropDownId);
//             });
//         },
//         error: function (error) {
//             reject(error);
//         },
//         });
//     });
// },

// getversionsForM: function (idx, modelId, maskingName) {
//     var url = GetMMVData.getVersionUrl(modelId);
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//         type: "GET",
//         url: url,
//         contentType: "application/json",
//         success: function (response) {
//             var modelPresent = document.getElementById("model-present");
//             var modelNotPresent = document.getElementById("no-car-present");
//             var dropDownId = "#variant-list" + idx;
//             modelPresent.style.display = "block";
//             modelNotPresent.style.display = "none";
//             var makeModelImage = document.getElementById("make-model__img");
//             makeModelImage.src =
//             "https://imgd.aeplcdn.com/393x221" + response.variants[0].imagePath;
//             $.each(response.variants, function (key, item) {
//             var li_data =
//                 "<li data-value=" +
//                 response.variants[key].versionId +
//                 " data-mask=" +
//                 response.variants[key].versionName +
//                 " data-modelmask=" +
//                 maskingName +
//                 " onclick='mmvDropdown.selectVersionForM(this)'>" +
//                 response.variants[key].versionName +
//                 "</li>";
//             $(li_data).appendTo(dropDownId);
//             });
//         },
//         error: function (error) {
//             reject(error);
//         },
//         });
//     });
// },


