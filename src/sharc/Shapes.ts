import { DrawFunctionType, ShapeProperties, PrepFunctionType, LineProperties, DefaultProperties, KeysOf } from './types/Shapes';
import { BoundsType, ColorType, PositionType } from './types/Common';
import { RGBA, RGB, Position, Bounds } from './Utils';

export abstract class Shape<Properties = DefaultProperties> {
    protected red: number;
    protected green: number;
    protected blue: number;
    protected colorAlpha: number;
    protected alpha: number;
    protected x1: number;
    protected y1: number;
    protected x2: number;
    protected y2: number;
    protected scaleX: number;
    protected scaleY: number;
    protected rotation: number;
    protected prepFunction: PrepFunctionType;
    protected drawFunction: DrawFunctionType<Properties>;

    constructor( props: ShapeProperties<Properties> ) {
        this.red = props.color?.red || 0;
        this.green = props.color?.green || 0;
        this.blue = props.color?.blue || 0;
        this.colorAlpha = props.color?.alpha || 1;
        this.alpha = props.alpha || 1;
        this.rotation = props.rotation || 0;
        this.scaleX = props.scale?.x || 1;
        this.scaleY = props.scale?.y || 1;
        this.x1 = props.bounds.x1;
        this.y1 = props.bounds.y1;
        this.x2 = props.bounds.x2;
        this.y2 = props.bounds.y2;
        this.prepFunction = props.prepFunction || (() => {});
        this.drawFunction = props.drawFunction || (() => {});
    }

    public draw(ctx: CanvasRenderingContext2D, properties: Properties) {
        ctx.save();
        this.prepFunction(ctx);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = RGBA({ red: this.red, green: this.green, blue: this.blue, alpha: this.colorAlpha });
        ctx.translate(this.x1 + this.getWidth() / 2, this.y1 + this.getHeight() / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scaleX, this.scaleY);
        this.drawFunction(ctx, properties);
        ctx.restore();
    }

    public getWidth() {
        return Math.abs(this.x2 - this.x1);
    }

    public getHeight() {
        return Math.abs(this.y2 - this.y1);
    }

    public getBounds() {
        return Bounds(this.x1, this.y1, this.x2, this.y2);
    }

    static initializeProps(props: {color?: ColorType, alpha?: number, rotation?: number, scale?: PositionType, bounds: BoundsType}) {
        return {
            color: props.color || RGB(0, 0, 0),
            alpha: props.alpha || 1,
            rotation: props.rotation || 0,
            scale: props.scale || Position(1, 1),
            bounds: props.bounds
        };
    }

    public getProperty(property: KeysOf<Properties>): any {
        return Object.getOwnPropertyDescriptor(this, property)?.value;
    }

    public setProperty(property: KeysOf<Properties>, value: number, raiseError: boolean = false): boolean {
        if (Object.getOwnPropertyDescriptor(this, property)?.value === undefined) {
            if (raiseError) throw new Error(`Property ${property as string} does not exist on ${this.constructor.name}`);
            return false;
        }
        if (typeof value !== typeof this.getProperty(property)) {
            if (raiseError) throw new Error(`Value ${value} is not a valid value for property ${property as string}`);
            return false;
        }
        Object.defineProperty(this, property, { value });
        return true;
    }

    public isNumericProperty(property: KeysOf<Properties>): boolean {
        return typeof this.getProperty(property) === 'number';
    }
};

export class Line extends Shape<LineProperties> {
    protected lineWidth: number;
    protected lineCap: CanvasLineCap;

    constructor(props: LineProperties) {
        super({
            drawFunction: Line.drawLine,
            ...Shape.initializeProps(props)

        });
        this.lineWidth = props.lineWidth || 1;
        this.lineCap = props.lineCap || 'butt';
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(
            ctx,
            {
                bounds: this.getBounds(),
                lineWidth: this.lineWidth,
                lineCap: this.lineCap,
                color: RGB(this.red, this.green, this.blue, this.colorAlpha)
            },
        );
    }

    public static drawLine(ctx: CanvasRenderingContext2D, properties: LineProperties) {
        ctx.lineWidth = properties.lineWidth || 1;
        ctx.lineCap = properties.lineCap || 'butt';
        ctx.strokeStyle = RGBA(properties.color || RGB(0, 0, 0));
        ctx.beginPath();
        ctx.moveTo(
            -Math.abs(properties.bounds.x1 - properties.bounds.x2) / 2,
            -Math.abs(properties.bounds.y1 - properties.bounds.y2) / 2
        );
        ctx.lineTo(
            Math.abs(properties.bounds.x1 - properties.bounds.x2) / 2,
            Math.abs(properties.bounds.y1 - properties.bounds.y2) / 2
        );
        ctx.stroke();
        ctx.closePath();
    }
};

export class Rect extends Shape {
    constructor(props: DefaultProperties) {
        super({
            drawFunction: Rect.drawRect,
            ...Shape.initializeProps(props)
        });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, { bounds: this.getBounds() });
    }

    public static drawRect(ctx: CanvasRenderingContext2D, properties: DefaultProperties) {
        ctx.fillRect(
            -Math.abs(properties.bounds.x1 - properties.bounds.x2) / 2,
            -Math.abs(properties.bounds.y1 - properties.bounds.y2) / 2,
            Math.abs(properties.bounds.x1 - properties.bounds.x2),
            Math.abs(properties.bounds.y1 - properties.bounds.y2)
        );
    }
};