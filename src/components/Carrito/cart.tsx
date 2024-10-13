import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la navegación
import './Cart.css';
import Header from '../Header/header';
import Footer from '../Footer/footer';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const Carrito: React.FC = () => {
  const [carrito, setCarrito] = useState<Producto[]>(() => {
    const storedCart = localStorage.getItem('carrito');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const productosDisponibles: Producto[] = [
    { id: 1, nombre: "Producto A", precio: 50, cantidad: 1 },
    { id: 2, nombre: "Producto B", precio: 30, cantidad: 1 },
    { id: 3, nombre: "Producto C", precio: 20, cantidad: 1 },
  ];

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto: Producto) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);
    if (productoExistente) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, producto]);
    }
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter((producto) => producto.id !== id));
  };

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    setCarrito(
      carrito.map((producto) =>
        producto.id === id
          ? { ...producto, cantidad: nuevaCantidad }
          : producto
      )
    );
  };

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  };

  const navigate = useNavigate(); // Hook para redirigir

  return (
    <>
      <Header />
      <div className="carrito-container">
        <h2 className="title">Productos Disponibles</h2>
        <div className="productos">
          {productosDisponibles.map((producto) => (
            <div className="producto-card" key={producto.id}>
              <p>{producto.nombre} - <strong>${producto.precio}</strong></p>
              <button className="btn-agregar" onClick={() => agregarAlCarrito(producto)}>
                Añadir a Pedidos
              </button>
            </div>
          ))}
        </div>

        <h2 className="title">Pedidos Seleccionados</h2>
        <div className="carrito">
          {carrito.length === 0 ? (
            <p>No hay productos en los pedidos.</p>
          ) : (
            carrito.map((producto) => (
              <div className="carrito-item" key={producto.id}>
                <p>{producto.nombre} - ${producto.precio} x {producto.cantidad}</p>
                <input
                  type="number"
                  min="1"
                  className="cantidad-input"
                  value={producto.cantidad}
                  onChange={(e) => actualizarCantidad(producto.id, parseInt(e.target.value))}
                />
                <button className="btn-eliminar" onClick={() => eliminarDelCarrito(producto.id)}>
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        <h3 className="total">Total del Pedido: ${calcularTotal()}</h3>
        
        {/* Botón para generar QR */}
        <button className="btn-generar-qr" onClick={() => navigate('/QR')}>
          Generar QR para Pedido
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Carrito;
