import { useRef, useEffect } from "react";
import { ImageSprite, Ellipse } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function ImagePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const demoImg = new Image();
        demoImg.src = 'https://i.imgur.com/mXuQAt2.png';
        
        demoImg.onload = () => {
            const image = new ImageSprite({
                image: demoImg,
                bounds: ImageSprite.Bounds(-demoImg.width / 8, -demoImg.height / 8, demoImg.width / 4, demoImg.height / 4),
                srcBounds: ImageSprite.Bounds(0, demoImg.height, demoImg.width, -demoImg.height),
                scale: {x: 1, y: -1},
            }); 
    
            const sourceImage = new ImageSprite({
                image: demoImg,
                bounds: ImageSprite.Bounds(-280, 120, demoImg.width / 5, demoImg.height / 5),
                scale: {x: 1, y: -1},
                alpha: 0.25,
            })
            
            const sourceImageSelected = new ImageSprite({
                image: demoImg,
                bounds: ImageSprite.Bounds(-280, 120, demoImg.width / 5, demoImg.height / 5),
                srcBounds: ImageSprite.Bounds(0, demoImg.height, demoImg.width, -demoImg.height),
                stroke: {
                    color: Colors.White, 
                    lineWidth: 5, 
                    lineDash: 10, 
                    lineCap: 'round'
                },
                scale: {x: 1, y: -1}
            });

            stage.root.addChildren(image, sourceImage, sourceImageSelected);
            
            for (const idx in Array.from({length: 2})) {
                const property = ['corner1', 'corner2'][idx];
                const color = [Colors.Red, Colors.Blue][idx];
    
                const demoPosition = image.get(property as 'corner1');
                stage.root.addChild(new Ellipse({
                    bounds: Ellipse.Bounds(demoPosition.x, demoPosition.y, 12),
                    color: color,
                    stroke: {lineWidth: 3},
                }).setOnDrag((sprite, _, position) => {
                    sprite.set('center', position);
                    image.set(property as 'corner1', position);
                }));
    
                const sourceProperty = ['srcCorner1', 'srcCorner2'][idx];
                const sourceColor = sourceImage.get(property as 'corner1');
                stage.root.addChild(new Ellipse({
                    bounds: Ellipse.Bounds(sourceColor.x, sourceColor.y, 12),
                    color: color,
                    stroke: {lineWidth: 3},
                }).setOnDrag((sprite, _, position) => {
                    if (sourceImage.get('x1') - 10 <= position.x && 
                    position.x <= sourceImage.get('x2') + 10 && 
                    sourceImage.get('y1') - 10 <= position.y && 
                    position.y <= sourceImage.get('y2') + 10) {
                        sprite.set('center', position);
                        sourceImageSelected.set(property as 'corner1', position);
                        sourceImageSelected.set(sourceProperty as 'srcCorner1', {
                            x: (position.x - sourceImage.get('x1')) * 5,
                            y: (sourceImage.get('height') - (position.y - sourceImage.get('y1'))) * 5
                        })
                        image.set(sourceProperty as 'srcCorner1', {
                            x: (position.x - sourceImage.get('x1')) * 5,
                            y: (sourceImage.get('height') - (position.y - sourceImage.get('y1'))) * 5
                        })
                    }
                }));
            }
        }
        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Image</h1>
        <p>
            Draws an image from the sprite's <InlineCode>bounds</InlineCode>. 
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc/Stage'
import { ImageSprite, Ellipse } from 'sharc/Sprites'
import { Colors } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const demoImg = new Image();
demoImg.src = 'https://i.imgur.com/mXuQAt2.png';

demoImg.onload = () => {
    \tconst image = new ImageSprite({
        \t\timage: demoImg,
        \t\tbounds: ImageSprite.Bounds(-demoImg.width / 8, -demoImg.height / 8, demoImg.width / 4, demoImg.height / 4),
        \t\tsrcBounds: ImageSprite.Bounds(0, demoImg.height, demoImg.width, -demoImg.height),
        \t\tscale: {x: 1, y: -1},
    \t});

    \tconst sourceImage = new ImageSprite({
        \t\timage: demoImg,
        \t\tbounds: ImageSprite.Bounds(-280, 120, demoImg.width / 5, demoImg.height / 5),
        \t\tscale: {x: 1, y: -1},
        \t\talpha: 0.25,
    \t})

    \tconst sourceImageSelected = new ImageSprite({
        \t\timage: demoImg,
        \t\tbounds: ImageSprite.Bounds(-280, 120, demoImg.width / 5, demoImg.height / 5),
        \t\tsrcBounds: ImageSprite.Bounds(0, demoImg.height, demoImg.width, -demoImg.height),
        \t\tstroke: {
            \t\t\tcolor: Colors.White,
            \t\t\tlineWidth: 5,
            \t\t\tlineDash: 10,
            \t\t\tlineCap: 'round'
        \t\t},
        \t\tscale: {x: 1, y: -1}
    \t});

    \tstage.root.addChildren(image, sourceImage, sourceImageSelected);

    \tfor (const idx in Array.from({length: 2})) {
        \t\tconst property = ['corner1', 'corner2'][idx];
        \t\tconst color = [Colors.Red, Colors.Blue][idx];

        \t\tconst demoPosition = image.get(property as 'corner1');
        \t\tstage.root.addChild(new Ellipse({
            \t\t\tbounds: Ellipse.Bounds(demoPosition.x, demoPosition.y, 12),
            \t\t\tcolor: color,
            \t\t\tstroke: {lineWidth: 3},
        \t\t}).setOnDrag((sprite, _, position) => {
            \t\t\tsprite.set('center', position);
            \t\t\timage.set(property as 'corner1', position);
        \t\t}));

        \t\tconst sourceProperty = ['srcCorner1', 'srcCorner2'][idx];
        \t\tconst sourceColor = sourceImage.get(property as 'corner1');
        \t\tstage.root.addChild(new Ellipse({
            \t\t\tbounds: Ellipse.Bounds(sourceColor.x, sourceColor.y, 12),
            \t\t\tcolor: color,
            \t\t\tstroke: {lineWidth: 3},
        \t\t}).setOnDrag((sprite, _, position) => {
            \t\t\tif (sourceImage.get('x1') - 10 <= position.x &&
            \t\t\t\tposition.x <= sourceImage.get('x2') + 10 &&
            \t\t\t\tsourceImage.get('y1') - 10 <= position.y &&
            \t\t\t\tposition.y <= sourceImage.get('y2') + 10) {
                \t\t\t\tsprite.set('center', position);
                \t\t\t\tsourceImageSelected.set(property as 'corner1', position);
                \t\t\t\tsourceImageSelected.set(sourceProperty as 'srcCorner1', {
                    \t\t\t\t\tx: (position.x - sourceImage.get('x1')) * 5,
                    \t\t\t\t\ty: (sourceImage.get('height') - (position.y - sourceImage.get('y1'))) * 5
                \t\t\t\t})
                \t\t\t\timage.set(sourceProperty as 'srcCorner1', {
                    \t\t\t\t\tx: (position.x - sourceImage.get('x1')) * 5,
                    \t\t\t\t\ty: (sourceImage.get('height') - (position.y - sourceImage.get('y1'))) * 5
                \t\t\t\t})
            \t\t\t}
        \t\t}));
    \t\t}
\t}

stage.loop();
            `} />

        <h3>ImageProperties</h3>
        <p style={{lineHeight: '2em'}}>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['bounds', 'color?', 'scale?', 'rotation?', 'alpha?', 'effects?', 'name?', 'details?'].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={[prop]} />{' '}
                    </>
                })
            }
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['image: ', 'HTMLImageElement']} /> - the image to be drawn. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['srcBounds?: ', 'BoundsType']} /> - the bounds of the source image to draw from. Defaults to <InlineCode>{`{x1: 0, y1: 0, x2: image.width, y2: image.height}`}</InlineCode>. Aggregate Property for <InlineCode>srcX1</InlineCode>, <InlineCode>srcY1</InlineCode>, <InlineCode>srcX2</InlineCode> and <InlineCode>srcY2</InlineCode>. Normal Property.
        </p>

        <h5>HiddenImageProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <CodeBlurb blurb={['useSrcBounds: ','boolean']} /> - whether to use <InlineCode>srcBounds</InlineCode> or to draw the image in its entirety. Defaults to <InlineCode>true</InlineCode> if <InlineCode>srcBounds</InlineCode> is defined, <InlineCode>false</InlineCode> otherwise. Hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['srcCorner1: ', 'PositionType']} /> - Aggregate Property for <InlineCode>srcX1</InlineCode> and <InlineCode>srcY1</InlineCode>. Hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['srcCorner2: ', 'PositionType']} /> - Aggregate Property for <InlineCode>srcX2</InlineCode> and <InlineCode>srcY2</InlineCode>. Hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            {
                [['srcX1: ', 'number'], ['srcY1: ', 'number'], ['srcX2: ', 'number'], ['srcY2: ', 'number']].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={prop} /> - Hidden Property.
                        <div style={{'width': '1em', 'height': '.5em'}}></div>
                    </>
                })
            }
        </p>
    </>
}