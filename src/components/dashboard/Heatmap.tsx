"use client";

import { useStore } from '@/store/useStore';
import { UNITS } from '@/lib/mockData';
import { useMemo } from 'react';
import { Grade } from '@/types';

export function Heatmap() {
    const { mappings, atlSkills, atlCategories } = useStore();

    // Areas from Categories to ensure order and correct labels
    // Filter out categories that have no skills if desired, or show all
    const areas = atlCategories;
    const grades: Grade[] = [1, 2, 3, 4, 5, 6];

    // Matrix: [AreaId][Grade] -> Count
    const matrix = useMemo(() => {
        const data: Record<string, Record<string, number>> = {};

        areas.forEach(cat => {
            data[cat.id] = {};
            grades.forEach(grade => {
                // Find mappings for this Area + Grade
                // 1. Find all skills in Area
                const skillIdsInArea = new Set(atlSkills.filter(s => s.area === cat.id).map(s => s.id));
                // 2. Find all units in Grade
                const unitIdsInGrade = new Set(UNITS.filter(u => u.grade === grade).map(u => u.id));

                // 3. Count mappings intersection
                const count = mappings.filter(m => skillIdsInArea.has(m.skillId) && unitIdsInGrade.has(m.unitId)).length;
                data[cat.id][grade] = count;
            });
        });
        return data;
    }, [mappings, areas, atlSkills]);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-gray-50 text-gray-300';
        if (count < 5) return 'bg-blue-100 text-blue-800';
        if (count < 10) return 'bg-blue-300 text-blue-900';
        if (count < 20) return 'bg-blue-500 text-white';
        return 'bg-blue-700 text-white';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-6">ATL Coverage Heatmap (by Grade)</h3>

            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left p-2 text-sm font-medium text-gray-500">ATL Area</th>
                        {grades.map(g => (
                            <th key={g} className="p-2 text-center text-sm font-bold text-gray-700">Grade {g}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {areas.map(cat => (
                        <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="p-3 text-sm font-bold text-gray-700">
                                {cat.labelKo} <span className="text-xs font-normal text-gray-400 block sm:inline">({cat.labelEn})</span>
                            </td>
                            {grades.map(g => {
                                const count = matrix[cat.id][g];
                                return (
                                    <td key={g} className="p-2 text-center">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mx-auto transition-transform hover:scale-110 ${getColor(count)}`}>
                                            {count}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
