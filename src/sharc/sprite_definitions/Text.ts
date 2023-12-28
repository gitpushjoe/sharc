import { BoundsType, PositionType } from "sharc/types/Common";
import { Corners, Position } from "../Utils";
import { TextProperties, HiddenTextProperties, TextNormalProperties, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class TextSprite<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<TextProperties>, HiddenTextProperties, TextNormalProperties>
    implements Required<OmitBaseProps<TextProperties>>
{
    constructor(props: TextProperties<DetailsType>) {
        super(
            {
                text: props.text ?? "",
                positionX: props.position?.x ?? 0,
                positionY: props.position?.y ?? 0,
                positionIsCenter: props.positionIsCenter ?? false,
                font: props.font ?? "sans-serif",
                fontSize: props.fontSize ?? 16,
                textAlign: props.textAlign ?? "start",
                textBaseline: props.textBaseline ?? "alphabetic",
                textDirection: props.textDirection ?? "inherit",
                maxWidth: props.maxWidth ?? null,
                bold: props.bold ?? false,
                italic: props.italic ?? false
            },
            props as typeof props & { bounds: BoundsType }
        );
    }

    public get text(): string {
        return this.properties.text;
    }
    public set text(text: string) {
        this.properties.text = text;
    }

    public get positionX(): number {
        return this.properties.positionX;
    }
    public set positionX(positionX: number) {
        this.properties.positionX = positionX;
    }

    public get positionY(): number {
        return this.properties.positionY;
    }
    public set positionY(positionY: number) {
        this.properties.positionY = positionY;
    }

    public get position(): PositionType {
        return Position(this.positionX, this.positionY);
    }
    public set position(value: PositionType) {
        this.positionX = value.x;
        this.positionY = value.y;
    }

    public get positionIsCenter(): boolean {
        return this.properties.positionIsCenter;
    }
    public set positionIsCenter(value: boolean) {
        this.properties.positionIsCenter = value;
    }

    public get font(): string {
        return this.properties.font;
    }
    public set font(font: string) {
        this.properties.font = font;
    }

    public get fontSize(): number {
        return this.properties.fontSize;
    }
    public set fontSize(fontSize: number) {
        this.properties.fontSize = fontSize;
    }

    public get textAlign(): CanvasTextAlign {
        return this.properties.textAlign;
    }
    public set textAlign(textAlign: CanvasTextAlign) {
        this.properties.textAlign = textAlign;
    }

    public get textBaseline(): CanvasTextBaseline {
        return this.properties.textBaseline;
    }
    public set textBaseline(textBaseline: CanvasTextBaseline) {
        this.properties.textBaseline = textBaseline;
    }

    public get textDirection(): CanvasDirection {
        return this.properties.textDirection;
    }
    public set textDirection(textDirection: CanvasDirection) {
        this.properties.textDirection = textDirection;
    }

    public get maxWidth(): number | null {
        return this.properties.maxWidth;
    }
    public set maxWidth(maxWidth: number | null) {
        this.properties.maxWidth = maxWidth;
    }

    public get bold(): boolean {
        return this.properties.bold;
    }
    public set bold(bold: boolean) {
        this.properties.bold = bold;
    }

    public get italic(): boolean {
        return this.properties.italic;
    }
    public set italic(italic: boolean) {
        this.properties.italic = italic;
    }

    // Note: may only be accurate after draw() is called
    public get bounds(): BoundsType {
        return Corners(this.x1, this.y1, this.x2, this.y2);
    }
    public set bounds(value: BoundsType) {
        const { x1, y1, x2, y2 } = value;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if ((this.root as TextSprite).stage?.rootStyle === "centered") {
            this.scaleY *= -1;
        }
        ctx.font = `${this.bold ? "bold " : ""}${this.italic ? "italic " : ""}${this.fontSize}px ${this.font}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.direction = this.textDirection;
        const metrics = ctx.measureText(this.text);
        const width = metrics.width;
        const ascent = metrics.actualBoundingBoxAscent;
        const height = this.fontSize;
        if (this.positionIsCenter) {
            this.x1 = this.positionX - width / 2;
            this.y1 = this.positionY - height / 2 + (this.fontSize - ascent);
            this.x2 = this.positionX + width / 2;
            this.y2 = this.positionY + height / 2;
        } else {
            this.x1 = this.positionX;
            this.y1 = this.positionY;
            this.x2 = this.positionX + width;
            this.y2 = this.positionY + height;
        }
        super.draw(ctx, {
            text: this.text,
            position: Position(this.positionX, this.positionY),
            font: this.font,
            fontSize: this.fontSize,
            textAlign: this.textAlign,
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

    public static readonly drawFunction = (ctx: CanvasRenderingContext2D, properties: TextProperties): Path2D => {
        const { text, maxWidth } = properties;
        const metrics = ctx.measureText(text ?? "");
        const textWidth = metrics.width;
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        ctx.fillText(text ?? "", -textWidth / 2, height / 2, maxWidth ?? undefined);
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
