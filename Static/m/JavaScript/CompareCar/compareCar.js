try { document.getElementById("form1").reset(); } catch (e) { }
var tf = new Object();

function setloading(right_obj, vt) {
    right_obj.innerHTML = "";
    var oOption = document.createElement('option');
    oOption.value = "";
    oOption.innerHTML = vt;
    right_obj.appendChild(oOption);
}


function comparenow1() {
    vid1 = document.compareform.variant1.value;
    vid2 = document.compareform.variant2.value;
    if (vid1 != "" && vid2 != "") {
        if (vid1 == vid2) {
            $("#cars1, #cars2").css("border", "1px solid red");
            $(".er_msg").text("Please select two Different cars for comparison");
            $(".er_msg").show();
            return false;
        } else {
            var makeMask1 = $("#make1").attr("data-mask");
            var makeMask2 = $("#make2").attr("data-mask");
            var modelMask1 = $("#model1").attr("data-mask");
            var modelMask2 = $("#model2").attr("data-mask");
            var variantId1 = $("#variant1").attr("data-variantid");
            var variantId2 = $("#variant2").attr("data-variantid");

            var url = "/compare-cars/" + makeMask1 + "-" + modelMask1 + "-vs-" + makeMask2 + "-" + modelMask2 + "?c1=" + variantId1 + "&c2=" + variantId2;
            location.href = url;

        }
    } else {
        if (vid1 == "") {
            $("#cars1").css("border", "1px solid red");
        }
        if (vid2 == "") {
            $("#cars2").css("border", "1px solid red");
        }
        $(".er_msg").text("Please select two cars for comparison");
        $(".er_msg").show();
        return false;
    }
}



function showtab(vt) {

    if (document.getElementById(vt).style.display == "block") {
        document.getElementById(vt).style.display = "none";
        document.getElementById(vt + "_click").className = "";
        //location.href = "#disp_compare";
        return false;
    }

    vl = ["performance", "factors", "dimensions", "features", "safety", "capacities", "wheels"];
    for (i in vl) {
        document.getElementById(vl[i]).style.display = "none";
        document.getElementById(vl[i] + "_click").className = "";
    }
    document.getElementById(vt).style.display = "block";
    document.getElementById(vt + "_click").className = "activediv";
    //location.href = "#disp_compare";
    vaction = "Comparison of " + compcars0 + " and " + compcars1 + " | " + vt;
    vurl = document.URL + "?go=" + vt;
    _gtm_push("Compare Cars|" + vt + " Page", vaction, vurl, "eventCompare Cars|" + vt + " Page");

    return false;
}

ccars = 0;
imag = '';

function popupBG(showHide) {
    document.querySelector(".top_head").style.display = showHide;
    document.getElementById("footer").style.display = showHide;
}

function show_makes_list(rr) {
    ccars = rr;
    document.getElementById("back").onclick = function () { getMake_close() };
    document.getElementById("make_val").innerHTML = "Select Car";
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("make_drp").style.display = "block";
    document.getElementById("model_drp").style.display = "none";
    document.getElementById("varient_drp").style.display = "none";

    $('#select_make').empty();
    GetMMVData.getMakesForM();
    // popupBG("none");
}

function getMake_close() {
    document.getElementById("main_drp").style.display = "none";
    document.getElementById("make_drp").style.display = "none";
    document.getElementById("model_drp").style.display = "none";
    // popupBG("block");
}
function getModel_close() {
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("make_val").innerHTML = "Select Car";
    document.getElementById("back").onclick = function () { getMake_close() };
    document.getElementById("make_drp").style.display = "block";
    document.getElementById("model_drp").style.display = "none";
    // popupBG("block");
}

// Funtion to fetch model list based on make name.
function getModel_new(obj) {
    val = obj.textContent;

    //set make
    $("#make" + ccars).val(val);
    $("#make" + ccars).attr("data-mask", obj.dataset.mask);
    document.getElementById("make_val").innerHTML = val;

    //reset remaining
    $("#model_list").empty();
    GetMMVData.getModelsForM(obj.dataset.value);

    $("#model" + ccars).val("");
    $("#model" + ccars).attr("data-mask", "");
    $("#variant" + ccars).val(val);
    $("#variant" + ccars).attr("data-mask", "");
    $("#variant" + ccars).attr("data-imagepath", "");
    $("#variant" + ccars).attr("data-variantid", "");
    $("#price" + ccars).val("");
    $("#price" + ccars).attr("data-label", "");

    document.getElementById("back").onclick = function () { getModel_close() };
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("make_drp").style.display = "none";
    document.getElementById("model_drp").style.display = "block";
    document.getElementById("varient_drp").style.display = "none";
}

// Funtion to create dynamic html for model list.
function setModels_new(vals) {
    var list = '';
    var make = document.getElementById("make" + ccars).value;
    for (i in vals) {
        list += "<li onclick=\"setValues('" + make + "','" + vals[i] + "')\">" + vals[i] + "</li>";
    }
    document.getElementById("model_list").innerHTML = list;

}

// Funtion to fetch variant list based on make & model name.
function setValues(obj) {
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("make_drp").style.display = "none";
    document.getElementById("model_drp").style.display = "none";
    document.getElementById("varient_drp").style.display = "block";

    // set model
    document.getElementById("make_val").innerHTML = document.getElementById("make_val").innerHTML + " " + obj.textContent;
    document.getElementById("model" + ccars).value = obj.textContent;
    $("#model" + ccars).attr("data-mask", obj.dataset.mask);

    // reset variant
    $("#varient_list").empty();
    GetMMVData.getversionsForM(obj.dataset.value);
    $("#variant" + ccars).val(val);
    $("#variant" + ccars).attr("data-mask", "");
    $("#variant" + ccars).attr("data-imagepath", "");
    $("#variant" + ccars).attr("data-variantid", "");
    $("#price" + ccars).val("");
    $("#price" + ccars).attr("data-label", "");
}
variants_list = '';

// Funtion to create dynamic html for variant list.
function setVariants_n(valss) {
    var list = '';
    variants_list = valss;
    for (i in valss) {
        list += "<li onclick=\"setValues2('" + i + "')\">" + valss[i] + "</li>";
    }
    document.getElementById("varient_list").innerHTML = list;
}
function setValues2(obj) {
    document.getElementById("main_drp").style.display = "none";
    document.getElementById("make_drp").style.display = "none";
    document.getElementById("model_drp").style.display = "none";
    document.getElementById("varient_drp").style.display = "none";

    // set variant
    document.getElementById("variant" + ccars).value = obj.textContent;
    $("#variant" + ccars).attr("data-mask", obj.dataset.mask);
    $("#variant" + ccars).attr("data-imagepath", obj.dataset.imagepath);
    $("#variant" + ccars).attr("data-variantid", obj.dataset.value);
    $("#price" + ccars).val(obj.dataset.price);
    $("#price" + ccars).attr("data-label", obj.dataset.label);

    getimages();
    vid1 = document.compareform.variant1.value;
    vid2 = document.compareform.variant2.value;
    $("#cars2").attr("onclick", "show_makes_list(2)");
    if (ccars == 1) {
        $("#cars1").css("border", "none");
        $("#cars1").addClass('aftrsel');
    } else {
        $("#cars2").css("border", "none");
        $("#cars2").addClass('aftrsel');
        $(".er_msg").text("");
        $(".er_msg").hide();
    }

    if (vid1 == vid2) {
        $("#cars1, #cars2").css("border", "1px solid red");
        $(".er_msg").text("Please select two Different cars for comparison");
        $(".er_msg").show();
    }

    if (vid1 != "" && vid2 != "" && vid1 != vid2) {
        $("#cars1, #cars2").css("border", "none");
        $(".er_msg").text("");
        $(".er_msg").hide();
    }

    $(".vsblk").removeClass('inactive');
    try { $("#image_car2").attr("src", `${window.CloudfrontCDNHostURL}/images-mobiles/addcaractive.svg`); } catch (e) { }

    // popupBG('block');
}

// Function to display details for selected car.
function getimages() {

    var make = $("#make" + ccars).val();
    var model = $("#model" + ccars).val();
    var variant = $("#variant" + ccars).val();
    var image = $("#variant" + ccars).attr("data-imagepath");
    var price = $("#price" + ccars).val();
    var label = $("#price" + ccars).attr("data-label");

    vlll = '';
    vlll = "<div class=\"editSeltn\"><img src=\"" + window.CloudfrontCDNHostURL + "/images-mobiles/changecar.svg?v=1\" alt=\"Car\" width=\"14\"></div>";
    vlll += "<img src='" + window.ImgdCDNHostURL + "/160x89" + image + "' alt='" + make + " " + model + "' width=\"135px\" >";
    vlll += "<div class=\"carDetails\">";
    vlll += "<div class=\"makeCar\">" + make + "</div>";
    vlll += "<div class=\"modelCar\">" + model + "</div>";
    vlll += "<div class=\"variantCar\">" + variant + "</div>";
    vlll += "</div>";
    vlll += "<div class=\"carPrice\"><span class='rupee_font flt_none'>&#x20B9;&nbsp;</span><span class=\"priceNum\">" + price + "</span></div>";
    vlll += "<div class=\"exshwPrc\">" + 'Onwards' + "</div>";
    document.getElementById('cars' + ccars).innerHTML = vlll;
}

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
                    var popular_label = "<li class='listGroupTitle'><strong>Popular Makes</strong></li>";
                    var other_label = "<li class='listGroupTitle'><strong>Others</strong></li>";
                    $(popular_label).appendTo("#select_make");
                    $.each(response, function (key, item) {
                        if (key == 10) {
                            $(other_label).appendTo("#select_make");
                        }
                        var li_data =
                            "<li data-value=" +
                            response[key].makeId +
                            " data-mask=" +
                            response[key].maskingName +
                            " data-testing-id= cda-make-" +
                            response[key].maskingName +
                            " onclick=getModel_new(this)>" +
                            response[key].makeName +
                            "</li>";
                        $(li_data).appendTo("#select_make");
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
                            " data-testing-id= cda-model-" +
                            response[key].MaskingName +
                            " data-make=" +
                            response[key].makeName +
                            " onclick=setValues(this)>" +
                            response[key].ModelName +
                            "</li>";

                        $(li_data).appendTo("#model_list");
                    });
                },
                error: function (error) {
                    reject(error);
                },
            });
        });
    },
    getversionsForM: function (modelId) {
        var url = GetMMVData.getVersionUrl(modelId);
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json",
                headers: { 'ServerDomain': 'CarWale' },
                success: function (response) {
                    $.each(response.variants, function (key, item) {
                        var li_data =
                            "<li data-value=" +
                            response.variants[key].versionId +
                            " data-mask=" +
                            response.variants[key].versionMaskingName +
                            " data-testing-id= cda-varient-" +
                            response.variants[key].versionMaskingName +
                            " data-imagepath=" +
                            response.variants[key].imagePath +
                            " data-price='" +
                            response.variants[key].priceOverview.formattedPrice +
                            "' data-label='" +
                            response.variants[key].priceOverview.priceLabel +
                            "' onclick=setValues2(this)>" +
                            response.variants[key].versionName +
                            "</li>";
                        $(li_data).appendTo("#varient_list");
                    });
                },
                error: function (error) {
                    reject(error);
                },
            });
        });
    },
};