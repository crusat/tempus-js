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






    test('Test base set() method', function () {
        deepEqual(tempus(new Date(2013, 0, 1, 0, 0, 0, 0)).get(), tempus({year: 2013, month: 1, day: 1, hourss: 0, minutes: 0,
            seconds:0, milliseconds:0}).get(), 'Set new Date().');
        equal(typeof tempus().get(), 'object', 'Type is object');
    });








    test('Test format() method', function () {
        equal(tempus().set({year: 2013, month: 11, day:5}).format('%d.%m.%Y'), '05.11.2013', 'Date format');
        equal(tempus().set({year: 2000, month: 10, day:1, hourss: 10, minutes: 0, seconds: 0}).format('%Y-%m-%d %H:%M:%S'),
            '2000-10-01 10:00:00', 'Date and time format');
        equal(tempus().set({year: 2000}).format('%Y-%m-%d %H:%M:%S'), '2000-01-01 00:00:00', 'Enough date and time format');
        equal(typeof tempus().set({year: 2013, month: 11, day:5}).format('%d.%m.%Y'), 'string', 'Type is string');
    });



    test('Test calc()', function() {
        equal(tempus({year: 2013, month: 6, day: 1}).calc({month: -1}).format('%d.%m.%Y'), '01.05.2013', 'Easy test');
    });


    // *************************************************
    // *                                               *
    // *                   BASE                        *
    // *                                               *
    // *************************************************

    test('Tests constants()', function() {
        deepEqual(tempus().constants(),
            {MIN_YEAR: 1000,MAX_YEAR: 3000,MIN_MONTH: 1,MAX_MONTH: 12,
            MIN_DAY: 1,MAX_DAY_IN_MONTHS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],MIN_DAY_OF_WEEK: 0,
            MAX_DAY_OF_WEEK: 6,MIN_HOURS: 0,MAX_HOURS: 23,MIN_MINUTES: 0,MAX_MINUTES: 59,MIN_SECONDS: 0,MAX_SECONDS: 59,
            MIN_MILLISECONDS: 0,MAX_MILLISECONDS: 999},
            'Tests constants');
    });

    test('Tests dayCount()', function() {
        equal(tempus([2013, 11, 18]).dayCount(), 30, 'November');
        equal(tempus([2012, 2]).dayCount(), 29, 'February leap year');
        equal(tempus([2013, 2]).dayCount(), 28, 'February not leap year');
        equal(tempus([2013, 1]).dayCount(), 31, 'January');
    });

    test('Test year() method', function () {
        // values
        equal(tempus().year(), new Date().getFullYear(), 'Test value: Current');
        equal(tempus().year(2000).year(), 2000, 'Test value: 2000');
        equal(tempus().year(1000).year(), 1000, 'Test value: 1000');
        equal(tempus().year(3000).year(), 3000, 'Test value: 3000');
        equal(tempus().year(undefined).year(), tempus().constants().MIN_YEAR, 'Test value: undefined');
        equal(tempus().year(1).year(), 1, 'Test value: 1');
        equal(tempus().year(-15).year(), -15, 'Test value: -15');
        equal(tempus().year('0').year(), 0, 'Test value: \'0\'');
        equal(tempus().year({foo: 'bar'}).year(), tempus().constants().MIN_YEAR, 'Test value: {foo: \'bar\'}');
        equal(tempus().year([1,2,3]).year(), tempus().constants().MIN_YEAR, 'Test value: [1,2,3]');
        equal(tempus().year(null).year(), tempus().constants().MIN_YEAR, 'Test value: null');
        equal(tempus().year(true).year(), tempus().constants().MIN_YEAR, 'Test value: true');
        equal(tempus().year(false).year(), tempus().constants().MIN_YEAR, 'Test value: false');
        equal(tempus().year(NaN).year(), tempus().constants().MIN_YEAR, 'Test value: false');
        // check types
        equal(typeof tempus().year(2000).year(), 'number', 'Type is number');
    });

    test('Test month() method', function () {
        // values
        equal(tempus().month(), new Date().getMonth() + 1, 'Test value: Current');
        equal(tempus().month(100).month(), 100, 'Test value: 100');
        equal(tempus().month(12).month(), 12, 'Test value: 12');
        equal(tempus().month(1).month(), 1, 'Test value: 12');
        equal(tempus().month(-5).month(), -5, 'Test value: -5');
        equal(tempus().month('0').month(), 0, 'Test value: \'0\'');
        equal(tempus().month(undefined).month(), tempus().constants().MIN_MONTH, 'Test value: undefined');
        equal(tempus().month({foo: 'bar'}).month(), tempus().constants().MIN_MONTH, 'Test value: {foo: \'bar\'}');
        equal(tempus().month([1,2,3]).month(), tempus().constants().MIN_MONTH, 'Test value: [1,2,3]');
        equal(tempus().month(null).month(), tempus().constants().MIN_MONTH, 'Test value: null');
        equal(tempus().month(true).month(), tempus().constants().MIN_MONTH, 'Test value: true');
        equal(tempus().month(false).month(), tempus().constants().MIN_MONTH, 'Test value: false');
        equal(tempus().month(NaN).month(), tempus().constants().MIN_MONTH, 'Test value: false');
        // check types
        equal(typeof tempus().month(1).month(), 'number', 'Type is number');
    });

    test('Test day() method', function () {
        // values
        equal(tempus().day(), new Date().getDate(), 'Test value: Current');
        equal(tempus().day(100).day(), 100, 'Test value: 100');
        equal(tempus().day(12).day(), 12, 'Test value: 12');
        equal(tempus().day(-5).day(), -5, 'Test value: -5');
        equal(tempus().day('0').day(), 0, 'Test value: \'0\'');
        equal(tempus().day({foo: 'bar'}).day(), tempus().constants().MIN_DAY, 'Test value: {foo: \'bar\'}');
        equal(tempus().day([1,2,3]).day(), tempus().constants().MIN_DAY, 'Test value: [1,2,3]');
        equal(tempus().day(undefined).day(), tempus().constants().MIN_DAY, 'Test value: undefined');
        equal(tempus().day(null).day(), tempus().constants().MIN_DAY, 'Test value: null');
        equal(tempus().day(true).day(), tempus().constants().MIN_DAY, 'Test value: true');
        equal(tempus().day(false).day(), tempus().constants().MIN_DAY, 'Test value: false');
        equal(tempus().day(NaN).day(), tempus().constants().MIN_DAY, 'Test value: false');
        // check types
        equal(typeof tempus().day(1).day(), 'number', 'Type is number');
    });

    test('Test hours() method', function () {
        // values
        equal(tempus().hours(), new Date().getHours(), 'Test value: Current');
        equal(tempus().hours(100).hours(), 100, 'Test value: 100');
        equal(tempus().hours(12).hours(), 12, 'Test value: 12');
        equal(tempus().hours(-5).hours(), -5, 'Test value: -5');
        equal(tempus().hours('0').hours(), 0, 'Test value: \'0\'');
        equal(tempus().hours({foo: 'bar'}).hours(), tempus().constants().MIN_HOURS, 'Test value: {foo: \'bar\'}');
        equal(tempus().hours([1,2,3]).hours(), tempus().constants().MIN_HOURS, 'Test value: [1,2,3]');
        equal(tempus().hours(undefined).hours(), tempus().constants().MIN_HOURS, 'Test value: undefined');
        equal(tempus().hours(null).hours(), tempus().constants().MIN_HOURS, 'Test value: null');
        equal(tempus().hours(true).hours(), tempus().constants().MIN_HOURS, 'Test value: true');
        equal(tempus().hours(false).hours(), tempus().constants().MIN_HOURS, 'Test value: false');
        equal(tempus().hours(NaN).hours(), tempus().constants().MIN_HOURS, 'Test value: false');
        // check types
        equal(typeof tempus().hours(1).hours(), 'number', 'Type is number');
    });

    test('Test minutes() method', function () {
        // values
        equal(tempus().minutes(), new Date().getMinutes(), 'Test value: Current');
        equal(tempus().minutes(100).minutes(), 100, 'Test value: 100');
        equal(tempus().minutes(12).minutes(), 12, 'Test value: 12');
        equal(tempus().minutes(-5).minutes(), -5, 'Test value: -5');
        equal(tempus().minutes('0').minutes(), 0, 'Test value: \'0\'');
        equal(tempus().minutes({foo: 'bar'}).minutes(), tempus().constants().MIN_MINUTES, 'Test value: {foo: \'bar\'}');
        equal(tempus().minutes([1,2,3]).minutes(), tempus().constants().MIN_MINUTES, 'Test value: [1,2,3]');
        equal(tempus().minutes(undefined).minutes(), tempus().constants().MIN_MINUTES, 'Test value: undefined');
        equal(tempus().minutes(null).minutes(), tempus().constants().MIN_MINUTES, 'Test value: null');
        equal(tempus().minutes(true).minutes(), tempus().constants().MIN_MINUTES, 'Test value: true');
        equal(tempus().minutes(false).minutes(), tempus().constants().MIN_MINUTES, 'Test value: false');
        equal(tempus().minutes(NaN).minutes(), tempus().constants().MIN_MINUTES, 'Test value: false');
        // check types
        equal(typeof tempus().minutes(1).minutes(), 'number', 'Type is number');
    });

    test('Test seconds() method', function () {
        // values
        equal(tempus().seconds(), new Date().getSeconds(), 'Test value: Current');
        equal(tempus().seconds(100).seconds(), 100, 'Test value: 100');
        equal(tempus().seconds(12).seconds(), 12, 'Test value: 12');
        equal(tempus().seconds(-5).seconds(), -5, 'Test value: -5');
        equal(tempus().seconds('0').seconds(), 0, 'Test value: \'0\'');
        equal(tempus().seconds({foo: 'bar'}).seconds(), tempus().constants().MIN_SECONDS, 'Test value: {foo: \'bar\'}');
        equal(tempus().seconds([1,2,3]).seconds(), tempus().constants().MIN_SECONDS, 'Test value: [1,2,3]');
        equal(tempus().seconds(undefined).seconds(), tempus().constants().MIN_SECONDS, 'Test value: undefined');
        equal(tempus().seconds(null).seconds(), tempus().constants().MIN_SECONDS, 'Test value: null');
        equal(tempus().seconds(true).seconds(), tempus().constants().MIN_SECONDS, 'Test value: true');
        equal(tempus().seconds(false).seconds(), tempus().constants().MIN_SECONDS, 'Test value: false');
        equal(tempus().seconds(NaN).seconds(), tempus().constants().MIN_SECONDS, 'Test value: false');
        // check types
        equal(typeof tempus().seconds(1).seconds(), 'number', 'Type is number');
    });

    test('Test timestamp() method', function () {
        equal(tempus([2013, 11, 18]).timestamp(), 1384718400, 'Test');
        equal(tempus().timestamp(1384718400).get('Date'), new Date(1384718400), 'Test');
    });

    test('Test UTC() method', function () {
        equal(tempus([2013, 11, 18]).timestamp(), 1384732800, 'Test');
        equal(tempus().timestamp(1384732800).get('Date'), new Date(1384732800), 'Test');
    });

    test('Test dayOfWeek() method', function () {
        equal(tempus().dayOfWeek(), new Date().getDay(), 'Test');
        equal(tempus([2013, 11, 18]).dayOfWeek(), new Date(2013, 11, 18).getDay(), 'Test');
    });

    test('Test timezone() method', function () {
        equal(tempus().timezone(), new Date().getTimezoneOffset()*60, 'Test');
        equal(tempus().timezone('minutes'), new Date().getTimezoneOffset(), 'Test');
        equal(tempus().timezone('hours'), new Date().getTimezoneOffset()/60, 'Test');
    });

    test('Tests get() method', function() {
        equal(Math.floor(tempus().get('Date').valueOf()/1000), Math.floor(new Date().valueOf()/1000), 'Test');
        equal(tempus().get().year, new Date().getFullYear(), 'Test');
        equal(tempus().get().month, new Date().getMonth()+1, 'Test');
        equal(tempus().get().day, new Date().getDate(), 'Test');
        equal(tempus().get().hours, new Date().getHours(), 'Test');
        equal(tempus().get().minutes, new Date().getMinutes(), 'Test');
        equal(tempus().get().seconds, new Date().getSeconds(), 'Test');
    });

    test('Tests leapYear() method', function () {
        equal(tempus().leapYear(), isLeapYear(yyyy), 'Current year is leap or not leap');
        equal(tempus([2013]).leapYear(), false, '2013 is not leap year');
        equal(tempus([2012]).leapYear(), true, '2012 is leap year');
        equal(tempus([2000]).leapYear(), true, '2000 is leap year');
        equal(tempus([1900]).leapYear(), false, '1900 is not leap year');
        equal(tempus([1904]).leapYear(), true, '1904 is leap year');
        equal(tempus([1905]).leapYear(), false, '1905 is not leap year');
        equal(tempus({year: 1941, day: 22, month: 6}).leapYear(), false, '1941 is not leap year');
        equal(tempus({year: 2008, day: 1, month: 1}).leapYear(), true, '2008 is not leap year');
        equal(typeof tempus().leapYear(), 'boolean', 'Type is boolean');
        for (var year = 1800; year <= yyyy; year++) {
            equal(tempus().year(year).leapYear(), isLeapYear(year), 'Dynamic test. Year: ' + year);
        }
    });

    test('Test instances', function() {
        var resultTest1 = function() {
            var a = tempus({year: 2013, month: 5, day: 5, hourss: 12, minutes: 41, seconds: 36});
            return a.format('%Y-%m-%d %H:%M:%S');
        };
        var resultTest2 = function() {
            var a = tempus({year: 2013, month: 5, day: 5, hourss: 12, minutes: 41, seconds: 36});
            var b = tempus();
            return a.format('%Y-%m-%d %H:%M:%S');
        };

        equal(resultTest1(), '2013-05-05 12:41:36', 'Test 1');
        equal(resultTest2(), '2013-05-05 12:41:36', 'Test 2');
    });

    // *************************************************
    // *                                               *
    // *                    SET                        *
    // *                                               *
    // *************************************************

    test('Tests set() method', function() {
        equal(Math.floor(tempus().set().get('Date').valueOf()/1000), Math.floor(new Date().valueOf()/1000),
            'This test may be not completed and it be right, because here checking two NOW dates');
        equal(tempus().set({year: 2013, month: 1, day: 15}).get('Date').valueOf(), new Date(2013, 0, 15).valueOf(),
            'Checking constructor with some object value');
        equal(tempus().set([2000, 6, 1, 12, 1, 15]).get('Date').valueOf(), new Date(2000, 5, 1, 12, 1, 15).valueOf(),
            'Checking constructor with array value');
        equal(tempus().set('2001-05-10 05:30:00').get('Date').valueOf(), new Date(2001, 4, 10, 5, 30, 0).valueOf(),
            'Checking constructor with string value');
        equal(tempus().set(989454600).get('Date').valueOf(), new Date(2001, 4, 10, 5, 30, 0).valueOf(),
            'Checking constructor with numeric value');
    });

    test('Test now date', function () {
        // check current date/time
        equal(tempus().timestamp(), Math.floor(new Date().getTime() / 1000), 'Current UTC');
        equal(tempus().year(), new Date().getFullYear(), 'Full year');
        equal(tempus().month(), new Date().getMonth() + 1, 'Month');
        equal(tempus().day(), new Date().getDate(), 'Day');
        equal(tempus().hours(), new Date().getHours(), 'Hours');
        equal(tempus().minutes(), new Date().getMinutes(), 'Minutes');
        equal(tempus().seconds(), new Date().getSeconds(), 'Seconds');
        equal(tempus().dayOfWeek(), new Date().getDay(), 'Day of week');
        // check types
        equal(typeof tempus().now(), 'object', 'Type is object');
        equal(typeof tempus().year(), 'number', 'Type is number');
        equal(typeof tempus().month(), 'number', 'Type is number');
        equal(typeof tempus().day(), 'number', 'Type is number');
        equal(typeof tempus().hours(), 'number', 'Type is number');
        equal(typeof tempus().minutes(), 'number', 'Type is number');
        equal(typeof tempus().seconds(), 'number', 'Type is number');
        equal(typeof tempus().dayOfWeek(), 'number', 'Type is number');
        equal(typeof tempus().timestamp(), 'number', 'Type is number');
    });

    test('Test set() year ranges', function () {
        for (year = 1000; year <= 3000; year++) {
            equal(tempus({year: year}).year(), year, 'Year can be from 1000 to 3000, else MIN_YEAR. Year: ' + year);
        }
        for (year = -100; year <= 999; year++) {
            equal(tempus({year: year}).year(), new Date().getFullYear(), 'Year can not be 999 or less, else current and set incorrect. Year: ' + year);
        }
        for (year = 3001; year <= 4000; year++) {
            equal(tempus({year: year}).year(), new Date().getFullYear(), 'Year can not be 3001 or more, else current and set incorrect. Year: ' + year);
        }
        equal(tempus({}).year(), 1000, 'If year is not setted, setting MIN_YEAR');
    });

    test('Test set() months ranges', function () {
        for (month = 1; month <= 12; month++) {
            equal(tempus().set({month: month}).month(), month, 'Month can be from 1 to 12. Month: ' + month);
        }
        for (month = -100; month <= 0; month++) {
            equal(tempus().set({month: month}).month(), new Date().getMonth() + 1, 'Month can not be 0 or less. Month: ' + month);
        }
        for (month = 13; month <= 100; month++) {
            equal(tempus().set({month: month}).month(), new Date().getMonth() + 1, 'Month can not be 13 or more. Month: ' + month);
        }
        equal(tempus().set({}).month(), 1, 'If month is not setted, setting MIN_MONTH');
    });

    test('Test set() day ranges', function () {
        // Not leap year check
        var dayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (month = 1; month <= 12; month++) {
            for (day = 1; day <= dayInMonth[month - 1]; day++) {
                equal(tempus().set({year: 2001, month: month, day: day}).day(), day, 'Year: 2001. Day can be from 1 to X. Month: ' + month + '. Day:' + day);
            }
            for (day = -10; day <= 0; day++) {
                equal(tempus().set({year: 2001, month: month, day: day}).day(), new Date().getDate(), 'Year: 2001. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
            for (day = dayInMonth[month - 1] + 1; day <= 40; day++) {
                equal(tempus().set({year: 2001, month: month, day: day}).day(), new Date().getDate(), 'Year: 2001. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
        }
        // leap year check
        dayInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (month = 1; month <= 12; month++) {
            for (day = 1; day <= dayInMonth[month - 1]; day++) {
                equal(tempus().set({year: 2012, month: month, day: day}).day(), day, 'Year: 2012. Day can be from 1 to X. Month: ' + month + '. Day:' + day);
            }
            for (day = -10; day <= 0; day++) {
                equal(tempus().set({year: 2012, month: month, day: day}).day(), new Date().getDate(), 'Year: 2012. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
            for (day = dayInMonth[month - 1] + 1; day <= 40; day++) {
                equal(tempus().set({year: 2012, month: month, day: day}).day(), new Date().getDate(), 'Year: 2012. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
        }
        equal(tempus().set({}).day(), 1, 'If day is not setted, setting MIN_DAY');
    });

    test('Test set() hours ranges', function () {
        for (hours = 0; hours <= 23; hours++) {
            equal(tempus().set({hours: hours}).hours(), hours, 'Hours can be from 0 to 23. Hours: ' + hours);
        }
        for (hours = -100; hours < 0; hours++) {
            equal(tempus().set({hours: hours}).hours(), new Date().getHours(), 'Hours can not be 0 or less. Month: ' + hours);
        }
        for (hourss = 24; hours <= 100; hours++) {
            equal(tempus().set({hours: hours}).hours(), new Date().getHours(), 'Hours can not be 24 or more. Month: ' + hours);
        }
        equal(tempus().set({}).hours(), 0, 'If hours is not setted, setting MIN_HOURS');
    });

    test('Test set() minutes ranges', function () {
        for (minutes = 0; minutes <= 59; minutes++) {
            equal(tempus().set({minutes: minutes}).minutes(), minutes, 'Minutes can be from 0 to 59. Minutes: ' + minutes);
        }
        for (minutes = -100; minutes < 0; minutes++) {
            equal(tempus().set({minutes: minutes}).minutes(), new Date().getMinutes(), 'Minutes can not be 0 or less. Minutes: ' + minutes);
        }
        for (minutes = 60; minutes <= 100; minutes++) {
            equal(tempus().set({minutes: minutes}).minutes(), new Date().getMinutes(), 'Minutes can not be 59 or more. Minutes: ' + minutes);
        }
        equal(tempus().set({}).minutes(), 0, 'If minutes is not setted, setting MIN_MINUTES');
    });

    test('Test set() seconds ranges', function () {
        for (seconds = 0; seconds <= 59; seconds++) {
            equal(tempus().set({seconds: seconds}).seconds(), seconds, 'Seconds can be from 0 to 59. Minutes: ' + seconds);
        }
        for (seconds = -100; seconds < 0; seconds++) {
            equal(tempus().set({seconds: seconds}).seconds(), new Date().getSeconds(), 'Seconds can not be 0 or less. Minutes: ' + seconds);
        }
        for (seconds = 60; seconds <= 100; seconds++) {
            equal(tempus().set({seconds: seconds}).seconds(), new Date().getSeconds(), 'Seconds can not be 59 or more. Minutes: ' + seconds);
        }
        equal(tempus().set({}).seconds(), 0, 'If seconds is not setted, setting MIN_SECONDS');
    });


    // *************************************************
    // *                                               *
    // *                   LANGS                       *
    // *                                               *
    // *************************************************

    test('Tests getMonthNames()', function () {
        deepEqual(tempus.monthNames(),
            ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            'Test');
        deepEqual(tempus.monthNames(true),
            ["January","February","March","April","May","June",
             "July","August","September","October","November","December"],
            'Test');
        deepEqual(function() {
                var names;
                tempus.setLang('ru');
                names = tempus.monthNames();
                tempus.setLang();
                return names;
            },
            ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            'Test');
    });

    // *************************************************
    // *                                               *
    // *                  FACTORY                      *
    // *                                               *
    // *************************************************

    test('Tests constructor of TempusDate', function() {
        equal(Math.floor(tempus().get('Date').valueOf()/1000), Math.floor(new Date().valueOf()/1000),
            'This test may be not completed and it be right, because here checking two NOW dates');
        equal(tempus({year: 2013, month: 1, day: 15}).get('Date').valueOf(), new Date(2013, 0, 15).valueOf(),
            'Checking constructor with some object value');
        equal(tempus([2000, 6, 1, 12, 1, 15]).get('Date').valueOf(), new Date(2000, 5, 1, 12, 1, 15).valueOf(),
            'Checking constructor with array value');
        equal(tempus('2001-05-10 05:30:00').get('Date').valueOf(), new Date(2001, 4, 10, 5, 30, 0).valueOf(),
            'Checking constructor with string value');
        equal(tempus(989454600).get('Date').valueOf(), new Date(2001, 4, 10, 5, 30, 0).valueOf(),
            'Checking constructor with numeric value');
    });

    test('Tests generator of many TempusDate', function() {
        deepEqual(tempus.generate({dateFrom: '01.01.2013',dateTo: '10.01.2013',period: 'day',format: '%d.%m.%Y'}),
            ["01.01.2013", "02.01.2013", "03.01.2013", "04.01.2013", "05.01.2013",
             "06.01.2013", "07.01.2013", "08.01.2013", "09.01.2013", "10.01.2013"],
            'Tests simply generation of dates');
        deepEqual(tempus.generate({dateFrom: '20130329',formatFrom: '%Y%m%d',dateTo: '20130402',period: {day: 1},format: '%d.%m.%Y'}),
            ["29.03.2013", "30.03.2013", "31.03.2013", "01.04.2013", "02.04.2013"],
            'Tests generation of dates with custom format and period as object');
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
//            {"year":2013,"month":10,"day":12,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 6, "timestamp": 1381521600,
//            "timezoneOffset": -14400}, 'Date increment');
//        deepEqual(tempus.incDate({year: 2013, month: 10, day: 25}, 80, 'day'),
//            {"year":2014,"month":1,"day":13,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 1,"timestamp": 1389556800,
//            "timezoneOffset": -14400}, 'Date increment');
//        deepEqual(tempus.incDate({year: 2013, month: 1, day: 30}, 11, 'month'),
//            {"year":2013,"month":12,"day":30,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 1, "timestamp": 1388347200,
//            "timezoneOffset": -14400}, 'Date increment');
//        deepEqual(tempus.incDate({year: 2000, month: 1, day: 1}, 15, 'year'),
//            {"year":2015,"month":1,"day":1,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 4, "timestamp": 1420056000,
//            "timezoneOffset": -14400}, 'Date increment');
//        equal(typeof tempus.incDate({year: 2000, month: 1, day: 1}, 15, 'year'), 'object', 'Type is object');
//    });
//
//    test('tempus.decDate', function () {
//        deepEqual(tempus.decDate({year: 2013, month: 10, day: 5}, 7, 'day'),
//            {"year":2013,"month":9,"day":28,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 6, "timestamp": 1380312000,
//            "timezoneOffset": -14400}, 'Date decrement');
//        deepEqual(tempus.decDate({year: 2013, month: 10, day: 25}, 80, 'day'),
//            {"year":2013,"month":8,"day":6,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 2, "timestamp": 1375732800,
//            "timezoneOffset": -14400}, 'Date decrement');
//        deepEqual(tempus.decDate({year: 2013, month: 1, day: 1}, 11, 'month'),
//            {"year":2012,"month":2,"day":1,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 3, "timestamp": 1328040000,
//            "timezoneOffset": -14400}, 'Date decrement');
//        deepEqual(tempus.decDate({year: 2000, month: 1, day: 1}, 15, 'year'),
//            {"year":1985,"month":1,"day":1,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 2,"timestamp": 473371200,
//            "timezoneOffset": -14400}, 'Date decrement');
//        equal(typeof tempus.decDate({year: 2000, month: 1, day: 1}, 15, 'year'), 'object', 'Type is object');
//    });
//
//    test('tempus.between', function () {
//        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2013, month: 11, day: 5}, 'day'), 4, 'Between');
//        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2014, month: 5, day: 5}, 'month'), 6, 'Between');
//        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2014, month: 5, day: 5}, 'minutes'), 266400, 'Between');
//        equal(tempus.between({year: 2013, month: 11, day: 1}, {year: 2015, month: 1, day: 1}, 'hourss'), 10224, 'Between');
//        equal(typeof tempus.between({year: 2013, month: 11, day: 1}, {year: 2015, month: 1, day: 1}, 'hourss'), 'number', 'Type is number');
//    });
//
//    test('tempus.parse', function () {
//        deepEqual(tempus.parse('21.10.2013', '%d.%m.%Y'),
//            {"day":21,"month":10,"year":2013,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 1,"timestamp": 1382299200,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('20131005162015', '%Y%m%d%H%M%S'),
//            {"day":5,"month":10,"year":2013,"hourss":16,"minutes":20,"seconds":15,"dayOfWeek": 6,"timestamp": 1380975615,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('2012-05-07', '%F'),
//            {"day":7,"month":5,"year":2012,"hourss":0,"minutes":0,"seconds":0,"dayOfWeek": 1,"timestamp": 1336334400,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('12/01/2013', '%D'),
//            {"day":1,"month":12,"year":2013,"hourss":0,"minutes":0,"seconds":0,"dayOfWeek": 0,"timestamp": 1385841600,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('05 Dec, 2010', '%d %b, %Y'),
//            {"day":5,"month":12,"year":2010,"hourss":0,"minutes":0,"seconds":0,"dayOfWeek": 0,"timestamp": 1291492800,
//            "timezoneOffset": -14400}, 'Parse');
//        deepEqual(tempus.parse('10 October, 2010', '%d %B, %Y'),
//            {"day":10,"month":10,"year":2010,"hourss":0,"minutes":0,"seconds":0,"dayOfWeek": 0,"timestamp": 1286654400,
//            "timezoneOffset": -14400}, 'Parse');
//        equal(typeof tempus.parse('20131005162015', '%Y%m%d%H%M%S'), 'object', 'Type is object');
//    });
//
//    test('tempus.normalizeDate', function () {
//        deepEqual(tempus.normalizeDate({day:32,month:12,year:2013,hourss:0,minutes:0,seconds:0}),
//            {"day":1,"month":1,"year":2014,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 3,"timestamp": 1388520000,
//            "timezoneOffset": -14400}, 'Normalize date');
//        deepEqual(tempus.normalizeDate({day:46,month:13,year:2013,hourss:0,minutes:0,seconds:0}),
//            {"day":15,"month":2,"year":2014,"hourss":0,"minutes":0,"seconds":0, "dayOfWeek": 6,
//            "timestamp": 1392408000,"timezoneOffset": -14400}, 'Normalize date');
//        deepEqual(tempus.normalizeDate({day:32,month:-5,year:2013,hourss:55,minutes:0,seconds:-2}),
//            {"day":3,"month":8,"year":2012,"hourss":6,"minutes":59,"seconds":58, "dayOfWeek": 5,"timestamp": 1343962798,
//            "timezoneOffset": -14400}, 'Normalize date');
//        deepEqual(tempus.normalizeDate({day:20,month:3,year:2013,hourss:-1,minutes:0,seconds:0}),
//            {"day":19,"month":3,"year":2013,"hourss":23,"minutes":0,"seconds":0,"dayOfWeek": 2,"timestamp": 1363719600,
//            "timezoneOffset": -14400}, 'Normalize date');
//        equal(typeof tempus.normalizeDate({day:20,month:3,year:2013,hourss:-1,minutes:0,seconds:0}), 'object', 'Type is object');
//    });
//
//    test('tempus.validate', function () {
//        equal(tempus.validate({day:32,month:12,year:2013,hourss:0,minutes:0,seconds:0}), false, 'validate');
//        equal(tempus.validate({day:20,month:3,year:2013,hourss:-1,minutes:0,seconds:0}), false, 'validate');
//        equal(tempus.validate({day:1,month:1,year:2013,hourss:0,minutes:0,seconds:0}), true, 'validate');
//        equal(tempus.validate('2013-03-12', '%Y-%m-%d'), true, 'validate');
//        equal(tempus.validate('16:00 08.08.2013', '%H:%M %d.%m.%Y'), true, 'validate');
//        equal(tempus.validate('32.08.2013', '%d.%m.%Y'), false, 'validate');
//        equal(tempus.validate('29.02.2013', '%d.%m.%Y'), false, 'validate');
//        equal(tempus.validate('29.02.2012', '%d.%m.%Y'), true, 'validate');
//        equal(tempus.validate('24:61 29.02.2012', '%H:%M %d.%m.%Y'), false, 'validate');
//        equal(tempus.validate('00:00 01.01.2012', '%H:%M %d.%m.%Y'), true, 'validate');
//        equal(typeof tempus.validate({day:32,month:12,year:2013,hourss:0,minutes:0,seconds:0}), 'boolean', 'Type is boolean');
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