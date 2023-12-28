import { useRef, useEffect } from "react";
import { Path } from "sharc-js/Sprites.js";
import { Ellipse, NullSprite, Line } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function PathPage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

const path = new Path({
    path: [
        {x: -100, y: -100},
        {x: -50, y: 50},
        {x: 50, y: -50},
        {x: 100, y: 100},
    ],
    color: Colors.White,
    stroke: {lineWidth: 5},
    closePath: false,
});

const colors = [Colors.Red, Colors.Yellow, Colors.Purple, Colors.Blue];

stage.root.addChildren(path);
for (const idx in colors) {
    const color = colors[idx];
    const position = path.path[idx];
    const handle = new Ellipse({
        center: position,
        radius: 12,
        color: color,
        stroke: {lineWidth: 3},
    });
    handle.on('drag', function (_event, position) {
        this.center = position;
        path.path[idx] = position;
    });
    stage.root.addChild(handle);
}

const sliderLayer = new NullSprite({position: {x: 0, y: -167.5}});


sliderLayer.addChildren(new Line({
    bounds: Line.Bounds(-250, 0, 250, 0),
    color: Colors.LightGrey,
    lineWidth: 5,
    lineCap: 'round'
}), new Line({
    bounds: Line.Bounds(-250, 0, 250, 0),
    color: Colors.White,
    lineWidth: 5,
    name: 'ratioLine',
}), new Ellipse({
    center: {x: -250, y: 0},
    radius: 12,
    color: Colors.GoldenRod,
    stroke: {lineWidth: 3},
    name: 'startRatio',
}), new Ellipse({
    center: {x: 250, y: 0},
    radius: 12,
    color: Colors.Gold,
    stroke: {lineWidth: 3},
    name: 'endRatio',
}));

stage.root.addChildren(sliderLayer);

function updateSlider() {
    const sliderLine = sliderLayer.findChild('ratioLine')!;
    sliderLine.corner1 = sliderLayer.findChild('startRatio')!.center;
    sliderLine.corner2 = sliderLayer.findChild('endRatio')!.center;
    let startRatio = sliderLayer.findChild('startRatio')!.centerX;
    let endRatio = sliderLayer.findChild('endRatio')!.centerX;
    startRatio = (startRatio + 250) / 500;
    endRatio = (endRatio + 250) / 500;
    path.startRatio = startRatio;
    path.endRatio = endRatio;
}

sliderLayer.findChild('startRatio')!.on('drag', function (_event, position) {
    let posX = Math.max(-250, Math.min(250, position.x));
    posX = Math.round(posX);
    this.centerX = posX;
    updateSlider();
});

sliderLayer.findChild('endRatio')!.on('drag', function (_event, position) {
    let posX = Math.max(-250, Math.min(250, position.x));
    posX = Math.round(posX);
    this.centerX = posX;
    updateSlider();
});

stage.loop(90);
        
        return () => {
            stage.stop();
        }

    }, [canvasRef]);

    return <>
        <h1>Path</h1>
        <p>
            Draws a series of straight lines. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the path, which can cause unexpected behavior.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc/Stage'
import { Ellipse, Line, Path, NullSprite } from 'sharc/Sprites'
import { Colors } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const path = new Path({
	path: [
		{x: -100, y: -100},
		{x: -50, y: 50},
		{x: 50, y: -50},
		{x: 100, y: 100},
	],
	color: Colors.White,
	stroke: {lineWidth: 5},
	closePath: false,
});

const colors = [Colors.Red, Colors.Yellow, Colors.Purple, Colors.Blue];

stage.root.addChildren(path);
for (const idx in colors) {
	const color = colors[idx];
	const position = path.path[idx];
	const handle = new Ellipse({
		center: position,
		radius: 12,
		color: color,
		stroke: {lineWidth: 3},
	});
	handle.on('drag', function (_event, position) {
		this.center = position;
		path.path[idx] = position;
	});
	stage.root.addChild(handle);
}

const sliderLayer = new NullSprite({position: {x: 0, y: -167.5}});


sliderLayer.addChildren(new Line({
	bounds: Line.Bounds(-250, 0, 250, 0),
	color: Colors.LightGrey,
	lineWidth: 5,
	lineCap: 'round'
}), new Line({
	bounds: Line.Bounds(-250, 0, 250, 0),
	color: Colors.White,
	lineWidth: 5,
	name: 'ratioLine',
}), new Ellipse({
	center: {x: -250, y: 0},
	radius: 12,
	color: Colors.GoldenRod,
	stroke: {lineWidth: 3},
	name: 'startRatio',
}), new Ellipse({
	center: {x: 250, y: 0},
	radius: 12,
	color: Colors.Gold,
	stroke: {lineWidth: 3},
	name: 'endRatio',
}));

stage.root.addChildren(sliderLayer);

function updateSlider() {
	const sliderLine = sliderLayer.findChild('ratioLine')!;
	sliderLine.corner1 = sliderLayer.findChild('startRatio')!.center;
	sliderLine.corner2 = sliderLayer.findChild('endRatio')!.center;
	let startRatio = sliderLayer.findChild('startRatio')!.centerX;
	let endRatio = sliderLayer.findChild('endRatio')!.centerX;
	startRatio = (startRatio + 250) / 500;
	endRatio = (endRatio + 250) / 500;
	path.startRatio = startRatio;
	path.endRatio = endRatio;
}

sliderLayer.findChild('startRatio')!.on('drag', function (_event, position) {
	let posX = Math.max(-250, Math.min(250, position.x));
	posX = Math.round(posX);
	this.centerX = posX;
	updateSlider();
});

sliderLayer.findChild('endRatio')!.on('drag', function (_event, position) {
	let posX = Math.max(-250, Math.min(250, position.x));
	posX = Math.round(posX);
	this.centerX = posX;
	updateSlider();
});

stage.loop();`} />

        <h3>PathProperties</h3>
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
            <CodeBlurb blurb={['path?: ', 'PositionType[]']} /> - an array of <Hyperlink to='types/common/positiontype'>PositionType</Hyperlink> objects that represent the points of the path. Defaults to <InlineCode>[]</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['closePath?: ', 'boolean']} /> - whether or not the path is closed. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', '"nonzero"|"evenodd"']} /> - the fill rule of the path. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startRatio?: ','number']} /> - the ratio of the path's length at which the path begins. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['endRatio?: ','number']} /> - the ratio of the path's length at which the path ends. Defaults to 1. Normal Property.
        </p>

        {/* <h5>HiddenPathProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['point-N: ', 'PositionType']} /> - the Nth point of the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>  
            <CodeBlurb blurb={['x-N: ', 'number']} /> - the x-coordinate of the Nth point of the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['y-N: ', 'number']} /> - the y-coordinate of the Nth point of the path. Zero-indexed. Hidden property.
        </p> */}
    </>
}