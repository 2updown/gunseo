"use client";

import { useStore } from '@/store/useStore';
import { Grade } from '@/types';
import { Search } from 'lucide-react';

export function FilterBar() {
    const { selectedGrade, searchQuery, setGrade, setSearchQuery } = useStore();

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
                {/* Year Filter (Mock) */}
                <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="2024">2024-2025</option>
                    <option value="2023">2023-2024</option>
                </select>

                {/* Grade Filter */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setGrade('ALL')}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${selectedGrade === 'ALL' ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All Grades
                    </button>
                    {([1, 2, 3, 4, 5, 6] as Grade[]).map(g => (
                        <button
                            key={g}
                            onClick={() => setGrade(g)}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${selectedGrade === g ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            G{g}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search ATL Skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                onClick={() => {
                    const { mappings } = useStore.getState();
                    import('@/lib/exportUtils').then(mod => mod.downloadCSV(mappings));
                }}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center whitespace-nowrap"
            >
                Export CSV
            </button>
        </div>
    );
}
