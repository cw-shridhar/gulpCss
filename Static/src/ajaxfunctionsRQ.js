var pendingList = new Array();
var refreshTime = 2000;
$(document).ready(function () {
    GetPendingList();
    setInterval(UpdatePendingImages, refreshTime);
});
/*
for binding images 
*/
function CheckImageStatus(imageList) {
    $.ajax({
        type: "GET",
        url: "/sell-used-car/api/stocks/images/uploadstatus/" + imageList+"/",
        dataType : "json",
        success: function (obj_response) {
            
            for (var items in obj_response) {
                imageList = imageList.replace(obj_response[items].Id + ',', '');
                var imgUrl = obj_response[items].HostUrl + "110x61" + obj_response[items].OriginalImgPath; 
                
                if (pendingList.indexOf(obj_response[items].Id) > -1)
                    pendingList.splice(pendingList.indexOf(obj_response[items].Id), 1);

                $('#dtlstPhotosPending_' + obj_response[items].Id).removeClass('show').addClass('hide');
                $('#dtlstPhotosPending_' + obj_response[items].Id).attr("pending", "false");
                $('#dtlstPhotos_' + obj_response[items].Id).attr('class', 'show');
                $('#dtlstPhotos_' + obj_response[items].Id).find('img').attr('src', imgUrl);
            }
        }
    })
}

function GetPendingList() {
    $(".pending").each(function () {
        if ($(this).attr("pending") == "true") {
            pendingList.push(this.id.replace("dtlstPhotosPending_", ""));
        }
    });
}
function UpdatePendingImages() {
    var list = "";
    if (pendingList.length > 0) {
        for (var i = 0; i < pendingList.length; i++) {
            list += pendingList[i] + ",";
        }
        CheckImageStatus(list);
    }
    //alert(updateCounter);
    //setTimeout(UpdatePendingImages, refreshTime);
}