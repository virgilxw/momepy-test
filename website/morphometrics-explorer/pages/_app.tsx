// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import GetStaticProps from 'next'
import React, { useState, useEffect, useRef } from "react";

function MyApp({ Component, pageProps }: AppProps) {

  const [selectedCell, setSelectedCell] = useState({ nothing_selected: "Select a Cell to Continue" });
  const [clusterID, setclusterID] = useState(0);

  return (
    <Component selectedCell={selectedCell} setSelectedCell={setSelectedCell} clusterID={clusterID} setclusterID={setclusterID} {...pageProps} />
  );
}
export default MyApp;