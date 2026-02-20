import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically redirect to the first subsection (Hero Section)
        navigate('/admin/home/hero', { replace: true });
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex flex-col items-center gap-4 opacity-50">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
        </div>
    );
};

export default HomePage;
