// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, getDocs, updateDoc, doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0wBJfSQnnIs89dVAhwxl3t9dA30w4x_8",
    authDomain: "task-8b82f.firebaseapp.com",
    projectId: "task-8b82f",
    storageBucket: "task-8b82f.firebasestorage.app",
    messagingSenderId: "286576010194",
    appId: "1:286576010194:web:48212766c1997748c75e0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export{app, db, getFirestore, collection, deleteDoc, getDocs, addDoc, updateDoc, doc }