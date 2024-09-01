// src/App.tsx
import React from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "./firebase/firestore";
import Home from "./components/home";

const App: React.FC = () => {
  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: "John Doe",
        email: "john@example.com",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <h1>Hello Firebase with React & TypeScript!</h1>
      <button onClick={addData}>Add Data</button>
      <Home></Home>
    </div>
  );
};

export default App;

