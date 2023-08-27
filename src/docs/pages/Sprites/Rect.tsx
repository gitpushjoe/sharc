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
            scale: {x: 1, y: -1},
            positionIsCenter: true,
            fontSize: 30,
        });

        stage.root.addChildren(rect, text);

        const properties = ['corner1', 'corner2'];
        const colors = [Colors.Red, Colors.Blue];

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = rect.get(property as 'corner1');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                rect.set(property as 'corner1', position);
            }
            stage.root.addChild(handle);
        }

        stage.onScroll = (_, event) => {
            const radius = rect.get('radius') as number[];
            const newRadius = radius[0] + event.deltaY / 30;
            rect.set('radius', [Math.max(0, Math.min(500, newRadius))]);
        };

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
                \tscale: {x: 1, y: -1},
                \tpositionIsCenter: true,
                \tfontSize: 30,
            });

            stage.root.addChildren(rect, text);

            const properties = ['corner1', 'corner2'];
            const colors = [Colors.Red, Colors.Blue];
            
            for (const idx in properties) {
                \tconst property = properties[idx];
                \tconst color = colors[idx];
                \tconst position = rect.get(property as 'corner1');
                \tconst handle = new Ellipse({
                    \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
                    \t\tcolor: color,
                    \t\tstroke: {lineWidth: 3},
                    \t});
                \thandle.onDrag = (sprite, _, position) => {
                    \t\tsprite.set('center', position);
                    \t\trect.set(property as 'corner1', position);
                    \t}
                \tstage.root.addChild(handle);
            }

            stage.onScroll = (_, event) => {
                \tconst radius = rect.get('radius') as number[];
                \tconst newRadius = radius[0] + event.deltaY / 30;
                \trect.set('radius', [Math.max(0, Math.min(500, newRadius))]);
            };

            stage.loop();`} />
        <br />
        <h3>RectProperties</h3>
        <p style={{lineHeight: '2em'}}>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['bounds?', 'color?', 'scale?', 'rotation?', 'alpha?', 'effects?', 'name?', 'details?'].map((prop, idx) => {
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
            <CodeBlurb blurb={['startAngle?: ', 'number']} /> - the angle at which the ellipse's path begins in degrees. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['endAngle?: ', 'number']} /> - the angle at which the ellipse's path ends in degrees. Defaults to 360. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
                <CodeBlurb blurb={['radius?: ', 'RadiusType']} /> - the radii length of the rectangle's corners.{' '}
                <Hyperlink to='types/sprites/radiustype'>RadiusType.</Hyperlink> Defaults to [0]. Normal Property.
        </p>
        <br />
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