import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { TextSprite } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

stage.root.addChild(new TextSprite({
    position: {x: 0, y: 10},
    text: 'even frame',
    color: Colors.White,
    positionIsCenter: true,
    fontSize: 60,
    bold: true,
}));

stage.on('beforeDraw', (stage, frame) => {
    stage.bgColor = frame % 2 === 0 ? Colors.DarkBlue : Colors.DarkRed;
	(stage.root.children[0] as TextSprite).text = (frame % 2 === 0 ? 'even' : 'odd') + ' frame';
});

stage.postCustomMessage({"framerate": 0.25});
