/* ============================================================================
   Nebula · Guitar Pro LocalStorage + Firebase Firestore Cloud Sync (IIFE)
   ============================================================================ */
(function (global) {
  "use strict";

  const NS = (global.NebulaGP = global.NebulaGP || {});
  const DRAFT_KEY = "nebula-gp-draft-v2";
  const LIB_KEY   = "nebula-gp-library-v2";

  function saveDraftLocal(score) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(score));
      return true;
    } catch {
      return false;
    }
  }

  function loadDraftLocal() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.tracks) && parsed.tracks.length > 0) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  function listLocalScores() {
    try {
      const raw = localStorage.getItem(LIB_KEY);
      const list = JSON.parse(raw || "[]");
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function saveScoreLocal(score) {
    const list = listLocalScores();
    const copy = JSON.parse(JSON.stringify(score));
    copy.meta.updatedAt = Date.now();
    const idx = list.findIndex(function (item) { return item.id === copy.id; });
    if (idx >= 0) list[idx] = copy;
    else list.unshift(copy);
    localStorage.setItem(LIB_KEY, JSON.stringify(list.slice(0, 60)));
    return copy;
  }

  function deleteScoreLocal(scoreId) {
    const list = listLocalScores().filter(function (item) { return item.id !== scoreId; });
    localStorage.setItem(LIB_KEY, JSON.stringify(list));
  }

  function getFirebaseBridge() {
    return global.nebulaFirebase || null;
  }

  function isCloudSignedIn() {
    return Boolean(
      (global.nebulaFirebase && global.nebulaFirebase.auth && global.nebulaFirebase.auth.currentUser) ||
      (global.firebaseAuth && global.firebaseAuth.currentUser)
    );
  }

  async function saveScoreCloud(score) {
    const fb = getFirebaseBridge();
    if (!fb) throw new Error("FIREBASE_NOT_READY");
    if (!isCloudSignedIn()) throw new Error("NOT_SIGNED_IN");
    const copy = JSON.parse(JSON.stringify(score));
    copy.meta.updatedAt = Date.now();
    return fb.saveScore(copy);
  }

  async function listCloudScores() {
    const fb = getFirebaseBridge();
    if (!fb || !isCloudSignedIn()) return [];
    const rows = await fb.listScores();
    return rows.map(function (r) {
      try {
        return typeof r.data === "string" ? JSON.parse(r.data) : r;
      } catch {
        return null;
      }
    }).filter(Boolean);
  }

  async function deleteScoreCloud(scoreId) {
    const fb = getFirebaseBridge();
    if (!fb || !isCloudSignedIn()) throw new Error("NOT_SIGNED_IN");
    return fb.deleteScore(scoreId);
  }

  NS.Storage = {
    saveDraftLocal: saveDraftLocal,
    loadDraftLocal: loadDraftLocal,
    listLocalScores: listLocalScores,
    saveScoreLocal: saveScoreLocal,
    deleteScoreLocal: deleteScoreLocal,
    getFirebaseBridge: getFirebaseBridge,
    isCloudSignedIn: isCloudSignedIn,
    saveScoreCloud: saveScoreCloud,
    listCloudScores: listCloudScores,
    deleteScoreCloud: deleteScoreCloud
  };
})(window);
