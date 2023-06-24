import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { render } from 'react-dom';
import Map, { Popup, Source, Layer } from 'react-map-gl';
import ControlPanel from '../components/control-panel';
import { tessPolyLayer, tessHighlightLayer, tessSelectedLayer } from '../components/map-style';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_mapboxglaccessToken; // Set your mapbox token here

const MapCont: React.FC<PropsWithChildren<MapContProps>> = ({ selectedCell, setSelectedCell, clusterID, setclusterID }) => {

  const [lng, setLng] = useState(103.851959);
  const [lat, setLat] = useState(1.290270);
  const [zoom, setZoom] = useState(10);


  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);

  const onHover = useCallback(event => {

    const cell = event.features && event.features[0];
    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      cellName: cell && cell.properties.uID,
      clusterID: cell && cell.properties.clusterID,
      props: cell && cell.properties
    });

  }, []);



  const selectedCell_Mapbox_hover = (hoverInfo && hoverInfo.cellName) || '';
  const filter_hover = useMemo(() => ['in', 'uID', selectedCell_Mapbox_hover], [selectedCell_Mapbox_hover]);

  const onClick = useCallback(event => {

    const cell = event.features && event.features[0];

    if (cell && cell.properties) {
      setclusterID({"clusterID":cell.properties.cluster_ID, "uID": cell.properties.uID})

      let props = cell.properties
      delete props.cluster_ID
      delete props.uID
      setSelectedCell(props);
    } else {
      setSelectedCell({ nothing_selected: "Select a Cell to Continue" });
    }

    setClickInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      cellName: cell && cell.properties.uID,
      clusterID: cell && cell.properties.clusterID,
      props: cell && cell.properties
    });

  }, []);



  const selectedCell_Mapbox_click = (clickInfo && clickInfo.cellName) || '';
  const filter_click = useMemo(() => ['in', 'uID', selectedCell_Mapbox_click], [selectedCell_Mapbox_click]);

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
        onClick={onClick}
        interactiveLayerIds={['tess']}
      >
        <Source type="vector" url="mapbox://virgilxw.singapore-tessellation">
          <Layer {...tessPolyLayer} />
          <Layer {...tessHighlightLayer} filter={filter_hover} />
          <Layer {...tessSelectedLayer} filter={filter_click} />
        </Source>
      </Map>
      <ControlPanel />
    </>
  );
}

export default MapCont;