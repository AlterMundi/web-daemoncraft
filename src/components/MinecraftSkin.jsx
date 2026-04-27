import { useEffect, useRef } from 'react';

const ANIMATIONS = {
  walk: 'WalkingAnimation',
  run: 'RunningAnimation',
  fly: 'FlyingAnimation',
  idle: 'IdleAnimation',
  wave: 'WaveAnimation',
};

export default function MinecraftSkin({
  skinUrl,
  height = 280,
  width = 200,
  animation = 'idle',
  speed = 1,
  rotateSpeed = 0,
  zoom = 0.85,
  glowColor = 'rgba(0, 217, 255, 0.35)',
  rotateY = 0,
}) {
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let viewer;

    (async () => {
      const mod = await import('skinview3d');
      if (!mounted || !canvasRef.current) return;

      viewer = new mod.SkinViewer({
        canvas: canvasRef.current,
        width,
        height,
        skin: skinUrl,
        model: 'default',
      });

      viewer.zoom = zoom;
      viewer.fov = 45;
      viewer.autoRotate = rotateSpeed > 0;
      viewer.autoRotateSpeed = rotateSpeed;

      const animClass = ANIMATIONS[animation] || 'IdleAnimation';
      const AnimCtor = mod[animClass];
      if (AnimCtor) {
        const anim = new AnimCtor();
        anim.speed = speed;
        viewer.animation = anim;
      }

      if (rotateY !== 0) {
        viewer.playerObject.rotation.y = rotateY;
      }

      viewer.globalLight.intensity = 2.6;
      viewer.cameraLight.intensity = 0.7;
      viewer.renderer.setClearColor(0x000000, 0);

      viewerRef.current = viewer;
    })();

    return () => {
      mounted = false;
      if (viewerRef.current) {
        viewerRef.current.dispose?.();
      }
    };
  }, [skinUrl, height, width, animation, speed, rotateSpeed, zoom, rotateY]);

  return (
    <div
      className="relative inline-block"
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${glowColor} 0%, transparent 65%)`,
          filter: 'blur(20px)',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px`, imageRendering: 'pixelated' }}
      />
    </div>
  );
}
