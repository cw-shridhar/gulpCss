let currentPageNo = 1;

window.onload = function () {
    addPageMarkerObserver();
};

function addPageMarkerObserver() {
    const options = {
        threshold: [0.8],
    };
    let observer = new IntersectionObserver(handleIntersect, options);
    let marker = document.querySelector("#next-page-marker");
    if (marker) {
        observer.observe(marker);
    }
}

function handleIntersect(entries, observer) {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
            currentPageNo = currentPageNo + 1;
            if (currentPageNo > 2) {
                let pageMarker = document.getElementById("next-page-marker");
                pageMarker.remove();
                return;
            }
            $("#loder_img").show();
            getBrochurePageData()
                .then(function (response) {
                    $("#loder_img").hide();
                    if (!response || !response.includes("</li>")) {
                        let pageMarker = document.getElementById("next-page-marker");
                        pageMarker.remove();
                    } else {
                        let modelListContainer = document.getElementById("scrollresult");
                        modelListContainer.insertAdjacentHTML("beforeend", response);
                    }
                })
                .catch(function (error) {
                    $("#loder_img").hide();
                    console.log("Error in calling filter page api: ", error);
                });
        }
    }
}

function getBrochurePageData() {
    let apiUrl = `/api/brochurepage/popularmodels?pageNo=2`;
    return fetch(apiUrl, {
        headers: { 'ServerDomain': 'CarWale' }
    })
        .then(function (response) {
            if (!response.ok) {
                throw response;
            }
            return response.text();
        })
        .catch(function (error) {
            console.log("Error in calling brochure page api: ", error);
        });
}