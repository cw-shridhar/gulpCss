$(".front-img").bt({fill: '#FCF5A9',strokeWidth: 1,strokeStyle: '#D3D3D3',spikeLength:20,shadow: true,positions:['right']});
var errorDivObj = $('#divErrorMsg');
var uploadLoading = $('#uploadLoading');
var sizeLimitBytes = 8 * 1024 * 1024;//8MB limit
var queryIndex = window.location.href.indexOf("=");
var inquiryId= window.location.href.substr(queryIndex+1);
var nextStepUrl = "/sell-used-car/mysellinquiry/confirm-message/?t=p&inquiryId=" + inquiryId;
var requestCount = 0;
var responseCount = 0;
errorDivObj.text("");
uploadLoading.hide();
$(document).ready(function(){
    $('#imageInput').on('change', beginUpload);
});

function beginUpload(){
    var imageFiles = document.getElementById('imageInput').files;
    if(imageFiles.length === 0){
        errorDivObj.text('No files currently selected for upload');
    }
    else{
        for (var i = 0; i < imageFiles.length; i++) {
            if(isFileUploadValid(imageFiles[i])){
                var imgUploadUtility = new ImageUploadUtility();
                imgUploadUtility.imageType = "7";
                uploadLoading.show();
                imgUploadUtility.upload(imageFiles[i])
                    .then(function (resp){
                        window.location.reload(true);
                    }).catch(function(er){
                        uploadLoading.hide();
                        errorDivObj.text("Something went wrong. Please try again");
                    });
            }
        }

    }
}

function isFileUploadValid(file){
    if (!validFileType(file)) {
        errorDivObj.text("You are trying to upload invalid file. We accept only jpg and png file formats.");
        return false;
    }
    else if(!validFileSize(file)){
        errorDivObj.text("The file you are trying to upload is too large. Please try uploading a file of smaller size.");
        return false;
    }
    else{
        return true;
    }
}

function validFileType(file) {
    var fileTypes = [
        'image/jpeg',
        'image/png'
    ];
    for(var i = 0; i < fileTypes.length; i++) {
        if(file.type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}

function validFileSize(file, maxSizeBytes) {
    return file.size <= (maxSizeBytes || sizeLimitBytes)
}
