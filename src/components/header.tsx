import React, { useState } from "react";
import './styles/navbar.css';
import { Link } from "react-router-dom";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="nav_logo">Caballero Market</div>
            <div className={`nav_item ${isOpen ? "open" : ""}`}>
                <Link to="/home">INICIO</Link>
                <Link to="/Categorias">CATEGORIAS</Link>
                <Link to="/Locales">LOCALES</Link>
                <Link to="/Perfil">PERFIL</Link>
                <Link to="/Carrito">CARRITO</Link>
                <Link to="/">LogOut</Link>
            </div>
            
            <div className={`nav_toggle ${isOpen ? "open" : ""}`} onClick={() => {
                setIsOpen(!isOpen);
                setTimeout(() => console.log(!isOpen), 0); // Verifica el nuevo estado después de actualizar
            }}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
    );
};

export default Header;




