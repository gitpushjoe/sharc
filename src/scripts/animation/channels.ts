import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse } from 'sharc-js/Sprites';
import { Colors, Easing } from 'sharc-js/Utils'

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const circle = new Ellipse({
    radius: 30,
    color: Colors.Red,
    stroke: {lineWidth: 5},
});

stage.root.addChild(circle);

stage.on('move', (_, position) => {
    circle.channels[0].enqueue([
    {
        property: 'center',
        from: null,
        to: position,
        duration: 10,
        easing: Easing.EASE_IN_OUT,
    },
    {
        property: 'radius',
        from: null,
        to: (r) => { return [(r as [number, number])[0] * 0.8, (r as [number, number])[1] * 0.8] as any;},
        duration: 10,
        easing: Easing.Bounce(Easing.LINEAR)
    }], 1);
});

