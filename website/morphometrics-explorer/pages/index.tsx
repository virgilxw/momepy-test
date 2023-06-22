import React, { useRef, useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import "mapbox-gl/dist/mapbox-gl.css";
import MapCont from '../components/map';

const inter = Inter({ subsets: ['latin'] });

// const MapContainer = () => {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   // mapboxgl.accessToken = process.env.NEXT_PUBLIC_mapboxglaccessToken;

//   const [lng, setLng] = useState(103.851959);
//   const [lat, setLat] = useState(1.290270);
//   const [zoom, setZoom] = useState(10);

//   const [city, setCity] = useState("Singapore")
//   const [selectedUID, setSelectedUID] = useState(0)
//   const [selectedFeatureId, setSelectedFeatureId] = useState(null);


//   useEffect(() => {
//     if (map.current) return; // initialize map only once

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/streets-v12',
//       center: [lng, lat],
//       zoom: zoom
//     });

//     map.current.on('style.load', () => {
//       // Style is loaded, now you can add the source

//       map.current.addSource("singapore-tessellation", {
//         type: "vector",
//         url: "mapbox://virgilxw.singapore-tessellation",
//       });

//       map.current.addLayer({
//         id: "singapore-tessellation-fill",
//         type: "fill",
//         source: "singapore-tessellation",
//         "source-layer": "trees",
//         paint: {
//           'fill-opacity': [
//             'case',
//             ['boolean', ['feature-state', 'hover'], false],
//             1,
//             0.5
//           ],
//           "fill-color": "#ffffff",
//           "fill-outline-color": "#000000"
//         },
//       })

//       map.current.on('click', 'singapore-tessellation-fill', (e) => {
//         const properties = e.features[0].properties;
//         // Access the properties of the clicked polygon here
//         setSelectedUID(properties.uID)

//         const clickedFeatureId = e.features[0].id;
//         setSelectedFeatureId(clickedFeatureId);

//         console.log(properties);
//       });

//       map.current.addSource("singapore-buildings", {
//         type: "vector",
//         url: "mapbox://virgilxw.singapore-buildings",
//       });

//       map.current.addLayer({
//         id: "singapore-buildings-fill",
//         type: "fill",
//         source: "singapore-buildings",
//         "source-layer": "trees",
//         paint: {
//           "fill-opacity": 0.2,
//           "fill-color": "#ff4e4e",
//         },
//       })
//     });

//     map.current.on('mousemove', 'state-fills', (e) => {
//       if (e.features.length > 0) {
//         if (hoveredPolygonId !== null) {
//           map.setFeatureState(
//             { source: 'states', id: hoveredPolygonId },
//             { hover: false }
//           );
//         }
//         hoveredPolygonId = e.features[0].id;
//         map.setFeatureState(
//           { source: 'states', id: hoveredPolygonId },
//           { hover: true }
//         );
//       }
//     });

//     // When the mouse leaves the state-fill layer, update the feature state of the
//     // previously hovered feature.
//     map.current.on('mouseleave', 'state-fills', () => {
//       if (hoveredPolygonId !== null) {
//         map.setFeatureState(
//           { source: 'states', id: hoveredPolygonId },
//           { hover: false }
//         );
//       }
//       hoveredPolygonId = null;
//     });
//   }, [city, selectedFeatureId]);

//   return <div ref={mapContainer} className="min-w-full min-h-full map-container" />

// }
interface HomeProps {
  selectedCell: Dict;
  setSelectedCell
}

const Home: React.FC<PropsWithChildren<HomeProps>> = ({ selectedCell, setSelectedCell }) => {
  return (
    <main className={`flex min-h-[16] flex-col items-center ${inter.className}`}>
      <MapCont selectedCell={selectedCell} setSelectedCell= {setSelectedCell}/>
    </main>
  );
}

export default Home;