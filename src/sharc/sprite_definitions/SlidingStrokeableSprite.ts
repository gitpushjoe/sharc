import { Bounds, Position, invalidSetterFor } from "../Utils";
import StrokeableSprite from "./StrokeableSprite";
import { StrokeType, DEFAULT_PROPERTIES } from "../types/Sprites";
import { BoundsType, PositionType } from "sharc/types/Common";

export default abstract class SlidingStrokeableSprite<
    DetailsType = any,
    Properties = any,
    HiddenProperties = object
> extends StrokeableSprite<DetailsType, Properties, HiddenProperties> {
    constructor(
        props: { stroke?: StrokeType | null } & Properties & DEFAULT_PROPERTIES<DetailsType>,
        defaults?: { stroke?: StrokeType | null } & Properties & DEFAULT_PROPERTIES<DetailsType>
    ) {
        super(props, defaults);
        this._x1y1x2y2Locked = true;
    }

    private _x1y1x2y2Locked = false;
    protected _x1 = 0;
    protected _x2 = 0;
    protected _y1 = 0;
    protected _y2 = 0;

    // @ts-expect-error: `x1` is a property in Sprite class but accessor in SlidingStrokeableSprite
    public get x1(): number {
        return this._x1;
    }
    // TODO(gitpushjoe): improve this message
    public set x1(value: number) {
        if (this._x1y1x2y2Locked) {
            throw Error("Invalid setter for x1");
        }
        this._x1 = value;
    }

    // @ts-expect-error: `x2` is a property in Sprite class but accessor in SlidingStrokeableSprite
    public get x2(): number {
        return this._x2;
    }
    public set x2(value: number) {
        if (this._x1y1x2y2Locked) {
            throw Error("Invalid setter for x2");
        }
        this._x2 = value;
    }

    // @ts-expect-error: `y1` is a property in Sprite class but accessor in SlidingStrokeableSprite
    public get y1(): number {
        return this._y1;
    }
    public set y1(value: number) {
        if (this._x1y1x2y2Locked) {
            throw Error("Invalid setter for y1");
        }
        this._y1 = value;
    }

    // @ts-expect-error: `y2` is a property in Sprite class but accessor in SlidingStrokeableSprite
    public get y2(): number {
        return this._y2;
    }
    public set y2(value: number) {
        if (this._x1y1x2y2Locked) {
            throw Error("Invalid setter for y2");
        }
        this._y2 = value;
    }

    protected abstract shiftX(value: number): void;
    protected abstract shiftY(value: number): void;
    protected shift(value: PositionType): void {
        this.shiftX(value.x);
        this.shiftY(value.y);
    }

    public get centerX(): number {
        return (this._x1 + this._x2) / 2;
    }
    public set centerX(value: number) {
        this.shiftX(value - this.centerX);
    }

    public get centerY(): number {
        return (this.y1 + this.y2) / 2;
    }
    public set centerY(value: number) {
        this.shiftY(value - this.centerY);
    }

    public get center(): PositionType {
        return Position(this.centerX, this.centerY);
    }
    public set center(value: PositionType) {
        this.centerX = value.x;
        this.centerY = value.y;
    }

    public get corner1(): PositionType {
        return Position(this.x1, this.y1);
    }
    public set corner1(value: PositionType) {
        this.shiftX(value.x - this._x1);
        this.shiftY(value.y - this._y1);
    }

    public get corner2(): PositionType {
        return Position(this.x2, this.y2);
    }
    public set corner2(value: PositionType) {
        this.shiftX(value.x - this._x2);
        this.shiftY(value.y - this._y2);
    }

    public get bounds() {
        return Bounds(this.x1, this.y1, this.x2, this.y2);
    }
    @invalidSetterFor("DeltaStrokeableSprite")
    public set bounds(_value: BoundsType) {
        return;
    }

    protected get _bounds() {
        return this.bounds;
    }
    protected set _bounds(bounds: BoundsType) {
        this._x1 = bounds.x1;
        this._y1 = bounds.y1;
        this._x2 = bounds.x2;
        this._y2 = bounds.y2;
    }
}
