import { useEffect, useRef } from "react";
import { Line, Rect } from "./sharc/Shapes";
import { SizeBounds, RGB } from "./sharc/Utils";
import { AnimatedLine, AnimatedRect } from "./sharc/AnimatedShapes";
import { Bounce, EASE_IN_OUT_CUBIC, LINEAR } from "./sharc/Curves";
import { BoundsType, ColorType } from "./sharc/types/Common";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        
        const myLine = new AnimatedLine({
            bounds: SizeBounds(200, 200, 75, 75),
            lineWidth: 20,
            lineCap: 'round',
            color: {red: 255, green: 0, blue: 0, alpha: 1},
            rotation: 0
        }, 3);

        const myRect = new AnimatedRect({
            bounds: {x1: 50, y1: 50, x2: 100, y2: 100},
            color: {red: 100, green: 255, blue: 0, alpha: 0.2},
            stroke: {width: 20}
        }, 3)

        myLine.distribute([
            [
                { property: 'rotation', from: 0, to: 180, duration: 48*2, delay: 0, easing: EASE_IN_OUT_CUBIC },
            ], [
                { property: 'color', from: RGB(255, 0, 0), to: RGB(0, 0, 255), duration: 48*2, delay: 0, easing: Bounce(EASE_IN_OUT_CUBIC) },
            ], [
                { property: 'lineWidth', from: 20, to: 5, duration: 48*2, delay: 0, easing: Bounce(EASE_IN_OUT_CUBIC) },
            ]
        ], {loop : true });

        myRect.distribute([
            [
                { property: 'rotation', from: null, to: (n : number) => n + (0.5 - Math.random()) * 180, duration: 48*2, delay: 0, easing: EASE_IN_OUT_CUBIC },
            ],
        ], {loop : true });



        const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 1200, 800);
            myLine.draw(ctx);
            myRect.draw(ctx);
        };


        const canvas = canvasRef.current;
        const intervalId = setInterval(animate, 1000 / 60, canvas, canvas!.getContext('2d')!);

        return () => {
          clearInterval(intervalId);
        };
    }, []);

  return (
    <div style={{padding: '1em'}}>
      <h1>Demo</h1>
      <canvas width={1200} height={800} ref={canvasRef} style={{ border: '5px solid black' }}></canvas>
    </div>
  );
};

export default App;