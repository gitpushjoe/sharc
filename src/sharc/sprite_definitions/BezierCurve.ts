import { Position, Bounds, Color, invalidSetterFor } from "../Utils";
import {
    BezierCurveProperties,
    HiddenBezierCurveProperties,
    BezierPoint,
    StrokeProperties,
    OmitBaseProps,
    ArrowType,
    StrokeType
} from "../types/Sprites";
import Line from "./Line";
import StrokeableSprite from "./StrokeableSprite";

export default class BezierCurve<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<BezierCurveProperties>,
        HiddenBezierCurveProperties
    >
    implements
        Required<
            OmitBaseProps<BezierCurveProperties & HiddenBezierCurveProperties>
        >
{
    constructor(props: BezierCurveProperties<DetailsType>) {
        (props as typeof props & { bounds: Bounds }).bounds =
            BezierCurve.getBoundsFromCurves(
                new Position(props.start?.x ?? 0, props.start?.y ?? 0),
                props.points ?? []
            );
        super(props);
        this.points = props.points ?? [];
        this.closePath = props.closePath ?? false;
        this.fillRule = props.fillRule ?? "nonzero";
        this.startX = props.start?.x ?? 0;
        this.startY = props.start?.y ?? 0;
        this.arrow = props.arrow ?? {};
    }

    // NORMAL PROPERTIES
    public startX = 0;
    public startY = 0;
    public points: BezierPoint[] = [];
    public closePath = false;
    public fillRule: CanvasFillRule = "nonzero";

    // AGGREGATE PROPERTIES
    public get start(): Position {
        return new Position(this.startX, this.startY);
    }
    public set start(value: Position) {
        this.startX = value.x;
        this.startY = value.y;
    }

    // \/ arrow-related properties
    public arrowLength = 20;
    public arrowSide: "start" | "end" | "both" | "none" = "end";
    public arrowAngle = 90;
    public arrowStrokeRed = 0;
    public arrowStrokeGreen = 0;
    public arrowStrokeBlue = 0;
    public arrowStrokeAlpha = 1;
    public arrowStrokeWidth = 1;
    public arrowStrokeJoin: CanvasLineJoin = "miter";
    public arrowStrokeCap: CanvasLineCap = "butt";
    public arrowStrokeDash = 0;
    public arrowStrokeDashGap = 0;
    public arrowStrokeDashOffset = 0;
    public arrowStrokeEnabled = true;
    public arrowClosed = false;
    public arrowRed = 0;
    public arrowGreen = 0;
    public arrowBlue = 0;
    public arrowAlpha = 1;

    // AGGREGATE PROPERTIES
    public get arrowStroke(): StrokeType {
        return {
            color: new Color(
                this.arrowStrokeRed,
                this.arrowStrokeGreen,
                this.arrowStrokeBlue,
                this.arrowStrokeAlpha
            ),
            lineWidth: this.arrowStrokeWidth,
            lineJoin: this.arrowStrokeJoin,
            lineCap: this.arrowStrokeCap,
            lineDash: this.arrowStrokeDash,
            lineDashGap: this.arrowStrokeDashGap,
            lineDashOffset: this.arrowStrokeDashOffset
        };
    }
    public set arrowStroke(value: StrokeType) {
        this.arrowStrokeRed = value.color?.red ?? 0;
        this.arrowStrokeGreen = value.color?.green ?? 0;
        this.arrowStrokeBlue = value.color?.blue ?? 0;
        this.arrowStrokeAlpha = value.color?.alpha ?? 1;
        this.arrowStrokeWidth = value.lineWidth ?? 1;
        this.arrowStrokeJoin = value.lineJoin ?? "miter";
        this.arrowStrokeCap = value.lineCap ?? "butt";
        this.arrowStrokeDash = value.lineDash ?? 0;
        this.arrowStrokeDashGap = value.lineDashGap ?? 0;
        this.arrowStrokeDashOffset = value.lineDashOffset ?? 0;
    }

    public get arrowStrokeColor(): Color {
        return new Color(
            this.arrowStrokeRed,
            this.arrowStrokeGreen,
            this.arrowStrokeBlue,
            this.arrowStrokeAlpha
        );
    }
    public set arrowStrokeColor(value: Color) {
        this.arrowStrokeRed = value.red;
        this.arrowStrokeGreen = value.green;
        this.arrowStrokeBlue = value.blue;
        this.arrowStrokeAlpha = value.alpha;
    }

    public get arrowColor(): Color {
        return new Color(
            this.arrowRed,
            this.arrowGreen,
            this.arrowBlue,
            this.arrowAlpha
        );
    }
    public set arrowColor(value: Color) {
        this.arrowRed = value.red;
        this.arrowGreen = value.green;
        this.arrowBlue = value.blue;
        this.arrowAlpha = value.alpha;
    }

    public get arrow(): ArrowType {
        return {
            length: this.arrowLength,
            side: this.arrowSide,
            angle: this.arrowAngle,
            stroke: this.arrowStroke,
            closed: this.arrowClosed,
            color: this.arrowColor
        };
    }
    public set arrow(value: ArrowType) {
        this.arrowLength = value.length ?? 20;
        this.arrowSide =
            value.side ??
            (value.length !== undefined ||
                value.angle !== undefined ||
                value.color !== undefined ||
                value.stroke !== undefined ||
                value.closed !== undefined)
                ? "end"
                : "none";
        this.arrowAngle = value.angle ?? 90;
        this.arrowStroke = value.stroke ?? {};
        this.arrowClosed = value.closed ?? false;
        this.arrowColor = value.color ?? new Color(0, 0, 0, 0);
    }

    @invalidSetterFor("BezierCurve")
    public set bounds(_value: Bounds) {
        throw new Error("Bounds cannot be set on BezierCurve");
    }

    public draw(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
    ) {
        const bounds = BezierCurve.getBoundsFromCurves(
            new Position(this.startX, this.startY),
            this.points
        );
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
        super.draw(ctx, {
            start: new Position(this.startX, this.startY),
            points: this.points,
            closePath: this.closePath,
            fillRule: this.fillRule,
            arrow: this.arrow
        });
    }

    private static getBoundsFromCurves(
        start: Position,
        points: BezierPoint[]
    ): Bounds {
        let [x1, y1, x2, y2] = [start.x, start.y, start.x, start.y];
        points.forEach(curve => {
            x1 = Math.min(x1, curve.end.x);
            y1 = Math.min(y1, curve.end.y);
            x2 = Math.max(x2, curve.end.x);
            y2 = Math.max(y2, curve.end.y);
        });
        return new Bounds(x1, y1, x2, y2);
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: BezierCurveProperties & StrokeProperties
    ): Path2D => {
        let [x1, y1, x2, y2] = [
            properties.start?.x ?? 0,
            properties.start?.y ?? 0,
            properties.start?.x ?? 0,
            properties.start?.y ?? 0
        ];
        properties.points?.forEach(point => {
            x1 = Math.min(x1, point.end.x);
            y1 = Math.min(y1, point.end.y);
            x2 = Math.max(x2, point.end.x);
            y2 = Math.max(y2, point.end.y);
        });
        const bounds = new Bounds(x1, y1, x2, y2);
        const region = new Path2D();
        region.moveTo(
            Position.wrtBounds(
                new Position(
                    properties.start?.x ?? 0,
                    properties.start?.y ?? 0
                ),
                bounds
            ).x,
            Position.wrtBounds(
                new Position(
                    properties.start?.x ?? 0,
                    properties.start?.y ?? 0
                ),
                bounds
            ).y
        );
        properties.points?.forEach(point => {
            region.bezierCurveTo(
                Position.wrtBounds(
                    new Position(point.control1.x, point.control1.y),
                    bounds
                ).x,
                Position.wrtBounds(
                    new Position(point.control1.x, point.control1.y),
                    bounds
                ).y,
                Position.wrtBounds(
                    new Position(point.control2.x, point.control2.y),
                    bounds
                ).x,
                Position.wrtBounds(
                    new Position(point.control2.x, point.control2.y),
                    bounds
                ).y,
                Position.wrtBounds(
                    new Position(point.end.x, point.end.y),
                    bounds
                ).x,
                Position.wrtBounds(
                    new Position(point.end.x, point.end.y),
                    bounds
                ).y
            );
        });
        if (properties.closePath) {
            region.closePath();
        }
        ctx.fill(region, properties.fillRule ?? "nonzero");
        StrokeableSprite.strokeRegion(ctx, properties.stroke, region);
        const side = properties.arrow?.side ?? "none";
        if (
            properties?.arrow?.side === "start" ||
            properties?.arrow?.side === "both"
        ) {
            const newStart = Position.wrtBounds(
                {
                    x: properties.start?.x ?? 0,
                    y: properties.start?.y ?? 0
                },
                bounds
            );
            const newControl1 = Position.wrtBounds(
                properties.points?.length
                    ? {
                          x: properties.points[0].control1.x,
                          y: properties.points[0].control1.y
                      }
                    : {
                          x: properties.start?.x ?? 0,
                          y: properties.start?.y ?? 0
                      },
                bounds
            );
            const newBounds = {
                x1: newStart.x,
                y1: newStart.y,
                x2: newControl1.x,
                y2: newControl1.y
            };
            const center = {
                x: (newBounds.x1 + newBounds.x2) / 2,
                y: (newBounds.y1 + newBounds.y2) / 2
            };
            properties.arrow.side = "start";
            region.addPath(
                Line.drawArrow(
                    ctx,
                    newBounds,
                    properties.arrow,
                    properties.arrow?.stroke,
                    center
                )
            );
        }
        properties.arrow!.side = side;
        if (
            properties?.arrow?.side === "end" ||
            properties?.arrow?.side === "both"
        ) {
            const newEnd = Position.wrtBounds(
                properties.points?.length
                    ? {
                          x: properties.points[properties.points.length - 1].end
                              .x,
                          y: properties.points[properties.points.length - 1].end
                              .y
                      }
                    : {
                          x: properties.start?.x ?? 0,
                          y: properties.start?.y ?? 0
                      },
                bounds
            );
            const newControl2 = Position.wrtBounds(
                properties.points?.length
                    ? {
                          x: properties.points[properties.points.length - 1]
                              .control2.x,
                          y: properties.points[properties.points.length - 1]
                              .control2.y
                      }
                    : {
                          x: properties.start?.x ?? 0,
                          y: properties.start?.y ?? 0
                      },
                bounds
            );
            const newBounds = {
                x1: newControl2.x,
                y1: newControl2.y,
                x2: newEnd.x,
                y2: newEnd.y
            };
            const center = {
                x: (newBounds.x1 + newBounds.x2) / 2,
                y: (newBounds.y1 + newBounds.y2) / 2
            };
            properties.arrow.side = "end";
            region.addPath(
                Line.drawArrow(
                    ctx,
                    newBounds,
                    properties.arrow,
                    properties.arrow?.stroke,
                    center
                )
            );
        }
        properties.arrow!.side = side;
        return region;
    };
}
