import { useRef, useEffect } from "react";
import { TextSprite, LabelSprite } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors, Easing } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb.js";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase.js";
import { Hyperlink } from "../../components/Sidebar/Hyperlink.js";
import { Shrink, Grow } from "sharc-js/AnimationUtils.js";

export function LabelPage() {
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

const label = new LabelSprite<number>({
    text: 'Click me!',
    fontSize: 70,
    positionIsCenter: true,
    bold: true,
    color: Colors.White,
    backgroundColor: Colors.Blue,
    padding: 15,
    details: 0,
    stroke: { lineWidth: 5 },
});

label.on('release', function () {
    this.details!++;
    label.channels[0].enqueue([
        Shrink(1.1, 5, 0, Easing.EASE_OUT),
        Grow(1.1, 5, 0, Easing.EASE_IN),
    ], 1);
    label.text = `${this.details!} clicks!`;
});

stage.root.addChild(label);

stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);
    return <>
        <h1>Label</h1>
        <p>
            Draws text with a background. When a LabelSprite is drawn to a canvas with a centered root node, its scale is automatically flipped on the y-axis. If you're using a centered-style root node, you will have to set the text's <InlineCode>scaleY</InlineCode> value to a negative number for the text to display correctly. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the text, which can cause unexpected behavior.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc/Stage'
import { TextSprite } from 'sharc/Sprites'
import { Colors, Easing } from 'sharc/Utils'
import { Shrink, Grow } from 'sharc/AnimationUtils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const text = new TextSprite({
	text: 'Hello, World!',
	fontSize: 80,
	positionIsCenter: true,
	bold: true,
	color: Colors.White,
	effects: (ctx) => {
		ctx.shadowColor = 'black';
		ctx.shadowBlur = 15;
	}
});

text.channels[0].push({
	property: 'color', 
	from: null, 
	to: () => { return {
		red: Math.random() * 100 + 155,
		green: Math.random() * 100 + 155,
		blue: Math.random() * 100 + 155,
		alpha: 1
	}},
	duration: 120,
	easing: Easing.EASE_IN_OUT
}, {loop: true});

stage.root.addChild(text);

stage.loop();`} />

        <h3>LabelProperties

        </h3>
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
            <br />
            Inherited from <Hyperlink to='sprites/text'>TextProperties:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['text?', 'position?', 'positionIsCenter?', 'font?', 'fontSize?', 'bold?', 'italic?', 'textAlign?', 'textBaseline?', 'textDirection?', 'maxWidth?'].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={[prop]} />{' '}
                    </>
                })
            }
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['padding?: ', 'string']} /> - the inner padding of the label. Defaults to 10. Normal property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['backgroundColor?: ', 'ColorType']} /> - the background color of the label. Defaults to <InlineCode children='{red: 0, green: 0, blue: 0, alpha: 0}' />. Aggregate property{' '}
                                                                        for <InlineCode>backgroundRed</InlineCode>, <InlineCode>backgroundGreen</InlineCode>, <InlineCode>backgroundBlue</InlineCode> and <InlineCode>backgroundAlpha</InlineCode>.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['textStroke?: ', 'StrokeType|null']} /> - the stroke color of the text. Defaults to <InlineCode children='null' />.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['backgroundRadius?: ', 'RadiusType']} /> - the radius of the background corners. Defaults to <InlineCode children='[0]' />. Normal property.
        </p>

        <h5>HiddenTextProperties</h5>
        
        <p style={{lineHeight: '2em'}}>
        Inherited from <Hyperlink to='sprites/text'>TextProperties:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['positionX', 'positionY'].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={[prop]} />{' '}
                    </>
                })
            }
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['backgroundRed: ', 'number']} />
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['backgroundGreen: ', 'number']} />
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['backgroundBlue: ', 'number']} />
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['backgroundAlpha: ', 'number']} />
        </p>

    </>
}