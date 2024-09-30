import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/header';
import './buscarProducto.css'; // Importa tu archivo de estilos
import Footer from '../Footer/footer';

interface Producto {
  id: number;
  nombre: string;
}

const productosSimulados: Producto[] = [
  { id: 1, nombre: "Producto A" },
  { id: 2, nombre: "Producto B" },
  { id: 3, nombre: "Producto C" },
  { id: 4, nombre: "Producto D" },
];

const BuscarProducto: React.FC = () => {
  const { query } = useParams<Record<string, string>>();
  const resultados = query 
    ? productosSimulados.filter(producto => producto.nombre.toLowerCase().includes(query.toLowerCase())) 
    : [];

  return (
    <>
      <Header />
      <div className="buscar-producto-container">
        <h3 className="resultados-titulo">
          {query ? `Resultados para: ${query}` : "No se ha proporcionado ningún término de búsqueda."}
        </h3>
        <div className="resultados-lista">
          {resultados.length > 0 ? (
            resultados.map(producto => (
              <div className="producto-card" key={producto.id}>
                <p>{producto.nombre}</p>
                <button className="btn-agregar">Agregar al carrito</button>
              </div>
            ))
          ) : (
            <p>No se encontraron productos que coincidan con su búsqueda.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BuscarProducto;
