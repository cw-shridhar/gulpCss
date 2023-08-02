  function openPopup(videoid) {
   document.getElementById("video-frame").src = "https://www.youtube.com/embed/" + videoid;
   document.getElementById("video-pane").style.display = "block";
   document.body.style.overflow = 'hidden';
   document.querySelector('html').scrollTop = window.scrollY;
  }

  function closePopup() {
   document.getElementById("video-pane").style.display = "none";
   document.getElementById("video-frame").src = "";
   document.body.style.overflow = null;
  }