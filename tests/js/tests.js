(function() {
    function isLeapYear(year) {
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                return year % 400 == 0;
            } else return true;
        }
        return false;
    }

    function setLocaleTest(date, locale) {
        tempus.setLocale(locale);
        var t = tempus.format(date, '%Y, %B, %d, %A');
        tempus.setLocale();
        return t;
    }
    // prepare for tests
    var today = new Date(); // current day
    var dd = today.getDate(); // day. Begin from 1.
    var mm = today.getMonth()+1; // month. Begin from 0.
    var yyyy = today.getFullYear();
    var day, month, year, hours, minutes, seconds;



    test('Test now() method', function () {
        // check current date/time
        equal(tp().now().timestamp(), Math.floor(new Date().getTime() / 1000), 'Current UTC');
        equal(tp().now().year(), new Date().getFullYear(), 'Full year');
        equal(tp().now().month(), new Date().getMonth() + 1, 'Month');
        equal(tp().now().day(), new Date().getDate(), 'Day');
        equal(tp().now().hours(), new Date().getHours(), 'Hours');
        equal(tp().now().minutes(), new Date().getMinutes(), 'Minutes');
        equal(tp().now().seconds(), new Date().getSeconds(), 'Seconds');
        equal(tp().now().dayOfWeek(), new Date().getDay(), 'Day of week');
        // check types
        equal(typeof tp().now(), 'object', 'Type is object');
        equal(typeof tp().now().year(), 'number', 'Type is number');
        equal(typeof tp().now().month(), 'number', 'Type is number');
        equal(typeof tp().now().day(), 'number', 'Type is number');
        equal(typeof tp().now().hours(), 'number', 'Type is number');
        equal(typeof tp().now().minutes(), 'number', 'Type is number');
        equal(typeof tp().now().seconds(), 'number', 'Type is number');
        equal(typeof tp().now().dayOfWeek(), 'number', 'Type is number');
        equal(typeof tp().now().timestamp(), 'number', 'Type is number');
    });

    test('Test timestamps', function() {
        equal(tp().set({year: 2013, month: 11, day: 14}).timestamp(),
            new Date(2013, 10, 14).getTime() / 1000, 'Timestamp local: 2013-11-14 00:00:00');
        equal(tp().set({year: 2013, month: 11, day: 14}).UTC(),
            1384387200, 'Timestamp UTC: 2013-11-14 00:00:00');
    });

    test('Test base set() method', function () {
        deepEqual(tp(new Date(2013, 0, 1, 0, 0, 0, 0)).get(), tp({year: 2013, month: 1, day: 1, hours: 0, minutes: 0,
            seconds:0, milliseconds:0}).get(), 'Set new Date().');
        equal(typeof tp().get(), 'object', 'Type is object');
    });

    test('Test set() year ranges', function () {
        for (year = 100; year <= 3000; year++) {
            equal(tp().set({year: year}).year(), year, 'Year can be from 100 to 3000, else MIN_YEAR. Year: ' + year);
        }
        for (year = -100; year <= 99; year++) {
            equal(tp().set({year: year}).year(), 100, 'Year can not be 99 or less, else MIN_YEAR. Year: ' + year);
        }
        for (year = 3001; year <= 4000; year++) {
            equal(tp().set({year: year}).year(), 100, 'Year can not be 3001 or more, else MIN_YEAR. Year: ' + year);
        }
        equal(tp().set({}).year(), 100, 'If year is not setted, setting MIN_YEAR');
    });

    test('Test set() months ranges', function () {
        for (month = 1; month <= 12; month++) {
            equal(tp().set({month: month}).month(), month, 'Month can be from 1 to 12. Month: ' + month);
        }
        for (month = -100; month <= 0; month++) {
            equal(tp().set({month: month}).month(), 1, 'Month can not be 0 or less. Month: ' + month);
        }
        for (month = 13; month <= 100; month++) {
            equal(tp().set({month: month}).month(), 1, 'Month can not be 13 or more. Month: ' + month);
        }
        equal(tp().set({}).month(), 1, 'If month is not setted, setting MIN_MONTH');
    });

    test('Test set() day ranges', function () {
        // Not leap year check
        var dayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (month = 1; month <= 12; month++) {
            for (day = 1; day <= dayInMonth[month - 1]; day++) {
                equal(tp().set({year: 2001, month: month, day: day}).day(), day, 'Year: 2001. Day can be from 1 to X. Month: ' + month + '. Day:' + day);
            }
            for (day = -10; day <= 0; day++) {
                equal(tp().set({year: 2001, month: month, day: day}).day(), 1, 'Year: 2001. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
            for (day = dayInMonth[month - 1] + 1; day <= 40; day++) {
                equal(tp().set({year: 2001, month: month, day: day}).day(), 1, 'Year: 2001. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
        }
        // leap year check
        dayInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (month = 1; month <= 12; month++) {
            for (day = 1; day <= dayInMonth[month - 1]; day++) {
                equal(tp().set({year: 2012, month: month, day: day}).day(), day, 'Year: 2012. Day can be from 1 to X. Month: ' + month + '. Day:' + day);
            }
            for (day = -10; day <= 0; day++) {
                equal(tp().set({year: 2012, month: month, day: day}).day(), 1, 'Year: 2012. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
            for (day = dayInMonth[month - 1] + 1; day <= 40; day++) {
                equal(tp().set({year: 2012, month: month, day: day}).day(), 1, 'Year: 2012. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
        }
        equal(tp().set({}).day(), 1, 'If day is not setted, setting MIN_DAY');
    });

    test('Test set() hours ranges', function () {
        for (hours = 0; hours <= 23; hours++) {
            equal(tp().set({hours: hours}).hours(), hours, 'Hours can be from 0 to 23. Hours: ' + hours);
        }
        for (hours = -100; hours < 0; hours++) {
            equal(tp().set({hours: hours}).hours(), 0, 'Hours can not be 0 or less. Month: ' + hours);
        }
        for (hours = 24; hours <= 100; hours++) {
            equal(tp().set({hours: hours}).hours(), 0, 'Hours can not be 24 or more. Month: ' + hours);
        }
        equal(tp().set({}).hours(), 0, 'If hours is not setted, setting MIN_HOURS');
    });

    test('Test set() minutes ranges', function () {
        for (minutes = 0; minutes <= 59; minutes++) {
            equal(tp().set({minutes: minutes}).minutes(), minutes, 'Minutes can be from 0 to 59. Minutes: ' + minutes);
        }
        for (minutes = -100; minutes < 0; minutes++) {
            equal(tp().set({minutes: minutes}).minutes(), 0, 'Minutes can not be 0 or less. Minutes: ' + minutes);
        }
        for (minutes = 60; minutes <= 100; minutes++) {
            equal(tp().set({minutes: minutes}).minutes(), 0, 'Minutes can not be 59 or more. Minutes: ' + minutes);
        }
        equal(tp().set({}).minutes(), 0, 'If minutes is not setted, setting MIN_MINUTES');
    });

    test('Test set() seconds ranges', function () {
        for (seconds = 0; seconds <= 59; seconds++) {
            equal(tp().set({seconds: seconds}).seconds(), seconds, 'Seconds can be from 0 to 59. Minutes: ' + seconds);
        }
        for (seconds = -100; seconds < 0; seconds++) {
            equal(tp().set({seconds: seconds}).seconds(), 0, 'Seconds can not be 0 or less. Minutes: ' + seconds);
        }
        for (seconds = 60; seconds <= 100; seconds++) {
            equal(tp().set({seconds: seconds}).seconds(), 0, 'Seconds can not be 59 or more. Minutes: ' + seconds);
        }
        equal(tp().set({}).seconds(), 0, 'If seconds is not setted, setting MIN_SECONDS');
    });

    test('Test year() method', function () {
        // values
        equal(tp().year(2000).year(), 2000, 'Test value: 2000');
        equal(tp().year(1).year(), 1, 'Test value: 1');
        equal(tp().year(-15).year(), -15, 'Test value: -15');
        equal(tp().year('0').year(), 0, 'Test value: \'0\'');
        equal(tp().year({foo: 'bar'}).year(), undefined, 'Test value: {foo: \'bar\'}');
        equal(tp().year([1,2,3]).year(), undefined, 'Test value: [1,2,3]');
        equal(tp().year(undefined).year(), undefined, 'Test value: undefined');
        equal(tp().year(null).year(), undefined, 'Test value: null');
        equal(tp().year(true).year(), undefined, 'Test value: true');
        equal(tp().year(false).year(), undefined, 'Test value: false');
        // check types
        equal(typeof tp().year(2000).year(), 'number', 'Type is number');
    });

    test('Test month() method', function () {
        // values
        equal(tp().month(100).month(), 100, 'Test value: 100');
        equal(tp().month(12).month(), 12, 'Test value: 12');
        equal(tp().month(-5).month(), -5, 'Test value: -5');
        equal(tp().month('0').month(), 0, 'Test value: \'0\'');
        equal(tp().month({foo: 'bar'}).month(), undefined, 'Test value: {foo: \'bar\'}');
        equal(tp().month([1,2,3]).month(), undefined, 'Test value: [1,2,3]');
        equal(tp().month(undefined).month(), undefined, 'Test value: undefined');
        equal(tp().month(null).month(), undefined, 'Test value: null');
        equal(tp().month(true).month(), undefined, 'Test value: true');
        equal(tp().month(false).month(), undefined, 'Test value: false');
        // check types
        equal(typeof tp().month(1).month(), 'number', 'Type is number');
    });

    test('Test day() method', function () {
        // values
        equal(tp().day(100).day(), 100, 'Test value: 100');
        equal(tp().day(12).day(), 12, 'Test value: 12');
        equal(tp().day(-5).day(), -5, 'Test value: -5');
        equal(tp().day('0').day(), 0, 'Test value: \'0\'');
        equal(tp().day({foo: 'bar'}).day(), undefined, 'Test value: {foo: \'bar\'}');
        equal(tp().day([1,2,3]).day(), undefined, 'Test value: [1,2,3]');
        equal(tp().day(undefined).day(), undefined, 'Test value: undefined');
        equal(tp().day(null).day(), undefined, 'Test value: null');
        equal(tp().day(true).day(), undefined, 'Test value: true');
        equal(tp().day(false).day(), undefined, 'Test value: false');
        // check types
        equal(typeof tp().day(1).day(), 'number', 'Type is number');
    });

    test('Test hours() method', function () {
        // values
        equal(tp().hours(100).hours(), 100, 'Test value: 100');
        equal(tp().hours(12).hours(), 12, 'Test value: 12');
        equal(tp().hours(-5).hours(), -5, 'Test value: -5');
        equal(tp().hours('0').hours(), 0, 'Test value: \'0\'');
        equal(tp().hours({foo: 'bar'}).hours(), undefined, 'Test value: {foo: \'bar\'}');
        equal(tp().hours([1,2,3]).hours(), undefined, 'Test value: [1,2,3]');
        equal(tp().hours(undefined).hours(), undefined, 'Test value: undefined');
        equal(tp().hours(null).hours(), undefined, 'Test value: null');
        equal(tp().hours(true).hours(), undefined, 'Test value: true');
        equal(tp().hours(false).hours(), undefined, 'Test value: false');
        // check types
        equal(typeof tp().hours(1).hours(), 'number', 'Type is number');
    });

    test('Test minutes() method', function () {
        // values
        equal(tp().minutes(100).minutes(), 100, 'Test value: 100');
        equal(tp().minutes(12).minutes(), 12, 'Test value: 12');
        equal(tp().minutes(-5).minutes(), -5, 'Test value: -5');
        equal(tp().minutes('0').minutes(), 0, 'Test value: \'0\'');
        equal(tp().minutes({foo: 'bar'}).minutes(), undefined, 'Test value: {foo: \'bar\'}');
        equal(tp().minutes([1,2,3]).minutes(), undefined, 'Test value: [1,2,3]');
        equal(tp().minutes(undefined).minutes(), undefined, 'Test value: undefined');
        equal(tp().minutes(null).minutes(), undefined, 'Test value: null');
        equal(tp().minutes(true).minutes(), undefined, 'Test value: true');
        equal(tp().minutes(false).minutes(), undefined, 'Test value: false');
        // check types
        equal(typeof tp().minutes(1).minutes(), 'number', 'Type is number');
    });

    test('Test seconds() method', function () {
        // values
        equal(tp().seconds(100).seconds(), 100, 'Test value: 100');
        equal(tp().seconds(12).seconds(), 12, 'Test value: 12');
        equal(tp().seconds(-5).seconds(), -5, 'Test value: -5');
        equal(tp().seconds('0').seconds(), 0, 'Test value: \'0\'');
        equal(tp().seconds({foo: 'bar'}).seconds(), undefined, 'Test value: {foo: \'bar\'}');
        equal(tp().seconds([1,2,3]).seconds(), undefined, 'Test value: [1,2,3]');
        equal(tp().seconds(undefined).seconds(), undefined, 'Test value: undefined');
        equal(tp().seconds(null).seconds(), undefined, 'Test value: null');
        equal(tp().seconds(true).seconds(), undefined, 'Test value: true');
        equal(tp().seconds(false).seconds(), undefined, 'Test value: false');
        // check types
        equal(typeof tp().seconds(1).seconds(), 'number', 'Type is number');
    });

    test('Test isLeapYear() method', function () {
        equal(tp().now().leapYear(), isLeapYear(yyyy), 'Current year is leap or not leap');
        equal(tp().year(2013).leapYear(), false, '2013 is not leap year');
        equal(tp().year(2012).leapYear(), true, '2012 is leap year');
        equal(tp().year(2000).leapYear(), true, '2000 is leap year');
        equal(tp().year(1900).leapYear(), false, '1900 is not leap year');
        equal(tp().year(1904).leapYear(), true, '1904 is leap year');
        equal(tp().year(1905).leapYear(), false, '1905 is not leap year');
        equal(tp().set({year: 1941, day: 22, month: 6}).leapYear(), false, '1941 is not leap year');
        equal(tp().set({year: 2008, day: 1, month: 1}).leapYear(), true, '2008 is not leap year');
        equal(typeof tp().now().leapYear(), 'boolean', 'Type is boolean');
        for (var year = 1800; year <= yyyy; year++) {
            equal(tp().year(year).leapYear(), isLeapYear(year), 'Dynamic test. Year: ' + year);
        }
    });

    test('Test format() method', function () {
        equal(tp().set({year: 2013, month: 11, day:5}).format('%d.%m.%Y'), '05.11.2013', 'Date format');
        equal(tp().set({year: 2000, month: 10, day:1, hours: 10, minutes: 0, seconds: 0}).format('%Y-%m-%d %H:%M:%S'),
            '2000-10-01 10:00:00', 'Date and time format');
        equal(tp().set({year: 2000}).format('%Y-%m-%d %H:%M:%S'), '2000-01-01 00:00:00', 'Enough date and time format');
        equal(typeof tp().set({year: 2013, month: 11, day:5}).format('%d.%m.%Y'), 'string', 'Type is string');
    });

    test('Test instances', function() {
        var resultTest1 = function() {
            var a = tp().set({year: 2013, month: 5, day: 5, hours: 12, minutes: 41, seconds: 36});
            return a.format('%Y-%m-%d %H:%M:%S');
        };
        var resultTest2 = function() {
            var a = tp().set({year: 2013, month: 5, day: 5, hours: 12, minutes: 41, seconds: 36});
            var b = tp().now();
            return a.format('%Y-%m-%d %H:%M:%S');
        };

        equal(resultTest1(), '2013-05-05 12:41:36', 'Test 1');
        equal(resultTest2(), '2013-05-05 12:41:36', 'Test 2');
    });

    test('Test calc()', function() {
        equal(tp({year: 2013, month: 6, day: 1}).calc({month: -1}).format('%d.%m.%Y'), '01.05.2013', 'Easy test');
    });

    // parse test
    //tempus('2010%01%05', '%Y%%%m%%%d');
//
//    test('tempus.getDaysCountInMonth', function () {
//        equal(tempus.getDaysCountInMonth(11, 2013), 30, 'Days count - november 2013');
//        equal(tempus.getDaysCountInMonth(2, 2012), 29, 'Days count, leap year, february 2012.');
//        equal(tempus.getDaysCountInMonth(2, 2013), 28, 'Days count, not leap year, february 2013');
//        equal(typeof tempus.getDaysCountInMonth(2, 2013), 'number', 'Type is number');
//    });
//
//    test('tempus.getMonthNames', function () {
//        deepEqual(tempus.getMonthNames(), ["Jan","Feb","Mar","Apr","May","Jun",
//            "Jul","Aug","Sep","Oct","Nov","Dec"], 'Month short names');
//        deepEqual(tempus.getMonthNames(true), ["January","February","March","April","May","June",
//            "July","August","September","October","November","December"], 'Month long names');
//        equal(typeof tempus.getMonthNames(), 'object', 'Type is object (array)');
//    });
//
//    test('tempus.getDayNames', function () {
//        deepEqual(tempus.getDayNames(), ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], 'Day short names');
//        deepEqual(tempus.getDayNames(true), ["Sunday","Monday","Tuesday","Wednesday",
//            "Thursday","Friday","Saturday"], 'Day long names');
//        equal(typeof tempus.getDayNames(), 'object', 'Type is object (array)');
//    });
//
//    test('tempus.getDayOfWeek', function () {
//        equal(tempus.getDayOfWeek({year: 2013, month: 10, day: 5}), 6, 'Day of week test');
//        equal(tempus.getDayOfWeek({year: 2013, month: 10, day: 6}), 0, 'Day of week test');
//        equal(tempus.getDayOfWeek({year: 2014, month: 1, day: 1}), 3, 'Day of week test');
//        equal(typeof tempus.getDayOfWeek({year: 2014, month: 1, day: 1}), 'number', 'Type is number');
//    });
//
//    test('tempus.incDate', function () {
//        deepEqual(tempus.incDate({year: 2013, month: 10, day: 5}, 7, 'day'),
//            {"year":2013,"month":10,"day":12,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 6, "timestamp": 1381521600,
//            "timezoneOffset": -14400}, 'Date increment');
//        deepEqual(tempus.incDate({year: 2013, month: 10, day: 25}, 80, 'day'),
//            {"year":2014,"month":1,"day":13,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 1,"timestamp": 1389556800,
//            "timezoneOffset": -14400}, 'Date increment');
//        deepEqual(tempus.incDate({year: 2013, month: 1, day: 30}, 11, 'month'),
//            {"year":2013,"month":12,"day":30,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 1, "timestamp": 1388347200,
//            "timezoneOffset": -14400}, 'Date increment');
//        deepEqual(tempus.incDate({year: 2000, month: 1, day: 1}, 15, 'year'),
//            {"year":2015,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 4, "timestamp": 1420056000,
//            "timezoneOffset": -14400}, 'Date increment');
//        equal(typeof tempus.incDate({year: 2000, month: 1, day: 1}, 15, 'year'), 'object', 'Type is object');
//    });
//
//    test('tempus.decDate', function () {
//        deepEqual(tempus.decDate({year: 2013, month: 10, day: 5}, 7, 'day'),
//            {"year":2013,"month":9,"day":28,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 6, "timestamp": 1380312000,
//            "timezoneOffset": -14400}, 'Date decrement');
//        deepEqual(tempus.decDate({year: 2013, month: 10, day: 25}, 80, 'day'),
//            {"year":2013,"month":8,"day":6,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 2, "timestamp": 1375732800,
//            "timezoneOffset": -14400}, 'Date decrement');
//        deepEqual(tempus.decDate({year: 2013, month: 1, day: 1}, 11, 'month'),
//            {"year":2012,"month":2,"day":1,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 3, "timestamp": 1328040000,
//            "timezoneOffset": -14400}, 'Date decrement');
//        deepEqual(tempus.decDate({year: 2000, month: 1, day: 1}, 15, 'year'),
//            {"year":1985,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 2,"timestamp": 473371200,
//            "timezoneOffset": -14400}, 'Date decrement');
//        equal(typeof tempus.decDate({year: 2000, month: 1, day: 1}, 15, 'year'), 'object', 'Type is object');
//    });
//
//    test('tempus.between', function () {
//        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2013, month: 11, day: 5}, 'day'), 4, 'Between');
//        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2014, month: 5, day: 5}, 'month'), 6, 'Between');
//        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2014, month: 5, day: 5}, 'minutes'), 266400, 'Between');
//        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2015, month: 1, day: 1}, 'hours'), 10224, 'Between');
//        equal(typeof tempus.between({year: 2013, month: 11, day: 1}, {year: 2015, month: 1, day: 1}, 'hours'), 'number', 'Type is number');
//    });
//
//    test('tempus.parse', function () {
//        deepEqual(tempus.parse('21.10.2013', '%d.%m.%Y'),
//            {"day":21,"month":10,"year":2013,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 1,"timestamp": 1382299200,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('20131005162015', '%Y%m%d%H%M%S'),
//            {"day":5,"month":10,"year":2013,"hours":16,"minutes":20,"seconds":15,"dayOfWeek": 6,"timestamp": 1380975615,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('2012-05-07', '%F'),
//            {"day":7,"month":5,"year":2012,"hours":0,"minutes":0,"seconds":0,"dayOfWeek": 1,"timestamp": 1336334400,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('12/01/2013', '%D'),
//            {"day":1,"month":12,"year":2013,"hours":0,"minutes":0,"seconds":0,"dayOfWeek": 0,"timestamp": 1385841600,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('05 Dec, 2010', '%d %b, %Y'),
//            {"day":5,"month":12,"year":2010,"hours":0,"minutes":0,"seconds":0,"dayOfWeek": 0,"timestamp": 1291492800,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('10 October, 2010', '%d %B, %Y'),
//            {"day":10,"month":10,"year":2010,"hours":0,"minutes":0,"seconds":0,"dayOfWeek": 0,"timestamp": 1286654400,
//            "timezoneOffset": -14400}, 'Parse');
//        equal(typeof tempus.parse('20131005162015', '%Y%m%d%H%M%S'), 'object', 'Type is object');
//    });
//
//    test('tempus.normalizeDate', function () {
//        deepEqual(tempus.normalizeDate({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}),
//            {"day":1,"month":1,"year":2014,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 3,"timestamp": 1388520000,
//            "timezoneOffset": -14400}, 'Normalize date');
//        deepEqual(tempus.normalizeDate({day:46,month:13,year:2013,hours:0,minutes:0,seconds:0}),
//            {"day":15,"month":2,"year":2014,"hours":0,"minutes":0,"seconds":0, "dayOfWeek": 6,
//            "timestamp": 1392408000,"timezoneOffset": -14400}, 'Normalize date');
//        deepEqual(tempus.normalizeDate({day:32,month:-5,year:2013,hours:55,minutes:0,seconds:-2}),
//            {"day":3,"month":8,"year":2012,"hours":6,"minutes":59,"seconds":58, "dayOfWeek": 5,"timestamp": 1343962798,
//            "timezoneOffset": -14400}, 'Normalize date');
//        deepEqual(tempus.normalizeDate({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}),
//            {"day":19,"month":3,"year":2013,"hours":23,"minutes":0,"seconds":0,"dayOfWeek": 2,"timestamp": 1363719600,
//            "timezoneOffset": -14400}, 'Normalize date');
//        equal(typeof tempus.normalizeDate({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}), 'object', 'Type is object');
//    });
//
//    test('tempus.validate', function () {
//        equal(tempus.validate({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}), false, 'validate');
//        equal(tempus.validate({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}), false, 'validate');
//        equal(tempus.validate({day:1,month:1,year:2013,hours:0,minutes:0,seconds:0}), true, 'validate');
//        equal(tempus.validate('2013-03-12', '%Y-%m-%d'), true, 'validate');
//        equal(tempus.validate('16:00 08.08.2013', '%H:%M %d.%m.%Y'), true, 'validate');
//        equal(tempus.validate('32.08.2013', '%d.%m.%Y'), false, 'validate');
//        equal(tempus.validate('29.02.2013', '%d.%m.%Y'), false, 'validate');
//        equal(tempus.validate('29.02.2012', '%d.%m.%Y'), true, 'validate');
//        equal(tempus.validate('24:61 29.02.2012', '%H:%M %d.%m.%Y'), false, 'validate');
//        equal(tempus.validate('00:00 01.01.2012', '%H:%M %d.%m.%Y'), true, 'validate');
//        equal(typeof tempus.validate({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}), 'boolean', 'Type is boolean');
//    });
//
//    test('tempus.reformat', function () {
//        equal(tempus.reformat('2013-03-12', '%Y-%m-%d', '%d.%m.%Y'), "12.03.2013", 'reformat');
//        equal(tempus.reformat('2013-03-15 16:00', '%Y-%m-%d %H:%M', '%d.%m.%Y'), "15.03.2013", 'reformat');
//        equal(tempus.reformat('2013-03-15T12:31:48', '%Y-%m-%dT%H:%M:%S', '%H:%M (%a %d, %Y)'), "12:31 (Fri 15, 2013)", 'reformat');
//        equal(typeof tempus.reformat('2013-03-12', '%Y-%m-%d', '%d.%m.%Y'), 'string', 'Type is string');
//    });
//
//    test('tempus.setLocale', function () {
//        equal(setLocaleTest({year: 2013, month: 11, day: 7}, "ru_RU"), "2013, Ноябрь, 07, Четверг", 'setLocale');
//    });

})();