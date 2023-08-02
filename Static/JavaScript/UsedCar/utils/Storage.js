/**
 * Check if the type of storage is available
 * @param {string} type
 * @returns bool
 */
function isStorageAvailable(type) {
  try {
    var storage = window[type],
    x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (error) {
    return false;
  }
};

var localStorageAvailable = isStorageAvailable("localStorage");

/**
 * Set value for key in localStorage if available
 * @param { string } key
 * @param { * } value
 */
function setValue(key, value) {
  try {
    var serializedValue = JSON.stringify(value);
    if (localStorageAvailable) {
      localStorage.setItem(key, serializedValue);
    }
  } catch (error) {}
};

/**
 * Return value for the key,
 * return undefined in case of error
 * @param { string } key
 * @returns *
 */
function getValue(key) {
  try {
    var serializedValue = localStorageAvailable && localStorage.getItem(key)
    return JSON.parse(serializedValue);
  } catch (error) {
    return undefined;
  }
};

/**
 * Clear key in localStorage if available
 * @param { string } key
 * @param { * } value
 */
function clearLocalStorageValue(key) {
  try {
    localStorageAvailable && localStorage.removeItem(key);
  } catch (error) {}
};
