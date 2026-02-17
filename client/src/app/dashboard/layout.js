'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiFileText, FiBookmark, FiSettings, FiLogOut, FiCreditCard, FiUser, FiPlusCircle, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);


    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const navItems = [
        { href: '/dashboard', icon: FiGrid, label: 'Overview' },
        { href: '/dashboard/profile', icon: FiUser, label: 'Employers profile' },
        { href: '/dashboard/post-job', icon: FiPlusCircle, label: 'Post a Job' },
        { href: '/dashboard/my-jobs', icon: FiFileText, label: 'My Jobs' },
        { href: '/dashboard/saved', icon: FiBookmark, label: 'Saved Candidate' },
        { href: '/dashboard/billing', icon: FiCreditCard, label: 'Plans & Billing' },
        { href: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-white">

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[100] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <header className="fixed top-0 left-0 right-0 h-[73px] bg-white border-b border-[#E5E5E6] px-4 md:px-8 flex items-center justify-between z-[100]">
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 -ml-2 text-gray-600 md:hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                    <Link href="/dashboard" className="flex items-center gap-2 no-underline">
                        <img src="/logo.svg" alt="JobPilot" className="w-8 h-8" />
                        <span className="text-lg font-bold text-gray-900 hidden sm:block">JobPilot</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard/post-job" className="no-underline hidden sm:block">
                        <button className="py-2.5 px-6 rounded-full text-sm font-semibold border-[1.5px] border-primary bg-white text-primary hover:bg-primary hover:text-white transition cursor-pointer">
                            Post a Job
                        </button>
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-semibold text-base cursor-pointer">
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                </div>
            </header>

            <aside className={`fixed top-[73px] bottom-0 w-[280px] bg-white border-r border-[#E5E5E6] flex flex-col z-[100] transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 left-0' : '-translate-x-full left-0'
                } md:left-0`}>
                <div className="pt-8 flex flex-col flex-1 pl-8">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 pl-4 mb-3">EMPLOYERS DASHBOARD</p>

                    <nav className="flex flex-col flex-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 py-[11px] px-4 text-sm font-medium border-l-[3px] transition no-underline cursor-pointer ${isActive
                                        ? 'text-primary bg-primary/[0.08] border-l-primary font-semibold'
                                        : 'text-gray-500 border-l-transparent hover:text-primary hover:bg-primary/[0.08]'
                                        }`}
                                >
                                    <item.icon className="text-lg flex-shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="mt-auto pb-8 mr-8">
                            <button
                                onClick={() => { logout(); router.push('/login'); }}
                                className="flex items-center gap-3 py-[11px] px-4 text-sm font-medium text-gray-500 border-l-[3px] border-l-transparent transition w-full cursor-pointer bg-transparent"
                            >
                                <FiLogOut className="text-lg" />
                                Log Out
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            <main className="md:ml-[280px] pt-[73px] min-h-screen transition-all duration-300">
                <div className="p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
