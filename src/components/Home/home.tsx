import React, { useEffect, useState } from "react";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import './Home.css';
import { Link, useNavigate } from "react-router-dom";
import {db} from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

interface Productos {
    id: string;
    idDueno: string;
    nombreProducto: string;
    cantidadProducto: string;
    precioProducto: string;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [formDataProductos, setFormDataProducto] = useState<Productos[]>([]);
    const [ventasDelMes, setVentasDelMes] = useState<number>(2500); // Ejemplo de ventas
    const [clientesRecientes, setClientesRecientes] = useState<number>(45); // Ejemplo de clientes recientes
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            console.warn("Usuario no autenticado. Redirigiendo al login.");
            navigate('/');
            return;
        }

        const { uid } = JSON.parse(user);
        if (uid) {
            extraerDataProductos(uid);
        }
    }, [navigate]);

    const extraerDataProductos = async (uid: string) => {
        try {
            const InventarioRef = doc(db, 'Inventario', uid);
            const productoSnap = await getDoc(InventarioRef);

            if (productoSnap.exists()) {
                const productosData = productoSnap.data();
                if (productosData.productos && Array.isArray(productosData.productos)) {
                    const listaProductos = productosData.productos.map((producto: any) => ({
                        id: producto.id,
                        idDueno: producto.idDueno,
                        nombreProducto: producto.nombreProducto,
                        cantidadProducto: producto.cantidadProducto,
                        precioProducto: producto.precioProducto,
                    }));
                    setFormDataProducto(listaProductos);
                } else {
                    setError("No hay productos disponibles.");
                }
            } else {
                setError("El documento no existe.");
            }
        } catch (error) {
            console.error("Error al extraer datos de productos:", error);
            setError("Error al cargar los datos.");
        }
    };

    return (
        <>
            <Header />
            <main className="dashboard-container">
                <section className="dashboard-header">
                    <h1>Panel de Control</h1>
                    <p>Administra tu Pyme y revisa la actividad reciente.</p>
                </section>
                <section className="dashboard-overview">
                    <div className="overview-item">
                        <h2>Tus productos</h2>
                        <div className="productos-list">
                            {formDataProductos.map((producto) => (
                                <div key={producto.id} className="producto-box">
                                    <h3>{producto.nombreProducto}</h3>
                                    <p>Cantidad: {producto.cantidadProducto}</p>
                                </div>
                            ))}
                        </div>
                        <Link to={"/Inventario"}>
                            <button className="action-button">Ver mis productos</button>
                        </Link>
                    </div>

                    <div className="overview-item">
                        <h2>Pedidos Recientes</h2>
                        <p>{formDataProductos.length} productos en total</p>
                        <Link to={"/carrito"}>
                            <button className="action-button">Ver Pedidos</button>
                        </Link>
                    </div>

                    <div className="overview-item">
                        <h2>Ventas del Mes</h2>
                        <p>${ventasDelMes.toFixed(2)}</p>
                        <Link to={"/Finances"}>
                            <button className="action-button">Ver tus finanzas</button>
                        </Link>
                    </div>

                    <div className="overview-item">
                        <h2>Clientes Recientes</h2>
                        <p>{clientesRecientes} nuevos clientes</p>
                        <Link to={"/Clientes"}>
                            <button className="action-button">Ver Clientes</button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Home;
