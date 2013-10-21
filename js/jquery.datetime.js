/**
 * @author crusat (crusat@crusat.ru)
 * @version 0.10
 * @url https://github.com/crusat/jquery-datetime
 */
(function($){
    // format with nulls
    function formattingWithNulls(val, symb_count) {
        var v = val.toString();
        while (v.length < symb_count) {
            v = '0' + v;
        }
        return v;
    }

    var DateTime = function(settings) {
        // vars
        var timestamp = null;
        var year = null;
        var month = null;
        var day = null;
        var day_of_week = null;
        var days_of_week_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var days_of_week_long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var hours = null;
        var minutes = null;
        var seconds = null;
        if (settings === undefined) {
            timestamp = Math.floor((new Date()).getTime()/1000);
        }
        if ((typeof settings === 'number')&&(settings>=0)) {
            timestamp = settings;
        }
        if (timestamp !== null) {
            // calc date
            var innerDate = new Date(timestamp*1000);
            year = innerDate.getFullYear();
            month = innerDate.getMonth() + 1;
            day = innerDate.getDate();
            day_of_week = innerDate.getDay();
            hours = innerDate.getHours();
            minutes = innerDate.getMinutes();
            seconds = innerDate.getSeconds();
        }
        if (typeof settings === 'object') {
            var innerDate = new Date(settings.year, settings.month, settings.day,
                settings.hours, settings.minutes, settings.seconds);
            year = innerDate.getFullYear();
            month = innerDate.getMonth() + 1; // js default months beginning from 0.
            day = innerDate.getDate();
            day_of_week = innerDate.getDay();
            hours = innerDate.getHours();
            minutes = innerDate.getMinutes();
            seconds = innerDate.getSeconds();
            timestamp = Math.floor(innerDate.getTime()/1000);
        }
        // methods
        this.getTimestamp = function() {
            return timestamp;
        };
        this.getYear = function() {
            return year;
        };
        this.getMonth = function() {
            return month;
        };
        this.getDay = function() {
            return day;
        };
        this.getDayOfWeek = function(type) {
            if (type === 'short') {
                return days_of_week_short[day_of_week];
            }
            if (type === 'long') {
                return days_of_week_long[day_of_week];
            }
            return day_of_week;
        };
        this.getHours = function() {
            return hours;
        };
        this.getMinutes = function() {
            return minutes;
        };
        this.getSeconds = function() {
            return seconds;
        };
        this.loadTranslations = function(translations) {
            days_of_week_short = translations.days_of_week_short !== undefined ? translations.days_of_week_short : days_of_week_short;
            days_of_week_long = translations.days_of_week_long !== undefined ? translations.days_of_week_long : days_of_week_long;
            return true;
        };
    };

    $.datetime = function(format) {
        return $.datetime.now(format);
    };
    $.datetime.now = function(format) {
        var currenttime = new DateTime().getTimestamp();
        if (format===undefined) {
            return currenttime;
        } else {
            return $.datetime.format(format, currenttime);
        }
    };
    $.datetime.isLeapYear = function(year) {
        if (year === undefined) {
            year = parseInt($.datetime('%Y'));
        }
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                return year % 400 == 0;
            } else return true;
        }
        return false;
    };
    $.datetime.format = function(format, timestamp) {
        var result = format;
        var d = new DateTime(timestamp);
        var months_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var months_names_long = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // vars
        var day = formattingWithNulls(d.getDay(), 2);
        var month = formattingWithNulls(d.getMonth(), 2);
        var full_year = formattingWithNulls(d.getYear(), 4);
        var day_number = d.getDayOfWeek();
        var day_name_short = d.getDayOfWeek('short');
        var day_name_long = d.getDayOfWeek('long');
        var month_name_short = months_names_short[parseInt(month)-1];
        var month_name_long = months_names_long[parseInt(month)-1];
        var hour = formattingWithNulls(d.getHours(), 2);
        var minutes = formattingWithNulls(d.getMinutes(), 2);
        var seconds = formattingWithNulls(d.getSeconds(), 2);
        // formatting
        result = result.replace('%d', day);
        result = result.replace('%m', month);
        result = result.replace('%Y', full_year);
        result = result.replace('%w', day_number);
        result = result.replace('%a', day_name_short);
        result = result.replace('%A', day_name_long);
        result = result.replace('%b', month_name_short);
        result = result.replace('%B', month_name_long);
        result = result.replace('%H', hour);
        result = result.replace('%M', minutes);
        result = result.replace('%S', seconds);
        result = result.replace('%s', timestamp);
        result = result.replace('%F', full_year+'-'+month+'-'+day);
        result = result.replace('%D', month+'/'+day+'/'+full_year);
        return result;
    };
    $.datetime.parse = function(str, format) {
        var lits = format.match(/(%d|%m|%Y|%H|%M|%S|%s)/g);
//            delete lits[0];
        var format_re = format.replace(/(%d|%m|%H|%M|%S)/g, '(\\d{2})');
        format_re = format_re.replace(/(%Y)/g, '(\\d{4})');
        format_re = format_re.replace(/(%s)/g, '(\\d{1,10})'); //max timestamp is 2147483647.
        var re = new RegExp(format_re, 'g');
        var result = re.exec(str);
        var result2 = [];
        for (var i in result) {
            if ((typeof result[i] === 'string')&&((format.length === 2) ||(result[i] !== str))) {
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
            switch(lits[key]) {
                case '%d':
                    day = parseInt(result2[key]);
                    day = isNaN(day) ? 0 : day;
                    break;
                case '%m':
                    month = parseInt(result2[key]);
                    month = isNaN(month) ? 0 : month;
                    break;
                case '%Y':
                    full_year = parseInt(result2[key]);
                    full_year = isNaN(full_year) ? 0 : full_year;
                    break;
                case '%H':
                    hour = parseInt(result2[key]);
                    hour = isNaN(hour) ? 0 : hour;
                    break;
                case '%M':
                    minutes = parseInt(result2[key]);
                    minutes = isNaN(minutes) ? 0 : minutes;
                    break;
                case '%S':
                    seconds = parseInt(result2[key]);
                    seconds = isNaN(seconds) ? 0 : seconds;
                    break;
                case '%s':
                    timestamp = parseInt(result2[key]);
                    timestamp = isNaN(timestamp) ? 0 : timestamp;
                    break;
            }
        }
        return {
            day: day,
            month: month,
            year: full_year,
            hour: hour,
            minutes: minutes,
            seconds: seconds,
            timestamp: timestamp
        }
    };
    $.datetime.strtotime = function(str, format) {
        if (format===undefined) {
            return Math.floor(Date.parse(str)/1000);
        } else {
            var parsed_datetime = $.datetime.parse(str, format);
            if (parsed_datetime.timestamp !== 0) {
                return parsed_datetime.timestamp;
            }
            return Math.floor((new Date(
                parsed_datetime.year,
                parsed_datetime.month - 1, // because months in js started from 0.
                parsed_datetime.day,
                parsed_datetime.hour,
                parsed_datetime.minutes,
                parsed_datetime.seconds)).getTime()/1000);
        }
    };
    $.datetime.reformat = function(str, format_to, format_from) {
        return $.datetime.format(format_to, $.datetime.strtotime(str, format_from));
    };
    $.datetime.validate = function(str, format, ranges, allow_empty) {
        var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        var default_ranges = {
            year: {
                min: 1000,
                max: 9999
            },
            month: {
                min: 1,
                max: 12
            },
            day: {
                min: 1,
                max: null
            },
            hour: {
                min: 0,
                max: 23
            },
            minutes: {
                min: 0,
                max: 59
            },
            seconds: {
                min: 0,
                max: 59
            }
        };

        var ranges =  $.extend(default_ranges, ranges);
        allow_empty = allow_empty === undefined ? false : allow_empty;

        if (allow_empty&&(str === '')) {
            return true;
        }

        var parsed_datetime = $.datetime.parse(str, format);
        if ((parsed_datetime.year === 0)&&
            (parsed_datetime.month === 0)&&
            (parsed_datetime.day === 0)&&
            (parsed_datetime.hour === 0)&&
            (parsed_datetime.minutes === 0)&&
            (parsed_datetime.seconds === 0)) {
//                console.log('null error');
            return false;
        }

        // *** prepare ***
        if ($.datetime.isLeapYear(parsed_datetime.year)) {
            days_in_month[1] += 1;
        }

        ranges.day.max = ranges.day.max === null ? days_in_month[parsed_datetime.month-1] : ranges.day.max;

        // *** conditions ***
        if ((parsed_datetime.year < ranges.year.min)||(parsed_datetime.year > ranges.year.max)) {
//                console.log('year error');
            return false;
        }
        if ((parsed_datetime.month < ranges.month.min)||(parsed_datetime.month > ranges.month.max)) {
//                console.log('month error');
            return false;
        }
        if ((parsed_datetime.day < ranges.day.min)||(parsed_datetime.day > ranges.day.max)) {
//                console.log('day error');
            return false;
        }
        if ((parsed_datetime.hour < ranges.hour.min)||(parsed_datetime.hour > ranges.hour.max)) {
//                console.log('hour error');
            return false;
        }
        if ((parsed_datetime.minutes < ranges.minutes.min)||(parsed_datetime.minutes >= ranges.minutes.max)) {
//                console.log('minutes error');
            return false;
        }
        if ((parsed_datetime.seconds < ranges.seconds.min)||(parsed_datetime.seconds >= ranges.seconds.max)) {
//                console.log('seconds error');
            return false;
        }
        return true;
    };
})(jQuery);