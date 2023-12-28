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
            radius: 100,
            color: Colors.White,
            stroke: {
                lineWidth: 5,
                lineJoin: 'round',
            }
        });
        
        stage.root.addChildren(ellipse);
        const properties = ['corner1', 'corner2'] as const;
        const colors = [Colors.Red, Colors.Blue];

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = ellipse[property];
            const handle = new Ellipse({
                center: position,
                radius: 12,
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.on('drag', function (_event, position) {
                this.center = position;
                ellipse[property] = position;
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
            name: 'angleLine',
        }), new Ellipse({
            center: {x: -250, y: 0},
            radius: 12,
            color: Colors.GoldenRod,
            stroke: {lineWidth: 3},
            name: 'startAngle',
        }), new Ellipse({
            center: {x: 250, y: 0},
            radius: 12,
            color: Colors.Gold,
            stroke: {lineWidth: 3},
            name: 'endAngle',
        }));
        
        function updateSlider() {
            const sliderLine = sliderLayer.findChild('angleLine') as Line;
            sliderLine.corner1 = sliderLayer.findChild('startAngle')!.center;
            sliderLine.corner2 = sliderLayer.findChild('endAngle')!.center;
            let startAngle = sliderLayer.findChild('startAngle')!.centerX;
            let endAngle = sliderLayer.findChild('endAngle')!.centerX;
            startAngle = (startAngle + 250) / 500 * 360;
            endAngle = (endAngle + 250) / 500 * 360;
            ellipse.startAngle = startAngle;
            ellipse.endAngle = endAngle;
        }

        sliderLayer.findChild('startAngle')!.on('drag', function (_event, position) {
            const endAngle = sliderLayer.findChild('endAngle')!;
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = Math.round(posX);
            posX = Math.min(posX, endAngle.centerX - 24);
            this.centerX = posX;
            updateSlider();
        });

        sliderLayer.findChild('endAngle')!.on('drag', function (_event, position) {
            const startAngle = sliderLayer.findChild('startAngle')!;
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = Math.round(posX);
            posX = Math.max(posX, startAngle.centerX + 24);
            this.centerX = posX;
            updateSlider();
        });

        stage.root.addChild(sliderLayer);

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Ellipse</h1>
        <p>
            Draws an ellipse. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc/Stage'
import { Ellipse, Line, NullSprite } from 'sharc/Sprites'
import { Colors } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const ellipse = new Ellipse({
    \tcolor: Colors.White,
    \tstroke: {
        \t\tlineWidth: 5,
        \t\tlineJoin: 'round',
    \t},
    \tradius: 100
});

stage.root.addChildren(ellipse);

const properties = ['corner1', 'corner2'] as const;
const colors = [Colors.Red, Colors.Blue];

for (const idx in properties) {
    \tconst property = properties[idx];
    \tconst color = colors[idx];
    \tconst position = ellipse[property];
    \tconst handle = new Ellipse({
        \t\tcenter: position,
        \t\tradius: 12,
        \t\tcolor: color,
        \t\tstroke: {lineWidth: 3},
    \t});
    \thandle.on('drag', function (_event, position) {
        \t\tthis.center = position;
        \t\tellipse[property] = position;
    \t});
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
    \tcenter: {x: -250, y: 0},
    \tradius: 12,
    \tcolor: Colors.GoldenRod,
    \tstroke: {lineWidth: 3},
    \tname: 'startAngle',
}), new Ellipse({
    \tcenter: {x: 250, y: 0},
    \tradius: 12,
    \tcolor: Colors.Gold,
    \tstroke: {lineWidth: 3},
    \tname: 'endAngle',
}));

function updateSlider() {
    \tconst sliderLine = sliderLayer.findChild('angleLine') as Line;
    \tsliderLine.corner1 = sliderLayer.findChild('startAngle')!.center;
    \tsliderLine.corner2 = sliderLayer.findChild('endAngle')!.center;
    \tlet startAngle = sliderLayer.findChild('startAngle')!.centerX;
    \tlet endAngle = sliderLayer.findChild('endAngle')!.centerX;
    \tstartAngle = (startAngle + 250) / 500 * 360;
    \tendAngle = (endAngle + 250) / 500 * 360;
    \tellipse.startAngle = startAngle;
    \tellipse.endAngle = endAngle;
}

sliderLayer.findChild('startAngle')!.on('drag', function (_event, position) {
    \tconst endAngle = sliderLayer.findChild('endAngle')!;
    \tlet posX = Math.max(-250, Math.min(250, position.x));
    \tposX = Math.round(posX);
    \tposX = Math.min(posX, endAngle.centerX - 24);
    \tthis.centerX = posX;
    \tupdateSlider();
});

sliderLayer.findChild('endAngle')!.on('drag', function (_event, position) {
    \tconst startAngle = sliderLayer.findChild('startAngle')!;
    \tlet posX = Math.max(-250, Math.min(250, position.x));
    \tposX = Math.round(posX);
    \tposX = Math.max(posX, startAngle.centerX + 24);
    \tthis.centerX = posX;
    \tupdateSlider();
});

stage.root.addChild(sliderLayer);

stage.loop();`} />

        <h3>Ellipse.Bounds</h3>
        <p>
            Returns the bounds of an ellipse based on its center and radius.
        </p>

        <h3>EllipseProperties</h3>
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
            <CodeBlurb blurb={['center?: ', 'BoundsType']} /> - the center of the ellipse. Defaults to <InlineCode>{'{x: 0, y: 0}'}</InlineCode>. Aggregate Property for <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode>.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['radius?: ','number|[number, number]']} /> - the radius of the ellipse. (If two numbers are provided, the first is the radius of the x-axis and the second is the radius of the y-axis.) Defaults to <InlineCode>[5, 5]</InlineCode>. Aggregate Property for <InlineCode>radiusX</InlineCode> and <InlineCode>radiusY</InlineCode>.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startAngle?: ', 'number']} /> - the angle at which the ellipse's path begins in degrees. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['endAngle?: ', 'number']} /> - the angle at which the ellipse's path ends in degrees. Defaults to 360. Normal Property.
        </p>
        <br />
        <h5>HiddenEllipseProperties</h5>
        <p>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['radiusX: ', 'number']} /> - the radius of the ellipse's x-axis. Normal hidden property.
            <br />
            <br />
            <CodeBlurb blurb={['radiusY: ', 'number']} /> - the radius of the ellipse's y-axis. Normal hidden property.
        </p>

    </>
}
