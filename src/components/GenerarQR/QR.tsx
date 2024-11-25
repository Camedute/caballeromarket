import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import './QR.css';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import {db} from '../firebase/firestore';
import { Timestamp } from 'firebase/firestore';

interface pedidoData {
  listaProductos: Array<string>;
  fechaPedido: string;
  metodoPago: string;
  idCliente: string;
}

interface ProductoPedido {
  cantidadProducto: number;
  id: string;
  nombreProducto: string;
}



function QR() {
  const { id } = useParams<{ id: string }>();
  const [formDataPedido, setFormDataPedido] = useState<pedidoData>({
    listaProductos: [],
    fechaPedido: "",
    metodoPago: "",
    idCliente: ""
  });
  const [nombreCliente, setNombreCliente] = useState<string>("");

  useEffect(() => {
    if (id) {
      extraerDataPedido(id);
    }
  }, [id]);

  const extraerDataPedido = async (id: string) => {
    try {
      const pedidoRef = doc(db, 'Pedidos', id);
      const pedidoSnap = await getDoc(pedidoRef);
      if (pedidoSnap.exists()) {
        const pedidoData = pedidoSnap.data();
        const fechaPedido = (pedidoData.fecha as Timestamp).toDate().toLocaleString();
        const listaProductos = Object.entries(pedidoData.listaPedidos).map(
          ([idProducto, datosProducto]) => {
            const producto = datosProducto as ProductoPedido; // Cast explícito
            const nombreProducto = producto.nombreProducto || "Producto desconocido";
            const cantidad = producto.cantidadProducto || 0;
            return `${nombreProducto}: ${cantidad} unidades`;
          }
        );
        
        

        setFormDataPedido({
          listaProductos,
          fechaPedido,
          metodoPago: pedidoData.metodoPago,
          idCliente: pedidoData.idCliente
        });

        extraerNombreCliente(pedidoData.idCliente);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const extraerNombreCliente = async (idCliente: string) => {
    try {
      const clienteRef = doc(db, 'Clientes', idCliente);
      const clienteSnap = await getDoc(clienteRef);
      if (clienteSnap.exists()) {
        const clienteData = clienteSnap.data();
        setNombreCliente(clienteData.nombreUsuario);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(formDataPedido);
  return (
    <>
      <Header />
      <div className="qr-container">
        <h2 className="title">Código QR de tu pedido</h2>

        <div className="qr-card">
          <div className="qr-code-wrapper">
            {id ? (
              <QRCode
                value={id}
                fgColor="black"
                bgColor="white"
                size={200}
                style={{ height: "350px", width: "350px" }}
              />
            ) : (
              <p>No se pudo generar el código QR.</p>
            )}
          </div>

          <div className="qr-info-table">
            <table>
              <tbody>
                <tr>
                  <td><strong>Cliente:</strong></td>
                  <td>{nombreCliente}</td>
                </tr>
                <tr>
                  <td><strong>Método de Pago:</strong></td>
                  <td>{formDataPedido.metodoPago}</td>
                </tr>
                <tr>
                  <td><strong>Fecha del Pedido:</strong></td>
                  <td>{formDataPedido.fechaPedido}</td>
                </tr>
                <tr>
                  <td><strong>Productos:</strong></td>
                  <td>
                    <ul>
                      {formDataPedido.listaProductos.map((producto, index) => (
                        <li key={index}>{producto}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="qr-description">
          Escanea el código QR para pagar tu pedido.
        </p>
      </div>

      <Footer />
    </>
  );
}

export default QR;
