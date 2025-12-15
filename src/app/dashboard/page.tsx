"use client";

import { KPICards } from '@/components/dashboard/KPICards';
import { Heatmap } from '@/components/dashboard/Heatmap';
import { CoverageChart } from '@/components/dashboard/CoverageChart';

export default function DashboardPage() {
    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
                <KPICards />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Heatmap />
                    <CoverageChart />
                </div>
            </div>
        </div>
    );
}
