import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Line } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

stage.root.addChild(new Line({
	bounds: Line.Bounds(0, 0, 0, 80),
	color: Colors.Gold,
	lineWidth: 7,
	lineCap: 'round',
	arrow: {
		stroke: {
			color: Colors.Gold,
			lineWidth: 7,
			lineCap: 'round',
		}
	}
}));

stage.root.createChannels(1);

stage.root.distribute([
	[{property: 'rotation', from: 0, to: 360, duration: 180, }],
	[{property: 'scale', from: {x: 1, y: -1}, to: {x: 2, y: -2}, duration: 180}], // -1 and -2 since the root is flipped on the y-axis
], {loop: true, delay: 0});
