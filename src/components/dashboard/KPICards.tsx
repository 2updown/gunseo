"use client";

import { useStore } from '@/store/useStore';
import { UNITS } from '@/lib/mockData';
import { LayoutGrid, CheckCircle, BarChart as BarChartIcon, AlertCircle } from 'lucide-react';

export function KPICards() {
    const { mappings, atlSkills } = useStore();

    // Calculate Metrics
    const totalSkills = atlSkills.length;

    // Units with at least one mapping
    const mappedUnitIds = new Set(mappings.map(m => m.unitId));
    const mappedUnitsCount = mappedUnitIds.size;
    const totalUnits = UNITS.length;
    const mappingProgress = Math.round((mappedUnitsCount / totalUnits) * 100) || 0;

    // Average Maps per Unit
    const avgMapsPerUnit = mappings.length > 0 ? (mappings.length / totalUnits).toFixed(1) : "0";

    // Unmapped Skills (Skills that are not used in ANY unit)
    const usedSkillIds = new Set(mappings.map(m => m.skillId));
    const unmappedSkillsCount = totalSkills - usedSkillIds.size;

    const cards = [
        { label: 'Total ATL Skills', value: totalSkills, icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Units Mapped', value: `${mappingProgress}%`, sub: `${mappedUnitsCount}/${totalUnits}`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Avg Skills / Unit', value: avgMapsPerUnit, icon: BarChartIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Unused Skills', value: unmappedSkillsCount, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between">
                    <div>
                        <div className="text-gray-500 text-sm font-medium mb-1">{card.label}</div>
                        <div className="text-3xl font-bold text-gray-800">{card.value}</div>
                        {card.sub && <div className="text-xs text-gray-400 mt-1">{card.sub}</div>}
                    </div>
                    <div className={`p-3 rounded-lg ${card.bg}`}>
                        <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}
