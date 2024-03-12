# Easing

Every animation requires an `EasingType` function, which is a function that takes in a number (which will be from 0 to 1 inclusive) and returns a number (also from 0 to 1 inclusive). You can write your own easing function or use the ones provided in `sharc-js/Utils`. Also, `Easing.Bounce(curve: EasingType)` takes in an easing function and returns a new easing function that plays the original easing function in reverse after the halfway point, thus "bouncing" the animation. You can see a demonstration of that [here](animation/distribute).

~~~ts
// sharc-js/Utils

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
