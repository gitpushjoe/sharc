import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, Line, Star, NullSprite } from 'sharc-js/Sprites'
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const star = new Star({
    radius: 100,
    color: Colors.White,
    stroke: {lineWidth: 5},
});

const handle = new Ellipse({
    radius: 12,
    color: Colors.Red,
    stroke: {lineWidth: 3},
}).on('drag', (sprite, position) => {
    const radiusHandlePos = radiusHandle.center;
    const deltaX = position.x - sprite.centerX;
    const deltaY = position.y - sprite.centerY;
    sprite.center = position;
    star.center = position;
    radiusHandle.center = {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY};
});

const radiusHandle = new Ellipse({
    center: {x: 0, y: 100},
    radius: 12,
    color: Colors.Blue,
    stroke: {lineWidth: 3},
    name: 'radiusHandle'
}).on('drag', (sprite, position) => {
    const center = star.center;
    const radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
    star.radius = radius || 0.1;
    sprite.center = position;
    star.rotation = (Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI) - 12;
    sprite.children[0].rotation = star.rotation - 90 + 12;
}).addChild(new NullSprite({})
    .addChild(new Ellipse({
        center: { x: 0, y: -100 * (3 - Math.sqrt(5)) / 2},
        radius: 12,
        color: Colors.Green,
        stroke: {lineWidth: 3}
    })));

radiusHandle.children[0].children[0]!.on('drag', (sprite, position) => {
    const center = star.center;
    const innerRadius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
    // console.log(innerRadius)
    star.innerRadius = innerRadius || 0.1;
    sprite.centerY = position.y;
});

stage.root.addChildren(star, handle, radiusHandle);

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
    const sliderLine = sliderLayer.findChild('ratioLine') as Line;
    sliderLine.corner1 = sliderLayer.findChild('startRatio')!.center;
    sliderLine.corner2 = sliderLayer.findChild('endRatio')!.center;
    let startRatio = sliderLayer.findChild('startRatio')!.centerX;
    let endRatio = sliderLayer.findChild('endRatio')!.centerX;
    startRatio = (startRatio + 250) / 500;
    endRatio = (endRatio + 250) / 500;
    star.startRatio = startRatio;
    star.endRatio = endRatio;
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

