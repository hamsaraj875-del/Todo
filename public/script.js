const headName = document.querySelector(".name");
const head = ["Welcome To Todo..."];
let index = 0;
let Adding =true;
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

const chat = document.querySelector(".aiChat");
const chatBox = document.querySelector("#chatBox");
const userQuery = document.querySelector(".userQuery");
const aiAns = document.querySelector(".aiAns");
async function aiWake(){
  if(chat.classList.contains("aiChat")){
    chat.classList.remove("aiChat");
    chat.classList.add("aiChatActive");
  }
  else{
    chat.classList.remove("aiChatActive");
    chat.classList.add("aiChat");
  }
}
aiAns.addEventListener("click",()=>{
  if(userQuery.value!=""){
    if(chatBox.innerText !=""){
      chatBox.innerText = chatBox.innerText+"\n"+userQuery.value;
      aiResults(userQuery.value);
    }else{
      chatBox.innerText = userQuery.value;
      aiResults(userQuery.value);
    }
    userQuery.value = "";
  }
});
