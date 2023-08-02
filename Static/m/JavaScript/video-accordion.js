const videoAccordian = (function(){
    const videosToggleText = document.querySelector(".js-videos-toggle-text");
    const videosToggleArrow = document.querySelector(".js-videos-toggle-arrow");

    function toggleVideos(videoCount) {
        if (!videosToggleArrow.classList.contains("rotate-upside-down")) {
            more_model_videos.classList.remove('display-none');
            videosToggleText.textContent = "View Less";
            videosToggleArrow.classList.add("rotate-upside-down");
        }
        else {
            more_model_videos.classList.add('display-none');
            videosToggleText.textContent = `View More ${videoCount} Videos`;
            videosToggleArrow.classList.remove("rotate-upside-down");
        }
    }
    return {
        toggleVideos
    };
})();
