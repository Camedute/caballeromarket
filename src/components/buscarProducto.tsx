import React from 'react';
import { useParams } from 'react-router-dom';
import Header from './header';

const BuscarProducto: React.FC = () => {
  const { query } = useParams<Record<string, string>>(); // Usamos Record<string, string>

  return (
    <>
      <Header />
      <div className="buscar-producto-container">
        <h3 className="resultados-titulo">
          {query ? `Resultados para: ${query}` : "No se ha proporcionado ningún término de búsqueda."}
        </h3>
        {/* Aquí puedes agregar más contenido o resultados de la búsqueda */}
      </div>
    </>
  );
};

export default BuscarProducto;
