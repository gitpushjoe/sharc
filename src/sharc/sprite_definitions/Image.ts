import { Position, Bounds } from "../Utils";
import { ImageProperties, HiddenImageProperties, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class ImageSprite<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<ImageProperties> & {
            bounds?: Bounds;
            image?: ImageBitmap | null;
        },
        HiddenImageProperties
    >
    implements Required<OmitBaseProps<ImageProperties> & HiddenImageProperties>
{
    constructor(props: ImageProperties<DetailsType>) {
        super(props);
        this.src = props.src ?? "";
        this.useSrcBounds = props.srcBounds === null ? false : true;
        this.srcX1 = props.srcBounds?.x1 ?? 0;
        this.srcY1 = props.srcBounds?.y1 ?? 0;
        this.srcX2 = props.srcBounds?.x2 ?? 0;
        this.srcY2 = props.srcBounds?.y2 ?? 0;
    }

    private async setImage(value: HTMLImageElement | ImageBitmap) {
        if (value instanceof ImageBitmap) {
            this._image = value;
        } else {
            this._image = await createImageBitmap(value);
        }
        if (!this._noresize) {
            this.srcX2 = value.width;
            this.srcY2 = value.height;
        }
    }

    // NORMAL PROPERTIES
    public useSrcBounds = false;
    public srcX1 = 0;
    public srcY1 = 0;
    public srcX2 = 0;
    public srcY2 = 0;

    // AGGREGATE PROPERTIES
    public get srcBounds(): Bounds {
        return new Bounds(this.srcX1, this.srcY1, this.srcX2, this.srcY2);
    }
    public set srcBounds(value: Bounds) {
        this.srcX1 = value.x1;
        this.srcY1 = value.y1;
        this.srcX2 = value.x2;
        this.srcY2 = value.y2;
    }

    public get srcCorner1(): Position {
        return new Position(this.srcX1, this.srcY1);
    }
    public set srcCorner1(value: Position) {
        this.srcX1 = value.x;
        this.srcY1 = value.y;
    }

    public get srcCorner2(): Position {
        return new Position(this.srcX2, this.srcY2);
    }
    public set srcCorner2(value: Position) {
        this.srcX2 = value.x;
        this.srcY2 = value.y;
    }

    // CALCULATED PROPERTIES
    private _image: ImageBitmap | null = null;
    private _noresize = false;
    public get image(): ImageBitmap | null {
        return this.src === "" || this.src == "noresize:" ? null : this._image;
    }
    public set image(value: HTMLImageElement | ImageBitmap | null) {
        if (value === null) {
            this._image = null;
        } else if (value instanceof ImageBitmap) {
            this._src = `${(this._noresize && "noresize:") || ""}${value.width}x${value.height}`;
            void this.setImage(value);
        } else if (value instanceof HTMLImageElement) {
            this._src = value.src;
            if (value.complete) {
                void this.setImage(value);
            } else {
                value.onload = this.setImage.bind(this, value);
            }
        } else {
            this._image = null;
        }
    }

    private _src = "";
    public get src(): string {
        return this._src;
    }
    public set src(value: string) {
        this._src = value.startsWith("noresize:") ? value.slice(9) : value;
        this._noresize = value.startsWith("noresize:");
        value = this._noresize ? value.slice(9) : value;
        if (typeof Image !== "undefined") {
            const image = new Image();
            image.src = value;
            this.image = image;
        } else {
            this.image = null;
            this._src = value;
            void (async () => {
                const response = await fetch(value);
                const blob = await response.blob();
                const image = await createImageBitmap(blob);
                this.image = image;
            })();
        }
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        super.draw(ctx, {
            src: "",
            image: this.image,
            bounds: this.bounds,
            srcBounds: this.useSrcBounds ? new Bounds(this.srcX1, this.srcY1, this.srcX2, this.srcY2) : null
        });
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: ImageProperties & { image?: ImageBitmap | null }
    ): Path2D => {
        const { image, srcBounds: sourceBounds, bounds } = properties;
        const width = bounds!.x2 - bounds!.x1;
        const height = bounds!.y2 - bounds!.y1;
        if (image) {
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
        }

        const region = new Path2D();
        region.moveTo(-width / 2, -height / 2);
        region.lineTo(width / 2, -height / 2);
        region.lineTo(width / 2, height / 2);
        region.lineTo(-width / 2, height / 2);
        region.closePath();

        StrokeableSprite.strokeRegion(ctx, properties.stroke, region);
        return region;
    };

    public static Bounds(x1: number, y1: number, width: number, height: number): Bounds {
        return Bounds.fromDimensions(x1, y1, width, height);
    }
}
