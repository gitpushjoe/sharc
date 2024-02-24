import { BoundsType, PositionType } from "../types/Common";
import { Position  } from "../Utils";
import { OmitBaseProps, PolygonProperties } from "../types/Sprites";
import Path from "./Path";
import StrokeableSprite from "./StrokeableSprite";

export default class Polygon<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<PolygonProperties> & { center?: PositionType },
        object
    >
    implements Required<OmitBaseProps<PolygonProperties>>
{
    constructor(props: PolygonProperties<DetailsType>) {
        super(props);
        this.startRatio = props.startRatio ?? 0;
        this.radius = props.radius ?? 5;
        this.endRatio = props.endRatio ?? 1;
        this.sides = props.sides ?? 5;
        this.fillRule = props.fillRule ?? "nonzero";
        this.centerX = props.center?.x ?? 0;
        this.centerY = props.center?.y ?? 0;
    }

    // NORMAL PROPERTIES
    public sides: number = 5;
    public radius: number = 5;
    public fillRule: CanvasFillRule = "nonzero";
    public startRatio: number = 0;
    public endRatio: number = 1;
    
    // need to override default center getters and setters
    private _centerX: number = 0;
    private _centerY: number = 0;

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
    public get center(): PositionType {
        return { x: this.centerX, y: this.centerY };
    }
    public set center(value: PositionType) {
        this._centerX = value.x;
        this._centerY = value.y;
    }

    // Bounds cannot be set, only get
    public set bounds(_bounds: BoundsType) {
        throw new Error("Polygon bounds cannot be set");
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        this.x1 = this.centerX - this.radius;
        this.y1 = this.centerY - this.radius;
        this.x2 = this.centerX + this.radius;
        this.y2 = this.centerY + this.radius;
        super.draw(ctx, {
            sides: this.sides,
            radius: this.radius,
            fillRule: this.fillRule,
            center: Position(this.centerX, this.centerY),
            startRatio: this.startRatio,
            endRatio: this.endRatio
        });
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: PolygonProperties
    ): Path2D => {
        const sides = properties.sides ?? 5;
        const radius = properties.radius ?? 5;
        if (sides < 3 || radius <= 0) {
            throw new Error("Polygon must have at least 3 sides and a positive radius");
        }
        const path = Array.from({ length: parseInt(sides.toString()) }, (_, idx) => {
            const angle = (2 * Math.PI * idx) / parseInt(sides.toString());
            return Position(radius * Math.cos(angle), radius * Math.sin(angle));
        });
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
