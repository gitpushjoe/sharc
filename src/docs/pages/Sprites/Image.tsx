import { useRef, useEffect } from "react";
import { ImageSprite, Ellipse } from "sharc-js/Sprites";
import { Stage } from "sharc-js/Stage";
import { Colors } from "sharc-js/Utils";
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
        const property = (['corner1', 'corner2'] as const)[idx];
        const color = [Colors.Red, Colors.Blue][idx];

        const demoPosition = image[property];
        stage.root.addChild(new Ellipse({
            center: demoPosition,
            radius: 12,
            color: color,
            stroke: {lineWidth: 3},
        }).on('drag', function (_event, position) {
            this.center = position;
            image[property] = position;
        }));

        const sourceProperty = (['srcCorner1', 'srcCorner2'] as const)[idx];
        const sourceColor = sourceImage[property];
        stage.root.addChild(new Ellipse({
            center: sourceColor,
            radius: 12,
            color: color,
            stroke: {lineWidth: 3},
        }).on('drag', function (_event, position) {
            if (sourceImage.x1 - 10 <= position.x && 
            position.x <= sourceImage.x2 + 10 && 
            sourceImage.y1 - 10 <= position.y && 
            position.y <= sourceImage.y2 + 10) {
                this.center = position;
                sourceImageSelected[property] = position;
                sourceImageSelected[sourceProperty] = {
                    x: (position.x - sourceImage.x1) * 5,
                    y: (sourceImage.height - (position.y - sourceImage.y1)) * 5
                };
                image[sourceProperty] = ({
                    x: (position.x - sourceImage.x1) * 5,
                    y: (sourceImage.height - (position.y - sourceImage.y1)) * 5
                });
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
		const property = (['corner1', 'corner2'] as const)[idx];
		const color = [Colors.Red, Colors.Blue][idx];

		const demoPosition = image[property];
		stage.root.addChild(new Ellipse({
			center: demoPosition,
			radius: 12,
			color: color,
			stroke: {lineWidth: 3},
		}).on('drag', function (_event, position) {
			this.center = position;
			image[property] = position;
		}));

		const sourceProperty = (['srcCorner1', 'srcCorner2'] as const)[idx];
		const sourceColor = sourceImage[property];
		stage.root.addChild(new Ellipse({
			center: sourceColor,
			radius: 12,
			color: color,
			stroke: {lineWidth: 3},
		}).on('drag', function (_event, position) {
			if (sourceImage.x1 - 10 <= position.x &&
			position.x <= sourceImage.x2 + 10 &&
			sourceImage.y1 - 10 <= position.y &&
			position.y <= sourceImage.y2 + 10) {
				this.center = position;
				sourceImageSelected[property] = position;
				sourceImageSelected[sourceProperty] = {
					x: (position.x - sourceImage.x1) * 5,
					y: (sourceImage.height - (position.y - sourceImage.y1)) * 5
				};
				image[sourceProperty] = ({
					x: (position.x - sourceImage.x1) * 5,
					y: (sourceImage.height - (position.y - sourceImage.y1)) * 5
				});
			}
		}));
	}
}

stage.loop();`} />

        <h3>ImageProperties</h3>
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
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['image: ', 'HTMLImageElement']} /> - the image to be drawn. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['srcBounds?: ', 'BoundsType']} /> - the bounds of the source image to draw from. Defaults to <InlineCode>{`{x1: 0, y1: 0, x2: image.width, y2: image.height}`}</InlineCode>. Aggregate Property for <InlineCode>srcX1</InlineCode>, <InlineCode>srcY1</InlineCode>, <InlineCode>srcX2</InlineCode> and <InlineCode>srcY2</InlineCode>. Normal Property.
        </p>

        <h5>HiddenImageProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <CodeBlurb blurb={['useSrcBounds: ','boolean']} /> - whether to use <InlineCode>srcBounds</InlineCode> or to draw the image in its entirety. Defaults to <InlineCode>true</InlineCode> if <InlineCode>srcBounds</InlineCode> is defined, <InlineCode>false</InlineCode> otherwise. Normal hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['srcCorner1: ', 'PositionType']} /> - Aggregate Property for <InlineCode>srcX1</InlineCode> and <InlineCode>srcY1</InlineCode>. Normal hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['srcCorner2: ', 'PositionType']} /> - Aggregate Property for <InlineCode>srcX2</InlineCode> and <InlineCode>srcY2</InlineCode>. Normal hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            {
                [['srcX1: ', 'number'], ['srcY1: ', 'number'], ['srcX2: ', 'number'], ['srcY2: ', 'number']].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={prop} /> - Normal hidden Property.
                        <div style={{'width': '1em', 'height': '.5em'}}></div>
                    </>
                })
            }
        </p>
    </>
}