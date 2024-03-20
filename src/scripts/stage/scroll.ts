import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, TextSprite, Line } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const sliderText = new TextSprite({
	text: 'Slider',
	position: {x: -155, y: -15},
	color: Colors.White,
	fontSize: 40,
	textAlign: 'right',
});

const slider = new Ellipse({
	center: { x: -130, y: 0 },
	radius: 12,
	color: Colors.DarkBlue,
	stroke: {color: Colors.White, lineWidth: 4},
});

const sliderLine = new Line({
	bounds: Line.Bounds(-130, 0, 275, 0),
	color: Colors.LightGrey,
	lineWidth: 4,
	lineCap: 'round',
});

stage.root.addChildren(sliderText, sliderLine, slider);

stage.on('scroll',(_, event) => {
	const delta = event.deltaY;
	const sliderX = slider.centerX;
	if (delta < 0) {
		slider.centerX = Math.min(sliderX + 10, 275);
	} else if (delta > 0) {
		slider.centerX = Math.max(sliderX - 10, -130);
	}
	const percentage = (slider.centerX + 130) / 405;
	sliderText.red = (1 - percentage) * 200;
	sliderText.blue = (1 - percentage) * 200;
	sliderText.bold = percentage === 1;
	sliderText.text = `${Math.round(percentage * 100)}%`;
});
