import QRCode from "react-qr-code";
import './QR.css';
import Header from '../Header/header'; 
import Footer from '../Footer/footer';

function QR() {
  const qrValue = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Valor del QR

  return (
    <>
      <Header />
      <div className="qr-container">
        <h2 className="title">Codigo QR de tu pedido</h2>

        <div className="qr-code-wrapper">
          <QRCode
            value={qrValue}
            fgColor="black"
            bgColor="white"
            size={200}
            style={{ height: "350px", width: "350px" }}
          />
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
