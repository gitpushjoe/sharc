import { useRef, useEffect } from "react";
import { Ellipse, NullSprite, Line } from "sharc-js/Sprites";
import { Stage } from "sharc-js/Stage";
import { Colors } from "sharc-js/Utils";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function EllipsePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const ellipse = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 100),
            color: Colors.White,
            stroke: {
                lineWidth: 5,
                lineJoin: 'round',
            }
        });

        const properties = ['corner1', 'corner2'];
        const colors = [Colors.Red, Colors.Blue];

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = ellipse.get(property as 'corner1');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                ellipse.set(property as 'corner1', position);
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
            name: 'angleLine',
        }), new Ellipse({
            bounds: Ellipse.Bounds(-250, 0, 12),
            color: Colors.GoldenRod,
            stroke: {lineWidth: 3},
            name: 'startAngle',
        }), new Ellipse({
            bounds: Ellipse.Bounds(250, 0, 12),
            color: Colors.Gold,
            stroke: {lineWidth: 3},
            name: 'endAngle',
        }));

        stage.root.addChildren(ellipse, sliderLayer);
        

        function updateSlider() {
            const sliderLine = sliderLayer.findChild('angleLine') as Line;
            sliderLine.set('corner1', sliderLayer.findChild('startAngle')!.get('center'));
            sliderLine.set('corner2', sliderLayer.findChild('endAngle')!.get('center'));
            let startAngle = sliderLayer.findChild('startAngle')!.get('centerX') as number;
            let endAngle = sliderLayer.findChild('endAngle')!.get('centerX') as number;
            startAngle = (startAngle + 250) / 500 * 360;
            endAngle = (endAngle + 250) / 500 * 360;
            ellipse.set('startAngle', startAngle);
            ellipse.set('endAngle', endAngle);
        }

        sliderLayer.findChild('startAngle')!.onDrag = (sprite, _, position) => {
            const endAngle = sliderLayer.findChild('endAngle')!;
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = Math.round(posX);
            posX = Math.min(posX, endAngle.get('centerX') - 24);
            sprite.set('centerX', posX);
            updateSlider();
        }

        sliderLayer.findChild('endAngle')!.onDrag = (sprite, _, position) => {
            const startAngle = sliderLayer.findChild('startAngle')!;
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = Math.round(posX);
            posX = Math.max(posX, startAngle.get('centerX') + 24);
            sprite.set('centerX', posX);
            updateSlider();
        }

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Ellipse</h1>
        <p>
            Draws an ellipse based on the sprites' <Hyperlink>bounds</Hyperlink>. It can also be used to draw arcs.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc/Stage'
import { Ellipse, Line, NullSprite } from 'sharc/Sprites'
import { Colors } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const ellipse = new Ellipse({
    \tbounds: Ellipse.Bounds(0, 0, 100),
    \tcolor: Colors.White,
    \tstroke: {
        \t\tlineWidth: 5,
        \t\tlineJoin: 'round',
        \t}
});

const properties = ['corner1', 'corner2'];
const colors = [Colors.Red, Colors.Blue];

for (const idx in properties) {
    \tconst property = properties[idx];
    \tconst color = colors[idx];
    \tconst position = ellipse.get(property as 'corner1');
    \tconst handle = new Ellipse({
        \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
        \t\tcolor: color,
        \t\tstroke: {lineWidth: 3},
    \t});
    \thandle.onDrag = (sprite, _, position) => {
        \t\tsprite.set('center', position);
        \t\tellipse.set(property as 'corner1', position);
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
    \tname: 'angleLine',
}), new Ellipse({
    \tbounds: Ellipse.Bounds(-250, 0, 12),
    \tcolor: Colors.GoldenRod,
    \tstroke: {lineWidth: 3},
    \tname: 'startAngle',
}), new Ellipse({
    \tbounds: Ellipse.Bounds(250, 0, 12),
    \tcolor: Colors.Gold,
    \tstroke: {lineWidth: 3},
    \tname: 'endAngle',
}));

stage.root.addChildren(ellipse, sliderLayer);

function updateSlider() {
    \tconst sliderLine = sliderLayer.findChild('angleLine') as Line;
    \tsliderLine.set('corner1', sliderLayer.findChild('startAngle')!.get('center'));
    \tsliderLine.set('corner2', sliderLayer.findChild('endAngle')!.get('center'));
    \tlet startAngle = sliderLayer.findChild('startAngle')!.get('centerX') as number;
    \tlet endAngle = sliderLayer.findChild('endAngle')!.get('centerX') as number;
    \tstartAngle = (startAngle + 250) / 500 * 360;
    \tendAngle = (endAngle + 250) / 500 * 360;
    \tellipse.set('startAngle', startAngle);
    \tellipse.set('endAngle', endAngle);
}

sliderLayer.findChild('startAngle')!.onDrag = (sprite, _, position) => {
    \tconst endAngle = sliderLayer.findChild('endAngle')!;
    \tlet posX = Math.max(-250, Math.min(250, position.x));
    \tposX = Math.round(posX);
    \tposX = Math.min(posX, endAngle.get('centerX') - 24);
    \tsprite.set('centerX', posX);
    \tupdateSlider();
}

sliderLayer.findChild('endAngle')!.onDrag = (sprite, _, position) => {
    \tconst startAngle = sliderLayer.findChild('startAngle')!;
    \tlet posX = Math.max(-250, Math.min(250, position.x));
    \tposX = Math.round(posX);
    \tposX = Math.max(posX, startAngle.get('centerX') + 24);
    \tsprite.set('centerX', posX);
    \tupdateSlider();
}

stage.loop();`} />

        <h3>EllipseProperties</h3>
        <p style={{lineHeight: '2em'}}>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['bounds', 'color', 'scale', 'rotation', 'alpha', 'effects', 'name', 'details'].map((prop, idx) => {
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
        </p>

        <h5>HiddenEllipseProperties</h5>
        <p>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['radius: ', 'number']} /> - the mean of the ellipse's x-axis and y-axis radii. Setting <InlineCode>radius</InlineCode> will set both radii to the same value. Calculated hidden property.
            <br />
            <br />
            <CodeBlurb blurb={['radiusX: ', 'number']} /> - the radius of the ellipse's x-axis. Calculated hidden property.
            <br />
            <br />
            <CodeBlurb blurb={['radiusY: ', 'number']} /> - the radius of the ellipse's y-axis. Calculated hidden property.
        </p>

    </>
}