'use client';

import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function RevenueEbitdaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="year" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} />
        <Line type="monotone" dataKey="ebitda" stroke="#10b981" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default memo(RevenueEbitdaChart);
