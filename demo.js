function ready() {
    // current time
    document.getElementById('currentTime').innerHTML = tempus.now();
    // leap years
    var domYears = document.getElementById('years');
    for (var year = 1900; year < 2013; year++) {
        if (year % 10 === 0) {
            if (tr !== undefined) {
                domYears.appendChild(tr);
            }
            var tr = document.createElement('tr');
        }
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(year + (tempus.isLeapYear(year) ? ' Leap': '')));
        tr.appendChild(td);
    }
}

window.addEventListener("load", ready, false);