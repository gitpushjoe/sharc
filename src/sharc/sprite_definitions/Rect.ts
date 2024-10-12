import { Bounds } from "../Utils";
import { RectProperties, RadiusType, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class Rect<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<RectProperties> & { bounds?: Bounds },
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

    public draw(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
    ) {
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
        const coords = Bounds.wrtSelf(
            properties.bounds ?? new Bounds(0, 0, 0, 0)
        );
        if (properties.stroke === null || properties.stroke?.lineWidth === 0) {
            if (
                properties.radius &&
                properties.radius[0] === 0 &&
                properties.radius.length === 1
            ) {
                const region = new Path2D();
                region.rect(
                    coords.x1,
                    coords.y1,
                    coords.x2 - coords.x1,
                    coords.y2 - coords.y1
                );
                ctx.fill(region, "nonzero");
                return region;
            } else {
                const region = new Path2D();
                region.roundRect(
                    coords.x1,
                    coords.y1,
                    coords.x2 - coords.x1,
                    coords.y2 - coords.y1,
                    properties.radius
                );
                ctx.fill(region, "nonzero");
                return region;
            }
        }
        StrokeableSprite.strokeRegion(ctx, properties.stroke);
        if (properties.stroke?.lineDash === 0) {
            const region = new Path2D();
            region.roundRect(
                coords.x1,
                coords.y1,
                coords.x2 - coords.x1,
                coords.y2 - coords.y1,
                properties.radius
            );
            ctx.fill(region, "nonzero");
            ctx.stroke(region);
            return region;
        } else {
            const region = new Path2D();
            region.roundRect(
                coords.x1,
                coords.y1,
                coords.x2 - coords.x1,
                coords.y2 - coords.y1,
                properties.radius
            );
            ctx.fill(region, "nonzero");
            ctx.stroke(region);
            return region;
        }
    };

    public static Bounds(
        x1: number,
        y1: number,
        width: number,
        height: number
    ): Bounds {
        return Bounds.fromDimensions(x1, y1, width, height);
    }
}
