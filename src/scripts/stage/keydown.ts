import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { TextSprite, NullSprite } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const layer = new NullSprite<string>({
	details: 'Click here and start typing',
});

stage.root.addChild(layer);

const handleKey = (_: WorkerStage, event: KeyboardEvent) => {
	if (event.key === 'Backspace') {
		if (event.ctrlKey) {
			let deleteIdx = layer.details!.lastIndexOf('\n');
			deleteIdx = Math.max(deleteIdx, layer.details!.lastIndexOf(' '));
			deleteIdx = deleteIdx === -1 ? 0 : deleteIdx;
			layer.details = layer.details!.slice(0, deleteIdx);
		} else {
			layer.details = layer.details!.slice(0, -1);
		}
	} else if (event.key === 'Enter') {
		layer.details += '\n';
	} else if (event.key.length === 1) {
		layer.details += event.key;
	} else {
		return;
	}
	const lines = layer.details!.split('\n');
	for (const i in lines) {
		const text = lines[i];
		if (layer.children.length <= parseInt(i)) {
			layer.addChild(new TextSprite({
				text,
				position: {x: 0, y: -40 * parseInt(i)},
				positionIsCenter: true,
				color: Colors.White,
				fontSize: 35,
				bold: true,
			}));
		}
		(layer.children[parseInt(i)] as TextSprite).text = text;
	}
	if (layer.children.length > lines.length) {
		for (let i = lines.length; i < layer.children.length; i++) {
			layer.removeChild(layer.children[i]);
		}
	}

	layer.positionY = 40 * (lines.length - 1) / 2;
};

handleKey(stage, ({key: '!'} as KeyboardEvent));

stage.on('keydown', () => {
	layer.details = '';
	return true;
});

stage.on('keydown', handleKey);

stage.postCustomMessage({clickable: true});
