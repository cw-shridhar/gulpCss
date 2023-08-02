setTimeout("getMake()", "500");
// Get Make Data
function getMake() {
  var url = "/api/v2/makes/?shouldSortByPopularity=true";
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "GET",
      url: url,
      headers: { 'ServerDomain': 'CarWale' },
      success: function (response) {
        $.each(response, function (key) {
          for (var i = 1; i <= 3; i++) {
            var li_data =
              '<li class="option" onblur="setoptionmake(\'' +
              response[key].makeId +
              "', '" +
              response[key].makeName +
              "', " +
              i +
              ", '" +
              response[key].maskingName + 
              '\')" onclick="setoptionmake(\'' +
              response[key].makeId +
              "', '" +
              response[key].makeName +
              "'," +
              i +
              ", '" +
              response[key].maskingName + 
              '\')" data-option=' +
              i +
              ">" +
              response[key].makeName +
              "</li>";
            $(li_data).appendTo("#slctmake" + i);
          }
        });
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}
function hanUndefined(val) {
  if (val == undefined || val == "undefined") {
      return "";
  }
  return val;
}
//On Page Load Cookies Ref Code.
function pageLoad() {
  var page = "new-cars";
  var pram = "on-road-price";
  //var cookies = formcookies();
  var compcar1 = hanUndefined($.cookie("compcar1"));
  var compcar2 = hanUndefined($.cookie("compcar2"));
  var compcar3 = hanUndefined($.cookie("compcar3"));
  var compcar1img = hanUndefined($.cookie("compcar1img"));
  var compcar2img = hanUndefined($.cookie("compcar2img"));
  var compcar3img = hanUndefined($.cookie("compcar3img"));
  var cccc1 =
    "gogo-" + document.getElementById("cccooko1").value.replace(/ /g, "||");
  var cccc2 =
    "gogo-" + document.getElementById("cccooko2").value.replace(/ /g, "||");
  var cccc3 =
    "gogo-" + document.getElementById("cccooko3").value.replace(/ /g, "||");
  try {
    if (compcar1) {
      document.getElementById("gogo-" + compcar1).checked = true;
    }
  } catch (e) {}
  try {
    if (compcar2) {
      document.getElementById("gogo-" + compcar2).checked = true;
    }
  } catch (e) {}
  try {
    if (compcar3) {
      document.getElementById("gogo-" + compcar3).checked = true;
    }
  } catch (e) {}
  var count = 0;
  // if (page == "new-cars" && pram == "on-road-price") {
  //   compcar1 = cookies["compcar1"] = cars;
  //   compcar1img = cookies["compcar1img"] = dimg;
  // }
  if (compcar1) {
    count++;
    var cc = compcar1.split("||");
    var cct = cc[2].replace(/\@/g, "||");
    var titdes = cc[0] + " " + cc[1];
    var titdes1 = cct;
    var mmvi = cc[0] + "||" + cc[1] + "||" + cct + "||" + cc[3];
    document.getElementById("cccooko1").value = titdes;
    document.getElementById("car1").value = mmvi;
    document.getElementById("car1img").value = compcar1img;
    document.getElementById("compPopdownImg1").src = compcar1img;
    document.getElementById("edt_car1").style.display = "none";
    document.getElementById("cardetails1").style.display = "block";
    titdes = titdes.replace(/-/gi, " ");
    titdes1 = titdes1.replace(/-/gi, " ");
    document.getElementById("compPopDownTit1").innerHTML = titdes;
    document.getElementById("compPopDownsTit1").innerHTML = titdes1;
  } else {
    document.getElementById("edt_car1").style.display = "block";
    document.getElementById("cardetails1").style.display = "none";
  }
  if (compcar2) {
    count++;
    var cc = compcar2.split("||");
    var cct = cc[2].replace(/\@/g, "||");
    var titdes = cc[0] + " " + cc[1];
    var titdes1 = cct;
    var mmvi = cc[0] + "||" + cc[1] + "||" + cct + "||" + cc[3];
    document.getElementById("cccooko2").value = titdes;
    document.getElementById("car2").value = mmvi;
    document.getElementById("car2img").value = compcar2img;
    document.getElementById("compPopdownImg2").src = compcar2img;
    document.getElementById("edt_car2").style.display = "none";
    document.getElementById("cardetails2").style.display = "block";
    titdes = titdes.replace(/-/gi, " ");
    titdes1 = titdes1.replace(/-/gi, " ");
    document.getElementById("compPopDownTit2").innerHTML = titdes;
    document.getElementById("compPopDownsTit2").innerHTML = titdes1;
  } else {
    document.getElementById("edt_car2").style.display = "block";
    document.getElementById("cardetails2").style.display = "none";
  }
  if (compcar3) {
    count++;
    var cc = compcar3.split("||");
    var cct = cc[2].replace(/\@/g, "||");
    var titdes = cc[0] + " " + cc[1];
    var titdes1 = cct;
    var mmvi = cc[0] + "||" + cc[1] + "||" + cct + "||" + cc[3];
    document.getElementById("cccooko3").value = titdes;
    document.getElementById("car3").value = mmvi;
    document.getElementById("car3img").value = compcar3img;
    document.getElementById("compPopdownImg3").src = compcar3img;
    document.getElementById("edt_car3").style.display = "none";
    document.getElementById("cardetails3").style.display = "block";
    titdes = titdes.replace(/-/gi, " ");
    titdes1 = titdes1.replace(/-/gi, " ");
    document.getElementById("compPopDownTit3").innerHTML = titdes;
    document.getElementById("compPopDownsTit3").innerHTML = titdes1;
  } else {
    document.getElementById("edt_car3").style.display = "block";
    document.getElementById("cardetails3").style.display = "none";
  }
  document.getElementById("compareBasketCount").innerHTML = count;
  if(count > 0){
    var ht = Number(
      document.getElementById("carCompareTopbar").style.height.replace("px", "")
    );
    if (ht < 85) {
      ht = Number(ht + 2);
      document.getElementById("carCompareTopbar").style.height = ht + "px";
      setTimeout("ShowCompareBar()", 5);
    }
  }
}

function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}

function ShowCompareBar() {
    var cn = document.getElementById("showcomaprecount").className;
    var did = document.getElementById("showcomaprecount");
    if (cn == "carcompareBtn caract") {
      document.getElementById("carCompareTopbar").style.display = "block";
      var ht = Number(
        document.getElementById("carCompareTopbar").style.height.replace("px", "")
      );
      if (ht < 85) {
        ht = Number(ht + 2);
        document.getElementById("carCompareTopbar").style.height = ht + "px";
        setTimeout("ShowCompareBar()", 5);
      } else {
        document.getElementById("carCompareTopbar").style.overflow = "";
        did.className = did.className.replace(
          "carcompareBtn caract",
          "carcompareBtn carcmpActive"
        );
        //   _gtm_push("new-cars", "comparision", location.pathname, "event new-cars");
        //   var addinfo = "?" + "section=car-comparision&page_type=compare bar";
        //   _gtm_vpv_push_datalayer(
        //     "/" + "vpv" + location.pathname + "/comparision" + addinfo
        //   );
        $(".carCompareBtmbar").hide();
      }
    }
    if (cn == "carcompareBtn carcmpActive") {
      document.getElementById("carCompareTopbar").style.overflow = "hidden";
      var het = Number(
        document.getElementById("carCompareTopbar").style.height.replace("px", "")
      );
      if (het != 0) {
        het = Number(het - 2);
        document.getElementById("carCompareTopbar").style.height = het + "px";
        setTimeout("ShowCompareBar()", 5);
      } else {
        document.getElementById("carCompareTopbar").style.display = "none";
        did.className = did.className.replace(
          "carcompareBtn carcmpActive",
          "carcompareBtn caract"
        );
        $(".carCompareBtmbar").show();
      }
    }

}

function showCompareBlock(obj) {
  if (obj.checked == true) {
      var x = document.getElementsByClassName('carCompareBtmbar');
      x[0].style.visibility = 'visible'
  }
}

// Add To CompareList
function addtocomparelist3(vall, vall3, checked) {
  var date = new Date();
  //document.getElementById("carCompareTopbar").style.display = "block";
  var ht = Number(
    document.getElementById("carCompareTopbar").style.height.replace("px", "")
  );
  if (ht < 85) {
    ht = Number(ht + 2);
    document.getElementById("carCompareTopbar").style.height = ht + "px";
    setTimeout("ShowCompareBar()", 5);
  }
  var fcar = document.getElementById("car1").value;
  var scar = document.getElementById("car2").value;
  var tcar = document.getElementById("car3").value;
  var count = 0;
  if (fcar == vall || scar == vall || tcar == vall) {
    if (fcar == vall && checked === false) {
        date.setTime(date.getDate() - 1);
        var expires = date.toGMTString();
      DeleteCookie("compcar1");
      DeleteCookie("compcar1masking");
      DeleteCookie("compcar1price");
      DeleteCookie("compcar1img");
      document.getElementById("car1").value = "";
      document.getElementById("car1img").value = "";
      document.getElementById("edt_car1").style.display = "block";
      document.getElementById("cardetails1").style.display = "none";
      $("#edit_car1").css("display", "none");
      $("#sel_car1").css("display", "block");
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) - 1;
    } else if (scar == vall && checked === false) {
        date.setTime(date.getDate() - 1);
        var expires = date.toGMTString();
      DeleteCookie("compcar2");
      DeleteCookie("compcar2masking");
      DeleteCookie("compcar2price");
      DeleteCookie("compcar2img");
      document.getElementById("car2").value = "";
      document.getElementById("car2img").value = "";
      document.getElementById("edt_car2").style.display = "block";
      document.getElementById("cardetails2").style.display = "none";
      $("#edit_car2").css("display", "none");
      $("#sel_car2").css("display", "block");
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) - 1;
    } else if (tcar == vall && checked === false) {
        date.setTime(date.getDate() - 1);
        var expires = date.toGMTString();
      DeleteCookie("compcar3");
      DeleteCookie("compcar3masking");
      DeleteCookie("compcar3price");
      DeleteCookie("compcar3img");
      document.getElementById("car3").value = "";
      document.getElementById("car3img").value = "";
      document.getElementById("edt_car3").style.display = "block";
      document.getElementById("cardetails3").style.display = "none";
      $("#edit_car3").css("display", "none");
      $("#sel_car3").css("display", "block");
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) - 1;
    }
    var fcar_valid = document.getElementById("car1").value;
    var scar_valid = document.getElementById("car2").value;
    var tcar_valid = document.getElementById("car3").value;
    if (fcar_valid == "" || scar_valid == "" || tcar_valid == "") {
      $(".err_compare_msg").html("");
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
      var car12variant = car1variant.replace(/@/gi, "");
      var modelVariant = car1[3].split('-');
      var modelId = modelVariant[0];
      var versionId = modelVariant[1];
      vall = vall.replace(/@/gi, "");
      document.getElementById("car1").value = vall;
      SetCookieInDays("compcar1", vall, 365);
      if (vall3 != "") {
        document.getElementById("car1img").value = vall3;
      }
      if (vall3 == "") {
        document.getElementById("car1img").value = document.getElementById(
          "carImageHolder" + car1model
        ).src;
      }
      document.getElementById("edt_car1").style.display = "none";
      document.getElementById("cardetails1").style.display = "block";
      document.getElementById("compPopdownImg1").src = vall3;
      document.getElementById("compPopDownTit1").innerHTML =
        car1make + " " + car1model;
      document.getElementById("compPopDownsTit1").innerHTML = car12variant;
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        var expires = date.toGMTString();
        document.cookie =
          "compcar1=" +
          vall +
          "; expires=" +
          expires +
          "; path=/; domain=" +
          defaultCookieDomain;
        document.cookie =
          "compcar1img=" +
          vall3 +
          "; expires=" +
          expires +
          "; path=/; domain=" +
          defaultCookieDomain;
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) + 1;
      document.getElementById("crossbutton1").innerHTML = "x";
    } else if (scar == "") {
      var car2 = vall.split("||");
      var car2make = car2[0];
      car2make = car2make.replace(/-/gi, " ");
      var car2model = car2[1];
      car2model = car2model.replace(/-/gi, " ");
      var car2variant = car2[2];
      var car22variant = car2variant.replace(/@/gi, "");
      vall = vall.replace(/@/gi, "");
      var car23variant = car22variant.replace(/-/gi, " ");
      document.getElementById("car2").value = vall;
      SetCookieInDays("compcar2", vall, 365);
      if (vall3 != "") {
        document.getElementById("car1img").value = vall3;
      }
      if (vall3 == "") {
        document.getElementById("car2img").value = document.getElementById(
          "carImageHolder" + car2model
        ).src;
      }
      document.getElementById("edt_car2").style.display = "none";
      document.getElementById("cardetails2").style.display = "block";
      document.getElementById("compPopdownImg2").src = vall3;
      document.getElementById("compPopDownTit2").innerHTML =
        car2make + " " + car2model;
      document.getElementById("compPopDownsTit2").innerHTML = car23variant;
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        var expires = date.toGMTString();
        document.cookie =
          "compcar2=" +
          vall +
          "; expires=" +
          expires +
          "; path=/; domain=" +
          defaultCookieDomain;
        document.cookie =
          "compcar2img=" +
          vall3 +
          "; expires=" +
          expires +
          "; path=/; domain=" +
          defaultCookieDomain;
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) + 1;
      document.getElementById("crossbutton2").innerHTML = "x";
    } else if (tcar == "") {
      var car3 = vall.split("||");
      var car3make = car3[0];
      car3make = car3make.replace(/-/gi, " ");
      var car3model = car3[1];
      car3model = car3model.replace(/-/gi, " ");
      var car3variant = car3[2];
      car3variant = car3variant.replace(/-/gi, " ");
      var car31variant = car3variant.replace(/@/gi, "");
      vall = vall.replace(/@/gi, "");
      document.getElementById("car3").value = vall;
      SetCookieInDays("compcar3", vall, 365);
      if (vall3 != "") {
        document.getElementById("car1img").value = vall3;
      }
      if (vall3 == "") {
        document.getElementById("car3img").value = document.getElementById(
          "carImageHolder" + car3model
        ).src;
      }
      document.getElementById("edt_car3").style.display = "none";
      document.getElementById("cardetails3").style.display = "block";
      document.getElementById("compPopdownImg3").src = vall3;
      document.getElementById("compPopDownTit3").innerHTML =
        car3make + " " + car3model;
      document.getElementById("compPopDownsTit3").innerHTML = car31variant;
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        var expires = date.toGMTString();
        document.cookie =
          "compcar3=" +
          vall +
          "; expires=" +
          expires +
          "; path=/; domain=" +
          defaultCookieDomain;
        document.cookie =
          "compcar3img=" +
          vall3 +
          "; expires=" +
          expires +
          "; path=/; domain=" +
          defaultCookieDomain;
      document.getElementById("compareBasketCount").innerHTML =
        parseInt(document.getElementById("compareBasketCount").innerHTML) + 1;
      document.getElementById("crossbutton3").innerHTML = "x";
    } else {
      $('input:checkbox[value="' + vall + '"]').prop("checked", false);
      $(".err_compare_msg").html(
        "The compare basket is full. To change your comparison, please remove one or more of selected cars & proceed."
      );
    }
    var fcar_valid = document.getElementById("car1").value;
    var scar_valid = document.getElementById("car2").value;
    var tcar_valid = document.getElementById("car3").value;
    if (fcar_valid != "" && scar_valid != "" && tcar_valid != "") {
    } else if (
      (fcar_valid != "" && scar_valid != "") ||
      (scar_valid != "" && tcar_valid != "") ||
      (tcar_valid != "" && fcar_valid != "")
    ) {
      $(".err_compare_msg").html("");
    }
  }
}
// Del From Comparelist
function delfromcomparelist(vall) {
  var date = new Date();
  date.setTime(date.getDate() - 1);
  var expires = date.toGMTString();
  var cookval = getCookie("compcar" + vall);
  var cookval = "";
  try {
    cookval = cookval.replace(/@/gi, "");
  } catch (e) {}
  var inputidtouncheck = "gogo-" + cookval;
  if (document.getElementById(inputidtouncheck)) {
    document.getElementById(inputidtouncheck).checked = false;
  }
    document.cookie =
      "compcar" +
      vall +
      "=; expires=" +
      expires +
      "; path=/; domain=" +
      defaultCookieDomain;
    document.cookie =
      "compcar" +
      vall +
      "img=; expires=" +
      expires +
      "; path=/; domain=" +
      defaultCookieDomain;
  try {
    var cars_d = document.getElementById("car" + vall).value;
    if (cars_d) {
      $('input:checkbox[value="' + cars_d + '"]').prop("checked", false);
    }
  } catch (e) {}
  $("#car" + vall).val("");
  $("#car" + vall + "img").val("");
  document.getElementById("edt_car" + vall).style.display = "block";
  document.getElementById("cardetails" + vall).style.display = "none";
  document.getElementById("sel_car" + vall).style.display = "block";
  document.getElementById("edit_car" + vall).style.display = "none";
  $("#compareBasketCount").html(parseInt($("#compareBasketCount").html()) - 1);
  $("#crossbutton" + vall).html("");
}

function openTab(evt, Name, tab_nme) {
  document.getElementById("tab_make" + evt).style.display = "none";
  document.getElementById("tab_model" + evt).style.display = "none";
  document.getElementById("tab_type" + evt).style.display = "none";
  document.getElementById("t_make" + evt).className = "tablinks cell";
  document.getElementById("t_model" + evt).className = "tablinks cell";
  document.getElementById("t_type" + evt).className = "tablinks cell";
  document.getElementById(Name).style.display = "block";
  document.getElementById(tab_nme).className += " active";
}
function edit_carinfo(i, type) {
  event.preventDefault();
  if (!type) {
    type = 0;
  }
  $("#current_edit_car").val("gogo-" + $("#car" + i).val());
  $("#edt_car" + i).css("display", "block");
  $("#edit_car" + i).css("display", "none");
  $("#make" + i).val("");
  $("#model" + i).val("");
  $("#variant" + i).val("");
  $("#edit_car" + i).css("display", "block");
  openTab(i, "tab_make" + i, "t_make" + i);
  $("#slctmake" + i).css("display", "block");
  $("#t_model" + i).css("display", "none");
  $("#t_type" + i).css("display", "none");
  DeleteCookie("compcar" + i);
  DeleteCookie("compcar" + i + "masking");
  DeleteCookie("compcar" + i + "price");
  DeleteCookie("compcar" + i + "img");
  if (type == 1) {
    $("#sel_car" + i).css("display", "block");
  } else {
    $("#sel_car" + i).css("display", "none");
  }
}

function showmakes_list(id) {
  if ($("#make" + id).val() != "") {
    $("#slctmake" + id).slideToggle(260);
    $("#slctmodel" + id).hide(260);
  }
  setTimeout(function () {
    $(".slctmake").hide(260);
  }, 45000);
}
function showmodels_list(id) {
  $("#slctmodel" + id).slideToggle(260);
  $("#slctvarnt" + id).hide(260);
  setTimeout(function () {
    $(".slctmodel").hide(260);
  }, 45000);
}
function showvars_list(id) {
  $("#slctvarnt" + id).slideToggle(260);
  setTimeout(function () {
    $(".slctvarnt").hide(260);
  }, 45000);
}

function setoptionmake(makeId, makeName, id, makeMaskingName) {
    $("#slctmakeval" + id).text(makeName);
    $("#make" + id).val(makeName);
    $("#make" + id).attr("data-mask", makeMaskingName);
    getModel(id, makeId);
    $("#makevalue" + id).html(makeName);
    openTab(id, "tab_model" + id, "t_model" + id);
    $("#slctmodeval" + id).text("Select Model");
    $("#slctvarval" + id).text("Select Variant");
    $("#slctvarnt" + id).html("");
    $("#slctvarnt" + id).hide();
    $("#typevalue" + id).html(makeName);
    $("#model" + id).val("");
}

function getModel(id, makeId) {
  var url = "/api/models/?type=new&makeId=" + makeId;
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "GET",
      url: url,
      headers: { 'ServerDomain': 'CarWale' },
      success: function (response) {
        setModels(response, id);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}
function setModels(modellist, id) {
  var options = "";
  for (let model of modellist) {
    options +=
      '<div class="option" onblur="setoptionmodel(\'' +
      model.ModelId +
      "', '" +
      model.ModelName +
      "', " +
      id +
      ", '" +
      model.MaskingName +
      '\')" onclick="setoptionmodel(\'' +
      model.ModelId +
      "', '" +
      model.ModelName +
      "'," +
      id +
      ", '" +
      model.MaskingName +
      '\')" data-option=' +
      id +
      ">" +
      model.ModelName +
      "</div>";
  }
  $("#slctmake" + id).css("display", "none");
  $("#selmodel" + id).attr("class", "frmCtrl selectDDCust selmodel");
  $("#t_model" + id).css("display", "inline-block");
  $("#slctmodel" + id).show();
  $("#slctmodel" + id).html(options);
}
function setoptionmodel(modelId, modelName, id, modelMaskingName) {
    $("#slctmodeval" + id).text(modelName);
    $("#model" + id).val(modelName);
    $("#model" + id).attr("data-mask", modelMaskingName);
    SetCookieInDays("compcar" + id + "masking", $("#make" + id).attr("data-mask") + "||" + modelMaskingName, 365);
    var make = $("#make" + id).val();
    $("#typevalue" + id).html(make + " " + modelName);
    openTab(id, "tab_type" + id, "t_type" + id);
    $("#selvarnt" + id).css("display", "block");
    getVariant(id, modelId);
    $("#slctvarval" + id).text("Select Variant");
    $("#variant" + id).val("");
}

function getVariant(id, modelId) {
  var url =
    "/api/v3/versions/?modelId=" +
    modelId +
    "&type=new&itemIds=29,26&application=1";
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "GET",
      url: url,
      headers: { 'ServerDomain': 'CarWale' },
      success: function (response) {
        setVariants(response, id);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function setVariants(variantList, id) {
  var options = "";
  let car1 = document.getElementById("car1").value;
  let car2 = document.getElementById("car2").value;
  let car3 = document.getElementById("car3").value;
  let preSelectedVersion = [];
  if(car1) {
    preSelectedVersion.push(extractVersionId(car1));
  }
  if(car2) {
    preSelectedVersion.push(extractVersionId(car2));
  }
  if(car3) {
    preSelectedVersion.push(extractVersionId(car3));
  }
  for (let i = 0; i < preSelectedVersion.length; i++) {
    let index = variantList.variants.findIndex(v => v.versionId == parseInt(preSelectedVersion[i], 10));
    if (index >= 0) {
      variantList.variants.splice(index, 1)
    }
  }
  for (let variant of variantList.variants) {
    options +=
      '<div class="option" onblur="setoptionvarnt(\'' +
      variant.imagePath +
      "', '" +
      variant.versionId +
      "', '" +
      variant.versionName +
      "', '" +
      variant.versionMaskingName +
      "', " +
      id +
      ')" onclick="setoptionvarnt(\'' +
      variant.imagePath +
      "', '" +
      variant.versionId +
      "', '" +
      variant.versionName +
      "', '" +
      variant.versionMaskingName +
      "', " +
      id +
      ')" data-option=' +
      id +
      ">" +
      variant.versionName +
      "</div>";
  }
  $("#slctvarnt" + id).html(options);
  $("#slctmodel" + id).css("display", "none");
  $("#selvarnt" + id).attr("class", "frmCtrl selectDDCust slctvarnt");
  $("#slctvarnt" + id).show();
  $("#t_type" + id).css("display", "inline-block");
}

function extractVersionId(car) {
  return car.split("||")[3];
}

function setoptionvarnt(verImg, verId, verName, verMaskingName, id) {
  var car1_data = $("#car1").val();
  var car2_data = $("#car2").val();
  var car3_data = $("#car3").val();
  var compare_flag = 0;
  if (id > 1 && id < 3) {
    if (
      car1_data.split("||")[3] != verId &&
      verId != car3_data.split("||")[3]
    ) {
    } else {
      compare_flag = 1;
    }
  } else if (id > 2) {
    if (
      car1_data.split("||")[3] != verId &&
      verId != car2_data.split("||")[3]
    ) {
    } else {
      compare_flag = 1;
    }
  } else if (id < 2) {
    if (
      car3_data.split("||")[3] != verId &&
      verId != car2_data.split("||")[3]
    ) {
    } else {
      compare_flag = 1;
    }
  }
  if (compare_flag == 1) {
    close_popcar(id);
    return false;
  }
  var variant = verName;
  $("#slctvarval" + id).text(variant);
  $("#variant" + id).val(variant);
  $("#variant" + id).attr("data-mask", verMaskingName);
  $("#version_id" + id).val(verId);
  $("#compPopdownImg" + id).attr(
    "src",
    "https://imgd-ct.aeplcdn.com/340x192" + verImg
  );
  SetCookieInDays("compcar" + id + "img", "https://imgd-ct.aeplcdn.com/340x192" + verImg, 365);
  var makemodel = $("#typevalue" + id).text();
  $("#compPopDownTit" + id).text(makemodel);
  $("#compPopDownsTit" + id).text(variant);
  loadCarModel(id);
}

// Load Data After MMV Select
function loadCarModel(id) {
  $("#cardetails" + id).css("display", "block");
  $("#edt_car" + id).css("display", "none");
  var make = $("#make" + id).val();
  var model = $("#model" + id).val();
  var variant = $("#variant" + id).val();
  var version_id = $("#version_id" + id).val();
  var val =
    make.split(" ").join("-") +
    "||" +
    model.split(" ").join("-") +
    "||" +
    variant.split(" ").join("-") +
    "||" +
    version_id;
  var date = new Date();
  date.setTime(date.getDate() - 1);
  var expires = date.toGMTString();
  var image = $("#compPopdownImg" + id).attr("src");
  //$.cookie("CompareVersions", $.cookie("CompareVersions") +  variant_id +"|");
    document.cookie =
      "compcar" +
      id +
      "=" +
      val +
      "; expires='+expires+'; path=/;domain=" +
      defaultCookieDomain;
    document.cookie =
      "compcar" +
      id +
      "img=" +
      image +
      "; expires='+expires+'; path=/;domain=" +
      defaultCookieDomain;
  $("#car" + id).val(val);
  var basket_count = 0;
  if ($("#car1").val()) {
    basket_count++;
  }
  if ($("#car2").val()) {
    basket_count++;
  }
  if ($("#car3").val()) {
    basket_count++;
  }
  document.getElementById("compareBasketCount").innerHTML = basket_count;
  try {
    $(".err_compare_msg").html("");
    document.getElementById("gogo-" + val).checked = true;
  } catch (e) {}
  try {
    if ($("#current_edit_car").val() != "gogo-" + val) {
      document.getElementById($("#current_edit_car").val()).checked = false;
    }
  } catch (e) {}
}

// Close MMV PopUp
function close_popcar(id) {
  $("#edit_car" + id).css("display", "none");
  if ($("#car" + id).val() != "") {
    $("#sel_car" + id).css("display", "none");
    $("#cardetails" + id).css("display", "block");
  }
}

// Compare Now Click FUnction
function comparenowit() {
    var car1 = document.getElementById("car1").value;  
    var car2 = document.getElementById("car2").value;  
    var car3 = document.getElementById("car3").value;
    
    if (car1 == "" && car2 == "") {
      $(".err_compare_msg").html("Select atleast 2 cars to compare");
      return false;
    }
    if (car2 == "" && car3 == "") {
      $(".err_compare_msg").html("Select atleast 2 cars to compare");
      return false;
    }
    if (car3 == "" && car1 == "") {
      $(".err_compare_msg").html("Select atleast 2 cars to compare");
      return false;
    }
    if (car3 == "" && car1 == "" && car2 == "") {
      $(".err_compare_msg").html("Select atleast 2 cars to compare");
      return false;
    }

    var makeMask1 = $("#make1").attr("data-mask");
    var modelMask1 = $("#model1").attr("data-mask");
    var variantId1 = $("#version_id1").val();
    var makeMask2 = $("#make2").attr("data-mask");
    var modelMask2 = $("#model2").attr("data-mask");
    var variantId2 = $("#version_id2").val();
    var makeMask3 = $("#make3").attr("data-mask");
    var modelMask3 = $("#model3").attr("data-mask");
    var variantId3 = $("#version_id3").val();
    
    let isSameModel =  isSameModelComparison([modelMask1, modelMask2, modelMask3]);
    let url = "";
    if(isSameModel) {
        let variantMask1 = $("#variant1").attr("data-mask");
        let variantMask2 = $("#variant2").attr("data-mask");
        let variantMask3 = $("#variant3").attr("data-mask");

        let versionArray = [
            {
                "id": variantId1,
                "maskingName" : variantMask1
            },
            {
                "id": variantId2,
                "maskingName" : variantMask2
            },
            {
                "id": variantId3,
                "maskingName" : variantMask3
            },
        ];
        let orderedVersionArray = versionArray.sort(function(a, b) {
            return parseInt(a.id) - parseInt(b.id);
        });
        url = "/compare-cars/" + makeMask1 + "-" + modelMask1 + "-" + 
        orderedVersionArray[0].maskingName + "-vs-" + orderedVersionArray[1].maskingName;
        let versionIdsString = orderedVersionArray[0].id + "-" + orderedVersionArray[1].id;
        if(orderedVersionArray[2].maskingName) {
            url += "-vs-" + orderedVersionArray[2].maskingName;
            versionIdsString += "-" + orderedVersionArray[2].id;
        }
        url += "-" + versionIdsString + "/";
    }
    else {
        url = "/compare-cars/" + makeMask1 + "-" + modelMask1 + "-vs-" + makeMask2 + "-" + modelMask2;

        if(makeMask3 != "" && modelMask3 != "") {
            url += "-vs-" + makeMask3 + "-" + modelMask3;
        }

        url += "?c1=" + variantId1 + "&c2=" + variantId2;
        if(variantId3 != "") {
            url += "&c3=" + variantId3;
        }
    }

    location.href = url;
}
  
//Check if it is same model comparison
function isSameModelComparison(modelMaskingNames) {
    let firstModelMaskingName = modelMaskingNames[0];
    return modelMaskingNames.filter(val => val != "").every(val => val == firstModelMaskingName);
}

  // Clear Selected Cars
function clearcomparelist() {
  $(".err_compare_msg").html("");
  var car1 = document.getElementById("car1").value;
  var car2 = document.getElementById("car2").value;
  var car3 = document.getElementById("car3").value;
  if (car1) {
      delfromcomparelist(1, car1);
      $('input:checkbox[value="' + car1 + '"]').prop("checked", false);
  }
  if (car2) {
      delfromcomparelist(2, car2);
      $('input:checkbox[value="' + car2 + '"]').prop("checked", false);
  }
  if (car3) {
      delfromcomparelist(3, car3);
      $('input:checkbox[value="' + car3 + '"]').prop("checked", false);
  }
  
  for(var i = 1; i <= 3 ;i++) {
    DeleteCookie("compcar" + i);
    DeleteCookie("compcar" + i + "masking");
    DeleteCookie("compcar" + i + "price");
    DeleteCookie("compcar" + i + "img");
  }

  $(document).ready(function(){
    //var models = $.cookie("CompareVersions").split('|');
    setTimeout('pageLoad()', '500');
  });
}
