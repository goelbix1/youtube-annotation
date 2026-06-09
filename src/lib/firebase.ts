import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4c90_jFQ-yS8G6KUDL8EocrC5voRCl9o",
  authDomain: "annotation-prototype.firebaseapp.com",
  projectId: "annotation-prototype",
  storageBucket: "annotation-prototype.firebasestorage.app",
  messagingSenderId: "402937700765",
  appId: "1:402937700765:web:d0a77b4972a802bb1e0f74",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
