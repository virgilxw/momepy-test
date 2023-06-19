import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { render } from 'react-dom';
import Map, { Popup, Source, Layer } from 'react-map-gl';
import ControlPanel from '../components/control-panel';

import { tessPolyLayer, tessHighlightLayer } from '../components/map-style';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_mapboxglaccessToken; // Set your mapbox token here

export default function MapCont() {
  const [lng, setLng] = useState(103.851959);
  const [lat, setLat] = useState(1.290270);
  const [zoom, setZoom] = useState(10);


  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback(event => {

    const cell = event.features && event.features[0];
    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      cellName: cell && cell.properties.uID,
      clusterID: cell.properties.clusterID,
      props: cell.properties
    });

    
    console.log(cell.properties)
  }, []);


  const selectedCounty = (hoverInfo && hoverInfo.cellName) || '';
  const filter = useMemo(() => ['in', 'uID', selectedCounty], [selectedCounty]);

  return (
    <>
      <Map
        initialViewState={{
          latitude: lat,
          longitude: lng,
          zoom: zoom
        }}
        minZoom={2}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        interactiveLayerIds={['tess']}
      >
        <Source type="vector" url="mapbox://virgilxw.singapore-tessellation">
          <Layer {...tessPolyLayer} />
          <Layer {...tessHighlightLayer} filter={filter} />
        </Source>
      </Map>
      <ControlPanel />
    </>
  );
}

export function renderToDom(container) {
  render(<MapCont />, container);
}