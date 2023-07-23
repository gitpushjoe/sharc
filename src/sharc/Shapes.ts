import { DrawFunctionType, ShapeProperties, EffectsType as EffectsType, LineProperties, DEFAULT_PROPERTIES, KeysOf, StrokeProperties, HiddenStrokeProperties, StrokeType, EllipseProperties, HiddenEllipseProperties, BezierCurveProperties, HiddenShapeProperties, PathProperties, PolygonProperties, StarProperties } from './types/Shapes';
import { BoundsType, ColorType, PositionType } from './types/Common';
import { ColorToString, RGBA, Position, Corners, Bounds, CenterBounds } from './Utils';
import { AcceptedTypesOf, AnimationPackage, AnimationParams, AnimationType, HiddenLineProperties } from './types/Animation';

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
        [ 'centerX', {
                getter: (self) : number => (self.x1 + self.x2) / 2,
                setter: (self: Shape, value: number) => {
                    const width = self.getWidth();
                    self.x1 = value - width / 2;
                    self.x2 = value + width / 2;
                }
            }
        ],
        [ 'centerY', {
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
        ],
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
        return this;
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

    static getX1Y1WH(bounds: BoundsType): [number, number, number, number] {
        return [
            -Math.abs(bounds.x1 - bounds.x2) / 2,
            -Math.abs(bounds.y1 - bounds.y2) / 2,
            Math.abs(bounds.x1 - bounds.x2),
            Math.abs(bounds.y1 - bounds.y2)
        ]
    }

    // Returns the position of the point relative to the center of the shape
    static translatePosition(bounds: BoundsType, position: PositionType): PositionType {
        return Position(
            position.x - bounds.x1 - (bounds.x2 - bounds.x1) / 2,
            position.y - bounds.y1 - (bounds.y2 - bounds.y1) / 2
        )
    }

    // Returns the bounds of the shape relative to the center of the shape
    static translateBounds(bounds: BoundsType) : BoundsType {
        return Corners(
            Shape.translatePosition(bounds, Position(bounds.x1, bounds.y1)).x,
            Shape.translatePosition(bounds, Position(bounds.x1, bounds.y1)).y,
            Shape.translatePosition(bounds, Position(bounds.x2, bounds.y2)).x,
            Shape.translatePosition(bounds, Position(bounds.x2, bounds.y2)).y
        )
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

export abstract class AnimatedShape<Properties = DEFAULT_PROPERTIES, HiddenProperties = {}> extends Shape<Properties, HiddenProperties & HiddenShapeProperties> {

    protected channels: Channel<Properties & HiddenProperties & HiddenShapeProperties>[];

    constructor( props: ShapeProperties<Properties>, channels: number = 1) {
        super(props);
        this.channels = Array.from({ length: channels }, () => new Channel<Properties & HiddenProperties & HiddenShapeProperties>());
        return this;
    };

    public draw(ctx: CanvasRenderingContext2D, properties?: Properties): void {
        this.animate();
        super.draw(ctx, properties!);
    }

    public getChannel(index: number): Channel<Properties & HiddenProperties & HiddenShapeProperties> {
        return this.channels[index];
    }

    public distribute(
        animations: AnimationType<Properties & HiddenProperties & HiddenShapeProperties>[][], 
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
        ) {
            if (animations.length > this.channels.length) {
                throw new Error(`Cannot distribute ${animations.length} animations to ${this.channels.length} channels`);
            }
            for (const idx in animations) {
                const animation = animations[idx];
                this.channels[parseInt(idx) % this.channels.length].enqueue(animation, params);
            }
        return this;
    }

    private animate(): void {
        const animations = this.channels.map(channel => channel.stepForward()).filter(animation => animation !== null);
        for (const animation of animations.reverse()) {
            this.animateProperty(animation!);
        }
    };

    private animateProperty(animation: AnimationType<Properties & HiddenProperties & HiddenShapeProperties>): void {
        if (animation.fromSaved === undefined || animation.frame === 0) {
            if (animation.from === null) {
                animation.fromSaved = this.getProperty(animation.property);
            } else {
                animation.fromSaved = animation.from;
            }
        }
        if (animation.toSaved === undefined || animation.frame === 0) {
            if (typeof animation.to === 'function') {
                const callback = animation.to as Function;
                animation.toSaved = callback(animation.fromSaved as any);
            } else {
                animation.toSaved = animation.to;
            }
        }
        const [from, to, frame, duration, easing] = [animation.fromSaved, animation.toSaved, animation.frame ?? 0, animation.duration, animation.easing];
        if (this.isNumericProperty(animation.property) && typeof from === 'number' && typeof to === 'number') {
            const success = this.setProperty(animation.property, 
                from + (easing(frame / duration)) * (to - from) as AcceptedTypesOf<Properties>
            );
            if (!success) {
                throw new Error(`Value ${from} or ${to} is not a valid value for property ${animation.property as string}`);
            }
        } else if (this.calculatedProperties.has(animation.property as string)) {
            if (typeof from !== 'object' || typeof to !== 'object') {
                throw new Error(`Value ${from} or ${to} is not a valid value for property ${animation.property as string}`);
            }
            const current = { ...to } as any;
            for (const key of Object.keys(to as object)) {
                const p_from = from![key as keyof typeof from] as number;
                const p_to = to![key as keyof typeof to] as number;
                if (p_from === undefined || p_to === undefined) {
                    throw new Error(`Value ${p_from} or ${p_to} is not a valid value for property ${key as string}`);
                }
                current[key] = p_from + (easing(frame / duration)) * (p_to - p_from);
            }
            const success = this.setProperty(animation.property as keyof Properties, current as any);
            if (!success) {
                throw new Error(`Value ${from} or ${to} is not a valid value for property ${animation.property as string}`);
            }
        } else if (this.aggregateProperties.has(animation.property as string)) {
            for (const propertyName of this.aggregateProperties.get(animation.property as string)!) {
                const p_from = from![propertyName as keyof typeof from] as any;
                const p_to = to![propertyName as keyof typeof to] as any;
                if (p_from === undefined || p_to === undefined) {
                    throw new Error(`Value ${p_from} or ${p_to} is not a valid value for property ${propertyName as string}`);
                }
                const success = this.setProperty(propertyName as keyof Properties, 
                    p_from + (easing(frame / duration)) * (p_to - p_from)
                , true);
                if (!success) {
                    throw new Error(`Value ${p_from[propertyName]} or ${p_to[propertyName]} is not a valid value for property ${propertyName as string}`);
                }
            }
        } else {
            throw new Error(`Property ${animation.property as string} is not a valid property`);
        }
    }
}

class Channel<ValidProperties> {
    private queue: AnimationPackage<ValidProperties>[];
    private index: number;
    private step: number;

    constructor() {
        this.queue = [];
        this.index = 0;
        this.step = 0;
    }

    public get currentPackage(): AnimationPackage<ValidProperties>|undefined {
        return this.queue[0];
    }

    public get currentAnimation(): AnimationType<ValidProperties>|undefined {
        return this.currentPackage?.animations[this.index];
    }

    public queueIsEmpty(): boolean {
        return this.queue.length === 0;
    }

    public stepForward(): AnimationType<ValidProperties>|null {
        if (this.queueIsEmpty())
            return null;
        this.step++;
        if (this.step > this.currentAnimation!.delay + this.currentAnimation!.duration) {
            this.step = 0;
            this.index++;
            if (this.index >= this.currentPackage!.animations.length ?? 0) {
                this.index = 0;
                if (this.currentPackage!.params.loop) {
                    this.step = 0;
                } else {
                    this.queue.shift();
                }
            }
            if (this.queue.length === 0) {
                this.index = 0;
                this.step = 0;
                return null;
            }
        } 
        this.currentAnimation!.frame = Math.max(this.step - this.currentAnimation!.delay, 0);
        this.currentAnimation!.channel = this.index;
        return this.currentAnimation!;
    }

    public enqueue(
        animations: AnimationType<ValidProperties>|AnimationType<ValidProperties>[],
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
    ) {
        const [loop, iterations, delay] = [Boolean(params.loop), params.iterations ?? 1, params.delay ?? 0];
        if (!Array.isArray(animations)) {
            animations = [animations];
        }
        if (animations.length === 0) {
            return;
        }
        for (const idx in animations) {
            const animation = animations[idx];
            if (animation.duration <= 0) 
                throw new Error('Animation duration must be greater than 0');
            if (animation.delay < 0)
                animation.delay = 0;
        }
        this.queue.push({ animations, params: { loop, iterations, delay } });
    }
}

export class NullShape extends AnimatedShape {
    constructor(props: Omit<DEFAULT_PROPERTIES, 'bounds'|'color'> & { position: PositionType }, channels: number = 1) {
        super({
            drawFunction: () => {},
            ...Shape.initializeProps({
                bounds: Corners(props.position.x, props.position.y, props.position.x, props.position.y),
                ...props
            })
        }, channels);
    }
}

export class Line<Properties = {}, HiddenProperties = {}> extends AnimatedShape<Properties & LineProperties, HiddenProperties & HiddenLineProperties> {
    protected lineWidth: number;
    protected lineCap: CanvasLineCap;

    constructor(props: LineProperties, channels: number = 1) {
        super({
            drawFunction: Line.drawLine,
            ...Shape.initializeProps(props)
        }, channels);
        this.lineWidth = props.lineWidth ?? 1;
        this.lineCap = props.lineCap ?? 'butt';
    }

    public draw(ctx: CanvasRenderingContext2D, properties?: Properties) {
        super.draw(
            ctx,
            {
                ...properties!,
                bounds: this.getBounds(),
                lineWidth: this.lineWidth,
                lineCap: this.lineCap,
                color: RGBA(this.red, this.green, this.blue, this.colorAlpha)
            },
        );
    }

    private static drawLine(ctx: CanvasRenderingContext2D, properties: LineProperties) {
        const bounds = Shape.translateBounds(properties.bounds);
        ctx.lineWidth = properties.lineWidth ?? 1;
        ctx.lineCap = properties.lineCap ?? 'butt';
        ctx.strokeStyle = ColorToString(properties.color ?? RGBA(0, 0, 0));
        ctx.beginPath();
        ctx.moveTo(bounds.x1, bounds.y1);
        ctx.lineTo(bounds.x2, bounds.y2);
        // ctx.moveTo(coords[0] * Math.sign(properties.bounds.x2 - properties.bounds.x1), coords[1] * Math.sign(properties.bounds.y2 - properties.bounds.y1));
        // ctx.lineTo(coords[0] * Math.sign(properties.bounds.x1 - properties.bounds.x2), coords[1] * Math.sign(properties.bounds.y1 - properties.bounds.y2));
        ctx.stroke();
        ctx.closePath();
    }

    public static Bounds(x1: number, y1: number, x2: number, y2: number): BoundsType {
        return Corners(x1, y1, x2, y2);
    }
}

export abstract class StrokeableShape<Properties = {}, HiddenProperties = {}> extends AnimatedShape<Properties & StrokeProperties, HiddenStrokeProperties & HiddenProperties> {
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

    constructor(props: { stroke: StrokeType|null|undefined } & ShapeProperties<Properties & StrokeProperties>, channels: number = 1) {
        super(props, channels);
        this.strokeEnabled = props.stroke !== undefined;
        this.strokeRed = props.stroke?.color?.red ?? 0;
        this.strokeGreen = props.stroke?.color?.green ?? 0;
        this.strokeBlue = props.stroke?.color?.blue ?? 0;
        this.strokeAlpha = props.stroke?.color?.alpha ?? 1;
        this.strokeWidth = props.stroke?.width ?? 1;
        this.strokeJoin = props.stroke?.join ?? 'miter';
        this.strokeCap = props.stroke?.cap ?? 'butt';
        this.strokeDash = props.stroke?.lineDash ?? 0;
        this.strokeDashGap = props.stroke?.lineDashGap ?? props.stroke?.lineDash ?? 0;
        this.strokeOffset = props.stroke?.lineDashOffset ?? 0;
        this.calculatedProperties.set(
            'strokeColor',
            {
                getter: (self) => RGBA(self.getProperty('red'), self.getProperty('green'), self.getProperty('blue'), self.getProperty('alpha')),
                setter: (self, value: ColorType) => {
                    self.setProperty('red', value.red);
                    self.setProperty('green', value.green);
                    self.setProperty('blue', value.blue);
                    self.setProperty('alpha', value.alpha);
                }
            }
        );
    }

    public draw(ctx: CanvasRenderingContext2D, properties?: Properties & StrokeProperties) {
        super.draw(ctx, {
            ...properties!,
            stroke: this.strokeEnabled ? {
                color: {red: this.strokeRed, green: this.strokeGreen, blue: this.strokeBlue, alpha: this.strokeAlpha},
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

export class Rect extends StrokeableShape<{bounds: BoundsType}> {

    constructor(props: StrokeProperties & {bounds: BoundsType}, channels: number = 1) {
        super({
            drawFunction: Rect.drawRect,
            stroke: props.stroke,
            ...Shape.initializeProps(props),
        }, channels);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, { 
            bounds: this.getBounds(),
        });
    }

    public static drawRect(ctx: CanvasRenderingContext2D, properties: StrokeProperties & {bounds: BoundsType}) {
        const coords = Shape.translateBounds(properties.bounds);
        ctx.fillRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            if (lineDash === 0) {
                ctx.strokeRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
            } else {
                ctx.beginPath();
                ctx.moveTo(coords.x1, coords.y1);
                ctx.lineTo(coords.x2, coords.y1);
                ctx.lineTo(coords.x2, coords.y2);
                ctx.lineTo(coords.x1, coords.y2);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }

    public static Bounds(x1: number, y1: number, width: number, height: number): BoundsType {
        return Bounds(x1, y1, width, height);
    }
 }

 export class Ellipse extends StrokeableShape<EllipseProperties, HiddenEllipseProperties> {
    protected startAngle: number;
    protected endAngle: number;

    constructor(props: EllipseProperties, channels: number = 1) {
        super({
            drawFunction: Ellipse.drawEllipse,
            stroke: props.stroke,
            ...Shape.initializeProps(props),
        }, channels);
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
        const coords = Shape.getX1Y1WH(properties.bounds);
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
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke();
        }
    }

    public static Bounds(x: number, y: number, radius: number, radiusY?: number): BoundsType {
        return CenterBounds(x, y, radius, radiusY);
    }
}

export class BezierCurve extends Line<BezierCurveProperties> {
    protected controlPoint1x: number;
    protected controlPoint1y: number;
    protected controlPoint2x: number;
    protected controlPoint2y: number;

    constructor(props: BezierCurveProperties, channels: number = 1) {
        super(props, channels);
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
        const coords = Shape.getX1Y1WH(properties.bounds);
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
        ctx.stroke();
    }

    public static Bounds(x1: number, y1: number, x2: number, y2: number): BoundsType {
        return Corners(x1, y1, x2, y2);
    }
}

export class Path extends StrokeableShape<PathProperties> {
    protected path: PositionType[];
    protected fillRule: CanvasFillRule;
    protected closePath: boolean;
    protected start: number;
    protected end: number;

    constructor(props: PathProperties, channels: number = 1) {
        super({
            drawFunction: Path.drawPath,
            stroke: props.stroke,
            ...Shape.initializeProps({
                bounds: Path.getBoundsFromPath(props.path),
                ...props,
            }),
        }, channels);
        this.path = props.path;
        this.fillRule = props.fillRule ?? 'nonzero';
        this.closePath = props.closePath ?? false;
        this.start = props.start ?? 0;
        this.end = props.end ?? 1;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const bounds = this.getBounds();
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
        super.draw(ctx, {
            path: this.path,
            fillRule: this.fillRule,
            closePath: this.closePath,
            color: RGBA(this.red, this.green, this.blue, this.colorAlpha),
            start: this.start,
            end: this.end,
        });
    }

    public static drawPath(ctx: CanvasRenderingContext2D, properties: PathProperties) {
        ctx.beginPath();
        let path = properties.path.map(point => Shape.translatePosition(Path.getBoundsFromPath(properties.path), point)) as PositionType[];
        path = Path.getPathSegment(path, properties.start ?? 0, properties.end ?? 1);
        if (path.length === 0) {
            return;
        }
        const region = new Path2D();
        region.moveTo(path[0].x, path[0].y);
        for (const point of path.slice(1)) {
            region.lineTo(point.x, point.y);
        }
        if (properties.closePath) {
            region.closePath();
        }
        ctx.fill(region, properties.fillRule ?? 'nonzero');
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke(region);
        }
    }

    public static getPathSegment(path: PositionType[], start: number, end: number): PositionType[] {
        if (start === 0 && end === 1) {
            return path;
        } else if (start === end) {
            return [];
        } else if (start > end) {
            return Path.getPathSegment(path, end, start).reverse();
        } else if (start < 0 || end > 1) {
            throw new Error('Start and end must be between 0 and 1');
        }
        const distances = path.map((point, idx) => Path.calculateDistance(point, path[idx + 1] ?? path[0]));
        const totalDistance = distances.reduce((a, b) => a + b, 0);
        const newPath = [] as PositionType[];
        let pathRatio = 0;
        let startRatio = 0;
        let endRatio = 0;
        const startIdx = distances.findIndex((_, idx) => {
            const ratio = pathRatio + distances[idx] / totalDistance;
            if (ratio >= start) {
                startRatio = (start - pathRatio) / (distances[idx] / totalDistance);
                return true;
            }
            pathRatio = ratio;
            return false;
        });
        pathRatio = 0;
        const endIdx = distances.findIndex((_, idx) => {
            const ratio = pathRatio + distances[idx] / totalDistance;
            if (ratio >= end) {
                endRatio = (end - pathRatio) / (distances[idx] / totalDistance);
                return true;
            }
            pathRatio = ratio;
            return false;
        });
        if (startIdx === -1 || endIdx <= -1) {
            return [];
        }
        if (startIdx >= endIdx) {
            return [Path.interpolate(path[startIdx], path[startIdx + 1], startRatio), Path.interpolate(path[startIdx], path[startIdx + 1], endRatio)];
        }
        for (let idx = startIdx; idx <= endIdx + 1; idx++) {
            if (idx === startIdx) {
                newPath.push(Path.interpolate(path[idx], path[idx + 1], startRatio));
            } else if (idx === endIdx + 1) {
                newPath.push(Path.interpolate(path[idx - 1], path[Math.min(idx, path.length - 1)], endRatio));
            } else {
                newPath.push(path[idx]);
            }
        }
        return newPath;
    }

    public static interpolate(point1: PositionType, point2: PositionType, ratio: number): PositionType {
        return Position(point1.x + ratio * (point2.x - point1.x), point1.y + ratio * (point2.y - point1.y));
    }

    public static calculateDistance(point1: PositionType, point2: PositionType): number {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }

    // Returns the bounds of the path, which can be used to do rotations, scaling, translations.
    public static getBoundsFromPath(path: PositionType[]): BoundsType {
        return Corners(
            Math.min(...path.map(point => point.x)),
            Math.min(...path.map(point => point.y)),
            Math.max(...path.map(point => point.x)),
            Math.max(...path.map(point => point.y)),
        )
    }
}

export class Polygon extends StrokeableShape<PolygonProperties> {
    protected sides: number;
    protected radius: number;
    protected centerX: number;
    protected centerY: number;
    protected start: number;
    protected end: number;
    protected fillRule: CanvasFillRule;

    constructor(props: PolygonProperties, channels: number = 1) {
        super({
            drawFunction: Polygon.drawPolygon,
            stroke: props.stroke,
            ...Shape.initializeProps({
                bounds: Corners(0, 0, 0, 0), // calculated later
                ...props,
            }),
        }, channels);
        this.sides = props.sides;
        this.radius = props.radius;
        this.centerX = props.center.x ?? 0;
        this.centerY = props.center.y ?? 0;
        this.start = props.start ?? 0;
        this.end = props.end ?? 1;
        this.fillRule = props.fillRule ?? 'nonzero';
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
            color: RGBA(this.red, this.green, this.blue, this.colorAlpha),
            center: Position(this.centerX, this.centerY),
            start: this.start,
            end: this.end,
        });
    }

    public static drawPolygon(ctx: CanvasRenderingContext2D, properties: PolygonProperties) {
        const sides = properties.sides;
        const radius = properties.radius;
        if (sides < 3 || radius <= 0) {
            throw new Error('Polygon must have at least 3 sides and a positive radius');
        }
        const path = Array.from({ length: parseInt(sides.toString()) }, (_, idx) => {
            const angle = 2 * Math.PI * idx / parseInt(sides.toString());
            return Position(radius * Math.cos(angle), radius * Math.sin(angle));
        });
        Path.drawPath(ctx, {
            path,
            fillRule: properties.fillRule ?? 'nonzero',
            closePath: true,
            stroke: properties.stroke,
            start: properties.start ?? 0,
            end: properties.end ?? 1,
        });
    }
}

export class Star extends StrokeableShape<StarProperties> {
    protected center: PositionType;
    protected radius: number;
    protected innerRadius: number;
    protected fillRule: CanvasFillRule;
    protected start: number;
    protected end: number;

    constructor(props: StarProperties, channels: number = 1) {
        super({
            drawFunction: Star.drawStar,
            stroke: props.stroke,
            ...Shape.initializeProps({
                bounds: Corners(0, 0, 0, 0), // calculated later
                ...props,
            }),
        }, channels);
        this.center = props.center;
        this.radius = props.radius;
        this.fillRule = props.fillRule ?? 'nonzero';
        this.innerRadius = props.innerRadius ?? props.radius * (3 - Math.sqrt(5)) / 2;
        this.start = props.start ?? 0;
        this.end = props.end ?? 1;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.x1 = this.center.x - this.radius;
        this.y1 = this.center.y - this.radius;
        this.x2 = this.center.x + this.radius;
        this.y2 = this.center.y + this.radius;
        super.draw(ctx, {
            center: this.center,
            radius: this.radius,
            innerRadius: this.innerRadius,
            color: RGBA(this.red, this.green, this.blue, this.colorAlpha),
            start: this.start,
            end: this.end,
        });
    }

    public static drawStar(ctx: CanvasRenderingContext2D, properties: StarProperties) {
        const radius = properties.radius;
        const innerRadius = properties.innerRadius ?? radius * (3 - Math.sqrt(5)) / 2;

        const pointFromAngle = (angle: number, radius: number) => {
            return Position(radius * Math.cos(Math.PI / 2 + angle), radius * Math.sin(Math.PI / 2 + angle));
        }

        const path = [
            pointFromAngle(0, radius),
            pointFromAngle(2 * Math.PI / 10, innerRadius),
            pointFromAngle(2 * Math.PI / 5, radius),
            pointFromAngle(6 * Math.PI / 10, innerRadius),
            pointFromAngle(4 * Math.PI / 5, radius),
            pointFromAngle(10 * Math.PI / 10, innerRadius),
            pointFromAngle(6 * Math.PI / 5, radius),
            pointFromAngle(14 * Math.PI / 10, innerRadius),
            pointFromAngle(8 * Math.PI / 5, radius),
            pointFromAngle(18 * Math.PI / 10, innerRadius),
        ];

        Path.drawPath(ctx, {
            path,
            fillRule: properties.fillRule ?? 'nonzero',
            closePath: true,
            stroke: properties.stroke,
            start: properties.start ?? 0,
            end: properties.end ?? 1,
        });
    }
}