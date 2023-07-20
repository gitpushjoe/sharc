import { BoundsType, ColorType, CurveType, PositionType } from "./Common";
import { ScaleType } from "./Shapes";

export type AnimationCallback<PropertyType> = PropertyType extends any ? SingularCallback<PropertyType> : never;

type SingularCallback<PropertyType> = (property: PropertyType) => PropertyType;

export type AnimationType<ValidProperties, PropertyType=number> = {
    property: ValidProperties,
    from: PropertyType|null,
    to: PropertyType|AnimationCallback<PropertyType>,
    duration: number,
    delay: number,
    easing: CurveType,
    frame?: number,
    channel?: number,
    fromSaved?: PropertyType,
    toSaved?: PropertyType,
}

export type AnimationParams = {
    loop?: boolean,
    iterations?: number,
    delay?: number,
}

export type AnimationPackage<ValidProperties, ValidTypes> = {
    animations: AnimationType<ValidProperties, ValidTypes>[],
    params: AnimationParams
}

export type SPECIAL_PROEPRTY_TYPES = ColorType|BoundsType|ScaleType|PositionType;
export type DEFAULT_PROPERTY_TYPES = number|SPECIAL_PROEPRTY_TYPES;