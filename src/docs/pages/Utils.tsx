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
            Found in <InlineCode>sharc-js/utils</InlineCode>.{' '}
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

        
        <br />
        <h4>addPositions</h4>
        <p>
            Takes in two <InlineCode>PositionType</InlineCode> objects and returns a <InlineCode>PositionType</InlineCode> object with the sum of the two positions.
        </p>
        <CodeBlock code={
            `export function addPositions(position1: PositionType, position2: PositionType): PositionType {
                \treturn Position(position1.x + position2.x, position1.y + position2.y);
            }` } />

        <br />
        <h4>subtractPositions</h4>
        <p>
            Takes in two <InlineCode>PositionType</InlineCode> objects and returns a <InlineCode>PositionType</InlineCode> object with the difference of the two positions.
        </p>
        <CodeBlock code={
            `export function subtractPositions(position1: PositionType, position2: PositionType): PositionType {
                \treturn Position(position1.x - position2.x, position1.y - position2.y);
            }` } />

        <br />
        <h4>multiplyPositions</h4>
        <p>
            Takes in two <InlineCode>PositionType</InlineCode> objects and returns a <InlineCode>PositionType</InlineCode> object with the product of the two positions.
        </p>
        <CodeBlock code={
            `export function multiplyPositions(position1: PositionType, position2: PositionType): PositionType {
                \treturn Position(position1.x * position2.x, position1.y * position2.y);
            }` } />

        <br />
        <h4>dividePositions</h4>
        <p>
            Takes in two <InlineCode>PositionType</InlineCode> objects and returns a <InlineCode>PositionType</InlineCode> object with the quotient of the two positions.
        </p>
        <CodeBlock code={
            `export function dividePositions(position1: PositionType, position2: PositionType): PositionType {
                \treturn Position(position1.x / position2.x, position1.y / position2.y);
            }` } />

    </>
}

export function AnimationUtils() {
	return <>
	<h1>AnimationUtils</h1>
	<p>
	    Found in <InlineCode>sharc-js/AnimationUtils</InlineCode>.{' '}
	    Contains utility functions for animations. For each function, like <InlineCode>FadeIn</InlineCode>, that returns an <InlineCode>AnimationType</InlineCode> object,{' '}
	    there is a coding <InlineCode>FadeInSprite</InlineCode> object, which takes in a sprite as its first argument, adds the animation to the sprite using <InlineCode>sprite.distribute</InlineCode>,{' '}
	    and returns the animation.
	</p>
	<br />
	<h4>FadeIn</h4>
	<p>
	    Fades in the sprite.
	</p>
	<CodeBlock code={
`export function FadeIn(
durationOrSprite: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = 0,
to: number|AnimationCallback<number> = 1,
name: string = '',):
AnimationType<{ alpha: number }> {
	return { property: 'alpha', from, to, duration: durationOrSprite, delay, easing, name };
}

export function FadeInSprite(
sprite: Shape,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = 0,
to: number|AnimationCallback<number> = 1,
name: string = '',):
AnimationType<{ alpha: number }> {
	const property = FadeIn(duration, delay, easing, from, to, name);
	sprite.distribute([[property]]);
	return property;
}

` } /> 
	<br />
	<h4>FadeOut</h4>
	<p>
	    Fades out the sprite.
	</p>
	<CodeBlock code={
`export function FadeOut(
durationOrSprite: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = 1,
to: number|AnimationCallback<number> = 0,
name: string = '',):
AnimationType<{ alpha: number }> {
	return { property: 'alpha', from, to, duration: durationOrSprite, delay, easing, name };
}

export function FadeOutSprite(
sprite: Shape,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = 1,
to: number|AnimationCallback<number> = 0,
name: string = '',):
AnimationType<{ alpha: number }> {
	const property = FadeOut(duration, delay, easing, from, to, name);
	sprite.distribute([[property]]);
	return property;
}` } /> 
	<br />
	<h4>Translate</h4>
	<p>
	    Moves the center of the sprite to a specific <InlineCode>PositionType</InlineCode>.
	</p>
	<CodeBlock code={
`const randomPosition = () => { return {x: Math.random() * 100, y: Math.random() * 100 } };

export function Translate(
to: PositionType|AnimationCallback<PositionType> = randomPosition,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: PositionType|null = null,
name: string = '',):
AnimationType<{ center: PositionType }> {
	return { property: 'center', from, to, duration, delay, easing, name };
}

export function TranslateSprite(
sprite: Shape,
to: PositionType|AnimationCallback<PositionType> = randomPosition,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: PositionType|null = null,
name: string = '',):
AnimationType<{ center: PositionType }> {
	const property = Translate(to, duration, delay, easing, from, name);
	sprite.distribute([[property]]);
	return property;
}` } /> 
	<br />
	<h4>Grow</h4>
	<p>
	    Scales the sprite by a specific factor.
	</p>
	<CodeBlock code={
`export function Grow(
to: number = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',):
AnimationType<{ scale: PositionType}> {
	return {
		property: 'scale',
		from: (from ? Position(from, from) : null),
		to: (pos: PositionType) => Position(pos.x * to, pos.y * to),
		duration,
		delay,
		name,
	};
}

export function GrowSprite(
sprite: Shape,
to: number = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',):
AnimationType<{ scale: PositionType }> {
	const property = Grow(to, duration, delay, easing, from, name);
	sprite.distribute([[property]]);
	return property;
}` } />

	<br />
	<h4>Shrink</h4>
	<p>
	    Scales the sprite by a specific factor.
	</p>
	<CodeBlock code={
`export function Shrink(
to: number = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',):
AnimationType<{scale: PositionType}> {
	return Grow(1 / to, duration, delay, easing, from, name);
}

export function ShrinkSprite(
sprite: Shape,
to: number = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ scale: PositionType }> {
	return GrowSprite(sprite, 1 / to, duration, delay, easing, from, name);
}` } />

	<br />
	<h4>Rotate</h4>
	<p>
	    Rotates the sprite by a specific angle.
	</p>
	<CodeBlock code={
`export function Rotate(
to: number|AnimationCallback<number> = 360,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ rotation: number }> {
	return { property: 'rotation', from, to, duration, delay, easing, name };
}

export function RotateSprite(
sprite: Shape,
to: number|AnimationCallback<number> = 360,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ rotation: number }> {
	const property = Rotate(to, duration, delay, easing, from, name);
	sprite.distribute([[property]]);
	return property;
}` } />

	<br />
	<h4>Scale</h4>
	<p>
	    Sets the scale of the sprite. 
	</p>
	<CodeBlock code={
`export function Scale(
to: number|AnimationCallback<number> = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ scale: number }> {
	return { property: 'scale', from, to, duration, delay, easing, name };
}

export function ScaleSprite(
sprite: Shape,
to: number|AnimationCallback<number> = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ scale: number }> {
	const property = Scale(to, duration, delay, easing, from, name);
	sprite.distribute([[property]]);
	return property;
}` } />

	<br />
	<h4>ScaleX</h4>
	<p>
	    Sets the horizontal scale of the sprite.
	</p>
	<CodeBlock code={
`export function ScaleX(
to: number|AnimationCallback<number> = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ scaleX: number }> {
	return { property: 'scaleX', from, to, duration, delay, easing, name };
}

export function ScaleXSprite(
sprite: Shape,
to: number|AnimationCallback<number> = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ scaleX: number }> {
	const property = ScaleX(to, duration, delay, easing, from, name);
	sprite.distribute([[property]]);
	return property;
}` } />

	<br />
	<h4>ScaleY</h4>
	<p>
	    Sets the vertical scale of the sprite.
	</p>
	<CodeBlock code={
`export function ScaleY(
to: number|AnimationCallback<number> = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ scaleY: number }> {
	return { property: 'scaleY', from, to, duration, delay, easing, name };
}

export function ScaleYSprite(
sprite: Shape,
to: number|AnimationCallback<number> = 2,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ scaleY: number }> {
	const property = ScaleY(to, duration, delay, easing, from, name);
	sprite.distribute([[property]]);
	return property;
}` } />

    <br />
    <h4>BlurSprite</h4>
    <p>
        Blurs the sprite.
    </p>
    <CodeBlock code={
`export function Blur(
to: number|AnimationCallback<number> = 10,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ blur: number }> {
	return { property: 'blur', from, to, duration, delay, easing, name };
}

export function BlurSprite(
sprite: Shape,
to: number|AnimationCallback<number> = 10,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = null,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ blur: number }> {
	const property = Blur(to, duration, delay, easing, from, name);
	sprite.distribute([[property]]);
	return property;
}`} />

    <br />
    <h4>UnblurSprite</h4>
    <p>
        Removes the blur from the sprite.
    </p>
    <CodeBlock code={
`export function Unblur(
to: number|AnimationCallback<number> = 0,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = 10,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ blur: number }> {
    return Blur(to, duration, delay, easing, from, name);
}

export function UnblurSprite(
sprite: Shape,
to: number|AnimationCallback<number> = 0,
duration: number = 30,
delay: number = 0,
easing: EasingType = Easing.LINEAR,
from: number|null = 10,
name: string = '',
details: (string|number)[] = []):
AnimationType<{ blur: number }> {
    const property = Unblur(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}` } />
</>
}