import { useEffect, useRef } from "react";
import { Bounds as xywh, Corners, Colors, Position, RGBA } from "./sharc/Utils";
import { Easing } from "./sharc/Curves";
import { BezierCurve, Ellipse, Line, NullShape, Path, Polygon, Star } from "./sharc/Shapes";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        
        const myLine = new Line({
            bounds: xywh(0, 100, 0, 200),
            lineWidth: 20,
            lineCap: 'round',
            color: Colors.red,
        }, 3);

        const arrowheadLength = 37.5;

        myLine.children.push(new Line({
            bounds: Corners(-arrowheadLength, 100 - arrowheadLength, 0, 100),
            lineWidth: 20,
            lineCap: 'round',
            color: Colors.red,
        }, 3));

        myLine.children.push(new Line({
            bounds: Corners(arrowheadLength, 100 - arrowheadLength, 0, 100),
            lineWidth: 20,
            lineCap: 'round',
            color: Colors.red,
        }, 3));

        const bzCurve = new BezierCurve({
            bounds: Corners(0, 0, 500, 500),
            control1: {x: 0, y: 0},
            control2: {x: 0, y: 250},
            lineWidth: 5,
            lineCap: 'round',
            color: Colors.red,
        }, 3);

        const root = new NullShape({position: {x: 600, y: 400}, scale: {x: 1, y: -1}, rotation:0});
        const spin = new NullShape({position: {x: 0, y: 0}});

        root.children.push(spin);
        spin.children.push(myLine);

        const myPath = new Path({
            path: [
                { x: 0, y: 0 },
                { x: 50, y: -10 },
                { x: 100, y: 0 },
                { x: 50, y: 10 },
                { x: 70, y: 50 },
                { x: 40, y: 80 },
                { x: 0, y: 50 },
                { x: -40, y: 80 },
                { x: -70, y: 50 },
                { x: -50, y: 10 },
                { x: -100, y: 0 },
                { x: -50, y: -10 },
                { x: 0, y: 0 },
            ],
            stroke: {color: Colors.black, width: 10, join: 'round', cap: 'round'},
            color: RGBA(100, 120, 255),
            closePath: false,
            scale: {x: 5, y: 5},
        }, 2).distribute([
            [{property: 'end', from: 0, to: 1, duration: 480, delay: 0, easing: Easing.EASE_IN_OUT}],
        ], {loop: true});
        root.children.push(myPath);

        const polygon = new Polygon({
            center: {x: -150, y: -150},
            radius: 100,
            sides: 7.5,
            stroke: {color: Colors.black, width: 10, cap: 'round'},
            color: RGBA(100, 120, 255),
        }, 10);
        root.children.push(polygon);

        const star = new Star({
            center: {x: 150, y: -150},
            radius: 100,
            color: RGBA(100, 120, 255),
            stroke: {color: Colors.black, width: 10, join: 'round'},
            fillRule: 'evenodd',
        }).distribute([
            [{property: 'end', from: 0, to: 1, duration: 480, delay: 0, easing: Easing.EASE_IN_OUT}],
        ], {loop: true});
        root.children.push(star);

        polygon.distribute([[
            {property: 'rotation', from: 0, to: 360, duration: 900, delay: 0, easing: Easing.Bounce(Easing.LINEAR)},
        ]
        ], {loop: true});
        
        const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'darkgray';
            ctx.fillRect(0, 0, 1200, 800);
            root.draw(ctx);
        };

        spin.getChannel(0).enqueue([
            {property: 'rotation', from: 0, to: 360, duration: 60, delay: 0, easing: Easing.EASE_IN_OUT},
        ], {loop: false});

        myLine.getChannel(0).enqueue([
            {property: 'rotation', from: 0, to: 360, duration: 120, delay: 0, easing: Easing.EASE_IN_OUT},
        ], {loop: false});

        bzCurve.distribute([
            [{property: 'centerX', from: 0, to: 500, duration: 60, delay: 0, easing: Easing.LINEAR}],
            [{property: 'control2', from: {x: 0, y: 500}, to: {x: 225, y: 250}, duration: 60, delay: 0, easing: Easing.LINEAR}],
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