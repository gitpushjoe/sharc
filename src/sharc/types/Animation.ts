import { Sprite } from "../BaseShapes";
import { BoundsType, ColorType, EasingType, PositionType } from "./Common";
import { ScaleType } from "./Shapes";

export type AnimationCallback<PropertyType> = PropertyType extends any ? SingularCallback<PropertyType> : never;

type SingularCallback<PropertyType> = (property: PropertyType) => PropertyType;

export type AnimationType<ValidProperties> = {
    [K in keyof ValidProperties]: {
        property: K, 
        from: Exclude<ValidProperties[K], string|boolean|PositionType[]|Array<any>>|null, 
        to: Exclude<ValidProperties[K], string|boolean|PositionType[]|Array<any>>|AnimationCallback<Exclude<ValidProperties[K], string|boolean|PositionType[]|Array<any>>>,
        duration: number,
        delay: number,
        easing: EasingType,
        frame?: number,
        channel?: number,
        details?: (string|number)[],
        name?: string,
        _from?: ValidProperties[K], // used by sprites to store the original value
        _to?: ValidProperties[K],
}}[keyof ValidProperties]

export type PublicAnimationType<ValidProperties> = {
    [K in keyof ValidProperties]: {
        property: K, 
        from: Exclude<ValidProperties[K], string|boolean|PositionType[]|Array<any>>|null, 
        to: Exclude<ValidProperties[K], string|boolean|PositionType[]|Array<any>>|AnimationCallback<Exclude<ValidProperties[K], string|boolean|PositionType[]|Array<any>>>,
        duration: number,
        delay: number,
        easing: EasingType,
        name?: string,
        details?: (string|number)[],
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
    lineDash: number;
    lineDashGap: number;
    lineDashOffset: number;
}

export type PointerEventCallback = (shape: Sprite<any, any>, e: PointerEvent, translatePoint: (point: PositionType) => PositionType) => void;