function next_img(nn, dimag, makeYear, makeName, rootName, cityName) {
    if (dimag === "") {
        retrun;
    }
    var imgList = dimag.split(",");
    var image = $("#imgdiv" + nn);
    if (imgList.length < 2) {
        return false;
    }

    var currentIndx = Number(image.attr("currIndexShown"));
    if (isNaN(currentIndx)) {
        return;
    }
    if (currentIndx < imgList.length - 1) {
        currentIndx += 1;
    } else {
        currentIndx = 0;
    }
    var altTitleText = getListingImgSeoText(makeYear, makeName, rootName, cityName);
    image.fadeOut(500, function () {
        image.find("img").attr("src", "");
        image.find("img").attr("src", imgList[currentIndx]);
        image.find("img").attr("alt", altTitleText);
        image.find("img").attr("title", altTitleText);
        image.fadeIn(500);
    });
    image.attr("currIndexShown", currentIndx);
}

function prev_img(nn, dimag, makeYear, makeName, rootName, cityName) {
    if (dimag === "") {
        retrun;
    }
    var imgList = dimag.split(",");
    var image = $("#imgdiv" + nn);
    if (imgList.length < 2) {
        return false;
    }

    var currentIndx = Number(image.attr("currIndexShown"));
    if (isNaN(currentIndx)) {
        return;
    }
    if (currentIndx > 0) {
        currentIndx -= 1;
    } else {
        currentIndx = imgList.length - 1;
    }
    var altTitleText = getListingImgSeoText(makeYear, makeName, rootName, cityName);
    image.fadeOut(500, function () {
        image.find("img").attr("src", "");
        image.find("img").attr("src", imgList[currentIndx]);
        image.find("img").attr("alt", altTitleText);
        image.find("img").attr("title", altTitleText);
        image.fadeIn(500);
    });

    image.attr("currIndexShown", currentIndx);
}

function showArrows(lid) {
    try {
        $("#slidearow_" + lid).show();
    } catch (e) { }
}

function hideArrows(lid) {
    try {
        $("#slidearow_" + lid).hide();
    } catch (e) { }
}

function remove_body_scroll() {
    $('body').addClass('remove-scroll');
}

function add_body_scroll() {
    $('body').removeClass('remove-scroll');
}
function getRightPrice(profileId) {
    var vurl = "/buy-used-cars/api/right/price/?profileId=" + profileId;
    var inc = '<iframe id="iframefilm3" data-testing-id="iframefilm3" frameborder="0" name="cbox1359703986453" src="' + vurl + '" scrolling="no" class="cboxIframe"></iframe>';
    document.getElementById("silifilm").style.display = "block";
    document.getElementById("iframefilm2").innerHTML = inc;
    document.getElementById("iframefilm").style.display = 'block';
    document.getElementById("iframefilm1").style.display = 'block';
    document.getElementById("iframefilm2").style.display = 'block';
    document.getElementById("iframefilm3").style.display = 'block';
    $('#iframefilm3').css("width", "1104px");
    document.getElementById("iframefilm").style.height = "auto";
    document.getElementById("iframefilm1").style.height = "auto";
    document.getElementById("iframefilm1").style.width = "1104px";
    document.getElementById("iframefilm2").style.height = "485px";
    remove_body_scroll();
}
function closeiframefilm() {
    document.getElementById("silifilm").style.display = "none";
    document.getElementById("iframefilm").style.display = "none";
    document.getElementById('iframefilm1').style.display = 'none';
    document.getElementById("iframefilm2").style.display = "none";
    document.getElementById('iframefilm3').style.display = 'none';
    add_body_scroll();
}
function getGallery(profileId) {
    var url = "/buy-used-cars/api/gallery/?profileId=" + profileId;
    var inc = '<iframe id="galleryiframe3" data-testing-id="galleryiframe3" frameborder="0" name="cbox1359703986453" src="' + url + '" scrolling="no" class="cboxIframe"></iframe>';
    document.getElementById("silifilm").style.display = "block";
    document.getElementById("galleryiframe2").innerHTML = inc;
    document.getElementById("galleryiframe").style.display = 'block';
    document.getElementById("galleryiframe1").style.display = 'block';
    document.getElementById("galleryiframe1").style.width = 'auto';
    document.getElementById("galleryiframe2").style.display = 'block';
    document.getElementById("galleryiframe3").style.display = 'block';
    $('#galleryiframe3').css("height", "618px");
    $('#galleryiframe3').css("width", "1024px");
    document.getElementById("galleryiframe2").style.height = "618px";
    $("#galleryiframe3").focus();
    remove_body_scroll();
}
function closegalleryiframe() {
    document.getElementById("silifilm").style.display = "none";
    document.getElementById('galleryiframe').style.display = 'none';
    document.getElementById('galleryiframe1').style.display = 'none';
    document.getElementById('galleryiframe2').style.display = 'none';
    document.getElementById('galleryiframe3').style.display = 'none';
    document.getElementById('galleryiframe2').innerHTML = 'Loading...';
    add_body_scroll();
}

function getListingImgSeoText(makeYear, makeName, rootName, cityName) {
    return "Used " + makeYear + " " + makeName + " " + rootName + " in " + cityName;
}
