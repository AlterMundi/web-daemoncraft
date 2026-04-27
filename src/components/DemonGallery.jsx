import { useState, useEffect } from 'react';
import MinecraftSkin from './MinecraftSkin.jsx';

const skins = [
    { id: 'inferno', file: 'demon-inferno.png', anim: 'run', speed: 1.1, glow: 'rgba(255, 87, 34, 0.5)', name: 'INFERNO' },
    { id: 'frost', file: 'demon-frost.png', anim: 'idle', speed: 0.5, glow: 'rgba(0, 217, 255, 0.5)', name: 'FROST' },
    { id: 'void', file: 'demon-void.png', anim: 'walk', speed: 0.7, glow: 'rgba(180, 80, 220, 0.5)', name: 'VOID' },
    { id: 'astral', file: 'demon-astral.png', anim: 'wave', speed: 0.8, glow: 'rgba(255, 255, 255, 0.3)', name: 'ASTRAL' },
    { id: 'zombie', file: 'demon-storm.png', anim: 'walk', speed: 0.6, glow: 'rgba(124, 172, 80, 0.6)', name: 'ZOMBIE' },
    { id: 'classic', file: 'skin-daemon.png', anim: 'walk', speed: 0.8, glow: 'rgba(0, 217, 255, 0.5)', name: 'CLASSIC' }
];

export default function DemonGallery({ base = '/' }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % skins.length);
        }, 3500); // Rotate every 3.5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full flex justify-center items-center h-[560px]">
            {skins.map((skin, i) => {
                const isActive = i === activeIndex;
                // Re-construct the pure color for text by forcing the alpha to 1
                const rawColor = skin.glow.replace(/rgba\(|\)/g, '').split(',');
                const solidColor = rawColor.length === 4 ? `rgb(${rawColor[0]}, ${rawColor[1]}, ${rawColor[2]})` : '#00D9FF';

                return (
                    <div
                        key={skin.id}
                        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    >
                        <div className="relative">
                            {/* <div className="absolute -inset-12 blur-3xl rounded-full transition-colors duration-1000" style={{ backgroundColor: skin.glow }} /> */}
                            <div className="relative flex justify-center">
                                <MinecraftSkin
                                    skinUrl={`${base}${skin.file}`}
                                    height={560}
                                    width={420}
                                    animation={skin.anim}
                                    speed={skin.speed}
                                    rotateSpeed={0.6} // Consistent rotation
                                    zoom={1.1}
                                    glowColor={skin.glow}
                                />
                            </div>
                        </div>

                        <div className="absolute bottom-8 text-center mt-4">
                            <div className="inline-block px-3 py-1 border border-daemon/20 bg-navy-deep/60 backdrop-blur">
                                <span className="font-pixel text-[10px] tracking-[0.3em] uppercase transition-colors duration-1000" style={{ color: solidColor }}>
                                    {skin.name}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
