"use client";

import { Student } from '@/types';
import { User } from 'lucide-react';
import Link from 'next/link';

interface StudentCardProps {
    student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
    return (
        <Link
            href={`/grid?student=${student.id}`}
            className="group block bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
            <div className="p-6">
                {/* Avatar */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8 text-white" />
                </div>

                {/* Student Info */}
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {student.name}
                    </h3>
                    <div className="flex flex-col items-center gap-1.5 text-sm">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                            Grade {student.grade}
                        </span>
                        <span className="text-gray-500">{student.studentNumber}</span>
                    </div>
                </div>
            </div>

            {/* Hover Effect Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>
    );
}
