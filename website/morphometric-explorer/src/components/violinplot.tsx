import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ViolinPlot = ({ data, width, height, margin }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Create the violin plot using D3
    const svg = d3.select(svgRef.current);

    // Clear previous plot
    svg.selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.key))
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(d.values))]).nice()
      .range([height - margin.bottom, margin.top]);

    const kde = kernelDensityEstimator(kernelEpanechnikov(7), y.ticks(50));

    svg.append('g')
      .attr('fill', 'steelblue')
      .selectAll('path')
      .data(data.map(({ key, values }) => ({
        key,
        density: kde(values)
      })))
      .join('path')
      .attr('transform', d => `translate(${x(d.key)},0)`)
      .attr('d', d => d3.area()
        .curve(d3.curveCatmullRom)
        .x0(x.bandwidth() / 2)
        .x1(d => x.bandwidth() / 2 - d[1])
        .y(([value, ]) => y(value))(d.density));

    // Add random highlight
    const randomHighlight = (arr) => arr[Math.floor(Math.random() * arr.length)];

    svg.selectAll('.highlight')
      .data(data.map(({ values }) => randomHighlight(values)))
      .join('circle')
      .attr('class', 'highlight')
      .attr('r', 4)
      .attr('fill', 'red')
      .attr('cx', (d, i) => x(data[i].key) + x.bandwidth() / 2)
      .attr('cy', d => y(d));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
  }, [data, width, height, margin]);

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};

function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
  };
}

function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

export default ViolinPlot;