'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMoreVertical, FiEdit2, FiTrash2, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import Shimmer from '@/components/ui/Shimmer';

export default function DashboardPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
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
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs?limit=5');
            setJobs(res.data.jobs);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/jobs/${deleteJob._id}`);
            setJobs(jobs.filter(j => j._id !== deleteJob._id));
            setDeleteJob(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="mb-7 space-y-2">
                    <Shimmer className="h-8 w-64" />
                    <Shimmer className="h-4 w-96" />
                </div>
                <div className="flex flex-col md:flex-row gap-5 mb-9">
                    <Shimmer className="h-[92px] w-full md:w-[300px] rounded-[10px]" />
                    <Shimmer className="h-[92px] w-full md:w-[300px] rounded-[10px]" />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-5">
                        <Shimmer className="h-7 w-48" />
                        <Shimmer className="h-5 w-16" />
                    </div>
                    <Shimmer className="h-[200px] w-full rounded-[10px]" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-7">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-medium mb-1"
                >
                    Good morning, {user?.fullName?.split(' ')[0] || 'User'}
                </motion.h1>
                <p className="text-sm text-gray-500">Here is your daily activity and applications</p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 mb-9">
                <motion.div
                    className="flex items-center justify-between px-6 py-5 rounded-[10px] w-full md:w-[300px] bg-[#E5E6FB]"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div>
                        <div className="text-[28px] font-medium">{jobs.length}</div>
                        <div className="text-[13px] text-gray-500 mt-0.5">Open Jobs</div>
                    </div>
                    <div className="w-12 h-12 rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
                        <Image src="/assets/suit.svg" alt="Open Jobs" width={42} height={42} />
                    </div>
                </motion.div>
                <motion.div
                    className="flex items-center justify-between px-6 py-5 rounded-[10px] w-full md:w-[300px] bg-[#FCF3E4]"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div>
                        <div className="text-[28px] font-medium">0</div>
                        <div className="text-[13px] text-gray-500 mt-0.5">Saved Candidates</div>
                    </div>
                    <div className="w-12 h-12 rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
                        <Image src="/assets/card.svg" alt="Saved Candidates" width={48} height={48} />
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium">Recently Posted Jobs</h2>
                <Link href="/dashboard/my-jobs" className="text-[13px] text-primary font-medium no-underline">View all</Link>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <div className="text-5xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs posted yet</h3>
                    <p className="text-sm mb-6">Get started by posting your first job listing</p>
                    <Link href="/dashboard/post-job">
                        <button className="py-3 px-6 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition cursor-pointer">
                            Post a Job
                        </button>
                    </Link>
                </div>
            ) : (
                <motion.div className="overflow-x-auto pb-32"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-[#F2F2F3] text-left h-[38px]">
                                <th className="p-3 rounded-l-[10px] text-[15px] font-medium text-gray-500 pl-6 whitespace-nowrap w-[50%]">Jobs</th>
                                <th className="p-3 text-[15px] font-medium text-gray-500 whitespace-nowrap w-[16%]">Status</th>
                                <th className="p-3 text-[15px] font-medium text-gray-500 whitespace-nowrap w-[16%]">Applications</th>
                                <th className="p-3 rounded-r-[10px] text-[15px] font-medium text-gray-500 whitespace-nowrap text-right pr-6 w-[18%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job._id} className="border-b border-[#E5E5E6] last:border-none">
                                    <td className="p-4 align-middle pl-6 whitespace-nowrap">
                                        <div className="font-medium text-gray-900 text-[18px] mb-1.5">{job.title}</div>
                                        <div className="text-[14px] text-gray-400 flex items-center gap-2">
                                            {job.type} <span className="w-1 h-1 rounded-full bg-gray-300"></span> {job.daysRemaining} days remaining
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle whitespace-nowrap">
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
                                    <td className="p-4 align-middle whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-gray-500 text-[15px]">
                                            <FiUsers className="text-xl" /> {job.applications || 0} Applications
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-4">
                                            <Link href={`/dashboard/jobs/${job._id}`}>
                                                <button className="py-3 px-8 rounded-full text-primary text-[15px] font-medium bg-[#E5E6FB] hover:bg-[#d6d7fc] transition cursor-pointer border-none">
                                                    View Job
                                                </button>
                                            </Link>
                                            <div className="relative action-menu-container">
                                                <button
                                                    className="bg-transparent text-gray-400 text-xl p-1 rounded hover:bg-gray-100 cursor-pointer border-none ml-4"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenu(openMenu === job._id ? null : job._id);
                                                    }}
                                                >
                                                    <FiMoreVertical />
                                                </button>
                                                {openMenu === job._id && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-[10px] shadow-lg min-w-[160px] z-20 overflow-hidden">
                                                        <Link href={`/dashboard/edit-job/${job._id}`} className="no-underline">
                                                            <button className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-900 hover:bg-gray-50 transition w-full bg-transparent text-left border-none cursor-pointer">
                                                                <FiEdit2 /> Edit
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => { setDeleteJob(job); setOpenMenu(null); }}
                                                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-gray-50 transition w-full bg-transparent text-left border-none cursor-pointer"
                                                        >
                                                            <FiTrash2 /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {deleteJob && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[200] pt-20" onClick={() => setDeleteJob(null)}>
                    <motion.div
                        className="bg-white rounded-[20px] p-6 max-w-[400px] w-full mx-4 shadow-xl"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
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
