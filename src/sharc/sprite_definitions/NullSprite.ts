import { Sprite } from "../Sprite";
import { Position, Bounds } from "../Utils";
import { DEFAULT_PROPERTIES, HiddenNullSpriteProperties, NullSpriteProperties, OmitBaseProps } from "../types/Sprites";

export default class NullSprite<DetailsType = any>
    extends Sprite<DetailsType, OmitBaseProps<NullSpriteProperties>, HiddenNullSpriteProperties>
    implements Required<OmitBaseProps<NullSpriteProperties> & HiddenNullSpriteProperties>
{
    constructor(props: NullSpriteProperties<DetailsType> & Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds" | "color">) {
        (props as DEFAULT_PROPERTIES).bounds = new Bounds(
            props.position?.x ?? 0,
            props.position?.y ?? 0,
            props.position?.x ?? 0,
            props.position?.y ?? 0
        );
        props.position ??= new Position(0, 0);
        super(props as Required<typeof props>);
    }

    // AGGREGATE PROPERTIES
    public get position(): Position {
        return new Position(this.positionX, this.positionY);
    }
    public set position(value: Position) {
        this.positionX = value.x;
        this.positionY = value.y;
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
}
