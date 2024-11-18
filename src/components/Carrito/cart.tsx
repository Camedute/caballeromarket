import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {db, auth} from '../firebase/firestore'; 
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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
      const pedidosCollection = collection(db, 'Pedidos'); 
      const pedidosSnapshot = await getDocs(pedidosCollection);
      const pedidosList: Producto[] = [];

      for (const doc of pedidosSnapshot.docs) {
        const pedidoData = doc.data();
        const pedido = {
          id: doc.id,
          idCliente: pedidoData.idCliente,
          realizado: pedidoData.realizado
        } as Producto;

        pedidosList.push(pedido);
      }

      setPedidos(pedidosList);
      fetchClientes(pedidosList);
    };

    fetchPedidos().finally(() => setLoading(false)); 
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else setUid(null);
    });
    return () => unsubscribe();
  }, []);

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
