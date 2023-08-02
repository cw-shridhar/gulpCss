var items = []
var openPhotoSwipe = function() {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    var images = document.getElementById("combindedString").value;
    var imageTitleText = document.getElementById("imageTitleText").value;
    if (images) {
        var imagesArr = images.split(',');
        for (var index = 0; index < imagesArr.length; index++) {
            items.push({
                src: imagesArr[index],
                imageTitleText: imageTitleText || "",
                w: 800,
                h: 600
            })
        }
    }

    // define options (if needed)
    var options = {
        // history & focus options are disabled on CodePen        
        history: false,
        focus: false,

        showAnimationDuration: 0,
        hideAnimationDuration: 0

    };

    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
};

openPhotoSwipe();

function photoSwiperCallback() {
    addcanvas();
    analytics.trackAction("CWInteractive", "UsedCarDetails", "VDP_Image_next_Click", "");
}

function addcanvas() {

    var txt = '<ul>';
    var cls = '';
    for (i = 0; i < items.length; i++) {
        cls = '';
        if (_currentItemIndex == i) { cls = 'active'; }
        txt += '<li class="dot ' + cls + '" data-layer="' + (parseInt(i)) + '"></li>';
    }
    txt += '</ul><div class="clear"></div>';
    //alert(txt);
    $('#dots').html(txt);
    //alert(_currentItemIndex);
}

function closeBigImage() {
    window.location.href = window.location.pathname;
}