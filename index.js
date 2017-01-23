//index.js
var colors = require("colors"),
Q          = require("q"),

server     = require("app/shiftswap/server.js"),
app        = server.app,
conn       = server.conn,
ready      = server.ready,

route      = require("app/shiftswap/routes.js")
;



Q.all([ready.mongo.promise, ready.express.promise]).then(function () {
    console.log("All systems are go!");
});



/*********** Routes ***********/
const VERSION = server.config.server.version;
var home = route.home,
user     = route.user,
schedule = route.schedule,
stats    = route.stats,
trade    = route.trade,
history  = route.history,
reward   = route.reward,
sms      = route.sms,
voice    = route.voice
;

app.get ('/'                                             , home.welcome)    // serves the welcome page
.get    ('/'+VERSION                                     , home.welcome)    // serves the welcome page
.get    ('/'+VERSION+'/time'                             , home.time)       // gets the time
.get    ('/'+VERSION+'/echo/:str'                        , home.echo)       // gets the same string back
.get    ('/'+VERSION+'/whoami'                           , home.whoami)     // gets information on self

.get    ('/'+VERSION+'/user(s)?/:uid'                    , user.userid)     // get a user
.get    ('/'+VERSION+'/user(s)?'                         , user.all)        // get all users
.post   ('/'+VERSION+'/user(s)?'                         , user.post)       // make a user
.patch  ('/'+VERSION+'/user(s)?/:uid'                    , user.patch)      // edit a user
.delete ('/'+VERSION+'/user(s)?/:uid'                    , user.del)        // delete a user (auth)

//WARN: Order matters.  More specific paths must stay on top.
//Day, count, access.
//uid will always be month.
//access will be 
.get    ('/'+VERSION+'/schedule(s)?/access/:access/day/:day' , schedule.get)// get  x day     x schedule
.get    ('/'+VERSION+'/schedule(s)?/access/:access'      , schedule.get)    // get 14 day     x schedule
.get    ('/'+VERSION+'/schedule(s)?'                     , schedule.get)    // get 14 day floor schedule

.get    ('/'+VERSION+'/schedule(s)?/uid/:uid/day/:day'   , schedule.userid) // get    x month schedule of specific user
.get    ('/'+VERSION+'/schedule(s)?/uid/:uid/'           , schedule.userid) // get this month schedule of specific user
.post   ('/'+VERSION+'/schedule(s)?'                     , schedule.post)   // create schedule (auth)
.delete ('/'+VERSION+'/schedule(s)?/:sid'                , schedule.delete) // delete schedule (auth)

.get    ('/'+VERSION+'/trade(s)?'                        , trade.all)       // get all shift-trades
.post   ('/'+VERSION+'/trade(s)?'                        , trade.post)      // give shift
.put    ('/'+VERSION+'/trade(s)?/take/:tid'              , trade.take)      // take shift
.put    ('/'+VERSION+'/trade(s)?/admin/:tid'             , trade.admin)     // operate admin controls (usually trade-accepts by manager)

.get    ('/'+VERSION+'/stat(s)?'                         , stats.get)       // get all stats
.put    ('/'+VERSION+'/stat(s)?'                         , stats.put)       // submit a stat
.delete ('/'+VERSION+'/stat(s)?'                         , stats.delete)    // remove stats that belong to a particular user

.get    ('/'+VERSION+'/histor(y|ies)'                    , history.all)     // get all history
.patch  ('/'+VERSION+'/histor(y|ies)'                    , history.comment) // make comment to history

.get    ('/'+VERSION+'/reward(s)?'                       , reward.all)      // get candy-stash rewards
.patch  ('/'+VERSION+'/reward(s)?'                       , reward.take)     // take a candy
.post   ('/'+VERSION+'/reward(s)?/admin'                 , reward.edit)     // edit the stash (admin)

.get    ('/'+VERSION+'/sms/send/:number/:msg'            , sms.send)        // send sms
.get    ('/'+VERSION+'/sms/poll/test/:number/:msg'       , sms.test)        // receive sms (test)
.post   ('/'+VERSION+'/sms/poll'                         , sms.poll)        // receive sms
;