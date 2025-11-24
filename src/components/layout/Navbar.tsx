"use client";

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
    const pathname = usePathname();
    
    const getPageName = () => {
        if (pathname === "/" || pathname === "") {
            return "TODO";
        }
        return pathname.slice(1).toUpperCase();
    };

    return (
        <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
            <div className="px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-slate-900"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
                        {getPageName()}
                    </h1>
                </div>
            </div>
        </header>
    );
}