/* Prepand grey box layout at page load */
$(document).ready(function () {
    var grayContent = "<div id='gb-overlay'></div>";
    grayContent += "<div id='gb-window'>";
    grayContent += "<div id='gb-head'><span id='gb-title'></span><a id='gb-close' class='gb-close'></a><div class='clear'></div></div>";
    grayContent += "<img id='loading' src='" + window.ImgdCDNHostURL + "/0x0/statics/loader.gif'/><div id='gb-content'></div>";
    grayContent += "</div>";

    $("body").prepend(grayContent);
});
var GB_DONE = false;
var GB_HEIGHT = 400;
var GB_WIDTH = 400;

function GB_show(caption, url, height, width, applyIframe, GB_Html) {
    try {
        GB_HEIGHT = height || 400;
        GB_WIDTH = width || 400;

        // show loading gif image if taking time in loading
        $("#loading").show();
        $("#gb-content").hide();

        if (!GB_DONE) {// append only once			
            $("#gb-close").click(GB_hide);
            $("#gb-overlay").click(GB_hide);

            //if (applyIframe) { // Apply iframe on demand				
            //    $("#gb-overlay").bgiframe();
            //}

            GB_DONE = true;
        }
        
        $("#gb-title").html(caption);
        $("#gb-overlay").show().css({ height: Math.max(document.body.scrollHeight,$(document).height())+"px", opacity: "0.9", width: "100%" });
        $("#gb-window").show();
        GB_position();


        if (url != "#" && GB_Html == "") { // url available to load external page.
            $("#gb-content").load(url, loadingDone);
        } else { // 
            $("#gb-content").html(GB_Html);
            loadingDone();
        }

    } catch (e) {
        alert(e);
    }
}

/*Hide GreyBox on Esc key press*/
$(document).keydown(function (e) {
    if (e.keyCode == "27") {
        GB_hide();
    }
});

/* As finished gray box loading */
function loadingDone() {
    $("#loading").hide();
    $("#gb-content").fadeIn(300);
    Common.utils.lockPopup();
}

/* hide GB loading */
function GB_hide() {
    $("#gb-window,#gb-overlay").hide();
    Common.utils.unlockPopup();
}

/* Position GB */
function GB_position() {
    var de = document.documentElement;
    var w = self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;

    var gbTop=0;

    if (GB_HEIGHT >= 450) {
        gbTop += 30;
    } else {
        gbTop += 100;
    }

    $("#gb-window").css({ width: GB_WIDTH + "px", height: 'auto', left: ((w - GB_WIDTH) / 2) + "px", top: gbTop +"px" });
    $("#gb-content").css({ height: GB_HEIGHT + "px" });
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