import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa componentes
import Home from "./components/Home/home";
import Categorias from "./components/Categorias/categoria";
import Perfil from "./components/Perfil/perfil";
import Carrito from "./components/Carrito/cart";
import Loginup from "./components/Login/login";
import BuscarProducto from "./components/BuscarProducto/buscarProducto";
import QR from "./components/GenerarQR/QR";
import Inventario from "./components/Inventario/Inventario";
import Register from "./components/Register/register";
import ResetPassword from "./components/resetPassword/resetPassword";
import Finances from "./components/finances/finances";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginup />} />
        <Route path="home" element={<Home />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="/buscar/:query" element={<BuscarProducto />} />
        <Route path="/QR/:id" element={<QR />} /> {/* Ajuste aquí */}
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/finances" element={<Finances />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
