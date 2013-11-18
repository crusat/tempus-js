/**
 * @author Aleksey Kuznetsov aka crusat
 */
(function (window, undefined) {
//    var _Tempus = window.tempus,
//        tempus,
//        version = '0.2.0',
//        lang = (navigator.language || navigator.systemLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase(),
//        translations = {
//            "en": {
//                "monthShortNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//                "monthLongNames": ["January", "February", "March", "April", "May", "June", "July", "August",
//                    "September", "October", "November", "December"],
//                "daysShortNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//                "daysLongNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//            },
//            "ru": {
//                "monthShortNames": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
//                "monthLongNames": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
//                    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
//                "daysShortNames": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
//                "daysLongNames": ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
//            }
//        },
//        registeredFormats = {
//            '%d': {
//                format: function (date) {
//                    return formattingWithNulls(date.day() || date.constants().MIN_DAY, 2);
//                },
//                parse: function (value) {
//                    var v = Number(value);
//                    return {day: (isNaN(v) ? undefined : v) };
//                },
//                minLength: 2,
//                maxLength: 2,
//                type: "number"
//            },
//            '%m': {
//                format: function (date) {
//                    return formattingWithNulls(date.month() || date.constants().MIN_MONTH, 2);
//                },
//                parse: function (value) {
//                    var v = Number(value);
//                    return {month: (isNaN(v) ? undefined : v) };
//                },
//                minLength: 2,
//                maxLength: 2,
//                type: "number"
//            },
//            '%Y': {
//                format: function (date) {
//                    return formattingWithNulls(date.year() || date.constants().MIN_YEAR, 4);
//                },
//                parse: function (value) {
//                    var v = Number(value);
//                    return {year: (isNaN(v) ? undefined : v) };
//                },
//                minLength: 4,
//                maxLength: 4,
//                type: "number"
//            },
//            '%w': {
//                format: function (date) {
//                    return date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK;
//                },
//                parse: function (value) {
//                    // impossible
//                    return {};
//                },
//                minLength: 1,
//                maxLength: 1,
//                type: "number"
//            },
//            '%a': {
//                format: function (date) {
//                    return translations[lang]["daysShortNames"][date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK];
//                },
//                parse: function (value) {
//                    // impossible
//                    return {};
//                },
//                minLength: 1,
//                maxLength: 999,
//                type: "word"
//            },
//            '%A': {
//                format: function (date) {
//                    return translations[lang]["daysLongNames"][date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK];
//                },
//                parse: function (value) {
//                    // impossible
//                    return {};
//                },
//                minLength: 1,
//                maxLength: 999,
//                type: "word"
//            },
//            '%b': {
//                format: function (date) {
//                    return translations[lang]["monthShortNames"][(date.month() || date.constants().MIN_MONTH) - (monthFromZero ? 0 : 1)];
//                },
//                parse: function (value) {
//                    var month = that.getMonthNames().indexOf(value) + 1;
//                    return {month: month !== -1 ? month : undefined}
//                },
//                minLength: 1,
//                maxLength: 999,
//                type: "word"
//            },
//            '%B': {
//                format: function (date) {
//                    return translations[lang]["monthLongNames"][(date.month() || date.constants().MIN_MONTH) - (monthFromZero ? 0 : 1)];
//                },
//                parse: function (value) {
//                    var month = that.getMonthNames(true).indexOf(value) + 1;
//                    return {month: month !== -1 ? month : undefined}
//                },
//                minLength: 1,
//                maxLength: 999,
//                type: "word"
//            },
//            '%H': {
//                format: function (date) {
//                    return formattingWithNulls(date.hours() || date.constants().MIN_HOURS, 2);
//                },
//                parse: function (value) {
//                    var v = Number(value);
//                    return {hours: (isNaN(v) ? undefined : v) };
//                },
//                minLength: 2,
//                maxLength: 2,
//                type: "number"
//            },
//            '%M': {
//                format: function (date) {
//                    return formattingWithNulls(date.minutes() || date.constants().MIN_MINUTES, 2);
//                },
//                parse: function (value) {
//                    var v = Number(value);
//                    return {minutes: (isNaN(v) ? undefined : v) };
//                },
//                minLength: 2,
//                maxLength: 2,
//                type: "number"
//            },
//            '%S': {
//                format: function (date) {
//                    return formattingWithNulls(date.seconds() || date.constants().MIN_SECONDS, 2);
//                },
//                parse: function (value) {
//                    var v = Number(value);
//                    return {seconds: (isNaN(v) ? undefined : v) };
//                },
//                minLength: 2,
//                maxLength: 2,
//                type: "number"
//            },
//            '%s': {
//                format: function (date) {
//                    return date.timestamp();
//                },
//                parse: function (value) {
//                    var v = Number(value);
//                    var date = new TempusDate(Number(v), timezoneOffset);
//                    var obj = that.date(v);
//                    return isNaN(v) ? {} : that.incDate(obj, date.getTimezoneOffset(), 'minutes');
//                },
//                minLength: 1,
//                maxLength: 20,
//                type: "number"
//            },
//            '%F': {
//                format: function (date) {
//                    return formattingWithNulls(date.year() || date.constants().MIN_YEAR, 4) + '-' +
//                        formattingWithNulls(date.month() || date.constants().MIN_MONTH, 2) + '-' +
//                        formattingWithNulls(date.day() || date.constants().MIN_DAY, 2);
//                },
//                parse: function (value) {
//                    var year = Number(value.slice(0, 4));
//                    var month = Number(value.slice(6, 7));
//                    var day = Number(value.slice(9, 10));
//                    return {
//                        year: year,
//                        month: month,
//                        day: day
//                    }
//                },
//                minLength: 10,
//                maxLength: 10,
//                type: "string"
//            },
//            '%D': {
//                format: function (date) {
//                    return formattingWithNulls(date.month() || date.constants().MIN_MONTH, 2) +
//                        '/' + formattingWithNulls(date.day() || date.constants().MIN_DAY, 2) +
//                        '/' + formattingWithNulls(date.year() || date.constants().MIN_YEAR, 4)
//                },
//                parse: function (value) {
//                    var month = Number(value.slice(0, 2));
//                    var day = Number(value.slice(3, 5));
//                    var year = Number(value.slice(6, 10));
//                    return {
//                        year: year,
//                        month: month,
//                        day: day
//                    }
//                },
//                minLength: 10,
//                maxLength: 10,
//                type: "string"
//            }
//        },
//        useMilliseconds = false,
//        monthFromZero = false;


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

    var parseBadFormat = function(date, defaults) {
        if (defaults !== undefined) {
            date.year(defaults.year() || defaults.year);
            date.month(defaults.month() || defaults.month);
            date.day(defaults.day() || defaults.day);
            date.hours(defaults.hours() || defaults.hours);
            date.minutes(defaults.minutes() || defaults.minutes);
            date.seconds(defaults.seconds() || defaults.seconds);
            date.milliseconds(defaults.milliseconds() || defaults.milliseconds);
            return date;
        } else {
            return undefined;
        }
    };

    var detectTimeFormat = function(str, startFrom) {
        var tmpChars, format = '';
        tmpChars = str.slice(startFrom, startFrom+1);
        if (tmpChars !=='' && !isNaN(Number(tmpChars))) {
            format += '%H';
        }
        tmpChars = str.charAt(startFrom+2);
        if (tmpChars !=='' && tmpChars === ':') {
            format += tmpChars;
        }
        tmpChars = str.slice(startFrom+3, startFrom+4);
        if (tmpChars !=='' && !isNaN(Number(tmpChars))) {
            format += '%M';
        }
        tmpChars = str.charAt(startFrom+5);
        if (tmpChars !=='' && tmpChars === ':') {
            format += tmpChars;
        }
        tmpChars = str.slice(startFrom+6, startFrom+7);
        if (tmpChars !=='' && !isNaN(Number(tmpChars))) {
            format += '%S';
        }
        return format;
    };

    var detectDateFormat = function(str, startFrom) {
        var tmpChars, format;
        var part1 = [
            str.slice(startFrom, startFrom+1),
            str.charAt(startFrom+2),
            str.slice(startFrom+3, startFrom+4),
            str.charAt(startFrom+5),
            str.slice(startFrom+6, startFrom+9)
        ];

        if (!isNaN(Number(part1[0])) && !isNaN(Number(part1[2])) && !isNaN(Number(part1[4]))) {
            if (part1[1] === '.' && part1[3] === '.') {
                format = '%d.%m.%Y';
            } else if (part1[1] === '-' && part1[3] === '-') {
                format = '%m-%d-%Y';
            } else if (part1[1] === '/' && part1[3] === '/') {
                format = '%m/%d/%Y';
            }

            return format;
        }

        var part2 = [
            str.slice(startFrom, startFrom+3),
            str.charAt(startFrom+4),
            str.slice(startFrom+5, startFrom+6),
            str.charAt(startFrom+7),
            str.slice(startFrom+8, startFrom+9)
        ];

        if (!isNaN(Number(part2[0])) && !isNaN(Number(part2[2])) && !isNaN(Number(part2[4]))) {
            if (part2[1] === '-' && part2[3] === '-') {
                format = '%Y-%m-%d';
            }
            return format;
        }
        return '';
    };


//    var TempusDate = function (options, format, defaults) {
//        // always valid date
//        this._date = new Date();
//        // if some errors, write here values.
//        this._incorrect = {
//            year: false,
//            month: false,
//            day: false,
//            hours: false,
//            minutes: false,
//            seconds: false,
//            milliseconds: false
//        };
//
//        if (options !== undefined) {
//            this.set(options, format, defaults);
//        }
//        return this;
//    };

//    TempusDate.fn = TempusDate.prototype;

    /**
       Returns constant object. Some constants depends from year
       (MAX_DAY_IN_MONTHS) or options (MIN_MONTH, MAX_MONTH).
       @method constants
       @return {object} Constants of Tempus.
       @example
           // returns {
           //   "MIN_YEAR":1000,
           //   "MAX_YEAR":3000,
           //   "MIN_MONTH":1,
           //   "MAX_MONTH":12,
           //   "MIN_DAY":1,
           //   "MAX_DAY_IN_MONTHS":[31,28,31,30,31,30,31,31,30,31,30,31],
           //   "MIN_DAY_OF_WEEK":0,
           //   "MAX_DAY_OF_WEEK":6,
           //   "MIN_HOURS":0,
           //   "MAX_HOURS":23,
           //   "MIN_MINUTES":0,
           //   "MAX_MINUTES":59,
           //   "MIN_SECONDS":0,
           //   "MAX_SECONDS":59,
           //   "MIN_MILLISECONDS":0,
           //   "MAX_MILLISECONDS":999
           // }
           tempus().constants();
     */
//    TempusDate.fn.constants = function () {
//        return {
//            MIN_YEAR: 1000,
//            MAX_YEAR: 3000,
//            MIN_MONTH: monthFromZero ? 0 : 1,
//            MAX_MONTH: monthFromZero ? 11 : 12,
//            MIN_DAY: 1,
//            MAX_DAY_IN_MONTHS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
//            MIN_DAY_OF_WEEK: 0,
//            MAX_DAY_OF_WEEK: 6,
//            MIN_HOURS: 0,
//            MAX_HOURS: 23,
//            MIN_MINUTES: 0,
//            MAX_MINUTES: 59,
//            MIN_SECONDS: 0,
//            MAX_SECONDS: 59,
//            MIN_MILLISECONDS: 0,
//            MAX_MILLISECONDS: 999
//        }
//    };


    /**
     * Get or set day.
     * @param value {number} New day. If undefined, returns numeric value.
     * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
     */
    TempusDate.fn.day = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value)) && Number(value) >= this.constants().MIN_DAY && Number(value) <= this.dayCount()) {
                this._date.setDate(Number(value));
                this._incorrect.day = false;
            } else if (value === undefined) {
                this._date.setDate(this.constants().MIN_DAY);
                this._incorrect.day = false;
            } else {
                this._incorrect.day = Number(value);
            }
        } else {
            return this._date.getDate();
        }
        return this;
    };
    /**
     * Get or set hours.
     * @param value {number} New hours. If undefined, returns numeric value.
     * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
     */
    TempusDate.fn.hours = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value)) && Number(value) >= this.constants().MIN_HOURS && Number(value) <= this.constants().MAX_HOURS) {
                this._date.setHours(Number(value));
                this._incorrect.hours = false;
            } else if (value === undefined) {
                this._date.setHours(this.constants().MIN_HOURS);
                this._incorrect.hours = false;
            } else {
                this._incorrect.hours = Number(value);
            }
        } else {
            return this._date.getHours();
        }
        return this;
    };
    /**
     * Get or set minutes.
     * @param value {number} New minutes. If undefined, returns numeric value.
     * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
     */
    TempusDate.fn.minutes = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value)) && Number(value) >= this.constants().MIN_MINUTES && Number(value) <= this.constants().MAX_MINUTES) {
                this._date.setMinutes(Number(value));
                this._incorrect.minutes = false;
            } else if (value === undefined) {
                this._date.setMinutes(this.constants().MIN_MINUTES);
                this._incorrect.minutes = false;
            } else {
                this._incorrect.minutes = Number(value);
            }
        } else {
            return this._date.getMinutes();
        }
        return this;
    };
    /**
     * Get or set seconds.
     * @param value {number} New seconds. If undefined, returns numeric value.
     * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
     */
    TempusDate.fn.seconds = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value)) && Number(value) >= this.constants().MIN_SECONDS && Number(value) <= this.constants().MAX_SECONDS) {
                this._date.setSeconds(Number(value));
                this._incorrect.seconds = false;
            } else if (value === undefined) {
                this._date.setSeconds(this.constants().MIN_SECONDS);
                this._incorrect.seconds = false;
            } else {
                this._incorrect.seconds = Number(value);
            }
        } else {
            return this._date.getSeconds();
        }
        return this;
    };
    TempusDate.fn.milliseconds = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value)) && Number(value) >= this.constants().MIN_MILLISECONDS && Number(value) <= this.constants().MAX_MILLISECONDS) {
                this._date.setMilliseconds(Number(value));
                this._incorrect.milliseconds = false;
            } else if (value === undefined) {
                this._date.setMilliseconds(this.constants().MIN_MILLISECONDS);
                this._incorrect.milliseconds = false;
            } else {
                this._incorrect.milliseconds = Number(value);
            }
        } else {
            return this._date.getMilliseconds();
        }
        return this;
    };
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
    TempusDate.fn.now = function () {
        this._date = new Date();
        return this;
    };
    TempusDate.fn.timestamp = function (value) {
        if (arguments.length !== 0) {
            this.date(new Date(Number(value) * (useMilliseconds ? 1 : 1000)));
            return this;
        } else {
            if (useMilliseconds) {
                return this._date.getTime();
            } else {
                return Math.floor(this._date.getTime() / 1000)
            }
        }
    };
    TempusDate.fn.UTC = function (value) {
        if (arguments.length !== 0) {
            this.date(new Date(Number(value) * (useMilliseconds ? 1 : 1000)));
            return this;
        } else {
            if (useMilliseconds) {
                return this._date.getTime() - this._date.getTimezoneOffset()*60000;
            } else {
                return Math.floor(this._date.getTime() / 1000) - this._date.getTimezoneOffset()*60;
            }
        }
    };
    /**
     * Get day of week.
     * @param type {string|none} If none, number returned. If 'short', short string returned, 'long' for long.
     * @returns {number|undefined} Numeric value of day of week.
     * @example
     * // returns current day of week
     * TP.now().dayOfWeek();
     */
    TempusDate.fn.dayOfWeek = function (type) {
        switch (type) {
            case 'long':
                return translations[lang]["daysLongNames"][this._date.getDay()];
            case 'short':
                return translations[lang]["daysShortNames"][this._date.getDay()];
            default:
                return this._date.getDay();
        }
    };

    TempusDate.fn.timezone = function (type) {
        switch (type) {
            case 'hours':
                return Math.floor(this._date.getTimezoneOffset() / 60);
            case 'minutes':
                return this._date.getTimezoneOffset();
            default:
                return this._date.getTimezoneOffset()*60;
        }
    };

    TempusDate.fn.week = function () {
        var onejan = new Date(this.year(), 0, 1);
        var nowDate = this.get('Date');
        return Math.ceil((((nowDate - onejan) / 86400000) + onejan.getDay()+1)/7);
    };

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
     * TP.set({year: 1941, day: 22, month: 6}).leapYear();
     * @example
     * // returns true
     * TP.set({year: 2008, day: 1, month: 1}).leapYear();
     * @example
     * // check current year
     * TP.now().leapYear();
     */
    TempusDate.fn.leapYear = function () {
        var y;
        if ((y = this.year()) !== undefined) {
            return isLeapYear(y);
        } else {
            return undefined;
        }
    };
    /**
     * Releases TP variable from global scope.
     * @param all {boolean} If true, Tempus variable also will be released.
     * @returns {Tempus} Tempus object.
     * @example
     * // returns Tempus constructor
     * var T = tempus().noConflict(true);
     * var t = T().format('%d.%m.%Y');
     */
    TempusDate.fn.noConflict = function (all) {
        window.TP = _TP;
        if (all === true) {
            window.Tempus = _Tempus
        }
        return Tempus;
    };
    /**
     * Get a current version of TempusJS.
     * @returns {string} Current version of TempusJS.
     * @example
     * // returns current version
     * TP.getVersion();
     */
    TempusDate.fn.getVersion = function () {
        return version;
    };
    TempusDate.fn.monthNames = function (type) {
        switch (type) {
            case 'long':
                return translations[lang]["monthLongNames"];
            default:
                return translations[lang]["monthShortNames"];
        }
    };
    TempusDate.fn.dayNames = function (type) {
        switch (type) {
            case 'long':
                return translations[lang]["dayLongNames"];
            default:
                return translations[lang]["dayShortNames"];
        }
    };
    TempusDate.fn.between = function (dateTo, type) {
        var from = this.timestamp();
        var to = dateTo.timestamp();
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
    TempusDate.fn.get = function (type) {
        switch (type) {
            case 'Date':
                return this._date;
            default:
                return {
                    year: this.year(),
                    month: this.month(),
                    week: this.week(),
                    day: this.day(),
                    hours: this.hours(),
                    minutes: this.minutes(),
                    seconds: this.seconds(),
                    milliseconds: this.milliseconds(),
                    UTC: this.UTC(),
                    dayOfWeek: this.dayOfWeek(),
                    dayOfWeekShort: this.dayOfWeek('short'),
                    dayOfWeekLong: this.dayOfWeek('long'),
                    timestamp: this.timestamp()
                }
        }
    };
    /**
     * Set new date.
     * @method set
     * @chainable
     * @param newDate {object|undefined} New date as object {year: number, month: number, day: number,
     *     hours: number, minutes: number, seconds: number} or part of it.
     * @returns {Tempus} Tempus object.
     * @example
     * // returns Tempus object with date {year: 2013, month: 11, day: 13}.
     * TP.set({year: 2013, month: 11, day: 13});
     * @example
     * // returns {year: 2013, month: 10, day: 1}
     * TP.set({year: 2013, month: 10, day: 1}).get();
     *
     * // Can be set "str" as Date object.
     * // tp().set(new Date()).get()
     * // or
     * // tp(new Date()).get();
     */
    // returns "2012-01-01"
    // TP.parse('01.01.2010').year(2012).format('%Y-%m-%d');
    // If parse failed, defaults returns.
    // returns "2013-01-01"
    // TP.parse('20130101', '%Y%m%d', TP.now().calc({month: -1})).format('%Y-%m-%d')
    // returns "2013-06-01"
    // TP.parse(undefined, '%Y%m%d', TP.date({year: 2013, month: 06, day: 1})).format('%Y-%m-%d');
    // Directives ALWAYS must be started from % and content only 1 char. For example %q, %d, %y, %0.
    // Two percent chars (%%) not allowed to directives. This replaced to single percent (%) on parsing.
    TempusDate.fn.set = function (newDate, format, defaults) {
        if (newDate instanceof Date) {
            this._date = newDate;
            return this;
        }
        if (typeof newDate === 'number') {
            this._date = new Date(newDate * (useMilliseconds ? 1 : 1000));
            return this;
        }
        if (typeof newDate === 'object') {
            if (newDate instanceof Array) {
                this.year(newDate[0]);
                this.month(newDate[1]);
                this.day(newDate[2]);
                this.hours(newDate[3]);
                this.minutes(newDate[4]);
                this.seconds(newDate[5]);
                this.milliseconds(newDate[6]);
            } else {
                this.year(newDate.year);
                this.month(newDate.month);
                this.day(newDate.day);
                this.hours(newDate.hours);
                this.minutes(newDate.minutes);
                this.seconds(newDate.seconds);
                this.milliseconds(newDate.milliseconds);
            }
        }
        // parse date
        if (typeof newDate === 'string') {
            var key;
            var lits = [];
            if (newDate === undefined) {
                return parseBadFormat(this, defaults);
            }
            if (format === undefined) {
                format = this.detectFormat(newDate);
            }

            var directive;
            var res = [];

            var i = 0,
                j = 0,
                k;
            while (i < format.length) {
                if (format.charAt(i) === '%') {
                    if (format.charAt(i+1) === '%') {
                        i++;
                    } else {
                        directive = format.charAt(i) + format.charAt(i + 1);
                        k = 0;
                        var shortString = '';
                        switch(registeredFormats[directive].type) {
                            case 'number':
                                while ((k < registeredFormats[directive].maxLength) && (j + k < newDate.length) && !isNaN(Number(newDate.charAt(j + k)))) {
                                    shortString += newDate.charAt(j + k);
                                    k++;
                                }
                                break;
                            case 'word':
                                while ((k < registeredFormats[directive].maxLength) && (j + k < newDate.length) && /^\w+$/.test(newDate.charAt(j + k))) {
                                    shortString += newDate.charAt(j + k);
                                    k++;
                                }
                                break;
                            case 'string':
                                while ((k < registeredFormats[directive].maxLength) && (j + k < newDate.length)) {
                                    shortString += newDate.charAt(j + k);
                                    k++;
                                }
                                break;
                        }

                        if (k < registeredFormats[directive].minLength) {
                            return parseBadFormat(this, defaults);
                        }
                        lits.push(directive);
                        res.push(shortString);
                        j += --k;
                        i++;
                    }
                } else {
                    if (newDate.charAt(j) !== format.charAt(i)) {
                        return parseBadFormat(this, defaults);
                    }
                }
                i++;
                j++;
            }

            var resultdate = {};
            var tmpdate;
            for(key in lits) {
                if (lits.hasOwnProperty(key)&&(registeredFormats.hasOwnProperty(lits[key]))) {
                    tmpdate = registeredFormats[lits[key]].parse(res[key]);
                    resultdate = {
                        year: tmpdate.year !== undefined ? tmpdate.year : resultdate.year,
                        month: tmpdate.month !== undefined ? tmpdate.month : resultdate.month,
                        day: tmpdate.day !== undefined ? tmpdate.day : resultdate.day,
                        hours: tmpdate.hours !== undefined ? tmpdate.hours : resultdate.hours,
                        minutes: tmpdate.minutes !== undefined ? tmpdate.minutes : resultdate.minutes,
                        seconds: tmpdate.seconds !== undefined ? tmpdate.seconds : resultdate.seconds
                    };
                }
            }
            this.year(resultdate.year);
            this.month(resultdate.month);
            this.day(resultdate.day);
            this.hours(resultdate.hours);
            this.minutes(resultdate.minutes);
            this.seconds(resultdate.seconds);
            this.milliseconds(resultdate.milliseconds);
        }
        return this;
    };
//    TempusDate.fn.dayCount = function () {
//        var m = this.month();
//        var dc = this.constants().MAX_DAY_IN_MONTHS[m - (monthFromZero ? 0 : 1)];
//        if (this.leapYear() && m === 2) {
//            dc += 1;
//        }
//        return dc;
//    };
    TempusDate.fn.format = function (format) {
        var i = 0,
            result = '',
            directive;
        while (i < format.length) {
            if (format.charAt(i) === '%') {
                if (format.charAt(i+1) === '%') {
                    i++;
                    result += '%';
                } else {
                    directive = format.charAt(i) + format.charAt(i + 1);
                    result += registeredFormats[directive].format(this);
                    i++;
                }
            } else {
                result += format.charAt(i);
            }
            i++;
        }
        return result;
    };




    TempusDate.fn.detectFormat = function (str) {
        var format, tmpChars, len;
        format = detectDateFormat(str, 0);
        if (format !== '') {
            len = 10;
        }
        tmpChars = str.charAt(len);
        if (tmpChars === 'T' || tmpChars === ' ') {
            format += tmpChars;
            len++;
        }
        format += detectTimeFormat(str, len);
        return format;
    };

    TempusDate.fn.calc = function (delta) {
        if (delta.year !== undefined) {
            this._date.setFullYear(this._date.getFullYear() + delta.year);
        }
        if (delta.month !== undefined) {
            this._date.setMonth(this._date.getMonth() + delta.month);
        }
        if (delta.day !== undefined) {
            this._date.setDate(this._date.getDate() + delta.day);
        }
        if (delta.hours !== undefined) {
            this._date.setHours(this._date.getHours() + delta.hours);
        }
        if (delta.minutes !== undefined) {
            this._date.setMinutes(this._date.getMinutes() + delta.minutes);
        }
        if (delta.seconds !== undefined) {
            this._date.setSeconds(this._date.getSeconds() + delta.seconds);
        }
        if (delta.milliseconds !== undefined) {
            this._date.setMilliseconds(this._date.getMilliseconds() + delta.milliseconds);
        }
        return this;
    };

    TempusDate.fn.options = function () {
        return {
            useMilliseconds: useMilliseconds,
            monthFromZero: monthFromZero,
            lang: lang
        }
    };

    /**
     * Returns Date object.
     * @returns {Date} Date object with data from this Tempus object.
     * @example
     * // returns Date obj
     * TP.now().calc({month: -1}).asVanillaDate();
     */
//    TempusDate.fn.asVanillaDate = function () {
//        return new Date(
//            this.year() !== undefined ? this.year() : 1970,
//            this.month() !== undefined ? this.month() - (monthFromZero ? 0 : 1) : 0,
//            this.day() !== undefined ? this.day() : 1,
//            this.hours() !== undefined ? this.hours() : 0,
//            this.minutes() !== undefined ? this.minutes() : 0,
//            this.seconds() !== undefined ? this.seconds() : 0,
//            this.milliseconds() !== undefined ? this.milliseconds() : 0
//        );
//    };

    /**
     * Returns UTC Date object.
     * @returns {Date} Date object with data from this Tempus object.
     * @example
     * // returns Date obj
     * TP.now().calc({month: -1}).asVanillaDateUTC();
     */
    TempusDate.fn.asVanillaDateUTC = function () {
        return new Date(Date.UTC(
            this.year() !== undefined ? this.year() : 1970,
            this.month() !== undefined ? this.month() - (monthFromZero ? 0 : 1) : 0,
            this.day() !== undefined ? this.day() : 1,
            this.hours() !== undefined ? this.hours() : 0,
            this.minutes() !== undefined ? this.minutes() : 0,
            this.seconds() !== undefined ? this.seconds() : 0,
            this.milliseconds() !== undefined ? this.milliseconds() : 0
        ));
    };
    /**
     * Globally set or get language.
     * @param value {string} Language's code.
     * @returns {string|Tempus} Language's code or Tempus object.
     * @example
     * // returns "Ноябрь, 14"
     * TP.lang('ru').set({year: 2013, month: 11, day: 14}).format('%B, %d');
     * @example
     * TP.lang('ru');
     * // returns "Ноябрь"
     * TP.month(11).format('%B');
     */
    TempusDate.fn.lang = function (value) {
        if (value !== undefined) {
            lang = value;
        } else {
            return lang;
        }
        return this;
    };
    /**
     * All work with timestamps and timeouts will be in milliseconds.
     * @param value {boolean} False to disabling it.
     * @returns {Tempus}
     * @example
     * // returns {"year":2013,"month":11,"day":14,"hours":12,"minutes":38,"seconds":54,"dayOfWeek":4,
     * //    "dayOfWeekShort":"Thu","dayOfWeekLong":"Thursday","timestamp":1384418334445,"UTC":1384432734445,
     * //    "milliseconds":445}
     * TP.iWantUseMilliseconds().now().get();
     */
    TempusDate.fn.iWantUseMilliseconds = function (value) {
        useMilliseconds = value !== false;
        return this;
    };
    /**
     * Month started from zero. By default is False.
     * @param value {boolean} False to disabling it.
     * @returns {Tempus}
     * @example
     * TP.iLoveMonthFromZero();
     * // returns "14 December 2013"
     * TP.set({year: 2013, month: 11, day: 14}).format('%d %B %Y');
     * TP.iLoveMonthFromZero(false);
     * // returns "14 November 2013"
     * TP.set({year: 2013, month: 11, day: 14}).format('%d %B %Y');
     */
    TempusDate.fn.iLoveMonthFromZero = function (value) {
        monthFromZero = value !== false;
        return this;
    };

    TempusDate.fn.registerFormat = function(value, formatFunc, parseFunc, minLength, maxLength, type) {
        registeredFormats[value] = {
            format: formatFunc,
            parse: parseFunc,
            minLength: minLength,
            maxLength: maxLength,
            type: type
        }
    };

    TempusDate.fn.unregisterFormat = function(value) {
        delete registeredFormats[value];
    };

    TempusDate.fn.validate = function() {
        return (this._incorrect.year === false && this._incorrect.month === false && this._incorrect.day === false &&
            this._incorrect.hours === false && this._incorrect.minutes === false && this._incorrect.seconds === false &&
            this._incorrect.milliseconds === false);
    };

    TempusDate.fn.getErrors = function() {
        return this._incorrect;
    };

    TempusDate.fn.getAvailableLangs = function() {
        return Object.keys(translations);
    };


    // *************************************************
    // *                                               *
    // *               COMPATIBILITY                   *
    // *                                               *
    // *************************************************

    // fix Array.indexOf for old browsers
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        }
    }


    // *************************************************
    // *                                               *
    // *       CONSTRUCTOR & NOT A DATE METHODS        *
    // *                                               *
    // *************************************************

    /**
     * Constructor for TempusDate. You can set initial value, for more info, see {{#crossLink "TempusDate/set"}}{{/crossLink}}.
     * @method tempus
     * @param options {undefined|object|Array|string|number} See {{#crossLink "TempusDate/set"}}{{/crossLink}}
     * @param format {undefined|string} See {{#crossLink "TempusDate/set"}}{{/crossLink}}
     * @param defaults {undefined|TempusDate|object} See {{#crossLink "TempusDate/set"}}{{/crossLink}}
     * @returns {TempusDate} Instance of TempusDate.
     * @example
     * // returns TempusDate with current date.
     * tempus();
     * @example
     * // returns TempusDate with date 2013-01-15.
     * tempus({year: 2013, month: 1, day: 15});
     * @example
     * // returns TempusDate with date 2000-06-01 and time 12:01:15
     * tempus([2000, 6, 1, 12, 1, 15]);
     * @example
     * // returns TempusDate with date 2001-05-10 and time 05:30:00
     * tempus('2001-05-10 05:30:00');
     * @example
     * // returns TempusDate with date 2001-05-10 and time 05:30:00
     * tempus(989454600);
     */
    tempus = function (options, format, defaults) {
        return new TempusDate(options, format, defaults);
    };

    /**
     * Generates dates from [dateFrom] to [dateTo] with period [period] and result format dates is [format] or any other.
     * @method tempus.generate
     * @param options {object|undefined} Options object.
     * @param options.dateFrom {TempusDate|undefined|object|Array|string|number} TempusDate object or
     *     any other value ({@see tempus}).
     * @param options.formatFrom {string|undefined} Format. If undefined, tempus will be auto detect format.
     * @param options.dateTo {TempusDate|undefined|object|Array|string|number} TempusDate object or
     *     any other value ({@see tempus}).
     * @param options.formatTo {string|undefined} Format. If undefined, will use formatFrom.
     * @param options.period {number|string|object} Step size for dates, can be 'seconds', 'minutes', 'hours',
     *     'day', 'month', 'year', number value (seconds) or object alike {year: number, month: number, day: number,
     *     hours: number, minutes: number, seconds: number}.
     * @param options.format {string|undefined} Results format. If undefined, returns TempusDate.
     * @param options.asObject {boolean|undefined} If true, dates will be keys for objects in result array.
     * @param options.groupBy {string|undefined} If not undefined, group array by some field in TempusDate. Can be
     *     'seconds', 'minutes', 'hours', 'day', 'week', 'month', 'year'.
     * @returns {Array|object} Array or object from dates.
     * @example
     * // returns ["01.01.2013", "02.01.2013", "03.01.2013", "04.01.2013", "05.01.2013",
     * //    "06.01.2013", "07.01.2013", "08.01.2013", "09.01.2013", "10.01.2013"];
     * tempus.generate({
     *     dateFrom: '01.01.2013',
     *     dateTo: '10.01.2013',
     *     period: 'day',
     *     format: '%d.%m.%Y'
     * });
     * @example
     * // returns ["29.03.2013", "30.03.2013", "31.03.2013", "01.04.2013", "02.04.2013"];
     * tempus.generate({
     *     dateFrom: '20130329',
     *     formatFrom: '%Y%m%d',
     *     dateTo: '20130402',
     *     period: {day: 1},
     *     format: '%d.%m.%Y'
     * });
     * @example
     * // returns ["29.03.2013", "30.03.2013", "31.03.2013", "01.04.2013", "02.04.2013"];
     * tempus.generate({
     *     dateFrom: '20130329',
     *     formatFrom: '%s',
     *     dateTo: '20130402',
     *     period: {day: 1},
     *     format: '%s'
     * });
     *
     */
    tempus.generate = function(options) {
        var tsFrom = options.dateFrom,
            tsTo = options.dateTo,
            period,
            result;
        // timestamp "from"
        if (typeof options.dateFrom !== 'number') {
            if (options.dateFrom instanceof TempusDate) {
                tsFrom = tsFrom.timestamp();
            } else {
                tsFrom = tempus(tsFrom, options.formatFrom).timestamp();
            }
        }
        // timestamp "to"
        if (typeof options.dateTo !== 'number') {
            if (options.dateTo instanceof TempusDate) {
                tsTo = tsTo.timestamp();
            } else {
                tsTo = tempus(tsTo, (options.formatTo !== undefined ? options.formatTo : options.formatFrom)).timestamp();
            }
        }
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
        if (options.groupBy === undefined) {
            result = options.asObject === true ? {} : [];
        } else {
            result = [];
            result.push([]);
            var prevValue = tempusFactory.createDate(tsFrom).get()[options.groupBy];
        }
        var addTo = function(array, value) {
            if (options.asObject === true) {
                if (options.format !== undefined) {
                    array[tempusFactory.createDate(value).format(options.format)] = {};
                } else {
                    array[tempusFactory.createDate(value).format('%F %H:%M:%S')] = {};
                }
            } else {
                if (options.format !== undefined) {
                    array.push(tempusFactory.createDate(value).format(options.format));
                } else {
                    array.push(tempusFactory.createDate(value));
                }
            }
            return array;
        };

        for (; tsFrom <= tsTo; tsFrom = tempusFactory.createDate(tsFrom).calc(period).timestamp()) {
            if (options.groupBy === undefined) {
                addTo(result, tsFrom);
            } else {
                if (that.date(tsFrom, {week:true})[options.groupBy] === prevValue) {
                    addTo(result[result.length-1], tsFrom);
                } else {
                    result.push([]);
                    addTo(result[result.length-1], tsFrom);
                    prevValue = tempusFactory.createDate(tsFrom).get()[options.groupBy];
                }
            }
        }
        return result;
    };

    // *************************************************
    // *                                               *
    // *                  EXPORTS                      *
    // *                                               *
    // *************************************************

    window.TempusDate = TempusDate;
    window.tempus = tempus;
})(window);
