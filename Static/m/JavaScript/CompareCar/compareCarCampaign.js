function set_utm_cookies(key, value) {
    if (getCookie(value) != "" && getCookie(value) != undefined) {
        $("#" + key).val(getCookie(value));
    } else {
        setTimeout(function() {
            set_utm_cookies(key, value);
        }, 100);
    }
}
var load_lazydata_camp = setInterval("load_lazydata_camp_fun()", 1000);
function load_lazydata_camp_fun() {
    try {
        if (typeof jQuery != "undefined" && (document.readyState == "interactive" || document.readyState == "complete")) {
            clearInterval(load_lazydata_camp);
            try {
                if ($("#lead_UtmaCookie").val() == "") {
                    set_utm_cookies('lead_UtmaCookie', '__utma');
                }
            } catch (e) {}
            try {
                if ($("#lead_UtmzCookie").val() == "") {
                    set_utm_cookies('lead_UtmzCookie', '_ctutmz');
                }
            } catch (e) {}
            if (disc_1 == 'y' && disc_2 == 'y') {
                if (!camp_price1 && !camp_price2) {
                    $(".CC_left").addClass("auto_height");
                    $(".CC_left").removeClass("card_min_height");
                } else {
                    $(".CC_left").addClass("reduce_height");
                }
            }
            if (city_cookie_js != '') {
                if (disc_1 == 'n') {
                    document.getElementById("lead_cw_model_id").value = cw_model_id1;
                    validation_campaign(getCookie('cookie_cw_cityid'), getCookie('cookie_zone_id'), 0, cw_model_id1);
                }
                if (disc_2 == 'n') {
                    setTimeout(function() {
                        document.getElementById("lead_cw_model_id").value = cw_model_id2;
                        validation_campaign(getCookie('cookie_cw_cityid'), getCookie('cookie_zone_id'), 1, cw_model_id2);
                    }, 2000);
                }
                if (cars_count > 2 && disc_3 == 'n') {
                    setTimeout(function() {
                        document.getElementById("lead_cw_model_id").value = cw_model_id3;
                        validation_campaign(getCookie('cookie_cw_cityid'), getCookie('cookie_zone_id'), 2, cw_model_id3);
                    }, 3000);
                }
            } else {
                if (disc_1 == 'n') {
                    document.getElementById("lead_cw_model_id").value = cw_model_id1;
                    validation_campaign_pan('-1', '0', 0, cw_model_id1);
                }
            }
            $(document).ready(function() {
                $(".col-3 input").val("");
                $(".input-effect input").focusout(function() {
                    if ($(this).val() != "") {
                        $(this).addClass("has-content");
                    } else {
                        $(this).removeClass("has-content");
                    }
                })
                $("#name").on("focus", function() {
                    $('#popup1').animate({
                        scrollTop: "120px"
                    }, 800);
                });
                $("#mobile").on("focus", function() {
                    $('#popup1').animate({
                        scrollTop: "150px"
                    }, 800);
                });
            });
        }
    } catch (e) {}
}
function setinputcls(val) {
    if (val != "") {
        $("#oem_email_flg,#email").addClass("has-content");
    } else {
        $("#oem_email_flg,#email").removeClass("has-content");
    }
}
function validation_campaign(cityid, zoneid, model_pos, cw_model_id_comp) {
    if (!cw_model_id_comp) {
        var modelid = document.getElementById("lead_cw_model_id").value;
    } else {
        var modelid = cw_model_id_comp;
    }
    if (modelid == 0 || cityid == "") {
        return false;
    }
    var platformid = document.getElementById("platformid").value;
    var applicationid = document.getElementById("applicationid").value;
    var count = document.getElementById("count").value;
    var pageid = document.getElementById("lead_PageId").value;
    var newpageid = document.getElementById("lead_NewPageId").value;
    var url = config_cw_api_domain + "/api/v2/campaigns/?modelid=" + modelid + "&cityid=" + cityid + "&zoneid=" + zoneid + "&platformid=" + platformid + "&applicationid=" + applicationid + "&count=" + count;
    if (modelid != "") {
        document.getElementById("model_pos").value = model_pos;
        var jqxhr = $.get(url, function(xhr, status, error) {
            camp_response(xhr, status, error, model_pos);
        }).fail(function(xhr, status, error) {
            if (model_pos == 0) {
                var meta_make = meta_make_0;
                var meta_model = meta_model_0;
            } else if (model_pos == 1) {
                var meta_make = meta_make_1;
                var meta_model = meta_model_1;
            } else if (model_pos == 2) {
                var meta_make = meta_make_2;
                var meta_model = meta_model_2;
            }
            $.post("/new-cars/", {
                "action": "save_cwdealear_campain",
                "status": xhr.status,
                "response": error,
                "ct_make_name": meta_make,
                "ct_model_name": meta_model,
                "request_url_camp": encodeURIComponent(request_url_camp),
                "modelid": modelid,
                "cityid": cityid,
                "zoneid": zoneid,
                "platformid": platformid,
                "applicationid": applicationid,
                "count": count,
                "isemailrequired": "",
                "pageid": pageid
            }, function(data) {});
        });
    }
    return false;
}
function data_priority_sort(saveData) {
    var typeonly_one = [];
    var typeonly_two = [];
    var priorityonly = [];
    for (i in saveData) {
        if (saveData[i]['type'] == 1) {
            typeonly_one[i] = i;
        } else {
            typeonly_two[i] = i;
        }
    }
    if (typeonly_one['length'] > 0) {
        for (i in typeonly_one) {
            priorityonly[typeonly_one[i]] = saveData[typeonly_one[i]];
        }
    } else if (typeonly_two['length'] > 0) {
        for (i in typeonly_two) {
            priorityonly[typeonly_two[i]] = saveData[typeonly_two[i]];
        }
    }
    var saveData_final = [];
    if (typeonly_two['length'] > 0) {
        try {
            saveData_final = priorityonly.sort(sort_by('priority', {}));
        } catch (e) {}
    } else {
        saveData_final = priorityonly;
    }
    return saveData_final;
}
function camp_response(saveData, status, xhr, model_pos) {
    var pageid = document.getElementById("lead_PageId").value;
    var newpageid = document.getElementById("lead_NewPageId").value;
    var modelid = document.getElementById("lead_cw_model_id").value;
    var platformid = document.getElementById("platformid").value;
    var applicationid = document.getElementById("applicationid").value;
    var count = document.getElementById("count").value;
    var cityid = document.getElementById("lead_cw_city_id").value;
    var lead_ct_area_id = document.getElementById("lead_ct_area_id").value;
    if (saveData) {
        var model_pos_int = parseInt(model_pos) + 1;
        var saveData_final = [];
        saveData_final = data_priority_sort(saveData);
        var saveData_str = JSON.stringify(saveData_final);
        var xhr_str = JSON.stringify(xhr);
        $(".price_btn_cta_emi_" + model_pos).show();
        $("#price_btn_cta_emi_cust_" + model_pos).show();
        $(".aro_tol_qs_" + model_pos).css("left", "67px");
        $(".aro_tol_qs_" + model_pos).css("top", "145px");
        $(".qs_tol_" + model_pos).css("top", "-162px");
        $("#price_btn_cta_emi_custemi_" + model_pos).show();
        var evtlabeltyp = "CC";
        var evtlabelvar = "null";
        if (model_pos == 0) {
            var meta_make = meta_make_0;
            var meta_model = meta_model_0;
        } else if (model_pos == 1) {
            var meta_make = meta_make_1;
            var meta_model = meta_model_1;
        } else if (model_pos == 2) {
            var meta_make = meta_make_2;
            var meta_model = meta_model_2;
        }
        _gtm_push('Get EMI Offers', 'Campaign|Displayed', evtlabeltyp + '|' + meta_make + '|' + meta_model + '|' + evtlabelvar, 'event get emi offers');
        document.getElementById("saveData_" + model_pos_int).value = saveData_str;
        document.getElementById("status_" + model_pos_int).value = status;
        document.getElementById("xhr_" + model_pos_int).value = xhr_str;
        if (model_pos == 0) {
            var meta_make = meta_make_0;
            var meta_model = meta_model_0;
        } else if (model_pos == 1) {
            var meta_make = meta_make_1;
            var meta_model = meta_model_1;
        } else if (model_pos == 2) {
            var meta_make = meta_make_2;
            var meta_model = meta_model_2;
        }
        if ($('.nopan').val() == 'nopan') {
            camp_response_model(model_pos);
            try {
                $('.nopan').val('');
            } catch (e) {}
            show_popup1();
            closecitypop_withnoaction();
        }
        var isemailrequired = "";
        var em_flg = saveData_final[0]['isEmailRequired'];
        isemailrequired = em_flg;
    } else {
        if (model_pos == 0) {
            var meta_make = meta_make_0;
            var meta_model = meta_model_0;
        } else if (model_pos == 1) {
            var meta_make = meta_make_1;
            var meta_model = meta_model_1;
        } else if (model_pos == 2) {
            var meta_make = meta_make_2;
            var meta_model = meta_model_2;
        }
        var isemailrequired = "";
        if ($('.nopan').val() == 'nopan') {
            closecitypop_withnoaction();
            try {
                $("#sry_pan_no_dealers").show();
            } catch (e) {}
        } else {
            if (city_cookie_js != '') {
                var camp_counter = parseInt($("#camp_counter").val());
                camp_counter = camp_counter + 1;
                $("#camp_counter").val(camp_counter);
                if (camp_counter == 2 && model_pos != 2) {
                    if (!camp_price1 && !camp_price2) {
                        $(".CC_left").addClass("auto_height");
                        $(".CC_left").removeClass("card_min_height");
                    } else {
                        $(".CC_left").addClass("reduce_height");
                    }
                }
                if ((disc_1 == "y" || disc_2 == "y") && (model_pos != 2)) {
                    if (!camp_price1 && !camp_price2) {
                        $(".CC_left").addClass("auto_height");
                        $(".CC_left").removeClass("card_min_height");
                    } else {
                        $(".CC_left").addClass("reduce_height");
                    }
                }
                call_opr_campaign(1, 0, document.getElementById("lead_cw_model_id").value, getCookie('cookie_cw_cityid'), 0, '', model_pos);
            } else {
                $(".price_btn_cta_emi_nopan_" + model_pos).show();
                $("#price_btn_cta_emi_nopan_cust_" + model_pos).show();
                $("#price_btn_cta_emi_nopan_custemi_" + model_pos).show();
                $(".aro_tol_qs_" + model_pos).css("left", "67px");
                $(".aro_tol_qs_" + model_pos).css("top", "145px");
                $(".qs_tol_" + model_pos).css("top", "-162px");
            }
        }
        if (model_pos == 0) {
            $("#xhr_1").val("no data");
        } else if (model_pos == 1) {
            $("#xhr_2").val("no data");
        } else if (model_pos == 2) {
            $("#xhr_3").val("no data");
        }
    }
    $.post("/new-cars/", {
        "action": "save_cwdealear_campain",
        "status": xhr.status,
        "response": JSON.stringify(saveData),
        "ct_make_name": meta_make,
        "ct_model_name": meta_model,
        "request_url_camp": encodeURIComponent(request_url_camp),
        "modelid": modelid,
        "cityid": cityid,
        "lead_ct_area_id": lead_ct_area_id,
        "platformid": platformid,
        "applicationid": applicationid,
        "count": count,
        "isemailrequired": isemailrequired,
        "pageid": pageid
    }, function(data) {});
    if (city_cookie_js == '') {
        if ($("#xhr_2").val() == "" && disc_2 == 'n') {
            document.getElementById("lead_cw_model_id").value = cw_model_id2;
            validation_campaign_pan('-1', '0', 1, cw_model_id2);
        } else if ($("#xhr_3").val() == "" && cars_count > 2 && disc_3 == 'n') {
            document.getElementById("lead_cw_model_id").value = cw_model_id3;
            validation_campaign_pan('-1', '0', 2, cw_model_id3);
        }
    }
}
function camp_response_model(model_pos) {
    if (model_pos == 0) {
        document.getElementById('lead_cw_model_id').value = cw_model_id1;
    } else if (model_pos == 1) {
        document.getElementById('lead_cw_model_id').value = cw_model_id2;
    } else if (model_pos == 2) {
        document.getElementById('lead_cw_model_id').value = cw_model_id3;
    }
    if (model_pos == 0) {
        var meta_make = meta_make_0;
        var meta_model = meta_model_0;
    } else if (model_pos == 1) {
        var meta_make = meta_make_1;
        var meta_model = meta_model_1;
    } else if (model_pos == 2) {
        var meta_make = meta_make_2;
        var meta_model = meta_model_2;
    }
    var model_pos_int = parseInt(model_pos) + 1;
    if (document.getElementById("saveData_" + model_pos_int).value != "") {
        var saveData_final = JSON.parse(document.getElementById("saveData_" + model_pos_int).value);
        var status = document.getElementById("status_" + model_pos_int).value;
        var xhr = JSON.parse(document.getElementById("xhr_" + model_pos_int).value);
        var isemailrequired = "";
        var em_flg = 'false';
        var cookie_email = '';
        var capm_type = 0;
        var dealers = '';
        var oem_dealers_list = "";
        var cookie_email = getCookie('cookie_email');
        var modelid = document.getElementById("lead_cw_model_id").value;
        var cityid = document.getElementById("lead_cw_city_id").value;
        var platformid = document.getElementById("platformid").value;
        var applicationid = document.getElementById("applicationid").value;
        var count = document.getElementById("count").value;
        var zxc = JSON.stringify(saveData_final);
        if ((zxc != null && zxc != "[]") && xhr.status == 200) {
            var myObject = eval('(' + zxc + ')');
            var dealer_name = myObject[0]["displayName"];
            var campaign_id = myObject[0]["id"];
            var campaign_type = myObject[0]["type"];
            if (meta_make == 'Renault' && campaign_type == 2) {
                document.getElementById("dealer_pop_name").innerHTML = 'Renault Dealer';
            } else {
                document.getElementById("dealer_pop_name").innerHTML = dealer_name;
            }
            document.getElementById("lead_Campaignid").value = campaign_id;
            capm_type = saveData_final[0]['type'];
            em_flg = saveData_final[0]['isEmailRequired'];
            isemailrequired = em_flg;
            try {
                dealers = saveData_final[0]['dealers'];
            } catch (e) {}
            if (dealers['length'] > 0) {
                for (var i = 0; i < dealers['length']; i++) {
                    oem_dealers_list += "<option value='" + dealers[i]['id'] + "'>" + dealers[i]['displayName'] + "</option>";
                }
            }
            try {
                document.getElementById("oem_dealers").innerHTML = '';
                document.getElementById("oem_dealers").style.display = "none";
            } catch (e) {}
            if (capm_type == 1) {
                if (em_flg == true) {
                    document.getElementById("dealer_val").value = 1;
                    if (cookie_email != '') {
                        var cls = 'has-content';
                    }
                    var oem_email = "<input type='text' name='email_first' class='inpbox effect-17  " + cls + " oem_email_flg' id='email' value='" + cookie_email + "' required onfocus='setfocusheight()' onkeyup='check_lead_email(0);' onblur='setinputcls(this.value);check_lead_email(1);'><label>Email Id</label><span></span>";
                    document.getElementById("oem_email").innerHTML = oem_email;
                    $("#oem_email").show();
                    $("#email").attr("required", "required");
                    $("#camp_step2").hide();
                    $("#camp_step3").show();
                    $(".email_flg #email").val("");
                    $(".oem_email_flg #email").val(getCookie('cookie_email'));
                } else {
                    document.getElementById("dealer_val").value = 0;
                    $("#oem_email").hide();
                    $("#email").attr("required", "false");
                    $("#camp_step2").show();
                    $("#camp_step3").hide();
                    $(".oem_email_flg #email").val("");
                    $(".email_flg #email").val(getCookie('cookie_email'));
                    document.getElementById("dealer_val").value = 0;
                }
            }
            if (capm_type == 2) {
                if (em_flg == true) {
                    try {
                        if (cookie_email != '') {
                            var cls = 'has-content';
                        }
                        var oem_email = "<input type='text' name='email_first' class='inpbox effect-17 " + cls + " oem_email_flg' id='email' value='" + cookie_email + "' required onfocus='setfocusheight()' onkeyup='check_lead_email(0);' onblur='setinputcls(this.value);check_lead_email(1);'><label>Email Id</label><span></span>";
                        document.getElementById("oem_email").innerHTML = oem_email;
                        $("#oem_email").show();
                        $("#email").attr("required", "required");
                        $("#camp_step2").hide();
                        $("#camp_step3").show();
                        $(".email_flg #email").val("");
                        $(".oem_email_flg #email").val(getCookie('cookie_email'));
                    } catch (e) {}
                    if (dealers['length'] > 1) {
                        try {
                            document.getElementById("oem_dealers").style.display = "block";
                        } catch (e) {}
                        oem_dealers = "<select name='dealers' class='inpbox' id='dealers' onchange='setActive();check_lead_dealer(0)'><option value='0'>Select A Dealer</option>" + oem_dealers_list + "</select><span></span>";
                        document.getElementById("oem_dealers").innerHTML = oem_dealers;
                        document.getElementById("dealer_val").value = 3;
                        document.getElementById("dealer_val").value = 3;
                    } else if (dealers['length'] == 1) {
                        try {
                            document.getElementById("oem_dealers").style.display = "none";
                        } catch (e) {}
                        oem_dealers = "<select name='dealers' class='inpbox' id='dealers' onchange='check_lead_dealer(0)'>" + oem_dealers_list + "</select><span></span>";
                        document.getElementById("oem_dealers").innerHTML = oem_dealers;
                        document.getElementById("dealer_val").value = 3;
                        document.getElementById("dealers").style.display = "none";
                        document.getElementById("dealer_val").value = 3;
                    } else {
                        try {
                            document.getElementById("oem_dealers").innerHTML = '';
                            document.getElementById("oem_dealers").style.display = "none";
                            document.getElementById("dealer_val").value = 1;
                        } catch (e) {}
                        document.getElementById("dealer_val").value = 1;
                    }
                } else {
                    $("#oem_email").hide();
                    $("#email").attr("required", "false");
                    $("#camp_step2").show();
                    $("#camp_step3").hide();
                    $(".oem_email_flg #email").val("");
                    $(".email_flg #email").val(getCookie('cookie_email'));
                    if (dealers['length'] > 1) {
                        try {
                            document.getElementById("oem_dealers").style.display = "block";
                        } catch (e) {}
                        oem_dealers = "<select name='dealers' class='inpbox' id='dealers' onchange='setActive();check_lead_dealer(0)'><option value='0'>Select A Dealer</option>" + oem_dealers_list + "</select><span></span>";
                        document.getElementById("oem_dealers").innerHTML = oem_dealers;
                        document.getElementById("dealer_val").value = 2;
                        document.getElementById("dealer_val").value = 2;
                    } else if (dealers['length'] == 1) {
                        try {
                            document.getElementById("oem_dealers").style.display = "none";
                        } catch (e) {}
                        oem_dealers = "<select name='dealers' class='inpbox' id='dealers' onchange='check_lead_dealer(0)'>" + oem_dealers_list + "</select><span></span>";
                        document.getElementById("oem_dealers").innerHTML = oem_dealers;
                        document.getElementById("dealer_val").value = 2;
                        document.getElementById("dealers").style.display = "none";
                        document.getElementById("dealer_val").value = 2;
                    } else {
                        try {
                            document.getElementById("oem_dealers").style.display = "none";
                            document.getElementById("dealer_val").value = 0;
                        } catch (e) {}
                        document.getElementById("dealer_val").value = 0;
                    }
                }
            }
            if (cookie_email != "") {
                $(".submit_lead").removeClass("disab");
            }
        }
    }
}
function set_data(cw_modelid, cw_variant_id, make, model, variant, ct_variant_id) {
    document.getElementById("lead_cw_model_id").value = cw_modelid;
    document.getElementById("lead_cw_variant_id").value = cw_variant_id;
    document.getElementById("make").value = make;
    document.getElementById("model").value = model;
    document.getElementById("variant").value = variant;
    document.getElementById("variant_id").value = ct_variant_id;
}
function clear_validations() {
    $("#exp_lead_name_er").removeClass("disp_block");
    $("#exp_lead_name_er").addClass("disp_none");
    $("#exp_lead_name_er .er_msg_ri").html("");
    $("#exp_lead_mob_er").removeClass("disp_block");
    $("#exp_lead_mob_er").addClass("disp_none");
    $("#exp_lead_mob_er .er_msg_ri").html("");
    $("#exp_lead_email_er").removeClass("disp_block");
    $("#exp_lead_email_er").addClass("disp_none");
    $("#exp_lead_email_er .er_msg_ri").html("");
    $("#exp_lead_city_er").removeClass("disp_block");
    $("#exp_lead_city_er").addClass("disp_none");
    $("#exp_lead_city_er .er_msg_ri").html("");
    $("#exp_lead_dealer_er").removeClass("disp_block");
    $("#exp_lead_dealer_er").addClass("disp_none");
    $("#exp_lead_dealer_er .er_msg_ri").html("");
    $("#exp_lead_email_updated_er").removeClass("disp_block");
    $("#exp_lead_email_updated_er").addClass("disp_none");
    $("#exp_lead_email_updated_er .er_msg_ri").html("");
}
function show_popup1() {
    toggle_bg_pop("disable");
    toggleFullScreen('open');
    if ($("#chk_emi_click").val() == "1") {
        $("#emi_top_text").show();
        var emi_val = $("#emi").html();
        $("#lead_emi_val").html('<span class="rupee_font">&#x20B9;</span> ' + emi_val);
        $("#chan_dealer").removeClass("cust_text");
    } else {
        $("#emi_top_text").hide();
        $("#chan_dealer").addClass("cust_text");
    }
    encrypted_ids = [];
    last_insert_ids = [];
    var userAgent = navigator.userAgent;
    if (userAgent.match(/iPad|iPhone|iPod/i) !== null) {
        $("html").addClass("ver-hidden");
    }
    $("#idbybody").css("overflow-y", "hidden");
    clear_validations();
    document.getElementById("popup1").style.display = "block";
}
function show_popup2() {
    toggle_bg_pop("disable");
    toggleFullScreen('open');
    if ($("#chk_emi_click").val() == "1") {
        $("#emi_top_text").show();
        var emi_val = $("#emi").html();
        $("#lead_emi_val").html('<span class="rupee_font">&#x20B9;</span> ' + emi_val);
        $("#chan_dealer").removeClass("cust_text");
    } else {
        $("#emi_top_text").hide();
        $("#chan_dealer").addClass("cust_text");
    }
    encrypted_ids = [];
    last_insert_ids = [];
    document.getElementById("popup1").style.display = "block";
}
function hide_popup1(from) {
    if ($("#reload").val() == "yes") {
        closecitypop_withnoaction();
        location.reload();
    }
    if (!from) {
        from = 0;
    }
    if (!from) {
        toggle_bg_pop("enable");
        toggleFullScreen('close');
    }
    document.getElementById("popup1").style.display = "none";
    $("#chk_emi_click").val(0);
}
function hide_popup2() {
    if ($("#reload").val() == "yes") {
        closecitypop_withnoaction();
        location.reload();
    }
    toggle_bg_pop("enable");
    toggleFullScreen('close');
    document.getElementById("popup1").style.display = "none";
    document.getElementById("popup2").style.display = "none";
    $("#chk_emi_click").val(0);
}
function toggle_bg_pop(type) {
    if (type == "enable") {
        var userAgent = navigator.userAgent;
        if (userAgent.match(/iPad|iPhone|iPod/i) !== null) {
            $("html").removeClass("ver-hidden");
        }
        $("#idbybody").css("overflow-y", "visible");
        $("#overlay").removeClass("dark-overlay");
    }
    if (type == "disable") {
        var userAgent = navigator.userAgent;
        if (userAgent.match(/iPad|iPhone|iPod/i) !== null) {
            $("html").addClass("ver-hidden");
        }
        $("#overlay").addClass("dark-overlay");
        $("#idbybody").css("overflow-y", "hidden");
    }
}
function popup1_validation(val) {
    $("#exp_lead_name_er").addClass("disp_none");
    $("#exp_lead_name_er").removeClass("disp_block");
    $("#exp_lead_name_er .er_msg_ri").html("");
    $("#exp_lead_mob_er").addClass("disp_none");
    $("#exp_lead_mob_er").removeClass("disp_block");
    $("#exp_lead_mob_er .er_msg_ri").html("");
    $("#exp_lead_city_er").addClass("disp_none");
    $("#exp_lead_city_er").removeClass("disp_block");
    $("#exp_lead_city_er .er_msg_ri").html("");
    var val = document.getElementById('dealer_val').value;
    var txtName = document.getElementById('name').value;
    var txtMobile = document.getElementById('mobile').value;
    var num = document.getElementById('mobile').value.length;
    if ($("#oem_cities_pan").length > 0) {
        var city_id_val = document.getElementById('oem_cities_pan').value;
    }
    var verr = "";
    if (txtName.length == 0) {
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er .er_msg_ri").html("Name should not be empty");
        verr = verr + "Name should not be empty\n";
    } else if (txtName.length < 3 || txtName.length > 50) {
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er .er_msg_ri").html("Name length should be 3 to 50 character");
        verr = verr + "Name length should be 3 to 50 character\n";
    } else {
        var nre = /^[A-Za-z\ ]+$/;
        if (!txtName.match(nre)) {
            $("#exp_lead_name_er").removeClass("disp_none");
            $("#exp_lead_name_er").addClass("disp_block");
            $("#exp_lead_name_er .er_msg_ri").html("Name must contain alphabets only");
            verr = verr + "Name must contain alphabets only\n";
        }
    }
    if (num == 0) {
        $("#exp_lead_mob_er").removeClass("disp_none");
        $("#exp_lead_mob_er").addClass("disp_block");
        $("#exp_lead_mob_er .er_msg_ri").html("Mobile should not be empty");
        verr = verr + "Mobile should not be empty\n";
    } else if (num != 10) {
        $("#exp_lead_mob_er").removeClass("disp_none");
        $("#exp_lead_mob_er").addClass("disp_block");
        $("#exp_lead_mob_er .er_msg_ri").html("Enter proper Mobile Number");
        verr = verr + "Enter proper Mobile Number\n";
    } else {
        var re = /^[6789]\d{9}$/;
        if (!txtMobile.match(re)) {
            $("#exp_lead_mob_er").removeClass("disp_none");
            $("#exp_lead_mob_er").addClass("disp_block");
            $("#exp_lead_mob_er .er_msg_ri").html("Enter proper Mobile Number");
            verr = verr + "Enter proper Mobile Numberr\n";
        }
    }
    if ($("#oem_cities_pan").length > 0) {
        if (city_id_val == "") {
            $("#exp_lead_city_er").removeClass("disp_none");
            $("#exp_lead_city_er").addClass("disp_block");
            $("#exp_lead_city_er .er_msg_ri").html("Please Select City");
            verr = verr + "Please Select City\n";
        }
    }
    if (val == 1) {
        var emailid = "";
        if ($(".email_flg #email").is(':visible')) {
            emailid = $(".email_flg #email").val();
        }
        if ($(".oem_email_flg #email").is(':visible')) {
            emailid = $(".oem_email_flg #email").val();
        }
        var txtEmail = emailid;
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (txtEmail.length == 0) {
            $("#exp_lead_email_er").removeClass("disp_none");
            $("#exp_lead_email_er").addClass("disp_block");
            $("#exp_lead_email_er .er_msg_ri").html("Email Id should not be empty");
            verr = verr + "Email Id should not be empty\n";
        } else if (!txtEmail.match(re)) {
            $("#exp_lead_email_er").removeClass("disp_none");
            $("#exp_lead_email_er").addClass("disp_block");
            $("#exp_lead_email_er .er_msg_ri").html("Enter proper Email Id");
            verr = verr + "Enter proper Email Id\n";
        }
    } else if (val == 2) {
        $("#exp_lead_dealer_er").addClass("disp_none");
        $("#exp_lead_dealer_er").removeClass("disp_block");
        $("#exp_lead_dealer_er .er_msg_ri").html("");
        var txtDealers = document.getElementById('dealers').value;
        if (txtDealers == 0) {
            $("#exp_lead_dealer_er").removeClass("disp_none");
            $("#exp_lead_dealer_er").addClass("disp_block");
            $("#exp_lead_dealer_er .er_msg_ri").html("Select A Dealer");
            verr = verr + "Select A Dealer\n";
        }
    } else if (val == 3) {
        var emailid = "";
        if ($(".email_flg #email").is(':visible')) {
            emailid = $(".email_flg #email").val();
        }
        if ($(".oem_email_flg #email").is(':visible')) {
            emailid = $(".oem_email_flg #email").val();
        }
        var txtEmail = emailid;
        var txtDealers = document.getElementById('dealers').value;
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (txtEmail.length == 0) {
            $("#exp_lead_email_er").removeClass("disp_none");
            $("#exp_lead_email_er").addClass("disp_block");
            $("#exp_lead_email_er .er_msg_ri").html("Email Id should not be empty");
            verr = verr + "Email Id should not be empty\n";
        } else if (!txtEmail.match(re)) {
            $("#exp_lead_email_er").removeClass("disp_none");
            $("#exp_lead_email_er").addClass("disp_block");
            $("#exp_lead_email_er .er_msg_ri").html("Enter proper Email Id");
            verr = verr + "Enter proper Email Id\n";
        }
        if (txtDealers == 0) {
            $("#exp_lead_dealer_er").removeClass("disp_none");
            $("#exp_lead_dealer_er").addClass("disp_block");
            $("#exp_lead_dealer_er .er_msg_ri").html("Select A Dealer");
            verr = verr + "Select A Dealer\n";
        }
    }
    if (verr.length > 1) {
        document.getElementById("popup2").style.display = "none";
        document.getElementById("popup1").style.display = "block";
    } else {
        try {
            document.getElementById('name').value = txtName;
            document.getElementById('mobile').value = txtMobile;
            if (txtName != "") {
                $('#name').addClass("has-content");
            } else {
                $('#name').removeClass("has-content");
            }
            if (txtMobile != "") {
                $('#mobile').addClass("has-content");
            } else {
                $('#mobile').removeClass("has-content");
            }
        } catch (e) {}
        final_submit('', '', '', '', 1);
    }
}
function popup2_validation() {
    $("#chk_emi_click").val(0);
    var txtEmail = $(".email_flg #email").val();
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    txtEmail = txtEmail.trim();
    if (txtEmail.length >= 1) {
        if (txtEmail.match(re)) {
            toggle_bg_pop("enable");
            toggleFullScreen('close');
            if ($("#reload").val() == "yes") {
                closecitypop_withnoaction();
            }
            $("#exp_lead_email_updated_er").addClass("disp_none");
            $("#exp_lead_email_updated_er").removeClass("disp_block");
            $("#exp_lead_email_updated_er .er_msg_ri").html("");
            document.getElementById("popup2").style.display = "none";
            update_email();
        } else {
            document.getElementById("popup1").style.display = "none";
            document.getElementById("popup2").style.display = "block";
            $("#exp_lead_email_updated_er").addClass("disp_block");
            $("#exp_lead_email_updated_er").removeClass("disp_none");
            $("#exp_lead_email_updated_er .er_msg_ri").html("Enter proper E-Mail ID");
        }
    } else {
        if ($("#reload").val() == "yes") {
            closecitypop_withnoaction();
            location.reload();
        }
        toggle_bg_pop("enable");
        toggleFullScreen('close');
        $("#exp_lead_email_updated_er").addClass("disp_none");
        $("#exp_lead_email_updated_er").removeClass("disp_block");
        $("#exp_lead_email_updated_er .er_msg_ri").html("");
        document.getElementById("popup2").style.display = "none";
    }
}
function update_email() {
    var make = document.getElementById("make").value;
    var model = document.getElementById("model").value;
    var varval = document.getElementById("variant").value;
    var city = document.getElementById("city").value;
    var name = document.getElementById("name").value;
    var mobile = document.getElementById("mobile").value;
    var email = $(".email_flg #email").val();
    var from_type = document.getElementById("from_type").value;
    $.post("/new-cars/on-road-price", {
        "action": "leadsubmit2",
        "email": email
    }, function(data) {
        var formData = getFormData($("#priceform").serializeArray(), "updateemail");
        formData['EmailLead'] = "1";
        formData['EncryptedLeadId'] = encrypted_ids.toString();
        var encryptleadids = encrypted_ids.toString();
        if (!formData['AssignedDealerId']) {
            formData['AssignedDealerId'] = "-1";
        }
        encrypted_ids = [];
        formData = lead_form_data_camp(formData);
        formData = JSON.stringify(formData);
        $.ajax({
            type: "POST",
            url: config_cw_api_domain + "/api/dealer/inquiries/",
            contentType: "application/json",
            data: formData,
            success: function(data) {
                update_cwlead_response(data, '', encryptleadids);
            },
            error: function(xhr, status, error) {
                update_cwlead_response(data, xhr.status);
            }
        });
    });
}
function update_cwlead_response(data, status, encryptedleadid) {
    if (!status) {
        status = "";
    }
    if (!encryptedleadid) {
        encryptedleadid = "";
    }
    var lead_email = $(".email_flg #email").val();
    for (i in last_insert_ids) {
        var last_insert_id = last_insert_ids[i];
        $.post("/new-cars/", {
            "action": "updateemail_cwlead_campain",
            "lead_email": lead_email,
            "last_insert_id": last_insert_id,
            "encryptedleadid": encryptedleadid
        }, function(data) {});
    }
    if ($("#reload").val() == "yes") {
        closecitypop_withnoaction();
        location.reload();
    }
}
function final_submit(type, dealerid, campid, modelids, showform) {
    if (!type) {
        type = "";
    }
    if (!dealerid) {
        dealerid = "";
    }
    if (!campid) {
        campid = "";
    }
    if (!modelids) {
        modelids = "";
    }
    if (!showform) {
        showform = "";
    }
    var make = document.getElementById("make").value;
    var model = document.getElementById("model").value;
    var varval = document.getElementById("variant").value;
    var varvalid = document.getElementById("variant_id").value;
    var city = document.getElementById("city").value;
    var name = document.getElementById("name").value;
    var mobile = document.getElementById("mobile").value;
    try {
        var email = document.getElementById("email").value;
    } catch (e) {
        email = '';
    }
    try {
        $(".mla_pop_name").html(name + "!");
    } catch (e) {}
    var from_type = document.getElementById("from_type").value;
    if ($("#email").is(':visible')) {} else {
        email = "";
    }
    if (type == "") {
        var formData_temp = getFormData($("#priceform").serializeArray());
    } else if (type == 'mla') {
        var formData_temp = getFormData($("#priceform").serializeArray(), "mla");
    } else if (type == 'rec') {
        var formData_temp = getFormData($("#priceform").serializeArray(), "rec");
    }
    formData_temp = lead_form_data_camp(formData_temp, dealerid, campid, modelids, type);
    if (type == 'mla' || type == 'rec') {
        if (type == 'mla') {
            var pass_type = 2;
        } else {
            var pass_type = 3;
        }
        var lead_cnt = formData_temp.CarInquiry.length;
    } else {
        var lead_cnt = 1;
        var pass_type = 1;
    }
    for (var j = 1; j <= lead_cnt; j++) {
        lognc_cw_lead_info(name, mobile, pass_type);
    }
    $.post("/new-cars/on-road-price", {
        "action": "leadsubmit1",
        "make": make,
        "model": model,
        "variant": varval,
        "variantid": varvalid,
        "city": city,
        "name": name,
        "mobile": mobile,
        "email": email
    }, function(data) {
        if (type == "") {
            var formData = getFormData($("#priceform").serializeArray());
            if (!formData['AssignedDealerId']) {
                formData['AssignedDealerId'] = "-1";
            }
        } else if (type == 'mla') {
            var formData = getFormData($("#priceform").serializeArray(), "mla");
            formData['AssignedDealerId'] = '';
            formData['CampaignId'] = '';
            formData['SourceType'] = "2";
            formData['PrimaryEncryptedLeadId'] = document.getElementById("lead_EncryptedPQDealerAdleadId").value;
        } else if (type == 'rec') {
            var formData = getFormData($("#priceform").serializeArray(), "rec");
            formData['AssignedDealerId'] = "";
            formData['CampaignId'] = "";
            formData['ModelId'] = "";
            formData['VersionId'] = "0";
            formData['SourceType'] = "3";
            formData['PrimaryEncryptedLeadId'] = document.getElementById("lead_EncryptedPQDealerAdleadId").value;
        }
        if (!formData['Email']) {
            formData['Email'] = "";
        }
        formData = lead_form_data_camp(formData, dealerid, campid, modelids, type);
        formData = JSON.stringify(formData);
        $.ajax({
            type: "POST",
            url: config_cw_api_domain + "/api/dealer/inquiries/",
            contentType: "application/json",
            data: formData,
            success: function(data) {
                try {
                    gtag_report_conversion();
                } catch (e) {
                    console.log("error in gtag function... error: " + e);
                }
                track_cwlead_response(data, '', type, dealerid, campid, modelids, showform);
            },
            error: function(xhr, status, error) {
                track_cwlead_response(error, xhr.status, type, dealerid, campid, modelids, showform);
            }
        });
    });
}
function getFormData(data, fromtype) {
    if (!fromtype) {
        fromtype = "";
    }
    var unindexed_array = data;
    var indexed_array = {};
    var map_key_val_cw = {
        "name": "Name",
        "mobile": "Mobile",
        "lead_cw_city_id": "CityId",
        "lead_ct_area_id": "AreaId",
        "lead_PlatformId": "PlatformId",
        "lead_ApplicationId": "ApplicationId",
        "lead_PlatformId": "PlatformId",
        "lead_ApplicationId": "ApplicationId",
        "lead_SourceType": "SourceType",
        "lead_PageId": "PageId",
        "lead_NewPageId": "NewPageId",
        "lead_PropertyId": "PropertyId",
        "lead_IsCitySet": "IsCitySet",
        "lead_CwCookie": "CwCookie",
        "lead_UtmzCookie": "UtmzCookie",
        "lead_ABTest": "ABTest",
        "lead_cw_model_id": "ModelId",
        "lead_cw_variant_id": "VersionId",
        "lead_Campaignid": "CampaignId",
        "lead_CampaignCTAText": "CampaignCTAText"
    };
    var keyname = "dealers";
    if ($("#dealers_exist").val() == "no") {
        keyname = "pandealervalue";
    }
    map_key_val_cw[keyname] = "AssignedDealerId";
    if ($("#oem_email").css("display") == "block") {
        map_key_val_cw["email_first"] = "Email";
    }
    var key_name_enc = "mla_EncryptedPQDealerAdleadId";
    if (fromtype == "updateemail") {
        key_name_enc = "lead_EncryptedPQDealerAdleadId";
        if ($(".email_flg #email").val() != "") {
            if (!$(".email_flg #email").is(':visible')) {
                map_key_val_cw["email_second"] = "Email";
            }
        }
    }
    map_key_val_cw[key_name_enc] = "EncryptedLeadId";
    $.map(unindexed_array, function(n, i) {
        if (map_key_val_cw[n['name']]) {
            indexed_array[map_key_val_cw[n['name']]] = n['value'];
        }
    });
    return indexed_array;
}
function track_cwlead_response(data, status, type, dealerid, campid, modelids, showform) {
    if (!status)
        status = "";
    if (!type)
        type = "";
    if (!dealerid)
        dealerid = "";
    if (!campid)
        campid = "";
    if (!modelids)
        modelids = "";
    if (!showform) {
        showform = "";
    }
    if (type != "mla" && type != "rec") {
        document.getElementById("lead_EncryptedPQDealerAdleadId").value = data;
    }
    encrypted_ids.push(data);
    var name = document.getElementById("name").value;
    var mobile = document.getElementById("mobile").value;
    if (document.getElementById("camp_step2").style.display == "none") {
        if ($('#oem_email').length == 1) {
            var lead_email = document.getElementById("email").value;
        } else {
            var lead_email = '';
        }
    } else {
        if ($('#oem_email').length == 1) {
            var lead_email = '';
        } else {
            var lead_email = document.getElementById("email").value;
        }
    }
    var lead_cw_model_id = document.getElementById("lead_cw_model_id").value;
    var lead_cw_variant_id = document.getElementById("lead_cw_variant_id").value;
    var lead_cw_city_id = document.getElementById("lead_cw_city_id").value;
    var lead_ct_area_id = document.getElementById("lead_ct_area_id").value;
    var lead_PlatformId = document.getElementById("lead_PlatformId").value;
    var lead_ApplicationId = document.getElementById("lead_ApplicationId").value;
    if (type != "mla" && type != "rec") {
        var lead_Campaignid = document.getElementById("lead_Campaignid").value;
        try {
            var lead_DealerId = document.getElementById("dealers").value;
        } catch (e) {
            lead_DealerId = '-1';
        }
        var leads_count = 1;
    } else {
        var leads_count = dealerid.length;
    }
    var response = data;
    if (status == "") {
        status = "200";
    }
    var sourcetype = "1";
    var primaryencryptedleadid = "";
    if (type == "mla" || type == "rec") {
        primaryencryptedleadid = document.getElementById("lead_EncryptedPQDealerAdleadId").value;
        if (type == "mla") {
            sourcetype = "2";
        } else if (type == "rec") {
            sourcetype = "3";
        }
    }
    var pageid = document.getElementById("lead_PageId").value;
    var newpageid = document.getElementById("lead_NewPageId").value;
    var propertyid = document.getElementById("lead_PropertyId").value;
    var iscityset = document.getElementById("lead_IsCitySet").value;
    var cwcookie = document.getElementById("lead_CwCookie").value;
    var utmzcookie = document.getElementById("lead_UtmzCookie").value;
    var abtest = document.getElementById("lead_ABTest").value;
    var emaillead = 0;
    var campaignctatext = document.getElementById("lead_CampaignCTAText").value;
    var encryptedleadid = "";
    for (i = 0; i < leads_count; i++) {
        if (type == "mla" || type == "rec") {
            var lead_DealerId = "-1";
            var lead_Campaignid = campid[i];
            if (type == "rec") {
                lead_cw_model_id = modelids[i];
                lead_cw_variant_id = 0;
            }
        }
        $.post("/new-cars/", {
            "action": "save_cwlead_campain",
            "name": name,
            "mobile": mobile,
            "lead_email": lead_email,
            "lead_cw_model_id": lead_cw_model_id,
            "lead_cw_variant_id": lead_cw_variant_id,
            "lead_cw_city_id": lead_cw_city_id,
            "lead_ct_area_id": lead_ct_area_id,
            "lead_PlatformId": lead_PlatformId,
            "lead_ApplicationId": lead_ApplicationId,
            "lead_Campaignid": lead_Campaignid,
            "lead_DealerId": lead_DealerId,
            "response": response,
            "status": status,
            "sourcetype": sourcetype,
            "pageid": pageid,
            "newpageid": newpageid,
            "propertyid": propertyid,
            "iscityset": iscityset,
            "cwcookie": cwcookie,
            "utmzcookie": utmzcookie,
            "abtest": abtest,
            "emaillead": emaillead,
            "campaignctatext": campaignctatext,
            "encryptedleadid": encryptedleadid,
            "primaryencryptedleadid": primaryencryptedleadid
        }, function(data) {
            if (type != "mla" && type != "rec") {
                document.getElementById("last_insert_id").value = data;
            }
            last_insert_ids.push(data);
        });
    }
    if (status == "200") {
        if ($("#oem_cities_pan").length > 0) {
            $("#reload").val("yes");
            SetCookie("cookie_ct_city", $("#city").val(), 7, '/');
            SetCookie("cookie_ct_cityid", $("#ct_city_id_flag").val(), 7, '/');
            SetCookie("cookie_cw_cityid", $("#lead_cw_city_id").val(), 7, '/');
            SetCookie("cookie_cw_area_id", 0, 7, '/');
            SetCookie("cookie_zone_id", 0, 7, '/');
            SetCookie("ct_area_avail", $(".area_avail").val(), 7, '/');
        }
        if (showform == 1) {
            var mla_modelid = document.getElementById("lead_cw_model_id").value;
            var mla_cityid = document.getElementById("lead_cw_city_id").value;
            var mla_platformid = document.getElementById("lead_PlatformId").value
            var mla_applicationid = document.getElementById("lead_ApplicationId").value;
            var mla_area_id = getCookie("cookie_cw_area_id");
            callMLA(mla_modelid, mla_cityid, mla_platformid, mla_applicationid, mla_area_id);
        }
    }
}
function setfocusheight() {
    $('#popup1').animate({
        scrollTop: "250px"
    }, 800);
    try {
        $('#popup2').animate({
            scrollTop: "180px"
        }, 800);
    } catch (e) {}
}
function email_trim(s) {
    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, "");
    s = s.replace(/\n /, "\n");
    return s;
}
var sort_by = function() {
    var fields = [].slice.call(arguments)
      , n_fields = fields.length;
    return function(A, B) {
        var a, b, field, key, primer, reverse, result;
        for (var i = 0, l = n_fields; i < l; i++) {
            result = 0;
            field = fields[i];
            key = typeof field === 'string' ? field : field.name;
            a = A[key];
            b = B[key];
            if (typeof field.primer !== 'undefined') {
                a = field.primer(a);
                b = field.primer(b);
            }
            reverse = (field.reverse) ? -1 : 1;
            if (a < b)
                result = reverse * -1;
            if (a > b)
                result = reverse * 1;
            if (result !== 0)
                break;
        }
        return result;
    }
}
function check_lead_name(n) {
    var letters = /^[A-Za-z\.\ \'\/]+$/;
    if ($("#name").val().length == 0 && n == 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name should not be empty");
        return "Name should not be empty\n";
    } else if (!$("#name").val().match(letters) && n == 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name must contain alphabets only");
        return "Name must contain alphabets only\n";
    } else if (($("#name").val().length < 3 || $("#name").val().length > 50) && n == 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name length should be 3 to 50 characters");
        return "Name length should be 3 to 50 characters\n";
    } else {
        $("#exp_lead_name_er").addClass("disp_none");
        $("#exp_lead_name_er").removeClass("disp_block");
        $("#exp_lead_name_er .er_msg_ri").html("");
        return "";
    }
}
function check_lead_mobile(n) {
    var txtMobile = document.getElementById('mobile').value;
    var num = document.getElementById('mobile').value.length;
    if (num == 0 && n == 1) {
        $("#exp_lead_mob_er").addClass("disp_block");
        $("#exp_lead_mob_er").removeClass("disp_none");
        $("#exp_lead_mob_er .er_msg_ri").html("Mobile should not be empty");
        return "Mobile should not be empty\n";
    } else if (num != 10 && n == 1) {
        $("#exp_lead_mob_er").addClass("disp_block");
        $("#exp_lead_mob_er").removeClass("disp_none");
        $("#exp_lead_mob_er .er_msg_ri").html("Enter proper Mobile Number");
        return "Enter proper Mobile Number\n";
    } else {
        var re = /^[6789]\d{9}$/;
        if (!txtMobile.match(re) && n == 1) {
            $("#exp_lead_mob_er").addClass("disp_block");
            $("#exp_lead_mob_er").removeClass("disp_none");
            $("#exp_lead_mob_er .er_msg_ri").html("Enter proper Mobile Number");
            return "Enter proper Mobile Number\n";
        } else {
            $("#exp_lead_mob_er").addClass("disp_none");
            $("#exp_lead_mob_er").removeClass("disp_block");
            $("#exp_lead_mob_er .er_msg_ri").html("");
            return "";
        }
    }
}
function check_lead_email(n) {
    var txtEmail = document.getElementById("email").value;
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    txtEmail = txtEmail.trim();
    if (txtEmail.length >= 1 && n == 1) {
        if (txtEmail.match(re)) {
            $("#exp_lead_email_er").addClass("disp_none");
            $("#exp_lead_email_er").removeClass("disp_block");
            $("#exp_lead_email_er .er_msg_ri").html("");
            return "";
        } else {
            $("#exp_lead_email_er").addClass("disp_block");
            $("#exp_lead_email_er").removeClass("disp_none");
            $("#exp_lead_email_er .er_msg_ri").html("Enter proper E-Mail ID");
            return "Enter proper E-Mail ID\n";
        }
    } else if (n == 1) {
        $("#exp_lead_email_er").addClass("disp_block");
        $("#exp_lead_email_er").removeClass("disp_none");
        $("#exp_lead_email_er .er_msg_ri").html("Email Id should not be empty");
        return "Email Id should not be empty\n";
    } else {
        $("#exp_lead_email_er").addClass("disp_none");
        $("#exp_lead_email_er").removeClass("disp_block");
        $("#exp_lead_email_er .er_msg_ri").html("");
        return "";
    }
}
function check_lead_dealer(n) {
    if ($("#dealers").val() == "" && n == 1) {
        $("#exp_lead_dealer_er").addClass("disp_block");
        $("#exp_lead_dealer_er").removeClass("disp_none");
        $("#exp_lead_dealer_er .er_msg_ri").html("Select the dealer");
        return "Select the dealer\n";
    } else {
        $("#exp_lead_dealer_er").addClass("disp_none");
        $("#exp_lead_dealer_er").removeClass("disp_block");
        $("#exp_lead_dealer_er .er_msg_ri").html("");
        return "";
    }
}
function check_lead_city(n) {
    if ($("#oem_cities_pan").val() == "" && n == 1) {
        $("#exp_lead_city_er").addClass("disp_block");
        $("#exp_lead_city_er").removeClass("disp_none");
        $("#exp_lead_city_er .er_msg_ri").html("Please select city");
        return "Please select city\n";
    } else {
        $("#exp_lead_dealer_er").addClass("disp_none");
        $("#exp_lead_dealer_er").removeClass("disp_block");
        $("#exp_lead_dealer_er .er_msg_ri").html("");
        $("#exp_lead_city_er").addClass("disp_none");
        $("#exp_lead_city_er").removeClass("disp_block");
        $("#exp_lead_city_er .er_msg_ri").html("");
        return "";
    }
}
function check_lead_auth(n) {
    var auth = (document.getElementById('authroize').checked);
    if (!auth && n == 1) {
        $(".auth_er_msg").addClass("uncheck");
        return "Please select Terms & Conditions\n";
    } else {
        $(".auth_er_msg").removeClass("uncheck");
        return "";
    }
}
function check_email_updated(n) {
    var txtEmail = document.getElementById("email").value;
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    txtEmail = txtEmail.trim();
    if (n == 1) {
        if (txtEmail.length >= 1) {
            if (txtEmail.match(re)) {
                $("#exp_lead_email_updated_er").addClass("disp_none");
                $("#exp_lead_email_updated_er").removeClass("disp_block");
                $("#exp_lead_email_updated_er .er_msg_ri").html("");
                return "";
            } else {
                $("#exp_lead_email_updated_er").addClass("disp_block");
                $("#exp_lead_email_updated_er").removeClass("disp_none");
                $("#exp_lead_email_updated_er .er_msg_ri").html("Enter proper E-Mail ID");
            }
        } else {
            $("#exp_lead_email_updated_er").addClass("disp_none");
            $("#exp_lead_email_updated_er").removeClass("disp_block");
            $("#exp_lead_email_updated_er .er_msg_ri").html("");
            return "";
        }
    } else if (n == 2) {
        if (txtEmail.length >= 1) {
            if (txtEmail.match(re)) {
                $(".submit_lead").removeClass("disab");
                return "";
            } else {
                $(".submit_lead").addClass("disab");
            }
        } else {
            $(".submit_lead").addClass("disab");
            return "";
        }
    } else {
        $("#exp_lead_email_updated_er").addClass("disp_none");
        $("#exp_lead_email_updated_er").removeClass("disp_block");
        $("#exp_lead_email_updated_er .er_msg_ri").html("");
        return "";
    }
}
function namevalidation() {
    var regex = new RegExp("^[a-zA-Z .]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}
function namevalid(s) {
    var regex = new RegExp("^[a-zA-Z .]+$");
    if (s.length >= 1) {
        var cchar = s.charAt(s.length - 1);
        if (!regex.test(cchar)) {
            document.getElementById("name").value = s.substring(0, s.length - 1);
        }
    }
}
function name_trim(s) {
    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, " ");
    s = s.replace(/\n /, "\n");
    return s;
}
function lookup_mobile_camp(toast, statusval) {
    var mobileval = "#mobile";
    var mobile = $(mobileval).val() + '';
    var flag = true;
    if (mobile.length == 0) {} else if (!startNum(mobile[0])) {
        return false;
    } else if (!NewisNum(mobile, 10, 10)) {
        mobile = mobile.replace(/[^0-9]/g, "");
    }
    $(mobileval).val("");
    var mobilec = mobile.substring(0, 10);
    $(mobileval).val(mobilec);
}
function startNum(txt) {
    var RegExp = /^[9|8|7|6]$/;
    flag = false;
    if (RegExp.test(txt))
        flag = true;
    return flag;
}
function validate_mobile() {
    var mobile = document.getElementById("mobile").value;
    if (mobile.length > 10) {
        mobile = mobile.substr(0, 10);
        document.getElementById("mobile").value = mobile;
    }
    if (!NewisNum(mobile, 10, 10)) {
        if (mobile.length >= 1) {
            if (!(mobile.charAt(0) == "9" || mobile.charAt(0) == "8" || mobile.charAt(0) == "7" || mobile.charAt(0) == "6")) {
                document.getElementById("mobile").value = mobile.substr(1, mobile.length);
                document.getElementById("mobile").focus();
            }
        }
        return false;
    } else {}
}
function NewisNum(txt, vmin, vmax) {
    var RegExp = /^(([9|8|7|6][0-9]+)+)$/;
    if (RegExp.test(txt)) {
        if (txt.length >= vmin && txt.length <= vmax) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function setActive() {
    if (document.getElementById("dealers").value == 0) {
        $("#dealers").removeClass("sel_del");
    } else {
        $("#dealers").addClass("sel_del");
    }
}
function setemisourceid(CampaignCTAText, PropertyId) {
    document.getElementById("lead_EncryptedPQDealerAdleadId").value = "";
    $("#lead_CampaignCTAText").val(CampaignCTAText);
    $("#lead_PropertyId").val(PropertyId);
}
function validation_campaign_pan(cityid, zoneid, model_pos, cw_model_id_comp) {
    document.getElementById("model_pos").value = model_pos;
    var pageid = document.getElementById("lead_PageId").value;
    var newpageid = document.getElementById("lead_NewPageId").value;
    if (!cw_model_id_comp) {
        var modelid = document.getElementById("lead_cw_model_id").value;
    } else {
        var modelid = cw_model_id_comp;
    }
    var cityid = cityid;
    if (modelid == 0 || cityid == "") {
        return false;
    }
    var zoneid = zoneid;
    var pageid = document.getElementById("lead_PageId").value;
    var newpageid = document.getElementById("lead_NewPageId").value;
    var platformid = document.getElementById("platformid").value;
    var applicationid = document.getElementById("applicationid").value;
    var count = 1;
    document.getElementById("count").value = count;
    document.getElementById("lead_cw_city_id").value = cityid;
    document.getElementById("lead_ct_zone_id").value = zoneid;
    var url = config_cw_api_domain + "/api/v2/campaigns/?modelid=" + modelid + "&cityid=" + cityid + "&zoneid=" + zoneid + "&platformid=" + platformid + "&applicationid=" + applicationid + "&count=" + count;
    document.getElementById("model_pos").value = model_pos;
    var jqxhr = $.get(url, function(xhr, status, error) {
        camp_response(xhr, status, error, model_pos);
    }).fail(function(xhr, status, error) {
        if (model_pos == 0) {
            var meta_make = meta_make_0;
            var meta_model = meta_model_0;
            $("#xhr_1").val("no data");
        } else if (model_pos == 1) {
            var meta_make = meta_make_1;
            var meta_model = meta_model_1;
            $("#xhr_2").val("no data");
        } else if (model_pos == 2) {
            var meta_make = meta_make_2;
            var meta_model = meta_model_2;
            $("#xhr_3").val("no data");
        }
        if ($("#xhr_2").val() == "" && disc_2 == 'n') {
            document.getElementById("lead_cw_model_id").value = cw_model_id2;
            validation_campaign_pan('-1', '0', 1, cw_model_id2);
        } else if ($("#xhr_3").val() == "" && cars_count > 2 && disc_3 == 'n') {
            document.getElementById("lead_cw_model_id").value = cw_model_id3;
            validation_campaign_pan('-1', '0', 2, cw_model_id3);
        }
        if ($('.nopan').val() == 'nopan') {
            closecitypop_withnoaction();
            try {
                $("#sry_pan_no_dealers").show();
            } catch (e) {}
        } else {
            if (city_cookie_js != '') {
                call_opr_campaign(1, 0, document.getElementById("lead_cw_model_id").value, getCookie('cookie_cw_cityid'), 0, '', model_pos);
            } else {
                $(".price_btn_cta_emi_nopan_" + model_pos).show();
                $("#price_btn_cta_emi_nopan_cust_" + model_pos).show();
                $("#price_btn_cta_emi_nopan_custemi_" + model_pos).show();
            }
        }
        $.post("/new-cars/", {
            "action": "save_cwdealear_campain",
            "status": xhr.status,
            "response": error,
            "ct_make_name": meta_make,
            "ct_model_name": meta_model,
            "request_url_camp": encodeURIComponent(request_url_camp),
            "modelid": modelid,
            "cityid": cityid,
            "zoneid": zoneid,
            "platformid": platformid,
            "applicationid": applicationid,
            "count": count,
            "isemailrequired": "",
            "pageid": pageid
        }, function(data) {});
    });
    return false;
}
function getpanindia_dealerslist(modelid, cw_cityid) {
    var url = config_cw_api_domain + "/api/dealers/ncs/?modelid=" + modelid + "&cityid=" + cw_cityid;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: dealerslist_response,
        error: function(xhr, status, error) {
            closecitypop_withnoaction();
        }
    });
    return false;
}
function dealerslist_response(saveData, status, xhr) {
    toggle_bg_pop("disable");
    toggleFullScreen('open');
    var oem_dealers_list = '';
    document.getElementById("oem_dealers").innerHTML = "";
    document.getElementById("oem_dealers").style.display = "none";
    if (saveData['length'] > 0) {
        for (i in saveData) {
            oem_dealers_list += "<option value='" + saveData[i]['id'] + "'>" + saveData[i]['name'] + "</option>";
        }
    }
    if (saveData['length'] > 1) {
        try {
            document.getElementById("oem_dealers").style.display = "block";
        } catch (e) {}
        oem_dealers = "<select name='dealers' class='inpbox' id='dealers' onchange='setActive();check_lead_dealer(0);'><option value='0'>Select A Dealer</option>" + oem_dealers_list + "</select><span></span>";
        document.getElementById("oem_dealers").innerHTML = oem_dealers;
        var dealer_val_temp = document.getElementById("dealer_val").value;
        var dealer_val = 0;
        if (dealer_val_temp == 1) {
            dealer_val = 3;
        } else {
            dealer_val = 2;
        }
    } else if (saveData['length'] == 1) {
        try {
            document.getElementById("oem_dealers").style.display = "none";
        } catch (e) {}
        oem_dealers = "<select name='dealers' class='inpbox' id='dealers' onchange='check_lead_dealer(0)'>" + oem_dealers_list + "</select><span></span>";
        document.getElementById("oem_dealers").innerHTML = oem_dealers;
        var dealer_val_temp = document.getElementById("dealer_val").value;
        var dealer_val = 0;
        if (dealer_val_temp == 1) {
            dealer_val = 3;
        } else {
            dealer_val = 2;
        }
    } else {
        var dealer_val_temp = document.getElementById("dealer_val").value;
        var dealer_val = 0;
        if (dealer_val_temp == 1) {
            dealer_val = 1;
        } else {
            dealer_val = 0;
        }
    }
    document.getElementById("dealer_val").value = dealer_val;
    closecitypop_withnoaction();
}
function set_model_pos(model_pos) {
    document.getElementById("model_pos").value = model_pos;
}
function get_camp_cities() {
    document.getElementById("oem_dealers").innerHTML = "";
    try {
        document.getElementById("oem_dealers").style.display = "none";
    } catch (e) {}
    $("#pan_dealers_exist").val("no");
    var dealer_val = document.getElementById("dealer_val").value;
    var final_dealer_val = 0;
    if (dealer_val == 1) {
        final_dealer_val = 1;
    } else {
        final_dealer_val = 0;
    }
    document.getElementById("dealer_val").value = final_dealer_val;
    $("#lead_cw_city_id_pan").val("");
    $("#pan_city").val("");
    var model_id = document.getElementById("lead_cw_model_id").value;
    var camp_id = document.getElementById("lead_Campaignid").value;
    var url = config_cw_api_domain + "/api/campaign/" + camp_id + "/cities/?modelid=" + model_id;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: citylist_pan,
        error: function(xhr, status, error) {}
    });
}
function citylist_pan(saveData, status, xhr) {
    var oem_cities_pan = "";
    var oem_cities_pan_list = "";
    oem_cities_pan_list += "<option value=''>Select City</option>";
    for (i in saveData) {
        oem_cities_pan_list += "<option value='" + saveData[i]['id'] + "'>" + saveData[i]['name'] + "</option>";
    }
    var oem_cities_pan = "<select name='oem_cities_pan' class='inpbox'  id='oem_cities_pan' onChange='set_city_value();check_lead_city(0);'>" + oem_cities_pan_list + "</select>";
    $("#oem_cities_pan_div").addClass("sngl_input");
    document.getElementById("oem_cities_pan_div").innerHTML = oem_cities_pan;
}
function set_city_value() {
    var model_id = document.getElementById("lead_cw_model_id").value;
    var cw_city_id = $("#oem_cities_pan").val();
    $("#lead_cw_city_id").val(cw_city_id);
    $("#lead_ct_zone_id").val("0");
    $.post("/compare-cars", {
        "action": "get_cities_pan",
        "cw_city_id": cw_city_id
    }, function(data) {
        var cw_data = "";
        var cw_city_name = "";
        var ct_city_id = "";
        var area_avail = 0;
        cw_data = data.split("#");
        cw_city_name = cw_data[1];
        ct_city_id = cw_data[0];
        $("#city").val(cw_city_name);
        $("#ct_city_id_flag").val(ct_city_id);
        area_avail = cw_data[2];
        $(".area_avail").val(area_avail);
        if (cw_city_id != "" && cw_city_id != 0) {
            getpanindia_dealerslist(model_id, cw_city_id);
        } else {
            document.getElementById("oem_dealers").innerHTML = "";
            try {
                document.getElementById("oem_dealers").style.display = "none";
            } catch (e) {}
            $("#pan_dealers_exist").val("no");
            var dealer_val = document.getElementById("dealer_val").value;
            var final_dealer_val = 0;
            if (dealer_val == 1) {
                final_dealer_val = 1;
            } else {
                final_dealer_val = 0;
            }
            document.getElementById("dealer_val").value = final_dealer_val;
        }
    });
}
function nopan_hidepop() {
    location.reload();
}
