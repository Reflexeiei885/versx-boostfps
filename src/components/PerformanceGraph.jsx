import React from 'react';

function buildPoints(values, width, height, pad = 12) {
  if (!values.length) return '';
  const min = 0;
  const max = 100;
  const step = values.length === 1 ? 0 : (width - pad * 2) / (values.length - 1);
  return values.map((value, index) => {
    const x = pad + index * step;
    const y = height - pad - ((Math.max(min, Math.min(max, value)) - min) / (max - min)) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export default function PerformanceGraph({ series, height = 250 }) {
  const width = 1000;
  const gridY = [25, 50, 75];
  return (
    <div className="vx-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="vx-chart">
        {gridY.map((v) => {
          const y = height - 12 - (v / 100) * (height - 24);
          return <line key={v} x1="12" x2={width - 12} y1={y} y2={y} className="vx-chart-grid" />;
        })}
        {Object.entries(series).map(([key, item]) => (
          <polyline key={key} points={buildPoints(item.values, width, height)} className={`vx-chart-line ${item.className || ''}`} fill="none" />
        ))}
      </svg>
      <div className="vx-chart-labels">
        <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
      </div>
    </div>
  );
}
