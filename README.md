TempusJS
========

JavaScript library for most comfortable using date/time.

Supports IE6+, Firefox, Chrome, Opera. [Check tests in your browser](http://crusat.github.io/tempus-js/tests.html)

Demo and description here: http://crusat.github.io/tempus-js/

Install over bower:

```bash
    $ bower install tempus
```
Or download some release here https://github.com/crusat/tempus-js/releases

Default formats
---------------

<table>
    <tr>
        <th>Directive</th>
        <th>Meaning</th>
        <th>Example</th>
    </tr>
    <tr>
        <td>%d</td>
        <td>Day of the month as a zero-padded decimal number.</td>
        <td>01, 02, ..., 31</td>
    </tr>
    <tr>
        <td>%m</td>
        <td>Month as a zero-padded decimal number.</td>
        <td>01, 02, ..., 12</td>
    </tr>
    <tr>
        <td>%Y</td>
        <td>Year with century as a decimal number.</td>
        <td>1970, 1988, 2001, 2013</td>
    </tr>
    <tr>
        <td>%w</td>
        <td>Weekday as a decimal number, where 0 is Sunday and 6 is Saturday.</td>
        <td>0, 1, ..., 6</td>
    </tr>
    <tr>
        <td>%a</td>
        <td>Weekday abbreviated name.</td>
        <td>Sun, Mon, ..., Sat</td>
    </tr>
    <tr>
        <td>%A</td>
        <td>Weekday full name.</td>
        <td>Sunday, Monday, ..., Saturday</td>
    </tr>
    <tr>
        <td>%b</td>
        <td>Month abbreviated name.</td>
        <td>Jan, Feb, ..., Dec</td>
    </tr>
    <tr>
        <td>%B</td>
        <td>Month full name.</td>
        <td>January, February, ..., December</td>
    </tr>
    <tr>
        <td>%H</td>
        <td>Hour (24-hour clock) as a zero-padded decimal number.</td>
        <td>00, 01, ..., 23</td>
    </tr>
    <tr>
        <td>%M</td>
        <td>Minute as a zero-padded decimal number.</td>
        <td>00, 01, ..., 59</td>
    </tr>
    <tr>
        <td>%S</td>
        <td>Second as a zero-padded decimal number.</td>
        <td>00, 01, ..., 59</td>
    </tr>
    <tr>
        <td>%s</td>
        <td>Unix time (in seconds).</td>
        <td>0, ..., 1377157851, ..., 2147483647</td>
    </tr>
    <tr>
        <td>%F</td>
        <td>ISO_8601 format (%Y-%m-%d).</td>
        <td>1970-01-01, ..., 2013-08-22, ...</td>
    </tr>
    <tr>
        <td>%D</td>
        <td>UK and USA format (%m/%d/%Y).</td>
        <td>01/01/1970, ..., 08/22/2013, ...</td>
    </tr>
</table>

License: MIT.

Contact me: me@akuzn.com