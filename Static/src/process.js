// bgIframs version 2.1.1 
(function ($) { $.fn.bgIframe = $.fn.bgiframe = function (s) { if ($.browser.msie && /6.0/.test(navigator.userAgent)) { s = $.extend({ top: 'auto', left: 'auto', width: 'auto', height: 'auto', opacity: true, src: 'javascript:false;' }, s || {}); var prop = function (n) { return n && n.constructor == Number ? n + 'px' : n; }, html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="' + s.src + '"' + 'style="display:block;position:absolute;z-index:-1;' + (s.opacity !== false ? 'filter:Alpha(Opacity=\'0\');' : '') + 'top:' + (s.top == 'auto' ? 'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')' : prop(s.top)) + ';' + 'left:' + (s.left == 'auto' ? 'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')' : prop(s.left)) + ';' + 'width:' + (s.width == 'auto' ? 'expression(this.parentNode.offsetWidth+\'px\')' : prop(s.width)) + ';' + 'height:' + (s.height == 'auto' ? 'expression(this.parentNode.offsetHeight+\'px\')' : prop(s.height)) + ';' + '"/>'; return this.each(function () { if ($('> iframe.bgiframe', this).length == 0) this.insertBefore(document.createElement(html), this.firstChild); }); } return this; }; })(jQuery);

/* Prepand grey box layout at page load */
$(document).ready(function () {
    $("body").prepend("<div id='gb-overlay'></div><div id='processing' class='process'><img src='" + window.ImgdCDNHostURL + "/0x0/statics/loader.gif' border='0' style='padding:17px 0 0 20px;'/></div>");
});

function processingWait(applyIframe) {
    try {
        if (applyIframe) { // Apply iframe on demand				
            $("#gb-overlay").bgiframe();
        }
        var cwHdrOffset = $("body").offset();
        $("#gb-overlay").show().css({ height: $(document).height() + "px", opacity: "0.9", left: cwHdrOffset.left + 'px', top: cwHdrOffset.top + 'px' });
        $("#processing").show();
        GB_position();
    } catch (e) {
        alert(e);
    }
}

/* hide GB loading */
function processingDone() {
    $("#processing,#gb-overlay").hide();
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