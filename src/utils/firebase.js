// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBG1xmTUvo9Gq5Huage3B338ryztQeS_cg",
  authDomain: "vidify-cf0c7.firebaseapp.com",
  projectId: "vidify-cf0c7",
  storageBucket: "vidify-cf0c7.appspot.com",
  messagingSenderId: "590831569585",
  appId: "1:590831569585:web:4be6e7656ad96f833ab090",
  measurementId: "G-3XSWDZMR4E"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);