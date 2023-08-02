var player;
var videoid = '';

function onYouTubeIframeAPIReady() {
    try {
        player = new YT.Player("yvedio", {
            events: {
                "onReady": onPlayerReady,
                "onStateChange": onPlayerStateChange
            }
        });
    } catch (e) {}
}

function onPlayerReady(event) {
    // event.target.playVideo();
    analytics.trackAction("CWInteractive", "UsedCarDetails", "VDP_video_next_Click", videoid);
}
var gtmvedio_count = 0;

function changeBorderColor(playerStatus) {
    if (playerStatus == -1) {
        // unstarted = gray
    } else if (playerStatus == 0) {
        document.getElementById("yvedio").src = "https://www.youtube.com/embed/" + videoid + "?enablejsapi=1";
    } else if (playerStatus == 1) {
        // playing = green
        if (gtmvedio_count == 0) {}
    } else if (playerStatus == 2) {
        // paused = red
    } else if (playerStatus == 3) {
        // buffering = purple
    } else if (playerStatus == 5) {
        // video cued = orange
    }
}

function onPlayerStateChange(event) {
    // alert('testing 123456');
    // console.log(event);
    changeBorderColor(event.data);
}

function lazyvedio() {
    // alert('testing');
    if (typeof jQuery != 'undefined' && (document.readyState == "interactive" || document.readyState == 'complete')) {
        $('.video-slug-block-wrap').show();
        if(document.getElementById("videoid") === null){
            return;
        }
        videoid = document.getElementById("videoid").value;
        document.getElementById("yvedio").src = "https://www.youtube.com/embed/" + videoid + "?enablejsapi=1";
        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        setTimeout("lazyvedio()", 3000);
    }
}

// setTimeout("lazyvedio()",3000); 
(function() {
    setTimeout("lazyvedio()", 3000);
})();