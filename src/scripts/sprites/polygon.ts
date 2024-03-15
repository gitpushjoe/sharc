import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, Line, Polygon, NullSprite } from 'sharc-js/Sprites'
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const polygon = new Polygon({
    center: {x: 0, y: 0},
    sides: 6,
    radius: 100,
    rotation: 30,
    color: Colors.White,
    stroke: {lineWidth: 5},
});

const handle = new Ellipse({
    radius: 12,
    color: Colors.Red,
    stroke: {lineWidth: 3},
}).on('drag', function (_event, position) {
    const radiusHandlePos = radiusHandle.center;
    const deltaX = position.x - this.centerX;
    const deltaY = position.y - this.centerY;
    this.center = position;
    polygon.center = position;
    radiusHandle.center = {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY};
});

const radiusHandle = new Ellipse({
    center: {x: 0, y: 100},
    radius: 12,
    color: Colors.Blue,
    stroke: {lineWidth: 3}
}).on('drag', function (_event, position) {
    const center = polygon.center;
    const radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
    polygon.radius = radius || 0.1;
    this.center = position;
    polygon.rotation = Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI;
});

stage.root.addChildren(polygon, handle, radiusHandle);

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
    polygon.startRatio = startRatio;
    polygon.endRatio = endRatio;
}

sliderLayer.findChild('startRatio')!.on('drag', function (_event, position) {
    let posX = Math.max(-250, Math.min(250, position.x));
    posX = Math.round(posX);
    this.centerX = posX;
    updateSlider();
});

sliderLayer.findChild('endRatio')!.on('drag', function (_event, position) {
    let posX = Math.max(-250, Math.min(250, position.x));
    posX = Math.round(posX);
    this.centerX = posX;
    updateSlider();
});

const sidesSliderLayer = new NullSprite({position: {x: 0, y: 167.5}});

sidesSliderLayer.addChildren(...sliderLayer.children.map(sprite => sprite.copy()));

sidesSliderLayer.removeChild(sidesSliderLayer.findChild('endRatio')!);
sidesSliderLayer.findChild('ratioLine')!.name = 'sidesLine';
sidesSliderLayer.findChild('sidesLine')!.x2 = -250/3;
sidesSliderLayer.findChild('startRatio')!.name = 'sides-count';
sidesSliderLayer.findChild('sides-count')!.centerX = -250/3;
sidesSliderLayer.findChild('sides-count')!.color = Colors.Lime;

sidesSliderLayer.findChild('sides-count')!.on('drag', function (_event, position) {
    let posX = Math.max(-250, Math.min(250, position.x));
    posX = (250 + posX) / 500 * 9;
    const sides = Math.max(3, Math.min(12, Math.round(posX + 3)));
    posX = -250 + (sides - 3) / 9 * 500;
    this.centerX = posX;
    polygon.sides = sides;
    sidesSliderLayer.findChild('sidesLine')!.corner2 = {x: posX, y: 0};
});

stage.root.addChild(sidesSliderLayer);
