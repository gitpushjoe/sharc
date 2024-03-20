import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { NullSprite, Star } from 'sharc-js/Sprites'
import { Colors  } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const star = new Star({
    center: {x: 0, y: 75},
    radius: 30,
    color: Colors.White,
    stroke: {lineWidth: 5},
});

const nullsprite = new NullSprite({});

nullsprite.addChild(star);
stage.root.addChild(nullsprite);

stage.on('move', (_, pos) => {
    nullsprite.position = pos;
});

nullsprite.channels[0].push({
    property: 'rotation', from: 0, to: 360, duration: 120
}, {loop: true});

stage.loop();
