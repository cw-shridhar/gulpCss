function changevideo(vid,id){
    for(i = 0; i < 3; i++){
        $("#vd"+i).removeClass("current");
    }

    $("#vd"+id).addClass("current");
    document.getElementById("video_frame").src="https://www.youtube.com/embed/"+vid+"?autoplay=1";
}