import { BoundsType, PositionType } from "../types/Common";
import { Position, CircleBounds } from "../Utils";
import {
    OmitBaseProps,
    StarNormalProperties,
    StarProperties,
} from "../types/Sprites";
import Path from "./Path";
import StrokeableSprite from "./StrokeableSprite";

export default class Star<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<StarProperties> & { center?: PositionType },
        object,
        StarNormalProperties
    >
    implements Required<OmitBaseProps<StarProperties>>
{
    constructor(props: StarProperties<DetailsType>) {
        super(
            {
                radius: props.radius ?? 5,
                startRatio: props.startRatio ?? 0,
                endRatio: props.endRatio ?? 1,
                fillRule: props.fillRule ?? "nonzero",
                innerRadius: props.innerRadius ?? ((props.radius ?? 5) * (3 - Math.sqrt(5))) / 2
            },
            props as typeof props & { bounds: BoundsType }
        );
        this.center = { x: props.center?.x ?? 0, y: props.center?.y ?? 0 };
    }

    public get radius(): number {
        return this.properties.radius;
    }
    public set radius(value: number) {
        this.properties.radius = value;
    }

    public get innerRadius(): number {
        return this.properties.innerRadius;
    }
    public set innerRadius(value: number) {
        this.properties.innerRadius = value;
    }

    public get startRatio(): number {
        return this.properties.startRatio;
    }
    public set startRatio(value: number) {
        this.properties.startRatio = value;
    }

    public get endRatio(): number {
        return this.properties.endRatio;
    }
    public set endRatio(value: number) {
        this.properties.endRatio = value;
    }

    public get fillRule(): CanvasFillRule {
        return this.properties.fillRule;
    }
    public set fillRule(value: CanvasFillRule) {
        this.properties.fillRule = value;
    }

    public get bounds(): BoundsType {
        return CircleBounds(this.centerX, this.centerY, this.radius);
    }
    public set bounds(_bounds: BoundsType) {
        throw new Error("Star bounds cannot be set");
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.x1 = this.centerX - this.radius;
        this.y1 = this.centerY - this.radius;
        this.x2 = this.centerX + this.radius;
        this.y2 = this.centerY + this.radius;
        super.draw(ctx, {
            center: Position(this.centerX, this.centerY),
            radius: this.radius,
            innerRadius: this.innerRadius,
            startRatio: this.startRatio,
            endRatio: this.endRatio,
            fillRule: this.fillRule
        });
    }

    public readonly drawFunction = (ctx: CanvasRenderingContext2D, properties: StarProperties): Path2D => {
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
        });
    };
}
