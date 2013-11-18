(function() {
    var _Tempus = window.tempus,
        tempus,
        version = '0.2.0',
        lang = (navigator.language || navigator.systemLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase(),
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
                minLength: 2,
                maxLength: 2,
                type: "number"
            },
            '%m': {
                format: function (date) {
                    return formattingWithNulls(date.month() || date.constants().MIN_MONTH, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {month: (isNaN(v) ? undefined : v) };
                },
                minLength: 2,
                maxLength: 2,
                type: "number"
            },
            '%Y': {
                format: function (date) {
                    return formattingWithNulls(date.year() || date.constants().MIN_YEAR, 4);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {year: (isNaN(v) ? undefined : v) };
                },
                minLength: 4,
                maxLength: 4,
                type: "number"
            },
            '%w': {
                format: function (date) {
                    return date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK;
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                minLength: 1,
                maxLength: 1,
                type: "number"
            },
            '%a': {
                format: function (date) {
                    return translations[lang]["daysShortNames"][date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK];
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%A': {
                format: function (date) {
                    return translations[lang]["daysLongNames"][date.dayOfWeek() || date.constants().MIN_DAY_OF_WEEK];
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%b': {
                format: function (date) {
                    return translations[lang]["monthShortNames"][(date.month() || date.constants().MIN_MONTH) - (monthFromZero ? 0 : 1)];
                },
                parse: function (value) {
                    var month = that.getMonthNames().indexOf(value) + 1;
                    return {month: month !== -1 ? month : undefined}
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%B': {
                format: function (date) {
                    return translations[lang]["monthLongNames"][(date.month() || date.constants().MIN_MONTH) - (monthFromZero ? 0 : 1)];
                },
                parse: function (value) {
                    var month = that.getMonthNames(true).indexOf(value) + 1;
                    return {month: month !== -1 ? month : undefined}
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%H': {
                format: function (date) {
                    return formattingWithNulls(date.hours() || date.constants().MIN_HOURS, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {hours: (isNaN(v) ? undefined : v) };
                },
                minLength: 2,
                maxLength: 2,
                type: "number"
            },
            '%M': {
                format: function (date) {
                    return formattingWithNulls(date.minutes() || date.constants().MIN_MINUTES, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {minutes: (isNaN(v) ? undefined : v) };
                },
                minLength: 2,
                maxLength: 2,
                type: "number"
            },
            '%S': {
                format: function (date) {
                    return formattingWithNulls(date.seconds() || date.constants().MIN_SECONDS, 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {seconds: (isNaN(v) ? undefined : v) };
                },
                minLength: 2,
                maxLength: 2,
                type: "number"
            },
            '%s': {
                format: function (date) {
                    return date.timestamp();
                },
                parse: function (value) {
                    var v = Number(value);
                    var date = new TempusDate(Number(v), timezoneOffset);
                    var obj = that.date(v);
                    return isNaN(v) ? {} : that.incDate(obj, date.getTimezoneOffset(), 'minutes');
                },
                minLength: 1,
                maxLength: 20,
                type: "number"
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
                minLength: 10,
                maxLength: 10,
                type: "string"
            },
            '%D': {
                format: function (date) {
                    return formattingWithNulls(date.month() || date.constants().MIN_MONTH, 2) +
                        '/' + formattingWithNulls(date.day() || date.constants().MIN_DAY, 2) +
                        '/' + formattingWithNulls(date.year() || date.constants().MIN_YEAR, 4)
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
                minLength: 10,
                maxLength: 10,
                type: "string"
            }
        },
        useMilliseconds = false,
        monthFromZero = false;

    /**
     * A **TempusDate** class. Store information about some date and can be use
     * for working with it date.
     * @param {string} options Some date.
     * @param {undefined|string} format String for getting date from string or undefined else.
     * @param {TempusDate} defaults This object was returning, if options is **undefined**.
     * @returns {TempusDate}
     * @constructor
     */
    var TempusDate = function (options, format, defaults) {
        // always valid date
        this._date = new Date();
        // if some errors, write here values.
        this._incorrect = {
            year: false,
            month: false,
            day: false,
            hours: false,
            minutes: false,
            seconds: false,
            milliseconds: false
        };

        if (options !== undefined) {
            this.set(options, format, defaults);
        }
        return this;
    };

    /**
     * Short **prototype** alias.
     * @type {TempusDate}
     */
    TempusDate.fn = TempusDate.prototype;

    /**
     * Returns constants object. Some constants depends from options (MIN_MONTH, MAX_MONTH).
     * For MAX_DAY_IN_MONTH better use {@link #dayCount}.
     *
     *     @example
     *     // returns {
     *     //   "MIN_YEAR":1000,
     *     //   "MAX_YEAR":3000,
     *     //   "MIN_MONTH":1,
     *     //   "MAX_MONTH":12,
     *     //   "MIN_DAY":1,
     *     //   "MAX_DAY_IN_MONTHS":[31,28,31,30,31,30,31,31,30,31,30,31],
     *     //   "MIN_DAY_OF_WEEK":0,
     *     //   "MAX_DAY_OF_WEEK":6,
     *     //   "MIN_HOURS":0,
     *     //   "MAX_HOURS":23,
     *     //   "MIN_MINUTES":0,
     *     //   "MAX_MINUTES":59,
     *     //   "MIN_SECONDS":0,
     *     //   "MAX_SECONDS":59,
     *     //   "MIN_MILLISECONDS":0,
     *     //   "MAX_MILLISECONDS":999
     *     // }
     *     tempus().constants();
     * @returns {Object} Object with all constants in Tempus.
     */
    TempusDate.fn.constants = function () {
        return {
            MIN_YEAR: 1000,
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
    };

    /**
     * Returns day count in current month.
     *
     *     @example
     *     // returns 30
     *     tempus([2013, 11, 18]).dayCount();
     *
     *     // returns 29
     *     tempus([2012, 2]).dayCount();
     *
     *     // returns 28
     *     tempus([2013, 2]).dayCount();
     *
     *     // returns 31
     *     tempus([2013, 1]).dayCount();
     *
     * @returns {number} Day count in months.
     */
    TempusDate.fn.dayCount = function () {
        var m = this.month();
        var dc = this.constants().MAX_DAY_IN_MONTHS[m - (monthFromZero ? 0 : 1)];
        if (this.leapYear() && m === 2) {
            dc += 1;
        }
        return dc;
    };

    /**
     * Get or set year.
     *
     *     @example
     *     // returns current year
     *     tempus().year();
     *
     *     // returns 2000
     *     tempus().year(2000).year();
     *
     *     // returns 1000
     *     tempus().year(1000).year();
     *
     *     // returns 3000
     *     tempus().year(3000).year();
     *
     *     // returns 1000 (MIN_YEAR)
     *     tempus().year(undefined).year();
     *
     *     // returns 1
     *     tempus().year(1).year();
     *
     *     // returns -15
     *     tempus().year(-15).year();
     *
     *     // returns 0
     *     tempus().year('0').year();
     *
     *     // returns 1000 (MIN_YEAR)
     *     tempus().year({foo:"bar"}).year();
     *
     *     // returns 1000 (MIN_YEAR)
     *     tempus().year([1,2,3]).year();
     *
     *     // returns 1000 (MIN_YEAR)
     *     tempus().year(null).year();
     *
     *     // returns 1000 (MIN_YEAR)
     *     tempus().year(true).year();
     *
     *     // returns 1000 (MIN_YEAR)
     *     tempus().year(false).year();
     *
     *     // returns 1000 (MIN_YEAR)
     *     tempus().year(NaN).year();
     *
     * @param {number} value Set new year. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else **number** value.
     */
    TempusDate.fn.year = function (value) {
        if (arguments.length !== 0) {
            // no value range checking, because can be used for delta times
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value)) && Number(value) >= this.constants().MIN_YEAR && Number(value) <= this.constants().MAX_YEAR) {
                this._date.setFullYear(Number(value));
                this._incorrect.year = false;
            } else if (value === undefined) {
                this._date.setFullYear(this.constants().MIN_YEAR);
                this._incorrect.year = false;
            } else {
                this._incorrect.year = Number(value);
            }
        } else {
            return this._incorrect.year === false ? this._date.getFullYear() : this._incorrect.year;
        }
        return this;
    };

    /**
     * Get or set month.
     *
     *     @example
     *     // returns current month
     *     tempus().month();
     *
     *     // returns 100
     *     tempus().month(100).month();
     *
     *     // returns 12
     *     tempus().month(12).month();
     *
     *     // returns 1
     *     tempus().month(1).month();
     *
     *     // returns -5
     *     tempus().month(-5).month();
     *
     *     // returns 0
     *     tempus().month('0').month();
     *
     *     // returns 1 (MIN_MONTH)
     *     tempus().month(undefined).month();
     *
     *     // returns 1 (MIN_MONTH)
     *     tempus().month({foo: 'bar'}).month();
     *
     *     // returns 1 (MIN_MONTH)
     *     tempus().month([1,2,3]).month();
     *
     *     // returns 1 (MIN_MONTH)
     *     tempus().month(null).month();
     *
     *     // returns 1 (MIN_MONTH)
     *     tempus().month(true).month();
     *
     *     // returns 1 (MIN_MONTH)
     *     tempus().month(false).month();
     *
     *     // returns 1 (MIN_MONTH)
     *     tempus().month(NaN).month();
     *
     *
     * @param {number} value Set new month. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else **number** value.
     */
    TempusDate.fn.month = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value)) && Number(value) >= this.constants().MIN_MONTH && Number(value) <= this.constants().MAX_MONTH) {
                this._date.setMonth(monthFromZero ? Number(value) : Number(value) - 1);
                this._incorrect.month = false;
            } else if (value === undefined) {
                this._date.setMonth(monthFromZero ? this.constants().MIN_MONTH : this.constants().MIN_MONTH - 1);
                this._incorrect.month = false;
            } else {
                this._incorrect.month = Number(value);
            }
        } else {
            if (this._incorrect.year === false) {
                return monthFromZero ? this._date.getMonth() : (this._date.getMonth() +  1);
            } else {
                return this._incorrect.year;
            }
        }
        return this;
    };


})();