import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, TextSprite, Line } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const circle = new Ellipse({
	radius: 10,
	color: Colors.Gold,
	stroke: {color: Colors.White, lineWidth: 3},
});

circle.addChild(
	new TextSprite({
		position: {x: 10, y: -40},
		text: '(0, 0)',
		fontSize: 30,
		bold: true,
		color: Colors.Gold,
	})
)

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

stage.root.addChild(circle);

stage.on('move', (_, position) => {
	circle.center = position;
	(circle.children[0] as TextSprite).text = `(\
${Math.round(position.x)}, \
${Math.round(position.y)})`;
});

`        const circle2 = new Ellipse({
            radius: 10,
            color: Colors.Gold,
            stroke: {color: Colors.White, lineWidth: 3},
        });

        circle2.addChild(
            new TextSprite({
                position: {x: 10, y: -40},
                text: '(0, 0)',
                fontSize: 30,
                bold: true,
                color: Colors.Gold,
            })
        )

        stage2.on('move', (_event, position) => {
            circle2.center = position;
        });

        stage2.root.addChildren(
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

        stage2.root.addChild(circle2);
        stage2.loop();
`
