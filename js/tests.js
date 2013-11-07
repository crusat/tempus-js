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