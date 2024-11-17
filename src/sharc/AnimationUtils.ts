import { Easing, Position, Scale } from "./Utils";
import { AnimationCallback, AnimationType, EasingType } from "./types/Animation";
import { PositionType, ScaleType } from "./types/Common";

export function configureAnimation<propName extends string, propType = number>(
    property: propName,
    defaultFrom: propType | null,
    defaultTo: NonNullable<propType> | AnimationCallback<NonNullable<propType>>,
    defaultDuration = 30,
    defaultEasing = Easing.LINEAR
) {
    return (
        duration: number = defaultDuration,
        easing: EasingType = defaultEasing,
        from: propType | null = defaultFrom,
        to: NonNullable<propType> | AnimationCallback<NonNullable<propType>> = defaultTo,
        delay = 0,
        name = ""
    ): AnimationType<Record<propName, propType>> =>
        ({
            property,
            from,
            to,
            duration,
            delay,
            easing,
            name
        }) as unknown as AnimationType<Record<propName, propType>>;
}

export const fadeIn = configureAnimation("alpha", 0, 1);
export const fadeOut = configureAnimation("alpha", 1, 0);
export const rotate = configureAnimation("rotation", null, (rot: number) => rot + 360);
export const scale = configureAnimation("scale", null, (scale: ScaleType) => Scale.factor(scale, 2));
export const scaleX = configureAnimation("scaleX", null, (x: number) => x * 2);
export const scaleY = configureAnimation("scaleY", null, (y: number) => y * 2);
export const blur = configureAnimation("blur", null, 5);
export const unblur = configureAnimation("blur", null, 0);
export const shiftX = configureAnimation("centerX", null, (x: number) => x + 10);
export const shiftY = configureAnimation("centerY", null, (y: number) => y + 10);
export const shift = configureAnimation("center", null, (p: PositionType) => Position.sum(p, Position(10, 10)));
