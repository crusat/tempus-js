(function(window, undefined) {
    var _tempus = window.tempus,
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
                    return formattingWithNulls(date.day() || tempus.constants().MIN_DAY, 2);
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
                    return formattingWithNulls(date.month() || tempus.constants().MIN_MONTH, 2);
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
                    return formattingWithNulls(date.year() || tempus.constants().MIN_YEAR, 4);
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
                    return date.dayOfWeek() || tempus.constants().MIN_DAY_OF_WEEK;
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
                    return translations[lang]["daysShortNames"][date.dayOfWeek() || tempus.constants().MIN_DAY_OF_WEEK];
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
                    return translations[lang]["daysLongNames"][date.dayOfWeek() || tempus.constants().MIN_DAY_OF_WEEK];
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
                    return translations[lang]["monthShortNames"][(date.month() || tempus.constants().MIN_MONTH) - (monthFromZero ? 0 : 1)];
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
                    return translations[lang]["monthLongNames"][(date.month() || tempus.constants().MIN_MONTH) - (monthFromZero ? 0 : 1)];
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
                    return formattingWithNulls(date.hours() || tempus.constants().MIN_HOURS, 2);
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
                    return formattingWithNulls(date.minutes() || tempus.constants().MIN_MINUTES, 2);
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
                    return formattingWithNulls(date.seconds() || tempus.constants().MIN_SECONDS, 2);
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
                    return formattingWithNulls(date.year() || tempus.constants().MIN_YEAR, 4) + '-' +
                        formattingWithNulls(date.month() || tempus.constants().MIN_MONTH, 2) + '-' +
                        formattingWithNulls(date.day() || tempus.constants().MIN_DAY, 2);
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
                    return formattingWithNulls(date.month() || tempus.constants().MIN_MONTH, 2) +
                        '/' + formattingWithNulls(date.day() || tempus.constants().MIN_DAY, 2) +
                        '/' + formattingWithNulls(date.year() || tempus.constants().MIN_YEAR, 4)
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

    /**
     * A **TempusDate** class. Store information about some date and can be use
     * for working with it date.
     * @param {undefined|Date|Object|Array|number|string} options Some date.
     * @param {undefined|string} format String for getting date from string or undefined else.
     * @param {TempusDate} defaults This object was returning, if parsing failed.
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
        var dc = tempus.constants().MAX_DAY_IN_MONTHS[m - (monthFromZero ? 0 : 1)];
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
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_YEAR && Number(value) <= tempus.constants().MAX_YEAR) {
                    this._date.setFullYear(Number(value));
                    this._incorrect.year = false;
                } else {
                    this._incorrect.year = Number(value);
                }
            } else {
                this._date.setFullYear(tempus.constants().MIN_YEAR);
                this._incorrect.year = false;
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
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_MONTH && Number(value) <= tempus.constants().MAX_MONTH) {
                    this._date.setMonth(monthFromZero ? Number(value) : Number(value) - 1);
                    this._incorrect.month = false;
                } else {
                    this._incorrect.month = Number(value);
                }
            } else {
                this._date.setMonth(monthFromZero ? tempus.constants().MIN_MONTH : tempus.constants().MIN_MONTH - 1);
                this._incorrect.month = false;
            }
        } else {
            if (this._incorrect.year === false) {
                return monthFromZero ? this._date.getMonth() : (this._date.getMonth() +  1);
            } else {
                return this._incorrect.month;
            }
        }
        return this;
    };

    /**
     * Get or set day of month.
     *
     *     @example
     *     // returns current day
     *     tempus().day();
     *
     *     // returns 100
     *     tempus().day(100).day();
     *
     *     // returns 12
     *     tempus().day(12).day();
     *
     *     // returns 1
     *     tempus().day(1).day();
     *
     *     // returns -5
     *     tempus().day(-5).day();
     *
     *     // returns 0
     *     tempus().day('0').day();
     *
     *     // returns 1 (MIN_DAY)
     *     tempus().day(undefined).day();
     *
     *     // returns 1 (MIN_DAY)
     *     tempus().day({foo: 'bar'}).day();
     *
     *     // returns 1 (MIN_DAY)
     *     tempus().day([1,2,3]).day();
     *
     *     // returns 1 (MIN_DAY)
     *     tempus().day(null).day();
     *
     *     // returns 1 (MIN_DAY)
     *     tempus().day(true).day();
     *
     *     // returns 1 (MIN_DAY)
     *     tempus().day(false).day();
     *
     *     // returns 1 (MIN_DAY)
     *     tempus().day(NaN).day();
     *
     *
     * @param {number} value Set new day. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else **number** value.
     */
    TempusDate.fn.day = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_DAY && Number(value) <= this.dayCount()) {
                    this._date.setDate(Number(value));
                    this._incorrect.day = false;
                } else {
                    this._incorrect.day = Number(value);
                }
            } else {
                this._date.setDate(tempus.constants().MIN_DAY);
                this._incorrect.day = false;
            }
        } else {
            return this._incorrect.day === false ? this._date.getDate() : this._incorrect.day;
        }
        return this;
    };

    /**
     * Get or set hours.
     *
     *     @example
     *     // returns current hours
     *     tempus().hours();
     *
     *     // returns 100
     *     tempus().hours(100).hours();
     *
     *     // returns 12
     *     tempus().hours(12).hours();
     *
     *     // returns 1
     *     tempus().hours(1).hours();
     *
     *     // returns -5
     *     tempus().hours(-5).hours();
     *
     *     // returns 0
     *     tempus().hours('0').hours();
     *
     *     // returns 0 (MIN_HOURS)
     *     tempus().hours(undefined).hours();
     *
     *     // returns 0 (MIN_HOURS)
     *     tempus().hours({foo: 'bar'}).hours();
     *
     *     // returns 0 (MIN_HOURS)
     *     tempus().hours([1,2,3]).hours();
     *
     *     // returns 0 (MIN_HOURS)
     *     tempus().hours(null).hours();
     *
     *     // returns 0 (MIN_HOURS)
     *     tempus().hours(true).hours();
     *
     *     // returns 0 (MIN_HOURS)
     *     tempus().hours(false).hours();
     *
     *     // returns 0 (MIN_HOURS)
     *     tempus().hours(NaN).hours();
     *
     *
     * @param {number} value Set new hours. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else **number** value.
     */
    TempusDate.fn.hours = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_HOURS && Number(value) <= tempus.constants().MAX_HOUR) {
                    this._date.setHours(Number(value));
                    this._incorrect.hours = false;
                } else {
                    this._incorrect.hours = Number(value);
                }
            } else {
                this._date.setHours(tempus.constants().MIN_HOURS);
                this._incorrect.hours = false;
            }
        } else {
            return this._incorrect.hours === false ? this._date.getHours() : this._incorrect.hours;
        }
        return this;
    };

    /**
     * Get or set minutes.
     *
     *     @example
     *     // returns current minutes
     *     tempus().minutes();
     *
     *     // returns 100
     *     tempus().minutes(100).minutes();
     *
     *     // returns 12
     *     tempus().minutes(12).minutes();
     *
     *     // returns 1
     *     tempus().minutes(1).minutes();
     *
     *     // returns -5
     *     tempus().minutes(-5).minutes();
     *
     *     // returns 0
     *     tempus().minutes('0').minutes();
     *
     *     // returns 0 (MIN_MINUTES)
     *     tempus().minutes(undefined).minutes();
     *
     *     // returns 0 (MIN_MINUTES)
     *     tempus().minutes({foo: 'bar'}).minutes();
     *
     *     // returns 0 (MIN_MINUTES)
     *     tempus().minutes([1,2,3]).minutes();
     *
     *     // returns 0 (MIN_MINUTES)
     *     tempus().minutes(null).minutes();
     *
     *     // returns 0 (MIN_MINUTES)
     *     tempus().minutes(true).minutes();
     *
     *     // returns 0 (MIN_MINUTES)
     *     tempus().minutes(false).minutes();
     *
     *     // returns 0 (MIN_MINUTES)
     *     tempus().minutes(NaN).minutes();
     *
     *
     * @param {number} value Set new minutes. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else **number** value.
     */
    TempusDate.fn.minutes = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_MINUTES && Number(value) <= tempus.constants().MAX_MINUTES) {
                    this._date.setMinutes(Number(value));
                    this._incorrect.minutes = false;
                } else {
                    this._incorrect.minutes = Number(value);
                }
            } else {
                this._date.setMinutes(tempus.constants().MIN_MINUTES);
                this._incorrect.minutes = false;
            }
        } else {
            return this._incorrect.minutes === false ? this._date.getMinutes() : this._incorrect.minutes;
        }
        return this;
    };

    /**
     * Get or set seconds.
     *
     *     @example
     *     // returns current seconds
     *     tempus().seconds();
     *
     *     // returns 100
     *     tempus().seconds(100).seconds();
     *
     *     // returns 12
     *     tempus().seconds(12).seconds();
     *
     *     // returns 1
     *     tempus().seconds(1).seconds();
     *
     *     // returns -5
     *     tempus().seconds(-5).seconds();
     *
     *     // returns 0
     *     tempus().seconds('0').seconds();
     *
     *     // returns 0 (MIN_SECONDS)
     *     tempus().seconds(undefined).seconds();
     *
     *     // returns 0 (MIN_SECONDS)
     *     tempus().seconds({foo: 'bar'}).seconds();
     *
     *     // returns 0 (MIN_SECONDS)
     *     tempus().seconds([1,2,3]).seconds();
     *
     *     // returns 0 (MIN_SECONDS)
     *     tempus().seconds(null).seconds();
     *
     *     // returns 0 (MIN_SECONDS)
     *     tempus().seconds(true).seconds();
     *
     *     // returns 0 (MIN_SECONDS)
     *     tempus().seconds(false).seconds();
     *
     *     // returns 0 (MIN_SECONDS)
     *     tempus().seconds(NaN).seconds();
     *
     *
     * @param {number} value Set new seconds. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else **number** value.
     */
    TempusDate.fn.seconds = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_SECONDS && Number(value) <= tempus.constants().MAX_SECONDS) {
                    this._date.setSeconds(Number(value));
                    this._incorrect.seconds = false;
                } else {
                    this._incorrect.seconds = Number(value);
                }
            } else {
                this._date.setSeconds(tempus.constants().MIN_SECONDS);
                this._incorrect.seconds = false;
            }
        } else {
            return this._incorrect.seconds === false ? this._date.getSeconds() : this._incorrect.seconds;
        }
        return this;
    };

    /**
     * Get or set milliseconds.
     *
     *     @example
     *     // returns current milliseconds
     *     tempus().milliseconds();
     *
     *     // returns 1000
     *     tempus().milliseconds(1000).milliseconds();
     *
     *     // returns 120
     *     tempus().milliseconds(12).milliseconds();
     *
     *     // returns 1
     *     tempus().milliseconds(1).milliseconds();
     *
     *     // returns -5
     *     tempus().milliseconds(-5).milliseconds();
     *
     *     // returns 0
     *     tempus().milliseconds('0').milliseconds();
     *
     *     // returns 0 (MIN_MILLISECONDS)
     *     tempus().milliseconds(undefined).milliseconds();
     *
     *     // returns 0 (MIN_MILLISECONDS)
     *     tempus().milliseconds({foo: 'bar'}).milliseconds();
     *
     *     // returns 0 (MIN_MILLISECONDS)
     *     tempus().milliseconds([1,2,3]).milliseconds();
     *
     *     // returns 0 (MIN_MILLISECONDS)
     *     tempus().milliseconds(null).milliseconds();
     *
     *     // returns 0 (MIN_MILLISECONDS)
     *     tempus().milliseconds(true).milliseconds();
     *
     *     // returns 0 (MIN_MILLISECONDS)
     *     tempus().milliseconds(false).milliseconds();
     *
     *     // returns 0 (MIN_MILLISECONDS)
     *     tempus().milliseconds(NaN).milliseconds();
     *
     *
     * @param {number} value Set new milliseconds. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else **number** value.
     */
    TempusDate.fn.milliseconds = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_MILLISECONDS && Number(value) <= tempus.constants().MAX_MILLISECONDS) {
                    this._date.setMilliseconds(Number(value));
                    this._incorrect.milliseconds = false;
                } else {
                    this._incorrect.milliseconds = Number(value);
                }
            } else {
                this._date.setMilliseconds(tempus.constants().MIN_MILLISECONDS);
                this._incorrect.milliseconds = false;
            }
        } else {
            return this._incorrect.milliseconds === false ? this._date.getMilliseconds() : this._incorrect.milliseconds;
        }
        return this;
    };

    /**
     * Returns week number.
     *
     *     @example
     *     // returns 18
     *     tempus([2013, 5, 1]).week();
     *
     * @returns {number} Week number.
     */
    TempusDate.fn.week = function () {
        var onejan = new Date(this.year(), 0, 1);
        var nowDate = this.get('Date');
        return Math.ceil((((nowDate - onejan) / 86400000) + onejan.getDay()+1)/7);
    };

    /**
     * Set new date. If **undefined**, set now date. If instance of **Date** - set it date.
     * If **object**, set date from {year: number, month: number, day: number, hours: number, minutes: number,
     * milliseconds: number}. If **Array**, set date from [YEAR, MONTH, DAY, HOURS, MINUTES, SECONDS, MILLISECONDS].
     * If **number**, set local time from timestamp. If **string**, set date from formatted date by format (or auto detect
     * format). Directives ALWAYS must be started from % and content only 1 char. For example %q, %d, %y, %0.
     * Two percent chars (%%) not allowed to directives. This replaced to single percent (%) on parsing.
     *
     *     @example
     *     // returns TempusDate with current date
     *     tempus().set();
     *
     *     // returns TempusDate with date "2013-11-18 20:14:23.918"
     *     tempus().set({year: 2013, month: 11, day: 18, hours: 20, minutes: 14, seconds: 23, milliseconds: 918});
     *
     *     // returns TempusDate with date "2013-11-18 20:15:38"
     *     tempus().set(1384791338);
     *
     *     // returns TempusDate with date "2013-01-01 12:00:03"
     *     tempus().set([2013, 1, 1, 12, 0, 3]);
     *
     *     // returns TempusDate with date "2013-01-01"
     *     tempus().set(new Date(2012, 0, 1));
     *
     *     // returns TempusDate with date "2013-11-18"
     *     tempus().set('18.11.2013');
     *
     *     // returns TempusDate with date "2013-12-12"
     *     tempus().set('2013-12-12', '%Y-%m-%d'));
     *
     *     // returns TempusDate with date "2013-01-01"
     *     tempus().set('123', '%d.%m.%Y', tempus([2013, 1, 1]));
     *
     * @param {undefined|Date|Object|Array|number|string} newDate Some date.
     * @param {undefined|string} format String for getting date from string or undefined else.
     * @param {TempusDate} defaults This object was returning, if parsing failed.
     * @returns {TempusDate}
     */
    TempusDate.fn.set = function (newDate, format, defaults) {
        this._incorrect = {
            year: false,
            month: false,
            day: false,
            hours: false,
            minutes: false,
            seconds: false,
            milliseconds: false
        };
        if (newDate === undefined) {
            this._date = new Date();
            return this;
        }
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
            var key,
                lits = [],
                parseResult;
            if (newDate === undefined) {
                parseResult = parseBadFormat(this, defaults);
                if (parseResult === undefined) {
                    this._incorrect = {
                        year: -1,
                        month: -1,
                        day: -1,
                        hours: -1,
                        minutes: -1,
                        seconds: -1,
                        milliseconds: -1
                    };
                }
                return parseResult;
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
                            parseResult = parseBadFormat(this, defaults);
                            if (parseResult === undefined) {
                                this._incorrect = {
                                    year: -1,
                                    month: -1,
                                    day: -1,
                                    hours: -1,
                                    minutes: -1,
                                    seconds: -1,
                                    milliseconds: -1
                                };
                            }
                            return parseResult;
                        }
                        lits.push(directive);
                        res.push(shortString);
                        j += --k;
                        i++;
                    }
                } else {
                    if (newDate.charAt(j) !== format.charAt(i)) {
                        parseResult = parseBadFormat(this, defaults);
                        if (parseResult === undefined) {
                            this._incorrect = {
                                year: -1,
                                month: -1,
                                day: -1,
                                hours: -1,
                                minutes: -1,
                                seconds: -1,
                                milliseconds: -1
                            };
                        }
                        return parseResult;
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

    /**
     * Is year leap?
     *
     *    @example
     *    // returns false
     *    tempus([2014]).leapYear();
     *
     *    // returns true
     *    tempus({year: 2012}).leapYear();
     *
     *    // returns true
     *    tempus(947698701).leapYear(); // 2012 year
     *
     *    // returns false
     *    tempus([1900]).leapYear();
     *
     *    // returns false
     *    tempus({year: 1941, day: 22, month: 6}).leapYear();
     *
     *    // returns true
     *    tempus({year: 2008, day: 1, month: 1}).leapYear();
     *
     *    // check current year
     *    tempus().leapYear();
     *
     * @returns {boolean} If true year is leap else not leap.
     */
    TempusDate.fn.leapYear = function () {
        var year = this.year();
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                return year % 400 == 0;
            } else return true;
        }
        return false;
    };

    /**
     * Get or set timestamp.
     *
     *     @example
     *     // returns 1384718400
     *     tempus([2013, 11, 18]).timestamp();
     *
     *     // returns TempusDate with date '2013-11-18'
     *     tempus().timestamp(1384718400);
     *
     * @param {none|number} value
     * @returns {TempusDate|number} TempusDate or numeric timestamp.
     */
    TempusDate.fn.timestamp = function (value) {
        if (arguments.length !== 0) {
            this._date = new Date(Number(value) * (useMilliseconds ? 1 : 1000));
            return this;
        } else {
            if (useMilliseconds) {
                return this._date.getTime();
            } else {
                return Math.floor(this._date.getTime() / 1000)
            }
        }
    };

    /**
     * Get or set timestamp in UTC.
     *
     *     @example
     *     // returns 1384732800
     *     tempus([2013, 11, 18]).UTC();
     *
     *     // returns TempusDate with date '2013-11-18'
     *     tempus().UTC(1384732800);
     *
     * @param {none|number} value
     * @returns {TempusDate|number} TempusDate or numeric timestamp.
     */
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
     *
     *     @example
     *     // returns current day of week
     *     tempus().dayOfWeek();
     *
     *     // returns 1
     *     tempus([2013, 11, 18]).dayOfWeek();
     *
     * @param type {string|none} If none, number returned. If 'short', short string returned, 'long' for long.
     * @returns {number} Numeric value of day of week.
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



    // *************************************************
    // *                                               *
    // *                    FACTORY                    *
    // *                                               *
    // *************************************************

    /**
     * Create method for TempusDate. You can set initial value, for more info, see {@link #set}.
     *
     *     @example
     *     // returns TempusDate with current date.
     *     tempus();
     *
     *     // returns TempusDate with date 2013-01-15.
     *     tempus({year: 2013, month: 1, day: 15});
     *
     *     // returns TempusDate with date 2000-06-01 and time 12:01:15
     *     tempus([2000, 6, 1, 12, 1, 15]);
     *
     *     // returns TempusDate with date 2001-05-10 and time 05:30:00
     *     tempus('2001-05-10 05:30:00');
     *
     *     // returns TempusDate with date 2001-05-10 and time 05:30:00
     *     tempus(989454600);
     *
     * @param {undefined|Date|Object|Array|number|string} options Some date. See {@link #set}
     * @param {undefined|string} format See {@link #set}
     * @param {undefined|TempusDate} defaults See {@link #set}
     * @returns {TempusDate} Instance of TempusDate.
     */
    tempus = function (options, format, defaults) {
        return new TempusDate(options, format, defaults);
    };

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
     *     //   "MAX_HOUR":23,
     *     //   "MIN_MINUTES":0,
     *     //   "MAX_MINUTES":59,
     *     //   "MIN_SECONDS":0,
     *     //   "MAX_SECONDS":59,
     *     //   "MIN_MILLISECONDS":0,
     *     //   "MAX_MILLISECONDS":999
     *     // }
     *     tempus.constants();
     *
     * @static
     * @returns {Object} Object with all constants in Tempus.
     */
    tempus.constants = function () {
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
            MAX_HOUR: 23,
            MIN_MINUTES: 0,
            MAX_MINUTES: 59,
            MIN_SECONDS: 0,
            MAX_SECONDS: 59,
            MIN_MILLISECONDS: 0,
            MAX_MILLISECONDS: 999
        }
    };

    /**
     * Generates dates from [dateFrom] to [dateTo] with period [period] and result format dates is [format] or any other.
     *
     *     @example
     *     // returns ["01.01.2013", "02.01.2013", "03.01.2013", "04.01.2013", "05.01.2013",
     *     //    "06.01.2013", "07.01.2013", "08.01.2013", "09.01.2013", "10.01.2013"];
     *     tempus.generate({
     *         dateFrom: '01.01.2013',
     *         dateTo: '10.01.2013',
     *         period: 'day',
     *         format: '%d.%m.%Y'
     *     });
     *
     *     // returns ["29.03.2013", "30.03.2013", "31.03.2013", "01.04.2013", "02.04.2013"];
     *     tempus.generate({
     *         dateFrom: '20130329',
     *         formatFrom: '%Y%m%d',
     *         dateTo: '20130402',
     *         period: {day: 1},
     *         format: '%d.%m.%Y'
     *     });
     *
     *     // returns ["29.03.2013", "30.03.2013", "31.03.2013", "01.04.2013", "02.04.2013"];
     *     tempus.generate({
     *         dateFrom: '20130329',
     *         formatFrom: '%s',
     *         dateTo: '20130402',
     *         period: {day: 1},
     *         format: '%s'
     *     });
     *
     *
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
     * @static
     * @returns {Array|Object} Array or object from dates.
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
    // *                  EXPORTS                      *
    // *                                               *
    // *************************************************

    window.TempusDate = TempusDate;
    window.tempus = tempus;
})(window);