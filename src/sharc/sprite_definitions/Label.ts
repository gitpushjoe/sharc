import { BoundsType, ColorType, PositionType } from "../types/Common";
import { Corners, Position, Color } from "../Utils";
import {
    OmitBaseProps,
    LabelProperties,
    HiddenLabelProperties,
    LabelNormalProperties,
    StrokeType,
    RadiusType
} from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";
import TextSprite from "./Text";
import Rect from "./Rect";

export default class LabelSprite<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<LabelProperties>, HiddenLabelProperties, LabelNormalProperties>
    implements Required<OmitBaseProps<LabelProperties> & HiddenLabelProperties>
{
    constructor(props: LabelProperties<DetailsType>) {
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
                italic: props.italic ?? false,
                backgroundRed: props.backgroundColor?.red ?? 0,
                backgroundGreen: props.backgroundColor?.green ?? 0,
                backgroundBlue: props.backgroundColor?.blue ?? 0,
                backgroundAlpha: props.backgroundColor?.alpha ?? 0,
                backgroundRadius: props.backgroundRadius ?? [5],
                padding: props.padding ?? 10,
                textStroke: props.textStroke ?? null
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

    public get padding(): number {
        return this.properties.padding;
    }
    public set padding(padding: number) {
        this.properties.padding = padding;
    }

    public get textStroke(): StrokeType | null {
        return this.properties.textStroke;
    }
    public set textStroke(textStroke: StrokeType | null) {
        this.properties.textStroke = textStroke;
    }

    public get backgroundColor(): ColorType {
        return Color(this.backgroundRed, this.backgroundGreen, this.backgroundBlue, this.backgroundAlpha);
    }
    public set backgroundColor(backgroundColor: ColorType) {
        this.backgroundRed = backgroundColor.red;
        this.backgroundGreen = backgroundColor.green;
        this.backgroundBlue = backgroundColor.blue;
        this.backgroundAlpha = backgroundColor.alpha;
    }

    public get backgroundRed(): number {
        return this.properties.backgroundRed;
    }
    public set backgroundRed(backgroundRed: number) {
        this.properties.backgroundRed = backgroundRed;
    }

    public get backgroundGreen(): number {
        return this.properties.backgroundGreen;
    }
    public set backgroundGreen(backgroundGreen: number) {
        this.properties.backgroundGreen = backgroundGreen;
    }

    public get backgroundBlue(): number {
        return this.properties.backgroundBlue;
    }
    public set backgroundBlue(backgroundBlue: number) {
        this.properties.backgroundBlue = backgroundBlue;
    }

    public get backgroundAlpha(): number {
        return this.properties.backgroundAlpha;
    }
    public set backgroundAlpha(backgroundAlpha: number) {
        this.properties.backgroundAlpha = backgroundAlpha;
    }

    public get backgroundRadius(): RadiusType {
        return this.properties.backgroundRadius;
    }
    public set backgroundRadius(backgroundRadius: RadiusType) {
        this.properties.backgroundRadius = backgroundRadius;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if ((this.root as LabelSprite).stage?.rootStyle === "centered") {
            this.scaleY *= -1;
        }
        ctx.font = `${this.bold ? "bold " : ""}${this.italic ? "italic " : ""}${this.fontSize}px ${this.font}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.direction = this.textDirection;
        const metrics = ctx.measureText(this.text);
        const width = metrics.width;
        const ascent = metrics.fontBoundingBoxAscent;
        const height = this.fontSize;
        if (this.positionIsCenter) {
            this.x1 = this.positionX - width / 2 - this.padding;
            this.y1 = this.positionY - ascent / 2 - this.padding;
            this.x2 = this.positionX + width / 2 + this.padding;
            this.y2 = this.positionY + ascent / 2 + this.padding;
        } else {
            this.x1 = this.positionX - this.padding;
            this.y1 = this.positionY - this.padding;
            this.x2 = this.positionX + width + this.padding;
            this.y2 = this.positionY + height + this.padding;
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
            positionIsCenter: this.positionIsCenter,
            backgroundColor: this.backgroundColor,
            backgroundRadius: this.backgroundRadius,
            textStroke: this.textStroke,
            padding: this.padding
        });
        if ((this.root as LabelSprite).stage?.rootStyle === "centered") {
            this.scaleY *= -1;
        }
    }

    public readonly drawFunction = (ctx: CanvasRenderingContext2D, properties: LabelProperties): Path2D => {
        const fillStyle = ctx.fillStyle;
        ctx.fillStyle = `rgba(${properties.backgroundColor!.red}, ${properties.backgroundColor!.green}, ${
            properties.backgroundColor!.blue
        }, ${properties.backgroundColor!.alpha})`;
        const path = Rect.drawFunction(ctx, {
            bounds: Corners(this.x1, this.y1, this.x2, this.y2),
            color: properties.backgroundColor,
            radius: properties.backgroundRadius,
            blur: properties.blur,
            stroke: properties.stroke
        });
        ctx.fillStyle = fillStyle;
        TextSprite.drawFunction(ctx, {
            text: properties.text,
            position: properties.position,
            font: properties.font,
            fontSize: properties.fontSize,
            textAlign: properties.textAlign,
            textBaseline: properties.textBaseline,
            textDirection: properties.textDirection,
            maxWidth: properties.maxWidth,
            bold: properties.bold,
            italic: properties.italic,
            positionIsCenter: properties.positionIsCenter,
            stroke: properties.textStroke
        });
        return path;
    };
}
