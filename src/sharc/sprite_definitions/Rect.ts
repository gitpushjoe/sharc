import { BoundsType } from "sharc/types/Common";
import { Bounds } from "../Utils";
import { RectProperties, RadiusType, OmitBaseProps, DropShadowType } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class Rect<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<RectProperties> & { bounds?: BoundsType }, object>
    implements Required<OmitBaseProps<RectProperties>>
{
    constructor(props: RectProperties<DetailsType>, defaults?: RectProperties<DetailsType>) {
        super(props, defaults);
        this.radius = props.radius ?? defaults?.radius ?? this.radius;
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
        properties: RectProperties,
        dropShadow?: DropShadowType | null,
        colorAlpha?: number
    ): Path2D => {
        const coords = Bounds.wrtSelf(properties.bounds ?? Bounds(0, 0, 0, 0));
        if (properties.stroke === null || properties.stroke?.lineWidth === 0) {
            if (properties.radius && properties.radius[0] === 0 && properties.radius.length === 1) {
                const region = new Path2D();
                region.rect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
                StrokeableSprite.strokeDropShadow(ctx, dropShadow, region, properties.stroke, colorAlpha);
                ctx.fill(region, "nonzero");
                return region;
            } else {
                const region = new Path2D();
                region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
                StrokeableSprite.strokeDropShadow(ctx, dropShadow, region, properties.stroke, colorAlpha);
                ctx.fill(region, "nonzero");
                return region;
            }
        }
        StrokeableSprite.strokeRegion(ctx, properties.stroke);
        if (properties.stroke?.lineDash === 0) {
            const region = new Path2D();
            region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
            StrokeableSprite.strokeDropShadow(ctx, dropShadow, region, properties.stroke, colorAlpha, "nonzero");
            ctx.fill(region, "nonzero");
            ctx.stroke(region);
            return region;
        } else {
            const region = new Path2D();
            region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
            // StrokeableSprite.drawDropShadow(ctx, dropShadow, region, properties.stroke, colorAlpha);
            ctx.fill(region, "nonzero");
            ctx.stroke(region);
            return region;
        }
    };

    public static Bounds(x1: number, y1: number, width: number, height: number): BoundsType {
        return Bounds.fromDimensions(x1, y1, width, height);
    }
}
