var TempusJS = function () {
    // private
    var _daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var _monthShortNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    var _monthLongNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
        'october', 'november', 'december'];

    var _daysShortNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var _daysLongNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // now method
    this.now = function () {
        return Math.floor((new Date()).getTime() / 1000);
    };

    // is leap year method
    this.isLeapYear = function (year) {
        year = parseInt(year);
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                return year % 400 == 0;
            } else return true;
        }
        return false;
    };

    // get days count in month method
    // from 1 to 12
    this.getDaysCountInMonth = function (month, year) {
        var leapYear = year === undefined ? false : this.isLeapYear(year);
        if (typeof month === 'number') {
            if (month === 2) {
                return _daysInMonth[month - 1] + (leapYear ? 1 : 0);
            } else {
                return _daysInMonth[month - 1]
            }
        }
        if (typeof month === 'string') {
            var month_int = indexOf(_monthShortNames, month);
            if (month_int === -1) {
                month_int = indexOf(_monthLongNames, month);
            }
            if (month_int === -1) {
                return undefined;
            }
            month = month_int;
            if (month === 2) {
                return _daysInMonth[month - 1] + (leapYear ? 1 : 0);
            } else {
                return _daysInMonth[month - 1]
            }
        }
        return undefined;
    };

    this.getMonthNames = function(longNames) {
        if (longNames === true) {
            return _monthLongNames;
        } else {
            return _monthShortNames;
        }
    };

    this.getDaysNames = function(longNames) {
        if (longNames === true) {
            return _daysLongNames;
        } else {
            return _daysShortNames;
        }
    };

    // Algorithm author: Tomohiko Sakamoto in 1993.
    this.getDayOfWeek = function(year, month, day) {
        year = parseInt(year);
        month = parseInt(month);
        day = parseInt(day);
        var t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
        year -= month < 3;
        return _daysShortNames[(year + year/4 - year/100 + year/400 + t[month-1] + day) % 7];
    };

    this.getArrayOfDays = function(dateFrom, dateTo) {
        return [[null, null, null, {day: 30, month: 1}, {day:31, month: 1}],
            [{day: 1, month: 2}, {day:2, month:2}, {day:3, month:2}], [], []];
    };

    // *** HELPERS ***
    var indexOf = function (obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex, j = this.length; i < j; i++) {
            if (this[i] === obj)
                return i;
        }
        return -1;
    };
};

var tempus = new TempusJS();
