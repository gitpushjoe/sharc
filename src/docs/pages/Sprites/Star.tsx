import { useRef, useEffect } from "react";
import { Star, Ellipse, NullSprite, Line } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function StarPage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const star = new Star({
            center: {x: 0, y: 0},
            radius: 100,
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
            star.set('center', position);
            radiusHandle.set('center', {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY});
        });

        const radiusHandle = new Ellipse({
            bounds: Ellipse.Bounds(0, 100, 12),
            color: Colors.Blue,
            stroke: {lineWidth: 3},
            name: 'radiusHandle'
        }).setOnDrag((sprite, _, position) => {
            const center = star.get('center');
            const radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
            star.set('radius', radius || 0.1);
            sprite.set('center', position);
            star.set('rotation', (Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI) - 12);
            sprite.children[0].set('rotation', star.get('rotation') - 90 + 12);
        }).addChild(new NullSprite({position: {x: 0, y: 0}})
        .addChild(new Ellipse({
            bounds: Ellipse.Bounds(0, -100 * (3 - Math.sqrt(5)) / 2, 12),
            color: Colors.Green,
            stroke: {lineWidth: 3}
        })));
        
        radiusHandle.children[0].children[0]!.onDrag = (sprite, _, position) => {
            const center = star.get('center');
            const innerRadius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
            // console.log(innerRadius)
            star.set('innerRadius', innerRadius || 0.1);
            sprite.set('centerY', position.y);
        }
        
        stage.root.addChildren(star, handle, radiusHandle);
        
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
            star.set('start', startRatio);
            star.set('end', endRatio);
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
        <h1>Star</h1>
        <p>
            Draws a five-pointed star. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the star, which can cause unexpected behavior.
        </p>

        <CodeShowcase code={
`import { Stage } from 'sharc/Stage'
import { Ellipse, Line, Star, NullSprite } from 'sharc/Sprites'
import { Colors } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const star = new Star({
    \tcenter: {x: 0, y: 0},
    \tradius: 100,
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
    \tstar.set('center', position);
    \tradiusHandle.set('center', {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY});
});

const radiusHandle = new Ellipse({
    \tbounds: Ellipse.Bounds(0, 100, 12),
    \tcolor: Colors.Blue,
    \tstroke: {lineWidth: 3},
    \tname: 'radiusHandle'
}).setOnDrag((sprite, _, position) => {
    \tconst center = star.get('center');
    \tconst radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
    \tstar.set('radius', radius || 0.1);
    \tsprite.set('center', position);
    \tstar.set('rotation', (Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI) - 12);
    \tsprite.children[0].set('rotation', star.get('rotation') - 90 + 12);
}).addChild(new NullSprite({position: {x: 0, y: 0}})
\t.addChild(new Ellipse({
    \t\tbounds: Ellipse.Bounds(0, -100 * (3 - Math.sqrt(5)) / 2, 12),
    \t\tcolor: Colors.Green,
    \t\tstroke: {lineWidth: 3}
\t})));

radiusHandle.children[0].children[0]!.onDrag = (sprite, _, position) => {
    \tconst center = star.get('center');
    \tconst innerRadius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
    \tstar.set('innerRadius', innerRadius || 0.1);
    \tsprite.set('centerY', position.y);
}

stage.root.addChildren(star, handle, radiusHandle);

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
    \tstar.set('start', startRatio);
    \tstar.set('end', endRatio);
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

stage.loop();`} canvasRef={canvasRef} />

        <h3>StarProperties</h3>
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
            <CodeBlurb blurb={['center: ', 'PositionType']} /> - the center of the star. Aggregate Property for <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['radius: ', 'number']} /> - the radius of the star. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['innerRadius?: ', 'number']} /> - the inner radius of the star. Defaults to <InlineCode>((3 - sqrt(5)) / 2) * radius</InlineCode>.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', 'CanvasFillRule']} /> - the fill rule of the polygon. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['start?: ', 'number']} /> - the ratio of the polygon's length at which the polygon begins. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['end?: ', 'number']} /> - the ratio of the polygon's length at which the polygon ends. Defaults to 1. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', 'CanvasFillRule']} /> - the fill rule of the polygon. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['start?: ', 'number']} /> - the ratio of the polygon's length at which the polygon begins. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['end?: ', 'number']} /> - the ratio of the polygon's length at which the polygon ends. Defaults to 1. Normal Property.
        </p>
    </>
}