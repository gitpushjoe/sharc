import { DrawFunctionType, ShapeProperties, EffectsType as EffectsType, LineProperties, DEFAULT_PROPERTIES, KeysOf, StrokeProperties, HiddenStrokeProperties, StrokeType, EllipseProperties, HiddenEllipseProperties, BezierCurveProperties } from './types/Shapes';
import { BoundsType, ColorType, PositionType } from './types/Common';
import { ColorToString, RGBA, Position, Corners } from './Utils';
import { AcceptedTypesOf } from './types/Animation';

export abstract class Shape<Properties = DEFAULT_PROPERTIES, HiddenProperties = never> {
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
    public children: Shape<any, any>[] = [];

    protected aggregateProperties = new Map<string, string[]>([
        ['color', ['red', 'green', 'blue', 'alpha']],
        ['scale', ['scaleX', 'scaleY']],
        ['bounds', ['x1', 'y1', 'x2', 'y2']],
    ]);

    protected calculatedProperties = new Map<string, {getter: (self: Shape<any, any>) => any, setter: (self: Shape<any, any>, value: any) => void}>([
        ['center', {
                getter: (self) : PositionType => Position((self.x1 + self.x2) / 2, (self.y1 + self.y2) / 2),
                setter: (self: Shape, value: PositionType) => {
                    const [width, height] = [self.getWidth(), self.getHeight()];
                    self.x1 = value.x - width / 2;
                    self.y1 = value.y - height / 2;
                    self.x2 = value.x + width / 2;
                    self.y2 = value.y + height / 2;
                }
            }
        ],
        [ 'x', {
                getter: (self) : number => (self.x1 + self.x2) / 2,
                setter: (self: Shape, value: number) => {
                    const width = self.getWidth();
                    self.x1 = value - width / 2;
                    self.x2 = value + width / 2;
                }
            }
        ],
        [ 'y', {
                getter: (self) : number => (self.y1 + self.y2) / 2,
                setter: (self: Shape, value: number) => {
                    const height = self.getHeight();
                    self.y1 = value - height / 2;
                    self.y2 = value + height / 2;
                }
            }
        ],
        ['scale', {
                getter: (self) : PositionType => Position(self.scaleX, self.scaleY),
                setter: (self: Shape, value: PositionType) => {
                    self.scaleX = value.x;
                    self.scaleY = value.y;
                }
            }
        ]
    ]);

    constructor(props: ShapeProperties<Properties>) {
        this.red = props.color?.red ?? 0;
        this.green = props.color?.green ?? 0;
        this.blue = props.color?.blue ?? 0;
        this.colorAlpha = props.color?.alpha ?? 1;
        this.alpha = props.alpha ?? 1;
        this.rotation = props.rotation ?? 0;
        this.scaleX = props.scale?.x ?? 1;
        this.scaleY = props.scale?.y ?? 1;
        this.x1 = props.bounds.x1;
        this.y1 = props.bounds.y1;
        this.x2 = props.bounds.x2;
        this.y2 = props.bounds.y2;
        this.effects = props.prepFunction ?? (() => { });
        this.drawFunction = props.drawFunction ?? (() => { });
    }

    public draw(ctx: CanvasRenderingContext2D, properties?: Properties) {
        ctx.save();
        this.effects(ctx);
        ctx.globalAlpha = this.alpha;
        ctx.translate(Math.min(this.x1, this.x2) + this.getWidth() / 2, Math.min(this.y1, this.y2) + this.getHeight() / 2);
        ctx.fillStyle = ColorToString({ red: this.red, green: this.green, blue: this.blue, alpha: this.colorAlpha });
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scaleX, this.scaleY);
        this.drawFunction(ctx, properties!);
        this.children.forEach(child => child.draw(ctx, null));
        ctx.restore();
    }

    public getWidth() {
        return Math.abs(this.x2 - this.x1);
    }

    public getHeight() {
        return Math.abs(this.y2 - this.y1);
    }

    public getBounds() {
        return Corners(this.x1, this.y1, this.x2, this.y2);
    }

    static getContextArgs(bounds: BoundsType): [number, number, number, number] {
        return [
            -Math.abs(bounds.x1 - bounds.x2) / 2,
            -Math.abs(bounds.y1 - bounds.y2) / 2,
            Math.abs(bounds.x1 - bounds.x2),
            Math.abs(bounds.y1 - bounds.y2)
        ]
    }

    static initializeProps(props: { color?: ColorType, alpha?: number, rotation?: number, scale?: PositionType, bounds: BoundsType }) {
        return {
            color: props.color ?? RGBA(0, 0, 0),
            alpha: props.alpha ?? 1,
            rotation: props.rotation ?? 0,
            scale: props.scale ?? Position(1, 1),
            bounds: props.bounds
        };
    }

    public getProperty(property: KeysOf<Properties>|keyof HiddenProperties): any { // to-do: get rid of any
        if (this.aggregateProperties.has(property as string)) {
            const specialProps = this.aggregateProperties.get(property as string)!;
            let object : any = {};
            specialProps.forEach(prop => object[prop] = this.getProperty(prop as KeysOf<Properties>));
            return object;
        } else if (this.calculatedProperties.has(property as string)) {
            const getter = this.calculatedProperties.get(property as string)!.getter;
            return getter(this);
        }
        return Object.getOwnPropertyDescriptor(this, property)?.value;
    }

    public setProperty(property: KeysOf<Properties>|keyof HiddenProperties, value: AcceptedTypesOf<Properties>, raiseError: boolean = false): boolean {
        if (this.calculatedProperties.has(property as string)) {
            console.log(property)
            const {setter, getter} = this.calculatedProperties.get(property as string)!;
            if (!(typeof value === typeof getter(this))) {
                if (raiseError) throw new Error(`Value ${value} is not a valid value for property ${property as string}`);
                return false;
            }
            setter(this, value);
            return true;
        }
        if (this.aggregateProperties.has(property as string)) {
            throw new Error(`Cannot set property ${property as string} directly`);
        }
        if (Object.getOwnPropertyDescriptor(this, property)?.value === undefined) {
            if (raiseError) throw new Error(`Property ${property as string} does not exist on ${this.constructor.name}`);
            return false;
        }
        if (typeof value !== typeof this.getProperty(property as KeysOf<Properties>)) {
            if (raiseError) throw new Error(`Value ${value} is not a valid value for property ${property as string}`);
            return false;
        }
        Object.defineProperty(this, property, { value });
        return true;
    }

    public isNumericProperty(property: KeysOf<Properties>|keyof HiddenProperties): boolean {
        return typeof this.getProperty(property) === 'number';
    }
};

export class NullShape extends Shape {
    constructor(props: Omit<DEFAULT_PROPERTIES, 'bounds'|'color'> & { position: PositionType }) {
        super({
            drawFunction: () => {},
            ...Shape.initializeProps({
                bounds: Corners(props.position.x, props.position.y, props.position.x, props.position.y),
                ...props
            })
        });
    }
}

export class Line<Properties extends LineProperties = LineProperties, HiddenProperties = never> extends Shape<Properties, HiddenProperties|HiddenStrokeProperties> {
    protected lineWidth: number;
    protected lineCap: CanvasLineCap;

    constructor(props: LineProperties) {
        super({
            drawFunction: Line.drawLine,
            ...Shape.initializeProps(props)
        });
        this.lineWidth = props.lineWidth ?? 1;
        this.lineCap = props.lineCap ?? 'butt';
    }

    public draw(ctx: CanvasRenderingContext2D, properties? : Properties) {
        super.draw(
            ctx,
            {
                ...properties!, // Necessary for any class that can extend Line
                bounds: this.getBounds(),
                lineWidth: this.lineWidth,
                lineCap: this.lineCap,
                color: RGBA(this.red, this.green, this.blue, this.colorAlpha)
            },
        );
    }

    public static drawLine(ctx: CanvasRenderingContext2D, properties: LineProperties) {
        const coords = Shape.getContextArgs(properties.bounds);
        ctx.lineWidth = properties.lineWidth ?? 1;
        ctx.lineCap = properties.lineCap ?? 'butt';
        ctx.strokeStyle = ColorToString(properties.color ?? RGBA(0, 0, 0));
        ctx.beginPath();
        ctx.moveTo(coords[0] * Math.sign(properties.bounds.x2 - properties.bounds.x1), coords[1] * Math.sign(properties.bounds.y2 - properties.bounds.y1));
        ctx.lineTo(coords[0] * Math.sign(properties.bounds.x1 - properties.bounds.x2), coords[1] * Math.sign(properties.bounds.y1 - properties.bounds.y2));
        ctx.stroke();
        ctx.closePath();
    }
};

export abstract class StrokeableShape<Properties extends StrokeProperties = StrokeProperties, HiddenProperties = StrokeProperties> extends Shape<Properties, HiddenStrokeProperties|HiddenProperties> {
    protected strokeEnabled: boolean;
    protected strokeRed: number;
    protected strokeGreen: number;
    protected strokeBlue: number;
    protected strokeAlpha: number;
    protected strokeWidth: number;
    protected strokeJoin: CanvasLineJoin;
    protected strokeCap: CanvasLineCap;
    protected strokeDash: number;
    protected strokeDashGap: number;
    protected strokeOffset: number;

    constructor(props: { stroke: StrokeType|null|undefined } & ShapeProperties<Properties>) {
        super(props);
        this.strokeEnabled = props.stroke !== undefined;
        this.strokeRed = props.stroke?.color?.strokeRed ?? 0;
        this.strokeGreen = props.stroke?.color?.strokeGreen ?? 0;
        this.strokeBlue = props.stroke?.color?.strokeBlue ?? 0;
        this.strokeAlpha = props.stroke?.color?.strokeAlpha ?? 1;
        this.strokeWidth = props.stroke?.width ?? 1;
        this.strokeJoin = props.stroke?.join ?? 'miter';
        this.strokeCap = props.stroke?.cap ?? 'round';
        this.strokeDash = props.stroke?.lineDash ?? 0;
        this.strokeDashGap = props.stroke?.lineDashGap ?? props.stroke?.lineDash ?? 0;
        this.strokeOffset = props.stroke?.lineDashOffset ?? 0;
        this.aggregateProperties.set('strokeColor', ['strokeRed', 'strokeGreen', 'strokeBlue', 'strokeAlpha']);
    }

    public draw(ctx: CanvasRenderingContext2D, properties?: Properties) {
        super.draw(ctx, {
            ...properties!,
            stroke: this.strokeEnabled ? {
                color: {strokeRed: this.strokeRed, strokeGreen: this.strokeGreen, strokeBlue: this.strokeBlue, strokeAlpha: this.strokeAlpha},
                width: this.strokeWidth,
                join: this.strokeJoin,
                cap: this.strokeCap,
                lineDash: this.strokeDash,
                lineDashGap: this.strokeDashGap,
                lineDashOffset: this.strokeOffset
            } : null
        });
    }
}

export class Rect extends StrokeableShape {

    constructor(props: StrokeProperties) {
        super({
            drawFunction: Rect.drawRect,
            stroke: props.stroke,
            ...Shape.initializeProps(props),
        });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, { 
            bounds: this.getBounds(),
        });
    }

    public static drawRect(ctx: CanvasRenderingContext2D, properties: StrokeProperties) {
        const coords = Shape.getContextArgs(properties.bounds);
        ctx.fillRect(...coords);
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.strokeRed ?? 0}, ${color?.strokeGreen ?? 0}, ${color?.strokeBlue ?? 0}, ${color?.strokeAlpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
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

export class Ellipse extends StrokeableShape<EllipseProperties, HiddenEllipseProperties> {
    protected startAngle: number;
    protected endAngle: number;

    constructor(props: EllipseProperties) {
        super({
            drawFunction: Ellipse.drawEllipse,
            stroke: props.stroke,
            ...Shape.initializeProps(props),
        });
        this.startAngle = props.startAngle ?? 0;
        this.endAngle = props.endAngle ?? 360;
        this.calculatedProperties.set(
            'radius',
            {
                getter: (self) => (self.getWidth() + self.getHeight()) / 4,
                setter: (self, value) => {
                    const centerX = Math.min(self.getProperty('x1'), self.getProperty('x2')) + self.getWidth() / 2;
                    const centerY = Math.min(self.getProperty('y1'), self.getProperty('y2')) + self.getHeight() / 2;
                    self.setProperty('x1', centerX - value);
                    self.setProperty('x2', centerX + value);
                    self.setProperty('y1', centerY - value);
                    self.setProperty('y2', centerY + value);
                }
            },
        );
        this.calculatedProperties.set(
            'radiusX',
            {
                getter: (self) => self.getWidth() / 2,
                setter: (self, value) => {
                    const centerX = Math.min(self.getProperty('x1'), self.getProperty('x2')) + self.getWidth() / 2;
                    self.setProperty('x1', centerX - value);
                    self.setProperty('x2', centerX + value);
                }
            },
        );
        this.calculatedProperties.set(
            'radiusY',
            {
                getter: (self) => self.getHeight() / 2,
                setter: (self, value) => {
                    const centerY = Math.min(self.getProperty('y1'), self.getProperty('y2')) + self.getHeight() / 2;
                    self.setProperty('y1', centerY - value);
                    self.setProperty('y2', centerY + value);
                }
            },
        );
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, {
            color: RGBA(this.red, this.green, this.blue, this.colorAlpha),
            bounds: this.getBounds(),
            startAngle: this.startAngle,
            endAngle: this.endAngle,
        });
    }

    public static drawEllipse(ctx: CanvasRenderingContext2D, properties: EllipseProperties) {
        const coords = Shape.getContextArgs(properties.bounds);
        if (coords[2] === coords[3] && (properties.stroke === null || properties.stroke?.width === 0)) {
            ctx.lineWidth = coords[2];
            ctx.lineCap = 'round';
            ctx.strokeStyle = ColorToString(properties.color ?? RGBA(0, 0, 0));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.stroke();
            return;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, coords[2] / 2, coords[3] / 2, 0, (properties.startAngle ?? 0) * Math.PI / 180, (properties.endAngle ?? 0) * Math.PI / 180);
        ctx.fill();
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.strokeRed ?? 0}, ${color?.strokeGreen ?? 0}, ${color?.strokeBlue ?? 0}, ${color?.strokeAlpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke();
        }
    }
}

export class BezierCurve extends Line<BezierCurveProperties> {
    protected controlPoint1x: number;
    protected controlPoint1y: number;
    protected controlPoint2x: number;
    protected controlPoint2y: number;

    constructor(props: BezierCurveProperties) {
        super(props);
        this.drawFunction = BezierCurve.drawBezierCurve;
        this.controlPoint1x = props.control1.x;
        this.controlPoint1y = props.control1.y;
        this.controlPoint2x = props.control2.x;
        this.controlPoint2y = props.control2.y;
        this.calculatedProperties.set(
            'control1',
            {
                getter: (self) => Position(self.getProperty('controlPoint1x'), self.getProperty('controlPoint1y')),
                setter: (self, value) => {
                    self.setProperty('controlPoint1x', value.x);
                    self.setProperty('controlPoint1y', value.y);
                }
            }
        );
        this.calculatedProperties.set(
            'control2',
            {
                getter: (self) => Position(self.getProperty('controlPoint2x'), self.getProperty('controlPoint2y')),
                setter: (self, value) => {
                    self.setProperty('controlPoint2x', value.x);
                    self.setProperty('controlPoint2y', value.y);
                }
            }
        );
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, {
            bounds: this.getBounds(),
            control1: Position(this.controlPoint1x, this.controlPoint1y),
            control2: Position(this.controlPoint2x, this.controlPoint2y),
        });
    }

    public static drawBezierCurve(ctx: CanvasRenderingContext2D, properties: BezierCurveProperties) {
        const coords = Shape.getContextArgs(properties.bounds);
        ctx.lineWidth = properties.lineWidth ?? 1;
        ctx.lineCap = properties.lineCap ?? 'butt';
        ctx.strokeStyle = ColorToString(properties.color ?? RGBA(0, 0, 0));
        const src = [coords[0] * Math.sign(properties.bounds.x2 - properties.bounds.x1), coords[1] * Math.sign(properties.bounds.y2 - properties.bounds.y1)] as [number, number];
        const control1 = [properties.control1.x - properties.bounds.x1 + src[0], properties.control1.y - properties.bounds.y1 + src[1]] as [number, number];
        const control2 = [properties.control2.x - properties.bounds.x1 + src[0], properties.control2.y - properties.bounds.y1 + src[1]] as [number, number];
        const dest = [coords[0] * Math.sign(properties.bounds.x1 - properties.bounds.x2), coords[1] * Math.sign(properties.bounds.y1 - properties.bounds.y2)] as [number, number];
        ctx.beginPath();
        ctx.moveTo(...src);
        ctx.bezierCurveTo(...control1, ...control2, ...dest);
        console.log(...src, ...dest)
        ctx.stroke();
    }
}