import Grid from '@mui/material/Grid';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// Palette
// rgb(204, 213, 174)
//rgb(233, 237, 201)
//rgb(254, 250, 224)
//rgb(250, 237, 205)

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
        <Grid
          xs={2.5}
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          className="grid-parent">
          
          <div className="header">
            test
          </div>

          <Grid container
            direction="row"
            spacing={0}>
            <Grid
              container
              direction="row"
              alignItems="stretch"
              spacing={0}
              className="grid-parent">
              <Grid item xs={2} sx={{ minwidth: '30px', backgroundColor: 'rgb(204, 213, 174)' }} className="columns">
                <h1 className="text-3xl font-bold underline">
                  Hello world!
                </h1>

              </Grid>
              <Grid item xs={10} sx={{ minwidth: '300px', backgroundColor: 'rgb(233, 237, 201)' }} className="columns">
                <h1 className="text-3xl font-bold underline">
                  Hello world!
                </h1>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={{ flexGrow: 1, backgroundColor: 'green' }} className="columns">
          <div ref={mapContainer} className="map-container" />
        </Grid>
        <Grid item xs={2} sx={{ minwidth: '300px', backgroundColor: 'rgb(233, 237, 201)' }} className="columns">
          {/* Right sidebar */}
        </Grid>
      </Grid>
    </div>
  )
}
