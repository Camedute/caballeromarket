// src/firebase/firestore.ts
import { getFirestore } from "@firebase/firestore";
import { getAuth } from 'firebase/auth';
import app from "./firebaseConfig";


const db = getFirestore(app);
const auth = getAuth(app);

export  {db, auth};
