import React, { useEffect, useState } from "react";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import './Home.css';
import { Link, useNavigate } from "react-router-dom";
import db from '../../firebase/firestore';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

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
    const [error, setError] = useState<string>("");
    const [cantidadPedidos, setCantidadPedidos] = useState<number>(0);

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
            contarPedidos();
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
    }

    const contarPedidos = async () => {
        try {
            const pedidosSnapshot = await getDocs(collection(db, 'Pedidos'));
            setCantidadPedidos(pedidosSnapshot.size);
        } catch (error) {
            console.error("Error al contar pedidos:", error);
            setError("Error al contar los pedidos.");
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
                        <p>{cantidadPedidos} pedidos pendientes</p>
                        <Link to={"/carrito"}>
                            <button className="action-button">Ver Pedidos</button>
                        </Link>
                    </div>
                    <div className="overview-item">
                        <h2>Ventas del Mes (por crear componente)</h2>
                        <p>$2,500.00</p>
                        <Link to={"/Finances"}>
                            <button className="action-button">Ver tus finanzas</button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Home;
