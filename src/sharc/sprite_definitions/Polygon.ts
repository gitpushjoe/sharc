import { BoundsType, PositionType } from "../types/Common";
import { Position, CircleBounds } from "../Utils";
import {
    OmitBaseProps,
    PolygonNormalProperties,
    PolygonProperties,
} from "../types/Sprites";
import Path from "./Path";
import StrokeableSprite from "./StrokeableSprite";

export default class Polygon<DetailsType = any>
    extends StrokeableSprite<
        DetailsType,
        OmitBaseProps<PolygonProperties> & { center: PositionType },
        object,
        PolygonNormalProperties
    >
    implements Required<OmitBaseProps<PolygonProperties> & { center: PositionType }>
{
    constructor(props: PolygonProperties<DetailsType>) {
        super(
            {
                startRatio: props.startRatio ?? 0,
                radius: props.radius ?? 5,
                endRatio: props.endRatio ?? 1,
                sides: props.sides ?? 5,
                fillRule: props.fillRule ?? "nonzero"
            },
            props as Required<PolygonProperties> & { bounds: BoundsType }
        );
        const bounds = CircleBounds(props.center?.x ?? 0, props.center?.y ?? 0, this.radius);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
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

    public get radius(): number {
        return this.properties.radius;
    }
    public set radius(value: number) {
        this.properties.radius = value;
    }

    public get sides(): number {
        return this.properties.sides;
    }
    public set sides(value: number) {
        this.properties.sides = value;
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
        throw new Error("Polygon bounds cannot be set");
    }

    public draw(ctx: CanvasRenderingContext2D) {
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

    public readonly drawFunction = (ctx: CanvasRenderingContext2D, properties: PolygonProperties): Path2D => {
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
