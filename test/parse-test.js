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










/*


describe('date.forceCurrentWeek()', function(){
    var force = parse.date.forceCurrentWeek;

    it('should parse Thursday 9-22-16 as Thursday 9-28-16', function(){
        expect(force('09-22-16')).to.equal('2016-09-28');
    });
});



*/























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























describe('date.identify()', function(){
    var id = parse.date.identify;

    it('should parse \'\' as empty', function(){
        expect(id('')).to.equal('empty');
    });
    it('should parse \"\" as empty', function(){
        expect(id("")).to.equal('empty');
    });
    it('should parse undefined as empty', function(){
        expect(id(undefined)).to.equal('empty');
    });
    it('should parse null as empty', function(){
        expect(id(null)).to.equal('empty');
    });
    it('should parse NaN as empty', function(){
        expect(id('')).to.equal('empty');
    });
    it('should parse false as empty', function(){
        expect(id('')).to.equal('empty');
    });
    it('should fail to parse []', function(){
        expect(id([])).to.not.be.ok;
    });
    it('should parse string 1483694977691 as unix', function(){
        expect(id('1483694977691')).to.equal('unix');
    });
    it('should parse string 1483695066 as unix', function(){
        expect(id('1483695066')).to.equal('unix');
    });
    it('should parse number 1313694977691 as unix', function(){
        expect(id(1313694977691)).to.equal('unix');
    });
    it('should parse number 1313695066 as unix', function(){
        expect(id(1313695066)).to.equal('unix');
    });
    it('should parse number 1 as unix', function(){
        expect(id(1)).to.equal('unix');
    });
    it('should parse number -1 as negative', function(){
        expect(id(-1)).to.equal('negative');
    });
    it('should parse number -10.1 as negative', function(){
        expect(id(-10.1)).to.equal('negative');
    });
    it('should parse 1-1-17 as iso', function(){
        expect(id('1-1-17')).to.equal('iso');
    });
    it('should parse 01-01-2017 as iso', function(){
        expect(id('01-01-2017')).to.equal('iso');
    });
    it('should parse 01-01-2017 as iso', function(){
        expect(id('01-01-2017')).to.equal('iso');
    });
    it('should parse {y,m,d,yyy,mm,dd,unix,iso,human} as full', function(){
        expect(id({
            y: 1,
            m: 1,
            d: 1,
            yyyy: 1,
            mm: 1,
            dd: 1,
            unix: 1,
            iso: 1,
            human: 1
        })).to.equal('full');
    });
    it('should parse {y,m,d} as raw', function(){
        expect(id({
            y: 1,
            m: 1,
            d: 1,
        })).to.equal('raw');
    });
    it('should parse {y,m,d,unix} as raw', function(){
        expect(id({
            y: 1,
            m: 1,
            d: 1,
            unix: 1,
        })).to.equal('raw');
    });
    it('should parse {yyyy,mm,dd} as raw-p', function(){
        expect(id({
            yyyy: 1,
            mm: 1,
            dd: 1,
        })).to.equal('raw-p');
    });
    it('should parse {iso} as iso', function(){
        expect(id({
            iso: 1,
        })).to.equal('iso');
    });
    it('should parse {unix} as unix', function(){
        expect(id({
            unix: 1,
        })).to.equal('unix');
    });
    it('should parse {potato} as empty', function(){
        expect(id({potato: 1})).to.equal('empty');
    });


});






















describe('date.convertToRaw()', function(){
    var raw = parse.date.convertToRaw;

    it('should parse \'\' as -1', function(){
        expect(raw('')).to.equal(-1);
    });
    it('should parse \"\" as -1', function(){
        expect(raw("")).to.equal(-1);
    });
    it('should parse undefined as -1', function(){
        expect(raw(undefined)).to.equal(-1);
    });
    it('should parse null as -1', function(){
        expect(raw(null)).to.equal(-1);
    });
    it('should parse NaN as -1', function(){
        expect(raw('')).to.equal(-1);
    });
    it('should parse false as -1', function(){
        expect(raw('')).to.equal(-1);
    });
    it('should parse {y,m,d,yyy,mm,dd,unix,iso,human} as self', function(){
        var stamp = {
            y: 1,
            m: 1,
            d: 1,
            yyyy: 1,
            mm: 1,
            dd: 1,
            unix: 1,
            iso: 1,
            human: 1
        };
        expect(raw(stamp)).to.deep.equal(stamp);
    });
    it('should parse {y: 16, m: 5, d: 20} as ', function(){
        var stamp = {
            y: 16,
            m: 5,
            d: 20,
        };
        console.log(parse.date.identify(stamp));
        expect(raw(stamp)).to.deep.equal(stamp);
    });
    it('should parse 5-20-16 as ', function(){
        var stamp = {
            iso: '5-20-2016'
        };
        console.log(parse.date.identify(stamp));
        expect(raw(stamp)).to.deep.equal(stamp);
    });


});

























