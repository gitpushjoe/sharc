import { Sprite } from "../Sprite";
import { Position, Corners } from "../Utils";
import { PositionType } from "../types/Common";
import { DEFAULT_PROPERTIES } from "../types/Sprites";

export default class NullSprite<DetailsType = any>
    extends Sprite<
        DetailsType,
        { position: PositionType },
        { positionX: number; positionY: number },
        "positionX" | "positionY"
    >
    implements Required<{ position: PositionType; positionX: number; positionY: number }>
{
    constructor(props: { position?: PositionType } & Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds" | "color">) {
        props.position = props.position ?? Position(0, 0);
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
        super(
            {
                positionX: props.position?.x ?? 0,
                positionY: props.position?.y ?? 0
            },
            props as { position: PositionType } & DEFAULT_PROPERTIES<DetailsType>
        );
    }

    public get position(): PositionType {
        return Position(this.properties.positionX, this.properties.positionY);
    }
    public set position(value: PositionType) {
        this.properties.positionX = value.x;
        this.properties.positionY = value.y;
        this.center = value;
    }

    public get positionX(): number {
        return this.properties.positionX;
    }
    public set positionX(value: number) {
        this.properties.positionX = value;
    }

    public get positionY(): number {
        return this.properties.positionY;
    }
    public set positionY(value: number) {
        this.properties.positionY = value;
    }

    public pointIsInPath(): boolean {
        return false;
    }
}
