import { Bounds, Position, invalidSetterFor } from "../Utils";
import { OmitBaseProps, StarProperties } from "../types/Sprites";
import Path from "./Path";
import StrokeableSprite from "./StrokeableSprite";

export default class Star<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<StarProperties> & { center?: Position }, object>
    implements Required<OmitBaseProps<StarProperties>>
{
    constructor(props: StarProperties<DetailsType>) {
        super(props);
        this.radius = props.radius ?? 5;
        this.fillRule = props.fillRule ?? "nonzero";
        this.startRatio = props.startRatio ?? 0;
        this.endRatio = props.endRatio ?? 1;
        this.innerRadius = props.innerRadius ?? ((props.radius ?? 5) * (3 - Math.sqrt(5))) / 2;
        const center = props.center ?? { x: 0, y: 0 };
        this.centerX = center.x;
        this.centerY = center.y;
    }

    // NORMAL PROPERTIES
    public radius = 5;
    public innerRadius: number = ((this.radius ?? 5) * (3 - Math.sqrt(5))) / 2;
    public fillRule: CanvasFillRule = "nonzero";
    public startRatio = 0;
    public endRatio = 1;

    // need to override default center getters and setters
    private _centerX = 0;
    private _centerY = 0;

    public get centerX(): number {
        return this._centerX;
    }
    public set centerX(value: number) {
        this._centerX = value;
        this.x1 = this._centerX - this.radius;
        this.x2 = this._centerX + this.radius;
    }

    public get centerY(): number {
        return this._centerY;
    }
    public set centerY(value: number) {
        this._centerY = value;
        this.y1 = this._centerY - this.radius;
        this.y2 = this._centerY + this.radius;
    }

    // AGGREGATE PROPERTIES
    public get center(): Position {
        return { x: this.centerX, y: this.centerY };
    }
    public set center(value: Position) {
        this._centerX = value.x;
        this._centerY = value.y;
    }

    // Bounds cannot be set, only get
    @invalidSetterFor("Star")
    public set bounds(_bounds: Bounds) {
        return;
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        this.x1 = this.centerX - this.radius;
        this.y1 = this.centerY - this.radius;
        this.x2 = this.centerX + this.radius;
        this.y2 = this.centerY + this.radius;
        super.draw(ctx, {
            center: new Position(this.centerX, this.centerY),
            radius: this.radius,
            innerRadius: this.innerRadius,
            startRatio: this.startRatio,
            endRatio: this.endRatio,
            fillRule: this.fillRule
        });
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: StarProperties
    ): Path2D => {
        const radius = properties.radius ?? 5;
        const innerRadius = properties.innerRadius ?? (radius * (3 - Math.sqrt(5))) / 2;

        const pointFromAngle = (angle: number, radius: number) => {
            return new Position(radius * Math.cos(Math.PI / 2 + angle), radius * Math.sin(Math.PI / 2 + angle));
        };

        const path = [
            pointFromAngle(0, radius),
            pointFromAngle((2 * Math.PI) / 10, innerRadius),
            pointFromAngle((2 * Math.PI) / 5, radius),
            pointFromAngle((6 * Math.PI) / 10, innerRadius),
            pointFromAngle((4 * Math.PI) / 5, radius),
            pointFromAngle((10 * Math.PI) / 10, innerRadius),
            pointFromAngle((6 * Math.PI) / 5, radius),
            pointFromAngle((14 * Math.PI) / 10, innerRadius),
            pointFromAngle((8 * Math.PI) / 5, radius),
            pointFromAngle((18 * Math.PI) / 10, innerRadius)
        ];

        return Path.drawFunction(ctx, {
            path,
            fillRule: properties.fillRule ?? "nonzero",
            closePath: true,
            stroke: properties.stroke,
            startRatio: properties.startRatio ?? 0,
            endRatio: properties.endRatio ?? 1
        });
    };
}
