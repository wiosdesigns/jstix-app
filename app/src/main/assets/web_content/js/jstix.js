var curr = 'home';
var editmode = false;
let btns;
let options;
var sel_opt = 0;
let svgs;
let keybtns;

function pageloaded(){
  location.href = "#home";
  btns = document.getElementsByClassName('cbtn');
  options=document.getElementById('layoutgrid').getElementsByTagName('p');
  svgs=document.getElementById('play').children;
  keybtns=document.getElementById('keylist').children;
  for(var i=0;i<btns.length;i++){
    btns[i].addEventListener("touchstart",function(){
      if(!editmode){
        press(this);
      }
    });
    btns[i].addEventListener("touchend",function(){
      if(!editmode){
        release(this);
      }
      else{
        editkeymap(this);
      }
    });
    btns[i].addEventListener("touchcancel",function(){
      if(!editmode){
        release(this);
      }
    });
  }
}
function change(){
  var pg = location.hash.slice(1);
  document.getElementById(curr).style.display = 'none';
  curr = pg;
  document.getElementById(curr).style.display = 'block';
  if(curr!='play'){
    document.getElementById('playmd').style.background = "#000000";
    document.getElementById('playmd').style.color = "#20d080";
    document.getElementById('editmd').style.background = "#000000";
    document.getElementById('editmd').style.color = "#20d080";
  }
}
function toplaymode(){
  document.getElementById('playmd').style.background = "#20d080";
  document.getElementById('playmd').style.color = "#ffffff";
  document.getElementById('editmd').style.background = "#000000";
  document.getElementById('editmd').style.color = "#20d080";
  editmode=false;
}
function toeditmode(){
  document.getElementById('playmd').style.background = "#000000";
  document.getElementById('playmd').style.color = "#20d080";
  document.getElementById('editmd').style.background = "#20d080";
  document.getElementById('editmd').style.color = "#ffffff";
  shownotif("Click buttons to set their key mapping");
  editmode=true;
}
function init(){
  var h = document.getElementById('hostadd').innerHTML;
  ws = new WebSocket('ws://'+h+':1729');
  ws.onopen = function(){shownotif('Connected successfully');}
  ws.onclose = function(){shownotif('Connection error');}
}
function use(name){
  for(var i=0;i<svgs.length;i++){
    svgs[i].style.display = "none";
  }
  document.getElementById(name).style.display = "inline-block";
}
function press(n){
  console.log(n.getAttribute('mapto'));
  ws.send(`p ${n.getAttribute('mapto')}`);
}
function release(n){
  ws.send(`r ${n.getAttribute('mapto')}`);
}
function hostinput(t){
  hostadd = document.getElementById("hostadd");
  if(t=='x'){
    if(hostadd.innerHTML.length>0){
      hostadd.innerHTML = hostadd.innerHTML.slice(0,hostadd.innerHTML.length-1);
    }
  }
  else{
    hostadd.innerHTML += t;
  }
}
function changelayout(n){
  for(var i=0;i<options.length;i++){
    options[i].style.display = "none";
  }
  if(n==1 && sel_opt < (options.length-1)){
    sel_opt++;
  }
  if(n==-1 && sel_opt > 0){
    sel_opt--;
  }
  options[sel_opt].style.display = 'inline-block';
  use(options[sel_opt].id.slice(4));
}
function shownotif(msg){
  document.getElementById('fullmsg').style.display = "grid";
  document.getElementById('notifmsg').innerHTML = msg;
}
function hidenotif(){
  document.getElementById('fullmsg').style.display="none";
}
function editkeymap(elbtn){
  setTimeout(function(){document.getElementById('keyselector').style.display = "grid"},200);
  var selected_keys = elbtn.getAttribute('mapto').split(' ');
  for(var i=0;i<keybtns.length;i++){
    var key_name = keybtns[i].id.slice(4)
    if(selected_keys.includes(key_name)){
      keybtns[i].classList.add("keysel");
    }
    else{
      keybtns[i].classList.remove("keysel");
    }
  }
  document.getElementById('setkeylist').addEventListener("click",function finishmap(){
    elbtn.setAttribute('mapto',keymaplist());
    document.getElementById('keyselector').style.display = "none";
    document.getElementById('setkeylist').removeEventListener("click",finishmap);
  });
}
function togglekey(keybutton){
  keybutton.classList.toggle("keysel");
}
function keymaplist(){
  var maplist = []
  for(var i=0;i<keybtns.length;i++){
    if(keybtns[i].classList.contains("keysel")){
      maplist.push(keybtns[i].id.slice(4));
    }
  }
  return maplist.join(' ');
}
