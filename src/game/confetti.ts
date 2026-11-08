/**
 * Lightweight, zero-dependency canvas confetti burst engine.
 * Runs at 60fps on GPU, automatically cleans up after 2.5 seconds.
 */
export function fireConfetti(durationMs = 2500) {
  if (typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100dvh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = (canvas.width = window.innerWidth * dpr);
  const h = (canvas.height = window.innerHeight * dpr);

  const colors = ['#ffd23f', '#ff4d8d', '#3ddc97', '#38bdf8', '#8a4dff', '#ffffff'];
  const particleCount = 70;
  const particles = Array.from({ length: particleCount }).map(() => ({
    x: w * 0.5 + (Math.random() - 0.5) * w * 0.3,
    y: h * 0.35 + (Math.random() - 0.5) * h * 0.2,
    vx: (Math.random() - 0.5) * 16 * dpr,
    vy: -(Math.random() * 14 + 6) * dpr,
    size: (Math.random() * 8 + 6) * dpr,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 12,
    opacity: 1,
  }));

  const startTime = performance.now();

  const render = (now: number) => {
    const elapsed = now - startTime;
    if (elapsed > durationMs) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, w, h);
    const progress = elapsed / durationMs;
    const globalAlpha = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35 * dpr; // gravity
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity * globalAlpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}
