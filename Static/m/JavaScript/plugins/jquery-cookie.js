// *!
// * jQuery Cookie Plugin v1.3.1
// * https://github.com/carhartl/jquery-cookie
// * Copyright 2013 Klaus Hartl
// * Released under the MIT license
// */
(function (g, l, n) {
    function p(a) { return a } function q(a) { a = decodeURIComponent(a.replace(k, " ")); 0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")); return a } var k = /\+/g, d = g.cookie = function (a, c, b) {
        if (c !== n) {
            b = g.extend({}, d.c, b); null === c && (b.a = -1); if ("number" === typeof b.a) { var h = b.a, f = b.a = new Date; f.setDate(f.getDate() + h) } c = d.b ? JSON.stringify(c) : String(c); return l.cookie = [encodeURIComponent(a), "=", d.d ? c : encodeURIComponent(c), b.a ? "; expires=" + b.a.toUTCString() : "", b.path ? "; path=" +
            b.path : "", b.domain ? "; domain=" + b.domain : "", b.f ? "; secure" : ""].join("")
        } c = d.d ? p : q; b = l.cookie.split("; "); for (var h = a ? null : {}, f = 0, k = b.length; f < k; f++) { var e = b[f].split("="), m = c(e.shift()), e = c(e.join("=")); if (a && a === m) { h = d.b ? JSON.parse(e) : e; break } a || (h[m] = d.b ? JSON.parse(e) : e) } return h
    }; d.c = { domain: defaultCookieDomain }; g.e = function (a, c) { return null !== g.cookie(a) ? (g.cookie(a, null, c), !0) : !1 }
})(jQuery, document);