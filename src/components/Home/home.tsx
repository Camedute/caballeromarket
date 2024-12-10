import React, { useEffect, useState } from "react";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firestore";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

interface Productos {
  id: string;
  idDueno: string;
  nombreProducto: string;
  cantidadProducto: string;
  precioProducto: string;
}

interface Ventas {
  Ganancia: number;
  Costo: number;
}

interface Pedido {
  id: string;
  idDueno: string;
  idCliente: string;
  listaPedidos: any; // Detalle de los productos
  metodoPago: string;
  realizado: boolean;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [formDataProductos, setFormDataProducto] = useState<Productos[]>([]);
  const [gananciasHome, setGananciasHome] = useState<number>(0); // Ventas
  const [pedidos, setPedidos] = useState<Pedido[]>([]); // Pedidos filtrados por dueño
  const [clientesRecientes, setClientesRecientes] = useState<number>(45); // Ejemplo de clientes recientes
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      console.warn("Usuario no autenticado. Redirigiendo al login.");
      navigate("/");
      return;
    }

    const { uid } = JSON.parse(user);
    if (uid) {
      extraerDataProductos(uid);
      extraerDataVentas(uid);
      extraerDataPedidos(uid);
    }
  }, [navigate]);

  const extraerDataProductos = async (uid: string) => {
    try {
      const InventarioRef = doc(db, "Inventario", uid);
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

  const extraerDataVentas = async (uid: string) => {
    try {
      const ventasRef = doc(db, "Ventas", uid);
      const ventasSnap = await getDoc(ventasRef);
      if (ventasSnap.exists()) {
        const ventasData = ventasSnap.data();
        if (ventasData.gananciaTotal) {
          setGananciasHome(ventasData.gananciaTotal); // Asume que es un número
        } else {
          setError("No se encontraron datos de ganancias.");
        }
      } else {
        setError("El documento de ventas no existe.");
      }
    } catch (error) {
      console.error("Error al extraer datos de ventas:", error);
      setError("Error al cargar las ganancias.");
    }
  };

  const extraerDataPedidos = async (uid: string) => {
    try {
      const pedidosCollection = collection(db, "Pedidos");
      const pedidosSnapshot = await getDocs(pedidosCollection);

      const pedidosFiltrados = pedidosSnapshot.docs.map((doc) => {
          const pedidoData = doc.data();
          return {
            id: doc.id,
            idDueno: pedidoData.idDueno || "",
            idCliente: pedidoData.idCliente || "",
            listaPedidos: pedidoData.listaPedidos || [],
            metodoPago: pedidoData.metodoPago || "N/A",
            realizado: pedidoData.realizado || false,
          } as Pedido;
        })
        .filter((pedido) => pedido.idDueno === uid);

      setPedidos(pedidosFiltrados);
    } catch (error) {
      console.error("Error al extraer datos de pedidos:", error);
      setError("Error al cargar los pedidos.");
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
                    

                    {/*Me falta filtrar acá*/} 
                    <div className="overview-item">
                        <h2>Pedidos Recientes</h2>
                        <p>{pedidos.length} productos en total</p>
                        <Link to={"/carrito"}>
                            <button className="action-button">Ver Pedidos</button>
                        </Link>
                    </div>

                    <div className="overview-item">
                        <h2>Ganancias de tu local</h2>
                        <p>${gananciasHome}</p>
                        <Link to={"/finances"}>
                            <button className="action-button">Ver tus finanzas</button>
                        </Link>
                    </div>


                    {/* Para qué nos sirve?
                    <div className="overview-item">
                        <h2>Clientes Recientes</h2>
                        <p>{clientesRecientes} nuevos clientes</p>
                        <Link to={"/Clientes"}>
                            <button className="action-button">Ver Clientes</button>
                        </Link>
                    </div>
                    */}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Home;
