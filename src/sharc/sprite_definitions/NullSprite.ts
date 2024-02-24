import { Sprite } from "../Sprite";
import { Position, Corners } from "../Utils";
import { PositionType } from "../types/Common";
import { DEFAULT_PROPERTIES } from "../types/Sprites";

export default class NullSprite<DetailsType = any>
    extends Sprite<
        DetailsType,
        { position: PositionType },
        { positionX: number; positionY: number }
    >
    implements Required<{ position: PositionType; positionX: number; positionY: number }>
{
    constructor(props: { position?: PositionType } & Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds" | "color">) {
        (props as DEFAULT_PROPERTIES).bounds = Corners(
            props.position?.x ?? 0,
            props.position?.y ?? 0,
            props.position?.x ?? 0,
            props.position?.y ?? 0
        );
        (props as DEFAULT_PROPERTIES).color = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0
        };
        props.position ??= Position(0, 0);
        super(props as Required<typeof props>);
    }

    // NORMAL PROPERTIES
    public positionX: number = 0;
    public positionY: number = 0;

    // AGGREGATE PROPERTIES
    public get position(): PositionType {
        return Position(this.positionX, this.positionY);
    }
    public set position(value: PositionType) {
        this.positionX = value.x;
        this.positionY = value.y;
    }

}
