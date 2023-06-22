import React, { useState, useEffect, useRef } from "react";

const Sidebar = ({ selectedCell, setSelectedCell }) => {

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
                <div key={key} className="p-4 border mb-4">
                    <h3 className="text-lg font-bold mb-2">{key}</h3>
                    <p>{value}</p>
                    {/* {plots[key] && (
                        <ViolinPlot
                            width={sidebarWidth}
                            height={50}
                            variable={key}
                            data={plots[key].data}
                            xScale={plots[key].xScale}
                        />
                    )} */}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;