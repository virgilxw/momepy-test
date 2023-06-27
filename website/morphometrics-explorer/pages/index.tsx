import { Inter } from 'next/font/google';
import "mapbox-gl/dist/mapbox-gl.css";
import MapCont from '../components/map';
import Layout from "components/layout/Layout";
import { loadCellData } from "../lib/loadCellData"

const inter = Inter({ subsets: ['latin'] });

// This function runs only on the server side
export async function getStaticProps() {

  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const city_data = await loadCellData()

  // Props returned will be passed to the page component
  return { props: { city_data } }
}

import React, { useState, useEffect, useRef } from "react";
interface HomeProps {
  selectedCell: Dict;
  setSelectedCell
}

const Home: React.FC<PropsWithChildren<HomeProps>> = ({ city_data, selectedCell, setSelectedCell, clusterID, setclusterID, selectedVar, setSelectedVar}) => {


  return (
    <Layout city_data={city_data} selectedCell={selectedCell} setSelectedCell={setSelectedCell} clusterID={clusterID} setclusterID={setclusterID} >
      <main className={`flex min-h-[16] flex-col items-center ${inter.className}`}>
        <MapCont selectedCell={selectedCell} setSelectedCell={setSelectedCell} clusterID={clusterID} setclusterID={setclusterID} selectedVar={selectedVar} setSelectedVar={setSelectedVar}/>
      </main>
    </Layout>
  );
}

export default Home;