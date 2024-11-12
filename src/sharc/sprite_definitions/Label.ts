import { Bounds, Position, Color } from "../Utils";
import {
    OmitBaseProps,
    LabelProperties,
    HiddenLabelProperties,
    StrokeType,
    RadiusType,
    DropShadowType
} from "../types/Sprites";
import TextSprite from "./Text";
import Rect from "./Rect";
import SlidingStrokeableSprite from "./SlidingStrokeableSprite";

export default class LabelSprite<DetailsType = any>
    extends SlidingStrokeableSprite<DetailsType, OmitBaseProps<LabelProperties>, HiddenLabelProperties>
    implements Required<OmitBaseProps<LabelProperties> & HiddenLabelProperties>
{
    constructor(props: LabelProperties<DetailsType>, defaults?: LabelProperties<DetailsType>) {
        super(props, defaults);
        this.text = props.text ?? defaults?.text ?? this.text;
        this._positionX = props.position?.x ?? defaults?.position?.x ?? this._positionX;
        this._positionY = props.position?.y ?? defaults?.position?.y ?? this._positionY;
        this.positionIsCenter = props.positionIsCenter ?? defaults?.positionIsCenter ?? this.positionIsCenter;
        this.font = props.font ?? defaults?.font ?? this.font;
        this.fontSize = props.fontSize ?? defaults?.fontSize ?? this.fontSize;
        this.textAlign = props.textAlign ?? defaults?.textAlign ?? this.textAlign;
        this.textBaseline = props.textBaseline ?? defaults?.textBaseline ?? this.textBaseline;
        this.textDirection = props.textDirection ?? defaults?.textDirection ?? this.textDirection;
        this.maxWidth = props.maxWidth ?? defaults?.maxWidth ?? this.maxWidth;
        this.bold = props.bold ?? defaults?.bold ?? this.bold;
        this.italic = props.italic ?? defaults?.italic ?? this.italic;
        this.backgroundColor = props.backgroundColor ?? defaults?.backgroundColor ?? this.backgroundColor;
        this.backgroundRadius = props.backgroundRadius ?? defaults?.backgroundRadius ?? this.backgroundRadius;
        this.padding = props.padding ?? defaults?.padding ?? this.padding;
        this.textStroke = props.textStroke ?? defaults?.textStroke ?? this.textStroke;
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
    public padding = 10;
    public backgroundRed = 0;
    public backgroundGreen = 0;
    public backgroundBlue = 0;
    public backgroundAlpha = 0;
    public backgroundRadius: RadiusType = [5];
    public textStroke: StrokeType | null = null;

    public get positionX(): number {
        return this._positionX;
    }
    public set positionX(value: number) {
        this._positionX = value;
        this._bounds = this.calculateBounds(new OffscreenCanvas(0, 0).getContext("2d")!);
    }

    public get positionY(): number {
        return this._positionY;
    }
    public set positionY(value: number) {
        this._positionY = value;
        this._bounds = this.calculateBounds(new OffscreenCanvas(0, 0).getContext("2d")!);
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
            : (this.root as LabelSprite).stage?.rootStyle === "centered"
              ? -height
              : 0;
        return {
            x1: this.positionX + (this.positionIsCenter ? -width / 2 : 0) - xOffset - this.padding,
            y1: this.positionY + (this.positionIsCenter ? -height / 2 : 0) + yOffset - this.padding,
            x2: this.positionX + (this.positionIsCenter ? width / 2 : width) - xOffset + this.padding,
            y2: this.positionY + (this.positionIsCenter ? height / 2 : height) + yOffset + this.padding
        };
    }

    public get backgroundColor(): Color {
        return new Color(this.backgroundRed, this.backgroundGreen, this.backgroundBlue, this.backgroundAlpha);
    }
    public set backgroundColor(backgroundColor: Color) {
        this.backgroundRed = backgroundColor.red;
        this.backgroundGreen = backgroundColor.green;
        this.backgroundBlue = backgroundColor.blue;
        this.backgroundAlpha = backgroundColor.alpha;
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if ((this.root as LabelSprite).stage?.rootStyle === "centered") {
            this.scaleY *= -1;
        }
        this._bounds = this.calculateBounds(ctx);
        super.draw(ctx, {
            text: this.text,
            position: new Position(this.positionX, this.positionY),
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
        properties: LabelProperties,
        dropShadow?: DropShadowType | null,
        colorAlpha?: number
    ): Path2D => {
        const fillStyle = ctx.fillStyle;
        ctx.fillStyle = `rgba(${properties.backgroundColor!.red}, ${properties.backgroundColor!.green}, ${
            properties.backgroundColor!.blue
        }, ${properties.backgroundColor!.alpha})`;
        const path = Rect.drawFunction(
            ctx,
            {
                bounds: new Bounds(this.x1, this.y1, this.x2, this.y2),
                color: properties.backgroundColor,
                radius: properties.backgroundRadius,
                blur: properties.blur,
                stroke: properties.stroke
            },
            dropShadow,
            properties.backgroundColor?.alpha
        );
        ctx.fillStyle = fillStyle;
        TextSprite.drawFunction(
            ctx,
            {
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
            },
            dropShadow,
            colorAlpha
        );
        ctx.fillStyle = `rgba(${properties.backgroundColor!.red}, ${properties.backgroundColor!.green}, ${
            properties.backgroundColor!.blue
        }, ${properties.backgroundColor!.alpha})`;
        if (dropShadow) {
            Rect.drawFunction(
                ctx,
                {
                    bounds: new Bounds(this.x1, this.y1, this.x2, this.y2),
                    color: properties.backgroundColor,
                    radius: properties.backgroundRadius,
                    blur: properties.blur,
                    stroke: properties.stroke
                },
                dropShadow,
                properties.backgroundColor?.alpha
            );
        }
        ctx.fillStyle = fillStyle;
        return path;
    };
}
