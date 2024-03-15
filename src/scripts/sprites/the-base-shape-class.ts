import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Rect, Polygon, Star, Shape } from 'sharc-js/Sprites';
import { CenterBounds, Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const rect = new Rect({
        bounds: CenterBounds(-125, 75, 120),
        color: Colors.Blue,
        stroke: { lineWidth: 5 },
});

const pentagon = new Polygon({
        center: { x: 125, y: 75 },
        radius: 75,
        sides: 5,
        color: Colors.Red,
        stroke: { lineWidth: 5 },
});

const star = new Star({
        center: { x: 0, y: -75 },
        radius: 75,
        color: Colors.Green,
        stroke: { lineWidth: 5 },
});

const sprites: Shape[] = [rect, pentagon, star];

const makeSpin = (sprite: Shape) => {
        sprite.channels[0].push({
                property: 'rotation',
                from: 0,
                to: -360,
                duration: 60 * 5
        }, { loop: true });
}

sprites.forEach(makeSpin);

stage.root.addChildren(...sprites);
