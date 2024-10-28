import { Bounds, Position, invalidSetterFor } from "../Utils";
import { OmitBaseProps, PolygonProperties } from "../types/Sprites";
import Path from "./Path";
import StrokeableSprite from "./StrokeableSprite";

export default class Polygon<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<PolygonProperties> & { center?: Position }, object>
    implements Required<OmitBaseProps<PolygonProperties>>
{
    constructor(props: PolygonProperties<DetailsType>, defaults?: PolygonProperties<DetailsType>) {
        super(props, defaults);
        this.startRatio = props.startRatio ?? defaults?.startRatio ?? this.startRatio;
        this.radius = props.radius ?? defaults?.radius ?? this.radius;
        this.endRatio = props.endRatio ?? defaults?.endRatio ?? this.endRatio;
        this.sides = props.sides ?? defaults?.sides ?? this.sides;
        this.fillRule = props.fillRule ?? defaults?.fillRule ?? this.fillRule;
        this.centerX = props.center?.x ?? defaults?.center?.x ?? this.centerX;
        this.centerY = props.center?.y ?? defaults?.center?.y ?? this.centerY;
    }

    // NORMAL PROPERTIES
    public sides = 5;
    public radius = 5;
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

    @invalidSetterFor("Polygon")
    public set bounds(_bounds: Bounds) {
        return;
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
            center: new Position(this.centerX, this.centerY),
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
            return new Position(radius * Math.cos(angle), radius * Math.sin(angle));
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
