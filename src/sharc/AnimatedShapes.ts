import { Shape, Line, Rect, Ellipse, BezierCurve } from './Shapes';
import { ColorToString, Corners, Position, RGBA } from './Utils';
import { EllipseProperties, DEFAULT_PROPERTIES, HiddenEllipseProperties, HiddenStrokeProperties, LineProperties, StrokeColorType, StrokeProperties, StrokeType, BezierCurveProperties } from './types/Shapes';
import { ShapeProperties, KeysOf } from './types/Shapes';
import { AnimationType, AnimationPackage, AnimationParams, DEFAULT_PROPERTY_TYPES, AcceptedTypesOf } from './types/Animation';
import { PositionType } from './types/Common';

export abstract class AnimatedShape<Properties = DEFAULT_PROPERTIES, HiddenProperties = {}> extends Shape<Properties, HiddenProperties> {

    protected channels: Channel<Properties & HiddenProperties>[];

    constructor( props: ShapeProperties<Properties>, channels: number = 1) {
        super(props);
        this.channels = Array.from({ length: channels }, () => new Channel<Properties & HiddenProperties>());
        return this;
    };

    public draw(ctx: CanvasRenderingContext2D, properties?: Properties): void {
        this.animate();
        super.draw(ctx, properties!);
    }

    public getChannel(index: number): Channel<Properties & HiddenProperties, any> {
        return this.channels[index];
    }

    public distribute(
        animations: AnimationType<Properties & HiddenProperties>[][], 
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
        ): void {
            if (animations.length > this.channels.length) {
                throw new Error(`Cannot distribute ${animations.length} animations to ${this.channels.length} channels`);
            }
            for (const idx in animations) {
                const animation = animations[idx];
                this.channels[parseInt(idx) % this.channels.length].enqueue(animation, params);
            }
    }

    private animate(): void {
        const animations = this.channels.map(channel => channel.stepForward()).filter(animation => animation !== null);
        for (const animation of animations.reverse()) {
            this.animateProperty(animation!);
        }
    };

    private animateProperty(animation: AnimationType<Properties & HiddenProperties>): void {
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
                const p_from = from![key as keyof typeof from] as any;
                const p_to = to![key as keyof typeof to] as any;
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

class Channel<ValidProperties, ValidTypes=number> {
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

export class AnimatedNullShape extends AnimatedShape {
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

export class AnimatedLine<Properties extends LineProperties = LineProperties, HiddenProperties = {}> extends AnimatedShape<Properties, HiddenProperties> {
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
}

export abstract class AnimatedStrokeableShape<Properties extends StrokeProperties = StrokeProperties, HiddenProperties = {}, OtherPropertyTypes = never> extends AnimatedShape<Properties, HiddenStrokeProperties & HiddenProperties> {
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

    constructor(props: { stroke: StrokeType|null|undefined } & ShapeProperties<StrokeProperties>, channels: number = 1) {
        super(props, channels);
        this.strokeEnabled = props.stroke !== undefined;
        this.strokeRed = props.stroke?.color?.strokeRed ?? 0;
        this.strokeGreen = props.stroke?.color?.strokeGreen ?? 0;
        this.strokeBlue = props.stroke?.color?.strokeBlue ?? 0;
        this.strokeAlpha = props.stroke?.color?.strokeAlpha ?? 1;
        this.strokeWidth = props.stroke?.width ?? 1;
        this.strokeJoin = props.stroke?.join ?? 'miter';
        this.strokeCap = props.stroke?.cap ?? 'butt';
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

export class AnimatedRect extends AnimatedStrokeableShape {

    constructor(props: StrokeProperties, channels: number = 1) {
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
 }

 export class AnimatedEllipse extends AnimatedStrokeableShape<EllipseProperties, HiddenEllipseProperties> {
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
}

export class AnimatedBezierCurve extends AnimatedLine<BezierCurveProperties> {
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
}