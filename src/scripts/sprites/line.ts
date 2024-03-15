import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, Line } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const root = stage.root;
const line = new Line({
        bounds: Line.Bounds(-100, -100, 100, 100),
        color: Colors.White,
        lineWidth: 10,
});

root.addChild(line);

const properties = ['corner1', 'corner2'] as const;
const colors = [Colors.Red, Colors.Blue];

for (const idx in properties) {
        const property = properties[idx];
        const color = colors[idx];
        const position = line[property];
        const handle = new Ellipse({
                center: position,
                radius: 12,
                color: color,
                stroke: {lineWidth: 3},
        });
        handle.on('drag', function (_event, position) {
                this.center = position;
                line[property] = position;
        });
        root.addChild(handle);
}

