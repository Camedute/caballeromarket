import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la navegación
import db from '../../firebase/firestore'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import './Cart.css';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import { Spinner } from 'react-bootstrap'; // Importa el spinner de React Bootstrap

interface Producto {
  id: string; // ID de Firestore
  nombre: string;
  precio: number;
  cantidad: number;
  idCliente: string; // Agregamos idCliente para poder usarlo más adelante
  realizado: boolean; // Agregamos el campo realizado
}

interface Cliente {
  id: string; // ID de Firestore
  nombreUsuario: string; // Nombre del cliente
}

const Carrito: React.FC = () => {
  const [pedidos, setPedidos] = useState<Producto[]>([]); // Estado para los pedidos de Firestore
  const [clientes, setClientes] = useState<{ [key: string]: string }>({}); // Mapa para los nombres de clientes
  const [loading, setLoading] = useState(true); // Estado para el loading
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosCollection = collection(db, 'Pedidos'); // Colección de pedidos en Firestore
      const pedidosSnapshot = await getDocs(pedidosCollection);
      const pedidosList: Producto[] = [];

      for (const doc of pedidosSnapshot.docs) {
        const pedidoData = doc.data();
        const pedido = {
          id: doc.id,
          idCliente: pedidoData.idCliente, // Asegúrate de incluir idCliente aquí
          realizado: pedidoData.realizado // Incluimos el campo realizado
        } as Producto;

        pedidosList.push(pedido);
      }

      setPedidos(pedidosList);
      fetchClientes(pedidosList); // Llamamos a la función para obtener los nombres de los clientes
    };

    fetchPedidos().finally(() => setLoading(false)); // Set loading a false después de que se haya terminado de cargar
  }, []);

  const fetchClientes = async (pedidosList: Producto[]) => {
    const clientesMap: { [key: string]: string } = {}; // Mapa para almacenar los nombres de los clientes

    for (const pedido of pedidosList) {
      const clienteRef = doc(db, 'Clientes', pedido.idCliente); // Referencia al cliente usando el idCliente
      const clienteSnap = await getDoc(clienteRef);

      if (clienteSnap.exists()) {
        const clienteData = clienteSnap.data();
        clientesMap[pedido.idCliente] = clienteData.nombreUsuario as string; // Almacenamos el nombre del cliente en el mapa
      }
    }

    setClientes(clientesMap); // Establecemos el estado con los nombres de los clientes
  };

  return (
    <>
      <Header />
      <div className="carrito-container">
        <h2 className="title">Pedidos Consultados</h2>
        <div className="carrito">
          {loading ? ( // Mostrar el spinner mientras se carga
            <Spinner animation="border" variant="primary" />
          ) : pedidos.length === 0 ? (
            <p>No hay pedidos disponibles.</p>
          ) : (
            pedidos.map((pedido) => (
              <div 
                className={`carrito-item ${pedido.realizado ? 'realizado' : 'no-realizado'}`} // Aplica la clase según el estado
                key={pedido.id}
              >
                <p>Pedido de: {clientes[pedido.idCliente] || 'Cargando nombre...'}</p> {/* Muestra el nombre del cliente */}
                <button 
                  className="btn-generar-qr" 
                  onClick={() => navigate(`/QR/${pedido.id}`)} 
                  disabled={pedido.realizado} // Deshabilita el botón si realizado es true
                >
                  {pedido.realizado ? 'Pedido ya completado' : 'Generar QR'} {/* Cambia el texto del botón */}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Carrito;
