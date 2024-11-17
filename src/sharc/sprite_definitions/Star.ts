import { PositionType } from "sharc/types/Common";
import { Bounds, Position } from "../Utils";
import { DropShadowType, OmitBaseProps, StarProperties } from "../types/Sprites";
import Path from "./Path";
import SlidingStrokeableSprite from "./SlidingStrokeableSprite";

export default class Star<DetailsType = any>
    extends SlidingStrokeableSprite<DetailsType, OmitBaseProps<StarProperties> & { center?: PositionType }, object>
    implements Required<OmitBaseProps<StarProperties>>
{
    constructor(props: StarProperties<DetailsType>, defaults?: StarProperties<DetailsType>) {
        super(props, defaults);
        this.radius = props.radius ?? defaults?.radius ?? this.radius;
        this.fillRule = props.fillRule ?? defaults?.fillRule ?? this.fillRule;
        this.startRatio = props.startRatio ?? defaults?.startRatio ?? this.startRatio;
        this.endRatio = props.endRatio ?? defaults?.endRatio ?? this.endRatio;
        this.innerRadius =
            props.innerRadius ??
            (props.radius !== undefined
                ? ((props.radius ?? 5) * (3 - Math.sqrt(5))) / 2
                : (defaults?.innerRadius ?? ((defaults?.radius ?? 5) * (3 - Math.sqrt(5))) / 2));
        const center = props.center ?? defaults?.center ?? Position();
        this.centerX = center.x;
        this.centerY = center.y;
        this._bounds = Bounds.Circle(this.centerX, this.centerY, this.radius);
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
            center: Position(this.centerX, this.centerY),
            radius: this.radius,
            innerRadius: this.innerRadius,
            startRatio: this.startRatio,
            endRatio: this.endRatio,
            fillRule: this.fillRule
        });
    }

    public readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: StarProperties,
        dropShadow?: DropShadowType | null,
        colorAlpha?: number
    ): Path2D => {
        const radius = properties.radius ?? 5;
        const innerRadius = properties.innerRadius ?? (radius * (3 - Math.sqrt(5))) / 2;

        const pointFromAngle = (angle: number, radius: number) => {
            return Position(radius * Math.cos(Math.PI / 2 + angle), radius * Math.sin(Math.PI / 2 + angle));
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
        }, dropShadow, colorAlpha);
    };
}
