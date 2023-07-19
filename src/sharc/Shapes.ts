import { DrawFunctionType, ShapeProperties, PrepFunctionType as EffectsType, LineProperties, DefaultProperties, KeysOf, RectProperties } from './types/Shapes';
import { BoundsType, ColorType, PositionType } from './types/Common';
import { RGBA, RGB, Position, Bounds } from './Utils';

export abstract class Shape<Properties = DefaultProperties, HiddenProperties = never> {
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
    protected effects: EffectsType;
    protected drawFunction: DrawFunctionType<Properties>;

    protected specialProperties = new Map<string, string[]>([
        ['color', ['red', 'green', 'blue', 'alpha']],
        ['scale', ['scaleX', 'scaleY']],
        ['bounds', ['x1', 'y1', 'x2', 'y2']],
    ]);

    constructor(props: ShapeProperties<Properties>) {
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
        this.effects = props.prepFunction || (() => { });
        this.drawFunction = props.drawFunction || (() => { });
    }

    public draw(ctx: CanvasRenderingContext2D, properties: Properties) {
        ctx.save();
        this.effects(ctx);
        ctx.globalAlpha = this.alpha;
        ctx.translate(Math.min(this.x1, this.x2) + this.getWidth() / 2, Math.min(this.y1, this.y2) + this.getHeight() / 2);
        ctx.fillStyle = RGBA({ red: this.red, green: this.green, blue: this.blue, alpha: this.colorAlpha });
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

    static getX1Y1WH(bounds: BoundsType): [number, number, number, number] {
        return [
            -Math.abs(bounds.x1 - bounds.x2) / 2,
            -Math.abs(bounds.y1 - bounds.y2) / 2,
            Math.abs(bounds.x1 - bounds.x2),
            Math.abs(bounds.y1 - bounds.y2)
        ]
    }

    static initializeProps(props: { color?: ColorType, alpha?: number, rotation?: number, scale?: PositionType, bounds: BoundsType }) {
        return {
            color: props.color || RGB(0, 0, 0),
            alpha: props.alpha || 1,
            rotation: props.rotation || 0,
            scale: props.scale || Position(1, 1),
            bounds: props.bounds
        };
    }

    public getProperty(property: KeysOf<Properties>): any {
        if (this.specialProperties.has(property as string)) {
            const specialProps = this.specialProperties.get(property as string)!;
            let object : any = {};
            specialProps.forEach(prop => object[prop] = this.getProperty(prop as KeysOf<Properties>));
            return object;
        }
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
        const coords = Shape.getX1Y1WH(properties.bounds);
        ctx.lineWidth = properties.lineWidth || 1;
        ctx.lineCap = properties.lineCap || 'butt';
        ctx.strokeStyle = RGBA(properties.color || RGB(0, 0, 0));
        ctx.beginPath();
        ctx.moveTo(coords[0], coords[1]);
        ctx.lineTo(-coords[0], -coords[1]);
        ctx.stroke();
        ctx.closePath();
    }
};

export class Rect extends Shape<RectProperties> {
    protected strokeEnabled: boolean;
    protected strokeRed: number;
    protected strokeGreen: number;
    protected strokeBlue: number;
    protected strokeAlpha: number;
    protected strokeSize: number;
    protected strokeJoin: CanvasLineJoin;
    protected strokeDash: number;
    protected strokeDashGap: number;
    protected strokeOffset: number;

    constructor(props: RectProperties) {
        super({
            drawFunction: Rect.drawRect,
            ...Shape.initializeProps(props)
        });
        this.strokeEnabled = props.stroke !== undefined;
        this.strokeRed = props.stroke?.color?.red || 0;
        this.strokeGreen = props.stroke?.color?.green || 0;
        this.strokeBlue = props.stroke?.color?.blue || 0;
        this.strokeAlpha = props.stroke?.color?.alpha || 1;
        this.strokeSize = props.stroke?.width || 1;
        this.strokeJoin = props.stroke?.join || 'miter';
        this.strokeDash = props.stroke?.lineDash || 0;
        this.strokeDashGap = props.stroke?.lineDashGap || props.stroke?.lineDash || 0;
        this.strokeOffset = props.stroke?.lineDashOffset || 0;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, { 
            bounds: this.getBounds(),
            stroke: this.strokeEnabled ? {
                color: RGB(this.strokeRed, this.strokeGreen, this.strokeBlue, this.strokeAlpha),
                width: this.strokeSize,
                join: this.strokeJoin,
                lineDash: this.strokeDash,
                lineDashGap: this.strokeDashGap,
                lineDashOffset: this.strokeOffset
            } : null
        });
    }

    public static drawRect(ctx: CanvasRenderingContext2D, properties: RectProperties) {
        const coords = Shape.getX1Y1WH(properties.bounds);
        ctx.fillRect(...coords);
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width || 1;
            ctx.lineJoin = join || 'miter';
            ctx.strokeStyle = RGBA(color || RGB(0, 0, 0));
            ctx.setLineDash([lineDash || 0, lineDashGap || 0]);
            ctx.lineDashOffset = lineDashOffset || 0;
            if (lineDash === 0) {
                ctx.strokeRect(...coords);
            } else {
                ctx.beginPath();
                ctx.moveTo(coords[0], coords[1]);
                ctx.lineTo(coords[2], coords[1]);
                ctx.lineTo(coords[2], coords[3]);
                ctx.lineTo(coords[0], coords[3]);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
};

// export class Circle extends Shape<CircleProperties>