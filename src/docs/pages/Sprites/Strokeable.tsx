import { useEffect } from "react";
import CodeBlurb from "../../components/Code/Blurb";
import InlineCode from "../../components/Code/Inline";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function Strokeable() {

    useEffect(() => {window.scrollTo(0, 0)}, []);
    return <>
        <h1>Strokeable Sprites</h1>
        <p>
            {'Every sprite (except for '}
            <Hyperlink to='sprites/line'>Line</Hyperlink>
            {' and '}
            <Hyperlink to='sprites/nullsprite'>NullSprite</Hyperlink>
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