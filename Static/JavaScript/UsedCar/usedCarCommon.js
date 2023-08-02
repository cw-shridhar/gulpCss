//document.write("<div id=\"_gtm_msg\" style=\"color:#999999;position:fixed;left:0px;bottom:0px;\" ></div>");
$(document).ready(function () {
    $(".js-share-icon").on("click", function (event) {
        if(!event || !event.target)
        {
            return;
        }
        let shareIcon = $(event.target).closest(".js-share-icon");
        if(shareIcon.length <= 0)
        {
            return;
        }
        let utmParams = {
            utm_source: "share",
            utm_medium: shareIcon.attr("data-share-source"),
        }
        let shareLink = shareIcon.attr("data-share-link");
        if(!shareLink)
        {
            return;
        }
        navigator.share({
            url: `${window.location.origin}${shareLink}?${serialzeObjectToQueryString(utmParams)}`,
        });
    });
});

function _apply_gtm_trackings() {
    vtags = document.getElementsByTagName("a");
    for (i = 0; i < vtags.length; i++) {
        if (vtags[i].hasAttribute("data-category")) {
            if (vtags[i].getAttribute("data-category")) {
                try {
                    if (document.getElementsByTagName("a")[i].onclick == null || document.getElementsByTagName("a")[i].onclick == undefined) {
                        document.getElementsByTagName("a")[i].onclick = function (event) { _gtm_click_track(event, this); };
                    } else {
                        //	document.getElementsByTagName( "a" )[i].onmousedown = function(event){_gtm_click_track(event,this);};
                    }
                } catch (e) { }
            }
        }
    }
}
setTimeout("_apply_gtm_trackings()", 100);
setTimeout("_apply_gtm_trackings()", 2000);

function _gtm_click_track(event, vobj) {

    var page_name = "buy-used-cars";

    _vcategory = vobj.getAttribute("data-category");
    if (_vcategory == "Footer") {
        _vevent = "eventFooter";
        _vlabel = vobj.getAttribute("href");
        _vaction = vobj.innerText;
    } else if (page_name == "home" || page_name == "homev4") {
        vc = _vcategory;
        if (vc.indexOf("Top Nav") == -1 && vc.indexOf("New Footer") == -1) {
            //	_vcategory = "HP|"+ vc;
            //_vevent = "eventHP|" + vc;
            _vcategory = "New MHP|" + vc;
            _vevent = "event New MHP|" + vc;
        } else {
            _vevent = "event" + vc;
        }

        if (vobj.hasAttribute("data-label")) {
            _vlabel = vobj.getAttribute("data-label");
        } else {
            _vlabel = vobj.getAttribute("href");
        }


        if (vobj.hasAttribute("data-action")) {
            _vaction = vobj.getAttribute("data-action");
        } else {
            _vaction = vobj.innerText;
            try {
                if (_vaction.trim() == "") {
                    if (vobj.hasAttribute("alt")) {
                        _vaction = vobj.getAttribute("alt");
                    }
                    if (vobj.hasAttribute("title")) {
                        _vaction = vobj.getAttribute("title");
                    }
                }
            } catch (e) { }
        }

        //_vevent = "eventHP|" + vc;
    } else if (page_name == "homev2") {
        vc = _vcategory;
        if (vc.indexOf("Top Nav") == -1 && vc.indexOf("New Footer") == -1) {
            _vcategory = "New MHP|" + vc;
            _vevent = "event New MHP|" + vc;
        } else {
            _vevent = "event" + vc;
        }

        if (vobj.hasAttribute("data-label")) {
            _vlabel = vobj.getAttribute("data-label");
        } else {
            _vlabel = vobj.getAttribute("href");
        }


        if (vobj.hasAttribute("data-action")) {
            _vaction = vobj.getAttribute("data-action");
        } else {
            _vaction = vobj.innerText;
            try {
                if (_vaction.trim() == "") {
                    if (vobj.hasAttribute("alt")) {
                        _vaction = vobj.getAttribute("alt");
                    }
                    if (vobj.hasAttribute("title")) {
                        _vaction = vobj.getAttribute("title");
                    }
                }
            } catch (e) { }
        }
    } else {
        vc = _vcategory;
        _vcategory = vc;
        if (vobj.hasAttribute("data-label")) {
            _vlabel = vobj.getAttribute("data-label");
        } else {
            _vlabel = vobj.getAttribute("href");
        }
        if (vobj.hasAttribute("data-action")) {
            _vaction = vobj.getAttribute("data-action");
        } else {
            _vaction = vobj.innerText;
            try {
                if (_vaction.trim() == "") {
                    if (vobj.hasAttribute("alt")) {
                        _vaction = vobj.getAttribute("alt");
                    }
                    if (vobj.hasAttribute("title")) {
                        _vaction = vobj.getAttribute("title");
                    }
                }
            } catch (e) { }
        }
        _vevent = "event" + vc;
    }

    if (_vaction == undefined) {
        try { _vaction = vobj.textContent; } catch (e) { }
    }
    try { _gtm_push_datalayer(_vcategory, _vaction, _vlabel, _vevent); } catch (e) { alert(e) }
}

function _gtm_push(_vc, _va, _vl, _ve) {
    try { _gtm_push_datalayer(_vc, _va, _vl, _ve); } catch (e) { }
}

function cancelBubble(e) {
    var evt = e ? e : window.event;
    if (evt.stopPropagation) evt.stopPropagation();
    if (evt.cancelBubble != null) evt.cancelBubble = true;
}

function serialzeObjectToQueryString(data) {
    if (!data) {
        return "";
    }
    return Object.keys(data)
        .reduce(
            (acc, key) =>
                data[key] ? acc.concat([
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(data[key].toString()),
                ]) : acc,
            []
        )
        .join("&");
};

function _gtm_push_datalayer(_vcategory, _vaction, _vlabel, _vevent) {
    var page_name = "buy-used-cars";
    if (_vaction == undefined) {
        _vaction = "";
    }
    _vaction = _vaction.replace(/(\r|\n)/g, " ");
    if (_vlabel.indexOf("http://") == -1 && _vlabel.indexOf("https://") == -1) {
        if (_vlabel.indexOf("/") == -1) { } else {
            _vlabel = _vlabel.replace(/\/\//g, "/");
            _vlabel = "https://www.cartrade.com" + _vlabel;
        }
    }

    //try{document.getElementById('_gtm_msg').innerHTML = "Page Event is tracked: " + _vcategory + " : " + _vaction + " : " + _vlabel;}catch(e){}
    dataLayer.push({
        'category': _vcategory,
        'action': _vaction,
        'label': _vlabel,
        'event': _vevent
    });
    for (m = 0; m < 100000; m++) { }
}
//custom variables for DCM
function _gtm_push_new(_vcity, _vmake, _vmodel, _vprice, _vcategory, _vaction, _vlabel, _vevent) {
    try {


        var page_name = "buy-used-cars";
        if (_vaction == undefined) {
            _vaction = "";
        }
        _vaction = _vaction.replace(/(\r|\n)/g, " ");
        if (_vlabel.indexOf("http://") == -1 && _vlabel.indexOf("https://") == -1) {
            if (_vlabel.indexOf("/") == -1) { } else {
                _vlabel = _vlabel.replace(/\/\//g, "/");
                _vlabel = location.hostname + _vlabel;
            }
        }

        dataLayer.push({
            'cityvalue': _vcity,
            'makevalue': _vmake,
            'modelvalue': _vmodel,
            'pricevalue': _vprice,
            'category': _vcategory,
            'action': _vaction,
            'label': _vlabel,
            'event': _vevent
        });


        for (m = 0; m < 100000; m++) {

        }
    } catch (e) { }

}
// FOR GTM VPV 
function _gtm_vpv_push_datalayer(ga_vpv) {
    try {
        dataLayer.push({
            'event': 'page gtm vpv',
            'page': ga_vpv
        });
    } catch (e) { }

}

function _gtm_city_push(city) {
    try {
        dataLayer.push({
            'cd-city-ct': city + "",
            'event': 'city'
        });
    } catch (e) { }
}

function gtm_submit_filters() {
    var ftts = "";
    var mdss = '';
    var mds = '';
    var fptt = "";
    var pt = "";
    var pts = '';
    var idss = '';
    var ftt = "";
    var aggs = "";
    var agg = "";
    var ids = "";
    var gboxs = "";
    var gbox = "";
    var btypes = "";
    var btype = "";
    var colors = "";
    var color = "";
    var kms = "";
    var kmss = "";
    var pic = "";
    var pics = "";
    var owner = "";
    var ownerss = "";
    var certificate = "";
    var certificates = "";
    showLoader();
    var cty = document.getElementById("selectedcity").value;
    if (cty && cty != "[object NodeList]") {
        cty = cty.toLowerCase();
    } else {
        cty = "All";
    }
    var mk = document.getElementsByTagName('input');
    for (var i = 0; mk[i]; ++i) {
        if (mk[i].checked) {
            checkedValue = mk[i].name;

            if (checkedValue.indexOf("makes[") > -1) {
                if (ids == '') {
                    checkedValue = checkedValue.replace("makes[", "");
                    checkedValue = checkedValue.replace("]", "");
                    ids = checkedValue;
                } else {
                    checkedValue = checkedValue.replace("makes[", "");
                    checkedValue = checkedValue.replace("]", "");
                    ids = ids + ',' + checkedValue;
                }
            } else { //Added bY kuresh on 14-09-2015 according to soham's mail
                makval = makeselarr;
                ckval = makval.toString().split('woff').join('');
                ckval = ckval.toString().split('-').join(' ');
                ids = ckval;
            }
            if (checkedValue.indexOf("models[") > -1) {
                if (mds == '') {
                    checkedValue = checkedValue.replace("models[", "");
                    checkedValue = checkedValue.replace("]", "");
                    mds = checkedValue;
                } else {
                    checkedValue = checkedValue.replace("models[", "");
                    checkedValue = checkedValue.replace("]", "");
                    mds = mds + ',' + checkedValue;
                }
            }
        }
    }
    if (ids != "") {
        idss = "/make," + ids.substring(0, ids.length);
    } else {
        idss = "";
    }
    if (mds != "") {
        mdss = "/model," + mds.substring(0, mds.length);
    } else {
        mdss = "";
    }
    var fu = document.getElementsByName('fuel[]');
    for (var ii = 0; ii < fu.length; ii++) {
        if (document.getElementsByName('fuel[]')[ii].checked) {
            ftt += document.getElementsByName('fuel[]')[ii].value + ",";
        }
    }
    if (ftt != "") {
        ftts = "/fuel," + ftt.substring(0, ftt.length - 1);
    } else {
        ftts = "";
    }
    var pt = document.getElementsByName('carrate[]');
    for (var ii = 0; ii < pt.length; ii++) {
        if (document.getElementsByName('carrate[]')[ii].checked) {
            //if(document.getElementsByName('carrate[]')[ii].value==15){document.getElementsByName('carrate[]')[ii].value="15+"}
            pts += document.getElementsByName('carrate[]')[ii].value + ",";
        }
    }
    if (pts != "") {
        pts = "/price, " + pts.substring(0, pts.length - 1);
    } else {
        pts = "";
    }
    var ag = document.getElementsByName('car_age[]');
    for (var ii = 0; ii < ag.length; ii++) {
        if (document.getElementsByName('car_age[]')[ii].checked) {
            //if(document.getElementsByName('car_age[]')[ii].value==8){document.getElementsByName('car_age[]')[ii].value="8+";}
            agg += document.getElementsByName('car_age[]')[ii].value + "yr,";
        }
    }
    if (agg != "") {
        aggs = "/age," + agg.substring(0, agg.length - 1);
    } else {
        aggs = "";
    }

    var gbs = document.getElementsByName('gearbox[]');
    for (var ii = 0; ii < gbs.length; ii++) {
        if (document.getElementsByName('gearbox[]')[ii].checked) {
            gbox += document.getElementsByName('gearbox[]')[ii].value + ",";
        }
    }
    if (gbox != "") {
        gboxs = "/gearbox ," + gbox.substring(0, gbox.length - 1);
    } else {
        gboxs = "";
    }

    var bts = document.getElementsByName('bodytype[]');
    for (var ii = 0; ii < bts.length; ii++) {
        if (document.getElementsByName('bodytype[]')[ii].checked) {
            btype += document.getElementsByName('bodytype[]')[ii].value + ",";
        }
    }
    if (btype != "") {
        btypes = "/bodytype ," + btype.substring(0, btype.length - 1);
    } else {
        btypes = "";
    }

    var cobs = document.getElementsByName('color[]');
    for (var ii = 0; ii < cobs.length; ii++) {
        if (document.getElementsByName('color[]')[ii].checked) {
            color += document.getElementsByName('color[]')[ii].value + ",";
        }
    }
    if (color != "") {
        colors = "/colors ," + color.substring(0, color.length - 1);
    } else {
        colors = "";
    }

    var kbss = document.getElementsByName('kms_range[]');
    for (var ii = 0; ii < kbss.length; ii++) {
        if (document.getElementsByName('kms_range[]')[ii].checked) {
            //if(document.getElementsByName('kms_range[]')[ii].value=="50000-0"){document.getElementsByName('kms_range[]')[ii].value="50000";}
            kms += document.getElementsByName('kms_range[]')[ii].value + ",";
        }
    }
    if (kms != "") {
        kmss = "/kms ," + kms.substring(0, kms.length - 1);
    } else {
        kmss = "";
    }
    var im = document.getElementsByName('car_pic');
    for (var ii = 0; ii < im.length; ii++) {
        if (document.getElementsByName('car_pic')[ii].checked) {
            pic += document.getElementsByName('car_pic')[ii].value;
        }
    }
    if (pic != "") {
        pics = "/pic," + pic;
    } else {
        pics = "";
    }
    var now = document.getElementsByName('car_owner[]');
    for (var ii = 0; ii < now.length; ii++) {
        if (document.getElementsByName('car_owner[]')[ii].checked) {
            owner += document.getElementsByName('car_owner[]')[ii].value + " owner,";
        }
    }
    if (owner != "") {
        owner = owner.replace("4 owner", "More than 4 owner")
        ownerss = "/owners," + owner.substring(0, owner.length - 1);
    } else {
        ownerss = "";
    }
    var ic = document.getElementsByName('order_list_certification');
    for (var ii = 0; ii < ic.length; ii++) {
        if (document.getElementsByName("order_list_certification")[ii].checked) {
            certificate = document.getElementsByName("order_list_certification")[ii].value;
            if (certificate == "certified") { certificate = "Certified Cars"; } else if (certificate == "utrust_certified") { certificate = "U Trusted Cars"; } else if (certificate == "noncertified") { certificate = "All Cars"; }
        }
    }
    if (certificate != "") {
        certificates = "/certification," + certificate;
    } else {
        certificates = "";
    }

    var sublocation = $('[data-name="list_area"]:checked').val() + "";
    sublocation_ss = "";
    if (sublocation == "undefined") {
        sublocation = "not-selected";
    }
    if (sublocation.length > 0) {
        sublocation_ss = "/sublocation," + sublocation;
    }

    city_ss = '';
    if (cty.length > 0) {
        city_ss = 'city,' + cty;
    }

    // _gaq.push(['_trackPageview','/'+'vpv'+'/buy-used-cars/'+cty+idss+mdss+pts+ftts+aggs]);	
    dataLayer.push({
        'city': city_ss,
        'sublocation': sublocation_ss,
        'make': idss,
        'model': mdss,
        'price': pts,
        'fuel': ftts,
        'age': aggs,
        'gear': gboxs,
        'bodytype': btypes,
        'colors': colors,
        'kms': kmss,
        'pic': pics,
        'owners': ownerss,
        'certification': certificates,
        'event': 'mobile used car ajax load'
    });
    _gtm_push('UCP|Filter', "Apply Filter", location.href, 'eventucp filter');

    document.forms['find2'].keyword.value = "";
    document.forms['find2'].su_search_keyword.value = "";
    document.forms['find2'].submit();
}

function show_hide_sort(val) {
    try {
        _scroll_value = document.body.scrollTop;
        $('#_scorll_value').val(_scroll_value);
        $('.mcontainer1').removeClass('opened');
        $('.mslider').addClass('closed');
        $('#fix3').addClass('active-head');
        document.getElementById("filterdisplay").style.display = "none";

        document.getElementById("closeFloatbarId3").style.display = "block";
        document.getElementById("filtoptdiv").style.display = "none";
        document.getElementById("sortoptdisplay").style.display = "block";
        //document.getElementById("nav_foot").style.display = "none"; 
        dataLayer.push({
            'category': 'UsedCarSearch',
            'action': "Sort_By",
            'label': "Sort_By_option_clicked",
            'event': 'CWInteractive'
        });
        // @manikanta
        setPopupHistory("#sortoptdisplay");
        $('#footer,#header').addClass('hide-for-some-time');
    } catch (e) { }
}

function show_hide_hide_sort(val) {
    try {
        hide_filters();
        document.getElementById("closeFloatbarId3").style.display = "none";
        document.getElementById("sortoptdisplay").style.display = "none";
        // document.getElementById("nav_foot").style.display = "table"; 

        clearPopupHistory();
    } catch (e) { }
}

function setselectcnt(cityname) {
    try {
        document.getElementById("selectedcity").value = cityname;
        document.getElementById("city_cnt").style.display = "table";
    } catch (e) { }
}
__curr_active_city_lead = '';

function show_city_pop(popcity, cs) {
    //return false;
    var gtm_category = "Used Cars Results Page";
    try {
        if (__curr_data['popuptype'] == 'chat') {
            gtm_category = "Used Cars Results Page|Chat";
        }
    } catch (e) { }
    if (cs == 'undefined' || cs == undefined || !cs) {
        $('.clsbtn').attr('style', 'display:none!important');
        $('.clsbtn').parent().attr('style', 'padding:10px!important');
    } else {
        $('.clsbtn').attr('style', 'display:inline-block!important');
        $('.clsbtn').parent().attr('style', 'padding:0px!important');
        $('.clsbtncty').hide();
    }


    console.log("city pop");
    if (__curr_active_city_lead != null) {
        popcity = __curr_active_city_lead;
    }
    if (!popcity) {
        if (cs) {
            _gtm_push(gtm_category, "city popup search|open|city,all", document.location.pathname, "event Used Cars Results Page");
        } else {
            _gtm_push(gtm_category, "city popup search|auto open|city,all", document.location.pathname, "event Used Cars Results Page");
        }
        _gtm_city_push('all');
    } else {
        _gtm_push(gtm_category, "city popup search|open|city," + popcity, document.location.pathname, "event Used Cars Results Page");
        _gtm_city_push(popcity);
    }

    document.getElementById("tranbg").style.display = "block";
    document.getElementById("tranbg").style.overflow = "hidden";
    document.getElementById("idbybody").style.overflow = "hidden";
    // @manikanta
    __hash_change = false;
    document.getElementById("idbybody").style.position = "fixed";
    if (location.hash.length > 0) {

        if (cs == 'undefined' || cs == undefined || !cs) {
            setPopupHistory("#contactseller");
        } else {
            setPopupHistory("#contactseller#tranbg");
        }
    } else {
        if (cs == 'undefined' || cs == undefined || !cs) { } else {
            setPopupHistory("#tranbg");
        }
    }
    upMeAlways('popup_city');
}

// popup back button added by manikanta 20150908
var _global_slug = "";
var i = 0;

function setPopupHistory(slug) {
    _global_slug = slug;
    window.history.pushState("popup", "popup", slug);
}

function clearPopupHistory() {
    toturl = document.location.toString().split('#');
    hostnm = window.location.hostname;
    toturlvm = toturl[0].toString().split(hostnm)
    back_url = toturlvm[1];
    if (back_url.indexOf("#") != -1) {
        url_arr = back_url.split('#');
        back_url = url_arr[0];
    }
    window.history.replaceState("popup", "popup", back_url);
}


function closeApproprite(slug) {

    switch (slug) {
        case "#tranbg":
        case "#contactseller#tranbg":
            closepopup('fromhash');
            break;
        case "#sortoptdisplay":
            show_hide_hide_sort();
            break;
        case "#contactseller":
            break;
        case "#PL":
            break;
        case "#PL&SL":
            break;
        case "#":
            break;
        default:
            hide_filters();
            break;
    }
    _global_slug = '';
    positionFooter();

}




var lazy_load_filters = setInterval("lazy_load_fun_filters()", 1000);

function lazy_load_fun_filters() {
    try {
        if (typeof jQuery != 'undefined' && (document.readyState == "interactive" || document.readyState == 'complete')) {

            $(window).load(function () {

                $(window).on("hashchange", function (event, data) {
                    wflag = 1;
                    if (_global_slug.length > 0) {
                        if (_global_slug == '#contactseller#tranbg') {
                            _global_slug = '#tranbg';
                            wflag = 0;

                        }
                        closeApproprite(_global_slug);

                        if (wflag == 0) {
                            _global_slug = '#contactseller';
                        }
                    }
                });
                $('#mobile').keyup(function (e) {
                    blockChars(this, e);
                });



            });

            clearInterval(lazy_load_filters);

        }
    } catch (e) { }
}




var lazy_load_city = setInterval("lazy_load_fun_active_city()", 1000);

function lazy_load_fun_active_city() {
    try {
        if (typeof jQuery != 'undefined' && (document.readyState == "interactive" || document.readyState == 'complete')) {

            var active_city = '';
            $(function () {
                active_city = $('input[name="city"]:checked').attr('id');

                $('#contactseller input').focus(function () {
                    //$('#contactseller').css('top',$('#contactseller').offset().top-60);
                    $('#contactseller').addClass('move-top');
                });


            });

            clearInterval(lazy_load_city);

        }
    } catch (e) { }
}

// popup back button script closed
// blcoking characters added by manikanta on 20150908

var escape_keys = [13, 40, 37, 38, 39, 8, 27, 144, 9, 20, 18, 16, 17];

function blockChars(dis, e) {
    var ele = $(dis);
    var cval = ele.val();
    var key = ele.attr('name');
    if (inArray(e.keyCode))
        return false;

    if (parseInt(cval[0]) < 6)
        cval = '';
    ele.val(cval);
    lookup_mobile(0);
}

function inArray(needle) {
    var length = escape_keys.length;
    for (var i = 0; i < length; i++) {
        if (escape_keys[i] == needle)
            return true;
    }
    return false;
}

// ended here	

function closepopup(hashch) {

    /* added by manikanta for similar cars */
    __hash_change = false;
    setTimeout(function () {
        __hash_change = true;
    }, 500);
    /* end */

    reset_city_search();
    if (!hashch || hashch != "#") {
        console.log('closepopup');
        document.getElementById("tranbg").style.display = "none";
        document.getElementById("idbybody").style.overflow = "auto";
        // @manikanta
        document.getElementById("idbybody").style.position = "inherit";
    } else {

        reset_city_search();
        clearPopupHistory();
        setPopupHistory("#contactseller");

        document.getElementById("tranbg").style.display = "none";
        document.getElementById("idbybody").style.overflow = "auto";
        // @manikanta
        document.getElementById("idbybody").style.position = "inherit";
    }

}

function getFooterBottom() {
    $(".footer").css('position', 'static');
}
var newselarr = [];
var makeselarr = [];
var modelselarr = [];
var priceselarr = [];
var fuelselarr = [];
var kmsselarr = [];
var ageselarr = [];
var gearselarr = [];
var btypeselarr = [];
var colorselarr = [];
var picsselarr = [];
var ownerselarr = [];
var certiselarr = [];
var rel_price_cnt = Number("0");
for (k = 0; k < rel_price_cnt; k++) {
    priceselarr.push(k);
}
var rel_fuel_cnt = Number("0");
for (k = 0; k < rel_fuel_cnt; k++) {
    fuelselarr.push(k);
}
var rel_kms_cnt = Number("0");
for (k = 0; k < rel_kms_cnt; k++) {
    kmsselarr.push(k);
}
var rel_age_cnt = Number("0");
for (k = 0; k < rel_age_cnt; k++) {
    ageselarr.push(k);
}
var rel_gear_cnt = Number("0");
for (k = 0; k < rel_gear_cnt; k++) {
    gearselarr.push(k);
}
var rel_btype_cnt = Number("0");
for (k = 0; k < rel_btype_cnt; k++) {
    btypeselarr.push(k);
}
var rel_color_cnt = Number("0");
for (k = 0; k < rel_color_cnt; k++) {
    colorselarr.push(k);
}
var ownerlist = null;
for (b in ownerlist) {
    try {
        ownerselarr.push("car_owner_" + b);
    } catch (e) { }
}
/*var rel_make_cnt = Number("0")+Number("0");
 for( k=0; k<rel_make_cnt; k++ ){
 makeselarr.push(k);
 }*/
var makeslist = [];
for (b in makeslist) {
    var bb = makeslist[b].replace(' ', '-');
    try {
        makeselarr.push("woff" + bb);

    } catch (e) { }
}
var makeslistch = null;
for (b in makeslistch) {
    var bb = makeslistch[b].replace(' ', '-');
    try {
        makeselarr.push("woff" + bb);

    } catch (e) { }
}

function newselection2(vid, vval, vmake, dis) {
    try {
        newselarr.push(vid);
    } catch (e) { }
    try {
        if (vmake == "make") {
            try { document.getElementById("hid_first_sel_make").value = ''; } catch (e) { }
            if (document.getElementById(vid).checked == true) {
                try { document.getElementById("hid_first_sel_mod").value = "" } catch (e) { }
                try { document.getElementById("hid_first_sel_make").value = vval.replace(/\-/g, " "); } catch (e) { }
                if (makeselarr.indexOf(vid) >= 0) { } else {
                    makeselarr.push(vid);
                }
            } else {
                //makeselarr.pop(vid);
                var i = makeselarr.indexOf(vid);
                if (i != -1) {
                    makeselarr.splice(i, 1);
                }
            }
            apply_cnts("make", makeselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "price") {
            if (document.getElementById(vid).checked == true) {
                priceselarr.push(vid);
            } else {
                priceselarr.pop(vid);
            }
            apply_cnts("price", priceselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "fuel") {
            if (document.getElementById(vid).checked == true) {
                fuelselarr.push(vid);
            } else {
                fuelselarr.pop(vid);
            }
            apply_cnts("fuel", fuelselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "kms") {
            if (document.getElementById(vid).checked == true) {
                kmsselarr.push(vid);
            } else {
                kmsselarr.pop(vid);
            }
            apply_cnts("kms", kmsselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "age") {
            if (document.getElementById(vid).checked == true) {
                ageselarr.push(vid);
            } else {
                ageselarr.pop(vid);
            }
            apply_cnts("age", ageselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "gear") {
            if (document.getElementById(vid).checked == true) {
                gearselarr.push(vid);
            } else {
                gearselarr.pop(vid);
            }
            apply_cnts("gear", gearselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "btype") {
            if (document.getElementById(vid).checked == true) {
                btypeselarr.push(vid);
            } else {
                btypeselarr.pop(vid);
            }
            apply_cnts("btype", btypeselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "color") {
            if (document.getElementById(vid).checked == true) {
                colorselarr.push(vid);
            } else {
                colorselarr.pop(vid);
            }
            apply_cnts("color", colorselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "owner") {
            if (document.getElementById(vid).checked == true) {
                ownerselarr.push(vid);
            } else {
                //ownerselarr.pop(vid);
                var i = ownerselarr.indexOf(vid);
                if (i != -1) {
                    ownerselarr.splice(i, 1);
                }
            }
            apply_cnts("owner", ownerselarr);
        }
    } catch (e) { }
    try {
        if (vmake == "model") {
            try { document.getElementById("hid_first_sel_mod").value = "" } catch (e) { }
            if (document.getElementById(vid).checked == true) {
                //modelselarr.push(vid);
                document.getElementById("hid_first_sel_mod").value = $(dis).attr('data-modelname');
                try { document.getElementById("hid_first_sel_make").value = ""; } catch (e) { }
                var attr = $(dis).attr('data-val');
                if (attr != null) {
                    $('[data-val="' + attr + '"]').prop('checked', true);
                    $('[data-val="' + attr + '"]').each(function () {
                        modelselarr.push($(this).attr('id'));
                    });
                } else {
                    modelselarr.push($(this).attr('id'));

                }
            } else {
                //modelselarr.pop(vid);
                var countmodels = []
                var clname = document.getElementById(vid).className;
                var items = document.getElementsByClassName(clname);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].checked == true) {
                        countmodels.push(items[i].name);
                    }
                }
                if (countmodels.length == 0) {
                    if (document.getElementById(clname).checked == false) {
                        document.getElementById(clname).checked = true;
                    }
                }
                var i = modelselarr.indexOf(vid);
                if (i != -1) {
                    modelselarr.splice(i, 1);
                }
            }

            apply_cnts("make", makeselarr);
        }
    } catch (e) { }
}

function apply_cnts(idp, arr) {
    if (arr.length > 0) {
        document.getElementById(idp + "_cnt").style.display = "table";
    } else {
        document.getElementById(idp + "_cnt").style.display = "none";
    }
    if (idp == "make")
        document.getElementById(idp + "_cnt_id").innerHTML = $('#filt_ul_make input[type="checkbox"]:checked').length;
    else if (idp == 'pic')
        document.getElementById(idp + "_cnt_id").innerHTML = 1;
    else
        document.getElementById(idp + "_cnt_id").innerHTML = arr.length;
}

function unselectprev() {
    if (newselarr.length > 0) {
        for (i = 0; i < newselarr.length; i++) {
            try {
                document.getElementById(newselarr[i]).checked = false;
            } catch (e) { }
            /*try{ cmmd = newselarr[i].replace("woff","chmodels"); }catch(e){ }                                   
             try{ document.getElementById(cmmd).style.display = "none"; }catch(e){ }*/
        }
    }
    closeAllCities();
    var sscity = "Mumbai";
    var citylist = ["New Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad", "Chandigarh", "Gurgaon", "Noida", "Navi Mumbai", "Thane", "Cochin", "Faridabad", "Ghaziabad", "Agra", "Ahmednagar", "Ajmer", "Akola", "Alappuzha", "Aligarh", "Allahabad", "Alwar", "Amalapuram", "Ambala", "Amravati", "Amritsar", "Anand", "Anantapur", "Aurangabad", "Bareilly", "Bathinda", "Beed", "Belgaum", "Bellary", "Bhadohi", "Bharuch", "Bhavnagar", "Bhilai", "Bhilwara", "Bhimavaram", "Bhopal", "Bhubaneswar", "Bhuj", "Bikaner", "Bilaspur", "Bulandshahar", "Chidambaram", "Chittoor", "Coimbatore", "Cuddalore", "Davangere", "Dehradun", "Dhanbad", "Dharwad", "Dibrugarh", "Dindigul", "Durg", "Durgapur", "Eluru", "Erode", "Etah", "Faizabad", "Firozabad", "Gandhidham", "Gandhinagar", "Goa", "Gorakhpur", "Gulbarga", "Guntur", "Gurdaspur", "Guwahati", "Gwalior", "Haldwani", "Hapur", "Himmatnagar", "Hissar", "Hoshiarpur", "Hospet", "Hosur", "Howrah", "Hubli", "Idukki", "Indore", "Jabalpur", "Jagdalpur", "Jaipur", "Jalandhar", "Jalgaon", "Jammu", "Jamnagar", "Jamshedpur", "Jodhpur", "Kadapa", "Kakinada", "Kannur", "Kanpur", "Karimnagar", "Karnal", "Karur", "Kasaragod", "Khammam", "Khanna", "Kolar", "Kolhapur", "Kollam", "Kota", "Kottayam", "Kozhikode", "Kurnool", "Kurukshetra", "Latur", "Lucknow", "Ludhiana", "Madurai", "Malappuram", "Mandi", "Mangalore", "Mathura", "Meerut", "Mehsana", "Mirzapur", "Moga", "Mohali", "Moradabad", "Muzaffarnagar", "Mysore", "Nadia", "Nagercoil", "Nagpur", "Namakkal", "Nanded", "Nashik", "Nellore", "Neyveli", "Nizamabad", "Ongole", "Palakkad", "Palwal", "Panchkula", "Panipat", "Pathanamthitta", "Pathankot", "Patiala", "Patna", "Pimpri-Chinchwad", "Pollachi", "Pondicherry", "Port Blair", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Ratlam", "Ratnagiri", "Rohtak", "Roorkee", "Rudrapur", "Sagar", "Saharanpur", "Salem", "Sangli", "Sangrur", "Satara", "Shillong", "Shimla", "Shimoga", "Sikar", "Siliguri", "Sivakasi", "Solan", "Solapur", "Sonipat", "Sri Ganganagar", "Srinagar", "Surat", "Surendranagar", "Thanjavur", "Thiruvalla", "Thoothukudi", "Thrissur", "Tiruchirapalli", "Tirunelveli", "Tirupati", "Tirupur", "Tiruvalla", "Tiruvallur", "Trivandrum", "Tumkur", "Tuticorin", "Udaipur", "Udumalpet", "Udupi", "Ujjain", "Vadodara", "Valsad", "Vapi", "Varanasi", "Vellore", "Vijayawada", "Viluppuram", "Visakhapatnam", "Visnagar", "Vizianagaram", "Warangal", "Wayanad", "Yamunanagar", "Zirakpur"];
    for (b in citylist) {
        var bb = citylist[b].replace(/ /g, '-');
        try {
            document.getElementById("fltr_" + bb).checked = false;
        } catch (e) { }
    }
    try {
        if (sscity) {
            document.getElementById("fltr_" + sscity).checked = true;
            open_areas("#fltr_" + sscity, 1, '');
        } else {
            //document.getElementById("city_cnt").style.display="none";
        }
    } catch (e) { }
    makeselarr.splice(0, makeselarr.length);
    var makeslist = [];
    for (b in makeslist) {
        var bb = makeslist[b].replace(' ', '-');
        try {
            document.getElementById("woff" + bb).checked = true;
            document.getElementById("chmodels" + bb).style.display = "block";
            makeselarr.push("woff" + bb);
        } catch (e) {
            console.log(e);
        }
    }
    var makeslistch = null;
    for (b in makeslistch) {
        var bb = makeslistch[b] + "";
        var bb = bb.replace(/\s/g, "-");
        try {
            document.getElementById("chmodels" + bb).style.display = "block";
            makeselarr.push("woff" + bb);

        } catch (e) {
            console.log(e);
        }
    }
    apply_cnts("make", makeselarr);
    modelselarr.splice(0, modelselarr.length);
    var modelslist = [];
    for (b in modelslist) {
        try {
            // var bb = modelslist[b].replace(' ', '-'); 
            var bb = modelslist[b] + "";
            bb = bb.replace(/\s/g, "-");
            document.getElementById("woffmdmd" + bb).checked = true;
            modelselarr.push("woffmdmd" + bb);
        } catch (e) {
            console.log(e);
        }

    }
    apply_cnts("make", makeselarr);
    priceselarr.splice(0, priceselarr.length);
    var rel_price_cnt = Number("0");
    for (k = 0; k < rel_price_cnt; k++) {
        priceselarr.push(k);
    }
    apply_cnts("price", priceselarr);
    var pricelist = null;
    for (b in pricelist) {
        var bb = pricelist[b].replace('-', '');
        try {
            document.getElementById("carra_" + bb).checked = true;
        } catch (e) { }
    }
    fuelselarr.splice(0, fuelselarr.length);
    var rel_fuel_cnt = Number("0");
    for (k = 0; k < rel_fuel_cnt; k++) {
        fuelselarr.push(k);
    }
    var fuullist = null;
    for (b in fuullist) {
        var bb = fuullist[b].replace('+', '_');
        try {
            document.getElementById("fuel_" + bb).checked = true;
        } catch (e) { }
    }
    apply_cnts("fuel", fuelselarr);
    kmsselarr.splice(0, kmsselarr.length);
    var rel_kms_cnt = Number("0");
    for (k = 0; k < rel_kms_cnt; k++) {
        kmsselarr.push(k);
    }
    var kmsllist = null;
    for (b in kmsllist) {
        var bb = kmsllist[b].replace('+', '_');
        try {
            document.getElementById("kms_range" + bb).checked = true;
        } catch (e) { }
    }
    apply_cnts("kms", kmsselarr);
    ageselarr.splice(0, ageselarr.length);
    var rel_age_cnt = Number("0");
    for (k = 0; k < rel_age_cnt; k++) {
        ageselarr.push(k);
    }
    var agellist = null;
    for (b in agellist) {
        var bb = agellist[b].replace('-', '');
        try {
            document.getElementById("carage_" + bb).checked = true;
        } catch (e) { }
    }
    apply_cnts("age", ageselarr);
    gearselarr.splice(0, gearselarr.length);
    var rel_gear_cnt = Number("0");
    for (k = 0; k < rel_gear_cnt; k++) {
        gearselarr.push(k);
    }
    var gearlist = null;
    for (b in gearlist) {
        var bb = gearlist[b].replace('-', '');
        try {
            document.getElementById("gear_" + bb).checked = true;
        } catch (e) { }
    }
    var bdllist = null;
    for (b in bdllist) {
        var bb = bdllist[b].replace('-', '');
        try {
            document.getElementById("body_" + bb).checked = true;
        } catch (e) { }
    }
    apply_cnts("gear", gearselarr);
    btypeselarr.splice(0, btypeselarr.length);
    var rel_btype_cnt = Number("0");
    for (k = 0; k < rel_btype_cnt; k++) {
        btypeselarr.push(k);
    }
    apply_cnts("btype", btypeselarr);
    colorselarr.splice(0, colorselarr.length);
    var rel_color_cnt = Number("0");
    for (k = 0; k < rel_color_cnt; k++) {
        colorselarr.push(k);
    }
    var gearlist = null;
    for (b in gearlist) {
        var bb = gearlist[b].replace('-', '');
        try {
            document.getElementById("color_" + bb).checked = true;
        } catch (e) { }
    }
    apply_cnts("color", colorselarr);

    ownerselarr.splice(0, ownerselarr.length);
    var ownerlist = null;
    for (ol in ownerlist) {
        ownerselarr.push("car_owner_" + ol);
        try {
            document.getElementById("car_owner_" + ol).checked = true;
        } catch (e) { }
    }
    apply_cnts("owner", ownerselarr);

    var certlist = null;

    if (certlist != "" && certlist != null) {
        if (certiselarr.length == 0) {
            certiselarr.push(certlist);
        }
    }
    try {
        if (certlist == "certified") {
            document.getElementById("certification").checked = true;
            apply_cnts("certification", certiselarr);
        }
    } catch (e) { }

    var im = document.getElementsByName('car_pic');
    for (var ii = 0; ii < im.length; ii++) {
        document.getElementsByName('car_pic')[ii].checked = false;
    }
    var piclist = null;
    if (piclist != null) {
        if (piclist != "all") {
            if (picsselarr.length == 0) {
                picsselarr.push("carpic_" + piclist);
            }
        }
    }
    try {
        document.getElementById("carpic_" + piclist).checked = true;
    } catch (e) { }
    apply_cnts("pic", picsselarr);
    if (piclist == null) {
        try {
            document.getElementById("carpic_all").checked = true;
            //picsselarr.push("carpic_all")
        } catch (e) { }
    }
}

function setselectpiccnt(val) {
    if (val == "imagesonly") {
        try {
            document.getElementById("pic_cnt").style.display = "table";
            document.getElementById("pic_cnt_id").innerHTML = 1;
        } catch (e) { }
    } else if (val == "all") {
        try {
            document.getElementById("pic_cnt").style.display = "none";
            document.getElementById("pic_cnt_id").innerHTML = "";
        } catch (e) { }
    } else if (val == "certified" || val == "noncertified" || val == "utrust_certified") {
        try {
            if (val == "certified") {
                document.getElementById("certification_cnt").style.display = "table";
                document.getElementById("certification_cnt_id").innerHTML = (val == "noncertified") ? 0 : 1;
            } else if (val == "utrust_certified") {
                document.getElementById("certification_cnt").style.display = "table";
                document.getElementById("certification_cnt_id").innerHTML = (val == "noncertified") ? 0 : 1;
            } else {
                document.getElementById("certification_cnt").style.display = "none";
                document.getElementById("certification_cnt_id").innerHTML = "";
            }
        } catch (e) { }
    }
}

function clearFilters(flag) {
    $('#page-wrap input[type="checkbox"]:checked').prop("checked", false);
    $('#carpic_all').prop('checked', true);

    $('#page-wrap input[name="order_list_certification"]').prop("checked", false);
    $('#page-wrap input[name="order_list_certification"]:first').prop("checked", true);

    //$('#page-wrap .tabs.tabsleft .tab .count').not('#city_cnt,#pic_cnt').hide();
    $('#page-wrap .tabs.tabsleft .tab .count').not('#city_cnt').hide();
    $('#page-wrap .tabs .tab ul li ul:not(.js-all-models-container)').hide();
    try {
        document.getElementById("modelFromUrl").value = "0";
        document.getElementById("makeFromUrl").value = "0";
        document.getElementById("carFromUrl").value = "0";
    }
    catch (error) { }

    selectedMakesId = [];
    var certi_cars = $("input[name='certification']:checked");
    if (certi_cars.length > 0) {
        certi_cars[0].checked = 0;
    }
    var price = $("input[name='carrate[]']:checked");
    if (price.length > 0) {
        price[0].checked = 0;
    }
    var km = $("input[name='kms_range[]']:checked");
    if (km.length > 0) {
        km[0].checked = 0;
    }
    var age = $("input[name='car_age[]']:checked");
    if (age.length > 0) {
        age[0].checked = 0;
    }
    $("#noncertification").prop('checked', true);
    resetSliders({ shouldReset: true });
    if (flag)
        filter_click_track('clear_filter');

    return false;
}

function resetSliders({ shouldReset })
{
    if(slider) {
        let sliderIds = slider.getAllSliderIds();
        Array.isArray(sliderIds) && sliderIds.forEach(filter => {
            slider.setSlider({ sliderId: filter, shouldReset: true, sliderRangeValue: shouldReset ? "" : getFilterFromQueryParams(filter) });
        });
    }
}

function initializeFilters(filterName)
{
    switch(filterName)
    {
        case USED_FILTER_ENUM.VERIFIED_CARS:
            let certification = getFilterFromQueryParams("filterByAdditional");
            let additionalTags = getFilterFromQueryParams("additionalTags");
            let selectedFilters = [{value: certification, id: "certification"}, {value: additionalTags, id: "additional-tags"}];
            selectedFilters.forEach(
                selectedFilter => {
                    initializeFilter({selectedFilters: selectedFilter.value, inputName: selectedFilter.id, inputType: "checkbox", dataValue: "value"})
                }
            )
        break;
        case USED_FILTER_ENUM.FUEL:
            let selectedFuels = getFilterFromQueryParams(USED_FILTER_ENUM.FUEL);
            initializeFilter({selectedFilters: selectedFuels, inputName: "fuel[]", inputType: "checkbox", dataValue: "value"})
        break;
        case USED_FILTER_ENUM.KMS:
            let kmsRange = getFilterFromQueryParams(USED_FILTER_ENUM.KMS);
            $(`[name="kms_range[]"][type=radio]:checked`).prop("checked", false);
            let selectedKms = $(`[name="kms_range[]"][type=radio][value="${kmsRange}"]`);
            if(selectedKms)
            {
                selectedKms.prop("checked", true);
            }
        break;
        case USED_FILTER_ENUM.TRANSMISSION:
            let selectedTransmission = getFilterFromQueryParams(USED_FILTER_ENUM.TRANSMISSION);
            initializeFilter({selectedFilters: selectedTransmission, inputName: "gearbox[]", inputType: "checkbox", dataValue: "data-value"});
        break;
        case USED_FILTER_ENUM.BODY_TYPE:
            let selectedBodytype = getFilterFromQueryParams(USED_FILTER_ENUM.BODY_TYPE);
            initializeFilter({selectedFilters: selectedBodytype, inputName: "bodytype[]", inputType: "checkbox", dataValue: "value"});
        break;
        case USED_FILTER_ENUM.OWNERS:
            let selectedOwners = getFilterFromQueryParams(USED_FILTER_ENUM.OWNERS);
            initializeFilter({selectedFilters: selectedOwners, inputName: "car_owner[]", inputType: "checkbox", dataValue: "value"});
        break;
        case USED_FILTER_ENUM.COLORS:
            let selectedColors = getFilterFromQueryParams(USED_FILTER_ENUM.COLORS);
            initializeFilter({selectedFilters: selectedColors, inputName: "filter-colors", inputType: "checkbox", dataValue: "value"});
        break;  
        case USED_FILTER_ENUM.PICTURES:
            let selectedAdditionalFilter = getFilterFromQueryParams("filterByAdditional");
            initializeFilter({selectedFilters: selectedAdditionalFilter , inputName: "car_pic", inputType: "radio", dataValue: "value"});
        break;
    }
}

function initializeFilter({selectedFilters, inputName, inputType, dataValue})
{
    $(`[name="${inputName}"][type=${inputType}]:checked`).prop("checked", false);
    Array.isArray(selectedFilters) && selectedFilters.forEach(
        f => {
            let selectedInputType = $(`[name="${inputName}"][type=${inputType}][${dataValue}="${f}"]`);
            if(selectedInputType)
            {
                selectedInputType.prop("checked", true);
            }
        }
    )
}

function init_date_time_picker() {
    $.DateTimePicker = $.DateTimePicker || { name: "DateTimePicker", i18n: {}, defaults: { mode: "date", defaultDate: new Date, dateSeparator: "-", timeSeparator: ":", timeMeridiemSeparator: " ", dateTimeSeparator: " ", monthYearSeparator: " ", dateTimeFormat: "dd-MM-yyyy HH:mm", dateFormat: "dd-MM-yyyy", timeFormat: "HH:mm", maxDate: null, minDate: null, maxTime: null, minTime: null, maxDateTime: null, minDateTime: null, shortDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], fullDayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], fullMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], minuteInterval: 1, roundOffMinutes: !0, secondsInterval: 1, roundOffSeconds: !0, titleContentDate: "Set Date", titleContentTime: "Set Time", titleContentDateTime: "Set Date & Time", buttonsToDisplay: ["HeaderCloseButton", "SetButton", "ClearButton"], setButtonContent: "Done", clearButtonContent: "Cancel", incrementButtonContent: "+", decrementButtonContent: "-", setValueInTextboxOnEveryClick: !1, animationDuration: 400, isPopup: !0, parentElement: "body", language: "", init: null, addEventHandlers: null, beforeShow: null, afterShow: null, beforeHide: null, afterHide: null, buttonClicked: null, formatHumanDate: null, parseDateTimeString: null, formatDateTimeString: null }, dataObject: { dCurrentDate: new Date, iCurrentDay: 0, iCurrentMonth: 0, iCurrentYear: 0, iCurrentHour: 0, iCurrentMinutes: 0, iCurrentSeconds: 0, sCurrentMeridiem: "", iMaxNumberOfDays: 0, sDateFormat: "", sTimeFormat: "", sDateTimeFormat: "", dMinValue: null, dMaxValue: null, sArrInputDateFormats: [], sArrInputTimeFormats: [], sArrInputDateTimeFormats: [], bArrMatchFormat: [], bDateMode: !1, bTimeMode: !1, bDateTimeMode: !1, oInputElement: null, iTabIndex: 0, bElemFocused: !1, bIs12Hour: !1 } }, $.cf = {
        _isValid: function (t) { return void 0 !== t && null !== t && "" !== t },
        _compare: function (t, e) {
            var a = void 0 !== t && null !== t,
                r = void 0 !== e && null !== e;
            return a && r && t.toLowerCase() === e.toLowerCase() ? !0 : !1
        }
    },
        function (t) { "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports ? module.exports = t(require("jquery")) : t(jQuery) }(function (t) {
            "use strict";

            function e(e, a) {
                this.element = e;
                var r = "";
                r = t.cf._isValid(a) && t.cf._isValid(a.language) ? a.language : t.DateTimePicker.defaults.language, this.settings = t.extend({}, t.DateTimePicker.defaults, a, t.DateTimePicker.i18n[r]), this.oData = t.extend({}, t.DateTimePicker.dataObject), this._defaults = t.DateTimePicker.defaults, this._name = t.DateTimePicker.name, this.init()
            }
            t.fn.DateTimePicker = function (a) {
                var r, o, n = t(this).data(),
                    i = n && Object.keys(n);
                if ("string" != typeof a) return this.each(function () { t.removeData(this, "plugin_DateTimePicker"), t.data(this, "plugin_DateTimePicker") || t.data(this, "plugin_DateTimePicker", new e(this, a)) });
                if (t.cf._isValid(n))
                    if ("destroy" === a)
                        if (i.length > 0) {
                            for (r in i)
                                if (o = i[r], -1 !== o.search("plugin_DateTimePicker")) { t(document).unbind("click.DateTimePicker"), t(document).unbind("keydown.DateTimePicker"), t(document).unbind("keyup.DateTimePicker"), t(this).children().remove(), t(this).removeData(), t(this).unbind(), t(this).removeClass("dtpicker-overlay dtpicker-mobile"), n = n[o], console.log("Destroyed DateTimePicker Object"), console.log(n); break }
                        } else console.log("No DateTimePicker Object Defined For This Element");
                    else if ("object" === a)
                        if (i.length > 0) {
                            for (r in i)
                                if (o = i[r], -1 !== o.search("plugin_DateTimePicker")) return n[o]
                        } else console.log("No DateTimePicker Object Defined For This Element")
            }, e.prototype = {
                init: function () {
                    var e = this;
                    e._setDateFormatArray(), e._setTimeFormatArray(), e._setDateTimeFormatArray(), e.settings.isPopup && (e._createPicker(), t(e.element).addClass("dtpicker-mobile")), e.settings.init && e.settings.init.call(e), e._addEventHandlersForInput()
                },
                _setDateFormatArray: function () {
                    var t = this;
                    t.oData.sArrInputDateFormats = [];
                    var e = "";
                    e = "dd" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "yyyy", t.oData.sArrInputDateFormats.push(e), e = "MM" + t.settings.dateSeparator + "dd" + t.settings.dateSeparator + "yyyy", t.oData.sArrInputDateFormats.push(e), e = "yyyy" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "dd", t.oData.sArrInputDateFormats.push(e), e = "dd" + t.settings.dateSeparator + "MMM" + t.settings.dateSeparator + "yyyy", t.oData.sArrInputDateFormats.push(e), e = "MM" + t.settings.monthYearSeparator + "yyyy", t.oData.sArrInputDateFormats.push(e), e = "MMM" + t.settings.monthYearSeparator + "yyyy", t.oData.sArrInputDateFormats.push(e), e = "MMMM" + t.settings.monthYearSeparator + "yyyy", t.oData.sArrInputDateFormats.push(e)
                },
                _setTimeFormatArray: function () {
                    var t = this;
                    t.oData.sArrInputTimeFormats = [];
                    var e = "";
                    e = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss" + t.settings.timeMeridiemSeparator + "AA", t.oData.sArrInputTimeFormats.push(e), e = "HH" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss", t.oData.sArrInputTimeFormats.push(e), e = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeMeridiemSeparator + "AA", t.oData.sArrInputTimeFormats.push(e), e = "HH" + t.settings.timeSeparator + "mm", t.oData.sArrInputTimeFormats.push(e)
                },
                _setDateTimeFormatArray: function () {
                    var t = this;
                    t.oData.sArrInputDateTimeFormats = [];
                    var e = "",
                        a = "",
                        r = "";
                    e = "dd" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "yyyy", a = "HH" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "dd" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "yyyy", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss" + t.settings.timeMeridiemSeparator + "AA", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "MM" + t.settings.dateSeparator + "dd" + t.settings.dateSeparator + "yyyy", a = "HH" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "MM" + t.settings.dateSeparator + "dd" + t.settings.dateSeparator + "yyyy", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss" + t.settings.timeMeridiemSeparator + "AA", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "yyyy" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "dd", a = "HH" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "yyyy" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "dd", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss" + t.settings.timeMeridiemSeparator + "AA", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "dd" + t.settings.dateSeparator + "MMM" + t.settings.dateSeparator + "yyyy", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "dd" + t.settings.dateSeparator + "MMM" + t.settings.dateSeparator + "yyyy", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeSeparator + "ss" + t.settings.timeMeridiemSeparator + "AA", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "dd" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "yyyy", a = "HH" + t.settings.timeSeparator + "mm", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "dd" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "yyyy", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeMeridiemSeparator + "AA", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "MM" + t.settings.dateSeparator + "dd" + t.settings.dateSeparator + "yyyy", a = "HH" + t.settings.timeSeparator + "mm", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "MM" + t.settings.dateSeparator + "dd" + t.settings.dateSeparator + "yyyy", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeMeridiemSeparator + "AA", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "yyyy" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "dd", a = "HH" + t.settings.timeSeparator + "mm", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "yyyy" + t.settings.dateSeparator + "MM" + t.settings.dateSeparator + "dd", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeMeridiemSeparator + "AA", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "dd" + t.settings.dateSeparator + "MMM" + t.settings.dateSeparator + "yyyy", a = "hh" + t.settings.timeSeparator + "mm", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r), e = "dd" + t.settings.dateSeparator + "MMM" + t.settings.dateSeparator + "yyyy", a = "hh" + t.settings.timeSeparator + "mm" + t.settings.timeMeridiemSeparator + "AA", r = e + t.settings.dateTimeSeparator + a, t.oData.sArrInputDateTimeFormats.push(r)
                },
                _matchFormat: function (e, a) {
                    var r = this;
                    r.oData.bArrMatchFormat = [], r.oData.bDateMode = !1, r.oData.bTimeMode = !1, r.oData.bDateTimeMode = !1;
                    var o, n = [];
                    for (e = t.cf._isValid(e) ? e : r.settings.mode, t.cf._compare(e, "date") ? (a = t.cf._isValid(a) ? a : r.oData.sDateFormat, r.oData.bDateMode = !0, n = r.oData.sArrInputDateFormats) : t.cf._compare(e, "time") ? (a = t.cf._isValid(a) ? a : r.oData.sTimeFormat, r.oData.bTimeMode = !0, n = r.oData.sArrInputTimeFormats) : t.cf._compare(e, "datetime") && (a = t.cf._isValid(a) ? a : r.oData.sDateTimeFormat, r.oData.bDateTimeMode = !0, n = r.oData.sArrInputDateTimeFormats), o = 0; o < n.length; o++) r.oData.bArrMatchFormat.push(t.cf._compare(a, n[o]))
                },
                _setMatchFormat: function (t, e, a) {
                    var r = this;
                    t > 0 && r._matchFormat(e, a)
                },
                _createPicker: function () {
                    var e = this;
                    t(e.element).addClass("dtpicker-overlay");
                    var a = "";
                    a += "<div class='dtpicker-bg'>", a += "<div class='dtpicker-cont'>", a += "<div class='dtpicker-content'>", a += "<div class='dtpicker-subcontent'>", a += "</div>", a += "</div>", a += "</div>", a += "</div>", t(e.element).html(a)
                },
                _addEventHandlersForInput: function () {
                    var e = this;
                    e.oData.oInputElement = null, t(e.settings.parentElement).find("input[type='date'], input[type='time'], input[type='datetime']").each(function () { t(this).attr("type", "text"), t(this).attr("data-field", t(this).attr("type")) });
                    var a = "[data-field='date'], [data-field='time'], [data-field='datetime']";
                    t(e.settings.parentElement).off("focus", a, e._inputFieldFocus), t(e.settings.parentElement).on("focus", a, { obj: e }, e._inputFieldFocus), t(e.settings.parentElement).off("click", a, e._inputFieldClick), t(e.settings.parentElement).on("click", a, { obj: e }, e._inputFieldClick), e.settings.addEventHandlers && e.settings.addEventHandlers.call(e)
                },
                _inputFieldFocus: function (t) {
                    var e = t.data.obj;
                    e.showDateTimePicker(this), e.oData.bMouseDown = !1
                },
                _inputFieldClick: function (e) {
                    var a = e.data.obj;
                    t.cf._compare(t(this).prop("tagName"), "input") || a.showDateTimePicker(this), e.stopPropagation()
                },
                setDateTimeStringInInputField: function (e, a) {
                    var r = this;
                    a = a || r.oData.dCurrentDate;
                    var o;
                    t.cf._isValid(e) ? (o = [], "string" == typeof e ? o.push(e) : "object" == typeof e && (o = e)) : o = t.cf._isValid(r.settings.parentElement) ? t(r.settings.parentElement).find("[data-field='date'], [data-field='time'], [data-field='datetime']") : t("[data-field='date'], [data-field='time'], [data-field='datetime']"), o.each(function () {
                        var e, o, n, i, s = this;
                        e = t(s).data("field"), t.cf._isValid(e) || (e = r.settings.mode), o = t(s).data("format"), t.cf._isValid(o) || (t.cf._compare(e, "date") ? o = r.settings.dateFormat : t.cf._compare(e, "time") ? o = r.settings.timeFormat : t.cf._compare(e, "datetime") && (o = r.settings.dateTimeFormat)), n = r.getIs12Hour(e, o), i = r._setOutput(e, o, n, a), t(s).val(i)
                    })
                },
                getDateTimeStringInFormat: function (t, e, a) { var r = this; return r._setOutput(t, e, r.getIs12Hour(t, e), a) },
                showDateTimePicker: function (t) {
                    var e = this;
                    null !== e.oData.oInputElement ? (e._hidePicker(0, t), clearPopupHistory()) : (e._showPicker(t), setPopupHistory("datetime_popup"))
                },
                _setButtonAction: function (t) {
                    var e = this;
                    null !== e.oData.oInputElement && (e._setValueOfElement(e._setOutput()), t ? (e._hidePicker(0), clearPopupHistory()) : setaptime && (e._hidePicker(""), clearPopupHistory()))
                },
                _setOutput: function (e, a, r, o) {
                    var n = this;
                    o = t.cf._isValid(o) ? o : n.oData.dCurrentDate, r = r || n.oData.bIs12Hour;
                    var i, s, m, u, d, c, D, l = "",
                        p = o.getDate(),
                        M = o.getMonth(),
                        h = o.getFullYear(),
                        g = o.getHours(),
                        f = o.getMinutes(),
                        C = o.getSeconds(),
                        b = "",
                        y = "",
                        T = Function.length;
                    return n._setMatchFormat(T, e, a), n.oData.bDateMode ? n.oData.bArrMatchFormat[0] ? (M++, i = 10 > p ? "0" + p : p, s = 10 > M ? "0" + M : M, l = i + n.settings.dateSeparator + s + n.settings.dateSeparator + h) : n.oData.bArrMatchFormat[1] ? (M++, i = 10 > p ? "0" + p : p, s = 10 > M ? "0" + M : M, l = s + n.settings.dateSeparator + i + n.settings.dateSeparator + h) : n.oData.bArrMatchFormat[2] ? (M++, i = 10 > p ? "0" + p : p, s = 10 > M ? "0" + M : M, l = h + n.settings.dateSeparator + s + n.settings.dateSeparator + i) : n.oData.bArrMatchFormat[3] ? (i = 10 > p ? "0" + p : p, s = n.settings.shortMonthNames[M], l = i + n.settings.dateSeparator + s + n.settings.dateSeparator + h) : n.oData.bArrMatchFormat[4] ? (p = 1, M++, s = 10 > M ? "0" + M : M, l = s + n.settings.monthYearSeparator + h) : n.oData.bArrMatchFormat[5] ? (p = 1, s = n.settings.shortMonthNames[M], l = s + n.settings.monthYearSeparator + h) : n.oData.bArrMatchFormat[6] && (p = 1, s = n.settings.fullMonthNames[M], l = s + n.settings.monthYearSeparator + h) : n.oData.bTimeMode ? ((n.oData.bArrMatchFormat[0] || n.oData.bArrMatchFormat[2]) && (m = n._determineMeridiemFromHourAndMinutes(g, f), 0 === g && "AM" === m ? g = 12 : g > 12 && "PM" === m && (g -= 12)), u = 10 > g ? "0" + g : g, d = 10 > f ? "0" + f : f, n.oData.bArrMatchFormat[0] ? (c = 10 > C ? "0" + C : C, l = u + n.settings.timeSeparator + d + n.settings.timeSeparator + c + n.settings.timeMeridiemSeparator + m) : n.oData.bArrMatchFormat[1] ? (c = 10 > C ? "0" + C : C, l = u + n.settings.timeSeparator + d + n.settings.timeSeparator + c) : n.oData.bArrMatchFormat[2] ? l = u + n.settings.timeSeparator + d + n.settings.timeMeridiemSeparator + m : n.oData.bArrMatchFormat[3] && (l = u + n.settings.timeSeparator + d)) : n.oData.bDateTimeMode && (n.oData.bArrMatchFormat[0] || n.oData.bArrMatchFormat[1] || n.oData.bArrMatchFormat[8] || n.oData.bArrMatchFormat[9] ? (M++, i = 10 > p ? "0" + p : p, s = 10 > M ? "0" + M : M, b = i + n.settings.dateSeparator + s + n.settings.dateSeparator + h) : n.oData.bArrMatchFormat[2] || n.oData.bArrMatchFormat[3] || n.oData.bArrMatchFormat[10] || n.oData.bArrMatchFormat[11] ? (M++, i = 10 > p ? "0" + p : p, s = 10 > M ? "0" + M : M, b = s + n.settings.dateSeparator + i + n.settings.dateSeparator + h) : n.oData.bArrMatchFormat[4] || n.oData.bArrMatchFormat[5] || n.oData.bArrMatchFormat[12] || n.oData.bArrMatchFormat[13] ? (M++, i = 10 > p ? "0" + p : p, s = 10 > M ? "0" + M : M, b = h + n.settings.dateSeparator + s + n.settings.dateSeparator + i) : (n.oData.bArrMatchFormat[6] || n.oData.bArrMatchFormat[7] || n.oData.bArrMatchFormat[14] || n.oData.bArrMatchFormat[15]) && (i = 10 > p ? "0" + p : p, s = n.settings.shortMonthNames[M], b = i + n.settings.dateSeparator + s + n.settings.dateSeparator + h), D = n.oData.bArrMatchFormat[0] || n.oData.bArrMatchFormat[1] || n.oData.bArrMatchFormat[2] || n.oData.bArrMatchFormat[3] || n.oData.bArrMatchFormat[4] || n.oData.bArrMatchFormat[5] || n.oData.bArrMatchFormat[6] || n.oData.bArrMatchFormat[7], r ? (m = n._determineMeridiemFromHourAndMinutes(g, f), 0 === g && "AM" === m ? g = 12 : g > 12 && "PM" === m && (g -= 12), u = 10 > g ? "0" + g : g, d = 10 > f ? "0" + f : f, D ? (c = 10 > C ? "0" + C : C, y = u + n.settings.timeSeparator + d + n.settings.timeSeparator + c + n.settings.timeMeridiemSeparator + m) : y = u + n.settings.timeSeparator + d + n.settings.timeMeridiemSeparator + m) : (u = 10 > g ? "0" + g : g, d = 10 > f ? "0" + f : f, D ? (c = 10 > C ? "0" + C : C, y = u + n.settings.timeSeparator + d + n.settings.timeSeparator + c) : y = u + n.settings.timeSeparator + d), l = b + n.settings.dateTimeSeparator + y), n._setMatchFormat(T), l
                },
                _clearButtonAction: function () {
                    var t = this;
                    null !== t.oData.oInputElement, t._hidePicker(""), clearPopupHistory()
                },
                _setOutputOnIncrementOrDecrement: function () {
                    var e = this;
                    t.cf._isValid(e.oData.oInputElement) && e.settings.setValueInTextboxOnEveryClick && e._setValueOfElement(e._setOutput())
                },
                _showPicker: function (e) {
                    var a = this;
                    if (null === a.oData.oInputElement) {
                        a.oData.oInputElement = e, a.oData.iTabIndex = parseInt(t(e).attr("tabIndex"));
                        var r = t(e).data("field") || "",
                            o = t(e).data("min") || "",
                            n = t(e).data("max") || "",
                            i = t(e).data("format") || "",
                            s = t(e).data("view") || "",
                            m = t(e).data("startend") || "",
                            u = t(e).data("startendelem") || "",
                            d = a._getValueOfElement(e) || "";
                        if ("" !== s && (t.cf._compare(s, "Popup") ? a.setIsPopup(!0) : a.setIsPopup(!1)), !a.settings.isPopup) {
                            a._createPicker();
                            var c = t(a.oData.oInputElement).offset().top + t(a.oData.oInputElement).outerHeight(),
                                D = t(a.oData.oInputElement).offset().left,
                                l = t(a.oData.oInputElement).outerWidth();
                            t(a.element).css({ position: "absolute", top: c, left: D, width: l, height: "auto" })
                        }
                        a.settings.beforeShow && a.settings.beforeShow.call(a, e), r = t.cf._isValid(r) ? r : a.settings.mode, a.settings.mode = r, t.cf._isValid(i) || (t.cf._compare(r, "date") ? i = a.settings.dateFormat : t.cf._compare(r, "time") ? i = a.settings.timeFormat : t.cf._compare(r, "datetime") && (i = a.settings.dateTimeFormat)), a._matchFormat(r, i), a.oData.dMinValue = null, a.oData.dMaxValue = null, a.oData.bIs12Hour = !1;
                        var p, M, h, g, f, C, b, y;
                        a.oData.bDateMode ? (p = o || a.settings.minDate, M = n || a.settings.maxDate, a.oData.sDateFormat = i, t.cf._isValid(p) && (a.oData.dMinValue = a._parseDate(p)), t.cf._isValid(M) && (a.oData.dMaxValue = a._parseDate(M)), "" !== m && (t.cf._compare(m, "start") || t.cf._compare(m, "end")) && "" !== u && t(u).length >= 1 && (h = a._getValueOfElement(t(u)), "" !== h && (g = a.settings.parseDateTimeString ? a.settings.parseDateTimeString.call(a, h, r, t(u)) : a._parseDate(h), t.cf._compare(m, "start") ? t.cf._isValid(M) ? a._compareDates(g, a.oData.dMaxValue) < 0 && (a.oData.dMaxValue = new Date(g)) : a.oData.dMaxValue = new Date(g) : t.cf._compare(m, "end") && (t.cf._isValid(p) ? a._compareDates(g, a.oData.dMinValue) > 0 && (a.oData.dMinValue = new Date(g)) : a.oData.dMinValue = new Date(g)))), a.settings.parseDateTimeString ? a.oData.dCurrentDate = a.settings.parseDateTimeString.call(a, d, r, t(e)) : a.oData.dCurrentDate = a._parseDate(d), a.oData.dCurrentDate.setHours(0), a.oData.dCurrentDate.setMinutes(0), a.oData.dCurrentDate.setSeconds(0)) : a.oData.bTimeMode ? (p = o || a.settings.minTime, M = n || a.settings.maxTime, a.oData.sTimeFormat = i, t.cf._isValid(p) && (a.oData.dMinValue = a._parseTime(p)), t.cf._isValid(M) && (a.oData.dMaxValue = a._parseTime(M)), "" !== m && (t.cf._compare(m, "start") || t.cf._compare(m, "end")) && "" !== u && t(u).length >= 1 && (f = a._getValueOfElement(t(u)), "" !== f && (a.settings.parseDateTimeString ? g = a.settings.parseDateTimeString.call(a, f, r, t(u)) : C = a._parseTime(f), t.cf._compare(m, "start") ? (C.setMinutes(C.getMinutes() - 1), t.cf._isValid(M) ? 2 === a._compareTime(C, a.oData.dMaxValue) && (a.oData.dMaxValue = new Date(C)) : a.oData.dMaxValue = new Date(C)) : t.cf._compare(m, "end") && (C.setMinutes(C.getMinutes() + 1), t.cf._isValid(p) ? 3 === a._compareTime(C, a.oData.dMinValue) && (a.oData.dMinValue = new Date(C)) : a.oData.dMinValue = new Date(C)))), a.oData.bIs12Hour = a.getIs12Hour(), a.settings.parseDateTimeString ? a.oData.dCurrentDate = a.settings.parseDateTimeString.call(a, d, r, t(e)) : a.oData.dCurrentDate = a._parseTime(d)) : a.oData.bDateTimeMode && (p = o || a.settings.minDateTime, M = n || a.settings.maxDateTime, a.oData.sDateTimeFormat = i, t.cf._isValid(p) && (a.oData.dMinValue = a._parseDateTime(p)), t.cf._isValid(M) && (a.oData.dMaxValue = a._parseDateTime(M)), "" !== m && (t.cf._compare(m, "start") || t.cf._compare(m, "end")) && "" !== u && t(u).length >= 1 && (b = a._getValueOfElement(t(u)), "" !== b && (y = a.settings.parseDateTimeString ? a.settings.parseDateTimeString.call(a, b, r, t(u)) : a._parseDateTime(b), t.cf._compare(m, "start") ? t.cf._isValid(M) ? a._compareDateTime(y, a.oData.dMaxValue) < 0 && (a.oData.dMaxValue = new Date(y)) : a.oData.dMaxValue = new Date(y) : t.cf._compare(m, "end") && (t.cf._isValid(p) ? a._compareDateTime(y, a.oData.dMinValue) > 0 && (a.oData.dMinValue = new Date(y)) : a.oData.dMinValue = new Date(y)))), a.oData.bIs12Hour = a.getIs12Hour(), a.settings.parseDateTimeString ? a.oData.dCurrentDate = a.settings.parseDateTimeString.call(a, d, r, t(e)) : a.oData.dCurrentDate = a._parseDateTime(d)), a._setVariablesForDate(), a._modifyPicker(), t(a.element).fadeIn(a.settings.animationDuration), a.settings.afterShow && setTimeout(function () { a.settings.afterShow.call(a, e) }, a.settings.animationDuration)
                    }
                    a.oData.iCurrentHour++, a._setCurrentDate(), a._setOutputOnIncrementOrDecrement()
                },
                _hidePicker: function (e, a) {
                    var r = this,
                        o = r.oData.oInputElement;
                    r.settings.beforeHide && r.settings.beforeHide.call(r, o), t.cf._isValid(e) || (e = r.settings.animationDuration), t.cf._isValid(r.oData.oInputElement) && (t(r.oData.oInputElement).blur(), r.oData.oInputElement = null), t(r.element).fadeOut(e), 0 === e ? t(r.element).find(".dtpicker-subcontent").html("") : setTimeout(function () { t(r.element).find(".dtpicker-subcontent").html("") }, e), t(document).unbind("click.DateTimePicker"), t(document).unbind("keydown.DateTimePicker"), t(document).unbind("keyup.DateTimePicker"), r.settings.afterHide && (console.log("tooooo" + a), 0 === e ? r.settings.afterHide.call(r, o) : setTimeout(function () { r.settings.afterHide.call(r, o) }, e)), t.cf._isValid(a) && r._showPicker(a)
                },
                _modifyPicker: function () {
                    var e, a, r = this,
                        o = [];
                    r.oData.bDateMode ? (e = r.settings.titleContentDate, a = 3, r.oData.bArrMatchFormat[0] ? o = ["day", "month", "year"] : r.oData.bArrMatchFormat[1] ? o = ["month", "day", "year"] : r.oData.bArrMatchFormat[2] ? o = ["year", "month", "day"] : r.oData.bArrMatchFormat[3] ? o = ["day", "month", "year"] : r.oData.bArrMatchFormat[4] ? (a = 2, o = ["month", "year"]) : r.oData.bArrMatchFormat[5] ? (a = 2, o = ["month", "year"]) : r.oData.bArrMatchFormat[6] && (a = 2, o = ["month", "year"])) : r.oData.bTimeMode ? (e = r.settings.titleContentTime, r.oData.bArrMatchFormat[0] ? (a = 4, o = ["hour", "minutes", "seconds", "meridiem"]) : r.oData.bArrMatchFormat[1] ? (a = 3, o = ["hour", "minutes", "seconds"]) : r.oData.bArrMatchFormat[2] ? (a = 3, o = ["hour", "minutes", "meridiem"]) : r.oData.bArrMatchFormat[3] && (a = 2, o = ["hour", "minutes"])) : r.oData.bDateTimeMode && (e = r.settings.titleContentDateTime, r.oData.bArrMatchFormat[0] ? (a = 6, o = ["day", "month", "year", "hour", "minutes", "seconds"]) : r.oData.bArrMatchFormat[1] ? (a = 7, o = ["day", "month", "year", "hour", "minutes", "seconds", "meridiem"]) : r.oData.bArrMatchFormat[2] ? (a = 6, o = ["month", "day", "year", "hour", "minutes", "seconds"]) : r.oData.bArrMatchFormat[3] ? (a = 7, o = ["month", "day", "year", "hour", "minutes", "seconds", "meridiem"]) : r.oData.bArrMatchFormat[4] ? (a = 6, o = ["year", "month", "day", "hour", "minutes", "seconds"]) : r.oData.bArrMatchFormat[5] ? (a = 7, o = ["year", "month", "day", "hour", "minutes", "seconds", "meridiem"]) : r.oData.bArrMatchFormat[6] ? (a = 6, o = ["day", "month", "year", "hour", "minutes", "seconds"]) : r.oData.bArrMatchFormat[7] ? (a = 7, o = ["day", "month", "year", "hour", "minutes", "seconds", "meridiem"]) : r.oData.bArrMatchFormat[8] ? (a = 5, o = ["day", "month", "year", "hour", "minutes"]) : r.oData.bArrMatchFormat[9] ? (a = 6, o = ["day", "month", "year", "hour", "minutes", "meridiem"]) : r.oData.bArrMatchFormat[10] ? (a = 5, o = ["month", "day", "year", "hour", "minutes"]) : r.oData.bArrMatchFormat[11] ? (a = 6, o = ["month", "day", "year", "hour", "minutes", "meridiem"]) : r.oData.bArrMatchFormat[12] ? (a = 5, o = ["year", "month", "day", "hour", "minutes"]) : r.oData.bArrMatchFormat[13] ? (a = 6, o = ["year", "month", "day", "hour", "minutes", "meridiem"]) : r.oData.bArrMatchFormat[14] ? (a = 5, o = ["day", "month", "year", "hour", "minutes"]) : r.oData.bArrMatchFormat[15] && (a = 6, o = ["day", "month", "year", "hour", "minutes", "meridiem"]));
                    var n, i = "dtpicker-comp" + a,
                        s = !1,
                        m = !1,
                        u = !1;
                    for (n = 0; n < r.settings.buttonsToDisplay.length; n++) t.cf._compare(r.settings.buttonsToDisplay[n], "HeaderCloseButton") ? s = !0 : t.cf._compare(r.settings.buttonsToDisplay[n], "SetButton") ? m = !0 : t.cf._compare(r.settings.buttonsToDisplay[n], "ClearButton") && (u = !0);
                    var d = "";
                    d += "<div class='dtpicker-header'>", d += "<div class='dtpicker-title'>" + e + "</div>", s && (d += "<a class='dtpicker-close'>&times;</a>"), d += "<div class='dtpicker-value'></div>", d += "</div>";
                    var c = "";
                    for (c += "<div class='dtpicker-components'>", n = 0; a > n; n++) {
                        var D = o[n];
                        c += "<div class='dtpicker-compOutline " + i + "'>", c += "<div class='dtpicker-comp " + D + "'>", c += "<a class='dtpicker-compButton increment'>" + r.settings.incrementButtonContent + "</a>", c += "<input type='text' class='dtpicker-compValue' readonly='true'></input>", c += "<a class='dtpicker-compButton decrement'>" + r.settings.decrementButtonContent + "</a>", c += "</div>", c += "</div>"
                    }
                    c += "</div>";
                    var l = "";
                    l = m && u ? " dtpicker-twoButtons" : " dtpicker-singleButton";
                    var p = "";
                    p += "<div class='dtpicker-buttonCont" + l + "'>", m && (p += "<a class='dtpicker-button dtpicker-buttonSet'>" + r.settings.setButtonContent + "</a>"), u && (p += "<a class='dtpicker-button dtpicker-buttonClear'>" + r.settings.clearButtonContent + "</a>"), p += "</div>";
                    var M = d + c + p;
                    t(r.element).find(".dtpicker-subcontent").html(M), r._setCurrentDate(), r._addEventHandlersForPicker()
                },
                _addEventHandlersForPicker: function () {
                    var e = this;
                    t(document).on("keydown.DateTimePicker", function (a) { return t(".dtpicker-compValue").is(":focus") || 9 !== parseInt(a.keyCode ? a.keyCode : a.which) ? void 0 : (e._setButtonAction(!0), t("[tabIndex=" + (e.oData.iTabIndex + 1) + "]").focus(), !1) }), t(document).on("keydown.DateTimePicker", function (a) { t(".dtpicker-compValue").is(":focus") || 9 === parseInt(a.keyCode ? a.keyCode : a.which) || e._hidePicker("") }), t(".dtpicker-cont *").click(function (t) { t.stopPropagation() }), t(".dtpicker-compValue").not(".month .dtpicker-compValue, .meridiem .dtpicker-compValue").keyup(function () { this.value = this.value.replace(/[^0-9\.]/g, "") }), t(".dtpicker-compValue").focus(function () { e.oData.bElemFocused = !0 }), t(".dtpicker-compValue").blur(function () {
                        e._getValuesFromInputBoxes(), e._setCurrentDate(), e.oData.bElemFocused = !1;
                        var a = t(this).parent().parent();
                        setTimeout(function () { a.is(":last-child") && !e.oData.bElemFocused && e._setButtonAction(!1) }, 50)
                    }), t(".dtpicker-compValue").keyup(function () {
                        var e, a = t(this),
                            r = a.val(),
                            o = r.length;
                        a.parent().hasClass("day") || a.parent().hasClass("hour") || a.parent().hasClass("minutes") || a.parent().hasClass("meridiem") ? o > 2 && (e = r.slice(0, 2), a.val(e)) : a.parent().hasClass("month") ? o > 3 && (e = r.slice(0, 3), a.val(e)) : a.parent().hasClass("year") && o > 4 && (e = r.slice(0, 4), a.val(e))
                    }), t(e.element).find(".dtpicker-close").click(function (t) { e.settings.buttonClicked && e.settings.buttonClicked.call(e, "CLOSE", e.oData.oInputElement), e._hidePicker("") }), t(e.element).find(".dtpicker-buttonSet").click(function (t) { e.settings.buttonClicked && e.settings.buttonClicked.call(e, "SET", e.oData.oInputElement), e._setButtonAction(!1) }), t(e.element).find(".dtpicker-buttonClear").click(function (t) { e.settings.buttonClicked && e.settings.buttonClicked.call(e, "CLEAR", e.oData.oInputElement), e._clearButtonAction() }), t(e.element).find(".day .increment, .day .increment *").click(function (t) { e.oData.iCurrentDay++, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".day .decrement, .day .decrement *").click(function (t) { e.oData.iCurrentDay--, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".month .increment, .month .increment *").click(function (t) { e.oData.iCurrentMonth++, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".month .decrement, .month .decrement *").click(function (t) { e.oData.iCurrentMonth--, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".year .increment, .year .increment *").click(function (t) { e.oData.iCurrentYear++, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".year .decrement, .year .decrement *").click(function (t) { e.oData.iCurrentYear--, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".hour .increment, .hour .increment *").click(function (t) { e.oData.iCurrentHour++, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".hour .decrement, .hour .decrement *").click(function (t) { e.oData.iCurrentHour--, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".minutes .increment, .minutes .increment *").click(function (t) { e.oData.iCurrentMinutes += e.settings.minuteInterval, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".minutes .decrement, .minutes .decrement *").click(function (t) { e.oData.iCurrentMinutes -= e.settings.minuteInterval, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".seconds .increment, .seconds .increment *").click(function (t) { e.oData.iCurrentSeconds += e.settings.secondsInterval, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".seconds .decrement, .seconds .decrement *").click(function (t) { e.oData.iCurrentSeconds -= e.settings.secondsInterval, e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() }), t(e.element).find(".meridiem .dtpicker-compButton").click(function (a) { t.cf._compare(e.oData.sCurrentMeridiem, "AM") ? (e.oData.sCurrentMeridiem = "PM", e.oData.iCurrentHour += 12) : t.cf._compare(e.oData.sCurrentMeridiem, "PM") && (e.oData.sCurrentMeridiem = "AM", e.oData.iCurrentHour -= 12), e._setCurrentDate(), e._setOutputOnIncrementOrDecrement() })
                },
                _adjustMinutes: function (t) { var e = this; return e.settings.roundOffMinutes && 1 !== e.settings.minuteInterval && (t = t % e.settings.minuteInterval ? t - t % e.settings.minuteInterval + e.settings.minuteInterval : t), t },
                _adjustSeconds: function (t) { var e = this; return e.settings.roundOffSeconds && 1 !== e.settings.secondsInterval && (t = t % e.settings.secondsInterval ? t - t % e.settings.secondsInterval + e.settings.secondsInterval : t), t },
                _getValueOfElement: function (e) { var a = ""; return a = t.cf._compare(t(e).prop("tagName"), "INPUT") ? t(e).val() : t(e).html() },
                _setValueOfElement: function (e) {
                    var a = this,
                        r = t(a.oData.oInputElement);
                    if ("" !== e && a.settings.formatDateTimeString) {
                        var o, n = {};
                        o = r.data("field"), o = t.cf._isValid(o) ? o : a.settings.mode, (a.oData.bDateMode || a.oData.bDateTimeMode) && (n = t.extend(n, a._formatDate())), (a.oData.bTimeMode || a.oData.bDateTimeMode) && (n = t.extend(n, a._formatTime())), e = a.settings.formatDateTimeString.call(a, n, o, r)
                    }
                    return t.cf._compare(r.prop("tagName"), "INPUT") ? r.val(e) : r.change(), e
                },
                _parseDate: function (e) {
                    var a = this,
                        r = new Date(a.settings.defaultDate),
                        o = r.getDate(),
                        n = r.getMonth(),
                        i = r.getFullYear();
                    if (t.cf._isValid(e)) {
                        var s;
                        s = a.oData.bArrMatchFormat[4] || a.oData.bArrMatchFormat[5] || a.oData.bArrMatchFormat[6] ? e.split(a.settings.monthYearSeparator) : e.split(a.settings.dateSeparator), a.oData.bArrMatchFormat[0] ? (o = parseInt(s[0]), n = parseInt(s[1] - 1), i = parseInt(s[2])) : a.oData.bArrMatchFormat[1] ? (n = parseInt(s[0] - 1), o = parseInt(s[1]), i = parseInt(s[2])) : a.oData.bArrMatchFormat[2] ? (i = parseInt(s[0]), n = parseInt(s[1] - 1), o = parseInt(s[2])) : a.oData.bArrMatchFormat[3] ? (o = parseInt(s[0]), n = a._getShortMonthIndex(s[1]), i = parseInt(s[2])) : a.oData.bArrMatchFormat[4] ? (o = 1, n = parseInt(s[0]) - 1, i = parseInt(s[1])) : a.oData.bArrMatchFormat[5] ? (o = 1, n = a._getShortMonthIndex(s[0]), i = parseInt(s[1])) : a.oData.bArrMatchFormat[6] && (o = 1, n = a._getFullMonthIndex(s[0]), i = parseInt(s[1]))
                    }
                    return r = new Date(i, n, o, 0, 0, 0, 0)
                },
                _parseTime: function (e) {
                    var a, r, o, n = this,
                        i = new Date(n.settings.defaultDate),
                        s = i.getDate(),
                        m = i.getMonth(),
                        u = i.getFullYear(),
                        d = i.getHours(),
                        c = i.getMinutes(),
                        D = i.getSeconds(),
                        l = n.oData.bArrMatchFormat[0] || n.oData.bArrMatchFormat[1];
                    return D = l ? n._adjustSeconds(D) : 0, t.cf._isValid(e) && (n.oData.bIs12Hour && (a = e.split(n.settings.timeMeridiemSeparator), e = a[0], r = a[1], t.cf._compare(r, "AM") || t.cf._compare(r, "PM") || (r = "")), o = e.split(n.settings.timeSeparator), d = parseInt(o[0]), c = parseInt(o[1]), l && (D = parseInt(o[2]), D = n._adjustSeconds(D)), 12 === d && t.cf._compare(r, "AM") ? d = 0 : 12 > d && t.cf._compare(r, "PM") && (d += 12)), c = n._adjustMinutes(c), i = new Date(u, m, s, d, c, D, 0)
                },
                _parseDateTime: function (e) {
                    var a, r, o, n, i, s = this,
                        m = new Date(s.settings.defaultDate),
                        u = m.getDate(),
                        d = m.getMonth(),
                        c = m.getFullYear(),
                        D = m.getHours(),
                        l = m.getMinutes(),
                        p = m.getSeconds(),
                        M = "",
                        h = s.oData.bArrMatchFormat[0] || s.oData.bArrMatchFormat[1] || s.oData.bArrMatchFormat[2] || s.oData.bArrMatchFormat[3] || s.oData.bArrMatchFormat[4] || s.oData.bArrMatchFormat[5] || s.oData.bArrMatchFormat[6] || s.oData.bArrMatchFormat[7];
                    return p = h ? s._adjustSeconds(p) : 0, t.cf._isValid(e) && (a = e.split(s.settings.dateTimeSeparator), r = a[0].split(s.settings.dateSeparator), s.oData.bArrMatchFormat[0] || s.oData.bArrMatchFormat[1] ? (u = parseInt(r[0]), d = parseInt(r[1] - 1), c = parseInt(r[2])) : s.oData.bArrMatchFormat[2] || s.oData.bArrMatchFormat[3] ? (d = parseInt(r[0] - 1), u = parseInt(r[1]), c = parseInt(r[2])) : s.oData.bArrMatchFormat[4] || s.oData.bArrMatchFormat[5] ? (c = parseInt(r[0]), d = parseInt(r[1] - 1), u = parseInt(r[2])) : (s.oData.bArrMatchFormat[6] || s.oData.bArrMatchFormat[7]) && (u = parseInt(r[0]), d = s._getShortMonthIndex(r[1]), c = parseInt(r[2])), o = a[1], s.oData.bIs12Hour && (t.cf._compare(s.settings.dateTimeSeparator, s.settings.timeMeridiemSeparator) && 3 === a.length ? M = a[2] : (n = o.split(s.settings.timeMeridiemSeparator), o = n[0], M = n[1]), t.cf._compare(M, "AM") || t.cf._compare(M, "PM") || (M = "")), i = o.split(s.settings.timeSeparator), D = parseInt(i[0]), l = parseInt(i[1]), h && (p = parseInt(i[2])), 12 === D && t.cf._compare(M, "AM") ? D = 0 : 12 > D && t.cf._compare(M, "PM") && (D += 12)), l = s._adjustMinutes(l), m = new Date(c, d, u, D, l, p, 0)
                },
                _getShortMonthIndex: function (e) {
                    for (var a = this, r = 0; r < a.settings.shortMonthNames.length; r++)
                        if (t.cf._compare(e, a.settings.shortMonthNames[r])) return r;
                },
                _getFullMonthIndex: function (e) {
                    for (var a = this, r = 0; r < a.settings.fullMonthNames.length; r++)
                        if (t.cf._compare(e, a.settings.fullMonthNames[r])) return r
                },
                getIs12Hour: function (t, e) {
                    var a = this,
                        r = !1,
                        o = Function.length;
                    return a._setMatchFormat(o, t, e), a.oData.bTimeMode ? r = a.oData.bArrMatchFormat[0] || a.oData.bArrMatchFormat[2] : a.oData.bDateTimeMode && (r = a.oData.bArrMatchFormat[1] || a.oData.bArrMatchFormat[3] || a.oData.bArrMatchFormat[5] || a.oData.bArrMatchFormat[7] || a.oData.bArrMatchFormat[9] || a.oData.bArrMatchFormat[11] || a.oData.bArrMatchFormat[13] || a.oData.bArrMatchFormat[15]), a._setMatchFormat(o), r
                },
                _setVariablesForDate: function () {
                    var t = this;
                    t.oData.iCurrentDay = t.oData.dCurrentDate.getDate(), t.oData.iCurrentMonth = t.oData.dCurrentDate.getMonth(), t.oData.iCurrentYear = t.oData.dCurrentDate.getFullYear(), (t.oData.bTimeMode || t.oData.bDateTimeMode) && (t.oData.iCurrentHour = t.oData.dCurrentDate.getHours(), t.oData.iCurrentMinutes = t.oData.dCurrentDate.getMinutes(), t.oData.iCurrentSeconds = t.oData.dCurrentDate.getSeconds(), t.oData.bIs12Hour && (t.oData.sCurrentMeridiem = t._determineMeridiemFromHourAndMinutes(t.oData.iCurrentHour, t.oData.iCurrentMinutes)))
                },
                _getValuesFromInputBoxes: function () {
                    var e = this;
                    if (e.oData.bDateMode || e.oData.bDateTimeMode) {
                        var a, r;
                        a = t(e.element).find(".month .dtpicker-compValue").val(), a.length > 1 && (a = a.charAt(0).toUpperCase() + a.slice(1)), r = e.settings.shortMonthNames.indexOf(a), -1 !== r ? e.oData.iCurrentMonth = parseInt(r) : a.match("^[+|-]?[0-9]+$") && (e.oData.iCurrentMonth = parseInt(a - 1)), e.oData.iCurrentDay = parseInt(t(e.element).find(".day .dtpicker-compValue").val()) || e.oData.iCurrentDay, e.oData.iCurrentYear = parseInt(t(e.element).find(".year .dtpicker-compValue").val()) || e.oData.iCurrentYear
                    }
                    if (e.oData.bTimeMode || e.oData.bDateTimeMode) {
                        var o, n, i, s;
                        o = parseInt(t(e.element).find(".hour .dtpicker-compValue").val()), n = e._adjustMinutes(parseInt(t(e.element).find(".minutes .dtpicker-compValue").val())), i = e._adjustMinutes(parseInt(t(e.element).find(".seconds .dtpicker-compValue").val())), e.oData.iCurrentHour = isNaN(o) ? e.oData.iCurrentHour : o, e.oData.iCurrentMinutes = isNaN(n) ? e.oData.iCurrentMinutes : n, e.oData.iCurrentSeconds = isNaN(i) ? e.oData.iCurrentSeconds : i, e.oData.iCurrentSeconds > 59 && (e.oData.iCurrentMinutes += e.oData.iCurrentSeconds / 60, e.oData.iCurrentSeconds = e.oData.iCurrentSeconds % 60), e.oData.iCurrentMinutes > 59 && (e.oData.iCurrentHour += e.oData.iCurrentMinutes / 60, e.oData.iCurrentMinutes = e.oData.iCurrentMinutes % 60), e.oData.bIs12Hour ? e.oData.iCurrentHour > 12 && (e.oData.iCurrentHour = e.oData.iCurrentHour % 12) : e.oData.iCurrentHour > 23 && (e.oData.iCurrentHour = e.oData.iCurrentHour % 23), e.oData.bIs12Hour && (s = t(e.element).find(".meridiem .dtpicker-compValue").val(), (t.cf._compare(s, "AM") || t.cf._compare(s, "PM")) && (e.oData.sCurrentMeridiem = s), t.cf._compare(e.oData.sCurrentMeridiem, "PM") && 12 !== e.oData.iCurrentHour && e.oData.iCurrentHour < 13 && (e.oData.iCurrentHour += 12), t.cf._compare(e.oData.sCurrentMeridiem, "AM") && 12 === e.oData.iCurrentHour && (e.oData.iCurrentHour = 0))
                    }
                },
                _setCurrentDate: function () {
                    var e = this;
                    (e.oData.bTimeMode || e.oData.bDateTimeMode) && (e.oData.iCurrentSeconds > 59 ? (e.oData.iCurrentMinutes += e.oData.iCurrentSeconds / 60, e.oData.iCurrentSeconds = e.oData.iCurrentSeconds % 60) : e.oData.iCurrentSeconds < 0 && (e.oData.iCurrentMinutes -= e.settings.minuteInterval, e.oData.iCurrentSeconds += 60), e.oData.iCurrentMinutes = e._adjustMinutes(e.oData.iCurrentMinutes), e.oData.iCurrentSeconds = e._adjustSeconds(e.oData.iCurrentSeconds));
                    var a, r, o, n, i, s, m, u = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0),
                        d = !1,
                        c = !1;
                    if (null !== e.oData.dMaxValue && (d = u.getTime() > e.oData.dMaxValue.getTime()), null !== e.oData.dMinValue && (c = u.getTime() < e.oData.dMinValue.getTime()), d || c) {
                        var D = !1,
                            l = !1;
                        null !== e.oData.dMaxValue && (D = e.oData.dCurrentDate.getTime() > e.oData.dMaxValue.getTime()), null !== e.oData.dMinValue && (l = e.oData.dCurrentDate.getTime() < e.oData.dMinValue.getTime()), D || l ? (D && (u = new Date(e.oData.dMaxValue), console.log("Info : Date/Time/DateTime you entered is later than Maximum value, so DateTimePicker is showing Maximum value in Input Field.")), l && (u = new Date(e.oData.dMinValue), console.log("Info : Date/Time/DateTime you entered is earlier than Minimum value, so DateTimePicker is showing Minimum value in Input Field.")), console.log("Please enter proper Date/Time/DateTime values.")) : u = new Date(e.oData.dCurrentDate)
                    }
                    if (e.oData.dCurrentDate = new Date(u), e._setVariablesForDate(), r = {}, i = "", s = "", m = "", (e.oData.bDateMode || e.oData.bDateTimeMode) && (e.oData.bDateMode && (e.oData.bArrMatchFormat[4] || e.oData.bArrMatchFormat[5] || e.oData.bArrMatchFormat[6]) && (e.oData.iCurrentDay = 1), o = e._formatDate(), t(e.element).find(".day .dtpicker-compValue").val(o.dd), e.oData.bDateMode ? e.oData.bArrMatchFormat[4] ? t(e.element).find(".month .dtpicker-compValue").val(o.MM) : e.oData.bArrMatchFormat[6] ? t(e.element).find(".month .dtpicker-compValue").val(o.month) : t(e.element).find(".month .dtpicker-compValue").val(o.monthShort) : t(e.element).find(".month .dtpicker-compValue").val(o.monthShort), t(e.element).find(".year .dtpicker-compValue").val(o.yyyy), e.settings.formatHumanDate ? r = t.extend(r, o) : e.oData.bDateMode && (e.oData.bArrMatchFormat[4] || e.oData.bArrMatchFormat[5] || e.oData.bArrMatchFormat[6]) ? e.oData.bArrMatchFormat[4] ? i = o.MM + e.settings.monthYearSeparator + o.yyyy : e.oData.bArrMatchFormat[5] ? i = o.monthShort + e.settings.monthYearSeparator + o.yyyy : e.oData.bArrMatchFormat[6] && (i = o.month + e.settings.monthYearSeparator + o.yyyy) : i = o.dayShort + ", " + o.month + " " + o.dd + ", " + o.yyyy), e.oData.bTimeMode || e.oData.bDateTimeMode)
                        if (n = e._formatTime(), e.oData.bIs12Hour && t(e.element).find(".meridiem .dtpicker-compValue").val(e.oData.sCurrentMeridiem), t(e.element).find(".hour .dtpicker-compValue").val(n.hour), t(e.element).find(".minutes .dtpicker-compValue").val(n.mm), t(e.element).find(".seconds .dtpicker-compValue").val(n.ss), e.settings.formatHumanDate) r = t.extend(r, n);
                        else {
                            var p = e.oData.bTimeMode && (e.oData.bArrMatchFormat[0] || e.oData.bArrMatchFormat[1]),
                                M = e.oData.bDateTimeMode && (e.oData.bArrMatchFormat[0] || e.oData.bArrMatchFormat[1] || e.oData.bArrMatchFormat[2] || e.oData.bArrMatchFormat[3] || e.oData.bArrMatchFormat[4] || e.oData.bArrMatchFormat[5] || e.oData.bArrMatchFormat[6] || e.oData.bArrMatchFormat[7]);
                            s = p || M ? n.hour + e.settings.timeSeparator + n.mm + e.settings.timeSeparator + n.ss : n.hour + e.settings.timeSeparator + n.mm, e.oData.bIs12Hour && (s += e.settings.timeMeridiemSeparator + e.oData.sCurrentMeridiem)
                        }
                    e.settings.formatHumanDate ? (e.oData.bDateTimeMode ? a = e.oData.sDateFormat : e.oData.bDateMode ? a = e.oData.sTimeFormat : e.oData.bTimeMode && (a = e.oData.sDateTimeFormat), m = e.settings.formatHumanDate.call(e, r, e.settings.mode, a)) : e.oData.bDateTimeMode ? m = i + e.settings.dateTimeSeparator + s : e.oData.bDateMode ? m = i : e.oData.bTimeMode && (m = s), t(e.element).find(".dtpicker-value").html(m), e._setButtons()
                },
                _formatDate: function () { var t, e, a, r, o, n, i, s, m, u = this; return t = u.oData.iCurrentDay, t = 10 > t ? "0" + t : t, a = u.oData.iCurrentMonth, r = u.oData.iCurrentMonth + 1, r = 10 > r ? "0" + r : r, o = u.settings.shortMonthNames[a], n = u.settings.fullMonthNames[a], e = u.oData.iCurrentYear, i = u.oData.dCurrentDate.getDay(), s = u.settings.shortDayNames[i], m = u.settings.fullDayNames[i], { dd: t, MM: r, monthShort: o, month: n, yyyy: e, dayShort: s, day: m } },
                _formatTime: function () { var t, e, a, r, o, n, i, s = this; return t = s.oData.iCurrentHour, e = 10 > t ? "0" + t : t, o = e, s.oData.bIs12Hour && (a = s.oData.iCurrentHour, a > 12 && (a -= 12), 0 === o && (a = 12), r = 10 > a ? "0" + a : a, o = r), n = s.oData.iCurrentMinutes, n = 10 > n ? "0" + n : n, i = s.oData.iCurrentSeconds, i = 10 > i ? "0" + i : i, { H: t, HH: e, h: a, hh: r, hour: o, mm: n, ss: i, ME: s.oData.sCurrentMeridiem } },
                _setButtons: function () {
                    var e = this;
                    t(e.element).find(".dtpicker-compButton").removeClass("dtpicker-compButtonDisable").addClass("dtpicker-compButtonEnable");
                    var a;
                    if (null !== e.oData.dMaxValue && (e.oData.bTimeMode ? ((e.oData.iCurrentHour + 1 > e.oData.dMaxValue.getHours() || e.oData.iCurrentHour + 1 === e.oData.dMaxValue.getHours() && e.oData.iCurrentMinutes > e.oData.dMaxValue.getMinutes()) && t(e.element).find(".hour .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), e.oData.iCurrentHour >= e.oData.dMaxValue.getHours() && e.oData.iCurrentMinutes + 1 > e.oData.dMaxValue.getMinutes() && t(e.element).find(".minutes .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")) : (a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay + 1, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), a.getTime() > e.oData.dMaxValue.getTime() && t(e.element).find(".day .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth + 1, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), a.getTime() > e.oData.dMaxValue.getTime() && t(e.element).find(".month .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear + 1, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), a.getTime() > e.oData.dMaxValue.getTime() && t(e.element).find(".year .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour + 1, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), a.getTime() > e.oData.dMaxValue.getTime() && t(e.element).find(".hour .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes + 1, e.oData.iCurrentSeconds, 0), a.getTime() > e.oData.dMaxValue.getTime() && t(e.element).find(".minutes .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds + 1, 0), a.getTime() > e.oData.dMaxValue.getTime() && t(e.element).find(".seconds .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"))), null !== e.oData.dMinValue && (e.oData.bTimeMode ? ((e.oData.iCurrentHour - 1 < e.oData.dMinValue.getHours() || e.oData.iCurrentHour - 1 === e.oData.dMinValue.getHours() && e.oData.iCurrentMinutes < e.oData.dMinValue.getMinutes()) && t(e.element).find(".hour .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), e.oData.iCurrentHour <= e.oData.dMinValue.getHours() && e.oData.iCurrentMinutes - 1 < e.oData.dMinValue.getMinutes() && t(e.element).find(".minutes .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")) : (a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay - 1, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), a.getTime() < e.oData.dMinValue.getTime() && t(e.element).find(".day .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth - 1, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), a.getTime() < e.oData.dMinValue.getTime() && t(e.element).find(".month .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear - 1, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), a.getTime() < e.oData.dMinValue.getTime() && t(e.element).find(".year .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour - 1, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), a.getTime() < e.oData.dMinValue.getTime() && t(e.element).find(".hour .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes - 1, e.oData.iCurrentSeconds, 0), a.getTime() < e.oData.dMinValue.getTime() && t(e.element).find(".minutes .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay, e.oData.iCurrentHour, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds - 1, 0), a.getTime() < e.oData.dMinValue.getTime() && t(e.element).find(".seconds .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"))), e.oData.bIs12Hour) {
                        var r, o;
                        (null !== e.oData.dMaxValue || null !== e.oData.dMinValue) && (r = e.oData.iCurrentHour, t.cf._compare(e.oData.sCurrentMeridiem, "AM") ? r += 12 : t.cf._compare(e.oData.sCurrentMeridiem, "PM") && (r -= 12), a = new Date(e.oData.iCurrentYear, e.oData.iCurrentMonth, e.oData.iCurrentDay, r, e.oData.iCurrentMinutes, e.oData.iCurrentSeconds, 0), null !== e.oData.dMaxValue && (e.oData.bTimeMode ? (o = e.oData.iCurrentMinutes, (r > e.oData.dMaxValue.getHours() || r === e.oData.dMaxValue.getHours() && o > e.oData.dMaxValue.getMinutes()) && t(e.element).find(".meridiem .dtpicker-compButton").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")) : a.getTime() > e.oData.dMaxValue.getTime() && t(e.element).find(".meridiem .dtpicker-compButton").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")), null !== e.oData.dMinValue && (e.oData.bTimeMode ? (o = e.oData.iCurrentMinutes, (r < e.oData.dMinValue.getHours() || r === e.oData.dMinValue.getHours() && o < e.oData.dMinValue.getMinutes()) && t(e.element).find(".meridiem .dtpicker-compButton").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")) : a.getTime() < e.oData.dMinValue.getTime() && t(e.element).find(".meridiem .dtpicker-compButton").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")))
                    }
                },
                setIsPopup: function (e) {
                    var a = this;
                    if (a.settings.isPopup = e, "none" !== t(a.element).css("display") && a._hidePicker(0), a.settings.isPopup) t(a.element).addClass("dtpicker-mobile"), t(a.element).css({ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" });
                    else {
                        if (t(a.element).removeClass("dtpicker-mobile"), null !== a.oData.oInputElement) {
                            var r = t(a.oData.oInputElement).offset().top + t(a.oData.oInputElement).outerHeight(),
                                o = t(a.oData.oInputElement).offset().left,
                                n = t(a.oData.oInputElement).outerWidth();
                            t(a.element).css({ position: "absolute", top: r, left: o, width: n, height: "auto" })
                        }
                        console.log("222"), clearPopupHistory()
                    }
                },
                _compareDates: function (t, e) { t = new Date(t.getDate(), t.getMonth(), t.getFullYear(), 0, 0, 0, 0), t = new Date(t.getDate(), t.getMonth(), t.getFullYear(), 0, 0, 0, 0); var a = (t.getTime() - e.getTime()) / 864e5; return 0 === a ? a : a / Math.abs(a) },
                _compareTime: function (t, e) { var a = 0; return t.getHours() === e.getHours() && t.getMinutes() === e.getMinutes() ? a = 1 : t.getHours() < e.getHours() ? a = 2 : t.getHours() > e.getHours() ? a = 3 : t.getHours() === e.getHours() && (t.getMinutes() < e.getMinutes() ? a = 2 : t.getMinutes() > e.getMinutes() && (a = 3)), a },
                _compareDateTime: function (t, e) { var a = (t.getTime() - e.getTime()) / 6e4; return 0 === a ? a : a / Math.abs(a) },
                _determineMeridiemFromHourAndMinutes: function (t, e) { return t > 12 ? "PM" : 12 === t && e >= 0 ? "PM" : "AM" },
                setLanguage: function (e) { var a = this; return a.settings = t.extend({}, a.settings, t.DateTimePicker.i18n[e]), a._setDateFormatArray(), a._setTimeFormatArray(), a._setDateTimeFormatArray(), a }
            }
        });
}
var PRE_MESSAGE_MAP = [];
var DEALER_SMS = [];

function emptynamemobileSubscription() {
    var cookies = formcookies();
    var _ccname = _ccmobile = _ccsubscriber_id = _ccupdate_subscriber = "";
    if (cookies['cookie_buyform_name'] != '' && cookies['cookie_buyform_name'] != undefined && cookies['cookie_buyform_name'] != 'undefined') {
        _ccname = cookies['cookie_buyform_name'];
    }
    if (cookies['cookie_buyform_mobile'] != '' && cookies['cookie_buyform_mobile'] != undefined && cookies['cookie_buyform_mobile'] != 'undefined') {
        _ccmobile = cookies['cookie_buyform_mobile'];
    }
    if (cookies['subscriber_id'] != '' && cookies['subscriber_id'] != undefined && cookies['subscriber_id'] != 'undefined') {
        _ccsubscriber_id = cookies['subscriber_id'];
    }
    if (cookies['update_subscriber'] != '' && cookies['update_subscriber'] != undefined && cookies['update_subscriber'] != 'undefined') {
        _ccupdate_subscriber = cookies['update_subscriber'];
    }
    if (_ccsubscriber_id != '' && _ccupdate_subscriber == '') {
        var post_data = 'ajax=true&id=' + _ccsubscriber_id + '&action=update_subscriber&version=1&name=' + _ccname + '&mobile=' + _ccmobile;
        try {
            $.ajax({
                url: '/actions/',
                data: post_data,
                method: 'post',
                success: function (response) {
                    console.log(response);
                }
            });
        } catch (e) {
            console.log("Notification Error : " + e);
        }
    }
}


function gredirect(gct, redurl) {
    _gtm_push('Used Cars', gct, redurl, 'eventUsed Cars');
    top.location = redurl;
}

function FindVisibleSize() {
    if (typeof (window.innerWidth) == 'number') {
        pageVisibleWidth = window.innerWidth;
        try {
            pageVisibleHeight = window.innerHeight;
        } catch (e) { }
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        pageVisibleWidth = document.documentElement.clientWidth;
        try {
            pageVisibleHeight = document.documentElement.clientHeight;
        } catch (e) { }
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        pageVisibleWidth = document.body.clientWidth;
        try {
            pageVisibleHeight = document.body.clientHeight;
        } catch (e) { }
    }
}
/* true price click start here */
function comall() {
    var imagecs = new Image(1, 1);
    imagecs.src = 'https://sb.scorecardresearch.com/p?c1=2&c2=9555354&cv=2.0&cj=1';
}

function _ctpclick(vi, mk, mod) {
    try {
        _gtm_push('used car search', 'true price', vi, 'event used car search');
        _gtm_push('Mobile True Price CTA', mk + " & " + mod, document.location.pathname, 'event Mobile True Price CTA');
        _gtm_vpv_push_datalayer('/vpv/cta/true price/' + mk + " & " + mod);
        var csource = document.location.href;
        csource = csource.replace(document.location.hash, "");
        csource = 'buyusedcars';
        comall();
    } catch (e) {

    }
    var vurl = "/buy-used-cars?action=xoxo_used_listing_cctp_click&clicksource=" + csource + "&id=" + vi + "&callback=_ctpclick_done&event_name=NLP";
    try {
        document.getElementById("spifr").src = vurl;
    } catch (e) {
        document.getElementById("spifr").src = vurl;
    }
}


function _ctprightpirceclick(vi, mk, mod) {
    try {
        _gtm_push('used car search', 'true price', vi, 'event used car search');
        _gtm_push('Mobile True Price CTA', mk + " & " + mod, document.location.pathname, 'event Mobile True Price CTA');
        _gtm_vpv_push_datalayer('/vpv/cta/true price/' + mk + " & " + mod);
        //  var csource = document.location.href;
        //  csource = csource.replace(document.location.hash, "");
        //  csource = 'buyusedcars';
        comall();
    } catch (e) {

    }
    var vurl = "/buy-used-cars?action=xoxo_used_listing_cctp_click&clicksource=" + csource + "&id=" + vi + "&callback=_ctpclick_done&event_name=NLP";
    try {
        document.getElementById("spifr").src = vurl;
    } catch (e) {
        document.getElementById("spifr").src = vurl;
    }
}

function _ctpclick_done(vurl) {
    //top.location = vurl;
}
/* true price click end here */
/* latitude longitude values finding script start here */
function defacall() {
    try {
        if (navigator.geolocation) {
            var options = { timeout: 10000 }
            try {
                if (navigator.geolocation.getCurrentPosition(geo_foundpos_buy, geo_errorHandler_buy, options)) { } else {
                    error_message_alert("getCurrentPosition  not supported");
                }
            } catch (e) {
                error_message_alert(e);
            }
        } else {
            error_message_alert("navigator geolocation not supported");
        }
    } catch (e) {
        error_message_alert(e);
    }
}

function geo_foundpos_buy(pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    em = document.createElement("div");
    em.innerHTML = "Latitude: " + lat + ", Longitude: " + lng;
    document.body.appendChild(em);
    if (lat && lng) {
        document.getElementById("latid").value = lat;
        document.getElementById("lngid").value = lng;
        try {
            document.getElementById("kms_sort").value = "yes";
        } catch (e) { }
        /*var citylist =["New Delhi","Mumbai","Bangalore","Pune","Chennai","Kolkata","Hyderabad","Ahmedabad","Chandigarh","Gurgaon","Noida","Navi Mumbai","Thane","Cochin","Faridabad","Ghaziabad","Agra","Ahmednagar","Ajmer","Akola","Alappuzha","Aligarh","Allahabad","Alwar","Amalapuram","Ambala","Amravati","Amritsar","Anand","Anantapur","Aurangabad","Bareilly","Bathinda","Beed","Belgaum","Bellary","Bhadohi","Bharuch","Bhavnagar","Bhilai","Bhilwara","Bhimavaram","Bhopal","Bhubaneswar","Bhuj","Bikaner","Bilaspur","Bulandshahar","Chidambaram","Chittoor","Coimbatore","Cuddalore","Davangere","Dehradun","Dhanbad","Dharwad","Dibrugarh","Dindigul","Durg","Durgapur","Eluru","Erode","Etah","Faizabad","Firozabad","Gandhidham","Gandhinagar","Goa","Gorakhpur","Gulbarga","Guntur","Gurdaspur","Guwahati","Gwalior","Haldwani","Hapur","Himmatnagar","Hissar","Hoshiarpur","Hospet","Hosur","Howrah","Hubli","Idukki","Indore","Jabalpur","Jagdalpur","Jaipur","Jalandhar","Jalgaon","Jammu","Jamnagar","Jamshedpur","Jodhpur","Kadapa","Kakinada","Kannur","Kanpur","Karimnagar","Karnal","Karur","Kasaragod","Khammam","Khanna","Kolar","Kolhapur","Kollam","Kota","Kottayam","Kozhikode","Kurnool","Kurukshetra","Latur","Lucknow","Ludhiana","Madurai","Malappuram","Mandi","Mangalore","Mathura","Meerut","Mehsana","Mirzapur","Moga","Mohali","Moradabad","Muzaffarnagar","Mysore","Nadia","Nagercoil","Nagpur","Namakkal","Nanded","Nashik","Nellore","Neyveli","Nizamabad","Ongole","Palakkad","Palwal","Panchkula","Panipat","Pathanamthitta","Pathankot","Patiala","Patna","Pimpri-Chinchwad","Pollachi","Pondicherry","Port Blair","Raipur","Rajahmundry","Rajkot","Ranchi","Ratlam","Ratnagiri","Rohtak","Roorkee","Rudrapur","Sagar","Saharanpur","Salem","Sangli","Sangrur","Satara","Shillong","Shimla","Shimoga","Sikar","Siliguri","Sivakasi","Solan","Solapur","Sonipat","Sri Ganganagar","Srinagar","Surat","Surendranagar","Thanjavur","Thiruvalla","Thoothukudi","Thrissur","Tiruchirapalli","Tirunelveli","Tirupati","Tirupur","Tiruvalla","Tiruvallur","Trivandrum","Tumkur","Tuticorin","Udaipur","Udumalpet","Udupi","Ujjain","Vadodara","Valsad","Vapi","Varanasi","Vellore","Vijayawada","Viluppuram","Visakhapatnam","Visnagar","Vizianagaram","Warangal","Wayanad","Yamunanagar","Zirakpur"] ;
         for(b in citylist){  var bb = citylist[b].replace(/ /g, '-');	 	
         try{ document.getElementById("fltr_"+bb).checked = false; }catch(e){ }  	   
         }*/
        document.forms['find2'].submit();
    } else {
        error_message_alert("latitude longitude values are not avaliable in success function");
    }
}

function error_message_alert(err) {
    var err1 = err;
    setTimeout(function () {
        setErrorAlert(err1)
    }, 10000);
}

function geo_errorHandler_buy(err) {
    var err1 = err;
    setTimeout(function () {
        setErrorAlert(err1)
    }, 10000);
}

function setErrorAlert(err) {
    if (Number(document.getElementById("latlongerror").value) == 1) {
        if (document.getElementById("latid").value && document.getElementById("lngid").value) { } else {
            document.getElementById("latlongerror").value = Number(document.getElementById("latlongerror").value) + 1;
            vl = "/buy-used-cars?action=logFailedAttemps&callback=showAlert&from=buyusedcars&err=" + err;
            try {
                document.getElementById("spifr").src = vl;
            } catch (e) {
                document.getElementById("spifr").src = vl;
            }
            document.getElementById("loaderbg").style.display = "none";
            document.getElementById("loaderblk").style.display = "none";
        }
    }
}

function showAlert() {
    alert("Sorry, we are unable to detect your location at this point. Your phone may not support fine location detection. You may try again later.");
}

function findcarsClick() {
    try {
        var csource = "/buy-used-cars/mumbai/c";
        vl = "/buy-used-cars/?action=xoxo_findcarsnearme_click&clicksource=" + csource;
        //document.getElementById("findcars").src = vl;
        $('#dummy').load(vl);
        _gtm_vpv_push_datalayer("/vpv" + location.pathname + "/filters click tracking of findcarsclick");
        clear_area();
    } catch (e) {
        alert(e);
    }
    _gtm_push('Used Car Listings Page', "Cars Near Me", "", 'eventUsed Car Listings Page');
}

function filter_click_track(vv, x, trackingData) {
    try {
        // var csource = "/buy-used-cars/mumbai/c";
        // vl = "/buy-used-cars/?action=xoxo_filterclicktrack&val=" + vv + "&clicksource=" + csource;
        // // document.getElementById("findcars").src = vl;
        // //@manikanta
        // $('#dummy').load(vl);
        // if (vv != "clear_filter" && vv != "cancel_filter")
        //     _gtm_vpv_push_datalayer("/vpv" + location.pathname + "/filters click tracking of " + vv + " tab");
    } catch (e) { }


    if (vv == "filter") {
        _gtm_push('Used Car Listings Page', "Filter", vv, 'eventUsed Car Listings Page');
        _gtm_push("UsedCarSearch", "FilterClickedOld", vv, "eventUsed Car Listings Page");
    } else if(vv == "sortby") {
        _gtm_push("UsedCarSearch", "SortClickedOld", vv, "eventUsed Car Listings Page");
    }
     else if (vv == "clear_filter") {
        _gtm_push('UCP|Filter', "Clear filter", document.location.href, 'eventUsed Car Listings Page');
    } else if (vv == "cancel_filter") {
        _gtm_push('UCP|Filter', "Cancel filter", document.location.href, 'eventUsed Car Listings Page');
    }
    if(!!trackingData)
    {
        _gtm_push('UCP|Filter', trackingData.action, document.location.href, 'eventUsed Car Listings Page');
    }
}

function findCarsNearMe() {

    try {
        document.getElementById("latlongerror").value = 1;
        document.getElementById("loaderblk").style.display = "block";
        document.getElementById("loaderbg").style.display = "block";
        /*document.getElementById("loadingmain").style.display = "block";*/
    } catch (e) { }
    defacall();
}

function showLoader() {

    try {
        /* document.getElementById("latlongerror").value = 1;*/
        document.getElementById("loaderbg").style.display = "block";
        document.getElementById("loaderblk").style.display = "block";
        setTimeout("hideLoader()", 800);
        /*try { document.getElementById("loadingmain").style.display = "block"; }catch(e){  }*/

    } catch (e) { }


}

function hideLoader() {

    try {
        document.getElementById("loaderblk").style.display = "none";
        document.getElementById("loaderbg").style.display = "none";
        /*try { document.getElementById("loadingmain").style.display = "block"; }catch(e){  }*/

    } catch (e) { }


}

function hideLoaderAtBottom() {

    try {
        //alert("LoaderEnd");
        document.getElementById("loaderblkBottom").style.display = "none";
        //document.getElementById("loaderbg").style.display = "none";
        /*try { document.getElementById("loadingmain").style.display = "block"; }catch(e){  }*/

    } catch (e) { }


}

function showLoaderAtBottom() {

    try {
        //alert("LoaderStart");
        document.getElementById("latlongerror").value = 1;
        //document.getElementById("loaderbg").style.display = "block";
        document.getElementById("loaderblkBottom").style.display = "block";
        //setTimeout("hideLoaderAtBottom()", 1000);
        /*try { document.getElementById("loadingmain").style.display = "block"; }catch(e){  }*/

    } catch (e) { }


}

/* latitude longitude values finding script end here */
/* Lazy loading script start here */
function FindVisibleSize() {
    if (typeof (window.innerWidth) == 'number') {
        pageVisibleWidth = window.innerWidth;
        try {
            pageVisibleHeight = window.innerHeight;
        } catch (e) { }
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        pageVisibleWidth = document.documentElement.clientWidth;
        try {
            pageVisibleHeight = document.documentElement.clientHeight;
        } catch (e) { }
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        pageVisibleWidth = document.body.clientWidth;
        try {
            pageVisibleHeight = document.body.clientHeight;
        } catch (e) { }
    }
}

function FindSize() {
    if (window.innerHeight && window.scrollMaxY) {
        isitIE = 'n';
        pageWidth = window.innerWidth + window.scrollMaxX;
        pageHeight = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
        isitIE = "n";
        pageWidth = document.body.scrollWidth;
        pageHeight = document.body.scrollHeight;
    } else {
        isitIE = 'y';
        pageWidth = document.body.offsetWidth + document.body.offsetLeft;
        pageHeight = document.body.offsetHeight + document.body.offsetTop;
    }
    return isitIE;
}

function FindScrollXY() {
    if (typeof (window.pageYOffset) == 'number') {
        pageScrollHeight = window.pageYOffset;
        pageScrollWidth = window.pageXOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        pageScrollHeight = document.body.scrollTop;
        pageScrollWidth = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollLeft != null || document.documentElement.scrollTop != null)) {
        pageScrollHeight = document.documentElement.scrollTop;
        pageScrollWidth = document.documentElement.scrollLeft;
    }
}

function find_pos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }

    return [curleft, curtop];
}
__image_lazy_load = true;
document.addEventListener('readystatechange', function (event) {
    switch (document.readyState) {
        case "interactive":
        case "complete":
            if (typeof jQuery != "undefined") {
                $(window).on("popstate", function (event, data) {
                    if (__popup == 2) {
                        _active_url = _active_url.substring(0, _active_url.indexOf('&'));
                        window.history.replaceState("popup", "popup", _active_url);
                        closeApproprite(_popup2_slug);
                        __popup = 1;
                        _popup2_slug = "";
                    } else if (__popup == 1) {
                        _active_url = _active_url.substring(0, _active_url.indexOf('#'));
                        window.history.replaceState("popup", "popup", _active_url);
                        closeApproprite(_popup1_slug);
                        __popup = 0;
                        _popup1_slug = "";
                    }
                });
            }
            init_date_time_picker();
            getdatepickerval();
            lazy_load_listing_images();
            emptynamemobileSubscription();
            $(window).on("scroll", function () {
                scrollTop = $(window).scrollTop();
                if ($("img[data-lazyload-src]:first").length > 0) {
                    __lazy_load = $("img[data-lazyload-src]:first").offset().top - 400;
                    if (scrollTop > __lazy_load) {
                        lazy_load_listing_images();
                    }
                }
            });
            break;

        default:
            break;
    }
});

function lazy_load_listing_images() {
    if (!__image_lazy_load)
        return true;
    var all_lazy_count = 0;
    $("img[data-lazyload-src]").each(function () {
        if (all_lazy_count > 2)
            return true;
        img_ele = $(this);
        $(img_ele).attr("src", $(img_ele).attr("data-lazyload-src"));
        $(img_ele).removeAttr("data-lazyload-src");
        $(img_ele).attr("alt", getListingImgAltTitleText(img_ele));
        $(img_ele).attr("title", getListingImgAltTitleText(img_ele));
        all_lazy_count++;
    });
}
function getListingImgAltTitleText(imgElement) {
    var makeName = $(imgElement).attr("data-makeName");
    var rootName = $(imgElement).attr("data-rootName");
    var versionName = $(imgElement).attr("data-versionName");
    var cityName = $(imgElement).attr("data-cityName");
    return "Used " + makeName + " " + rootName + " " + versionName + " in " + cityName;
}
try {
    setTimeout(function () {
        reqGetcookie();
    }, 100);
} catch (e) { }

function reqGetcookie() {
    var gmake = '';
    var gmodel = '';
    vl = "/buy-used-cars?action=getreqcookie&callback=setFormData&from=buyusedcars&gmake=" + gmake + "&gmodel=" + gmodel;
    try {
        document.getElementById("spifr").src = vl;
    } catch (e) {

    }
}

function setFormData(models, cmake, cmodel, cfuel, cpricerange, cagerange, ccity, cstype) {
    if (ccity) {
        try {
            city_obj = document.find['city'];
        } catch (e) { }
        try {
            city_obj.value = ccity;
        } catch (e) { }
    }
    if (cmake) {
        try {
            make_obj = document.find["make"];
        } catch (e) { }
        try {
            make_obj.value = cmake;
        } catch (e) { }
        try {
            updatemodels(models);
        } catch (e) { }
    }
    if (cmake && cmodel) {
        try {
            model_obj = document.find['model'];
        } catch (e) { }
        try {
            model_obj.value = cmodel;
        } catch (e) { }
    }
    if (cfuel || cagerange || cpricerange || cstype) {
        expandMoreOptions();
    }
    if (cstype) {
        try {
            model_obj = document.find['sellertype'];
            model_obj.value = cstype;
        } catch (e) { }
    }
    if (cfuel) {
        try {
            model_obj = document.find['fuel'];
        } catch (e) { }
        try {
            model_obj.value = cfuel;
        } catch (e) { }
    }
    if (cagerange) {
        try {
            model_obj = document.find['agerange'];
        } catch (e) { }
        try {
            model_obj.value = cagerange;
        } catch (e) { }
    }
    if (cpricerange) {
        try {
            model_obj = document.find['pricerange'];
        } catch (e) { }
        try {
            model_obj.value = cpricerange;
        } catch (e) { }
    }
}

function getModels(val) {
    try {
        obj = document.find.model;
        obj.disabled = "disabled";
        obj.options.length = 1;
        obj.options[0].value = "";
        obj.options[0].text = "Loading Models";
    } catch (e) { }
    dt = new Date();
    vl = "/buy-used-cars/?action=findusedcarmodels&make=" + val + "&rand=" + dt.getTime();
    try {
        findcars.location = vl;
    } catch (e) {
        document.getElementById("findcars").src = vl;
    }
}

function updatemodels(vm) {
    obj = document.find.model;
    obj.options.length = 1;
    obj.options[0].value = "";
    obj.options[0].text = "Model";
    l = 1;
    for (i in vm) {
        obj.options.length = l + 1;
        obj.options[l].value = vm[i];
        obj.options[l].text = vm[i];
        l = l + 1;
    }
    obj.removeAttribute("disabled");
}

function expandMoreOptions() {

    try {
        document.getElementById("moreopt").style.display = "none";
    } catch (e) {

    }
    try {
        document.getElementById("moreexpand").style.display = "block";

    } catch (e) {

    }
    positionFooter();
}

function closeFloatbar() {
    try {
        document.getElementById("closeFloatbarId").style.display = "none";
    } catch (e) { }
}

function submitFloatbar(vv) {
    var sc_vv = vv;
    showLoader();
    if (vv == "") {
        var citylist = ["New Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad", "Chandigarh", "Gurgaon", "Noida", "Navi Mumbai", "Thane", "Cochin", "Faridabad", "Ghaziabad", "Agra", "Ahmednagar", "Ajmer", "Akola", "Alappuzha", "Aligarh", "Allahabad", "Alwar", "Amalapuram", "Ambala", "Amravati", "Amritsar", "Anand", "Anantapur", "Aurangabad", "Bareilly", "Bathinda", "Beed", "Belgaum", "Bellary", "Bhadohi", "Bharuch", "Bhavnagar", "Bhilai", "Bhilwara", "Bhimavaram", "Bhopal", "Bhubaneswar", "Bhuj", "Bikaner", "Bilaspur", "Bulandshahar", "Chidambaram", "Chittoor", "Coimbatore", "Cuddalore", "Davangere", "Dehradun", "Dhanbad", "Dharwad", "Dibrugarh", "Dindigul", "Durg", "Durgapur", "Eluru", "Erode", "Etah", "Faizabad", "Firozabad", "Gandhidham", "Gandhinagar", "Goa", "Gorakhpur", "Gulbarga", "Guntur", "Gurdaspur", "Guwahati", "Gwalior", "Haldwani", "Hapur", "Himmatnagar", "Hissar", "Hoshiarpur", "Hospet", "Hosur", "Howrah", "Hubli", "Idukki", "Indore", "Jabalpur", "Jagdalpur", "Jaipur", "Jalandhar", "Jalgaon", "Jammu", "Jamnagar", "Jamshedpur", "Jodhpur", "Kadapa", "Kakinada", "Kannur", "Kanpur", "Karimnagar", "Karnal", "Karur", "Kasaragod", "Khammam", "Khanna", "Kolar", "Kolhapur", "Kollam", "Kota", "Kottayam", "Kozhikode", "Kurnool", "Kurukshetra", "Latur", "Lucknow", "Ludhiana", "Madurai", "Malappuram", "Mandi", "Mangalore", "Mathura", "Meerut", "Mehsana", "Mirzapur", "Moga", "Mohali", "Moradabad", "Muzaffarnagar", "Mysore", "Nadia", "Nagercoil", "Nagpur", "Namakkal", "Nanded", "Nashik", "Nellore", "Neyveli", "Nizamabad", "Ongole", "Palakkad", "Palwal", "Panchkula", "Panipat", "Pathanamthitta", "Pathankot", "Patiala", "Patna", "Pimpri-Chinchwad", "Pollachi", "Pondicherry", "Port Blair", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Ratlam", "Ratnagiri", "Rohtak", "Roorkee", "Rudrapur", "Sagar", "Saharanpur", "Salem", "Sangli", "Sangrur", "Satara", "Shillong", "Shimla", "Shimoga", "Sikar", "Siliguri", "Sivakasi", "Solan", "Solapur", "Sonipat", "Sri Ganganagar", "Srinagar", "Surat", "Surendranagar", "Thanjavur", "Thiruvalla", "Thoothukudi", "Thrissur", "Tiruchirapalli", "Tirunelveli", "Tirupati", "Tirupur", "Tiruvalla", "Tiruvallur", "Trivandrum", "Tumkur", "Tuticorin", "Udaipur", "Udumalpet", "Udupi", "Ujjain", "Vadodara", "Valsad", "Vapi", "Varanasi", "Vellore", "Vijayawada", "Viluppuram", "Visakhapatnam", "Visnagar", "Vizianagaram", "Warangal", "Wayanad", "Yamunanagar", "Zirakpur"];
        for (b in citylist) {
            var bb = citylist[b].replace(/ /g, '-');
            try {
                document.getElementById("fltr_" + bb).checked = false;
            } catch (e) { }
        }
        try {
            document.forms["find2"].submit();
        } catch (e) { }
    } else {
        try {
            var vv = vv.replace(" ", "-");
            document.getElementById("fltr_" + vv).checked = true;
            document.getElementById('locality_city').value = '';
            document.getElementById('selectedcity').value = sc_vv.toLowerCase();
            document.forms["find2"].submit();
        } catch (e) { }
    }
    var gtm_category = "Used Cars Results Page";
    try {
        if (__curr_data['popuptype'] == 'chat') {
            gtm_category = "Used Cars Results Page|Chat";
        }
    } catch (e) { }
    _gtm_push(gtm_category, vv, location.href, 'eventUsed Car');
    document.getElementById("loaderblk").style.display = "block";
}

function topFormSubmit() {
    document.getElementById("city_topbar").value = document.getElementById("city").value;
    document.forms['find'].submit();
}

function jspagesubmit(pno) {
    try {
        document.getElementById("pageno_id").value = pno;
        document.forms['find2'].submit();
    } catch (e) { }
}
setTimeout(function () {
    var cookie_city = "Mumbai"; //alert(cookie_city);
    var citylist = ["New Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad", "Chandigarh", "Gurgaon", "Noida", "Navi Mumbai", "Thane", "Cochin", "Faridabad", "Ghaziabad", "Agra", "Ahmednagar", "Ajmer", "Akola", "Alappuzha", "Aligarh", "Allahabad", "Alwar", "Amalapuram", "Ambala", "Amravati", "Amritsar", "Anand", "Anantapur", "Aurangabad", "Bareilly", "Bathinda", "Beed", "Belgaum", "Bellary", "Bhadohi", "Bharuch", "Bhavnagar", "Bhilai", "Bhilwara", "Bhimavaram", "Bhopal", "Bhubaneswar", "Bhuj", "Bikaner", "Bilaspur", "Bulandshahar", "Chidambaram", "Chittoor", "Coimbatore", "Cuddalore", "Davangere", "Dehradun", "Dhanbad", "Dharwad", "Dibrugarh", "Dindigul", "Durg", "Durgapur", "Eluru", "Erode", "Etah", "Faizabad", "Firozabad", "Gandhidham", "Gandhinagar", "Goa", "Gorakhpur", "Gulbarga", "Guntur", "Gurdaspur", "Guwahati", "Gwalior", "Haldwani", "Hapur", "Himmatnagar", "Hissar", "Hoshiarpur", "Hospet", "Hosur", "Howrah", "Hubli", "Idukki", "Indore", "Jabalpur", "Jagdalpur", "Jaipur", "Jalandhar", "Jalgaon", "Jammu", "Jamnagar", "Jamshedpur", "Jodhpur", "Kadapa", "Kakinada", "Kannur", "Kanpur", "Karimnagar", "Karnal", "Karur", "Kasaragod", "Khammam", "Khanna", "Kolar", "Kolhapur", "Kollam", "Kota", "Kottayam", "Kozhikode", "Kurnool", "Kurukshetra", "Latur", "Lucknow", "Ludhiana", "Madurai", "Malappuram", "Mandi", "Mangalore", "Mathura", "Meerut", "Mehsana", "Mirzapur", "Moga", "Mohali", "Moradabad", "Muzaffarnagar", "Mysore", "Nadia", "Nagercoil", "Nagpur", "Namakkal", "Nanded", "Nashik", "Nellore", "Neyveli", "Nizamabad", "Ongole", "Palakkad", "Palwal", "Panchkula", "Panipat", "Pathanamthitta", "Pathankot", "Patiala", "Patna", "Pimpri-Chinchwad", "Pollachi", "Pondicherry", "Port Blair", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Ratlam", "Ratnagiri", "Rohtak", "Roorkee", "Rudrapur", "Sagar", "Saharanpur", "Salem", "Sangli", "Sangrur", "Satara", "Shillong", "Shimla", "Shimoga", "Sikar", "Siliguri", "Sivakasi", "Solan", "Solapur", "Sonipat", "Sri Ganganagar", "Srinagar", "Surat", "Surendranagar", "Thanjavur", "Thiruvalla", "Thoothukudi", "Thrissur", "Tiruchirapalli", "Tirunelveli", "Tirupati", "Tirupur", "Tiruvalla", "Tiruvallur", "Trivandrum", "Tumkur", "Tuticorin", "Udaipur", "Udumalpet", "Udupi", "Ujjain", "Vadodara", "Valsad", "Vapi", "Varanasi", "Vellore", "Vijayawada", "Viluppuram", "Visakhapatnam", "Visnagar", "Vizianagaram", "Warangal", "Wayanad", "Yamunanagar", "Zirakpur"];
    for (b in citylist) {
        var bb = citylist[b].replace(/ /g, '-');
        if (bb != cookie_city) {

        }
    }
    if (cookie_city != '') {
        try {
            document.getElementById("city").value = cookie_city;
            if (document.getElementById("city").innerHTML == "") {
                var cookie_city_capital = "";
                document.getElementById("city").value = cookie_city_capital;
                if (document.getElementById("city").innerHTML == "") {
                    document.getElementById("city").value = "";
                }
            }
        } catch (e) { }
    } else {
        //@kuresh added try catch section on 19-08-2015
        try {
            document.getElementById("city").value = "";
        } catch (e) { }
    }
}, 150);
//functions added by lalitha on 29-6-2015 for call center banner starts here
function FindScrollXY() {
    if (typeof (window.pageYOffset) == 'number') {
        pageScrollHeight = window.pageYOffset;
        pageScrollWidth = window.pageXOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        pageScrollHeight = document.body.scrollTop;
        pageScrollWidth = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollLeft != null || document.documentElement.scrollTop != null)) {
        pageScrollHeight = document.documentElement.scrollTop;
        pageScrollWidth = document.documentElement.scrollLeft;
    }
}

function find_pos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return [curleft, curtop];
}
__chat_open = false;
//functions added by lalitha on 29-6-2015 for call center banner ends here
function chat_initialize(preMessage, sellerMobile, topicId, dealerSMS) {
    __chat_open = true;
    __hash_change = true;
    if (location.hostname != 'testm.cartrade.com') {
        var tiny_chat_url = "http://crtra.de/chat1";
    } else {
        var tiny_chat_url = "https://tiny.cartrade.com/ct/82";
    }
    $('#cl-loaderblk').show();
    $('#overlay-glass-share').show();
    try {
        var myChatTag = document.getElementById("my-chat-splash");
        myChatTag.className = "mychat chat-launcher-icon pull-right applozic-launcher mck-button-launcher";
        myChatTag.href = "#";
        myChatTag.setAttribute('onclick', 'return myChatCliked()');
        $('body').addClass('mck-box-open').addClass('ver-hidden');
    } catch (e) {
        console.log(e);
    }

    var chaterName = document.getElementById("chaterName").value;
    var chat_token = document.getElementById("chat_token").value;
    PRE_MESSAGE_MAP[chat_token] = preMessage;
    DEALER_SMS[topicId] = dealerSMS;

    var cookies = formcookies();
    $applozic.fn.applozic({
        appId: '11955cfdb31b387eee2e71f82bc63ec19',
        userId: cookies['cookie_buyform_mobile'],
        contactNumber: '+91' + cookies['cookie_buyform_mobile'],
        userName: cookies['cookie_buyform_name'],
        displayName: chaterName,
        accessToken: cookies['cookie_buyform_mobile'],
        authenticationTypeId: 1,
        baseUrl: 'https://chat.applozic.com',
        olStatus: true,
        locShare: false,
        //googleApiKey : "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4",
        onTabClicked: function (data) {
            //write your logic here
            dealerNumber = getMobileNumberByChatToken(data.tabId);
            var preMessage = PRE_MESSAGE_MAP[data.tabId];
            /*var __pre_flag=false;
             $applozic.fn.applozic('getMessageListByTopicId',{ 
             id: cookies['cookie_buyform_mobile'],
             isGroup: false,
             topicId: topicId,
             callback : function(data) {console.log(data);}
             });*/
            /*$.each(cartrade_message.message, function(i,obj) {
             var sentMessages = obj.message.replace(/\W/g,"").toLowerCase();
             var trimPremessage = preMessage.replace(/\W/g,"").toLowerCase();
             if (sentMessages == trimPremessage) { 
             __pre_flag=true;
             return false;
             }     
             });
             if(__pre_flag){    
             $applozic("#mck-text-box").html("Write a message");
             }else{
             $applozic("#mck-text-box").html(preMessage);
             } */
            if ($applozic("#mck-message-cell .mck-message-inner div[name='message']").length === 0) {
                $applozic("#mck-text-box").html(preMessage);
            } else {
                $applozic("#mck-text-box").html("Write a message");
            }
            $('#cl-loaderblk').hide();
            $('#overlay-glass-share').hide();
        },
        desktopNotification: true,
        notificationIconLink: `${window.CloudfrontCDNHostURL}/images-mobiles/icon57x57.png`,
        topicBox: false,
        getConversationDetail: function (topicId) {
            var dealerSMS = DEALER_SMS[topicId];

            var obj = {
                "fallBackTemplatesList": [{
                    "userId": chat_token,
                    "fallBackTemplate": dealerSMS
                },
                {
                    "userId": cookies['cookie_buyform_mobile'],
                    "fallBackTemplate": "Hi, you have received a chat message about your car inquiry on CarTrade.com. To reply click here:" + tiny_chat_url
                }
                ],
            }
            console.log(obj);
            return obj;
        },
        onInit: function (response) {
            if (response === "success") {
                //console.log("CHAT PLUGIN INITIALIZED:USE CHAT NOW");
                setTimeout(function () {
                    var $a = $applozic('.applozic-ct-launcher');
                    $a.data('mck-id', chat_token).data('mck-topicid', topicId).trigger('click');
                    //$applozic.fn.applozic('loadTab', chat_token); 
                }, 'fast');

            } else { }
        }
    });
}

function chat_click_done(preMessage, telNumber, topicId, dealerSMS) {
    __chat_open = true;
    __hash_change = true;
    var cookies = formcookies();
    $('#cl-loaderblk').show();
    $('#overlay-glass-share').show();
    try {
        document.getElementById("chat-change-class").className = "mck-close-sidebox";
        document.getElementById("my-chat-splash").className = "mychat chat-launcher-icon pull-right applozic-launcher mck-button-launcher";
        document.getElementById("my-chat-splash").href = "#";
        document.getElementById("chatCall").href = telNumber;
        $('body').addClass('mck-box-open').addClass('ver-hidden');
    } catch (e) {
        console.log(e);
    }
    //var userType = document.getElementById("user_type").value;
    var chaterName = document.getElementById("chaterName").value;
    var chat_token = document.getElementById("chat_token").value;
    PRE_MESSAGE_MAP[chat_token] = preMessage;
    DEALER_SMS[topicId] = dealerSMS;
    //disableChatTextBox();
    var $a = $applozic('.applozic-ct-launcher');
    $a.data('mck-id', chat_token).data('mck-topicid', topicId).trigger('click');
    //$applozic.fn.applozic('loadTab', chat_token);
    //$applozic("#mck-text-box").html(preMessage);
    $('#overlay-glass-share').hide();
    $('#cl-loaderblk').hide();
}

function chat_call_back_function(flag) {
    //alert("chat_call_back_function");   
    //$('body').removeClass('mck-box-open').removeClass('ver-hidden');
    $('body').removeClass('ver-hidden');
    //$(window).scrollTop(__pl_curr_scroll_value);
}

function init_chat_things() {
    $('[data-mck-id]').click(function () {
        __hash_change = false;
        __chat_sub_open = true;
        window.location.hash = 'myChat&' + $(this).data('mck-id');
        setTimeout(function () {
            __hash_change = true;
        }, 300);

    });
}

function myChatCliked(menu) {
    //alert("myChatCliked");
    //$applozic.fn.applozic('loadTab', '');
    //chat_click_done();
    __chat_open = true;
    try {
        //__pl_curr_scroll_value=$(window).scrollTop();
        //$('body').addClass('mck-box-open').addClass('ver-hidden');
        document.getElementById("chat-change-class").className = "mck-conversation-tab-link";
        if (menu == "menu") {
            _gtm_push('Nav button|Menu', 'Chat', document.location.pathname, 'event menu');
        } else {
            _gtm_push('Chat', 'LP', 'Top Nav', 'event chat');
        }
    } catch (e) {
        console.log(e);
    }
    __hash_change = false;
    window.location.hash = 'myChat';

    setTimeout(function () {
        __hash_change = true;
    }, 300);
    //chat_click_done();
    setTimeout(function () {
        init_chat_things();
    }, 500);


    return false;
}

function chat_panel_close(flag) {
    try {
        if (flag == 1) {
            __chat_open = false;
            $applozic('.mck-close-sidebox').trigger('click');
            //document.getElementById("chat-change-class").className = "mck-close-sidebox";
            //document.getElementById("mck-sidebox").style.display = "none";
            chat_call_back_function();
        } else if (flag == 2) {
            __chat_sub_open = false;
            __chat_open = false;
            $('.mck-icon-backward').click();
            setTimeout(function () {
                init_chat_things();
            }, 1000);
            setTimeout(function () {
                __chat_open = true;
            }, 300);
            //document.getElementById("chat-change-class").className = "mck-conversation-tab-link";
            //try{$(".mck-close-sidebox").trigger('click');}catch(e){console.log(e);}
        }
        //$(window).scrollTop(__pl_curr_scroll_value);
        //$('body').removeClass('mck-box-open').removeClass('ver-hidden');
        //document.getElementById("chat-change-class").className = "mck-close-sidebox";
    } catch (e) { }
}
var setaptime = 1;
var event_fired = 0;

function getdatepickerval() {
    /*Total date starts here*/
    var cookies = formcookies();
    var csource = document.location.href;
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var y = d.getFullYear();
    var mnth = d.getMonth() + 1;
    var datec = d.getDate();
    var ext = "AM";
    if (h > 12) {
        ext = "PM";
        h = h - 12;
    }
    //debugger;
    var totaldate = y + "-" + mnth + "-" + datec + " " + h + ":" + (m - 2) + " " + ext;

    /*Total date ends here*/
    var oDTP1, oDTP2;
    $(".dtBox").DateTimePicker({
        init: function () {
            oDTP1 = this;
        },
        parseDateTimeString: function (sDateTime, sMode, oInputElement) {
            if (!event_fired) {
                _gtm_push("book appointment", "LP", "click on book appointment", "event appointment calendar");
                event_fired = 1;
            }
            oDTP1 = this;
            var dThisDate = new Date(),
                iArrDateTimeComps, sRegex;
            /*if($.cf._isValid(sDateTime))
            {
                sRegex = /([a-zA-Z]+)(, )(\d{1,2})( )([a-zA-Z]+)/;                
                iArrDateTimeComps = sDateTime.match(sRegex);                                
                dThisDate = new Date(
                    dThisDate.getFullYear(),
                    oDTP1.settings.fullMonthNames.indexOf(iArrDateTimeComps[5]),
                    parseInt(iArrDateTimeComps[3]),
                    0, 0, 0, 0
                );
            }*/
            return dThisDate;
        },
        dateTimeFormat: 'dd-MM-yyyy hh:mm AA',
        secondsInterval: 1,
        minDateTime: totaldate,
        titleContentDateTime: 'Book Appointment',
        formatDateTimeString: function (oDate, sMode, oInputElement) {
            //_gtm_push( "My Page|My Shortlist","confirm appointment",  document.location.pathname, "event my page shortlist");
            event_fired = 0;
            var iddata = oInputElement["context"]["id"];
            var applistid = iddata.split("_");
            appid = applistid[0];
            listid = applistid[1];
            var date1 = oDate.dd + " " + oDate.month + " " + oDate.yyyy;
            var time1 = oDate.hh + ":" + oDate.mm + " " + oDate.ME;
            var updatedate = oDate.yyyy + "-" + oDate.MM + "-" + oDate.dd + " " + oDate.HH + ":" + oDate.mm + ":00";
            $("#appdate_" + listid).val(updatedate);
            document.getElementById("date1_" + listid).value = date1;
            document.getElementById("time1_" + listid).value = time1;
            var editdate = $("#appdate_" + listid).val();
            var user_id = $("#user_id_" + listid).val();
            var dms_inventory_id = $("#dms_inventory_id_" + listid).val();
            //var newdateval=oDate.yyyy+"-"+oDate.MM+"-"+oDate.dd+" "+oDate.HH+":"+oDate.mm;   
            var newdateval = oDate.yyyy + "/" + oDate.MM + "/" + oDate.dd + " " + oDate.hh + ":" + oDate.mm + ":" + oDate.ss + " " + oDate.ME;
            var dt1 = new Date(newdateval);

            var date = new Date();
            var hours = (date.getHours());
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            var totaldate = y + "/" + mnth + "/" + datec + " " + strTime;
            /*Latest date ends here*/
            //debugger;                
            var dt2 = new Date(totaldate);
            var diffhrs = ((dt1 - dt2) / 1000) - 1800;
            console.log("dt1::" + dt1 + "dt2::" + dt2 + "diffHRS::" + diffhrs);
            if (diffhrs < 0) {
                console.log("dt1::" + dt1 + "dt2::" + dt2 + "diffHRS::" + diffhrs);
                setaptime = 0;
                alert("Please select 30 minutes future time for your appointment");
            } else {
                setaptime = 1;
                /*var bt = "/?action=xoxo_track_book_appointment&page_type=LP&listing_id=" + listid+"&editdate=" +editdate+"&user_id=" +user_id+"&dms_inventory_id=" +dms_inventory_id+"&name=" +cookies['cookie_buyform_name']+"&mobile=" +cookies['cookie_buyform_mobile']+"&fromsource=" +csource;
                $.get(bt,function(data){
                  $('body').append(data);
                });*/
                var cookies = formcookies();
                var vl = "/my-car?action=set_app_shortlist&listing_id=" + listid + "&editdate=" + editdate + "&user_id=" + user_id + "&dms_inventory_id=" + dms_inventory_id + "&name=" + cookies['cookie_buyform_name'] + "&mobile=" + cookies['cookie_buyform_mobile'] + "&fromsource=" + csource + "&page_type=LP&callback=recsetapp";
                $.get(vl, function (data) {
                    $('body').append(data);
                });
                //var bt = "?action=findusedcarmodels&make=" + val + "&rand=" + dt.getTime();
                //document.getElementById("reccheck").src = vl;
            }
            return oDate.day + ", " + oDate.dd + " " + oDate.month;
        },
        buttonClicked: function (sButtonType, oInputElement) {
            if (sButtonType == 'CLEAR') {
                _gtm_push("book appointment", "LP", "appointment|click on cancel", "event appointment calendar");
                event_fired = 0;
            }
        }
    });
}

var _popup1_slug;
var _popup2_slug;
var __popup = 0;
var _active_url = window.location.href;

function setPopupHistory(slug) {
    try {

        document.getElementById("idbybody").style.height = "100%";
        document.getElementById("idbybody").style.overflow = "hidden";

    } catch (e) { }

    if (_active_url.indexOf("#") == -1) {
        _active_url = _active_url + '#' + slug;
        __popup = 1;
        _popup1_slug = slug;
    } else {
        _active_url = _active_url + '&' + slug;
        __popup = 2;
        _popup2_slug = slug;
    }
    window.history.pushState("popup", "popup", _active_url);

}

function clearPopupHistory() {
    try {
        document.getElementById("idbybody").style.height = "auto";
        document.getElementById("idbybody").style.overflow = "auto";
        document.getElementById("idbybody").style.position = "inherit";
    } catch (e) { }
    if (__popup == 2) {
        _active_url = _active_url.substring(0, _active_url.indexOf('&'));
        __popup = 1;
        window.history.replaceState("popup", "popup", _active_url);


    } else if (__popup == 1) {
        _active_url = _active_url.substring(0, _active_url.indexOf('#'));
        __popup = 0;
        window.history.replaceState("popup", "popup", _active_url);
    }



}



function closeApproprite(slug) {

    if (slug == "datetime_popup") {
        var esc = $.Event("keydown", { keyCode: 27 });
        $("body").trigger(esc);
        getdatepickerval();
        try {
            document.getElementById("idbybody").style.height = "auto";
            document.getElementById("idbybody").style.overflow = "auto";
            document.getElementById("idbybody").style.position = "inherit";
        } catch (e) { }
    } else if (slug == "confirmation-box") {
        closeform(1);
    } else if (slug == "confirmation-box-map") {
        closemapform(1);
    }

}
/*function stop_scroll(){

setTimeout(function() {
        if (window.location.hash) {
                var hash = window.location.hash.substr(1);
                var scrollval=$("#"+hash).offset().top;              
                $("html, body").animate({ scrollTop: scrollval-100 }, 1000);    
        }
}, 1);

}

$(".for_click_appoint").click(function(){
    return false;
});

stop_scroll();*/
function closeform() {
    //_gtm
    /*document.getElementById("silifilm").style.display="none"; 
    document.getElementById("idbybody").style.overflow="visible";
    $( ".confirmVstBlk" ).removeClass( "dispBlk" );*/
    //clearPopupHistory();
    hostName = document.location.hostname;
    remailurl = document.location.toString().split(hostName);
    back_url = remailurl[1];
    if (back_url.indexOf("#") != -1) {
        url_arr = back_url.split('#');
        back_url = url_arr[0];
    }

    referrer = document.referrer;
    //console.log(referrer);
    window.history.replaceState("popup", "popup", back_url);
    //clearInterval(refreshIntervalId); 
}

function recsetapp(listing_id, appointment_id) {
    var dateval = document.getElementById("date1_" + listid).value;
    var timeval = document.getElementById("time1_" + listid).value;
    dateval = dateval.split(" ");
    document.getElementById("appointment_section_" + listing_id).innerHTML = ' <div class="appointDate pull-left"><a onclick=\'_gtm_push( "book appointment", "LP", "click on view appointment", "event appointment calendar");\' href="/my-car/appointment#carDetils_' + appointment_id + '"><div class="cell"><ul><li> <span class="red">View Appointment</span></li><li><span>' + dateval[0] + '-' + dateval[1].substr(0, 3) + '-' + dateval[2].toString().substring(2) + ',&nbsp;' + timeval + '</span></li></ul></div></a></div>';
    //document.getElementById("cancel_shortlist_msg_"+listing_id).innerHTML = 'Do you want to remove this car from your shortlist? This will also cancel any scheduled appointment for this car.';


    if ($(".addr-dtl_new_" + listing_id).length != 0) {
        $(".pls_thmb_new_" + listing_id).addClass("changeIcon");
        $(".addr-dtl_new_" + listing_id).addClass("dispBlk");
    }

    var current_count = Number($(".appcount").html());
    if (isNaN(current_count)) {
        current_count = 1;
    }
    if (current_count >= 1) {
        $(".appcount").html((current_count + 1));
    } else {
        $(".appcount").html("1");
        $(".app_hide").css("display", "table");
    }
    var total_counts = document.getElementById("total_counts").innerHTML;
    var app_counts = Number(total_counts) + 1;
    $('#total_counts').html(app_counts);
    $('#total_counts_menu').html(app_counts);
    document.getElementById("total_counts").className = "open";
    document.getElementById("total_counts_menu").className = "open";
    /*document.getElementById("total_counts").innerHTML = Number(total_counts)+1;
    document.getElementById("total_counts_menu").innerHTML = Number(total_counts)+1;*/
    _gtm_push("book appointment", "LP", "appointment|click on confirm", "event appointment calendar");
}
$(function () {
    var lastScroll = 0;
    $(window).scroll(function (event) {
        var st = $(this).scrollTop();
        if (st > lastScroll) {
            $('#moveTotop').fadeOut();
        } else if (st > $(window).height()) {
            $('#moveTotop').fadeIn();
        }
        lastScroll = st;
    });
});
$('#moveTotop').click(function () {
    window.scrollTo(0, 0);
    $('#moveTotop').fadeOut();
    return false;
});

function getValueFromQS(name, qs) {
    var params = qs.split('&');
    var propVal, filterName, value;
    var isFound = false;
    var paramsLength = params.length;
    for (var i = 0; i < paramsLength; i++) {
        var propVal = params[i].split('=');
        filterName = propVal[0];
        if (filterName.toLowerCase() == name.toLowerCase()) {
            value = propVal[1];
            isFound = true;
            break;
        }
    }
    if (isFound && value !== undefined && value.length > 0) {
        if (value.indexOf('+') > 0)
            return value.replace(/\+/g, " ");
        else
            return value;
    }
    else
        return "";
}
function getFiltersFromQueryParams(querySearch, filterApplied, platform) {
    var filters = querySearch.split("&");
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i].split("=");
        if (filter && isQueryParamRequired(filter[0])) {
            if (filter[0] === "filterbyadditional") {
                getfiltersSelected("certification", filterApplied, platform);
            }
            else {
                getfiltersSelected(filter[0], filterApplied, platform);
            }
        }
    }
}
function getSearchPagePath(cityMaskingName) {
    return '/buy-used-cars/' + cityMaskingName + '/c'
}
function getfiltersSelected(filterName, filtersApplied, platform) {
    switch (filterName) {
        case "certification":
            if (platform === "desktop") {
                filtersApplied["certification"] = $('input[name="filterbyadditional"]:checked').val() === "1";
            }
            else {
                filtersApplied["certification"] = $('input[name="certification"]:checked').val() === "1";
            }
            break;
        case "trans":
            filtersApplied["trans"] = undefined;
            if (platform === "desktop") {
                $('input[name="trans"]:checked').each(function () {
                    filtersApplied["trans"] = filtersApplied["trans"] ? filtersApplied["trans"] + "+" + $(this).attr("data-value") : $(this).attr("data-value");
                });
            }
            else {
                $('input[name="gearbox[]"]:checked').each(function () {
                    filtersApplied["trans"] = filtersApplied["trans"] ? filtersApplied["trans"] + "+" + $(this).val() : $(this).val();
                });
            }
            break;
        case "bodytype":
            filtersApplied["bodytype"] = undefined;
            if (platform === "desktop") {
                $('input[name="bodytype"]:checked').each(function () {
                    filtersApplied["bodytype"] = filtersApplied["bodytype"] ? filtersApplied["bodytype"] + "+" + $(this).attr("data-value") : $(this).attr("data-value");
                });
            } else {
                $('input[name="bodytype[]"]:checked').each(function () {
                    filtersApplied["bodytype"] = filtersApplied["bodytype"] ? filtersApplied["bodytype"] + "+" + $(this).attr("data-name") : $(this).attr("data-name");
                });
            }
            break;
        case "fuel":
            filtersApplied["fuel"] = undefined;
            if (platform === "desktop") {
                $('input[name="fuel"]:checked').each(function () {
                    filtersApplied["fuel"] = filtersApplied["fuel"] ? filtersApplied["fuel"] + "+" + $(this).attr("data-value") : $(this).attr("data-value");
                });
            }
            else {
                $('input[name="fuel[]"]:checked').each(function () {
                    filtersApplied["fuel"] = filtersApplied["fuel"] ? filtersApplied["fuel"] + "+" + $(this).parent().prev("span.fuelType").text().trim() : $(this).parent().prev("span.fuelType").text().trim();
                })
            }
            break;
        case "budget":
            if (platform === "desktop") {
                filtersApplied["budget"] = $('input[name="budget"]:checked').val();
            }
            else {
                filtersApplied["budget"] = slider ? slider.getRangeOfSlider({ sliderId: "price" }) : "";
            }
            break;
        case "makes":
        case "car":
            filtersApplied["makes"] = undefined;
            filtersApplied["models"] = undefined;
            if (platform === "desktop") {
                $('input[name="makes"]:checked').each(function () {
                    filtersApplied["makes"] = filtersApplied["makes"] ? filtersApplied["makes"] + "+" + $(this).attr("data-value") : $(this).attr("data-value");
                });
            }
            else {
                $('#filt_make input[class="makeType"]:checked').each(function () {
                    filtersApplied["makes"] = filtersApplied["makes"] ? filtersApplied["makes"] + "+" + $(this).attr("name") : $(this).attr("name");
                });
                $('input[name="models"]:checked').each(function () {
                    filtersApplied["models"] = filtersApplied["models"] ? filtersApplied["models"] + "+" + $(this).attr("data-modelname") : $(this).attr("data-modelname");
                });
            }
            break;
        case "models":
            filtersApplied["models"] = undefined;
            $('input[name="models"]:checked').each(function () {
                filtersApplied["models"] = filtersApplied["models"] ? filtersApplied["models"] + "+" + $(this).attr("data-value") : $(this).attr("data-value");
            });
            break;
        case "city":
            if (platform === "desktop") {
                filtersApplied["fltr_city_name"] = $('select[name=city] option[name=city]').filter(':selected').text().trim();
                break;
            }
            else {
                filtersApplied["fltr_city_name"] = $('input[name="city"]:checked').val();
                break;
            }
    }
    return filtersApplied;
}

function isQueryParamRequired(filter) {
    return filter !== "sc" && filter !== "so" && filter !== "pn";
}

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

function getFilterFromQueryParams(filterName)
{
    let urlParams = new URLSearchParams(window.location.search);
    switch(filterName)
    {
        case "price":
            return urlParams.has('budget') ? urlParams.get('budget') : "";
        case "age":
            return urlParams.has('year') ? urlParams.get('year') : "";
        case USED_FILTER_ENUM.CITY:
            return urlParams.has('city') ? urlParams.get('city') : "";
        case "filterByAdditional":
            return urlParams.has("filterbyadditional") ? urlParams.get("filterbyadditional").split(" ") : "";
        case "additionalTags":
            return urlParams.has("additionaltags") ? urlParams.get("additionaltags").split(" ") : "";
        case USED_FILTER_ENUM.FUEL:
            return urlParams.has("fuel") ? urlParams.get("fuel").split(" ") : "";
        case USED_FILTER_ENUM.KMS:
            return urlParams.has("kms") ? urlParams.get("kms") : "";
        case USED_FILTER_ENUM.TRANSMISSION:
            return urlParams.has("trans") ? urlParams.get("trans").split(" ") : "";
        case USED_FILTER_ENUM.BODY_TYPE:
            return urlParams.has("bodytype") ? urlParams.get("bodytype").split(" ") : "";
        case USED_FILTER_ENUM.OWNERS:
            return urlParams.has("owners") ? urlParams.get("owners").split(" ") : "";
        case USED_FILTER_ENUM.COLORS:
            return urlParams.has("color") ? urlParams.get("color").split(" ") : "";
        default:
            return "";
    }
}