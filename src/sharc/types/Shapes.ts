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

export type HiddenShapeProperties = {
    red: number,
    green: number,
    blue: number,
    colorAlpha: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    scaleX: number,
    scaleY: number,
    effects: EffectsType,
    center: PositionType,
    centerX: number,
    centerY: number,
}

export type LineProperties = {
    lineWidth?: number,
    lineCap?: CanvasLineCap,
} & DEFAULT_PROPERTIES

export type EllipseProperties = {
    bounds: BoundsType,
    startAngle?: number,
    endAngle?: number,
} & StrokeProperties;

export type HiddenEllipseProperties = {
    radius: number;
    radiusY: number;
    radiusX: number;
} & EllipseProperties;

export type ScaleType = {
    scaleX: number,
    scaleY: number
};

export type KeysOf<Properties> = keyof Properties|keyof DEFAULT_PROPERTIES|'red'|'green'|'blue'|'colorAlpha'|'x1'|'y1'|'x2'|'y2'|'x'|'y'|'center'|'scaleX'|'scaleY'|'X'|'Y';

export type StrokeType = {
    color?: ColorType,
    width?: number,
    join?: CanvasLineJoin,
    cap?: CanvasLineCap,
    lineDash?: number,
    lineDashGap?: number,
    lineDashOffset?: number,
}

export type HiddenStrokeProperties = {
    strokeColor: ColorType,
    strokeRed: number,
    strokeGreen: number,
    strokeBlue: number,
    strokeAlpha: number,
    strokeWidth: number,
    strokeDash: number,
    strokeDashGap: number,
    strokeOffest: number,
}

export type StrokeProperties = {
    stroke?: StrokeType|null;
} & Omit<DEFAULT_PROPERTIES, 'bounds'>;

export type BezierCurveProperties = {
    control1: PositionType,
    control2: PositionType,
} & LineProperties;

export type PathProperties = {
    path: PositionType[],
    fillRule?: CanvasFillRule,
    closePath?: boolean,
} & Omit<StrokeProperties, 'bounds'>;

export type PolygonProperties = {
    sides: number,
    center: PositionType,
    radius: number,
    fillRule?: CanvasFillRule,
} & Omit<StrokeProperties, 'bounds'>;