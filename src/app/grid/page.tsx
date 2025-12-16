"use client";

import { FilterBar } from '@/components/grid/FilterBar';
import { MappingGrid } from '@/components/grid/MappingGrid';
import { DetailPanel } from '@/components/grid/DetailPanel';
import { useStore } from '@/store/useStore';
import { useSearchParams } from 'next/navigation';
import { STUDENTS } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function GridContent() {
    const isPanelOpen = useStore(state => state.isPanelOpen);
    const searchParams = useSearchParams();
    const studentId = searchParams.get('student');

    // Find the student by ID
    const student = studentId ? STUDENTS.find(s => s.id === studentId) : null;

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            {/* Top Bar with Back button and Student Info */}
            <div className="h-14 border-b border-gray-200 flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                    {student && (
                        <Link
                            href="/assessment"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">학생 목록</span>
                        </Link>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="border-b-2 border-blue-600 h-14 flex items-center px-1">
                            <span className="text-blue-600 font-medium text-sm">ATL 차트</span>
                        </div>
                        {student && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                                <span className="text-sm font-semibold text-blue-900">{student.name}</span>
                                <span className="text-xs text-blue-600">Grade {student.grade}</span>
                            </div>
                        )}
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

export default function GridPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        }>
            <GridContent />
        </Suspense>
    );
}

