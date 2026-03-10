import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
 apiKey: "AIzaSyDAvFkn_GT6YROhlOBfu5JYvYljBK_ss1o",
 authDomain: "musik-web-app.firebaseapp.com",
 databaseURL: "https://musik-web-app-default-rtdb.asia-southeast1.firebasedatabase.app",
 projectId: "musik-web-app"
};

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const playlist = document.getElementById("playlist");
const searchInput = document.getElementById("search");

let songs = [];

function render(list){

playlist.innerHTML="";

list.forEach(song=>{

const div=document.createElement("div");
div.className="song";

const title=document.createElement("p");
title.innerText=song.title;

const audio=document.createElement("audio");
audio.src=song.url;
audio.controls=true;

div.appendChild(title);
div.appendChild(audio);

playlist.appendChild(div);

});

}

onValue(ref(db,"musik"),snapshot=>{

songs=[];

const data = snapshot.val();

if(!data) return;

for(const key in data){
songs.push(data[key]);
}

render(songs);

});

searchInput.addEventListener("input",()=>{

const keyword=searchInput.value.toLowerCase();

const filtered=songs.filter(song=>
song.title.toLowerCase().includes(keyword)
);

render(filtered);

});

window.uploadSong=function(){

const title=document.getElementById("title").value;
const url=document.getElementById("url").value;

push(ref(db,"musik"),{
title:title,
url:url
});

};

window.login=function(){

const user=document.getElementById("user").value;
const pass=document.getElementById("pass").value;

if(user===ADMIN_USER && pass===ADMIN_PASS){

document.getElementById("adminPanel").style.display="block";
document.getElementById("loginPanel").style.display="none";

}else{

alert("login salah");

}

};