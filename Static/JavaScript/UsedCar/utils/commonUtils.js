function checkFncIsDefined(fncParameter) {
    if (typeof fncParameter !== 'undefined' && typeof fncParameter === "function") {
        return true;
    }
    return false;
}
function setLeadButtonText(){
    var cookies = formcookies();
    if (cookies['cookie_buyform_mobile']) {
        $(".contact-seller-btn").html("1-CLICK&nbsp;VIEW DETAILS");
    } else {
        $(".contact-seller-btn").html("CONTACT SELLER");
    }
}

function showToast(msg, id) {
    $('#'+id).removeClass('open');
    if (msg.length < 4) {
        return
    }
    $('#'+id).addClass('show');
    $('#'+id).removeClass('hide');
    document.getElementById(id).innerHTML = msg;
    setTimeout(function() {
        $('#'+id).removeClass('show');
        $('#'+id).addClass('hide');
        document.getElementById(id).innerHTML = '';
    }, 4000);
}

var checkPlatform = {
	IsAndroid: function() {
		return navigator.userAgent.match(/Android/i);
	},
	IsBlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	IsIOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	IsOpera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	IsWindows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	anyMobile: function() {
		return (checkPlatform.IsAndroid() || checkPlatform.IsBlackBerry() || checkPlatform.IsIOS() || checkPlatform.IsOpera() || checkPlatform.IsWindows());
	}
};
