import { MutableRefObject, useEffect, useRef } from "react";
import CodeBlock from "../components/Code/Block";
import CodeShowcase from "../components/Code/Showcase";
import { Hyperlink } from "../components/Sidebar/Hyperlink";
import { Stage } from '../../sharc/Stage';
import { BezierCurve, Ellipse, Line, Rect, Star } from '../../sharc/Sprites';
import { useParams } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Colors, Corners } from "../../sharc/Utils";

export function GettingStarted() {
    return <>
        <h1>
            What is sharc?
        </h1>
        <p>
            <br />
            <strong>sharc</strong>, short for <strong>Sh</strong>apes and <strong>A</strong>nimations <strong>R</strong>endered on a <strong>C</strong>anvas, is a library for drawing raster graphics and animations to an HTML canvas.{' '}
            The library is written completely in Typescript, and is designed to be both easy to use and very powerful.{' '}
            Here are some of the features of sharc:
            <br />
            <br />
            <ul>
                <li> Declarative, object-oriented API, so you create <Hyperlink>Sprite</Hyperlink> objects and push them to the canvas. </li>
                <li> A <Hyperlink>Stage</Hyperlink> class that manages the animation loop and pointer events for you. </li>
                <li> Shape nesting, which lets you move and scale shapes relative to their parent. </li>
                <li> Graphics primitives likes lines, rounded rectangles, bezier curves, text, and more. </li>
                <li> A robust, declarative <Hyperlink>animation</Hyperlink> system. </li>
                <li> Zero dependencies. </li>
                <li> Typescript support! </li>
            </ul>
        </p>

        <br />
        <h1>Installation</h1>
        <h3>NPM</h3>
        <p>
            This is the simplest way to install sharc. Just run this command in your terminal:
        </p>
        <CodeBlock code={
            `$ npm install sharc-js`
        }/>
        <p>
            This works for both Javascript and Typescript projects.
        </p>

        <br />
        <h3>Github</h3>
        <p>
            You can also download the source code from Github. Just clone the repository into the project. <em>(Typescript only)</em>
        </p>
        <CodeBlock code={
            `$ git clone https://github.com/gitpushjoe/sharc.git
            $ cd sharc
            $ git sparse-checkout set --no-cone sharc
            $ git checkout`
        }/>

        <br />
        <h3>Manual Download</h3>
        <p>
            Alternatively, you can download the dist and src files using the Download link in the nav bar.
        </p>


    </>;
}

export function GS_Overview() {
    const canvasRef1 = useRef<HTMLCanvasElement>();
    const canvasRef2 = useRef<HTMLCanvasElement>();
    const canvasRef3 = useRef<HTMLCanvasElement>();
    const creatingASStage = useRef<any>();
    const params = useParams();

    useEffect(() => {
        switch (params.section) {
            case 'creating-a-stage':
                creatingASStage.current.scrollIntoView();
                break;
        }
    }, [params]);

    useEffect(() => {
        const [canvas1, canvas2, canvas3] = [canvasRef1.current, canvasRef2.current, canvasRef3.current];
        if (!canvas1 || !canvas2) return;
        const stage1 = new Stage(canvas1, 'classic', {red: 0, green: 0, blue: 255, alpha: 1});
        const stage2 = new Stage(canvas2, 'classic', Colors.LightSlateGray);

        const ellipse1 = new Ellipse({
            bounds: Ellipse.Bounds(100, 100, 50),
            color: Colors.Aqua,
        });

        const ellipse2 = new Ellipse({
            bounds: Ellipse.Bounds(400, 200, 75),
            color: Colors.Lime,
        });

        stage2.root.addChildren(ellipse1, ellipse2);
        
        stage1.loop(1);
        stage2.loop(1);

        const ctx = canvas3!.getContext('2d');
        ellipse1.draw(ctx!);
        ellipse2.draw(ctx!);

        return () => {
            stage1.stop();
            stage2.stop();
        }
    }, [canvasRef1, canvasRef2]);

    return <>
        <div>
            <h1>First Steps</h1>
            <p>
                {'sharc (currently) supports ten different graphics objects, called sprites, which store various properties like rotation, color, scale, etc. There are two main ways to draw sprites to a canvas. ' + 
                'Let\'s go over the first method:'}
            </p>
            <h2 ref={creatingASStage}>Creating a Stage (Recommended)</h2>
            <p>{'So the first step is to append a canvas element to the DOM. This can be done with HTML:'}</p>
            <CodeBlock code={
            `<!DOCTYPE html>
            <html lang="en">
            \t<head>
            \t\t...
            \t</head>
            \t<body>
            \t\t<h1>Canvas: </h1>
            \t\t<canvas id="canvas" width="600" height="400"></canvas>
            \t</div>
            </html>`}/>

            <p>or with Javascript:</p>
            <CodeBlock code={
            `const canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            canvas.width = 600;
            canvas.height = 400;
            document.body.appendChild(canvas);`}/>

            <br />
            <p>{'Now, that we have a canvas, we can create a stage. More details on how the Stage works can be found '}  
            <Hyperlink to='stage'>here</Hyperlink>
            {', but basically a Stage is a container for sprites that automatically handles the animation loop, with a few other features. The first argument to the Stage constructor is the canvas we just created.' + 
            'The second argument is the rootStyle, which you can read more about '}
            <Hyperlink to='stage/usage/root-style'>here</Hyperlink>
            {'. The third argument is the background color, which accepts a '}
            <Hyperlink to='types/common/colortype'>ColorType</Hyperlink>
            {'. Let\'s make the background blue to check if our stage works.'}</p>
            <CodeShowcase canvasRef={canvasRef1} code={
            `import { Stage } from 'sharc/Stage';

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'classic', {red: 0, green: 0, blue: 255, alpha: 1});

            stage.loop();`}/>

            <br />
            <p>{'Okay, now let\'s draw two circles. Each Stage has a "root", which functions as an empty sprite. In order to draw sprites to the canvas, you have to append the sprites to the root as '}
            <Hyperlink to='sprites/parenting'>children</Hyperlink>
            {'. And while we\'re at it, we\'ll import '}
            <Hyperlink to='utils/default/colors'>Colors</Hyperlink>
            {', which stores all of the CSS colors as ColorTypes.'}</p>
            <CodeShowcase canvasRef={canvasRef2} code={
            `import { Stage } from 'sharc/Stage';
            import { Ellipse } from 'sharc/Sprites';
            import { Colors } from 'sharc/Utils';

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'classic', Colors.LightSlateGray);
            const root = stage.root;

            const ellipse1 = new Ellipse({
            \tbounds: Ellipse.Bounds(100, 100, 50),
            \tcolor: Colors.Aqua,
            });

            const ellipse2 = new Ellipse({
            \tbounds: Ellipse.Bounds(400, 200, 75),
            \tcolor: Colors.Lime,
            });

            root.addChildren(ellipse1, ellipse2);
            stage.loop();
            `}/>

            <br/>
            <h2>Manual Drawing</h2>
            <p>{'Alternatively, you could also draw the sprites directly to the canvas without using a root. Every sprite has a draw() function that takes a CanvasRenderingContext2D object as its first argument. ' + 
            'This is what the Stage class calls to draw the sprites each frame.'}</p>
            <CodeShowcase canvasRef={canvasRef3} code={
            `import { Ellipse } from 'sharc/Sprites';
            import { Colors } from 'sharc/Utils';

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');

            const ellipse1 = new Ellipse({
            \tbounds: Ellipse.Bounds(100, 100, 50),
            \tcolor: Colors.Aqua,
            });

            const ellipse2 = new Ellipse({
            \tbounds: Ellipse.Bounds(400, 200, 75),
            \tcolor: Colors.Lime,
            });

            ellipse1.draw(ctx);
            ellipse2.draw(ctx);
            `}/>
        </div>
    </>;
}

export function GS_Terminology() {

    const canvasRef1 = useRef<HTMLCanvasElement>();
    const params = useParams() as {category: string, subcategory: string, section: string};

    useEffect(() => {
        const element = document.getElementById(params.section!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    useEffect(() => {
        const canvas = canvasRef1.current;
        if (!canvas) return;
        const stage = new Stage(canvas, 'classic', Colors.LightSlateGray);

        const line = new Line({
            bounds: Line.Bounds(50, 50, 175, 150),
            color: Colors.Aqua,
            lineWidth: 5,
            lineCap: 'round',
        });

        const boundsStyle = {
            color: Colors.Transparent,
            stroke: {color: Colors.White, lineWidth: 5, lineDash: 5},
        }

        const lineBounds = new Rect({
            bounds: line.get('bounds'), 
            ...boundsStyle,
        });

        const rect = new Rect({
            bounds: Rect.Bounds(250, 50, 150, 100),
            color: Colors.Aqua,
        });

        const rectBounds = new Rect({
            bounds: rect.get('bounds'), 
            ...boundsStyle,
        });

        const ellipse = new Ellipse({
            bounds: Ellipse.Bounds(525, 225, 50, 100),
            color: Colors.Aqua,
        });

        const ellipseBounds = new Rect({
            bounds: ellipse.get('bounds'),
            ...boundsStyle,
        });

        const star = new Star({
            center: {x: 112.5, y: 275},
            radius: 67.5,
            color: Colors.Aqua,
        });

        const curve = new BezierCurve({
            start: {x: 250, y: 212.5},
            points: [
                {control1: {x: 300, y: 250}, control2: {x: 267.5, y: 325}, end: {x: 375, y: 380}},
                {control1: {x: 350, y: 280}, control2: {x: 225, y: 290}, end: {x: 400, y: 300}},
            ],
            color: Colors.Transparent,
            stroke: {color: Colors.Aqua, lineWidth: 5},
        });

        const curveBounds = new Rect({
            bounds: Corners(
                curve.get('x1'),
                curve.get('y1'),
                curve.get('x2'),
                curve.get('y2'),
            ),
            ...boundsStyle,
        });

        const starBounds = new Rect({
            bounds: star.get('bounds'),
            ...boundsStyle,
        });

        stage.root.addChildren(line, lineBounds, rect, rectBounds, ellipse, ellipseBounds, star, starBounds, curve, curveBounds);
        stage.loop(1);

        return () => {
            stage.stop();
        }
    }, [canvasRef1]);
    return <>
        <h1>Terminology</h1>

        <br />
        <h2>aggregate property</h2>
        <p>See <Hyperlink>Sprites/Properties</Hyperlink>.
        </p>

        <br />
        <h2>animation</h2>
        <p>See <Hyperlink>Animation</Hyperlink> and <Hyperlink>Types/Animation/AnimationType</Hyperlink>.
        </p>

        <br />
        <h2>animation package</h2>
        <p>An object containing:
            <ul>
                <li> An array of animations stored in an animation channel. </li>
                <li> Animation params. </li>
            </ul>
            <Hyperlink to='animation/channels'>Animation channels</Hyperlink> use animation packages to store and manage the animations you pass to them.
            <br />
            See <Hyperlink>Types/Animation/AnimationPackage</Hyperlink>.
        </p>

        <br />
        <h2>animation params</h2>
        <p>See <Hyperlink>Types/Animation/AnimationParams</Hyperlink>.
        </p>

        <br/>
        <h3 id="bounds">bounds</h3>
        <p>{'Bounds refers to the rectangular bounding box around a shape, usually represented with a '}
        <LinkContainer to='/docs/types/common/bounds'><a>BoundsType</a></LinkContainer>
        {' object. The rotation and scale of a sprite is always relative to the center of a shape, so the shape\'s bounds are used to determine its center. For example, '}
        <LinkContainer to='/docs/sprites/line'><a>Line, </a></LinkContainer>
        <LinkContainer to='/docs/sprites/rect'><a>Rect, </a></LinkContainer>
        <LinkContainer to='/docs/sprites/ellipse'><a>Ellipse, </a></LinkContainer>{'and '}
        <LinkContainer to='/docs/sprites/image'><a>Image</a></LinkContainer> 
        {' require a BoundsType object in their constructor. For the other sprites, the bounds are calculated right before the sprite is drawn. ' + 
        'In order to modify the bounds of a sprite, you can set the bounds like this:  '}
        <div className='code-block' style={{margin: '1em 0'}}>
            <code style={{color: 'darkgreen', padding: '0em', fontWeight: 600}}>
                {`mySprite.set('bounds', {x1: 0, y1: 0, x2: 100, y2: 100});`}
            </code>
        </div>
        {' or set each property individually: '}
        <div className='code-block' style={{margin: '1em 0'}}>
            <code style={{color: 'darkgreen', padding: '0em', fontWeight: 600}}>
                mySprite.set('x1', 0); <br/>
                mySprite.set('y1', 0); <br/>
                mySprite.set('x2', 100); <br/>
                mySprite.set('y2', 100); <br/>
            </code>
        </div>
        {'This demo visualizes the bounds of some sprites using a dotted line:'}
        </p>
        <CodeShowcase canvasRef={canvasRef1} code={
`import { Stage } from 'sharc/Stage';
import { Line, Rect, Ellipse, BezierCurve, Star } from 'sharc/Sprites';
import { Colors, Corners } from './sharc/Utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'classic', Colors.LightSlateGray);

const line = new Line({
    \tbounds: Line.Bounds(50, 50, 175, 150),
    \tcolor: Colors.Aqua,
    \tlineWidth: 5,
    \tlineCap: 'round',
});

const boundsStyle = {
    \tcolor: Colors.Transparent,
    \tstroke: {color: Colors.White, lineWidth: 5, lineDash: 5},
}

const lineBounds = new Rect({
    \tbounds: line.get('bounds'), 
    \t...boundsStyle,
});

const rect = new Rect({
    \tbounds: Rect.Bounds(250, 50, 150, 100),
    \tcolor: Colors.Aqua,
});

const rectBounds = new Rect({
    \tbounds: rect.get('bounds'), 
    \t...boundsStyle,
});

const ellipse = new Ellipse({
    \tbounds: Ellipse.Bounds(525, 225, 50, 100),
    \tcolor: Colors.Aqua,
});

const ellipseBounds = new Rect({
    \tbounds: ellipse.get('bounds'),
    \t...boundsStyle,
});

const star = new Star({
    \tcenter: {x: 112.5, y: 275},
    \tradius: 67.5,
    \tcolor: Colors.Aqua,
});

const curve = new BezierCurve({
    \tstart: {x: 250, y: 212.5},
    \tcurves: [
        \t\t{control1: {x: 300, y: 250}, control2: {x: 267.5, y: 325}, end: {x: 375, y: 380}},
        \t\t{control1: {x: 350, y: 280}, control2: {x: 225, y: 290}, end: {x: 400, y: 300}},
        \t],
    \tcolor: Colors.Transparent,
    \tstroke: {color: Colors.Aqua, lineWidth: 5},
});

const curveBounds = new Rect({
\tbounds: Corners(
\t\tcurve.get('x1'),
\t\tcurve.get('y1'),
\t\tcurve.get('x2'),
\t\tcurve.get('y2'),
\t),
\t...boundsStyle,
});

const starBounds = new Rect({
\tbounds: star.get('bounds'),
\t...boundsStyle,
});

stage.root.addChildren(line, lineBounds, rect, rectBounds, ellipse, ellipseBounds, star, starBounds, curve, curveBounds);
stage.loop();`}/>

        <br />
        <h2>calculated property</h2>
        <p>See <Hyperlink>Sprites/Properties</Hyperlink>.
        </p>

        <br />
        <h2 id="canvas-unit">canvas unit</h2>
        <p>{'The width and the height of the canvas is measured in canvas units. So, if the canvas was initialized with its width set to 500, then the right of the canvas '}
        {'would be 500 canvas units from the left. However, because of CSS scaling and the device pixel ratio, the canvas might not actually be 500 pixels wide. '}
        {'The canvas unit is used to measure the bounds of sprites, and the position of the mouse when handling user input.'}
        </p>

        <br />
        <h2>channel</h2>
        <p>A queue of animation packages. See <Hyperlink>Channels</Hyperlink>.
        </p>

        <br />
        <h2>descendant</h2>
        <p>The children of a sprite, the children of those children, and so on. See <Hyperlink>Sprites/Parenting</Hyperlink>.
        </p>

        <br />
        <h2>hidden property</h2>
        <p>See <Hyperlink>Sprites/Properties</Hyperlink>.
        </p>

        <br />
        <h2>normal property</h2>
        <p>See <Hyperlink>Sprites/Properties</Hyperlink>.
        </p>

        <br />
        <h2>property</h2>
        <p>{'Any aspect of a sprite that can be modified is called a property. This includes things like color, rotation, strokeColor, radius, details, alpha, center, etc. '}
        {'See '} <Hyperlink>Sprites</Hyperlink>.
        </p>

        <br/>
        <h2>sprite</h2>
        <p>See 
        <LinkContainer to='/docs/sprites'><a> Sprites.</a></LinkContainer>
        </p>

        <br/>
        <h2>stage</h2>
        <p>See
        <LinkContainer to='/docs/stage'><a> Stage.</a></LinkContainer>
        </p>
    </>;
}