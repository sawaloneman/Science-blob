
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';
import { Point } from '../types';

interface DistributionChartProps {
  data: Point[];
  title: string;
  color: string;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ data, title, color }) => {
  return (
    <div className="h-80 w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 font-serif text-center uppercase tracking-wider">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="X-Coord" 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(val) => val.toFixed(0)}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Y-Coord" 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val.toFixed(0)}
            />
            <ZAxis range={[20, 80]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1e293b', fontSize: '13px', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
              formatter={(value, name) => [typeof value === 'number' ? value.toFixed(2) : value, name]}
            />
            <Scatter name="Observation" data={data} fill={color} shape="circle" animationDuration={1500}>
               {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={color} fillOpacity={0.4} stroke={color} strokeWidth={1} />
                ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
