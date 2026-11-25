import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkNzl65mZO2DjbpQy-ouU_GfJ7Ya9ZPvo",
  authDomain: "project-0b863a66-e1b3-4500-b20.firebaseapp.com",
  projectId: "project-0b863a66-e1b3-4500-b20",
  storageBucket: "project-0b863a66-e1b3-4500-b20.firebasestorage.app",
  messagingSenderId: "593943635913",
  appId: "1:593943635913:web:9e397f382204428b692a18",
  measurementId: "G-WS31DXRDSN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

window.firebaseAuth = auth;
window.firebaseDb = db;

// 登入按鈕
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userDisplay = document.getElementById("userDisplay");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      signInWithPopup(auth, provider).catch(err => console.error(err));
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth);
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (loginBtn) loginBtn.hidden = true;
      if (logoutBtn) logoutBtn.hidden = false;
      if (userDisplay) userDisplay.textContent = user.displayName || user.email;
    } else {
      if (loginBtn) loginBtn.hidden = false;
      if (logoutBtn) logoutBtn.hidden = true;
      if (userDisplay) userDisplay.textContent = "";
    }
  });
});

console.log("Firebase 初始化成功");