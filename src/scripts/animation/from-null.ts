import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, TextSprite } from 'sharc-js/Sprites';
import { Colors, Easing } from 'sharc-js/Utils';
import { PositionType } from 'sharc-js/types/Common';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const get_random_position = () => {return {
    x: (Math.random() - 0.5) * stage.width!,
    y: (Math.random() - 0.5) * stage.height!,
} as PositionType}

const smart_circle = new Ellipse({
    radius: 25,
    color: Colors.Aqua,
    stroke: {lineWidth: 5},
}).on('click', sprite => {
    sprite.channels[0].enqueue([
        {
            property: 'center',
            from: null,
            to: get_random_position(),
            duration: 15,
            easing: Easing.EASE_IN_OUT,
        }
    ], 1);
    sprite.bringToFront();
}).addChild(new TextSprite({
    text: 'from: null',
    color: Colors.Aqua,
    position: {x: 0, y: 55},
    positionIsCenter: true,
    fontSize: 30,
    bold: true,
}));

const normal_circle = new Ellipse({
    radius: 25,
    color: Colors.DarkMagenta,
    stroke: {lineWidth: 5},
}).on('click', sprite => {
    sprite.channels[0].enqueue([
        {
            property: 'center',
            from: {x: 0, y: 0},
            to: get_random_position(),
            duration: 15,
            easing: Easing.EASE_IN_OUT,
        }
    ], 1);
    sprite.bringToFront();
}).addChild(new TextSprite({
    text: 'from: (0, 0)',
    color: Colors.DarkMagenta,
    position: {x: 0, y: -55},
    positionIsCenter: true,
    fontSize: 30,
    bold: true,
}));

stage.root.addChildren(normal_circle, smart_circle);
