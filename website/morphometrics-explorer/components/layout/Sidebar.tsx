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
            <g transform={`translate(${width * 0.1}, ${(height * 2) / 2})`}>
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
    const [nestedCellData, setNestedCellData] = useState({});

    useEffect(() => {
        if (!Object.keys(selectedCell).includes("nothing_selected")) {
            let nestedObject = {};

            for (const key in selectedCell) {
                const regex = /_(25|50|75)$/;
                const match = key.match(regex);

                if (match) {
                    const subkey = key.replace(regex, '');
                    if (!nestedObject[subkey]) {
                        nestedObject[subkey] = {};
                    }
                    nestedObject[subkey][match[1]] = selectedCell[key];
                } else {
                    if (!nestedObject[key]) {
                        nestedObject[key] = {};
                    }
                    nestedObject[key]["base"] = selectedCell[key];
                }
            }

            setNestedCellData(nestedObject);
            console.log(nestedObject)
        }
    }, [selectedCell]);

    return (
        <div className="sidebar shadow-md bg-zinc-50 overflow-y-auto">
            {
                nestedCellData && Object.keys(nestedCellData).length > 0 ?
                    Object.entries(nestedCellData).map(([key, value]) => (
                        <div key={key} className="p-4 border mb-4">
                            <h3 className="text-lg font-bold mb-2">{key}</h3>
                            <p>{value["base"]}</p>
                            <ViolinPlot
                                city_data={city_data["singapore"]}
                                width={sidebarWidth}
                                height={50}
                                plotKey={key}
                                targetValue={value["base"]}
                            />
                        </div>
                    )) : null
            }
        </div>
    );
};



export default Sidebar;