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
            bounds: Ellipse.Bounds(0, 0, 12),
            color: Colors.Red,
            stroke: {lineWidth: 3},
        }).setOnDrag((sprite, _, position) => {
            const radiusHandlePos = radiusHandle.get('center');
            const deltaX = position.x - sprite.get('centerX')
            const deltaY = position.y - sprite.get('centerY');
            sprite.set('center', position);
            polygon.set('center', position);
            radiusHandle.set('center', {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY});
        });

        const radiusHandle = new Ellipse({
            bounds: Ellipse.Bounds(0, 100, 12),
            color: Colors.Blue,
            stroke: {lineWidth: 3}
        }).setOnDrag((sprite, _, position) => {
            const center = polygon.get('center');
            const radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
            polygon.set('radius', radius || 0.1);
            sprite.set('center', position);
            polygon.set('rotation', Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI);
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
            bounds: Ellipse.Bounds(-250, 0, 12),
            color: Colors.GoldenRod,
            stroke: {lineWidth: 3},
            name: 'startRatio',
        }), new Ellipse({
            bounds: Ellipse.Bounds(250, 0, 12),
            color: Colors.Gold,
            stroke: {lineWidth: 3},
            name: 'endRatio',
        }));

        stage.root.addChildren(sliderLayer);

        function updateSlider() {
            const sliderLine = sliderLayer.findChild('ratioLine') as Line;
            sliderLine.set('corner1', sliderLayer.findChild('startRatio')!.get('center'));
            sliderLine.set('corner2', sliderLayer.findChild('endRatio')!.get('center'));
            let startRatio = sliderLayer.findChild('startRatio')!.get('centerX') as number;
            let endRatio = sliderLayer.findChild('endRatio')!.get('centerX') as number;
            startRatio = (startRatio + 250) / 500;
            endRatio = (endRatio + 250) / 500;
            polygon.set('start', startRatio);
            polygon.set('end', endRatio);
        }

        sliderLayer.findChild('startRatio')!.onDrag = (sprite, _, position) => {
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = Math.round(posX);
            sprite.set('centerX', posX);
            updateSlider();
        }

        sliderLayer.findChild('endRatio')!.onDrag = (sprite, _, position) => {
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = Math.round(posX);
            sprite.set('centerX', posX);
            updateSlider();
        }

        const sidesSliderLayer = new NullSprite({position: {x: 0, y: 167.5}});

        sidesSliderLayer.addChildren(...sliderLayer.children.map(sprite => sprite.copy()));

        sidesSliderLayer.removeChild(sidesSliderLayer.findChild('endRatio')!);
        sidesSliderLayer.findChild('ratioLine')!.set('name', 'sidesLine');
        sidesSliderLayer.findChild('sidesLine')!.set('x2', -250/3);
        sidesSliderLayer.findChild('startRatio')!.set('name', 'sides-count');
        sidesSliderLayer.findChild('sides-count')!.set('centerX', -250/3);
        sidesSliderLayer.findChild('sides-count')!.set('color', Colors.Lime);

        sidesSliderLayer.findChild('sides-count')!.onDrag = (sprite, _, position) => {
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = (250 + posX) / 500 * 9;
            const sides = Math.max(3, Math.min(12, Math.round(posX + 3)));
            posX = -250 + (sides - 3) / 9 * 500;
            sprite.set('centerX', posX);
            polygon.set('sides', sides);
            sidesSliderLayer.findChild('sidesLine')!.set('corner2', {x: posX, y: 0});
        }

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
        <p>
            Note that <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> are hidden properties, but <strong>not</strong> hidden calculated properties. The <em>bounds</em> are calculated from the center, not the other way around.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc/Stage'
import { Ellipse, Line, Polygon, NullSprite } from 'sharc/Sprites'
import { Colors } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const polygon = new Polygon({
    \tcenter: {x: 0, y: 0},
    \tsides: 6,
    \tradius: 100,
    \trotation: 30,
    \tcolor: Colors.White,
    \tstroke: {lineWidth: 5},
});

const handle = new Ellipse({
    \tbounds: Ellipse.Bounds(0, 0, 12),
    \tcolor: Colors.Red,
    \tstroke: {lineWidth: 3},
}).setOnDrag((sprite, _, position) => {
    \tconst radiusHandlePos = radiusHandle.get('center');
    \tconst deltaX = position.x - sprite.get('centerX')
    \tconst deltaY = position.y - sprite.get('centerY');
    \tsprite.set('center', position);
    \tpolygon.set('center', position);
    \tradiusHandle.set('center', {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY});
});

const radiusHandle = new Ellipse({
    \tbounds: Ellipse.Bounds(0, 100, 12),
    \tcolor: Colors.Blue,
    \tstroke: {lineWidth: 3}
}).setOnDrag((sprite, _, position) => {
    \tconst center = polygon.get('center');
    \tconst radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
    \tpolygon.set('radius', radius || 0.1);
    \tsprite.set('center', position);
    \tpolygon.set('rotation', Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI);
});

stage.root.addChildren(polygon, handle, radiusHandle);

const sliderLayer = new NullSprite({position: {x: 0, y: -167.5}});

sliderLayer.addChildren(new Line({
    \tbounds: Line.Bounds(-250, 0, 250, 0),
    \tcolor: Colors.LightGrey,
    \tlineWidth: 5,
    \tlineCap: 'round'
}), new Line({
    \tbounds: Line.Bounds(-250, 0, 250, 0),
    \tcolor: Colors.White,
    \tlineWidth: 5,
    \tname: 'ratioLine',
}), new Ellipse({
    \tbounds: Ellipse.Bounds(-250, 0, 12),
    \tcolor: Colors.GoldenRod,
    \tstroke: {lineWidth: 3},
    \tname: 'startRatio',
}), new Ellipse({
    \tbounds: Ellipse.Bounds(250, 0, 12),
    \tcolor: Colors.Gold,
    \tstroke: {lineWidth: 3},
    \tname: 'endRatio',
}));

stage.root.addChildren(sliderLayer);

function updateSlider() {
    \tconst sliderLine = sliderLayer.findChild('ratioLine') as Line;
    \tsliderLine.set('corner1', sliderLayer.findChild('startRatio')!.get('center'));
    \tsliderLine.set('corner2', sliderLayer.findChild('endRatio')!.get('center'));
    \tlet startRatio = sliderLayer.findChild('startRatio')!.get('centerX') as number;
    \tlet endRatio = sliderLayer.findChild('endRatio')!.get('centerX') as number;
    \tstartRatio = (startRatio + 250) / 500;
    \tendRatio = (endRatio + 250) / 500;
    \tpolygon.set('start', startRatio);
    \tpolygon.set('end', endRatio);
}

sliderLayer.findChild('startRatio')!.onDrag = (sprite, _, position) => {
    \tlet posX = Math.max(-250, Math.min(250, position.x));
    \tposX = Math.round(posX);
    \tsprite.set('centerX', posX);
    \tupdateSlider();
}

sliderLayer.findChild('endRatio')!.onDrag = (sprite, _, position) => {
    \tlet posX = Math.max(-250, Math.min(250, position.x));
    \tposX = Math.round(posX);
    \tsprite.set('centerX', posX);
    \tupdateSlider();
}

const sidesSliderLayer = new NullSprite({position: {x: 0, y: 167.5}});

sidesSliderLayer.addChildren(...sliderLayer.children.map(sprite => sprite.copy()));

sidesSliderLayer.removeChild(sidesSliderLayer.findChild('endRatio')!);
sidesSliderLayer.findChild('ratioLine')!.set('name', 'sidesLine');
sidesSliderLayer.findChild('sidesLine')!.set('x2', -250/3);
sidesSliderLayer.findChild('startRatio')!.set('name', 'sides-count');
sidesSliderLayer.findChild('sides-count')!.set('centerX', -250/3);
sidesSliderLayer.findChild('sides-count')!.set('color', Colors.Lime);

sidesSliderLayer.findChild('sides-count')!.onDrag = (sprite, _, position) => {
    \tlet posX = Math.max(-250, Math.min(250, position.x));
    \tposX = (250 + posX) / 500 * 9;
    \tconst sides = Math.max(3, Math.min(12, Math.round(posX + 3)));
    \tposX = -250 + (sides - 3) / 9 * 500;
    \tsprite.set('centerX', posX);
    \tpolygon.set('sides', sides);
    \tsidesSliderLayer.findChild('sidesLine')!.set('corner2', {x: posX, y: 0});
}

stage.root.addChild(sidesSliderLayer);

stage.loop();`} />
        <h3>PolygonProperties</h3>
        <p style={{lineHeight: '2em'}}>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['color?', 'scale?', 'rotation?', 'alpha?', 'effects?', 'name?', 'details?'].map((prop, idx) => {
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
            <CodeBlurb blurb={['sides: ', 'number']} /> - the number of sides of the polygon. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['center: ', 'PositionType']} /> - the center of the polygon. Aggregate Property for <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['radius: ', 'number']} /> - the radius of the polygon. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', 'CanvasFillRule']} /> - the fill rule of the polygon. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['start?: ', 'number']} /> - the ratio of the polygon's length at which the polygon begins. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['end?: ', 'number']} /> - the ratio of the polygon's length at which the polygon ends. Defaults to 1. Normal Property.
        </p>
    </>
}