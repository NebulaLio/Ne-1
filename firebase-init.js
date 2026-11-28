import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

window.nebulaFirebase = {
  auth,
  db,
  provider,
  signIn: () => signInWithPopup(auth, provider),
  signOut: () => signOut(auth),
  async saveScore(score) {
    const user = auth.currentUser;
    if (!user) throw new Error("NOT_SIGNED_IN");
    const ref = doc(db, "users", user.uid, "gpScores", score.id);
    const payload = {
      id: score.id,
      title: score.meta?.title || "未命名多軌譜例",
      bpm: score.meta?.bpm || 120,
      timeSig: (score.meta?.timeSignature || [4, 4]).join("/"),
      trackCount: Array.isArray(score.tracks) ? score.tracks.length : 1,
      updatedAt: Date.now(),
      data: JSON.stringify(score)
    };
    await setDoc(ref, payload, { merge: true });
    return payload;
  },
  async listScores() {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(collection(db, "users", user.uid, "gpScores"), orderBy("updatedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  },
  async deleteScore(scoreId) {
    const user = auth.currentUser;
    if (!user) throw new Error("NOT_SIGNED_IN");
    await deleteDoc(doc(db, "users", user.uid, "gpScores", scoreId));
  }
};

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

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (loginBtn) loginBtn.hidden = true;
      if (logoutBtn) logoutBtn.hidden = false;
      if (userDisplay) userDisplay.textContent = user.displayName || user.email;

      try {
        await setDoc(doc(db, "users", user.uid, "profile", "info"), {
          displayName: user.displayName,
          email: user.email,
          lastLogin: new Date().toISOString()
        });
        console.log("資料寫入成功");
      } catch (e) {
        console.error("寫入失敗", e);
      }
    } else {
      if (loginBtn) loginBtn.hidden = false;
      if (logoutBtn) logoutBtn.hidden = true;
      if (userDisplay) userDisplay.textContent = "";
    }

    try {
      window.dispatchEvent(new CustomEvent("nebula:authchange", { detail: { user: user || null } }));
    } catch {
      /* ignore */
    }
  });
});

console.log("Firebase 初始化成功");
