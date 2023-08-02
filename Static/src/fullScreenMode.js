function makeLandscape() {
  // this works on android, not iOS
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("landscape");
  }
  document.getElementById("ful_scrn").style.display = "none";
  document.getElementById("ful_scrn_close").style.display = "block";
}

function makePotrait() {
  // this works on android, not iOS
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("portrait-primary");
  }
  document.getElementById("ful_scrn").style.display = "block";
  document.getElementById("ful_scrn_close").style.display = "none";
}

function openFullScreen(e) {
  var element = document.getElementById("ul_wrapper");
  if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
    makeLandscape();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
    makeLandscape();
  }
}

function closeFullscreen(e) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    makePotrait();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
    makePotrait();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}
function setFullScreenMode() {
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
    makePotrait();
  }
}
