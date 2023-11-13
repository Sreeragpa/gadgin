var timeLeft = 59;
var elem = document.getElementById('otp-timer');
var timerId = setInterval(countdown, 1000);
var resendButton = document.getElementById('resendbutton-y')
var myForm = document.getElementById('otp-form')
var flag=0;
function countdown() {
    if (timeLeft == -1) {
        clearTimeout(timerId);
        showResendbutton();
    } else {
        elem.innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
    }
}
    
function showResendbutton() {
    // document.getElementById('otp-form').otpinputt.disabled=true;
    if(flag<2){
        resendButton.classList.remove('deactivated')
    }
    
}

resendButton.addEventListener('click',()=>{
    const type=document.getElementById('type')
    if(type.innerHTML=='Forgot Password'){
        myForm.action = "/api/getotp/?forgotpass=1";
    flag++;
    // Submit the form
    myForm.submit();
    }else{
        myForm.action = "/api/getotp";
    flag++;
    // Submit the form
    myForm.submit();
    }
    
})
