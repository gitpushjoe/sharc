import { Sprite } from "../Sprite";
import { Color, translateBounds, ColorToString, Corners } from "../Utils";
import { BoundsType, ColorType } from "../types/Common";
import { LineProperties, OmitBaseProps } from "../types/Sprites";

export default class Line<DetailsType = any>
    extends Sprite<
        DetailsType,
        OmitBaseProps<LineProperties> & { bounds?: BoundsType; color?: ColorType }
    >
    implements Required<OmitBaseProps<LineProperties>>
{
    constructor(props: LineProperties<DetailsType>) {
        super(props);
        this.lineWidth = props.lineWidth ?? 1;
        this.lineCap = props.lineCap ?? "butt";
        this.lineDash = props.lineDash ?? 0;
        this.lineDashGap = props.lineDashGap ?? 0;
        this.lineDashOffset = props.lineDashOffset ?? 0;
    }

    // NORMAL PROPERTIES
    public lineWidth: number = 1;
    public lineCap: CanvasLineCap = "butt";
    public lineDash: number = 0;
    public lineDashGap: number = 0;
    public lineDashOffset: number = 0;

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, properties?: LineProperties) {
        super.draw(ctx, {
            ...properties!,
            bounds: this.bounds,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineDash: this.lineDash,
            lineDashGap: this.lineDashGap,
            lineDashOffset: this.lineDashOffset,
            color: Color(this.red, this.green, this.blue, this.colorAlpha)
        });
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
        const path = new Path2D();
        path.moveTo(bounds.x1, bounds.y1);
        path.lineTo(bounds.x2, bounds.y2);
        return path;
    };

    public static Bounds(x1: number, y1: number, x2: number, y2: number): BoundsType {
        return Corners(x1, y1, x2, y2);
    }
}
