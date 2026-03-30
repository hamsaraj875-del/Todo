const otpbtn = document.querySelector("#otp");
console.log(otpbtn.innerText);
let seconds = 300;
async function emailWait(){
  otpbtn.style.cursor="not-allowed";
  otpbtn.disabled = true;
  seconds--;
  otpbtn.innerText = `Resend in ${seconds} s`;
  if(seconds>0){
    setTimeout(emailWait,1000);
  }
  else{
    otpbtn.style.cursor="pointer";
    otpbtn.disabled=false;
    otpbtn.innerText = "Get OTP";
  }
}
