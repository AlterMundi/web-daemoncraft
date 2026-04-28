import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// --- MINECRAFT UV MAPPING SYSTEM --- //
// Helper to apply 32x32 pixel-perfect UVs to a BoxGeometry.
function applyMinecraftUV(geometry, startX, startY, w, h, d, texW = 32, texH = 32) {
    const uvs = geometry.attributes.uv.array;

    // Minecraft texture layout for a box (Top, Bottom, Right, Front, Left, Back)
    // Note: Three.js BoxGeometry face order: Right (+x), Left (-x), Top (+y), Bottom (-y), Front (+z), Back (-z)
    const mapFace = (faceIdx, u, v, width, height, rotate = 0) => {
        const i = faceIdx * 8;
        const u1 = u / texW;
        const u2 = (u + width) / texW;
        const v1 = 1 - ((v + height) / texH);
        const v2 = 1 - (v / texH);

        // Standard mapping
        uvs[i + 0] = u1; uvs[i + 1] = v2;
        uvs[i + 2] = u2; uvs[i + 3] = v2;
        uvs[i + 4] = u1; uvs[i + 5] = v1;
        uvs[i + 6] = u2; uvs[i + 7] = v1;
    };

    // Right (+x)
    mapFace(0, startX, startY + d, d, h);
    // Left (-x)
    mapFace(1, startX + d + w, startY + d, d, h);
    // Top (+y)
    mapFace(2, startX + d, startY, w, d);
    // Bottom (-y)
    mapFace(3, startX + d + w, startY, w, d);
    // Front (+z)
    mapFace(4, startX + d, startY + d, w, h);
    // Back (-z)
    mapFace(5, startX + 2 * d + w, startY + d, w, h);
}

// Plane mapping for wings
function applyPlaneUV(geometry, u, v, width, height, texW = 32, texH = 32) {
    const uvs = geometry.attributes.uv.array;
    const u1 = u / texW;
    const u2 = (u + width) / texW;
    const v1 = 1 - ((v + height) / texH);
    const v2 = 1 - (v / texH);

    uvs[0] = u1; uvs[1] = v2;
    uvs[2] = u2; uvs[3] = v2;
    uvs[4] = u1; uvs[5] = v1;
    uvs[6] = u2; uvs[7] = v1;
}

const ALLAY_SKINS = [
    { id: 'classic', name: 'Classic Allay', emoji: '💎', path: '/skins/allay/allay-on-planetminecraft-com.png' },
    { id: 'purple', name: 'Purple Allay', emoji: '🔮', path: '/skins/allay/Purple-allay-on-planetminecraft-com.png' },
    { id: 'enderman', name: 'Enderman Allay', emoji: '👾', path: '/skins/allay/Enderman-Allay-on-planetminecraft-com.png' },
    { id: 'dark', name: 'Dark Allay', emoji: '🌑', path: '/skins/allay/dark-allay-on-planetminecraft-com.png' },
    { id: 'zombie', name: 'Zombie Allay', emoji: '🧟', path: '/skins/allay/Boldering-Zombie-Allay-on-planetminecraft-com.png' },
    { id: 'remake', name: 'Allay Remake', emoji: '✨', path: '/skins/allay/Allay-Remake-on-planetminecraft-com.png' },
    { id: 'twilight', name: 'Twilight Allay', emoji: '🌙', path: '/skins/allay/Twilight-Allay-on-planetminecraft-com.png' }
];

export default function AllayThree({ base = '', scale = 1.5 }) {
    const mountRef = useRef(null);
    const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
    const [autoCycle, setAutoCycle] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    // Animation Controls State
    const [animParams, setAnimParams] = useState({
        bobbingAmplitude: 0.15,
        bobbingSpeed: 2.0,
        wingSpeed: 15.0,
        wingAngle: 0.8,
        armSwingSpeed: 1.5,
        armSwingAmplitude: 0.2,
        wingUV_X: 16,
        wingUV_Y: 16,
        wingUV_W: 10,
        wingUV_H: 10,
        armUV_X: 23,
        armUV_Y: 0,
        armUV_W: 1,
        armUV_H: 3,
        armUV_D: 2
    });

    const materialRef = useRef(null);
    const wingsRef = useRef([]);
    const armsRef = useRef([]);

    // Update texture when skin changes
    useEffect(() => {
        if (!materialRef.current) return;
        const textureLoader = new THREE.TextureLoader();
        const skinUrl = base + ALLAY_SKINS[currentSkinIndex].path.replace(/^\//, '');

        textureLoader.load(skinUrl, (texture) => {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.colorSpace = THREE.SRGBColorSpace;

            if (materialRef.current.map) {
                materialRef.current.map.dispose();
            }
            materialRef.current.map = texture;
            materialRef.current.needsUpdate = true;

            // Optional: add emission for specific skins like dark/enderman
            if (ALLAY_SKINS[currentSkinIndex].id === 'dark' || ALLAY_SKINS[currentSkinIndex].id === 'enderman') {
                materialRef.current.emissive = new THREE.Color(0x330055);
                materialRef.current.emissiveIntensity = 0.5;
            } else {
                materialRef.current.emissive = new THREE.Color(0x000000);
            }
        });
    }, [currentSkinIndex, base]);

    // Auto cycle
    useEffect(() => {
        if (!autoCycle) return;
        const interval = setInterval(() => {
            setCurrentSkinIndex(prev => (prev + 1) % ALLAY_SKINS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [autoCycle]);

    // Core 3D Setup
    useEffect(() => {
        if (!mountRef.current) return;
        const mount = mountRef.current;

        const scene = new THREE.Scene();
        // Camera setup - looking slightly down at the Allay
        const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.set(0, 1.5, 6);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        // Lighting - ambient + directional to show volume but keep pixel colors somewhat flat
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);

        // Material creation
        const material = new THREE.MeshStandardMaterial({
            transparent: true,
            alphaTest: 0.05,
            side: THREE.DoubleSide
        });
        materialRef.current = material;

        // Force initial texture load
        const textureLoader = new THREE.TextureLoader();
        const initialSkinUrl = base + ALLAY_SKINS[currentSkinIndex].path.replace(/^\//, '');
        textureLoader.load(initialSkinUrl, (tex) => {
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            tex.colorSpace = THREE.SRGBColorSpace;
            material.map = tex;
            material.needsUpdate = true;
        });

        // 4. ALLAY RIG HIERARCHY
        const allayGroup = new THREE.Group();
        allayGroup.scale.set(scale, scale, scale);
        scene.add(allayGroup);

        // -- Head (5x5x5)
        const headGeo = new THREE.BoxGeometry(1.25, 1.25, 1.25);
        applyMinecraftUV(headGeo, 0, 0, 5, 5, 5);
        const head = new THREE.Mesh(headGeo, material);
        head.position.y = 0.625 + 0.45; // sit on top of body
        allayGroup.add(head);

        // -- Body (3x4x2)
        const bodyGeo = new THREE.BoxGeometry(0.75, 1.0, 0.5);
        applyMinecraftUV(bodyGeo, 0, 10, 3, 4, 2);
        const body = new THREE.Mesh(bodyGeo, material);
        body.position.y = 0;
        allayGroup.add(body);

        // -- Arms Setup (Configurable UVs)
        const armGroupR = new THREE.Group();
        armGroupR.position.set(-0.375 - 0.125, 0.4, 0); // Shoulder pivot
        const armGeoR = new THREE.BoxGeometry(0.25, 0.75, 0.25); // 1x3x1 visually
        applyMinecraftUV(armGeoR, animParams.armUV_X, animParams.armUV_Y, animParams.armUV_W, animParams.armUV_H, animParams.armUV_D);
        const armR = new THREE.Mesh(armGeoR, material);
        armR.position.y = -0.375; // Offset mesh so pivot is at top
        armGroupR.add(armR);
        body.add(armGroupR);

        const armGroupL = new THREE.Group();
        armGroupL.position.set(0.375 + 0.125, 0.4, 0); // Shoulder pivot
        const armGeoL = new THREE.BoxGeometry(0.25, 0.75, 0.25);
        applyMinecraftUV(armGeoL, animParams.armUV_X, animParams.armUV_Y, animParams.armUV_W, animParams.armUV_H, animParams.armUV_D);
        const armL = new THREE.Mesh(armGeoL, material);
        armL.position.y = -0.375;
        armGroupL.add(armL);
        body.add(armGroupL);

        armsRef.current = [armGeoR, armGeoL];

        // -- Wings Setup (Configurable UVs)
        const wingGroupR = new THREE.Group();
        wingGroupR.position.set(-0.15, 0.3, 0.25); // Back right
        const wingGeoR = new THREE.PlaneGeometry(1.2, 1.2);
        applyPlaneUV(wingGeoR, animParams.wingUV_X, animParams.wingUV_Y, animParams.wingUV_W, animParams.wingUV_H);
        const wingR = new THREE.Mesh(wingGeoR, material);
        wingR.position.set(-0.6, 0, 0); // Offset to pivot from back
        wingR.rotation.y = Math.PI / 4;
        wingGroupR.add(wingR);
        body.add(wingGroupR);

        const wingGroupL = new THREE.Group();
        wingGroupL.position.set(0.15, 0.3, 0.25); // Back left
        const wingGeoL = new THREE.PlaneGeometry(1.2, 1.2);
        applyPlaneUV(wingGeoL, animParams.wingUV_X, animParams.wingUV_Y, animParams.wingUV_W, animParams.wingUV_H);
        const wingL = new THREE.Mesh(wingGeoL, material);
        // mirror the wing texture by negative scale to make them symmetrical 
        wingL.scale.x = -1;
        wingL.position.set(0.6, 0, 0);
        wingL.rotation.y = -Math.PI / 4;
        wingGroupL.add(wingL);
        body.add(wingGroupL);

        wingsRef.current = [wingGeoR, wingGeoL];

        // Particle system for magical glow
        const particleCount = 20;
        const particlesGeo = new THREE.BufferGeometry();
        const particlesPos = new Float32Array(particleCount * 3);
        const particlesVel = [];
        for (let i = 0; i < particleCount; i++) {
            particlesPos[i * 3] = (Math.random() - 0.5) * 3;
            particlesPos[i * 3 + 1] = (Math.random() - 0.5) * 3;
            particlesPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
            particlesVel.push({
                y: Math.random() * 0.02 + 0.01,
                x: (Math.random() - 0.5) * 0.01
            });
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlesPos, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x00D9FF,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const particleSystem = new THREE.Points(particlesGeo, particleMat);
        allayGroup.add(particleSystem);


        // Animation Loop
        const clock = new THREE.Clock();
        let animationFrameId;
        // Keep a ref to params to avoid re-creating the loop closure
        const paramsRefLocal = animParams;

        const animate = () => {
            const time = clock.getElapsedTime();

            // Bobbing (floating up and down)
            allayGroup.position.y = Math.sin(time * paramsRefLocal.bobbingSpeed) * paramsRefLocal.bobbingAmplitude;

            // Wing flutter
            const flap = Math.sin(time * paramsRefLocal.wingSpeed) * paramsRefLocal.wingAngle;
            wingGroupR.rotation.y = flap + 0.5;
            wingGroupL.rotation.y = -flap - 0.5;

            // Arm idle swings
            armGroupR.rotation.x = Math.sin(time * paramsRefLocal.armSwingSpeed) * paramsRefLocal.armSwingAmplitude;
            armGroupL.rotation.x = Math.sin(time * paramsRefLocal.armSwingSpeed + Math.PI) * paramsRefLocal.armSwingAmplitude;

            // Gentle body rotation (organic feel)
            body.rotation.x = Math.sin(time * 0.8) * 0.05 + 0.1;
            allayGroup.rotation.y = Math.sin(time * 0.5) * 0.15;

            // Head tracking / idle looking
            head.rotation.y = Math.sin(time * 0.7) * 0.15;
            head.rotation.x = Math.sin(time * 1.1) * 0.08;

            // Animate particles
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 1] += particlesVel[i].y;
                positions[i * 3] += particlesVel[i].x;
                if (positions[i * 3 + 1] > 2) {
                    positions[i * 3 + 1] = -2;
                    positions[i * 3] = (Math.random() - 0.5) * 3;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            // Update particle color based on skin roughly
            if (ALLAY_SKINS[currentSkinIndex].id === 'purple' || ALLAY_SKINS[currentSkinIndex].id === 'enderman' || ALLAY_SKINS[currentSkinIndex].id === 'dark') {
                particleMat.color.setHex(0x8A2BE2); // Purple particles
            } else if (ALLAY_SKINS[currentSkinIndex].id === 'zombie') {
                particleMat.color.setHex(0x228B22); // Green particles
            } else {
                particleMat.color.setHex(0x00D9FF); // Cyan particles
            }

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Resize Handler
        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
            }
            headGeo.dispose(); bodyGeo.dispose();
            armGeoR.dispose(); armGeoL.dispose();
            wingGeoR.dispose(); wingGeoL.dispose();
            particlesGeo.dispose(); particleMat.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []); // Only run once for setup, we update UVs imperatively

    // Update UVs imperatively when sliders change
    useEffect(() => {
        if (wingsRef.current.length > 0) {
            applyPlaneUV(wingsRef.current[0], animParams.wingUV_X, animParams.wingUV_Y, animParams.wingUV_W, animParams.wingUV_H);
            applyPlaneUV(wingsRef.current[1], animParams.wingUV_X, animParams.wingUV_Y, animParams.wingUV_W, animParams.wingUV_H);
            wingsRef.current[0].attributes.uv.needsUpdate = true;
            wingsRef.current[1].attributes.uv.needsUpdate = true;
        }
        if (armsRef.current.length > 0) {
            applyMinecraftUV(armsRef.current[0], animParams.armUV_X, animParams.armUV_Y, animParams.armUV_W, animParams.armUV_H, animParams.armUV_D);
            applyMinecraftUV(armsRef.current[1], animParams.armUV_X, animParams.armUV_Y, animParams.armUV_W, animParams.armUV_H, animParams.armUV_D);
            armsRef.current[0].attributes.uv.needsUpdate = true;
            armsRef.current[1].attributes.uv.needsUpdate = true;
        }
    }, [animParams.wingUV_X, animParams.wingUV_Y, animParams.wingUV_W, animParams.wingUV_H,
    animParams.armUV_X, animParams.armUV_Y, animParams.armUV_W, animParams.armUV_H, animParams.armUV_D]);


    return (
        <div className="relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden bg-navy-deep border-2 border-daemon/30 shadow-[0_0_30px_rgba(0,217,255,0.1)]">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-daemon/10 via-navy-deep to-navy-deep pointer-events-none"></div>

            {/* 3D Canvas */}
            <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

            {/* Gallery UI overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center">
                <div className="flex gap-2 p-2 bg-navy/80 backdrop-blur-md rounded-lg border border-daemon/30 overflow-x-auto max-w-full">
                    {ALLAY_SKINS.map((skin, idx) => (
                        <button
                            key={skin.id}
                            onClick={() => { setCurrentSkinIndex(idx); }}
                            className={`px-3 py-2 rounded transition-all shrink-0 ${currentSkinIndex === idx
                                ? 'bg-daemon/20 border-daemon shadow-[0_0_15px_rgba(0,217,255,0.5)] scale-110 border'
                                : 'border border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'
                                }`}
                            title={skin.name}
                        >
                            <span className="text-2xl">{skin.emoji}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
