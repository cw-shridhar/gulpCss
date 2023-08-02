function NewisName(txt, vmin, vmax) {
    var RegExp = /^[a-zA-Z\ \.]+$/
    if (RegExp.test(txt)) {
        if (txt.length >= vmin && txt.length <= vmax) { return true; } else { return false; }
    } else {
        return false;
    }
}

function NewisNum(txt, vmin, vmax) {
    var RegExp = /^(([9|8|7|6][0-9]+)+)$/
    if (RegExp.test(txt)) {
        if (txt.length >= vmin && txt.length <= vmax) { return true; } else { return false; }
    } else {
        return false;
    }
}

function isName(txt) {
    var RegExp = /^[a-zA-Z\ \.]+$/
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isValidURL(url) {
    var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
    if (RegExp.test(url)) { return true; } else { return false; }
}

function isValidEmail(email) {
    var RegExp = /^((([a-zA-Z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+(\.([a-zA-Z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+)*)@((((([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.))*([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.)[\w]{2,4}|(((([0-9]){1,3}\.){3}([0-9]){1,3}))|(\[((([0-9]){1,3}\.){3}([0-9]){1,3})\])))$/
    if (RegExp.test(email)) { return true; } else { return false; }
}

function isText(txt) {
    var RegExp = /^(([a-z]|[A-Z])+)$/
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isNum(txt) {
    var RegExp = /^(([0-9])+)$/
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isNumWithSpace(txt) {
    var RegExp = /^(([0-9]| )+)$/
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isTextWithSpace(txt) {
    var RegExp = /^(([a-z]|[A-Z]| )+)$/
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isTextNum(txt) {
    var RegExp = /^(([a-z]|[A-Z]|[0-9]|.)+)$/
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isPhone(txt) {
    var RegExp = /^([0-9\+\ \(\)]+)$/
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isTextNumWithSpace(txt) {
    var RegExp = /^(([a-z]|[A-Z]|[0-9]| )+)$/
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isAnything(txt) {
    for (ti = 0; ti < 120; ti++) { txt = txt.replace("\\", ""); }
    var RegExp = /^([\n\ra-zA-Z0-9\ \`\~\!\@\#\$\%\^\&\*\(\)\-\=\_\+\|\<\>\?\,\.\/\;\'\:\"\[\]\{\}\(\)]+)$/
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
    if (RegExp.test(txt)) { return true; } else { return false; }
}

function isLength(txt, len, ma, mi) {
    if (txt.length >= ma && txt.length <= mi) { return true; } else { return false; }
}

function replacespecialchars(vstr) {
    vstr = vstr.replace(/�/g, "\"");
    vstr = vstr.replace(/�/g, "\"");
    vstr = vstr.replace(/�/g, "'");
    vstr = vstr.replace(/�/g, "'");
    return vstr;
}
// object , type ( text, textspace num, textnum, email, url ), req ( y, n ), length, max , min 
function checkIt(obj, type, req, len, vmin, vmax) {
    if (obj.value == "" && req == 'y') {
        return false;
    } else {
        if (obj.value != "") {
            try {
                obj.value = replacespecialchars(obj.value);
            } catch (e) { alert(e); return false; }
            if (type == "name") {
                if (isName(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "text") {
                if (isText(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "textspace") {
                if (isTextWithSpace(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "num") {
                if (isNum(obj.value)) {
                    if (obj.value >= vmin && obj.value <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "textnum") {
                if (isTextNum(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "textnumspace") {
                if (isTextNumWithSpace(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "phone") {
                if (isPhone(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "email") {
                if (isValidEmail(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "url") {
                if (isValidURL(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
            if (type == "select") {
                if (obj.value == "" || obj.value == "no") {
                    return false;
                } else { return true; }
            }
            if (type == "anything") {
                if (isAnything(obj.value)) {
                    if (obj.value.length >= vmin && obj.value.length <= vmax) { return true; } else { return false; }
                } else { return false; }
            }
        } else {
            return true;
        }
    }
}