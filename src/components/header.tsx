import React, { useState } from "react";
import './styles/navbar.css';
import { Link } from "react-router-dom";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="nav_logo">Caballero Market</div>
            <div className={`nav_item ${isOpen ? "open" : ""}`}>
                <Link to="/home">
                    <a>INICIO</a>
                </Link>
                <Link to="/Categorias">
                    <a>CATEGORIAS</a>
                </Link>
                <Link to="/Locales">
                    <a>LOCALES</a>
                </Link>
                <Link to="/Perfil">
                    <a>PERFIL</a>
                </Link>
                <Link to="/Carrito">
                    <a>CARRITO</a>
                </Link>
                <Link to="/"><a>LogOut</a></Link>
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


