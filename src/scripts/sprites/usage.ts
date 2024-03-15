import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Line } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const mySprite = new Line({
        bounds: {x1: -200, y1: -100, x2: 250, y2: 100},
        color: {red: 255, green: 0, blue: 0, alpha: 1},
        lineWidth: 10,
});

stage.root.addChild(mySprite);

stage.stop();
