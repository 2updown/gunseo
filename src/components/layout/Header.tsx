"use client";

import { Bell, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Header() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50 w-full">
            <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-3 hidden" /> {/* Placeholder for logo if needed */}
                <h1 className="text-xl font-bold text-gray-800">군서미래국제학교</h1>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="relative pl-4 border-l border-gray-200" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 hover:bg-gray-50 rounded-full p-1 transition-colors focus:outline-none"
                    >
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 ring-2 ring-white shadow-sm">
                            A
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                                <p className="text-sm font-bold text-gray-900">홍길동 선생님</p>
                                <p className="text-xs text-gray-500 mt-0.5">Teacher</p>
                            </div>
                            <div className="p-1">
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>마이페이지</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    <span>로그아웃</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
