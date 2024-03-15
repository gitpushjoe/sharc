import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

stage.root.addChild(new Ellipse({
	radius: 100,
	color: Colors.Aqua,
}));
