import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { LabelSprite } from 'sharc-js/Sprites';
import { Colors, Easing } from 'sharc-js/Utils';
import { Shrink, Grow } from 'sharc-js/AnimationUtils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const label = new LabelSprite<number>({
    text: 'Click me!',
    fontSize: 70,
    positionIsCenter: true,
    bold: true,
    color: Colors.White,
    backgroundColor: Colors.Blue,
    padding: 15,
    details: 0,
    stroke: { lineWidth: 5 },
});

label.on('release', sprite => {
    sprite.details!++;
    sprite.channels[0].enqueue([
        Shrink(1.1, 5, 0, Easing.EASE_OUT),
        Grow(1.1, 5, 0, Easing.EASE_IN),
    ], 1);
    sprite.text = `${sprite.details!} clicks!`;
});

stage.root.addChild(label);
