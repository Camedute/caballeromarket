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
      if (searchQuery.trim()) { // Solo ejecuta la búsqueda si hay contenido
        navigate(`/buscar/${searchQuery}`); // Redirige a la página de resultados
      }
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
        <button
          className="BuscarBoton"
          onClick={(e) => handleSearch(e)}
          disabled={!searchQuery.trim()} // Deshabilita el botón si el campo está vacío
        >
          Buscar
        </button>

        <Link to="/home"><button>Inicio</button></Link>
        <Link to="/Categorias"><button>Categorias</button></Link>
        <Link to="/Locales"><button>Locales</button></Link>
        <Link to="/Perfil"><button>Perfil</button></Link>
        <Link to="/Carrito"><button>Carrito de compras</button></Link>
        <Link to="/"><button>Cerrar Sesión</button></Link>
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
