import { BoundsType, ColorType, PositionType } from "../types/Common";
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
        const bounds = this.calculateBounds(new OffscreenCanvas(0, 0).getContext("2d")!);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
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

    // CALCULATED PROPERTIES
    public get bounds() {
        return this.calculateBounds(new OffscreenCanvas(0, 0).getContext("2d")!);
    }
    public set bounds(_value: BoundsType) {
        throw new Error("Polygon bounds cannot be set");
    }

    public get center() {
        return Position((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
    }
    public set center(value: PositionType) {
        const center = this.center;
        const dx = value.x - center.x;
        const dy = value.y - center.y;
        this.position = Position(this.positionX + dx, this.positionY + dy);
    }

    public get corner1() {
        return Position(this.x1, this.y1);
    }
    public set corner1(value: PositionType) {
        const corner1 = this.corner1;
        const dx = value.x - corner1.x;
        const dy = value.y - corner1.y;
        this.position = Position(this.positionX + dx, this.positionY + dy);
    }

    public get corner2() {
        return Position(this.x2, this.y2);
    }
    public set corner2(value: PositionType) {
        const corner2 = this.corner2;
        const dx = value.x - corner2.x;
        const dy = value.y - corner2.y;
        this.position = Position(this.positionX + dx, this.positionY + dy);
    }

    public get width() {
        return Math.abs(this.x2 - this.x1);
    }
    public set width(_value: number) {
        throw new Error("Text width cannot be set");
    }

    public get height() {
        return Math.abs(this.y2 - this.y1);
    }
    public set height(_value: number) {
        throw new Error("Text height cannot be set");
    }


    private calculateBounds(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        ctx.font = `${this.bold ? "bold " : ""}${this.italic ? "italic " : ""}${this.fontSize}px ${this.font}`;
        ctx.textBaseline = this.textBaseline;
        ctx.direction = this.textDirection;
        const metrics = ctx.measureText(this.text);
        const width = metrics.width;
        const height = this.fontSize;
        const xOffset = 
            !this.positionIsCenter ?
                (this.textAlign === "start" || this.textAlign === "left") ? 0 :
                (this.textAlign === "end" || this.textAlign === "right") ? width :
                this.textAlign === "center" ? width / 2 :
                0 :
            0;
        const yOffset = this.positionIsCenter ? 0 : ((this.root as LabelSprite).stage?.rootStyle === "centered" ? -height : 0);
        return {
            x1: this.positionX + (this.positionIsCenter ? -width / 2 : 0) - xOffset - this.padding,
            y1: this.positionY + (this.positionIsCenter ? -height / 2 : 0) + yOffset - this.padding,
            x2: this.positionX + (this.positionIsCenter ? width / 2 : width) - xOffset + this.padding,
            y2: this.positionY + (this.positionIsCenter ? height / 2 : height) + yOffset + this.padding
        };
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
        const bounds = this.calculateBounds(ctx);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
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
