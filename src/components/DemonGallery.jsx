import { useState, useEffect, useCallback } from 'react';
import AllayMob from './AllayMob.jsx';

const allays = [
    { id: 'inferno', emoji: '🔥', bodyColor: '#E85D3A', glowColor: 'rgba(255, 87, 34, 0.5)', wingColor: 'rgba(255, 140, 60, 0.3)', eyeColor: '#FFDD44', name: 'INFERNO' },
    { id: 'frost', emoji: '❄️', bodyColor: '#3BC4F2', glowColor: 'rgba(0, 217, 255, 0.5)', wingColor: 'rgba(180, 230, 255, 0.35)', eyeColor: '#ffffff', name: 'FROST' },
    { id: 'void', emoji: '🌀', bodyColor: '#9B50DC', glowColor: 'rgba(180, 80, 220, 0.5)', wingColor: 'rgba(200, 140, 255, 0.3)', eyeColor: '#E8CCFF', name: 'VOID' },
    { id: 'astral', emoji: '✨', bodyColor: '#E8E0FF', glowColor: 'rgba(255, 255, 255, 0.3)', wingColor: 'rgba(255, 255, 255, 0.25)', eyeColor: '#C4B8FF', name: 'ASTRAL' },
    { id: 'zombie', emoji: '🧟', bodyColor: '#6AA84F', glowColor: 'rgba(124, 172, 80, 0.6)', wingColor: 'rgba(150, 200, 100, 0.3)', eyeColor: '#CCFF88', name: 'ZOMBIE' },
    { id: 'classic', emoji: '⚡', bodyColor: '#00B8D9', glowColor: 'rgba(0, 217, 255, 0.5)', wingColor: 'rgba(100, 220, 255, 0.35)', eyeColor: '#ffffff', name: 'CLASSIC' }
];

export default function DemonGallery({ base = '/' }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoCycle, setAutoCycle] = useState(true);

    useEffect(() => {
        if (!autoCycle) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % allays.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [autoCycle]);

    const selectAllay = useCallback((i) => {
        setActiveIndex(i);
        setAutoCycle(false);
        // Resume auto-cycle after 10s of inactivity
        setTimeout(() => setAutoCycle(true), 10000);
    }, []);

    return (
        <div className="relative w-full flex flex-col items-center h-[520px]">
            {/* Allay display */}
            <div className="relative w-full flex-1 flex justify-center items-center">
                {allays.map((allay, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <div
                            key={allay.id}
                            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                        >
                            <AllayMob
                                bodyColor={allay.bodyColor}
                                glowColor={allay.glowColor}
                                wingColor={allay.wingColor}
                                eyeColor={allay.eyeColor}
                                size={1.3}
                                name={allay.name}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Emoji selector bar */}
            <div className="relative z-20 flex items-center gap-2 px-4 py-2 bg-navy-deep/70 backdrop-blur border border-daemon/20 rounded-lg">
                {allays.map((allay, i) => {
                    const isActive = i === activeIndex;
                    const rawColor = allay.glowColor.replace(/rgba\(|\)/g, '').split(',');
                    const solidColor = rawColor.length === 4 ? `rgb(${rawColor[0]}, ${rawColor[1]}, ${rawColor[2]})` : '#00D9FF';

                    return (
                        <button
                            key={allay.id}
                            onClick={() => selectAllay(i)}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-all duration-300 ${isActive ? 'bg-white/10 scale-110' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                            style={isActive ? { boxShadow: `0 0 12px ${allay.glowColor}` } : {}}
                            title={allay.name}
                        >
                            <span className="text-2xl">{allay.emoji}</span>
                            <span
                                className="font-pixel text-[8px] tracking-[0.2em] uppercase transition-colors duration-300"
                                style={{ color: isActive ? solidColor : 'rgba(255,255,255,0.4)' }}
                            >
                                {allay.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
