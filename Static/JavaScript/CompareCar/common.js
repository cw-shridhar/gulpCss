jQuery.fn.addBack = jQuery.fn.andSelf;

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
function FindVisibleSize() {
    if (typeof (window.innerWidth) == 'number') {
        pageVisibleWidth = window.innerWidth;
        try {
            pageVisibleHeight = window.innerHeight;
        } catch (e) {}
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        pageVisibleWidth = document.documentElement.clientWidth;
        try {
            pageVisibleHeight = document.documentElement.clientHeight;
        } catch (e) {}
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        pageVisibleWidth = document.body.clientWidth;
        try {
            pageVisibleHeight = document.body.clientHeight;
        } catch (e) {}
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
var lazyload_previous_screenscroll = -1;
var lazyload_debug_mode = false;
var lazyload_success = false;
function lazyload_find_scrollevent() {
    FindScrollXY();
    if (document.readyState != 'complete') {
        lazyload_success = false;
    }
    if (lazyload_previous_screenscroll != Number(pageScrollHeight) || lazyload_success == false) {
        lazyload_previous_screenscroll = Number(pageScrollHeight);
        setTimeout("lazyload_applynow()", 300);
    }
}
function lazyload_applynow() {
    FindSize();
    FindVisibleSize();
    try {
        vis_start = Number(pageScrollHeight);
        try {
            vis_end = Number(pageScrollHeight) + Number(pageVisibleHeight);
        } catch (e) {}
        if (lazyload_debug_mode) {
            vstr = "Size: " + pageHeight + "<BR>";
            vstr = vstr + "Visible: " + pageVisibleHeight + "<BR>";
            vstr = vstr + "Scroll:" + pageScrollHeight + "<BR>";
            document.getElementById("lazyload_msg2").innerHTML = document.getElementById("lazyload_msg2").innerHTML + vstr;
        }
        imgs = document.getElementsByTagName("img");
        vstr = "";
        for (i = 0; i < imgs.length; i++) {
            try {
                try {
                    cl = imgs[i].className;
                    if (lazyload_debug_mode) {
                        vstr = vstr + ", " + i + " - : " + imgs[i].getAttribute("class") + "<BR>";
                    }
                } catch (e) {
                    i = 99999;
                }
                if (cl != null && cl != undefined) {
                    cl = imgs[i].className.toString();
                    if (cl.indexOf("lazyload") != -1) {
                        pos = find_pos(imgs[i]);
                        vh = pos[1];
                        if (vh >= vis_start && vh <= vis_end) {
                            vstr = vstr + i + " " + vh;
                            vs = false;
                            if (imgs[i].src) {
                                var string = imgs[i].src;
                                var re = "/(images|images4)/grey.gif";
                                if (string.match(re)) {
                                    vs = true;
                                }
                            } else {
                                vs = true;
                            }
                            if (imgs[i].getAttribute("data-original") && vs == true) {
                                imgs[i].src = imgs[i].getAttribute("data-original");
                                if (lazyload_debug_mode) {
                                    vstr = vstr + " <strong>applied source now</strong> ";
                                }
                            } else {
                                if (lazyload_debug_mode) {
                                    vstr = vstr + " " + imgs[i].src;
                                }
                            }
                            if (lazyload_debug_mode) {
                                vstr = vstr + "<BR>";
                            }
                        } else {}
                    }
                } else {
                    i = 99999;
                }
            } catch (e) {
                if (lazyload_debug_mode) {
                    vstr = vstr + ", " + i + " : " + e + "<BR>";
                }
            }
        }
        if (lazyload_debug_mode) {
            document.getElementById("lazyload_msg1").innerHTML = vstr;
        }
        lazyload_success = true;
    } catch (e) {
        lazyload_success = false;
    }
}
function initiate_lazyload() {
    try {
        if (lazyload_debug_mode) {
            d1 = document.createElement("div");
            d1.setAttribute("id", "lazyload_msg1");
            d1.setAttribute("style", "position:fixed; background-color:white; border:1px solid red; font-size:8px; top:0px; left:0px;");
            document.body.appendChild(d1);
            d2 = document.createElement("div");
            d2.setAttribute("id", "lazyload_msg2");
            d2.setAttribute("style", "position:fixed; background-color:white; border:1px solid red; font-size:8px; top:0px; right:0px;");
            document.body.appendChild(d2);
        }
        setInterval("lazyload_find_scrollevent()", 200);
        setTimeout("lazyload_applynow()", 200);
    } catch (e) {}
}
setTimeout("initiate_lazyload()", 200);
function submitTopSearch() {
    try {
        var serchkey = document.getElementById("topsearch_query").value;
        if (serchkey == "") {
            alert("Please fill proper keyword");
            return false;
        } else {
            vvl = "https:" + "//" + location.hostname + "/" + serchkey + "/search";
            _gtm_push('New Top Nav|Search Action', "Search Query: " + serchkey, vvl, 'event New Top Nav|Search Action');
        }
    } catch (e) {}
}
function newloginsree() {
    newlogin();
    document.getElementById('loginshow').style.display = 'none';
    document.getElementById('loginhide').style.display = 'block';
}
function newloginsree1() {
    document.getElementById('loginshow').style.display = 'block';
    document.getElementById('loginhide').style.display = 'none';
    hidenewlogin();
}
function newlogin() {
    document.getElementById("newloginDropdown").style.display = "block";
}
function hidenewlogin() {
    document.getElementById("newloginDropdown").style.display = "none";
}
function gtmsubmitlaunch(link, make, model) {
    gtmdatalayercall('make and model page cta submit', make + ' ' + model, document.location.pathname, 'event make and model page cta submit');
    parent.location = link;
}
function gtmdatalayercall(category, action, label, event) {
    dataLayer.push({
        'category': category,
        'action': action,
        'label': label,
        'event': event
    });
}
function _gtm_data_layer_new(_vcity, _vmake, _vmodel, _vprice, category, action, label, event1) {
    console.log('new gtm called');
    dataLayer.push({
        'cityvalue': _vcity,
        'makevalue': _vmake,
        'modelvalue': _vmodel,
        'pricevalue': _vprice,
        'category': category,
        'action': action,
        'label': label,
        'event': event1
    });
}
function tabsection(val, tbname) {
    try {
        var tbname = tbname;
        document.getElementById(tbname + "tab1").className = "";
        document.getElementById(tbname + "_tab1").className = "widgetBox tab-pane";
        document.getElementById(tbname + "tab2").className = "";
        document.getElementById(tbname + "_tab2").className = "widgetBox tab-pane";
        document.getElementById(tbname + "tab3").className = "";
        document.getElementById(tbname + "_tab3").className = "widgetBox tab-pane";
        document.getElementById(tbname + "tab" + val).className = "active";
        document.getElementById(tbname + "_tab" + val).className = "widgetBox tab-pane active";
        return false;
    } catch (e) {}
}
function _showfpage(tabno) {
    animation1_start();
    document.getElementById("_fpage_1").style.display = "none";
    document.getElementById("_fpage_2").style.display = "none";
    document.getElementById("_fpage_3").style.display = "none";
    document.getElementById("_fpage_" + tabno).style.display = "block";
    if (tabno == 2) {
        document.getElementById('prev_fpage').innerHTML = "<a href='javascript:_showfpage(1)' class='prev' rel='prev'>Sell<br> Car</a>";
        document.getElementById('next_fpage').innerHTML = "<a href='javascript:_showfpage(3)' class='next' rel='prev'>Buy<br> New<br> Car</a>";
    }
    if (tabno == 1) {
        document.getElementById('prev_fpage').innerHTML = "<a href='javascript:_showfpage(2)' class='prev' rel='prev'>Buy<br> Used<br> Car</a>";
        document.getElementById('next_fpage').innerHTML = "<a href='javascript:_showfpage(3)' class='next' rel='prev'>Buy<br> New<br> Car</a>";
    }
    if (tabno == 3) {
        document.getElementById('prev_fpage').innerHTML = "<a href='javascript:_showfpage(1)' class='prev' rel='prev'>Sell<br> Car</a>";
        document.getElementById('next_fpage').innerHTML = "<a href='javascript:_showfpage(2)' class='next' rel='prev'>Buy<br> Used<br> Car</a>";
    }
    animation1_end();
}
function _showfbpage(tabno, mvto) {
    document.getElementById("_fpage_1").style.display = "none";
    document.getElementById("_fpage_2").style.display = "none";
    document.getElementById("_fpage_3").style.display = "none";
    document.getElementById("_fpage_" + tabno).style.display = "block";
    $('#_fpage_' + tabno).toggle('slide', {
        direction: 'left'
    }, 500);
}
function _showFullpage(pn) {
    var cc = document.getElementsByClassName("fpageBox");
    var pdiv = Number(document.getElementById("fpage_pre").value);
    var ndiv = Number(document.getElementById("fpage_next").value);
    if (pn == "next") {
        if (cc.length != ndiv) {
            document.getElementById("fpage_pre").value = Number(pdiv + 1);
            document.getElementById("fpage_next").value = Number(ndiv + 1);
            var pdiv = Number(document.getElementById("fpage_pre").value);
            var ndiv = Number(document.getElementById("fpage_next").value);
            document.getElementById("_fpage_" + pdiv).style.display = "none";
            document.getElementById("prev_fpage").className = "prev active";
        }
        if (Number(cc.length - 1) == pdiv) {
            document.getElementById("next_fpage").className = "next";
        }
    } else {
        var pdiv = Number(document.getElementById("fpage_pre").value);
        var ndiv = Number(document.getElementById("fpage_next").value);
        if (ndiv == cc.length) {
            document.getElementById("next_fpage").className = "next active";
        }
        if (pdiv == 1) {
            document.getElementById("prev_fpage").className = "prev";
        }
        if (pdiv != 0) {
            document.getElementById("fpage_pre").value = Number(pdiv - 1);
            document.getElementById("fpage_next").value = Number(ndiv - 1);
            document.getElementById("_fpage_" + ndiv).style.display = "none";
            animation1(pdiv)
        }
    }
}
function animation1_start() {
    document.getElementById("loading").style.display = "block";
}
function animation1_end() {
    setTimeout(function() {
        document.getElementById("loading").style.display = "none";
    }, 3500);
}
function animation1(ndiv) {}
function _showFeatured(pn) {
    var cc = document.getElementsByClassName("fcarsBox");
    var pdiv = Number(document.getElementById("feat_pre").value);
    var ndiv = Number(document.getElementById("feat_next").value);
    if (pn == "next") {
        if (cc.length != ndiv) {
            document.getElementById("feat_pre").value = Number(pdiv + 1);
            document.getElementById("feat_next").value = Number(ndiv + 1);
            var pdiv = Number(document.getElementById("feat_pre").value);
            var ndiv = Number(document.getElementById("feat_next").value);
            document.getElementById("_fcars_" + pdiv).style.display = "none";
            document.getElementById("prev_fcars").className = "prev active";
            animation2(ndiv);
        }
        if (Number(cc.length - 1) == pdiv) {
            document.getElementById("next_fcars").className = "next";
        }
    } else {
        var pdiv = Number(document.getElementById("feat_pre").value);
        var ndiv = Number(document.getElementById("feat_next").value);
        if (ndiv == cc.length) {
            document.getElementById("next_fcars").className = "next active";
        }
        if (pdiv == 1) {
            document.getElementById("prev_fcars").className = "prev";
        }
        if (pdiv != 0) {
            document.getElementById("feat_pre").value = Number(pdiv - 1);
            document.getElementById("feat_next").value = Number(ndiv - 1);
            document.getElementById("_fcars_" + ndiv).style.display = "none";
            animation2(pdiv)
        }
    }
}
function animation2(ndiv) {
    var wdt = Number(document.getElementById("_fcars_" + ndiv).style.width.replace("px", ""));
    var wd = document.getElementById("_fcars_" + ndiv).scrollWidth;
    if (wdt < wd) {
        if (Number(wdt + 180) < wd) {
            wdt = Number(wdt + 180);
            document.getElementById("_fcars_" + ndiv).style.overflow = 'hidden';
            document.getElementById("_fcars_" + ndiv).style.width = (wdt) + "px";
            setTimeout(function() {
                animation2(ndiv);
            }, 500);
        } else {
            document.getElementById("_fcars_" + ndiv).style.width = wd + 'px';
            document.getElementById("_fcars_" + ndiv).style.width = "";
            document.getElementById("_fcars_" + ndiv).style.overflow = "";
        }
    } else {
        document.getElementById("_fcars_" + ndiv).style.width = wd + 'px';
        document.getElementById("_fcars_" + ndiv).style.width = "";
        document.getElementById("_fcars_" + ndiv).style.overflow = "";
    }
    document.getElementById("_fcars_" + ndiv).style.display = "block";
}
function show_selectlist(id) {
    if (document.getElementById("selectlist" + id).style.display == "none" || document.getElementById("selectlist" + id).style.display == "") {
        for (k = 1; k < 7; k++) {
            try {
                document.getElementById("selectlist" + k).style.display = "none";
                document.getElementById("selectlistarrow" + k).className = document.getElementById("selectlistarrow" + k).className.replace("dirArrowUp", "dirArrowDown");
            } catch (e) {}
        }
        try {
            document.getElementById("selectlist" + id).style.display = "block";
            document.getElementById("selectlistarrow" + id).className = document.getElementById("selectlistarrow" + id).className.replace("dirArrowDown", "dirArrowUp");
        } catch (e) {}
    } else {
        try {
            document.getElementById("selectlist" + id).style.display = "none";
            document.getElementById("selectlistarrow" + id).className = document.getElementById("selectlistarrow" + id).className.replace("dirArrowUp", "dirArrowDown");
        } catch (e) {}
    }
}
iif = document.createElement("iframe");
iif.name = 'v_temp_ifr';
iif.id = 'v_temp_ifr';
iif.style.display = 'none';
setTimeout("document.body.appendChild( iif );", 1000);
var pageWidth = 0;
var pageHeight = 0;
var pageVisibleWidth = 0;
try {
    var pageVisibleHeight = 0;
} catch (e) {}
var pageScrollHeight = 0;
var pageScrollWidth = 0;
var isitIE = "y";
var reqs = new Array();
function ajax_createRequest_() {
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        throw new Error("XMLHttpRequest not supported");
    }
}
var ajax_reqNo_ = 1;
var global_reqPage = "";
function ajax_sendRequest_(reqType, reqPage, vData) {
    global_reqPage = reqPage;
    tt = new Object();
    tt = ajax_createRequest_();
    tt.open(reqType, reqPage, true);
    tt.onreadystatechange = function() {
        if (tt.readyState == 4) {
            vD = tt.responseText;
            vCallBackFunction_(vD);
        }
    }
    tt.setRequestHeader("Referrer", document.location);
    if (reqType == "POST") {
        tt.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    tt.send(vData);
    reqs[ajax_reqNo_] = tt;
}
var log_error_message = false;
function vCallBackFunction_(vD) {
    if (log_error_message == true) {
        alert("ajax response data: \n\n" + vD);
    }
    try {
        eval(" " + vD + " ");
    } catch (e) {
        if (vD.length > 1024) {
            vD = vD.substr(0, 1024);
        }
        cache_error_message(e, vD, global_reqPage);
    }
}
var _cl_fromPage = "";
function log_on() {
    log_error_message = true;
    alert('ok');
}
function ajax_submit_request(vdd, vpath) {
    if (log_error_message == true) {
        alert("Making ajax request: " + vpath + " : ");
    }
    ajax_reqNo_ = ajax_reqNo_ + 1;
    vData = "a=b";
    for (i in vdd) {
        vData = vData + "&" + i + "=" + escape(vdd[i]);
    }
    vData = vData + "&reqNo=" + ajax_reqNo_ + "&sec=" + vSec;
    if (log_error_message == true) {
        alert("making ajax request: \n" + vData);
    }
    if (vpath == undefined) {
        vpath = "/";
    }
    try {
        ajax_sendRequest_("POST", "https://" + vServer + vpath, vData);
    } catch (e) {
        cache_error_message(e, vData, vpath);
    }
    return false;
}
function cache_error_message(error_message, vdata, vpath) {
    if (vpath == undefined) {
        vpath = "/";
    }
    E_URL = "/?action=xoxo_send-jsalert-errormail&post_url=" + encodeURIComponent("https://" + vServer + vpath) + "&post_data=" + encodeURIComponent(vdata) + "&page_name=" + encodeURIComponent(document.location) + "&error=" + encodeURIComponent(error_message);
    try {
        document.v_temp_ifr.location = E_URL;
    } catch (e) {
        document.getElementById('v_temp_ifr').src = E_URL;
    }
}
function sT(vid) {
    try {
        document.getElementById(vid).style.display = 'block';
    } catch (e) {
        console.log('Error: ' + vid + ' NotFound');
    }
}
function hT(vid) {
    try {
        document.getElementById(vid).style.display = 'none';
    } catch (e) {
        console.log('Error: ' + vid + ' NotFound');
    }
}
function topperull() {
    var kw = document.getElementById('searchTextt').value;
    var em = kw.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/ig);
    if (em) {
        alert("Please enter a keyword to search");
        return false;
    } else {
        if (kw != "") {
            kw = kw.replace(/ /gi, "-");
            top.location.href = "/" + kw + "/search?block=top-search-bar";
        }
    }
}


function setNCPModels(vmake) {
    vobj = document.getElementById('fnc_model');
    l = 2;
    vobj.options.length = l;
    vobj.options[0].value = "";
    vobj.options[0].text = "Select Model";
    for (i in NCPmakes[vmake]) {
        if (NCPmakes[vmake][i] != "end") {
            vobj.options.length = l;
            vobj.options[l - 1].value = NCPmakes[vmake][i];
            vobj.options[l - 1].text = NCPmakes[vmake][i];
            l = l + 1;
        }
    }
}
function showNewCarPage() {
    var make = document.getElementById("fnc_make").value;
    var model = document.getElementById("fnc_model").value;
    try {
        var trackurl = document.getElementById("tracksource_bybrand").value;
    } catch (e) {}
    var url = "";
    if (make != "" && model != "") {
        url = "/" + make.replace(/ |\./g, "-").toLowerCase() + "-cars" + "/" + model.replace(/ |\./g, "-").toLowerCase();
        top.location.href = url;
    } else if (make != "" && model == "") {
        url = "/" + make.replace(/ |\./g, "-").toLowerCase() + "-cars";
        top.location.href = url;
    } else {}
}
function goToNCbPRange() {
    var min = document.getElementById("budget-min").value;
    var max = document.getElementById("budget-max").value;
    var url = "";
    if (min != "" && max != "" && (parseInt(max) > parseInt(min))) {
        url = "/" + "new-cars" + "/" + "by-price" + "/" + min + "lakh-" + max + "lakh";
        try {
            _gtm_push_datalayer("HP|Find New Cars by Budget", min + "lakh-" + max + "lakh", url, "eventHP|Find New Cars by Budget");
        } catch (e) {}
        top.location.href = url
    }
}
function moveToUsedCarsByCityPage(city) {
    top.location.href = "/buy-used-cars/" + city.replace(' ', '-').toLowerCase() + "/c";
}
function moveToSellCarsByCityPage(city) {
    top.location.href = "/" + "sell-used-car";
}
function NewisName(txt, vmin, vmax) {
    var RegExp = /^[a-zA-Z\ \.]+$/;
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
    var RegExp = /^(([9|8|7][0-9]+)+)$/;
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
function isName(txt) {
    var RegExp = /^[a-zA-Z\ \.]+$/;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isValidURL(url) {
    var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
    if (RegExp.test(url)) {
        return true;
    } else {
        return false;
    }
}
function isValidEmail(email) {
    var RegExp = /^((([a-zA-Z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+(\.([a-zA-Z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+)*)@((((([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.))*([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.)[\w]{2,4}|(((([0-9]){1,3}\.){3}([0-9]){1,3}))|(\[((([0-9]){1,3}\.){3}([0-9]){1,3})\])))$/;
    if (RegExp.test(email)) {
        return true;
    } else {
        return false;
    }
}
function isText(txt) {
    var RegExp = /^(([a-z]|[A-Z])+)$/;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isNum(txt) {
    var RegExp = /^(([0-9])+)$/;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isNumWithSpace(txt) {
    var RegExp = /^(([0-9]| )+)$/;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isTextWithSpace(txt) {
    var RegExp = /^(([a-z]|[A-Z]| )+)$/;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isTextNum(txt) {
    var RegExp = /^(([a-z]|[A-Z]|[0-9]|.)+)$/;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isPhone(txt) {
    var RegExp = /^([0-9\+\ \(\)]+)$/;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isTextNumWithSpace(txt) {
    var RegExp = /^(([a-z]|[A-Z]|[0-9]| )+)$/;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isAnything(txt) {
    for (ti = 0; ti < 120; ti++) {
        txt = txt.replace("\\", "");
    }
    var RegExp = /^([\n\ra-zA-Z0-9\ \`\~\!\@\#\$\%\^\&\*\(\)\-\=\_\+\|\<\>\?\,\.\/\;\'\:\"\[\]\{\}\(\)]+)$/;
    txt = txt.replace(/\-/g, "");
    txt = txt.replace(/\r/g, "");
    txt = txt.replace(/\n/g, "");
    vtxt = "";
    for (i = 0; i < txt.length; i++) {
        if (txt.charCodeAt(i) < 127) {
            vtxt = txt.substr(i, 1);
        }
    }
    txt = vtxt;
    if (RegExp.test(txt)) {
        return true;
    } else {
        return false;
    }
}
function isLength(txt, len, ma, mi) {
    if (txt.length >= ma && txt.length <= mi) {
        return true;
    } else {
        return false;
    }
}
function replacespecialchars(vstr) {
    vstr = vstr.replace(/“/g, "\"");
    vstr = vstr.replace(/”/g, "\"");
    vstr = vstr.replace(/‘/g, "'");
    vstr = vstr.replace(/’/g, "'");
    return vstr;
}
function checkIt(obj, type, req, len, vmin, vmax) {
    if (obj.value == "" && req == 'y') {
        return false;
    } else {
        if (obj.value != "") {
            try {
                obj.value = replacespecialchars(obj.value);
            } catch (e) {
                alert(e);
                return false;
            }
            if (type == "name") {
                if (isName(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "text") {
                if (isText(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "textspace") {
                if (isTextWithSpace(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "num") {
                if (isNum(obj.value)) {
                    if (obj.value >= vmin && obj.value <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "textnum") {
                if (isTextNum(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "textnumspace") {
                if (isTextNumWithSpace(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "phone") {
                if (isPhone(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "email") {
                if (isValidEmail(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "url") {
                if (isValidURL(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (type == "select") {
                if (obj.value == "" || obj.value == "no") {
                    return false;
                } else {
                    return true;
                }
            }
            if (type == "anything") {
                if (isAnything(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }
}
a = 5
j = 6
function setVisibility(id) {
    for (i = 1; i < 6; i++) {
        var c = 'pop' + i;
        if (id == c) {
            document.getElementById(c).style.display = 'block';
        } else {
            document.getElementById(c).style.display = 'none';
        }
    }
}
function setVisibility2(id) {
    for (i = 6; i < 10; i++) {
        var c = 'pop' + i;
        if (id == c) {
            document.getElementById(c).style.display = 'block';
        } else {
            document.getElementById(c).style.display = 'none';
        }
    }
}
function setVisibility3(id) {
    document.getElementById(id).style.display = 'block';
}
function hideallpop(v) {
    document.getElementById(v).style.display = 'none';
}
function newcarfilter(frm, typ, v) {
    _gtm_push('make & model page sort filters', typ, v, 'event make & model page sort filters');
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = typ;
    mapInput.value = v;
    document.getElementById(frm).appendChild(mapInput);
    document.forms[frm].submit();
}
function View_warranty(val) {
    document.getElementById(val).style.display = 'block';
}
function hide_warranty(val) {
    document.getElementById(val).style.display = 'none';
}
var tooltip = function() {
    var id = 'tt';
    var top = 3;
    var left = 3;
    var maxw = 300;
    var speed = 10;
    var timer = 20;
    var endalpha = 95;
    var alpha = 0;
    var tt, t, c, b, h;
    var ie = document.all ? true : false;
    return {
        show: function(v, w) {
            if (tt == null) {
                tt = document.createElement('div');
                tt.setAttribute('id', id);
                t = document.createElement('div');
                t.setAttribute('id', id + 'top');
                c = document.createElement('div');
                c.setAttribute('id', id + 'cont');
                b = document.createElement('div');
                b.setAttribute('id', id + 'bot');
                tt.appendChild(t);
                tt.appendChild(c);
                tt.appendChild(b);
                document.body.appendChild(tt);
                tt.style.opacity = 0;
                tt.style.filter = 'alpha(opacity=0)';
                document.onmousemove = this.pos;
            }
            tt.style.display = 'block';
            c.innerHTML = v;
            tt.style.width = w ? w + 'px' : 'auto';
            if (!w && ie) {
                t.style.display = 'none';
                b.style.display = 'none';
                tt.style.width = tt.offsetWidth;
                t.style.display = 'block';
                b.style.display = 'block';
            }
            if (tt.offsetWidth > maxw) {
                tt.style.width = maxw + 'px'
            }
            h = parseInt(tt.offsetHeight) + top;
            clearInterval(tt.timer);
            tt.timer = setInterval(function() {
                tooltip.fade(1)
            }, timer);
        },
        pos: function(e) {
            var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
            var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
            tt.style.top = (u - h) + 'px';
            tt.style.left = (l + left) + 'px';
        },
        fade: function(d) {
            var a = alpha;
            if ((a != endalpha && d == 1) || (a != 0 && d == -1)) {
                var i = speed;
                if (endalpha - a < speed && d == 1) {
                    i = endalpha - a;
                } else if (alpha < speed && d == -1) {
                    i = a;
                }
                alpha = a + (i * d);
                tt.style.opacity = alpha * .01;
                tt.style.filter = 'alpha(opacity=' + alpha + ')';
            } else {
                clearInterval(tt.timer);
                if (d == -1) {
                    tt.style.display = 'none'
                }
            }
        },
        hide: function() {
            clearInterval(tt.timer);
            tt.timer = setInterval(function() {
                tooltip.fade(-1)
            }, timer);
        }
    };
}();
function showheight() {
    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    if (window.addEventListener)
        document.addEventListener(mousewheelevt, moveObject, false);
    document.onmousewheel = moveObject;
}
setTimeout('showheight()', 1000);
function moveObject(event) {
    try {
        if (/IE/i.test(navigator.userAgent)) {
            var he = Number(document.documentElement.scrollTop);
        } else {
            var he = Number(window.pageYOffset);
        }
        if (he > 300) {
            document.getElementById("scrlTop").style.display = 'block';
        } else {
            document.getElementById("scrlTop").style.display = 'none';
        }
    } catch (e) {}
}
function Movetoppos(sval) {
    try {
        if (sval > 0) {
            ht = Number(sval - 100);
            window.scrollTo(0, ht);
            setTimeout("Movetoppos(ht)", 5);
        } else {
            document.getElementById("scrlTop").style.display = 'none';
        }
    } catch (e) {}
}
function OpenLink(url, make, model, variant, block, clicksource) {
    var ncp_click = "/?action=xoxo_dorprice_ncp_click&make=" + make + "&model=" + model + "&variant=" + variant + "&block=" + block + "&clicksource=" + clicksource + "&url=" + url;
    var vdd = {
        action: "xoxo_dorprice_ncp_click",
        make: make,
        model: model,
        variant: variant,
        block: block,
        clicksource: clicksource,
        url: url
    };
    ajax_submit_request(vdd);
    clicksource = window.location.pathname;
    frmurl = clicksource.substring(1, clicksource.length);
    frmurl1 = frmurl.split(".");
    var url12 = "";
    var patt = /price/g;
    var result = patt.test(frmurl1[0]);
    if (result) {
        urll = "new_car_search_cta";
    } else {
        urll = frmurl1[0];
    }
    var str = '';
    for (var i = 0; i < url.length; i += 2) {
        str += String.fromCharCode(parseInt(url.substr(i, 2), 16));
    }
    url12 = str + "&block=" + block;
    window.open(url12, '_blank');
    window.focus();
    return false;
}
function socialcnt() {
    var widi = window.innerWidth;
    var wido = window.outerWidth;
    if (widi < 1150) {
        try {
            document.getElementById("socialCount").style.display = "none";
        } catch (e) {}
    } else {
        try {
            document.getElementById("socialCount").style.display = "block";
        } catch (e) {}
    }
}
setTimeout(function() {
    socialcnt()
}, 500);
if (typeof document.getElementsByClassName != 'function') {
    try {
        document.getElementsByClassName = function() {
            var elms = document.getElementsByTagName('*');
            var ei = new Array();
            for (i = 0; i < elms.length; i++) {
                if (elms[i].getAttribute('class')) {
                    ecl = elms[i].getAttribute('class').split(' ');
                    for (j = 0; j < ecl.length; j++) {
                        if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
                            ei.push(elms[i]);
                        }
                    }
                } else if (elms[i].className) {
                    ecl = elms[i].className.split(' ');
                    for (j = 0; j < ecl.length; j++) {
                        if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
                            ei.push(elms[i]);
                        }
                    }
                }
            }
            return ei;
        }
    } catch (e) {}
}
function topmenu_gtm_event(topcat, subcat, incat, url) {
    if (subcat == "" && incat == "") {
        _gtm_push('New Top Nav|' + topcat, topcat, url, 'event new top nav');
    } else if (subcat == "" && incat != "") {
        _gtm_push('New Top Nav|' + topcat + '|' + incat, incat, url, 'event new top nav');
    } else if (incat != "") {
        _gtm_push('New Top Nav|' + topcat + '|' + subcat, incat, url, 'event new top nav');
    } else {
        _gtm_push('New Top Nav|' + topcat + '|' + subcat, subcat, url, 'event new top nav');
    }
    if (subcat == 'By City') {
        if (incat == 'Delhi NCR') {
            incat = 'Delhi';
        }
        _gtm_city_push(incat);
    }
}
var load_linksub = setInterval("load_linksub_fun()", 100);
function load_linksub_fun() {
    try {
        if (typeof jQuery != 'undefined' && (document.readyState == "interactive" || document.readyState == 'complete')) {
            $("#price_btn_cta").live("click", function() {
                var make = document.getElementById("price_btn_cta").getAttribute('data-make');
                var model = document.getElementById("price_btn_cta").getAttribute('data-model');
                var variant_id = document.getElementById("price_btn_cta").getAttribute('data-variantid');
                var city = document.getElementById("price_btn_cta").getAttribute('data-city');
                var request_uri = location.pathname + location.search;
                if (variant_id == null) {
                    variant_id = '';
                }
                if (city == null) {
                    city = '';
                }
                $.post("/", {
                    "action": "submit_pq_clicks1",
                    "make": make,
                    "model": model,
                    "variant_id": variant_id,
                    "request_uri": request_uri,
                    "city": city
                }, function(data) {
                    window.location = data;
                });
            });
            clearInterval(load_linksub);
        }
    } catch (e) {}
}
function SetCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    if (nDays == null || nDays == 0)
        nDays = 1;
    expire.setTime(today.getTime() + 3600000 * 24 * nDays);
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString() + ";domain=.cartrade.com;path=/;";
}
function price_btn_cta_fun(i, price, pass) {
    if (!price)
        price = false;
    if (!pass)
        pass = false;
    if (pass) {} else {
        if (getCookie('ct_area_avail') == 1 && getCookie('cookie_cw_area_id') == 0) {
            opencity(i, 'compare', getCookie('cookie_ct_city'), getCookie('cookie_ct_cityid'), getCookie('cookie_cw_cityid'), '1');
            return false;
        } else {
            if (document.getElementById("price_btn_cta_" + i).getAttribute('data-cw_city') == '') {
                opencity(i, 'compare', '', price);
                return false;
            }
        }
    }
    var make = document.getElementById("price_btn_cta_" + i).getAttribute('data-make');
    var model = document.getElementById("price_btn_cta_" + i).getAttribute('data-model');
    var variant_id = document.getElementById("price_btn_cta_" + i).getAttribute('data-variantid');
    var city = document.getElementById("price_btn_cta_" + i).getAttribute('data-city');
    city = '';
    var request_uri = location.pathname + location.search;
    if (variant_id == null) {
        variant_id = '';
    }
    if (city == null) {
        city = '';
    }
    if (price != '') {
        price = price;
    } else {
        price = 'no-price';
    }
    $.post("/", {
        "action": "submit_pq_clicks1",
        "make": make,
        "model": model,
        "variant_id": variant_id,
        "request_uri": request_uri,
        "city": city
    }, function(data) {
        window.location = data;
    });
}
function advertise_new() {
    if (document.getElementById("advertiseblk").style.display == "block") {
        document.getElementById("advertiseblk").style.display = "none";
        document.getElementById("advertisebg").style.display = "none";
    } else {
        document.getElementById("advertiseblk").style.display = "block";
        document.getElementById("advertisebg").style.display = "block";
    }
    var advertise_img = document.getElementById("Advertise_img");
    if (advertise_img.src == "") {
        var ad_author_img = advertise_img.getAttribute("data-src");
        advertise_img.src = ad_author_img;
        ad_author_img = "";
    }
}
function cust_emi(flg, low_l, upper_l, totalamount, amount, cw_model_id_comp, variantId, isCampaignAvailable) {
    if (
        // getCookie('cookie_cw_cityid') != ""
         true) {
        if (flg == 0) {}
        if (flg == 1) {}
        if (flg == 2 && cars_count > 2) {}
        loadEmi(parseInt(low_l), parseInt(upper_l), parseInt(totalamount), parseInt(amount), parseInt(flg));
        cal_emi(parseInt(low_l), parseInt(upper_l), parseInt(totalamount), parseInt(amount), parseInt(flg));
        document.getElementById("cust_emi_popup").style.display = "block";
        $(".cust_emi_overlay").show();
        $(".emi_blk_cust").hide();
        $(".emiOffersBlk_" + flg).show();
        $('body').css("overflow", "hidden");
        $("#emi-offers-btn").attr("data-variantId", variantId);
        if(isCampaignAvailable.toLowerCase() === "true"){
            $("#emi-offers-btn").show();
        }else{
            $("#emi-offers-btn").hide();
        }
    } else {}
}

function showLeadFormPopup(propertyType) {
    var variantId = $("#emi-offers-btn").attr("data-variantId");
    hide_cusemi(1);
    leadFormPopup.click_camp_call(variantId, propertyType);
}

function hide_cusemi(from, flg) {
    if (!from) {
        from = 0;
    }
    if (!flg) {
        flg = 0;
    }
    document.getElementById("cust_emi_popup").style.display = "none";
    $(".cust_emi_overlay").hide();
    if (from) {
        $("#chk_emi_click").val(0);
        if ($("#reload").val() == "yes") {
            location.reload();
        }
        $('body').css("overflow", "visible");
    } else {
        $("#chk_emi_click").val(1);
    }
}
function gtag_report_conversion(url) {
    var callback = function() {
        if (typeof (url) != 'undefined') {
            window.location = url;
        }
    };
    gtag('event', 'conversion', {
        'send_to': 'AW-1015794932/TwfZCMTMkwMQ9Jmv5AM',
        'value': 1.0,
        'currency': 'INR',
        'event_callback': callback
    });
    fbq('track', 'Lead');
    return false;
}
function lead_form_data_camp(formData, dealerid, campid, modelids, type) {
    if (!dealerid) {
        dealerid = "";
    }
    if (!campid) {
        campid = "";
    }
    if (!modelids) {
        modelids = "";
    }
    if (!type) {
        type = "";
    }
    var final_formData = {};
    final_formData['UserInfo'] = {};
    final_formData['UserLocation'] = {};
    final_formData['LeadSource'] = {};
    final_formData['CarInquiry'] = [];
    final_formData['Others'] = {};
    var total_car_data = {};
    total_car_data['CarDetail'] = {};
    total_car_data['Seller'] = {};
    var k = 0;
    for (i in formData) {
        if (i == "Name" || i == "Mobile" || i == "Email") {
            final_formData['UserInfo'][i] = formData[i];
        }
        if (i == "CityId" || i == "AreaId") {
            final_formData['UserLocation'][i] = formData[i];
        }
        if (i == "PlatformId" || i == "ApplicationId" || i == "SourceType" || i == "PageId" || i == "NewPageId" || i == "PropertyId" || i == "IsCitySet" || i == "CwCookie" || i == "UtmzCookie" || i == "ABTest") {
            final_formData['LeadSource'][i] = formData[i];
        }
        if (type == "") {
            if (i == "ModelId" || i == "VersionId") {
                total_car_data['CarDetail'][i] = formData[i];
                final_formData['CarInquiry'][k] = total_car_data;
            }
            if (i == "CampaignId" || i == "AssignedDealerId") {
                total_car_data['Seller'][i] = formData[i];
                final_formData['CarInquiry'][k] = total_car_data;
            }
        } else {
            if (type == "rec") {
                if (i == "ModelId") {
                    for (j in modelids) {
                        if (!final_formData['CarInquiry'][j]) {
                            final_formData['CarInquiry'][j] = {};
                            final_formData['CarInquiry'][j]['CarDetail'] = {};
                            final_formData['CarInquiry'][j]['Seller'] = {};
                        }
                        final_formData['CarInquiry'][j]['CarDetail'][i] = modelids[j];
                        final_formData['CarInquiry'][j]['CarDetail']['VersionId'] = 0;
                    }
                }
            } else {
                if (i == "ModelId" || i == "VersionId") {
                    for (j in campid) {
                        if (!final_formData['CarInquiry'][j]) {
                            final_formData['CarInquiry'][j] = {};
                            final_formData['CarInquiry'][j]['CarDetail'] = {};
                            final_formData['CarInquiry'][j]['Seller'] = {};
                        }
                        final_formData['CarInquiry'][j]['CarDetail'][i] = formData[i];
                    }
                }
            }
            if (i == "CampaignId" || i == "AssignedDealerId") {
                if (i == "CampaignId") {
                    for (j in campid) {
                        if (!final_formData['CarInquiry'][j]) {
                            final_formData['CarInquiry'][j] = {};
                            final_formData['CarInquiry'][j]['CarDetail'] = {};
                            final_formData['CarInquiry'][j]['Seller'] = {};
                        }
                        final_formData['CarInquiry'][j]['Seller'][i] = campid[j];
                    }
                }
                if (i == "AssignedDealerId") {
                    for (j in dealerid) {
                        if (!final_formData['CarInquiry'][j]) {
                            final_formData['CarInquiry'][j] = {};
                            final_formData['CarInquiry'][j]['CarDetail'] = {};
                            final_formData['CarInquiry'][j]['Seller'] = {};
                        }
                        final_formData['CarInquiry'][j]['Seller'][i] = "-1";
                    }
                }
            }
        }
        if (i == "EncryptedLeadId") {
            final_formData[i] = formData[i];
        }
        if (i == "PrimaryEncryptedLeadId") {
            final_formData[i] = formData[i];
        }
        if (i == "CampaignCTAText" || i == "EmailLead") {
            final_formData['Others'][i] = formData[i];
        }
    }
    return final_formData;
}
