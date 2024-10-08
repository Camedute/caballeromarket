import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./components/Home/home";
import Categorias from "./components/Categorias/categoria";
import Locales from "./components/Local/local";
import Perfil from "./components/Perfil/perfil";
import Carrito from "./components/Carrito/cart";
import Loginup from "./components/Login/login";
import BuscarProducto from "./components/BuscarProducto/buscarProducto";

function App(){
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Loginup />} />
       <Route path="home" element={<Home />} />
       <Route path="categorias" element={<Categorias />} />
       <Route path="locales" element={<Locales />} />
       <Route path="Perfil" element={<Perfil  />} />
       <Route path="Carrito" element={<Carrito />} />
       <Route path="/buscar/:query" element={<BuscarProducto />} /> {/* Ruta para mostrar resultados */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

