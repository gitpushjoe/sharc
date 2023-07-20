import { BoundsType, ColorType, PositionType } from './Common.ts';

export type DrawFunctionType<Property> = (ctx: CanvasRenderingContext2D, params: Property) => void;
export type EffectsType = (ctx: CanvasRenderingContext2D) => void;

export type DEFAULT_PROPERTIES = Omit<ShapeProperties, 'drawFunction'|'prepFunction'>;

export type ShapeProperties<T = {}> = {
    bounds: BoundsType,
    color?: ColorType,
    alpha?: number,
    rotation?: number,
    scale?: PositionType,
    prepFunction?: EffectsType,
    drawFunction: DrawFunctionType<T>
};

export type LineProperties = {
    lineWidth?: number,
    lineCap?: CanvasLineCap,
} & DEFAULT_PROPERTIES

export type ScaleType = {
    scaleX: number,
    scaleY: number
};

export type KeysOf<Properties> = keyof Properties|keyof DEFAULT_PROPERTIES|'red'|'green'|'blue'|'colorAlpha'|'x1'|'y1'|'x2'|'y2'|'x'|'y'|'center'|'scaleX'|'scaleY'|'X'|'Y';

export type StrokeColorType = {
    strokeRed: number,
    strokeGreen: number,
    strokeBlue: number,
    strokeAlpha: number,
};

export type StrokeType = {
    color?: StrokeColorType,
    width?: number,
    join?: CanvasLineJoin,
    lineDash?: number,
    lineDashGap?: number,
    lineDashOffset?: number,
}

export type HiddenStrokeProperties = 'strokeColor'|'strokeRed'|'strokeGreen'|'strokeBlue'|'strokeAlpha'|'strokeWidth'|'strokeDash'|'strokeDashGap'|'strokeOffest';

export type StrokeProperties = {
    stroke?: StrokeType|null;
} & DEFAULT_PROPERTIES;