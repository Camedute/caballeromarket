import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './local.css'; // Importar estilos personalizados
import Header from '../Header/header';
import Footer from '../Footer/footer';

mapboxgl.accessToken = 'pk.eyJ1IjoidWtpMDMiLCJhIjoiY20xbnBvaDBxMHdtczJpcHY4MDMzY2Z3YSJ9.SKVsR2il607osmabAL4FHQ'; // Usa una clave válida

const Locales: React.FC = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const coordinates: [number, number] = [-70.5716, -33.5822]; // Coordenadas para Peñaflor
  const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/streets-v11'); // Estado para cambiar el estilo del mapa

  useEffect(() => {
    if (map) return; // Salir si el mapa ya está inicializado

    const mapboxMap = new mapboxgl.Map({
      container: 'map', // ID del contenedor del mapa
      style: mapStyle, // Estilo del mapa
      center: coordinates, // Coordenadas iniciales
      zoom: 14,
    });

    // Marcador para la dirección
    new mapboxgl.Marker({ color: '#ff5733' })
      .setLngLat(coordinates)
      .addTo(mapboxMap);

    setMap(mapboxMap); // Guardar el mapa en el estado

    return () => {
      mapboxMap.remove(); // Limpiar el mapa cuando el componente se desmonte
    };
  }, [map, mapStyle]); // Dependencias incluyen map y mapStyle

  // Cambiar el estilo del mapa
  const handleMapStyleChange = (style: string) => {
    setMapStyle(style);
    if (map) {
      map.setStyle(style);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2 className="header">ubicación del local</h2>
        <div className="map-controls">
          <button className="button" onClick={() => handleMapStyleChange('mapbox://styles/mapbox/streets-v11')}>Estilo Callejero</button>
          <button className="button" onClick={() => handleMapStyleChange('mapbox://styles/mapbox/satellite-v9')}>Estilo Satélite</button>
        </div>
        <div id="map" className="map-container" />
      </div>
      <Footer />
    </>
  );
};

export default Locales;
