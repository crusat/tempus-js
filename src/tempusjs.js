/**
 * @doc module
 * @name tempus
 * @author Aleksey Kuznetsov, me@akuzn.com
 * @version 0.2.18
 * @url https://github.com/crusat/tempus-js
 * @description
 * Library with date/time methods.
 */
(function (undefined) {
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

    var root = this,
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
        oldTempus = root.tempus,
        tempus,
        classes,
        nav = root.navigator || {},
        lang = 'en',
        translations = {
            "en": {
                "JANUARY_SHORT": "Jan",
                "FEBRUARY_SHORT": "Feb",
                "MARCH_SHORT": "Mar",
                "APRIL_SHORT": "Apr",
                "MAY_SHORT": "May",
                "JUNE_SHORT": "Jun",
                "JULY_SHORT": "Jul",
                "AUGUST_SHORT": "Aug",
                "SEPTEMBER_SHORT": "Sep",
                "OCTOBER_SHORT": "Oct",
                "NOVEMBER_SHORT": "Nov",
                "DECEMBER_SHORT": "Dec",
                "JANUARY_LONG": "January",
                "FEBRUARY_LONG": "February",
                "MARCH_LONG": "March",
                "APRIL_LONG": "April",
                "MAY_LONG": "May",
                "JUNE_LONG": "June",
                "JULY_LONG": "July",
                "AUGUST_LONG": "August",
                "SEPTEMBER_LONG": "September",
                "OCTOBER_LONG": "October",
                "NOVEMBER_LONG": "November",
                "DECEMBER_LONG": "December",
                "SUNDAY_SHORT": "Sun",
                "MONDAY_SHORT": "Mon",
                "TUESDAY_SHORT": "Tue",
                "WEDNESDAY_SHORT": "Wed",
                "THURSDAY_SHORT": "Thu",
                "FRIDAY_SHORT": "Fri",
                "SATURDAY_SHORT": "Sat",
                "SUNDAY_LONG": "Sunday",
                "MONDAY_LONG": "Monday",
                "TUESDAY_LONG": "Tuesday",
                "WEDNESDAY_LONG": "Wednesday",
                "THURSDAY_LONG": "Thursday",
                "FRIDAY_LONG": "Friday",
                "SATURDAY_LONG": "Saturday"
            },
            "ru": {
                "JANUARY_SHORT": "Янв",
                "FEBRUARY_SHORT": "Фев",
                "MARCH_SHORT": "Мар",
                "APRIL_SHORT": "Апр",
                "MAY_SHORT": "Май",
                "JUNE_SHORT": "Июн",
                "JULY_SHORT": "Июл",
                "AUGUST_SHORT": "Авг",
                "SEPTEMBER_SHORT": "Сен",
                "OCTOBER_SHORT": "Окт",
                "NOVEMBER_SHORT": "Ноя",
                "DECEMBER_SHORT": "Дек",
                "JANUARY_LONG": "Январь",
                "FEBRUARY_LONG": "Февраль",
                "MARCH_LONG": "Март",
                "APRIL_LONG": "Апрель",
                "MAY_LONG": "Май",
                "JUNE_LONG": "Июнь",
                "JULY_LONG": "Июль",
                "AUGUST_LONG": "Август",
                "SEPTEMBER_LONG": "Сентябрь",
                "OCTOBER_LONG": "Октябрь",
                "NOVEMBER_LONG": "Ноябрь",
                "DECEMBER_LONG": "Декабрь",
                "SUNDAY_SHORT": "Вс",
                "MONDAY_SHORT": "Пн",
                "TUESDAY_SHORT": "Вт",
                "WEDNESDAY_SHORT": "Ср",
                "THURSDAY_SHORT": "Чт",
                "FRIDAY_SHORT": "Пт",
                "SATURDAY_SHORT": "Сб",
                "SUNDAY_LONG": "Воскресенье",
                "MONDAY_LONG": "Понедельник",
                "TUESDAY_LONG": "Вторник",
                "WEDNESDAY_LONG": "Среда",
                "THURSDAY_LONG": "Четверг",
                "FRIDAY_LONG": "Пятница",
                "SATURDAY_LONG": "Суббота"
            },
            "ua": {
                "JANUARY_SHORT": "Січ",
                "FEBRUARY_SHORT": "Лют",
                "MARCH_SHORT": "Берез",
                "APRIL_SHORT": "Квіт",
                "MAY_SHORT": "Трав",
                "JUNE_SHORT": "Черв",
                "JULY_SHORT": "Лип",
                "AUGUST_SHORT": "Серп",
                "SEPTEMBER_SHORT": "Верес",
                "OCTOBER_SHORT": "Жовт",
                "NOVEMBER_SHORT": "Листоп",
                "DECEMBER_SHORT": "Груд",
                "JANUARY_LONG": "Січень",
                "FEBRUARY_LONG": "Лютий",
                "MARCH_LONG": "Березень",
                "APRIL_LONG": "Квітень",
                "MAY_LONG": "Травень",
                "JUNE_LONG": "Червень",
                "JULY_LONG": "Липень",
                "AUGUST_LONG": "Серпень",
                "SEPTEMBER_LONG": "Вересень",
                "OCTOBER_LONG": "Жовтень",
                "NOVEMBER_LONG": "Листопад",
                "DECEMBER_LONG": "Грудень",
                "SUNDAY_SHORT": "Нд",
                "MONDAY_SHORT": "Пн",
                "TUESDAY_SHORT": "Вт",
                "WEDNESDAY_SHORT": "Ср",
                "THURSDAY_SHORT": "Чт",
                "FRIDAY_SHORT": "Пт",
                "SATURDAY_SHORT": "Сб",
                "SUNDAY_LONG": "Неділя",
                "MONDAY_LONG": "Понеділок",
                "TUESDAY_LONG": "Вівторок",
                "WEDNESDAY_LONG": "Середа",
                "THURSDAY_LONG": "Четвер",
                "FRIDAY_LONG": "П’ятниця",
                "SATURDAY_LONG": "Субота"
            },
            "de": {
                "JANUARY_SHORT": "Jan",
                "FEBRUARY_SHORT": "Feb",
                "MARCH_SHORT": "März",
                "APRIL_SHORT": "Apr",
                "MAY_SHORT": "Mai",
                "JUNE_SHORT": "Juni",
                "JULY_SHORT": "Juli",
                "AUGUST_SHORT": "Aug",
                "SEPTEMBER_SHORT": "Sept",
                "OCTOBER_SHORT": "Okt",
                "NOVEMBER_SHORT": "Nov",
                "DECEMBER_SHORT": "Dez",
                "JANUARY_LONG": "Januar",
                "FEBRUARY_LONG": "Februar",
                "MARCH_LONG": "März",
                "APRIL_LONG": "April",
                "MAY_LONG": "Mai",
                "JUNE_LONG": "Juni",
                "JULY_LONG": "Juli",
                "AUGUST_LONG": "August",
                "SEPTEMBER_LONG": "September",
                "OCTOBER_LONG": "Oktober",
                "NOVEMBER_LONG": "November",
                "DECEMBER_LONG": "Dezember",
                "SUNDAY_SHORT": "So",
                "MONDAY_SHORT": "Mo",
                "TUESDAY_SHORT": "Di",
                "WEDNESDAY_SHORT": "Mi",
                "THURSDAY_SHORT": "Do",
                "FRIDAY_SHORT": "Fr",
                "SATURDAY_SHORT": "Sa",
                "SUNDAY_LONG": "Sonntag",
                "MONDAY_LONG": "Montag",
                "TUESDAY_LONG": "Dienstag",
                "WEDNESDAY_LONG": "Mittwoch",
                "THURSDAY_LONG": "Donnerstag",
                "FRIDAY_LONG": "Freitag",
                "SATURDAY_LONG": "Samstag"
            }
        },
        getMonthLongNames = function () {
            return [
                translations[lang].JANUARY_LONG,
                translations[lang].FEBRUARY_LONG,
                translations[lang].MARCH_LONG,
                translations[lang].APRIL_LONG,
                translations[lang].MAY_LONG,
                translations[lang].JUNE_LONG,
                translations[lang].JULY_LONG,
                translations[lang].AUGUST_LONG,
                translations[lang].SEPTEMBER_LONG,
                translations[lang].OCTOBER_LONG,
                translations[lang].NOVEMBER_LONG,
                translations[lang].DECEMBER_LONG
            ];
        },
        getMonthShortNames = function() {
            return [
                translations[lang].JANUARY_SHORT,
                translations[lang].FEBRUARY_SHORT,
                translations[lang].MARCH_SHORT,
                translations[lang].APRIL_SHORT,
                translations[lang].MAY_SHORT,
                translations[lang].JUNE_SHORT,
                translations[lang].JULY_SHORT,
                translations[lang].AUGUST_SHORT,
                translations[lang].SEPTEMBER_SHORT,
                translations[lang].OCTOBER_SHORT,
                translations[lang].NOVEMBER_SHORT,
                translations[lang].DECEMBER_SHORT
            ];
        },
        getDayLongNames = function () {
            return [
                translations[lang].SUNDAY_LONG,
                translations[lang].MONDAY_LONG,
                translations[lang].TUESDAY_LONG,
                translations[lang].WEDNESDAY_LONG,
                translations[lang].THURSDAY_LONG,
                translations[lang].FRIDAY_LONG,
                translations[lang].SATURDAY_LONG
            ];
        },
        getDayShortNames = function () {
            return [
                translations[lang].SUNDAY_SHORT,
                translations[lang].MONDAY_SHORT,
                translations[lang].TUESDAY_SHORT,
                translations[lang].WEDNESDAY_SHORT,
                translations[lang].THURSDAY_SHORT,
                translations[lang].FRIDAY_SHORT,
                translations[lang].SATURDAY_SHORT
            ];
        },
        monthLongNames,
        monthShortNames,
        dayLongNames,
        dayShortNames,
        loadJSON = function (path, success, error) {
            var xhr;
            if (root.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (success) {
                            if (root.JSON === undefined) {
                                alert('Please, include json2 into your project if you want use old browsers!\nhttps://github.com/douglascrockford/JSON-js/blob/master/json2.js');
                            } else {
                                success(JSON.parse(xhr.responseText));
                            }
                        }
                    } else {
                        if (error) {
                            error(xhr);
                        }
                    }
                }
            };
            xhr.open("GET", path, false);
            xhr.send();
        },
        registeredFormats = {
            '%d': {
                format: function (date) {
                    return formattingWithNulls(date.day() || tempus.MIN_DAY, 2);
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
                    return formattingWithNulls(date.month() || tempus.MIN_MONTH, 2);
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
                    return formattingWithNulls(date.year() || tempus.MIN_YEAR, 4);
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
                    return date.dayOfWeek() || tempus.MIN_DAY_OF_WEEK;
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
                    var d = date.dayOfWeek();
                    return dayShortNames[d !== undefined ? d : tempus.MIN_DAY_OF_WEEK];
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
                    var d = date.dayOfWeek();
                    return dayLongNames[d !== undefined ? d : tempus.MIN_DAY_OF_WEEK];
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
                    var m = tempus.options('monthFromZero') ? date.month() : date.month()-1;
                    return monthShortNames[m !== undefined ? m : tempus.MIN_MONTH];
                },
                parse: function (value) {
                    var month = tempus.monthNames().indexOf(value) + (tempus.options('monthFromZero') ? 0 : 1);
                    return {month: month !== -1 ? month : undefined};
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%B': {
                format: function (date) {
                    var m = tempus.options('monthFromZero') ? date.month() : date.month()-1;
                    return monthLongNames[m !== undefined ? m : tempus.MIN_MONTH];
                },
                parse: function (value) {
                    var month = tempus.monthNames(true).indexOf(value) + (tempus.options('monthFromZero') ? 0 : 1);
                    return {month: month !== -1 ? month : undefined};
                },
                minLength: 1,
                maxLength: 999,
                type: "word"
            },
            '%H': {
                format: function (date) {
                    return formattingWithNulls(date.hours() || tempus.MIN_HOURS, 2);
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
                    return formattingWithNulls(date.minutes() || tempus.MIN_MINUTES, 2);
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
                    return formattingWithNulls(date.seconds() || tempus.MIN_SECONDS, 2);
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
                    return formattingWithNulls(date.year() || tempus.MIN_YEAR, 4) + '-' +
                        formattingWithNulls(date.month() || tempus.MIN_MONTH, 2) + '-' +
                        formattingWithNulls(date.day() || tempus.MIN_DAY, 2);
                },
                parse: function (value) {
                    var year = Number(value.slice(0, 4)),
                        month = Number(value.slice(5, 7)),
                        day = Number(value.slice(8, 10));
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
                    return formattingWithNulls(date.month() || tempus.MIN_MONTH, 2) +
                        '/' + formattingWithNulls(date.day() || tempus.MIN_DAY, 2) +
                        '/' + formattingWithNulls(date.year() || tempus.MIN_YEAR, 4);
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
     * @return {TempusDate}
     * @constructor
     */
    TempusDate = function (options, format, defaults) {
        // always valid date
        this._d = new Date(); // date
        // if some errors, write here values.
        // incorrect
        this._i = {
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
            dc = tempus.MAX_DAY_IN_MONTHS[m - (tempus.options('monthFromZero') ? 0 : 1)];
        if (this.leapYear() && (m === (tempus.options('monthFromZero') ? 1 : 2))) {
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
                if (Number(value) >= tempus.MIN_YEAR && Number(value) <= tempus.MAX_YEAR) {
                    this._d.setFullYear(Number(value));
                    this._i.year = false;
                } else {
                    this._i.year = Number(value);
                }
            } else {
                this._d.setFullYear(tempus.MIN_YEAR);
                this._i.year = false;
            }
        } else {
            return this._i.year === false ? this._d.getFullYear() : this._i.year;
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
                if (Number(value) >= tempus.MIN_MONTH && Number(value) <= tempus.MAX_MONTH) {
                    this._d.setMonth(tempus.options('monthFromZero') ? Number(value) : Number(value) - 1);
                    this._i.month = false;
                } else {
                    this._i.month = Number(value);
                }
            } else {
                this._d.setMonth(tempus.options('monthFromZero') ? tempus.MIN_MONTH : tempus.MIN_MONTH - 1);
                this._i.month = false;
            }
        } else {
            if (this._i.month === false) {
                return tempus.options('monthFromZero') ? this._d.getMonth() : (this._d.getMonth()+1);
            }
            return this._i.month;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:day
     * @param {number} value Set new day. If no arguments, returns numeric value.
     * @return {TempusDate|number} Returns: if setter - TempusDate, else numeric value.
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
                if (Number(value) >= tempus.MIN_DAY && Number(value) <= this.dayCount()) {
                    this._d.setDate(Number(value));
                    this._i.day = false;
                } else {
                    this._i.day = Number(value);
                }
            } else {
                this._d.setDate(tempus.MIN_DAY);
                this._i.day = false;
            }
        } else {
            return this._i.day === false ? this._d.getDate() : this._i.day;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:hours
     * @param {number} value Set new hours. If no arguments, returns numeric value.
     * @return {TempusDate|number} Returns: if setter - TempusDate, else numeric value.
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
                if (Number(value) >= tempus.MIN_HOURS && Number(value) <= tempus.MAX_HOURS) {
                    this._d.setHours(Number(value));
                    this._i.hours = false;
                } else {
                    this._i.hours = Number(value);
                }
            } else {
                this._d.setHours(tempus.MIN_HOURS);
                this._i.hours = false;
            }
        } else {
            return this._i.hours === false ? this._d.getHours() : this._i.hours;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:minutes
     * @param {number} value Set new minutes. If no arguments, returns numeric value.
     * @return {TempusDate|number} Returns: if setter - TempusDate, else numeric value.
     * @description
     * Get or set minutes.
     *
     * ```js
     * // returns current minutes
     * tempus().minutes();
     *
     * // returns 100
     * tempus().minutes(100).minutes();
     *
     * // returns 12
     * tempus().minutes(12).minutes();
     *
     * // returns 1
     * tempus().minutes(1).minutes();
     *
     * // returns -5
     * tempus().minutes(-5).minutes();
     *
     * // returns 0
     * tempus().minutes('0').minutes();
     *
     * // returns 0 (MIN_MINUTES)
     * tempus().minutes(undefined).minutes();
     *
     * // returns 0 (MIN_MINUTES)
     * tempus().minutes({foo: 'bar'}).minutes();
     *
     * // returns 0 (MIN_MINUTES)
     * tempus().minutes([1,2,3]).minutes();
     *
     * // returns 0 (MIN_MINUTES)
     * tempus().minutes(null).minutes();
     *
     * // returns 0 (MIN_MINUTES)
     * tempus().minutes(true).minutes();
     *
     * // returns 0 (MIN_MINUTES)
     * tempus().minutes(false).minutes();
     *
     * // returns 0 (MIN_MINUTES)
     * tempus().minutes(NaN).minutes();
     * ```
     */
    TempusDate.fn.minutes = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.MIN_MINUTES && Number(value) <= tempus.MAX_MINUTES) {
                    this._d.setMinutes(Number(value));
                    this._i.minutes = false;
                } else {
                    this._i.minutes = Number(value);
                }
            } else {
                this._d.setMinutes(tempus.MIN_MINUTES);
                this._i.minutes = false;
            }
        } else {
            return this._i.minutes === false ? this._d.getMinutes() : this._i.minutes;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:seconds
     * @param {number} value Set new seconds. If no arguments, returns numeric value.
     * @return {TempusDate|number} Returns: if setter - TempusDate, else numeric value.
     * @description
     * Get or set seconds.
     *
     * ```js
     * // returns current seconds
     * tempus().seconds();
     *
     * // returns 100
     * tempus().seconds(100).seconds();
     *
     * // returns 12
     * tempus().seconds(12).seconds();
     *
     * // returns 1
     * tempus().seconds(1).seconds();
     *
     * // returns -5
     * tempus().seconds(-5).seconds();
     *
     * // returns 0
     * tempus().seconds('0').seconds();
     *
     * // returns 0 (MIN_SECONDS)
     * tempus().seconds(undefined).seconds();
     *
     * // returns 0 (MIN_SECONDS)
     * tempus().seconds({foo: 'bar'}).seconds();
     *
     * // returns 0 (MIN_SECONDS)
     * tempus().seconds([1,2,3]).seconds();
     *
     * // returns 0 (MIN_SECONDS)
     * tempus().seconds(null).seconds();
     *
     * // returns 0 (MIN_SECONDS)
     * tempus().seconds(true).seconds();
     *
     * // returns 0 (MIN_SECONDS)
     * tempus().seconds(false).seconds();
     *
     * // returns 0 (MIN_SECONDS)
     * tempus().seconds(NaN).seconds();
     * ```
     */
    TempusDate.fn.seconds = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.MIN_SECONDS && Number(value) <= tempus.MAX_SECONDS) {
                    this._d.setSeconds(Number(value));
                    this._i.seconds = false;
                } else {
                    this._i.seconds = Number(value);
                }
            } else {
                this._d.setSeconds(tempus.MIN_SECONDS);
                this._i.seconds = false;
            }
        } else {
            return this._i.seconds === false ? this._d.getSeconds() : this._i.seconds;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:milliseconds
     * @param {number} value Set new milliseconds. If no arguments, returns numeric value.
     * @return {TempusDate|number} Returns: if setter - TempusDate, else numeric value.
     * @description
     * Get or set milliseconds.
     *
     * ```js
     * // returns current milliseconds
     * tempus().milliseconds();
     *
     * // returns 1000
     * tempus().milliseconds(1000).milliseconds();
     *
     * // returns 120
     * tempus().milliseconds(12).milliseconds();
     *
     * // returns 1
     * tempus().milliseconds(1).milliseconds();
     *
     * // returns -5
     * tempus().milliseconds(-5).milliseconds();
     *
     * // returns 0
     * tempus().milliseconds('0').milliseconds();
     *
     * // returns 0 (MIN_MILLISECONDS)
     * tempus().milliseconds(undefined).milliseconds();
     *
     * // returns 0 (MIN_MILLISECONDS)
     * tempus().milliseconds({foo: 'bar'}).milliseconds();
     *
     * // returns 0 (MIN_MILLISECONDS)
     * tempus().milliseconds([1,2,3]).milliseconds();
     *
     * // returns 0 (MIN_MILLISECONDS)
     * tempus().milliseconds(null).milliseconds();
     *
     * // returns 0 (MIN_MILLISECONDS)
     * tempus().milliseconds(true).milliseconds();
     *
     * // returns 0 (MIN_MILLISECONDS)
     * tempus().milliseconds(false).milliseconds();
     *
     * // returns 0 (MIN_MILLISECONDS)
     * tempus().milliseconds(NaN).milliseconds();
     * ```
     */
    TempusDate.fn.milliseconds = function (value) {
        if (arguments.length !== 0) {
            if ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value))) {
                if (Number(value) >= tempus.MIN_MILLISECONDS && Number(value) <= tempus.MAX_MILLISECONDS) {
                    this._d.setMilliseconds(Number(value));
                    this._i.milliseconds = false;
                } else {
                    this._i.milliseconds = Number(value);
                }
            } else {
                this._d.setMilliseconds(tempus.MIN_MILLISECONDS);
                this._i.milliseconds = false;
            }
        } else {
            return this._i.milliseconds === false ? this._d.getMilliseconds() : this._i.milliseconds;
        }
        return this;
    };

    /**
     * @doc method
     * @name TempusDate.global:week
     * @return {number} Week number.
     * @description
     * Returns week number.
     *
     * ```js
     * // returns 18
     * tempus([2013, 5, 1]).week();
     * ```
     */
    TempusDate.fn.week = function () {
        var onejan = new Date(this.year(), 0, 1),
            beginDayDate = tempus(this.utc()).hours(0).minutes(0).seconds(0).milliseconds(0).utc()*1000;
        return Math.ceil((((beginDayDate - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    };

    /**
     * @doc method
     * @name TempusDate.global:set
     * @param {undefined|Date|Object|Array|number|string} newDate Some date.
     * @param {undefined|string} format String for getting date from string or undefined else.
     * @param {TempusDate} defaults This object was returning, if parsing failed.
     * @return {TempusDate} Date as TempusDate.
     * @description
     * Set new date. If **undefined**, set now date. If instance of **Date** - set it date.
     * If **object**, set date from {year: number, month: number, day: number, hours: number, minutes: number,
     * milliseconds: number}. If **Array**, set date from [YEAR, MONTH, DAY, HOURS, MINUTES, SECONDS, MILLISECONDS].
     * If **number**, set local time from timestamp. If **string**, set date from formatted date by format (or auto detect
     * format). Directives ALWAYS must be started from % and content only 1 char. For example %q, %d, %y, %0.
     *
     * ```js
     * // returns TempusDate with current date
     * tempus().set();
     *
     * // returns TempusDate with date "2013-11-18 20:14:23.918"
     * tempus().set({year: 2013, month: 11, day: 18, hours: 20, minutes: 14, seconds: 23, milliseconds: 918});
     *
     * // returns TempusDate with date "2013-11-18 20:15:38"
     * tempus().set(1384791338);
     *
     * // returns TempusDate with date "2013-01-01 12:00:03"
     * tempus().set([2013, 1, 1, 12, 0, 3]);
     *
     * // returns TempusDate with date "2013-01-01"
     * tempus().set(new Date(2012, 0, 1));
     *
     * // returns TempusDate with date "2013-11-18"
     * tempus().set('18.11.2013');
     *
     * // returns TempusDate with date "2013-12-12"
     * tempus().set('2013-12-12', '%Y-%m-%d'));
     *
     * // returns TempusDate with date "2013-01-01"
     * tempus().set('123', '%d.%m.%Y', tempus([2013, 1, 1]));
     * ```
     */
    TempusDate.fn.set = function (newDate, format, defaults) {
        this._i = {
            year: false,
            month: false,
            day: false,
            hours: false,
            minutes: false,
            seconds: false,
            milliseconds: false
        };
        if (newDate === undefined) {
            this._d = new Date();
            return this;
        }
        if (newDate instanceof Date) {
            this._d = newDate;
            return this;
        }
        if (typeof newDate === 'number') {
            this._d = new Date(newDate * (tempus.options('useMilliseconds') ? 1 : 1000));
            return this;
        }
        if (typeof newDate === 'object') {
            if (newDate instanceof Array) {
                this.day(tempus.MIN_DAY); // if curr day = 29 and curr month not february - month can be set as march, not feb.
                this.year(newDate[0]);
                this.month(newDate[1]);
                this.day(newDate[2]);
                this.hours(newDate[3]);
                this.minutes(newDate[4]);
                this.seconds(newDate[5]);
                this.milliseconds(newDate[6]);
            } else {
                this.day(tempus.MIN_DAY);
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
                    this._i = {
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
                            while ((k < registeredFormats[directive].maxLength) && (j + k < newDate.length) && /^[\u00BF-\u1FFF\u2C00-\uD7FF\w]+$/.test(newDate.charAt(j + k))) {
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
                                this._i = {
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
                            this._i = {
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
            this.day(tempus.MIN_DAY);
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
     * @doc method
     * @name TempusDate.global:leapYear
     * @return {boolean} If true year is leap else not leap.
     * @description
     * Is year leap?
     *
     * ```js
     * // returns false
     * tempus([2014]).leapYear();
     *
     * // returns true
     * tempus({year: 2012}).leapYear();
     *
     * // returns true
     * tempus(947698701).leapYear(); // 2012 year
     *
     * // returns false
     * tempus([1900]).leapYear();
     *
     * // returns false
     * tempus({year: 1941, day: 22, month: 6}).leapYear();
     *
     * // returns true
     * tempus({year: 2008, day: 1, month: 1}).leapYear();
     *
     * // check current year
     * tempus().leapYear();
     * ```
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
     * @doc method
     * @name TempusDate.global:timestamp
     * @param {number} value Value for set or no value for get.
     * @return {TempusDate|number} TempusDate or numeric timestamp.
     * @description
     * Get or set timestamp.
     *
     * ```js
     * // returns 1384718400
     * tempus([2013, 11, 18]).timestamp();
     *
     * // returns TempusDate with date '2013-11-18'
     * tempus().timestamp(1384718400);
     * ```
     */
    TempusDate.fn.timestamp = function (value) {
        if (arguments.length !== 0) {
            this._d = new Date(Number(value) * (tempus.options('useMilliseconds') ? 1 : 1000) + this._d.getTimezoneOffset() * 60000);
            return this;
        }
        if (tempus.options('useMilliseconds')) {
            return this._d.getTime() - this._d.getTimezoneOffset() * 60000;
        }
        return Math.floor(this._d.getTime() / 1000) - this._d.getTimezoneOffset() * 60;
    };

    /**
     * @doc method
     * @name TempusDate.global:utc
     * @param {number} value Value for set or no value for get.
     * @return {TempusDate|number} TempusDate or numeric timestamp.
     * @description
     * Get or set timestamp in UTC.
     *
     * ```js
     * // returns 1384732800
     * tempus([2013, 11, 18]).utc();
     *
     * // returns TempusDate with date '2013-11-18'
     * tempus().utc(1384732800);
     * ```
     */
    TempusDate.fn.utc = function (value) {
        if (arguments.length !== 0) {
            this._d = new Date(Number(value) * (tempus.options('useMilliseconds') ? 1 : 1000));
            return this;
        }
        if (tempus.options('useMilliseconds')) {
            return this._d.getTime();
        }
        return Math.floor(this._d.getTime() / 1000);
    };

    /**
     * @doc method
     * @name TempusDate.global:dayOfWeek
     * @param {string|undefined} type If none, number returned.
     *     If 'short', short string returned, 'long' for long.
     *     If type is number from 0 to 6 - set day of week from 0 (Sunday) to 6 (Saturday).
     *     You can also set day of week as string, See examples.
     * @return {TempusDate|number|undefined} Numeric/String value of day of week or TempusDate.
     * @description
     * Get or set day of week.
     *
     * ```js
     * // returns current day of week
     * tempus().dayOfWeek();
     *
     * // returns 1
     * tempus([2013, 11, 18]).dayOfWeek();
     *
     * // set less near monday
     * tempus().dayOfWeek(0);
     *
     * // or
     * tempus().dayOfWeek('Monday');
     *
     * // returns date with 2013-11-22 as TempusDate
     * tempus([2013, 11, 21]).dayOfWeek('Friday');
     *
     * // returns date with 2013-11-17 as TempusDate
     * tempus([2013, 11, 21]).dayOfWeek('Sunday')
     * ```
     */
    TempusDate.fn.dayOfWeek = function (type) {

        if (type === 'long') {
            return dayLongNames[this._d.getDay()];
        } else if (type === 'short') {
            return dayShortNames[this._d.getDay()];
        } else if (type === undefined) {
            return this._d.getDay();
        } else if (type === 0 || type === 'Sunday') {
            return this.calc({day: -this.dayOfWeek()});
        } else if (type === 1 || type === 'Monday') {
            return this.calc({day: (this.dayOfWeek() === 0 ? -6 : 1) - this.dayOfWeek()});
        } else if (type === 2 || type === 'Tuesday') {
            return this.calc({day: (this.dayOfWeek() === 0 ? -5 : 2) - this.dayOfWeek()});
        } else if (type === 3 || type === 'Wednesday') {
            return this.calc({day: (this.dayOfWeek() === 0 ? -4 : 3) - this.dayOfWeek()});
        } else if (type === 4 || type === 'Thursday') {
            return this.calc({day: (this.dayOfWeek() === 0 ? -3 : 4) - this.dayOfWeek()});
        } else if (type === 5 || type === 'Friday') {
            return this.calc({day: (this.dayOfWeek() === 0 ? -2 : 5) - this.dayOfWeek()});
        } else if (type === 6 || type === 'Saturday') {
            return this.calc({day: (this.dayOfWeek() === 0 ? -1 : 6) - this.dayOfWeek()});
        }
    };

    /**
     * @doc method
     * @name TempusDate.global:timezone
     * @param {string} type If type is 'hours', returns offset in hours, 'minutes' for minutes and default in seconds.
     * @return {number} Timezone offset value
     * @description
     * Get timezone offset.
     *
     * ```js
     * // returns your timezone offset in seconds
     * tempus().timezone();
     *
     * // returns your timezone offset in hours
     * tempus().timezone('hours');
     * ```
     */
    TempusDate.fn.timezone = function (type) {
        switch (type) {
        case 'hours':
            return Math.floor(this._d.getTimezoneOffset() / 60);
        case 'minutes':
            return this._d.getTimezoneOffset();
        default:
            return this._d.getTimezoneOffset() * 60;
        }
    };


    /**
     * @doc method
     * @name TempusDate.global:get
     * @param {string} type Can be 'Date' for returns Date object, 'DateUTC' for returns Date in UTC, 'Array' for
     *     returns Array or no arguments for returns default object.
     * @return {Date|Object} Date or default object.
     * @description
     * Get info about date.
     *
     * ```js
     * // returns Date object
     * tempus().get('Date');
     *
     * // returns object with more info
     * tempus().get();
     *
     * // returns Array: [2014,1,1,12,0,0,0]
     * tempus([2014,1,1,12,0,0]).get('Array');
     * ```
     */
    TempusDate.fn.get = function (type) {
        switch (type) {
        case 'Date':
            return new Date(this.year(), this.month() - (tempus.options('monthFromZero') ? 0 : 1), this.day(), this.hours(), this.minutes(),
                this.seconds(), this.milliseconds());
        case 'DateUTC':
            return new Date(Date.UTC(this.year(), this.month() - (tempus.options('monthFromZero') ? 0 : 1), this.day(), this.hours(), this.minutes(),
                this.seconds(), this.milliseconds()));
        case 'Array':
            return [
                this.year(),
                this.month(),
                this.day(),
                this.hours(),
                this.minutes(),
                this.seconds(),
                this.milliseconds()
            ];
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
     * @doc method
     * @name TempusDate.global:format
     * @param {string} format Format of date. See {@link TempusDate.global:format} for defaults.
     * @return {string} Formatted string
     * @description
     * Returns formatted string of date. You can use object or timestamp as parameter of method.
     *
     * ```js
     * // returns '05.11.2013'
     * tempus({year: 2013, month: 11, day:5}).format('%d.%m.%Y');
     *
     * // returns '2013-11-18 12:36:42'
     * tempus([2013, 11, 18, 12, 36, 42]).format('%Y-%m-%d %H:%M:%S')
     *
     * // returns '20131105'
     * tempus([2013, 11, 5]).format('%Y%m%d');
     * ```
     *
     * Default format
     * --------------
     *
     * <table>
     *   <tr>
     *     <th>Directive</th>
     *     <th>Meaning</th>
     *     <th>Example</th>
     *   </tr>
     *   <tr>
     *     <td>%d</td>
     *     <td>Day of the month as a zero-padded decimal number.</td>
     *     <td>01, 02, ..., 31</td>
     *   </tr>
     *   <tr>
     *     <td>%m</td>
     *     <td>Month as a zero-padded decimal number.</td>
     *     <td>01, 02, ..., 12</td>
     *   </tr>
     *   <tr>
     *     <td>%Y</td>
     *     <td>Year with century as a decimal number.</td>
     *     <td>1970, 1988, 2001, 2013</td>
     *   </tr>
     *   <tr>
     *     <td>%w</td>
     *     <td>Weekday as a decimal number, where 0 is Sunday and 6 is Saturday.</td>
     *     <td>0, 1, ..., 6</td>
     *   </tr>
     *   <tr>
     *     <td>%a</td>
     *     <td>Weekday abbreviated name.</td>
     *     <td>Sun, Mon, ..., Sat</td>
     *   </tr>
     *   <tr>
     *     <td>%A</td>
     *     <td>Weekday full name.</td>
     *     <td>Sunday, Monday, ..., Saturday</td>
     *   </tr>
     *   <tr>
     *     <td>%b</td>
     *     <td>Month abbreviated name.</td>
     *     <td>Jan, Feb, ..., Dec</td>
     *   </tr>
     *   <tr>
     *     <td>%B</td>
     *     <td>Month full name.</td>
     *     <td>January, February, ..., December</td>
     *   </tr>
     *   <tr>
     *     <td>%H</td>
     *     <td>Hour (24-hour clock) as a zero-padded decimal number.</td>
     *     <td>00, 01, ..., 23</td>
     *   </tr>
     *   <tr>
     *     <td>%M</td>
     *     <td>Minute as a zero-padded decimal number.</td>
     *     <td>00, 01, ..., 59</td>
     *   </tr>
     *   <tr>
     *     <td>%S</td>
     *     <td>Second as a zero-padded decimal number.</td>
     *     <td>00, 01, ..., 59</td>
     *   </tr>
     *   <tr>
     *     <td>%s</td>
     *     <td>Unix time (in seconds).</td>
     *     <td>0, ..., 1377157851, ..., 2147483647</td>
     *   </tr>
     *   <tr>
     *     <td>%F</td>
     *     <td>ISO_8601 format (%Y-%m-%d).</td>
     *     <td>1970-01-01, ..., 2013-08-22, ...</td>
     *   </tr>
     *   <tr>
     *     <td>%D</td>
     *     <td>UK and USA format (%m/%d/%Y).</td>
     *     <td>01/01/1970, ..., 08/22/2013, ...</td>
     *   </tr>
     * </table>
     *
     *
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
     * @doc method
     * @name TempusDate.global:valid
     * @return {boolean} If true, date is valid, else invalid.
     * @description
     * validates date.
     *
     * ```js
     * // returns false
     * tempus({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}).valid();
     *
     * // returns false
     * tempus({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}).valid();
     *
     * // returns true
     * tempus({day:1,month:1,year:2013,hours:0,minutes:0,seconds:0}).valid();
     *
     * // returns true
     * tempus('2013-03-12', '%Y-%m-%d').valid();
     *
     * // returns true
     * tempus('16:00 08.08.2013', '%H:%M %d.%m.%Y').valid();
     *
     * // returns false
     * tempus('32.08.2013', '%d.%m.%Y').valid();
     *
     * // returns false
     * tempus('29.02.2013', '%d.%m.%Y').valid();
     *
     * // returns true
     * tempus('29.02.2012', '%d.%m.%Y').valid();
     *
     * // returns false
     * tempus('24:61 29.02.2012', '%H:%M %d.%m.%Y').valid();
     *
     * // returns true
     * tempus('00:00 01.01.2012', '%H:%M %d.%m.%Y').valid();
     *
     * // returns false
     * tempus('29.02.2012 24:00').valid();
     *
     * // returns true
     * tempus('29.02.2012 23:00').valid();
     *
     * // returns false
     * tempus('29.02.2013 23:00').valid();
     * ```
     */
    TempusDate.fn.valid = function () {
        return (this._i.year === false && this._i.month === false && this._i.day === false &&
            this._i.hours === false && this._i.minutes === false && this._i.seconds === false &&
            this._i.milliseconds === false);
    };

    /**
     * @doc method
     * @name TempusDate.global:errors
     * @return {Object} Object with date errors
     * @description
     * Get errors in date.
     *
     * ```js
     * // returns {"year":-5,"month":false,"day":false,"hours":false,"minutes":false,"seconds":false,"milliseconds":false}
     * tempus().year(-5).errors();
     * ```
     */
    TempusDate.fn.errors = function () {
        return this._i;
    };

    /**
     * @doc method
     * @name TempusDate.global:between
     * @param {TempusDate} dateTo Date to.
     * @param {string} type Type of time.
     * @return {number|undefined} If errors, returns undefined.
     * @description
     * Returns integer of date between from [this date] to [dateTo] as [type].
     *
     * ```js
     * // returns 4
     * tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2013, month: 11, day: 5}), 'day');
     *
     * // returns 6
     * tempus([2013, 11, 1]).between(tempus([2014, 5, 5]), 'month');
     *
     * // returns 266400
     * tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2014, month: 5, day: 5}), 'minutes');
     *
     * // returns 10224
     * tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2015, month: 1, day: 1}), 'hours');
     *
     * // Happy New Year!
     * // Days ago to New Year.
     * tempus().between(tempus([2014,1,1]), 'day');
     * ```
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
     * @doc method
     * @name TempusDate.global:calc
     * @param {Object} delta Object {year: number, month: number, day: number, hours: number, minutes: number,
     *     seconds: number, milliseconds: number} or part of it.
     * @return {TempusDate} New date.
     * @description
     * Calculate date.
     *
     * ```js
     * // returns '01.05.2013'
     * tempus({year: 2013, month: 6, day: 1}).calc({month: -1}).format('%d.%m.%Y')
     *
     * // returns TempusDate with date 2012-01-01
     * tempus([2011, 5, 2]).calc({year: 1, month: -4, day: -1});
     * ```
     */
    TempusDate.fn.calc = function (delta) {
        if (delta.year !== undefined) {
            this._d.setFullYear(this._d.getFullYear() + delta.year);
        }
        if (delta.month !== undefined) {
            this._d.setMonth(this._d.getMonth() + delta.month);
        }
        if (delta.day !== undefined) {
            this._d.setDate(this._d.getDate() + delta.day);
        }
        if (delta.hours !== undefined) {
            this._d.setHours(this._d.getHours() + delta.hours);
        }
        if (delta.minutes !== undefined) {
            this._d.setMinutes(this._d.getMinutes() + delta.minutes);
        }
        if (delta.seconds !== undefined) {
            this._d.setSeconds(this._d.getSeconds() + delta.seconds);
        }
        if (delta.milliseconds !== undefined) {
            this._d.setMilliseconds(this._d.getMilliseconds() + delta.milliseconds);
        }
        return this;
    };


    // *************************************************
    // *                                               *
    // *                    FACTORY                    *
    // *                                               *
    // *************************************************

    /**
     * @doc function
     * @name tempus.global:tempus
     * @param {undefined|Date|Object|Array|number|string} options Some date. See {@link TempusDate.global:set}
     * @param {undefined|string} format See {@link TempusDate.global:set}
     * @param {undefined|TempusDate} defaults See {@link TempusDate.global:set}
     * @return {TempusDate} Instance of TempusDate.
     * @description
     * Create method for TempusDate. You can set initial value, for more info, see {@link TempusDate.global:set}.
     *
     * ```js
     * // returns TempusDate with current date.
     * tempus();
     *
     * // returns TempusDate with date 2013-01-15.
     * tempus({year: 2013, month: 1, day: 15});
     *
     * // returns TempusDate with date 2000-06-01 and time 12:01:15
     * tempus([2000, 6, 1, 12, 1, 15]);
     *
     * // returns TempusDate with date 2001-05-10 and time 05:30:00
     * tempus('2001-05-10 05:30:00');
     *
     * // returns TempusDate with date 2001-05-10 and time 05:30:00
     * tempus(989454600);
     * ```
     */
    tempus = function (options, format, defaults) {
        return new TempusDate(options, format, defaults);
    };

    // *************************************************
    // *                                               *
    // *                 CONSTANTS                     *
    // *                                               *
    // *************************************************

    /**
     * @doc property
     * @name tempus.constants:MIN_YEAR
     * @return {number} Value of constant.
     * @description
     * Min year constant.
     */
    tempus.MIN_YEAR = 1000;

    /**
     * @doc property
     * @name tempus.constants:MAX_YEAR
     * @return {number} Value of constant.
     * @description
     * Max year constant.
     */
    tempus.MAX_YEAR = 3000;

    /**
     * @doc property
     * @name tempus.constants:MIN_MONTH
     * @return {number} Value of constant.
     * @description
     * Min month constant.
     */
    tempus.MIN_MONTH = 1;

    /**
     * @doc property
     * @name tempus.constants:MAX_MONTH
     * @return {number} Value of constant.
     * @description
     * Max month constant.
     */
    tempus.MAX_MONTH = 12;

    /**
     * @doc property
     * @name tempus.constants:MIN_DAY
     * @return {number} Value of constant.
     * @description
     * Min day constant.
     */
    tempus.MIN_DAY = 1;

    /**
     * @doc property
     * @name tempus.constants:MAX_DAT
     * @return {Array} Values of constant.
     * @description
     * Max days in months array constant.
     */
    tempus.MAX_DAY_IN_MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /**
     * @doc property
     * @name tempus.constants:MIN_DAY_OF_WEEK
     * @return {number} Value of constant.
     * @description
     * Min day of week constant.
     */
    tempus.MIN_DAY_OF_WEEK = 0;

    /**
     * @doc property
     * @name tempus.constants:MAX_DAY_OF_WEEK
     * @return {number} Value of constant.
     * @description
     * Max day of week constant.
     */
    tempus.MAX_DAY_OF_WEEK = 6;

    /**
     * @doc property
     * @name tempus.constants:MIN_HOURS
     * @return {number} Value of constant.
     * @description
     * Min hours constant.
     */
    tempus.MIN_HOURS = 0;

    /**
     * @doc property
     * @name tempus.constants:MAX_HOURS
     * @return {number} Value of constant.
     * @description
     * Max hours constant.
     */
    tempus.MAX_HOURS = 23;

    /**
     * @doc property
     * @name tempus.constants:MIN_MINUTES
     * @return {number} Value of constant.
     * @description
     * Min minutes constant.
     */
    tempus.MIN_MINUTES = 0;

    /**
     * @doc property
     * @name tempus.constants:MAX_MINUTES
     * @return {number} Value of constant.
     * @description
     * Max minutes constant.
     */
    tempus.MAX_MINUTES = 59;

    /**
     * @doc property
     * @name tempus.constants:MIN_SECONDS
     * @return {number} Value of constant.
     * @description
     * Min seconds constant.
     */
    tempus.MIN_SECONDS = 0;

    /**
     * @doc property
     * @name tempus.constants:MAX_SECONDS
     * @return {number} Value of constant.
     * @description
     * Max seconds constant.
     */
    tempus.MAX_SECONDS = 59;

    /**
     * @doc property
     * @name tempus.constants:MIN_MILLISECONDS
     * @return {number} Value of constant.
     * @description
     * Min milliseconds constant.
     */
    tempus.MIN_MILLISECONDS = 0;

    /**
     * @doc property
     * @name tempus.constants:MAX_MILLISECONDS
     * @return {number} Value of constant.
     * @description
     * Max milliseconds constant.
     */
    tempus.MAX_MILLISECONDS = 999;

    /**
     * @doc property
     * @name tempus.constants:VERSION
     * @return {number} Current library version.
     * @description
     * Returns current library version.
     *
     * ```js
     * // returns current version
     * tempus.VERSION;
     * ```
     */
    tempus.VERSION = '0.2.18';

    // *************************************************
    // *                                               *
    // *                    STATIC                     *
    // *                                               *
    // *************************************************

    /**
     * @doc function
     * @name tempus.global:options
     * @param {string} option Name of option.
     * @param {*} value New value of option.
     * @return {Object} Current options object.
     * @description
     * Get or set current options. If option is undefined, returns all options.
     *
     * ```js
     * // returns all current options
     * // for example, {useMilliseconds: false, monthFromZero: false}
     * tempus.options();
     *
     * // returns 'useMilliseconds' value
     * tempus.options('useMilliseconds');
     *
     * // Timeouts and timestamps in milliseconds
     * tempus.options('useMilliseconds', true);
     *
     * // Month starts from 0.
     * tempus.options('monthFromZero', true);
     * ```
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
            if (option === 'monthFromZero') {
                tempus.MIN_MONTH = value ? 0 : 1;
                tempus.MAX_MONTH = value ? 11 : 12;
            }
        }
        return undefined;
    };

    /**
     * @doc function
     * @name tempus.global:noConflict
     * @return {Object} Returns tempus.
     * @description
     * Releases tempus variables from global scope.
     *
     * ```js
     * // returns object
     * var T = tempus.noConflict();
     * // returns options
     * T.options();
     * // returns current formatted date.
     * T().format('%d.%m.%Y');
     * ```
     */
    tempus.noConflict = function () {
        root.tempus = oldTempus;
        return tempus;
    };

    /**
     * @doc function
     * @name tempus.global:generate
     * @param {object|undefined} options Options object.
     * @param {TempusDate|undefined|object|Array|string|number} options.dateFrom TempusDate object or
     *     any other value ({@link TempusDate.global:set}).
     * @param {string|undefined} options.formatFrom Format. If undefined, tempus will be auto detect format.
     * @param {TempusDate|undefined|object|Array|string|number} options.dateTo TempusDate object or
     *     any other value ({@link TempusDate.global:set}).
     * @param {string|undefined} options.formatTo Format. If undefined, will use formatFrom.
     * @param {number|string|object} options.period Step size for dates, can be 'seconds', 'minutes', 'hours',
     *     'day', 'month', 'year', number value (seconds) or object alike {year: number, month: number, day: number,
     *     hours: number, minutes: number, seconds: number}.
     * @param {string|undefined} options.format Results format, see {@link TempusDate.global:format}. If undefined, returns TempusDate.
     * @param {boolean|undefined} options.asObject If true, dates will be keys for objects in result array.
     * @param {string|undefined} options.groupBy If not undefined, group array by some field in TempusDate. Can be
     *     'seconds', 'minutes', 'hours', 'day', 'week', 'month', 'year'.
     * @param {boolean|undefined} options.fillNulls If true, with grouping missing values filling null's.
     * @return {Array|Object} Array or object from dates.
     * @description
     * Generates dates from [dateFrom] to [dateTo] with period [period] and result format dates is [format] or any other.
     *
     * ```js
     * // returns ["01.01.2013", "02.01.2013", "03.01.2013", "04.01.2013", "05.01.2013",
     * //    "06.01.2013", "07.01.2013", "08.01.2013", "09.01.2013", "10.01.2013"];
     * tempus.generate({
     *     dateFrom: '01.01.2013',
     *     dateTo: '10.01.2013',
     *     period: 'day',
     *     format: '%d.%m.%Y'
     * });
     *
     * // returns ["29.03.2013", "30.03.2013", "31.03.2013", "01.04.2013", "02.04.2013"];
     * tempus.generate({
     *     dateFrom: '20130329',
     *     formatFrom: '%Y%m%d',
     *     dateTo: '20130402',
     *     period: {day: 1},
     *     format: '%d.%m.%Y'
     * });
     *
     * // returns ["29.03.2013", "30.03.2013", "31.03.2013", "01.04.2013", "02.04.2013"];
     * tempus.generate({
     *     dateFrom: '20130329',
     *     formatFrom: '%Y%m%d',
     *     dateTo: '20130402',
     *     period: {day: 1},
     *     format: '%d.%m.%Y'
     * });
     *
     * // returns ["2013-01-01 00:00","2013-01-02 12:00","2013-01-04 00:00","2013-01-05 12:00","2013-01-07 00:00",
     * //     "2013-01-08 12:00","2013-01-10 00:00","2013-01-11 12:00"];
     * tempus.generate({
     *     dateFrom: '01.01.2013',
     *     dateTo: '12.01.2013',
     *     period: {day: 1, hours: 12},
     *     format: '%Y-%m-%d %H:%M'
     * });
     *
     * // returns ["05.01.2013","06.01.2013","07.01.2013","08.01.2013","09.01.2013","10.01.2013","11.01.2013",
     * //     "12.01.2013","13.01.2013","14.01.2013","15.01.2013","16.01.2013","17.01.2013","18.01.2013",
     * //     "19.01.2013","20.01.2013","21.01.2013","22.01.2013","23.01.2013","24.01.2013","25.01.2013",
     * //     "26.01.2013","27.01.2013","28.01.2013","29.01.2013","30.01.2013","31.01.2013","01.02.2013"];
     * tempus.generate({
     *     dateFrom: {year: 2013, month: 1, day: 5},
     *     dateTo: {year: 2013, month: 2, day: 1},
     *     period: {day: 1},
     *     format: '%d.%m.%Y'
     * });
     *
     * // returns {"05.01.2013":{},"06.01.2013":{},"07.01.2013":{},"08.01.2013":{},"09.01.2013":{},
     * //     "10.01.2013":{},"11.01.2013":{},"12.01.2013":{},"13.01.2013":{},"14.01.2013":{},"15.01.2013":{}};
     * tempus.generate({
     *     dateFrom: {year: 2013, month: 1, day: 5},
     *     dateTo: {year: 2013, month: 1, day: 15},
     *     period: {day: 1},
     *     format: '%d.%m.%Y',
     *     asObject: true
     * });
     *
     * // returns [["01.01.2013","02.01.2013","03.01.2013","04.01.2013","05.01.2013","06.01.2013","07.01.2013","08.01.2013",
     * // "09.01.2013","10.01.2013","11.01.2013","12.01.2013","13.01.2013","14.01.2013","15.01.2013","16.01.2013","17.01.2013",
     * // "18.01.2013","19.01.2013","20.01.2013","21.01.2013","22.01.2013","23.01.2013","24.01.2013","25.01.2013","26.01.2013",
     * // "27.01.2013","28.01.2013","29.01.2013","30.01.2013","31.01.2013"],["01.02.2013","02.02.2013","03.02.2013","04.02.2013",
     * // "05.02.2013","06.02.2013","07.02.2013","08.02.2013","09.02.2013","10.02.2013","11.02.2013","12.02.2013","13.02.2013",
     * // "14.02.2013","15.02.2013","16.02.2013","17.02.2013","18.02.2013","19.02.2013","20.02.2013","21.02.2013","22.02.2013",
     * // "23.02.2013","24.02.2013","25.02.2013","26.02.2013","27.02.2013","28.02.2013"],["01.03.2013","02.03.2013","03.03.2013",
     * // "04.03.2013","05.03.2013","06.03.2013","07.03.2013","08.03.2013","09.03.2013","10.03.2013","11.03.2013","12.03.2013",
     * // "13.03.2013","14.03.2013","15.03.2013"]]
     * tempus.generate({
     *     dateFrom: {year: 2013, month: 1, day: 1},
     *     dateTo: {year: 2013, month: 3, day: 15},
     *     period: {day: 1},
     *     format: '%d.%m.%Y',
     *     groupBy: 'month'
     * });
     *
     * // returns [[null,null,"01.10.2013, Tue","02.10.2013, Wed","03.10.2013, Thu","04.10.2013, Fri","05.10.2013, Sat"],
     *     ["06.10.2013, Sun","07.10.2013, Mon","08.10.2013, Tue","09.10.2013, Wed","10.10.2013, Thu","11.10.2013, Fri",
     *     "12.10.2013, Sat"],["13.10.2013, Sun","14.10.2013, Mon","15.10.2013, Tue","16.10.2013, Wed","17.10.2013, Thu",
     *     "18.10.2013, Fri","19.10.2013, Sat"],["20.10.2013, Sun","21.10.2013, Mon","22.10.2013, Tue","23.10.2013, Wed",
     *     "24.10.2013, Thu","25.10.2013, Fri","26.10.2013, Sat"],["27.10.2013, Sun","28.10.2013, Mon","29.10.2013, Tue",
     *     "30.10.2013, Wed",null,null,null]]
     * tempus.generate({
     *     dateFrom: [2013,10,1],
     *     dateTo: tempus([2013,10]).day(tempus([2013,10]).dayCount()),
     *     period:{day:1},
     *     format: '%d.%m.%Y, %a',
     *     groupBy:'week',
     *     fillNulls: true
     * });
     * ```
     */
    tempus.generate = function (options) {
        var tsFrom,
            tsTo,
            tsMinimal,
            tsMaximal,
            period,
            result,
            prevValue,
            addTo;
        // timestamp "from"
        if (typeof options.dateFrom !== 'number') {
            if (options.dateFrom instanceof TempusDate) {
                tsFrom = options.dateFrom.utc();
            } else {
                tsFrom = tempus(options.dateFrom, options.formatFrom).utc();
            }
        }
        // timestamp "to"
        if (typeof options.dateTo !== 'number') {
            if (options.dateTo instanceof TempusDate) {
                tsTo = options.dateTo.utc();
            } else {
                tsTo = tempus(options.dateTo, (options.formatTo !== undefined ? options.formatTo : options.formatFrom)).utc();
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
        addTo = function (array, value, nulled) {
            if (options.asObject === true) {
                if (options.format !== undefined) {
                    array[tempus(value).format(options.format)] = {};
                } else {
                    array[tempus(value).format('%F %H:%M:%S')] = {};
                }
            } else {
                if (options.format !== undefined) {
                    array.push(nulled ? null : tempus(value).format(options.format));
                } else {
                    array.push(nulled ? null : tempus(value));
                }
            }
            return array;
        };

        if (options.groupBy !== undefined && options.fillNulls) {
            var inversePeriod = {
                year: period.year ? -period.year : undefined,
                month: period.month ? -period.month : undefined,
                day: period.day ? -period.day : undefined,
                hours: period.hours ? -period.hours : undefined,
                minutes: period.minutes ? -period.minutes : undefined,
                seconds: period.seconds ? -period.seconds : undefined,
                milliseconds: period.milliseconds ? -period.milliseconds : undefined
            };
            tsMinimal = tempus(tsFrom).calc(inversePeriod).utc();
            while (tempus(tsMinimal).get()[options.groupBy] === prevValue) {
                addTo(result[result.length - 1], tsMinimal, true);
                tsMinimal = tempus(tsMinimal).calc(inversePeriod).utc();
            }
            // only for groupBy "week" and first week january. Because week #53 !== week #1
            if (options.groupBy === 'week') {
                var tsFromDoW = tempus(tsFrom).dayOfWeek();
                tsMinimal = tempus(tsFrom).dayOfWeek(0).utc();
                while (result[0].length < tsFromDoW && tsMinimal < tsFrom) {
                    addTo(result[result.length - 1], tsMinimal, true);
                    tsMinimal = tempus(tsMinimal).calc(period).utc();
                }
            }
        }

        while (tsFrom <= tsTo) {
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
            tsFrom = tempus(tsFrom).calc(period).utc()
        }

        if (options.groupBy !== undefined && options.fillNulls) {
            tsMaximal = tempus(tsTo).calc(period).utc();
            while (tempus(tsMaximal).get()[options.groupBy] === prevValue) {
                addTo(result[result.length - 1], tsMaximal, true);
                tsMaximal = tempus(tsMaximal).calc(period).utc();
            }
        }

        return result;
    };

    /**
     * @doc function
     * @name tempus.global:monthNames
     * @param {boolean} type If true, long names was returning, else - short names.
     * @return {Array} Array of month names.
     * @description
     * Returns array of month names. If type is undefined, short names was returned.
     *
     * ```js
     * // returns ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
     * tempus.monthNames();
     *
     * // returns ["January","February","March","April","May","June",
     * //     "July","August","September","October","November","December"];
     * tempus.monthNames(true);
     *
     * // returns ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
     * tempus.setLang('ru');
     * tempus.monthNames();
     * ```
     */
    tempus.monthNames = function (type) {
        switch (type) {
        case 'long':
            return monthLongNames;
        default:
            return monthShortNames;
        }
    };

    /**
     * @doc function
     * @name tempus.global:dayNames
     * @param {boolean} type If true, long names was returning, else - short names.
     * @return {Array} Array of day names.
     * @description
     * Returns array of day names. If type is undefined, short names was returned.
     *
     * ```js
     * // returns ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
     * tempus.dayNames();
     *
     * // returns ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
     * tempus.dayNames(true);
     *
     * // returns ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
     * tempus.setLang('ru');
     * tempus.dayNames();
     * ```
     */
    tempus.dayNames = function (type) {
        switch (type) {
        case 'long':
            return dayLongNames;
        default:
            return dayShortNames;
        }
    };

    /**
     * @doc function
     * @name tempus.global:lang
     * @param {string} value Language's code.
     * @return {undefined|string} Language's code or undefined for setter.
     * @description
     * Globally set or get language. By default **auto detect current user language**. If you want only english
     * language, always set tempus.lang('en'); before using tempus.
     *
     * ```js
     * // returns "Ноябрь, 14"
     * tempus.lang('ru');
     * tempus({year: 2013, month: 11, day: 14}).format('%B, %d');
     *
     * // returns "November, 14"
     * tempus.lang('en');
     * tempus({year: 2013, month: 11, day: 14}).format('%B, %d');
     * ```
     */
    tempus.lang = function (value) {
        if (value !== undefined) {
            lang = value;
            if (translations[lang] === undefined) {
                lang = 'en';
            }
            monthLongNames = getMonthLongNames();
            monthShortNames = getMonthShortNames();
            dayLongNames = getDayLongNames();
            dayShortNames = getDayShortNames();
        } else {
            return lang;
        }
        return undefined;
    };

    /**
     * @doc function
     * @name tempus.global:availableLangs
     * @return {Array} Array of available languages.
     * @description
     * Get available languages.
     *
     * ```js
     * // returns ["en", "ru"]
     * tempus.availableLocales();
     * ```
     */
    tempus.availableLangs = function () {
        return Object.keys(translations);
    };

    /**
     * @doc function
     * @name tempus.global:registerFormat
     * @param {string} value Directive
     * @param {Function} formatFunc Format function.
     * @param {Function} parseFunc Parse function.
     * @param {number} minLength Min length of value.
     * @param {number} maxLength Max length of value.
     * @param {string} type Type of value, can be 'number', 'word' (only letters) or 'string' (any symbols)
     * @description
     * Registering a new format.
     *
     * ```js
     * // no returns
     * tempus.registerFormat('%q',
     *     function(date) {
     *         return date.month();
     *     },
     *     function(value) {
     *         var v = Number(value);
     *         return {month: (isNaN(v) ? undefined : v) };
     *     },
     *     1,
     *     2,
     *     'number'
     * );
     *
     * // test it
     * // returns "01.1.2013";
     * tempus({year: 2013, month: 1, day: 1}).format('%d.%q.%Y');
     *
     * // returns {"year":2013,"month":2,"day":10,"hours":0,"minutes":0,"seconds":0};
     * tempus('10.2.2013', '%d.%q.%Y').get();
     * ```
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
     * @doc function
     * @name tempus.global:unregisterFormat
     * @param {string} value Directive
     * @description
     * Unregistering a format.
     *
     * ```js
     * // unregistering a format
     * tempus.unregisterFormat('%d');
     *
     * // test it
     * // returns "%d.01.2013"
     * tempus.format({year: 2013, month: 1, day: 1}, '%d.%m.%Y');
     * ```
     */
    tempus.unregisterFormat = function (value) {
        delete registeredFormats[value];
    };

    /**
     * @doc function
     * @name tempus.global:detectFormat
     * @param {string} str Formatted date as string
     * @return {string} Format of date.
     * @description
     * Detecting format of date  as string.
     *
     * ```js
     * // returns "%d.%m.%Y"
     * tempus.detectFormat('10.12.2013');
     *
     * // returns "%Y-%m-%d %H:%M"
     * tempus.detectFormat('2013-01-01 12:00');
     *
     * // returns "%d.%m.%Y"
     * tempus.detectFormat('01/02/2013');
     * ```
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

    // private classes var
    classes = {
        TempusDate: TempusDate
    };

    /**
     * @doc function
     * @name tempus.global:classes
     * @param {string} klass Class name
     * @param {string} value Class constructor function
     * @return {string|undefined} For getter, returns Class constructor, for setter - nothing.
     * @description
     * Returns some class or add class to tempus scope. Available classes:
     * - TempusDate;
     *
     * ```js
     * // returns class TempusDate
     * var TD = tempus.classes('TempusDate');
     *
     * // extends TempusDate
     * TD.fn.example = function() { alert('Extended!'); };
     *
     * // test it
     * tempus().example();
     *
     *
     * // Add some class to tempus
     * tempus.classes('TempusSome', function() {this.foo = 'bar';});
     * var TempusSome = tempus.classes('TempusSome');
     * var some = new TempusSome();
     * alert(some.foo);
     * ```
     */
    tempus.classes = function (klass, value) {
        if (value === undefined) {
            return classes[klass];
        } else {
            classes[klass] = value;
        }
    };

    /**
     * @doc function
     * @name tempus.global:loadTranslations
     * @param {Object} translationsObject Object with translations (see translations.json for example) or url of translations.
     * @return {undefined} None.
     * @description
     * Load/change current translations on new.
     *
     * ```js
     * // Load some translations from object
     * tempus.loadTranslations(myCustomTranslations);
     *
     * // Load some translations from url
     * tempus.loadTranslations('src/translations.json');
     *
     * ```
     */
    tempus.loadTranslations = function (translationsObject) {
        if (typeof translationsObject === 'object') { // some object
            translations = translationsObject;
        } else if (typeof translationsObject === 'string') { // url address
            loadJSON(translationsObject, function (data) {
                translations = data;
            }, function (xhr) {
            })
        }
    };

    // auto select language
    lang = (nav.language || nav.systemLanguage || nav.userLanguage || 'en').substr(0, 2).toLowerCase();
    if (translations[lang] === undefined) {
        lang = 'en';
    }
    monthLongNames = getMonthLongNames();
    monthShortNames = getMonthShortNames();
    dayLongNames = getDayLongNames();
    dayShortNames = getDayShortNames();

    // *************************************************
    // *                                               *
    // *                  EXPORTS                      *
    // *                                               *
    // *************************************************

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = tempus;
        }
        exports.tempus = tempus;
    } else {
        root.tempus = tempus;
    }

}).call(this); // window or exports
