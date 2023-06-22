import { Inter } from 'next/font/google';
import "mapbox-gl/dist/mapbox-gl.css";
import MapCont from '../components/map';

const inter = Inter({ subsets: ['latin'] });


import React, { useState, useEffect, useRef } from "react";
import { scaleLinear, quantile } from 'd3';
import { ViolinShape } from "../components/ViolinShape";
import { loadPlots } from "../lib/loadPlots.js"

const plotWidth = 200
const plotHeight = 150

const ViolinPlot = ({ width, height, data, xScale }) => {
  // Render the ViolinPlot component using the provided data and xScale
  if (!data || !xScale) {
    return <div>Loading...</div>;
  }

  return (
    <svg style={{ width: width * 0.9, height: height * 2 }}>
      <ViolinShape
        height={height}
        xScale={xScale}
        data={data}
        binNumber={10}
      />
    </svg>
  );
}

// This function runs only on the server side
export async function getStaticProps() {

  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const plots_a = await loadPlots()
  let plots = {}

  for (const city in plots_a) {
    let city_dict = {}

    for (const key in plots_a[city]) {
      const data = plots_a[city][key];

      const p5 = quantile(data.sort(), 0.05);
      const p95 = quantile(data, 0.95);
      const xScale = scaleLinear().domain([p5, p95]).range([0, plotWidth]);

      city_dict[key] = {
        data,
        p5: p5,
        p95: p95,
        ViolinPlot: ViolinPlot(plotWidth, plotHeight, data, xScale)
      };
    }
    plots[city] = city_dict
  }

  // Props returned will be passed to the page component
  return { props: { plots } }
}

interface HomeProps {
  plots
  selectedCell: Dict;
  setSelectedCell
}

const Home: React.FC<PropsWithChildren<HomeProps>> = ({ plots, selectedCell, setSelectedCell }) => {
  console.log(plots)
  return (
    <main className={`flex min-h-[16] flex-col items-center ${inter.className}`}>
      <MapCont selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
    </main>
  );
}

export default Home;