import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse } from "sharc-js/Sprites";
import { Colors } from "sharc-js/Utils";

const stage = new WorkerStage(postMessage.bind(null), 'classic', Colors.None);
onmessage = stage.onmessage;

const ellipse1 = new Ellipse({
	center: { x: 100, y: 100 },
	radius: 50,
	color: Colors.Aqua,
});

const ellipse2 = new Ellipse({
	center: { x: 400, y: 200 },
	radius: 75,
	color: Colors.Lime,
});

stage.root.addChildren(ellipse1, ellipse2);
stage.frameRate = 1;
