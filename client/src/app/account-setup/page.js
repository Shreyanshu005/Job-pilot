'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { countries } from '@/lib/countries';

export default function AccountSetupPage() {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const fileRef = useRef(null);
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === 'US') || countries[0]);

    const [logoPreview, setLogoPreview] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        organizationType: '',
        industryType: '',
        teamSize: '',
        yearOfEstablishment: '',
        aboutUs: '',
        location: '',
        contactNumber: '',
        email: user?.email || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [setupComplete, setSetupComplete] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogo = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (logoFile) {
                const fd = new FormData();
                fd.append('logo', logoFile);
                await api.post('/employer/logo', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            const res = await api.put('/employer/profile', {
                companyInfo: {
                    companyName: formData.companyName,
                    organizationType: formData.organizationType,
                    industryType: formData.industryType,
                    teamSize: formData.teamSize,
                    yearOfEstablishment: formData.yearOfEstablishment,
                    aboutUs: formData.aboutUs,
                },
                contactInfo: {
                    location: formData.location,
                    contactNumber: formData.contactNumber,
                    email: formData.email,
                },
            });

            updateUser(res.data.user);
            setSetupComplete(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save profile');
        }
        setLoading(false);
    };

    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition placeholder:text-gray-500";
    const selectClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition bg-white appearance-none cursor-pointer bg-[url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em_1.25em] pr-10";

    if (setupComplete) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center gap-2 px-8 py-5">
                    <img src="/logo.svg" alt="JobPilot" className="w-9 h-9" />
                    <span className="text-xl font-bold">JobPilot</span>
                </div>

                <motion.div
                    className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <FiCheck className="text-3xl text-primary" />
                    </div>

                    <h1 className="text-xl font-bold mb-2 text-center">
                        🎉 Congratulations, Your profile is 100% complete!
                    </h1>
                    <p className="text-sm text-gray-500 mb-8 text-center">
                        🎉 Congratulations, Your profile is 100% complete!
                    </p>

                    <div className="flex gap-4">
                        <Link href="/dashboard">
                            <button className="w-[200px] py-3 rounded-full text-sm font-semibold bg-[#E5E6FB] text-primary hover:bg-[#d6d7fc] transition cursor-pointer border-none">
                                View Dashboard
                            </button>
                        </Link>
                        <Link href="/dashboard/post-job">
                            <button className="w-[200px] py-3 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition cursor-pointer border-none">
                                Post a Job
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-7xl mx-auto py-10 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-2 mb-8">
                <img src="/logo.svg" alt="JobPilot" className="w-9 h-9" />
                <span className="text-xl font-bold">JobPilot</span>
            </div>

            <h1 className="text-[26px] font-bold mb-8">Account Setup</h1>

            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-8">
                    <h3 className="text-base font-bold mb-4">Logo Upload</h3>
                    <input type="file" ref={fileRef} accept="image/*" onChange={handleLogo} className="hidden" />
                    {logoPreview ? (
                        <div className="flex items-center gap-4">
                            <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                            <button
                                type="button"
                                className="text-xs py-2 px-4 border-[1.5px] border-primary text-primary rounded-full bg-white hover:bg-primary/5 transition cursor-pointer"
                                onClick={() => fileRef.current?.click()}
                            >
                                Change Logo
                            </button>
                        </div>
                    ) : (
                        <div
                            className="w-[360px] border-2 border-dashed border-gray-200 rounded-[10px] p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition text-center"
                            onClick={() => fileRef.current?.click()}
                        >
                            <FiUploadCloud className="text-4xl text-gray-400 mb-3" />
                            <p className="text-[13px] text-gray-500"><strong className="text-gray-900">Browse photo</strong> or drop here</p>
                            <p className="text-[11px] text-gray-400 mt-1">A photo larger than 400 pixels work best.<br />Max file size 5 MB.</p>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <h3 className="text-base font-bold mb-4">Company Info</h3>
                    <div className="grid grid-cols-3 gap-4">
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
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Location</label>
                            <input type="text" name="location" className={inputClass} value={formData.location} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Contact Number</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <select
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        value={selectedCountry.code}
                                        onChange={(e) => setSelectedCountry(countries.find(c => c.code === e.target.value))}
                                    >
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.name} ({country.dial_code})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="flex items-center gap-1 pointer-events-none">
                                        <span className="text-xl">{selectedCountry.flag}</span>
                                        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                                        <span className="text-sm text-gray-500 font-medium">{selectedCountry.dial_code}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    className={`${inputClass} pl-[100px]`}
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[15px] text-gray-500 mb-1.5">Email</label>
                            <input type="email" name="email" className={inputClass} value={formData.email} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <motion.button
                    type="submit"
                    className="py-3 px-6 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Saving...' : 'Finish Setup'}
                </motion.button>
            </form>
        </motion.div>
    );
}
