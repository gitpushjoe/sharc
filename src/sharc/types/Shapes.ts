import { BoundsType, ColorType, PositionType } from './Common.ts';

export type DrawFunctionType<Property> = (ctx: CanvasRenderingContext2D, params: Property) => void;
export type PrepFunctionType = (ctx: CanvasRenderingContext2D) => void;

export type DefaultProperties = Omit<ShapeProperties, 'drawFunction'|'prepFunction'>;

export type ShapeProperties<T = {}> = {
    bounds: BoundsType,
    color?: ColorType,
    alpha?: number,
    rotation?: number,
    scale?: PositionType,
    prepFunction?: PrepFunctionType,
    drawFunction: DrawFunctionType<T>
};

export type LineProperties = {
    lineWidth?: number,
    lineCap?: CanvasLineCap,
} & Omit<ShapeProperties, 'drawFunction'|'prepFunction'>;

export type ScaleType = {
    scaleX: number,
    scaleY: number
};

export type KeysOf<Properties> = keyof Properties|keyof DefaultProperties|'red'|'green'|'blue'|'colorAlpha'|'x1'|'y1'|'x2'|'y2'|'x'|'y'|'center'|'scaleX'|'scaleY'|'center';