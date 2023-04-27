import Grid from '@mui/material/Grid';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import dynamic from 'next/dynamic'

const Mapbox = dynamic(() => import('../components/Mapbox'), {
  loading: () => <p>Loading...</p>,
})

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// Palette rgb(247, 236, 222)
//  rgb(233, 218, 193)
//rgb(158, 210, 198)
//rgb(84, 186, 185)

export default function Home() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(103.85);
  const [lat, setLat] = useState(1.29);
  const [zoom, setZoom] = useState(11);

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
          <Mapbox lng={lng} lat={lat} zoom={zoom}/>
        </Grid>
        <Grid item sx={{ width: '300px', backgroundColor: 'rgb(147, 191, 207)' }} className="columns">
          {/* Right sidebar */}
        </Grid>
      </Grid>
    </div>
  )
}
