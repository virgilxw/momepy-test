import * as React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { render } from 'react-dom';
import Map, { Popup, Source, Layer, useMap } from 'react-map-gl';
import ControlPanel from '../components/control-panel';
import { tessPolyLayer, tessHighlightLayer, tessSelectedLayer } from '../components/map-style';
import * as d3 from 'd3';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_mapboxglaccessToken; // Set your mapbox token here

const MapCont: React.FC<PropsWithChildren<MapContProps>> = ({ selectedCell, setSelectedCell, clusterID, setclusterID, selectedVar, setSelectedVar }) => {

  const [lng, setLng] = useState(103.851959);
  const [lat, setLat] = useState(1.290270);
  const [zoom, setZoom] = useState(15);
  const [city, setCity] = useState("singapore")


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

    setClickInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      cellName: cell && cell.properties.uID,
      clusterID: cell && cell.properties.clusterID,
      props: cell && cell.properties
    });

    if (cell && cell.properties) {
      setclusterID({ "clusterID": cell.properties.cluster_ID, "uID": cell.properties.uID })

      let props = cell.properties
      delete props.cluster_ID
      delete props.uID
      setSelectedCell(props);
    } else {
      setSelectedCell({ nothing_selected: "Select a Cell to Continue" });
    }

  }, []);

  const selectedCell_Mapbox_click = (clickInfo && clickInfo.cellName) || '';
  const filter_click = useMemo(() => ['in', 'uID', selectedCell_Mapbox_click], [selectedCell_Mapbox_click]);

  const [data, setData] = useState(null);
  const [paint, setPaint] = useState({
    'fill-outline-color': 'rgba(0,0,0,0.1)',
    'fill-color': 'rgba(0,0,0,0.1)'
  })
  const tess_paint = useMemo(() => paint, [paint])

  useEffect(() => {
    // Fetch the JSON file
    fetch('singapore_weighted_mean.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json(); // This returns a promise
      })
      .then((data) => {
        // Update the state to trigger a re-render.
        // Note that "data" is an object and will be added to the list
        setData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [city]);

  useEffect(() => {
    if (selectedVar["value"] === "weighted_difference_between_clusters" && data) { // Check if data is not null

      const num_clusters = Object.keys(data).length;

      // Create a color scale
      const colorScale = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
        .domain([-10, 10]);  // Adjust the domain according to your data range

      // Create color stops
      const stops = Array(num_clusters).fill(null).map((_, i) => {
        return [i, colorScale(data[i])];
      });

      // For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
      setPaint({
        'fill-color': {
          property: 'weighted_difference_between_clusters',
          stops: stops
        },
        'fill-opacity': 0.8
      })

      setSelectedVar({ "value": "weighted_difference_between_clusters", "scale": stops })
    } else if (selectedVar["value"] === "cluster_ID" && data) { // Check if data is not null

      const num_clusters = Object.keys(data).length;

      // Create a color scale
      const colorScale = d3.scaleDiverging(t => d3.interpolateRdYlGn(1 - t))
        .domain([0, num_clusters/2, num_clusters]);  // Adjust the domain according to your data range

      // Create color stops
      const stops = Array(num_clusters).fill(null).map((_, i) => {
        return [i, colorScale(i)];
      });

      // For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
      setPaint({
        'fill-color': {
          property: 'cluster_ID',
          stops: stops
        },
        'fill-opacity': 0.8
      })

      setSelectedVar({ "value": "cluster_ID", "scale": stops })
    }
  }, [selectedVar["value"], data]); // Note the addition of data here

  return (
    <>
      <Map
        initialViewState={{
          latitude: lat,
          longitude: lng,
          zoom: zoom,
        }}
        minZoom={14}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        onClick={onClick}
        interactiveLayerIds={['tess']}
        id="mapID"

      >
        <Source type="vector" url="mapbox://virgilxw.singapore-tessellation">
          <Layer {...tessPolyLayer} paint={tess_paint} />
          <Layer {...tessHighlightLayer} filter={filter_hover} />
          <Layer {...tessSelectedLayer} filter={filter_click} />
        </Source>
      </Map>
      <ControlPanel selectedVar={selectedVar} setSelectedVar={setSelectedVar} />
    </>
  );
}

export default MapCont;