import React from "react";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import './Home.css';

function Home() {
    return (
        <>
            <Header />
            <main className="home-container">
                <section className="hero">
                    <div className="hero-content">
                        <h1>Bienvenido a Caballero Market</h1>
                        <p>Buscamos ayudarte con tus compras.</p>
                        <button className="cta-button">Comienza!</button>
                    </div>
                </section>
                <section className="features">
                    <h2>Nuestras Caracteristicas</h2>
                    <div className="feature-list">
                        <div className="feature-item">
                            <h3>Eficaces</h3>
                            <p>Buscamos ayudarte con tu compras de la mejor forma posible.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Seguridad</h3>
                            <p>Mantenemos tus datos con la mayor privacidad posible.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Sencillez</h3>
                            <p>Te aseguramos que tu estancia en la pagina sera lo mas sencillo de enteder.</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Home;
