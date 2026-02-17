'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(identifier, password);
            if (!data.user.profileComplete) {
                router.push('/account-setup');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen md:h-screen md:overflow-hidden">
            <motion.div
                className="flex-1 px-6 md:px-[60px] py-10 flex flex-col justify-center items-center overflow-y-auto"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full max-w-[560px]">
                    <div className="flex items-center gap-2 mb-10">
                        <img src="/logo.svg" alt="JobPilot" className="w-9 h-9" />
                        <span className="text-xl font-bold">JobPilot</span>
                    </div>

                    <h1 className="text-[28px] font-bold mb-2">Log In to JobPilot</h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Don't have an account? <Link href="/signup" className="text-[#434348] underline font-medium">Sign Up</Link>
                    </p>

                    {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col mb-5">
                            <label className="text-[15px] text-gray-500 mb-1.5">Username or Email Address</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col mb-5">
                            <label className="text-[15px] text-gray-500 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent text-gray-400 text-lg p-0 border-none cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <a href="#" className="text-[13px] text-gray-500 underline">Forget your password</a>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full py-3 px-6 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </motion.button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <button className="flex-1 py-3 border border-gray-200 rounded-full bg-white flex items-center justify-center gap-2.5 text-[15px] font-medium text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer">
                            <FaFacebook size={20} color="#1877F2" />
                            Log in with Facebook
                        </button>
                        <button className="flex-1 py-3 border border-gray-200 rounded-full bg-white flex items-center justify-center gap-2.5 text-[15px] font-medium text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer">
                            <FcGoogle size={20} />
                            Log in with Google
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="hidden lg:block shrink-0 w-fit h-screen">
                <img
                    src="/auth-image.svg"
                    alt="Team collaboration"
                    className="h-screen w-auto object-contain block"
                />
            </div>
        </div>
    );
}
