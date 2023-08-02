function deleteImg(photoId) {
    if (confirm("Are you sure want to delete this photo?")) {
        photoId = photoId.toString().trim();
        $.ajax({
            type: "DELETE",
            url:"/sell-used-car/api/stocks/images/"+photoId+"/",
            success: function (response,responseStatusText, responseObject) {
                if (responseObject.status === 200) {
                  $("#" + photoId).fadeOut(500, function() {
                    $(this).remove();
                  });
                  var currImgCnt = $("#divImageCount").text();
                  var newImgCnt =
                    currImgCnt != "0" ? parseInt(currImgCnt) - 1 : "0";
                  $("#divImageCount").text(newImgCnt);
                } else {
                  // unsuccessfull
                  alert("Unable to delete this file");
                }
            }
        });
    }
}

function makeMainImg(photoId) {
  photoId = parseInt(photoId);
  if (photoId > 0) {
    $.ajax({
      type: "POST",
      url: "/api/stocks/images/" + photoId + "/setmainimage/",
      headers: {
        ServerDomain: "CarWale",
      },
    });
  }
}

function clearTextArea(objTextArea) {
    $(objTextArea).html("");
}

function msgTextArea(objTextArea) {
    objJQ = $(objTextArea);
    if (objJQ.html() == "" || objJQ.html() == "Describe this image here")
        objJQ.html("Describe this image here");
}

function mDone() {
    processingWait(false);
    if (requestCount == 0)
        setTimeout('nextStep()', 1000);
}

function nextStep() {
    if (nextStepUrl != "") {
        window.location.href = nextStepUrl;
    } else {
        alert("You have added description to the images successfully.");
    }
}

function formatNumeric(num) {
    var formatted = "";
    var breakPoint = 3;
    var numStr = num.toString();

    for (var i = numStr.toString().length - 1; i >= 0; i--) {
        formatted = numStr.charAt(i) + formatted;

        if ((numStr.length - i) == breakPoint && numStr.length > breakPoint) {
            formatted = "," + formatted;
            breakPoint += 2;
        }
    }
    return formatted;
}