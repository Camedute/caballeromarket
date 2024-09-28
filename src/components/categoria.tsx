import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import './styles/categories.css'

function Categorias() {
    const navigate = useNavigate();

    const categorias = [
        { nombre: "Alimentos básicos", id: "basico" },
        { nombre: "Lácteos y sus derivados", id: "lacteos" },
        { nombre: "Carnes y embutidos", id: "carnes_Embutidos" },
        { nombre: "Bebidas", id: "bebidas" },
        { nombre: "Dulces", id: "dulces" },
        { nombre: "Panadería", id: "pan" },
        { nombre: "Productos de limpieza", id: "limpieza" },
        { nombre: "Cuidado personal", id: "personal" },
        { nombre: "Frutas y verduras", id: "frutas_Verduras" },
        { nombre: "Cigarrillos y otros", id: "otros" }
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
                            <h2 onClick={() => handleCategoryClick(categoria.id)}>
                                {categoria.nombre}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Categorias;
