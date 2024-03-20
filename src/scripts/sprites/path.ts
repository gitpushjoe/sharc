import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, Line, Path, NullSprite } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const path = new Path({
    path: [
        {x: -100, y: -100},
        {x: -50, y: 50},
        {x: 50, y: -50},
        {x: 100, y: 100},
    ],
    color: Colors.White,
    stroke: {lineWidth: 5},
    closePath: false,
});

const colors = [Colors.Red, Colors.Yellow, Colors.Purple, Colors.Blue];

stage.root.addChildren(path);
for (const idx in colors) {
    const color = colors[idx];
    const position = path.path[idx];
    const handle = new Ellipse({
        center: position,
        radius: 12,
        color: color,
        stroke: {lineWidth: 3},
    });
    handle.on('drag', (sprite, position) => {
        sprite.center = position;
        path.path[idx] = position;
    });
    stage.root.addChild(handle);
}

const sliderLayer = new NullSprite({position: {x: 0, y: -167.5}});

sliderLayer.addChildren(new Line({
    bounds: Line.Bounds(-250, 0, 250, 0),
    color: Colors.LightGrey,
    lineWidth: 5,
    lineCap: 'round'
}), new Line({
        bounds: Line.Bounds(-250, 0, 250, 0),
        color: Colors.White,
        lineWidth: 5,
        name: 'ratioLine',
    }), new Ellipse({
        center: {x: -250, y: 0},
        radius: 12,
        color: Colors.GoldenRod,
        stroke: {lineWidth: 3},
        name: 'startRatio',
    }), new Ellipse({
        center: {x: 250, y: 0},
        radius: 12,
        color: Colors.Gold,
        stroke: {lineWidth: 3},
        name: 'endRatio',
    }));

stage.root.addChildren(sliderLayer);

function updateSlider() {
    const sliderLine = sliderLayer.findChild('ratioLine')!;
    sliderLine.corner1 = sliderLayer.findChild('startRatio')!.center;
    sliderLine.corner2 = sliderLayer.findChild('endRatio')!.center;
    let startRatio = sliderLayer.findChild('startRatio')!.centerX;
    let endRatio = sliderLayer.findChild('endRatio')!.centerX;
    startRatio = (startRatio + 250) / 500;
    endRatio = (endRatio + 250) / 500;
    path.startRatio = startRatio;
    path.endRatio = endRatio;
}

sliderLayer.findChild('startRatio')!.on('drag', (sprite, position) => {
    let posX = Math.max(-250, Math.min(250, position.x));
    posX = Math.round(posX);
    sprite.centerX = posX;
    updateSlider();
});

sliderLayer.findChild('endRatio')!.on('drag', (sprite, position) => {
    let posX = Math.max(-250, Math.min(250, position.x));
    posX = Math.round(posX);
    sprite.centerX = posX;
    updateSlider();
});

