import React, { useState, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import './header.css'; // Asegúrate de actualizar este archivo con los nuevos estilos

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (e: KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ((e as KeyboardEvent).key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        navigate(`/buscar/${searchQuery}`);
      }
    }
  };

  return (
    <header className="navbar">
      <div className="nav_logo">Caballero Market</div>
      <div className={`nav_items ${isOpen ? "open" : ""}`}>
        
        <nav className="nav_links">
          <Link to="/home">Inicio</Link>
          <Link to="/Inventario">Inventarios</Link>
          <Link to="/finances">Finanzas</Link>
          <Link to="/Perfil">Perfil</Link>
          <Link to="/Carrito">Pedidos</Link>
          <Link to="/">Cerrar Sesión</Link>
        </nav>
      </div>

      <div className={`nav_toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
};

export default Header;
