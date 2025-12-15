"use client";

import { useStore } from '@/store/useStore';
import { UNITS } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

export function CoverageChart() {
    const mappings = useStore(state => state.mappings);

    const data = useMemo(() => {
        // Group mappings by Grade
        // Map -> unitId -> Unit -> Grade
        const gradeCounts = { 1: 0, 2: 0, 3: 0 };

        mappings.forEach(m => {
            const unit = UNITS.find(u => u.id === m.unitId);
            if (unit && (unit.grade === 1 || unit.grade === 2 || unit.grade === 3)) {
                gradeCounts[unit.grade]++;
            }
        });

        return [
            { name: 'Grade 1', count: gradeCounts[1] },
            { name: 'Grade 2', count: gradeCounts[2] },
            { name: 'Grade 3', count: gradeCounts[3] },
        ];
    }, [mappings]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[400px]">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Mappings per Grade</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f3f4f6' }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
