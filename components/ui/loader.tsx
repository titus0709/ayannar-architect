"use client";

import { useEffect, useRef } from "react";

interface ConcentricRingsLoaderProps {
  size?: number;
  color?: string;
  text?: string;
  subText?: string;
  showText?: boolean;
  rings?: number;
}

const ConcentricRingsLoader = ({
  size = 120,
  color = "#D4AF37",
  text = "Loading...",
  subText,
  showText = true,
  rings = 4,
}: ConcentricRingsLoaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    let rotation = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      const center = size / 2;

      for (let i = 0; i < rings; i++) {
        const radius =
          size * 0.15 +
          (i * (size * 0.32)) / Math.max(rings - 1, 1);

        const startAngle =
          rotation + i * (Math.PI * 0.45);

        const endAngle =
          startAngle + Math.PI * 1.55;

        ctx.beginPath();

        ctx.arc(
          center,
          center,
          radius,
          startAngle,
          endAngle
        );

        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(2, size * 0.018);
        ctx.lineCap = "round";

        ctx.stroke();
      }

      rotation += 0.025;

      animationRef.current =
        requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, color, rings]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Spinner */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size,
          height: size,
        }}
      >
        <canvas
          ref={canvasRef}
          className="block"
          style={{
            width: size,
            height: size,
          }}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="mt-6 text-center">
          <p className="font-serif text-lg tracking-wide text-ivory">
            {text}
          </p>

          {subText && (
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-stone">
              {subText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConcentricRingsLoader;