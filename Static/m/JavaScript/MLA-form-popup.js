// To select one of MLA
var firstkey;
function callMLAAPI(firstkey) {
  firstkey = firstkey;
  var mlaAreaId = areaId >= 0 ? areaId : 0;
  const mlaUrl =
    "/api/v3/campaigns/?modelid=" +
    modelId +
    "&cityid=" +
    cityId +
    "&areaid=" +
    mlaAreaId +
    "&platformid=" +
    platformId +
    "&applicationid=3" +
    "&isdealerlocator=true" +
    "&dealeradminfilter=true";
  $.ajax({
    type: "GET",
    url: mlaUrl,
    headers: { ServerDomain: "CarWale" },
    contentType: "application/json",
  })
    .done(function (mlaData) {
      // console.log(mlaData);
      if (mlaData.length > 0) {
        leadFormPopup.hide_popup1(true);
        document.getElementById("lead_user_name").textContent = txtName;
        document.getElementById("mla_popup").style.display = " block";
        mla_response(mlaData);
      } else {
        hide_mla_pop(firstkey);
      }
    })
    .fail(function () {
      // console.log("mla call submission failed.");
      hide_mla_pop(firstkey);
    });
}

// MLA Response binding
function mla_response(saveData) {
  var mla_flg = true;
  var final_saveData = [];
  var checked_status_flg = 0;
  for (i in saveData) {
    if (
      campaignId == saveData[i]["campaign"]["id"]
    ) {
      continue;
    } else {
      if (saveData[i]["campaign"]["mutualLeads"] == true) {
        if (saveData[i]["campaign"]["isTurboMla"] == true) {
          checked_status_flg++;
        }
        final_saveData.push(saveData[i]);
      }
    }
  }
  if (mla_flg == true && final_saveData["length"] > 0) {
    var append_data = "";
    var select_all_flag = "";
    var selected_cls = "";
    const images_domain = "d5x4wettsjecf.cloudfront.net";

    if (checked_status_flg == final_saveData["length"]) {
      select_all_flag = "checked";
      selected_cls = "selected_cls";
    }
    var append_data_main = "";
    append_data_main +=
      '<span class="label_p">&nbsp;</span><input type="checkbox" name="Check_All" id="Check_All" value="Check All" onClick="check_all_mla(document.myform.check_list_mla);" ' +
      select_all_flag +
      "><span></span>";
    $(".main_chkbx").html(append_data_main);
    for (i in final_saveData) {
      var area_name = "";
      var check_box_flg = "";
      var selected_cls = "";
      var area_distance_data = "";
      if (final_saveData[i]["campaign"]["isTurboMla"] == true) {
        check_box_flg = "checked";
        selected_cls = "selected_cls";
      }
      if (
        final_saveData[i]["dealerDetails"]["area"] != "" &&
        final_saveData[i]["dealerDetails"]["area"] != null
      ) {
        area_name = final_saveData[i]["dealerDetails"]["area"];
      }
      if (area_name != "") {
        area_distance_data =
          "<span class='loca'><img src='https://" +
          images_domain +
          "/images-mobiles/location.svg' class='map_icon' alt='Location' title='Location'>" +
          area_name +
          "</span>";
      }
      append_data +=
        '<div class="make_are"><div class="make_Mla"> ' +
        final_saveData[i]["campaign"]["contactName"] +
        area_distance_data +
        '</div><div class="make_chekc_Mla"><label><span class="label_p">&nbsp;</span> <input type="checkbox" name="check_list_mla" id="' +
        final_saveData[i]["campaign"]["dealerId"] +
        '" class="mla_check_id" value="' +
        final_saveData[i]["campaign"]["id"] +
        "#" +
        final_saveData[i]["campaign"]["dealerId"] +
        '" onClick="check_each();"' +
        check_box_flg +
        "><span></span></label></div></div>";
    }
    append_data += '<div class="make_are btm_padding">&nbsp;</div>';
    if (select_all_flag == "checked" || check_box_flg == "checked") {
      $("#submit_mla").removeClass("disab");
    } else {
      $("#submit_mla").addClass("disab");
    }
    if (select_all_flag == "checked") {
      $("#selall").html("Remove All");
    } else {
      $("#selall").html("Select All");
    }
    $("#dealer_checks").html(append_data);
  } else {
    hide_mla_pop(firstkey);
  }
}
function check_each() {
  var flag = 0;
  var flag2 = 0;
  if (
    $("input:checkbox.mla_check_id").length ==
    $("input:checkbox.mla_check_id:checked").length
  ) {
    $("#submit_mla").removeClass("disab");
    $("#Check_All").prop("checked", true);
    $("#selall").html("Remove All");
  } else {
    if (
      $("input:checkbox.mla_check_id").length ==
      $("input:checkbox.mla_check_id:not(:checked)").length
    ) {
      $("#submit_mla").addClass("disab");
      $("#selall").html("Select All");
    } else {
      $("#submit_mla").removeClass("disab");
      $("#selall").html("Select All");
    }
    $("#Check_All").prop("checked", false);
  }
}

// to select ore remove all MLA
function check_all_mla() {
  if (document.myform.Check_All.checked == true) {
    $(".mla_check_id").prop("checked", true);
    $("#submit_mla").removeClass("disab");
    $("#selall").html("Remove All");
  } else {
    $(".mla_check_id").prop("checked", false);
    $("#submit_mla").addClass("disab");
    $("#selall").html("Select All");
  }
}

function hide_mla_pop(key) {
  document.getElementById("mla_popup").style.display = "none";
  callRecoAPI(key);
}

// When user submit the form
function submit_mla_frm(chk) {
  var dealerids = [];
  var campids = [];
  if ($("input:checkbox.mla_check_id").length > 1) {
    for (i = 0; i < chk.length; i++) {
      if (chk[i].checked == true) {
        var camp_dealer = chk[i].value.split("#");
        dealerids.push(camp_dealer[1]);
        campids.push(camp_dealer[0]);
      }
    }
  } else {
    var camp_dealer = $("input:checkbox.mla_check_id:checked").val().split("#");
    dealerids.push(camp_dealer[1]);
    campids.push(camp_dealer[0]);
  }
  submit_mla_inquery(campids);
}
function submit_mla_inquery(campids) {
  if (campids === null || campids.length < 1) {
    return;
  }
  var carInquires = [];
  campids.forEach(function updateCarInquires(element) {
    const dealer = {
      CarDetail: {
        ModelId: modelId.toString(),
        VersionId: versionId,
      },
      Seller: {
        AssignedDealerId: targetedDealerId,
        CampaignId: element,
      },
    };
    carInquires.push(dealer);
  });
  var mlaLeadData = {
    CarInquiry: carInquires,
    EncryptedLeadId: "",
    LeadSource: {
      ABTest: abTest,
      ApplicationId: "3",
      CwCookie: cwCookies,
      IsCitySet: cityId > 0 ? 1 : 0,
      NewPageId: newPageId,
      PageId: pageId,
      PlatformId: platformId,
      PropertyId: propertyId,
      SourceType: "2",
      UtmzCookie: utmzCookie,
    },
    Others: {
      CampaignCTAText: "CT_GetBestOffers",
    },
    PrimaryEncryptedLeadId: firstkey,
    UserInfo: {
      Name: txtName,
      Mobile: txtMobile,
      Email: txtEmail,
    },
    UserLocation: {
      CityId: cityId,
      AreaId: areaId,
    },
  };
  mlaLeadData = JSON.stringify(mlaLeadData);
  $.ajax({
    type: "POST",
    url: "/api/dealer/inquiries/",
    contentType: "application/json",
    headers: { ServerDomain: "CarWale" },
    data: mlaLeadData,
  })
    .done(function (secondkey) {
      // console.log(secondkey);
      if (secondkey !== null) {
        encryptedLeadIds.push(secondkey);
      }
    })
    .fail(function () {
      // console.log("mla lead submission failed.");
      hide_mla_pop(secondkey);
    });
  hide_mla_pop(secondkey);
}

function hidepop() {
  $("#campaign_blk").hide();
  $("#lit_bg_pop").removeClass("md-show");
}
function showTypop() {
  $("#lit_bg_pop").addClass("md-show");
}
