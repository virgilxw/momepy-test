import React, { useState, useEffect, useRef } from "react";

import { scaleLinear, quantile } from 'd3';
import { ViolinShape } from "../ViolinShape";
import { loadPlots } from "../lib/loadPlots.js"

const ViolinPlot = ({ city_data, width, height, plotKey, targetValue }) => {
    // Render the ViolinPlot component using the provided data and xScale

    const [data, setData] = useState(null);
    const [xScale, setXScale] = useState(() => scaleLinear());

    let valueArray = city_data[plotKey]

    useEffect(() => {

        if (valueArray == undefined) {
            return
        }
        // Calculate the 0.05 and 0.95 percentiles
        let p5 = quantile(valueArray.sort(), 0.05);
        let p95 = quantile(valueArray, 0.95);

        const yS = scaleLinear().domain([p5, p95]).range([0, width * 0.8]);

        setData(valueArray);
        setXScale(() => yS);
    }, [])

    if (!data || !xScale) {
        return <div>Loading...</div>;
    }

    return (
        <svg style={{ width: width, height: height * 2 }}>
            <g transform={`translate(${width *0.1}, ${(height * 2) / 2})`}>
                <ViolinShape
                    height={height}
                    xScale={xScale}
                    data={data}
                    binNumber={25}
                    targetValue={targetValue}
                />
            </g>
        </svg >
    );
}

const Sidebar = ({ city_data, selectedCell, setSelectedCell }) => {

    const sidebarWidth = 266

    return (
        <div className="sidebar shadow-md bg-zinc-50 overflow-y-auto">
            {
                selectedCell && Object.keys(selectedCell).length > 0 ?
                    Object.entries(selectedCell).map(([key, value]) => (
                        <div key={key} className="p-4 border mb-4">
                            <h3 className="text-lg font-bold mb-2">{key}</h3>
                            <p>{value}</p>
                            <ViolinPlot
                                city_data={city_data["singapore"]}
                                width={sidebarWidth}
                                height={50}
                                plotKey={key}
                                targetValue={value}
                            />
                        </div>
                    )) : null
            }
        </div>
    );
};



export default Sidebar;