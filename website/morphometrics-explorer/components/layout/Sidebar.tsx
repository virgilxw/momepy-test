import React, { useState, useEffect, useRef } from "react";
import Papa from 'papaparse';
import { scaleLinear, quantile } from 'd3';
import { ViolinShape } from "components/ViolinShape";

// export async function getStaticProps() {
//   // Get external data from the file system, API, DB, etc.
//   const data = ...

//   // The value of the `props` key will be
//   //  passed to the `Home` component
//   return {
//     props: ...
//   }
// }

const ViolinPlot = ({ width, height, variable }) => {

    // Assuming your file is named 'data.csv' and it's directly inside the 'public' folder
    const fetchData = async () => {
        const response = await fetch('data_csv/singapore-tess.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);

        return new Promise((resolve, reject) => {
            Papa.parse(csv, {
                header: true,
                complete: function (results) {
                    const output = {};
                    results.data.forEach(row => {
                        for (const key in row) {
                            if (!output[key]) output[key] = [];
                            output[key].push(row[key]);
                        }
                    });
                    resolve(output); // resolve the Promise with the output
                },
                error: function (error) {
                    reject(error); // reject the Promise if there's an error
                }
            });
        });
    }

    const [data, setData] = useState(null);
    const [xScale, setxScale] = useState(() => scaleLinear());

    useEffect(() => {
        fetchData().then(keyValues => {
            
            let data = keyValues[variable]

            if (data === undefined) {
                return;
            }

            // Calculate the 0.05 and 0.95 percentiles
            let p5 = quantile(data.sort(), 0.05);
            let p95 = quantile(data, 0.95);

            const xS = scaleLinear().domain([p5, p95]).range([0,width]);

            setData(data);
            setxScale(() => xS);

        }).catch(err => {
            console.error(err);
        });
    }, []);

    if (!data || !xScale) {
        return <div>Loading...</div>;
    }

    return (
        <svg style={{ width: width*0.9, height: height * 2 }}>
            <ViolinShape
                height={height}
                xScale={xScale}
                data={data}
                binNumber={10}
            />
        </svg>
    );
}

interface SidebarProps {
    selectedCell: { test: string };
    setSelectedCell
}

const Sidebar: React.FC<PropsWithChildren<SidebarProps>> = ({ selectedCell, setSelectedCell }) => {

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
            
            {Object.entries(selectedCell).map(([key, value]) => (
                <div key={key} className=" p-4 border mb-4">
                    <h3 className="text-lg font-bold mb-2">{key}</h3>
                    <p>{value}</p>
                    <ViolinPlot width={sidebarWidth} height={50} variable={key} />
                </div>
            ))}
        </div>
    );
};

export default Sidebar;