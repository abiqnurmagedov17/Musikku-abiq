import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: AIzaSyDAvFkn_GT6YROhlOBfu5JYvYljBK_ss1o",
  authDomain: "musik-web-app.firebaseapp.com",
  databaseURL: "https://musik-web-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "musik-web-app"
};

// KREDENSIAL HANYA DI SATU TEMPAT: sini!
const ADMIN_USER = "admin";
const ADMIN_PASS = "musik";  // ganti sesuai keinginan

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const playlist = document.getElementById("playlist");
const searchInput = document.getElementById("search");

let songs = [];

function render(list) {
  playlist.innerHTML = "";
  list.forEach(song => {
    const div = document.createElement("div");
    div.className = "song";

    const title = document.createElement("p");
    title.innerText = song.title;

    const audio = document.createElement("audio");
    audio.src = song.url;
    audio.controls = true;

    div.appendChild(title);
    div.appendChild(audio);
    playlist.appendChild(div);
  });
}

// Firebase listener
onValue(ref(db, "musik"), snapshot => {
  songs = [];
  const data = snapshot.val();
  if (!data) return;

  for (const key in data) {
    songs.push(data[key]);
  }
  render(songs);
});

// Search
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = songs.filter(song => 
    song.title.toLowerCase().includes(keyword)
  );
  render(filtered);
});

// ===== FUNGSI LOGIN (dipanggil dari HTML) =====
window.loginAdmin = function(user, pass) {
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem("admin", "true");
    // Beritahu HTML bahwa login berhasil
    if (typeof window.updateAdminUI === 'function') {
      window.updateAdminUI(true);
    }
    // Tutup modal (panggil fungsi dari HTML)
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) closeBtn.click();
  } else {
    alert("Username atau password salah!");
  }
};

// ===== FUNGSI UPLOAD (dipanggil dari HTML) =====
window.uploadSong = function(title, url) {
  push(ref(db, "musik"), {
    title: title,
    url: url
  }).then(() => {
    console.log("Upload sukses:", title);
  }).catch(err => {
    alert("Gagal upload: " + err.message);
  });
};

// Cek status login saat load
if (localStorage.getItem("admin") === "true") {
  // Kasih tahu HTML kalau admin sudah login
  setTimeout(() => {
    if (typeof window.updateAdminUI === 'function') {
      window.updateAdminUI(true);
    }
  }, 100);  // sedikit delay biar HTML siap
}