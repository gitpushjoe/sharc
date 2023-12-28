import { useRef, useEffect } from "react";
import { TextSprite } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors, Easing } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function TextPage() {
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

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
    property: 'color', from: null, to: () => {return {
        red: Math.random() * 100 + 155,
        green: Math.random() * 100 + 155,
        blue: Math.random() * 100 + 155,
        alpha: 1
    }}, 
    duration: 120, 
    easing: Easing.EASE_IN_OUT
}, {loop: true});

stage.root.addChild(text);

stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);
    return <>
        <h1>Text</h1>
        <p>
            Draws text. When a TextSprite is drawn to a canvas with a centered root node, its scale is automatically flipped on the y-axis. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the text, which can cause unexpected behavior.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc/Stage'
import { TextSprite } from 'sharc/Sprites'
import { Colors, Easing } from 'sharc/Utils'

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

        <h3>TextProperties</h3>
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
            <CodeBlurb blurb={['text?: ', 'string']} /> - the text to be drawn. Defaults to <InlineCode>""</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['position?: ', 'PositionType']} /> - the position of the text. See <InlineCode>positionIsCenter</InlineCode> below. Defaults to <InlineCode>{'{x: 0, y: 0}'}</InlineCode>. Aggregate Property for <InlineCode>positionX</InlineCode> and <InlineCode>positionY</InlineCode>. 
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['positionIsCenter?: ', 'boolean']} /> - If <InlineCode>true</InlineCode>, <InlineCode>position</InlineCode> will be the center of the text. If <InlineCode>false</InlineCode>, <InlineCode>position</InlineCode> will be the bottom-left corner of the text. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['font?: ', 'string']} /> - the font family of the text. <a href='https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font'>Uses CSS.</a> Defaults to <InlineCode>"sans-serif"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fontSize?: ', 'number']} /> - the font size of the text. Defaults to <InlineCode>16</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['bold?: ', 'boolean']} /> - whether the text is bold. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['italic?: ', 'boolean']} /> - whether the text is italic. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['textAlign?: ', '"center"|' + '"end"|' + '"left"|' + '"right"|' + '"start"']} /> - the text alignment of the text. Defaults to <InlineCode>"start"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['textBaseline?: ', '"alphabetic"|' + '"bottom"|' + '"hanging"|' + '"ideographic"|' + '"middle"|' + '"top"']} /> - the text baseline of the text. Defaults to <InlineCode>"alphabetic"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['textDirection?: ', '"ltr"|' + '"rtl"|' + '"inherit"']} /> - the text direction of the text. Defaults to <InlineCode>"ltr"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['maxWidth?: ', 'number|null|undefined']} /> - the maximum width of the text. Defaults to <InlineCode>null</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
        </p>

        <h5>HiddenTextProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <CodeBlurb blurb={['positionX: ', 'number']} /> - the x-coordinate of the text position. Normal hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['positionY: ', 'number']} /> - the y-coordinate of the text position. Normal hidden Property.
        </p>

    </>
}