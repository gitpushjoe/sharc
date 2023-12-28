import { useRef, useEffect } from "react";
import { Star, NullSprite } from "sharc-js/Sprites";
import { Stage } from "sharc-js/Stage";
import { Colors, Easing } from "sharc-js/Utils";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function NullSpritePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

const star = new Star({
    center: {x: 0, y: 75},
    radius: 30,
    color: Colors.White,
    stroke: {lineWidth: 5},
});

const nullsprite = new NullSprite({});

nullsprite.addChild(star);
stage.root.addChild(nullsprite);

stage.on('move', function (_, position) {
    nullsprite.position = position;
});

nullsprite.channels[0].push({
    property: 'rotation', from: 0, to: 360, duration: 120
}, {loop: true});

stage.loop();

return () => {
    stage.stop();
}
    }, [canvasRef]);

    return <>
        <h1>NullSprite</h1>
        <p>
            An empty sprite that draws nothing to the canvas. NullSprites can be used in conjunction with the various <Hyperlink to='sprites/parenting'>parenting</Hyperlink> functions in order to group sprites together.{' '}
            NullSprites have 0 width and 0 height. However, when it is their turn to be rendered, they still apply their <InlineCode>position</InlineCode>, <InlineCode>scale</InlineCode>, <InlineCode>rotation</InlineCode>, <InlineCode>alpha</InlineCode>, <InlineCode>blur</InlineCode> and <InlineCode>effects</InlineCode> properties to the canvas.{' '}
            NullSprites, then, are useful for applying transformations to groups of sprites, like an adjustment layer in Photoshop. Examples of NullSprites can be found all throughout this documentation, but a simple example is shown below.{' '}
            In order to make the sprite rotate around the mouse, we can create a NullSprite that is always positioned on the mouse, and then add the sprite to the NullSprite's children. Then, we can rotate the NullSprite, and the sprite will rotate around the mouse.
        </p>
        <CodeShowcase code={
`import { Stage } from 'sharc/Stage'
import { NullSprite, Star } from 'sharc/Sprites'
import { Colors, Easing } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const star = new Star({
	center: {x: 0, y: 75},
	radius: 30,
	color: Colors.White,
	stroke: {lineWidth: 5},
});

const nullsprite = new NullSprite({});

nullsprite.addChild(star);
stage.root.addChild(nullsprite);

stage.on('move', function (_, position) {
	nullsprite.position = position;
});

nullsprite.channels[0].push({
	property: 'rotation', from: 0, to: 360, duration: 120
}, {loop: true});

stage.loop();`} canvasRef={canvasRef} />
        
        <h3>NullSpriteProperties</h3>
        <p style={{lineHeight: '2em'}}>
            
            <div style={{'width': '1em', 'height': '.5em'}}></div>
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
            <CodeBlurb blurb={['position?: ', 'PositionType']} /> - the position of the NullSprite. Remember, NullSprites have 0 width and 0 height. Defaults to <InlineCode>{'{x: 0, y: 0}'}</InlineCode>. Aggregate Property for <InlineCode>positionX</InlineCode> and <InlineCode>positionY</InlineCode>.
        </p>

        <h5>HiddenNullSpriteProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <CodeBlurb blurb={['positionX: ', 'number']} /> - the x-coordinate of the NullSprite's position. Normal hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['positionY: ', 'number']} /> - the y-coordinate of the NullSprite's position. Normal hidden Property.
        </p>
    </>
}