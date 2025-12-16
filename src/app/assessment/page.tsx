"use client";

import { useState } from 'react';
import { STUDENTS } from '@/lib/mockData';
import { StudentCard } from '@/components/assessment/StudentCard';
import { Search, Users } from 'lucide-react';

export default function AssessmentPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

    // Filter students based on search and grade
    const filteredStudents = STUDENTS.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.studentNumber.includes(searchQuery);
        const matchesGrade = selectedGrade === null || student.grade === selectedGrade;
        return matchesSearch && matchesGrade;
    });

    const grades = [1, 2, 3, 4, 5, 6];

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
            <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">학생 평가표</h1>
                        <p className="text-gray-500 mt-1">학생을 선택하여 ATL 평가표를 확인하세요</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">{filteredStudents.length}명</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="이름 또는 학번으로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Grade Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedGrade(null)}
                            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${selectedGrade === null
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            전체
                        </button>
                        {grades.map(grade => (
                            <button
                                key={grade}
                                onClick={() => setSelectedGrade(grade)}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${selectedGrade === grade
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                G{grade}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Student Grid */}
                {filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredStudents.map(student => (
                            <StudentCard key={student.id} student={student} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Users className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            검색 결과가 없습니다
                        </h3>
                        <p className="text-gray-500">
                            다른 검색어를 입력하거나 필터를 변경해보세요
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
