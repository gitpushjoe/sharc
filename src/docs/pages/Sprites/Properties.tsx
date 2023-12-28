import { useEffect } from "react";
import CodeBlock from "../../components/Code/Block";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";
import { useParams } from "react-router";

export function Properties() {

    const params = useParams();
    useEffect(() => {
        switch (params.section) {
            case 'universal-sprite-properties':
                const element = document.getElementById(params.section!);
                element ? element.scrollIntoView() : window.scrollTo(0, 0);
                break;
        }
    }, []);
    return <>
        <h1>Properties</h1>
        <p>
            <InlineCode>Properties</InlineCode> defines the attributes and attribute types that a sprite can have. For example, the type <InlineCode>LineProperties</InlineCode> contains <InlineCode>{'{lineWidth?: number}'}</InlineCode>{' '}
            and the type <InlineCode>Polygon</InlineCode> contains <InlineCode>{'{sides: number}'}</InlineCode>. Each sprite type <a href="https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses">implements</a>{' '}
            its own <InlineCode>Properties</InlineCode> type (<InlineCode>Line</InlineCode> implements <InlineCode>LineProperties</InlineCode>, <InlineCode>Rect</InlineCode> implements <InlineCode>RectProperties</InlineCode>, etc.).{' '}
            This means you can access and modify these properties directly on the sprite, and if you're using Typescript, they will be typed correctly.{' '}

            <CodeBlock code={
            `const circle = new Ellipse({});
            circle.color = {red: 255, green: 0, blue: 0, alpha: 1};
            const radius = circle.radius; 
            circle.radius = radius + '10'; // Type 'string' is not assignable to type 'number | [number, number]'.
            `} />
        </p>

        <br />
        <h3>Property Visibility and Type</h3>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <p>
            Many of the properties seem to overlap with each other (for example, the <InlineCode>color</InlineCode> property and the <InlineCode>red</InlineCode> property) so{' '}
            it may be unclear how this information is actually stored or retrieved. Because of this, every property has been given a <strong>visibility</strong> and a <strong>type</strong>.{' '}
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <p>
        <h4>Property Visibility</h4>
        <p>
            <strong>Visible Properties</strong> are passed into the constructor. For example, all of the properties in <InlineCode>TextProperties</InlineCode> are visible, since{' '}
            in order to make a <InlineCode>TextSprite</InlineCode>, you must first pass in a <InlineCode>TextProperties</InlineCode> object.{' '}For the rest of this documentation,{' '}
            every property that is not explicitly stated as hidden is visible.{' '}
        </p>
        <p>
            <strong>Hidden Properties</strong> are not passed into the constructor, but are still accessible. For example, if you want to make a <InlineCode>Rect</InlineCode>,{' '}
            you can specify the <InlineCode>color</InlineCode> by passing in a color object, which contains values for <InlineCode>red</InlineCode>, <InlineCode>green</InlineCode>, <InlineCode>blue</InlineCode>, and <InlineCode>alpha</InlineCode>.{' '}
            Then, if you want to change the <InlineCode>green</InlineCode> property specifically, you can do that as well.
            <CodeBlock code={
            `const rect = new Rect({color: {red: 255, green: 0, blue: 0, alpha: 1}});
            rect.green = 255;
            `} />
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <h4>Property Type</h4>
        <p>
            <strong>Normal Properties</strong> are atomic. They are stored as-is, and do not affect any other normal properties. For example, here is the source code for the property <InlineCode>x1</InlineCode>:
            <CodeBlock code={
            `public get x1(): number { return this.properties.x1; }
            public set x1(value: number) { this.properties.x1 = value; }
            `} />
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <p>
            <strong>Aggregate Properties</strong> are properties that consist of other normal properties. Retrieving or modifying an aggregate property will retrieve or modify the normal properties that make it up.{' '}
            For example, here is the source code for the property <InlineCode>bounds</InlineCode>:
            <CodeBlock code={
            `public get bounds(): BoundsType { return Corners(this.x1, this.y1, this.x2, this.y2); }
            public set bounds(value: BoundsType) { 
                \tthis.x1 = value.x1;
                \tthis.y1 = value.y1;
                \tthis.x2 = value.x2;
                \tthis.y2 = value.y2;
            }
            `} />
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <p>
            <strong>Calculated Properties</strong> are calculated from other properties. They aren't simply made up of other properties, but are calculated from them.{' '}For example, here is the source code for the property <InlineCode>width</InlineCode>:
            <CodeBlock code={
                `public get width(): number { return Math.abs(this.x2 - this.x1); }
                public set width(value: number) { 
                    \tconst centerX = this.centerX;
                    \tthis.x1 = centerX - value / 2;
                    \tthis.x2 = centerX + value / 2;
                }`} />
        </p>

            <br />
            <h3 id='universal-sprite-properties'>Universal Sprite Properties</h3>
            <p>
                (Note: This correlates to the types <InlineCode>DEFAULT_PROPERTIES</InlineCode> and <InlineCode>HIDDEN_SHAPE_PROPERTIES</InlineCode>.)
            </p>
            <p>
                <CodeBlurb blurb={['bounds>: ', 'BoundsType']} /> - the <Hyperlink>bounds</Hyperlink> of the sprite. Defaults to <InlineCode>{`{x1: 0, y1: 0, x2: 0, y2: 0}`}</InlineCode>. Aggregate Property for <em>x1</em>, <em>y1</em>, <em>x2</em>, and <em>y2</em>.
                <br />
                <em>{' * Note that '}
                <Hyperlink>BezierCurve</Hyperlink>{', '}
                <Hyperlink>Path</Hyperlink>{', '}
                <Hyperlink>Ellipse</Hyperlink>{', '}
                <Hyperlink>Polygon</Hyperlink>{', and '}
                <Hyperlink>TextSprite</Hyperlink>{', and '}
                <Hyperlink>LabelSprite</Hyperlink>{' do not use bounds in their constructors, but instead calculate the bounds once instantiated. Bounds are explicitly required for all other sprites.'}</em>
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
                <CodeBlurb blurb={['blur?: ', 'number']} /> - the blur amount of the sprite in pixels. Defaults to 0. Normal Property.
                <br />
                <br />
                <CodeBlurb blurb={['gradient?: ', 'CanvasGradient|null']} /> - the gradient of the sprite. <InlineCode>ctx.fillStyle</InlineCode> will be set to this gradient if present, overwriting <InlineCode>color</InlineCode>. Defaults to <InlineCode>null</InlineCode>. Normal Property. 
                <br />
                <br />
                <CodeBlurb blurb={['effects?: ', '(ctx: CanvasRenderingContext2D) => void']} /> - This function will be called on the canvas context before the sprite is drawn. Useful for things like blurs and drop shadows. Normal Property. Defaults to <InlineCode>{'() => {}'}</InlineCode>.
                <br />
                <br />
                <CodeBlurb blurb={['name?: ', 'string']} /> - the name of the sprite. Does not need to be unique. It can be useful for debugging and finding specific child sprites. Defaults to <InlineCode>""</InlineCode>. Normal Property.
                <br />
                <br />
                <CodeBlurb blurb={['enabled?: ', 'boolean']} /> - whether or not the sprite is enabled. If it is not enabled, it and its children will not be drawn. Defaults to <InlineCode>true</InlineCode>. Normal Property.
                <br />
                <br />
                <CodeBlurb blurb={['channelCount?: ', 'number']} /> - the number of <Hyperlink to='animation/channels'>animation channels</Hyperlink> the sprite has. Defaults to 0. Normal Property.
                <br />
                <br />
                <CodeBlurb blurb={['details?: ', 'DetailsType']} /> - See <Hyperlink to='sprites/details'>Sprites/Details</Hyperlink>. Defaults to <InlineCode>undefined</InlineCode>.
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