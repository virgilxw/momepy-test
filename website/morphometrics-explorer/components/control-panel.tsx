import React, { useState, useEffect } from 'react';

function Legend({ data }) {

  if (!data || data.length === 0) {
    return null;
  } else if (data.length > 8) {
    return (
      <div className={`grid grid-cols-2 gap-x-4`}>
        <div>
          {data.slice(0, Math.ceil(data.length / 2)).map(([value, color], index) => (
            <div key={value + index} className="flex items-center space-x-2">
              <div
                style={{ backgroundColor: color }}
                className="w-6 h-3 border rounded"
              />
              <div className="text-xs">{value}</div>
            </div>
          ))}
        </div>
        <div>
          {data.slice(Math.ceil(data.length / 2)).map(([value, color], index) => (
            <div key={value + index} className="flex items-center space-x-2">
              <div
                style={{ backgroundColor: color }}
                className="w-6 h-3 border rounded"
              />
              <div className="text-xs">{value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className={`grid grid-cols-2 gap-x-4`}>
        <div>
          {data.map(([value, color], index) => (
            <div key={value + index} className="flex items-center space-x-2">
              <div
                style={{ backgroundColor: color }}
                className="w-6 h-3 border rounded"
              />
              <div className="text-xs">{value}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

function ControlPanel({ selectedVar, setSelectedVar, selectedVarScale, setSelectedVarScale, selectedCity, setSelectedCity}) {

  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch the JSON file
    fetch('panel-description.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json(); // This returns a promise
      })
      .then((data) => {
        // Update the state to trigger a re-render.
        // Note that "data" is an object and will be added to the list
        setData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [selectedVar]);

  return (
    <div className="control-panel container mx-auto" >

      <div className="flex">
        <div className="w-3/4 p-4">
          <h3>Displayed Variable: {data && data[selectedVar] ? data[selectedVar]["name"] : 'N/A'} </h3>
          <p>{data && data[selectedVar] ? data[selectedVar]["description"] : 'No description available'}</p>
        </div>

        <div className="w-1/4 py-4 px-8 text-right">
          <h1>Legend</h1>
          {data && <Legend data={selectedVarScale} />}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);