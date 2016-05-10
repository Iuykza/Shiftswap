/**
 * clicksend
 *
 * This file was automatically generated for ClickSend by APIMATIC v2.0 on 04/18/2016
 */

var request = require('../Http/Client/RequestClient'),
    configuration = require('../configuration'),
    APIHelper = require('../APIHelper');

var ContactController = {

    /**
     * Get all contacts in a list
     * @param {int} listId    Required parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    getContacts : function(listId, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/lists/{list_id}/contacts";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "list_id" : listId
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
     * Create new contact
     * @param {int} listId    Required parameter: Your list_id
     * @param {string|null} phoneNumber    Optional parameter: Your phone number in E.164 format. Must be provided if no fax number or email.
     * @param {string|null} email    Optional parameter: Your email. Must be provided if no phone number or fax number.
     * @param {string|null} faxNumber    Optional parameter: You fax number. Must be provided if no phone number or email.
     * @param {string|null} firstName    Optional parameter: Your firstname.
     * @param {string|null} lastName    Optional parameter: Your lastname.
     * @param {string|null} addressLine1    Optional parameter: TODO: type description here
     * @param {string|null} addressLine2    Optional parameter: TODO: type description here
     * @param {string|null} addressCity    Optional parameter: TODO: type description here
     * @param {string|null} addressState    Optional parameter: TODO: type description here
     * @param {string|null} addressPostalCode    Optional parameter: TODO: type description here
     * @param {string|null} addressCountry    Optional parameter: TODO: type description here
     * @param {string|null} organizationName    Optional parameter: TODO: type description here
     * @param {string|null} custom1    Optional parameter: TODO: type description here
     * @param {string|null} custom2    Optional parameter: TODO: type description here
     * @param {string|null} custom3    Optional parameter: TODO: type description here
     * @param {string|null} custom4    Optional parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    createContact : function(listId, phoneNumber, email, faxNumber, firstName, lastName, addressLine1, addressLine2, addressCity, addressState, addressPostalCode, addressCountry, organizationName, custom1, custom2, custom3, custom4, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/lists/{list_id}/contacts";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "list_id" : listId
        });

        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "phone_number" : phoneNumber,
            "email" : email,
            "fax_number" : faxNumber,
            "first_name" : firstName,
            "last_name" : lastName,
            "address_line_1" : addressLine1,
            "address_line_2" : addressLine2,
            "address_city" : addressCity,
            "address_state" : addressState,
            "address_postal_code" : addressPostalCode,
            "address_country" : addressCountry,
            "organization_name" : organizationName,
            "custom_1" : custom1,
            "custom_2" : custom2,
            "custom_3" : custom3,
            "custom_4" : custom4
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
     * Get a specific contact
     * @param {int} listId    Required parameter: Your contact list id you want to access.
     * @param {int} contactId    Required parameter: Your contact id you want to access.
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    getContact : function(listId, contactId, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/lists/{list_id}/contacts/{contact_id}";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "list_id" : listId,
            "contact_id" : contactId
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
     * Update contact
     * @param {int} listId    Required parameter: Your list id
     * @param {int} contactId    Required parameter: Your contact id
     * @param {string|null} phoneNumber    Optional parameter: Your phone number in E.164 format.
     * @param {string|null} email    Optional parameter: Your email. Must be provided if no phone number or fax number.
     * @param {string|null} faxNumber    Optional parameter: You fax number. Must be provided if no phone number or email.
     * @param {string|null} firstName    Optional parameter: Your firstname
     * @param {string|null} lastName    Optional parameter: Your lastname
     * @param {string|null} addressLine1    Optional parameter: TODO: type description here
     * @param {string|null} addressLine2    Optional parameter: TODO: type description here
     * @param {string|null} addressCity    Optional parameter: TODO: type description here
     * @param {string|null} addressState    Optional parameter: TODO: type description here
     * @param {string|null} addressPostalCode    Optional parameter: TODO: type description here
     * @param {string|null} addressCountry    Optional parameter: TODO: type description here
     * @param {string|null} organizationName    Optional parameter: TODO: type description here
     * @param {string|null} custom1    Optional parameter: TODO: type description here
     * @param {string|null} custom2    Optional parameter: TODO: type description here
     * @param {string|null} custom3    Optional parameter: TODO: type description here
     * @param {string|null} custom4    Optional parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    updateContact : function(listId, contactId, phoneNumber, email, faxNumber, firstName, lastName, addressLine1, addressLine2, addressCity, addressState, addressPostalCode, addressCountry, organizationName, custom1, custom2, custom3, custom4, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/lists/{list_id}/contacts/{contact_id}";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "list_id" : listId,
            "contact_id" : contactId
        });

        //Process query parameters
        queryBuilder = APIHelper.appendUrlWithQueryParameters(queryBuilder, {
            "phone_number" : phoneNumber,
            "email" : email,
            "fax_number" : faxNumber,
            "first_name" : firstName,
            "last_name" : lastName,
            "address_line_1" : addressLine1,
            "address_line_2" : addressLine2,
            "address_city" : addressCity,
            "address_state" : addressState,
            "address_postal_code" : addressPostalCode,
            "address_country" : addressCountry,
            "organization_name" : organizationName,
            "custom_1" : custom1,
            "custom_2" : custom2,
            "custom_3" : custom3,
            "custom_4" : custom4
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
     * Delete a contact
     * @param {int} listId    Required parameter: TODO: type description here
     * @param {string} contactId    Required parameter: TODO: type description here
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    deleteContact : function(listId, contactId, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/lists/{list_id}/contacts/{contact_id}";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "list_id" : listId,
            "contact_id" : contactId
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
     * Remove all opted out contacts
     * @param {int} listId    Required parameter: Your list id
     * @param {int} optOutListId    Required parameter: Your opt out list id
     * @param {function} callback    Required parameter: Callback function in the form of function(error, response)
     *
     * @return {string}
     */
    removeOptedOutContacts : function(listId, optOutListId, callback){

        //prepare query string for API call;
        var baseUri = configuration.BASEURI;
        
        var queryBuilder = baseUri + "/lists/{list_id}/remove-opted-out-contacts/{opt_out_list_id}";
        
        //Process template parameters
        queryBuilder = APIHelper.appendUrlWithTemplateParameters(queryBuilder, {
            "list_id" : listId,
            "opt_out_list_id" : optOutListId
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

module.exports = ContactController;