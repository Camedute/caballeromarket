// src/firebase/firestore.ts
import { getFirestore } from "@firebase/firestore";
import { getAuth } from 'firebase/auth';
import app from "./firebaseConfig";
import { getStorage } from "firebase/storage";


const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export  {db, auth, storage};
