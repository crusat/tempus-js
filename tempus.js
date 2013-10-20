var TempusJS = function () {
    // private
    var _daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var _monthShortNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    var _monthLongNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
        'october', 'november', 'december'];
    var _MONTH_COUNT = 12;

    var _daysShortNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var _daysLongNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    var YEAR_DAYS_COUNT_NOT_LEAP = 365;
    var YEAR_DAYS_COUNT_LEAP = 366;

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
        return Math.floor((year + year/4 - year/100 + year/400 + t[month-1] + day) % 7);
    };

    this.incDate = function(date, value, type) {
        if (typeof date === 'object') {

        } else {
            return undefined;
        }
        var newDate = JSON.parse(JSON.stringify(date));
        if (type === 'day') {
            newDate.day += parseInt(value);
        }
        // normalize
        var normalized = false;
        while (!normalized) {
            normalized = true;
            var dayInMonth = this.getDaysCountInMonth(newDate.month, newDate.year);
            if (newDate.day > dayInMonth) {
                newDate.month += 1;
                newDate.day -= dayInMonth;
                normalized = false;
            }
            if (newDate.month > _MONTH_COUNT) {
                newDate.year += 1;
                newDate.month -= _MONTH_COUNT;
                normalized = false;
            }
        }
        return newDate;
    };

    this.between = function(dateFrom, dateTo, type) {
        var date = JSON.parse(JSON.stringify(dateFrom));
        if (type === 'day') {
            var daysBetween = 1;
            var finished = false;
            while (!finished) {
                finished = true;
                if ((date.year !== dateTo.year)||(date.month !== dateTo.month)||(date.day !== dateTo.day)) {
                    date.day += 1;
                    daysBetween += 1;
                    finished = false;
                }
                var dayInMonth = this.getDaysCountInMonth(date.month, date.year);
                if (date.day > dayInMonth) {
                    date.month += 1;
                    date.day -= dayInMonth;
                    finished = false;
                }
                if (date.month > _MONTH_COUNT) {
                    date.year += 1;
                    date.month -= _MONTH_COUNT;
                    finished = false;
                }
            }
            return daysBetween;
        }
        return undefined;
    };

    this.getDaysArrayByWeek = function(dateFrom, dateTo) {
        if (typeof dateFrom === 'object') {
            var dateFromDayOfWeek = this.getDayOfWeek(dateFrom.year, dateFrom.month, dateFrom.day);
        }
        if (typeof dateTo === 'object') {
            var dateToDayOfWeek = this.getDayOfWeek(dateTo.year, dateTo.month, dateTo.day);
        }
        var date = JSON.parse(JSON.stringify(dateFrom));
        var result = [];
        var resultIndex = 0;
        var daysCount = this.between(dateFrom, dateTo, 'day');
        var i = 0;
        while (i < (daysCount - (daysCount % 7) + 7)) {
            if (i % 7 === 0) {
                result.push([]);
                resultIndex = result.length - 1;
            }
            console.log(daysCount);
            if ((i < 7)&&(i < dateFromDayOfWeek)) {
                result[resultIndex].push(null);
                daysCount++;
            } else {
                if ((i > (daysCount - 1))&&(i > dateToDayOfWeek)) {
                    result[resultIndex].push(null);
                } else {
                    result[resultIndex].push(date);
                    date = this.incDate(date, 1, 'day');

                }
            }
            i++;
        }
        return result;
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
