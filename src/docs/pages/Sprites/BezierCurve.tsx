import { useRef, useEffect } from "react";
import { BezierCurve, Line, Ellipse } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function BezierCurvePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

const curve = new BezierCurve({
    start: {x: -100, y: -100},
    points: [
        {
            control1: {x: -100, y: 50},
            control2: {x: -25, y: -100},
            end: {x: 100, y: -100},
        },
        {
            control1: {x: 100, y: 50},
            control2: {x: -50, y: 100},
            end: {x: 100, y: 100},
        }
    ],
    color: Colors.White,
    stroke: {
        lineWidth: 5,
    },
});

stage.root.addChild(curve);
const properties = [
    ['start', 0],
    ['control1', 0],
    ['control2', 0],
    ['end', 0],
    ['control1', 1],
    ['control2', 1],
    ['end', 1],
] as const;
const colors = [Colors.Red, Colors.OrangeRed, Colors.Orange, Colors.Yellow, Colors.GreenYellow, Colors.Green, Colors.Blue];

for (const idx of [0, 1, 2, 3]) {
    stage.root.addChild(new Line({
        color: {red: 0, green: 0, blue: 0, alpha: 0.75},
        lineDash: 12,
        lineDashGap: 12,
        lineWidth: 5,
        name: `line${idx}`,
    }))
}

for (const idx in properties) {
    const property = properties[idx];
    const color = colors[idx];
    const handle = new Ellipse({
        center: property[0] === 'start' ? curve.start : curve.points[property[1]][property[0]],
        radius: 12,
        color: color,
        stroke: {lineWidth: 3},
    });
    handle.on('drag', function (_event, position) {
        this.center = position;
        if (property[0] === 'start') {
            curve.start = position;
        } else {
            curve.points[property[1]][property[0]] = position;
        }
    });
    stage.root.addChild(handle);
}


stage.on('beforeDraw', function (event) {
    const line0 = stage.root.findChild('line0') as Line;
    const line1 = stage.root.findChild('line1') as Line;
    const line2 = stage.root.findChild('line2') as Line;
    const line3 = stage.root.findChild('line3') as Line;

    line0.corner1 = curve.start;
    line0.corner2 = curve.points[0].control1;
    line1.corner1 = curve.points[0].control2;
    line1.corner2 = curve.points[0].end;
    line2.corner1 = curve.points[0].end;
    line2.corner2 = curve.points[1].control1;
    line3.corner1 = curve.points[1].control2;
    line3.corner2 = curve.points[1].end;
});

stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>BezierCurve</h1>
        <p>
            Draws one or more cubic Bézier curve. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the curve, which can cause unexpected behavior.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from "sharc-js/Stage";
import { BezierCurve, Line, Ellipse } from "sharc-js/Sprites";
import { Colors } from "sharc-js/Utils";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const curve = new BezierCurve({
	start: {x: -100, y: -100},
	points: [
		{
			control1: {x: -100, y: 50},
			control2: {x: -25, y: -100},
			end: {x: 100, y: -100},
		},
		{
			control1: {x: 100, y: 50},
			control2: {x: -50, y: 100},
			end: {x: 100, y: 100},
		}
	],
	color: Colors.White,
	stroke: {
		lineWidth: 5,
	}
});

stage.root.addChild(curve);
const properties = [
	['start', 0],
	['control1', 0],
	['control2', 0],
	['end', 0],
	['control1', 1],
	['control2', 1],
	['end', 1],
] as const;
const colors = [Colors.Red, Colors.OrangeRed, Colors.Orange, Colors.Yellow, Colors.GreenYellow, Colors.Green, Colors.Blue];

for (const idx of [0, 1, 2, 3]) {
	stage.root.addChild(new Line({
		color: {red: 0, green: 0, blue: 0, alpha: 0.75},
		lineDash: 12,
		lineDashGap: 12,
		lineWidth: 5,
		name: \`line\${idx}\`,
	}))
}

for (const idx in properties) {
	const property = properties[idx];
	const color = colors[idx];
	const handle = new Ellipse({
		center: property[0] === 'start' ? curve.start : curve.points[property[1]][property[0]],
		radius: 12,
		color: color,
		stroke: {lineWidth: 3},
	});
	handle.on('drag', function (_event, position) {
		this.center = position;
		if (property[0] === 'start') {
			curve.start = position;
		} else {
			curve.points[property[1]][property[0]] = position;
		}
	});
	stage.root.addChild(handle);
}


stage.on('beforeDraw', function (event) {
	const line0 = stage.root.findChild('line0') as Line;
	const line1 = stage.root.findChild('line1') as Line;
	const line2 = stage.root.findChild('line2') as Line;
	const line3 = stage.root.findChild('line3') as Line;

	line0.corner1 = curve.start;
	line0.corner2 = curve.points[0].control1;
	line1.corner1 = curve.points[0].control2;
	line1.corner2 = curve.points[0].end;
	line2.corner1 = curve.points[0].end;
	line2.corner2 = curve.points[1].control1;
	line3.corner1 = curve.points[1].control2;
	line3.corner2 = curve.points[1].end;
});
stage.loop();`} />

        <h3>BezierCurveProperties</h3>
        <p style={{lineHeight: '2em'}}>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['color?', 'scale?', 'rotation?', 'alpha?', 'blur?', 'gradient?', 'effects?', 'name?', 'enabled?', 'channelCount?', 'details?'].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={[prop]} />{' '}
                    </>
                })
            }
            <br />
            Inherited from <Hyperlink to='sprites/strokeablesprite'>StrokeableSprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['stroke?'].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={[prop]} />{' '}
                    </>
                })
            }
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['start?: ', 'PositionType']} /> - the starting point of the curve. Defaults to <InlineCode>{'{x: 0, y: 0}'}</InlineCode>. Aggregate Property for <InlineCode>startX</InlineCode> and <InlineCode>startY</InlineCode>. 
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['points?: ', 'BezierPoint[]']} /> - an array of <Hyperlink to='types/sprite/BezierPoint'>BezierPoint</Hyperlink> objects. Defaults to <InlineCode>{`[]`}</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['closePath?: ', 'boolean']} /> - whether or not the curve is closed. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', '"nonzero"|"evenodd"']} /> - the fill rule of the curve. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
        </p>
        <br />
        <h5>HiddenBezierCurveProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startX: ', 'number']} /> - the number of curves on the path. Normal hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startY: ', 'number']} /> - the number of curves on the path. Normal hidden property.
        </p>
    </>
}