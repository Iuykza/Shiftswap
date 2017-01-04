var expect = require('chai').expect,
    parse  = require('../app/shiftswap/parse'),
    pad    = require('pad')
;









describe('parse library', function(){
    var library = parse;
    it('should exist', function(){ expect(library).to.be.ok; });
    it('should contain method time', function(){ expect(library.time).to.be.ok; });
    it('should contain method date', function(){ expect(library.date).to.be.ok; });
    it('should contain method military', function(){ expect(library.military).to.be.ok; });

});





describe('time()', function(){
    var time = parse.time;
    it('should fail to parse undefined', function(){
        expect(time()).to.not.be.ok;
    });

    it('should fail to parse empty string', function(){
        expect(time('')).to.not.be.ok;
    });

    it('should fail to parse an object', function(){
        expect(time({})).to.not.be.ok;
    });

    it('should fail to parse letter A', function(){
        expect(time('A')).to.not.be.ok;
    });

    it('should fail to parse am', function(){
        expect(time('am')).to.not.be.ok;
    });

    it('should fail to parse :::', function(){
        expect(time(':::')).to.not.be.ok;
    });

    it('should fail to parse 5', function(){
        expect(time('5')).to.not.be.ok;
    });

    it('should fail to parse a date 5/10', function(){
        expect(time('5/10')).to.not.be.ok;
    });

    it('should fail to parse a date 5/10am', function(){
        expect(time('5/10am')).to.not.be.ok;
    });

    it('should fail to parse out of range 1:60', function(){
        expect(time('1:60')).to.not.be.ok;
    });

    it('should fail to parse out of range 1:60am', function(){
        expect(time('1:60am')).to.not.be.ok;
    });

    it('should fail to parse out of range 1:-1am', function(){
        expect(time('-1:-1am')).to.not.be.ok;
    });

    it('should fail to parse out of range -1:00am', function(){
        expect(time('-1:00am')).to.not.be.ok;
    });

    it('should fail to parse out of range 13:00am', function(){
        expect(time('13:00am')).to.not.be.ok;
    });

    it('should fail to parse missing am/pm 2:00', function(){
        expect(time('1:60am')).to.not.be.ok;
    });

    it('should fail to parse ambiguous 2:10:30am', function(){
        expect(time('2:10:30am')).to.not.be.ok;
    });

    it('should parse lazy 5:1am as 0501', function(){
        expect(time('5:1am')).to.equal('0501');
    });

    it('should parse lazy 5 01am as 0501', function(){
        expect(time('5 01am')).to.equal('0501');
    });

     it('should parse 1:11am as 0111', function(){
        expect(time('1:11am')).to.equal('0111');
    });

    it('should parse 5:00am as 0500', function(){
        expect(time('5:00am')).to.equal('0500');
    });

    it('should parse 5:59am as 0559', function(){
        expect(time('5:59am')).to.equal('0559');
    });

    it('should parse 9:00am as 0900', function(){
        expect(time('9:00am')).to.equal('0900');
    });

    it('should parse 11:00am as 1100', function(){
        expect(time('11:00am')).to.equal('1100');
    });

    it('should parse 12:00am as 0000', function(){
        expect(time('12:00am')).to.equal('0000');
    });

    it('should parse 12:00pm as 1200', function(){
        expect(time('12:00pm')).to.equal('1200');
    });

    it('should parse 1:00pm as 1300', function(){
        expect(time('1:00pm')).to.equal('1300');
    });

    it('should parse 1:23pm as 1323', function(){
        expect(time('1:23pm')).to.equal('1323');
    });

    it('should fail to parse out of range -1', function(){
        expect(time(-1)).to.not.be.ok;
    });

    it('should fail to parse out of range -900', function(){
        expect(time(-900)).to.not.be.ok;
    });

    it('should fail to parse out of range 990', function(){
        expect(time(990)).to.not.be.ok;
    });

    it('should parse 0000 as 0000', function(){
        expect(time('0000')).to.equal('0000'); //WARN: literal integers with a leftmost 0 are interpreted as octal numbers.
    });                                      //http://stackoverflow.com/a/27871169/4147786

    it('should parse 0001 as 0001', function(){
        expect(time('0001')).to.equal('0001');
    });

    it('should parse 0011 as 0011', function(){
        expect(time(11)).to.equal('0011');
    });

    it('should parse number 0900 as 0900', function(){
        expect(time(900)).to.equal('0900');
    });

    it('should parse string 0900 as 0900', function(){
        expect(time('0900')).to.equal('0900');
    });

    it('should parse 1200 as 1200', function(){
        expect(time(1200)).to.equal('1200');
    });

    it('should parse 1235 as 1235', function(){
        expect(time(1235)).to.equal('1235');
    });
});











describe('date.iso()', function(){
    var date = parse.date.iso;
    
    it('should fail to parse object', function(){
        expect(date({})).to.not.be.ok;
    });

    it('should fail to parse letter A', function(){
        expect(date('A')).to.not.be.ok;
    });

    it('should fail to parse time 5:30', function(){
        expect(date('5:30')).to.not.be.ok;
    });

    it('should parse 10-3-15 as 2015-10-03', function(){
        expect(date('10-3-15')).to.equal('2015-10-03');
    });

    it('should parse 2015-10-3 as 2015-10-03', function(){
        expect(date('2015-10-3')).to.equal('2015-10-03');
    });

    it('should parse no argument as today', function(){
        var d = new Date();
        var today = pad(2,d.getUTCFullYear() ,'0')+'-'+
                    pad(2,d.getUTCMonth()+1  ,'0')+'-'+
                    pad(2,d.getUTCDate()     ,'0');
        expect(date()).to.equal(today);
    });

    it('should parse unix timestamp 994827600000 as 2001-07-11', function(){
        expect(date(994827600000)).to.equal('2001-07-11');
    });

});








describe('date.multi()', function(){
    var multi = parse.date.multi;

    it('should parse 10-3-15 as 2015-10-03, 1443830400, and October 10th 2015', function(){
        expect(multi('10-3-15')).to.eql({
            iso:   '2015-10-03',
            unix:  1443848400,
            human: 'Saturday, October 3rd 2015',
        });
    });
});










describe('date.forceCurrentWeek()', function(){
    var force = parse.date.forceCurrentWeek;

    it('should parse Thursday 9-22-16 as Thursday 9-28-16', function(){
        expect(force('09-22-16')).to.equal('2016-09-28');
    });
});











describe('military.pad()', function(){
    var pad = parse.military.pad;

    it('should fail to parse undefined', function(){
        expect(pad()).to.not.be.ok;
    });

    it('should fail to parse empty', function(){
        expect(pad('')).to.not.be.ok;
    });

    it('should fail to parse empty object', function(){
        expect(pad({})).to.not.be.ok;
    });

    it('should fail to parse partial object', function(){
        expect(pad({h:10})).to.not.be.ok;
    });

    it('should fail to parse out of range 25,00', function(){
        expect(pad(25,00)).to.not.be.ok;
    });

    it('should fail to parse out of range -1,00', function(){
        expect(pad(-1,00)).to.not.be.ok;
    });

    it('should fail to parse out of range 12,-1', function(){
        expect(pad(12,-1)).to.not.be.ok;
    });

    it('should fail to parse out of range 12,60', function(){
        expect(pad(12,60)).to.not.be.ok;
    });

    it('should parse object {2,30} as 230', function(){
        expect(pad({h:2,m:30})).to.equal('0230');
    });

    it('should parse string 2,30 as 230', function(){
        expect(pad('2','30')).to.equal('0230');
    });

    it('should parse number 0,0 as 0000', function(){
        expect(pad(0,0)).to.equal('0000');
    });

    it('should parse number 0,1 as 0001', function(){
        expect(pad(0,1)).to.equal('0001');
    });

    it('should parse number 5,30 as 0530', function(){
        expect(pad(5,30)).to.equal('0530');
    });

    it('should parse number 12,31 as 1231', function(){
        expect(pad(12,31)).to.equal('1231');
    });

    it('should parse number 23,59 as 2359', function(){
        expect(pad(23,59)).to.equal('2359');
    });

});

