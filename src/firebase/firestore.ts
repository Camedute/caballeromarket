// src/firebase/firestore.ts
import { getFirestore } from "firebase/firestore";
import app from "./firebaseConfig";

const db = getFirestore(app);

export default db;
