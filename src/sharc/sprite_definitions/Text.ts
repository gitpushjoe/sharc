import { Color, Position } from "../Utils";
import { TextProperties, HiddenTextProperties, OmitBaseProps, DropShadowType } from "../types/Sprites";
import SlidingStrokeableSprite from "./SlidingStrokeableSprite";
import StrokeableSprite from "./StrokeableSprite";

export default class TextSprite<DetailsType = any>
    extends SlidingStrokeableSprite<DetailsType, OmitBaseProps<TextProperties>, HiddenTextProperties>
    implements Required<OmitBaseProps<TextProperties>>
{
    constructor(props: TextProperties<DetailsType>, defaults?: TextProperties<DetailsType>) {
        super(props, defaults);
        this.text = props.text ?? defaults?.text ?? this.text;
        this.positionX = props.position?.x ?? defaults?.position?.x ?? this.positionX;
        this.positionY = props.position?.y ?? defaults?.position?.y ?? this.positionY;
        this.positionIsCenter = props.positionIsCenter ?? defaults?.positionIsCenter ?? this.positionIsCenter;
        this.font = props.font ?? defaults?.font ?? this.font;
        this.fontSize = props.fontSize ?? defaults?.fontSize ?? this.fontSize;
        this.textAlign = props.textAlign ?? defaults?.textAlign ?? this.textAlign;
        this.textBaseline = props.textBaseline ?? defaults?.textBaseline ?? this.textBaseline;
        this.textDirection = props.textDirection ?? defaults?.textDirection ?? this.textDirection;
        this.maxWidth = props.maxWidth ?? defaults?.maxWidth ?? this.maxWidth;
        this.bold = props.bold ?? defaults?.bold ?? this.bold;
        this.italic = props.italic ?? defaults?.italic ?? this.italic;
        this._bounds = this.calculateBounds(new OffscreenCanvas(0, 0).getContext("2d")!);
    }

    // NORMAL PROPERTIES
    public text = "";
    public positionIsCenter = false;
    public font = "sans-serif";
    public fontSize = 16;
    public bold = false;
    public italic = false;
    public textAlign: CanvasTextAlign = "start";
    public textBaseline: CanvasTextBaseline = "alphabetic";
    public textDirection: CanvasDirection = "inherit";
    public maxWidth: number | null = null;
    private _positionX = 0;
    private _positionY = 0;

    public get positionX(): number {
        return this._positionX;
    }
    public set positionX(value: number) {
        this._positionX = value;
        this._bounds = this.calculateBounds(new OffscreenCanvas(0, 0).getContext('2d')!);
    }

    public get positionY(): number {
        return this._positionY;
    }
    public set positionY(value: number) {
        this._positionY = value;
        this._bounds = this.calculateBounds(new OffscreenCanvas(0, 0).getContext('2d')!);
    }

    public get position(): Position {
        return new Position(this.positionX, this.positionY);
    }
    public set position(value: Position) {
        this.positionX = value.x;
        this.positionY = value.y;
        this._bounds = this.calculateBounds(new OffscreenCanvasRenderingContext2D());
    }

    protected shiftX(value: number) {
        this.positionX += value;
    }
    protected shiftY(value: number) {
        this.positionY += value;
    }

    private calculateBounds(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        ctx.font = `${this.bold ? "bold " : ""}${this.italic ? "italic " : ""}${this.fontSize}px ${this.font}`;
        ctx.textBaseline = this.textBaseline;
        ctx.direction = this.textDirection;
        const metrics = ctx.measureText(this.text);
        const width = metrics.width;
        const height = this.fontSize;
        const xOffset = !this.positionIsCenter
            ? this.textAlign === "start" || this.textAlign === "left"
                ? 0
                : this.textAlign === "end" || this.textAlign === "right"
                  ? width
                  : this.textAlign === "center"
                    ? width / 2
                    : 0
            : 0;
        const yOffset = this.positionIsCenter
            ? 0
            : (this.root as TextSprite).stage?.rootStyle === "centered"
              ? -height
              : -height / 2;
        return {
            x1: this._positionX + (this.positionIsCenter ? -width / 2 : 0) - xOffset,
            y1: this._positionY + (this.positionIsCenter ? -height / 2 : 0) + yOffset,
            x2: this._positionX + (this.positionIsCenter ? width / 2 : width) - xOffset,
            y2: this._positionY + (this.positionIsCenter ? height / 2 : height) + yOffset
        };
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if ((this.root as TextSprite).stage?.rootStyle === "centered") {
            this.scaleY *= -1;
        }
        this._bounds = this.calculateBounds(ctx);
        super.draw(ctx, {
            text: this.text,
            position: new Position(this.positionX, this.positionY),
            font: this.font,
            fontSize: this.fontSize,
            textAlign: "start",
            textBaseline: this.textBaseline,
            textDirection: this.textDirection,
            maxWidth: this.maxWidth,
            bold: this.bold,
            italic: this.italic,
            positionIsCenter: this.positionIsCenter
        });
        if ((this.root as TextSprite).stage?.rootStyle === "centered") {
            this.scaleY *= -1;
        }
    }

    public readonly drawFunction = TextSprite.drawFunction;

    public static readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: TextProperties,
        dropShadow?: DropShadowType | null,
        colorAlpha?: number
    ): Path2D => {
        const { text, maxWidth } = properties;
        const metrics = ctx.measureText(text ?? "");
        const textWidth = metrics.width;
        // TO-DO(gitpushjoe): un-hardcode this
        const height = properties.fontSize! * 0.6;
        StrokeableSprite.strokeDropShadow(
            ctx,
            dropShadow,
            undefined,
            properties.stroke,
            colorAlpha,
            undefined,
            (ctx, shadow) => {
                const stroke = properties.stroke;
                const prevStrokeColor = stroke?.color ?? new Color();
                shadow ??= undefined;
                const strokeColor = new Color(
                    shadow?.color?.red ?? 0,
                    shadow?.color?.green ?? 0,
                    shadow?.color?.blue ?? 0,
                    (shadow?.color?.alpha ?? 0) * (stroke?.color?.alpha ?? 1) * (shadow?.alpha ?? 1)
                );
                ctx.fillText(text ?? "", -textWidth / 2, height / 2, maxWidth ?? undefined);
                stroke ? (stroke.color = strokeColor) : 0;
                if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
                    StrokeableSprite.strokeRegion(ctx, properties.stroke);
                    ctx.strokeText(text ?? "", -textWidth / 2, height / 2, maxWidth ?? undefined);
                }
                stroke ? (stroke.color = prevStrokeColor) : 0;
            }
        );
        ctx.fillText(text ?? "", -textWidth / 2, height / 2, maxWidth ?? undefined);
        if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
            StrokeableSprite.strokeRegion(ctx, properties.stroke);
            ctx.strokeText(text ?? "", -textWidth / 2, height / 2, maxWidth ?? undefined);
        }

        const region = new Path2D();
        region.moveTo(-textWidth / 2, -height / 2);
        region.lineTo(textWidth / 2, -height / 2);
        region.lineTo(textWidth / 2, height / 2);
        region.lineTo(-textWidth / 2, height / 2);
        region.closePath();
        return region;
    };
}
