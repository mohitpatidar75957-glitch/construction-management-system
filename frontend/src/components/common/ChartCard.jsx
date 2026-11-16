import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ChartCard() {
  const chartData = [
    { month: 'Jan', income: 4.8, expense: 3.2 },
    { month: 'Feb', income: 5.6, expense: 4.0 },
    { month: 'Mar', income: 7.2, expense: 4.8 },
    { month: 'Apr', income: 6.4, expense: 5.1 },
    { month: 'May', income: 8.5, expense: 5.8 },
    { month: 'Jun', income: 7.6, expense: 5.2 },
    { month: 'Jul', income: 9.1, expense: 6.2 },
    { month: 'Aug', income: 8.4, expense: 5.9 },
    { month: 'Sep', income: 9.5, expense: 6.8 },
    { month: 'Oct', income: 8.0, expense: 5.5 },
    { month: 'Nov', income: 9.8, expense: 6.9 },
    { month: 'Dec', income: 8.9, expense: 6.2 },
  ];

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Profit & Loss</h3>
          <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, margin: '2px 0 0 0' }}>
            Monthly income vs expenses (all sites)
          </p>
        </div>
        <span className="glass-pill" style={{ padding: '2px 10px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
          2026
        </span>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0F172A' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} /> Income
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748B' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A' }} /> Expenses
        </span>
      </div>

      <div style={{ width: '100%', height: '185px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.7)" />
            <XAxis 
              dataKey="month" 
              stroke="#64748B" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={4}
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              ticks={[0, 2, 5, 7, 10]}
              tickFormatter={(v) => `₹${v} Cr`}
            />
            <Tooltip 
              cursor={false}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(16px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.85)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                fontSize: '11px',
                color: '#0F172A',
                fontWeight: 600
              }}
              formatter={(val, name) => [`₹${val} Cr`, name === 'income' ? 'Income' : 'Expenses']}
            />
            <Bar 
              dataKey="income" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={9}
            />
            <Bar 
              dataKey="expense" 
              fill="#0F172A" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={9}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
