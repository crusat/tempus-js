/*
 * @author Aleksey Kuznetsov, me@akuzn.com
 * @version 0.2.2
 * @url https://github.com/crusat/tempus-js
 * @description Library with date/time methods.
 */
/**
 * @doc module
 * @name tempus
 * @description
 *
 * ## Global Utilities
 *
 * This module houses utillities that can be used
 * across the app. There are some pretty cool and
 * uncool methods in this module so check it outizzle.
 *
 * Note, if you do not define the module using @doc module
 * and the @name with the module id, then this page won't exist!!
 */
(function (window, undefined) {
    "use strict";

    // *************************************************
    // *                                               *
    // *               COMPATIBILITY                   *
    // *                                               *
    // *************************************************

    // fix Array.indexOf for old browsers
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            var i, j;
            for (i = (start || 0), j = this.length; i < j; i += 1) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }

    // *************************************************
    // *                                               *
    // *                   CORE                        *
    // *                                               *
    // *************************************************

    var version = '0.2.2',
        formattingWithNulls = function (val, symb_count) {
            var v = val.toString();
            while (v.length < symb_count) {
                v = '0' + v;
            }
            return v;
        },
        parseBadFormat = function (date, defaults) {
            if (defaults !== undefined) {
                date.year(defaults.year() || defaults.year);
                date.month(defaults.month() || defaults.month);
                date.day(defaults.day() || defaults.day);
                date.hours(defaults.hours() || defaults.hours);
                date.minutes(defaults.minutes() || defaults.minutes);
                date.seconds(defaults.seconds() || defaults.seconds);
                date.milliseconds(defaults.milliseconds() || defaults.milliseconds);
                return date;
            }
            return undefined;
        },
        detectTimeFormat = function (str, startFrom) {
            var tmpChars, format = '';
            tmpChars = str.slice(startFrom, startFrom + 1);
            if (tmpChars !== '' && !isNaN(Number(tmpChars))) {
                format += '%H';
            }
            tmpChars = str.charAt(startFrom + 2);
            if (tmpChars !== '' && tmpChars === ':') {
                format += tmpChars;
            }
            tmpChars = str.slice(startFrom + 3, startFrom + 4);
            if (tmpChars !== '' && !isNaN(Number(tmpChars))) {
                format += '%M';
            }
            tmpChars = str.charAt(startFrom + 5);
            if (tmpChars !== '' && tmpChars === ':') {
                format += tmpChars;
            }
            tmpChars = str.slice(startFrom + 6, startFrom + 7);
            if (tmpChars !== '' && !isNaN(Number(tmpChars))) {
                format += '%S';
            }
            return format;
        },
        detectDateFormat = function (str, startFrom) {
            var format,
                part1 = [
                    str.slice(startFrom, startFrom + 1),
                    str.charAt(startFrom + 2),
                    str.slice(startFrom + 3, startFrom + 4),
                    str.charAt(startFrom + 5),
                    str.slice(startFrom + 6, startFrom + 9)
                ],
                part2;

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

            part2 = [
                str.slice(startFrom, startFrom + 3),
                str.charAt(startFrom + 4),
                str.slice(startFrom + 5, startFrom + 6),
                str.charAt(startFrom + 7),
                str.slice(startFrom + 8, startFrom + 9)
            ];

            if (!isNaN(Number(part2[0])) && !isNaN(Number(part2[2])) && !isNaN(Number(part2[4]))) {
                if (part2[1] === '-' && part2[3] === '-') {
                    format = '%Y-%m-%d';
                }
                return format;
            }
            return '';
        },
        oldTempus = window.tempus,
        oldTempusDate = window.TempusDate,
        tempus,
        nav = window.navigator,
        lang = (nav.language || nav.systemLanguage || nav.userLanguage || 'en').substr(0, 2).toLowerCase(),
        translations = {
            "en": {
                "monthShortNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                "monthLongNames": ["January", "February", "March", "April", "May", "June", "July", "August",
                    "September", "October", "November", "December"],
                "dayShortNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "dayLongNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            "ru": {
                "monthShortNames": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                "monthLongNames": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
                    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                "dayShortNames": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                "dayLongNames": ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
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
                parse: function () {
                    // impossible
                    return {};
                },
                minLength: 1,
                maxLength: 1,
                type: "number"
            },
            '%a': {
                format: function (date) {
                    return translations[lang].dayShortNames[date.dayOfWeek() || tempus.constants().MIN_DAY_OF_WEEK];
                },
                parse: function () {
                    // impossible
                    return {};
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%A': {
                format: function (date) {
                    return translations[lang].dayLongNames[date.dayOfWeek() || tempus.constants().MIN_DAY_OF_WEEK];
                },
                parse: function () {
                    // impossible
                    return {};
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%b': {
                format: function (date) {
                    return translations[lang].monthShortNames[(date.month() || tempus.constants().MIN_MONTH)];
                },
                parse: function (value) {
                    var month = tempus.monthNames().indexOf(value) + 1;
                    return {month: month !== -1 ? month : undefined};
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%B': {
                format: function (date) {
                    return translations[lang].monthLongNames[(date.month() || tempus.constants().MIN_MONTH)];
                },
                parse: function (value) {
                    var month = tempus.monthNames(true).indexOf(value) + 1;
                    return {month: month !== -1 ? month : undefined};
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
                    return isNaN(Number(value)) ? {} : tempus(Number(value)).get();
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
                    var year = Number(value.slice(0, 4)),
                        month = Number(value.slice(6, 7)),
                        day = Number(value.slice(9, 10));
                    return {
                        year: year,
                        month: month,
                        day: day
                    };
                },
                minLength: 10,
                maxLength: 10,
                type: "string"
            },
            '%D': {
                format: function (date) {
                    return formattingWithNulls(date.month() || tempus.constants().MIN_MONTH, 2) +
                        '/' + formattingWithNulls(date.day() || tempus.constants().MIN_DAY, 2) +
                        '/' + formattingWithNulls(date.year() || tempus.constants().MIN_YEAR, 4);
                },
                parse: function (value) {
                    var month = Number(value.slice(0, 2)),
                        day = Number(value.slice(3, 5)),
                        year = Number(value.slice(6, 10));
                    return {
                        year: year,
                        month: month,
                        day: day
                    };
                },
                minLength: 10,
                maxLength: 10,
                type: "string"
            }
        },
        options = {
            useMilliseconds: false,
            monthFromZero: false
        },
        TempusDate;

    /**
     * A **TempusDate** class. Store information about some date and can be use
     * for working with it date.
     * @param {undefined|Date|Object|Array|number|string} options Some date.
     * @param {undefined|string} format String for getting date from string or undefined else.
     * @param {TempusDate} defaults This object was returning, if parsing failed.
     * @returns {TempusDate}
     * @constructor
     */
    TempusDate = function (options, format, defaults) {
        // always valid date
        this.date = new Date();
        // if some errors, write here values.
        this.incorrect = {
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
     * @doc property
     * @name TempusDate.global:fn
     * @description
     * Short **prototype** alias.
     */
    TempusDate.fn = TempusDate.prototype;

    /**
     * @doc method
     * @name TempusDate.global:dayCount
     * @return {number} Day count in months.
     * @description
     * Returns day count in current month.
     * ```js
     * // returns 30
     * tempus([2013, 11, 18]).dayCount();
     *
     * // returns 29
     * tempus([2012, 2]).dayCount();
     *
     * // returns 28
     * tempus([2013, 2]).dayCount();
     *
     * // returns 31
     * tempus([2013, 1]).dayCount();
     * ```
     */
    TempusDate.fn.dayCount = function () {
        var m = this.month(),
            dc = tempus.constants().MAX_DAY_IN_MONTHS[m - (tempus.options('monthFromZero') ? 0 : 1)];
        if (this.leapYear() && m === 2) {
            dc += 1;
        }
        return dc;
    };

    /**
     * @doc method
     * @name TempusDate.global:year
     * @param {number} value Set new year. If no arguments, returns numeric value.
     * @return {TempusDate|number} Returns: if setter - TempusDate, else numeric value.
     * @description
     * Get or set year.
     *
     * ```js
     * // returns current year
     * tempus().year();
     *
     * // returns 2000
     * tempus().year(2000).year();
     *
     * // returns 1000
     * tempus().year(1000).year();
     *
     * // returns 3000
     * tempus().year(3000).year();
     *
     * // returns 1000 (MIN_YEAR)
     * tempus().year(undefined).year();
     *
     * // returns 1
     * tempus().year(1).year();
     *
     * // returns -15
     * tempus().year(-15).year();
     *
     * // returns 0
     * tempus().year('0').year();
     *
     * // returns 1000 (MIN_YEAR)
     * tempus().year({foo:"bar"}).year();
     *
     * // returns 1000 (MIN_YEAR)
     * tempus().year([1,2,3]).year();
     *
     * // returns 1000 (MIN_YEAR)
     * tempus().year(null).year();
     *
     * // returns 1000 (MIN_YEAR)
     * tempus().year(true).year();
     *
     * // returns 1000 (MIN_YEAR)
     * tempus().year(false).year();
     *
     * // returns 1000 (MIN_YEAR)
     * tempus().year(NaN).year();
     * ```
     */
    TempusDate.fn.year = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_YEAR && Number(value) <= tempus.constants().MAX_YEAR) {
                    this.date.setFullYear(Number(value));
                    this.incorrect.year = false;
                } else {
                    this.incorrect.year = Number(value);
                }
            } else {
                this.date.setFullYear(tempus.constants().MIN_YEAR);
                this.incorrect.year = false;
            }
        } else {
            return this.incorrect.year === false ? this.date.getFullYear() : this.incorrect.year;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:month
     * @param {number} value Set new month. If no arguments, returns numeric value.
     * @return {TempusDate|number} Returns: if setter - TempusDate, else numeric value.
     * @description
     * Get or set month.
     *
     * ```js
     * // returns current month
     * tempus().month();
     *
     * // returns 100
     * tempus().month(100).month();
     *
     * // returns 12
     * tempus().month(12).month();
     *
     * // returns 1
     * tempus().month(1).month();
     *
     * // returns -5
     * tempus().month(-5).month();
     *
     * // returns 0
     * tempus().month('0').month();
     *
     * // returns 1 (MIN_MONTH)
     * tempus().month(undefined).month();
     *
     * // returns 1 (MIN_MONTH)
     * tempus().month({foo: 'bar'}).month();
     *
     * // returns 1 (MIN_MONTH)
     * tempus().month([1,2,3]).month();
     *
     * // returns 1 (MIN_MONTH)
     * tempus().month(null).month();
     *
     * // returns 1 (MIN_MONTH)
     * tempus().month(true).month();
     *
     * // returns 1 (MIN_MONTH)
     * tempus().month(false).month();
     *
     * // returns 1 (MIN_MONTH)
     * tempus().month(NaN).month();
     * ```
     */
    TempusDate.fn.month = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_MONTH && Number(value) <= tempus.constants().MAX_MONTH) {
                    this.date.setMonth(tempus.options('monthFromZero') ? Number(value) : Number(value) - 1);
                    this.incorrect.month = false;
                } else {
                    this.incorrect.month = Number(value);
                }
            } else {
                this.date.setMonth(tempus.options('monthFromZero') ? tempus.constants().MIN_MONTH : tempus.constants().MIN_MONTH - 1);
                this.incorrect.month = false;
            }
        } else {
            if (this.incorrect.month === false) {
                return tempus.options('monthFromZero') ? this.date.getMonth() : (this.date.getMonth() + 1);
            }
            return this.incorrect.month;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:day
     * @param {number} value Set new day. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else numeric value.
     * @description
     * Get or set day of month.
     *
     * ```js
     * // returns current day
     * tempus().day();
     *
     * // returns 100
     * tempus().day(100).day();
     *
     * // returns 12
     * tempus().day(12).day();
     *
     * // returns 1
     * tempus().day(1).day();
     *
     * // returns -5
     * tempus().day(-5).day();
     *
     * // returns 0
     * tempus().day('0').day();
     *
     * // returns 1 (MIN_DAY)
     * tempus().day(undefined).day();
     *
     * // returns 1 (MIN_DAY)
     * tempus().day({foo: 'bar'}).day();
     *
     * // returns 1 (MIN_DAY)
     * tempus().day([1,2,3]).day();
     *
     * // returns 1 (MIN_DAY)
     * tempus().day(null).day();
     *
     * // returns 1 (MIN_DAY)
     * tempus().day(true).day();
     *
     * // returns 1 (MIN_DAY)
     * tempus().day(false).day();
     *
     * // returns 1 (MIN_DAY)
     * tempus().day(NaN).day();
     * ```
     */
    TempusDate.fn.day = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_DAY && Number(value) <= this.dayCount()) {
                    this.date.setDate(Number(value));
                    this.incorrect.day = false;
                } else {
                    this.incorrect.day = Number(value);
                }
            } else {
                this.date.setDate(tempus.constants().MIN_DAY);
                this.incorrect.day = false;
            }
        } else {
            return this.incorrect.day === false ? this.date.getDate() : this.incorrect.day;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:hours
     * @param {number} value Set new hours. If no arguments, returns numeric value.
     * @returns {TempusDate|number} Returns: if setter - TempusDate, else **number** value.
     * @description
     * Get or set hours.
     *
     * ```js
     * // returns current hours
     * tempus().hours();
     *
     * // returns 100
     * tempus().hours(100).hours();
     *
     * // returns 12
     * tempus().hours(12).hours();
     *
     * // returns 1
     * tempus().hours(1).hours();
     *
     * // returns -5
     * tempus().hours(-5).hours();
     *
     * // returns 0
     * tempus().hours('0').hours();
     *
     * // returns 0 (MIN_HOURS)
     * tempus().hours(undefined).hours();
     *
     * // returns 0 (MIN_HOURS)
     * tempus().hours({foo: 'bar'}).hours();
     *
     * // returns 0 (MIN_HOURS)
     * tempus().hours([1,2,3]).hours();
     *
     * // returns 0 (MIN_HOURS)
     * tempus().hours(null).hours();
     *
     * // returns 0 (MIN_HOURS)
     * tempus().hours(true).hours();
     *
     * // returns 0 (MIN_HOURS)
     * tempus().hours(false).hours();
     *
     * // returns 0 (MIN_HOURS)
     * tempus().hours(NaN).hours();
     * ```
     */
    TempusDate.fn.hours = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.constants().MIN_HOURS && Number(value) <= tempus.constants().MAX_HOURS) {
                    this.date.setHours(Number(value));
                    this.incorrect.hours = false;
                } else {
                    this.incorrect.hours = Number(value);
                }
            } else {
                this.date.setHours(tempus.constants().MIN_HOURS);
                this.incorrect.hours = false;
            }
        } else {
            return this.incorrect.hours === false ? this.date.getHours() : this.incorrect.hours;
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
                    this.date.setMinutes(Number(value));
                    this.incorrect.minutes = false;
                } else {
                    this.incorrect.minutes = Number(value);
                }
            } else {
                this.date.setMinutes(tempus.constants().MIN_MINUTES);
                this.incorrect.minutes = false;
            }
        } else {
            return this.incorrect.minutes === false ? this.date.getMinutes() : this.incorrect.minutes;
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
                    this.date.setSeconds(Number(value));
                    this.incorrect.seconds = false;
                } else {
                    this.incorrect.seconds = Number(value);
                }
            } else {
                this.date.setSeconds(tempus.constants().MIN_SECONDS);
                this.incorrect.seconds = false;
            }
        } else {
            return this.incorrect.seconds === false ? this.date.getSeconds() : this.incorrect.seconds;
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
                    this.date.setMilliseconds(Number(value));
                    this.incorrect.milliseconds = false;
                } else {
                    this.incorrect.milliseconds = Number(value);
                }
            } else {
                this.date.setMilliseconds(tempus.constants().MIN_MILLISECONDS);
                this.incorrect.milliseconds = false;
            }
        } else {
            return this.incorrect.milliseconds === false ? this.date.getMilliseconds() : this.incorrect.milliseconds;
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
        var onejan = new Date(this.year(), 0, 1),
            nowDate = this.get('Date');
        return Math.ceil((((nowDate - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };

    /**
     * Set new date. If **undefined**, set now date. If instance of **Date** - set it date.
     * If **object**, set date from {year: number, month: number, day: number, hours: number, minutes: number,
     * milliseconds: number}. If **Array**, set date from [YEAR, MONTH, DAY, HOURS, MINUTES, SECONDS, MILLISECONDS].
     * If **number**, set local time from timestamp. If **string**, set date from formatted date by format (or auto detect
     * format). Directives ALWAYS must be started from % and content only 1 char. For example %q, %d, %y, %0.
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
        this.incorrect = {
            year: false,
            month: false,
            day: false,
            hours: false,
            minutes: false,
            seconds: false,
            milliseconds: false
        };
        if (newDate === undefined) {
            this.date = new Date();
            return this;
        }
        if (newDate instanceof Date) {
            this.date = newDate;
            return this;
        }
        if (typeof newDate === 'number') {
            this.date = new Date(newDate * (tempus.options('useMilliseconds') ? 1 : 1000));
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
                parseResult,
                directive,
                res = [],
                i = 0,
                j = 0,
                k,
                shortString,
                resultdate = {},
                tmpdate;
            if (newDate === undefined) {
                parseResult = parseBadFormat(this, defaults);
                if (parseResult === undefined) {
                    this.incorrect = {
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
                format = tempus.detectFormat(newDate);
            }
            while (i < format.length) {
                if (format.charAt(i) === '%') {
                    directive = format.charAt(i) + format.charAt(i + 1);
                    if (registeredFormats[directive] !== undefined) {
                        k = 0;
                        shortString = '';
                        switch (registeredFormats[directive].type) {
                        case 'number':
                            while ((k < registeredFormats[directive].maxLength) && (j + k < newDate.length) && !isNaN(Number(newDate.charAt(j + k)))) {
                                shortString += newDate.charAt(j + k);
                                k += 1;
                            }
                            break;
                        case 'word':
                            while ((k < registeredFormats[directive].maxLength) && (j + k < newDate.length) && /^\w+$/.test(newDate.charAt(j + k))) {
                                shortString += newDate.charAt(j + k);
                                k += 1;
                            }
                            break;
                        case 'string':
                            while ((k < registeredFormats[directive].maxLength) && (j + k < newDate.length)) {
                                shortString += newDate.charAt(j + k);
                                k += 1;
                            }
                            break;
                        }

                        if (k < registeredFormats[directive].minLength) {
                            parseResult = parseBadFormat(this, defaults);
                            if (parseResult === undefined) {
                                this.incorrect = {
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
                        k -= 1;
                        j += k;
                        i += 1;
                    }
                } else {
                    if (newDate.charAt(j) !== format.charAt(i)) {
                        parseResult = parseBadFormat(this, defaults);
                        if (parseResult === undefined) {
                            this.incorrect = {
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
                i += 1;
                j += 1;
            }
            for (key in lits) {
                if (lits.hasOwnProperty(key) && (registeredFormats.hasOwnProperty(lits[key]))) {
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
     *     @example
     *     // returns false
     *     tempus([2014]).leapYear();
     *
     *     // returns true
     *     tempus({year: 2012}).leapYear();
     *
     *     // returns true
     *     tempus(947698701).leapYear(); // 2012 year
     *
     *     // returns false
     *     tempus([1900]).leapYear();
     *
     *     // returns false
     *     tempus({year: 1941, day: 22, month: 6}).leapYear();
     *
     *     // returns true
     *     tempus({year: 2008, day: 1, month: 1}).leapYear();
     *
     *    // check current year
     *    tempus().leapYear();
     *
     * @returns {boolean} If true year is leap else not leap.
     */
    TempusDate.fn.leapYear = function () {
        var year = this.year();
        if (year % 4 === 0) {
            if (year % 100 === 0) {
                return year % 400 === 0;
            }
            return true;
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
     * @param {number} value Value for set or no value for get.
     * @returns {TempusDate|number} TempusDate or numeric timestamp.
     */
    TempusDate.fn.timestamp = function (value) {
        if (arguments.length !== 0) {
            this.date = new Date(Number(value) * (tempus.options('useMilliseconds') ? 1 : 1000) + this.date.getTimezoneOffset() * 60000);
            return this;
        }
        if (tempus.options('useMilliseconds')) {
            return this.date.getTime() - this.date.getTimezoneOffset() * 60000;
        }
        return Math.floor(this.date.getTime() / 1000) - this.date.getTimezoneOffset() * 60;
    };

    /**
     * Get or set timestamp in UTC.
     *
     *     @example
     *     // returns 1384732800
     *     tempus([2013, 11, 18]).utc();
     *
     *     // returns TempusDate with date '2013-11-18'
     *     tempus().utc(1384732800);
     *
     * @param {number} value Value for set or no value for get.
     * @returns {TempusDate|number} TempusDate or numeric timestamp.
     */
    TempusDate.fn.utc = function (value) {
        if (arguments.length !== 0) {
            this.date = new Date(Number(value) * (tempus.options('useMilliseconds') ? 1 : 1000));
            return this;
        }
        if (tempus.options('useMilliseconds')) {
            return this.date.getTime();
        }
        return Math.floor(this.date.getTime() / 1000);
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
            return translations[lang].dayLongNames[this.date.getDay()];
        case 'short':
            return translations[lang].dayShortNames[this.date.getDay()];
        default:
            return this.date.getDay();
        }
    };

    /**
     * Get timezone offset.
     *
     *     @example
     *     // returns your timezone offset in seconds
     *     tempus().timezone();
     *
     *     // returns your timezone offset in hours
     *     tempus().timezone('hours');
     *
     * @param {string} type If type is 'hours', returns offset in hours, 'minutes' for minutes and default in seconds.
     * @returns {number} Timezone offset value
     */
    TempusDate.fn.timezone = function (type) {
        switch (type) {
        case 'hours':
            return Math.floor(this.date.getTimezoneOffset() / 60);
        case 'minutes':
            return this.date.getTimezoneOffset();
        default:
            return this.date.getTimezoneOffset() * 60;
        }
    };


    /**
     * Get info about date.
     *
     *     @example
     *     // returns Date object
     *     tempus().get('Date');
     *
     *     // returns object with more info
     *     tempus().get();
     *
     * @param {string} type Can be 'Date' for returns Date object, 'DateUTC' for returns Date in UTC or default
     *     for returns default object.
     * @returns {Date|Object} Date or default object.
     */
    TempusDate.fn.get = function (type) {
        switch (type) {
        case 'Date':
            return new Date(this.year(), this.month(), this.day(), this.hours(), this.minutes(),
                this.seconds(), this.milliseconds());
        case 'DateUTC':
            return new Date(Date.UTC(this.year(), this.month(), this.day(), this.hours(), this.minutes(),
                this.seconds(), this.milliseconds()));
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
                utc: this.utc(),
                dayOfWeek: this.dayOfWeek(),
                dayOfWeekShort: this.dayOfWeek('short'),
                dayOfWeekLong: this.dayOfWeek('long'),
                timestamp: this.timestamp()
            };
        }
    };

    /**
     * Returns formatted string of date. You can use object or timestamp as parameter of method.
     *
     *     @example
     *     // returns '05.11.2013'
     *     tempus({year: 2013, month: 11, day:5}).format('%d.%m.%Y');
     *
     *     // returns '2013-11-18 12:36:42'
     *     tempus([2013, 11, 18, 12, 36, 42]).format('%Y-%m-%d %H:%M:%S')
     *
     *     // returns '20131105'
     *     tempus([2013, 11, 5]).format('%Y%m%d');
     *
     * @param format {string} Format of date. See index page for defaults.
     * @returns {string} Formatted string
     */
    TempusDate.fn.format = function (format) {
        var i = 0,
            result = '',
            directive;
        while (i < format.length) {
            if (format.charAt(i) === '%') {
                directive = format.charAt(i) + format.charAt(i + 1);
                if (registeredFormats[directive] !== undefined) {
                    result += registeredFormats[directive].format(this);
                    i += 1;
                } else {
                    result += '%';
                }
            } else {
                result += format.charAt(i);
            }
            i += 1;
        }
        return result;
    };

    /**
     * Validates date.
     *
     *     @example
     *     // returns false
     *     tempus({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}).validate();
     *
     *     // returns false
     *     tempus({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}).validate();
     *
     *     // returns true
     *     tempus({day:1,month:1,year:2013,hours:0,minutes:0,seconds:0}).validate();
     *
     *     // returns true
     *     tempus('2013-03-12', '%Y-%m-%d').validate();
     *
     *     // returns true
     *     tempus('16:00 08.08.2013', '%H:%M %d.%m.%Y').validate();
     *
     *     // returns false
     *     tempus('32.08.2013', '%d.%m.%Y').validate();
     *
     *     // returns false
     *     tempus('29.02.2013', '%d.%m.%Y').validate();
     *
     *     // returns true
     *     tempus('29.02.2012', '%d.%m.%Y').validate();
     *
     *     // returns false
     *     tempus('24:61 29.02.2012', '%H:%M %d.%m.%Y').validate();
     *
     *     // returns true
     *     tempus('00:00 01.01.2012', '%H:%M %d.%m.%Y').validate();
     *
     *     // returns false
     *     tempus('29.02.2012 24:00').validate();
     *
     *     // returns true
     *     tempus('29.02.2012 23:00').validate();
     *
     *     // returns false
     *     tempus('29.02.2013 23:00').validate();
     *
     * @returns {boolean} If true, date is valid, else invalid.
     */
    TempusDate.fn.validate = function () {
        return (this.incorrect.year === false && this.incorrect.month === false && this.incorrect.day === false &&
            this.incorrect.hours === false && this.incorrect.minutes === false && this.incorrect.seconds === false &&
            this.incorrect.milliseconds === false);
    };

    /**
     * Get errors in date.
     *
     *     @example
     *     // returns {"year":-5,"month":false,"day":false,"hours":false,"minutes":false,"seconds":false,"milliseconds":false}
     *     tempus().year(-5).errors();
     *
     * @returns {Object} Object with date errors
     */
    TempusDate.fn.errors = function () {
        return this.incorrect;
    };

    /**
     * Returns integer of date between from [this date] to [dateTo] as [type].
     *
     *     @example
     *     // returns 4
     *     tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2013, month: 11, day: 5}), 'day');
     *
     *     // returns 6
     *     tempus([2013, 11, 1]).between(tempus([2014, 5, 5]), 'month');
     *
     *     // returns 266400
     *     tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2014, month: 5, day: 5}), 'minutes');
     *
     *     // returns 10224
     *     tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2015, month: 1, day: 1}), 'hours');
     *
     *     // Happy New Year!
     *     // Days ago to New Year.
     *     tempus().between(tempus([2014,1,1]), 'day');
     *
     * @param {TempusDate} dateTo Date to.
     * @param {string} type Type of time.
     * @returns {number|undefined} If errors, returns undefined.
     */
    TempusDate.fn.between = function (dateTo, type) {
        var from = this.timestamp(),
            to = dateTo.timestamp();
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

    /**
     * Calculate date.
     *
     *     @example
     *     // returns '01.05.2013'
     *     tempus({year: 2013, month: 6, day: 1}).calc({month: -1}).format('%d.%m.%Y')
     *
     *     // returns TempusDate with date 2012-01-01
     *     tempus([2011, 5, 2]).calc({year: 1, month: -4, day: -1});
     *
     * @param {Object} delta Object {year: number, month: number, day: number, hours: number, minutes: number,
     *     seconds: number, milliseconds: number} or part of it.
     * @returns {TempusDate} New date.
     */
    TempusDate.fn.calc = function (delta) {
        if (delta.year !== undefined) {
            this.date.setFullYear(this.date.getFullYear() + delta.year);
        }
        if (delta.month !== undefined) {
            this.date.setMonth(this.date.getMonth() + delta.month);
        }
        if (delta.day !== undefined) {
            this.date.setDate(this.date.getDate() + delta.day);
        }
        if (delta.hours !== undefined) {
            this.date.setHours(this.date.getHours() + delta.hours);
        }
        if (delta.minutes !== undefined) {
            this.date.setMinutes(this.date.getMinutes() + delta.minutes);
        }
        if (delta.seconds !== undefined) {
            this.date.setSeconds(this.date.getSeconds() + delta.seconds);
        }
        if (delta.milliseconds !== undefined) {
            this.date.setMilliseconds(this.date.getMilliseconds() + delta.milliseconds);
        }
        return this;
    };


    // *************************************************
    // *                                               *
    // *                    FACTORY                    *
    // *                                               *
    // *************************************************

    /**
     * Create method for TempusDate. You can set initial value, for more info, see {@link TempusDate#set}.
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
     * @param {undefined|Date|Object|Array|number|string} options Some date. See {@link TempusDate#set}
     * @param {undefined|string} format See {@link TempusDate#set}
     * @param {undefined|TempusDate} defaults See {@link TempusDate#set}
     * @returns {TempusDate} Instance of TempusDate.
     */
    tempus = function (options, format, defaults) {
        return new TempusDate(options, format, defaults);
    };

    /**
     * Returns constants object. Some constants depends from options (MIN_MONTH, MAX_MONTH).
     * For MAX_DAY_IN_MONTH better use {@link TempusDate#dayCount}.
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
            MIN_MONTH: tempus.options('monthFromZero') ? 0 : 1,
            MAX_MONTH: tempus.options('monthFromZero') ? 11 : 12,
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
        };
    };

    /**
     * Get a current version of Tempus.
     *
     *     @example
     *     // returns current version
     *     tempus.version();
     *
     * @static
     * @returns {string} Current version of Tempus.
     */
    tempus.version = function () {
        return version;
    };

    /**
     * Get or set current options. If option is undefined, returns all options.
     *
     *     @example
     *     // returns all current options
     *     // for example, {useMilliseconds: false, monthFromZero: false}
     *     tempus.options();
     *
     *     // returns 'useMilliseconds' value
     *     tempus.options('useMilliseconds');
     *
     *     // Timeouts and timestamps in milliseconds
     *     tempus.options('useMilliseconds', true);
     *
     *     // Month starts from 0.
     *     tempus.options('monthFromZero', true);
     *
     * @static
     * @param {string} option Name of option.
     * @param {*} value New value of option.
     * @returns {Object} Current options object.
     */
    tempus.options = function (option, value) {
        if (option === undefined) {
            return options;
        }
        if (options.hasOwnProperty(option)) {
            if (value === undefined) {
                return options[option];
            }
            options[option] = value;
        }
        return undefined;
    };

    /**
     * Releases tempus variables from global scope.
     *
     *     @example
     *     // returns object
     *     var T = tempus.noConflict();
     *     // returns options
     *     T.tempus.options();
     *     // returns TempusDate instance
     *     T.tempus();
     *
     * @static
     * @returns {Object} Object with keys as default names and values as default functions.
     */
    tempus.noConflict = function () {
        window.tempus = oldTempus;
        window.TempusDate = oldTempusDate;
        return {tempus: tempus, TempusDate: TempusDate};
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
    tempus.generate = function (options) {
        var tsFrom = options.dateFrom,
            tsTo = options.dateTo,
            period,
            result,
            prevValue,
            addTo;
        // timestamp "from"
        if (typeof options.dateFrom !== 'number') {
            if (options.dateFrom instanceof TempusDate) {
                tsFrom = tsFrom.utc();
            } else {
                tsFrom = tempus(tsFrom, options.formatFrom).utc();
            }
        }
        // timestamp "to"
        if (typeof options.dateTo !== 'number') {
            if (options.dateTo instanceof TempusDate) {
                tsTo = tsTo.utc();
            } else {
                tsTo = tempus(tsTo, (options.formatTo !== undefined ? options.formatTo : options.formatFrom)).utc();
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
            };
        } else if (typeof options.period === 'string') {
            period = {
                year: options.period === 'year' ? 1 : 0,
                month: options.period === 'month' ? 1 : 0,
                day: options.period === 'day' ? 1 : 0,
                hours: options.period === 'hours' ? 1 : 0,
                minutes: options.period === 'minutes' ? 1 : 0,
                seconds: options.period === 'seconds' ? 1 : 0
            };
        } else if (typeof options.period === 'object') {
            period = {
                year: options.period.year !== undefined ? options.period.year : 0,
                month: options.period.month !== undefined ? options.period.month : 0,
                day: options.period.day !== undefined ? options.period.day : 0,
                hours: options.period.hours !== undefined ? options.period.hours : 0,
                minutes: options.period.minutes !== undefined ? options.period.minutes : 0,
                seconds: options.period.seconds !== undefined ? options.period.seconds : 0
            };
        }
        // result
        if (options.groupBy === undefined) {
            result = options.asObject === true ? {} : [];
        } else {
            result = [];
            result.push([]);
            prevValue = tempus(tsFrom).get()[options.groupBy];
        }
        addTo = function (array, value) {
            if (options.asObject === true) {
                if (options.format !== undefined) {
                    array[tempus(value).format(options.format)] = {};
                } else {
                    array[tempus(value).format('%F %H:%M:%S')] = {};
                }
            } else {
                if (options.format !== undefined) {
                    array.push(tempus(value).format(options.format));
                } else {
                    array.push(tempus(value));
                }
            }
            return array;
        };

        for (tsFrom; tsFrom <= tsTo; tsFrom = tempus(tsFrom).calc(period).utc()) {
            if (options.groupBy === undefined) {
                addTo(result, tsFrom);
            } else {
                if (tempus(tsFrom).get()[options.groupBy] === prevValue) {
                    addTo(result[result.length - 1], tsFrom);
                } else {
                    result.push([]);
                    addTo(result[result.length - 1], tsFrom);
                    prevValue = tempus(tsFrom).get()[options.groupBy];
                }
            }
        }
        return result;
    };

    /**
     * Returns array of month names. If type is undefined, short names was returned.
     *
     *     @example
     *     // returns ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
     *     tempus.monthNames();
     *
     *     // returns ["January","February","March","April","May","June",
     *     //     "July","August","September","October","November","December"];
     *     tempus.monthNames(true);
     *
     *     // returns ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
     *     tempus.setLang('ru');
     *     tempus.monthNames();
     *
     * @static
     * @param {boolean} type If true, long names was returning, else - short names.
     * @returns {Array} Array of month names.
     */
    tempus.monthNames = function (type) {
        switch (type) {
        case 'long':
            return translations[lang].monthLongNames;
        default:
            return translations[lang].monthShortNames;
        }
    };

    /**
     * Returns array of day names. If type is undefined, short names was returned.
     *
     *     @example
     *     // returns ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
     *     tempus.dayNames();
     *
     *     // returns ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
     *     tempus.dayNames(true);
     *
     *     // returns ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
     *     tempus.setLang('ru');
     *     tempus.dayNames();
     *
     * @static
     * @param {boolean} type If true, long names was returning, else - short names.
     * @returns {Array} Array of day names.
     */
    tempus.dayNames = function (type) {
        switch (type) {
        case 'long':
            return translations[lang].dayLongNames;
        default:
            return translations[lang].dayShortNames;
        }
    };

    /**
     * Globally set or get language. By default **auto detect current user language**. If you want only english
     * language, always set tempus.lang('en'); before using tempus.
     *
     *     @example
     *     // returns "Ноябрь, 14"
     *     tempus.lang('ru');
     *     tempus({year: 2013, month: 11, day: 14}).format('%B, %d');
     *
     *     // returns "November, 14"
     *     tempus.lang('en');
     *     tempus({year: 2013, month: 11, day: 14}).format('%B, %d');
     *
     * @param {string} value Language's code.
     * @static
     * @returns {undefined|string} Language's code or undefined for setter.
     */
    tempus.lang = function (value) {
        if (value !== undefined) {
            lang = value;
        } else {
            return lang;
        }
        return undefined;
    };

    /**
     * Get available languages.
     *
     *     @example
     *     // returns ["en", "ru"]
     *     tempus.availableLocales();
     *
     * @static
     * @returns {Array} Array of available languages.
     */
    tempus.availableLangs = function () {
        return Object.keys(translations);
    };

    /**
     * Registering a new format.
     *
     *     @example
     *     // no returns
     *     tempus.registerFormat('%q',
     *         function(date) {
     *             return date.month();
     *         },
     *         function(value) {
     *             var v = Number(value);
     *             return {month: (isNaN(v) ? undefined : v) };
     *         },
     *         1,
     *         2,
     *         'number'
     *     );
     *
     *     // test it
     *     // returns "01.1.2013";
     *     tempus({year: 2013, month: 1, day: 1}).format('%d.%q.%Y');
     *
     *     // returns {"year":2013,"month":2,"day":10,"hours":0,"minutes":0,"seconds":0};
     *     tempus('10.2.2013', '%d.%q.%Y').get();
     *
     * @param {string} value Directive
     * @param {Function} formatFunc Format function.
     * @param {Function} parseFunc Parse function.
     * @param {number} minLength Min length of value.
     * @param {number} maxLength Max length of value.
     * @param {string} type Type of value, can be 'number', 'word' (only letters) or 'string' (any symbols)
     * @static
     */
    tempus.registerFormat = function (value, formatFunc, parseFunc, minLength, maxLength, type) {
        registeredFormats[value] = {
            format: formatFunc,
            parse: parseFunc,
            minLength: minLength,
            maxLength: maxLength,
            type: type
        };
    };

    /**
     * Unregistering a format.
     *
     *     @example
     *     // unregistering a format
     *     tempus.unregisterFormat('%d');
     *
     *     // test it
     *     // returns "%d.01.2013"
     *     tempus.format({year: 2013, month: 1, day: 1}, '%d.%m.%Y');
     *
     * @param {string} value Directive
     * @static
     */
    tempus.unregisterFormat = function (value) {
        delete registeredFormats[value];
    };

    /**
     * Detecting format of date  as string.
     *
     *     @example
     *     // returns "%d.%m.%Y"
     *     tempus.detectFormat('10.12.2013');
     *
     *     // returns "%Y-%m-%d %H:%M"
     *     tempus.detectFormat('2013-01-01 12:00');
     *
     *     // returns "%d.%m.%Y"
     *     tempus.detectFormat('01/02/2013');
     *
     * @static
     * @param {string} str Formatted date as string
     * @return {string} Format of date.
     */
    tempus.detectFormat = function (str) {
        var format, tmpChars, len;
        format = detectDateFormat(str, 0);
        if (format !== '') {
            len = 10;
        }
        tmpChars = str.charAt(len);
        if (tmpChars === 'T' || tmpChars === ' ') {
            format += tmpChars;
            len += 1;
        }
        format += detectTimeFormat(str, len);
        return format;
    };

    // *************************************************
    // *                                               *
    // *                  EXPORTS                      *
    // *                                               *
    // *************************************************

    window.TempusDate = TempusDate;
    window.tempus = tempus;
})(window);