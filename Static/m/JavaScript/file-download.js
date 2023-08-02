function forceDownload(link, fileExtension) {
    const done = 4;
    const ok = 200;
    let url = link.getAttribute("data-href");
    let fileName = link.getAttribute("data-filename") + "." + fileExtension;

    if (window.ReactNativeWebView) {
        if (fileExtension === "jpg") {
            window.ReactNativeWebView.postMessage(
                JSON.stringify({
                    'callbackName': 'downloadImage',
                    'imageUrl': url,
                    'imageName': fileName
                })
            );
        }
        else if (fileExtension === "pdf") {
            window.ReactNativeWebView.postMessage(
                JSON.stringify({
                    'callbackName': 'downloadBrochure',
                    'pdfUrl': url,
                    'pdfName': fileName,
                })
            );
        }
    }

    if (navigator && navigator.userAgent.indexOf('UCBrowser') !== -1) {
        simulateDownload(fileName, url);
    }
    else {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";

        xhr.onreadystatechange = function () {
            if (this.readyState == done && this.status == ok) {
                let urlCreator = window.URL || window.webkitURL;
                let fileUrl = urlCreator.createObjectURL(this.response);
                simulateDownload(fileName, fileUrl);
            }
        };

        xhr.send();
    }
}

function simulateDownload(fileName, url) {
    let tag = document.createElement('a');
    tag.href = url;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
}
