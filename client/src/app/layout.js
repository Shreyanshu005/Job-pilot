'use client';
import './globals.css';

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <title>JobPilot - Employer Dashboard</title>
                <meta name="description" content="JobPilot employer portal - Post and manage jobs" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
