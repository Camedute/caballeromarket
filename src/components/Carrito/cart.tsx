import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {db, auth} from '../firebase/firestore'; 
import { collection, getDocs, doc, getDoc, where, query } from 'firebase/firestore';
import './Cart.css';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import { Spinner } from 'react-bootstrap'; 
import { onAuthStateChanged } from 'firebase/auth';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  idCliente: string;
  idDueno: string;
  realizado: boolean;
}

interface Cliente {
  id: string;
  nombreUsuario: string;
}

const Carrito: React.FC = () => {
  const [pedidos, setPedidos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const pedidosCollection = collection(db, 'Pedidos');
        const pedidosSnapshot = await getDocs(pedidosCollection);

        const pedidosList: Producto[] = pedidosSnapshot.docs.map((doc) => {
          const pedidoData = doc.data();
          return {
            id: doc.id,
            idCliente: pedidoData.idCliente,
            idDueno: pedidoData.idDueno,
            realizado: pedidoData.realizado,
          } as Producto;
        });

        // Filtrar pedidos en el cliente por el idDueno
        const filteredPedidos = pedidosList.filter((pedido) => pedido.idDueno === uid);
        setPedidos(filteredPedidos);

        // Cargar los clientes relacionados con los pedidos filtrados
        fetchClientes(filteredPedidos);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchClientes = async (pedidosList: Producto[]) => {
      const clientesMap: { [key: string]: string } = {};

      for (const pedido of pedidosList) {
        const clienteRef = doc(db, 'Clientes', pedido.idCliente);
        const clienteSnap = await getDoc(clienteRef);

        if (clienteSnap.exists()) {
          const clienteData = clienteSnap.data();
          clientesMap[pedido.idCliente] = clienteData.nombreUsuario as string;
        }
      }

      setClientes(clientesMap);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchPedidos();
      } else {
        setUid(null);
        setPedidos([]);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  return (
    <>
      <Header />
      <div className="carrito-container">
        <h2 className="title">Pedidos Consultados</h2>
        <div className="carrito">
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : pedidos.length === 0 ? (
            <p>No hay pedidos disponibles.</p>
          ) : (
            pedidos.map((pedido) => (
              <div 
                className={`carrito-item ${pedido.realizado ? 'realizado' : 'no-realizado'}`} 
                key={pedido.id}
              >
                <p>Pedido de: {clientes[pedido.idCliente] || 'Cargando nombre...'}</p>
                <button 
                  className="btn-generar-qr" 
                  onClick={() => navigate(`/QR/${pedido.id}`)} 
                  disabled={pedido.realizado}
                >
                  {pedido.realizado ? 'Pedido ya completado' : 'Generar QR'}
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
