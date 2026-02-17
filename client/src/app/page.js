'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                if (!user.profileComplete) {
                    router.push('/account-setup');
                } else {
                    router.push('/dashboard');
                }
            } else {
                router.push('/login');
            }
        }
    }, [user, loading, router]);

    return (
        <div className="loading-container">
            <div className="spinner" />
            <p className="loading-text">Loading JobPilot...</p>
        </div>
    );
}
