/**
 * @author Aleksey Kuznetsov me@akuzn.com
 * @version 0.1.31
 * @url https://github.com/crusat/tempus-js
 * @description Library with date/time methods
 */
(function () {
    /**
     * Tempus Date Object. Base object, date objects convert to it.
     * @param date {object|number|undefined} Date as {year: number, month: number, day: number,
     *     hours: number, minutes: number, seconds: number}, numeric timestamp or undefined for current time.
     *     Always must be a local date/time.
     *     Timestamp is ALWAYS in UTC.
     * @param timezoneOffsetParam {number} Time zone offset value. If undefined - default value.
     * @class TempusDate
     */
    window.TempusDate = function(date, timezoneOffsetParam) {
        // timezone
        var timezoneOffset;


        // obj
        var makeInnerDate = function(date) {
            if (date === undefined) {
                return new Date();
            } else if (typeof date === 'number') {
                return new Date(date*1000);
            } else if (typeof date === 'object') {
                return new Date(
                    date.year !== undefined ? date.year : 1970,
                    date.month !== undefined ? date.month-1 : 0,
                    date.day !== undefined ? date.day : 1,
                    date.hours !== undefined ? date.hours : 0,
                    date.minutes !== undefined ? date.minutes : 0,
                    date.seconds !== undefined ? date.seconds : 0
                );
            } else if (typeof date === 'string') {
                return new Date(date);
            }
            return undefined;
        };
        var innerDate = makeInnerDate(date); // It's local date


        if (timezoneOffsetParam === undefined) {
            timezoneOffset = innerDate.getTimezoneOffset()*60;
        } else {
            timezoneOffset = Number(timezoneOffsetParam);
        }

        if (date === undefined) {
            innerDate = new Date(innerDate.getTime() - timezoneOffset*1000);
        }

        this.getDateOriginal = function() {
            return {
                year: date.year !== undefined ? date.year : 1970,
                month: date.month !== undefined ? date.month : 1,
                day: date.day !== undefined ? date.day : 1,
                hours: date.hours !== undefined ? date.hours : 0,
                minutes: date.minutes !== undefined ? date.minutes : 0,
                seconds: date.seconds !== undefined ? date.seconds : 0
            };
        };
        /**
         * Returns date at local time.
         * @memberof TempusDate
         * @returns {{year: number, month: number, day: (number|*), hours: number, minutes: number, seconds: number, timestamp: number, timezoneOffset: number, dayOfWeek: number}}
         */
        this.getDate = function() {
            return {
                year: innerDate.getFullYear(),
                month: innerDate.getMonth()+1,
                day: innerDate.getDate(),
                hours: innerDate.getHours(),
                minutes: innerDate.getMinutes(),
                seconds: innerDate.getSeconds(),
                timestamp: Math.floor(innerDate.getTime()/1000),
                timezoneOffset: timezoneOffset,
                dayOfWeek: innerDate.getDay()
            };
        };
        /**
         * Returns date at UTC.
         * @memberof TempusDate
         * @returns {{year: number, month: number, day: number, hours: number, minutes: number, seconds: number, timestamp: number, timezoneOffset: number, dayOfWeek: number}}
         */
        this.getDateUTC = function() {
            return {
                year: innerDate.getUTCFullYear(),
                month: innerDate.getUTCMonth()+1,
                day: innerDate.getUTCDate(),
                hours: innerDate.getUTCHours(),
                minutes: innerDate.getUTCMinutes(),
                seconds: innerDate.getUTCSeconds(),
                timestamp: Number(Math.floor(innerDate.getTime()/1000) + timezoneOffset),
                timezoneOffset: timezoneOffset,
                dayOfWeek: innerDate.getUTCDay()
            };
        }
    };
    /**
     * TempusJS constructor.
     * @constructor
     * @namespace
     */
    var TempusJS = function () {
        // private
        var that = this;
        var version = '0.1.31';
        var locale = 'en_US';
        var weekStartsFromMonday = false;
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var timezoneOffsetDefault = new TempusDate().getDate().timezoneOffset; // seconds
        var timezoneOffset = timezoneOffsetDefault; // seconds
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

        /**
         * Returns dump of tempus date object (see {@link TempusDate}) from timestamp (UTC) or received object.
         * @param date {number|object} Date as timestamp or object.
         * @param options {object|undefined} Options object.
         * @param options.week {bool} Add to response number of week. Default is false.
         * @param options.dayOfWeek {bool} Add to response day of week. Default is false.
         * @returns {object} date - Tempus date object.
         * @example
         * // returns {"year":2013,"month":11,"day":5,"hours":16,"minutes":1,"seconds":53}
         * tempus.date(1383667313);
         * @example
         * // returns {"year":2013,"month":11,"day":5,"hours":0,"minutes":0,"seconds":0}
         * tempus.date(1383609600);
         * @example
         * // returns {"year":1970,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0}
         * tempus.date({});
         * @example
         * // returns {"year":2013,"month":10,"day":5,"hours":0,"minutes":0,"seconds":0}
         * tempus.date({year:2013, month:10, day:5});
         * @example
         * // returns {"year":2013,"month":10,"day":5,
         * //     "hours":0,"minutes":0,"seconds":0,"week":40,"dayOfWeek":6}
         * tempus.date({year:2013, month:10, day:5}, {week: true});
         */
        this.date = function(date, options) {
            var d;
            if ((typeof date === "number")||(typeof date === "object")) {
                d = new TempusDate(date, timezoneOffset).getDate();
                if (options && options.week === true) {
                    d.week = that.getWeekNumber(d);
                }
            } else {
                d = undefined;
            }
            return d;
        };


//        var calcDate = function(date, value, type, modif) {
//            if (typeof date !== 'object') {
//                return undefined;
//            }
//
//            var newDate = clone(date);
//
//            if (typeof value === 'object') {
//                newDate = that.date(newDate);
//                return that.normalizeDate({
//                    year: newDate.year + modif*(value.year !== undefined ? value.year : 0),
//                    month: newDate.month + modif*(value.month !== undefined ? value.month : 0),
//                    day: newDate.day + modif*(value.day !== undefined ? value.day : 0),
//                    hours: newDate.hours + modif*(value.hours !== undefined ? value.hours : 0),
//                    minutes: newDate.minutes + modif*(value.minutes !== undefined ? value.minutes : 0),
//                    seconds: newDate.seconds + modif*(value.seconds !== undefined ? value.seconds : 0)
//                });
//            } else if (typeof value === 'number') {
//                if (type === 'seconds') {
//                    newDate.seconds += modif*Number(value);
//                }
//                if (type === 'minutes') {
//                    newDate.minutes += modif*Number(value);
//                }
//                if (type === 'hours') {
//                    newDate.hours += modif*Number(value);
//                }
//                if (type === 'day') {
//                    newDate.day += modif*Number(value);
//                }
//                if (type === 'month') {
//                    newDate.month += modif*Number(value);
//                }
//                if (type === 'year') {
//                    newDate.year += modif*Number(value);
//                }
//                return that.normalizeDate(newDate);
//            } else {
//                return undefined;
//            }
//        };

        /**
         * Returns date object, increased on [value] [type].
         * @param date {object} Source date. Tempus date object (see {@link date}).
         * @param value {number|object} Any integer value or tempus date object (see {@link date}).
         * @param type {string} Value type. Can be 'seconds','minutes', 'hours', 'day', 'month', 'year'
         * @returns {object} Tempus date object.
         * @example
         * // returns {"year":2013,"month":10,"day":12,"hours":0,"minutes":0,"seconds":0}
         * tempus.incDate({year: 2013, month: 10, day: 5}, 7, 'day');
         * @example
         * // returns {"year":2014,"month":1,"day":13,"hours":0,"minutes":0,"seconds":0}
         * tempus.incDate({year: 2013, month: 10, day: 25}, 80, 'day');
         * @example
         * // returns {"year":2013,"month":12,"day":30,"hours":0,"minutes":0,"seconds":0}
         * tempus.incDate({year: 2013, month: 1, day: 30}, 11, 'month');
         * @example
         * // returns {"year":2015,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0}
         * tempus.incDate({year: 2000, month: 1, day: 1}, 15, 'year');
         * @example
         * // returns {"year":2013,"month":6,"day":1,"hours":0,"minutes":0,"seconds":0}
         * tempus.incDate({year:2013, month: 1, day:1}, {month: 5});
         * @example
         * // returns {"year":2014,"month":4,"day":20,"hours":15,"minutes":10,"seconds":1}
         * tempus.incDate({year:2013, month: 3, day:10}, {year: 1, month: 1, day: 10,
         *     hours: 15, minutes: 10, seconds: 1});
         */
//        this.incDate = function (date, value, type) {
//            return calcDate(date, value, type, 1);
//        };

        /**
         * Normalize date to valid.
         * @param date {object} Tempus date object (see {@link date}).
         * @returns {object} Tempus date object (see {@link date}).
         * @example
         * // returns {"day":1,"month":1,"year":2014,"hours":0,"minutes":0,"seconds":0}
         * tempus.normalizeDate({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0});
         * @example
         * // returns {"day":15,"month":2,"year":2014,"hours":0,"minutes":0,"seconds":0}
         * tempus.normalizeDate({day:46,month:13,year:2013,hours:0,minutes:0,seconds:0});
         * @example
         * // returns {"day":3,"month":8,"year":2012,"hours":6,"minutes":59,"seconds":58}
         * tempus.normalizeDate({day:32,month:-5,year:2013,hours:55,minutes:0,seconds:-2});
         * @example
         * // returns {"day":19,"month":3,"year":2013,"hours":23,"minutes":0,"seconds":0}
         * tempus.normalizeDate({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0});
         */
//        this.normalizeDate = function(date) {
//            return clone(this.date(this.time(date)));
//        };

        /**
         * Returns date object, decreased on [value] [type].
         * @param date {object} Source date. Tempus date object (see {@link date}).
         * @param value {number|object} Any integer value or tempus date object (see {@link date}).
         * @param type {string} Value type. Can be 'seconds','minutes', 'hours', 'day', 'month', 'year'
         * @returns {object} Tempus date object.
         * @example
         * // returns {"year":2013,"month":9,"day":28,"hours":0,"minutes":0,"seconds":0}
         * tempus.decDate({year: 2013, month: 10, day: 5}, 7, 'day');
         * @example
         * // returns {"year":2013,"month":8,"day":6,"hours":0,"minutes":0,"seconds":0}
         * tempus.decDate({year: 2013, month: 10, day: 25}, 80, 'day');
         * @example
         * // returns {"year":2012,"month":2,"day":30,"hours":0,"minutes":0,"seconds":0}
         * tempus.decDate({year: 2013, month: 1, day: 30}, 11, 'month');
         * @example
         * // returns {"year":1985,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0}
         * tempus.decDate({year: 2000, month: 1, day: 1}, 15, 'year');
         * @example
         * // returns {"year":2012,"month":8,"day":1,"hours":0,"minutes":0,"seconds":0}
         * tempus.decDate({year:2013, month: 1, day:1}, {month: 5});
         * @example
         * // returns {"year":2012,"month":1,"day":30,"hours":8,"minutes":49,"seconds":59}
         * tempus.decDate({year:2013, month: 3, day:10}, {year: 1, month: 1, day: 10,
         *     hours: 15, minutes: 10, seconds: 1});
         */
//        this.decDate = function (date, value, type) {
//            return calcDate(date, value, type, -1);
//        };

        /**
         * Returns integer of date between from [dateFrom] to [dateTo] as [type].
         *
         * Live Demo: http://plnkr.co/edit/BaPSNOdUbbiazYeqO9KA?p=preview
         * @param dateFrom {object} Tempus date object (see {@link date}).
         * @param dateTo {object} Tempus date object (see {@link date}).
         * @param type {string} Type. Can be 'seconds', 'minutes', 'hours', 'day', 'month', 'year'.
         * @returns {number|undefined} Value of [type] between dateFrom to dateTo.
         * @example
         * // returns 4
         *
         * @example
         *
         *
         * @example
         *
         *
         * @example
         *
         *
         * @example
         *
         *
         *
         * @example
         * // my current age
         * // returns 25
         * tempus.between({year: 1988, month: 3, day: 6}, tempus.now(), 'year');
         */
        this.between = function (dateFrom, dateTo, type) {
            var from = this.time(dateFrom);
            var to = this.time(dateTo);
            switch (type) {
                case 'year':
                    return Math.floor((to - from) / 31556952); // 365.2425 - average days in year. Here in seconds
                case 'month':
                    return Math.floor((to - from) / 2629746);
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


//        this.format = function(date, format) {
//            var result = format;
//            var d;
//            if ((typeof date === 'number')||(typeof date === 'object')) {
//                d = this.date(date);
//            } else {
//                return undefined;
//            }
//            // formatting
//            for (var key in registeredFormats) {
//                if (registeredFormats.hasOwnProperty(key)) {
//                    result = result.replace(key, registeredFormats[key].format(d));
//                }
//            }
//            return result;
//        };


//        this.detectFormat = function(str) {
//            var defaultFormats = [
//                '^%d\\.%m\\.%Y$', '^%Y-%m-%d$', '^%m/%d/%Y$', '^%Y-%m-%dT%H:%M:%S$',
//                '^%d\\.%m\\.%Y %H:%M:%S$', '^%d\\.%m\\.%Y %H:%M$', '^%d\\.%m\\.%Y %H$',
//                '^%Y-%m-%d %H:%M:%S$', '^%Y-%m-%d %H:%M$', '^%Y-%m-%d %H$',
//                '^%m/%d/%Y %H:%M:%S$', '^%m/%d/%Y %H:%M$', '^%m/%d/%Y %H$',
//                '^%Y$', '^%H:%M:%S$', '^%H:%M$'
//            ];
//            for (var i=0; i < defaultFormats.length; i++) {
//                if (that.parse(str, defaultFormats[i]) !== undefined) {
//                    return defaultFormats[i].slice(1,-1);
//                }
//            }
//            return undefined;
//        };

        /**
         * Returns date object from parsed string.
         * @param str {string} Formatted date string.
         * @param format {string|undefined} Format (see index page). If undefined, tempus will be auto detect format.
         * @param original {boolean|undefined} If true, returns not normalized date.
         * @returns {object|undefined} Tempus date object (see {@link date}).
         * @example
         * // returns {"day":21,"month":10,"year":2013,"hours":0,"minutes":0,"seconds":0}
         * tempus.parse('21.10.2013', '%d.%m.%Y');
         * @example
         * // returns {"day":5,"month":10,"year":2013,"hours":16,"minutes":20,"seconds":15}
         * tempus.parse('20131005162015', '%Y%m%d%H%M%S');
         * @example
         * // returns {"day":7,"month":5,"year":2012,"hours":0,"minutes":0,"seconds":0}
         * tempus.parse('2012-05-07', '%F');
         * @example
         * // returns {"day":1,"month":12,"year":2013,"hours":0,"minutes":0,"seconds":0}
         * tempus.parse('12/01/2013', '%D');
         * @example
         * // returns {"day":5,"month":12,"year":2010,"hours":0,"minutes":0,"seconds":0}
         * tempus.parse('05 Dec, 2010', '%d %b, %Y');
         * @example
         * // returns {"day":10,"month":10,"year":2010,"hours":0,"minutes":0,"seconds":0}
         * tempus.parse('10 October, 2010', '%d %B, %Y');
         * @example
         * // returns {"day":31,"month":12,"year":2012,"hours":0,"minutes":0,"seconds":0}
         * tempus.parse('31.12.2012');
         * @example
         * // returns {"year":2013,"month":3,"day":5,"hours":12,"minutes":31,"seconds":0}
         * tempus.parse('2013-03-05 12:31');
         * @example
         * // returns {"year":2013,"month":3,"day":5,"hours":0,"minutes":0,"seconds":0}
         * tempus.parse('2013-03-05', undefined, true);
         */
//        this.parse = function(str, format, original) {
//            var key;
//            var litsarr = [];
//            if (format === undefined) {
//                format = that.detectFormat(str);
//            }
//            format = '^'+format+'$';
//            var format_re = format;
//            for (key in registeredFormats) {
//                if (registeredFormats.hasOwnProperty(key)) {
//                    litsarr.push(key);
//                    format_re = format_re.replace(new RegExp('('+key+')', 'g'), '('+registeredFormats[key].parseLit+')');
//                }
//            }
//            var litsstr = new RegExp('('+litsarr.join('|')+')', 'g');
//            var lits = format.match(litsstr);
//            var re = new RegExp(format_re, 'g');
//            var result = re.exec(str);
//            var result2 = [];
//            try {
//                for (var i=1; i < result.length; i++) {
//                    if (typeof result[i] === 'string') {
//                        result2.push(result[i]);
//                    }
//                }
//            } catch(e) {
//                return undefined;
//            }
//            var resultdate = {};
//            var tmpdate;
//            for(key in lits) {
//                if (lits.hasOwnProperty(key)&&(registeredFormats.hasOwnProperty(lits[key]))&&!isNaN(Number(key))) {
//                    tmpdate = registeredFormats[lits[key]].parse(result2[key]);
//                    resultdate = {
//                        year: tmpdate.year != undefined ? tmpdate.year : resultdate.year,
//                        month: tmpdate.month != undefined ? tmpdate.month : resultdate.month,
//                        day: tmpdate.day != undefined ? tmpdate.day : resultdate.day,
//                        hours: tmpdate.hours != undefined ? tmpdate.hours : resultdate.hours,
//                        minutes: tmpdate.minutes != undefined ? tmpdate.minutes : resultdate.minutes,
//                        seconds: tmpdate.seconds != undefined ? tmpdate.seconds : resultdate.seconds
//                    };
//                }
//            }
//            if (original === true) {
//                return new TempusDate(resultdate, timezoneOffset).getDateOriginal();
//            } else {
//                return that.date(resultdate);
//            }
//        };


        /**
         * Alarms at [date]. After alarming self-destructs.
         *
         * Live Demo: http://plnkr.co/edit/lORJQp?p=preview
         * @param date {object} Tempus date object (see {@link date}).
         * @param callback {function} Callback.
         * @returns {number} Default setInterval identify.
         * @example
         * // Over 20 seconds show message "Alarmed at ..."
         * var alarmAt = tempus.incDate(tempus.now(), 20, 'seconds');
         * document.getElementById('tempus-alarm-example').innerHTML = tempus.format(alarmAt, '%H:%M:%S %d.%m.%Y');
         * var a = tempus.alarm(alarmAt, function(date) {
         *     alert('Alarmed at '+tempus.format(date, '%H:%M:%S %d.%m.%Y'));
         * });
         */
//        this.alarm = function(date, callback) {
//            var a = this.setInterval(function() {
//                if (that.between(that.now(), date, 'seconds') === 0) {
//                    callback(date);
//                    clearInterval(a);
//                }
//            }, 1);
//            return a;
//        };

        /**
         * Validates date.
         * @param date {object|string} Tempus date object (see {@link date}) or formatted date string.
         * @param format {string|undefined} Format (see index page). If undefined, tempus will be auto detect format.
         * @returns {boolean} Valid or not valid.
         * @example
         *
         *
         * @example
         *
         *
         * @example
         * // returns true
         *
         * @example
         *
         *
         * @example
         * // returns true
         *
         * @example
         *
         *
         * @example
         *
         *
         * @example
         *
         *
         * @example
         *
         *
         * @example
         *
         *
         * @example
         *
         *
         * @example
         *
         *
         * @example
         *
         *
         */
//        this.validate = function(date, format) {
//            if (typeof date === 'string') {
//                date = this.parse(date, format, true);
//            }
//            var normalizedDate = this.normalizeDate(date);
//            return (date.year === normalizedDate.year)&&(date.month === normalizedDate.month)&&(date.day === normalizedDate.day)&&
//                    (date.hours === normalizedDate.hours)&&(date.minutes === normalizedDate.minutes)&&(date.seconds === normalizedDate.seconds);
//        };

        /**
         * Reformats date from one to other format.
         * @param date {string} Formatted date string.
         * @param formatFrom {string|undefined} Format (see index page). If undefined, tempus will be auto detect format.
         * @param formatTo {string} Format of date. See index page for defaults.
         * @returns {string|undefined} Returns a reformatted date string.
         * @example
         * // returns "12.03.2013"
         * tempus.reformat('2013-03-12', '%Y-%m-%d', '%d.%m.%Y');
         * @example
         * // returns "15.03.2013"
         * tempus.reformat('2013-03-15 16:00', '%Y-%m-%d %H:%M', '%d.%m.%Y');
         * @example
         * // returns "12:31 (Fri 15, 2013)"
         * tempus.reformat('2013-03-15T12:31:48', '%Y-%m-%dT%H:%M:%S', '%H:%M (%a %d, %Y)');
         * @example
         * // returns "2012-05-15"
         * tempus.reformat('15.05.2012', undefined, '%Y-%m-%d');
         */
        // remove it
//        this.reformat = function(date, formatFrom, formatTo) {
//            return this.format(this.parse(date, formatFrom), formatTo);
//        };

        /**
         * Settings up locale. With this %a, %A, %b, %B was returning strings on needed languages. Default is "en_US".
         * For list locales see {@link getAvailableLocales}.
         * @param loc {string|undefined} Need locale. If undefined, "en_US" will be select.
         * @returns {undefined}
         * @example
         * // returns "2013, Ноябрь, 06, Среда"
         * tempus.setLocale("ru_RU");
         * tempus.now('%Y, %B, %d, %A');
         */
        // use lang()
//        this.setLocale = function(loc) {
//            locale = loc || "en_US";
//        };

        /**
         * Gets current value of locale.
         * @returns {string} Current locale.
         * @example
         * // returns "en_US"
         * tempus.getLocale();
         */
        // use lang
//        this.getLocale = function() {
//            return locale;
//        };

//        this.setWeekStartsFromMonday = function(v) {
//            weekStartsFromMonday = v ? true : false;
//            return weekStartsFromMonday;
//        };
//        this.getWeekStartsFromMonday = function() {
//            return weekStartsFromMonday;
//        };

        /**
         * Get available locales list.
         * @returns {Array} Array of available locales.
         * @example
         * // returns ["en_US", "ru_RU"]
         * tempus.getAvailableLocales();
         */
//        this.getAvailableLocales = function() {
//            return Object.keys(locales);
//        };


        /**
         * Generates dates from [dateFrom] to [dateTo] with period [period] and result format dates is [format] or timestamps, if format is undefined.
         * @param options {object|undefined} Options object.
         * @param options.dateFrom {string|object} Tempus date object (see {@link date}) or formatted date string.
         * @param options.formatFrom {string|undefined} Format (see index page). If undefined, tempus will be auto detect format.
         * @param options.dateTo {string|object} Tempus date object (see {@link date}) or formatted date string.
         * @param options.formatTo {string|undefined} Format (see index page). If undefined, will use formatFrom.
         * @param options.period {number|string|object} Step size for dates, can be 'seconds', 'minutes', 'hours',
         *     'day', 'month', 'year', number value (seconds) or tempus date object (see {@link date}).
         * @param options.format {string|undefined} Results format. If undefined, returns tempus date objects (see {@link date}).
         * @param options.asObject {boolean} If true, dates will be keys for objects in result array.
         * @param options.groupBy {string} If not undefined, group array by some field in tempus date object. Can be
         *     'seconds', 'minutes', 'hours', 'day', 'week', 'month', 'year'.
         * @returns {Array|object} Array or object from dates.
         * @example
         * // returns ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00",
         * //     "10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00",
         * //     "20:00","21:00","22:00","23:00"];
         * tempus.generateDates({
         *     dateFrom: '01.01.2013 00:00',
         *     formatFrom: '%d.%m.%Y %H:%M',
         *     dateTo: '01.01.2013 23:00',
         *     formatTo: '%d.%m.%Y %H:%M',
         *     period: 'hours',
         *     format: '%H:%M'
         * });
         * @example
         * // returns ["2013-01-01","2013-02-01","2013-03-01","2013-04-01","2013-05-01",
         * //     "2013-06-01","2013-07-01","2013-08-01","2013-09-01","2013-10-01"];
         * tempus.generateDates({
         *     dateFrom: '01.01.2013',
         *     formatFrom: '%d.%m.%Y',
         *     dateTo: '31.10.2013',
         *     formatTo: '%d.%m.%Y',
         *     period: 'month',
         *     format: '%Y-%m-%d'
         * });
         * @example
         * // returns ["2013-01-01 00:00","2013-01-02 12:00","2013-01-04 00:00","2013-01-05 12:00","2013-01-07 00:00",
         * //     "2013-01-08 12:00","2013-01-10 00:00","2013-01-11 12:00"];
         * tempus.generateDates({
         *     dateFrom: '01.01.2013',
         *     dateTo: '12.01.2013',
         *     period: {day: 1, hours: 12},
         *     format: '%Y-%m-%d %H:%M'
         * });
         * @example
         * // returns ["05.01.2013","06.01.2013","07.01.2013","08.01.2013","09.01.2013","10.01.2013","11.01.2013",
         * //     "12.01.2013","13.01.2013","14.01.2013","15.01.2013","16.01.2013","17.01.2013","18.01.2013",
         * //     "19.01.2013","20.01.2013","21.01.2013","22.01.2013","23.01.2013","24.01.2013","25.01.2013",
         * //     "26.01.2013","27.01.2013","28.01.2013","29.01.2013","30.01.2013","31.01.2013","01.02.2013"];
         * tempus.generateDates({
         *     dateFrom: {year: 2013, month: 1, day: 5},
         *     dateTo: {year: 2013, month: 2, day: 1},
         *     period: {day: 1},
         *     format: '%d.%m.%Y'
         * });
         * @example
         * // returns {"05.01.2013":{},"06.01.2013":{},"07.01.2013":{},"08.01.2013":{},"09.01.2013":{},
         * //     "10.01.2013":{},"11.01.2013":{},"12.01.2013":{},"13.01.2013":{},"14.01.2013":{},"15.01.2013":{}};
         * tempus.generateDates({
         *     dateFrom: {year: 2013, month: 1, day: 5},
         *     dateTo: {year: 2013, month: 1, day: 15},
         *     period: {day: 1},
         *     format: '%d.%m.%Y',
         *     asObject: true
         * });
         * @example
         * // returns [["01.01.2013","02.01.2013","03.01.2013","04.01.2013","05.01.2013","06.01.2013","07.01.2013","08.01.2013",
         * // "09.01.2013","10.01.2013","11.01.2013","12.01.2013","13.01.2013","14.01.2013","15.01.2013","16.01.2013","17.01.2013",
         * // "18.01.2013","19.01.2013","20.01.2013","21.01.2013","22.01.2013","23.01.2013","24.01.2013","25.01.2013","26.01.2013",
         * // "27.01.2013","28.01.2013","29.01.2013","30.01.2013","31.01.2013"],["01.02.2013","02.02.2013","03.02.2013","04.02.2013",
         * // "05.02.2013","06.02.2013","07.02.2013","08.02.2013","09.02.2013","10.02.2013","11.02.2013","12.02.2013","13.02.2013",
         * // "14.02.2013","15.02.2013","16.02.2013","17.02.2013","18.02.2013","19.02.2013","20.02.2013","21.02.2013","22.02.2013",
         * // "23.02.2013","24.02.2013","25.02.2013","26.02.2013","27.02.2013","28.02.2013"],["01.03.2013","02.03.2013","03.03.2013",
         * // "04.03.2013","05.03.2013","06.03.2013","07.03.2013","08.03.2013","09.03.2013","10.03.2013","11.03.2013","12.03.2013",
         * // "13.03.2013","14.03.2013","15.03.2013"]]
         * tempus.generateDates({
         *     dateFrom: {year: 2013, month: 1, day: 1},
         *     dateTo: {year: 2013, month: 3, day: 15},
         *     period: {day: 1},
         *     format: '%d.%m.%Y',
         *     groupBy: 'month'
         * });
         */






        /**
         * Get week number.
         * @param date {object|string} Date as object (see {@link date}) or string (any formatted date, see examples)
         * @param format {string|undefined} Date format as string (see formats doc) or undefined for autodetect format.
         * @returns {number} Week number from 1.
         * @example
         * // returns 46
         * tempus.getWeekNumber({day: 12, month: 11, year: 2013});
         * @example
         * // returns 42
         * tempus.getWeekNumber('12.10.2000');
         * @example
         * // returns 1
         * tempus.getWeekNumber('1999-01-01');
         */
//        this.getWeekNumber = function(date, format) {
//            var currentTime;
//            if (typeof date === 'string') {
//                currentTime = that.time(date, format);
//                date = that.date(currentTime);
//                currentTime *= 1000;
//            } else {
//                currentTime = that.time(date)*1000;
//            }
//            var startOfYear = new TempusDate({year: date.year, month: 1, day: 1}, timezoneOffset).getDate().dayOfWeek;
//            return Math.ceil((((currentTime - startOfYear) / 86400000) + startOfYear+1)/7);
//        };

        /**
         * Returns current timezone offset.
         * @param type {string|undefined} Type. Can be 'hours', 'minutes' or undefined. If undefined, returns in seconds.
         * @returns {number} Current timezone offset value.
         * @example
         * // returns -14400
         * tempus.getTimezoneOffset();
         * @example
         * // returns -4
         * tempus.getTimezoneOffset('hours');
         * @example
         * // returns -240
         * tempus.getTimezoneOffset('minutes');
         */
//        this.getTimezoneOffset = function(type) {
//            switch (type) {
//                case 'hours':
//                    return Math.floor(timezoneOffset / 3600);
//                case 'minutes':
//                    return (timezoneOffset / 60);
//                default:
//                    return timezoneOffset
//            }
//        };

//        this.setTimezoneOffset = function(value, type) {
//            switch (type) {
//                case 'hours':
//                    timezoneOffset = value * 3600;
//                    break;
//                case 'minutes':
//                    timezoneOffset = value * 60;
//                    break;
//                default:
//                    if (value === undefined) {
//                        timezoneOffset = timezoneOffsetDefault;
//                    } else {
//                        timezoneOffset = Number(value);
//                    }
//            }
//        };

        // *** HELPERS ***
        var formattingWithNulls = function(val, symb_count) {
            var v = val.toString();
            while (v.length < symb_count) {
                v = '0' + v;
            }
            return v;
        };
        var clone = function(obj){
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        };
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(obj, start) {
                for (var i = (start || 0), j = this.length; i < j; i++) {
                    if (this[i] === obj) { return i; }
                }
                return -1;
            }
        }
    };

    window.tempus = new TempusJS();
})();
