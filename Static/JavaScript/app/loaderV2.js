const loaderGif = document.querySelector(".loader-gif");
const blackOutWindowLoader = document.querySelector(".black-out-window-loader");


function showLoadingScreen() {
    loaderGif.classList.remove("display-none");
    blackOutWindowLoader.classList.remove("display-none");
}

function hideLoadingScreen() {
    loaderGif.classList.add("display-none");
    blackOutWindowLoader.classList.add("display-none");
}
