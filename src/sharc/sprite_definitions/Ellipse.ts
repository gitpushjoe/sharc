import { getX1Y1WH, CircleBounds } from "../Utils";
import { PositionType } from "../types/Common";
import { EllipseProperties, HiddenEllipseProperties, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class Ellipse<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<EllipseProperties> & { center?: PositionType },
        HiddenEllipseProperties
    >
    implements Required<OmitBaseProps<EllipseProperties> & HiddenEllipseProperties>
{
    constructor(props: EllipseProperties<DetailsType>) {
        super(props);
        this.startAngle = props.startAngle ?? 0;
        this.endAngle = props.endAngle ?? 360;
        const radius = typeof props.radius === "number" ? [props.radius, props.radius] : props.radius ?? [5, 5];
        this.radiusX = radius[0];
        this.radiusY = radius[1];
        const bounds = CircleBounds(props.center?.x ?? 0, props.center?.y ?? 0, radius[0], radius[1]);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
    }

    // NORMAL PROPERTIES
    public startAngle = 0;
    public endAngle = 360;

    // AGGREGATE PROPERTIES
    public get radius(): [number, number] {
        return [this.radiusX, this.radiusY];
    }
    public set radius(value: number | [number, number]) {
        if (typeof value === "number") {
            this.radiusX = value;
            this.radiusY = value;
        } else {
            this.radiusX = value[0];
            this.radiusY = value[1];
        }
    }

    // CALCULATED PROPERTIES
    public get radiusX(): number {
        return this.width / 2;
    }
    public set radiusX(value: number) {
        this.width = value * 2;
    }

    public get radiusY(): number {
        return this.height / 2;
    }
    public set radiusY(value: number) {
        this.height = value * 2;
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        super.draw(ctx, {
            center: { x: this.centerX, y: this.centerY },
            radius: [this.radiusX, this.radiusY],
            startAngle: this.startAngle,
            endAngle: this.endAngle
        });
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: EllipseProperties
    ): Path2D => {
        const [radiusX, radiusY] =
            typeof properties.radius === "number"
                ? [properties.radius, properties.radius]
                : properties.radius ?? [5, 5];
        const bounds = CircleBounds(properties.center!.x, properties.center!.y, radiusX, radiusY);
        const coords = getX1Y1WH(bounds);
        ctx.beginPath();
        const region = new Path2D();
        region.ellipse(
            0,
            0,
            coords[2] / 2,
            coords[3] / 2,
            0,
            ((properties.startAngle ?? 0) * Math.PI) / 180,
            ((properties.endAngle ?? 0) * Math.PI) / 180
        );
        region.closePath();
        ctx.fill(region, "nonzero");
        ctx.closePath();
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
