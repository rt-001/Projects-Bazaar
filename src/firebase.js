import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  doc,
  getFirestore,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAwnUP9CYQc59JCg-_LH8ZH7G5gWiguulg",
  authDomain: "project-fair-5c20a.firebaseapp.com",
  projectId: "project-fair-5c20a",
  storageBucket: "project-fair-5c20a.appspot.com",
  messagingSenderId: "707388084094",
  appId: "1:707388084094:web:4bd015e4a8179dc1a4ad2f",
  measurementId: "G-GRDKKYYDHV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const updateUserDatabase = async (user, uid) => {
  if (typeof user !== "object") return;

  const docRef = doc(db, "users", uid);
  await setDoc(docRef, { ...user, uid });
};

const getUserFromDatabase = async (uid) => {
  const docRef = doc(db, "users", uid);
  const result = await getDoc(docRef);

  if (!result.exists()) return null;
  return result.data();
};

export { app as default, auth, db, updateUserDatabase, getUserFromDatabase };
