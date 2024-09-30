import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/header";
import './categories.css';
import Footer from "../Footer/footer";

function Categorias() {
    const navigate = useNavigate();

    const categorias = [
        { nombre: "🧻Productos de primera necesidad", id: "basico" },
        { nombre: "🥛Lácteos", id: "lacteos" },
        { nombre: "🥩Carnes", id: "carnes_Embutidos" },
        { nombre: "🥤Bebidas", id: "bebidas" },
        { nombre: "🍬Dulces", id: "dulces" },
        { nombre: "🥖Panadería", id: "pan" },
        { nombre: "🧹Productos de limpieza", id: "limpieza" },
        { nombre: "🪥Cuidado personal", id: "personal" },
        { nombre: "🍎Frutas y verduras", id: "frutas_Verduras" },
        { nombre: "🚬Cigarrillos y otros", id: "otros" }
    ];

    const handleCategoryClick = (id: string) => {
        navigate(`/buscar/categorias/${id}`);
    };

    return (
        <>
            <Header/>
            <br /><br /><br /><br />
            <div className="categorias-container">
                <h1>Categorías de Productos</h1>
                <div className="categorias-list">
                    {categorias.map((categoria, index) => (
                        <div key={index} className="categoria-item">
                            <button onClick={() => handleCategoryClick    (categoria.id)}>
                            {categoria.nombre}
                        </button>
                </div>
                 ))}
                </div>

            </div>
            <Footer />
        </>
    );
}

export default Categorias;
