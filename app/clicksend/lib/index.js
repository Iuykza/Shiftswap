/**
  * @module clicksend
  *  
  * Clicksend v3 API
  */

var configuration = require('./configuration'),
    CountriesController = require('./Controllers/CountriesController'),
    SMSController = require('./Controllers/SMSController'),
    VoiceController = require('./Controllers/VoiceController'),
    AccountController = require('./Controllers/AccountController'),
    SubaccountController = require('./Controllers/SubaccountController'),
    ContactListController = require('./Controllers/ContactListController'),
    ContactController = require('./Controllers/ContactController'),
    NumberController = require('./Controllers/NumberController'),
    StatisticsController = require('./Controllers/StatisticsController'),
    EmailToSmsController = require('./Controllers/EmailToSmsController'),
    SearchController = require('./Controllers/SearchController'),
    ReferralAccountController = require('./Controllers/ReferralAccountController'),
    ResellerAccountController = require('./Controllers/ResellerAccountController'),
    TransferCreditController = require('./Controllers/TransferCreditController'),
    FaxController = require('./Controllers/FaxController'),
    AccountRechargeController = require('./Controllers/AccountRechargeController'),
    SmsCampaignController = require('./Controllers/SmsCampaignController'),
    PostLetterController = require('./Controllers/PostLetterController'),
    PostReturnAddressController = require('./Controllers/PostReturnAddressController'),
    UploadController = require('./Controllers/UploadController');


function initializer(){}

//Main functional components of clicksend
initializer.configuration = configuration;
initializer.CountriesController = CountriesController;
initializer.SMSController = SMSController;
initializer.VoiceController = VoiceController;
initializer.AccountController = AccountController;
initializer.SubaccountController = SubaccountController;
initializer.ContactListController = ContactListController;
initializer.ContactController = ContactController;
initializer.NumberController = NumberController;
initializer.StatisticsController = StatisticsController;
initializer.EmailToSmsController = EmailToSmsController;
initializer.SearchController = SearchController;
initializer.ReferralAccountController = ReferralAccountController;
initializer.ResellerAccountController = ResellerAccountController;
initializer.TransferCreditController = TransferCreditController;
initializer.FaxController = FaxController;
initializer.AccountRechargeController = AccountRechargeController;
initializer.SmsCampaignController = SmsCampaignController;
initializer.PostLetterController = PostLetterController;
initializer.PostReturnAddressController = PostReturnAddressController;
initializer.UploadController = UploadController;

//Main Models of clicksend

module.exports = initializer;