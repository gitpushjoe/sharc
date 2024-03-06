import { Sprite } from "../Sprite";
import { Color, translateBounds, ColorToString, Corners, Position } from "../Utils";
import { BoundsType, ColorType, PositionType } from "../types/Common";
import { ArrowType, LineProperties, OmitBaseProps, StrokeType } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class Line<DetailsType = any>
    extends Sprite<DetailsType, OmitBaseProps<LineProperties> & { bounds?: BoundsType; color?: ColorType }>
    implements Required<OmitBaseProps<LineProperties>>
{
    constructor(props: LineProperties<DetailsType>) {
        super(props);
        this.lineWidth = props.lineWidth ?? 1;
        this.lineCap = props.lineCap ?? "butt";
        this.lineDash = props.lineDash ?? 0;
        this.lineDashGap = props.lineDashGap ?? 0;
        this.lineDashOffset = props.lineDashOffset ?? 0;
        this.arrow = props.arrow ?? {};
    }

    // NORMAL PROPERTIES
    public lineWidth = 1;
    public lineCap: CanvasLineCap = "butt";
    public lineDash = 0;
    public lineDashGap = 0;
    public lineDashOffset = 0;
    // \/ arrow-related properties
    public arrowLength = 0;
    public arrowSide: "start" | "end" | "both" | "none" = "none";
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
    public arrowStrokeOffset = 0;
    public arrowStrokeEnabled = false;
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
            lineDashOffset: this.arrowStrokeOffset
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
        this.arrowStrokeOffset = value.lineDashOffset ?? 0;
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
        this.arrowLength = value.length ?? 0;
        this.arrowSide = value.side ?? "none";
        this.arrowAngle = value.angle ?? 90;
        this.arrowStroke = value.stroke ?? {};
        this.arrowClosed = value.closed ?? false;
        this.arrowColor = value.color ?? Color(0, 0, 0, 0);
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, properties?: LineProperties) {
        super.draw(ctx, {
            ...properties!,
            bounds: this.bounds,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineDash: this.lineDash,
            lineDashGap: this.lineDashGap,
            lineDashOffset: this.lineDashOffset,
            color: Color(this.red, this.green, this.blue, this.colorAlpha),
            arrow: this.arrow
        });
    }

    public static getArrowCoordinates(
        lineAngle: number,
        lineLength: number,
        arrowAngle: number,
        arrowLength: number
    ): [PositionType, PositionType, PositionType] {
        arrowAngle = arrowAngle * Math.PI / 360;
        const [ x, y ] = [
            arrowLength * Math.sin(arrowAngle),
            arrowLength * Math.cos(arrowAngle)
        ];
        lineLength /= 2;
        const pos1 = {
            x: (lineLength - y) * Math.cos(lineAngle) - x * Math.sin(lineAngle),
            y: x * Math.cos(lineAngle) + (lineLength - y) * Math.sin(lineAngle)
        };
        const pos2 = {
            x: lineLength * Math.cos(lineAngle),
            y: lineLength * Math.sin(lineAngle)
        };
        const pos3 = {
            x: (lineLength - y) * Math.cos(lineAngle) + x * Math.sin(lineAngle),
            y: -x * Math.cos(lineAngle) + (lineLength - y) * Math.sin(lineAngle)
        };
        return [pos1, pos2, pos3];
    }

    public static drawArrow(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        line: BoundsType,
        arrow: ArrowType,
        stroke: StrokeType|undefined = undefined,
        offset: PositionType = { x: 0, y: 0 }
    ): Path2D {
        if (arrow.side === "none" || arrow.length === 0) {
            return new Path2D();
        }
        const lineAngle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
        const res = new Path2D();
        ctx.fillStyle = ColorToString(arrow.color ?? Color(0, 0, 0, 0));
        if (arrow.side === "start" || arrow.side === "both") {
            const arrowHead = Line.getArrowCoordinates(
                lineAngle + Math.PI,
                Math.sqrt((line.x2 - line.x1) ** 2 + (line.y2 - line.y1) ** 2),
                (arrow.angle ?? 0),
                arrow.length ?? 0
            );
            const region = new Path2D();
            region.moveTo(arrowHead[0].x + offset.x, arrowHead[0].y + offset.y);
            region.lineTo(arrowHead[1].x + offset.x, arrowHead[1].y + offset.y);
            region.lineTo(arrowHead[2].x + offset.x, arrowHead[2].y + offset.y);
            if (arrow.closed) {
                region.closePath();
            }
            ctx.fillStyle = ColorToString(arrow.color ?? Color(0, 0, 0, 0));
            ctx.fill(region, arrow.closed ? "evenodd" : "nonzero");
            StrokeableSprite.strokeRegion(ctx, stroke, region);
            res.addPath(region);
        }
        if (arrow.side === "end" || arrow.side === "both") {
            const arrowHead = Line.getArrowCoordinates(
                lineAngle,
                Math.sqrt((line.x2 - line.x1) ** 2 + (line.y2 - line.y1) ** 2),
                (arrow.angle ?? 0),
                arrow.length ?? 0
            );
            const region = new Path2D();
            region.moveTo(arrowHead[0].x + offset.x, arrowHead[0].y + offset.y);
            region.lineTo(arrowHead[1].x + offset.x, arrowHead[1].y + offset.y);
            region.lineTo(arrowHead[2].x + offset.x, arrowHead[2].y + offset.y);
            if (arrow.closed) {
                region.closePath();
            }
            ctx.fillStyle = ColorToString(arrow.color ?? Color(0, 0, 0, 0));
            ctx.fill(region, arrow.closed ? "evenodd" : "nonzero");
            StrokeableSprite.strokeRegion(ctx, stroke, region);
            res.addPath(region);
        }
        return res;
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: LineProperties
    ): Path2D => {
        const bounds = translateBounds(properties.bounds ?? Corners(0, 0, 0, 0));
        ctx.lineWidth = properties.lineWidth ?? 1;
        ctx.lineCap = properties.lineCap ?? "butt";
        ctx.strokeStyle = ColorToString(properties.color ?? Color(0, 0, 0));
        ctx.setLineDash([properties.lineDash ?? 0, properties.lineDashGap ?? 0]);
        ctx.lineDashOffset = properties.lineDashOffset ?? 0;
        ctx.beginPath();
        ctx.moveTo(bounds.x1, bounds.y1);
        ctx.lineTo(bounds.x2, bounds.y2);
        ctx.stroke();
        ctx.closePath();
        const region = new Path2D();
        region.moveTo(bounds.x1, bounds.y1);
        region.lineTo(bounds.x2, bounds.y2);
        region.addPath(Line.drawArrow(ctx, bounds, properties.arrow ?? {}, properties.arrow?.stroke ?? {}));
        return region;
    };

    public static Bounds(x1: number, y1: number, x2: number, y2: number): BoundsType {
        return Corners(x1, y1, x2, y2);
    }
}
