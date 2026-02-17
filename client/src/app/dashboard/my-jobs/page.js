'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FiSearch,
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
    FiUsers,
    FiChevronLeft,
    FiChevronRight,
    FiCheckCircle,
} from 'react-icons/fi';
import api from '@/lib/api';
import Shimmer from '@/components/ui/Shimmer';

export default function MyJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openMenu, setOpenMenu] = useState(null);
    const [deleteJob, setDeleteJob] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenu && !event.target.closest('.action-menu-container')) {
                setOpenMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenu]);

    useEffect(() => {
        fetchJobs();
    }, [page, search]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/jobs?page=${page}&limit=10&search=${search}`);
            setJobs(res.data.jobs);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!deleteJob) return;
        try {
            await api.delete(`/jobs/${deleteJob._id}`);
            setJobs(jobs.filter((j) => j._id !== deleteJob._id));
            setDeleteJob(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const formatDeadline = (job) => {
        if (job.status === 'Expired') {
            return new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        return `${job.daysRemaining} days remaining`;
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Jobs</h2>
                <div className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E5E6] rounded-xl bg-white">
                    <FiSearch className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={search}
                        onChange={handleSearch}
                        className="border-none outline-none text-sm w-48 bg-transparent"
                    />
                </div>
            </div>

            {loading ? (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <Shimmer className="h-[46px] w-[230px] rounded-xl" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="space-y-2">
                                    <Shimmer className="h-6 w-64" />
                                    <Shimmer className="h-4 w-40" />
                                </div>
                                <Shimmer className="h-8 w-24 rounded-full" />
                                <Shimmer className="h-5 w-32" />
                                <div className="flex gap-2">
                                    <Shimmer className="h-8 w-24 rounded-full" />
                                    <Shimmer className="h-8 w-8 rounded mr-8" />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : jobs.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <div className="text-5xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{search ? 'No jobs found' : 'No jobs posted yet'}</h3>
                    <p className="text-sm mb-6">{search ? 'Try a different search term.' : 'Create your first job listing to start receiving applications.'}</p>
                    {!search && (
                        <Link href="/dashboard/post-job">
                            <button className="py-3 px-6 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition cursor-pointer border-none">Post a Job</button>
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto pb-4">
                        <motion.table className="w-full border-collapse min-w-[800px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <thead>
                                <tr className="bg-[#F2F2F3] text-left h-[38px]">
                                    <th className="p-3 rounded-l-[10px] text-[15px] font-medium text-gray-500 pl-6 whitespace-nowrap w-[50%]">Jobs</th>
                                    <th className="p-3 text-[15px] font-medium text-gray-500 whitespace-nowrap w-[16%]">Status</th>
                                    <th className="p-3 text-[15px] font-medium text-gray-500 whitespace-nowrap w-[16%]">Applications</th>
                                    <th className="p-3 rounded-r-[10px] text-[15px] font-medium text-gray-500 whitespace-nowrap text-right pr-6 w-[18%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, idx) => (
                                    <motion.tr
                                        key={job._id}
                                        className="hover:bg-gray-50"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * idx }}
                                    >
                                        <td className="p-4 border-b border-[#E5E5E6] align-middle whitespace-nowrap">
                                            <div className="font-medium text-gray-900 text-[18px] mb-0.5">{job.title}</div>
                                            <div className="text-[14px] text-gray-400">{job.type} · {formatDeadline(job)}</div>
                                        </td>
                                        <td className="p-4 border-b border-gray-100 align-middle whitespace-nowrap">
                                            {job.status === 'Active' ? (
                                                <div className="flex items-center gap-2 text-green-500 font-medium text-[15px]">
                                                    <FiCheckCircle className="text-xl" /> Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500 font-medium text-[15px]">
                                                    <FiCheckCircle className="text-xl" /> {job.status}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 border-b border-gray-100 align-middle whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[15px]">
                                                <FiUsers size={14} /> {job.applications || 0} Applications
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-100 align-middle whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-4">
                                                <Link href={`/dashboard/jobs/${job._id}`}>
                                                    <button className="py-3 px-8 rounded-full text-primary text-[15px] font-medium bg-[#E5E6FB] hover:bg-[#d6d7fc] transition cursor-pointer border-none">
                                                        View Job
                                                    </button>
                                                </Link>
                                                <div className="relative action-menu-container">
                                                    <button
                                                        className="bg-transparent text-gray-400 text-xl p-1 rounded hover:bg-gray-100 cursor-pointer border-none"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenu(openMenu === job._id ? null : job._id);
                                                        }}
                                                    >
                                                        <FiMoreVertical />
                                                    </button>
                                                    {openMenu === job._id && (
                                                        <motion.div
                                                            className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-[10px] shadow-lg min-w-[160px] z-20 overflow-hidden"
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            <button
                                                                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-900 hover:bg-gray-50 transition w-full bg-transparent text-left border-none cursor-pointer"
                                                                onClick={() => { setOpenMenu(null); router.push(`/dashboard/edit-job/${job._id}`); }}
                                                            >
                                                                <FiEdit2 size={14} /> Edit Job
                                                            </button>
                                                            <button
                                                                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-gray-50 transition w-full bg-transparent text-left border-none cursor-pointer"
                                                                onClick={() => { setOpenMenu(null); setDeleteJob(job); }}
                                                            >
                                                                <FiTrash2 size={14} /> Delete Job
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </motion.table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition disabled:opacity-40 cursor-pointer"
                            >
                                <FiChevronLeft size={14} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition cursor-pointer border-none ${p === page ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition disabled:opacity-40 cursor-pointer"
                            >
                                <FiChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </>
            )}

            {deleteJob && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[200] pt-20" onClick={() => setDeleteJob(null)}>
                    <motion.div
                        className="bg-white rounded-[20px] p-6 max-w-[400px] w-full mx-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <h3 className="text-[20px] font-bold text-gray-900 mb-2">Delete Job</h3>
                        <p className="text-[14px] text-gray-500 mb-6">Are you sure you want to delete this job?</p>
                        <div className="border-t border-[#E5E5E6] pt-5 flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteJob(null)}
                                className="py-2.5 px-6 rounded-full text-[14px] font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="py-2.5 px-6 rounded-full text-[14px] font-semibold bg-[#F13A30] text-white hover:bg-red-600 transition cursor-pointer border-none"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
