import { Position, Bounds, Color } from "./Common";

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
    bounds?: Bounds;
    color?: Color;
    alpha?: number;
    rotation?: number;
    scale?: Position;
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
    center: Position;
    centerX: number;
    centerY: number;
    corner1: Position;
    corner2: Position;
    width: number;
    height: number;
};

export type StrokeType = {
    color?: Color;
    lineWidth?: number;
    lineJoin?: CanvasLineJoin;
    lineCap?: CanvasLineCap;
    lineDash?: number;
    lineDashGap?: number;
    lineDashOffset?: number;
};

export type ArrowType = {
    length?: number;
    side?: "start" | "end" | "both" | "none";
    angle?: number;
    stroke?: StrokeType;
    closed?: boolean;
    color?: Color;
};

export type LineProperties<DetailsType = any> = {
    arrow?: ArrowType;
    lineWidth?: number;
    lineCap?: CanvasLineCap;
    lineDash?: number;
    lineDashGap?: number;
    lineDashOffset?: number;
} & DEFAULT_PROPERTIES<DetailsType>;

export type HiddenArrowProperties = {
    arrowLength: number;
    arrowSide: "start" | "end" | "both" | "none";
    arrowAngle: number;
    arrowClosed: boolean;
    arrowColor: Color;
    arrowStroke: StrokeType;
    arrowStrokeColor: Color;
    arrowStrokeRed: number;
    arrowStrokeGreen: number;
    arrowStrokeBlue: number;
    arrowStrokeAlpha: number;
    arrowStrokeWidth: number;
    arrowStrokeJoin: CanvasLineJoin;
    arrowStrokeCap: CanvasLineCap;
    arrowStrokeDash: number;
    arrowStrokeDashGap: number;
    arrowStrokeDashOffset: number;
    arrowStrokeEnabled: boolean;
    arrowRed: number;
    arrowGreen: number;
    arrowBlue: number;
    arrowAlpha: number;
};

export type HiddenLineProperties = HiddenArrowProperties;

export type EllipseProperties<DetailsType = any> = {
    center?: Position;
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

export type KeysOf<Properties> = keyof Properties | keyof HIDDEN_SHAPE_PROPERTIES;

export type RadiusType = [number] | [number, number] | [number, number, number] | [number, number, number, number];

export type RectProperties<DetailsType = any> = {
    radius?: RadiusType;
} & StrokeProperties &
    DEFAULT_PROPERTIES<DetailsType>;

export type HiddenStrokeProperties = {
    strokeColor: Color;
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

export type BezierPoint = {
    control1: Position;
    control2: Position;
    end: Position;
};

export type BezierCurveProperties<DetailsType = any> = {
    arrow?: ArrowType;
    start?: Position;
    points?: BezierPoint[];
    closePath?: boolean;
    fillRule?: CanvasFillRule;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type HiddenBezierCurveProperties = HiddenArrowProperties & {
    startX: number;
    startY: number;
};

export type PathProperties<DetailsType = any> = {
    path?: Position[];
    fillRule?: CanvasFillRule;
    closePath?: boolean;
    startRatio?: number;
    endRatio?: number;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type PolygonProperties<DetailsType = any> = {
    sides?: number;
    center?: Position;
    radius?: number;
    fillRule?: CanvasFillRule;
    startRatio?: number;
    endRatio?: number;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type StarProperties<DetailsType = any> = {
    center?: Position;
    radius?: number;
    innerRadius?: number;
    startRatio?: number;
    endRatio?: number;
    fillRule?: CanvasFillRule;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type TextProperties<DetailsType = any> = {
    text?: string;
    position?: Position;
    positionIsCenter?: boolean;
    font?: string;
    fontSize?: number;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    textDirection?: CanvasDirection;
    maxWidth?: number | null;
    bold?: boolean;
    italic?: boolean;
    color?: Color;
} & StrokeProperties &
    Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds">;

export type HiddenTextProperties = {
    positionX: number;
    positionY: number;
};

export type ImageProperties<DetailsType = any> = {
    src?: string;
    srcBounds?: Bounds | null;
} & StrokeProperties &
    DEFAULT_PROPERTIES<DetailsType>;

export type HiddenImageProperties = {
    srcX1: number;
    srcY1: number;
    srcX2: number;
    srcY2: number;
    srcCorner1: Position;
    srcCorner2: Position;
    useSrcBounds: boolean;
    image: ImageBitmap | null;
};

export type LabelProperties<DetailsType = any> = TextProperties<DetailsType> & {
    padding?: number;
    backgroundColor?: Color;
    backgroundRadius?: RadiusType;
    textStroke?: StrokeType | null;
};

export type HiddenLabelProperties = HiddenTextProperties & {
    backgroundRed: number;
    backgroundGreen: number;
    backgroundBlue: number;
    backgroundAlpha: number;
};

export type AnchorPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "center-left"
    | "center"
    | "center-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

export type Alignment = "row-center" | "top" | "bottom" | "column-center" | "left" | "right";

export type NullSpriteProperties<DetailsType = any> = {
    position?: Position;
} & DEFAULT_PROPERTIES<DetailsType>;

export type HiddenNullSpriteProperties = {
    positionX: number;
    positionY: number;
};

export type ManagerProperties<DetailsType = any> = {
    anchor: AnchorPosition | null;
    align: Alignment | null;
    padding: number | null;
} & DEFAULT_PROPERTIES<DetailsType>;

export type HiddenManagerProperties = Record<never, never>;

export type MostlyRequired<Type extends { details?: any }> = Required<Omit<Type, "details">> & {
    details?: Type["details"];
};
