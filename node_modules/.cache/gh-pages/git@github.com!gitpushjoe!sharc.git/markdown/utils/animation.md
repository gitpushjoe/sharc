# AnimationUtils

Found in `sharc-js/AnimationUtils`. Contains utility functions for animations. For each function, like `FadeIn`, that returns an `AnimationType` object, there is a `FadeInSprite` object, which takes in a sprite as its first argument, adds the animation to the sprite using `sprite.distribute`, and returns the animation.

[]
### FadeIn

Fades in the sprite.
~~~ts
export function FadeIn(
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
~~~

[]
### FadeOut

Fades out the sprite.
~~~ts
export function FadeOut(
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
}
~~~

[]
### Translate

Moves the center of the sprite to a specific `PositionType`.
~~~ts
const randomPosition = () => { return {x: Math.random() * 100, y: Math.random() * 100 } };

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
}
~~~

### Grow

Scales the sprite by a specific factor.
~~~ts
export function Grow(
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
}
~~~

### Shrink

Scales the sprite by a specific factor.
~~~ts
export function Shrink(
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
}
~~~

[]
### Rotate

Rotates the sprite by a specific angle.
~~~ts
export function Rotate(
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
}
~~~

[]
### Scale

Sets the scale of the sprite.
~~~ts
export function Scale(
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
}
~~~

[]
### ScaleX

Sets the horizontal scale of the sprite.
~~~ts
export function ScaleX(
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
}
~~~

[]
### ScaleY

Sets the vertical scale of the sprite.
~~~ts
export function ScaleY(
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
}
~~~

[]
### BlurSprite

Blurs the sprite.
~~~ts
export function Blur(
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
}
~~~

[]
### UnblurSprite

Removes the blur from the sprite.
~~~ts
export function Unblur(
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
}
~~~
