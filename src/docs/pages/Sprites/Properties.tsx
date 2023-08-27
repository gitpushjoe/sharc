import { useEffect } from "react";
import CodeBlock from "../../components/Code/Block";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

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