import { useEffect, useRef } from "react";
import CodeBlock from "../components/Code/Block";
import CodeBlurb from "../components/Code/Blurb";
import CodeHeader from "../components/Code/Header";
import InlineCode from "../components/Code/Inline";
import { Hyperlink } from "../components/Sidebar/Hyperlink";
import { Stage } from "../../sharc/Stage";
import { Colors, Easing } from "../../sharc/Utils";
import { Ellipse, TextSprite } from "../../sharc/Sprites";
import CodeShowcase from "../components/Code/Showcase";
import { PositionType } from "../../sharc/types/Common";
import { useParams } from "react-router";

export function DefaultPage() {
    return <>
        <h1>Animation</h1>
        
        <br />
        <h3>What is an animation?</h3>
        <p>
            An animation is a progression of a sprite's <Hyperlink to='sprites/default/properties'>property</Hyperlink> from one value to another over a period of time.{' '}
            Any property can be animated, as long as it maps to a number or an object containing numbers (e.g. <code>position</code>, <code>scale</code>, <code>color</code>, etc.).{' '}
            For example, below, we create an animation that represents moving a <InlineCode>NullSprite</InlineCode> from (0, 0) to (100, 100).{' '}
            Notice that animations use the type <InlineCode>AnimationType</InlineCode>, the full definition of which can be found <Hyperlink to='types/animation/animationtype'>here</Hyperlink>.
        </p>
        <CodeBlock code={
`import { AnimationType } from 'sharc/types/Animation'
import { NullSprite } from 'sharc/Sprites'
import { Colors, Easing } from 'sharc/Utils'

const animation: AnimationType<NullSprite> = {
    \tproperty: 'position', \t\t// a string representing the property to animate (required)
    \tfrom: {x: 0, y: 0},\t \t\t// the original value (required)
    \tto: {x: 100, y: 100},\t\t // the target value (required)
    \tduration: 1000,\t\t\t\t// the duration of the animation in frames (required)
    \tdelay: 0,\t\t\t\t\t // the number of frames to wait before starting the animation (required)
    \teasing: Easing.LINEAR,\t\t// the easing function to use (required)
    \tname: 'move',\t\t\t\t // a name for the animation (optional)
    \tdetails: [0, 0, 100, 100]\t // an array of additional information (optional)
};`} />
            <p>
                Note that <InlineCode>AnimationType</InlineCode> is a generic type, meaning that it requires a type argument.{' '}
                The type argument represents the type of sprite that the animation will be applied to, and <InlineCode>AnimationType</InlineCode> will use this to infer which properties can be animated, and which values are valid for those properties.{' '}
                When you try to add an animation to a sprite, all of this is handled for you, and sharc will even remove some properties that would be allowed in the above example, like <InlineCode>effects</InlineCode> and <InlineCode>onClick</InlineCode>.{' '}
                <br />
                For example, if you were to try to animate the "sides" of a line (which is not a valid property), you would get an error like this:
            </p>
            <CodeBlock code={
                `import { Line } from 'sharc/Sprites'
                
                const myLine = new Line({bounds: Line.Bounds(0, 0, 0, 0)});

                myLine.getChannel(0).push({
                    \tproperty: 'sides', \t// Type '"sides"' is not assignable to type "bounds" | "color" | "alpha" ...
                \t. . .
                };`} />
            <p>
                Furthermore, if you were to try to animate the color of a line (which is a valid property), but you were to use an invalid color, you would get an error like this:
            </p>
            <CodeBlock code={
                `myLine.getChannel(0).push({
                    \tproperty: 'color',
                    \tfrom: Colors.Red,
                    \tto: 'blue', \t// Type 'string' is not assignable to type '... | (ColorType & Record<string, number>) | ...'.
                \t. . .
                };`} />
            <br />
    </>
}

export function Channels() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const params = useParams<{category: string, subcategory: string}>();

    useEffect(() => {
        const element = document.getElementById(params.subcategory!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const circle = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 30),
            color: Colors.Red,
            stroke: {lineWidth: 5},
        });

        stage.root.addChild(circle);

        stage.onPointerMove = (_stage, _event, position) => {
            circle.getChannel(0).enqueue([
            {
                property: 'center',
                from: null,
                to: position,
                duration: 10,
                delay: 0,
                easing: Easing.EASE_IN_OUT,
            },
            {
                property: 'radius',
                from: null,
                to: (num: number) => num * 0.8,
                duration: 10,
                delay: 0,
                easing: Easing.Bounce(Easing.LINEAR)
            }], 1);
        }

        stage.loop();

        return () => {
            stage.stop();
        }

    }, [canvasRef])

    return <>
        <h1>Channels</h1>
        <p>
            Every sprite comes with any number of channels, which are basically parallel animation queues. All of the channels are initialized knowing the properties of the sprite it came from. Every time the sprite is rendered, all of its channels will advance by one step, and the sprite will be updated accordingly.{' '}
            Once the current animation in a channel completes, it will be removed from the queue.{' '}
            In order to access a sprite's channels, you use <CodeBlurb blurb={[`sprite.getChannel(n)`]} /> function, where <InlineCode>n</InlineCode> is the index of the channel you want to access.{' '}
        </p>
        <br />
        <p><em>
            * Note: for simplicity's sake, </em><InlineCode>AnimationType</InlineCode><em>, </em><InlineCode>PrivateAnimationType</InlineCode><em>, and </em><InlineCode>AnimationPackage</InlineCode><em>{' '}
            will refer to </em><InlineCode>{'AnimationType<Properties>'}</InlineCode><em>, </em><InlineCode>{'PrivateAnimationType<Properties>'}</InlineCode><em>, and </em><InlineCode>{'AnimationPackage<Properties>'}</InlineCode><em>,{' '}
            respectively, where </em><InlineCode>Properties</InlineCode><em> is the properties type of the sprite that the channel belongs to.
            <br />
            Furthermore, </em><CodeBlurb blurb={['DEFAULT_PARAMS == {loop: false, iterations: 1, delay: 0}']} /> .
            
        </p>
        <br />
        <h3>Channel Functions</h3>
            <CodeHeader header={'channel.push(animations: AnimationType|AnimationType[], params: AnimationParams = DEFAULT_PARAMS) -> this'}></CodeHeader>
            Adds an array of animations to the rear of the channel queue. If one animation is passed, it will be wrapped in an array.{' '}
            This function creates an <InlineCode>AnimationPackage</InlineCode> from <InlineCode>animations</InlineCode> and <InlineCode>params</InlineCode>, and then adds it to the channel queue.{' '}

            <br />
            <br />

            <CodeHeader header={'channel.unshift(animations: AnimationType|AnimationType[], params: AnimationParams = DEFAULT_PARAMS) -> this'}></CodeHeader>
            Adds an array of animations directly to the front of the channel queue. If one animation is passed, it will be wrapped in an array.

            <br />
            <br />

            <CodeHeader header={'channel.pop() -> AnimationPackage|undefined'}></CodeHeader>
            Removes the animation at the rear of the channel queue and returns it.

            <br />
            <br />

            <CodeHeader header={'channel.shift() -> AnimationPackage|undefined'}></CodeHeader>
            Removes the current animation at the front of the channel queue and returns it.

            <br />
            <br />

            <CodeHeader header={'channel.clear() -> this'}></CodeHeader>
            Removes all animations from the channel queue.

            <br />
            <br />

            <CodeHeader header={'channel.shiftAnimation() -> AnimationType|undefined'}></CodeHeader>
            Removes the current animation (NOT animation package) at the front of the channel queue and returns it.{' '}
            If the current animation package becomes empty, it will be removed from the queue.

            <br />
            <br />

            <CodeHeader header={'channel.popAnimation() -> AnimationType|undefined'}></CodeHeader>
            Removes the animation (NOT animation package) at the rear of the channel queue and returns it.{' '}
            If the current animation package becomes empty, it will be removed from the queue.

            <br />
            <br />

            <CodeHeader header={'channel.stepForward() -> PrivateAnimationType|null'} />
            Steps the channel forward by one frame. If the current animation package becomes empty, it will be removed from the queue.{' '}
            Returns the current animation as a <InlineCode>PrivateAnimationType</InlineCode>, containing the current frame of the animation, as well as the index from which it came.{' '}
            Automatically called by sprites on all channels when they are drawn to advance their animations.

            <br />
            <br />

            <CodeHeader header={'channel.enqueue(animations: AnimationType|AnimationType[], index: number = 1, params: AnimationParams = DEFAULT_PARAMS) -> this'}></CodeHeader>
            Creates an animation package, and tries to place it at position <InlineCode>index</InlineCode> of the current package. If the index is greater than or equal to the length of the package,{' '}
            the animation will be pushed to the rear of the package. This can be used to send several animations to a sprite rapidly without overloading the channel queue.
            <br />
            You can see a demonstration of this below. Hover your mouse around the canvas. For every frame that a pointerMove event is detected, <InlineCode>enqueue</InlineCode> will be called on{' '}
            the red circle, however the circle will never have more than 2 animations in its queue at a time. Furthermore, you will notice that as long as your mouse stays still, the circle will{' '}
            arrive there within 20 frames, but no animation package will ever be interrupted by another animation package.
        
        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { Ellipse } from 'sharc/Sprites'
            import { Colors, Easing } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const circle = new Ellipse({
                \tbounds: Ellipse.Bounds(0, 0, 30),
                \tcolor: Colors.Red,
                \tstroke: {lineWidth: 5},
            });

            stage.root.addChild(circle);

            stage.onPointerMove = (_stage, _event, position) => {
                \tcircle.getChannel(0).enqueue([
                \t\t{
                    \t\t\tproperty: 'center',
                    \t\t\tfrom: null,
                    \t\t\tto: position,
                    \t\t\tduration: 10,
                    \t\t\tdelay: 0,
                    \t\t\teasing: Easing.EASE_IN_OUT,
                    \t\t},
                    \t\t{
                        \t\t\tproperty: 'radius',
                        \t\t\tfrom: null,
                        \t\t\tto: (num: number) => num * 0.8,
                        \t\t\tduration: 10,
                        \t\t\tdelay: 0,
                        \t\t\teasing: Easing.Bounce(Easing.LINEAR)
                        \t\t}
                    \t], 1);
            }

            stage.loop();
            `
        } />
    </>
}

export function SmartAnimations() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const params = useParams<{category: string, subcategory: string}>();

    useEffect(() => {
        const element = document.getElementById(params.subcategory!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    useEffect(() => {
        
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const get_random_position = () => {return {
            x: (Math.random() - 0.5) * stage.width!,
            y: (Math.random() - 0.5) * stage.height!,
        } as PositionType}

        const smart_circle = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 25),
            color: Colors.Aqua,
            stroke: {lineWidth: 5},
        }).setOnClick((sprite) => {
            sprite.getChannel(0).enqueue([
                {
                    property: 'center',
                    from: null,
                    to: get_random_position(),
                    duration: 15,
                    delay: 0,
                    easing: Easing.EASE_IN_OUT,
                }
            ], 1);
        }).addChild(new TextSprite({
            text: 'from: null',
            color: Colors.Aqua,
            position: {x: 0, y: 55},
            scale: {x: 1, y: -1},
            positionIsCenter: true,
            fontSize: 30,
            bold: true,
        }));

        const normal_circle = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 25),
            color: Colors.DarkMagenta,
            stroke: {lineWidth: 5},
        }).setOnClick((sprite) => {
            sprite.getChannel(0).enqueue([
                {
                    property: 'center',
                    from: {x: 0, y: 0},
                    to: get_random_position(),
                    duration: 15,
                    delay: 0,
                    easing: Easing.EASE_IN_OUT,
                }
            ], 1);
        }).addChild(new TextSprite({
            text: 'from: (0, 0)',
            color: Colors.DarkMagenta,
            position: {x: 0, y: -55},
            scale: {x: 1, y: -1},
            positionIsCenter: true,
            fontSize: 30,
            bold: true,
        }));

        stage.root.addChildren(normal_circle, smart_circle);
        stage.loop();

        //

        const stage2 = new Stage(canvasRef2.current!, 'centered', Colors.LightSlateGray);

        {
        const stage = stage2;
        const circle = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 25),
            color: Colors.Aqua,
            stroke: {lineWidth: 5},
        }).setOnClick((sprite) => {
            sprite.getChannel(0).enqueue([
                {
                    property: 'center',
                    from: null,
                    to: (src: PositionType) => {
                        const dest = {
                            x: Math.round((Math.random() - 0.5) * stage.width!),
                            y: Math.round((Math.random() - 0.5) * stage.height!),
                        }
                        alert(`Moving from (${src.x}, ${src.y}) to (${dest.x}, ${dest.y})`)
                        return dest;
                    },
                    duration: 15,
                    delay: 0,
                    easing: Easing.EASE_IN_OUT,
                }
            ], 1);
        });

        stage.root.addChild(circle);
        stage.loop();
        }

        return () => {
            stage.stop();
            stage2.stop();
        }
    }, [canvasRef])
    return <>
        <h1>Smart Animations</h1>
        <p>
            A smart animation uses a <InlineCode>from</InlineCode> value or a <InlineCode>to</InlineCode> value that is not hard-coded into the animation.{' '}
            You can make a smart animation by setting the <InlineCode>from</InlineCode> value to <InlineCode>null</InlineCode> and/or setting the <InlineCode>to</InlineCode> value to a callback function.{' '}
        </p>

        <br />
        <h3>From Null</h3>
        <p>
            You can set the <InlineCode>from</InlineCode> value of an animation to <InlineCode>null</InlineCode>.{' '}
            When the animation becomes active, the sprite will replace the null value with the current value of the property being animated.{' '}
            You can see a demo of this below; try clicking on the circles to see the difference between a smart animation and a normal animation.
        </p>
        <CodeShowcase code={
`import { Stage } from 'sharc/Stage'
import { Ellipse, TextSprite } from 'sharc/Sprites'
import { Colors, Easing } from 'sharc/Utils'
import { PositionType } from 'sharc/types/Common'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const get_random_position = () => {return {
    \tx: (Math.random() - 0.5) * stage.width!,
    \ty: (Math.random() - 0.5) * stage.height!,
} as PositionType;}

const smart_circle = new Ellipse({
    \tbounds: Ellipse.Bounds(0, 0, 25),
    \tcolor: Colors.Aqua,
    \tstroke: {lineWidth: 5},
}).setOnClick((sprite) => {
    \tsprite.getChannel(0).enqueue([
    \t\t{
        \t\t\tproperty: 'center',
        \t\t\tfrom: null,
        \t\t\tto: get_random_position(),
        \t\t\tduration: 15,
        \t\t\tdelay: 0,
        \t\t\teasing: Easing.EASE_IN_OUT,
    \t\t}
\t], 1);
}).addChild(new TextSprite({
    \ttext: 'from: null',
    \tcolor: Colors.Aqua,
    \tposition: {x: 0, y: 55},
    \tscale: {x: 1, y: -1},
    \tpositionIsCenter: true,
    \tfontSize: 30,
    \tbold: true,
}));

const normal_circle = new Ellipse({
    \tbounds: Ellipse.Bounds(0, 0, 25),
    \tcolor: Colors.DarkMagenta,
    \tstroke: {lineWidth: 5},
}).setOnClick((sprite) => {
    \tsprite.getChannel(0).enqueue([
        \t\t{
            \t\t\tproperty: 'center',
            \t\t\tfrom: {x: 0, y: 0},
            \t\t\tto: get_random_position(),
            \t\t\tduration: 15,
            \t\t\tdelay: 0,
            \t\t\teasing: Easing.EASE_IN_OUT,
        \t\t}
    \t], 1);
}).addChild(new TextSprite({
    \ttext: 'from: (0, 0)',
    \tcolor: Colors.DarkMagenta,
    \tposition: {x: 0, y: -55},
    \tscale: {x: 1, y: -1},
    \tpositionIsCenter: true,
    \tfontSize: 30,
    \tbold: true,
}));

stage.root.addChildren(normal_circle, smart_circle);
stage.loop();`
        } canvasRef={canvasRef} />
        <br />
        <h3>To Callback</h3>
        <p>
            You can set the <InlineCode>to</InlineCode> value of an animation to a callback function.{' '}
            When the animation becomes active, the sprite will call the function on the <InlineCode>from</InlineCode> value of the animation, and use the return value as the <InlineCode>to</InlineCode> value.{' '}
            You can see a demo of this below:
        </p>
        <CodeShowcase code={
`import { Stage } from 'sharc/Stage'
import { Ellipse } from 'sharc/Sprites'
import { Colors, Easing } from 'sharc/Utils'
import { PositionType } from 'sharc/types/Common'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const circle = new Ellipse({
    \tbounds: Ellipse.Bounds(0, 0, 25),
    \tcolor: Colors.Aqua,
    \tstroke: {lineWidth: 5},
}).setOnClick((sprite) => {
    \tsprite.getChannel(0).enqueue([
        \t\t{
            \t\t\tproperty: 'center',
            \t\t\tfrom: null,
            \t\t\tto: (src: PositionType) => {
                \t\t\t\tconst dest = {
                    \t\t\t\t\tx: Math.round((Math.random() - 0.5) * stage.width!),
                    \t\t\t\t\ty: Math.round((Math.random() - 0.5) * stage.height!),
                \t\t\t\t};
                \t\t\t\talert(\`Moving from (\${src.x}, \${src.y}) to (\${dest.x}, \${dest.y})\`);
                \t\t\t\treturn dest as PositionType;
            \t\t\t},
            \t\t\tduration: 15,
            \t\t\tdelay: 0,
            \t\t\teasing: Easing.EASE_IN_OUT,
        \t\t}
    \t], 1);
});

stage.root.addChild(circle);
stage.loop();`
        } canvasRef={canvasRef2} />
    </>
}

export function Distribute() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const circle = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 30),
            color: Colors.Aqua,
            stroke: {lineWidth: 5},
        }, 2); // <-- don't forget to set the number of channels!

        circle.distribute(
            [
                [ // channel 0
                    {
                        property: 'centerX',
                        from: -stage.width! / 2 + 15,
                        to: stage.width! / 2 - 15,
                        duration: 100,
                        delay: 0,
                        easing: Easing.Bounce(Easing.LINEAR),
                    }
                ], 
                [ // channel 1
                    {
                        property: 'centerY',
                        from: 20,
                        to: -stage.height! / 2 + 25,
                        duration: 40,
                        delay: 0,
                        easing: Easing.Bounce(Easing.EASE_OUT),
                    }
                ],
            ], 
        {loop: true});

        stage.root.addChild(circle);

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef])

    return <>
        <h1>Distribute</h1>
        <CodeHeader header={
            `sprite.distribute(
                animations: AnimationType<Properties>[][], 
                params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
            )`
        }></CodeHeader>
        <p>
            Another way you can push animations to a sprite is by using the sprite's <InlineCode>distribute</InlineCode> function.{' '}
            This function takes an array of animation arrays, and tries to push <InlineCode>animations[0]</InlineCode> to the sprite's first channel,{' '}
            <InlineCode>animations[1]</InlineCode> to the sprite's second channel, etc. It will also apply <InlineCode>params</InlineCode> to all of the animation packages it creates.{' '}
            If there are not enough channels to distribute all of the animations, an error will be raised.
        </p>
        <CodeShowcase code={
`import { Stage } from 'sharc/Stage'
import { Ellipse } from 'sharc/Sprites'
import { Colors, Easing } from 'sharc/Utils'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

const circle = new Ellipse({
    \tbounds: Ellipse.Bounds(0, 0, 30),
    \tcolor: Colors.Aqua,
    \tstroke: {lineWidth: 5},
}, 2); // <-- don't forget to set the number of channels!

circle.distribute(
    \t[
        \t\t[ // channel 0
            \t\t\t{
                \t\t\t\tproperty: 'centerX',
                \t\t\t\tfrom: -stage.width! / 2 + 15,
                \t\t\t\tto: stage.width! / 2 - 15,
                \t\t\t\tduration: 100,
                \t\t\t\tdelay: 0,
                \t\t\t\teasing: Easing.Bounce(Easing.LINEAR),
            \t\t\t}
        \t\t],
        \t\t[ // channel 1
            \t\t\t{
                \t\t\t\tproperty: 'centerY',
                \t\t\t\tfrom: 20,
                \t\t\t\tto: -stage.height! / 2 + 25,
                \t\t\t\tduration: 40,
                \t\t\t\tdelay: 0,
                \t\t\t\teasing: Easing.Bounce(Easing.EASE_OUT),
            \t\t\t}
        \t\t],
    \t],
    \t{loop: true}
);

stage.root.addChild(circle);

stage.loop();`} canvasRef={canvasRef} />
    </>
}

export function EasingPage() {
    return <>
        <h1>Easing</h1>
        <p>
            Every animation requires an <InlineCode>EasingType</InlineCode> function, which is a function that takes in a number (which will be from 0 to 1 inclusive) and returns a number{' '}
            (also from 0 to 1 inclusive). You can write your own easing function or use the ones provided in <InlineCode>sharc/Utils</InlineCode>.{' '}
            Also, <InlineCode>Easing.Bounce(curve: EasingType)</InlineCode> takes in an easing function and returns a new easing function that plays the original easing function in reverse after the halfway point,{' '}
            thus "bouncing" the animation. You can see a demonstration of that <Hyperlink to='animation/distribute'>here</Hyperlink>.{' '}
        </p>

        <CodeBlock code={
            ` // sharc/Utils.ts

            export const Easing = {
                \tLINEAR: (x: number) => x,
                \tEASE_IN: (x: number) => 1 - Math.pow(1 - x, 2),
                \tEASE_OUT: (x: number) => x * x,
                \tEASE_IN_OUT: (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
                \tEASE_IN_CUBIC: (x: number) => 1 - Math.pow(1 - x, 3),
                \tEASE_OUT_CUBIC: (x: number) => x * x * x,
                \tEASE_IN_OUT_CUBIC: (x: number) => x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2,
                \tBounce: (curve: EasingType) => {return (x: number) => x < 0.5 ? curve(x * 2) : curve(2 * (1 - x))},
            }
            `
        } />
    </>
}