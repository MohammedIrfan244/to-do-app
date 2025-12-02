"use client";

import { navItems } from '@/lib/nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { LogOut } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
    const pathname = usePathname();
    const [showSignOutModal, setShowSignOutModal] = useState(false);

    const handleSignOut = () => {
        signOut({ callbackUrl: "/auth/login" });
    };

    return (
        <>
            <aside 
                className={clsx(
                    "h-screen overflow-hidden border-r border-slate-200 transition-all duration-300 bg-gradient-to-b from-white to-slate-50",
                    open ? "w-64" : "w-0"
                )}
            >
                <div className="p-6 h-full flex flex-col">

                    {/* LOGO + BRANDING */}
                    <div className="mb-6 pb-6 border-b border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">DORIO</h2>

                        <p className="text-xs text-slate-400 mt-1 tracking-wide">
                            Your personal daily companion
                        </p>
                    </div>

                    {/* NAV */}
                    <nav className="flex-1 space-y-3 pr-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                        {navItems.map((item) => {
                            const isActive = pathname === item.url;

                            return (
                                <Link key={item.url} href={item.url}>
                                    <button 
                                        className={clsx(
                                            "group w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-3 border border-transparent hover:scale-[1.01]",
                                            isActive 
                                                ? "text-slate-900 shadow-sm scale-[1.02] border-slate-300"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                        style={{
                                            backgroundColor: isActive 
                                                ? `${item.color}22` // lower opacity active bg
                                                : 'transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) e.currentTarget.style.backgroundColor = `${item.color}12`; 
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >

                                        {/* ICON micro animation & visibility fix */}
                                        <span
                                            className="flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[2deg]"
                                            style={{
                                                color: item.color,
                                                opacity: isActive ? 1 : 0.95,
                                            }}
                                        >
                                            {item.icon}
                                        </span>

                                        <span className="relative top-[1px]">
                                            {item.label}
                                        </span>
                                    </button>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* SIGN OUT BUTTON */}
                    <button
                        onClick={() => setShowSignOutModal(true)}
                        className="
                            mt-6 w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg 
                            text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer 
                            transition-all duration-200 flex items-center gap-3 group 
                            border border-transparent hover:border-red-100
                        "
                    >
                        <LogOut size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                            Sign out
                        </span>
                    </button>
                </div>
            </aside>

            <ConfirmModal
                open={showSignOutModal}
                title="Sign out?"
                description="Are you sure you want to sign out of your account?"
                confirmLabel="Sign out"
                cancelLabel="Cancel"
                onConfirm={handleSignOut}
                onCancel={() => setShowSignOutModal(false)}
            />
        </>
    );
}
