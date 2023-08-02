function versions_addtocomparelist(
  vall,
  vall3,
  checked,
  price,
  version_id,
  flag = ""
) {
  if (flag != "byform") {
    var ckbox = $("#gogo-" + version_id);
    if (!ckbox.prop("checked")) {
      $("#compare-vrsn_" + version_id + "").removeClass("checked");
    } else {
      if ($("#compare-vrsn_" + version_id + "").hasClass("unchecked")) {
        $("#compare-vrsn_" + version_id + "").removeClass("unchecked");
      }
      $("#compare-vrsn_" + version_id + "").addClass("checked");
    }

    var check_count = 0;

    var checkboxes = $(".checkbox:checked").length;
    if (checkboxes == 2 || check_count == 2) {
      $(".compare_btm_block").addClass("top_cls move_top");
    }
    if (checkboxes == 1 || check_count == 1) {
      $(".compare_btm_block").addClass("top_cls");
    }

    if (checkboxes == 0) {
      $(".compare_btm_block").removeClass("top_cls");
      $(".compare_btm_block").removeClass("move_top");
    }
  }

  var fcar = document.getElementById("car1").value;
  var scar = document.getElementById("car2").value;

  var count = 0;

  if (fcar == vall || scar == vall) {
    if (fcar == vall && checked === false) {
      document.getElementById("car1").value = "";
      document.getElementById("car1img").value = "";
      document.getElementById("cardetails1").style.display = "none";
      document.getElementById("edit_car1").style.display = "table-cell";
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) - 1;
      DeleteCookie("compcar1");
      DeleteCookie("compcar1masking");
      DeleteCookie("compcar1price");
      DeleteCookie("compcar1img");
    } else if (scar == vall && checked === false) {
      document.getElementById("car2").value = "";
      document.getElementById("car2img").value = "";
      document.getElementById("cardetails2").style.display = "none";
      document.getElementById("edit_car2").style.display = "table-cell";
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) - 1;
      DeleteCookie("compcar2");
      DeleteCookie("compcar2masking");
      DeleteCookie("compcar2price");
      DeleteCookie("compcar2img");
    }
    var fcar_valid = document.getElementById("car1").value;
    var scar_valid = document.getElementById("car2").value;
    if (fcar_valid == "" || scar_valid == "") {
      $(".compare-msg").css("display", "none");
    }
  } else {
    if (fcar == "") {
      var car1 = vall.split("||");
      var car1make = car1[0];
      car1make = car1make.replace(/-/gi, " ");
      var car1model = car1[1];
      car1model = car1model.replace(/-/gi, " ");
      var car1variant = car1[2];
      car1variant = car1variant.replace(/-/gi, " ");
      car12variant = car1variant.replace(/@/gi, "");
      vall = vall.replace(/@/gi, "");
      document.getElementById("car1").value = vall;
      SetCookieInDays("compcar1", vall, 365);
      if (vall3 != "") {
        document.getElementById("car1img").value = vall3;
      }

      document.getElementById("edit_car1").style.display = "none";
      document.getElementById("cardetails1").style.display = "table-cell";
      document.getElementById("compPopdownImg1").src = vall3;
      document.getElementById("compPopDownTit1").innerHTML =
        car1[0] + " " + car1[1];
      document.getElementById("compPopDownsTit1").innerHTML = car12variant;
      document.getElementById("compPopDownPrice1").innerHTML = price;
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) + 1;
    } else if (scar == "") {
      var car2 = vall.split("||");
      var car2make = car2[0];
      car2make = car2make.replace(/-/gi, " ");
      var car2model = car2[1];
      car2model = car2model.replace(/-/gi, " ");
      var car2variant = car2[2];
      car22variant = car2variant.replace(/@/gi, "");
      vall = vall.replace(/@/gi, "");
      car23variant = car22variant.replace(/-/gi, " ");
      document.getElementById("car2").value = vall;
      SetCookieInDays("compcar2", vall, 365);
      if (vall3 != "") {
        document.getElementById("car2img").value = vall3;
      }
      document.getElementById("edit_car2").style.display = "none";
      document.getElementById("cardetails2").style.display = "table-cell";
      document.getElementById("compPopdownImg2").src = vall3;
      document.getElementById("compPopDownTit2").innerHTML =
        car2[0] + " " + car2[1];
      document.getElementById("compPopDownsTit2").innerHTML = car23variant;
      document.getElementById("compPopDownPrice2").innerHTML = price;
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) + 1;
    } else {
      $('input:checkbox[value="' + vall + '"]').prop("checked", false);
      $(".compare-msg").css("display", "block");
      $(".compare-msg").html("You are not allowed to compare more then 2 cars as of now. We are working on increasing the number in your consideration set.");
      $(".compare-msg").delay(3000).fadeOut();
    }

    var fcar_valid = document.getElementById("car1").value;
    var scar_valid = document.getElementById("car2").value;
  }
}

function show_compare_block() {
  if (document.getElementById("compareBasketCount")) {
    count = document.getElementById("compareBasketCount").innerHTML;
    if (count >= 1) {
      $(".compare_btm_block").toggleClass("move_top");
    }
  }
}

function comparenowit() {
  var car1 = document.getElementById("car1").value;
  car1 = car1.replace("||", "-").replace("||", "-").replace("||", "-");

  var car2 = document.getElementById("car2").value;
  car2 = car2.replace("||", "-").replace("||", "-").replace("||", "-");

  if (car1 == "" && car2 == "") {
    $(".compare-msg").css("display", "block");
    $(".compare-msg").html("Select atleast 2 cars to compare");
    $(".compare-msg").delay(3000).fadeOut();
    return false;
  }
  if (car1 == "" || car2 == "") {
    $(".compare-msg").css("display", "block");
    $(".compare-msg").html("Please select one more car to compare.");
    $(".compare-msg").delay(3000).fadeOut();
    return false;
  }

  var makeMask1 = document.getElementById("make1").dataset.mask;
  var modelMask1 = document.getElementById("model1").dataset.mask;
  var variantId1 = document.getElementById("version_id1").value;
  var makeMask2 = document.getElementById("make2").dataset.mask;
  var modelMask2 = document.getElementById("model2").dataset.mask;
  var variantId2 = document.getElementById("version_id2").value;
  
    let isSameModel =  isSameModelComparison([modelMask1, modelMask2]);
    let url = "";
    if(isSameModel) {
        let variantMask1 = document.getElementById("variant1").dataset.mask;
        let variantMask2 = document.getElementById("variant2").dataset.mask;

        let versionArray = [
            {
                "id": variantId1,
                "maskingName" : variantMask1
            },
            {
                "id": variantId2,
                "maskingName" : variantMask2
            },
        ];
        let orderedVersionArray = versionArray.sort(function(a, b) {
            return parseInt(a.id) - parseInt(b.id);
        });
        url = "/compare-cars/" + makeMask1 + "-" + modelMask1 + "-" + orderedVersionArray[0].maskingName + "-vs-" + orderedVersionArray[1].maskingName;
        let versionIdsString = orderedVersionArray[0].id + "-" + orderedVersionArray[1].id;
        url += "-" + versionIdsString + "/";
    }
    else {
        url = "/compare-cars/" + makeMask1 + "-" + modelMask1 + "-vs-" + makeMask2 + "-" + modelMask2;
        url += "?c1=" + variantId1 + "&c2=" + variantId2;
    }
  location.href = url;
}

//Check if it is same model comparison
function isSameModelComparison(modelMaskingNames) {
    let firstModelMaskingName = modelMaskingNames[0];
    return modelMaskingNames.filter(val => val != "").every(val => val == firstModelMaskingName);
}

function close_popcar(id) {
  if (document.getElementById("compareBasketCount")) {
    vall = $("#car" + id + "").val();
    var car = vall.split("||");
    var version_id = car[3];
    version_id = version_id.replace(/-/gi, " ");

    $("#compare-vrsn_" + version_id + "").removeClass("checked");
    $("#compare-vrsn_" + version_id + "").addClass("unchecked");
    $("#gogo-" + version_id + "").prop("checked", false);
    $("#car" + id + "").val("");
    document.getElementById("car" + id + "img").value = "";
    $("#cardetails" + id).css("display", "none");
    $("#edit_car" + id).css("display", "table-cell");
    count = parseInt(document.getElementById("compareBasketCount").innerHTML);
    DeleteCookie("compcar" + id);
    DeleteCookie("compcar" + id + "masking");
    DeleteCookie("compcar" + id + "price");
    DeleteCookie("compcar" + id + "img");
    document.getElementById("compareBasketCount").innerHTML =
      parseInt(count) - 1;
    if (
      parseInt(document.getElementById("compareBasketCount").innerHTML) == 0
    ) {
      $(".compare_btm_block").removeClass("top_cls");
      $(".compare_btm_block").removeClass("move_top");
    } else {
      //$('#cardetails'+id).css("display","none");
      //$('#edit_car'+id).css("display","table-cell");
    }
  }
}

var ccars = 0;
var imag = "";
var variants_list = "";

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
          var popular_label =
            "<li class='listGroupTitle'><strong>Popular Makes</strong></li>";
          var other_label =
            "<li class='listGroupTitle'><strong>Others</strong></li>";
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
        headers: { 'ServerDomain': 'CarWale' },
        contentType: "application/json",
        success: function (response) {
          $.each(response.variants, function (key, item) {
            var li_data =
              "<li data-value=" +
              response.variants[key].versionId +
              " data-mask=" +
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
function show_makes_list(rr) {
    ccars = rr;
    document.getElementById("back").onclick = function () {
      getMake_close();
    };
    document.getElementById("make_val").innerHTML = "Select Car";
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("make_drp").style.display = "block";
    document.getElementById("model_drp").style.display = "none";
    document.getElementById("varient_drp").style.display = "none";
  
    $("#select_make").empty();
    GetMMVData.getMakesForM();
}

function getMake_close() {
  document.getElementById("main_drp").style.display = "none";
  document.getElementById("make_drp").style.display = "none";
  document.getElementById("model_drp").style.display = "none";
}

function getModel_close() {
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("make_val").innerHTML = "Select Car";
  document.getElementById("back").onclick = function () {
    getMake_close();
  };
  document.getElementById("make_drp").style.display = "block";
  document.getElementById("model_drp").style.display = "none";
}


// Funtion to create dynamic html for model list.
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
  $("#version_id" + ccars).val("");
  $("#car" + ccars + "img").val("");
  $("#price" + ccars).val("");
  $("#price" + ccars).attr("data-label", "");

  document.getElementById("back").onclick = function () {
    getModel_close();
  };
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("make_drp").style.display = "none";
  document.getElementById("model_drp").style.display = "block";
  document.getElementById("varient_drp").style.display = "none";
}

// Funtion to create dynamic html for model list.
function setModels_new(vals) {
  var list = "";
  var make = document.getElementById("make" + ccars).value;
  for (i in vals) {
    list +=
      "<li onclick=\"setValues('" +
      make +
      "','" +
      vals[i] +
      "')\">" +
      vals[i] +
      "</li>";
  }
  document.getElementById("model_list").innerHTML = list;
}

// Funtion to create dynamic html for variant list.
function setVariants_n(valss) {
  var list = "";
  variants_list = valss;
  for (i in valss) {
    list += "<li onclick=\"setValues2('" + i + "')\">" + valss[i] + "</li>";
  }
  document.getElementById("varient_list").innerHTML = list;
}

// Funtion to fetch variant list based on make & model name.
function setValues(obj) {
  document.getElementById("main_drp").style.display = "block";
  document.getElementById("make_drp").style.display = "none";
  document.getElementById("model_drp").style.display = "none";
  document.getElementById("varient_drp").style.display = "block";

  // set model
  document.getElementById("make_val").innerHTML =
  document.getElementById("make_val").innerHTML + " " + obj.textContent;
  document.getElementById("model" + ccars).value = obj.textContent;
  $("#model" + ccars).attr("data-mask", obj.dataset.mask);
  SetCookieInDays("compcar" + ccars + "masking", $("#make" + ccars).attr("data-mask") + "||" + obj.dataset.mask, 365);

  document.getElementById("cccooko"+ccars).value =     document.getElementById("make_val").innerHTML + " " + obj.textContent;
  document.getElementById("model" + ccars).value = obj.textContent;
        

  // reset variant
  $("#varient_list").empty();
  GetMMVData.getversionsForM(obj.dataset.value);
  $("#variant" + ccars).val(val);
  $("#variant" + ccars).attr("data-mask", "");
  $("#version_id" + ccars).val("");
  $("#car" + ccars + "img").val("");
  $("#price" + ccars).val("");
  $("#price" + ccars).attr("data-label", "");
}

function setValues2(obj) {
  document.getElementById("main_drp").style.display = "none";
  document.getElementById("make_drp").style.display = "none";
  document.getElementById("model_drp").style.display = "none";
  document.getElementById("varient_drp").style.display = "none";

  // set variant
  document.getElementById("variant" + ccars).value = obj.textContent;
  $("#variant" + ccars).attr("data-mask", obj.dataset.mask);
  document.getElementById("version_id"+ccars).value = obj.dataset.value;
  $("#car" + ccars + "img").val("https://imgd-ct.aeplcdn.com/160x89"+ obj.dataset.imagepath);
  SetCookieInDays("compcar" + ccars + "img", "https://imgd-ct.aeplcdn.com/160x89"+ obj.dataset.imagepath, 365);
  $("#price" + ccars).val(obj.dataset.price);
  SetCookieInDays("compcar" + ccars + "price", obj.dataset.price, 365);
  $("#price" + ccars).attr("data-label", obj.dataset.label);

  getimages();
}

// Function to display details for selected car.
function getimages() {
  var image =$("#car" + ccars + "img").val();
  var price = $("#price" + ccars).val();

  var make = '';
	var model = '';
	var variant = '';
	var response = '';
        var make_model = document.getElementById("cccooko"+ccars).value;
        make = document.getElementById('make'+ccars).value;
	      model = document.getElementById('model'+ccars).value;
        var makemodel = make+"||"+model;
        variant = document.getElementById('variant'+ccars).value;
        variant_id = document.getElementById("version_id"+ccars).value;
        var mmvi =  makemodel+"||"+variant+"||"+variant_id;
        var first_current_car = document.getElementById("car1").value;
        var second_current_car = document.getElementById("car2").value;


        if(mmvi == second_current_car || mmvi == first_current_car){
                        $(".compare-msg").css('display','block');
                        $(".compare-msg").html("Invalid Comparision"); 
                        $(".compare-msg").delay(3000).fadeOut(); 
                        return false;        
        }else{
                    versions_addtocomparelist(mmvi,image,false,price,variant_id,'byform');                                
        }
}