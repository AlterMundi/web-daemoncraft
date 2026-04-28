import { useState, useEffect } from 'react';
import AllayThree from './AllayThree.jsx';

/**
 * AllayGallery - Showcases different Allay personalities.
 * Uses the advanced AllayThree component for high-quality 3D renders.
 */

const allays = [
    { 
        id: 'enderman', 
        name: 'Enderman Daemon', 
        skin: 'Enderman-Allay-on-planetminecraft-com.png', 
        color: '#9B50DC', 
        flapSpeed: 1.8, 
        hoverIntensity: 1.5 
    },
    { 
        id: 'classic', 
        name: 'Classic Allay', 
        skin: 'allay-on-planetminecraft-com.png', 
        color: '#00d9ff', 
        flapSpeed: 1, 
        hoverIntensity: 1 
    },
    { 
        id: 'zombie', 
        name: 'Zombie Allay', 
        skin: 'Boldering-Zombie-Allay-on-planetminecraft-com.png', 
        color: '#6AA84F', 
        flapSpeed: 0.6, 
        hoverIntensity: 0.8 
    },
    { 
        id: 'dark', 
        name: 'Dark Allay', 
        skin: 'dark-allay-on-planetminecraft-com.png', 
        color: '#333333', 
        flapSpeed: 1.2, 
        hoverIntensity: 1.1 
    },
    { 
        id: 'purple', 
        name: 'Twilight Allay', 
        skin: 'Twilight-Allay-on-planetminecraft-com.png', 
        color: '#B066FF', 
        flapSpeed: 1.1, 
        hoverIntensity: 1.2 
    }
];

export default function AllayGallery({ base = '/' }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % allays.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const handleSelect = (index) => {
        setActiveIndex(index);
        setIsPaused(true);
        // Resume auto-cycle after 15s
        const timer = setTimeout(() => setIsPaused(false), 15000);
        return () => clearTimeout(timer);
    };

    return (
        <div className="relative w-full flex flex-col items-center justify-center h-[550px]">
            {/* 3D VIEWER AREA */}
            <div className="relative w-full h-[450px] flex items-center justify-center">
                {allays.map((allay, i) => {
                    const isActive = i === activeIndex;
                    const skinUrl = `${base}skins/allay/${allay.skin}`;

                    return (
                        <div
                            key={allay.id}
                            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                                isActive 
                                ? 'opacity-100 scale-100 z-10' 
                                : 'opacity-0 scale-90 z-0 pointer-events-none'
                            }`}
                        >
                            <AllayThree
                                skinUrl={skinUrl}
                                glowColor={allay.color}
                                flapSpeed={allay.flapSpeed}
                                hoverIntensity={allay.hoverIntensity}
                                scale={1.2}
                                autoRotate={true}
                            />

                            <div className="mt-2 text-center">
                                <div className="inline-block px-4 py-2 border border-daemon/20 bg-navy-deep/60 backdrop-blur rounded-sm">
                                    <span className="font-pixel text-xs tracking-[0.4em] uppercase transition-colors duration-1000" style={{ color: allay.color }}>
                                        {allay.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SELECTOR CONTROLS (Pills) */}
            <div className="flex gap-3 mt-4 flex-wrap justify-center px-4 max-w-lg">
                {allays.map((allay, i) => (
                    <button
                        key={allay.id}
                        onClick={() => handleSelect(i)}
                        className={`px-4 py-1.5 font-pixel text-[10px] uppercase tracking-wider border rounded-full transition-all duration-300 ${
                            i === activeIndex 
                            ? 'bg-daemon/30 border-daemon text-daemon scale-105 shadow-[0_0_15px_rgba(0,217,255,0.2)]' 
                            : 'bg-white/5 border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
                        }`}
                    >
                        {allay.name.split(' ')[0]}
                    </button>
                ))}
            </div>
        </div>
    );
}
