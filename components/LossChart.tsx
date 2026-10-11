
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { DataPoint } from '../types';

interface TrendChartProps {
  data: DataPoint[];
  title: string;
  xLabel: string;
  yLabel: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, title, xLabel, yLabel }) => {
  return (
    <div className="h-80 w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 font-serif text-center uppercase tracking-wider">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              dy={10}
            >
              <Label value={xLabel} offset={-10} position="insideBottom" style={{ fill: '#64748b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }} />
            </XAxis>
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(val) => typeof val === 'number' && val > 1000 ? `${(val/1000).toFixed(1)}k` : val}
            >
              <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#64748b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }} />
            </YAxis>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1e293b', fontSize: '13px', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4f46e5" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#4f46e5' }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
