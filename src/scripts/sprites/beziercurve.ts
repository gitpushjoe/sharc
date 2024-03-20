import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, Line, BezierCurve } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const curve = new BezierCurve({
    start: {x: -100, y: -100},
    points: [
        {
            control1: {x: -100, y: 50},
            control2: {x: -25, y: -100},
            end: {x: 100, y: -100},
        },
        {
            control1: {x: 100, y: 50},
            control2: {x: -50, y: 100},
            end: {x: 100, y: 100},
        }
    ],
    color: Colors.White,
    stroke: {
        lineWidth: 5,
    }
});

stage.root.addChild(curve);
const properties = [
    ['start', 0],
    ['control1', 0],
    ['control2', 0],
    ['end', 0],
    ['control1', 1],
    ['control2', 1],
    ['end', 1],
] as const;
const colors = [Colors.Red, Colors.OrangeRed, Colors.Orange, Colors.Yellow, Colors.GreenYellow, Colors.Green, Colors.Blue];

for (const idx of [0, 1, 2, 3]) {
    stage.root.addChild(new Line({
        color: {red: 0, green: 0, blue: 0, alpha: 0.75},
        lineDash: 12,
        lineDashGap: 12,
        lineWidth: 5,
        name: `line${idx}`,
    }))
}

for (const idx in properties) {
    const property = properties[idx];
    const color = colors[idx];
    const handle = new Ellipse({
        center: property[0] === 'start' ? curve.start : curve.points[property[1]][property[0]],
        radius: 12,
        color: color,
        stroke: {lineWidth: 3},
    });
    handle.on('drag', (sprite, position) => {
        sprite.center = position;
        if (property[0] === 'start') {
            curve.start = position;
        } else {
            curve.points[property[1]][property[0]] = position;
        }
    });
    stage.root.addChild(handle);
}


stage.on('beforeDraw', (stage) => {
    const line0 = stage.root.findChild('line0');
    const line1 = stage.root.findChild('line1');
    const line2 = stage.root.findChild('line2');
    const line3 = stage.root.findChild('line3');

    line0!.corner1 = curve.start;
    line0!.corner2 = curve.points[0].control1;
    line1!.corner1 = curve.points[0].control2;
    line1!.corner2 = curve.points[0].end;
    line2!.corner1 = curve.points[0].end;
    line2!.corner2 = curve.points[1].control1;
    line3!.corner1 = curve.points[1].control2;
    line3!.corner2 = curve.points[1].end;
});
