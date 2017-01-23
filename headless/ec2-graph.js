
var Nightmare = require('nightmare');
var nightmare = Nightmare({show: true, typeInterval: 1});
var cheerio = require('cheerio');
var config = require('app/_config/aws-ec2.json');
var fs = require('fs');


if(!config || !config.user || !config.pass){
    return console.error(
        'Please create a config file in app/_config/aws-ec2.json.\n'+
        'It should be an object with user and pass.');
}


var dom = {
    user:         '#ap_email',
    pass:         '#ap_password',
    existingUser: 'label[for=ap_signin_existing_radio',
    submit:       '#signInSubmit-input',

    ec2: '.recent-services div:nth-child(1) a',
    reports: '.BVG .PUG:nth-child(1) > a:nth-child(4)',

    interactiveReport: '.I0G .N0G:nth-child(5) a.gwt-Anchor',
    dropDownTimeRange: '.GLX-KBNDOSD .GLX-KBNDGBE',
    dropDownTimeRangeMonth: 'body > div:last-child .popupContent .GLX-KBNDNQD .GLX-KBNDBRD:nth-child(5)',
    dropDownUnit: '.GLX-KBNDGAE tr td:nth-child(5) div',
    dropDownUnitCost: 'body > div:last-child .GLX-KBNDNQD div:nth-child(2)',
    buttonUpdate: '.GLX-KBNDHAE button:nth-child(2)',
    graph: '#gwt-uid-258 canvas.flot-base',


};

var sites = {
    login: 'http://console.aws.amazon.com/ec2',
    reports: '/ec2/v2/home?region=us-east-1#Reports',
    cost: 'https://console.aws.amazon.com/ec2-reports/?breadCrumb=EC2Console#InstanceUsage:Range=THIS_MONTH;GroupBy=NONE;Units=Cost;granularity=Daily',

};

nightmare
    .goto(sites.login)
    .type(dom.user, config.user)
    .type(dom.pass, config.pass)
    .click(dom.existingUser)
    .click(dom.submit)

    .wait(dom.reports)
    .click(dom.reports)

    .wait(dom.interactiveReport)
    .click(dom.interactiveReport)

    .wait(dom.dropDownTimeRange)
    .wait(3000)
    .click(dom.dropDownTimeRange)
    .click(dom.dropDownTimeRangeMonth)
    .click(dom.dropDownUnit)
    .click(dom.dropDownUnitCost)

    .wait(1000)
    .click(dom.buttonUpdate)

    .wait(1000)
    .viewport(900, 640)
    .wait(dom.graph)
    .evaluate(function(){
        $('*').css('visibility','hidden');
        $('.GLX-KBNDMQD .flot-base').css({
            'visibility': 'visible',
            'position': 'fixed',
            'top': 0,
            'left': 0,
        });

        var graph = document.querySelector('.GLX-KBNDMQD .flot-base');
        graph.scrollIntoView();
    })
    .screenshot('./graph.png')
    .evaluate(function(){
        var graph = document.querySelector('.GLX-KBNDMQD .flot-base');
        var total = $('.GLX-KBNDMND.GLX-KBNDNAE td:nth-child(2) div').text();
        return {
            total: total,
            graph: graph.toDataURL(),
        };
    })
    .end()
    .then(function(data){
        console.log(data);
        fs.writeFileSync('graph.txt', JSON.stringify(data));
    })
    .catch(function(err){
        throw console.error(err);
    });
