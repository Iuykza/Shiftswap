/**
 * clicksend
 *
 * This file was automatically generated for ClickSend by APIMATIC v2.0 on 04/18/2016
 */

var request = require('../Http/Client/RequestClient'),
    configuration = require('../configuration'),
    APIHelper = require('../APIHelper');

var SubaccountController = {

    /**
     * Get all subaccounts
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    getSubaccounts : function(callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/subaccounts";
        
        //validate and preprocess url
        var queryUrl = APIHelper.cleanUrl(queryBuilder);
        
        //Construct the request
        var options = {
            queryUrl: queryUrl,
            method: "GET",
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
        
    },


    /**
     * Create new subaccount
     * @param {array} apiUsername    Required parameter: Your new api username.
     * @param {string} password    Required parameter: Your new password
     * @param {string} email    Required parameter: Your new email.
     * @param {string} phoneNumber    Required parameter: Your phone number in E.164 format.
     * @param {string} firstName    Required parameter: Your firstname
     * @param {string} lastName    Required parameter: Your lastname
     * @param {bool|null} accessUsers    Optional parameter: Your access users flag value, must be 1 or 0.
     * @param {bool|null} accessBilling    Optional parameter: Your access billing flag value, must be 1 or 0.
     * @param {bool|null} accessReporting    Optional parameter: Your access reporting flag value, must be 1 or 0.
     * @param {bool|null} accessContacts    Optional parameter: Your access contacts flag value, must be 1 or 0.
     * @param {bool|null} accessSettings    Optional parameter: Your access settings flag value, must be 1 or 0.
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    createSubaccount : function(apiUsername, password, email, phoneNumber, firstName, lastName, accessUsers, accessBilling, accessReporting, accessContacts, accessSettings, callback){
        //Assign default values
        accessUsers = accessUsers || true;
        accessBilling = accessBilling || true;
        accessReporting = accessReporting || true;
        accessContacts = accessContacts || false;
        accessSettings = accessSettings || true;

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/subaccounts";
        
        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "api_username" : apiUsername,
            "password" : password,
            "email" : email,
            "phone_number" : phoneNumber,
            "first_name" : firstName,
            "last_name" : lastName,
            "access_users" : (null != accessUsers)? accessUsers: true,
            "access_billing" : (null != accessBilling)? accessBilling: true,
            "access_reporting" : (null != accessReporting)? accessReporting: true,
            "access_contacts" : (null != accessContacts)? accessContacts: false,
            "access_settings" : (null != accessSettings)? accessSettings: true
        });

        //validate and preprocess url
        var queryUrl = APIHelper.cleanUrl(queryBuilder);
        
        //Construct the request
        var options = {
            queryUrl: queryUrl,
            method: "POST",
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
        
    },


    /**
     * Get specific subaccount
     * @param {int} subaccountId    Required parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    getSubaccount : function(subaccountId, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/subaccounts/{subaccount_id}";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "subaccount_id" : subaccountId
        });

        //validate and preprocess url
        var queryUrl = APIHelper.cleanUrl(queryBuilder);
        
        //Construct the request
        var options = {
            queryUrl: queryUrl,
            method: "GET",
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
        
    },


    /**
     * Delete a subaccount
     * @param {int} subaccountId    Required parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    deleteSubaccount : function(subaccountId, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/subaccounts/{subaccount_id}";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "subaccount_id" : subaccountId
        });

        //validate and preprocess url
        var queryUrl = APIHelper.cleanUrl(queryBuilder);
        
        //Construct the request
        var options = {
            queryUrl: queryUrl,
            method: "DELETE",
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
        
    },


    /**
     * Regenerate an API Key
     * @param {int} subaccountId    Required parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    regenerateApiKey : function(subaccountId, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/subaccounts/{subaccount_id}/regen-api-key";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "subaccount_id" : subaccountId
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
        
    },


    /**
     * Update subaccount
     * @param {int} subaccountId    Required parameter: TODO: type description here
     * @param {string|null} password    Optional parameter: TODO: type description here
     * @param {string|null} email    Optional parameter: TODO: type description here
     * @param {string|null} phoneNumber    Optional parameter: TODO: type description here
     * @param {string|null} firstName    Optional parameter: TODO: type description here
     * @param {string|null} lastName    Optional parameter: TODO: type description here
     * @param {bool|null} accessUsers    Optional parameter: Example: 1
     * @param {bool|null} accessBilling    Optional parameter: Example: 1
     * @param {bool|null} accessReporting    Optional parameter: Example: 1
     * @param {bool|null} accessContacts    Optional parameter: Example: 0
     * @param {bool|null} accessSettings    Optional parameter: Example: 1
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    updateSubaccount : function(subaccountId, password, email, phoneNumber, firstName, lastName, accessUsers, accessBilling, accessReporting, accessContacts, accessSettings, callback){
        //Assign default values
        accessUsers = accessUsers || true;
        accessBilling = accessBilling || true;
        accessReporting = accessReporting || true;
        accessContacts = accessContacts || false;
        accessSettings = accessSettings || true;

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/subaccounts/{subaccount_id}";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "subaccount_id" : subaccountId
        });

        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "password" : password,
            "email" : email,
            "phone_number" : phoneNumber,
            "first_name" : firstName,
            "last_name" : lastName,
            "access_users" : (null != accessUsers)? accessUsers: true,
            "access_billing" : (null != accessBilling)? accessBilling: true,
            "access_reporting" : (null != accessReporting)? accessReporting: true,
            "access_contacts" : (null != accessContacts)? accessContacts: false,
            "access_settings" : (null != accessSettings)? accessSettings: true
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

module.exports = SubaccountController;