import React, { useState, useEffect, useRef } from "react";
import ViolinPlot from "../ViolinShape";
import Dropdown from "../sidebar-dropdown";

const Sidebar = ({ city_data, selectedCell, setSelectedCell, clusterID, setclusterID, selectedVar, setSelectedVar }) => {

    const sidebarWidth = 266
    const [nestedCellData, setNestedCellData] = useState({});

    const default_sidebar = () => {
        let nestedObject = {};

        const city_data_1 = city_data["singapore"]

        for (const key in city_data_1) {
            const regex = /_(25|50|75)$/;
            const match = key.match(regex);

            if (match) {
                const subkey = key.replace(regex, '');
                if (!nestedObject[subkey]) {
                    nestedObject[subkey] = {};
                }
                nestedObject[subkey][match[1]] = null;
            } else {
                if (!nestedObject[key]) {
                    nestedObject[key] = {};
                }
                nestedObject[key]["base"] = null;
            }
        }

        setNestedCellData(nestedObject);
    }

    useEffect(() => {
        default_sidebar();
    }, []);

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
        }
    }, [selectedCell]);



    return (
        <div className="sidebar shadow-md bg-zinc-50 overflow-y-auto">
            <h2>cell uID: {clusterID.uID} </h2>
            <h3>ClusterID: {clusterID.clusterID} </h3>
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
                            <Dropdown city_data={city_data["singapore"]}
                                width={sidebarWidth}
                                height={50}
                                plotKey={key}
                                targetValues={value} />
                        </div>
                    )) : null
            }
        </div>
    );
};



export default Sidebar;