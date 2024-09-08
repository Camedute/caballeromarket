import React from "react";
import { Link } from "react-router-dom";
import './styles/header.css'

function Header(){
    return(
        <>
        <header className="Header">
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
        </header>
        </>

    );
}

export default Header