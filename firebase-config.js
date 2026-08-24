/* =========================================================
   FIREBASE CONFIGURATION
   Safe default template for repository use.
   ========================================================= */

const firebaseConfig = {
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_PROJECT_ID",
  storageBucket: "REPLACE_WITH_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_APP_ID"
};

if (typeof firebase !== "undefined") {
  const hasTemplateValues = Object.values(firebaseConfig).some((value) =>
    String(value).startsWith("REPLACE_WITH_")
  );

  if (!hasTemplateValues && (!firebase.apps || firebase.apps.length === 0)) {
    firebase.initializeApp(firebaseConfig);
  } else if (hasTemplateValues) {
    console.warn("Firebase config is not set. Update js/firebase-config.js with your project values.");
  }
}

const db = typeof firebase !== "undefined" && firebase.firestore ? firebase.firestore() : null;
const auth = typeof firebase !== "undefined" && firebase.auth ? firebase.auth() : null;
