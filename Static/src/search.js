/* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
* Licensed under the MIT License (LICENSE.txt).
*
* Version 2.1.2
*/
(function (a) { a.fn.bgiframe = (a.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function (d) { d = a.extend({ top: "auto", left: "auto", width: "auto", height: "auto", opacity: true, src: "javascript:false;" }, d); var c = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="' + d.src + '"style="display:block;position:absolute;z-index:-1;' + (d.opacity !== false ? "filter:Alpha(Opacity='0');" : "") + "top:" + (d.top == "auto" ? "expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+'px')" : b(d.top)) + ";left:" + (d.left == "auto" ? "expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+'px')" : b(d.left)) + ";width:" + (d.width == "auto" ? "expression(this.parentNode.offsetWidth+'px')" : b(d.width)) + ";height:" + (d.height == "auto" ? "expression(this.parentNode.offsetHeight+'px')" : b(d.height)) + ';"/>'; return this.each(function () { if (a(this).children("iframe.bgiframe").length === 0) { this.insertBefore(document.createElement(c), this.firstChild) } }) } : function () { return this }); a.fn.bgIframe = a.fn.bgiframe; function b(c) { return c && c.constructor === Number ? c + "px" : c } })(jQuery);


/* Prepand grey box layout at page load */

$.insertAd = function () {
    var ad1 = "<tr class=\"version-row\"><td colspan=\"5\" style=\"padding:0;\" ><div  class=\"adunit sponsored content-inner-block\" data-adunit=\"NewCarSearch_643x65\" data-dimensions=\"643x65\"></div></td></tr>";
    if ($(".model-row").length < 5)
        $(".model-row").parent().append(ad1)
    else
        $(".model-row").eq(4).before(ad1);

    $.dfp({
        dfpID: '1017752',
        enableSingleRequest: false
    });
};
function processingWait(applyIframe) {
    try {
        if (applyIframe) { // Apply iframe on demand				
            $("#gb-overlay").bgiframe();
        }
        var cwHdrOffset = $(".header-fixed").offset();
        $("#gb-overlay").show().css({ height: Math.max(document.body.scrollHeight, $(document).height()) + "px", left: cwHdrOffset.left + 'px', top: cwHdrOffset.top + 'px' });
        $("#processing").show();
        Common.utils.lockPopup();
        GB_position();
    } catch (e) {
        //alert(e);
    }
}
function nissanMicraContainer(nissanContainer) {
    var label = nissanContainer.attr('data-label'),
                action = nissanContainer.attr('data-action');
    dataLayer.push({
        event: 'CWNonInteractive',
        cat: 'New Car Search Result Page',
        act: action,
        lab: label
});
}

/* hide GB loading */
function processingDone() {
    $("#processing,#gb-overlay").hide();
    Common.utils.unlockPopup();
    if ($.adInserted == undefined || $.adInserted == false) { $.insertAd(); $.adInserted = true; }
    loadPreSelectedCars();
    if ($(".nissan-container")[0])
        nissanMicraContainer($(".nissan-container"));
}

/* Position GB */
function GB_position() {
    var de = document.documentElement;
    var w = self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    var gbTop = getTopPos();
    gbTop += 200;
    $("#processing").css({ left: ((w - 150) / 2) + "px", top: gbTop });
}

function getTopPos() {
    return getTopResults(window.pageYOffset ? window.pageYOffset : 0, document.documentElement ? document.documentElement.scrollTop : 0, document.body ? document.body.scrollTop : 0);
}

function getTopResults(n_win, n_docel, n_body) {
    var n_result = n_win ? n_win : 0;
    if (n_docel && (!n_result || (n_result > n_docel)))
        n_result = n_docel;
    return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

/*
* jQuery history plugin
*
* Copyright (c) 2006 Taku Sano (Mikage Sawatari)
* Licensed under the MIT License:
*   http://www.opensource.org/licenses/mit-license.php
*
* Modified by Lincoln Cooper to add Safari support and only call the callback once during initialization
* for msie when no initial hash supplied.
* API rewrite by Lauris Buk?is-Haberkorns
*/

(function ($) {

    function History() {
        this._curHash = '';
        this._callback = function (hash) { };
    };

    $.extend(History.prototype, {
        init: function (callback, customHash) {
			this._callback = callback;
			this._curHash = customHash ? "" : location.hash;

            if ($.browser.msie) {
                // To stop the callback firing twice during initilization if no hash present
                if (this._curHash == '') {
                    this._curHash = '#';
                }

                // add hidden iframe for IE
                $("body").prepend('<iframe id="jQuery_history" style="display: none;"></iframe>');
                var iframe = $("#jQuery_history")[0].contentWindow.document;
                iframe.open();
                iframe.close();
                iframe.location.hash = this._curHash;
            }
            else if ($.browser.safari) {
                // etablish back/forward stacks
                this._historyBackStack = [];
                this._historyBackStack.length = history.length;
                this._historyForwardStack = [];
                this._isFirst = true;
                this._dontCheck = false;
            }
            this._callback(this._curHash.replace(/^#/, ''));
            //setInterval(this._check, 100);
        },

        add: function (hash) {
            // This makes the looping function do something
            this._historyBackStack.push(hash);

            this._historyForwardStack.length = 0; // clear forwardStack (true click occured)
            this._isFirst = true;
        },

        _check: function () {
            if ($.browser.msie) {
                // On IE, check for location.hash of iframe
                var ihistory = $("#jQuery_history")[0];
                var iframe = ihistory.contentDocument || ihistory.contentWindow.document;
                var current_hash = iframe.location.hash;
                if (current_hash != $.history._curHash) {

                    location.hash = current_hash;
                    $.history._curHash = current_hash;
                    $.history._callback(current_hash.replace(/^#/, ''));

                }
            } else if ($.browser.safari) {
                if (!$.history._dontCheck) {
                    var historyDelta = history.length - $.history._historyBackStack.length;

                    if (historyDelta) { // back or forward button has been pushed
                        $.history._isFirst = false;
                        if (historyDelta < 0) { // back button has been pushed
                            // move items to forward stack
                            for (var i = 0; i < Math.abs(historyDelta) ; i++) $.history._historyForwardStack.unshift($.history._historyBackStack.pop());
                        } else { // forward button has been pushed
                            // move items to back stack
                            for (var i = 0; i < historyDelta; i++) $.history._historyBackStack.push($.history._historyForwardStack.shift());
                        }
                        var cachedHash = $.history._historyBackStack[$.history._historyBackStack.length - 1];
                        if (cachedHash != undefined) {
                            $.history._curHash = location.hash;
                            $.history._callback(cachedHash);
                        }
                    } else if ($.history._historyBackStack[$.history._historyBackStack.length - 1] == undefined && !$.history._isFirst) {
                        // back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
                        // document.URL doesn't change in Safari
                        if (document.URL.indexOf('#') >= 0) {
                            $.history._callback(document.URL.split('#')[1]);
                        } else {
                            $.history._callback('');
                        }
                        $.history._isFirst = true;
                    }
                }
            } else {
                // otherwise, check for location.hash
                var current_hash = location.hash;
                if (current_hash != $.history._curHash) {
                    $.history._curHash = current_hash;
                    $.history._callback(current_hash.replace(/^#/, ''));
                }
            }
        },

        load: function (hash) {
            var newhash;

            if ($.browser.safari) {
                newhash = hash;
            } else {
                newhash = '#' + hash;
                location.hash = newhash;
            }
            this._curHash = newhash;

            if ($.browser.msie) {
                var ihistory = $("#jQuery_history")[0]; // TODO: need contentDocument?
                var iframe = ihistory.contentWindow.document;
                iframe.open();
                iframe.close();
                iframe.location.hash = newhash;
                this._callback(hash);
            }
            else if ($.browser.safari) {
                this._dontCheck = true;
                // Manually keep track of the history values for Safari
                this.add(hash);
                // Wait a while before allowing checking so that Safari has time to update the "history" object
                // correctly (otherwise the check loop would detect a false change in hash).
                var fn = function () { $.history._dontCheck = false; };
                window.setTimeout(fn, 200);
                this._callback(hash);
                // N.B. "location.hash=" must be the last line of code for Safari as execution stops afterwards.
                //      By explicitly using the "location.hash" command (instead of using a variable set to "location.hash") the
                //      URL in the browser and the "history" object are both updated correctly.
                location.hash = newhash;
            }
            else {
                this._callback(hash);
            }
        }
    });

	$(document).ready(function () {
		var clearHash = location.hash.indexOf('bd=') > -1;
		if (clearHash) {
			location.hash = "";
		}
        $.history = new History(); // singleton instance
        NewCarSearch.emiSlider();
		bindEventsOnPageLoad();
		$.history.init(function (hash) {
            hashParams = hash;
            if (validateHash(hashParams)) {
                processingWait(true);
                setCheckedStatus(hashParams);
                filterResults();
                if (hashParams) $("#app_filt").show().removeClass("hide");
            } else $("#searchRes").html($("#alert_msg2").html());
		}, clearHash);

        $(".hd3").click(function () {
            exp_icon = $(this).find("span.filter");

            if (exp_icon.hasClass('expnd')) {
                exp_icon.removeClass("expnd").addClass("collapse");
                exp_icon.attr("title", 'collapse');
            } else {
                exp_icon.removeClass("collapse").addClass("expnd");
                exp_icon.attr("title", 'expand');
            }
            $(this).next().toggleClass("hide show");
        });
    });

})(jQuery);

function setCheckedStatus(hash) {
    var paramCollection = hash.split("&");

    for (var i = 0; i < paramCollection.length; i++) {
        var param = paramCollection[i].split('=');
        if (param.length == 2) {
            var obj_ul_params = $("#" + param[0]);
            obj_ul_params.removeClass("hide").addClass("show"); // show the respective ul of selected param
            obj_ul_params.parent().removeClass("hide").addClass("show");
            $("#" + param[0] + "_exp_col").attr("title", "collapse").removeClass("expnd").addClass("collapse"); // manage expend/collapse icons
            var values = param[1].split(',');
            for (var j = 0; j < values.length; j++) {
                // manage checkbox state
                var objFilter = obj_ul_params.find("a[name=" + values[j] + "]");
                objFilter.removeClass("unchecked").addClass("checked");

                if (param[0] == "emi") {
                    $("#Emi").removeClass('hide').addClass('show');
                    appliedFiltersSlider('#sel_emi', 'emi', values[j]);
                    NewCarSearch.maintainSliderOnLoad("emi");
                    //maitainSliderOnLoad("emi");
                } else appliedFilters(objFilter, values[j]);
            }
        }
    }
}

function appliedFilters(paramObj, paramVal) {
    var ulCriteria = $(paramObj).closest('ul').attr('id');
    var appCriteriaObj = $('#sel_' + ulCriteria); // parent <ul>		
    var append_param_id = ulCriteria + "_" + paramVal;

    if ($(paramObj).hasClass('checked')) {
        var child_length = appCriteriaObj.children().length;
        var clause_name = child_length == 1 ? " " + $(paramObj).html() : $(paramObj).html(),
		append_param = '<span id="' + ulCriteria + "_" + paramVal + '" class="text-grey2 sel_parama">' + clause_name + '<span>X</span></span>';
        if (appCriteriaObj.find("#" + append_param_id).length == 0)
            appCriteriaObj.show().removeClass("hide").append(append_param);
    } else {
        $('#' + append_param_id).remove();
    }
}

function appliedFiltersSlider(paramobj, param, paramValue) {
    $(paramobj).find("span").not('span:first').remove();
    var minmaxValue = paramValue.split("-");
    $(paramobj).show().append('<span id="' + param + "_" + paramValue + '" class="text-grey2 sel_parama">' + NewCarSearch.formateSliderPrice(minmaxValue[0]) + "-" + NewCarSearch.formateSliderPrice(minmaxValue[1]) + '<span>X</span></span>');
}

function bindEventsOnPageLoad() {

    onTableRowHover();
    onRemFilterHover();
    onRemFilterClick();
    onChkBoxClick();
    onBodyStyleClick();
    onCompareCarsClick();
    //onModelRowClick(); Not Required-Akansha
}

/************************************************************************************/
// Page Load Event Bindings
/************************************************************************************/

function onTableRowHover() {
    $(".dt_body").live('mouseenter', function () {
        var _objRow = $(this);
        _objRow.addClass('dt_body_hover');
    }).live('mouseleave', function () {
        var _objRow = $(this);
        _objRow.removeClass('dt_body_hover');
    });
}

function onRemFilterHover() {
    $(".sel_parama").live('mouseover', function () {
        $(this).removeClass("sel_parama").addClass("sel_parama_hover");
    });
}

function getNewHash(name, value, action) {
    var newHash = "";
    if (typeof action == "undefined") action = "add";
    var pairs = typeof hashParams != "undefined" ? hashParams.split("&") : [];
    if (pairs.length == 1 && pairs[0] == "") pairs = [];
    var namefound = false, valuefound = false;
    var foundvalues = [];
    for (var i = 0; i < pairs.length; i++) {
        var pname = pairs[i].split("=");
        var pvalues = pname[1].split(",");
        pname = pname[0];
        if (pname != "pn") {
            if (pname != name) newHash += pname + "=" + pvalues.join(",") + "&";
            else {
                namefound = true;
                foundvalues = pvalues;
                if ($.inArray(value, foundvalues) >= 0) valuefound = true;
            }
        }
    }
    if (action == "add") {
        if (namefound && !valuefound) { foundvalues[foundvalues.length] = value; newHash += name + "=" + foundvalues.join(",") + "&"; }
        else if (!namefound) newHash += name + "=" + value + "&";
    } else if (action == "remove") {
        if (valuefound) {
            var newValues = [];
            for (var j = 0; j < foundvalues.length; j++) {
                if (foundvalues[j] != value) newValues[newValues.length] = foundvalues[j];
            }
            if (newValues.length > 0) newHash += name + "=" + newValues.join(",") + "&";
        }
    }
    if (newHash.length > 0) newHash = newHash.substr(0, newHash.length - 1);
    return newHash;
}

function onRemFilterClick() {
    $(".sel_parama_hover").live('mouseout', function () {
        $(this).removeClass("sel_parama_hover").addClass("sel_parama");
        $("span.remove_sel").remove();
    }).live('click', function () {

        var rem_filt = $(this).attr("id");
        var crit = rem_filt.split('_')[0];
        var critVal = rem_filt.split('_')[1];

        $("#" + crit).find("li a" + "[name=" + critVal + "]").toggleClass("checked unchecked");
        clearAppliedCriteria();
        if ($("#" + crit).find("li a" + "[name=" + critVal + "]").hasClass("checked")) {
            hashParams = getNewHash(crit, critVal, "add");
        } else {
            hashParams = getNewHash(crit, critVal, "remove");
        }

        if (crit == "emi")
            NewCarSearch.resetSlider();

        if (hashParams.indexOf("pn") > -1) {
            var tmpParams = hashParams.substring(0, hashParams.indexOf("pn"));
            if (tmpParams != "") { // show applied filters
                $("#app_filt").show();
            }
        } else {
            if (hashParams != "") $("#app_filt").show();
            else $("#app_filt").hide();
        }
        addHashParam();
    });
}

function onChkBoxClick() {

    // $("#parms a.filter").live('click', function (e) {
    $("#parms a.filter").click(function (e) {
        e.preventDefault();

        $(this).toggleClass("checked unchecked");

        var param = this.href.split('?')[1];
        //if (param.indexOf('model') >= 0)
        //    multiple_select = true;
        //else
            clearAppliedCriteria();

        if ($(this).hasClass("checked")) {
            hashParams = getNewHash(param.split("=")[0], param.split("=")[1],"add");//hashParams == "" ? param : "&" + param;
        } else {
            param = param.split('=');
            hashParams = getNewHash(param[0], param[1], "remove");
        }
        if (hashParams.indexOf("pn") > -1) {
            var tmpParams = hashParams.substring(0, hashParams.indexOf("pn"));
            if (tmpParams != "") { // show applied filters
                $("#app_filt").show();
            } else {
                $("#dvDefaultMsg").show();
            }
        } else {
            if (hashParams != "") $("#app_filt").show();
            else $("#app_filt").hide();
            //else {
            //    $("#dvDefaultMsg").show();
            //}
        }
        addHashParam();
    });
}

function onBodyStyleClick() {

    $("div.body-style").click(function () {
        var body_style = $(this).next();
        var paramName = body_style.attr("href").split('?')[1];

        body_style.toggleClass("checked unchecked");

        if (body_style.hasClass("checked")) {
            paramName = paramName.split('=');
            hashParams = getNewHash(paramName[0], paramName[1],"add");
        } else {
            paramName = paramName.split('=');
            hashParams = getNewHash(paramName[0], paramName[1], "remove");
        }
        clearAppliedCriteria();
        addHashParam();
    });
}
//Compare Car functionality starts-Akansha
var queryString = "";
var i = 0;

function loadPreSelectedCars() {

    var id = "";
    var comapreCarList = $('#compareCarList').find("li");

    if (comapreCarList.size() > 0) {
        comapreCarList.each(function () {
            var checkedElement = $("#check_" + $(this).attr('id'));
            checkedElement.prop('checked', true);
            if (checkedElement.parent().parent().hasClass('version-row')) {
                checkedElement.parent().parent().show();
                var name = checkedElement.parent().parent().attr('name');
                $(".cls_" + name).show();
                $(".cls_" + name + ":last").addClass("version-bot");
                $("#mod_" + name).addClass("model-row-bot");
                $("#" + name).find("#modShow").removeClass('show').addClass('hide');
                $("#" + name).find("#modHide").removeClass('hide').addClass('show');
                $("#" + name).find("#modShowIcon").removeClass("right-arrow").addClass("down-arrow2");
                //$(".cls_" + modelId).hide();
                //$(".cls_" + modelId + ":last").removeClass("version-bot");
                //$("#mod_" + modelId).removeClass("model-row-bot");
            }
        });

        var compareButton = $("tr.dgNavDivTop .compare-button");
        if (comapreCarList.size() >= 2)
            compareButton.show();
        else
            compareButton.hide();
    }
}
function onCompareCarsClick() {

    $("input[name=button].compare-button").live('click', function (e) {
        e.preventDefault();
        if ($('#compareCarList li').size() < 2) {
            alert("Please select minimum two cars to compare");
        }
        else {
            var k = 1;
            var data = new Array;
            var versionQs = "";
            var lis = $('#compareCarList li');
            lis.each(function () {
                versionQs += "c" + k + "=" + $(this).attr("id") + (k == lis.length ? "" : "&");
                data.push({ id: Number($(this).attr("modelid")), text: $(this).attr("url") })
                k++;
            });
            location.href = "/compare-cars/" + Common.getCompareUrl(data) + "/?" + versionQs;
        }
    });
}

$("tr.version-row").find("input:checkbox").live('click', function (e) {

    var value = $(this).val();
    if ($(this).prop('checked')) {
        if (i < 4) {
            $('#lblCompare').show().parent().removeClass("hide").addClass("show");
            var tr = $(this).closest("tr");
            var block = '<li id="' + $(this).val() + '" class="redirect-lt" modelid=' + tr.attr("name") + ' url=' + $(this).attr("make-model") + '><span class="text-grey2 sel-cars">' + tr.find('.ver-pdd a').attr('title') + '<span class="close">X</span></span></li>';
            $('#compareCarList').append(block);
            i++;
        }
        else {
            $(this).prop('checked', false);
            alert("Please select maximum of four cars to compare");
        }
    }
    else {
        $('#compareCarList li').each(function () {
            if (value == $(this).attr('id')) {
                $(this).remove();
                i--;
                if (i < 1) {
                    $('#lblCompare').hide().parent().removeClass("show").addClass("hide");
                }
            }
        });
    }

    var compareButton = $("tr.dgNavDivTop .compare-button");
    if (i >= 2)
        compareButton.show();
    else
        compareButton.hide();
});

$('.close').live('click', function () {
    var id = $(this).parent().parent().attr('id');
    $('#' + id).remove();
    i--;
    if (i < 1) {
        $('#lblCompare').hide().parent().removeClass("show").addClass("hide");
    }
    $('.dtTable .version-row .chk-compare input').each(function () {
        if (id == $(this).attr('value')) {
            $(this).parent().find('input').prop('checked', false);
        }
    });

    var compareButton = $("tr.dgNavDivTop .compare-button");
    if (i >= 2)
        compareButton.show();
    else
        compareButton.hide();

});
//Compare Car functionality ends-Akansha

//Not Required-Akansha
//function onModelRowClick() {
//    $("tr.model-row").live('click', function () {
//        expandModel($("#" + $(this).attr("id").split("_")[1]));
//    });
//}

function onViewVersionsClick() {
    $("a.viewVersions").live('click', function (e) {
        e.stopPropagation();
        expandModel(this);
    });
}

function addHashParam() {    
    $.history.load(hashParams);
    Common.utils.firePageView(window.location.pathname + window.location.search);
}


function removeSelection() {
    $("a.checked").removeClass("checked").addClass("unchecked");
    clearAppliedCriteria();
    $.history.load("");
    $("#app_filt").hide();
    NewCarSearch.resetSlider();
}

function clearAppliedCriteria() {
    $("#app_filters li span:not(:first-child)").remove();
    $("#app_filters li").hide();
}

function filterResults() {
    $("#searchRes").load("/new/search/result/?" + hashParams, function () {
        $.adInserted = false;
        setTimeout('processingDone()', 500);
        openShowPriceInCityLink();
    });
}

$(".dgNavDivTop a,.sortLink").live('click', function () {
    $.adInserted = false;
    $('html,body').animate({ scrollTop: "200px" }, 0);
    clearAppliedCriteria();
    processingWait(true);
    var navi_lnk = this.href;
    var qs = navi_lnk.split("?")[1];    
    $.history.load(qs);
    Common.utils.firePageView(window.location.pathname + window.location.search);
    return false;
});

function validateHash(hash) {
    var isSuccess = true;
    var newHashUrl = "";
    
    if (hash != "") {
        var regString = new RegExp("^[a-z]*$");
        var regNumber = new RegExp("^[0-9]*(,[0-9]+)*$");
        var regRange = new RegExp("^[0-9]*(-)[0-9]*$");
        var hashArray = hash.split('&');
        var regEx = new RegExp("^(&?[a-z]*=[0-9]*([.][0-9]*)?)+$");
        for (var i = 0; i < hashArray.length; i++) {
            var itemName = $.trim(hashArray[i].split("=")[0].toLowerCase());
            var itemValue = hashArray[i].split("=")[1];

            if (regString.test(itemName)) {
                if (itemName == "emi") {
                    if (regRange.test(itemValue)) {
                        var num1 = $.trim(itemValue.split('-')[0].toLowerCase());
                        var num2 = $.trim(itemValue.split('-')[1].toLowerCase());
                        if ((num1 >= 0) && (num2 >= 0) && (num1 != null) && (num2 != null) && (parseInt(num1) <= parseInt(num2)))
                            newHashUrl += itemName + "=" + itemValue + "&";
                    }
                }
                else if (regNumber.test(itemValue)) {
                    newHashUrl += itemName + "=" + itemValue + "&";
                    isSuccess = true;
                }
            }
        }
        if (newHashUrl.charAt(newHashUrl.length - 1) == "&")
            hashParams = newHashUrl.substring(0, newHashUrl.length - 1);
        else
            hashParams = newHashUrl;
    }
    return isSuccess;
}//validateHash


//Binding click event only on click of View matching versions link - Akansha
$('#modShow, #modHide').live('click', function () {

    var modelId = $(this).parent().attr('id');

    if ($(this).next().hasClass('hide')) {
        $(this).removeClass("show").addClass("hide");
        $(this).next().removeClass('hide').addClass('show');
        $(this).prev('#modShowIcon').removeClass("right-arrow").addClass("down-arrow2");
        $(".cls_" + modelId).show();
        $(".cls_" + modelId + ":last").addClass("version-bot");
        $("#mod_" + modelId).addClass("model-row-bot");
    }
    else {
        $(this).removeClass('show').addClass('hide');
        $(this).prev('#modShow').removeClass('hide').addClass('show');
        $(this).prev().prev().removeClass("down-arrow2").addClass("right-arrow");
        $(".cls_" + modelId).hide();
        $(".cls_" + modelId + ":last").removeClass("version-bot");
        $("#mod_" + modelId).removeClass("model-row-bot");
    }

});

//function removeHashFromAddressBar() {
//    window.history.pushState({}, "", "/new/search/");
//}

var Advantage = {
    doc: $(document),
    registerEvents: function () {
        Advantage.doc.on("click", 'div[data-advantage-url]', function () {
            Advantage.configureCityPopup($(this));
        });
    },
    pageLoad: function () {
        if ($.cookie('_CustCityIdMaster') > 0) {
            Advantage.registerEvents.registerPopup();
        }
    },
    configureCityPopup: function (el) {
        $('#advantage-city-select').attr('data-advantage-url', el.data('advantage-url'));
        Common.advantage.popup.registerEvents();
        Common.advantage.popup.showCityPopup();
        Common.advantage.popup.getPopupCities(el.data("advantage-modelid"));
    }
};

var NewCarSearch = {
    rupee: '₹ ',
    emiRange: $("#emi-range"),
    emiSliderMin: 0,
    emiSliderMax: 60000,

    emiSlider: function () {
        var min = NewCarSearch.emiSliderMin;
        var max = NewCarSearch.emiSliderMax;

        NewCarSearch.emiRange.slider({
            range: true,
            min: min,
            max: max,
            step: 1000,
            values: [min, max],
            animate: '500',
            create: function () {
                $('#min').appendTo($('#emi-range > span').eq(0));
                $('#max').appendTo($('#emi-range > span').eq(1));
            },
            slide: function (event, ui) {
                $(ui.handle).find('span').attr("value", ui.value);
                if (ui.value == max) {
                    $(ui.handle).find('span').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice(ui.value));
                }
                else {
                    $(ui.handle).find('span').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice(ui.value));
                }
            },
            stop: function (event, ui) {
                var param_value = $.trim($("#min").attr("value")) + "-" + $.trim($("#max").attr("value"));;
                var regExp = new RegExp("(emi=)[0-9]*-[0-9]*");
                
                if (hashParams != "") {
                    if (regExp.test(hashParams))
                        hashParams = hashParams.replace(regExp, "emi=" + param_value); // "&emi=" + param_value;
                    else
                        hashParams += "&emi=" + param_value;
                }
                else
                    hashParams = "emi=" + param_value;

                hashParams=getNewHash("pn", "", "remove");

                addHashParam();
            }
        });

        // only initially needed
        $("#min").attr("value", $('#emi-range').slider('values', 0));
        $("#max").attr("value", $('#emi-range').slider('values', 1));

        $('#min').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice($('#emi-range').slider('values', 0))).position({
            at: 'left top',
            of: $('#emi-range > span').eq(0)
        });

        $('#max').html(NewCarSearch.rupee + (NewCarSearch.formateSliderPrice($('#emi-range').slider('values', 1)))).position({
            at: 'left top',
            of: $('#emi-range > span').eq(1)
        });
    },

    maintainSliderOnLoad: function (param) {
        if (hashParams.indexOf(param) > -1) {
            if (hashParams != null && hashParams.indexOf("emi") > -1) {
                $("#emi").removeClass("hide").addClass("show");
            }

            var hashParamArray = hashParams.split('&');
            if (hashParamArray.length > 0) {

                for (var i = 0; i < hashParamArray.length; i++) {
                    if (hashParamArray[i].indexOf(param) > -1) {

                        var range = hashParamArray[i].split("=");
                        var minmaxValue = range[1].split("-");
                        NewCarSearch.emiRange.slider("values", [minmaxValue[0], minmaxValue[1]]);

                        $("#min").attr("value", minmaxValue[0]);
                        $("#max").attr("value", minmaxValue[1]);

                        if (minmaxValue[0] == NewCarSearch.emiSliderMax)
                            $('#min').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice(minmaxValue[0]));
                        else
                            $('#min').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice(minmaxValue[0]));

                        if (minmaxValue[1] == NewCarSearch.emiSliderMax)
                            $('#max').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice(minmaxValue[1]));
                        else
                            $('#max').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice(minmaxValue[1]));
                    }
                }
            }
        }
    },

    resetSlider: function () {
        NewCarSearch.emiRange.slider("values", [NewCarSearch.emiSliderMin, NewCarSearch.emiSliderMax]);
        $("#min").attr("value", NewCarSearch.emiSliderMin);
        $("#max").attr("value", NewCarSearch.emiSliderMax);
        $('#min').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice(NewCarSearch.emiSliderMin));
        $('#max').html(NewCarSearch.rupee + NewCarSearch.formateSliderPrice(NewCarSearch.emiSliderMax));
    },

    formateSliderPrice: function (price) {
        var formattedPrice = price / 1000;
        if (price == NewCarSearch.emiSliderMax)
            formattedPrice += "K+";
        else if (price != 0)
            formattedPrice += "K";

        return formattedPrice;
    }
}
function openShowPriceInCityLink() {
    var div = $('.select-city-link');
    var location = new LocationSearch((div), {
        showCityPopup: true,
        isAreaOptional: true,
        callback: function (locationObj) {
            var versionMaskingName = location.selector().data('versionmaskingname');
            if (versionMaskingName !== undefined) {
                NewCar_Common.redirectToVersionPage(location);
            }
            else {
                NewCar_Common.redirectToModelPage(location.selector().data('makemaskingname'), location.selector().data('modelmaskingname'));
            }
        },
        isDirectCallback: true,
        validationFunction: function () {
            return PriceBreakUp.Quotation.getGlobalLocation();
        }
    })
}

$(document).ready(function () {
    $("body").prepend("<div id='gb-overlay' class='updating-results'></div><div id='processing' class='process'><img src='" + window.ImgdCDNHostURL + "/0x0/cw/design15/cw-loader.gif?v1=04032016' border='0' style='padding:17px 0 0 20px;'/></div>");
    Advantage.registerEvents();
    openShowPriceInCityLink();
});

$(document).on("mastercitychange", function (event, cityName, cityId) {
    location.reload();
});
