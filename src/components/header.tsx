import React from "react";
import './styles/header.css'

function Header(){
    return(
        <>
        <header className="Header">
            <button>
                <p>Inicio</p>
            </button>

            <button>
                <p>Categorias</p>
            </button>

            <button>
                <p>Locales</p>
            </button>

            <button>
                <p>Perfil</p>
            </button>

            <button>
                <p>Carrito</p>
            </button>
            
        </header>
        </>
    );
}
export default Header