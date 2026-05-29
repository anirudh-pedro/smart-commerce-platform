import React from 'react';
interface Props { title: string; value: string | number; }
export const MetricCard: React.FC<Props> = ({ title, value }) => {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};