import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, TextSprite } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "classic", Colors.LightSlateGray);
onmessage = stage.onmessage;

const circle = new Ellipse({
	center: {x: 0, y: 0},
	radius: 10,
	color: Colors.Gold,
	stroke: {color: Colors.White, lineWidth: 3},
});

circle.addChild(
	new TextSprite({
		text: '(0, 0)',
		fontSize: 30,
		bold: true,
		color: Colors.Gold,
		position: {x: 10, y: 7},
	})
)

stage.root.addChild(circle);

stage.on('move', (_, position) => {
	circle.center = position;
	circle.children[0].text = `(\
${Math.round(position.x)}, \
${Math.round(position.y)})`;
});
