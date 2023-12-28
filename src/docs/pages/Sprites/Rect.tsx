import { useRef, useEffect } from "react";
import { Rect, TextSprite, Ellipse } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb";
import CodeHeader from "../../components/Code/Header";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function RectPage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const rect = new Rect({
            bounds: Rect.Bounds(-100, -100, 200, 200),
            color: Colors.White,
            stroke: {
                lineWidth: 5,
                lineJoin: 'round',
            },
            radius: [20]
        });

        const text = new TextSprite({
            text: 'Scroll to change corner radius',
            color: Colors.White,
            position: {x: 0, y: -150},
            positionIsCenter: true,
            fontSize: 30,
        });

        stage.root.addChildren(rect, text);

        const properties = ['corner1', 'corner2'] as const;
        const colors = [Colors.Red, Colors.Blue];

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = rect[property];
            const handle = new Ellipse({
                center: position,
                radius: 12,
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.on('drag', function (_event, position) {
                this.center = position;
                rect[property] = position;
            });
            stage.root.addChild(handle);
        }

        stage.on('scroll', function (event) {
            const newRadius = rect.radius[0] + event.deltaY / 30;
            rect.radius = [Math.max(0, Math.min(500, newRadius))];
        });

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Rect</h1>
        <p>
            Draws a rectangle based on the sprites' <Hyperlink>bounds</Hyperlink>. 
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { Rect, Ellipse, TextSprite } from 'sharc/Sprites'
            import { Colors } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const rect = new Rect({
                \tbounds: Rect.Bounds(-100, -100, 200, 200),
                \tcolor: Colors.White,
                \tstroke: {
                    \t\tlineWidth: 5,
                    \t\tlineJoin: 'round',
                    \t},
                \tradius: [20]
            });

            const text = new TextSprite({
                \ttext: 'Scroll to change corner radius',
                \tcolor: Colors.White,
                \tposition: {x: 0, y: -150},
                \tpositionIsCenter: true,
                \tfontSize: 30,
            });

            stage.root.addChildren(rect, text);

            const properties = ['corner1', 'corner2'] as const;
            const colors = [Colors.Red, Colors.Blue];
            
            for (const idx in properties) {
                \tconst property = properties[idx];
                \tconst color = colors[idx];
                \tconst position = rect[property];
                \tconst handle = new Ellipse({
                    \t\tcenter: position,
                    \t\tradius: 12,
                    \t\tcolor: color,
                    \t\tstroke: {lineWidth: 3},
                    \t});
                \thandle.on('drag', function (_event, position) {
                    \t\tthis.center = position;
                    \t\trect[property] = position;
                    \t});
                \tstage.root.addChild(handle);
            }

            stage.on('scroll', function (event) {
                \tconst newRadius = rect.radius[0] + event.deltaY / 30;
                \trect.radius = [Math.max(0, Math.min(500, newRadius))];
            });

            stage.loop();`} />
        <br />
        <h3>RectProperties</h3>
        <p style={{lineHeight: '2em'}}>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['bounds?', 'color?', 'scale?', 'rotation?', 'alpha?', 'blur?', 'gradient?', 'effects?', 'name?', 'enabled?', 'channelCount?', 'details?'].map((prop, idx) => {
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
                <CodeBlurb blurb={['radius?: ', 'RadiusType']} /> - the radii length of the rectangle's corners.{' '}
                <Hyperlink to='types/sprites/radiustype'>RadiusType.</Hyperlink> Defaults to <InlineCode>[0]</InlineCode>. Normal Property.
        </p>
        <br />
        <CodeHeader header="Rect.Bounds(x: number, y: number, w: number, h: number) -> BoundsType" />
        <p>
            {'Helper function. Returns a '}
            <Hyperlink to='types/sprite/BoundsType'>BoundsType</Hyperlink>
            {' object with a corner at '}
            <InlineCode>(x, y)</InlineCode>
            {' and width '} <InlineCode>w</InlineCode> {' and height '} <InlineCode>h</InlineCode>.
        </p>
    </>
}
