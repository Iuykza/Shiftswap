var exports = module.exports = {
	user:     {},
	schedule: {},
	trade:    {},
	stat:     {},
	sms:      {},
};

exports.user.hello = function(callback){
	return callback('hello');
};