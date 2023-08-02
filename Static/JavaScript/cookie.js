function SetCookieInDays(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * nDays);
    document.cookie =
      cookieName +
      "=" +
      cookieValue +
      ";expires=" +
      expire.toGMTString() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/" +
      "; secure";
    if (cookieName == "_CustCityIdMaster" && Number(cookieValue) > 0) {
      var name = $.cookie("_CustCityMaster");
      var id = $.cookie("_CustCityIdMaster");
    }
}

function GetCookieByName(name) {
    var allCookies = "; " + document.cookie; 
    var parts = allCookies.split("; " + name + "=");
    var cookieValue = "";
    if (parts.length >= 2) {
        cookieValue = parts
        .pop()
        .split(";")
        .shift(); 
    }

    cookieValue = decodeURI(cookieValue);
    
    return cookieValue;
}

function DeleteCookie(cookieName) {
  document.cookie = cookieName +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=' + defaultCookieDomain;
}