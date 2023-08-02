function getCookies() {
  var cookies = {};
  if (document.cookie && document.cookie != "") {
    var cookieParts = document.cookie.split(";");
    for (var i = 0; i < cookieParts.length; i++) {
      var name_value = cookieParts[i].split("=");
      name_value[0] = name_value[0].replace(/^ /, "");
      cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(
        name_value[1]
      );
    }
  }
  return cookies;
}

// cookie names
const sessionDealersCookieKey = "sessionDealerList";
const deferredDealersCookieKey = "deferredDealerList";
const noOfDaysInThreeMonths = 90;

function getCookieData(name) {
  const cookies = getCookies();
  return cookies[name];
}

function setCookieData(name, data, expiry) {
  if (!name) {
    return;
  }
  if (!expiry) {
    expiry = noOfDaysInThreeMonths; // default 3 months expiry
  }
  const date = new Date();
  date.setDate(date.getDate()+expiry);
  document.cookie =
    name +
    "=" +
    encodeURIComponent(JSON.stringify(data)) +
    "; expires=" +
    date +
    ";path=/";
}

function removeCookie(name) {
  if (!name) {
    return;
  }
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getCurrentDate() {
  const date = new Date();
  // incrementing month by 1 because January gives 0.
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}

function updateDealerLists(dealerId) {
  if (dealerId == null) {
    return;
  }
  let isSessionDealerListUpdated = false;
  let sessionDealerList = [];
  let deferredDealerList = [];
  const sessionDealerCookieData = getCookieData(sessionDealersCookieKey);
  const deferredDealerCookieData = getCookieData(deferredDealersCookieKey);
  // if dealerid is present in deferredDealerList, updating it there itself
  if (deferredDealerCookieData) {
    try {
      deferredDealerList = JSON.parse(deferredDealerCookieData);
      if (!Array.isArray(deferredDealerList)) {
        return;
      }
      for (let data of deferredDealerList) {
        if (data.dealerId == dealerId) {
          data.addedDate = getCurrentDate();
          setCookieData(
            deferredDealersCookieKey,
            deferredDealerList,
            noOfDaysInThreeMonths
          ); // 3 months expiry
          return;
        }
      }
    } catch (e) {}
  }
  // else if dealerid is present in sessionDealerList, updating it there itself
  if (sessionDealerCookieData) {
    try {
      sessionDealerList = JSON.parse(sessionDealerCookieData);
      if (!Array.isArray(sessionDealerList)) {
        return;
      }
      for (let data of sessionDealerList) {
        if (data.dealerId == dealerId) {
          data.addedDate = getCurrentDate();
          isSessionDealerListUpdated = true;
          break;
        }
      }
    } catch (e) {}
  }
  // else if dealerid is not present in either of the cookies, adding it in sessionDealerList
  if (!isSessionDealerListUpdated) {
    sessionDealerList.push({
      dealerId: dealerId,
      addedDate: getCurrentDate(),
    });
  }
  setCookieData(
    sessionDealersCookieKey,
    sessionDealerList,
    noOfDaysInThreeMonths
  ); // 3 months expiry
}

function updateDeferredDealerList() {
  let sessionDealerList = [];
  let deferredDealerList = [];
  try {
    sessionDealerList = JSON.parse(getCookieData(sessionDealersCookieKey));
  } catch (e) {}
  try {
    deferredDealerList = JSON.parse(getCookieData(deferredDealersCookieKey));
  } catch (e) {}
  let dealers = [];
  let dealersList = [];
  if (Array.isArray(sessionDealerList)) {
    dealers = [...sessionDealerList];
  }
  if (Array.isArray(deferredDealerList)) {
    dealers = [...dealers, ...deferredDealerList];
  }
  dealers.forEach(dealer => {
    let date = new Date(dealer.addedDate);
    let days = Math.abs(
      (date.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    // removing dealerids older than 3 months
    if (days <= noOfDaysInThreeMonths) {
      dealersList.push(dealer);
    }
  });
  if (Array.isArray(dealersList)) {
    setCookieData(deferredDealersCookieKey, dealersList, noOfDaysInThreeMonths); // 3 months expiry
    removeCookie(sessionDealersCookieKey);
  }
}

function getDeferredDealerIds() {
  let deferredDealerCookieData = getCookieData(deferredDealersCookieKey);
  let deferredDealerList = [];
  let deferredDealerIds = [];
  if (!deferredDealerCookieData) {
    return deferredDealerIds;
  }
  try {
    deferredDealerList = JSON.parse(deferredDealerCookieData);
  } catch (e) {}
  if (Array.isArray(deferredDealerList)) {
    deferredDealerList.forEach(dealer => {
      deferredDealerIds.push(dealer.dealerId);
    });
  }
  return deferredDealerIds;
}
