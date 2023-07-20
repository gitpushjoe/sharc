import { useEffect, useRef } from "react";
import { Bounds as xywh, Corners } from "./sharc/Utils";
import { AnimatedLine, AnimatedNullShape } from "./sharc/AnimatedShapes";
import { EASE_IN_OUT } from "./sharc/Curves";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        
        const myLine = new AnimatedLine({
            bounds: xywh(0, 100, 0, 200),
            lineWidth: 20,
            lineCap: 'round',
            color: {red: 255, green: 0, blue: 0, alpha: 1},
            rotation: 50
        }, 3);

        const arrowheadLength = 37.5;

        myLine.children.push(new AnimatedLine({
            bounds: Corners(-arrowheadLength, 100 - arrowheadLength, 0, 100),
            lineWidth: 20,
            lineCap: 'round',
            color: {red: 255, green: 0, blue: 0, alpha: 1},
        }, 3));

        myLine.children.push(new AnimatedLine({
            bounds: Corners(arrowheadLength, 100 - arrowheadLength, 0, 100),
            lineWidth: 20,
            lineCap: 'round',
            color: {red: 255, green: 0, blue: 0, alpha: 1},
        }, 3));

        const root = new AnimatedNullShape({position: {x: 600, y: 400}, scale: {x: 1, y: -1}, rotation:0});

        root.children.push(myLine);

        const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'darkgray';
            ctx.fillRect(0, 0, 1200, 800);
            root.draw(ctx);
        };

        root.getChannel(0).enqueue([
            {property: 'rotation', from: 0, to: 360, duration: 60, delay: 0, easing: EASE_IN_OUT},
        ], {loop: true});

        myLine.getChannel(0).enqueue([
            {property: 'rotation', from: 0, to: -360, duration: 60, delay: 0, easing: EASE_IN_OUT},
        ], {loop: true});

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