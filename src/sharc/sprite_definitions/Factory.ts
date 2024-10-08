import { Shape, Sprite } from "../Sprite";
import { Bounds, Position } from "../Utils";
import {
    Alignment,
    AnchorPosition,
    DEFAULT_PROPERTIES,
    FactoryProperties,
    HiddenFactoryProperties,
    OmitBaseProps
} from "../types/Sprites";
import { managerUpdate } from "./Manager";

export default class Factory<ParametersType=any, DetailsType = any>
extends Sprite<DetailsType, OmitBaseProps<FactoryProperties<ParametersType>>, HiddenFactoryProperties>
implements Required<OmitBaseProps<FactoryProperties<ParametersType> & HiddenFactoryProperties>> {

    constructor(props: FactoryProperties<ParametersType, DetailsType>) {
        (props as DEFAULT_PROPERTIES).bounds = new Bounds(
            props.position?.x ?? 0,
            props.position?.y ?? 0,
            props.position?.x ?? 0,
            props.position?.y ?? 0
        );
        super(props);
        this.anchor = props.anchor ?? null;
        this.align = props.align ?? null;
        this.padding = props.padding ?? null;
        this.factory = props.factory;
        this.parameters = props.parameters;
    }

    // NORMAL PROPERTIES
    public anchor: AnchorPosition | null = null;
    public align: Alignment | null = null;
    public padding: number | null = null;
    public factory: (parameters: ParametersType) => Shape<DetailsType> | undefined;
    public parameters: ParametersType extends number ? number : ParametersType[];

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

    public update(updates: ("align" | "anchor" | "padding")[]) {
        managerUpdate(this, this, updates);
    }

    public generate() {
        this.removeAllChildren();
        const parameterTypeIsNumber = (self: Factory<any, any>): self is Factory<number> => {
            return typeof self.parameters === "number";
        };
        if (parameterTypeIsNumber(this)) {
            for (let i = 0; i < this.parameters; i++) {
                const sprite = this.factory(i);
                if (sprite) {
                    this.addChild(sprite);
                }
            }
            return;
        }
        if (Array.isArray(this.parameters)) {
            for (const param of this.parameters) {
                const sprite = this.factory(param as ParametersType);
                if (sprite) {
                    this.addChild(sprite);
                }
            }
        }
    }
        
    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        super.draw(ctx, {
            position: this.position,
            anchor: this.anchor,
            align: this.align,
            padding: this.padding,
            factory: () => { return undefined; },
            parameters: null!
        });
    }

    public readonly drawFunction = (): Path2D => {
        return new Path2D();
    };


}

