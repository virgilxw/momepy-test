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

        const yS = scaleLinear().domain([p5, p95]).range([0, width]);

        setData(valueArray);
        setXScale(() => yS);
    }, [])

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
                targetValue = {targetValue}
            />
        </svg>
    );
}

const Sidebar = ({ city_data, selectedCell, setSelectedCell }) => {

    const [sidebarWidth, setSidebarWidth] = useState(0);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const width = sidebarRef.current.offsetWidth;
            setSidebarWidth(width);
        };

        // Initial sidebar width
        handleResize();

        // Event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={sidebarRef} className="sidebar shadow-md bg-zinc-50 overflow-auto">
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