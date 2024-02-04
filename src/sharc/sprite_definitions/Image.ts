import { Corners, Dimensions } from "../Utils";
import { BoundsType, PositionType } from "../types/Common";
import { ImageProperties, HiddenImageProperties, ImageNormalProperties, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class ImageSprite<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<ImageProperties> & { bounds?: BoundsType },
        HiddenImageProperties,
        ImageNormalProperties
    >
    implements Required<OmitBaseProps<ImageProperties> & HiddenImageProperties>
{
    constructor(props: ImageProperties<DetailsType>) {
        super(
            {
                image: props.image,
                srcX1: props.srcBounds?.x1 ?? 0,
                srcY1: props.srcBounds?.y1 ?? 0,
                srcX2: props.srcBounds?.x2 ?? props.image.width,
                srcY2: props.srcBounds?.y2 ?? props.image.height,
                useSrcBounds: props.srcBounds === null ? false : true
            },
            props
        );
        this.bounds = Corners(this.x1, this.y1, this.x2, this.y2);
    }

    public get image(): HTMLImageElement {
        return this.properties.image;
    }
    public set image(value: HTMLImageElement) {
        this.properties.image = value;
    }

    public get srcX1(): number {
        return this.properties.srcX1;
    }
    public set srcX1(value: number) {
        this.properties.srcX1 = value;
    }

    public get srcY1(): number {
        return this.properties.srcY1;
    }
    public set srcY1(value: number) {
        this.properties.srcY1 = value;
    }

    public get srcX2(): number {
        return this.properties.srcX2;
    }
    public set srcX2(value: number) {
        this.properties.srcX2 = value;
    }

    public get srcY2(): number {
        return this.properties.srcY2;
    }
    public set srcY2(value: number) {
        this.properties.srcY2 = value;
    }

    public get useSrcBounds(): boolean {
        return this.properties.useSrcBounds;
    }
    public set useSrcBounds(value: boolean) {
        this.properties.useSrcBounds = value;
    }

    public get srcBounds(): BoundsType {
        return Corners(this.srcX1, this.srcY1, this.srcX2, this.srcY2);
    }
    public set srcBounds(value: BoundsType) {
        if (value === null) {
            this.useSrcBounds = false;
        } else {
            this.useSrcBounds = true;
            this.srcX1 = value.x1;
            this.srcY1 = value.y1;
            this.srcX2 = value.x2;
            this.srcY2 = value.y2;
        }
    }

    public get srcCorner1(): PositionType {
        return { x: this.srcX1, y: this.srcY1 };
    }
    public set srcCorner1(value: PositionType) {
        this.srcX1 = value.x;
        this.srcY1 = value.y;
    }

    public get srcCorner2(): PositionType {
        return { x: this.srcX2, y: this.srcY2 };
    }
    public set srcCorner2(value: PositionType) {
        this.srcX2 = value.x;
        this.srcY2 = value.y;
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        super.draw(ctx, {
            image: this.image,
            bounds: this.bounds,
            srcBounds: this.useSrcBounds ? Corners(this.srcX1, this.srcY1, this.srcX2, this.srcY2) : null
        });
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: ImageProperties
    ): Path2D => {
        const { image, srcBounds: sourceBounds, bounds } = properties;
        const width = bounds!.x2 - bounds!.x1;
        const height = bounds!.y2 - bounds!.y1;
        if (sourceBounds) {
            ctx.drawImage(
                image,
                sourceBounds.x1,
                sourceBounds.y1,
                sourceBounds.x2 - sourceBounds.x1,
                sourceBounds.y2 - sourceBounds.y1,
                -width / 2,
                -height / 2,
                width,
                height
            );
        } else {
            ctx.drawImage(image, -width / 2, -height / 2, width, height);
        }

        const region = new Path2D();
        region.moveTo(-width / 2, -height / 2);
        region.lineTo(width / 2, -height / 2);
        region.lineTo(width / 2, height / 2);
        region.lineTo(-width / 2, height / 2);
        region.closePath();

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

    public static Bounds(x1: number, y1: number, width: number, height: number): BoundsType {
        return Dimensions(x1, y1, width, height);
    }
}
