import React, { useState, useEffect, useRef } from "react";
import ViolinPlot from "../ViolinShape";
import Dropdown from "../sidebar-dropdown";

const Sidebar = ({ city_data, selectedCell, setSelectedCell, clusterID, setclusterID, selectedVar, setSelectedVar, selectedVarScale, setselectedVarScale}) => {

    const sidebarWidth = 266
    const [nestedCellData, setNestedCellData] = useState({});

    const default_sidebar = () => {
        let nestedObject = {};

        const city_data_1 = city_data["singapore"]
        delete city_data_1.cluster_ID
        delete city_data_1.uID

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

    const [isButton1Active, setButton1Active] = useState(false);
    const [isButton2Active, setButton2Active] = useState(false);

    const handleButton1Click = () => {
        setSelectedVar("cluster_ID")
        setButton1Active(!isButton1Active);
        if (isButton2Active) {
            setButton2Active(false);
        }
    };

    const handleButton2Click = () => {
        setSelectedVar("weighted_difference_between_clusters")
        setButton2Active(!isButton2Active);
        if (isButton1Active) {
            setButton1Active(false);
        }
    };


    return (
        <div className="sidebar shadow-md bg-zinc-50 overflow-y-auto">
            <h2>cell uID: {clusterID.uID} </h2>
            <h3>ClusterID: {clusterID.clusterID} </h3>
            <div className="inline-flex">
                <button
                    onClick={handleButton1Click}
                    className={`bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l ${isButton1Active ? 'bg-gray-400' : ''}`}
                >
                    <div className="flex flex-col items-center">
                        <span>Urban Type</span>
                        <span>Equal Intervals</span>
                    </div>
                </button>
                <button
                    onClick={handleButton2Click}
                    className={`bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r ${isButton2Active ? 'bg-gray-400' : ''}`}
                >
                    <div className="flex flex-col items-center">
                        <span>Urban Type</span>
                        <span>1-Dimension</span>
                    </div>
                </button>
            </div>
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