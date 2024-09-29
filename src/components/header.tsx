import React, { useState, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles/navbar.css';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Tipos específicos en TypeScript
  const navigate = useNavigate(); // Hook para redirigir

  // Función que maneja la búsqueda
  const handleSearch = (e: KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ((e as KeyboardEvent).key === "Enter" || e.type === "click") {
      navigate(`/buscar/${searchQuery}`); // Redirige a la página de resultados
    }
  };

  return (
    <header className="navbar">
      <div className="nav_logo">Caballero Market</div>
      <div className={`nav_item ${isOpen ? "open" : ""}`}>
        <input
          id="buscarProducto"
          placeholder="Busque un producto en específico"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Guardamos el valor del input
          onKeyDown={(e) => handleSearch(e)} // Captura Enter
          
        />
        <button className="BuscarBoton" onClick={(e) => handleSearch(e)}>Buscar</button> {/* Botón de buscar */}
        
        <Link to="/home">INICIO</Link>
        <Link to="/Categorias">CATEGORIAS</Link>
        <Link to="/Locales">LOCALES</Link>
        <Link to="/Perfil">PERFIL</Link>
        <Link to="/Carrito">CARRITO</Link>
        <Link to="/">LogOut</Link>
      </div>

      <div
        className={`nav_toggle ${isOpen ? "open" : ""}`}
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => console.log(!isOpen), 0); // Verifica el nuevo estado después de actualizar
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
};

export default Header;
