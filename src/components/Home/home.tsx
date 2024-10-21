import React from "react";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import './Home.css';
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <>
            <Header />
            <main className="dashboard-container">
                <section className="dashboard-header">
                    <h1>Panel de Control del Dueño</h1>
                    <p>Administra tu tienda y revisa la actividad reciente.</p>
                </section>

                <section className="dashboard-overview">
                    <div className="overview-item">
                        <h2>Total de Productos</h2>
                        <p>25 productos</p>
                    </div>
                    <div className="overview-item">
                        <h2>Pedidos Recientes</h2>
                        <p>5 pedidos pendientes</p>
                    </div>
                    <div className="overview-item">
                        <h2>Ventas del Mes</h2>
                        <p>$2,500.00</p>
                    </div>
                </section>

                <section className="dashboard-actions">
                    <h2>Acciones Rápidas</h2>
                    <div className="actions-list">
                        <Link to = {"/Inventario"}>
                        <button className="action-button">Agregar Producto</button></Link>
                        <Link to = {"/carrito"}>
                        <button className="action-button">Ver Pedidos</button></Link>
                        <Link to = {"/Perfil"}>
                        <button className="action-button">Editar Perfil</button></Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Home;
