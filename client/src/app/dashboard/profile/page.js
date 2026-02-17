'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function EmployerProfilePage() {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        companyName: '', organizationType: '', industryType: '', teamSize: '',
        yearOfEstablishment: '', aboutUs: '', location: '', contactNumber: '', email: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                companyName: user.companyInfo?.companyName || '',
                organizationType: user.companyInfo?.organizationType || '',
                industryType: user.companyInfo?.industryType || '',
                teamSize: user.companyInfo?.teamSize || '',
                yearOfEstablishment: user.companyInfo?.yearOfEstablishment || '',
                aboutUs: user.companyInfo?.aboutUs || '',
                location: user.contactInfo?.location || '',
                contactNumber: user.contactInfo?.contactNumber || '',
                email: user.contactInfo?.email || user.email || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await api.put('/employer/profile', {
                companyInfo: {
                    companyName: formData.companyName, organizationType: formData.organizationType,
                    industryType: formData.industryType, teamSize: formData.teamSize,
                    yearOfEstablishment: formData.yearOfEstablishment, aboutUs: formData.aboutUs,
                },
                contactInfo: {
                    location: formData.location, contactNumber: formData.contactNumber, email: formData.email,
                },
            });
            updateUser(res.data.user);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
        setLoading(false);
    };

    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition placeholder:text-gray-500";
    const selectClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition bg-white appearance-none cursor-pointer bg-[url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em_1.25em] pr-10";

    return (
        <motion.div className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold mb-6">Employer Profile</h2>

            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm mb-5">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-8">
                    <h3 className="text-base font-bold mb-4">Company Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Company Name</label>
                            <input type="text" name="companyName" className={inputClass} value={formData.companyName} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Organization Type</label>
                            <select name="organizationType" className={selectClass} value={formData.organizationType} onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="Private">Private</option>
                                <option value="Public">Public</option>
                                <option value="Non-profit">Non-profit</option>
                                <option value="Government">Government</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Industry Type</label>
                            <select name="industryType" className={selectClass} value={formData.industryType} onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="Technology">Technology</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Finance">Finance</option>
                                <option value="Education">Education</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Team Size</label>
                            <select name="teamSize" className={selectClass} value={formData.teamSize} onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="1-10">1-10</option>
                                <option value="11-50">11-50</option>
                                <option value="51-200">51-200</option>
                                <option value="201-500">201-500</option>
                                <option value="500+">500+</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Year of Establishment</label>
                            <input type="text" name="yearOfEstablishment" className={inputClass} value={formData.yearOfEstablishment} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-[15px] text-gray-500 mb-1.5">About Us</label>
                        <textarea name="aboutUs" className={`${inputClass} resize-y min-h-[100px]`} rows={4} value={formData.aboutUs} onChange={handleChange} />
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-base font-bold mb-4">Contact Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Location</label>
                            <input type="text" name="location" className={inputClass} value={formData.location} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Contact Number</label>
                            <input type="tel" name="contactNumber" className={inputClass} value={formData.contactNumber} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Email</label>
                            <input type="email" name="email" className={inputClass} value={formData.email} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <motion.button
                    type="submit"
                    className="py-3 px-8 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Saving...' : 'Save Profile'}
                </motion.button>
            </form>
        </motion.div>
    );
}
