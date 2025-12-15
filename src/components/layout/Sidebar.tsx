"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, TableProperties, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '@/store/useStore';

export function Sidebar() {
    const pathname = usePathname();
    const { isSidebarCollapsed, toggleSidebar } = useStore();

    const navItems = [
        { name: '대시보드', href: '/dashboard', icon: LayoutGrid },
        { name: '평가표', href: '/grid', icon: TableProperties },
    ];

    return (
        <aside
            className={clsx(
                "bg-white border-r border-gray-200 flex flex-col fixed left-0 top-16 transition-all duration-300 z-40",
                isSidebarCollapsed ? "w-20" : "w-64"
            )}
            style={{ height: 'calc(100vh - 4rem)' }}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 z-30"
            >
                {isSidebarCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                ) : (
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                )}
            </button>

            {/* Spacer removed as we are pushing down via top-16 */}

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group overflow-hidden whitespace-nowrap",
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            title={isSidebarCollapsed ? item.name : undefined}
                        >
                            <item.icon className={clsx("flex-shrink-0 h-5 w-5", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500", !isSidebarCollapsed && "mr-3")} />
                            <span className={clsx("transition-opacity duration-200", isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors overflow-hidden whitespace-nowrap"
                    title={isSidebarCollapsed ? "Settings" : undefined}
                >
                    <Settings className={clsx("flex-shrink-0 h-5 w-5 text-gray-400", !isSidebarCollapsed && "mr-3")} />
                    <span className={clsx("transition-opacity duration-200", isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                        Settings
                    </span>
                </button>
                <button
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-1 overflow-hidden whitespace-nowrap"
                    title={isSidebarCollapsed ? "Logout" : undefined}
                >
                    <LogOut className={clsx("flex-shrink-0 h-5 w-5", !isSidebarCollapsed && "mr-3")} />
                    <span className={clsx("transition-opacity duration-200", isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}
