import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, Rect, TextSprite } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const rect = new Rect({
    bounds: Rect.Bounds(-100, -100, 200, 200),
    color: Colors.White,
    stroke: {
        lineWidth: 5,
        lineJoin: 'round',
    },
    radius: [20]
});

const text = new TextSprite({
    text: 'Scroll to change corner radius',
    color: Colors.White,
    position: {x: 0, y: -150},
    positionIsCenter: true,
    fontSize: 30,
});

stage.root.addChildren(rect, text);

const properties = ['corner1', 'corner2'] as const;
const colors = [Colors.Red, Colors.Blue];

for (const idx in properties) {
    const property = properties[idx];
    const color = colors[idx];
    const position = rect[property];
    const handle = new Ellipse({
        center: position,
        radius: 12,
        color: color,
        stroke: {lineWidth: 3},
    });
    handle.on('drag', (sprite, position) => {
        sprite.center = position;
        rect[property] = position;
    });
    stage.root.addChild(handle);
}

stage.on('scroll', (_, event) => {
    const newRadius = rect.radius[0] + event.deltaY / 30;
    rect.radius = [Math.max(0, Math.min(500, newRadius))];
});
