import { useEffect, useRef } from "react";
import { Bounds as xywh, Corners, CircleBounds, Colors, StrokeColors, Bounds } from "./sharc/Utils";
import { AnimatedBezierCurve, AnimatedEllipse, AnimatedLine, AnimatedNullShape } from "./sharc/AnimatedShapes";
import { Bounce, EASE_IN_OUT, LINEAR } from "./sharc/Curves";
import { BezierCurve, Ellipse } from "./sharc/Shapes";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        
        const myLine = new AnimatedLine({
            bounds: xywh(0, 100, 0, 200),
            lineWidth: 20,
            lineCap: 'round',
            color: Colors.red,
            rotation: 50
        }, 3);

        const arrowheadLength = 37.5;

        myLine.children.push(new AnimatedLine({
            bounds: Corners(-arrowheadLength, 100 - arrowheadLength, 0, 100),
            lineWidth: 20,
            lineCap: 'round',
            color: Colors.red,
        }, 3));

        myLine.children.push(new AnimatedLine({
            bounds: Corners(arrowheadLength, 100 - arrowheadLength, 0, 100),
            lineWidth: 20,
            lineCap: 'round',
            color: Colors.red,
        }, 3));

        const myCircle = new AnimatedEllipse({
            bounds: CircleBounds(0, 0, 75),
            stroke: {
                width: 10,
                cap: 'round',
            },
            color: Colors.yellow,
            rotation: 90
        }, 3);

        const bzCurve = new AnimatedBezierCurve({
            bounds: Corners(0, 0, 500, 500),
            control1: {x: 0, y: 0},
            control2: {x: 0, y: 250},
            lineWidth: 5,
            lineCap: 'round',
            color: Colors.red,
        }, 2);

        const root = new AnimatedNullShape({position: {x: 600, y: 400}, scale: {x: .5, y: -.5}, rotation:0});
        const spin = new AnimatedNullShape({position: {x: 0, y: 0}});

        root.children.push(spin);
        spin.children.push(myLine);
        root.children.push(myCircle);
        root.children.push(bzCurve);

        const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'darkgray';
            ctx.fillRect(0, 0, 1200, 800);
            root.draw(ctx);
        };

        spin.getChannel(0).enqueue([
            {property: 'rotation', from: 0, to: 360, duration: 60, delay: 0, easing: EASE_IN_OUT},
        ], {loop: false});

        myLine.getChannel(0).enqueue([
            {property: 'rotation', from: 0, to: 360, duration: 120, delay: 0, easing: EASE_IN_OUT},
        ], {loop: false});

        myCircle.distribute([
            // [{property: 'radius', from: 100, to: 125, duration: 360, delay: 0, easing: Bounce(EASE_IN_OUT)}], 
            [
                {property: 'endAngle', from: 0, to: 360, duration: 60, delay: 0, easing: LINEAR},
                {property: 'startAngle', from: 0, to: 360, duration: 60, delay: 0, easing: LINEAR},
                {property: 'startAngle', from: 360, to: 0, duration: 60, delay: 0, easing: LINEAR},
                {property: 'endAngle', from: 360, to: 0, duration: 60, delay: 0, easing: LINEAR},
            ],
            [{property: 'rotation', from: 0, to: 360, duration: 240, delay: 0, easing: LINEAR}],
            [{property: 'radius', from: 75, to: 125, duration: 180, delay: 0, easing: Bounce(LINEAR)}],
        ], {loop: false});

        bzCurve.distribute([
            [{property: 'control1', from: {x: 0, y: 500}, to: {x: 225, y: 250}, duration: 60, delay: 0, easing: LINEAR}],
            [{property: 'control2', from: {x: 0, y: 500}, to: {x: 225, y: 250}, duration: 60, delay: 0, easing: LINEAR}],
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