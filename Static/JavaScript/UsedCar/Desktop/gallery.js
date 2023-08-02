var imagesarr = $("#imageList").val().split(',');
function next_img() {
    var currentIndx = parseInt($("#currentIndex").val());
    if (currentIndx < imagesarr.length) {
        currentIndx = currentIndx + 1;
        document.getElementById("imgdiv").src = imagesarr[currentIndx - 1];
    }
    else {
        currentIndx = 1;
        document.getElementById("imgdiv").src = imagesarr[currentIndx - 1];
    }
    document.getElementById("imgdiv").setAttribute("data-testing-id", "image-carousel-" + currentIndx);
    imageNumber(currentIndx);
}
function prev_img() {
    var currentIndx = parseInt($("#currentIndex").val());
    if (currentIndx > 1) {
        currentIndx = currentIndx - 1;
        document.getElementById("imgdiv").src = imagesarr[currentIndx - 1];
    }
    else {
        currentIndx = Number(imagesarr.length);
        document.getElementById("imgdiv").src = imagesarr[currentIndx - 1];
    }
    document.getElementById("imgdiv").setAttribute("data-testing-id", "image-carousel-"+currentIndx);
    imageNumber(currentIndx);
}
function imageNumber(currentIndx) {
    var current = document.getElementById("currentIndex");
    current.value = currentIndx;
    document.getElementById("img_num").innerHTML = "image " + eval(currentIndx) + " of " + imagesarr.length;
}
function changeimg(fullimg, index) {
    document.getElementById("imgdiv").src = fullimg;
    // document.getElementById("imgdiv").src = "https://"+config_images_domain+"/img/800x600/lis/"+img+'?v='+config_images_version;
    document.getElementById("img_num").innerHTML = "image " + index + " of " + imagesarr.length;
    var current = document.getElementById("currentIndex");
    current.value = index;
}
