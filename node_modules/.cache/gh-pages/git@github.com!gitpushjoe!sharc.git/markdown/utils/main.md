# Utils

Found in `sharc-js/utils`. Contains utility functions and more.

[]
### Position

Creates a `PositionType` object.

~~~ts
export function Position(x: number, y: number): PositionType {
    return { x, y }
}
~~~

[]
### Color

Creates a `ColorType` object.
~~~ts
export function Color(red: number, green: number, blue: number, alpha: number = 1): ColorType {
    return { red, green, blue, alpha }
}
~~~

[]
### Colors

An object containing all CSS colors as `ColorType` objects.

~~~ts
export const Colors = {
    AliceBlue: Color(240, 248, 255),
    AntiqueWhite: Color(250, 235, 215),
    Aqua: Color(0, 255, 255),
    . . .
    Yellow: Color(255, 255, 0),
    YellowGreen: Color(154, 205, 50),
    None: Color(0, 0, 0, 0),
    Transparent: Color(0, 0, 0, 0)
}
~~~

[]
### ColorToString

Converts a `ColorType` object to a CSS color string.

~~~js
export function ColorToString(color: ColorType): string {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`
}
~~~

[]
### Animate

Creates a valid `AnimationType` object.
`duration` defaults to `60`.
`delay` defaults to `0`.
`easing` defaults to `(x: number) => x`.
`name` defaults to `''`.
`details` defaults to `[]`.
Note that when using this function inside of `sprite.push()` or `sprite.distribute()`, the `properties` type will be automatically inferred and is not necessary.

~~~ts
export function Animate<properties>(
    property: keyof properties, 
    fro​m: (properties[keyof properties] & (number|Record<string, number>))|null,
    to: (properties[keyof properties] & (number|Record<string, number>))|AnimationCallback<properties[keyof properties] & (number|Record<string, number>)>,
    duration: number = 60, 
    delay: number = 0, 
    easing: EasingType = Easing.LINEAR,
    name: string = '',
    details: (string|number)[] = []): AnimationType<properties> {
    return { property, f​rom, to, duration, delay, easing, name, details };
}
~~~

[]
### AnimateTo

Creates a valid `AnimationType` object with `from` set to `null`.
See above for the default values.

~~~ts
export function AnimateTo<properties>(
    property: keyof properties, 
    to: (properties[keyof properties] & (number|Record<string, number>))|AnimationCallback<properties[keyof properties] & (number|Record<string, number>)>,
    duration: number = 60, 
    delay: number = 0, 
    easing: EasingType = Easing.LINEAR,
    name: string = '',
    details: (string|number)[] = []): AnimationType<properties> {
    return { property, from: null, to, duration, delay, easing, name, details };
}
~~~

[]
### Easing

An object containing easing functions.
~~~ts
export const Easing = {
    LINEAR: (x: number) => x,
    EASE_IN: (x: number) => 1 - Math.pow(1 - x, 2),
    EASE_OUT: (x: number) => x * x,
    EASE_IN_OUT: (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    EASE_IN_CUBIC: (x: number) => 1 - Math.pow(1 - x, 3),
    EASE_OUT_CUBIC: (x: number) => x * x * x,
    EASE_IN_OUT_CUBIC: (x: number) => x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2,
    Bounce: (curve: EasingType) => {return (x: number) => x < 0.5 ? curve(x * 2) : curve(2 * (1 - x))},
}
~~~

[]
### Corners

Creates a `BoundsType` object from `(x1, y1)` to `(x2, y2).
~~~ts
export function Corners(x1: number, y1: number, x2: number, y2: number): BoundsType {
    return { x1, y1, x2, y2 }
}
~~~

[]
### Dimensions

Creates a `BoundsType` object from `(x, y)` to `(x + width, y + height)`.
~~~ts
export function Dimensions(x: number, y: number, width: number, height: number): BoundsType {
    return { 
        x1: x, 
        y1: y, 
        x2: x + width, 
        y2: y + height
    }
}
~~~

[]
### CenterBounds

Creates a `BoundsType` object centered at `(x, y)` with width `width` and height `height`.
`height` defaults to `width`.
~~~ts
export function CenterBounds(x: number, y: number, width: number, height?: number): BoundsType {
    return { 
        x1: x - width / 2, 
        y1: y - height / 2, 
        x2: x + width / 2, 
        y2: y + (height ?? width) / 2
    }
}
~~~

[]
### CircleBounds

Creates a `BoundsType` object centered at `(x, y)` with a width of `radius * 2` and a height of `radiusY * 2`.
`radiusY` defaults to `radius`.
~~~ts
export function CircleBounds(x: number, y: number, radius: number, radiusY?: number): BoundsType {
    return { 
        x1: x - radius, 
        y1: y - (radiusY ?? radius), 
        x2: x + radius, 
        y2: y + (radiusY ?? radius)
    }
}
~~~

[]
### addCallback

Returns a callback that takes in a number and returns that number + `value`. Useful for creating smart animations.
~~~ts
export function addCallback(value: number): AnimationCallback<number> {
    return (property: number) => property + value
}
~~~

[]
### addXCallback

Returns a callback that takes in a `PositionType` and returns that position with `x: x + value`.
~~~ts
export function addXCallback(value: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x + value, property.y)
}
~~~

[]
### addYCallback

Returns a callback that takes in a `PositionType` and returns that position with `y: y + value`.
~~~ts
export function addYCallback(value: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x, property.y + value)
}
~~~

[]
### addPositionCallback

Returns a callback that takes in a `PositionType` and returns that position shifted by `(x, y)`.
~~~ts
export function addPositionCallback(x: number, y: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x + x, property.y + y)
}
~~~

[]
### getX1Y1WH

Takes in a `BoundsType` and returns an array containing `[x1, y1, w, h]` where `(x1, y1)` is the top-left corner of the bounds and `w` and `h` are the `width` and `height` of the bounds.
~~~ts
export function getX1Y1WH(bounds: BoundsType): [number, number, number, number] {
    return [bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1]
}
~~~

[]
### addPositions

Takes in two `PositionType` objects and returns a `PositionType` object with the sum of the two positions.
~~~ts
export function addPositions(position1: PositionType, position2: PositionType): PositionType {
    return Position(position1.x + position2.x, position1.y + position2.y);
}
~~~

[]
### subtractPositions

Takes in two `PositionType` objects and returns a `PositionType` object with the difference of the two positions.
~~~ts
export function subtractPositions(position1: PositionType, position2: PositionType): PositionType {
    return Position(position1.x - position2.x, position1.y - position2.y);
}
~~~

[]
### multiplyPositions

Takes in two `PositionType` objects and returns a `PositionType` object with the product of the two positions.
~~~ts
export function multiplyPositions(position1: PositionType, position2: PositionType): PositionType {
    return Position(position1.x * position2.x, position1.y * position2.y);
}
~~~

[]
### dividePositions

Takes in two `PositionType` objects and returns a `PositionType` object with the quotient of the two positions.
~~~ts
export function dividePositions(position1: PositionType, position2: PositionType): PositionType {
    return Position(position1.x / position2.x, position1.y / position2.y);
}
~~~
