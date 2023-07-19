import { Shape, Line, Rect } from './Shapes';
import { RGB } from './Utils';
import { LineProperties, RectProperties, ScaleType } from './types/Shapes';
import { ShapeProperties, KeysOf } from './types/Shapes';
import { AnimationType, AnimationPackage, AnimationParams, AnimatedRectHiddenProperties, DEFAULT_ACCEPTED_VALUES_TYPES } from './types/Animation';

export abstract class AnimatedShape<Properties, HiddenProperties=never, OtherPropertyTypes=DEFAULT_ACCEPTED_VALUES_TYPES> extends Shape<Properties, HiddenProperties> {

    protected channels: Channel<KeysOf<Properties|HiddenProperties>, DEFAULT_ACCEPTED_VALUES_TYPES|OtherPropertyTypes>[];

    constructor( props: ShapeProperties<Properties>, channels: number = 1) {
        super(props);
        this.channels = Array.from({ length: channels }, () => new Channel<KeysOf<Properties|HiddenProperties>, DEFAULT_ACCEPTED_VALUES_TYPES|OtherPropertyTypes>());
        return this;
    };

    public draw(ctx: CanvasRenderingContext2D, properties: Properties): void {
        this.animate();
        super.draw(ctx, properties);
    }

    public getChannel(index: number): Channel<KeysOf<Properties|HiddenProperties>, DEFAULT_ACCEPTED_VALUES_TYPES|OtherPropertyTypes> {
        return this.channels[index];
    }

    public distribute(
        animations: AnimationType<KeysOf<Properties|HiddenProperties>, DEFAULT_ACCEPTED_VALUES_TYPES|OtherPropertyTypes>[][], 
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

    public animate(): void {
        const animations = this.channels.map(channel => channel.stepForward()).filter(animation => animation !== null);
        for (const animation of animations.reverse()) {
            this.animateProperty(animation!);
        }
    };

    private animateProperty(animation: AnimationType<KeysOf<Properties|HiddenProperties>, any>): void {
        if (animation.fromSaved === undefined || animation.frame === 0) {
            if (animation.from === null) {
                animation.fromSaved = this.getProperty(animation.property);
            } else {
                animation.fromSaved = animation.from;
            }
        }
        if (animation.toSaved === undefined || animation.frame === 0) {
            if (typeof animation.to === 'function') {
                animation.toSaved = animation.to(animation.fromSaved);
            } else {
                animation.toSaved = animation.to;
            }
        }
        const [from, to, frame, duration, easing] = [animation.fromSaved, animation.toSaved, animation.frame || 0, animation.duration, animation.easing];
        if (this.isNumericProperty(animation.property)) {
            this.setProperty(animation.property, 
                from + (easing(frame / duration)) * (to - from)
            );
        } else if (this.specialProperties.has(animation.property as string)) {
            for (const propertyName of this.specialProperties.get(animation.property as string)!) {
                const [p_from, p_to] = [from[propertyName], to[propertyName]];
                if (p_from === undefined || p_to === undefined) {
                    throw new Error(`Value ${p_from} or ${p_to} is not a valid value for property ${propertyName as string}`);
                }
                const success = this.setProperty(propertyName as KeysOf<Properties|HiddenProperties>, 
                    p_from + (easing(p_from / duration)) * (p_to - p_from)
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

    private queue: AnimationPackage<ValidProperties, ValidTypes>[];
    private index: number;
    private step: number;

    constructor() {
        this.queue = [];
        this.index = 0;
        this.step = 0;
    }

    public get currentPackage(): AnimationPackage<ValidProperties, ValidTypes>|undefined {
        return this.queue[0];
    }

    public get currentAnimation(): AnimationType<ValidProperties, ValidTypes>|undefined {
        return this.currentPackage?.animations[this.index];
    }

    public queueIsEmpty(): boolean {
        return this.queue.length === 0;
    }

    public stepForward(): AnimationType<ValidProperties, ValidTypes>|null {
        if (this.queueIsEmpty())
            return null;
        this.step++;
        if (this.step > this.currentAnimation!.delay + this.currentAnimation!.duration) {
            this.step = 0;
            this.index++;
            if (this.index >= this.currentPackage!.animations.length || 0) {
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
        animations: AnimationType<ValidProperties, ValidTypes>|AnimationType<ValidProperties, ValidTypes>[],
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
    ) {
        const [loop, iterations, delay] = [Boolean(params.loop), params.iterations || 1, params.delay || 0];
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

export class AnimatedLine extends AnimatedShape<LineProperties> {
    protected lineWidth: number;
    protected lineCap: CanvasLineCap;

    constructor(props: LineProperties, channels: number = 1) {
        super({
            drawFunction: Line.drawLine,
            ...Shape.initializeProps(props)
        }, channels);
        this.lineWidth = props.lineWidth || 1;
        this.lineCap = props.lineCap || 'butt';
        this.specialProperties.set('strokeColor', ['strokeRed', 'strokeGreen', 'strokeBlue', 'strokeAlpha']);
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
}

export class AnimatedRect extends AnimatedShape<RectProperties, AnimatedRectHiddenProperties> {
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

    constructor(props: RectProperties, channels: number = 1) {
        super({
            drawFunction: Rect.drawRect,
            ...Shape.initializeProps(props)
        }, channels);
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
 }
