import React, { useState } from 'react';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './Inventario.css'; // Archivo CSS

interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
}

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Producto 1', cantidad: 10 },
    { id: 2, nombre: 'Producto 2', cantidad: 5 },
    { id: 3, nombre: 'Producto 3', cantidad: 8 },
    { id: 4, nombre: 'Producto 4', cantidad: 15 },
    { id: 5, nombre: 'Producto 5', cantidad: 12 },
  ]);

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    setProductos(
      productos.map((producto) =>
        producto.id === id
          ? { ...producto, cantidad: nuevaCantidad }
          : producto
      )
    );
  };

  return (
    <>
      <Header />
      <div className="inventario-container">
        <h2 className="title">Inventario de Productos(WIK)</h2>
        <div className="productos">
          {productos.map((producto) => (
            <div className="producto-card" key={producto.id}>
              <p>{producto.nombre}</p>
              <input
                type="number"
                min="0"
                className="cantidad-input"
                value={producto.cantidad}
                onChange={(e) =>
                  actualizarCantidad(producto.id, parseInt(e.target.value))
                }
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Inventario;
