import { Stage } from 'sharc-js/Stage';
import { Ellipse, TextSprite, Line } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const text = new TextSprite({
	position: {x: -275, y: -175},
	text: 'Click me!',
	color: Colors.White,
	fontSize: 35,
	bold: true,
});

stage.root.addChildren(
	new Line({
		bounds: Line.Bounds(0, 300, 0, -300),
		color: Colors.LightGrey,
		lineWidth: 4,
	}),
	new Line({
		bounds: Line.Bounds(300, 0, -300, 0),
		color: Colors.LightGrey,
		lineWidth: 4,
	}),
)

stage.root.addChildren(
	new Ellipse({
		radius: 10,
		color: Colors.Gold,
		stroke: {color: Colors.White, lineWidth: 3},
	})
)

stage.root.addChild(text);

stage.on('click', function (stage, position, event) {
	const button = event.button === 0 ? 'Left' : event.button === 1 ? 'Middle' : 'Right';
	const text = `${button} click at (${Math.round(position.x)}, ${Math.round(position.y)})`;
	(stage.root.children[3] as TextSprite).text = text;
	stage.root.children[2].center = position;
});

stage.loop();
