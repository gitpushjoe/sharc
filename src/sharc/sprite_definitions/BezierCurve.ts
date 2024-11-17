import { BoundsType, ColorType, PositionType } from "sharc/types/Common";
import { Position, Bounds, Color } from "../Utils";
import {
    BezierCurveProperties,
    HiddenBezierCurveProperties,
    BezierPoint,
    StrokeProperties,
    OmitBaseProps,
    ArrowType,
    DropShadowType,
    StrokeType
} from "../types/Sprites";
import Line from "./Line";
import SlidingStrokeableSprite from "./SlidingStrokeableSprite";
import StrokeableSprite from "./StrokeableSprite";

export default class BezierCurve<DetailsType = any>
    extends SlidingStrokeableSprite<DetailsType, OmitBaseProps<BezierCurveProperties>, HiddenBezierCurveProperties>
    implements Required<OmitBaseProps<BezierCurveProperties & HiddenBezierCurveProperties>>
{
    constructor(props: BezierCurveProperties<DetailsType>, defaults?: BezierCurveProperties<DetailsType>) {
        (props as typeof props & { bounds: BoundsType }).bounds = BezierCurve.getBoundsFromCurves(
            Position(props.start?.x ?? defaults?.start?.x ?? 0, props.start?.y ?? defaults?.start?.y ?? 0),
            props.points ?? defaults?.points ?? []
        );
        super(props, defaults);
        this.points = props.points ?? defaults?.points ?? this.points;
        this.startX = props.start?.x ?? defaults?.start?.x ?? this.startX;
        this.startY = props.start?.y ?? defaults?.start?.y ?? this.startY;
        this.closePath = props.closePath ?? defaults?.closePath ?? this.closePath;
        this.fillRule = props.fillRule ?? defaults?.fillRule ?? this.fillRule;
        this.arrow = props.arrow ?? defaults?.arrow ?? {};
        this._bounds = BezierCurve.getBoundsFromCurves(this.start, this.points);
    }

    // NORMAL PROPERTIES
    public startX = 0;
    public startY = 0;
    public points: BezierPoint[] = [];
    public closePath = false;
    public fillRule: CanvasFillRule = "nonzero";

    // AGGREGATE PROPERTIES
    public get start(): PositionType {
        return Position(this.startX, this.startY);
    }
    public set start(value: PositionType) {
        this.startX = value.x;
        this.startY = value.y;
        this._bounds = BezierCurve.getBoundsFromCurves(this.start, this.points);
    }

    protected shiftX(value: number) {
        this.startX += value;
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].control1.x += value;
            this.points[i].control2.x += value;
            this.points[i].end.x += value;
        }
        this._x1 += value;
        this._x2 += value;
    }

    protected shiftY(value: number) {
        this.startY += value;
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].control1.y += value;
            this.points[i].control2.y += value;
            this.points[i].end.y += value;
        }
        this._y1 += value;
        this._y2 += value;
    }

    protected shift(value: PositionType) {
        this.startX += value.x;
        this.startY += value.y;
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].control1.x += value.x;
            this.points[i].control1.y += value.y;
            this.points[i].control2.x += value.x;
            this.points[i].control2.y += value.y;
            this.points[i].end.x += value.x;
            this.points[i].end.y += value.y;
        }
        this._x1 += value.x;
        this._x2 += value.x;
        this._y1 += value.y;
        this._y2 += value.y;
    }

    public get centerX(): number {
        return (this._x1 + this._x2) / 2;
    }
    public set centerX(value: number) {
        this.shiftX(value - this.centerX);
    }

    public get centerY(): number {
        return (this.y1 + this.y2) / 2;
    }
    public set centerY(value: number) {
        this.shiftY(value - this.centerY);
    }

    public get center(): PositionType {
        return Position(this.centerX, this.centerY);
    }
    public set center(value: PositionType) {
        this.centerX = value.x;
        this.centerY = value.y;
    }

    public get corner1(): PositionType {
        return Position(this.x1, this.y1);
    }
    public set corner1(value: PositionType) {
        this.shiftX(value.x - this._x1);
        this.shiftY(value.x - this._y1);
    }

    public get corner2(): PositionType {
        return Position(this.x2, this.y2);
    }
    public set corner2(value: PositionType) {
        this.shiftX(value.x - this._x2);
        this.shiftY(value.x - this._y2);
    }

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
            color: Color(this.arrowStrokeRed, this.arrowStrokeGreen, this.arrowStrokeBlue, this.arrowStrokeAlpha),
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

    public get arrowStrokeColor(): ColorType {
        return Color(this.arrowStrokeRed, this.arrowStrokeGreen, this.arrowStrokeBlue, this.arrowStrokeAlpha);
    }
    public set arrowStrokeColor(value: ColorType) {
        this.arrowStrokeRed = value.red;
        this.arrowStrokeGreen = value.green;
        this.arrowStrokeBlue = value.blue;
        this.arrowStrokeAlpha = value.alpha;
    }

    public get arrowColor(): ColorType {
        return Color(this.arrowRed, this.arrowGreen, this.arrowBlue, this.arrowAlpha);
    }
    public set arrowColor(value: ColorType) {
        this.arrowRed = value.red;
        this.arrowGreen = value.green;
        this.arrowBlue = value.blue;
        this.arrowAlpha = value.alpha;
    }

    public get arrow(): ArrowType {
        return this.arrowSide === "none"
            ? { side: "none" }
            : {
                  length: this.arrowLength,
                  side: this.arrowSide,
                  angle: this.arrowAngle,
                  stroke: this.arrowStroke,
                  closed: this.arrowClosed,
                  color: this.arrowColor
              };
    }
    public set arrow(value: ArrowType) {
        this.arrowSide =
            (value.side ??
            (value.length !== undefined ||
                value.angle !== undefined ||
                value.color !== undefined ||
                value.stroke !== undefined ||
                value.closed !== undefined))
                ? "end"
                : "none";
        this.arrowLength = value.length ?? 20;
        this.arrowAngle = value.angle ?? 90;
        this.arrowStroke = value.stroke ?? {};
        this.arrowClosed = value.closed ?? false;
        this.arrowColor = value.color ?? Color(0, 0, 0, 0);
    }

    // @invalidSetterFor("BezierCurve")
    // public set bounds(_value: Bounds) {
    //     throw new Error("Bounds cannot be set on BezierCurve");
    // }
    // public get bounds() {
    //     return BezierCurve.getBoundsFromCurves(Position(this.startX, this.startY), this.points);
    // }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        // this._bounds = BezierCurve.getBoundsFromCurves(Position(this.startX, this.startY), this.points);
        super.draw(ctx, {
            start: Position(this.startX, this.startY),
            points: this.points,
            closePath: this.closePath,
            fillRule: this.fillRule,
            arrow: this.arrow
        });
    }

    private static getBoundsFromCurves(start: PositionType, points: BezierPoint[]): BoundsType {
        let [x1, y1, x2, y2] = [start.x, start.y, start.x, start.y];
        points.forEach(curve => {
            x1 = Math.min(x1, curve.end.x);
            y1 = Math.min(y1, curve.end.y);
            x2 = Math.max(x2, curve.end.x);
            y2 = Math.max(y2, curve.end.y);
        });
        return Bounds(x1, y1, x2, y2);
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: BezierCurveProperties & StrokeProperties,
        dropShadow?: DropShadowType | null,
        colorAlpha?: number
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
        const bounds = Bounds(x1, y1, x2, y2);
        const region = new Path2D();
        region.moveTo(
            Position.wrtBounds(Position(properties.start?.x ?? 0, properties.start?.y ?? 0), bounds).x,
            Position.wrtBounds(Position(properties.start?.x ?? 0, properties.start?.y ?? 0), bounds).y
        );
        properties.points?.forEach(point => {
            region.bezierCurveTo(
                Position.wrtBounds(Position(point.control1.x, point.control1.y), bounds).x,
                Position.wrtBounds(Position(point.control1.x, point.control1.y), bounds).y,
                Position.wrtBounds(Position(point.control2.x, point.control2.y), bounds).x,
                Position.wrtBounds(Position(point.control2.x, point.control2.y), bounds).y,
                Position.wrtBounds(Position(point.end.x, point.end.y), bounds).x,
                Position.wrtBounds(Position(point.end.x, point.end.y), bounds).y
            );
        });
        if (properties.closePath) {
            region.closePath();
        }
        StrokeableSprite.strokeDropShadow(
            ctx,
            dropShadow,
            region,
            properties.stroke,
            colorAlpha,
            properties.fillRule ?? "nonzero"
        );
        ctx.fill(region, properties.fillRule ?? "nonzero");
        StrokeableSprite.strokeRegion(ctx, properties.stroke, region);
        const side = properties.arrow?.side ?? "none";
        if (properties?.arrow?.side === "start" || properties?.arrow?.side === "both") {
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
                Line.drawArrow(ctx, newBounds, properties.arrow, properties.arrow?.stroke, center, this.dropShadow)
            );
        }
        properties.arrow!.side = side;
        if (properties?.arrow?.side === "end" || properties?.arrow?.side === "both") {
            const newEnd = Position.wrtBounds(
                properties.points?.length
                    ? {
                          x: properties.points[properties.points.length - 1].end.x,
                          y: properties.points[properties.points.length - 1].end.y
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
                          x: properties.points[properties.points.length - 1].control2.x,
                          y: properties.points[properties.points.length - 1].control2.y
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
                Line.drawArrow(ctx, newBounds, properties.arrow, properties.arrow?.stroke, center, this.dropShadow)
            );
        }
        properties.arrow!.side = side;
        return region;
    };
}
