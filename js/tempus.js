(function() {
    var _TP = window.TP,
        _Tempus = window.Tempus,
        Tempus,
        version = '0.2.0',
        lang = 'en',
        translations = {
            "en": {
                "monthShortNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                "monthLongNames": ["January", "February", "March", "April", "May", "June", "July", "August",
                    "September", "October", "November", "December"],
                "daysShortNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "daysLongNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            "ru": {
                "monthShortNames": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                "monthLongNames": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
                    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                "daysShortNames": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                "daysLongNames": ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
            }
        },
        registeredFormats = {
            '%d': {
                format: function (date) {
                    return formattingWithNulls(date.day() || date.constants().MIN_DAY, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {day: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%m': {
                format: function (date) {
                    return formattingWithNulls(date.month() || date.constants().MIN_MONTH, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {month: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%Y': {
                format: function (date) {
                    return formattingWithNulls(date.year() || date.constants().MIN_YEAR, 4);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {year: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{4}'
            },
            '%w': {
                format: function (date) {
                    return date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK;
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                parseLit: '\\d{1}'
            },
            '%a': {
                format: function (date) {
                    return translations[lang]["daysShortNames"][date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK];
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                parseLit: '\\w+'
            },
            '%A': {
                format: function (date) {
                    return translations[lang]["daysLongNames"][date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK];
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                parseLit: '\\w+'
            },
            '%b': {
                format: function(date) {
                    return translations[lang]["monthShortNames"][(date.month() || date.constants().MIN_MONTH) - (monthFromZero ? 0 : 1)];
                },
                parse: function(value) {
                    var month = that.getMonthNames().indexOf(value)+1;
                    return {month: month !== -1 ? month : undefined}
                },
                parseLit: '\\w+'
            },
            '%B': {
                format: function(date) {
                    return translations[lang]["monthLongNames"][(date.month() || date.constants().MIN_MONTH)-(monthFromZero ? 0 : 1)];
                },
                parse: function(value) {
                    var month = that.getMonthNames(true).indexOf(value)+1;
                    return {month: month !== -1 ? month : undefined}
                },
                parseLit: '\\w+'
            },
            '%H': {
                format: function (date) {
                    return formattingWithNulls(date.hours() || date.constants().MIN_HOURS, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {hours: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%M': {
                format: function (date) {
                    return formattingWithNulls(date.minutes() || date.constants().MIN_MINUTES, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {minutes: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%S': {
                format: function (date) {
                    return formattingWithNulls(date.seconds() || date.constants().MIN_SECONDS, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {seconds: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%s': {
                format: function(date) {
                    return date.timestamp();
                },
                parse: function(value) {
                    var v = Number(value);
                    var date = new TempusDate(Number(v), timezoneOffset);
                    var obj = that.date(v);
                    return isNaN(v) ? {} : that.incDate(obj, date.getTimezoneOffset(), 'minutes');
                },
                parseLit: '\\d{1,10}'
            },
            '%F': {
                format: function (date) {
                    return formattingWithNulls(date.year() || date.constants().MIN_YEAR, 4) + '-' +
                        formattingWithNulls(date.month() || date.constants().MIN_MONTH, 2) + '-' +
                        formattingWithNulls(date.day() || date.constants().MIN_DAY, 2);
                },
                parse: function (value) {
                    var year = Number(value.slice(0, 4));
                    var month = Number(value.slice(6, 7));
                    var day = Number(value.slice(9, 10));
                    return {
                        year: year,
                        month: month,
                        day: day
                    }
                },
                parseLit: '\\d{4}-\\d{2}-\\d{2}'
            },
            '%D': {
                format: function (date) {
                    return formattingWithNulls(date.month() || this.constants().MIN_MONTH, 2) +
                        '/' + formattingWithNulls(date.day() || this.constants().MIN_DAY, 2) +
                        '/' + formattingWithNulls(date.year() || this.constants().MIN_YEAR, 4)
                },
                parse: function (value) {
                    var month = Number(value.slice(0, 2));
                    var day = Number(value.slice(3, 5));
                    var year = Number(value.slice(6, 10));
                    return {
                        year: year,
                        month: month,
                        day: day
                    }
                },
                parseLit: '\\d{2}\/\\d{2}\/\\d{4}'
            }
        },
        useMilliseconds = false,
        monthFromZero = false;

    var getDayOfWeek = function (year, month, day) {
            var t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
            year -= month < 3;
            return Math.floor((year + year / 4 - year / 100 + year / 400 + t[month - 1] + day) % 7);
        };

    var isLeapYear = function (year) {
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                return year % 400 == 0;
            } else return true;
        }
        return false;
    };

    var formattingWithNulls = function (val, symb_count) {
        var v = val.toString();
        while (v.length < symb_count) {
            v = '0' + v;
        }
        return v;
    };


    Tempus = (function() {
        var year = undefined,
            month = undefined,
            day = undefined,
            hours = undefined,
            minutes = undefined,
            seconds = undefined,
            milliseconds = undefined;

        return {
            constants: function() {
                return {
                    MIN_YEAR: 100,
                    MAX_YEAR: 3000,
                    MIN_MONTH: monthFromZero ? 0 : 1,
                    MAX_MONTH: monthFromZero ? 11 : 12,
                    MIN_DAY: 1,
                    MAX_DAY_IN_MONTHS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                    MIN_DAY_OF_WEEK: 0,
                    MAX_DAY_OF_WEEK: 6,
                    MIN_HOURS: 0,
                    MAX_HOURS: 23,
                    MIN_MINUTES: 0,
                    MAX_MINUTES: 59,
                    MIN_SECONDS: 0,
                    MAX_SECONDS: 59,
                    MIN_MILLISECONDS: 0,
                    MAX_MILLISECONDS: 999
                }
            },
            options: function() {
                return {
                    useMilliseconds: useMilliseconds,
                    monthFromZero: monthFromZero,
                    lang: lang
                }
            },
            /**
             * Get or set year.
             * @param value {number} New year. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            year: function(value) {
                if (arguments.length !== 0) {
                    // no value range checking, because can be used for delta times
                    if (typeof value === 'number' || typeof value === 'string') {
                        year = Number(value);
                    } else {
                        year = undefined;
                    }
                } else {
                    return year;
                }
                return this;
            },
            /**
             * Get or set month.
             * @param value {number} New month. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            month: function(value) {
                if (arguments.length !== 0) {
                    if (typeof value === 'number' || typeof value === 'string') {
                        month = Number(value);
                    } else {
                        month = undefined;
                    }
                } else {
                    return month;
                }
                return this;
            },
            /**
             * Get or set day.
             * @param value {number} New day. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            day: function(value) {
                if (arguments.length !== 0) {
                    if (typeof value === 'number' || typeof value === 'string') {
                        day = Number(value);
                    } else {
                        day = undefined;
                    }
                } else {
                    return day;
                }
                return this;
            },
            /**
             * Get or set hours.
             * @param value {number} New hours. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            hours: function(value) {
                if (arguments.length !== 0) {
                    if (typeof value === 'number' || typeof value === 'string') {
                        hours = Number(value);
                    } else {
                        hours = undefined;
                    }
                } else {
                    return hours;
                }
                return this;
            },
            /**
             * Get or set minutes.
             * @param value {number} New minutes. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            minutes: function(value) {
                if (arguments.length !== 0) {
                    if (typeof value === 'number' || typeof value === 'string') {
                        minutes = Number(value);
                    } else {
                        minutes = undefined;
                    }
                } else {
                    return minutes;
                }
                return this;
            },
            /**
             * Get or set seconds.
             * @param value {number} New seconds. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            seconds: function(value) {
                if (arguments.length !== 0) {
                    if (typeof value === 'number' || typeof value === 'string') {
                        seconds = Number(value);
                    } else {
                        seconds = undefined;
                    }
                } else {
                    return seconds;
                }
                return this;
            },
            milliseconds: function(value) {
                if (arguments.length !== 0) {
                    if (typeof value === 'number' || typeof value === 'string') {
                        milliseconds = Number(value);
                    } else {
                        milliseconds = undefined;
                    }
                } else {
                    return milliseconds;
                }
                return this;
            },
            timestamp: function(value) {
                if (arguments.length !== 0) {
                    var d = new Date(Number(value)*(useMilliseconds ? 1 : 1000));
                    this.year(d.getFullYear());
                    this.month(d.getMonth() + (monthFromZero ? 0 : 1));
                    this.day(d.getDate());
                    this.hours(d.getHours());
                    this.minutes(d.getMinutes());
                    this.seconds(d.getSeconds());
                    this.milliseconds(d.getMilliseconds());
                } else {
                    return Math.floor(new Date(
                        this.year() !== undefined ? this.year() : 1970,
                        this.month() !== undefined ? this.month() - (monthFromZero ? 0 : 1) : 0,
                        this.day() !== undefined ? this.day() : 1,
                        this.hours() !== undefined ? this.hours() : 0,
                        this.minutes() !== undefined ? this.minutes() : 0,
                        this.seconds() !== undefined ? this.seconds() : 0,
                        this.milliseconds() !== undefined ? this.milliseconds() : 0
                    ).getTime()/(useMilliseconds ? 1 : 1000));
                }
                return this;
            },
            UTC: function(value) {
                if (arguments.length !== 0) {
                    var d = new Date(Number(value)*(useMilliseconds ? 1 : 1000));
                    this.year(d.getUTCFullYear());
                    this.month(d.getUTCMonth() + (monthFromZero ? 0 : 1));
                    this.day(d.getUTCDate());
                    this.hours(d.getUTCHours());
                    this.minutes(d.getUTCMinutes());
                    this.seconds(d.getUTCSeconds());
                    this.milliseconds(d.getUTCMilliseconds());
                } else {
                    return Math.floor(new Date(Date.UTC(
                        this.year() !== undefined ? this.year() : 1970,
                        this.month() !== undefined ? this.month() - (monthFromZero ? 0 : 1) : 0,
                        this.day() !== undefined ? this.day() : 1,
                        this.hours() !== undefined ? this.hours() : 0,
                        this.minutes() !== undefined ? this.minutes() : 0,
                        this.seconds() !== undefined ? this.seconds() : 0,
                        this.milliseconds() !== undefined ? this.milliseconds() : 0
                    )).getTime()/(useMilliseconds ? 1 : 1000));
                }
                return this;
            },
            /**
             * Get day of week.
             * @param type {string|none} If none, number returned. If 'short', short string returned, 'long' for long.
             * @returns {number|undefined} Numeric value of day of week.
             * @example
             * // returns current day of week
             * TP.now().dayOfWeek();
             */
            dayOfWeek: function(type) {
                var y, m, d;
                if ((y = this.year()) !== undefined &&
                        (m = this.month()) !== undefined &&
                        (d = this.day()) !== undefined) {
                    switch(type) {
                        case 'long':
                            return translations[lang]["daysLongNames"][getDayOfWeek(y, m, d)];
                        case 'short':
                            return translations[lang]["daysShortNames"][getDayOfWeek(y, m, d)];
                        default:
                            return getDayOfWeek(y, m, d);
                    }
                }
                return undefined;
            },
            /**
             * Is year leap?
             * @returns {boolean|undefined} If true year is leap else not leap.
             * @example
             * // returns false
             * TP.year(2013).leapYear();
             * @example
             * // returns true
             * TP.year(2012).leapYear();
             * @example
             * // returns true
             * TP.year(2000).leapYear();
             * @example
             * // returns false
             * TP.year(1900).leapYear();
             * @example
             * // returns false
             * TP.date({year: 1941, day: 22, month: 6}).leapYear();
             * @example
             * // returns true
             * TP.date({year: 2008, day: 1, month: 1}).leapYear();
             * @example
             * // check current year
             * TP.now().leapYear();
             */
            leapYear: function() {
                var y;
                if ((y = this.year()) !== undefined) {
                    return isLeapYear(y);
                } else {
                    return undefined;
                }
            },
            /**
             * Releases TP variable from global scope.
             * @param all {boolean} If true, Tempus variable also will be released.
             * @returns {Tempus} Tempus object.
             * @example
             * // returns Tempus object
             * var myTempusObj = Tempus.noConflict(true);
            */
            noConflict: function(all) {
                window.TP = _TP;
                if (all === true) {
                    window.Tempus = _Tempus
                }
                return Tempus;
            },
            /**
             * Get a current version of TempusJS.
             * @returns {string} Current version of TempusJS.
             * @example
             * // returns current version
             * TP.getVersion();
             */
            getVersion: function() {
                return version;
            },
            /**
             * Set a current date.
             * @returns {Tempus}
             * @example
             * // returns Tempus object with current date.
             * TP.now();
             * @example
             * // returns simple object with current date
             * TP.now().date();
             */
            now: function () {
                var d = new Date();
                this.year(d.getFullYear());
                this.month(d.getMonth() + (monthFromZero ? 0 : 1));
                this.day(d.getDate());
                this.hours(d.getHours());
                this.minutes(d.getMinutes());
                this.seconds(d.getSeconds());
                this.milliseconds(d.getMilliseconds());
                return this;
            },
            /**
             * Set new date.
             * @param newDate {object|undefined} New date as object {year: number, month: number, day: number,
             *     hours: number, minutes: number, seconds: number} or part of it.
             * @returns {Tempus|object} Tempus object or simply object with date info.
             * @example
             * // returns Tempus object with date {year: 2013, month: 11, day: 13}.
             * TP.date({year: 2013, month: 11, day: 13});
             * @example
             * // returns {year: 2013, month: 10, day: 1}
             * TP.date({year: 2013, month: 10, day: 1}).date();
             */
            date: function(newDate) {
                if (newDate === undefined) {
                    return {
                        year: this.year(),
                        month: this.month(),
                        day: this.day(),
                        hours: this.hours(),
                        minutes: this.minutes(),
                        seconds: this.seconds(),
                        dayOfWeek: this.dayOfWeek(),
                        dayOfWeekShort: this.dayOfWeek('short'),
                        dayOfWeekLong: this.dayOfWeek('long'),
                        timestamp: this.timestamp(),
                        UTC: this.UTC(),
                        milliseconds: this.milliseconds()
                    }
                }
                if (typeof newDate === 'object') {
                    if (newDate.year !== undefined && newDate.year >= this.constants().MIN_YEAR && newDate.year <= this.constants().MAX_YEAR) {
                        this.year(Number(newDate.year));
                    } else {
                        this.year(this.constants().MIN_YEAR);
                    }
                    if (newDate.month !== undefined && newDate.month >= this.constants().MIN_MONTH && newDate.month <= this.constants().MAX_MONTH) {
                        this.month(Number(newDate.month));
                    } else {
                        this.month(this.constants().MIN_MONTH);
                    }
                    if (newDate.day !== undefined && newDate.day >= this.constants().MIN_DAY && newDate.day <= this.dayCount()) {
                        this.day(Number(newDate.day));
                    } else {
                        this.day(this.constants().MIN_DAY);
                    }
                    if (newDate.hours !== undefined && newDate.hours >= this.constants().MIN_HOURS && newDate.hours <= this.constants().MAX_HOURS) {
                        this.hours(Number(newDate.hours));
                    } else {
                        this.hours(this.constants().MIN_HOURS);
                    }
                    if (newDate.minutes !== undefined && newDate.minutes >= this.constants().MIN_MINUTES && newDate.minutes <= this.constants().MAX_MINUTES) {
                        this.minutes(Number(newDate.minutes));
                    } else {
                        this.minutes(this.constants().MIN_MINUTES);
                    }
                    if (newDate.seconds !== undefined && newDate.seconds >= this.constants().MIN_SECONDS && newDate.seconds <= this.constants().MAX_SECONDS) {
                        this.seconds(Number(newDate.seconds));
                    } else {
                        this.seconds(this.constants().MIN_SECONDS);
                    }
                }
                return this;
            },
            dayCount: function() {
                var m = this.month();
                var dc = this.constants().MAX_DAY_IN_MONTHS[m - (monthFromZero ? 0 : 1)];
                if (this.leapYear() && m === 2) {
                    dc += 1;
                }
                return dc;
            },
            format: function (format) {
                var result = format;
                // formatting
                for (var key in registeredFormats) {
                    if (registeredFormats.hasOwnProperty(key)) {
                        result = result.replace(key, registeredFormats[key].format(this));
                    }
                }
                return result;
            },
            // returns "2012-01-01"
            // TP.parse('01.01.2010').year(2012).format('%Y-%m-%d');
            // If parse failed, defaults returns.
            // returns "2013-01-01"
            // TP.parse('20130101', '%Y%m%d', TP.now().calc({month: -1})).format('%Y-%m-%d')
            // returns "2013-06-01"
            // TP.parse(undefined, '%Y%m%d', TP.date({year: 2013, month: 06, day: 1})).format('%Y-%m-%d');
            //
            // Can be set "str" as Date object.
            // TP.parse(new Date()).date()
            parse: function(str, format, defaults) {
                if (str instanceof Date) {
                    this.year(str.getFullYear());
                    this.month(str.getMonth() + (monthFromZero ? 0 : 1));
                    this.day(str.getDate());
                    this.hours(str.getHours());
                    this.minutes(str.getMinutes());
                    this.seconds(str.getSeconds());
                    this.milliseconds(str.getMilliseconds());
                    return this;
                }
                var key;
                var litsarr = [];
                if (format === undefined) {
                    format = this.detectFormat(str);
                }
                format = '^'+format+'$';
                var format_re = format;
                for (key in registeredFormats) {
                    if (registeredFormats.hasOwnProperty(key)) {
                        litsarr.push(key);
                        format_re = format_re.replace(new RegExp('('+key+')', 'g'), '('+registeredFormats[key].parseLit+')');
                    }
                }
                var litsstr = new RegExp('('+litsarr.join('|')+')', 'g');
                var lits = format.match(litsstr);
                var re = new RegExp(format_re, 'g');
                var result = re.exec(str);
                var result2 = [];
                try {
                    for (var i=1; i < result.length; i++) {
                        if (typeof result[i] === 'string') {
                            result2.push(result[i]);
                        }
                    }
                } catch(e) {
                    if (defaults !== undefined) {
                        this.year(defaults.year() || defaults.year);
                        this.month(defaults.month() || defaults.month);
                        this.day(defaults.day() || defaults.day);
                        this.hours(defaults.hours() || defaults.hours);
                        this.minutes(defaults.minutes() || defaults.minutes);
                        this.seconds(defaults.seconds() || defaults.seconds);
                        this.milliseconds(defaults.milliseconds() || defaults.milliseconds);
                        return this;
                    } else {
                        return undefined;
                    }
                }
                var resultdate = {};
                var tmpdate;
                for(key in lits) {
                    if (lits.hasOwnProperty(key)&&(registeredFormats.hasOwnProperty(lits[key]))&&!isNaN(Number(key))) {
                        tmpdate = registeredFormats[lits[key]].parse(result2[key]);
                        resultdate = {
                            year: tmpdate.year != undefined ? tmpdate.year : resultdate.year,
                            month: tmpdate.month != undefined ? tmpdate.month : resultdate.month,
                            day: tmpdate.day != undefined ? tmpdate.day : resultdate.day,
                            hours: tmpdate.hours != undefined ? tmpdate.hours : resultdate.hours,
                            minutes: tmpdate.minutes != undefined ? tmpdate.minutes : resultdate.minutes,
                            seconds: tmpdate.seconds != undefined ? tmpdate.seconds : resultdate.seconds
                        };
                    }
                }
                this.year(resultdate.year);
                this.month(resultdate.month);
                this.day(resultdate.day);
                this.hours(resultdate.hours);
                this.minutes(resultdate.minutes);
                this.seconds(resultdate.seconds);
                return this;
            },
            detectFormat: function(str) {
                var defaultFormats = [
                    '^%d\\.%m\\.%Y$', '^%Y-%m-%d$', '^%m/%d/%Y$', '^%Y-%m-%dT%H:%M:%S$',
                    '^%d\\.%m\\.%Y %H:%M:%S$', '^%d\\.%m\\.%Y %H:%M$', '^%d\\.%m\\.%Y %H$',
                    '^%Y-%m-%d %H:%M:%S$', '^%Y-%m-%d %H:%M$', '^%Y-%m-%d %H$',
                    '^%m/%d/%Y %H:%M:%S$', '^%m/%d/%Y %H:%M$', '^%m/%d/%Y %H$',
                    '^%Y$', '^%H:%M:%S$', '^%H:%M$'
                ];
                for (var i=0; i < defaultFormats.length; i++) {
                    if (this.parse(str, defaultFormats[i]) !== undefined) {
                        return defaultFormats[i].slice(1,-1);
                    }
                }
                return undefined;
            },
            calc: function(delta) {
                var d = new Date(
                    this.year() + (delta.year || 0),
                    this.month() + (delta.month || 0) - (monthFromZero ? 0 : 1),
                    this.day() + (delta.day || 0),
                    this.hours() + (delta.hours || 0),
                    this.minutes() + (delta.minutes || 0),
                    this.seconds() + (delta.seconds || 0),
                    this.milliseconds() + (delta.milliseconds || 0)
                );
                return this.year(d.getFullYear()).
                    month(d.getMonth() + (monthFromZero ? 0 : 1)).
                    day(d.getDate()).
                    hours(d.getHours()).
                    minutes(d.getMinutes()).
                    seconds(d.getSeconds()).
                    milliseconds(d.getMilliseconds());
            },
            /**
             * Globally set or get language.
             * @param value {string} Language's code.
             * @returns {string|Tempus} Language's code or Tempus object.
             * @example
             * // returns "Ноябрь, 14"
             * TP.lang('ru').date({year: 2013, month: 11, day: 14}).format('%B, %d');
             * @example
             * TP.lang('ru');
             * // returns "Ноябрь"
             * TP.month(11).format('%B');
             */
            lang: function(value) {
                if (value !== undefined) {
                    lang = value;
                } else {
                    return lang;
                }
                return this;
            },
            /**
             * All work with timestamps and timeouts will be in milliseconds.
             * @param value {boolean} False to disabling it.
             * @returns {Tempus}
             * @example
             * // returns {"year":2013,"month":11,"day":14,"hours":12,"minutes":38,"seconds":54,"dayOfWeek":4,
             * //    "dayOfWeekShort":"Thu","dayOfWeekLong":"Thursday","timestamp":1384418334445,"UTC":1384432734445,
             * //    "milliseconds":445}
             * TP.iWantUseMilliseconds().now().date();
             */
            iWantUseMilliseconds: function(value) {
                useMilliseconds = value !== false;
                return this;
            },
            /**
             * Month started from zero. By default is False.
             * @param value {boolean} False to disabling it.
             * @returns {Tempus}
             * @example
             * TP.iLoveMonthFromZero();
             * // returns "14 December 2013"
             * TP.date({year: 2013, month: 11, day: 14}).format('%d %B %Y');
             * TP.iLoveMonthFromZero(false);
             * // returns "14 November 2013"
             * TP.date({year: 2013, month: 11, day: 14}).format('%d %B %Y');
             */
            iLoveMonthFromZero: function(value) {
                monthFromZero = value !== false;
                return this;
            },
            /**
             * Returns Date object.
             * @returns {Date} Date object with data from this Tempus object.
             * @example
             * // returns Date obj
             * TP.now().calc({month: -1}).asVanillaDate();
             */
            asVanillaDate: function() {
                return new Date(
                    this.year() !== undefined ? this.year() : 1970,
                    this.month() !== undefined ? this.month() - (monthFromZero ? 0 : 1) : 0,
                    this.day() !== undefined ? this.day() : 1,
                    this.hours() !== undefined ? this.hours() : 0,
                    this.minutes() !== undefined ? this.minutes() : 0,
                    this.seconds() !== undefined ? this.seconds() : 0,
                    this.milliseconds() !== undefined ? this.milliseconds() : 0
                );
            },
            /**
             * Returns UTC Date object.
             * @returns {Date} Date object with data from this Tempus object.
             * @example
             * // returns Date obj
             * TP.now().calc({month: -1}).asVanillaDateUTC();
             */
            asVanillaDateUTC: function() {
                return new Date(Date.UTC(
                    this.year() !== undefined ? this.year() : 1970,
                    this.month() !== undefined ? this.month() - (monthFromZero ? 0 : 1) : 0,
                    this.day() !== undefined ? this.day() : 1,
                    this.hours() !== undefined ? this.hours() : 0,
                    this.minutes() !== undefined ? this.minutes() : 0,
                    this.seconds() !== undefined ? this.seconds() : 0,
                    this.milliseconds() !== undefined ? this.milliseconds() : 0
                ));
            }


        };
    })();
    window.Tempus = window.TP = Tempus;
})();
