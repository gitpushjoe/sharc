import { Sprite } from "../Sprite";
import { Bounds, PolarPosition, Position } from "../Utils";
import {
    DEFAULT_PROPERTIES,
    HiddenPolarWrapperProperties,
    OmitBaseProps,
    PolarWrapperProperties
} from "../types/Sprites";

export default class PolarWrapper<DetailsType = any>
    extends Sprite<
        DetailsType,
        OmitBaseProps<PolarWrapperProperties<DetailsType>>,
        HiddenPolarWrapperProperties
    >
    implements
        Required<
            OmitBaseProps<PolarWrapperProperties & HiddenPolarWrapperProperties>
        >
{
    constructor(props: PolarWrapperProperties<DetailsType>) {
        (props as DEFAULT_PROPERTIES).bounds = new Bounds(
            props.position?.x ?? 0,
            props.position?.y ?? 0,
            props.position?.x ?? 0,
            props.position?.y ?? 0
        );
        super(props);
        this.angle = props.location?.angle ?? 0;
        this.radius = props.location?.radius ?? 0;
        this.offsetAngle = props.offset?.angle ?? 0;
        this.offsetRadius = props.offset?.radius ?? 0;
        this.active = props.active ?? true;
    }

    // NORMAL PROPERTIES
    public angle = 0;
    public radius = 0;
    public offsetAngle = 0;
    public offsetRadius = 0;
    public active = true;

    // AGGREGATE PROPERTIES
    public get location(): PolarPosition {
        return new PolarPosition(this.angle, this.radius);
    }
    public set location(value: PolarPosition) {
        this.angle = value.angle;
        this.radius = value.radius;
    }

    public get offset(): PolarPosition {
        return new PolarPosition(this.offsetAngle, this.offsetRadius);
    }
    public set offset(value: PolarPosition) {
        this.offsetAngle = value.angle;
        this.offsetRadius = value.radius;
    }

    public get position(): Position {
        return new Position(this.positionX, this.positionY);
    }

    // CALCULATED PROPERTIES
    public get positionX(): number {
        return this.centerX;
    }
    public set positionX(value: number) {
        this.x1 = value;
        this.x2 = value;
    }

    public get positionY(): number {
        return this.centerY;
    }
    public set positionY(value: number) {
        this.y1 = value;
        this.y2 = value;
    }

    public pointIsInPath() {
        return false;
    }

    public draw(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
    ) {
        if (!this.active) {
            return;
        }
        const child = this.child;
        const childPosition = new PolarPosition(
            this.location?.angle ?? 0,
            this.location?.radius ?? 0
        );
        const offset = new PolarPosition(
            this.offset?.angle ?? 0,
            this.offset?.radius ?? 0
        );
        if (child) {
            child.center = PolarPosition.toPosition(childPosition);
        } else {
            return;
        }
        for (let i = 1; i < this.children.length; i++) {
            this.children[i].center = PolarPosition.toPosition(
                PolarPosition.sum(
                    childPosition,
                    PolarPosition.factor(offset, i)
                )
            );
        }
        super.draw(ctx, {
            location: this.location,
            offset: this.offset,
            active: this.active,
            position: this.position
        });
    }

    public readonly drawFunction = (): Path2D => {
        return new Path2D();
    };
}
