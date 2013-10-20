function ready() {
    document.getElementById('currentTime').innerHTML = tempus.now();
}

window.addEventListener("load", ready, false);