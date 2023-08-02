/// reference: https://stackoverflow.com/questions/11557526/deserialize-query-string-to-json-object
function queryStringToJSON(qs) {
    if(!qs) {
        return {};
    }
    var pairs = qs.split('&');
    var result = {};
    pairs.forEach(function(p) {
        if(!p.includes("="))
        {
            return;
        }
        var pair = p.split('=');
        var key = pair[0];
        var value = pair[1].replace(/\+/g, ' ');

        if( result[key] ) {
            if( Array.isArray(result[key]) ) {
                result[key].push( value );
            } else {
                result[key] = [ result[key], value ];
            }
        } else {
            result[key] = value;
        }
    });

    return result;
};