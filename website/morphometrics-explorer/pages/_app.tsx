// pages/_app.tsx
import "../styles/globals.css";
import { useState} from 'react';
import type { AppProps } from "next/app";
import Layout from "components/layout/Layout";
function MyApp({ Component, pageProps }: AppProps) {

  const [selectedCell, setSelectedCell] = useState({nothing_selected:"Select a Cell to Continue"});

  return (
    <Layout>
      <Component selectedCell={selectedCell} setSelectedCell={setSelectedCell} {...pageProps}/>
    </Layout>
  );
}
export default MyApp;