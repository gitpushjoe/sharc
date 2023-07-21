import { BoundsType, ColorType, CurveType, PositionType } from "./Common";
import { ScaleType } from "./Shapes";

export type AnimationCallback<PropertyType> = PropertyType extends any ? SingularCallback<PropertyType> : never;

type SingularCallback<PropertyType> = (property: PropertyType) => PropertyType;

export type AnimationType<ValidProperties> = {
    [K in keyof ValidProperties]: {
        property: K, 
        from: ValidProperties[K], 
        to: ValidProperties[K], 
        duration: number,
        delay: number,
        easing: CurveType,
        frame?: number,
        channel?: number,
        fromSaved?: ValidProperties[K],
        toSaved?: ValidProperties[K],
    }}[keyof ValidProperties]

export type AcceptedTypesOf<Properties> = Properties[keyof Properties];

export type AnimationParams = {
    loop?: boolean,
    iterations?: number,
    delay?: number,
}

export type AnimationPackage<ValidProperties> = {
    animations: AnimationType<ValidProperties>[],
    params: AnimationParams
}

export type SPECIAL_PROEPRTY_TYPES = ColorType|BoundsType|ScaleType|PositionType;
export type DEFAULT_PROPERTY_TYPES = number|SPECIAL_PROEPRTY_TYPES;

export type HiddenLineProperties = {
     lineWidth: number;
     lineCap: CanvasLineCap;
}