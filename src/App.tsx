import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import db from "./firebase/firestore";
import Home from "./components/home";
import Categorias from "./components/categoria";
import Locales from "./components/local";
import Perfil from "./components/perfil";
import Carrito from "./components/cart";

function App(){
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="categorias" element={<Categorias />} />
       <Route path="locales" element={<Locales />} />
       <Route path="Perfil" element={<Perfil />} />
       <Route path="Carrito" element={<Carrito />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

