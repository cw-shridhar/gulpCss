const ctDomain = "www.cartrade.com";
const unique_cookie_id_user = GetCookieByName("CWC");
const os_type = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 43 : 3;

var firebaseConfig = {
  apiKey: "AIzaSyC6YSDiCnZ-bzqqW-zaojpTYyWrV7w71dc",
  authDomain: "amiable-evening-643.firebaseapp.com",
  databaseURL: "https://amiable-evening-643.firebaseio.com",
  projectId: "amiable-evening-643",
  storageBucket: "amiable-evening-643.appspot.com",
  messagingSenderId: "607798634687",
  appId: "1:607798634687:web:76e2fbe986c74bac253e0a",
  measurementId: "G-9C0TC09780",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
getStartToken();
messaging.onMessage(function (payload) {});
function getStartToken() {
  messaging
    .getToken()
    .then(currentToken => {
      console.log("currentToken", currentToken);
      if (currentToken) {
        if (!isTokensendTokenToServer()) {
          console.log("First time", currentToken);
          setTokenInfo(currentToken);
          sendTokenToServer(currentToken, 2);
        } else {
          console.log("second time", currentToken);
          if (getTokenInfo() != currentToken) {
            if (getTokenInfo() == null) {
            } else {
              sendTokenToServer(currentToken, 2);
            }
            setTokenInfo(currentToken);
          }
        }
      } else {
        console.log("requesting permission");
        RequestPermission();
        setTokenSentToServer(false);
      }
    })
    .catch(err => {
      console.log("inside catch", err);
      if (getTokenInfo() != "") {
        sendTokenToServer(getTokenInfo(), 0);
        setTokenInfo("");
      }
      setTokenSentToServer(false);
    });
}
function RequestPermission() {
  messaging
    .requestPermission()
    .then(function (permission) {
      if (permission === "granted") {
        getStartToken();
      } else {
      }
    })
    .catch(function (err) {
      console.log("error in requestPermission", err);
    });
}
function sendTokenToServer(token, subsmasterid) {
  console.log("sendTokentoServer");
  if (token != null) {
    var applicationId = 3;
    var url = "/api/MobileAppAlert/GetManageMobileAppAlerts/";
    if (subsmasterid != 0) {
      var send_info = {
        imei: unique_cookie_id_user,
        os: os_type,
        gcmid: token,
        subsmasterid: subsmasterid,
        applicationId: applicationId,
      };
    } else {
      var send_info = {
        imei: unique_cookie_id_user,
        os: os_type,
        gcmid: token,
        applicationId: applicationId,
      };
    }
    $.ajax({
      url: url,
      type: "GET",
      data: send_info,
      success: function (response) {
        setTokenSentToServer(true);
        console.log("cw api called success");
      },
      error: function (err) {
        setTokenSentToServer(false);
        console.log("error in api", err);
      },
    });
  }
}
messaging.onTokenRefresh(function () {
  messaging
    .getToken()
    .then(function (newtoken) {
      setTokenInfo(newtoken);
      sendTokenToServer(newtoken, 2);
    })
    .catch(function (err) {});
});
function isTokensendTokenToServer() {
  return window.localStorage.getItem("sendTokenToServer") === "1";
}
function setTokenSentToServer(sent) {
  window.localStorage.setItem("sendTokenToServer", sent ? "1" : "0");
}
function setTokenInfo(token) {
  window.localStorage.setItem("fcmToken", token);
}
function getTokenInfo() {
  return window.localStorage.getItem("fcmToken");
}
