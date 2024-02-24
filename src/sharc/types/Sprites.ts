import { BoundsType, ColorType, PositionType } from "./Common";

export type DrawFunctionType<Property> = (
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    params: Property
) => Path2D | void;
export type EffectsType = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => void;

export type DEFAULT_PROPERTIES<DetailsType = any> = Omit<ShapeProperties, "drawFunction"> & { details?: DetailsType };

export type PropMetaInfo<Properties> = {
    calculated: Set<keyof Properties>;
};

export type OmitBaseProps<Properties> = Omit<
    Properties,
    keyof (DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES & StrokeProperties)
>;

export type ShapeProperties<T = object> = {
    bounds?: BoundsType;
    color?: ColorType;
    alpha?: number;
    rotation?: number;
    scale?: PositionType;
    name?: string;
    effects?: EffectsType;
    enabled?: boolean;
    drawFunction: DrawFunctionType<T>;
    channelCount?: number;
    blur?: number;
    gradient?: CanvasGradient | null;
};

export type NORMAL_SHAPE_PROPERTIES =
    | "red"
    | "green"
    | "blue"
    | "colorAlpha"
    | "alpha"
    | "rotation"
    | "scaleX"
    | "scaleY"
    | "name"
    | "effects"
    | "x1"
    | "y1"
    | "x2"
    | "y2"
    | "channelCount"
    | "blur"
    | "gradient";

export type HIDDEN_SHAPE_PROPERTIES = {
    red: number;
    green: number;
    blue: number;
    colorAlpha: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    scaleX: number;
    scaleY: number;
    center: PositionType;
    centerX: number;
    centerY: number;
    corner1: PositionType;
    corner2: PositionType;
    width: number;
    height: number;
};

export type LineProperties<DetailsType = any> = {
    lineWidth?: number;
    lineCap?: CanvasLineCap;
    lineDash?: number;
    lineDashGap?: number;
    lineDashOffset?: number;
} & DEFAULT_PROPERTIES<DetailsType>;

export type LineNormalProperties = keyof OmitBaseProps<LineProperties>;

export type EllipseProperties<DetailsType = any> = {
    center?: PositionType;
    radius?: number | [number, number];
    startAngle?: number;
    endAngle?: number;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type HiddenEllipseProperties = {
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
};

export type EllipseNormalProperties = Exclude<keyof OmitBaseProps<EllipseProperties>, "center" | "radius">;

export type KeysOf<Properties> = keyof Properties | keyof HIDDEN_SHAPE_PROPERTIES;

export type RadiusType = [number] | [number, number] | [number, number, number] | [number, number, number, number];

export type RectProperties<DetailsType = any> = {
    radius?: RadiusType;
} & StrokeProperties &
    DEFAULT_PROPERTIES<DetailsType>;

export type StrokeType = {
    color?: ColorType;
    lineWidth?: number;
    lineJoin?: CanvasLineJoin;
    lineCap?: CanvasLineCap;
    lineDash?: number;
    lineDashGap?: number;
    lineDashOffset?: number;
};

export type HiddenStrokeProperties = {
    strokeColor: ColorType;
    strokeRed: number;
    strokeGreen: number;
    strokeBlue: number;
    strokeAlpha: number;
    strokeWidth: number;
    strokeDash: number;
    strokeDashGap: number;
    strokeOffset: number;
    strokeJoin: CanvasLineJoin;
    strokeCap: CanvasLineCap;
    strokeEnabled: boolean;
};

export type StrokeProperties = {
    stroke?: StrokeType | null;
};

export type StrokeableSpriteNormalProperties = Exclude<keyof HiddenStrokeProperties, "strokeColor"> | "strokeEnabled";

export type BezierPoint = {
    control1: PositionType;
    control2: PositionType;
    end: PositionType;
};

export type BezierCurveProperties<DetailsType = any> = {
    start?: PositionType;
    points?: BezierPoint[];
    closePath?: boolean;
    fillRule?: CanvasFillRule;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type HiddenBezierCurveProperties = {
    startX: number;
    startY: number;
};

export type BezierCurveNormalProperties =
    | Exclude<keyof OmitBaseProps<BezierCurveProperties>, "start">
    | "startX"
    | "startY";

export type PathProperties<DetailsType = any> = {
    path?: PositionType[];
    fillRule?: CanvasFillRule;
    closePath?: boolean;
    startRatio?: number;
    endRatio?: number;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type PathNormalProperties = keyof OmitBaseProps<PathProperties>;

export type PolygonProperties<DetailsType = any> = {
    sides?: number;
    center?: PositionType;
    radius?: number;
    fillRule?: CanvasFillRule;
    startRatio?: number;
    endRatio?: number;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type PolygonNormalProperties = Exclude<keyof OmitBaseProps<PolygonProperties>, "center">;

export type StarProperties<DetailsType = any> = {
    center?: PositionType;
    radius?: number;
    innerRadius?: number;
    startRatio?: number;
    endRatio?: number;
    fillRule?: CanvasFillRule;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type StarNormalProperties = keyof OmitBaseProps<StarProperties>;

export type TextProperties<DetailsType = any> = {
    text?: string;
    position?: PositionType;
    positionIsCenter?: boolean;
    font?: string;
    fontSize?: number;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    textDirection?: CanvasDirection;
    maxWidth?: number | null;
    bold?: boolean;
    italic?: boolean;
    color?: ColorType;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type HiddenTextProperties = {
    positionX: number;
    positionY: number;
};

export type TextNormalProperties = Exclude<keyof OmitBaseProps<TextProperties>, "position"> | "positionX" | "positionY";

export type ImageProperties<DetailsType = any> = {
    image: HTMLImageElement;
    srcBounds?: BoundsType | null;
} & StrokeProperties &
    DEFAULT_PROPERTIES<DetailsType>;

export type HiddenImageProperties = {
    srcX1: number;
    srcY1: number;
    srcX2: number;
    srcY2: number;
    srcCorner1: PositionType;
    srcCorner2: PositionType;
    useSrcBounds: boolean;
};

export type ImageNormalProperties =
    | Exclude<keyof OmitBaseProps<ImageProperties>, "srcBounds">
    | "srcX1"
    | "srcY1"
    | "srcX2"
    | "srcY2"
    | "useSrcBounds";

export type LabelProperties<DetailsType = any> = TextProperties<DetailsType> & {
    padding?: number;
    backgroundColor?: ColorType;
    backgroundRadius?: RadiusType;
    textStroke?: StrokeType | null;
};

export type HiddenLabelProperties = HiddenTextProperties & {
    backgroundRed: number;
    backgroundGreen: number;
    backgroundBlue: number;
    backgroundAlpha: number;
};

export type LabelNormalProperties =
    | TextNormalProperties
    | "padding"
    | "textStroke"
    | "backgroundRadius"
    | "backgroundRed"
    | "backgroundGreen"
    | "backgroundBlue"
    | "backgroundAlpha";

export type MostlyRequired<Type extends { details?: any }> = Required<Omit<Type, "details">> & {
    details?: Type["details"];
};

export type Merge<T1, T2> = Omit<T1, keyof T2> & T2;
