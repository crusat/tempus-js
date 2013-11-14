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
                    return formattingWithNulls(date.day(), 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {day: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%m': {
                format: function (date) {
                    return formattingWithNulls(date.month(), 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {month: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%Y': {
                format: function (date) {
                    return formattingWithNulls(date.year(), 4);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {year: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{4}'
            },
            '%w': {
                format: function (date) {
                    return date.dayOfWeek();
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                parseLit: '\\d{1}'
            },
            '%a': {
                format: function (date) {
                    return translations[lang]["daysShortNames"][date.dayOfWeek()];
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                parseLit: '\\w+'
            },
            '%A': {
                format: function (date) {
                    return translations[lang]["daysLongNames"][date.dayOfWeek()];
                },
                parse: function (value) {
                    // impossible
                    return {};
                },
                parseLit: '\\w+'
            },
            '%b': {
                format: function(date) {
                    return translations[lang]["monthShortNames"][date.month()-1];
                },
                parse: function(value) {
                    var month = that.getMonthNames().indexOf(value)+1;
                    return {month: month !== -1 ? month : undefined}
                },
                parseLit: '\\w+'
            },
            '%B': {
                format: function(date) {
                    return translations[lang]["monthLongNames"][date.month()-1];
                },
                parse: function(value) {
                    var month = that.getMonthNames(true).indexOf(value)+1;
                    return {month: month !== -1 ? month : undefined}
                },
                parseLit: '\\w+'
            },
            '%H': {
                format: function (date) {
                    return formattingWithNulls(date.hours(), 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {hours: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%M': {
                format: function (date) {
                    return formattingWithNulls(date.minutes(), 2);
                },
                parse: function (value) {
                    var v = Number(value);
                    return {minutes: (isNaN(v) ? undefined : v) };
                },
                parseLit: '\\d{2}'
            },
            '%S': {
                format: function (date) {
                    return formattingWithNulls(date.seconds(), 2);
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
                    return formattingWithNulls(date.year(), 4) + '-' + formattingWithNulls(date.month(), 2) + '-' + formattingWithNulls(date.day(), 2);
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
                    return formattingWithNulls(date.month(), 2) + '/' + formattingWithNulls(date.day(), 2) + '/' + formattingWithNulls(date.year(), 4)
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
        MIN_YEAR = 100,
        MAX_YEAR = 3000,
        MIN_MONTH = 1,
        MAX_MONTH = 12,
        MIN_DAY = 1,
        MAX_DAY_IN_MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
            seconds = undefined;

        return {
            /**
             * Get or set year.
             * @param value {number|undefined} New year. If undefined, returns numeric value.
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
             * @param value {number|undefined} New month. If undefined, returns numeric value.
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
             * @param value {number|undefined} New day. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            day: function(value) {
                if (value !== undefined) {
                    day = Number(value);
                } else {
                    return day;
                }
                return this;
            },
            /**
             * Get or set hours.
             * @param value {number|undefined} New hours. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            hours: function(value) {
                if (value !== undefined) {
                    hours = Number(value);
                } else {
                    return hours;
                }
                return this;
            },
            /**
             * Get or set minutes.
             * @param value {number|undefined} New minutes. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            minutes: function(value) {
                if (value !== undefined) {
                    minutes = Number(value);
                } else {
                    return minutes;
                }
                return this;
            },
            /**
             * Get or set seconds.
             * @param value {number|undefined} New seconds. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            seconds: function(value) {
                if (value !== undefined) {
                    seconds = Number(value);
                } else {
                    return seconds;
                }
                return this;
            },
            timestamp: function(value) {
                if (value !== undefined) {
                    var d = new Date(Number(value)*1000);
                    this.year(d.getFullYear());
                    this.month(d.getMonth() + 1);
                    this.day(d.getDate());
                    this.hours(d.getHours());
                    this.minutes(d.getMinutes());
                    this.seconds(d.getSeconds());
                } else {
                    return Math.floor(new Date(
                        this.year() !== undefined ? this.year() : 1970,
                        this.month() !== undefined ? this.month() - 1 : 0,
                        this.day() !== undefined ? this.day() : 1,
                        this.hours() !== undefined ? this.hours() : 0,
                        this.minutes() !== undefined ? this.minutes() : 0,
                        this.seconds() !== undefined ? this.seconds() : 0
                    ).getTime()/1000);
                }
                return this;
            },
            /**
             * Get day of week.
             * @returns {number|undefined} Numeric value of day of week.
             * @example
             * // returns current day of week
             * TP.now().dayOfWeek();
             */
            dayOfWeek: function() {
                return this.year() !== undefined && this.month() !== undefined &&
                    this.day() !== undefined ? getDayOfWeek(year, month, day) : undefined;
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
                if (year !== undefined) {
                    return isLeapYear(newValue);
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
                this.month(d.getMonth() + 1);
                this.day(d.getDate());
                this.hours(d.getHours());
                this.minutes(d.getMinutes());
                this.seconds(d.getSeconds());
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
                        timestamp: this.timestamp()
                    }
                }
                if (typeof newDate === 'object') {
                    if (newDate.year !== undefined && newDate.year >= MIN_YEAR && newDate.year <= MAX_YEAR) {
                        this.year(Number(newDate.year));
                    } else {
                        this.year(MIN_YEAR);
                    }
                    if (newDate.month !== undefined && newDate.month >= MIN_MONTH && newDate.month <= MAX_MONTH) {
                        this.month(Number(newDate.month));
                    } else {
                        this.month(MIN_MONTH);
                    }
                    this.day(newDate.day);
                    this.hours(newDate.hours);
                    this.minutes(newDate.minutes);
                    this.seconds(newDate.seconds);
                }
                return this;
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
            }


        };
    })();
    window.Tempus = window.TP = Tempus;
})();
