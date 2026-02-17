'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FiEdit2,
    FiTrash2,
} from 'react-icons/fi';
import Link from 'next/link';

import api from '@/lib/api';
import Shimmer from '@/components/ui/Shimmer';

export default function JobDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        fetchJob();
    }, []);

    const fetchJob = async () => {
        try {
            const res = await api.get(`/jobs/${params.id}`);
            setJob(res.data.job);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/jobs/${params.id}`);
            router.push('/dashboard/my-jobs');
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    if (loading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <Shimmer className="h-8 w-48" />
                    <div className="flex gap-4">
                        <Shimmer className="h-10 w-10 rounded-lg" />
                        <Shimmer className="h-10 w-32 rounded-full" />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <Shimmer className="h-8 w-3/4" />
                        <Shimmer className="h-4 w-full" />
                        <Shimmer className="h-4 w-full" />
                        <Shimmer className="h-4 w-5/6" />
                        <div className="space-y-2 pt-4">
                            <Shimmer className="h-6 w-40 mb-2" />
                            <Shimmer className="h-4 w-full" />
                            <Shimmer className="h-4 w-full" />
                        </div>
                    </div>
                    <div className="w-full lg:w-[550px] space-y-6">
                        <Shimmer className="h-[100px] w-full rounded-[16px]" />
                        <Shimmer className="h-[300px] w-full rounded-[16px]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-16 text-gray-400">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Job not found</h3>
                <p className="text-sm mb-6">The job you're looking for doesn't exist or was deleted.</p>
                <button className="py-3 px-6 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition cursor-pointer border-none" onClick={() => router.push('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const salaryDisplay = (job.salary?.min || job.salary?.max)
        ? `$${(job.salary.min || 0).toLocaleString()} - $${(job.salary.max || 0).toLocaleString()}`
        : 'Not specified';

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-[24px] font-semibold text-gray-900">Job Details</h1>
                <div className="flex gap-4 items-center">
                    <button
                        className="flex items-center justify-center w-10 h-10 text-red-500 bg-white  hover:bg-red-50 rounded-lg transition cursor-pointer"
                        onClick={() => setDeleteModal(true)}
                    >
                        <img src="/assets/delete.svg" alt="Delete" className="w-[18px] h-[18px]" />
                    </button>
                    <Link href={`/dashboard/edit-job/${job._id}`}>
                        <button
                            className="py-2.5 px-6 rounded-full text-sm font-medium bg-[#5D5FEF] text-white hover:bg-primary-dark transition cursor-pointer border-none"
                        >
                            Edit Job
                        </button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">{job.title}</h2>
                    <p className="text-[15px] text-gray-600 leading-7 whitespace-pre-wrap mb-8">{job.description}</p>

                    {job.requirements && (
                        <>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Requirements</h3>
                            <div className="text-[15px] text-gray-600 leading-7 whitespace-pre-wrap pl-1">
                                {job.requirements.split('\n').map((req, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <span className="text-gray-400">•</span>
                                        <span>{req.replace(/^•\s*/, '')}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>


                <div className="w-full lg:w-[550px] flex-shrink-0 space-y-6">

                    <div className="bg-white border border-[#E5E5E6] rounded-[16px] p-6">
                        <div className="flex items-center">
                            <div className="flex-1 text-center border-r border-[#E5E5E6] pr-4">
                                <div className="text-[15px] text-gray-500 mb-1.5">Salary (USD)</div>
                                <div className="text-[19px] font-semibold text-[#34A853]">{salaryDisplay}</div>
                                <div className="text-[14px] text-gray-400 mt-0.5">{job.salary?.type || 'Yearly'} salary</div>
                            </div>
                            <div className="flex-1 text-center pl-4">
                                <div className="flex justify-center mb-1.5"><img src="/assets/job-location.svg" alt="Location" className="w-[24px] h-[24px]" /></div>
                                <div className="text-[15px] text-gray-500 mb-0.5">Job Location</div>
                                <div className="text-[17px] font-semibold text-gray-900">{job.location || 'Not specified'}</div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white border border-[#E5E5E6] rounded-[16px] p-6">
                        <h4 className="text-[19px] font-semibold mb-6 text-gray-900">Job Overview</h4>
                        <div className="grid grid-cols-2 gap-y-7 gap-x-4">
                            <div>
                                <div className="mb-2 flex justify-start"><img src="/assets/job-posted.svg" alt="Posted" className="w-[22px] h-[22px]" /></div>
                                <div className="text-[15px] text-gray-500 mb-0.5">Job Posted</div>
                                <div className="text-[16px] font-medium text-gray-900">{formatDate(job.createdAt)}</div>
                            </div>
                            <div>
                                <div className="mb-2 flex justify-start"><img src="/assets/job-expireson.svg" alt="Expires" className="w-[22px] h-[22px]" /></div>
                                <div className="text-[15px] text-gray-500 mb-0.5">Job Expires on</div>
                                <div className="text-[16px] font-medium text-gray-900">{formatDate(job.deadline)}</div>
                            </div>
                            <div>
                                <div className="mb-2 flex justify-start"><img src="/assets/job-level.svg" alt="Level" className="w-[22px] h-[22px]" /></div>
                                <div className="text-[15px] text-gray-500 mb-0.5">Job Level</div>
                                <div className="text-[16px] font-medium text-gray-900">{job.jobLevel || 'Entry Level'}</div>
                            </div>
                            <div>
                                <div className="mb-2 flex justify-start"><img src="/assets/experience.svg" alt="Experience" className="w-[22px] h-[22px]" /></div>
                                <div className="text-[15px] text-gray-500 mb-0.5">Experience</div>
                                <div className="text-[16px] font-medium text-gray-900">{job.experienceLevel || '1-2 years'}</div>
                            </div>
                            <div className="col-span-2">
                                <div className="mb-2 flex justify-start"><img src="/assets/education.svg" alt="Education" className="w-[24px] h-[24px]" /></div>
                                <div className="text-[15px] text-gray-500 mb-0.5">Education</div>
                                <div className="text-[16px] font-medium text-gray-900">{job.educationLevel || 'Graduation'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {deleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[200] pt-20" onClick={() => setDeleteModal(false)}>
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
                                onClick={() => setDeleteModal(false)}
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
        </motion.div>
    );
}
