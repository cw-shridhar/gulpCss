
function uploadCarPhotos(carId) {
     window.location.href = "/sell-used-car/myaccount/upload-images/?car=" + "s" + carId + "&authtoken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : "");
   }

function myInquiryDetails(inquiryId)
{
    window.location.href = "/sell-used-car/myaccount/manage/" + inquiryId + "/?authtoken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : "");
}   

function ImageUploadUtility() {
    var self = this;
    self.request = {};
    self.response = {};
    self.status = false;
    self.photoId = null;
    self.profileId = "";
    self.imageType = null;
    //function to get token from server 
    self.getToken = function (fileExtension, imageType) {
        var tokenRequest = {
            extension: fileExtension,
            imageType: imageType || self.imageType
        }
        return $.ajax({
            type: "POST",
            url: "/api/stocks/images/token/",
            dataType: 'json',
            headers: { ServerDomain: "CarWale" },
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(tokenRequest)
        });
    };

    self.awsUpload = function (awsURI, objData) {
        return $.ajax({
            url: awsURI,
            data: objData,
            async: true,
            processData: false,
            contentType: false,
            type: "POST",
            dataType: "xml"
        });
    };

    self.stockImageUpload = function(requestObject) {
        return $.ajax({
            headers: { ServerDomain: "CarWale" },
            type: "POST", async: true, url: "/api/stockimages/", dataType: 'json', contentType: "application/json;charset=utf-8",
            data: JSON.stringify(requestObject)
        });
    };

    self.RCImageUpload = function(originalImagePath) {
        return $.ajax({
            type: "POST", url: "/api/stockregistrationcertificates/", dataType: 'json', contentType: "application/json;charset=utf-8", data: JSON.stringify(originalImagePath)
        });
    };

    /* function to upload image to amazon S3 */
    self.upload = function (file) {
        var tokenResponse;
        var ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        try {
            return new Promise(function (resolve, reject) {
                self.getToken(ext).done(function (response) {
                    if (response) {
                        tokenResponse = response;
                        var awsURI = response.URI;
                        var objData = new FormData();
                        objData.append('key', response.originalImagePath);
                        objData.append('acl', 'private');
                        objData.append('success_action_status', '201');
                        objData.append('Content-Type', file.type);
                        objData.append('x-amz-credential', response.AccessKeyId + "/" + response.DatetTmeISO + "/ap-south-1/s3/aws4_request");
                        objData.append('x-amz-algorithm', 'AWS4-HMAC-SHA256');
                        objData.append('x-amz-date', response.DateTimeISOLong);
                        objData.append('policy', response.Policy);
                        objData.append('x-amz-signature', response.Signature);
                        objData.append("file", file);

                        self.awsUpload(awsURI, objData).done(function (xmlResponse) {
                            self.awsUploadComplete(xmlResponse, tokenResponse).done(function (response) {
                                if (response != null) {
                                    self.status = true;
                                    self.photoId = response;
                                    resolve(self);
                                }
                            }).fail(function () {
                                self.status = false;
                                reject();
                            });
                        }).fail(function () {
                            self.status = false;
                            reject();
                        });
                    }
                });
            });
            
        }
        catch (e) {
            console.log("some error has occurred. Message : " + e.message);
        }
    };

    /* This event is raised when the amazon S3 sends back a response */
    self.awsUploadComplete = function (response, tokenResponse) {
        if (response) {
            var xmlResponse = response.getElementsByTagName("PostResponse");;
            if (xmlResponse) {

                if (!self.imageType.localeCompare("6")) {//RC image
                    return self.RCImageUpload(tokenResponse.originalImagePath)
                }

                var requestObject = {
                    sellerType: 2,
                    sourceId: 1,
                    originalImagePath: tokenResponse.originalImagePath,
                    key: tokenResponse.key,
                    id: tokenResponse.id,
                    imageType: self.imageType
                };

                //call api that processes image through Rabbit MQ and saves its details in database
                return self.stockImageUpload(requestObject);
            };
        }
    };
}