// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import GetStaticProps from 'next'
import React, { useState, useEffect, useRef } from "react";

function MyApp({ Component, pageProps }: AppProps) {

  const [selectedCell, setSelectedCell] = useState({ nothing_selected: "Select a Cell to Continue" });

  return (
    <Component selectedCell={selectedCell} setSelectedCell={setSelectedCell} {...pageProps} />
  );
}
export default MyApp;