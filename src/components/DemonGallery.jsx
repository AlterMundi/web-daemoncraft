import { useState, useEffect } from 'react';
import AllayMob from './AllayMob.jsx';

const allays = [
    { id: 'inferno', bodyColor: '#E85D3A', glowColor: 'rgba(255, 87, 34, 0.5)', wingColor: 'rgba(255, 140, 60, 0.3)', eyeColor: '#FFDD44', name: 'INFERNO' },
    { id: 'frost', bodyColor: '#3BC4F2', glowColor: 'rgba(0, 217, 255, 0.5)', wingColor: 'rgba(180, 230, 255, 0.35)', eyeColor: '#ffffff', name: 'FROST' },
    { id: 'void', bodyColor: '#9B50DC', glowColor: 'rgba(180, 80, 220, 0.5)', wingColor: 'rgba(200, 140, 255, 0.3)', eyeColor: '#E8CCFF', name: 'VOID' },
    { id: 'astral', bodyColor: '#E8E0FF', glowColor: 'rgba(255, 255, 255, 0.3)', wingColor: 'rgba(255, 255, 255, 0.25)', eyeColor: '#C4B8FF', name: 'ASTRAL' },
    { id: 'zombie', bodyColor: '#6AA84F', glowColor: 'rgba(124, 172, 80, 0.6)', wingColor: 'rgba(150, 200, 100, 0.3)', eyeColor: '#CCFF88', name: 'ZOMBIE' },
    { id: 'classic', bodyColor: '#00B8D9', glowColor: 'rgba(0, 217, 255, 0.5)', wingColor: 'rgba(100, 220, 255, 0.35)', eyeColor: '#ffffff', name: 'CLASSIC' }
];

export default function DemonGallery({ base = '/' }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % allays.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full flex justify-center items-center h-[480px]">
            {allays.map((allay, i) => {
                const isActive = i === activeIndex;
                const rawColor = allay.glowColor.replace(/rgba\(|\)/g, '').split(',');
                const solidColor = rawColor.length === 4 ? `rgb(${rawColor[0]}, ${rawColor[1]}, ${rawColor[2]})` : '#00D9FF';

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
                            personality={allay.id}
                            name={allay.name}
                            skinUrl={`${base}skins/${allay.id}.png`}
                        />

                        <div className="absolute bottom-4 text-center">
                            <div className="inline-block px-3 py-1 border border-daemon/20 bg-navy-deep/60 backdrop-blur">
                                <span className="font-pixel text-[10px] tracking-[0.3em] uppercase transition-colors duration-1000" style={{ color: solidColor }}>
                                    {allay.name}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
