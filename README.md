TempusJS
========

JavaScript library for most comfortable using date/time.

- Supports IE6+, Firefox, Chrome, Opera. [Check tests in your browser](http://tempusjs.org/tests/index.html)
- Supports chains call.
- Month can be starts from 1 (default) or 0.
- Milliseconds can be disabled (default).
- Fast.
- Supports [custom formats](http://docs.tempusjs.org/documentation/docs/tempus/tempus.global:registerFormat) and [plugins](http://docs.tempusjs.org/documentation/docs/tempus/tempus.global:classes).
- Very fast [date validation](http://docs.tempusjs.org/documentation/docs/tempus/TempusDate.global:valid).
- Dates [generation factory](http://docs.tempusjs.org/documentation/docs/tempus/tempus.global:generate).

Site: http://tempusjs.org/

Install over bower:

```bash
    $ bower install tempus
```
Or download some release here https://github.com/crusat/tempus-js/releases

Some Examples
--------------

```js
// Returns "2013-11-18 20:14:23"
tempus({year: 2013, month: 11, day: 18, hours: 20, minutes: 14, seconds: 23, milliseconds: 918}).format('%Y-%m-%d %H:%M:%S');

// Returns TempusDate object with date "2013-11-18 20:15:38"
tempus(1384791338);

// Put date as [year, month, day, hours, minutes, seconds].
tempus([2013, 1, 1, 12, 0, 3]);

// Returns TempusDate object with date 18 November 2013.
tempus('18.11.2013');

// Reformat date, returns '2013-12-15'
tempus('15.12.2013').format('%Y-%m-%d');

// Default date if parsing failed, returns 2013-01-01
tempus('123', '%d.%m.%Y', tempus([2013, 1, 1]));

// VALIDATION

// returns false
tempus('32.08.2013', '%d.%m.%Y').valid();

// returns true
tempus('00:00 01.01.2012', '%H:%M %d.%m.%Y').valid();

// returns {"year":-5,"month":false,"day":false,"hours":false,"minutes":false,"seconds":false,"milliseconds":false}
tempus().year(-5).errors();

// RANGES

// returns 6
tempus([2013, 11, 1]).between(tempus([2014, 5, 5]), 'month');

// returns TempusDate with date 2012-01-01
tempus([2011, 5, 2]).calc({year: 1, month: -4, day: -1});

// DATE GENERATION

// returns ["2013-01-01 00:00","2013-01-02 12:00","2013-01-04 00:00","2013-01-05 12:00","2013-01-07 00:00",
//     "2013-01-08 12:00","2013-01-10 00:00","2013-01-11 12:00"];
tempus.generateDates({
    dateFrom: '01.01.2013',
    dateTo: '12.01.2013',
    period: {day: 1, hours: 12},
    format: '%Y-%m-%d %H:%M'
});

```

For more info and examples, please, see [documentation](http://docs.tempusjs.org/documentation/docs/tempus/index)

License
-------

MIT

Contact me
----------

me@akuzn.com