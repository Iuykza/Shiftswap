/**
 * clicksend
 *
 * This file was automatically generated for ClickSend by APIMATIC v2.0 on 04/18/2016
 */

var request = require('../Http/Client/RequestClient'),
    configuration = require('../configuration'),
    APIHelper = require('../APIHelper');

var TransferCreditController = {

    /**
     * Transfer Credit
     * @param {string} clientUserId    Required parameter: TODO: type description here
     * @param {int} balance    Required parameter: TODO: type description here
     * @param {string} currency    Required parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    transferCredit : function(clientUserId, balance, currency, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/reseller/transfer-credit";
        
        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "client_user_id" : clientUserId,
            "balance" : balance,
            "currency" : currency
        });

        //validate and preprocess url
        var queryUrl = APIHelper.cleanUrl(queryBuilder);
        
        //Construct the request
        var options = {
            queryUrl: queryUrl,
            method: "PUT",
            username: configuration.username,
            password: configuration.key
        };
        
        //Build the response processing. 
        function cb(error, response, context) {
            if(error){
                callback({errorMessage: error.message, errorCode: error.code},null,context);
            }else if (response.statusCode >= 200 && response.statusCode <= 206) {
                callback(null, response.body,context);
            }else{
                //Error handling using HTTP status codes
                if (response.statusCode == 400) {
                    callback({errorMessage: "BAD_REQUEST", errorCode: 400, errorResponse:response.body},null,context);
                } else if (response.statusCode == 401) {
                    callback({errorMessage: "UNAUTHORIZED", errorCode: 401, errorResponse:response.body},null,context);
                } else if (response.statusCode == 403) {
                    callback({errorMessage: "FORBIDDEN", errorCode: 403, errorResponse:response.body},null,context);
                } else if (response.statusCode == 404) {
                    callback({errorMessage: "NOT_FOUND", errorCode: 404, errorResponse:response.body},null,context);
                } else if (response.statusCode == 405) {
                    callback({errorMessage: "METHOD_NOT_FOUND", errorCode: 405, errorResponse:response.body},null,context);
                } else if (response.statusCode == 429) {
                    callback({errorMessage: "TOO_MANY_REQUESTS", errorCode: 429, errorResponse:response.body},null,context);
                } else if (response.statusCode == 500) {
                    callback({errorMessage: "INTERNAL_SERVER_ERROR", errorCode: 500, errorResponse:response.body},null,context);
                } else {
                    callback({errorMessage: "HTTP Response Not OK", errorCode: response.statusCode, errorResponse:response.body},null,context);
                }
            }
        }
        request(options, cb);
        
    }

};

module.exports = TransferCreditController;