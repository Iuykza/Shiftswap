/**
 * clicksend
 *
 * This file was automatically generated for ClickSend by APIMATIC v2.0 on 04/18/2016
 */

var request = require('../Http/Client/RequestClient'),
    configuration = require('../configuration'),
    APIHelper = require('../APIHelper');

var AccountController = {

    /**
     * Get account details
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    getAccount : function(callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/account";
        
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
     * Create An Account
     * @param {string} username    Required parameter: Your username
     * @param {string} password    Required parameter: Your password
     * @param {string} userPhone    Required parameter: Your phone number in E.164 format.
     * @param {string} userEmail    Required parameter: Your email
     * @param {string} userFirstName    Required parameter: Your firstname
     * @param {string} userLastName    Required parameter: Your lastname
     * @param {string} accountName    Required parameter: Your delivery to value.
     * @param {string} country    Required parameter: Your country
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    createAccount : function(username, password, userPhone, userEmail, userFirstName, userLastName, accountName, country, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/account";
        
        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "username" : username,
            "password" : password,
            "user_phone" : userPhone,
            "user_email" : userEmail,
            "user_first_name" : userFirstName,
            "user_last_name" : userLastName,
            "account_name" : accountName,
            "country" : country
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
     * Send account activation token
     * @param {string} userPhone    Required parameter: Your phone number
     * @param {string} type    Required parameter: Activation type
     * @param {string} country    Required parameter: Your country
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    activationToken : function(userPhone, type, country, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/account-verify/send";
        
        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "user_phone" : userPhone,
            "type" : type,
            "country" : country
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
     * Verify new account
     * @param {string} activationToken    Required parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    verifyAccount : function(activationToken, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/account-verify/verify/{activation_token}";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "activation_token" : activationToken
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
     * Forgot username
     * @param {string|null} email    Optional parameter: TODO: type description here
     * @param {string|null} phoneNumber    Optional parameter: TODO: type description here
     * @param {string|null} country    Optional parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    forgotUsername : function(email, phoneNumber, country, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/forgot-username";
        
        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "email" : email,
            "phone_number" : phoneNumber,
            "country" : country
        });

        //validate and preprocess url
        var queryUrl = APIHelper.cleanUrl(queryBuilder);
        
        //Construct the request
        var options = {
            queryUrl: queryUrl,
            method: "PUT",
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
     * Forgot password
     * @param {string} username    Required parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    forgotPassword : function(username, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/forgot-password";
        
        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "username" : username
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
     * Verify forgot password
     * @param {int} subaccountId    Required parameter: Your subaccount id.
     * @param {string} activationToken    Required parameter: Your email activation token.
     * @param {string} password    Required parameter: Your new password.
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    verifyForgotPassword : function(subaccountId, activationToken, password, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/forgot-password/verify";
        
        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "subaccount_id" : subaccountId,
            "activation_token" : activationToken,
            "password" : password
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

module.exports = AccountController;