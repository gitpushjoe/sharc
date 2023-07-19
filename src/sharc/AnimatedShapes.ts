import { Shape, Line } from './Shapes';
import { RGB } from './Utils';
import { BoundsType, ColorType, CurveType } from './types/Common';
import { LineProperties, ScaleType } from './types/Shapes';
import { ShapeProperties, KeysOf } from './types/Shapes';

type AnimationCallback<PropertyType> = (property: PropertyType) => PropertyType;

type AnimationType<ValidProperties, PropertyType=number> = {
    property: ValidProperties,
    from: PropertyType|null,
    to: PropertyType|AnimationCallback<PropertyType>,
    duration: number,
    delay: number,
    easing: CurveType,
    frame?: number,
    channel?: number,
}

type AnimationParams = {
    loop?: boolean,
    iterations?: number,
    delay?: number,
}

type AnimationPackage<ValidProperties, ValidTypes> = {
    animations: AnimationType<ValidProperties, ValidTypes>[],
    params: AnimationParams
}

type SPECIAL_ACCEPTED_VALUES_TYPES = ColorType|BoundsType|ScaleType;
type DEFAULT_ACCEPTED_VALUES_TYPES = number|SPECIAL_ACCEPTED_VALUES_TYPES;

export abstract class AnimatedShape<Properties, HiddenProperties=never, OtherPropertyTypes=DEFAULT_ACCEPTED_VALUES_TYPES> extends Shape<Properties> {

    protected channels: Channel<KeysOf<Properties|HiddenProperties>, DEFAULT_ACCEPTED_VALUES_TYPES|OtherPropertyTypes>[];
    protected specialProperties = new Map<string, string[]>([
        ['color', ['red', 'green', 'blue', 'alpha']],
        ['scale', ['scaleX', 'scaleY']],
        ['bounds', ['x1', 'y1', 'x2', 'y2']],
    ]);

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

    public animate(): void {
        const animations = this.channels.map(channel => channel.stepForward()).filter(animation => animation !== null);
        for (const animation of animations.reverse()) {
            this.animateProperty(animation!);
        }
    };

    private animateProperty(animation: AnimationType<KeysOf<Properties|HiddenProperties>, any>): void {
        if (animation.from === null) {
            animation.from = this.getProperty(animation.property);
        }
        if (typeof animation.to === 'function') {
            animation.to = animation.to(animation.from!);
        }
        if (this.isNumericProperty(animation.property)) {
            this.setProperty(animation.property, 
                animation.from! + (animation.easing((animation.frame || 0) / animation.duration)) * (animation.to! - animation.from!)
            );
        } else if (this.specialProperties.has(animation.property as string)) {
            for (const propertyName of this.specialProperties.get(animation.property as string)!) {
                const [from, to, frame, duration] = [animation.from![propertyName]!, animation.to![propertyName]!, animation.frame || 0, animation.duration];
                if (from === undefined || to === undefined) {
                    throw new Error(`Value ${from} or ${to} is not a valid value for property ${propertyName as string}`);
                }
                const success = this.setProperty(propertyName as KeysOf<Properties|HiddenProperties>, 
                    from + (animation.easing(frame / duration)) * (to - from)
                , true);
                if (!success) {
                    throw new Error(`Value ${animation.from[propertyName]} or ${animation.to[propertyName]} is not a valid value for property ${propertyName as string}`);
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
