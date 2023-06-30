import * as React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { render } from 'react-dom';
import Map, { Popup, Source, Layer, useMap } from 'react-map-gl';
import ControlPanel from '../components/control-panel';
import { tessPolyLayer, tessHighlightLayer, tessSelectedLayer } from '../components/map-style';
import * as d3 from 'd3';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_mapboxglaccessToken; // Set your mapbox token here

const MapCont: React.FC<PropsWithChildren<MapContProps>> = ({ selectedCell, setSelectedCell, clusterID, setclusterID, selectedVar, setSelectedVar, selectedVarScale, setSelectedVarScale, selectedCity, setSelectedCity, citiesList, setCitiesList }) => {

  const [lng, setLng] = useState(103.851959);
  const [lat, setLat] = useState(1.290270);
  const [zoom, setZoom] = useState(15);
  const [jenks, setJenks] = useState(null)
  const [directory, setdirectory] = useState(null);

  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);
  const { mapID } = useMap()

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
    fetch('layerDirectory.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json(); // This returns a promise
      })
      .then((data) => {
        // Update the state to trigger a re-render.
        // Note that "data" is an object and will be added to the list
        setCitiesList(Object.keys(data));
        setdirectory(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, []);

  useEffect(() => {
    // Fetch the JSON file
    fetch('weighted_mean.json')
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

  }, []);

  useEffect(() => {
    // Fetch the JSON file
    fetch('jenks.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json(); // This returns a promise
      })
      .then((data) => {
        // Update the state to trigger a re-render.
        // Note that "data" is an object and will be added to the list
        setJenks(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    if (mapID && selectedCity && directory) {
      mapID.flyTo({center: directory[selectedCity]["lnglat"], duration: 10000});
    }
  }, [mapID, selectedCity, directory]);

  useEffect(() => {

    if (selectedVar === "one_dimensional_diff_between_clusters" && data) { // Check if data is not null

      const num_clusters = Object.keys(data[selectedCity]).length;
      const min = -10
      const max = 10

      // Create a color scale
      const colorScale = d3.scaleDiverging(t => d3.interpolateRdYlGn(1 - t))
        .domain([min, (max + min) / 2, max]);  // Adjust the domain according to your data range

      function generateStops(min, max, colorScale) {
        const count = 16; // Number of stops
        const step = (max - min) / (count - 1); // Calculate the step size

        const stops = Array.from({ length: count }, (_, i) => {
          const value = min + (i * step);
          const roundedValue = Number(value.toPrecision(3));
          return [roundedValue, colorScale(value)];
        });

        return stops;
      }

      // Create color stops
      const stops = generateStops(min, max, colorScale)

      // For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
      setPaint({
        'fill-color': {
          property: 'one_dimensional_diff_between_clusters',
          stops: stops
        },
        'fill-opacity': 0.8
      })

      setSelectedVarScale(stops)
    } else if (selectedVar === "cluster_ID" && data) { // Check if data is not null

      const num_clusters = Object.keys(data[selectedCity]).length;

      // Create a color scale
      const colorScale = d3.scaleDiverging(t => d3.interpolateRdYlGn(1 - t))
        .domain([0, num_clusters / 2, num_clusters]);  // Adjust the domain according to your data range

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

      setSelectedVarScale(stops)
    } else {
      if (jenks != null) {
        const buckets = jenks[selectedCity][selectedVar]["classes"]
        const min = Number(jenks[selectedCity][selectedVar]["min"])
        const max = Number(jenks[selectedCity][selectedVar]["max"])

        const num_clusters = buckets.length

        // Create a color scale
        const colorScale = d3.scaleDiverging(t => d3.interpolateRdYlGn(1 - t))
          .domain([0, num_clusters / 2, num_clusters]);

        const stops = [];

        stops.push(colorScale(min))

        buckets.forEach((bucket, index) => {
          const [bucketMin, bucketMax] = bucket;
          const color = colorScale(index);  // Use the index of each bucket for color mapping
          stops.push(bucketMin, color);
        });

        stops.push(Number(max), colorScale(num_clusters));  // Add the maximum value and its color

        // Set the 'fill-color' property using the stops
        setPaint({
          'fill-color': ['step', ['get', selectedVar], ...stops],
          'fill-opacity': 0.8
        });

        // Helper function to create pairs
        const createPairs = (array) => {
          let pairs = [];
          for (let i = 0; i < array.length; i += 2) {
            pairs.push(["<" + Math.round(array[i + 1] * 1000) / 1000, array[i]]);
          }
          return pairs.slice(1, pairs.length - 1);
        }

        setSelectedVarScale(createPairs(stops))
      }
    }
  }, [selectedVar, data, jenks, selectedCity]); // Note the addition of data here

  return (
    <>
      {directory && <Map
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
        <Source type="vector" url={directory[selectedCity]["tess"]}>
          <Layer {...tessPolyLayer} paint={tess_paint} />
          <Layer {...tessHighlightLayer} filter={filter_hover} />
          <Layer {...tessSelectedLayer} filter={filter_click} />
        </Source>
      </Map>}
      <ControlPanel selectedVar={selectedVar} setSelectedVar={setSelectedVar} selectedVarScale={selectedVarScale} setSelectedVarScale={setSelectedVarScale} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
    </>
  );
}

export default MapCont;