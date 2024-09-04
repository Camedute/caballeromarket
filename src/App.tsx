import React from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "./firebase/firestore";
import Home from "./components/home";

function App(){
  return (
    <div>
      <Home></Home>
    </div>
  );
};

export default App;

