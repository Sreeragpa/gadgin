var timeLeft = 59;
var elem = document.getElementById('otp-timer');
var timerId = setInterval(countdown, 1000);

function countdown() {
    if (timeLeft == -1) {
        clearTimeout(timerId);
        // doSomething();
    } else {
        elem.innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
    }
}
    
function doSomething() {
    document.getElementById('otp-form').otpinputt.disabled=true;
}