import { useEffect, useRef } from "react";
import { Colors, Position, AnimateTo, Corners } from "./sharc/Utils";
import { Easing } from "./sharc/Easing";
import { Ellipse, ImageShape, Rect, TextSprite } from "./sharc/Shapes";
import { Stage } from "./sharc/Stage";
import Picture from '/shark.png';
import Picture2 from '/download.png';
import { Sprite } from "./sharc/BaseShapes";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {

    const stage = new Stage(canvasRef.current!, 'centered', Colors.LightGrey);
    const root = stage.root;

    const boundingBox = new Rect({
        bounds: Rect.Bounds(-800, -500, 1600, 1000),
        stroke: {color: Colors.White, width: 5},
        name: 'boundingBox',
        color: Colors.None
    });

    root.addChildren(boundingBox);

    const ball = (x: number, y: number, radius: number) => {const ball = new Ellipse({
        bounds: Ellipse.Bounds(x, y, radius),
        stroke: {color: Colors.White, width: 5},
    }, 5).distribute([
        [AnimateTo('centerY', -500 + radius, 30, 0, Easing.EASE_IN_CUBIC, 'bounce-floor'),
        AnimateTo('centerY', Math.random() * 400, 30, 0, Easing.EASE_OUT_CUBIC, 'drop')],
        [AnimateTo('centerX', -800 + radius, 90, 0, Easing.LINEAR, 'bounce-left'),
        AnimateTo('centerX', 800 - radius, 90, 0, Easing.LINEAR, 'bounce-right')],
        [AnimateTo('red', Math.random() * 255, 60, 0, Easing.EASE_OUT)],
        [AnimateTo('green', Math.random() * 255, 60, 0, Easing.EASE_OUT)],
    ], {loop: true});
    ball.onAnimationFinish = function (shape, animation) {
        if (animation?.name)
            console.log(`${shape.getProperty('name')}: ${animation!.name}`);
    }
    return ball;}

    const img = new Image();
    img.src = Picture;

    root.addChildren(new ImageShape({
        image: img,
        bounds: Corners(-200, -200, 200, 200),
        scale: Position(1, -1),
        name: 'shark',
    }));

    setTimeout(() => {
        const img2 = new Image();
        img2.src = Picture2;
        root.findChild('shark')!.setProperty('image', img2);      
    }, 1000);

    root.addChildren(new TextSprite({
        text: 'Click anywhere to add a ball',
        position: Position(-750, 400),
        scale: Position(1, -1),
        fontSize: 50,
        bold: true,
    })).getChannel(0).push([
        {property: 'alpha', from: 5, to: 10, duration: 60, delay: 0, easing: Easing.EASE_OUT, details: ['5']},
    ])
    
    root.addChildren(new TextSprite({
        text: '% FPS',
        position: Position(-750, 337.5),
        scale: Position(1, -1),
        fontSize: 50,
        bold: true,
        name: 'text',
        color: Colors.Green,
    }));

    boundingBox.onDrag = function (_, e, transform) {
        const pos = transform(Position(e.offsetX, e.offsetY));
        boundingBox.addChildren(ball(pos.x, pos.y, Math.random() * 100 + 50));
        root.children[2].setProperty('text', `Count: ${boundingBox.children.length}`);
    }

    boundingBox.onRelease = boundingBox.onDrag;
    
    setInterval(() => {
        root.findChild('text')!.setProperty('text', `${Math.round(1000 / stage.lastRenderMs)} FPS`);
    }, 250);

    stage.beforeDraw = function (stage: Stage) {
        stage.root.findChild('boundingBox')!.children.forEach((c: Sprite<any, any>) => {
            if (c.getProperty('name') === 'special') {
                c.setProperty('effects', (ctx: CanvasRenderingContext2D) => {ctx.shadowBlur = 60; ctx.shadowColor = 'red';});
                c.setProperty('alpha', 1);
            } else {
                c.setProperty('effects', () => {});
                c.setProperty('alpha', 0.1);
            }
        });
    }

    stage.afterDraw = function (stage: Stage) {
        if (stage.currentFrame % 120 === 0) {
            const boundingbox = stage.root.findChild('boundingBox')!;
            boundingbox!.children.forEach((c: Sprite<any, any>) => {
                c.setProperty('name', '');
            });
            const ballsCount = boundingbox.children.length;
            if (ballsCount > 0) {
                const randomBall = boundingbox!.children[Math.floor(Math.random() * ballsCount)];
                randomBall.setProperty('name', 'special');
                boundingbox!.removeChildren(randomBall);
                boundingbox!.addChildren(randomBall);
            }
        }

        stage.onScroll = function (stage, e) {
            const boundingbox = stage.root.findChild('boundingBox')!;
            boundingbox.setProperty('scale', Position(boundingbox.getProperty('scaleX') + e.deltaY / 1000, boundingbox.getProperty('scaleY') + e.deltaY / 1000));
        };
    }

    stage.loop(60);
    
    return () => {stage.stop();};
    }, [canvasRef]);

  return (
    <div style={{padding: '1em'}}>
      <h1>Demo</h1>
      <canvas width={1600} height={1000} ref={canvasRef} style={{ border: '5px solid black' }}></canvas>
    </div>
  );
};

export default App;