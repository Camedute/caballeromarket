import React from 'react';
import QRCode from "react-qr-code";
import './QR.css';
import Header from '../Header/header'; 
import Footer from '../Footer/footer';
import { useParams } from 'react-router-dom'; // Para acceder a los parámetros de la URL

function QR() {
  const { id } = useParams<{ id: string }>(); // Obtén el ID desde la URL

  return (
    <>
      <Header />
      <div className="qr-container">
        <h2 className="title">Código QR de tu pedido</h2>

        <div className="qr-code-wrapper">
          {id ? ( // Verifica que id tenga un valor
            <QRCode
              value={id} // Usa el id directamente para el QR
              fgColor="black"
              bgColor="white"
              size={200}
              style={{ height: "350px", width: "350px" }}
            />
          ) : (
            <p>No se pudo generar el código QR.</p>
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
