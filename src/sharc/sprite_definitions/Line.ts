import { Sprite } from "../Sprite";
import { Color, translateBounds, ColorToString, Corners } from "../Utils";
import { BoundsType, ColorType } from "../types/Common";
import { LineProperties, LineNormalProperties, OmitBaseProps } from "../types/Sprites";

export default class Line<DetailsType = any>
    extends Sprite<
        DetailsType,
        OmitBaseProps<LineProperties> & { bounds?: BoundsType; color?: ColorType },
        object,
        LineNormalProperties
    >
    implements Required<OmitBaseProps<LineProperties>>
{
    constructor(props: LineProperties<DetailsType>) {
        super(
            {
                lineWidth: props.lineWidth ?? 1,
                lineCap: props.lineCap ?? "butt",
                lineDash: props.lineDash ?? 0,
                lineDashGap: props.lineDashGap ?? 0,
                lineDashOffset: props.lineDashOffset ?? 0
            },
            props
        );
    }

    public get lineWidth(): number {
        return this.properties.lineWidth;
    }
    public set lineWidth(value: number) {
        this.properties.lineWidth = value;
    }

    public get lineCap(): CanvasLineCap {
        return this.properties.lineCap;
    }
    public set lineCap(value: CanvasLineCap) {
        this.properties.lineCap = value;
    }

    public get lineDash(): number {
        return this.properties.lineDash;
    }
    public set lineDash(value: number) {
        this.properties.lineDash = value;
    }

    public get lineDashGap(): number {
        return this.properties.lineDashGap;
    }
    public set lineDashGap(value: number) {
        this.properties.lineDashGap = value;
    }

    public get lineDashOffset(): number {
        return this.properties.lineDashOffset;
    }
    public set lineDashOffset(value: number) {
        this.properties.lineDashOffset = value;
    }

    public draw(ctx: CanvasRenderingContext2D, properties?: LineProperties) {
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

    public readonly drawFunction = (ctx: CanvasRenderingContext2D, properties: LineProperties): Path2D => {
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
