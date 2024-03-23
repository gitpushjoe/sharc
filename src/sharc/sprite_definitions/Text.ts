import { PositionType } from "sharc/types/Common";
import { Position } from "../Utils";
import { TextProperties, HiddenTextProperties, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class TextSprite<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<TextProperties>, HiddenTextProperties>
    implements Required<OmitBaseProps<TextProperties>>
{
    constructor(props: TextProperties<DetailsType>) {
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

    // AGGREGATE PROPERTIES
    public get position(): PositionType {
        return Position(this.positionX, this.positionY);
    }
    public set position(value: PositionType) {
        this.positionX = value.x;
        this.positionY = value.y;
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
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

    public static readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: TextProperties
    ): Path2D => {
        const { text, maxWidth } = properties;
        const metrics = ctx.measureText(text ?? "");
        const textWidth = metrics.width;
        const height = properties.fontSize! * .725;
        // const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
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
