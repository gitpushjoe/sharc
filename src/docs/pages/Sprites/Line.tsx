import { useRef, useEffect } from "react";
import { Line, Ellipse } from "sharc-js/Sprites";
import { Stage } from "sharc-js/Stage";
import { Colors } from "sharc-js/Utils";
import CodeBlurb from "../../components/Code/Blurb";
import CodeHeader from "../../components/Code/Header";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function LinePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const line = new Line({
            bounds: Line.Bounds(-100, -100, 100, 100),
            color: Colors.White,
            lineWidth: 10,
        });

        stage.root.addChild(line);

        const properties = ['corner1', 'corner2'] as const;
        const colors = [Colors.Red, Colors.Blue];

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = line[property];
            const handle = new Ellipse({
                center: position,
                radius: 12,
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.on('drag', function (_event, position) {
                this.center = position;
                line[property] = position;
            });
            stage.root.addChild(handle);
        }

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Line</h1>
        <p>
            Draws a line from <InlineCode>(x1, y1)</InlineCode> to <InlineCode>(x2, y2)</InlineCode> based on the sprites' <Hyperlink>bounds</Hyperlink>.
        </p>
        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc-js/Stage'
import { Line, Ellipse } from 'sharc-js/Sprites'
import { Colors } from 'sharc-js/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);
const root = stage.root;

const line = new Line({
    \tbounds: Line.Bounds(-100, -100, 100, 100),
    \tcolor: Colors.White,
    \tlineWidth: 10,
});

root.addChild(line);

const properties = ['corner1', 'corner2'] as const;
const colors = [Colors.Red, Colors.Blue];

for (const idx in properties) {
    \tconst property = properties[idx];
    \tconst color = colors[idx];
    \tconst position = line[property];
    \tconst handle = new Ellipse({
        \t\tcenter: position,
        \t\tradius: 12,
        \t\tcolor: color,
        \t\tstroke: {lineWidth: 3},
        \t});
    \thandle.on('drag', function (_event, position) {
        \t\tthis.center = position;
        \t\tline[property] = position;
        \t});
    \troot.addChild(handle);
}

stage.loop();` } />
        <br />
        <h3>LineProperties</h3>
        <p>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['bounds?', 'color?', 'scale?', 'rotation?', 'alpha?', 'blur?', 'gradient?', 'effects?', 'name?', 'enabled?', 'channelCount?', 'details?'].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={[prop]} />{' '}
                    </>
                })
            }
        </p>
        <p>
            <CodeBlurb blurb={['lineWidth?: ', 'number']} /> - the width of the line. Defaults to 1. Normal Property.
            <br />
            <br />
            <CodeBlurb blurb={['lineCap?: ', '"butt"|"round"|"square"']} /> - the style of the line's end caps. Defaults to <InlineCode>"butt"</InlineCode>. Normal Property.
            <br />
            <br />
            <CodeBlurb blurb={['lineDash?: ', 'number']} /> - the length of the line's dashes. Defaults to 0. Normal Property.
            <br />
            <br />
            <CodeBlurb blurb={['lineDashGap?: ', 'number']} /> - the length of the line's gaps. Defaults to <InlineCode>lineDash ?? 0</InlineCode>. Normal Property.
            <br />
            <br />
            <CodeBlurb blurb={['lineDashOffset?: ', 'number']} /> - the offset of the line's dashes. Defaults to 0. Normal Property.
        </p>
        <br />
        <br />
        <CodeHeader header="Line.Bounds(x1: number, y1: number, x2: number, y2: number) -> BoundsType" />
        <p>
            Helper function. Returns a{' '}
            <Hyperlink to='types/common/boundstype'>BoundsType</Hyperlink>
            {' object with the given values. '}
        </p>
    </>
}