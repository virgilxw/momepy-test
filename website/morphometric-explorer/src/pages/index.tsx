import Grid from '@mui/material/Grid';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// Palette rgb(247, 236, 222)
//  rgb(233, 218, 193)
//rgb(158, 210, 198)
//rgb(84, 186, 185)

export default function Home() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
    <div className='main'>
      <Grid
        container
        direction="row"
        alignItems="stretch"
        spacing={0}
        className="grid-parent">
        <Grid item xs={0.5} sx={{ width: '15px', backgroundColor: 'rgb(96, 150, 180)' }} className="columns">
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>

        </Grid>
        <Grid item sx={{ width: '300px', backgroundColor: 'rgb(147, 191, 207)' }} className="columns">
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>

        </Grid>
        <Grid item sx={{ flexGrow: 1, backgroundColor: 'green' }} className="columns">
          <div ref={mapContainer} className="map-container" />
        </Grid>
        <Grid item sx={{ width: '300px', backgroundColor: 'rgb(147, 191, 207)' }} className="columns">
          {/* Right sidebar */}
        </Grid>
      </Grid>
    </div>
  )
}
