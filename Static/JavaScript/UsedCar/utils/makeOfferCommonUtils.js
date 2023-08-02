var makeOfferUtils = (function () {
  var getOfferInterval = function (price) {
    if (price < 200000) {
      return { priceInterval: 2000, totalOffers: 10 };
    } else if (price < 400000) {
      return { priceInterval: 5000, totalOffers: 12 };
    } else if (price < 700000) {
      return { priceInterval: 10000, totalOffers: 12 };
    } else if (price < 1500000) {
      return { priceInterval: 15000, totalOffers: 12 };
    } else if (price < 3000000) {
      return { priceInterval: 20000, totalOffers: 12 };
    } else if (price < 5000000) {
      return { priceInterval: 50000, totalOffers: 12 };
    } else {
      return { priceInterval: 100000, totalOffers: 12 };
    }
  };
  var getRoundedPrice = function (price) {
    var baseValue = 0;
    if (price < 3000000) {
      baseValue = 10000;
    } else if (price < 10000000) {
      baseValue = 50000;
    } else {
      baseValue = 100000;
    }
    var roundedPrice = (Math.round(price / baseValue) - 1) * baseValue;
    return roundedPrice;
  };
  var stockPriceNegotiationOptions = function (price) {
    var offerIntervalObject = getOfferInterval(price);
    var offerInterval = offerIntervalObject.priceInterval;
    var totalOffers = offerIntervalObject.totalOffers;
    var offersList = [];
    var roundedPrice = getRoundedPrice(price);
    var i;
    var discount = price;
    for (i = 0; i < totalOffers && discount > 0; i++) {
      offersList.push(discount);
      discount = roundedPrice - i * offerInterval;
    }
    return offersList;
  };
  return {
    stockPriceNegotiationOptions: stockPriceNegotiationOptions,
  };
})();
