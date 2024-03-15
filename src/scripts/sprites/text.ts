import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { TextSprite } from 'sharc-js/Sprites'
import { Colors, Easing } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const text = new TextSprite({
    text: 'Hello, World!',
    fontSize: 80,
    positionIsCenter: true,
    bold: true,
    color: Colors.White,
    effects: (ctx) => {
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 15;
    }
});

text.channels[0].push({
    property: 'color', 
    from: null, 
    to: () => { return {
        red: Math.random() * 100 + 155,
        green: Math.random() * 100 + 155,
        blue: Math.random() * 100 + 155,
        alpha: 1
    }},
    duration: 120,
    easing: Easing.EASE_IN_OUT
}, {loop: true});

stage.root.addChild(text);

