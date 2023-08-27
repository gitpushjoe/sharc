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
                lineJoin: 'round',
            }
        });

        stage.root.addChild(curve);
        const properties = ['start', 'control1-0', 'control2-0', 'end-0', 'control1-1', 'control2-1', 'end-1'];
        const colors = [Colors.Red, Colors.OrangeRed, Colors.Orange, Colors.Yellow, Colors.GreenYellow, Colors.Green, Colors.Blue];

        for (const idx of [0, 1, 2, 3]) {
            stage.root.addChild(new Line({
                bounds: Line.Bounds(0, 0, 0,0),
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
            const position = curve.get(property as 'start');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                curve.set(property as 'start', position);
            }
            stage.root.addChild(handle);
        }
        
        
        stage.beforeDraw = () => {
            const line0 = stage.root.findChild('line0') as Line;
            const line1 = stage.root.findChild('line1') as Line;
            const line2 = stage.root.findChild('line2') as Line;
            const line3 = stage.root.findChild('line3') as Line;

            line0.set('corner1', curve.get('start'));
            line0.set('corner2', curve.get('control1-0'));
            line1.set('corner1', curve.get('control2-0'));
            line1.set('corner2', curve.get('end-0'));
            line2.set('corner1', curve.get('end-0'));
            line2.set('corner2', curve.get('control1-1'));
            line3.set('corner1', curve.get('control2-1'));
            line3.set('corner2', curve.get('end-1'));
        }


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
`import { Stage } from 'sharc/Stage'
import { BezierCurve, Ellipse, Line } from 'sharc/Sprites'
import { Colors } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const curve = new BezierCurve({
    \tstart: {x: -100, y: -100},
    \tpoints: [
        \t\t{
            \t\t\tcontrol1: {x: -100, y: 50},
            \t\t\tcontrol2: {x: -25, y: -100},
            \t\t\tend: {x: 100, y: -100},
        \t\t},
        \t\t{
            \t\t\tcontrol1: {x: 100, y: 50},
            \t\t\tcontrol2: {x: -50, y: 100},
            \t\t\tend: {x: 100, y: 100},
        \t\t}
    \t],
    \tcolor: Colors.White,
    \tstroke: {
        \t\tlineWidth: 5,
        \t\tlineJoin: 'round',
        \t}
});

stage.root.addChild(curve);

const properties = ['start', 'control1-0', 'control2-0', 'end-0', 'control1-1', 'control2-1', 'end-1'];
const colors = [Colors.Red, Colors.OrangeRed, Colors.Orange, Colors.Yellow, Colors.GreenYellow, Colors.Green, Colors.Blue];

for (const idx of [0, 1, 2, 3]) {
    \tstage.root.addChild(new Line({
        \t\tbounds: Line.Bounds(0, 0, 0,0),
        \t\tcolor: {red: 0, green: 0, blue: 0, alpha: 0.75},
        \t\tlineDash: 12,
        \t\tlineDashGap: 12,
        \t\tlineWidth: 5,
        \t\tname: \`line\${idx}\`,
    \t}))
}

for (const idx in properties) {
    \tconst property = properties[idx];
    \tconst color = colors[idx];
    \tconst position = curve.get(property as 'start');
    \tconst handle = new Ellipse({
        \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
        \t\tcolor: color,
        \t\tstroke: {lineWidth: 3},
    \t});
    \thandle.onDrag = (sprite, _, position) => {
        \t\tsprite.set('center', position);
        \t\tcurve.set(property as 'start', position);
    \t}
    \tstage.root.addChild(handle);
}

stage.beforeDraw = () => {
    \tconst line0 = stage.root.findChild('line0') as Line;
    \tconst line1 = stage.root.findChild('line1') as Line;
    \tconst line2 = stage.root.findChild('line2') as Line;
    \tconst line3 = stage.root.findChild('line3') as Line;
    \tline0.set('corner1', curve.get('start'));
    \tline0.set('corner2', curve.get('control1-0'));
    \tline1.set('corner1', curve.get('control2-0'));
    \tline1.set('corner2', curve.get('end-0'));
    \tline2.set('corner1', curve.get('end-0'));
    \tline2.set('corner2', curve.get('control1-1'));
    \tline3.set('corner1', curve.get('control2-1'));
    \tline3.set('corner2', curve.get('end-1'));
}

stage.loop();`} />

        <h3>BezierCurveProperties</h3>
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
            <CodeBlurb blurb={['start: ', 'PositionType']} /> - the starting point of the curve. Aggregate Property for <InlineCode>startX</InlineCode> and <InlineCode>startY</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['points: ', 'BezierPoint[]']} /> - an array of <Hyperlink to='types/sprite/BezierPoint'>BezierPoint</Hyperlink> objects. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['closePath?: ', 'boolean']} /> - whether or not the curve is closed. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', '"nonzero"|"evenodd"']} /> - the fill rule of the curve. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
        </p>

        <h5>HiddenBezierCurveProperties</h5>
        <p style={{lineHeight: '2em'}}>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['control1-N: ', 'PositionType']} /> - the first control point of the Nth curve on the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['control2-N: ', 'PositionType']} /> - the second control point of the Nth curve on the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['end-N: ', 'PositionType']} /> - the end point of the Nth curve on the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['curve-N: ', 'BezierPoint']} /> - the Nth curve on the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startX: ', 'number']} /> - the number of curves on the path. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startY: ', 'number']} /> - the number of curves on the path. Hidden property.
        </p>
    </>
}