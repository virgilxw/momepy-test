// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import GetStaticProps from 'next'
import React, { useState, useEffect, useRef } from "react";
import { MapProvider } from 'react-map-gl';

function MyApp({ Component, pageProps }: AppProps) {

  const [selectedCell, setSelectedCell] = useState({ nothing_selected: "Select a Cell to Continue" });
  const [clusterID, setclusterID] = useState(0);
  const [selectedVar, setSelectedVar] = useState({"value": "cluster_ID", "scale":null})

  return (
    <MapProvider>
      <Component selectedCell={selectedCell} setSelectedCell={setSelectedCell} clusterID={clusterID} setclusterID={setclusterID} selectedVar={selectedVar} setSelectedVar={setSelectedVar} {...pageProps} />
    </MapProvider>
  );
}
export default MyApp;