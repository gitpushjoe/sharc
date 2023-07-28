import { BoundsType, ColorType, PositionType } from './Common.ts';

export type DrawFunctionType<Property> = (ctx: CanvasRenderingContext2D, params: Property) => void;
export type EffectsType = (ctx: CanvasRenderingContext2D) => void;

export type DEFAULT_PROPERTIES = Omit<ShapeProperties, 'drawFunction'>;

export type ShapeProperties<T = {}> = {
    bounds: BoundsType,
    color?: ColorType,
    alpha?: number,
    rotation?: number,
    scale?: PositionType,
    name?: string,
    details?: (string|number)[],
    effects?: EffectsType,
    drawFunction: DrawFunctionType<T>
};

export type HIDDEN_SHAPE_PROPERTIES = {
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
    lineDash?: number,
    lineDashGap?: number,
    lineDashOffset?: number,
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

export type RadiusType = [number]|[number, number]|[number, number, number]|[number, number, number, number];

export type RectProperties = {
    bounds: BoundsType,
    radius?: RadiusType,
}

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

export type BezierCurveType = {
    control1: PositionType,
    control2: PositionType,
    end: PositionType,
}

export type BezierCurveProperties = {
    start: PositionType,
    curves: BezierCurveType[],
    closePath?: boolean,
    fillRule?: CanvasFillRule,
} & Omit<StrokeProperties, 'bounds'>;

export type HiddenBezierCurveProperties = {
    [key: `control1-${number}`]: PositionType,
    [key: `control2-${number}`]: PositionType,
    [key: `end-${number}`]: PositionType,
}

export type PathProperties = {
    path: PositionType[],
    fillRule?: CanvasFillRule,
    closePath?: boolean,
    start?: number,
    end?: number,
} & Omit<StrokeProperties, 'bounds'>;

export type PolygonProperties = {
    sides: number,
    center: PositionType,
    radius: number,
    fillRule?: CanvasFillRule,
    start?: number,
    end?: number,
} & Omit<StrokeProperties, 'bounds'>;

export type StarProperties = {
    center: PositionType,
    radius: number,
    innerRadius?: number,
    start?: number,
    end?: number,
    fillRule?: CanvasFillRule,
} & Omit<StrokeProperties, 'bounds'>;

export type TextProperties = {
    text: string,
    position: PositionType,
    positionIsCenter?: boolean,
    font?: string,
    fontSize?: number,
    textAlign?: CanvasTextAlign,
    textBaseline?: CanvasTextBaseline,
    textDirection?: CanvasDirection,
    maxWidth?: number|null,
    bold?: boolean,
    italic?: boolean,
} & Omit<StrokeProperties, 'bounds'>;

export type HiddenTextProperties = {
    position: PositionType,
    positionX: number,
    positionY: number,
}

export type ImageProperties = {
    image: HTMLImageElement,
    srcBounds?: BoundsType,
} & Omit<StrokeProperties, 'bounds'> & { bounds: BoundsType };

export type HiddenImageProperties = {
    srcX1: number,
    srcY1: number,
    srcX2: number,
    srcY2: number,
    useSrcBounds: boolean,
}