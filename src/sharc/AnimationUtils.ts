import { Shape } from "./Sprite";
import { Easing, Position } from "./Utils";
import { AnimationCallback, AnimationType, EasingType } from "./types/Animation";
import { PositionType } from "./types/Common";

export function FadeIn(
    durationOrSprite = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = 0,
    to: number | AnimationCallback<number> = 1,
    name = ""
): AnimationType<{ alpha: number }> {
    return {
        property: "alpha",
        from,
        to,
        duration: durationOrSprite,
        delay,
        easing,
        name
    };
}

export function FadeInSprite(
    sprite: Shape,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = 0,
    to: number | AnimationCallback<number> = 1,
    name = ""
): AnimationType<{ alpha: number }> {
    const property = FadeIn(duration, delay, easing, from, to, name);
    sprite.distribute([[property]]);
    return property;
}

export function FadeOut(
    durationOrSprite = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = 1,
    to: number | AnimationCallback<number> = 0,
    name = ""
): AnimationType<{ alpha: number }> {
    return {
        property: "alpha",
        from,
        to,
        duration: durationOrSprite,
        delay,
        easing,
        name
    };
}

export function FadeOutSprite(
    sprite: Shape,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = 1,
    to: number | AnimationCallback<number> = 0,
    name = ""
): AnimationType<{ alpha: number }> {
    const property = FadeOut(duration, delay, easing, from, to, name);
    sprite.distribute([[property]]);
    return property;
}

const randomPosition = () => {
    return { x: Math.random() * 100, y: Math.random() * 100 };
};

export function Translate(
    to: PositionType | AnimationCallback<PositionType> = randomPosition,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: PositionType | null = null,
    name = ""
): AnimationType<{ center: PositionType }> {
    return { property: "center", from, to, duration, delay, easing, name };
}

export function TranslateSprite(
    sprite: Shape,
    to: PositionType | AnimationCallback<PositionType> = randomPosition,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: PositionType | null = null,
    name = ""
): AnimationType<{ center: PositionType }> {
    const property = Translate(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}

export function Grow(
    to = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scale: PositionType }> {
    return {
        property: "scale",
        from: from ? Position(from, from) : null,
        to: (pos: PositionType) => Position(pos.x * to, pos.y * to),
        duration,
        delay,
        name,
        easing
    };
}

export function Shrink(
    to = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scale: PositionType }> {
    return Grow(1 / to, duration, delay, easing, from, name);
}

export function GrowSprite(
    sprite: Shape,
    to = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scale: PositionType }> {
    const property = Grow(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}

export function ShrinkSprite(
    sprite: Shape,
    to = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scale: PositionType }> {
    return GrowSprite(sprite, 1 / to, duration, delay, easing, from, name);
}

export function Rotate(
    to: number | AnimationCallback<number> = 360,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ rotation: number }> {
    return { property: "rotation", from, to, duration, delay, easing, name };
}

export function RotateSprite(
    sprite: Shape,
    to: number | AnimationCallback<number> = 360,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ rotation: number }> {
    const property = Rotate(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}

export function Scale(
    to: number | AnimationCallback<number> = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scale: number }> {
    return { property: "scale", from, to, duration, delay, easing, name };
}

export function ScaleSprite(
    sprite: Shape,
    to: number | AnimationCallback<number> = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scale: number }> {
    const property = Scale(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}

export function ScaleX(
    to: number | AnimationCallback<number> = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scaleX: number }> {
    return { property: "scaleX", from, to, duration, delay, easing, name };
}

export function ScaleXSprite(
    sprite: Shape,
    to: number | AnimationCallback<number> = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scaleX: number }> {
    const property = ScaleX(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}

export function ScaleY(
    to: number | AnimationCallback<number> = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scaleY: number }> {
    return { property: "scaleY", from, to, duration, delay, easing, name };
}

export function ScaleYSprite(
    sprite: Shape,
    to: number | AnimationCallback<number> = 2,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ scaleY: number }> {
    const property = ScaleY(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}

export function Blur(
    to: number | AnimationCallback<number> = 10,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ blur: number }> {
    return { property: "blur", from, to, duration, delay, easing, name };
}

export function BlurSprite(
    sprite: Shape,
    to: number | AnimationCallback<number> = 10,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = null,
    name = ""
): AnimationType<{ blur: number }> {
    const property = Blur(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}

export function Unblur(
    to: number | AnimationCallback<number> = 0,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = 10,
    name = ""
): AnimationType<{ blur: number }> {
    return Blur(to, duration, delay, easing, from, name);
}

export function UnblurSprite(
    sprite: Shape,
    to: number | AnimationCallback<number> = 0,
    duration = 30,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    from: number | null = 10,
    name = ""
): AnimationType<{ blur: number }> {
    const property = Unblur(to, duration, delay, easing, from, name);
    sprite.distribute([[property]]);
    return property;
}
