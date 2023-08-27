import { useRef, useEffect } from "react";
import { useParams } from "react-router";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Line, Rect } from "sharc-js/Sprites";
import { Stage } from "sharc-js/Stage";
import { Colors } from "sharc-js/Utils";

export function Usage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const canvasRef3 = useRef<HTMLCanvasElement>(null);
    const params = useParams();

    useEffect(() => {
        const element = document.getElementById(params.section!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const sprite = new Line({
            bounds: {x1: -200, y1: -100, x2: 250, y2: 100},
            color: {red: 255, green: 0, blue: 0, alpha: 1},
            lineWidth: 10,
        }, 2);

        stage.root.addChild(sprite);
        
        stage.loop(1);

        const stage2 = new Stage(canvasRef2.current!, 'centered', Colors.LightSlateGray);

        const myRect = new Rect({
            bounds: {x1: -100, y1: -100, x2: 100, y2: 100},
            color: {red: 255, green: 75, blue: 255, alpha: 0.8},
            rotation: 20,
            name: 'myRect',
            alpha: 0.8,
        });

        console.assert(JSON.stringify(myRect.get('color')) === '{"red":255,"green":75,"blue":255,"alpha":0.8}');
        console.assert(JSON.stringify(myRect.get('scale')) === '{"x":1,"y":1}');
        console.assert(myRect.get('rotation') === 20);
        console.assert(myRect.get('alpha') === 0.8);
        console.assert(myRect.get('green') === 75);
        console.assert(myRect.get('centerX') === 0);
        console.assert(myRect.get('name') === 'myRect');

        stage2.root.addChildren(myRect);

        stage2.loop(1);

        const stage3 = new Stage(canvasRef3.current!, 'centered', Colors.LightSlateGray);

        const myRect2 = new Rect({
            bounds: {x1: 0, y1: 0, x2: 0, y2: 0}
        });

        myRect2.set('color', {red: 255, green: 75, blue: 255, alpha: 0.8});
        myRect2.set('bounds', {x1: -100, y1: -100, x2: 100, y2: 100});
        myRect2.set('name', 'myRect');
        try {
            myRect2.set('rotation', '', true) // will throw an error
        } catch (e) {
            myRect2.set('rotation', 20);
        }

        stage3.root.addChildren(myRect2);

        stage3.loop(1);

        return () => {
            stage.stop();
            stage2.stop();
            stage3.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Usage</h1>
        <br />
        <p>
            Here is an example of how you can create a Sprite:
        </p>
        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc-js/Stage';
import { Line } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const mySprite = new Line({
    \tbounds: {x1: -200, y1: -100, x2: 250, y2: 100},
    \tcolor: {red: 255, green: 0, blue: 0, alpha: 1},
    \tlineWidth: 10,
}, 2);

stage.root.addChild(mySprite);

stage.loop();`} />

        <br />
        <h3 id='properties'>Properties</h3>
        <p>
            {'Every sprite property can be accessed via '}
            <CodeBlurb blurb={['mySprite.get(property, raiseError = true)']}></CodeBlurb>
            {'. '}
            <InlineCode>raiseError</InlineCode>
            {' is a boolean that defaults to true. If it is true, then an error will be thrown if the property does not exist.'}
        </p>
        <CodeShowcase canvasRef={canvasRef2} code={
`import { Stage } from 'sharc-js/Stage';
import { Rect } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const myRect = new Rect({
    \tbounds: {x1: -100, y1: -100, x2: 100, y2: 100},
    \tcolor: {red: 255, green: 75, blue: 255, alpha: 0.8},
    \trotation: 20,
    \tname: 'myRect',
    \talpha: 0.8,
});

console.assert( JSON.stringify(myRect.get('color')) === '{"red":255,"green":75,"blue":255,"alpha":0.8}' );
console.assert( JSON.stringify(myRect.get('scale')) === '{"x":1,"y":1}' );
console.assert( myRect.get('rotation') === 20 );
console.assert( myRect.get('alpha') === 0.8 );
console.assert( myRect.get('green') === 75 );
console.assert( myRect.get('centerX') === 0 );
console.assert( myRect.get('name') === 'myRect' );

stage.root.addChildren(myRect);

stage.loop();`} />
            <p>
                {'You can also set properties via '}
                <CodeBlurb blurb={['mySprite.set(property, value, raiseError = true) -> boolean']}></CodeBlurb>
                {'. '}
                <InlineCode>raiseError</InlineCode>
                {' is a boolean that defaults to true. If it is true, then an error will be thrown if the property does not exist.'}
                {' This function will return true if the property was successfully set, and false if '}
                <InlineCode>raiseError</InlineCode>
                {' is false and the property could not be set.'}
            </p>
            <CodeShowcase canvasRef={canvasRef3} code={
`import { Stage } from 'sharc-js/Stage';
import { Rect } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const myRect = new Rect({
    \tbounds: {x1: 0, y1: 0, x2: 0, y2: 0} // necessary
});

myRect.set('color', {red: 255, green: 75, blue: 255, alpha: 0.8});
myRect.set('bounds', {x1: -100, y1: -100, x2: 100, y2: 100});
myRect.set('name', 'myRect');
try {
    \tmyRect.set('rotation', '', true); // will throw an error
} catch (e) {
    \tmyRect.set('rotation', 20);
}

stage.root.addChildren(myRect);

stage.loop(); `} />
    </>
}