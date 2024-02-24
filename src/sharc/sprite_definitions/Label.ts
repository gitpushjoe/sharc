import { ColorType, PositionType } from "../types/Common";
import { Corners, Position, Color } from "../Utils";
import { OmitBaseProps, LabelProperties, HiddenLabelProperties, StrokeType, RadiusType } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";
import TextSprite from "./Text";
import Rect from "./Rect";

export default class LabelSprite<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<LabelProperties>, HiddenLabelProperties>
    implements Required<OmitBaseProps<LabelProperties> & HiddenLabelProperties>
{
    constructor(props: LabelProperties<DetailsType>) {
        super(props);
        this.text = props.text ?? "";
        this.positionX = props.position?.x ?? 0;
        this.positionY = props.position?.y ?? 0;
        this.positionIsCenter = props.positionIsCenter ?? false;
        this.font = props.font ?? "sans-serif";
        this.fontSize = props.fontSize ?? 16;
        this.textAlign = props.textAlign ?? "start";
        this.textBaseline = props.textBaseline ?? "alphabetic";
        this.textDirection = props.textDirection ?? "inherit";
        this.maxWidth = props.maxWidth ?? null;
        this.bold = props.bold ?? false;
        this.italic = props.italic ?? false;
        this.backgroundColor = props.backgroundColor ?? Color(0, 0, 0, 0);
        this.backgroundRadius = props.backgroundRadius ?? [5];
        this.padding = props.padding ?? 10;
        this.textStroke = props.textStroke ?? null;
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
    public positionX = 0;
    public positionY = 0;
    public padding = 10;
    public backgroundRed = 0;
    public backgroundGreen = 0;
    public backgroundBlue = 0;
    public backgroundAlpha = 0;
    public backgroundRadius: RadiusType = [5];
    public textStroke: StrokeType | null = null;

    // AGGREGATE PROPERTIES
    public get position(): PositionType {
        return Position(this.positionX, this.positionY);
    }
    public set position(value: PositionType) {
        this.positionX = value.x;
        this.positionY = value.y;
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

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
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

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: LabelProperties
    ): Path2D => {
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
