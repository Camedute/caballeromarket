import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./components/home";
import Categorias from "./components/categoria";
import Locales from "./components/local";
import Perfil from "./components/perfil";
import Carrito from "./components/cart";
import Loginup from "./components/login";

function App(){
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Loginup />} />
       <Route path="home" element={<Home />} />
       <Route path="categorias" element={<Categorias />} />
       <Route path="locales" element={<Locales />} />
       <Route path="Perfil" element={<Perfil />} />
       <Route path="Carrito" element={<Carrito />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

