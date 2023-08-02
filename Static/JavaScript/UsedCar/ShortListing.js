
var SHORT_LISTING_LOCAL_STORAGE_KEY = "ct_shortListedCars";

/**
 * finds the specified profileId in localstorage and return true or false. if profileId is invalid it throws an error 
 * @param {string} profileId - unique identifier of stocks having prefix S for individual car and D for dealer's car.
 * @return {boolean} - denotes whether the car is already shortlisted or not.
 */
function isShortListed(profileId) {
  try{
    if(!profileId){
      throw 'Invalid Profile';
    }
  }
  catch(error){ return; }
  var favourites = getValue(SHORT_LISTING_LOCAL_STORAGE_KEY);
  if (!favourites) {
    return false;
  }
  foundInFavourites(favourites, profileId);
};

/**
 * finds the specified profileId in localstorage and return true or false. if profileId is invalid it throws an error 
 * @param {Array} profileId - array containinig profileIds of selected cars
 * @param {string} profileId - unique identifier of stocks having prefix S for individual car and D for dealer's car.
 * @return {boolean} - denotes whether the car is present in localstorage or not.
 */
function foundInFavourites(favourites, profileId){
  var shortListed = favourites.filter( function(element) {
    return element.toLowerCase().trim() === profileId.toLowerCase().trim();
  });
  return shortListed.length > 0;
}

/**
 * perform operation like push, pop in shortListing local storage for specified car.
 * @param {string} profileId - unique identifier of stocks having prefix S for individual car and D for dealer's car.
 * @param {boolean} isFavourite - flag to denote that the specified car is to be saved in local storage i.e shortlisted or not.
 * @returns {boolean} - returns true when local store updated successfully
 */
function handleShortListingLocalStorage (profileId, isFavourite) {
  try{
    if (!profileId) {
      throw 'Invalid Profile';
    }
  }
  catch(error){ return; }
  profileId = profileId.toLowerCase().trim();
  if (!isFavourite) {
    return LocalStoragePopFromFavourites(
      profileId
    );
  } else {
    return LocalStoragePushToFavourites(
      profileId
    );
  }
};

/**
 * perform push operation on local storage
 * @param {string} profileId - unique identifier of stocks having prefix S for individual car and D for dealer's car.
 * @returns {boolean} - returns true when local storage is update successfully else false
 */
function LocalStoragePushToFavourites(profileId) {
  if (!profileId) {
    return false;
  }

  //remove the profileId passed in the method
  var localStorageCars = removeProfileIdFromLocalStorage(profileId);
  if (localStorageCars.length >= 20) {
    localStorageCars.shift(1);
  }
  localStorageCars.push(profileId);
  setValue(SHORT_LISTING_LOCAL_STORAGE_KEY, localStorageCars);
  return true;
}

/**
 * perform pop operation on local storage
 * @param {string} profileId - unique identifier of stocks having prefix S for individual car and D for dealer's car.
 * @returns {boolean} - returns true when local storage is update successfully else false
 */
function LocalStoragePopFromFavourites(profileId) {
  if (!profileId) {
    return false;
  }
  var localStorageCars = removeProfileIdFromLocalStorage(profileId);
  setValue(SHORT_LISTING_LOCAL_STORAGE_KEY, localStorageCars);
  return true;
}

/**
 * remove profileId from localstorage if present
 * @param {string} profileId - unique identifier of stocks having prefix S for individual car and D for dealer's car.
 * @returns {Array} - returns updated localstorage array
 */
function removeProfileIdFromLocalStorage(profileId) {
  var localStorage = getValue(SHORT_LISTING_LOCAL_STORAGE_KEY);
  if (!localStorage) {
    localStorage = [];
  }
  var localStorageCars = localStorage.filter( function(element) {
    return element !== profileId;
  });
  return localStorageCars;
}
