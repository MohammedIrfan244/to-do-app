"use client";

import { navItems } from '@/lib/nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    open: boolean;
}


export default function Sidebar({ open }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${open ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="p-8 h-full flex flex-col">
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">DURIO</h2>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.url} href={item.url}>
                            <button 
                                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                                    pathname === item.url
                                        ? "bg-slate-100 text-slate-900" 
                                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                {item.label}
                            </button>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}