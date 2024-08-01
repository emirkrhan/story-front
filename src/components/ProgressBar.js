import React, { useState, useEffect } from 'react';

const ProgressBar = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        setScrollPosition(scrollPercent);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="w-full h-1 bg-gray-200">
            <div
                className="h-full bg-[#B6C7AA] transition-all duration-100"
                style={{ width: `${scrollPosition}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
