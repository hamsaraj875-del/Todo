const otpbtn = document.querySelector("#otpbtn");
console.log(otpbtn.innerText);
let seconds = 300;
wait();
async function wait(){
  otpbtn.style.cursor="not-allowed";
  otpbtn.disabled=true;
  seconds--;
  otpbtn.innerText = `Resend in ${seconds}`;
  if(seconds>0){
    setTimeout(wait,1000);
  }else{
    otpbtn.innerText = "Resend";
    otpbtn.disabled=false;
    otpbtn.style.cursor="pointer";
  }
}


