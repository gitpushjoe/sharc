import { useEffect, useRef } from "react";
import CodeBlock from "../components/Code/Block";
import CodeBlurb from "../components/Code/Blurb";
import CodeHeader from "../components/Code/Header";
import InlineCode from "../components/Code/Inline";
import { Hyperlink } from "../components/Sidebar/Hyperlink";
import CodeShowcase from "../components/Code/Showcase";
import { Stage } from "../../sharc/Stage";
import { Animate, Colors, Easing } from "../../sharc/Utils";
import { BezierCurve, Ellipse, ImageSprite, Line, NullSprite, Path, Polygon, Rect, Star, TextSprite } from "../../sharc/Sprites";
import { useParams } from "react-router";
import * as sharcImage from 'https://i.imgur.com/mXuQAt2.png';

export function Sprites() {

    const params = useParams() as {category: string, subcategory: string, section: string};
    const universalSpriteProperties = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const element = document.getElementById(params.section!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    return <>
        <h1>
            Sprites
        </h1>
        <p>
            {'Sprites are the building blocks of sharc. They are the objects that are drawn to the canvas. '}
            {'Sprites can be added to the stage\'s root, or to other sprites. '}
            {'Sprites can be moved, rotated, scaled, and more. '}
            {'Sprites are instantiated like so: '}
        </p>
        <br />
        <CodeHeader header={`new Sprite(props: Properties, channels: number = 1)`} />
        <p>
            <InlineCode>props</InlineCode>
            {' is an object that contains the properties of the sprite you are trying to create. '}
            {'Different sprites will have different '}
            <InlineCode>Properties</InlineCode> 
            {' types. You can read about the four different types of properties '}<Hyperlink to='sprites/properties'>here</Hyperlink>.{' '}
            {'The second parameter, '}
            <InlineCode>channels</InlineCode>
            {', is the number of '}
            <Hyperlink to='animation/channels'>animation channels</Hyperlink>
            {' that the sprite will have. It defaults to 1. '}
            <br />
            <br />
        </p>
        <CodeHeader header={`sprite.draw(ctx: CanvasRenderingContext2D, properties?: Properties, isRoot?: boolean)`} />
        <p>
            This function draws the sprite to the canvas. It is automatically called by the <InlineCode>Stage</InlineCode> class.{' '}
            <InlineCode>ctx</InlineCode> is the canvas context to draw the sprite to.{' '}
            <InlineCode>properties</InlineCode> is an object that contains the properties of the sprite you are trying to draw.{' '}
            (Each sprite is a subclass of the base <InlineCode>Sprite</InlineCode> class, so, for example, <InlineCode>Line</InlineCode> will set its <InlineCode>Properties</InlineCode> type to a special <InlineCode>LineProperties</InlineCode> type.){' '}
            Finally, <InlineCode>isRoot</InlineCode> is a boolean that defaults to <InlineCode>true</InlineCode>. It's used for determining priority in pointer events.{' '}
        </p>

        <br />
        <CodeHeader header={`sprite.animate() -> this`} />
        <p>
            Advances all of the sprite's <Hyperlink to="animation/channels">animation channels</Hyperlink> by one frame.
        </p>

        <br />
        <CodeHeader header={`sprite.get(property: KeysOf<Properties>|keyof HiddenProperties, raiseError = true) -> any`} />
        <p>
            See <Hyperlink to='sprites/usage/properties'>Sprites/Usage/Properties</Hyperlink>. (This function will be type-checked at runtime.)
        </p>
        <br />
        <CodeHeader header={`sprite.set(property: KeysOf<Properties>|keyof HiddenProperties, value: AcceptedTypesOf<Properties & HiddenProperties>, raiseError = true) -> boolean`} />
        <p>
            See <Hyperlink to='sprites/usage/properties'>Sprites/Properties</Hyperlink>. (This function will be type-checked at runtime, and <InlineCode>value</InlineCode> will be soft type-checked.)
        </p>

        <br />
        <CodeHeader header={`sprite.addChild(child: Sprite) -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.addChildren(children: Sprite[]) -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.removeChild(child: Sprite) -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.removeChildren(children: Sprite[]) -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.children -> Sprite[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_getChildren() -> Sprite[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.parent -> Sprite|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.root -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.logHierarchy() -> void`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.findChild(name: string) -> Sprite|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.findChildren(name: string) -> Sprite[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_findChild(name: string) -> Sprite|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_findChildren(name: string) -> Sprite[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onClick: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onDrag: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onRelease: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onHover: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onHoverEnd: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnClick(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnDrag(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnRelease(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnHover(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnHoverEnd(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.getChannel(index: number) -> Channel`} />
        <p>See <Hyperlink to='animation/channels'>Animation/Channels</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.distribute(animations: AnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>[][], params: AnimationParams = { loop: false, iterations: 1, delay: 0}) -> this`} />
        <p>See <Hyperlink to='animation/distribute'>Animation/Distribute</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.copy(): Sprite<Properties, HiddenProperties>`} />
        <p>Returns a deep copy of the sprite.</p>

        <br />
        <CodeHeader header={`sprite.createChannels(count: number) -> this`} />
        <p>Creates <InlineCode>count</InlineCode> new animation channels.</p>
    </>
}

export function Properties() {

    useEffect(() => {window.scrollTo(0, 0)}, []);
    return <>
        <h1>Properties</h1>
        <p>
            <InlineCode>Properties</InlineCode> defines the attributes and attribute types that a sprite can have. For example, the type <InlineCode>LineProperties</InlineCode> contains <InlineCode>{'{lineWidth?: number}'}</InlineCode>{' '}
            and the type <InlineCode>Polygon</InlineCode> contains <InlineCode>{'{sides: number}'}</InlineCode>. Properties can be divided into four (not mutually-exclusive) types:
        </p>

        <br />
        <h3>Normal, Aggregate, Calculated, and Hidden Properties</h3>
        <br />
        <p>
        <strong>Normal Properties </strong>
                {'are passed into the constructor of the sprite and are not related to any other properties. '}
                <em>alpha</em>
                {' is an example of a normal property. '}
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <strong>Aggregate Properties </strong>{'take in objects, and map to hidden properties. For example, '}
            <em>color</em>
            {' is an aggregate property that maps to '}
            <em>red</em>, <em>green</em>, <em>blue</em>, and <em>alpha</em>.
            {' This means that '}
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlock code={`mySprite.set('color', {red: 255, green: 0, blue: 0, alpha: 0)})`} />
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            {'is the same as '}
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlock code={`mySprite.set('red', 255);
            mySprite.set('green', 0);
            mySprite.set('blue', 0);
            mySprite.set('alpha', 0);`} />
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            {'Aggregate properties are useful for setting multiple properties at once. '}
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <p>
                <strong>Calculated Properties</strong>
                {' are properties that are calculated from other properties. For example, when you make a path, you don\'t pass the center of the path to the constructor. '}
                {'Instead, you pass the coordinates of every point along the path. However, if you want to find the center of the path, you can do '}
                <InlineCode>myPath.get('center')</InlineCode>
                {' and it will return the center of the path as a '}
                <Hyperlink>PositionType</Hyperlink>
                {' object. '}
            </p>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <p>
                <strong>Hidden Properties</strong>
                {' are properties that do not get passed into the constructor, but are still accessible, like '}
                <em>red</em>
                {', '}
                <em>scaleY</em>
                {', and '}
                <em>rotation</em>
                {'. They can be retrieved, modified, and animated, just like any other property. A property can be both hidden and calculated. '}
            </p>
            <br />
            <p>
                {'Often this distinction is not important to actually using sprites in sharc, but knowing how aggregate and hidden properties work might save time and clear confusion '}
                {'when modifying '}
                <Hyperlink>bounds</Hyperlink>
                {' or color.'}
            </p>
            <p>
                {'The second parameter, '}
                <InlineCode>channels</InlineCode>
                {', is the number of '}
                <Hyperlink>animation channels</Hyperlink>
                {' that the sprite will have. It defaults to 1. '}
            </p>

            <br />
            <h3>Universal Sprite Properties</h3>
            <br />
            <p>
                <CodeBlurb blurb={['bounds: ', 'BoundsType']} /> - the <Hyperlink>bounds</Hyperlink> of the sprite. Aggregate Property for <em>x1</em>, <em>y1</em>, <em>x2</em>, and <em>y2</em>.
                <br />
                <em>{' * Note that '}
                <Hyperlink>BezierCurve</Hyperlink>{', '}
                <Hyperlink>Path</Hyperlink>{', '}
                <Hyperlink>Polygon</Hyperlink>{', and '}
                <Hyperlink>Text</Hyperlink>{' do not use bounds in their constructors, but instead calculate the bounds once instantiated. Bounds are required for all other sprites.'}</em>
                <br />
                <br />
                <CodeBlurb blurb={['color?: ', 'ColorType']} />
                {' - the color of the sprite. '}
                {'Aggregate Property for '}
                <InlineCode>red</InlineCode>, <InlineCode>green</InlineCode>, <InlineCode>blue</InlineCode>, and <InlineCode>colorAlpha</InlineCode>. Defaults to <InlineCode>{`\{red: 0, green: 0, blue: 0, alpha: 1\}`}</InlineCode>.
                <br />
                <br />
                <CodeBlurb blurb={['scale?: ', 'PositionType']} /> - the scale of the sprite with <InlineCode>x</InlineCode> being the scale on the x-axis and <InlineCode>y</InlineCode> being the scale on the y-axis. Defaults to <InlineCode>{`\{x: 1, y: 1}`}</InlineCode>. Aggregate Property for <InlineCode>scaleX</InlineCode> and <InlineCode>scaleY</InlineCode>.
                {' '}<strong>The sprite is always scaled from its center.</strong>
                <br />
                <br />
                <CodeBlurb blurb={['rotation?: ', 'number']} /> - the rotation of the sprite in degrees. Defaults to 0. Normal Property. <strong>The sprite is always rotated around its center.</strong>
                <br />
                <br />
                <CodeBlurb blurb={['alpha?: ', 'number']} /> - the opacity of the sprite from 0 to 1. Defaults to 1. Normal Property.
                <br />
                <br />
                <CodeBlurb blurb={['effects?: ', '(ctx: CanvasRenderingContext2D) => void']} /> - This function will be called on the canvas context before the sprite is drawn. Useful for things like blurs and drop shadows. Normal Property.
                <br />
                <br />
                <CodeBlurb blurb={['name?: ', 'string']} /> - the name of the sprite. Does not need to be unique. It can be useful for debugging and finding specific child sprites. Defaults to <InlineCode>""</InlineCode>. Normal Property.
                <br />
                <br />
                <CodeBlurb blurb={['details?: ', '(string|number)[]']} /> - an array of strings or numbers. Can be used to store any information you want on the sprite. Defaults to <InlineCode>[]</InlineCode>. Normal Property.
                <br />
                <br />
                <h4>Hidden Universal Properties</h4>
                <CodeBlurb blurb={['center: ', 'PositionType']}></CodeBlurb> - the center of the sprite. Calculated Property from <InlineCode>x1</InlineCode>, <InlineCode>y1</InlineCode>, <InlineCode>x2</InlineCode>, and <InlineCode>y2</InlineCode>.
                <br />
                <br />
                <CodeBlurb blurb={['corner1: ', 'PositionType']}></CodeBlurb> - the first corner of the sprite's bounds. Aggregate Property for <InlineCode>x1</InlineCode> and <InlineCode>y1</InlineCode>.
                <br />
                <br />
                <CodeBlurb blurb={['corner2: ', 'PositionType']}></CodeBlurb> - the second corner of the sprite's bounds. Aggregate Property for <InlineCode>x2</InlineCode> and <InlineCode>y2</InlineCode>.
                <br />
                <br />
                <CodeBlurb blurb={['width: ', 'number']}></CodeBlurb> - the width of the sprite. Calculated Property from <InlineCode>x1</InlineCode> and <InlineCode>x2</InlineCode>.
                <br />
                <br />
                <CodeBlurb blurb={['height: ', 'number']}></CodeBlurb> - the height of the sprite. Calculated Property from <InlineCode>y1</InlineCode> and <InlineCode>y2</InlineCode>.
                <br />
                <br />
                {
                    ['red', 'green', 'blue', 'colorAlpha', 'x1', 'y1', 'x2', 'y2', 'scaleX', 'scaleY', 'centerX', 'centerY'].map((prop, idx) => {
                        return <>
                            <CodeBlurb key={idx} blurb={[`${prop}: `, 'number']} />
                            <br />
                            <br />
                        </>
                    })
                }
            </p>
        </p>

    </>
}

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
        `import { Stage } from 'sharc/Stage';
        import { Line } from 'sharc/Sprites';
        import { Colors } from 'sharc/Utils';

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
            `import { Stage } from 'sharc/Stage';
            import { Rect } from 'sharc/Sprites';
            import { Colors } from 'sharc/Utils';

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
                `import { Stage } from 'sharc/Stage';
                import { Rect } from 'sharc/Sprites';
                import { Colors } from 'sharc/Utils';

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

export function Parenting() {

    useEffect(() => {window.scrollTo(0, 0)}, []);
    return <>
        <h1>Parenting</h1>
        <p>
            {'In sharc, you can make a sprite a child of another sprite. In order to understand what this means, '}
            {'it may be helpful to cover how sprites are actually drawn: '}
        </p>
        <CodeBlurb blurb={['function draw(...):']}></CodeBlurb>
        <ol>
            <li>The current state of the canvas is saved.</li>
            <li>The canvas context is translated so that the origin of the canvas is where the center of the sprite should be.</li>
            <li>The canvas is rotated according to the <InlineCode>rotation</InlineCode> property of the sprite.</li>
            <li>The canvas is scaled according to the <InlineCode>scale</InlineCode> property of the sprite.</li>
            <li>The sprite is drawn to the canvas.</li>
            <strong><li><CodeBlurb blurb={['draw()']} /> is called on all the child sprites.</li></strong>
            <li>The canvas context is restored to the state it was in at step 1.</li>
        </ol>
        <p>
            {'As you can see, the children of a sprite inherit the transformations of their parent. (0, 0) for a child sprite is the center of the parent sprite. '}
            {'Furthermore, if you rotate or scale a parent sprite, all of its children will rotate or scale with it. '}
        </p>
        <br />
        <h3>Parenting Functions</h3>
        <CodeHeader header={`sprite.addChild(child: Sprite) -> Sprite`} />
        <p>
            Adds one child to <InlineCode>sprite</InlineCode>'s children. Returns <InlineCode>sprite</InlineCode>.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.addChildren(children: Sprite[]) -> Sprite`} />
        <p>
            Adds multiple children to <InlineCode>sprite</InlineCode>. Returns <InlineCode>sprite</InlineCode>.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.removeChild(child: Sprite) -> Sprite`} />
        <p>
            Tries to remove <InlineCode>child</InlineCode> from <InlineCode>sprite</InlineCode>'s children. Returns <InlineCode>sprite</InlineCode>.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.removeChildren(children: Sprite[]) -> Sprite`} />
        <p>
            Tries to remove all of <InlineCode>children</InlineCode> from <InlineCode>sprite</InlineCode>'s children. Returns <InlineCode>sprite</InlineCode>.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.children -> Sprite[]`} />
        <p>
            Returns a copy of <InlineCode>sprite</InlineCode>'s children array.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.r_getChildren() -> Sprite[]`} />
        <p>
            Returns all of <InlineCode>sprite</InlineCode>'s descendants. (Recursive)
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.parent -> Sprite|undefined`} />
        <p>
            Returns <InlineCode>sprite</InlineCode>'s parent.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.root -> Sprite`} />
        <p>
            Returns the root of the tree that <InlineCode>sprite</InlineCode> is in. If <InlineCode>sprite</InlineCode> is the root, then it will return itself.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.logHierarchy() -> void`} />
        <p>
            Logs <InlineCode>sprite</InlineCode> and all of its descendants to the console, including their positions, using the sprites' <InlineCode>name</InlineCode> properties and their colors.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.findChild(name: string) -> Sprite|undefined`} />
        <p>
            Returns the first child of <InlineCode>sprite</InlineCode> with the name <InlineCode>name</InlineCode>. Non-recursive.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.findChildren(name: string) -> Sprite[]`} />
        <p>
            Returns all of the children of <InlineCode>sprite</InlineCode> with the name <InlineCode>name</InlineCode>. Non-recursive.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.r_findChild(name: string) -> Sprite|undefined`} />
        <p>
            Returns the first descendant of <InlineCode>sprite</InlineCode> with the name <InlineCode>name</InlineCode>. If no descendant has that name, it returns undefined. Recursive.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.r_findChildren(name: string) -> Sprite[]`} />
        <p>
            Returns all of the descendants of <InlineCode>sprite</InlineCode> with the name <InlineCode>name</InlineCode>. If no descendant has that name, it returns an empty array. Recursive.
        </p>
    </>
}

export function HandlingUserInput() {

    useEffect(() => {window.scrollTo(0, 0)}, []);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        stage.root.addChildren(new Line({
            bounds: Line.Bounds(-300, 200 - (400/3), 300, 200 - (400/3)),
            color: Colors.White,
            lineWidth: 5,
        }), new Line({
            bounds: Line.Bounds(-300, 200 - (800 / 3), 300, 200 - (800/3)),
            color: Colors.White,
            lineWidth: 5,   
        }))

        stage.root.addChildren(new Ellipse({
            bounds: Ellipse.Bounds(-225, 200 - (400 / 6), 40),
            color: Colors.FloralWhite,
            stroke: {lineWidth: 8},
            name: 'click-test',
            details: [0] // used to store number of clicks
        }).addChild(new TextSprite({
            text: 'Click Me!',
            color: Colors.FloralWhite,
            position: {x: 70, y: -23},
            scale: {x: 1, y: -1},
            fontSize: 60,
            bold: true,
        })));

        stage.root.addChildren(new Ellipse({
            bounds: Ellipse.Bounds(-225, 200 - (1200 / 6), 40),
            color: Colors.Yellow,
            stroke: {lineWidth: 8},
            name: 'drag-test',
        }).addChild(new TextSprite({
            text: 'Drag Me!',
            color: Colors.Yellow,
            position: {x: 70, y: -23},
            scale: {x: 1, y: -1},
            fontSize: 60,
            bold: true,
        })));

        stage.root.addChildren(new Ellipse({
            bounds: Ellipse.Bounds(-225, 200 - (2000 / 6), 40),
            color: Colors.Aqua,
            stroke: {lineWidth: 8},
            name: 'hover-test',
        }).addChild(new TextSprite({
            text: 'Hover Me!',
            color: Colors.Aqua,
            position: {x: 70, y: -23},
            scale: {x: 1, y: -1},
            fontSize: 60,
            bold: true,
        })));

        const clickTest = stage.root.findChild('click-test')!;
        const dragTest = stage.root.findChild('drag-test')!;
        const hoverTest = stage.root.findChild('hover-test')!;

        clickTest.setOnClick((sprite, event, position) => {
            const clickCount = sprite.get('details') as number[];
            sprite.set('details', [clickCount[0] + 1]);
            sprite.children[0].set('text', `${clickCount[0] + 1} clicks`);
            sprite.getChannel(0).enqueue( // bounce animation
                {property: 'scaleX', from: null, to: 0.8, duration: 10, delay: 0, easing: Easing.Bounce(Easing.EASE_IN_OUT), name: stage.currentFrame.toString()},
            )
        });

        dragTest.setOnDrag((sprite, event, position) => {
            sprite.getChannel(0).clear(); // clear animations
            const topBoundary = stage.root.children[0].get('centerY') - 40;
            const bottomBoundary = stage.root.children[1].get('centerY') + 40;
            if (position.y < topBoundary && position.y > bottomBoundary) {
                sprite.set('center', position);
            }
        });

        dragTest.setOnRelease((sprite, event, position) => {
            sprite.getChannel(0).enqueue( // return to original position
                {property: 'center', from: null, to: {x: -225, y: 200 - (1200 / 6)}, duration: 20, delay: 0, easing: Easing.LINEAR}
            );
        });

        hoverTest.setOnHover((sprite, position) => {
            sprite.set('color', Colors.Orange);
            sprite.children[0].set('text', 'Unhover Me!');
            sprite.children[0].set('color', Colors.Orange);
        });

        hoverTest.setOnHoverEnd((sprite, position) => {
            sprite.set('color', Colors.Aqua);
            sprite.children[0].set('text', 'Hover Me!');
            sprite.children[0].set('color', Colors.Aqua);
        });

        stage.loop();

        return () => {
            stage.stop();
        }

    }, [canvasRef]);

    return <>
        <h1>Handling User Input</h1>
        <p>
            {'Handling user input for sprites works much the same way as it does for the '}
            <Hyperlink to='stage/handling-user-input'>Stage</Hyperlink>
            {' class. Each sprite has a public '}
            <InlineCode>pointerEvents</InlineCode>
            {' variable. (See '}
            <Hyperlink to='types/stage/PointerEventsCollection'>types/stage/PointerEventsCollection</Hyperlink>
            {'.) This is what the sprite references each time it is drawn to determine if it should call its pointer event handlers. '}
            <strong>{'If you are using the '}<InlineCode>Stage</InlineCode>{' class, this is automated for you. '}</strong>
            {'Otherwise, you will need to manually update the pointer events collection of each root sprite. (Collections are cascaded down during rendering.) '}
            <strong>Note that for most sprites, the sprite's <Hyperlink>bounds</Hyperlink> (rectangular) are not used to determine whether or not a pointer event occurred on the sprite,{' '}
            rather the sprite's actual <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath">path</a> is used.{' '}
            Also, clicks on the sprite's children will register for the sprite.</strong>
        </p>

        <br />
        <CodeHeader header="sprite.onClick: (sprite: Sprite, event: PointerEvent, position: PositionType) => void" />
        <p>
            {'Assuming that the sprite\'s '}
            <InlineCode>pointerEvents</InlineCode>
            {' collection is properly set up, this callback will be called when a pointerDown event occurs on the sprite. '}
            {'The sprite will pass itself as the first argument, the pointer event as the second argument, and the position of the pointer event on the canvas as the third argument. '}
            <strong>For all point events, <InlineCode>position</InlineCode> is relative to the current canvas context when the sprite is rendered. </strong>
            {'So even if several parent sprites are scaled, rotated, or translated, both '}
            <InlineCode>position</InlineCode>
            {' and the sprite will agree on the origin, scale, and rotation of the canvas context. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnClick((sprite, event, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <CodeHeader header="sprite.onDrag: (sprite: Sprite, event: PointerEvent, position: PositionType) => void" />
        <p>
            {'This callback is called for each pointerMove event that occurs on the sprite after it has been clicked, before the pointer has been released. '}
            {'Note that the pointer does not have to be on the sprite for this function to be called. '}
            {'The sprite will pass itself as the first argument, the pointer event as the second argument, and the position of the pointer event on the canvas as the third argument. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnDrag((sprite, event, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <CodeHeader header="sprite.onRelease: (sprite: Sprite, event: PointerEvent, position: PositionType) => void" />
        <p>
            {'This callback is called when the pointer is released after the sprite has been clicked. '}
            {'The sprite will pass itself as the first argument, the pointer event as the second argument, and the position of the pointer event on the canvas as the third argument. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnRelease((sprite, event, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <CodeHeader header="sprite.onHover: (sprite: Sprite, position: PositionType) => void" />
        <p>
            {'This callback is called every frame a pointerMove event occurs over the sprite. '}
            {'The sprite will pass itself as the first argument and the position of the pointer event on the canvas as the second argument. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnHover((sprite, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <CodeHeader header="sprite.onHoverEnd: (sprite: Sprite, position: PositionType) => void" />
        <p>
            {'This callback is called once when the sprite transitions from being hovered to not being hovered. '}
            {'The sprite will pass itself as the first argument and the position of the pointer event on the canvas as the second argument. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnHoverEnd((sprite, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <p>
            Here is a demo of all five callbacks:
        </p>
        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage';
            import { Line, Ellipse, TextSprite } from 'sharc/Sprites';
            import { Colors, Easing } from 'sharc/Utils';
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            stage.root.addChildren(new Line({
                \tbounds: Line.Bounds(-300, 200 - (400/3), 300, 200 - (400/3)),
                \tcolor: Colors.White,
                \tlineWidth: 5,
            }), new Line({
                \tbounds: Line.Bounds(-300, 200 - (800 / 3), 300, 200 - (800/3)),
                \tcolor: Colors.White,
                \tlineWidth: 5,
            }))

            stage.root.addChildren(new Ellipse({
                \tbounds: Ellipse.Bounds(-225, 200 - (400 / 6), 40),
                \tcolor: Colors.FloralWhite,
                \tstroke: {lineWidth: 8},
                \tname: 'click-test',
                \tdetails: [0] // used to store number of clicks
            }).addChild(new TextSprite({
                \ttext: 'Click Me!',
                \tcolor: Colors.FloralWhite,
                \tposition: {x: 70, y: -23},
                \tscale: {x: 1, y: -1},
                \tfontSize: 60,
                \tbold: true,
            })));

            stage.root.addChildren(new Ellipse({
                \tbounds: Ellipse.Bounds(-225, 200 - (1200 / 6), 40),
                \tcolor: Colors.Yellow,
                \tstroke: {lineWidth: 8},
                \tname: 'drag-test',
            }).addChild(new TextSprite({
                \ttext: 'Drag Me!',
                \tcolor: Colors.Yellow,
                \tposition: {x: 70, y: -23},
                \tscale: {x: 1, y: -1},
                \tfontSize: 60,
                \tbold: true,
            })));

            stage.root.addChildren(new Ellipse({
                \tbounds: Ellipse.Bounds(-225, 200 - (2000 / 6), 40),
                \tcolor: Colors.Aqua,
                \tstroke: {lineWidth: 8},
                \tname: 'hover-test',
            }).addChild(new TextSprite({
                \ttext: 'Hover Me!',
                \tcolor: Colors.Aqua,
                \tposition: {x: 70, y: -23},
                \tscale: {x: 1, y: -1},
                \tfontSize: 60,
                \tbold: true,
            })));

            const clickTest = stage.root.findChild('click-test')!;
            const dragTest = stage.root.findChild('drag-test')!;
            const hoverTest = stage.root.findChild('hover-test')!;

            clickTest.setOnClick((sprite, event, position) => {
                \tconst clickCount = sprite.get('details') as number[];
                \tsprite.set('details', [clickCount[0] + 1]);
                \tsprite.children[0].set('text', \`\${clickCount[0] + 1} clicks\`);
                \tsprite.getChannel(0).enqueue( // bounce animation
                \t\t{property: 'scaleX', from: 1, to: 0.8, duration: 10, delay: 0, easing: Easing.Bounce(Easing.EASE_IN_OUT)},
                    \t\t1
                    \t)
            });

            dragTest.setOnDrag((sprite, event, position) => {
                \tconst topBoundary = stage.root.children[0].get('centerY') - 40;
                \tconst bottomBoundary = stage.root.children[1].get('centerY') + 40;
                \tif (position.y < topBoundary && position.y > bottomBoundary) {
                    \t\tsprite.set('center', position);
                    \t}
            });

            dragTest.setOnRelease((sprite, event, position) => {
                \tsprite.getChannel(0).enqueue( // return to original position
                \t\t{property: 'center', from: null, to: {x: -225, y: 200 - (1200 / 6)}, duration: 20, delay: 0, easing: Easing.LINEAR},
                    \t\t1
                    \t);
            });

            hoverTest.setOnHover((sprite, position) => {
                \tsprite.set('color', Colors.Orange);
                \tsprite.children[0].set('text', 'Unhover Me!');
                \tsprite.children[0].set('color', Colors.Orange);
            });

            hoverTest.setOnHoverEnd((sprite, position) => {
                \tsprite.set('color', Colors.Aqua);
                \tsprite.children[0].set('text', 'Hover Me!');
                \tsprite.children[0].set('color', Colors.Aqua);
            });

            stage.loop();`} />
    </>
}

export function Strokeable() {

    useEffect(() => {window.scrollTo(0, 0)}, []);
    return <>
        <h1>Strokeable Sprites</h1>
        <p>
            {'Every sprite (except for '}
            <Hyperlink to='sprites/line'>Line</Hyperlink>
            {') inherits from an abstract class called '}
            <InlineCode>StrokeableSprite</InlineCode>
            {', which allows you to draw a stroke around the sprite. '}
            {'The '}
            <InlineCode>StrokeableSprite</InlineCode>
            {' class has the following properties:'}
        </p>
        <br />
        <p>
        <CodeBlurb blurb={[`stroke?: `, `StrokeType`]} /> - Aggregate Property. <InlineCode>stroke</InlineCode> is a <InlineCode>StrokeType</InlineCode> object, which means it has these keys:
        </p>
        <br />
        <p>
            {'\u00A0\u00A0\u00A0\u00A0\u00A0'}<CodeBlurb blurb={['color?: ', 'ColorType']} /> - the color of the stroke. Defaults to <InlineCode>{'{red: 0, green: 0, blue: 0, alpha: 1}'}</InlineCode>.{' '}
            Corresponds to the hidden aggregate property <CodeBlurb blurb={["strokeColor"]} />, and the hidden properties <CodeBlurb blurb={["strokeRed"]} />, <CodeBlurb blurb={["strokeGreen"]} />, <CodeBlurb blurb={["strokeBlue"]} />, and <CodeBlurb blurb={["strokeAlpha"]} />.
            <br />
            <br />
            {'\u00A0\u00A0\u00A0\u00A0\u00A0'}<CodeBlurb blurb={['lineWidth?: ', 'number']} /> - the width of the stroke. Defaults to 1. Corresponds to the hidden property <CodeBlurb blurb={["strokeWidth"]} /> .
            <br />
            <br />
            {'\u00A0\u00A0\u00A0\u00A0\u00A0'}<CodeBlurb blurb={['lineCap?: ', '"butt"|"round"|"square"']} /> - the style of the stroke's end caps. Defaults to <InlineCode>"butt"</InlineCode>. Corresponds to the hidden property <CodeBlurb blurb={["strokeCap"]} /> .
            <br />
            <br />
            {'\u00A0\u00A0\u00A0\u00A0\u00A0'}<CodeBlurb blurb={['lineDash?: ', 'number']} /> - the length of the stroke's dashes. Defaults to 0. Corresponds to the hidden property <CodeBlurb blurb={["strokeDash"]} /> .
            <br />
            <br />
            {'\u00A0\u00A0\u00A0\u00A0\u00A0'}<CodeBlurb blurb={['lineDashGap?: ', 'number']} /> - the length of the stroke's gaps. Defaults to <InlineCode>lineDash ?? 0</InlineCode>. Corresponds to the hidden property <CodeBlurb blurb={["strokeDashGap"]} /> .
            <br />
            <br />
            {'\u00A0\u00A0\u00A0\u00A0\u00A0'}<CodeBlurb blurb={['lineDashOffset?: ', 'number']} /> - the offset of the stroke's dashes. Defaults to 0. Corresponds to the hidden property <CodeBlurb blurb={["strokeDashOffset"]} /> .
            <br />
            <br />
            {'\u00A0\u00A0\u00A0\u00A0\u00A0'}<CodeBlurb blurb={['lineJoin?: ', '"bevel"|"round"|"miter"']} /> - the style of the stroke's corners. Defaults to <InlineCode>"miter"</InlineCode>. Corresponds to the hidden property <CodeBlurb blurb={["strokeJoin"]} /> .
        </p>
    </>
}


export function LinePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const line = new Line({
            bounds: Line.Bounds(-100, -100, 100, 100),
            color: Colors.White,
            lineWidth: 10,
        });

        stage.root.addChild(line);

        const properties = ['corner1', 'corner2'];
        const colors = [Colors.Red, Colors.Blue];

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = line.get(property as 'corner1');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                line.set(property as 'corner1', position);
            }
            stage.root.addChild(handle);
        }

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Line</h1>
        <p>
            Draws a line from <InlineCode>(x1, y1)</InlineCode> to <InlineCode>(x2, y2)</InlineCode> based on the sprites' <Hyperlink>bounds</Hyperlink>.
        </p>
        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { Line, Ellipse } from 'sharc/Sprites'
            import { Colors } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);
            const root = stage.root;

            const line = new Line({
                \tbounds: Line.Bounds(-100, -100, 100, 100),
                \tcolor: Colors.White,
                \tlineWidth: 10,
            });

            root.addChild(line);

            const properties = ['corner1', 'corner2'];
            const colors = [Colors.Red, Colors.Blue];

            for (const idx in properties) {
                \tconst property = properties[idx];
                \tconst color = colors[idx];
                \tconst position = line.get(property as 'corner1');
                \tconst handle = new Ellipse({
                    \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
                    \t\tcolor: color,
                    \t\tstroke: {lineWidth: 3},
                    \t});
                \thandle.onDrag = (sprite, _, position) => {
                    \t\tsprite.set('center', position);
                    \t\tline.set(property as 'corner1', position);
                    \t}
                \troot.addChild(handle);
            }

            stage.loop();` } />
        <br />
        <h3>LineProperties</h3>
        <p>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['bounds', 'color?', 'scale?', 'rotation?', 'alpha?', 'effects?', 'name?', 'details?'].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={[prop]} />{' '}
                    </>
                })
            }
        </p>
        <p>
            <CodeBlurb blurb={['lineWidth?: ', 'number']} /> - the width of the line. Defaults to 1. Normal Property.
            <br />
            <br />
            <CodeBlurb blurb={['lineCap?: ', '"butt"|"round"|"square"']} /> - the style of the line's end caps. Defaults to <InlineCode>"butt"</InlineCode>. Normal Property.
            <br />
            <br />
            <CodeBlurb blurb={['lineDash?: ', 'number']} /> - the length of the line's dashes. Defaults to 0. Normal Property.
            <br />
            <br />
            <CodeBlurb blurb={['lineDashGap?: ', 'number']} /> - the length of the line's gaps. Defaults to <InlineCode>lineDash ?? 0</InlineCode>. Normal Property.
            <br />
            <br />
            <CodeBlurb blurb={['lineDashOffset?: ', 'number']} /> - the offset of the line's dashes. Defaults to 0. Normal Property.
        </p>
        <br />
        <br />
        <CodeHeader header="Line.Bounds(x1: number, y1: number, x2: number, y2: number) -> BoundsType" />
        <p>
            Helper function. Returns a{' '}
            <Hyperlink to='types/common/boundstype'>BoundsType</Hyperlink>
            {' object with the given values. '}
        </p>
    </>
}

export function RectPage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const rect = new Rect({
            bounds: Rect.Bounds(-100, -100, 200, 200),
            color: Colors.White,
            stroke: {
                lineWidth: 5,
                lineJoin: 'round',
            },
            radius: [20]
        });

        const text = new TextSprite({
            text: 'Scroll to change corner radius',
            color: Colors.White,
            position: {x: 0, y: -150},
            scale: {x: 1, y: -1},
            positionIsCenter: true,
            fontSize: 30,
        });

        stage.root.addChildren(rect, text);

        const properties = ['corner1', 'corner2'];
        const colors = [Colors.Red, Colors.Blue];

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = rect.get(property as 'corner1');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                rect.set(property as 'corner1', position);
            }
            stage.root.addChild(handle);
        }

        stage.onScroll = (_, event) => {
            const radius = rect.get('radius') as number[];
            const newRadius = radius[0] + event.deltaY / 30;
            rect.set('radius', [Math.max(0, Math.min(500, newRadius))]);
        };

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Rect</h1>
        <p>
            Draws a rectangle based on the sprites' <Hyperlink>bounds</Hyperlink>. 
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { Rect, Ellipse, TextSprite } from 'sharc/Sprites'
            import { Colors } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const rect = new Rect({
                \tbounds: Rect.Bounds(-100, -100, 200, 200),
                \tcolor: Colors.White,
                \tstroke: {
                    \t\tlineWidth: 5,
                    \t\tlineJoin: 'round',
                    \t},
                \tradius: [20]
            });

            const text = new TextSprite({
                \ttext: 'Scroll to change corner radius',
                \tcolor: Colors.White,
                \tposition: {x: 0, y: -150},
                \tscale: {x: 1, y: -1},
                \tpositionIsCenter: true,
                \tfontSize: 30,
            });

            stage.root.addChildren(rect, text);

            const properties = ['corner1', 'corner2'];
            const colors = [Colors.Red, Colors.Blue];
            
            for (const idx in properties) {
                \tconst property = properties[idx];
                \tconst color = colors[idx];
                \tconst position = rect.get(property as 'corner1');
                \tconst handle = new Ellipse({
                    \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
                    \t\tcolor: color,
                    \t\tstroke: {lineWidth: 3},
                    \t});
                \thandle.onDrag = (sprite, _, position) => {
                    \t\tsprite.set('center', position);
                    \t\trect.set(property as 'corner1', position);
                    \t}
                \tstage.root.addChild(handle);
            }

            stage.onScroll = (_, event) => {
                \tconst radius = rect.get('radius') as number[];
                \tconst newRadius = radius[0] + event.deltaY / 30;
                \trect.set('radius', [Math.max(0, Math.min(500, newRadius))]);
            };

            stage.loop();`} />
        <br />
        <h3>RectProperties</h3>
        <p style={{lineHeight: '2em'}}>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['bounds?', 'color?', 'scale?', 'rotation?', 'alpha?', 'effects?', 'name?', 'details?'].map((prop, idx) => {
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
            <CodeBlurb blurb={['startAngle?: ', 'number']} /> - the angle at which the ellipse's path begins in degrees. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['endAngle?: ', 'number']} /> - the angle at which the ellipse's path ends in degrees. Defaults to 360. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
                <CodeBlurb blurb={['radius?: ', 'RadiusType']} /> - the radii length of the rectangle's corners.{' '}
                <Hyperlink to='types/sprites/radiustype'>RadiusType.</Hyperlink> Defaults to [0]. Normal Property.
        </p>
        <br />
        <br />
        <CodeHeader header="Rect.Bounds(x: number, y: number, w: number, h: number) -> BoundsType" />
        <p>
            {'Helper function. Returns a '}
            <Hyperlink to='types/sprite/BoundsType'>BoundsType</Hyperlink>
            {' object with a corner at '}
            <InlineCode>(x, y)</InlineCode>
            {' and width '} <InlineCode>w</InlineCode> {' and height '} <InlineCode>h</InlineCode>.
        </p>
    </>
}

export function EllipsePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const ellipse = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 100),
            color: Colors.White,
            stroke: {
                lineWidth: 5,
                lineJoin: 'round',
            }
        });

        const properties = ['corner1', 'corner2'];
        const colors = [Colors.Red, Colors.Blue];

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = ellipse.get(property as 'corner1');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                ellipse.set(property as 'corner1', position);
            }
            stage.root.addChild(handle);
        }
        
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
            name: 'angleLine',
        }), new Ellipse({
            bounds: Ellipse.Bounds(-250, 0, 12),
            color: Colors.GoldenRod,
            stroke: {lineWidth: 3},
            name: 'startAngle',
        }), new Ellipse({
            bounds: Ellipse.Bounds(250, 0, 12),
            color: Colors.Gold,
            stroke: {lineWidth: 3},
            name: 'endAngle',
        }));

        stage.root.addChildren(ellipse, sliderLayer);
        

        function updateSlider() {
            const sliderLine = sliderLayer.findChild('angleLine') as Line;
            sliderLine.set('corner1', sliderLayer.findChild('startAngle')!.get('center'));
            sliderLine.set('corner2', sliderLayer.findChild('endAngle')!.get('center'));
            let startAngle = sliderLayer.findChild('startAngle')!.get('centerX') as number;
            let endAngle = sliderLayer.findChild('endAngle')!.get('centerX') as number;
            startAngle = (startAngle + 250) / 500 * 360;
            endAngle = (endAngle + 250) / 500 * 360;
            ellipse.set('startAngle', startAngle);
            ellipse.set('endAngle', endAngle);
        }

        sliderLayer.findChild('startAngle')!.onDrag = (sprite, _, position) => {
            const endAngle = sliderLayer.findChild('endAngle')!;
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = Math.round(posX);
            posX = Math.min(posX, endAngle.get('centerX') - 24);
            sprite.set('centerX', posX);
            updateSlider();
        }

        sliderLayer.findChild('endAngle')!.onDrag = (sprite, _, position) => {
            const startAngle = sliderLayer.findChild('startAngle')!;
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = Math.round(posX);
            posX = Math.max(posX, startAngle.get('centerX') + 24);
            sprite.set('centerX', posX);
            updateSlider();
        }

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Ellipse</h1>
        <p>
            Draws an ellipse based on the sprites' <Hyperlink>bounds</Hyperlink>. It can also be used to draw arcs.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { Ellipse, Line, NullSprite } from 'sharc/Sprites'
            import { Colors } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const ellipse = new Ellipse({
                \tbounds: Ellipse.Bounds(0, 0, 100),
                \tcolor: Colors.White,
                \tstroke: {
                    \t\tlineWidth: 5,
                    \t\tlineJoin: 'round',
                    \t}
            });

            const properties = ['corner1', 'corner2'];
            const colors = [Colors.Red, Colors.Blue];
            
            for (const idx in properties) {
                \tconst property = properties[idx];
                \tconst color = colors[idx];
                \tconst position = ellipse.get(property as 'corner1');
                \tconst handle = new Ellipse({
                    \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
                    \t\tcolor: color,
                    \t\tstroke: {lineWidth: 3},
                \t});
                \thandle.onDrag = (sprite, _, position) => {
                    \t\tsprite.set('center', position);
                    \t\tellipse.set(property as 'corner1', position);
                \t}
                \tstage.root.addChild(handle);
            }

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
                \tname: 'angleLine',
            }), new Ellipse({
                \tbounds: Ellipse.Bounds(-250, 0, 12),
                \tcolor: Colors.GoldenRod,
                \tstroke: {lineWidth: 3},
                \tname: 'startAngle',
            }), new Ellipse({
                \tbounds: Ellipse.Bounds(250, 0, 12),
                \tcolor: Colors.Gold,
                \tstroke: {lineWidth: 3},
                \tname: 'endAngle',
            }));

            stage.root.addChildren(ellipse, sliderLayer);

            function updateSlider() {
                \tconst sliderLine = sliderLayer.findChild('angleLine') as Line;
                \tsliderLine.set('corner1', sliderLayer.findChild('startAngle')!.get('center'));
                \tsliderLine.set('corner2', sliderLayer.findChild('endAngle')!.get('center'));
                \tlet startAngle = sliderLayer.findChild('startAngle')!.get('centerX') as number;
                \tlet endAngle = sliderLayer.findChild('endAngle')!.get('centerX') as number;
                \tstartAngle = (startAngle + 250) / 500 * 360;
                \tendAngle = (endAngle + 250) / 500 * 360;
                \tellipse.set('startAngle', startAngle);
                \tellipse.set('endAngle', endAngle);
            }

            sliderLayer.findChild('startAngle')!.onDrag = (sprite, _, position) => {
                \tconst endAngle = sliderLayer.findChild('endAngle')!;
                \tlet posX = Math.max(-250, Math.min(250, position.x));
                \tposX = Math.round(posX);
                \tposX = Math.min(posX, endAngle.get('centerX') - 24);
                \tsprite.set('centerX', posX);
                \tupdateSlider();
            }

            sliderLayer.findChild('endAngle')!.onDrag = (sprite, _, position) => {
                \tconst startAngle = sliderLayer.findChild('startAngle')!;
                \tlet posX = Math.max(-250, Math.min(250, position.x));
                \tposX = Math.round(posX);
                \tposX = Math.max(posX, startAngle.get('centerX') + 24);
                \tsprite.set('centerX', posX);
                \tupdateSlider();
            }

            stage.loop();`} />

        <h3>EllipseProperties</h3>
        <p style={{lineHeight: '2em'}}>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['bounds', 'color', 'scale', 'rotation', 'alpha', 'effects', 'name', 'details'].map((prop, idx) => {
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
            <CodeBlurb blurb={['startAngle?: ', 'number']} /> - the angle at which the ellipse's path begins in degrees. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['endAngle?: ', 'number']} /> - the angle at which the ellipse's path ends in degrees. Defaults to 360. Normal Property.
        </p>

        <h5>HiddenEllipseProperties</h5>
        <p>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['radius: ', 'number']} /> - the mean of the ellipse's x-axis and y-axis radii. Setting <InlineCode>radius</InlineCode> will set both radii to the same value. Calculated hidden property.
            <br />
            <br />
            <CodeBlurb blurb={['radiusX: ', 'number']} /> - the radius of the ellipse's x-axis. Calculated hidden property.
            <br />
            <br />
            <CodeBlurb blurb={['radiusY: ', 'number']} /> - the radius of the ellipse's y-axis. Calculated hidden property.
        </p>

    </>
}

export function BezierCurvePage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);
        
        const curve = new BezierCurve({
            start: {x: -100, y: -100},
            points: [
                {
                    control1: {x: -100, y: 50},
                    control2: {x: -25, y: -100},
                    end: {x: 100, y: -100},
                },
                {
                    control1: {x: 100, y: 50},
                    control2: {x: -50, y: 100},
                    end: {x: 100, y: 100},
                }
            ],
            color: Colors.White,
            stroke: {
                lineWidth: 5,
                lineJoin: 'round',
            }
        });

        stage.root.addChild(curve);
        const properties = ['start', 'control1-0', 'control2-0', 'end-0', 'control1-1', 'control2-1', 'end-1'];
        const colors = [Colors.Red, Colors.OrangeRed, Colors.Orange, Colors.Yellow, Colors.GreenYellow, Colors.Green, Colors.Blue];

        for (const idx of [0, 1, 2, 3]) {
            stage.root.addChild(new Line({
                bounds: Line.Bounds(0, 0, 0,0),
                color: {red: 0, green: 0, blue: 0, alpha: 0.75},
                lineDash: 12,
                lineDashGap: 12,
                lineWidth: 5,
                name: `line${idx}`,
            }))
        }

        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = curve.get(property as 'start');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                curve.set(property as 'start', position);
            }
            stage.root.addChild(handle);
        }
        
        
        stage.beforeDraw = () => {
            const line0 = stage.root.findChild('line0') as Line;
            const line1 = stage.root.findChild('line1') as Line;
            const line2 = stage.root.findChild('line2') as Line;
            const line3 = stage.root.findChild('line3') as Line;

            line0.set('corner1', curve.get('start'));
            line0.set('corner2', curve.get('control1-0'));
            line1.set('corner1', curve.get('control2-0'));
            line1.set('corner2', curve.get('end-0'));
            line2.set('corner1', curve.get('end-0'));
            line2.set('corner2', curve.get('control1-1'));
            line3.set('corner1', curve.get('control2-1'));
            line3.set('corner2', curve.get('end-1'));
        }


        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>BezierCurve</h1>
        <p>
            Draws one or more cubic Bézier curve. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the curve, which can cause unexpected behavior.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { BezierCurve, Ellipse, Line } from 'sharc/Sprites'
            import { Colors } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const curve = new BezierCurve({
                \tstart: {x: -100, y: -100},
                \tpoints: [
                    \t\t{
                        \t\t\tcontrol1: {x: -100, y: 50},
                        \t\t\tcontrol2: {x: -25, y: -100},
                        \t\t\tend: {x: 100, y: -100},
                    \t\t},
                    \t\t{
                        \t\t\tcontrol1: {x: 100, y: 50},
                        \t\t\tcontrol2: {x: -50, y: 100},
                        \t\t\tend: {x: 100, y: 100},
                    \t\t}
                \t],
                \tcolor: Colors.White,
                \tstroke: {
                    \t\tlineWidth: 5,
                    \t\tlineJoin: 'round',
                    \t}
            });

            stage.root.addChild(curve);

            const properties = ['start', 'control1-0', 'control2-0', 'end-0', 'control1-1', 'control2-1', 'end-1'];
            const colors = [Colors.Red, Colors.OrangeRed, Colors.Orange, Colors.Yellow, Colors.GreenYellow, Colors.Green, Colors.Blue];

            for (const idx of [0, 1, 2, 3]) {
                \tstage.root.addChild(new Line({
                    \t\tbounds: Line.Bounds(0, 0, 0,0),
                    \t\tcolor: {red: 0, green: 0, blue: 0, alpha: 0.75},
                    \t\tlineDash: 12,
                    \t\tlineDashGap: 12,
                    \t\tlineWidth: 5,
                    \t\tname: \`line\${idx}\`,
                \t}))
            }

            for (const idx in properties) {
                \tconst property = properties[idx];
                \tconst color = colors[idx];
                \tconst position = curve.get(property as 'start');
                \tconst handle = new Ellipse({
                    \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
                    \t\tcolor: color,
                    \t\tstroke: {lineWidth: 3},
                \t});
                \thandle.onDrag = (sprite, _, position) => {
                    \t\tsprite.set('center', position);
                    \t\tcurve.set(property as 'start', position);
                \t}
                \tstage.root.addChild(handle);
            }

            stage.beforeDraw = () => {
                \tconst line0 = stage.root.findChild('line0') as Line;
                \tconst line1 = stage.root.findChild('line1') as Line;
                \tconst line2 = stage.root.findChild('line2') as Line;
                \tconst line3 = stage.root.findChild('line3') as Line;
                \tline0.set('corner1', curve.get('start'));
                \tline0.set('corner2', curve.get('control1-0'));
                \tline1.set('corner1', curve.get('control2-0'));
                \tline1.set('corner2', curve.get('end-0'));
                \tline2.set('corner1', curve.get('end-0'));
                \tline2.set('corner2', curve.get('control1-1'));
                \tline3.set('corner1', curve.get('control2-1'));
                \tline3.set('corner2', curve.get('end-1'));
            }

            stage.loop();`} />

        <h3>BezierCurveProperties</h3>
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
            <CodeBlurb blurb={['start: ', 'PositionType']} /> - the starting point of the curve. Aggregate Property for <InlineCode>startX</InlineCode> and <InlineCode>startY</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['points: ', 'BezierPoint[]']} /> - an array of <Hyperlink to='types/sprite/BezierPoint'>BezierPoint</Hyperlink> objects. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['closePath?: ', 'boolean']} /> - whether or not the curve is closed. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', '"nonzero"|"evenodd"']} /> - the fill rule of the curve. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
        </p>

        <h5>HiddenBezierCurveProperties</h5>
        <p style={{lineHeight: '2em'}}>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['control1-N: ', 'PositionType']} /> - the first control point of the Nth curve on the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['control2-N: ', 'PositionType']} /> - the second control point of the Nth curve on the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['end-N: ', 'PositionType']} /> - the end point of the Nth curve on the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['curve-N: ', 'BezierPoint']} /> - the Nth curve on the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startX: ', 'number']} /> - the number of curves on the path. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['startY: ', 'number']} /> - the number of curves on the path. Hidden property.
        </p>
    </>
}

export function PathPage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const path = new Path({
            path: [
                {x: -100, y: -100},
                {x: -50, y: 50},
                {x: 50, y: -50},
                {x: 100, y: 100},
            ],
            color: Colors.White,
            stroke: {lineWidth: 5},
            closePath: false,
        });

        const properties = ['point-0', 'point-1', 'point-2', 'point-3'];
        const colors = [Colors.Red, Colors.Yellow, Colors.Purple, Colors.Blue];

        stage.root.addChildren(path);
        for (const idx in properties) {
            const property = properties[idx];
            const color = colors[idx];
            const position = path.get(property as 'corner1');
            const handle = new Ellipse({
                bounds: Ellipse.Bounds(position.x, position.y, 12),
                color: color,
                stroke: {lineWidth: 3},
            });
            handle.onDrag = (sprite, _, position) => {
                sprite.set('center', position);
                path.set(property as 'corner1', position);
            }
            stage.root.addChild(handle);
        }
        
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
            path.set('start', startRatio);
            path.set('end', endRatio);
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
        <h1>Path</h1>
        <p>
            Draws a series of straight lines. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the path, which can cause unexpected behavior.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { Ellipse, Line, Path, NullSprite } from 'sharc/Sprites'
            import { Colors } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const path = new Path({
                \tpath: [
                    \t\t{x: -100, y: -100},
                    \t\t{x: -50, y: 50},
                    \t\t{x: 50, y: -50},
                    \t\t{x: 100, y: 100},
                \t],
                \tcolor: Colors.White,
                \tstroke: {lineWidth: 5},
                \tclosePath: false,
            });

            const properties = ['point-0', 'point-1', 'point-2', 'point-3'];
            const colors = [Colors.Red, Colors.Yellow, Colors.Purple, Colors.Blue];
            
            stage.root.addChildren(path);

            for (const idx in properties) {
                \tconst property = properties[idx];
                \tconst color = colors[idx];
                \tconst position = path.get(property as 'corner1');
                \tconst handle = new Ellipse({
                    \t\tbounds: Ellipse.Bounds(position.x, position.y, 12),
                    \t\tcolor: color,
                    \t\tstroke: {lineWidth: 3},
                \t});
                \thandle.onDrag = (sprite, _, position) => {
                    \t\tsprite.set('center', position);
                    \t\tpath.set(property as 'corner1', position);
                \t}
                \tstage.root.addChild(handle);
            }

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
                \tpath.set('start', startRatio);
                \tpath.set('end', endRatio);
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

            stage.loop();`} />

        <h3>PathProperties</h3>
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
            <CodeBlurb blurb={['path: ', 'PositionType[]']} /> - an array of <Hyperlink to='types/common/positiontype'>PositionType</Hyperlink> objects that represent the points of the path. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['closePath?: ', 'boolean']} /> - whether or not the path is closed. Defaults to <InlineCode>false</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', '"nonzero"|"evenodd"']} /> - the fill rule of the path. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['start: ','number']} /> - the ratio of the path's length at which the path begins. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['end: ','number']} /> - the ratio of the path's length at which the path ends. Defaults to 1. Normal Property.
        </p>

        <h5>HiddenPathProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['point-N: ', 'PositionType']} /> - the Nth point of the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>  
            <CodeBlurb blurb={['x-N: ', 'number']} /> - the x-coordinate of the Nth point of the path. Zero-indexed. Hidden property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['y-N: ', 'number']} /> - the y-coordinate of the Nth point of the path. Zero-indexed. Hidden property.
        </p>
    </>
}

export function PolygonPage() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const polygon = new Polygon({
            center: {x: 0, y: 0},
            sides: 6,
            radius: 100,
            rotation: 30,
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
            polygon.set('center', position);
            radiusHandle.set('center', {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY});
        });

        const radiusHandle = new Ellipse({
            bounds: Ellipse.Bounds(0, 100, 12),
            color: Colors.Blue,
            stroke: {lineWidth: 3}
        }).setOnDrag((sprite, _, position) => {
            const center = polygon.get('center');
            const radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
            polygon.set('radius', radius || 0.1);
            sprite.set('center', position);
            polygon.set('rotation', Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI);
        });

        stage.root.addChildren(polygon, handle, radiusHandle);
        
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
            polygon.set('start', startRatio);
            polygon.set('end', endRatio);
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

        const sidesSliderLayer = new NullSprite({position: {x: 0, y: 167.5}});

        sidesSliderLayer.addChildren(...sliderLayer.children.map(sprite => sprite.copy()));

        sidesSliderLayer.removeChild(sidesSliderLayer.findChild('endRatio')!);
        sidesSliderLayer.findChild('ratioLine')!.set('name', 'sidesLine');
        sidesSliderLayer.findChild('sidesLine')!.set('x2', -250/3);
        sidesSliderLayer.findChild('startRatio')!.set('name', 'sides-count');
        sidesSliderLayer.findChild('sides-count')!.set('centerX', -250/3);
        sidesSliderLayer.findChild('sides-count')!.set('color', Colors.Lime);

        sidesSliderLayer.findChild('sides-count')!.onDrag = (sprite, _, position) => {
            let posX = Math.max(-250, Math.min(250, position.x));
            posX = (250 + posX) / 500 * 9;
            const sides = Math.max(3, Math.min(12, Math.round(posX + 3)));
            posX = -250 + (sides - 3) / 9 * 500;
            sprite.set('centerX', posX);
            polygon.set('sides', sides);
            sidesSliderLayer.findChild('sidesLine')!.set('corner2', {x: posX, y: 0});
        }

        stage.root.addChild(sidesSliderLayer);

        stage.loop();

        return () => {
            stage.stop();
        }

    }, [canvasRef]);
    return <>
        <h1>Polygon</h1>
        <p>
            Draws a regular n-sided polygon. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the polygon, which can cause unexpected behavior.
        </p>
        <p>
            Note that <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> are hidden properties, but <strong>not</strong> hidden calculated properties. The <em>bounds</em> are calculated from the center, not the other way around.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { Ellipse, Line, Polygon, NullSprite } from 'sharc/Sprites'
            import { Colors } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const polygon = new Polygon({
                \tcenter: {x: 0, y: 0},
                \tsides: 6,
                \tradius: 100,
                \trotation: 30,
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
                \tpolygon.set('center', position);
                \tradiusHandle.set('center', {x: radiusHandlePos.x + deltaX, y: radiusHandlePos.y + deltaY});
            });

            const radiusHandle = new Ellipse({
                \tbounds: Ellipse.Bounds(0, 100, 12),
                \tcolor: Colors.Blue,
                \tstroke: {lineWidth: 3}
            }).setOnDrag((sprite, _, position) => {
                \tconst center = polygon.get('center');
                \tconst radius = Math.sqrt(Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2));
                \tpolygon.set('radius', radius || 0.1);
                \tsprite.set('center', position);
                \tpolygon.set('rotation', Math.atan2(position.y - center.y, position.x - center.x) * 180 / Math.PI);
            });

            stage.root.addChildren(polygon, handle, radiusHandle);

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
                \tpolygon.set('start', startRatio);
                \tpolygon.set('end', endRatio);
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

            const sidesSliderLayer = new NullSprite({position: {x: 0, y: 167.5}});

            sidesSliderLayer.addChildren(...sliderLayer.children.map(sprite => sprite.copy()));
            
            sidesSliderLayer.removeChild(sidesSliderLayer.findChild('endRatio')!);
            sidesSliderLayer.findChild('ratioLine')!.set('name', 'sidesLine');
            sidesSliderLayer.findChild('sidesLine')!.set('x2', -250/3);
            sidesSliderLayer.findChild('startRatio')!.set('name', 'sides-count');
            sidesSliderLayer.findChild('sides-count')!.set('centerX', -250/3);
            sidesSliderLayer.findChild('sides-count')!.set('color', Colors.Lime);

            sidesSliderLayer.findChild('sides-count')!.onDrag = (sprite, _, position) => {
                \tlet posX = Math.max(-250, Math.min(250, position.x));
                \tposX = (250 + posX) / 500 * 9;
                \tconst sides = Math.max(3, Math.min(12, Math.round(posX + 3)));
                \tposX = -250 + (sides - 3) / 9 * 500;
                \tsprite.set('centerX', posX);
                \tpolygon.set('sides', sides);
                \tsidesSliderLayer.findChild('sidesLine')!.set('corner2', {x: posX, y: 0});
            }

            stage.root.addChild(sidesSliderLayer);

            stage.loop();`} />
        <h3>PolygonProperties</h3>
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
            <CodeBlurb blurb={['sides: ', 'number']} /> - the number of sides of the polygon. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['center: ', 'PositionType']} /> - the center of the polygon. Aggregate Property for <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['radius: ', 'number']} /> - the radius of the polygon. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['fillRule?: ', 'CanvasFillRule']} /> - the fill rule of the polygon. Defaults to <InlineCode>"nonzero"</InlineCode>. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['start?: ', 'number']} /> - the ratio of the polygon's length at which the polygon begins. Defaults to 0. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['end?: ', 'number']} /> - the ratio of the polygon's length at which the polygon ends. Defaults to 1. Normal Property.
        </p>
    </>
}

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

        <CodeShowcase code={`import { Stage } from 'sharc/Stage'
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

export function TextPage() {
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        const text = new TextSprite({
            text: 'Hello, World!',
            position: {x: 0, y: 0},
            fontSize: 80,
            scale: {x: 1, y: -1},
            positionIsCenter: true,
            bold: true,
            color: Colors.White,
            effects: (ctx) => {
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 15;
            }
        });

        text.getChannel(0).push({
            property: 'color', from: null, to: () => {return {
                red: Math.random() * 100 + 155,
                green: Math.random() * 100 + 155,
                blue: Math.random() * 100 + 155,
                alpha: 1
            }}, duration: 120, delay: 0, easing: Easing.EASE_IN_OUT
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
            Draws text. If you're using a centered-style root node, you will have to set the text's <InlineCode>scaleY</InlineCode> value to a negative number for the text to display correctly. Does <strong>not</strong> use <Hyperlink>bounds</Hyperlink> in its constructor, but properties such as <InlineCode>center</InlineCode>, <InlineCode>centerX</InlineCode> and <InlineCode>centerY</InlineCode> can still be accessed and modified.{' '}
            It is not recommended to modify properties such as <InlineCode>bounds</InlineCode>, <InlineCode>x1</InlineCode> and <InlineCode>y2</InlineCode>, because the area of the bounds may not match the area of the text, which can cause unexpected behavior.
        </p>

        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage'
            import { TextSprite } from 'sharc/Sprites'
            import { Colors, Easing } from 'sharc/Utils'

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const text = new TextSprite({
                \ttext: 'Hello, World!',
                \tposition: {x: 0, y: 0},
                \tpositionIsCenter: true,
                \tfontSize: 80,
                \tscale: {x: 1, y: -1},
                \tbold: true,
                \tcolor: Colors.White,
                \teffects: (ctx) => {
                    \t\tctx.shadowColor = 'black';
                    \t\tctx.shadowBlur = 15;
                \t}
            });

            text.getChannel(0).push({
                \tproperty: 'color', from: null, to: () => {return {
                    \t\tred: Math.random() * 100 + 155,
                    \t\tgreen: Math.random() * 100 + 155,
                    \t\tblue: Math.random() * 100 + 155,
                    \t\talpha: 1
                \t}}, duration: 120, delay: 0, easing: Easing.EASE_IN_OUT
            }, {loop: true});

            stage.root.addChild(text);

            stage.loop();`} />

        <h3>TextProperties</h3>
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
            <CodeBlurb blurb={['text: ', 'string']} /> - the text to be drawn. Normal Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['position: ', 'PositionType']} /> - the position of the text. See <InlineCode>positionIsCenter</InlineCode> below. Aggregate Property for <InlineCode>positionX</InlineCode> and <InlineCode>positionY</InlineCode>. Normal Property.
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
            <CodeBlurb blurb={['positionX: ', 'number']} /> - the x-coordinate of the text position. Hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['positionY: ', 'number']} /> - the y-coordinate of the text position. Hidden Property.
        </p>

    </>
}

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

        stage.onPointerMove = (stage, _, position) => {
            nullsprite.set('position', position);
        }

        nullsprite.getChannel(0).push({
            property: 'rotation', from: 0, to: 360, duration: 120, delay: 0, easing: Easing.LINEAR
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
            NullSprites have 0 width and 0 height. However, when it is their turn to be rendered, they still apply their <InlineCode>position</InlineCode>, <InlineCode>scale</InlineCode>, <InlineCode>rotation</InlineCode>, <InlineCode>alpha</InlineCode> and <InlineCode>effects</InlineCode> properties to the canvas.{' '}
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
                \tcenter: {x: 0, y: 75},
                \tradius: 100,
                \tcolor: Colors.White,
                \tstroke: {lineWidth: 5},
            });
            
            const nullsprite = new NullSprite({});
            
            nullsprite.addChild(star);
            stage.root.addChild(nullsprite);
            
            stage.onPointerMove = (_, _, position) => {
                \tnullsprite.set('position', position);
            }
            
            nullsprite.getChannel(0).push({
                \tproperty: 'rotation', from: 0, to: 360, duration: 120, delay: 0, easing: Easing.LINEAR
            }, {loop: true});
            
            stage.loop();`} canvasRef={canvasRef} />
        
        <h3>NullSpriteProperties</h3>
        <p style={{lineHeight: '2em'}}>
            <CodeBlurb blurb={['position: ', 'PositionType']} /> - the position of the NullSprite. Remember, NullSprites have 0 width and 0 height. Aggregate Property for <InlineCode>positionX</InlineCode> and <InlineCode>positionY</InlineCode>.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            Inherited from <Hyperlink to='sprites/default/universal-sprite-properties'>Sprite:</Hyperlink>
            {'\u00A0\u00A0\u00A0'}
            {
                ['color?', 'scale?', 'rotation?', 'alpha?', 'effects?', 'name?', 'details?'].map((prop, idx) => {
                    return <>
                        <CodeBlurb key={idx} blurb={[prop]} />{' '}
                    </>
                })
            }
        </p>

        <h5>HiddenNullSpriteProperties</h5>
        <p style={{lineHeight: '2em'}}>
            <CodeBlurb blurb={['positionX: ', 'number']} /> - the x-coordinate of the NullSprite's position. Hidden Property.
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['positionY: ', 'number']} /> - the y-coordinate of the NullSprite's position. Hidden Property.
        </p>
    </>
}