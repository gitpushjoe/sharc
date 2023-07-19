import React, { useEffect, useRef } from 'react';

interface CanvasProps {
  color1: string;
  color2: string;
  delay: number;
}

const Canvas: React.FC<CanvasProps> = ({ color1, color2, delay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext('2d')!;
    let currentColor = color1;

    const flicker = () => {
      context.fillStyle = currentColor;
      context.fillRect(0, 0, canvas!.width, canvas!.height);
      currentColor = currentColor === color1 ? color2 : color1;
    };

    const intervalId = setInterval(flicker, delay);

    return () => {
      clearInterval(intervalId);
    };
  }, [color1, color2, delay]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;