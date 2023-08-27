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

        const properties = ['point-0', 'point-1', 'point-2', 'point-3'];
        const colors = [Colors.Red, Colors.Yellow, Colors.Purple, Colors.Blue];

        stage.root.addChildren(path);
        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = path.get(property as 'corner1');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                path.set(property as 'corner1', position);
            }
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
            path.set('start', startRatio);
            path.set('end', endRatio);
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

        stage.loop();
        
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
    \tpath: [
        \t\t{x: -100, y: -100},
        \t\t{x: -50, y: 50},
        \t\t{x: 50, y: -50},
        \t\t{x: 100, y: 100},
    \t],
    \tcolor: Colors.White,
    \tstroke: {lineWidth: 5},
    \tclosePath: false,
});

const properties = ['point-0', 'point-1', 'point-2', 'point-3'];
const colors = [Colors.Red, Colors.Yellow, Colors.Purple, Colors.Blue];

stage.root.addChildren(path);

for (const idx in properties) {
    \tconst property = properties[idx];
    \tconst color = colors[idx];
    \tconst position = path.get(property as 'corner1');
    \tconst handle = new Ellipse({
        \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
        \t\tcolor: color,
        \t\tstroke: {lineWidth: 3},
    \t});
    \thandle.onDrag = (sprite, _, position) => {
        \t\tsprite.set('center', position);
        \t\tpath.set(property as 'corner1', position);
    \t}
    \tstage.root.addChild(handle);
}

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
    \tpath.set('start', startRatio);
    \tpath.set('end', endRatio);
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

stage.loop();`} />

        <h3>PathProperties</h3>
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
            <CodeBlurb blurb={['path: ', 'PositionType[]']} /> - an array of <Hyperlink to='types/common/positiontype'>PositionType</Hyperlink> objects that represent the points of the path. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['closePath?: ', 'boolean']} /> - whether or not the path is closed. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', '"nonzero"|"evenodd"']} /> - the fill rule of the path. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['start: ','number']} /> - the ratio of the path's length at which the path begins. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['end: ','number']} /> - the ratio of the path's length at which the path ends. Defaults to 1. Normal Property.
        </p>

        <h5>HiddenPathProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['point-N: ', 'PositionType']} /> - the Nth point of the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>  
            <CodeBlurb blurb={['x-N: ', 'number']} /> - the x-coordinate of the Nth point of the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['y-N: ', 'number']} /> - the y-coordinate of the Nth point of the path. Zero-indexed. Hidden property.
        </p>
    </>
}