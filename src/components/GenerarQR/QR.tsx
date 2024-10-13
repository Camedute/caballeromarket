import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import db from '../../firebase/firestore'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';
import './QR.css';
import Header from '../Header/header'; 
import Footer from '../Footer/footer';
import { useParams } from 'react-router-dom'; // Para acceder a los parámetros de la URL

function QR() {
  const { id } = useParams<{ id: string }>(); // Obtén el ID del pedido desde la URL
  const [qrValue, setQrValue] = useState(''); // Valor del QR

  useEffect(() => {
    const fetchData = async () => {
      if (id) { // Verifica que id no sea undefined
        const docRef = doc(db, 'Pedidos', id); // Referencia al documento de Firestore usando el ID del pedido
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Establece el ID del pedido como valor del QR
          setQrValue(id); 
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('ID del pedido no disponible');
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Header />
      <div className="qr-container">
        <h2 className="title">Código QR de tu pedido</h2>

        <div className="qr-code-wrapper">
          {qrValue ? (
            <QRCode
              value={qrValue}
              fgColor="black"
              bgColor="white"
              size={200}
              style={{ height: "350px", width: "350px" }}
            />
          ) : (
            <p>Cargando código QR...</p>
          )}
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
