import { useRef, useEffect } from "react";
import { Polygon, Ellipse, NullSprite, Line } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function PolygonPage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

const polygon = new Polygon({
    center: {x: 0, y: 0},
    sides: 6,
    radius: 100,
    rotation: 30,
    color: Colors.White,
    stroke: {lineWidth: 5},
});

const handle = new Ellipse({
    radius: 12,
    color: Colors.Red,
    stroke: {lineWidth: 3},
}).on('drag', function (_event, position) {
    const radiusHandlePos = radiusHandle.center;
    const deltaX = position.x - this.centerX;
    const deltaY = position.y - this.centerY;
    this.center = position;
    polygon.center = position;
    radiusHandle.center = {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY};
});

const radiusHandle = new Ellipse({
    center: {x: 0, y: 100},
    radius: 12,
    color: Colors.Blue,
    stroke: {lineWidth: 3}
}).on('drag', function (_event, position) {
    const center = polygon.center;
    const radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
    polygon.radius = radius || 0.1;
    this.center = position;
    polygon.rotation = Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI;
});

stage.root.addChildren(polygon, handle, radiusHandle);

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
    polygon.startRatio = startRatio;
    polygon.endRatio = endRatio;
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

const sidesSliderLayer = new NullSprite({position: {x: 0, y: 167.5}});

sidesSliderLayer.addChildren(...sliderLayer.children.map(sprite => sprite.copy()));

sidesSliderLayer.removeChild(sidesSliderLayer.findChild('endRatio')!);
sidesSliderLayer.findChild('ratioLine')!.name = 'sidesLine';
sidesSliderLayer.findChild('sidesLine')!.x2 = -250/3;
sidesSliderLayer.findChild('startRatio')!.name = 'sides-count';
sidesSliderLayer.findChild('sides-count')!.centerX = -250/3;
sidesSliderLayer.findChild('sides-count')!.color = Colors.Lime;

sidesSliderLayer.findChild('sides-count')!.on('drag', function (_event, position) {
    let posX = Math.max(-250, Math.min(250, position.x));
    posX = (250 + posX) / 500 * 9;
    const sides = Math.max(3, Math.min(12, Math.round(posX + 3)));
    posX = -250 + (sides - 3) / 9 * 500;
    this.centerX = posX;
    polygon.sides = sides;
    sidesSliderLayer.findChild('sidesLine')!.corner2 = {x: posX, y: 0};
});

stage.root.addChild(sidesSliderLayer);

stage.loop();

        return () => {
            stage.stop();
        }

    }, [canvasRef]);
    return <>
        <h1>Polygon</h1>
        <p>
            Draws a regular n-sided polygon. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the polygon, which can cause unexpected behavior.
        </p>
        {/* <p>
            Note that <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> are hidden properties, but <strong>not</strong> hidden calculated properties. The <em>bounds</em> are calculated from the center, not the other way around.
        </p> */}

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc/Stage'
import { Ellipse, Line, Polygon, NullSprite } from 'sharc/Sprites'
import { Colors } from 'sharc/Utils'

const polygon = new Polygon({
	center: {x: 0, y: 0},
	sides: 6,
	radius: 100,
	rotation: 30,
	color: Colors.White,
	stroke: {lineWidth: 5},
});

const handle = new Ellipse({
	radius: 12,
	color: Colors.Red,
	stroke: {lineWidth: 3},
}).on('drag', function (_event, position) {
	const radiusHandlePos = radiusHandle.center;
	const deltaX = position.x - this.centerX;
	const deltaY = position.y - this.centerY;
	this.center = position;
	polygon.center = position;
	radiusHandle.center = {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY};
});

const radiusHandle = new Ellipse({
	center: {x: 0, y: 100},
	radius: 12,
	color: Colors.Blue,
	stroke: {lineWidth: 3}
}).on('drag', function (_event, position) {
	const center = polygon.center;
	const radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
	polygon.radius = radius || 0.1;
	this.center = position;
	polygon.rotation = Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI;
});

stage.root.addChildren(polygon, handle, radiusHandle);

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
	polygon.startRatio = startRatio;
	polygon.endRatio = endRatio;
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

const sidesSliderLayer = new NullSprite({position: {x: 0, y: 167.5}});

sidesSliderLayer.addChildren(...sliderLayer.children.map(sprite => sprite.copy()));

sidesSliderLayer.removeChild(sidesSliderLayer.findChild('endRatio')!);
sidesSliderLayer.findChild('ratioLine')!.name = 'sidesLine';
sidesSliderLayer.findChild('sidesLine')!.x2 = -250/3;
sidesSliderLayer.findChild('startRatio')!.name = 'sides-count';
sidesSliderLayer.findChild('sides-count')!.centerX = -250/3;
sidesSliderLayer.findChild('sides-count')!.color = Colors.Lime;

sidesSliderLayer.findChild('sides-count')!.on('drag', function (_event, position) {
	let posX = Math.max(-250, Math.min(250, position.x));
	posX = (250 + posX) / 500 * 9;
	const sides = Math.max(3, Math.min(12, Math.round(posX + 3)));
	posX = -250 + (sides - 3) / 9 * 500;
	this.centerX = posX;
	polygon.sides = sides;
	sidesSliderLayer.findChild('sidesLine')!.corner2 = {x: posX, y: 0};
});

stage.root.addChild(sidesSliderLayer);

stage.loop();`} />
        <h3>PolygonProperties</h3>
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
            <CodeBlurb blurb={['sides?: ', 'number']} /> - the number of sides of the polygon. Defaults to 5. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['center?: ', 'PositionType']} /> - the center of the polygon. Defaults to <InlineCode>{'{x: 0, y: 0}'}</InlineCode>. Aggregate Property for <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode>.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['radius: ', 'number']} /> - the radius of the polygon. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', 'CanvasFillRule']} /> - the fill rule of the polygon. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startRatio?: ', 'number']} /> - the ratio of the polygon's length at which the polygon begins. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['endRatio?: ', 'number']} /> - the ratio of the polygon's length at which the polygon ends. Defaults to 1. Normal Property.
        </p>
    </>
}