import React, { useState } from "react";
import './styles/navbar.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="nav_logo">Logo</div>
            <div className={`nav_item ${isOpen ? "open" : ""}`}>
                <a href="#">INICIO</a>
                <a href="#">CATEGORIAS</a>
                <a href="#">LOCALES</a>
                <a href="#">PERFIL</a>
                <a href="#">CARRITOS</a>
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

<>
{/* <header className="Header">
    <Link to="/">
    <button className="Inicio">
        <p>Inicio</p>
    </button></Link>
    <Link to="/Categorias">
    <button>
        <p>Categorias</p>
    </button>
    </Link>
    <Link to ="/Locales">
    <button>
        <p>Locales</p>
    </button>
    </Link>
    <Link to="/Perfil">
    <button>
        <p>Perfil</p>
    </button>
    </Link>
    <Link to="/Carrito">
    <button>
        <p>Carrito</p>
    </button>
    </Link>
</header> */}
</>

