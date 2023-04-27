import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Mapbox({ lng, lat, zoom }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    

    map.current.on('load', () => {

      map.current.addLayer({
        id: 'singapore-tessellation-line',
        type: 'line',
        source: {
          type: 'vector',
          url: 'mapbox://virgilxw.singapore-tessellation'
        },
        'source-layer': 'singapore-tessellation',
        paint: {
          'line-color': '#000000',
          'line-width': 2
        }
      });
      
      // Add the tessellation layer
      map.current.addLayer({
        id: 'singapore-tessellation',
        type: 'fill',
        source: {
          type: 'vector',
          url: 'mapbox://virgilxw.singapore-tessellation'
        },
        'source-layer': 'singapore-tessellation',
        paint: {
          'fill-color': '#383838',
          'fill-opacity': 0.3,
          'fill-outline-color': '#000000'
        }
      });
    });

    return () => map.current.remove(); // cleanup function
  }, [lng, lat, zoom]);

  return (
    <div ref={mapContainer} style={{ height: '100%' }} />
  );
}