function ready() {
    // current time
    document.getElementById('currentTime').innerHTML = tempus.now();
    // leap years
    var domYears = document.getElementById('years');
    var current_year = 2013;
    for (var year = 1900; year <= current_year; year++) {
        if (year % 20 === 0) {
            var tr = document.createElement('tr');
        }
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(year + (tempus.isLeapYear(year) ? ' Leap': '')));
        tr.appendChild(td);
        if ((year % 10 === 0)||(year === current_year)) {
            domYears.appendChild(tr);
        }
    }
}

window.addEventListener("load", ready, false);