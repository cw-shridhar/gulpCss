function cpreset(vall) {
	document.getElementById('make' + vall).value = '';
	document.getElementById('model' + vall).options.length = 1;
	document.getElementById('variant' + vall).options.length = 1;
	return true;
}

function getModel(idx, makeId) {
	if ("" != makeId) {
		// var o = {
		// 	action: "getMileageModels_new",
		// 	vtype: "car",
		// 	make: t,
		// 	id: e,
		// 	callback: "setModels"
		// };
        // // ajax_submit_request(o, "/compare-cars")
        $("#slctmodel" + idx).empty();
        GetMMVData.getModels(idx, makeId);
        setModels([], idx);
	} else
		cpreset(idx)
}

function setModels(vals, id) {
	var options = "";
	// for (i in vals) {
	// 	var setop = vals[i];
	// 	options += "<div class=\"option\" onblur='setoptionmodel('" + setop + "'," + id + ")' onclick=\"setoptionmodel('" + setop + "'," + id + ")\" data-option='" + id + "'>" + vals[i] + "</div>";
	// }
	$('#selmodel' + id).attr("class", "form-control selectDDCust selmodel");
	$("#slctmodel" + id).addClass("mdl_ht");
	// $("#slctmodel" + id).html(options);
}

function getVariant(idx, modelId) {
	if ("" != modelId) {
		// var o = {
		// 	action: "getMileageVariantsWithId_new",
		// 	vtype: "car",
		// 	make: document.compareform["make" + tf].value,
		// 	model: document.compareform["model" + tf].value,
		// 	id: tf,
		// 	callback: "setVariants"
		// };
        // ajax_submit_request(o, "/compare-cars")
        $("#slctvarnt" + idx).empty();
        GetMMVData.getVersions(idx, modelId)
        setVariants([], idx)
	} else
		cpreset(idx)
}

function setVariants(vals, id) {
	// var options = "";
	// for (i in vals) {
	// 	var setop = vals[i];
	// 	options += "<div class=\"option\" onblur='setoptionvarnt('" + setop + "'," + id + "," + i + ")' onclick=\"setoptionvarnt('" + setop + "'," + id + "," + i + ")\" data-option='" + id + "'>" + vals[i] + "</div>";
	// }
	$('#selvarnt' + id).attr("class", "form-control selectDDCust selvarnt");
	$("#slctvarnt" + id).addClass("var_ht");
	// $("#slctvarnt" + id).html(options);
}

function comparenow() {
	var vid1 = document.compareform.variant1.value;
	var vid2 = document.compareform.variant2.value;
	var vid3 = document.compareform.variant3.value;
	if ("" != vid1 || "" != vid2 || "" != vid3) {
		if (vid1 == vid2 || vid2 == vid3 || vid1 == vid3) {
			if ((vid1 == "" && vid2 == "") || (vid2 == "" && vid3 == "") || (vid1 == "" && vid3 == "")) {
				if (vid1 == "") {
					$("#cars1").css("border", "1px solid #d02326");
					$('#err_msg').html("Please select two cars for comparison");
					$('#err_msg').show();
				}
				if (vid2 == "") {
					$("#cars2").css("border", "1px solid #d02326");
					$('#err_msg').html("Please select two cars for comparison");
					$('#err_msg').show();
				}
			} else {
				$("#cars1, #cars2").css("border", "1px solid #d02326");
				$('#err_msg').html("Two selected cars are same.Please select another car.");
				$('#err_msg').show();
			}
		} else {
			$("#cars1,#cars2").css("border", "none");
			$("#cars1,#cars2").addClass('aftrsel');
			$(".error_message").text("");
			$(".error_message").hide();
			
            var makeMask1 = $("#make1").attr("data-mask");
            var modelMask1 = $("#model1").attr("data-mask");
            var variantId1 = $("#variant1").attr("data-value");
            var makeMask2 = $("#make2").attr("data-mask");
            var modelMask2 = $("#model2").attr("data-mask");
            var variantId2 = $("#variant2").attr("data-value");
            var makeMask3 = $("#make3").attr("data-mask");
            var modelMask3 = $("#model3").attr("data-mask");
            var variantId3 = $("#variant3").attr("data-value");

            var url = location.href + makeMask1 + "-" + modelMask1 + "-vs-" + makeMask2 + "-" + modelMask2;
            if(makeMask3 != "" && modelMask3 != "") {
                url += "-vs-" + makeMask3 + "-" + modelMask3;
            }

            url += "?c1=" + variantId1 + "&c2=" + variantId2;
            if(variantId3 != "") {
                url += "&c3=" + variantId3;
            }

            location.href = url;

		}
	} else {
		if (vid1 == "") {
			$("#cars1").css("border", "1px solid #d02326");
			$("#cars1").removeClass('aftrsel');
			$('#err_msg').html("Please select two cars for comparison");
			$('#err_msg').show();
		}
		if (vid2 == "") {
			$("#cars2").css("border", "1px solid #d02326");
			$("#cars2").removeClass('aftrsel');
			$('#err_msg').html("Please select two cars for comparison");
			$('#err_msg').show();
		}
	}
}

function compareurl(e) {
	if (e == "error") {
		alert('Invalid Comparison');
	} else {
		top.location.href = e;
	}
}

function showAdFrame() {
	document.getElementById("addcarframe").style.display = "block"
}

function ratemem1(e, t, o) {
	var n = e + "#" + t,
		a = parseInt(document.getElementById("hadhasvoted" + n).value);
	if (0 == a) {
		document.getElementById(t + "rata").innerHTML = "<img src='/images/loadloadsavrat.gif' />", window.XMLHttpRequest ? xmlhttp = new XMLHttpRequest : xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		var m = "/saveratingmakemodel.php",
			c = "savevote=1&make=" + e + "&model=" + t + "&rating=" + o;
		xmlhttp.open("POST", m, !0), xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), xmlhttp.setRequestHeader("Content-length", c.length), xmlhttp.setRequestHeader("Connection", "close"), xmlhttp.onreadystatechange = function() {
			if (4 == xmlhttp.readyState && 200 == xmlhttp.status) {
				var e = xmlhttp.responseText.split(":::"),
					o = e[1];
				e[2];
				e = e[0].replace(" ", ","), document.getElementById("hadhasvoted" + n).value = "1", document.getElementById(t + "rata").value = parseInt(o), document.getElementById(t + "starrating").src = "/images/newstar" + parseInt(o) + ".png", document.getElementById(t + "starrating").alt = parseInt(o) + " star rating"
			}
		}, xmlhttp.send(c)
	} else
		document.getElementById("leadboxnew").style.display = "none", document.getElementById("afterratebox").style.display = "block"
}

function overmout_r1(e) {
	var t = parseInt(document.getElementById(e + "rata").value);
	document.getElementById(e + "starrating").src = "/images/newstar" + t + ".png", document.getElementById(e + "starrating").alt = parseInt(t) + " star rating"
}

function overm_r1(e, t) {
	parseInt(t) > 5 && (t = 5);
	var o = e + "starrating";
	document.getElementById(o).src = "/images/newstar" + t + ".png", document.getElementById(o).alt = parseInt(t) + " star rating"
}

function usersreview(e, t) {
	var o = e + " " + t + ". You can help other users by writing a detailed review of your experience with the " + e + " " + t + ".";
	document.getElementById("bodytext").innerHTML = o, document.getElementById("mak").value = e, document.getElementById("mod").value = t, document.getElementById("afrmak").value = e, document.getElementById("afrmod").value = t;
	var n = "/new-cars?action=newcarscookie&callback=createcookienewcars&make=" + e + "&model=" + t;
	try {
		document.getElementById("compifr").src = n
	} catch (a) {
		document.getElementById("compifr").src = n
	}
}

function createcookienewcars(e, t, o) {
	if ("yes" == e) {
		document.getElementById("leadboxnew").style.display = "none";
		var n = o + "hasvoted";
		document.getElementById(n).value = "1"
	}
	"no" == e && (document.getElementById("leadboxnew").style.display = "block")
}

function closeleadbox() {
	document.getElementById("leadboxnew").style.display = "none", document.getElementById("afterratebox").style.display = "none"
}

function redirectform() {
	var e = document.getElementById("mak").value,
		t = document.getElementById("mod").value,
		o = "/reviews/postnewreview?make=" + e + "&model=" + t;
	window.open(o, "_blank"), document.getElementById("leadboxnew").style.display = "none"
}

function redirectform1() {
	var e = document.getElementById("afrmak").value,
		t = document.getElementById("afrmod").value,
		o = "/reviews/postnewreview?make=" + e + "&model=" + t;
	window.open(o, "_blank"), document.getElementById("afterratebox").style.display = "none"
}

function certifiedkeeda() {
	document.getElementById("selectcityfilm").style.display = "block", document.getElementById("silifilm").style.display = "block"
}

function dontshowcitychooser() {
	document.getElementById("selectcityfilm").style.display = "none", document.getElementById("silifilm").style.display = "none"
}

function ssdf() {
	document.getElementById("showsellerdetailform").style.display = "block"
}

function hidesubbtn() {
	document.getElementById("showsellerdetailform").style.display = "none"
}

function result_data(e) {
	alert(e), document.getElementById("showsellerdetailform").style.display = "none"
}

function refreshImage() {
	securecode_refreshImg()
}

function tabsclick(e, t, o, n, a, m) {
	var c = document.getElementById(n);
	c.className.indexOf("active") >= 0 || (c.className = c.className + "active");
	var r = document.getElementById(a);
	r.className = r.className.replace("active", "");
	var d = document.getElementById(m);
	d.className = d.className.replace("active", "");
	var i = document.getElementById(e);
	i.className.indexOf("otherclass") >= 0 || (i.className = i.className + " otherclass");
	var l = document.getElementById(t);
	l.className = l.className.replace("otherclass", "");
	var s = document.getElementById(o);
	s.className = s.className.replace("otherclass", ""), document.getElementById(e).style.display = "block", document.getElementById(t).style.display = "none", document.getElementById(o).style.display = "none"
}

function addtocomparelist3(e, t, o) {
	var n = new Date;
	document.getElementById("carCompareTopbar").style.display = "block";
	var a = Number(document.getElementById("carCompareTopbar").style.height.replace("px", ""));
	85 > a && (a = Number(a + 2), document.getElementById("carCompareTopbar").style.height = a + "px", setTimeout("ShowCompareBar()", 5));
	var m = document.getElementById("car1").value,
		c = document.getElementById("car2").value,
		r = document.getElementById("car3").value;
	if (m == e || c == e || r == e) {
		if (m == e && o === !1) {
			n.setTime(n.getDate() - 1);
			var d = n.toGMTString();
			document.cookie = "compcar1=; expires=" + d + "; path=/; domain=." + cookieDomain, document.cookie = "compcar1img=; expires=" + d + "; path=/; domain=." + cookieDomain, document.getElementById("car1").value = "", document.getElementById("car1img").value = "", document.getElementById("compPopDownTit1").innerHTML = "Click to add <br> a car", document.getElementById("compPopdownImg1").src = "/images2/add2com.jpg", document.getElementById("compareBasketCount").innerHTML = parseInt(document.getElementById("compareBasketCount").innerHTML) - 1, document.getElementById("crossbutton1").innerHTML = ""
		} else if (c == e && o === !1) {
			n.setTime(n.getDate() - 1);
			var d = n.toGMTString();
			document.cookie = "compcar2=; expires=" + d + "; path=/; domain=." + cookieDomain, document.cookie = "compcar2img=; expires=" + d + "; path=/; domain=." + cookieDomain, document.getElementById("car2").value = "", document.getElementById("car2img").value = "", document.getElementById("compPopDownTit2").innerHTML = "Click to add<br /> a car", document.getElementById("compPopdownImg2").src = "/images2/add2com.jpg", document.getElementById("compareBasketCount").innerHTML = parseInt(document.getElementById("compareBasketCount").innerHTML) - 1, document.getElementById("crossbutton2").innerHTML = ""
		} else if (r == e && o === !1) {
			n.setTime(n.getDate() - 1);
			var d = n.toGMTString();
			document.cookie = "compcar3=; expires=" + d + "; path=/; domain=." + cookieDomain, document.cookie = "compcar3img=; expires=" + d + "; path=/; domain=." + cookieDomain, document.getElementById("car3").value = "", document.getElementById("car3img").value = "", document.getElementById("compPopDownTit3").innerHTML = "Click to add<br /> a car", document.getElementById("compPopdownImg3").src = "/images2/add2com.jpg", document.getElementById("compareBasketCount").innerHTML = parseInt(document.getElementById("compareBasketCount").innerHTML) - 1, document.getElementById("crossbutton3").innerHTML = ""
		}
	} else if ("" == m) {
		var i = e.split("+"),
			l = i[0];
		l = l.replace(/-/gi, " ");
		var s = i[1];
		s = s.replace(/-/gi, " ");
		var u = i[2];
		u = u.replace(/-/gi, " "), car12variant = u.replace(/@/gi, "+"), document.getElementById("car1").value = e, "" != t && (document.getElementById("car1img").value = t), "" == t && (document.getElementById("car1img").value = document.getElementById("carImageHolder" + s).src), document.getElementById("compPopdownImg1").src = t, document.getElementById("compPopDownTit1").innerHTML = l + " " + s + " " + car12variant, n.setTime(n.getTime() + 864e5);
		var d = n.toGMTString();
		document.cookie = "compcar1=" + e + "; expires=" + d + "; path=/; domain=." + cookieDomain, document.cookie = "compcar1img=" + t + "; expires=" + d + "; path=/; domain=." + cookieDomain, document.getElementById("compareBasketCount").innerHTML = parseInt(document.getElementById("compareBasketCount").innerHTML) + 1, document.getElementById("crossbutton1").innerHTML = "x";
		var p = "y",
			g = "/?action=comparebarlog2&cmp1=" + e + "&addedcar=" + p;
		try {
			document.getElementById("compifr").src = g
		} catch (y) {
			document.getElementById("compifr").src = g
		}
	} else if ("" == c) {
		var v = e.split("+"),
			I = v[0];
		I = I.replace(/-/gi, " ");
		var B = v[1];
		B = B.replace(/-/gi, " ");
		var f = v[2];
		car22variant = f.replace(/@/gi, "+"), car23variant = car22variant.replace(/-/gi, " "), document.getElementById("car2").value = e, "" != t && (document.getElementById("car1img").value = t), "" == t && (document.getElementById("car2img").value = document.getElementById("carImageHolder" + B).src), document.getElementById("compPopdownImg2").src = t, document.getElementById("compPopDownTit2").innerHTML = I + " " + B + " " + car23variant, n.setTime(n.getTime() + 864e5);
		var d = n.toGMTString();
		document.cookie = "compcar2=" + e + "; expires=" + d + "; path=/; domain=." + cookieDomain, document.cookie = "compcar2img=" + t + "; expires=" + d + "; path=/; domain=." + cookieDomain, document.getElementById("compareBasketCount").innerHTML = parseInt(document.getElementById("compareBasketCount").innerHTML) + 1, document.getElementById("crossbutton2").innerHTML = "x";
		var p = "y",
			g = "/?action=comparebarlog2&cmp2=" + e + "&addedcar=" + p;
		try {
			document.getElementById("compifr").src = g
		} catch (y) {
			document.getElementById("compifr").src = g
		}
	} else if ("" == r) {
		var E = e.split("+"),
			p = "y",
			k = E[0];
		k = k.replace(/-/gi, " ");
		var h = E[1];
		h = h.replace(/-/gi, " ");
		var b = E[2];
		b = b.replace(/-/gi, " "), car31variant = b.replace(/@/gi, "+"), document.getElementById("car3").value = e, "" != t && (document.getElementById("car1img").value = t), "" == t && (document.getElementById("car3img").value = document.getElementById("carImageHolder" + h).src), document.getElementById("compPopdownImg3").src = t, document.getElementById("compPopDownTit3").innerHTML = k + " " + h + " " + car31variant, n.setTime(n.getTime() + 864e5);
		var d = n.toGMTString();
		document.cookie = "compcar3=" + e + "; expires=" + d + "; path=/; domain=." + cookieDomain, document.cookie = "compcar3img=" + t + "; expires=" + d + "; path=/; domain=." + cookieDomain, document.getElementById("compareBasketCount").innerHTML = parseInt(document.getElementById("compareBasketCount").innerHTML) + 1, document.getElementById("crossbutton3").innerHTML = "x";
		var p = "y",
			g = "/?action=comparebarlog2&cmp3=" + e + "&addedcar=" + p;
		try {
			document.getElementById("compifr").src = g
		} catch (y) {
			document.getElementById("compifr").src = g
		}
	} else {
		alert("The compare basket is full. To change your comparison, please remove one or more of selected cars & proceed. ");
		var w = "gogo-" + e;
		document.getElementById(w).checked = !1
	}
}

function delfromcomparelist(e, t) {
	var o = new Date;
	o.setTime(o.getDate() - 1);
	var n = o.toGMTString();
	if (t)
		var a = "gogo-" + t;
	else
		var m = getCookie("compcar" + e),
			a = "gogo-" + m;
	document.getElementById(a) && (document.getElementById(a).checked = !1), document.cookie = "compcar" + e + "=; expires=" + n + "; path=/; domain=." + cookieDomain, document.cookie = "compcar" + e + "img=; expires=" + n + "; path=/; domain=." + cookieDomain, document.getElementById("car" + e).value = "", document.getElementById("car" + e + "img").value = "", document.getElementById("compPopDownTit" + e).innerHTML = "Click to add<br /> a car", document.getElementById("compPopdownImg" + e).src = "/images2/add2com.jpg", document.getElementById("compareBasketCount").innerHTML = parseInt(document.getElementById("compareBasketCount").innerHTML) - 1, document.getElementById("crossbutton" + e).innerHTML = ""
}

function getCookie(e) {
	var t, o, n, a = document.cookie.split(";");
	for (t = 0; t < a.length; t++)
		if (o = a[t].substr(0, a[t].indexOf("=")), n = a[t].substr(a[t].indexOf("=") + 1), o = o.replace(/^\s+|\s+$/g, ""), o == e)
			return unescape(n)
}

function showsplfeature() {
	document.getElementById("answerfilm").style.display = "block", document.getElementById("answerfilmuser").style.display = "block"
}

function hidesplfeature() {
	document.getElementById("answerfilm").style.display = "none", document.getElementById("answerfilmuser").style.display = "none"
}
var tf;
! function(e, t, o) {
	var n, a = e.getElementsByTagName(t)[0];
	e.getElementById(o) || (n = e.createElement(t), n.id = o, n.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=463383743692510", a.parentNode.insertBefore(n, a))
}(document, "script", "facebook-jssdk");

function refreshImage_newsletter() {
	securecode_refreshImg();
}

function show_newsletter() {
	document.getElementById("showsellerdetailform").style.display = "block";
}

function hidesubbtn_newsletter() {
	document.getElementById("showsellerdetailform").style.display = "none";
}

function adclose() {
	document.getElementById("advertiseblk").style.display = "none";
	document.getElementById("advertisebg").style.display = "none";
}
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};
try {
	if (document.getElementById("ct_menunew") != undefined) {
		window.onscroll = function() {
			frozen_top_nav();
		}

		function frozen_top_nav() {
			if (/IE/i.test(navigator.userAgent)) {
				var he = Number(document.documentElement.scrollTop);
			} else {
				var he = Number(window.pageYOffset);
			}
			if (he > 60) {
				document.getElementById("ct_menunew").className = "ct_hdr_white onfloating";
			} else {
				if (he < 110) {
					document.getElementById("ct_menunew").className = "ct_hdr_white";
				}
			}
		}
	}
} catch (e) {}
var interval_lazyfunctions = setInterval("initiate_lazyfunctions()", 1000);

function initiate_lazyfunctions() {
	try {
		if (document.readyState == 'interactive' || document.readyState == 'complete') {
			clearInterval(interval_lazyfunctions);
			$(document).click(function(e) {
				if ($(e.target).is('.form-control, .form-control *')) {} else {
					$(".slctmake").each(function(index) {
						if ($(this).css("display") == "block") {
							$(this).hide();
						}
					});
					$(".slctmodel").each(function(index) {
						if ($(this).css("display") == "block") {
							$(".slctmodel").hide();
						}
					});
					$(".slctvarnt").each(function(index) {
						if ($(this).css("display") == "block") {
							$(this).hide();
						}
					});
				}
			});
			$("#toTop").css("display", "none");
			try {
				$("#Fin").css("display", "none");
			} catch (e) {}
			$(window).scroll(function() {
				if (($(document).height() - ($(window).scrollTop() + $(window).height())) < 300) {
					document.getElementById("toTop").className = "scroller";
					try {
						document.getElementById("Fin").className = "scrollerstop_2";
					} catch (e) {}
				} else if ($(window).scrollTop() > 0) {
					$("#toTop").fadeIn("slow");
					document.getElementById("toTop").className = "scroller";
					try {
						$("#Fin").fadeIn("slow");
						document.getElementById("Fin").className = "scroller";
					} catch (e) {}
				} else {
					$("#toTop").fadeOut("slow");
					try {
						$("#Fin").fadeOut("slow");
						document.getElementById("Fin").className = "scroller";
					} catch (e) {}
				}
			});
			$("#toTop").click(function() {
				$("html, body").animate({
					scrollTop: 0
				}, "slow");
			});
		}
	} catch (e) {}
}

function showhideHighlights(A) {
	if (A == "SeeMore") {
		document.getElementById("highlightheight").style.height = "auto";
		document.getElementById("showHideHighlightDiv").innerHTML = '<a href="javascript:void(0)" onclick=\'showhideHighlights("Collapse");\' title=\'collapse\' class="Textright DispBlock Black7a UnderlineLink Hand">Collapse<span class="SpriteMainNew SeeMoreAorrow MarginL5"></span></a>';
	} else {
		if (A == "Collapse") {
			document.getElementById("highlightheight").style.height = "53px";
			document.getElementById("showHideHighlightDiv").innerHTML = "<span class=\"Textright DispBlock\"><span></span><a href='javascript:void(0)' onclick='showhideHighlights(\"SeeMore\");' title='see more' class='Black7a UnderlineLink Hand'>See More<span class=\"SpriteMainNew SeeMoreAorrow MarginL5\"></span></a></span>";
		}
	}
}

function showmakes_list(id) {
	$('#slctmake' + id).slideToggle(260);
	$('#slctmodel' + id).hide(260);
	setTimeout(function() {
		$('.slctmake').hide(260);
	}, 45000);
}
$('.selmodel').on('click', function() {
	var id = $(this).closest('.selectDDCust').find('[data-id]').val();
	if ($('#make' + id).val() != '') {
		$(this).find('.dropDownWrap').slideToggle(260);
		$('#slctvarnt' + id).hide(260);
	}
});
$('.selvarnt').on('click', function() {
	var id = $(this).closest('.selectDDCust').find('[data-id]').val();
	if ($('#model' + id).val() != '') {
		$(this).find('.dropDownWrap').slideToggle(260);
	}
});

function loadselmodels() {
	if ($("#make").val() != "") {
		$('.slctmodel').slideToggle(260);
	}
}

function setoptionmake(val, idx) {
    // set make
	$('#slctmakeval' + idx).text(val.textContent);
	$("#make" + idx).val(val.textContent);
    $("#make" + idx).attr("data-mask", val.dataset.mask);
    $("#make" + idx).attr("data-value", val.dataset.value);

	getModel(idx, val.dataset.value);

    // reset model and variant
	$('#slctmodeval' + idx).text("Select Model");
	$("#model" + idx).val('');
    $("#model" + idx).attr("data-mask", "");
    $("#model" + idx).attr("data-value", "");
	$("#slctvarval" + idx).text("Select Variant");
	$("#variant" + idx).val('');
    $("#variant" + idx).attr("data-mask", "");
    $("#variant" + idx).attr("data-value", "");
}

function setoptionmodel(val, idx) {
    // set model
	var model = val.textContent;
	$('#slctmodeval' + idx).text(model);
	$("#model" + idx).val(model);
    $("#model" + idx).attr("data-value", val.dataset.value);
    $("#model" + idx).attr("data-mask", val.dataset.mask);
    
	getVariant(idx, val.dataset.value);

    // reset variant
	$('#slctvarval' + idx).text("Select Variant");
	$("#variant" + idx).val('');
    $("#variant" + idx).attr("data-mask", "");
    $("#variant" + idx).attr("data-value", "");
}

function setoptionvarnt(val, id) {
    // set variant
	var variant = val.textContent;
    var valid = val.dataset.value;
	$('#slctvarval' + id).text(variant);
	$("#variant" + id).val(valid);
    $("#variant" + id).attr("data-mask", val.dataset.mask);
    $("#variant" + id).attr("data-value", val.dataset.value);

	var vid1 = document.compareform.variant1.value;
	var vid2 = document.compareform.variant2.value;
	var vid3 = document.compareform.variant3.value;
	if (id == '1') {
		try {
			$("#image_car2").attr("src", `${window.ImgdCDNHostURL}/0x0/ct/static/icons/svg/add-car-active.svg`);
		} catch (e) {}
		$("#selmake2").attr("onclick", "showmakes_list(2)");
		$('#selmake2').attr("class", "form-control selectDDCust selmake");
		$("#cars1").css("border", "none");
		$("#cars1").addClass('aftrsel');
		$(".error_message").text("");
		$(".error_message").hide();
        GetMMVData.getMakes(2);
	} else {
		try {
			$("#image_car3").attr("src", `${window.ImgdCDNHostURL}/0x0/ct/static/icons/svg/add-car-active.svg`);
		} catch (e) {}
		$("#selmake3").attr("onclick", "showmakes_list(3)");
		$('#selmake3').attr("class", "form-control selectDDCust selmake");
		$("#cars2").addClass('aftrsel');
		$(".error_message").text("");
		$(".error_message").hide();
        GetMMVData.getMakes(3);
	}
	if (vid1 == vid2) {
		$("#cars1, #cars2").removeClass('aftrsel');
		$("#cars1, #cars2").css("border", "1px solid #d02326");
		$(".error_message").text("Please select two Different cars for comparison");
		$(".error_message").show();
	}
	if (vid1 != "" && vid2 != "" && vid1 != vid2) {
		$("#cars1, #cars2").addClass('aftrsel');
		$(".error_message").text("");
		$(".error_message").hide();
	}
}

var GetMMVData = {
    getMakeUrl: function () {
        return "/api/v2/makes/?shouldSortByPopularity=true";
    },
    getModelUrl: function (makeId) {
        return "/api/models/?type=new&makeId=" + makeId;
    },
    getVersionUrl: function (modelId) {
        return (
            "/api/v3/versions/" +
            "?modelId=" +
            modelId +
            "&type=new&itemIds=29,26&application=1"
        );
    },
    getMakes: function (idx) {
        var url = GetMMVData.getMakeUrl();
        return new Promise(function (resolve, reject) {
            $.ajax({
            type: "GET",
            url: url,
			headers: { 'ServerDomain': 'CarWale' },
            success: function (response) {
                var popular_label = "<div class='optionLabel'>Most Popular</div>";
                var other_label = "<div class='optionLabel'>Others</div>";
                var dropDownId = "#slctmake" + idx;
				$(popular_label).appendTo(dropDownId);
                $.each(response, function (key, item) {
                if (key == 10) {
                    $(other_label).appendTo(dropDownId);
                }
                var div_data =
                    "<div class='option' data-value=" +
                    response[key].makeId +
                    " data-mask=" +
                    response[key].maskingName +
                    " onclick=setoptionmake(this," + idx + ")>" + 
                    response[key].makeName +
                    "</div>";
                $(div_data).appendTo(dropDownId);
                });
            },
            error: function (error) {
                reject(error);
            },
            });
        });
    },
    getModels: function (idx, makeId) {
        var url = GetMMVData.getModelUrl(makeId);
        return new Promise(function (resolve, reject) {
            $.ajax({
            type: "GET",
            url: url,
			headers: { 'ServerDomain': 'CarWale' },
            success: function (response) {
                var dropDownId = "#slctmodel" + idx;
                $.each(response, function (key, item) {
                    var div_data =
                        "<div class='option' data-value=" +
                        response[key].ModelId +
                        " data-mask=" +
                        response[key].MaskingName +
                        " onclick=setoptionmodel(this," + idx + ")>" + 
                        response[key].ModelName +
                        "</div>";
                    $(div_data).appendTo(dropDownId);
                });
            },
            error: function (error) {
                reject(error);
            },
            });
        });
    },
    getVersions: function (idx, modelId) {
        var url = GetMMVData.getVersionUrl(modelId);
        return new Promise(function (resolve, reject) {
            $.ajax({
            type: "get",
            url: url,
            contentType: "application/json",
			headers: { 'ServerDomain': 'CarWale' },
            success: function (response) {
                var dropDownId = "#slctvarnt" + idx;
                var allVariants = response.variants;
                $.each(allVariants, function (key, item) {
                var div_data =
                    "<div class='option' data-value=" +
                    item.versionId +
                    " data-mask=" +
                    item.versionMaskingName +
                    " onclick=setoptionvarnt(this," + idx + ")>" + 
                    item.versionName +
                    "</div>";
                $(div_data).appendTo(dropDownId);
                });
            },
            error: function (error) {
                reject(error);
            },
            });
        });
    },
};

GetMMVData.getMakes(1);