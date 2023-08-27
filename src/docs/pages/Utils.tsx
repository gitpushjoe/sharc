import { LinkContainer } from "react-router-bootstrap";
import CodeBlock from "../components/Code/Block";
import InlineCode from "../components/Code/Inline";
import { Hyperlink } from "../components/Sidebar/Hyperlink";
import { useParams } from "react-router";
import { useEffect } from "react";

export default function Utils () {

    const params = useParams();

    useEffect(() => {
        const element = document.getElementById(params.section!);
        if (element) 
            element.scrollIntoView();
        else
            window.scrollTo(0, 0);
    }, [params]);

    return <>
        <h1>Utils</h1>
        <p>
            Found in <InlineCode>sharc/utils</InlineCode>.{' '}
            Contains utility functions and more.
        </p>

        <br />
        <h4>Position</h4>
        <p>
            Creates a <InlineCode>PositionType</InlineCode> object.
        </p>
        <CodeBlock code={
            `export function Position(x: number, y: number): PositionType {
                \treturn { x, y }
            }` } />

        <br />
        <h4 id='color'>Color</h4>
        <p>
            Creates a <InlineCode>ColorType</InlineCode> object.
        </p>
        <CodeBlock code={
            `export function Color(red: number, green: number, blue: number, alpha: number = 1): ColorType {
                \treturn { red, green, blue, alpha }
            }` } />

        <br />
        <h4 id="colors">Colors</h4>
        <p>
            An object containing all CSS colors as <InlineCode>ColorType</InlineCode> objects.
        </p>
        <CodeBlock code={
            `export const Colors = {
                \tAliceBlue: Color(240, 248, 255),
                \tAntiqueWhite: Color(250, 235, 215),
                \tAqua: Color(0, 255, 255),
                \t . . .
                \tYellow: Color(255, 255, 0),
                \tYellowGreen: Color(154, 205, 50),
                \tNone: Color(0, 0, 0, 0),
                \tTransparent: Color(0, 0, 0, 0)
            }` } />
        
        <br />
        <h4>ColorToString</h4>
        <p>
            Converts a <InlineCode>ColorType</InlineCode> object to a CSS color string.
        </p>
        <CodeBlock code={
            `export function ColorToString(color: ColorType): string {
                \treturn \`rgba(\${color.red}, \${color.green}, \${color.blue}, \${color.alpha})\`
            }` } />
                
        <br />
        <h4>Animate</h4>
        <p>
            Creates a valid <InlineCode>AnimationType</InlineCode> object. <br />
            <InlineCode>duration</InlineCode> defaults to <InlineCode>60</InlineCode>. <br />
            <InlineCode>delay</InlineCode> defaults to <InlineCode>0</InlineCode>. <br />
            <InlineCode>easing</InlineCode> defaults to <InlineCode>{`(x: number) => x`}</InlineCode>. <br />
            <InlineCode>name</InlineCode> defaults to <InlineCode>''</InlineCode>. <br />
            <InlineCode>details</InlineCode> defaults to <InlineCode>[]</InlineCode>. <br />
            Note that when using this function inside of <InlineCode>sprite.push()</InlineCode> or <InlineCode>sprite.distribute()</InlineCode>, the <InlineCode>properties</InlineCode> type will be automatically inferred and is not necessary.
        </p>
        <CodeBlock code={
            `export function Animate<properties>(
                \tproperty: keyof properties, 
                \tfrom: (properties[keyof properties] & (number|Record<string, number>))|null,
                \tto: (properties[keyof properties] & (number|Record<string, number>))|AnimationCallback<properties[keyof properties] & (number|Record<string, number>)>,
                \tduration: number = 60, 
                \tdelay: number = 0, 
                \teasing: EasingType = Easing.LINEAR,
                \tname: string = '',
                \tdetails: (string|number)[] = []): AnimationType<properties> {
                \t\treturn { property, from, to, duration, delay, easing, name, details };
            }` } />

        <br />
        <h4>AnimateTo</h4>
        <p>
            Creates a valid <InlineCode>AnimationType</InlineCode> object with <LinkContainer to='/docs/animation/smart-animations'><a><InlineCode>from</InlineCode> set to <InlineCode>null</InlineCode>.</a></LinkContainer> <br />
            See above for the default values.
        </p>
        <CodeBlock code={
            `export function AnimateTo<properties>(
                \tproperty: keyof properties, 
                \tto: (properties[keyof properties] & (number|Record<string, number>))|AnimationCallback<properties[keyof properties] & (number|Record<string, number>)>,
                \tduration: number = 60, 
                \tdelay: number = 0, 
                \teasing: EasingType = Easing.LINEAR,
                \tname: string = '',
                \tdetails: (string|number)[] = []): AnimationType<properties> {
                \t\treturn { property, from: null, to, duration, delay, easing, name, details };
            }` } />
        
        <br />
        <h4>Easing</h4>
        <p>
            An object containing easing functions.
        </p>
        <CodeBlock code={
            `export const Easing = {
                \tLINEAR: (x: number) => x,
                \tEASE_IN: (x: number) => 1 - Math.pow(1 - x, 2),
                \tEASE_OUT: (x: number) => x * x,
                \tEASE_IN_OUT: (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
                \tEASE_IN_CUBIC: (x: number) => 1 - Math.pow(1 - x, 3),
                \tEASE_OUT_CUBIC: (x: number) => x * x * x,
                \tEASE_IN_OUT_CUBIC: (x: number) => x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2,
                \tBounce: (curve: EasingType) => {return (x: number) => x < 0.5 ? curve(x * 2) : curve(2 * (1 - x))},
            }` } />
        
        <br />
        <h4>Corners</h4>
        <p>
            Creates a <InlineCode>BoundsType</InlineCode> object from (<InlineCode>x1</InlineCode>, <InlineCode>y1</InlineCode>) to (<InlineCode>x2</InlineCode>, <InlineCode>y2</InlineCode>).
        </p>
        <CodeBlock code={
            `export function Corners(x1: number, y1: number, x2: number, y2: number): BoundsType {
                \treturn { x1, y1, x2, y2 }
            }` } />
        

        <br />
        <h4>Dimensions</h4>
        <p>
            Creates a <InlineCode>BoundsType</InlineCode> object from (<InlineCode>x</InlineCode>, <InlineCode>y</InlineCode>) to (<InlineCode>x + width</InlineCode>, <InlineCode>y + height</InlineCode>).
        </p>
        <CodeBlock code={
            `export function Dimensions(x: number, y: number, width: number, height: number): BoundsType {
                \treturn { 
                    \t\tx1: x, 
                    \t\ty1: y, 
                    \t\tx2: x + width, 
                    \t\ty2: y + height
                \t}
            }` } />

        <br />
        <h4>CenterBounds</h4>
        <p>
            Creates a <InlineCode>BoundsType</InlineCode> object centered at (<InlineCode>x</InlineCode>, <InlineCode>y</InlineCode>) with width <InlineCode>width</InlineCode> and height <InlineCode>height</InlineCode>.
            <br />
            <InlineCode>height</InlineCode> defaults to <InlineCode>width</InlineCode>.
        </p>
        <CodeBlock code={
            `export function CenterBounds(x: number, y: number, width: number, height?: number): BoundsType {
                \treturn { 
                    \t\tx1: x - width / 2, 
                    \t\ty1: y - height / 2, 
                    \t\tx2: x + width / 2, 
                    \t\ty2: y + (height ?? width) / 2
                \t}
            }` } />

        <br />
        <h4>CircleBounds</h4>
        <p>
            Creates a <InlineCode>BoundsType</InlineCode> object centered at (<InlineCode>x</InlineCode>, <InlineCode>y</InlineCode>) with a width of <InlineCode>radius * 2</InlineCode> and a height of <InlineCode>radiusY * 2</InlineCode>.
            <br />
            <InlineCode>radiusY</InlineCode> defaults to <InlineCode>radius</InlineCode>.
        </p>
        <CodeBlock code={
            `export function CircleBounds(x: number, y: number, radius: number, radiusY?: number): BoundsType {
                \treturn { 
                    \t\tx1: x - radius, 
                    \t\ty1: y - (radiusY ?? radius), 
                    \t\tx2: x + radius, 
                    \t\ty2: y + (radiusY ?? radius)
                \t}
            }` } />
        
        <br />
        <h4>addCallback</h4>
        <p>
            Returns a callback that takes in a number and returns that number + <InlineCode>value</InlineCode>.{' '}
            Useful for creating <Hyperlink to='animation/smart-animations'>smart animations</Hyperlink>.
        </p>
        <CodeBlock code={
            `export function addCallback(value: number): AnimationCallback<number> {
                \treturn (property: number) => property + value
            }` } />
        
        <br />
        <h4>addXCallback</h4>
        <p>
            Returns a callback that takes in a <InlineCode>PositionType</InlineCode> and returns that position with <InlineCode>x</InlineCode>: <InlineCode>x + value</InlineCode>.{' '}
        </p>
        <CodeBlock code={
            `export function addXCallback(value: number): AnimationCallback<PositionType> {
                \treturn (property: PositionType) => Position(property.x + value, property.y)
            }` } />

        <br />
        <h4>addYCallback</h4>
        <p>
            Returns a callback that takes in a <InlineCode>PositionType</InlineCode> and returns that position with <InlineCode>y</InlineCode>: <InlineCode>y + value</InlineCode>.{' '}
        </p>
        <CodeBlock code={
            `export function addYCallback(value: number): AnimationCallback<PositionType> {
                \treturn (property: PositionType) => Position(property.x, property.y + value)
            }` } />
        
        <br />
        <h4>addPositionCallback</h4>
        <p>
            Returns a callback that takes in a <InlineCode>PositionType</InlineCode> and returns that position shifted by (<InlineCode>x</InlineCode>, <InlineCode>y</InlineCode>).{' '}
        </p>
        <CodeBlock code={
            `export function addPositionCallback(x: number, y: number): AnimationCallback<PositionType> {
                \treturn (property: PositionType) => Position(property.x + x, property.y + y)
            }` } />

        <br />
        <h4>getX1Y1WH</h4>
        <p>
            Takes in a <InlineCode>BoundsType</InlineCode> and returns an array containing <InlineCode>[x1, y1, w, h]</InlineCode> where {' '}
            (<InlineCode>x1</InlineCode>, <InlineCode>y1</InlineCode>) is the top-left corner of the bounds and <InlineCode>w</InlineCode> and <InlineCode>h</InlineCode> are the width and height of the bounds.
        </p>
        <CodeBlock code={
            `export function getX1Y1WH(bounds: BoundsType): [number, number, number, number] {
                \treturn [bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1]
            }` } />

    </>
}