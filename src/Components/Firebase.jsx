// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth , signInWithEmailAndPassword, createUserWithEmailAndPassword , updateProfile,deleteUser  } from "firebase/auth";
import { getFirestore ,collection, addDoc,deleteDoc,query,getDocs,doc,updateDoc ,serverTimestamp} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD2k4pwG-3ko1LuyWJeG_iJjIfsunKVTYs",
  authDomain: "faithfinity-a7e0c.firebaseapp.com",
  projectId: "faithfinity-a7e0c",
  storageBucket: "faithfinity-a7e0c.appspot.com",
  messagingSenderId: "1021017580317",
  appId: "1:1021017580317:web:680cc70cc9d34499c037f4",
  measurementId: "G-7Q6VGRNBYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


export {auth,app, signInWithEmailAndPassword,createUserWithEmailAndPassword,serverTimestamp,db,collection,addDoc,updateProfile,deleteDoc,query,deleteUser,getDocs,doc,updateDoc}
