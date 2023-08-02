/**
* Error logger for javascript errors
* 
* @author Meet Shah <meet.shah@carwale.com>
* 
* @param {String || Array} log_source The js file sources to match errors from.
* @param {String} log_endpoint The api url to send the error object to.
* @example
*   ClientErrorLogger(["aeplcdn", "cartrade"], "/api/exceptions/");
*/
var ClientErrorLogger = function (log_source, log_endpoint) {
    if (log_source && log_endpoint) {
        log_source = log_source instanceof Array ? new RegExp(log_source.join('|')) : log_source;
    }
    else {
        console.error("Invalid logger configuration.");
    }
    if (!window.onerror) {

        window.onerror = function (messageOrEvent, source, lineNo, colNo, error) {
            var errorObject = {
                messageOrEvent: messageOrEvent,
                source: source,
                lineNo: lineNo,
                colNo: colNo,
                error: error ? error.stack : ''
            };
            if (errorObject.source && errorObject.source.match(log_source)) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", log_endpoint);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlhttp.setRequestHeader("ServerDomain", "CarWale");
                xmlhttp.send(JSON.stringify(errorObject));
            }
            return false;
        }
    }
    else {
        console.error("Logging already enabled.")
    }
};

ClientErrorLogger(["aeplcdn", "cartrade"], "/api/exceptions/");

