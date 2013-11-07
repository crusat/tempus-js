(function() {
    function isLeapYear(year) {
    if (year % 4 == 0) {
        if (year % 100 == 0) {
            return year % 400 == 0;
        } else return true;
    }
    return false;
}
    // prepare for tests
    var today = new Date(); // current day
    var dd = today.getDate(); // day. Begin from 1.
    var mm = today.getMonth()+1; // month. Begin from 0.
    var yyyy = today.getFullYear();

    // tests
    test('tempus.time', function () {
        equal(tempus.time(), Math.floor(new Date((new Date()).getTime() - (new Date()).getTimezoneOffset() * 60000) / 1000), 'Current UTC');
        equal(typeof tempus.time(), 'number', 'Type is number');
    });

    test('tempus.isLeapYear', function () {
        equal(tempus.isLeapYear(), isLeapYear(yyyy), 'Current year is leap or not leap');
        equal(tempus.isLeapYear(2013), false, '2013 is not leap year');
        equal(tempus.isLeapYear(2012), true, '2012 is leap year');
        equal(tempus.isLeapYear(2000), true, '2000 is leap year');
        equal(tempus.isLeapYear(1900), false, '1900 is not leap year');
        equal(tempus.isLeapYear(1904), true, '1904 is leap year');
        equal(tempus.isLeapYear(1905), false, '1905 is not leap year');
        equal(typeof tempus.isLeapYear(), 'boolean', 'Type is boolean');
        for (var year = 1800; year <= yyyy; year++) {
            equal(tempus.isLeapYear(year), isLeapYear(year), 'Dynamic test, year: ' + year);
        }
    });

    test('tempus.format', function () {
        equal(tempus.format({year: 2013, month: 11, day:5}, '%d.%m.%Y'), '05.11.2013', 'Date format');
        equal(tempus.format({year: 2000, month: 10, day:1, hours: 10, minutes: 0, seconds: 0}, '%Y-%m-%d %H:%M:%S'), '2000-10-01 10:00:00', 'Date and time format');
        equal(tempus.format({year: 2000}, '%Y-%m-%d %H:%M:%S'), '2000-01-01 00:00:00', 'Enough date and time format');
        equal(typeof tempus.format({year: 2013, month: 11, day:5}, '%d.%m.%Y'), 'string', 'Type is string');
    });

    test('tempus.getDaysCountInMonth', function () {
        equal(tempus.getDaysCountInMonth(11, 2013), 30, 'Days count - november 2013');
        equal(tempus.getDaysCountInMonth(2, 2012), 29, 'Days count, leap year, february 2012.');
        equal(tempus.getDaysCountInMonth(2, 2013), 28, 'Days count, not leap year, february 2013');
        equal(typeof tempus.getDaysCountInMonth(2, 2013), 'number', 'Type is number');
    });

    test('tempus.getMonthNames', function () {
        deepEqual(tempus.getMonthNames(), ["Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"], 'Month short names');
        deepEqual(tempus.getMonthNames(true), ["January","February","March","April","May","June",
            "July","August","September","October","November","December"], 'Month long names');
        equal(typeof tempus.getMonthNames(), 'object', 'Type is object (array)');
    });

    test('tempus.getDayNames', function () {
        deepEqual(tempus.getDayNames(), ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], 'Day short names');
        deepEqual(tempus.getDayNames(true), ["Sunday","Monday","Tuesday","Wednesday",
            "Thursday","Friday","Saturday"], 'Day long names');
        equal(typeof tempus.getDayNames(), 'object', 'Type is object (array)');
    });

    test('tempus.getDayOfWeek', function () {
        equal(tempus.getDayOfWeek({year: 2013, month: 10, day: 5}), 6, 'Day of week test');
        equal(tempus.getDayOfWeek({year: 2013, month: 10, day: 6}), 0, 'Day of week test');
        equal(tempus.getDayOfWeek({year: 2014, month: 1, day: 1}), 3, 'Day of week test');
        equal(typeof tempus.getDayOfWeek({year: 2014, month: 1, day: 1}), 'number', 'Type is number');
    });

    test('tempus.incDate', function () {
        deepEqual(tempus.incDate({year: 2013, month: 10, day: 5}, 7, 'day'),
            {"year":2013,"month":10,"day":12,"hours":0,"minutes":0,"seconds":0}, 'Date increment');
        deepEqual(tempus.incDate({year: 2013, month: 10, day: 25}, 80, 'day'),
            {"year":2014,"month":1,"day":13,"hours":0,"minutes":0,"seconds":0}, 'Date increment');
        deepEqual(tempus.incDate({year: 2013, month: 1, day: 30}, 11, 'month'),
            {"year":2013,"month":12,"day":30,"hours":0,"minutes":0,"seconds":0}, 'Date increment');
        deepEqual(tempus.incDate({year: 2000, month: 1, day: 1}, 15, 'year'),
            {"year":2015,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0}, 'Date increment');
        equal(typeof tempus.incDate({year: 2000, month: 1, day: 1}, 15, 'year'), 'object', 'Type is object');
    });

    test('tempus.decDate', function () {
        deepEqual(tempus.decDate({year: 2013, month: 10, day: 5}, 7, 'day'),
            {"year":2013,"month":9,"day":28,"hours":0,"minutes":0,"seconds":0}, 'Date decrement');
        deepEqual(tempus.decDate({year: 2013, month: 10, day: 25}, 80, 'day'),
            {"year":2013,"month":8,"day":6,"hours":0,"minutes":0,"seconds":0}, 'Date decrement');
        deepEqual(tempus.decDate({year: 2013, month: 1, day: 1}, 11, 'month'),
            {"year":2012,"month":2,"day":1,"hours":0,"minutes":0,"seconds":0}, 'Date decrement');
        deepEqual(tempus.decDate({year: 2000, month: 1, day: 1}, 15, 'year'),
            {"year":1985,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0}, 'Date decrement');
        equal(typeof tempus.decDate({year: 2000, month: 1, day: 1}, 15, 'year'), 'object', 'Type is object');
    });

    test('tempus.between', function () {
        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2013, month: 11, day: 5}, 'day'), 4, 'Between');
        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2014, month: 5, day: 5}, 'month'), 6, 'Between');
        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2014, month: 5, day: 5}, 'minutes'), 266400, 'Between');
        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2015, month: 1, day: 1}, 'hours'), 10224, 'Between');
        equal(typeof tempus.between({year: 2013, month: 11, day: 1}, {year: 2015, month: 1, day: 1}, 'hours'), 'number', 'Type is number');
    });

    test('tempus.parse', function () {
        deepEqual(tempus.parse('21.10.2013', '%d.%m.%Y'),
            {"day":21,"month":10,"year":2013,"hours":0,"minutes":0,"seconds":0}, 'Parse');
        deepEqual(tempus.parse('20131005162015', '%Y%m%d%H%M%S'),
            {"day":5,"month":10,"year":2013,"hours":16,"minutes":20,"seconds":15}, 'Parse');
        equal(typeof tempus.parse('20131005162015', '%Y%m%d%H%M%S'), 'object', 'Type is object');
    });

    test('tempus.normalizeDate', function () {
        deepEqual(tempus.normalizeDate({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}),
            {"day":1,"month":1,"year":2014,"hours":0,"minutes":0,"seconds":0}, 'Normalize date');
        deepEqual(tempus.normalizeDate({day:46,month:13,year:2013,hours:0,minutes:0,seconds:0}),
            {"day":15,"month":2,"year":2014,"hours":0,"minutes":0,"seconds":0}, 'Normalize date');
        deepEqual(tempus.normalizeDate({day:32,month:-5,year:2013,hours:55,minutes:0,seconds:-2}),
            {"day":3,"month":8,"year":2012,"hours":6,"minutes":59,"seconds":58}, 'Normalize date');
        deepEqual(tempus.normalizeDate({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}),
            {"day":19,"month":3,"year":2013,"hours":23,"minutes":0,"seconds":0}, 'Normalize date');
        equal(typeof tempus.normalizeDate({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}), 'object', 'Type is object');
    });

    test('tempus.validate', function () {
        equal(tempus.validate({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}), false, 'validate');
        equal(tempus.validate({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}), false, 'validate');
        equal(tempus.validate({day:1,month:1,year:2013,hours:0,minutes:0,seconds:0}), true, 'validate');
        equal(tempus.validate('2013-03-12', '%Y-%m-%d'), true, 'validate');
        equal(tempus.validate('16:00 08.08.2013', '%H:%M %d.%m.%Y'), true, 'validate');
        equal(tempus.validate('32.08.2013', '%d.%m.%Y'), false, 'validate');
        equal(tempus.validate('29.02.2013', '%d.%m.%Y'), false, 'validate');
        equal(tempus.validate('29.02.2012', '%d.%m.%Y'), true, 'validate');
        equal(tempus.validate('24:61 29.02.2012', '%H:%M %d.%m.%Y'), false, 'validate');
        equal(tempus.validate('00:00 01.01.2012', '%H:%M %d.%m.%Y'), true, 'validate');
        equal(typeof tempus.validate({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}), 'boolean', 'Type is boolean');
    });

    test('tempus.reformat', function () {
        equal(tempus.reformat('2013-03-12', '%Y-%m-%d', '%d.%m.%Y'), "12.03.2013", 'reformat');
        equal(tempus.reformat('2013-03-15 16:00', '%Y-%m-%d %H:%M', '%d.%m.%Y'), "15.03.2013", 'reformat');
        equal(tempus.reformat('2013-03-15T12:31:48', '%Y-%m-%dT%H:%M:%S', '%H:%M (%a %d, %Y)'), "12:31 (Fri 15, 2013)", 'reformat');
        equal(typeof tempus.reformat('2013-03-12', '%Y-%m-%d', '%d.%m.%Y'), 'string', 'Type is string');
    });
})();






//test('$.datetime.format()', function () {
//    equal($.datetime.format('%d.%m.%Y', 1363046400), '12.03.2013', 'Format test 1');
//    equal($.datetime.format('%a %d, %Y', 1363046400), 'Tue 12, 2013', 'Format test 2');
//});
//
//test('$.datetime.reformat()', function () {
//    equal($.datetime.reformat('2013-03-12', '%d.%m.%Y'), '12.03.2013', 'Reformat test 1');
//    equal($.datetime.reformat('2013-03-15 16:00', '%d.%m.%Y', '%Y-%m-%d %H:%M'), '15.03.2013', 'Reformat test 2');
//    equal($.datetime.reformat('2013-03-15T12:31:48', '%H:%M (%a %d, %Y)', '%Y-%m-%dT%H:%M:%S'), '12:31 (Fri 15, 2013)', 'Reformat test 3');
//});
//
//test('$.datetime.strtotime()', function () {
//    equal($.datetime.strtotime('2013-03-12'), 1363046400, 'String to timestamp test 1');
//    equal($.datetime.strtotime('2013-03-15 16:00', '%Y-%m-%d %H:%M'), 1363348800, 'String to timestamp test 2');
//});
//
//test('$.datetime.validate()', function () {
//    equal($.datetime.validate('2013-03-12', '%Y-%m-%d'), true, 'Validate date/time by format test 1');
//    equal($.datetime.validate('16:00 08.08.2013', '%H:%M %d.%m.%Y'), true, 'Validate date/time by format test 2');
//    equal($.datetime.validate('32.08.2013', '%d.%m.%Y'), false, 'Validate date/time by format test 3');
//    equal($.datetime.validate('29.02.2013', '%d.%m.%Y'), false, 'Validate date/time by format test 4 (not leap year)');
//    equal($.datetime.validate('29.02.2012', '%d.%m.%Y'), true, 'Validate date/time by format test 5 (leap year)');
//    equal($.datetime.validate('24:61 29.02.2012', '%H:%M %d.%m.%Y'), false, 'Validate date/time by format test 6');
//    equal($.datetime.validate('00:00 01.01.2012', '%H:%M %d.%m.%Y'), true, 'Validate date/time by format test 7');
//    equal($.datetime.validate('08.08.2013', '%d.%m.%Y', {year: {min:1970, max: 2038}}), true, 'Validate date/time by format with ranges test 1');
//    equal($.datetime.validate('08.08.1961', '%d.%m.%Y', {year: {min:1970, max: 2038}}), false, 'Validate date/time by format with ranges test 2');
//    equal($.datetime.validate('', '%d.%m.%Y', {year: {min:1970, max: 2038}}, true), true, 'Validate date/time by format with ranges - empty value');
//});