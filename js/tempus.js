/**
 * @author Aleksey Kuznetsov <me@akuzn.com>
 * @version 0.1.27
 * @url https://github.com/crusat/tempus-js
 * @description Library with date/time methods
 */
(function () {
    var TempusJS = function () {
        // private
        var that = this;
        var version = '0.1.27';
        var locale = 'en_US';
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var locales = {
            "en_US": {
                "monthShortNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                "monthLongNames": ["January", "February", "March", "April", "May", "June", "July", "August",
                    "September", "October", "November", "December"],
                "daysShortNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "daysLongNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            "ru_RU": {
                "monthShortNames": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                "monthLongNames": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
                    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                "daysShortNames": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                "daysLongNames": ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
            }
        };
        var registeredFormats = {
            '%d': {
                format: function(date) {
                    return formattingWithNulls(date.day, 2);
                },
                parse: function(value) {
                    var day = Number(value);
                    return isNaN(day) ? 0 : day;
                }
            },
            '%m': {
                format: function(date) {
                    return formattingWithNulls(date.month, 2);
                }
            },
            '%Y': {
                format: function(date) {
                    return formattingWithNulls(date.year, 4);
                }
            },
            '%w': {
                format: function(date) {
                    return that.getDayOfWeek(date);
                }
            },
            '%a': {
                format: function(date) {
                    return locales[locale]["daysShortNames"][that.getDayOfWeek(date)];
                }
            },
            '%A': {
                format: function(date) {
                    return locales[locale]["daysLongNames"][that.getDayOfWeek(date)];
                }
            },
            '%b': {
                format: function(date) {
                    return locales[locale]["monthShortNames"][date.month-1];
                }
            },
            '%B': {
                format: function(date) {
                    return locales[locale]["monthLongNames"][date.month-1];
                }
            },
            '%H': {
                format: function(date) {
                    return formattingWithNulls(date.hours, 2);
                }
            },
            '%M': {
                format: function(date) {
                    return formattingWithNulls(date.minutes, 2);
                }
            },
            '%S': {
                format: function(date) {
                    return formattingWithNulls(date.seconds, 2);
                }
            },
            '%s': {
                format: function(date) {
                    return that.time(date);
                }
            },
            '%F': {
                format: function(date) {
                    return formattingWithNulls(date.year, 4) + '-' + formattingWithNulls(date.month, 2) + '-' + formattingWithNulls(date.day, 2);
                }
            },
            '%D': {
                format: function(date) {
                    return formattingWithNulls(date.month, 2) + '/' + formattingWithNulls(date.day, 2) + '/' + formattingWithNulls(date.year, 4)
                }
            }
        };

        this.time = function (date, format) {
            if (date !== undefined) {
                if (typeof date === 'string') {
                    date = this.parse(date, format);
                }
                return Math.floor((Date.UTC(
                        date.year !== undefined ? date.year : 1970,
                        date.month !== undefined ? date.month-1 : 0,
                        date.day !== undefined ? date.day : 1,
                        date.hours !== undefined ? date.hours : 0,
                        date.minutes !== undefined ? date.minutes : 0,
                        date.seconds !== undefined ? date.seconds : 0)) / 1000);
            } else {
                return Math.floor(new Date().getTime() / 1000);
            }
        };

        this.date = function(date) {
            var d;
            if (typeof date === "number") {
                var jsDate = new Date(date*1000);
                d = {
                    year: jsDate.getUTCFullYear(),
                    month: jsDate.getUTCMonth() + 1, // js default months beginning from 0.
                    day: jsDate.getUTCDate(),
                    hours: jsDate.getUTCHours(),
                    minutes: jsDate.getUTCMinutes(),
                    seconds: jsDate.getUTCSeconds()
                };
            } else if (typeof date === "object") {
                d = {
                    year: date.year !== undefined ? date.year : 1970,
                    month: date.month !== undefined ? date.month : 1,
                    day: date.day !== undefined ? date.day : 1,
                    hours: date.hours !== undefined ? date.hours : 0,
                    minutes: date.minutes !== undefined ? date.minutes : 0,
                    seconds: date.seconds !== undefined ? date.seconds : 0
                }
            }
            return d;
        };

        this.now = function (format) {
            var currentDate = new Date();
            var obj = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1, // js default months beginning from 0.
                day: currentDate.getDate(),
                dayOfWeek: currentDate.getDay(),
                hours: currentDate.getHours(),
                minutes: currentDate.getMinutes(),
                seconds: currentDate.getSeconds(),
                timestamp: Math.floor((currentDate.getTime() - currentDate.getTimezoneOffset() * 60000) / 1000)
            };
            return format === undefined ? obj : this.format(obj, format);
        };

        // is leap year method
        this.isLeapYear = function (year) {
            year = year !== undefined ? Number(year) : this.now().year;
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
                    return daysInMonth[month - 1] + (leapYear ? 1 : 0);
                } else {
                    return daysInMonth[month - 1]
                }
            }
            if (typeof month === 'string') {
                var month_int = indexOf(locales[locale]["monthShortNames"], month);
                if (month_int === -1) {
                    month_int = indexOf(locales[locale]["monthLongNames"], month);
                }
                if (month_int === -1) {
                    return undefined;
                }
                month = month_int;
                if (month === 2) {
                    return daysInMonth[month - 1] + (leapYear ? 1 : 0);
                } else {
                    return daysInMonth[month - 1]
                }
            }
            return undefined;
        };

        this.getMonthNames = function (longNames) {
            if (longNames === true) {
                return locales[locale]["monthLongNames"];
            } else {
                return locales[locale]["monthShortNames"];
            }
        };

        this.getDayNames = function (longNames) {
            if (longNames === true) {
                return locales[locale]["daysLongNames"];
            } else {
                return locales[locale]["daysShortNames"];
            }
        };

        // Algorithm author: Tomohiko Sakamoto in 1993.
        this.getDayOfWeek = function (date) {
            var year = date.year;
            var month = date.month;
            var day = date.day;
            var t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
            year -= month < 3;
            return Math.floor((year + year / 4 - year / 100 + year / 400 + t[month - 1] + day) % 7);
        };

        var calcDate = function(date, value, type, modif) {
            if (typeof date !== 'object') {
                return undefined;
            }

            var newDate = JSON.parse(JSON.stringify(date));

            if (typeof value === 'object') {
                newDate = that.date(newDate);
                return that.normalizeDate({
                    year: newDate.year + modif*(value.year !== undefined ? value.year : 0),
                    month: newDate.month + modif*(value.month !== undefined ? value.month : 0),
                    day: newDate.day + modif*(value.day !== undefined ? value.day : 0),
                    hours: newDate.hours + modif*(value.hours !== undefined ? value.hours : 0),
                    minutes: newDate.minutes + modif*(value.minutes !== undefined ? value.minutes : 0),
                    seconds: newDate.seconds + modif*(value.seconds !== undefined ? value.seconds : 0)
                });
            } else if (typeof value === 'number') {
                if (type === 'seconds') {
                    newDate.seconds += modif*Number(value);
                }
                if (type === 'minutes') {
                    newDate.minutes += modif*Number(value);
                }
                if (type === 'hours') {
                    newDate.hours += modif*Number(value);
                }
                if (type === 'day') {
                    newDate.day += modif*Number(value);
                }
                if (type === 'month') {
                    newDate.month += modif*Number(value);
                }
                if (type === 'year') {
                    newDate.year += modif*Number(value);
                }
                return that.normalizeDate(newDate);
            } else {
                return undefined;
            }
        };

        this.incDate = function (date, value, type) {
            return calcDate(date, value, type, 1);
        };

        this.normalizeDate = function(date) {
            return JSON.parse(JSON.stringify(this.date(this.time(date))));
        };

        this.decDate = function (date, value, type) {
            return calcDate(date, value, type, -1);
        };

        this.between = function (dateFrom, dateTo, type) {
            var from = this.time(dateFrom);
            var to = this.time(dateTo);
            switch (type) {
                case 'year':
                    return Math.floor((to - from) / (86400 * 12 * 29.4));
                case 'month':
                    return Math.floor((to - from) / (86400 * 29.4)); // 29.4 - average of days count in months
                case 'day':
                    return Math.floor((to - from) / 86400);
                case 'hours':
                    return Math.floor((to - from) / 3600);
                case 'minutes':
                    return Math.floor((to - from) / 60);
                case 'seconds':
                    return to - from;
                default:
                    return undefined;
            }
        };

        this.getDaysArrayByWeek = function (dateFrom, dateTo) {
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
            while (i < (daysCount - (daysCount % 7) + (daysCount % 7 > 0 ? 7 : 0))) {
                if (i % 7 === 0) {
                    result.push([]);
                    resultIndex = result.length - 1;
                }
                if ((i < 7) && (i < dateFromDayOfWeek)) {
                    result[resultIndex].push(null);
                    daysCount++;
                } else {
                    if ((i > (daysCount - 1)) && (i > dateToDayOfWeek)) {
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

        this.format = function(date, format) {
            var result = format;
            var d;
            if ((typeof date === 'number')||(typeof date === 'object')) {
                d = this.date(date);
            } else {
                return undefined;
            }
            // formatting
            for (var key in registeredFormats) {
                if (registeredFormats.hasOwnProperty(key)) {
                    result = result.replace(key, registeredFormats[key].format(d));
                }
            }
            return result;
        };

        this.parse = function(str, format) {
            var lits = format.match(/(%d|%m|%Y|%H|%M|%S|%s)/g);
    //            delete lits[0];
            var format_re = format.replace(/(%d|%m|%H|%M|%S)/g, '(\\d{2})');
            format_re = format_re.replace(/(%Y)/g, '(\\d{4})');
            format_re = format_re.replace(/(%s)/g, '(\\d{1,10})'); //max timestamp is 2147483647.
            var re = new RegExp(format_re, 'g');
            var result = re.exec(str);
            var result2 = [];
            for (var i=1; i < result.length; i++) {
                if (typeof result[i] === 'string') {
                    result2.push(result[i]);
                }
            }
            var day = 0;
            var month = 0;
            var full_year = 0;
            var hour = 0;
            var minutes = 0;
            var seconds = 0;
            var timestamp = 0;
            for(var key in lits) {
                if (lits.hasOwnProperty(key)) {
                    switch(lits[key]) {
                    case '%d':
                        day = Number(result2[key]);
                        day = isNaN(day) ? 0 : day;
                        break;
                    case '%m':
                        month = Number(result2[key]);
                        month = isNaN(month) ? 0 : month;
                        break;
                    case '%Y':
                        full_year = Number(result2[key]);
                        full_year = isNaN(full_year) ? 0 : full_year;
                        break;
                    case '%H':
                        hour = Number(result2[key]);
                        hour = isNaN(hour) ? 0 : hour;
                        break;
                    case '%M':
                        minutes = Number(result2[key]);
                        minutes = isNaN(minutes) ? 0 : minutes;
                        break;
                    case '%S':
                        seconds = Number(result2[key]);
                        seconds = isNaN(seconds) ? 0 : seconds;
                        break;
                    case '%s':
                        timestamp = Number(result2[key]);
                        timestamp = isNaN(timestamp) ? 0 : timestamp;
                        break;
                    }
                }
            }
            if (timestamp !== 0) {
                var date = new Date(Number(timestamp*1000));
                var obj = this.date(timestamp);
                return this.incDate(obj, date.getTimezoneOffset(), 'minutes');
            }

            return {
                day: day,
                month: month,
                year: full_year,
                hours: hour,
                minutes: minutes,
                seconds: seconds
            }
        };

        this.setTimeout = function(callback, timeout) {
            return setTimeout(callback, Number(timeout)*1000);
        };

        this.setInterval = function(callback, timeout) {
            return setInterval(callback, Number(timeout)*1000);
        };

        this.clock = function(callback) {
            callback(that.now());
            return this.setInterval(function() {
                callback(that.now());
            }, 1);
        };

        this.alarm = function(date, callback) {
            var a = this.setInterval(function() {
                if (that.between(that.now(), date, 'seconds') === 0) {
                    callback(date);
                    clearInterval(a);
                }
            }, 1);
            return a;
        };

        this.validate = function(date, format) {
            if (typeof date === 'string') {
                date = this.parse(date, format);
            }
            var normalizedDate = this.normalizeDate(date);
            return (date.year === normalizedDate.year)&&(date.month === normalizedDate.month)&&(date.day === normalizedDate.day)&&
                    (date.hours === normalizedDate.hours)&&(date.minutes === normalizedDate.minutes)&&(date.seconds === normalizedDate.seconds);
        };

        this.reformat = function(date, formatFrom, formatTo) {
            return this.format(this.parse(date, formatFrom), formatTo);
        };

        this.setLocale = function(loc) {
            locale = loc || "en_US";
            return locale;
        };

        this.getLocale = function() {
            return locale;
        };

        this.getAvailableLocales = function() {
            return Object.keys(locales);
        };

        this.getVersion = function() {
            return version;
        };

        /*
         * options.dateFrom - string or object
         * options.formatFrom - string|undefined
         * options.dateTo - string or object
         * options.formatTo - string|undefined
         * options.period - number (seconds)|string (seconds, minutes, hours, day, month, year)
         * options.format - results format, string
         * options.asObject - results is object
         */
        this.generateDates = function(options) {
            var tsFrom = options.dateFrom, tsTo = options.dateTo, period, result;
            // timestamp "from"
            if (typeof options.dateFrom === 'string') {
                tsFrom = that.parse(options.dateFrom, options.formatFrom);
            }
            tsFrom = that.time(tsFrom);
            // timestamp "to"
            if (typeof options.dateTo === 'string') {
                tsTo = that.parse(options.dateTo, options.formatTo);
            }
            tsTo = that.time(tsTo);
            // period
            if (typeof options.period === 'number') {
                period = {
                    year: 0,
                    month: 0,
                    day: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: options.period
                }
            } else if (typeof options.period === 'string') {
                period = {
                    year: options.period === 'year' ? 1 : 0,
                    month: options.period === 'month' ? 1 : 0,
                    day: options.period === 'day' ? 1 : 0,
                    hours: options.period === 'hours' ? 1 : 0,
                    minutes: options.period === 'minutes' ? 1 : 0,
                    seconds: options.period === 'seconds' ? 1 : 0
                }
            } else if (typeof options.period === 'object') {
                period = {
                    year: options.period.year !== undefined ? options.period.year : 0,
                    month: options.period.month !== undefined ? options.period.month : 0,
                    day: options.period.day !== undefined ? options.period.day : 0,
                    hours: options.period.hours !== undefined ? options.period.hours : 0,
                    minutes: options.period.minutes !== undefined ? options.period.minutes : 0,
                    seconds: options.period.seconds !== undefined ? options.period.seconds : 0
                }
            }

            // result
            result = options.asObject === true ? {} : [];
            for (; tsFrom <= tsTo; tsFrom = this.time(that.incDate(that.date(tsFrom), period))) {
                if (options.asObject === true) {
                    if (options.format !== undefined) {
                        result[that.format(tsFrom, options.format)] = {};
                    } else {
                        result[that.format(tsFrom, '%F %H:%M:%S')] = {};
                    }
                } else {
                    if (options.format !== undefined) {
                        result.push(that.format(tsFrom, options.format));
                    } else {
                        result.push(tsFrom);
                    }
                }
            }
            return result;
        };

        this.registerFormat = function(value, formatFunc, parseFunc) {
            registeredFormats[value] = {
                format: formatFunc,
                parse: parseFunc
            }
        };
        this.unregisterFormat = function(value) {
            delete registeredFormats[value];
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
        var formattingWithNulls = function(val, symb_count) {
            var v = val.toString();
            while (v.length < symb_count) {
                v = '0' + v;
            }
            return v;
        };
    };

    window.tempus = new TempusJS();
})();
