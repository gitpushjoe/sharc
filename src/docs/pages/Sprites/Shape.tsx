import { useEffect, useRef } from "react";
import InlineCode from "../../components/Code/Inline";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";
import CodeShowcase from "../../components/Code/Showcase";
import { CenterBounds } from "sharc-js/Utils";
import { Stage } from "sharc-js/Stage";
import { Rect, Polygon, Star } from "sharc-js/Sprites";
import { Colors } from "sharc-js/Utils";
import { Shape } from "sharc-js/Sprites";

export function ShapePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const rect = new Rect({
            bounds: CenterBounds(-125, 75, 120),
            color: Colors.Blue,
            stroke: { lineWidth: 5 },
        });

        const pentagon = new Polygon({
            center: { x: 125, y: 75 },
            radius: 75,
            sides: 5,
            color: Colors.Red,
            stroke: { lineWidth: 5 },
        });

        const star = new Star({
            center: { x: 0, y: -75 },
            radius: 75,
            color: Colors.Green,
            stroke: { lineWidth: 5 },
        });

        const sprites: Shape[] = [rect, pentagon, star];
        
        const makeSpin = (sprite: Shape) => {
            sprite.channels[0].push({
                property: 'rotation',
                from: 0,
                to: -360,
                duration: 60 * 5
            }, { loop: true });
        }

        sprites.forEach(makeSpin);

        stage.root.addChildren(...sprites);
        stage.loop();

        return () => {
            stage.stop();
        }
        
    }, []);
    return <>
    <h1>The Base Shape Class</h1>
    <br />
    <p>
        All sprites derive from a base class called <InlineCode>Sprite</InlineCode>. However, avoid using the <InlineCode>Sprite</InlineCode> class to describe a sprite of{' '}
        unknown properties (such as making an array that can contain <InlineCode>Line</InlineCode>s, <InlineCode>Rect</InlineCode>s, etc.). Typescript will throw an error,{' '}
        claiming that the sprite is not assignable to type <InlineCode>Sprite</InlineCode>, even if the <InlineCode>DetailsType</InlineCode>, <InlineCode>Properties</InlineCode>{' '}
        and <InlineCode>HiddenProperties</InlineCode> generics are all set to <InlineCode>any</InlineCode>.{' '}
        <br />
        Instead use the <InlineCode>Shape</InlineCode> class (or <InlineCode>{'Shape<any, any, any>'}</InlineCode>, to be more specific).{' '}
        This is the type used by functions like <InlineCode>sprite.getChildren()</InlineCode> and <InlineCode>sprite.findChild()</InlineCode>.{' '}
        It is also the type of the <InlineCode>children</InlineCode> property of every sprite.{' '}
        All of the <Hyperlink>universal sprite properties</Hyperlink> will be available. For example, here is a demo where a <InlineCode>Shape[]</InlineCode> array is used to store{' '}
        a <InlineCode>Rect</InlineCode>, a <InlineCode>Polygon</InlineCode>, and a <InlineCode>Star</InlineCode>, and a <InlineCode>{'(sprite: Shape) => void'}</InlineCode>{' '}
        function is used to rotate each sprite:
    </p>
    <CodeShowcase canvasRef={canvasRef} code={
        `import { Stage } from 'sharc-js/Stage';
        import { Rect, Polygon, Star, Colors, Shape } from 'sharc-js/Sprites';
        import { CenterBounds, Colors } from 'sharc-js/Utils';

        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

        const rect = new Rect({
            \tbounds: CenterBounds(-125, 75, 120),
            \tcolor: Colors.Blue,
            \tstroke: { lineWidth: 5 },
        });

        const pentagon = new Polygon({
            \tcenter: { x: 125, y: 75 },
            \tradius: 75,
            \tsides: 5,
            \tcolor: Colors.Red,
            \tstroke: { lineWidth: 5 },
        });

        const star = new Star({
            \tcenter: { x: 0, y: -75 },
            \tradius: 75,
            \tcolor: Colors.Green,
            \tstroke: { lineWidth: 5 },
        });

        const sprites: Shape[] = [rect, pentagon, star];

        const makeSpin = (sprite: Shape) => {
            \tsprite.channels[0].push({
                \t\tproperty: 'rotation',
                \t\tfrom: 0,
                \t\tto: -360,
                \t\tduration: 60 * 5
            \t}, { loop: true });
        }

        sprites.forEach(makeSpin);

        stage.root.addChildren(...sprites);
        stage.loop();
        ` } />
    </>
}