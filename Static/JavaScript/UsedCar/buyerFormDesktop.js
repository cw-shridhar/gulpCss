var __non_otp_lead_id = [];
var __view_similarcar_button_opened = false;
var __form_element = null;
var __curr_data = {};
var myTimer = "";
var _otp_from_enabled = false;
var _otp_verfiy = false;
var __contact_seller_status = false;
var _one_click_view_btn_text = false;
var LEAD_STATUS = {
    "MOBILE_UNVERIFIED": "MobileUnverified",
    "MOBILE_VERIFIED": "mobileVerified",
}

function NewisName(txt, vmin, vmax) {
    var RegExp = /^[a-zA-Z\ \.]+$/
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

function NewisNum(txt, vmin, vmax) {
    var RegExp = /^(([9|8|7|6][0-9]+)+)$/
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

function startNum(txt) {
    var RegExp = /^[9|8|7|6]$/
    flag = false;
    if (RegExp.test(txt))
        flag = true;
    //console.log(flag);
    return flag;
}

function lookup_name() {
    var nameval = "#namesd";
    var name = $(nameval).val();
    var name_msg = '';
    var flag = true;
    if (name.length == 0 || name == '') {
        flag = false;
        name_msg = 'Please enter your Name';
    } else if (name.length < 3 || name.length > 50) {
        //console.log("every 2 "+"lasdf");
        flag = false;
        name_msg = 'Please enter your correct Name';
    } else if (!NewisName(name, 3, 50)) {
        //console.log("every"+"lasdf");
        flag = false;
        name_msg = 'Please enter your correct Name';
    }
    var namec = name.replace(/[^a-zA-Z. ]/g, "");
    $(nameval).val(namec);

    if (!flag) {
        show_error_msg(nameval, name_msg);
    } else {
        show_error_msg(nameval, '');
    }
}

function lookup_mobile() {
    var mobileval = "#phonesd";
    var mobile = $(mobileval).val() + '';
    var name_msg = '';
    var flag = true;
    if (mobile.length == 0) {
        //console.log( "1 : " +  mobile );
        flag = false;
        name_msg = 'Please enter your Mobile No.';
    } else if (!startNum(mobile[0])) {
        flag = false;
        name_msg = 'Please enter your correct Mobile No.';
        mobile = mobile.replace(/[^6-9]/g, "");
    } else if (mobile.length < 10) {
        flag = false;
        name_msg = 'Please enter your correct Mobile No.';
    } else if (!NewisNum(mobile, 10, 10)) {
        flag = false;
        name_msg = 'Please enter your correct Mobile No.';
        mobile = mobile.replace(/[^0-9]/g, "");
    }
    var mobilec = mobile.substring(0, 10);
    $(mobileval).val(mobilec);

    if (mobilec != mobile && startNum(mobile[0]))
        flag = true;

    if (!flag) {
        show_error_msg(mobileval, name_msg);
    } else {
        show_error_msg(mobileval, '');
    }
}

function lookup_otp(limit, msg) {
    var mobile_otp_id = "#otpsd";
    var mobile_otp_number = $(mobile_otp_id).val();
    error_flag = false;
    name_msg = "";
    if (mobile_otp_number.length > limit) {
        mobile_otp_number = mobile_otp_number.substr(0, mobile_otp_number.length - 1);
    }
    if (mobile_otp_number == "") {
        name_msg = "Please enter OTP";
        error_flag = true;
    } else {

        var RegExp = /^[0-9]{5}$/
        if (!RegExp.test(mobile_otp_number)) {
            //name_msg = "Enter correct OTP";
            error_flag = true;
        }
    }
    if (msg != "") {
        name_msg = msg;
        error_flag = true;
    }
    $(mobile_otp_id).val("");
    $(mobile_otp_id).val(mobile_otp_number);

    show_error_msg(mobile_otp_id, name_msg);
}

function show_error_msg(vid, err_msg) {
    if (err_msg != "") {
        $(vid).addClass("border_style");
        $(vid).next().html(err_msg);
        $(vid).next().addClass('open');
    } else {
        $(vid).removeClass("border_style");
        $(vid).next().html("");
        $(vid).next().removeClass('open');
    }
}

function pl_formcookies() {
    var cookies = {};
    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].split("=");
            name_value[0] = name_value[0].replace(/^ /, '');
            //name_value[1] = name_value[1].replace(/\+/g, '');
            cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
        }
    }
    return cookies;
}

function getLeadCityId() {
    var cookieCityId = Common.utils.getCookieByName("cd-city-id");
    var category = window.parent.location.href.includes(".html") ? "UsedCarDetails" : "UsedCarSearch";
    var cityId = 0;
    if (category === "UsedCarSearch" && Number(cookieCityId) > 0) {
        cityId = Number(cookieCityId);
    }
    else {
        cityId = __curr_data["deliverycityid"] ? __curr_data["deliverycityid"] : 0;
    }
    return cityId;
}

function non_otp_lead(popuptype) {
    __form_element = document.pl_savesd;
    frm = __form_element;
    if (!pl_lead_validate()) {
        return false;
    }
    if (popuptype === "check_right") {
        __curr_data = $("#check_right_submit").data();
    }
    var list_id = __curr_data['listingid']
    if (frm.namesd.value == '' && frm.phonesd.value == '') {
        return false;
    }
    var cookies = pl_formcookies();
    if (cookies['BUC_UID']) {
        return false;
    }
    var vdd = {
        profileId: list_id,
        buyer: {
            name: frm.namesd.value,
            mobile: frm.phonesd.value,
        },
        leadTrackingParams: {
            originId: __curr_data["originid"],
            leadType: getLeadType(),
            rank: __curr_data["rank"],
            slotId: __curr_data["slotid"],
            leadCity: getLeadCityId(),
        },
    };
    if (__curr_data && __curr_data["negotiateAmount"] && __curr_data["negotiateAmount"] !== 0) {
        vdd["negotiatePrice"] = __curr_data["negotiateAmount"];
    }
    callStockLead(vdd);
}

function callStockLead(bodyDataObj) {
    $.ajax({
        url: '/buy-used-cars/api/stockleads/',
        data: JSON.stringify(bodyDataObj),
        type: 'post',
        contentType: "application/json",
        headers: { "sourceId": 302 },
        success: function (results) {
            if (typeof recentlyViewedCars !== "undefined") {
                recentlyViewedCars.addProfileIdToLocalStorage(bodyDataObj.profileId);
            }
            __contact_seller_status = true;
            var cookies = pl_formcookies();
            if (cookies && cookies["cookie_buyform_mobile"] !== bodyDataObj.buyer.mobile) {
                updateCookie(bodyDataObj.buyer.name, bodyDataObj.buyer.mobile);
            }
            one_click_view_deatils();
            if (typeof buyerFormV2Desktop !== "undefined") {
                buyerFormV2Desktop.setOneClickViewDetails();
            }
            if (results && results.certificationReportUrl) {
                downloadPdf(results.certificationReportUrl);
            }
            else {
                showMobileNumber(results.seller);
                if (__curr_data['negotiateAmount'] > 0) {
                    saveNegotiationData(__curr_data['listingid'], bodyDataObj.buyer.mobile, __curr_data['negotiateAmount']);
                }
                if (__curr_data['popuptype'] !== "similar") {
                    pl_load_similar_cars(results);
                } else {
                    document.querySelector("#dealerdts").style.display = "block";
                    document.querySelector("#pl-lead-form").style.display = "none";
                    $(".PL-csellerPop").addClass("responce");
                    $(".PL-csellerPop").addClass("open");
                    $(".PL-csellerPop").addClass("right-15");
                    $('#dealerdts').html('<strong>' + results.seller.name + '</strong><br>' + results.seller.address + '<br><strong style="color:#D10;">Mobile: </strong><span id="dealerdts_mobile">' + results.seller.mobile + '</span><br><br>');
                }
            }
            analytics.trackAction("CWInteractive", "UsedStockLead", "Valid", "profileId=" + bodyDataObj.profileId);
        },
        error: function (xhr, status, err) {
            if (xhr.status === 403) {
                var jsonResponseModelState = xhr.responseJSON && xhr.responseJSON.ModelState;
                if (!jsonResponseModelState) {
                    return;
                }
                if (jsonResponseModelState.hasOwnProperty(LEAD_STATUS.MOBILE_UNVERIFIED)) {
                    enableDetailForm();
                    enable_otp_form("start", bodyDataObj.buyer.mobile);
                }
            }
        }
    });
}

function enableDetailForm() {
    $('#pl-lead-title').html('Seller Details');
    $('#pl_sd').html('Enter your name and mobile number to instantly see this seller\'s details.');
    if (__curr_data['popuptype'] !== "check_right") {
        $('#pl-similar_cars').addClass('open');
    }
    else {
        $('#oneclickcheckright').removeClass('open');
        $('#oneclickcheckright').addClass('close');
        $('#inline-form').removeClass('no-form');
        $('.input-group').removeClass('close');
    }
    $('#PL-city-popup').show();
    $('#pl-similar_cars.PL-csellerPop.open').css('right', '224px');
    $('.fl_cnt_sel_popup #pl-similar_cars.PL-csellerPop.open').css('right', '226px');
    $('#l_city').html(__curr_data['city']);
    if ($('[id^="contact-seller-container-"]').length > 1) {
        animate_to('car_item_' + __curr_data['listingid']);
    }
}

function enable_otp_form(timer, mobile) {
    var bodyDataObj = {};
    bodyDataObj.mobileVerificationByType = 1; // for otp verification
    //initiate otp
    $.ajax({
        url: '/buy-used-cars/api/v1/mobile/' + mobile + '/verification/start/',
        data: JSON.stringify(bodyDataObj),
        type: 'post',
        contentType: "application/json",
        headers: { "sourceId": 302 },
        error: function (xhr, status, err) { }
    });
    _otp_from_enabled = true;
    $("#namesd").prop('disabled', true);
    $("#phonesd").prop('disabled', true);
    $(".otp_from").css("display", "block");
    $(".step1_buttons").css("display", "none");
    $(".step2_buttons").css("display", "block");
    $("#namesd,#phonesd").addClass("disab");

    var Timecounter = 30;
    var resend_text = document.getElementById("resend_txt");
    if (myTimer) {
        clearInterval(myTimer);
    }
    if (timer == "start") {
        myTimer = setInterval(function () {
            if (Timecounter != 0) {
                resend_text.innerHTML = "Resend OTP in " + Timecounter + "s";
                Timecounter = Timecounter - 1;
            } else {
                clearInterval(myTimer);
                resend_text.innerHTML = "<a  href='javascript:resend_otp()'>Resend OTP</a>";
            }
        }, 1000);
    } else {
        resend_text.innerHTML = "OTP sent to Mobile";
    }
}

function getLeadType() {
    if (__curr_data['popuptype'] === 'wc') {
        return 2;
    } else if (__curr_data['popuptype'] === "ng") {
        return 5;
    } else if (__curr_data["popuptype"] === "CERT") {
        return 3;
    }
    return 0;
}

function disable_otp_form() {
    _otp_from_enabled = false;
    $("#namesd").prop('disabled', false);
    $("#phonesd").prop('disabled', false);

    $(".otp_from").css("display", "none");
    $(".step2_buttons").css("display", "none");
    $(".step1_buttons").css("display", "block");
    $("#namesd,#phonesd").removeClass("disab");
    $(".error_alert").html("");
    if (myTimer) {
        clearInterval(myTimer);
    }
    var resend_text = document.getElementById("resend_txt");
    resend_text.innerHTML = "";

}

function pl_lead_validate() {
    verror = "";
    // debugger;
    if (__form_element.namesd.value == '') {
        verror = verror + "\n\t" + "Name should not be empty";
        lookup_name();
    } else if (!checkIt(__form_element.namesd, "name", 'y', 50, 3, 50)) {
        verror = verror + "\n\t" + "Name should not be contain numbers and special chars";
    }
    if (__form_element.phonesd.value == "") {
        verror = verror + "\n\t" + "Mobile should not be empty";
        lookup_mobile();
    } else if (!NewisNum(__form_element.phonesd.value, 10, 10)) {
        verror = verror + "\n\t" + "Enter proper Mobile Number";
    }
    if (_otp_from_enabled == true) {
        if (__form_element.otpsd.value == "") {
            verror = verror + "\n\t" + "please enter otp";
            lookup_otp(5, "Please enter OTP");
        } else {
            var RegExp = /^[0-9]{5}$/
            if (!RegExp.test(__form_element.otpsd.value)) {
                verror = verror + "\n\t" + "Enter correct otp";
                lookup_otp(5, "Enter correct OTP");
            }
        }
    }
    if (verror != "") {
        //alert("Please correct following \n" + verror );
        return false;
    }
    return true;
}

function resend_otp() {
    var vdd = {
        "mobile": frm.phonesd.value,
        "sourceModule": 302,
        "mobileVerificationByType": 3,
    }
    $.ajax({
        url: '/buy-used-cars/api/v1/resendotp/',
        data: JSON.stringify(vdd),
        type: 'post',
        async: false,
        contentType: "application/json",
        success: function (data) {
            if (data === "Success") {
                document.getElementById("resend_txt").innerHTML = "OTP sent to Mobile";
            }
        },
        error: function (xhr) {
            msg_not_sent("");
        }
    });
}

function msg_not_sent(msg) {
    var resend_text = document.getElementById("resend_txt");
    resend_text.style.display = "block";
    resend_text.inneHTML = msg + " Please try after some time";
}

function submit_verfiy_otp() {
    var mobile = frm.phonesd.value;
    var otp_number = frm.otpsd.value;
    _otp_verfiy = false;
    $.ajax({
        url: "/buy-used-cars/api/v1/mobile/" + mobile + "/verification/verifyotp/?otpCode=" + otp_number + "&sourceModule=1",
        type: 'get',
        async: false,
        success: function (results) {
            if (!results) {
                return false;
            }
            if (results["responseCode"] == "1") {
                _otp_verfiy = true;
                updateCookie(frm.namesd.value, frm.phonesd.value);
                // all stock lead api
                var vdd = {
                    profileId: __curr_data["listingid"],
                    buyer: {
                        name: frm.namesd.value,
                        mobile: frm.phonesd.value,
                    },
                    leadTrackingParams: {
                        originId: __curr_data["originid"],
                        leadType: getLeadType(),
                        rank: __curr_data["rank"],
                        slotId: __curr_data["slotid"],
                        leadCity: getLeadCityId(),
                    },
                };
                if (__curr_data && __curr_data["negotiateAmount"] && __curr_data["negotiateAmount"] !== 0) {
                    vdd["negotiateprice"] = __curr_data["negotiateAmount"];
                }
                callStockLead(vdd);
            } else if (results["responseCode"] == "3") {
                lookup_otp(5, "Invalid OTP");
                if (_otp_from_enabled == false) {
                    enable_otp_form('stoptimer', mobile);
                }
            }
        }
    });
}

function updateCookie(name, mobile) {
    var date, expires;
    date = new Date();
    date.setTime(date.getTime() + (15 * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
    document.cookie = "cookie_buyform_name=" + name + expires + "; path=/";
    document.cookie = "cookie_buyform_mobile=" + mobile + expires + "; path=/";
}

function pl_phone_lead() {
    frm = __form_element;
    if (!pl_lead_validate()) {
        return false;
    }
    submit_verfiy_otp();
    if (_otp_verfiy === false) {
        return false;
    }
    $('#pl-lead-form').hide();
    $('#PL-csellerPop').hide();
    $('#PL-similar_cars #dealerdts').show().html('Loading....');
}

function pl_popup_close(evnt) {
    $('#pl-similar_cars').removeClass('open').removeClass('response');
}

function pl_person_popup_close() {
    $('#pl_over_lay,#person-lead-panel').removeClass('open');
}

function pl_load_similar_cars(response) {
    if (__curr_data['popuptype'] !== "check_right") {
        __curr_data = $("#contact_seller_button_" + response.stock.profileId).data()
    }
    $("#simcarhead").html("SIMILAR CARS");
    pl_update_cookies_values();
    __view_similarcar_button_opened = true;
    $('#left-person-lead-panel').addClass('clicksmbtnout');
    $('#PL_person_thumb').attr('src', response.stock.mainImageUrl);
    $('#PL_person_car_title').html(response.stock.carName + " (" + response.stock.year + ")");
    $('#PL_person_car_price').html('<span class="rupee_font">&#x20B9;</span>&nbsp;' + response.stock.price);
    document.querySelector(".clicksmbtn").style.display = "block";
    /* 12 leads restriction */
    if (1 == 2) {
        $('#PL_person_details').html("Something went wrong");
    } else {
        $('#PL_person_details').html('<strong id="PL_person_name">' + response.seller.name + '</strong><br>' + response.seller.address + '<br><strong style="color:#D10;">Mobile: </strong><span id="PL_person_mobile">' + response.seller.mobile + '</span><br><br>');
    }

    $('#pl_over_lay,#person-lead-panel').addClass('open');
    vurl = "/buy-used-cars/api/stockrecommendations/?profileId=" + __curr_data['listingid'] + "&rootid=" + __curr_data['rootid'] + "&cityid=" + __curr_data['cityid'] + "&price=" + __curr_data['price'] + "&recommendationsCount=25&versionSubSegmentId=" + __curr_data['versionsubsegmentid'] + "";
    __is_similar_loaded = 1;

    $.ajax({
        url: vurl,
        headers: { "sourceId": 302 },
        success: function (data) {
            card_html = '';
            __curr_data = {};
            try {
                if (!data || data.length === 0) {
                    $('#PL_similar_car_container').html('<div class="error-msg"> <em>Sorry, no similar cars found.</em></div>');
                    $('#person-lead-panel #full-loader').addClass('hide');
                    return false;
                }
                for (n in data) {
                    ind_cars = data[n];
                    card_template = $('#card-template').html();
                    matches = card_template.match(/\{\{(.*?)\}\}/gi);
                    for (i in matches) {
                        var map_val = matches[i].replace(/\{|\}/g, "").trim();
                        if (map_val.length > 0) {
                            if (map_val === "imagefullurl") {
                                card_template = card_template.replaceAll("{{" + map_val + "}}", "src=" + ind_cars["imageFullUrl"]);
                            } else if (map_val === "certifiedLogoUrl") {
                                if (ind_cars["certifiedLogoUrl"] && ind_cars["certifiedLogoUrl"].length > 0) {
                                    card_template = card_template.replaceAll("{{" + map_val + "}}", "<img src=" + ind_cars["certifiedLogoUrl"] + ">");
                                } else {
                                    card_template = card_template.replaceAll("{{" + map_val + "}}", "");
                                }
                            } else {
                                card_template = card_template.replaceAll("{{" + map_val + "}}", ind_cars[map_val]);
                            }
                        }
                    }
                    var popup_type = 'similar';
                    var contact_data = 'data-listingid="' + ind_cars['profileId'] + '" data-usertype="' + ind_cars['seller'] + '" data-userid="' + '' + '" data-popuptype="' + popup_type + '" data-city="' + ind_cars['cityName'] + '" data-cityId="' + ind_cars['cityId'] + '" data-mfgyear="' + ind_cars['makeYear'] + '" data-make="' + ind_cars['makeName'] + '" data-model="' + ind_cars['modelName'] + '" data-url="' + ind_cars['url'] + '" data-tiny="' + '' + '"';
                    // card_template = card_template.replaceAllManual('[contact-data]', contact_data);
                    // card_template = card_template.replaceAllManual('[certified-data-show]', ind_cars['certificate_img']);
                    card_html += card_template;
                }
            } catch (e) {
                console.log(e);
            }
            __is_similar_loaded = 1;
            $('#PL_similar_car_container').html(card_html);
            $('#PL_similar_car_container').scrollTop(0);
            $('#person-lead-panel #full-loader').addClass('hide');
            setTimeout(function () {
                $('#person-lead-panel #full-loader').hide();
            }, 500);

            // if (n != 2) {
            //     __init__similar_car_action();
            // }
        }
    });
}

function similarcarbutonclose() {
    pl_popup_close(1);
};

function pl_update_cookies_values() {
    // debugger;
    if ($("#galleryiframe3").contents().find("#pl_savesd").length > 0) {
        __form_element = $("#galleryiframe3").contents().find("#pl_savesd")[0];
    }
    else {
        __form_element = document.pl_savesd;
    }
    __cookies_flag = 0;
    var cookies = pl_formcookies();

    if (cookies['cookie_buyform_name'] && cookies['cookie_buyform_name'] != '') {
        try {
            __form_element.namesd.value = cookies['cookie_buyform_name'].replace(/\+/g, " ").trim();
            __cookies_flag++;
        } catch (e) { /*alert(e+' debug')*/ }
    }
    if (cookies['cookie_buyform_mobile'] && cookies['cookie_buyform_mobile'] != '') {
        try {
            __form_element.phonesd.value = cookies['cookie_buyform_mobile'];
        } catch (e) { }
        __cookies_flag++;
    }
    //console.log( __form_element.namesd.value + " --- " + __form_element.phonesd.value )      
    // if (cookies['BUC_UID'] == null) {
    //     __cookies_flag = 0;
    //     //console.log("cookie null" );
    // }
    try {
        document.getElementById("rhtarw").classList.add('directionrht');
        if (__curr_data['popuptype'] == 'similar') {
            //$('#PL-city-popup').hide();
            $("#similar-contact-seller-container-" + __curr_data['listingid']).html($('#pl-similar_cars'));
        } else if (__curr_data['popuptype'] == 'fl-fr' || __curr_data['popuptype'] == 'frchat' || __curr_data['popuptype'] == 'fl' || __curr_data['popuptype'] == 'flchat' || __curr_data['popuptype'] == 'fl-dl' || __curr_data['popuptype'] == 'dlchat') {
            $("#fl-contact-seller-container-" + __curr_data['listingid']).html($('#pl-similar_cars'));
        }
        else if (__curr_data['popuptype'] === 'CERT') {
            // temporary fix: need to be added again when certification is shown
            // document.getElementById("rhtarw").classList.add('directionlft');
            document.getElementById("rhtarw").classList.remove('directionrht');
            $("#fl-contact-seller-container-cert-side-" + __curr_data['listingid']).html($('#pl-similar_cars'));
        }
        else if (__curr_data['popuptype'] === 'CERTSIDE') {
            $("#fl-contact-seller-container-cert-side-" + __curr_data['listingid']).html($('#pl-similar_cars'));
        } else if (__curr_data['popuptype'] == 'ng') {
            // return false;
            $('#negotiate-popup-script').hide();
            if ($("#fl-contact-seller-container-" + __curr_data['listingid']).length > 0) {
                $("#fl-contact-seller-container-" + __curr_data['listingid']).html($('#pl-similar_cars'));
            } else {
                $("#contact-seller-container-" + __curr_data['listingid']).html($('#pl-similar_cars'));
            }

            // $("#similar-contact-seller-container-"+__curr_data['listingid']).html($('#pl-similar_cars'));
        } else {
            $("#contact-seller-container-" + __curr_data['listingid']).html($('#pl-similar_cars'));
        }

        if (__curr_data['popuptype'] == 'CERT') {
            $('#pl-lead-title').html('Print Certification Report');
        }
        $('#pl-similar_cars').attr('data-popup-type', __curr_data['popuptype']);
    }
    catch (error) { }
    if (__cookies_flag == 2) {
        return true;
    }
    return false;
}

function getMakeOffer(profileid, carname, price, priceNumeric, rank, slotId, originId, deliveryCity) {
    deliveryCity = deliveryCity || 0;
    pl_popup_close(1);
    getExistingOffer(
        profileid,
        carname,
        price,
        priceNumeric,
        rank,
        slotId,
        originId,
        deliveryCity
    );
}

function getPreVerifiedDetails() {
    var vdd = {
        profileId: __curr_data["listingid"],
        buyer: {
            name: __form_element.namesd.value,
            mobile: __form_element.phonesd.value,
        },
        leadTrackingParams: {
            originId: __curr_data["originid"],
            leadType: getLeadType(),
            rank: __curr_data["rank"],
            slotId: __curr_data["slotid"],
            leadCity: getLeadCityId(),
        },
    };
    if (__curr_data && __curr_data["negotiateAmount"] && __curr_data["negotiateAmount"] !== 0) {
        vdd["negotiatePrice"] = __curr_data["negotiateAmount"];
    }
    callStockLead(vdd);
}

function init_contact_seller_n_star_actions() {
    one_click_view_deatils();
    $(document).on("click", ".similar-contact-seller-btn", function (e) {
        e.preventDefault();
        pl_popup_close(1);
        __curr_data = {};
        __curr_data = $(this).data();
        if (pl_update_cookies_values()) {
            getPreVerifiedDetails();
        } else {
            $('#pl-similar_cars').addClass('open');
        }
    });
    $(document).on("click", ".contact-seller-btn", function (e) {
        e.preventDefault();
        pl_popup_close(1);
        __view_similarcar_button_opened = false;
        __curr_data = $(this).data();
        $('#left-person-lead-panel').removeClass('clicksmbtnout');
        if (pl_update_cookies_values()) {
            getPreVerifiedDetails();
        } else {
            /*start validation dont allow dots and special charecters*/
            $(".allownumericwithoutdecimal").on("keypress keyup blur", function (event) {
                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if (event.which != 0 && event.which != 8 && event.which != 9 && event.which != 46 && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });
            /*end validation dont allow dots and special charecters*/
            $('#pl-lead-title').html('Seller Details');
            $('#pl_sd').html('Enter your name and mobile number to instantly see this seller\'s details.');
            $('#pl-similar_cars').addClass('open');
            $('#PL-city-popup').show();
            $('#pl-similar_cars.PL-csellerPop.open').css('right', '224px');
            $('.fl_cnt_sel_popup #pl-similar_cars.PL-csellerPop.open').css('right', '226px');
            $('#l_city').html(__curr_data['city']);
            if ($('[id^="contact-seller-container-"]').length > 1) {
                animate_to('car_item_' + __curr_data['listingid']);
            }
        }
    });

    $("#negotiatesubmit").click(function (e) {
        e.preventDefault();
        if ($('#negotiateprice').val() == '') {
            document.getElementById('error_price').style.color = 'red';
            return false;
        }
        pl_popup_close(1);
        __curr_data = {};
        __curr_data = $(this).data();
        $('#negotiate_popup-script').hide();
        __view_similarcar_button_opened = false;
        add_body_scroll();
        $('#left-person-lead-panel').removeClass('clicksmbtnout');
        if (pl_update_cookies_values()) {
            frm = __form_element;
            getPreVerifiedDetails()
        } else {
            $(".allownumericwithoutdecimal").on("keypress keyup blur", function (event) {
                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if (event.which != 0 && event.which != 8 && event.which != 9 && event.which != 46 && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });
            $('#pl-lead-title').html('Seller Details');
            $('#pl_sd').html('To submit your offer, please fill in the form below.');
            $('#pl-similar_cars').addClass('open');
            $('#pl-similar_cars.PL-csellerPop.open').css('right', '224px');
            $('.fl_cnt_sel_popup #pl-similar_cars.PL-csellerPop.open').css('right', '226px');
            $('#l_city').html(__curr_data['city']);
            if ($('[id^="contact-seller-container-"]').length > 1) {
                animate_to('car_item_' + __curr_data['listingid']);
            }
        }
    });
    $("#oneclickcheckright").click(function (e) {
        e.preventDefault();
        __curr_data = {};
        __curr_data = $(this).data();
        if (pl_update_cookies_values()) {
            getPreVerifiedDetails();
        } else {
            $('#oneclickcheckright').removeClass('open');
            $('#oneclickcheckright').addClass('close');
            $('#inline-form').removeClass('no-form');
            $('.input-group').removeClass('close');
        }
    });
};

function one_click_view_deatils() {
    var cookies = formcookies();
    try {
        var us_name = hanUndefined(decodeURIComponent(cookies['cookie_buyform_name']));
        var us_mobile = hanUndefined(decodeURIComponent(cookies['cookie_buyform_mobile']));
        if (us_mobile != "" && us_name != "" && !_one_click_view_btn_text) {
            $(".contact-seller-btn-class").each(function () {
                $(".one-click").html(
                    "<span class='onetime'>1-CLICK</span>&nbsp;<span class='onetimeview'>VIEW DETAILS</span>"
                );
            });
            _one_click_view_btn_text = true;
        }
    } catch (e) { console.log("1 click view display function" + e); }
}

function hanUndefined(val) { if (val == undefined || val == "undefined") { return ""; } return val; }
document.addEventListener('readystatechange', function (event) {
    switch (document.readyState) {
        case "interactive":
        case "complete":
            init_contact_seller_n_star_actions();
            break;
        default:
            break;
    }
});

function formcookies() {
    var cookies = {};
    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].split("=");
            name_value[0] = name_value[0].replace(/^ /, '');
            cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
        }
    }
    return cookies;
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function showArrows(lid) {
    try { $("#slidearow_" + lid).show(); } catch (e) { }
}

function hideArrows(lid) {
    try { $("#slidearow_" + lid).hide(); } catch (e) { }
}

function saveNegotiationData(profileId, mobile, negotiationPrice) {
    var data = {
        mobileNumber: mobile,
        priceOffered: negotiationPrice,
        profileId: profileId
    }
    $.ajax({
        url: "/buy-used-cars/api/stocks/" + profileId + "/negotiate/",
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        headers: {
            applicationId: 1
        }
    }).done(function (data) {

    });
}

function showMobileNumber(sellerDetails) {
    __seller_html = '<img width="38" src="' + window.CloudfrontCDNHostURL + '/images4/call_sub.png"><strong id="seller_mobile">' + sellerDetails.mobile + '</strong><br class="bgdown"> <span>View Seller Details</span>';

    if (!__view_similarcar_button_opened) {
        if (__curr_data['popuptype'] == 'fl-fr' || __curr_data['popuptype'] == 'frchat') {
            $('[data-listingid="' + __curr_data['listingid'] + '"][data-popuptype="fl-fr"]').addClass('view-more-btn').html(__seller_html).not('[data-view-similar="btn"]');
        } else if (__curr_data['popuptype'] == 'fl' || __curr_data['popuptype'] == 'flchat') {
            $('[data-listingid="' + __curr_data['listingid'] + '"][data-popuptype="fl"]').addClass('view-more-btn').html(__seller_html).not('[data-view-similar="btn"]');
        } else if (__curr_data['popuptype'] == 'fl-dl' || __curr_data['popuptype'] == 'dlchat') {
            $('[data-listingid="' + __curr_data['listingid'] + '"][data-popuptype="fl-dl"]').addClass('view-more-btn').html(__seller_html).not('[data-view-similar="btn"]');
        } else if (__curr_data['popuptype'] == 'check_right') {
            document.querySelector("#inline-form").style.display = "none";
            document.querySelector("#seller_dealer").style.display = "block";
            var htmlPart = '<strong>' + sellerDetails.name + '</strong><br>' + sellerDetails.address + '<br><br><div class="phicond phds">' + sellerDetails.mobile + '</div>';
            $("#dealer_details").html(htmlPart);
        }
        else {
            $('[data-listingid="' + __curr_data['listingid'] + '"][data-popuptype="normal"],[data-listingid="' + __curr_data['listingid'] + '"][data-popuptype="new"],[data-listingid="' + __curr_data['listingid'] + '"][data-popuptype="similar"],[data-listingid="' + __curr_data['listingid'] + '"][data-popuptype="fl"]').addClass('view-more-btn').html(__seller_html).not('[data-view-similar="btn"]');
        }
        //__mobile_numer_to_paste = "";
    } else {
        $('[data-listingid="' + __curr_data['listingid'] + '"][data-popuptype="similar"]').addClass('view-more-btn').html(__seller_html).not('[data-view-similar="btn"]');
    }
}
function downloadPdf(Url) {
    //for browser compatibility,
    //setting location.href after timeout, instead of directly setting it.
    setTimeout(function () {
        location.href = Url;
    }, 0);
};