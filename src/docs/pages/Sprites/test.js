import { Stage } from 'sharc-js/dist/Stage'
import { Line, Ellipse } from 'sharc-js/dist/Sprites'
import { Colors } from 'sharc-js/dist/Utils'

const canvas = document.getElementById('canvas');
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);
const root = stage.root;

const line = new Line({
        bounds: Line.Bounds(-100, -100, 100, 100),
        color: Colors.White,
        lineWidth: 10,
});

root.addChild(line);

const properties = ['corner1', 'corner2'];
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

stage.loop();