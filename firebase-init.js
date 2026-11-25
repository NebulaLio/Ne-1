// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
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

console.log("Firebase 初始化成功");

window.firebaseAuth = auth;
window.firebaseDb = db;