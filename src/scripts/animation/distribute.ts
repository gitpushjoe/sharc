import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse } from 'sharc-js/Sprites'
import { Colors, Easing } from 'sharc-js/Utils'

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const circle = new Ellipse({
    radius: 30,
    color: Colors.Aqua,
    stroke: {lineWidth: 5},
    channelCount: 2,
});

circle.distribute(
    [
        [ // channel 0
            {
                property: 'centerX',
                from: -600 / 2 + 15,
                to: 600 / 2 - 15,
                duration: 100,
                delay: 0,
                easing: Easing.Bounce(Easing.LINEAR),
            }
        ],
        [ // channel 1
            {
                property: 'centerY',
                from: 20,
                to: -400 / 2 + 25,
                duration: 40,
                delay: 0,
                easing: Easing.Bounce(Easing.EASE_OUT),
            }
        ],
    ],
{loop: true});

stage.root.addChild(circle);
