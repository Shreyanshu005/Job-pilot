'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';

const JOB_ROLES = ['Designer', 'Developer', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Operations', 'Other'];
const SALARY_TYPES = ['Yearly', 'Monthly', 'Hourly'];
const EDUCATION_LEVELS = ['High School', 'Diploma', 'Graduation', 'Post Graduation', 'PhD'];
const EXPERIENCE_LEVELS = ['Fresher', '1-2 years', '3-5 years', '5-10 years', '10+ years'];
const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship'];
const JOB_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore', 'UAE'];
const CITIES = {
    'India': ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'],
    'United States': ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin', 'Seattle'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    'Germany': ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'],
    'Singapore': ['Singapore'],
    'UAE': ['Dubai', 'Abu Dhabi'],
};
const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'SGD', 'AED'];

export default function PostJobPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '', tags: '', jobRole: '', type: 'Full Time',
        salaryMin: '', salaryMax: '', salaryType: 'Yearly', currency: 'USD',
        educationLevel: '', experienceLevel: '', jobLevel: '',
        deadline: '', country: '', city: '', isRemote: false,
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'country') {
            setFormData({ ...formData, country: value, city: '' });
        } else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/jobs', {
                title: formData.title,
                tags: formData.tags,
                jobRole: formData.jobRole,
                type: formData.type,
                description: formData.description,
                salary: {
                    min: Number(formData.salaryMin) || 0,
                    max: Number(formData.salaryMax) || 0,
                    type: formData.salaryType,
                    currency: formData.currency,
                },
                educationLevel: formData.educationLevel,
                experienceLevel: formData.experienceLevel,
                jobLevel: formData.jobLevel,
                country: formData.country,
                city: formData.city,
                isRemote: formData.isRemote,
                deadline: formData.deadline,
            });
            router.push('/dashboard/my-jobs');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post job');
        }
        setLoading(false);
    };

    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition placeholder:text-gray-500";
    const selectClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition bg-white appearance-none cursor-pointer bg-[url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M7 15l5 5 5-5'/%3e%3cpath d='M7 9l5-5 5 5'/%3e%3c/svg%3e\")] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em_1.25em] pr-10";
    const groupInputClass = "w-full pl-4 pr-20 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition placeholder:text-gray-500";

    const availableCities = formData.country ? (CITIES[formData.country] || []) : [];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-bold mb-8">Post a job</h1>

            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">{error}</div>}

            <form onSubmit={handleSubmit} className="w-full">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Job Titles</label>
                        <input type="text" name="title" className={inputClass} value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Tags</label>
                        <input type="text" name="tags" className={inputClass} value={formData.tags} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Job Role</label>
                        <select name="jobRole" className={selectClass} value={formData.jobRole} onChange={handleChange}>
                            <option value="">Select</option>
                            {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>


                <h3 className="text-base font-bold mb-4">Salary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Min Salary</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="salaryMin"
                                className={groupInputClass}
                                value={formData.salaryMin}
                                onChange={handleChange}
                                placeholder="Min Salary"
                            />
                            <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gray-100 border-l border-gray-200 rounded-r-xl px-0">
                                <span className="absolute left-3 text-sm text-gray-500 font-medium pointer-events-none flex items-center gap-1">
                                    {formData.currency}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500">
                                        <path d="M7 15l5 5 5-5" />
                                        <path d="M7 9l5-5 5 5" />
                                    </svg>
                                </span>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="bg-transparent text-sm text-transparent font-medium px-3 py-0 h-full w-full cursor-pointer focus:outline-none border-none appearance-none text-center z-10 pl-8 pr-2"
                                    style={{ textAlignLast: 'center' }}
                                >
                                    {CURRENCIES.map((c) => <option key={c} value={c} className="text-gray-900">{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Max Salary</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="salaryMax"
                                className={groupInputClass}
                                value={formData.salaryMax}
                                onChange={handleChange}
                                placeholder="Max Salary"
                            />
                            <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gray-100 border-l border-gray-200 rounded-r-xl px-0">
                                <span className="absolute left-3 text-sm text-gray-500 font-medium pointer-events-none flex items-center gap-1">
                                    {formData.currency}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500">
                                        <path d="M7 15l5 5 5-5" />
                                        <path d="M7 9l5-5 5 5" />
                                    </svg>
                                </span>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="bg-transparent text-sm text-transparent font-medium px-3 py-0 h-full w-full cursor-pointer focus:outline-none border-none appearance-none text-center z-10 pl-8 pr-2"
                                    style={{ textAlignLast: 'center' }}
                                >
                                    {CURRENCIES.map((c) => <option key={c} value={c} className="text-gray-900">{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Salary Type</label>
                        <select name="salaryType" className={selectClass} value={formData.salaryType} onChange={handleChange}>
                            {SALARY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>


                <h3 className="text-base font-bold mb-4">Advance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Education Level</label>
                        <select name="educationLevel" className={selectClass} value={formData.educationLevel} onChange={handleChange}>
                            <option value="">Select</option>
                            {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Experience Level</label>
                        <select name="experienceLevel" className={selectClass} value={formData.experienceLevel} onChange={handleChange}>
                            <option value="">Select</option>
                            {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Job Type</label>
                        <select name="type" className={selectClass} value={formData.type} onChange={handleChange}>
                            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Job Level</label>
                        <select name="jobLevel" className={selectClass} value={formData.jobLevel} onChange={handleChange}>
                            <option value="">Select</option>
                            {JOB_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Expiration Date</label>
                        <input
                            type="date"
                            name="deadline"
                            className={inputClass}
                            value={formData.deadline}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                </div>


                <h3 className="text-base font-bold mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">Country</label>
                        <select name="country" className={selectClass} value={formData.country} onChange={handleChange}>
                            <option value="">Select</option>
                            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[15px] text-gray-500 mb-1.5">City</label>
                        <select name="city" className={selectClass} value={formData.city} onChange={handleChange}>
                            <option value="">Select</option>
                            {availableCities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-6 cursor-pointer">
                    <input type="checkbox" name="isRemote" checked={formData.isRemote} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" />
                    Fully remote position
                </label>


                <h3 className="text-base font-bold mb-4">Job Descriptions</h3>
                <div className="flex flex-col mb-8">
                    <textarea
                        name="description"
                        className={`${inputClass} resize-y min-h-[160px]`}
                        rows={7}
                        placeholder="Add job description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <motion.button
                    type="submit"
                    className="py-3 px-8 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Posting...' : 'Post Job'}
                </motion.button>
            </form>
        </motion.div>
    );
}
