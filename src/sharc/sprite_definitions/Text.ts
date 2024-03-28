import { BoundsType, PositionType } from "sharc/types/Common";
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
        const yOffset = this.positionIsCenter ? 0 : ((this.root as TextSprite).stage?.rootStyle === "centered" ? -height : 0);
        return {
            x1: this.positionX + (this.positionIsCenter ? -width / 2 : 0) - xOffset,
            y1: this.positionY + (this.positionIsCenter ? -height / 2 : 0) + yOffset,
            x2: this.positionX + (this.positionIsCenter ? width / 2 : width) - xOffset,
            y2: this.positionY + (this.positionIsCenter ? height / 2 : height) + yOffset
        };
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if ((this.root as TextSprite).stage?.rootStyle === "centered") {
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
        properties: TextProperties
    ): Path2D => {
        const { text, maxWidth } = properties;
        const metrics = ctx.measureText(text ?? "");
        const textWidth = metrics.width;
        const height = properties.fontSize! * 0.725;
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
