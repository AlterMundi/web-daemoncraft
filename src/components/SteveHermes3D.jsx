import { useEffect, useRef } from 'react';

export default function SteveHermes3D({ skinUrl = '/skin-hermes.png', height = 480 }) {
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
        width: canvasRef.current.clientWidth,
        height,
        skin: skinUrl,
        model: 'default',
      });

      viewer.autoRotate = true;
      viewer.autoRotateSpeed = 0.5;
      viewer.zoom = 0.9;
      viewer.fov = 45;

      // Idle breathing / floating animation
      const walk = new mod.WalkingAnimation();
      walk.speed = 0.0;
      const idle = new mod.IdleAnimation();
      idle.speed = 0.5;
      viewer.animation = idle;

      // Subtle gold-ish ambient
      viewer.globalLight.intensity = 3;
      viewer.cameraLight.intensity = 0.6;

      // Transparent bg so the Navy section shows through
      viewer.renderer.setClearColor(0x000000, 0);

      // Resize handler
      const handleResize = () => {
        if (!canvasRef.current || !viewer) return;
        viewer.width = canvasRef.current.clientWidth;
        viewer.height = height;
      };
      window.addEventListener('resize', handleResize);

      viewerRef.current = { viewer, cleanup: () => window.removeEventListener('resize', handleResize) };
    })();

    return () => {
      mounted = false;
      if (viewerRef.current) {
        viewerRef.current.cleanup?.();
        viewerRef.current.viewer?.dispose?.();
      }
    };
  }, [skinUrl, height]);

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* halo dorado detrás */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.08) 30%, transparent 60%)',
          filter: 'blur(30px)',
        }}
      />
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: 420, height }} />
    </div>
  );
}
