import { PositionType } from "sharc/types/Common";
import { Bounds, Position } from "../Utils";
import { DropShadowType, OmitBaseProps, PolygonProperties } from "../types/Sprites";
import Path from "./Path";
import SlidingStrokeableSprite from "./SlidingStrokeableSprite";

export default class Polygon<DetailsType = any>
    extends SlidingStrokeableSprite<DetailsType, OmitBaseProps<PolygonProperties> & { center?: PositionType }, object>
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
        this._bounds = Bounds.Circle(this.center.x, this.center.y, this.radius);
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

    protected shiftX(value: number) {
        this._centerX += value;
        this._x1 += value;
        this._x2 += value;
    }
    protected shiftY(value: number) {
        this._centerY += value;
        this._y1 += value;
        this._y2 += value;
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        super.draw(ctx, {
            sides: this.sides,
            radius: this.radius,
            fillRule: this.fillRule,
            center: this.center,
            startRatio: this.startRatio,
            endRatio: this.endRatio
        });
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: PolygonProperties,
        dropShadow?: DropShadowType | null,
        colorAlpha?: number
    ): Path2D => {
        const sides = properties.sides ?? 5;
        const radius = properties.radius ?? 5;
        if (sides < 3 || radius <= 0) {
            throw new Error("Polygon must have at least 3 sides and a positive radius");
        }
        const path: PositionType[] = [];
        for (let idx = 0; idx < sides; ++idx) {
            const angle = (2 * Math.PI * idx) / sides;
            path.push(Position(radius * Math.cos(angle), radius * Math.sin(angle)));
        }
        return Path.drawFunction(ctx, {
            path,
            fillRule: properties.fillRule ?? "nonzero",
            closePath: true,
            stroke: properties.stroke,
            startRatio: properties.startRatio ?? 0,
            endRatio: properties.endRatio ?? 1
        }, dropShadow, colorAlpha);
    };
}
