/*JavaScript Document

Find New Cars Tab Sections
function findcarstab(val){
   document.getElementById( "bodytype_tab" ).className = "";
   document.getElementById( "bodytype" ).className = "widgetBox tab-pane";

   document.getElementById( "fueltype_tab" ).className = "";
   document.getElementById( "fueltype" ).className = "widgetBox tab-pane";

   document.getElementById( "transmission_tab" ).className = "";
   document.getElementById( "transmission" ).className = "widgetBox tab-pane";

   document.getElementById( val + "_tab" ).className = "active";
   document.getElementById( val ).className = "widgetBox tab-pane active";
   return false;
}*/

/* GTM call */
function gtmsubmitlaunch(link, make, model) {
  gtmdatalayercall(
    "make and model page cta submit",
    make + " " + model,
    document.location.pathname,
    "event make and model page cta submit"
  );
  parent.location = link;
}
/* ends here */

function gtmdatalayercall(category, action, label, event) {
  dataLayer.push({
    category: category,
    action: action,
    label: label,
    event: event,
  });
}

function _gtm_data_layer_new(
  _vcity,
  _vmake,
  _vmodel,
  _vprice,
  category,
  action,
  label,
  event1
) {
  console.log("new gtm called");
  dataLayer.push({
    cityvalue: _vcity,
    makevalue: _vmake,
    modelvalue: _vmodel,
    pricevalue: _vprice,
    category: category,
    action: action,
    label: label,
    event: event1,
  });
}

function tabsection(val, tbname) {
  var tbname = tbname;
  document.getElementById(tbname + "tab1").className = "";
  document.getElementById(tbname + "_tab1").className = "widgetBox tab-pane";

  document.getElementById(tbname + "tab2").className = "";
  document.getElementById(tbname + "_tab2").className = "widgetBox tab-pane";

  document.getElementById(tbname + "tab3").className = "";
  document.getElementById(tbname + "_tab3").className = "widgetBox tab-pane";

  document.getElementById(tbname + "tab" + val).className = "active";
  document.getElementById(tbname + "_tab" + val).className =
    "widgetBox tab-pane active";
  return false;
}

/*Recently listed cars image scroller Sections*/
function _showfpage(tabno) {
  animation1_start();
  document.getElementById("_fpage_1").style.display = "none";
  document.getElementById("_fpage_2").style.display = "none";
  document.getElementById("_fpage_3").style.display = "none";
  document.getElementById("_fpage_" + tabno).style.display = "block";
  if (tabno == 2) {
    document.getElementById("prev_fpage").innerHTML =
      "<a href='javascript:_showfpage(1)' class='prev' rel='prev'>Sell<br> Car</a>";
    document.getElementById("next_fpage").innerHTML =
      "<a href='javascript:_showfpage(3)' class='next' rel='prev'>Buy<br> New<br> Car</a>";
  }
  if (tabno == 1) {
    document.getElementById("prev_fpage").innerHTML =
      "<a href='javascript:_showfpage(2)' class='prev' rel='prev'>Buy<br> Used<br> Car</a>";
    document.getElementById("next_fpage").innerHTML =
      "<a href='javascript:_showfpage(3)' class='next' rel='prev'>Buy<br> New<br> Car</a>";
  }
  if (tabno == 3) {
    document.getElementById("prev_fpage").innerHTML =
      "<a href='javascript:_showfpage(1)' class='prev' rel='prev'>Sell<br> Car</a>";
    document.getElementById("next_fpage").innerHTML =
      "<a href='javascript:_showfpage(2)' class='next' rel='prev'>Buy<br> Used<br> Car</a>";
  }
  animation1_end();
}
function _showfbpage(tabno, mvto) {
  document.getElementById("_fpage_1").style.display = "none";
  document.getElementById("_fpage_2").style.display = "none";
  document.getElementById("_fpage_3").style.display = "none";
  document.getElementById("_fpage_" + tabno).style.display = "block";
  $("#_fpage_" + tabno).toggle("slide", { direction: "left" }, 500);
  if (tabno == 2) {
    /*document.getElementById('prev_fpage').innerHTML="<a href='javascript:_showfpage(1)' class='prev' rel='prev'>Sell<br> Car</a>";
    document.getElementById('next_fpage').innerHTML="<a href='javascript:_showfpage(3)' class='next' rel='prev'>Buy<br> New<br> Car</a>";*/
  }
  if (tabno == 1) {
    /*$('#_fpage_1').toggle('slide', { direction:mvto }, 500);
    document.getElementById('prev_fpage').innerHTML="<a href='javascript:_showfpage(2)' class='prev' rel='prev'>Buy<br> Used<br> Car</a>";
   document.getElementById('next_fpage').innerHTML="<a href='javascript:_showfpage(3)' class='next' rel='prev'>Buy<br> New<br> Car</a>";*/
  }
  if (tabno == 3) {
    /*	document.getElementById('prev_fpage').innerHTML="<a href='javascript:_showfpage(1)' class='prev' rel='prev'>Sell<br> Car</a>";
      document.getElementById('next_fpage').innerHTML="<a href='javascript:_showfpage(2)' class='next' rel='prev'>Buy<br> Used<br> Car</a>";*/
  }
}
function _showFullpage(pn) {
  /*animation1_start();*/
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
      animation1(pdiv);
    }
  }
  /*animation1_end();*/
}
function animation1_start() {
  document.getElementById("loading").style.display = "block";
}
function animation1_end() {
  setTimeout(function () {
    document.getElementById("loading").style.display = "none";
  }, 3500);
}
function animation1(ndiv) {
  /*var wdt = Number(document.getElementById("_fpage_" + ndiv ).style.width.replace("px",""));
   var wd  = document.getElementById( "_fpage_" + ndiv ).scrollWidth;
  if( wdt < wd ){
   if( Number(wdt+100) < wd ){
     wdt = Number(wdt+100);
    document.getElementById("_fpage_" + ndiv ).style.overflow ='hidden';
    document.getElementById("_fpage_" + ndiv ).style.width = (wdt)+"%";
    setTimeout( function(){ animation2(ndiv);}, 500 );
    }else{
     document.getElementById("_fpage_" + ndiv ).style.width = wd+'%';
     document.getElementById( "_fpage_" + ndiv ).style.width ="";
     document.getElementById( "_fpage_" + ndiv ).style.overflow ="";
    }
  }else{
    document.getElementById("_fpage_" + ndiv ).style.width = wd+'%';
    document.getElementById( "_fpage_" + ndiv).style.width ="";
    document.getElementById( "_fpage_" + ndiv ).style.overflow ="";
  }
      document.getElementById( "_fpage_" + ndiv ).style.display = "block";*/
}

/*Recently listed cars image scroller Sections*/
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
      animation2(pdiv);
    }
  }
}

function animation2(ndiv) {
  var wdt = Number(
    document.getElementById("_fcars_" + ndiv).style.width.replace("px", "")
  );
  var wd = document.getElementById("_fcars_" + ndiv).scrollWidth;
  if (wdt < wd) {
    if (Number(wdt + 180) < wd) {
      wdt = Number(wdt + 180);
      document.getElementById("_fcars_" + ndiv).style.overflow = "hidden";
      document.getElementById("_fcars_" + ndiv).style.width = wdt + "px";
      setTimeout(function () {
        animation2(ndiv);
      }, 500);
    } else {
      document.getElementById("_fcars_" + ndiv).style.width = wd + "px";
      document.getElementById("_fcars_" + ndiv).style.width = "";
      document.getElementById("_fcars_" + ndiv).style.overflow = "";
    }
  } else {
    document.getElementById("_fcars_" + ndiv).style.width = wd + "px";
    document.getElementById("_fcars_" + ndiv).style.width = "";
    document.getElementById("_fcars_" + ndiv).style.overflow = "";
  }
  document.getElementById("_fcars_" + ndiv).style.display = "block";
}

/*Filter Options Collaps List*/
function show_selectlist(id) {
  if (
    document.getElementById("selectlist" + id).style.display == "none" ||
    document.getElementById("selectlist" + id).style.display == ""
  ) {
    for (k = 1; k < 7; k++) {
      try {
        document.getElementById("selectlist" + k).style.display = "none";
        document.getElementById(
          "selectlistarrow" + k
        ).className = document
          .getElementById("selectlistarrow" + k)
          .className.replace("dirArrowUp", "dirArrowDown");
      } catch (e) { }
    }
    try {
      document.getElementById("selectlist" + id).style.display = "block";
      document.getElementById(
        "selectlistarrow" + id
      ).className = document
        .getElementById("selectlistarrow" + id)
        .className.replace("dirArrowDown", "dirArrowUp");
    } catch (e) { }
  } else {
    try {
      document.getElementById("selectlist" + id).style.display = "none";
      document.getElementById(
        "selectlistarrow" + id
      ).className = document
        .getElementById("selectlistarrow" + id)
        .className.replace("dirArrowUp", "dirArrowDown");
    } catch (e) { }
  }
}

iif = document.createElement("iframe");
iif.name = "v_temp_ifr";
iif.id = "v_temp_ifr";
iif.style.display = "none";
setTimeout("document.body.appendChild( iif );", 1000);
var pageWidth = 0;
var pageHeight = 0;
var pageVisibleWidth = 0;
try {
  var pageVisibleHeight = 0;
} catch (e) { }
var pageScrollHeight = 0;
var pageScrollWidth = 0;
var isitIE = "y";
function FindSize() {
  if (window.innerHeight && window.scrollMaxY) {
    isitIE = "n";
    pageWidth = window.innerWidth + window.scrollMaxX;
    pageHeight = window.innerHeight + window.scrollMaxY;
  } else if (document.body.scrollHeight > document.body.offsetHeight) {
    isitIE = "n";
    pageWidth = document.body.scrollWidth;
    pageHeight = document.body.scrollHeight;
  } else {
    isitIE = "y";
    pageWidth = document.body.offsetWidth + document.body.offsetLeft;
    pageHeight = document.body.offsetHeight + document.body.offsetTop;
  }
  return isitIE;
}
function FindVisibleSize() {
  if (typeof window.innerWidth == "number") {
    pageVisibleWidth = window.innerWidth;
    try {
      pageVisibleHeight = window.innerHeight;
    } catch (e) { }
  } else if (
    document.documentElement &&
    (document.documentElement.clientWidth ||
      document.documentElement.clientHeight)
  ) {
    pageVisibleWidth = document.documentElement.clientWidth;
    try {
      pageVisibleHeight = document.documentElement.clientHeight;
    } catch (e) { }
  } else if (
    document.body &&
    (document.body.clientWidth || document.body.clientHeight)
  ) {
    pageVisibleWidth = document.body.clientWidth;
    try {
      pageVisibleHeight = document.body.clientHeight;
    } catch (e) { }
  }
}
function FindScrollXY() {
  if (typeof window.pageYOffset == "number") {
    pageScrollHeight = window.pageYOffset;
    pageScrollWidth = window.pageXOffset;
  } else if (
    document.body &&
    (document.body.scrollLeft || document.body.scrollTop)
  ) {
    pageScrollHeight = document.body.scrollTop;
    pageScrollWidth = document.body.scrollLeft;
  } else if (
    document.documentElement &&
    (document.documentElement.scrollLeft || document.documentElement.scrollTop)
  ) {
    pageScrollHeight = document.documentElement.scrollTop;
    pageScrollWidth = document.documentElement.scrollLeft;
  }
}
/*ajax code
ajax form submit;;*/
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
  tt.onreadystatechange = function () {
    if (tt.readyState == 4) {
      vD = tt.responseText;
      /*alert(vD);*/
      vCallBackFunction_(vD);
    }
  };
  tt.setRequestHeader("Referrer", document.location);
  if (reqType == "POST") {
    tt.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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
  alert("ok");
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
  /*alert( vData );alert( vServer );*/
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
  E_URL =
    "/?action=xoxo_send-jsalert-errormail&post_url=" +
    encodeURIComponent("https://" + vServer + vpath) +
    "&post_data=" +
    encodeURIComponent(vdata) +
    "&page_name=" +
    encodeURIComponent(document.location) +
    "&error=" +
    encodeURIComponent(error_message);
  try {
    document.v_temp_ifr.location = E_URL;
  } catch (e) {
    document.getElementById("v_temp_ifr").src = E_URL;
  }
}
function sT(vid) {
  try {
    document.getElementById(vid).style.display = "block";
  } catch (e) {
    console.log("Error: " + vid + " NotFound");
  }
}
function hT(vid) {
  try {
    document.getElementById(vid).style.display = "none";
  } catch (e) {
    console.log("Error: " + vid + " NotFound");
  }
}
function topperull() {
  var kw = document.getElementById("searchTextt").value;
  var em = kw.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi);
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

function newlogin() {
  document.getElementById("newloginDropdown").style.display = "block";
}
function hidenewlogin() {
  document.getElementById("newloginDropdown").style.display = "none";
}

/*common end*/
/*Cookie Related*/

/*Cookie Related*/

/*Block Find New Car Related */
function setNCPModels(vmake) {
  vobj = document.getElementById("fnc_model");
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
  } catch (e) { }
  var url = "";
  if (make != "" && model != "") {
    //url = "/"+"new-cars"+"/" + make.replace(/ |\./g,"-") + "-" + model.replace(/ |\./g,"-");
    url =
      "/" +
      make.replace(/ |\./g, "-").toLowerCase() +
      "-cars" +
      "/" +
      model.replace(/ |\./g, "-").toLowerCase();
    top.location.href = url;
  } else if (make != "" && model == "") {
    //url = "/"+"new-cars"+"/" + make.replace(/ /g,"-")+"-Car-Models";
    url = "/" + make.replace(/ |\./g, "-").toLowerCase() + "-cars";
    top.location.href = url;
  } else {
  }
}
function goToNCbPRange() {
  var min = document.getElementById("budget-min").value;
  var max = document.getElementById("budget-max").value;
  var url = "";
  if (min != "" && max != "" && parseInt(max) > parseInt(min)) {
    url =
      "/" + "new-cars" + "/" + "by-price" + "/" + min + "lakh-" + max + "lakh";
    try {
      _gtm_push_datalayer(
        "HP|Find New Cars by Budget",
        min + "lakh-" + max + "lakh",
        url,
        "eventHP|Find New Cars by Budget"
      );
    } catch (e) { }
    top.location.href = url;
  }
}

/*Block Find New Car Related */
function moveToUsedCarsByCityPage(city) {
  /*Find Used Cars block - takes user to the used car listing page for tha selected city*/

  //top.location.href = "/buy-used-cars/"+city+"/c";
  top.location.href =
    "/buy-used-cars/" + city.replace(" ", "-").toLowerCase() + "/c";
}

function moveToSellCarsByCityPage(city) {
  /*Find Sell Cars block - takes user to the Sell-car auction/non-auction page for tha selected city*/

  //top.location.href = "/"+"sell-used-car"+"/"+"Auction"+"/"+city;
  top.location.href = "/" + "sell-used-car";
}

/* Validate JS*/
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
  vstr = vstr.replace(/“/g, '"');
  vstr = vstr.replace(/”/g, '"');
  vstr = vstr.replace(/‘/g, "'");
  vstr = vstr.replace(/’/g, "'");
  return vstr;
}
/* object , type ( text, textspace num, textnum, email, url ), req ( y, n ), length, max , min*/
function checkIt(obj, type, req, len, vmin, vmax) {
  if (obj.value == "" && req == "y") {
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
a = 5;
j = 6;

/* Validate JS */
/* JavaScript Document*/

/* popup code */

function setVisibility(id) {
  for (i = 1; i < 6; i++) {
    var c = "pop" + i;
    if (id == c) {
      document.getElementById(c).style.display = "block";
      /*document.getElementById(id).value = 'Show Layer';*/
    } else {
      document.getElementById(c).style.display = "none";
      /*document.getElementById(id).value = 'Hide Layer';*/
    }
  }
}

function setVisibility2(id) {
  for (i = 6; i < 10; i++) {
    var c = "pop" + i;
    if (id == c) {
      document.getElementById(c).style.display = "block";
      /*document.getElementById(id).value = 'Show Layer';*/
    } else {
      document.getElementById(c).style.display = "none";
      /*document.getElementById(id).value = 'Hide Layer';*/
    }
  }
}

function setVisibility3(id) {
  document.getElementById(id).style.display = "block";
}

/* popup hide*/

function hideallpop(v) {
  document.getElementById(v).style.display = "none";
}

/* filter code*/

function newcarfilter(frm, typ, v) {
  _gaq.push(["_trackEvent", "make & model page sort filters", typ, v]);
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = typ;
  mapInput.value = v;
  document.getElementById(frm).appendChild(mapInput);
  document.forms[frm].submit();
}

/*added by harshit in vehicle template*/
function View_warranty(val) {
  document.getElementById(val).style.display = "block";
}

function hide_warranty(val) {
  document.getElementById(val).style.display = "none";
}

/*Tooltip code*/
var tooltip = (function () {
  var id = "tt";
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
    show: function (v, w) {
      if (tt == null) {
        tt = document.createElement("div");
        tt.setAttribute("id", id);
        t = document.createElement("div");
        t.setAttribute("id", id + "top");
        c = document.createElement("div");
        c.setAttribute("id", id + "cont");
        b = document.createElement("div");
        b.setAttribute("id", id + "bot");
        tt.appendChild(t);
        tt.appendChild(c);
        tt.appendChild(b);
        document.body.appendChild(tt);
        tt.style.opacity = 0;
        tt.style.filter = "alpha(opacity=0)";
        document.onmousemove = this.pos;
      }
      tt.style.display = "block";
      c.innerHTML = v;
      tt.style.width = w ? w + "px" : "auto";
      if (!w && ie) {
        t.style.display = "none";
        b.style.display = "none";
        tt.style.width = tt.offsetWidth;
        t.style.display = "block";
        b.style.display = "block";
      }
      if (tt.offsetWidth > maxw) {
        tt.style.width = maxw + "px";
      }
      h = parseInt(tt.offsetHeight) + top;
      clearInterval(tt.timer);
      tt.timer = setInterval(function () {
        tooltip.fade(1);
      }, timer);
    },
    pos: function (e) {
      var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
      var l = ie
        ? event.clientX + document.documentElement.scrollLeft
        : e.pageX;
      tt.style.top = u - h + "px";
      tt.style.left = l + left + "px";
    },
    fade: function (d) {
      var a = alpha;
      if ((a != endalpha && d == 1) || (a != 0 && d == -1)) {
        var i = speed;
        if (endalpha - a < speed && d == 1) {
          i = endalpha - a;
        } else if (alpha < speed && d == -1) {
          i = a;
        }
        alpha = a + i * d;
        tt.style.opacity = alpha * 0.01;
        tt.style.filter = "alpha(opacity=" + alpha + ")";
      } else {
        clearInterval(tt.timer);
        if (d == -1) {
          tt.style.display = "none";
        }
      }
    },
    hide: function () {
      clearInterval(tt.timer);
      tt.timer = setInterval(function () {
        tooltip.fade(-1);
      }, timer);
    },
  };
})();

/*top button script*/
function showheight() {
  var mousewheelevt = /Firefox/i.test(navigator.userAgent)
    ? "DOMMouseScroll"
    : "mousewheel";
  if (window.addEventListener)
    document.addEventListener(mousewheelevt, moveObject, false);
  document.onmousewheel = moveObject;
}
setTimeout("showheight()", 1000);

function moveObject(event) {
  try {
    if (/IE/i.test(navigator.userAgent)) {
      var he = Number(document.documentElement.scrollTop);
    } else {
      var he = Number(window.pageYOffset);
    }
    if (he > 300) {
      document.getElementById("scrlTop").style.display = "block";
    } else {
      document.getElementById("scrlTop").style.display = "none";
    }
  } catch (e) { }
}
function Movetoppos(sval) {
  try {
    if (sval > 0) {
      ht = Number(sval - 100);
      window.scrollTo(0, ht);
      setTimeout("Movetoppos(ht)", 5);
    } else {
      document.getElementById("scrlTop").style.display = "none";
    }
  } catch (e) { }
}
/*End top button script*/
function OpenLink(url, make, model, variant, block, clicksource) {
  var ncp_click =
    "/actions/?action=xoxo_dorprice_ncp_click&make=" +
    make +
    "&model=" +
    model +
    "&variant=" +
    variant +
    "&block=" +
    block +
    "&clicksource=" +
    clicksource +
    "&url=" +
    url;
  var vdd = {
    action: "xoxo_dorprice_ncp_click",
    make: make,
    model: model,
    variant: variant,
    block: block,
    clicksource: clicksource,
    url: url,
  };
  ajax_submit_request(vdd, "/actions/");
  /*try{
   document.getElementById("setcook").src = ncp_click;
  }catch(e){
     document.getElementById("setcook").src = ncp_click;
  }*/
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

  var str = "";
  for (var i = 0; i < url.length; i += 2) {
    str += String.fromCharCode(parseInt(url.substr(i, 2), 16));
  }
  url12 = str + "&block=" + block;
  window.open(url12, "_blank");
  window.focus();
  return false;
}
function socialcnt() {
  var widi = window.innerWidth;
  var wido = window.outerWidth;
  if (widi < 1150) {
    try {
      document.getElementById("socialCount").style.display = "none";
    } catch (e) { }
  } else {
    try {
      document.getElementById("socialCount").style.display = "block";
    } catch (e) { }
  }
}
setTimeout(function () {
  socialcnt();
}, 500);
if (typeof document.getElementsByClassName != "function") {
  try {
    document.getElementsByClassName = function () {
      var elms = document.getElementsByTagName("*");
      var ei = new Array();
      for (i = 0; i < elms.length; i++) {
        if (elms[i].getAttribute("class")) {
          ecl = elms[i].getAttribute("class").split(" ");
          for (j = 0; j < ecl.length; j++) {
            if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
              ei.push(elms[i]);
            }
          }
        } else if (elms[i].className) {
          ecl = elms[i].className.split(" ");
          for (j = 0; j < ecl.length; j++) {
            if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
              ei.push(elms[i]);
            }
          }
        }
      }
      return ei;
    };
  } catch (e) { }
}
function chat_gtm() {
  try {
    _gtm_push(
      "Chat Bubble",
      "VDP",
      document.location.pathname,
      "event chat bubble"
    );
  } catch (e) {
    console.log(e);
  }
}
// $(window).scroll(function (e) {
//   if ($(this).scrollTop() > 0) {
//     $("#topbtn").show();
//   } else {
//     $("#topbtn").hide();
//   }
//   if (
//     $(window).scrollTop() + $(window).height() >
//     $(document).height() - $(".footerblk").height()
//   ) {
//     $("#toTop").addClass("liftTopBtn");
//   } else {
//     $("#toTop").removeClass("liftTopBtn");
//   }
// });
function toggleShareIcon() {
  var slideMenuElement = document.getElementsByClassName(
    "socialIcon widgetBox1"
  );
  if (!slideMenuElement) {
    return;
  }
  slideMenuElement[0].style.display === "none"
    ? (slideMenuElement[0].style.display = "block")
    : (slideMenuElement[0].style.display = "none");
}
$(function () {
  $(".v4_cars_thumbs .carousel").jCarouselLite({
    //visible: 5,
    //circular: false,
    btnNext: ".v4_cars_thumbs .next",
    btnPrev: ".v4_cars_thumbs .prev",
  });
});
function v_change_tab(no) {
  var name = "";
  clearActive("v_tab_btn_");
  name = document.getElementById("v_tab_btn_" + no).className;
  document.getElementById("v_tab_btn_" + no).className = name += " active";
  clearActive("v_tab_pan_");
  name = document.getElementById("v_tab_pan_" + no).className;
  document.getElementById("v_tab_pan_" + no).className = name += " active";
}
function clearActive(id) {
  for (var i = 1; i <= 8; i++) {
    var name = document.getElementById(id + i).className;
    document.getElementById(id + i).className = name.replace("active", "");
  }
}
config_feature = { city_band: true, contact_seller: true, similar_cars: true };
var config_version_path = "vehicle-description-layouts/v56";
var smstimer = 0;
var smstimer_pdf = 0;
function getDocHeight(doc) {
  doc = doc || document;
  // stackoverflow.com/questions/1145850/
  var body = doc.body,
    html = doc.documentElement;
  var height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  return height;
}
function setIframeHeight(id) {
  var ifrm = document.getElementById(id);
  var doc = ifrm.contentDocument
    ? ifrm.contentDocument
    : ifrm.contentWindow.document;
  ifrm.style.visibility = "hidden";
  ifrm.style.height = "10px"; // reset to minimal height ...
  // IE opt. for bing/msn needs a bit added or scrollbar appears
  ifrm.style.height = getDocHeight(doc) + 4 + "px";
  ifrm.style.visibility = "visible";
}
function closepopupblock(ele) {
  // $('.popup-getInstLoan').hide();
  // document.getElementById('getInstLoan-frame').src= '';
  // add_body_scroll();
  if (finance_popup_type == 0) {
    $(".popup-getInstLoan").hide();
    $("#getInstLoan-frame").attr("src", "");
    _gtm_push(
      "Loan approval| Cartrade Desktop",
      "close popup|Proceed",
      $("#figtmlabel").val(),
      "event Proceed"
    );
    document.getElementById("getInstLoan-framediv").innerHTML = "";
    add_body_scroll();
  } else {
    window.location.href = "/buy-used-cars";
  }
}
function hide_gin_loader() {
  $("#silifilm").hide();
  $("#loading").hide();
}
function getInstLoanWrap(id, vuurl) {
  try {
    $("#silifilm").show();
    $("#loading").show();
  } catch (e) { }
  var _gilaLink = "";
  var vurl = vuurl;
  _gilaLink = "/" + "used-car-finance" + "/" + id;
  vfinal =
    '<iframe src="' +
    vurl +
    _gilaLink +
    '" width="100%" height="100%" id="getInstLoan-frame"></iframe>';
  document.getElementById("getInstLoan-framediv").innerHTML = vfinal;
  // document.getElementById('getInstLoan-frame').src=_gilaLink;
  $("#figtmlabel").val($("#financegtmclose_" + id).val());
  setTimeout(function () {
    $(".popup-getInstLoan").show();
  }, 200);
  pl_popup_close("close");
  _otp_from_enabled = false;
  remove_body_scroll();
}
function remove_body_scroll() {
  $("body").addClass("remove-scroll");
}

function add_body_scroll() {
  $("body").removeClass("remove-scroll");
}
function closeiframefilm() {
  document.getElementById("silifilm").style.display = "none";
  document.getElementById("iframefilm").style.display = "none";
  document.getElementById("iframefilm1").style.display = "none";
  document.getElementById("iframefilm2").style.display = "none";
  document.getElementById("iframefilm3").style.display = "none";
  add_body_scroll();
}
function getRightPrice(profileId) {
  var vurl = "/buy-used-cars/api/right/price/?profileId=" + profileId;
  var inc =
    '<iframe id="iframefilm3" data-testing-id="iframefilm3" frameborder="0" name="cbox1359703986453" src="' +
    vurl +
    '" scrolling="no" class="cboxIframe"></iframe>';
  document.getElementById("silifilm").style.display = "block";
  document.getElementById("iframefilm2").innerHTML = inc;
  document.getElementById("iframefilm").style.display = "block";
  document.getElementById("iframefilm1").style.display = "block";
  document.getElementById("iframefilm2").style.display = "block";
  document.getElementById("iframefilm3").style.display = "block";
  $("#iframefilm3").css("width", "1104px");
  document.getElementById("iframefilm").style.height = "auto";
  document.getElementById("iframefilm1").style.height = "auto";
  document.getElementById("iframefilm1").style.width = "1104px";
  document.getElementById("iframefilm2").style.height = "485px";
  remove_body_scroll();
}
function getGallery(profileId, imagePosition) {
  var position = "";
  if (imagePosition) {
    position = "&imagePosition=" + imagePosition;
  }
  var url = "/buy-used-cars/api/gallery/?profileId=" + profileId + position;
  var inc =
    '<iframe id="galleryiframe3" data-testing-id="galleryiframe3" frameborder="0" name="cbox1359703986453" src="' +
    url +
    '" scrolling="no" class="cboxIframe"></iframe>';
  document.getElementById("silifilm").style.display = "block";
  document.getElementById("galleryiframe2").innerHTML = inc;
  document.getElementById("galleryiframe").style.display = "block";
  document.getElementById("galleryiframe1").style.display = "block";
  document.getElementById("galleryiframe1").style.width = "auto";
  document.getElementById("galleryiframe2").style.display = "block";
  document.getElementById("galleryiframe3").style.display = "block";
  $("#galleryiframe3").css("height", "618px");
  $("#galleryiframe3").css("width", "1024px");
  document.getElementById("galleryiframe2").style.height = "618px";
  $("#galleryiframe3").focus();
  remove_body_scroll();
}
function closegalleryiframe() {
  document.getElementById("silifilm").style.display = "none";
  document.getElementById("galleryiframe").style.display = "none";
  document.getElementById("galleryiframe1").style.display = "none";
  document.getElementById("galleryiframe2").style.display = "none";
  document.getElementById("galleryiframe3").style.display = "none";
  document.getElementById("galleryiframe2").innerHTML = "Loading...";
  add_body_scroll();
}

function frozen_top_nav() {
  if (/IE/i.test(navigator.userAgent)) {
    var he = Number(document.documentElement.scrollTop);
  } else {
    var he = Number(window.pageYOffset);
  }
  if (he > 90) {
    document.getElementById("ct_menunew").className = "ct_hdr_red onfloating";
  } else {
    try {
      if (he < 110) {
        document.getElementById("ct_menunew").className = "ct_hdr_red";
      }
    } catch (e) { }
  }
}

$(window).scroll(frozen_top_nav);
var isDisplayedRecentlyViewed = false;
$(document).ready(function () {
  var profileid = document.getElementById("recentlyviewedcars_profileid").innerHTML;
  if (typeof recentlyViewedCars !== "undefined") {
    recentlyViewedCars.addProfileIdToLocalStorage(profileid);
  }
  $(".onfloating");
  $("#toTop").css("display", "none");
  $(document).scroll(function() {
    checkOffset();
  });
  $("#toTop").click(function () {
    /*event.preventDefault();*/
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      "slow"
    );
  });
});
function checkOffset() {
  if($('#toTop').offset().top + $('#toTop').height() >= $('.footerblk').offset().top - 25) {
    $('#toTop').css('position', 'absolute');
  }
  if($(document).scrollTop() + window.innerHeight < $('.footerblk').offset().top) {
    $('#toTop').css('position', 'fixed'); // restore when you scroll up
  }
}
$(window).on('scroll', function () {
  var scrollPosition = $(this).scrollTop();
  if (scrollPosition + $(window).height() > $(".breadcrumb").offset().top && !isDisplayedRecentlyViewed) {
    if (typeof recentlyViewedCars !== "undefined") {
      var profileid = document.getElementById("recentlyviewedcars_profileid").innerHTML;
      recentlyViewedCars.callRecentlyViewedCarsApi(profileid,"desktopDetailsPage");
    }
    isDisplayedRecentlyViewed = true;
  }
});
$(document).ready(
  $(".v_details>div").sticky({
    topSpacing: $("#ct_menunew").height() + 10, // Space between element and top of the viewport
    zIndex: 3, // z-index
    stopper: ".footerblk",
    stickyClass: false, // Class applied to element when it's stuck
  })
);
