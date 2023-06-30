import React, { useState, useEffect, useRef } from "react";
import ViolinPlot from "../ViolinShape";
import Dropdown from "../sidebar-dropdown";

interface CityData {
    [key: string]: {
        [key: string]: string[];
    };
}

interface SidebarProps {
    selectedCity: string;
    setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
    selectedCell: { [key: string]: string };
    setSelectedCell: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    city_data: CityData;
    clusterID: {
        clusterID: number;
        uID: number;
    };
    setclusterID: React.Dispatch<React.SetStateAction<number>>;
    selectedVar: string;
    setSelectedVar: React.Dispatch<React.SetStateAction<string>>;
    selectedVarScale: [number, string][] | null;
    setSelectedVarScale: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<SidebarProps> = ({
    city_data,
    selectedCell,
    setSelectedCell,
    clusterID,
    setclusterID,
    selectedVar,
    setSelectedVar,
    selectedVarScale,
    setSelectedVarScale,
    selectedCity,
    setSelectedCity
}) => {
    const sidebarWidth = 266

    type NestedCellData = {
        [key: string]: {
            25: number | null;
            50: number | null;
            75: number | null;
            "base": number | null;
        };
    };

    const [nestedCellData, setNestedCellData] = useState<NestedCellData>({});

    const checkEnd = (str: string) => {
        return str.endsWith("_25") || str.endsWith("_50") || str.endsWith("_75");
    }


    const default_sidebar = () => {
        let nestedObject: NestedCellData = {};

        const city_data_1 = city_data[selectedCity];
        delete city_data_1.cluster_ID;
        delete city_data_1.uID;
        delete city_data_1.one_dimensional_diff_between_clusters
        for (const key in city_data_1) {
            if (!checkEnd(key)) {
                nestedObject[key] = { 25: null, 50: null, 75: null, "base": null };
            }
        }

        setNestedCellData(nestedObject);
    }

    useEffect(() => {
        default_sidebar();
    }, [selectedCity]);

    useEffect(() => {
        if (!Object.keys(selectedCell).includes("nothing_selected")) {
            let nestedObject: NestedCellData = {};

            const city_data_1 = city_data[selectedCity];
            delete city_data_1.cluster_ID;
            delete city_data_1.uID;
            delete city_data_1.one_dimensional_diff_between_clusters

            const checkEnd = (str: string) => {
                return str.endsWith("_25") || str.endsWith("_50") || str.endsWith("_75");
            }

            for (const key in city_data_1) {
                if (!checkEnd(key)) {
                    nestedObject[key] = { 25: null, 50: null, 75: null, "base": null };
                }
            }

            for (const key in selectedCell) {
                // Skip these keys
                if (key === "one_dimensional_diff_between_clusters" || key === "uID" || key === "cluster_ID") {
                    continue;
                }

                if (key.endsWith("_25")) {
                    nestedObject[key.slice(0, -3)][25] = Number(selectedCell[key]);
                } else if (key.endsWith("_50")) {
                    nestedObject[key.slice(0, -3)][50] = Number(selectedCell[key]);
                } else if (key.endsWith("_75")) {
                    nestedObject[key.slice(0, -3)][75] = Number(selectedCell[key]);
                } else {
                    nestedObject[key]["base"] = Number(selectedCell[key])
                }
            }

            setNestedCellData(nestedObject);
        }
    }, [selectedCell]);


    return (
        <div className="sidebar shadow-md bg-zinc-50 overflow-y-auto">
            <h2>cell uID: {clusterID.uID} </h2>
            <h3>ClusterID: {clusterID.clusterID} </h3>
            <div className="inline-flex px-2">
                <button
                    onClick={() => setSelectedVar("cluster_ID")}
                    className={`bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l ${selectedVar === "cluster_ID" ? 'bg-gray-400' : ''}`}
                >
                    <div className="flex flex-col items-center">
                        <span>Urban Type</span>
                        <span>Equal Intervals</span>
                    </div>
                </button>
                <button
                    onClick={() => setSelectedVar("one_dimensional_diff_between_clusters")}
                    className={`bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r ${selectedVar === "one_dimensional_diff_between_clusters" ? 'bg-gray-400' : ''}`}
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
                        <div key={key} className={`p-4 border mb-4 ${selectedVar === key ? 'bg-gray-400' : ''}`} onClick={() => setSelectedVar(key)}>
                            <h3 className="text-lg font-bold mb-2">{key}</h3>
                            <p>{value["base"]}</p>
                            <ViolinPlot
                                city_data={city_data[selectedCity]}
                                width={sidebarWidth}
                                height={50}
                                plotKey={key}
                                targetValue={value["base"]}
                            />
                            <Dropdown city_data={city_data[selectedCity]}
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