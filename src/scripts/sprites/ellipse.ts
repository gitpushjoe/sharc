import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, Line, NullSprite } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const ellipse = new Ellipse({
        color: Colors.White,
        stroke: {
                lineWidth: 5,
                lineJoin: 'round',
        },
        radius: 100
});

stage.root.addChildren(ellipse);

const properties = ['corner1', 'corner2'] as const;
const colors = [Colors.Red, Colors.Blue];

for (const idx in properties) {
        const property = properties[idx];
        const color = colors[idx];
        const position = ellipse[property];
        const handle = new Ellipse({
                center: position,
                radius: 12,
                color: color,
                stroke: {lineWidth: 3},
        });
        handle.on('drag', (sprite, position) => {
                sprite.center = position;
                ellipse[property] = position;
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
        name: 'angleLine',
}), new Ellipse({
        center: {x: -250, y: 0},
        radius: 12,
        color: Colors.GoldenRod,
        stroke: {lineWidth: 3},
        name: 'startAngle',
}), new Ellipse({
        center: {x: 250, y: 0},
        radius: 12,
        color: Colors.Gold,
        stroke: {lineWidth: 3},
        name: 'endAngle',
}));

function updateSlider() {
        const sliderLine = sliderLayer.findChild('angleLine')!;
        sliderLine.corner1 = sliderLayer.findChild('startAngle')!.center;
        sliderLine.corner2 = sliderLayer.findChild('endAngle')!.center;
        let startAngle = sliderLayer.findChild('startAngle')!.centerX;
        let endAngle = sliderLayer.findChild('endAngle')!.centerX;
        startAngle = (startAngle + 250) / 500 * 360;
        endAngle = (endAngle + 250) / 500 * 360;
        ellipse.startAngle = startAngle;
        ellipse.endAngle = endAngle;
}

sliderLayer.findChild('startAngle').on('drag', (sprite, position) => {
        const endAngle = sliderLayer.findChild('endAngle');
        let posX = Math.max(-250, Math.min(250, position.x));
        posX = Math.round(posX);
        posX = Math.min(posX, endAngle!.centerX - 24);
        sprite.centerX = posX;
        updateSlider();
});

sliderLayer.findChild('endAngle').on('drag', (sprite, position) => {
        const startAngle = sliderLayer.findChild('startAngle');
        let posX = Math.max(-250, Math.min(250, position.x));
        posX = Math.round(posX);
        posX = Math.max(posX, startAngle!.centerX + 24);
        sprite.centerX = posX;
        updateSlider();
});

stage.root.addChild(sliderLayer);

