import * as React from 'react';

function Legend({ data }) {
  if (data === null) {
    return null
  } else
    return (
      <div className={`grid ${data.length > 10 ? 'grid-cols-2 gap-x-4' : ''}`}>
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
        {data.length > 10 &&
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
        }
      </div>
    );
}

function ControlPanel({ selectedVar, setSelectedVar }) {

  console.log('%ccontrol-panel.tsx line:5 selectedVar.scale', 'color: #007acc;', selectedVar.scale);
  return (
    <div className="control-panel container mx-auto" >

      <div className="flex">
        {/* Component 1 */}
        <div className="w-3/4 p-4">
          <h3>Displayed Variable: {selectedVar.value} </h3>
          <p>{`The clusters are generated through a Gaussian Mixture Model on a matrix of Principal Components on the many different variables measured for each building. Buildings (with the data points from the elements of the street network closest to it and their corresponding tessellation plot cell) are grouped together into clusters, displayed in this choropleth map. The color key of the map represents the reduction of differences between each cluster to a one-dimensional scale. Very generally speaking, the more different the color key of a cluster is from another, the more different the clusters are from one another.`}</p>
        </div>

        {/* Component 2 */}
        <div className="w-1/4 py-4 px-8 text-right">
          <h1>Legend</h1>
          <Legend data={selectedVar.scale} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);