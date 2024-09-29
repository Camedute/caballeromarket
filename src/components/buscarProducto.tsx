import React from 'react';
import { useParams } from 'react-router-dom';
import Header from './header';

const BuscarProducto: React.FC = () => {
  const { query } = useParams<Record<string, string>>(); // Usamos Record<string, string>

  return (
    <div>
        <Header></Header>
      <h3 className=''>Resultados para: {query}</h3>
    </div>
  );
};

export default BuscarProducto;
