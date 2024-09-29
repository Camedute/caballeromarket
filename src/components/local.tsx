import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './styles/local.css'; // Asegúrate de importar tu CSS
import Header from './header';

mapboxgl.accessToken = 'pk.eyJ1IjoidWtpMDMiLCJhIjoiY20xbnBvaDBxMHdtczJpcHY4MDMzY2Z3YSJ9.SKVsR2il607osmabAL4FHQ'; // Asegúrate de usar una clave válida

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const coordinates: [number, number] = [-70.5716, -33.5822]; // Coordenadas para Penaflor

  useEffect(() => {
    if (map) return; // Salir si el mapa ya está inicializado

    // Inicializa el mapa
    const mapboxMap = new mapboxgl.Map({
      container: 'map', // ID del contenedor del mapa
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
      center: coordinates, // Coordenadas iniciales
      zoom: 14,
    });

    // Marcador para la dirección
    new mapboxgl.Marker({ color: '#ff5733' })
      .setLngLat(coordinates) // Establecer las coordenadas del marcador
      .addTo(mapboxMap);

    setMap(mapboxMap); // Guarda el mapa en el estado

    // Limpieza al desmontar el componente
    return () => {
      mapboxMap.remove();
    };
  }, [map]); // Solo se ejecuta si `map` es null

  return (
    <>
    <Header></Header>
    <div className="container">
      <h2 className="header">Localización de: 94R5+6F Penaflor, Peñaflor</h2>
      <div id="map" style={{ width: '100%', height: '400px' }} />
    </div>
    </>
  );
};

export default MapComponent;
