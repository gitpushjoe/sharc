import { Position, Corners, translatePosition } from "../Utils";
import { PositionType, BoundsType } from "../types/Common";
import {
    BezierCurveProperties,
    HiddenBezierCurveProperties,
    BezierPoint,
    BezierCurveNormalProperties,
    StrokeProperties,
    OmitBaseProps
} from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class BezierCurve<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<BezierCurveProperties>,
        HiddenBezierCurveProperties,
        BezierCurveNormalProperties
    >
    implements Required<OmitBaseProps<BezierCurveProperties & HiddenBezierCurveProperties>>
{
    constructor(props: BezierCurveProperties<DetailsType>) {
        (props as typeof props & { bounds: BoundsType }).bounds = BezierCurve.getBoundsFromCurves(
            Position(props.start?.x ?? 0, props.start?.y ?? 0),
            props.points ?? []
        );
        super(
            {
                startX: props.start?.x ?? 0,
                startY: props.start?.y ?? 0,
                points: props.points ?? [],
                closePath: props.closePath ?? false,
                fillRule: props.fillRule ?? "nonzero"
            },
            props as typeof props & { bounds: BoundsType }
        );
        this.points = props.points ?? [];
    }

    public get startX(): number {
        return this.properties.startX;
    }
    public set startX(value: number) {
        this.properties.startX = value;
    }

    public get startY(): number {
        return this.properties.startY;
    }
    public set startY(value: number) {
        this.properties.startY = value;
    }

    public points: BezierPoint[] = [];

    public get closePath(): boolean {
        return this.properties.closePath;
    }
    public set closePath(value: boolean) {
        this.properties.closePath = value;
    }

    public get fillRule(): CanvasFillRule {
        return this.properties.fillRule;
    }
    public set fillRule(value: CanvasFillRule) {
        this.properties.fillRule = value;
    }

    public get start(): PositionType {
        return Position(this.startX, this.startY);
    }
    public set start(value: PositionType) {
        this.startX = value.x;
        this.startY = value.y;
    }

    public set bounds(_value: BoundsType) {
        throw new Error("Bounds should not be set on BezierCurve");
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        const bounds = BezierCurve.getBoundsFromCurves(Position(this.startX, this.startY), this.points);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
        super.draw(ctx, {
            start: Position(this.startX, this.startY),
            points: this.points,
            closePath: this.closePath,
            fillRule: this.fillRule
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
        return Corners(x1, y1, x2, y2);
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
        const bounds = Corners(x1, y1, x2, y2);
        const region = new Path2D();
        region.moveTo(
            translatePosition(bounds, Position(properties.start?.x ?? 0, properties.start?.y ?? 0)).x,
            translatePosition(bounds, Position(properties.start?.x ?? 0, properties.start?.y ?? 0)).y
        );
        properties.points?.forEach(point => {
            region.bezierCurveTo(
                translatePosition(bounds, Position(point.control1.x, point.control1.y)).x,
                translatePosition(bounds, Position(point.control1.x, point.control1.y)).y,
                translatePosition(bounds, Position(point.control2.x, point.control2.y)).x,
                translatePosition(bounds, Position(point.control2.x, point.control2.y)).y,
                translatePosition(bounds, Position(point.end.x, point.end.y)).x,
                translatePosition(bounds, Position(point.end.x, point.end.y)).y
            );
        });
        if (properties.closePath) {
            region.closePath();
        }
        ctx.fill(region, properties.fillRule ?? "nonzero");
        if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
            const {
                color,
                lineWidth: width,
                lineJoin: join,
                lineCap: cap,
                lineDash,
                lineDashGap,
                lineDashOffset
            } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? "miter";
            ctx.lineCap = cap ?? "round";
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${
                color?.alpha ?? 1
            })`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke(region);
        }
        return region;
    };
}
