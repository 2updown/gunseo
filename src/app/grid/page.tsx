"use client";

import { FilterBar } from '@/components/grid/FilterBar';
import { MappingGrid } from '@/components/grid/MappingGrid';
import { DetailPanel } from '@/components/grid/DetailPanel';
import { useStore } from '@/store/useStore';

export default function GridPage() {
    const isPanelOpen = useStore(state => state.isPanelOpen);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            {/* Top Bar with Back button and Tabs */}
            <div className="h-12 border-b border-gray-200 flex items-center px-4 space-x-4">
                <div className="flex space-x-6 h-full">
                    <div className="border-b-2 border-blue-600 h-full flex items-center px-1">
                        <span className="text-blue-600 font-medium text-sm">ATL 차트</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white border-b border-gray-200">
                <FilterBar />
            </div>

            <div className="flex-1 overflow-hidden relative flex">
                <MappingGrid />

                {/* Helper overlay for panel */}
                {isPanelOpen && (
                    <div className="fixed inset-0 bg-black/20 z-[90]" aria-hidden="true" onClick={() => useStore.getState().closePanel()} />
                )}
                <DetailPanel />
            </div>
        </div>
    );
}
