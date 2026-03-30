const headName = document.querySelector(".name");
const head = ["Welcome To Todo..."];
let index = 0;
let Adding =true;
console.log('Okay you got a hit');
typeAnimation();
function typeAnimation(){
  delay=140;
  if(Adding){
    headName.textContent = head[0].substring(0,index);
    index++;
    if(index == head[0].length+1){
      Adding = false;
      delay=1000;
    }
  }else{
    headName.textContent = head[0].substring(0,index);
    index--;
    if(index == -1){
      Adding = true;
      delay= 1000;
    }
  }
  setTimeout(typeAnimation,delay);
}

const opn = document.querySelector(".optionerDiv");
const ext = document.querySelector(".extension");
function Opener(){
  ext.classList.toggle("extensionActive");
}
