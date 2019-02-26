var curr = 'home';
var editmode = false;
let btns;
let options;
let svgs;
function pageloaded(){
  navigator.serviceWorker && navigator.serviceWorker.register('./sw.js').then(function(registration) {
    console.log('Excellent, registered with scope: ', registration.scope);
  });
  location.href = "#home";
  btns = document.getElementsByClassName('cbtn');
  options=document.getElementById('layout').children;
  svgs=document.getElementById('play').children;

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
        this.setAttribute('mapto',prompt("Set Keys",this.getAttribute('mapto')));
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
  editmode=true;
}
function init(){
  var h = document.getElementById('hostadd').value;
  ws = new WebSocket('ws://'+h);
  ws.onopen = function(){document.getElementById('status').innerHTML = "Connected";}
  setTimeout(function(){ document.getElementById('status').innerHTML = ""; }, 1000);
}
function use(name){
  for(var i=0;i<options.length;i++){
    options[i].style.background = "#02080d";
  }
  document.getElementById('sel_'+name).style.background = "#2080d0";
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
