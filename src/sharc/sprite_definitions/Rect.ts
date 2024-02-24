import { translateBounds, Dimensions, Corners } from "../Utils";
import { BoundsType } from "../types/Common";
import { RectProperties, RadiusType, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class Rect<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<RectProperties> & { bounds?: BoundsType },
        object
    >
    implements Required<OmitBaseProps<RectProperties>>
{
    constructor(props: RectProperties<DetailsType>) {
        super(props);
        this.radius = props.radius ?? [0];
    }

    // NORMAL PROPERTIES
    public radius: RadiusType = [0];

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        super.draw(ctx, {
            bounds: this.bounds,
            radius: this.radius
        });
    }

    public readonly drawFunction = Rect.drawFunction;
    public static readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: RectProperties
    ): Path2D => {
        const coords = translateBounds(properties.bounds ?? Corners(0, 0, 0, 0));
        if (properties.stroke === null || properties.stroke?.lineWidth === 0) {
            if (properties.radius && properties.radius[0] === 0 && properties.radius.length === 1) {
                const region = new Path2D();
                region.rect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
                ctx.fill(region, "nonzero");
                return region;
            } else {
                const region = new Path2D();
                region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
                ctx.fill(region, "nonzero");
                return region;
            }
        }
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
        ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
        ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
        ctx.lineDashOffset = lineDashOffset ?? 0;
        if (lineDash === 0) {
            const region = new Path2D();
            region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
            ctx.fill(region, "nonzero");
            ctx.stroke(region);
            return region;
        } else {
            const region = new Path2D();
            region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
            ctx.fill(region, "nonzero");
            ctx.stroke(region);
            return region;
        }
    };

    public static Bounds(x1: number, y1: number, width: number, height: number): BoundsType {
        return Dimensions(x1, y1, width, height);
    }
}
