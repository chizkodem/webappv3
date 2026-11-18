import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCgucz_ZMOVIJaQef0_UeeKYJtGFbKy-oM",
  authDomain: "chiz-webapp-v3.firebaseapp.com",
  projectId: "chiz-webapp-v3",
  storageBucket: "chiz-webapp-v3.firebasestorage.app",
  messagingSenderId: "786952028131",
  appId: "1:786952028131:web:0dd6c7d83ce13ead896ad6",
  measurementId: "G-DSGJ0X22F5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(
  app,
  "https://chiz-webapp-v3-default-rtdb.asia-southeast1.firebasedatabase.app",
);
