# Animation

[]
## What is an animation?

An animation is a progression of a sprite's [property](sprites/properties) from one value to another over a period of time. Any property can be animated, as long as it maps to a number or an object containing numbers (e.g. `position`, `scale`, `color`, etc.). For example, below, we create an animation that represents moving a `NullSprite` from `(0, 0)` to `(100, 100)`. Notice that animations use the type [c:AnimationType]().

~~~js
import { AnimationType } from 'sharc-js/types/Animation'
import { NullSprite } from 'sharc-js/Sprites'
import { Colors, Easing } from 'sharc-js/Utils'

const animation: AnimationType<NullSprite> = {
    property: 'position',         // a string representing the property to animate (required)
    f​rom: {x: 0, y: 0},             // the original value (required)
    to: {x: 100, y: 100},         // the target value (required)
    duration: 1000,                // the duration of the animation in frames (defaults to 60)
    delay: 0,                     // the number of frames to wait before starting the animation (defaults to 0)
    easing: Easing.LINEAR,        // the easing function to use (defaults to Easing.LINEAR)
    name: 'move',                 // a name for the animation (defaults to '')
};
~~~

[]

Note that `AnimationType` is a generic type, meaning that it requires a type argument. The type argument represents the type of sprite that the animation will be applied to, and `AnimationType` will use this to infer which properties can be animated, and which values are valid for those properties. When you try to add an animation to a sprite, all of this is handled for you, and sharc will even remove some properties that would be allowed in the above example, like `effects` and `enabled`.

For example, if you were to try to animate the "sides" of a line (which is not a valid property), you would get a Typescript error like this:

~~~js
import { Line } from 'sharc/Sprites'

const myLine = new Line({});

myLine.channels[0].push({
    property: 'sides',     // Type '"sides"' is not assignable to type "bounds" | "color" | "alpha" ...
    . . .
};
~~~

[]

Furthermore, if you were to try to animate the color of a line (which is a valid property), but you were to use an invalid color, you would get a Typescript error like this:

~~~js
myLine.channels[0].push({
    property: 'color',
    f​rom: Colors.Red,
    to: 'blue',     // Type 'string' is not assignable to type '... | (ColorType & Record<string, number>) | ...'.
    . . .
};
~~~
