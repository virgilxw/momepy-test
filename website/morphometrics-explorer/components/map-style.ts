import type {FillLayer} from 'react-map-gl';

export const tessPolyLayer: FillLayer = {
  id: 'tess',
  type: 'fill',
  'source-layer': 'trees',
  paint: {
    'fill-outline-color': 'rgba(0,0,0,0.1)',
    'fill-color': 'rgba(0,0,0,0.1)'
  }
};
// Highlighted county polygons
export const tessHighlightLayer: FillLayer = {
  id: 'tess-highlighted',
  type: 'fill',
  source: 'tess',
  'source-layer': 'trees',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#6e599f',
    'fill-opacity': 0.75
  }
};