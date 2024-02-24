import { Position, ColorToString, Corners, Color } from "./Utils";
import { PrivateAnimationType, AnimationParams, AnimationType, AnimationCallback } from "./types/Animation";
import { PositionType, BoundsType, ColorType } from "./types/Common";
import { EventCollection, PositionedPointerEvent } from "./types/Events";
import {
    DEFAULT_PROPERTIES,
    DrawFunctionType,
    EffectsType,
    HIDDEN_SHAPE_PROPERTIES,
    MostlyRequired,
} from "./types/Sprites";
import { SpriteEventListeners, PointerEventCallback } from "./types/Events";
import { Channel } from "./Channels";
import { Stage } from "./Stage";

export abstract class Shape<Properties = any, HiddenProperties = any, DetailsType = any>
    implements MostlyRequired<DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>
{
    protected _children: Shape[] = [];
    protected _parent?: Shape = undefined;
    protected _region: Path2D = new Path2D();
    protected events?: EventCollection = undefined;
    public name = "";
    public details?: DetailsType = undefined;

    public abstract draw(
        _ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        _properties?: Properties,
        _isRoot?: boolean
    ): void;

    public addChild(child: Shape) {
        child._parent = this;
        this._children.push(child);
        return this;
    }

    public addChildren(...children: Shape[]): this {
        children.forEach(child => (child._parent = this));
        this._children.push(...children);
        return this;
    }

    public removeChild(child: Shape): this {
        child._parent = undefined;
        this._children = this._children.filter(c => c !== child);
        return this;
    }

    public removeChildren(...children: Shape[]) {
        children.forEach(child => (child._parent = undefined));
        this._children = this._children.filter(child => !children.includes(child));
        return this;
    }

    public abstract get children(): Shape[];
    public abstract get parent(): Shape | undefined;
    public abstract get root(): Shape;
    public abstract findChild(name: string): Shape | undefined;
    public abstract findChildren(name: string): Shape[];
    public abstract r_findChild(name: string): Shape | undefined;
    public abstract r_findChildren(name: string): Shape[];
    public abstract r_getChildren(): Shape[];

    public abstract effects: EffectsType;
    public abstract bounds: BoundsType;
    public abstract color: ColorType;
    public abstract alpha: number;
    public abstract rotation: number;
    public abstract scale: PositionType;
    public abstract x1: number;
    public abstract y1: number;
    public abstract x2: number;
    public abstract y2: number;
    public abstract scaleX: number;
    public abstract scaleY: number;
    public abstract width: number;
    public abstract height: number;
    public abstract centerX: number;
    public abstract centerY: number;
    public abstract center: PositionType;
    public abstract corner1: PositionType;
    public abstract corner2: PositionType;
    public abstract enabled: boolean;
    public abstract red: number;
    public abstract green: number;
    public abstract blue: number;
    public abstract colorAlpha: number;
    public abstract blur: number;
    public abstract gradient: CanvasGradient | null;

    public abstract pointIsInPath(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        x: number,
        y: number
    ): boolean;
    public abstract logHierarchy(indent?: number): void;
    public channelCount = 1;
    public channels: Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[] = [];
    public abstract distribute(
        animations: AnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[][],
        params?: AnimationParams
    ): this;

    public abstract addEventListener<
        E extends keyof SpriteEventListeners<this, Properties & HiddenProperties> = keyof SpriteEventListeners
    >(event: E, callback: SpriteEventListeners<this, Properties & HiddenProperties>[E][0]): this;
    public abstract on<
        E extends keyof SpriteEventListeners<this, Properties & HiddenProperties> = keyof SpriteEventListeners
    >(event: E, callback: SpriteEventListeners<this, Properties & HiddenProperties>[E][0]): this;
    public abstract removeEventListener<
        E extends keyof SpriteEventListeners<this, Properties & HiddenProperties> = keyof SpriteEventListeners
    >(event: E, callback?: SpriteEventListeners<this, Properties & HiddenProperties>[E][0]): this;

    public abstract hasEventListeners(): boolean;
    public abstract spriteOrChildrenHaveEventListeners(): boolean;
    public abstract copy(): this;
}

export abstract class Sprite<
        DetailsType = any,
        Properties = object,
        HiddenProperties = object
    >
    extends Shape<Properties, HiddenProperties, DetailsType>
    implements MostlyRequired<DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>
{
    public readonly drawFunction: DrawFunctionType<Properties> = () => {
        return;
    };
    protected rootPointerEventCallback: () => void = () => {
        return;
    };
    protected _region: Path2D = new Path2D();
    public channels: Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[]; // to-do: ensure that details can never be animated
    protected stage?: Stage;

    // NORMAL PROPERTIES
    public rotation: number = 0;
    public alpha: number = 1;
    public gradient: CanvasGradient | null = null;
    public effects: EffectsType = () => { return; };
    public name: string = "";
    public enabled: boolean = true;
    public channelCount: number = 1;
    public details?: DetailsType = undefined;
    public red: number = 0;
    public green: number = 0;
    public blue: number = 0;
    public colorAlpha: number = 1;
    public x1: number = 0;
    public y1: number = 0;
    public x2: number = 0;
    public y2: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public blur: number = 0;

    // AGGREGATE PROPERTIES
    public get bounds(): BoundsType {
        return Corners(this.x1, this.y1, this.x2, this.y2);
    }
    public set bounds(value: BoundsType) {
        this.x1 = value.x1;
        this.y1 = value.y1;
        this.x2 = value.x2;
        this.y2 = value.y2;
    }

    public get color(): ColorType {
        return Color(this.red, this.green, this.blue);
    }
    public set color(value: ColorType) {
        this.red = value.red;
        this.green = value.green;
        this.blue = value.blue;
    }

    public get scale(): PositionType {
        return Position(this.scaleX, this.scaleY);
    }
    public set scale(value: PositionType) {
        this.scaleX = value.x;
        this.scaleY = value.y;
    }

    public get corner1(): PositionType {
        return Position(this.x1, this.y1);
    }
    public set corner1(value: PositionType) {
        this.x1 = value.x;
        this.y1 = value.y;
    }

    public get corner2(): PositionType {
        return Position(this.x2, this.y2);
    }
    public set corner2(value: PositionType) {
        this.x2 = value.x;
        this.y2 = value.y;
    }

    // CALCULATED PROPERTIES
    public get width(): number {
        return Math.abs(this.x2 - this.x1);
    }
    public set width(value: number) {
        const centerX = (this.x1 + this.x2) / 2;
        this.x1 = centerX - value / 2;
        this.x2 = centerX + value / 2;
    }

    public get height(): number {
        return Math.abs(this.y2 - this.y1);
    }
    public set height(value: number) {
        const centerY = (this.y1 + this.y2) / 2;
        this.y1 = centerY - value / 2;
        this.y2 = centerY + value / 2;
    }

    public get centerX(): number {
        return (this.x1 + this.x2) / 2;
    }
    public set centerX(value: number) {
        const width = this.width;
        this.x1 = value - width / 2;
        this.x2 = value + width / 2;
    }

    public get centerY(): number {
        return (this.y1 + this.y2) / 2;
    }
    public set centerY(value: number) {
        const height = this.height;
        this.y1 = value - height / 2;
        this.y2 = value + height / 2;
    }

    public get center(): PositionType {
        return Position(this.centerX, this.centerY);
    }
    public set center(value: PositionType) {
        this.centerX = value.x;
        this.centerY = value.y;
    }

    protected pointerId?: number = undefined;
    protected pointerButton?: number = undefined;
    protected hovered = false;

    private eventListeners: SpriteEventListeners<this, Properties & HiddenProperties> = {
        click: [],
        drag: [],
        hover: [],
        hoverEnd: [],
        release: [],
        scroll: [],
        beforeDraw: [],
        animationFinish: []
    };

    public addEventListener<
        E extends keyof SpriteEventListeners<this, Properties & HiddenProperties> = keyof SpriteEventListeners
    >(event: E, callback: SpriteEventListeners<this, Properties & HiddenProperties>[E][0]): this {
        this.eventListeners[event as "click"].push(callback as unknown as PointerEventCallback<this>);
        return this;
    }

    public on<E extends keyof SpriteEventListeners<this, Properties & HiddenProperties> = keyof SpriteEventListeners>(
        event: E,
        callback: SpriteEventListeners<this, Properties & HiddenProperties>[E][0]
    ): this {
        return this.addEventListener(event, callback);
    }

    public removeEventListener<
        E extends keyof SpriteEventListeners<this, Properties & HiddenProperties> = keyof SpriteEventListeners
    >(event: E, callback?: SpriteEventListeners<this, Properties & HiddenProperties>[E][0]): this {
        if (callback) {
            this.eventListeners[event as "click"] = this.eventListeners[event as "click"].filter(
                c => c !== (callback as unknown as PointerEventCallback<this>)
            );
        } else {
            this.eventListeners[event as "click"] = [];
        }
        return this;
    }

    public events?: EventCollection = {
        stage: undefined
    };

    constructor(
        props: Properties & DEFAULT_PROPERTIES<DetailsType>
    ) {
        super();
        this.name = props.name ?? "";
        this.enabled = props.enabled ?? true;

        // set normal properties
        this.rotation = props.rotation ?? this.rotation;
        this.alpha = props.alpha ?? this.alpha;
        this.gradient = props.gradient ?? this.gradient;
        this.effects = props.effects ?? this.effects;
        this.red = props.color?.red ?? this.red;
        this.green = props.color?.green ?? this.green;
        this.blue = props.color?.blue ?? this.blue;
        this.colorAlpha = props.color?.alpha ?? this.colorAlpha;
        this.x1 = props.bounds?.x1 ?? this.x1;
        this.y1 = props.bounds?.y1 ?? this.y1;
        this.x2 = props.bounds?.x2 ?? this.x2;
        this.y2 = props.bounds?.y2 ?? this.y2;
        this.scaleX = props.scale?.x ?? this.scaleX;
        this.scaleY = props.scale?.y ?? this.scaleY;
        this.channelCount = props.channelCount ?? this.channelCount;
        this.details = props.details;

        this.channels = Array.from(
            { length: this.channelCount },
            () => new Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>()
        );
    }

    public draw(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties?: Required<Properties>,
        isRoot?: boolean
    ) {
        if (!this.enabled) {
            return;
        }
        isRoot = isRoot ?? true;
        if (isRoot) {
            this.rootPointerEventCallback = () => {
                return;
            };
        }
        this.animate();
        ctx.save();
        this.effects(ctx);
        ctx.globalAlpha = this.alpha;
        ctx.translate(Math.min(this.x1, this.x2) + this.width / 2, Math.min(this.y1, this.y2) + this.height / 2);
        ctx.fillStyle = this.gradient
            ? this.gradient
            : ColorToString({
                  red: this.red,
                  green: this.green,
                  blue: this.blue,
                  alpha: this.colorAlpha
              });
        if (this.rotation !== 0) {
            ctx.rotate((this.rotation * Math.PI) / 180);
        }
        if (this.scaleX !== 1 || this.scaleY !== 1) {
            ctx.scale(this.scaleX, this.scaleY);
        }
        if (this.blur !== 0) {
            ctx.filter = `blur(${this.blur}px)`;
        }
        if (this.events!.stage) {
            const event = this.events!.stage;
            this.eventListeners.beforeDraw.forEach(callback => {
                callback.call(this, event.currentFrame);
            });
        }
        const region = this.drawFunction(ctx, properties!);
        if (region !== undefined) {
            this._region = region;
        }
        this._children.forEach(child => {
            (child as Sprite).events = this.events;
            child.draw(ctx, undefined, false);
        });
        if (!this.handlePointerEvents(ctx)) ctx.restore();
        if (isRoot) {
            this.rootPointerEventCallback();
        }
    }

    public handlePointerEvents(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): boolean {
        let ctxRestored = false;

        if (this.events === undefined) return false;

        if (!this.events.down && !this.events.up && !this.events.move) {
            return false;
        }

        if (
            [
                this.eventListeners.click,
                this.eventListeners.drag,
                this.eventListeners.hover,
                this.eventListeners.hoverEnd,
                this.eventListeners.release
            ].every(listeners => listeners.length === 0)
        ) {
            return false;
        }

        const pointIsInPath = [this.events.down, this.events.up, this.events.move].every(
            event => event === undefined || this.pointIsInPath(ctx, event.translatedPoint.x, event.translatedPoint.y)
        );

        if (this.eventListeners.hover.length > 0 && !this.hovered && pointIsInPath) {
            this.eventListeners.hover.forEach(callback =>
                callback.call(
                    this,
                    this.events!.move?.event ?? this.events!.down?.event ?? this.events!.up!.event,
                    this.events!.move?.translatedPoint ??
                        this.events!.down?.translatedPoint ??
                        this.events!.up!.translatedPoint
                )
            );
            this.hovered = true;
        } else if (!pointIsInPath && this.hovered) {
            if (this.eventListeners.hoverEnd.length > 0) {
                const unHoverEvent = [this.events.down, this.events.up, this.events.move].find(e => {
                    return e !== undefined && !this.pointIsInPath(ctx, e.translatedPoint.x, e.translatedPoint.y);
                });
                this.eventListeners.hoverEnd.forEach(callback => {
                    callback.call(this, unHoverEvent!.event, unHoverEvent!.translatedPoint);
                });
            }
            this.hovered = false;
        }

        const registerCallback = (
            ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
            positionedPointerEvent: PositionedPointerEvent,
            root: Shape,
            self: this,
            eventListeners: PointerEventCallback<this>[]
        ) => {
            const { event, translatedPoint } = positionedPointerEvent;
            const transformedPos = ctx.getTransform().inverse().transformPoint(translatedPoint) as PositionType;
            const transformationMatrix = ctx.getTransform();
            const callback = () => {
                ctx.save();
                ctx.setTransform(
                    transformationMatrix.a,
                    transformationMatrix.b,
                    transformationMatrix.c,
                    transformationMatrix.d,
                    transformationMatrix.e,
                    transformationMatrix.f
                );
                eventListeners.forEach(callback => callback.call(self, event, transformedPos));
                ctx.restore();
            };
            (root as Sprite).rootPointerEventCallback = callback.bind(this);
        };

        if (this.events.move && !this.events.up && !this.events.down) {
            if (this.pointerId !== undefined && this.eventListeners.drag.length > 0) {
                ctx.restore();
                ctxRestored = true;
                registerCallback(ctx, this.events.move, this.root, this, this.eventListeners.drag);
            }
        }
        if (this.events.up) {
            ctx.restore();
            ctxRestored = true;
            if (this.eventListeners.release.length > 0 && this.pointerId !== undefined) {
                const event = this.events.up;
                registerCallback(ctx, event, this.root, this, this.eventListeners.release);
            }
            this.pointerId = undefined;
        } else if (this.events.down && pointIsInPath) {
            ctx.restore();
            ctxRestored = true;
            const event = this.events.down;
            this.pointerId = event.event.pointerId;
            this.pointerButton = event.event.button;
            if (this.eventListeners.click.length > 0) {
                registerCallback(ctx, event, this.root, this, this.eventListeners.click);
            }
        }
        return ctxRestored;
    }

    public pointIsInPath(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        x: number,
        y: number
    ): boolean {
        return ctx.isPointInPath(this._region, x, y);
    }

    static initializeProps(props: {
        color?: ColorType;
        alpha?: number;
        rotation?: number;
        scale?: PositionType;
        bounds?: BoundsType;
        name?: string;
        effects?: EffectsType;
    }) {
        return {
            color: props.color ?? Color(0, 0, 0),
            alpha: props.alpha ?? 1,
            rotation: props.rotation ?? 0,
            scale: props.scale ?? Position(1, 1),
            bounds: props.bounds ?? Corners(0, 0, 0, 0),
            name: props.name ?? "",
            effects:
                props.effects ??
                (() => {
                    return;
                })
        };
    }

    public get children() {
        return [...this._children];
    }

    public get parent(): Shape | undefined {
        return this._parent as unknown as Shape | undefined;
    }

    public get root(): Shape {
        if (this._parent === undefined) return this as Shape;
        return this._parent.root;
    }

    public logHierarchy(indent = 0) {
        const name = this.name === "" ? this.constructor.name : this.name;
        const red = [this.red, this.green, this.blue].every(color => color < 25) ? 125 : this.red;
        const green = [this.red, this.green, this.blue].every(color => color < 25) ? 125 : this.green;
        const blue = [this.red, this.green, this.blue].every(color => color < 25) ? 125 : this.blue;
        console.log(
            `%c${"\t".repeat(indent)} ⌞${name} \t{ ${this.constructor.name} @ (${this.x1}, ${this.y1}) (${this.x2}, ${
                this.y2
            }) }`,
            `color: ${ColorToString(Color(red, green, blue))}; font-weight: bold;`
        );
        this._children.forEach(child => child.logHierarchy(indent + 1));
    }

    public distribute(
        animations: AnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[][],
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
    ) {
        if (animations.length > this.channels.length) {
            throw new Error(`Cannot distribute ${animations.length} animations to ${this.channels.length} channels`);
        }
        for (let idx = 0; idx < animations.length; idx++) {
            const animation = animations[idx];
            this.channels[idx % this.channels.length].push(animation, params);
        }
        return this;
    }

    private set<
        T extends string &
            keyof (Omit<
                Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES,
                keyof (DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES)
            > &
                HIDDEN_SHAPE_PROPERTIES &
                DEFAULT_PROPERTIES)
    >(
        property: T,
        value: (Omit<
            Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES,
            keyof (DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES)
        > &
            HIDDEN_SHAPE_PROPERTIES &
            DEFAULT_PROPERTIES)[T]
    ): boolean {
        (this as any)[property as any] = value; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
        return true;
    }

    private animate() {
        const animations = this.channels.map(channel => channel.stepForward()).filter(animation => animation !== null);
        for (const animation of animations.reverse()) {
            this.animateProperty(animation!);
        }
        return this;
    }

    private animateProperty(
        animation: PrivateAnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>
    ): void {
        if (animation._from === undefined || animation.frame === 0) {
            if (animation.from === null) {
                animation._from = (this as Record<any, any>)[animation.property as keyof Properties]!;
            } else {
                animation._from = animation.from;
            }
        }
        if (animation._to === undefined || animation.frame === 0) {
            if (typeof animation.to === "function") {
                const callback = animation.to as AnimationCallback<number | Record<string, number>>;
                animation._to = callback(animation._from as number | Record<string, number>);
            } else {
                animation._to = animation.to;
            }
        }
        const [from, to, frame, duration, easing] = [
            animation._from as number | Record<string, number>,
            animation._to as number | Record<string, number>,
            animation.frame ?? 0,
            animation.duration,
            animation.easing
        ];
        if (
            typeof (this as Record<any, any>)[animation.property as keyof Properties] === "number" &&
            typeof from === "number" &&
            typeof to === "number"
        ) {
            this.set(animation.property as any, from + easing(frame / duration) * (to - from));
        } else if (typeof (this as Record<any, any>)[animation.property as keyof Properties] === "object") {
            if (typeof from !== "object" || typeof to !== "object") {
                this.raiseAnimationError(from, to, animation.property as string);
            }
            const current = { ...(to as object) } as Record<string, number>;
            for (const key of Object.keys(to as object)) {
                const p_from = from[key as keyof typeof from] as number;
                const p_to = to[key as keyof typeof to] as number;
                if (p_from === undefined || p_to === undefined) {
                    this.raiseAnimationError(from, to, key);
                }
                current[key] = p_from + easing(frame / duration) * (p_to - p_from);
            }
            this.set(animation.property as any, current);
        } else {
            throw new Error(`Property ${animation.property as string} is not a valid property`);
        }
        if (animation.frame === animation.duration) {
            this.eventListeners.animationFinish.forEach(callback => callback.call(this, animation as never));
        }
    }

    private raiseAnimationError(
        from: number | Record<string, number>,
        to: number | Record<string, number>,
        property: string
    ) {
        throw new Error(`${from as number} -> ${to as number} is not a valid animation for property ${property}`);
    }

    public setPointerEvents(collection: EventCollection) {
        this.events = collection;
        return this;
    }

    private r_setPointerEvents(collection: EventCollection) {
        this.setPointerEvents(collection);
        this._children.forEach(child => (child as Sprite).r_setPointerEvents(collection));
        return this;
    }

    public createChannels(num: number) {
        this.channels.push(
            ...Array.from(
                { length: num },
                () => new Channel<Properties & HiddenProperties & DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>()
            )
        );
        return this;
    }

    public findChild(name: string): Shape | undefined {
        return this._children.find(child => {
            return child.name === name;
        });
    }

    public findChildren(name: string): Shape[] {
        return this._children.filter(child => child.name === name);
    }

    public r_findChild(name: string): Shape | undefined {
        return (
            this._children.find(child => child.name === name) ??
            this._children.map(child => child.r_findChild(name)).find(child => child !== undefined)
        );
    }

    public r_findChildren(name: string): Shape[] {
        return (
            this._children.filter(child => child.name === name) ??
            this._children.map(child => child.r_findChildren(name)).flat()
        );
    }

    public r_getChildren() {
        const children = [...this._children];
        this._children.forEach(child => children.push(...child.r_getChildren()));
        return children;
    }

    public addChild(child: Shape) {
        super.addChild(child);
        return this;
    }

    public addChildren(...children: Shape[]) {
        super.addChildren(...children);
        return this;
    }

    public removeChild(child: Shape) {
        super.removeChild(child);
        return this;
    }

    public removeChildren(...children: Shape[]) {
        super.removeChildren(...children);
        return this;
    }

    public hasEventListeners() {
        return Object.values(this.eventListeners).some(listeners => listeners.length > 0);
    }

    public spriteOrChildrenHaveEventListeners() {
        if (this.hasEventListeners()) {
            return true;
        }
        return this._children.some(child => child.spriteOrChildrenHaveEventListeners());
    }

    public copy(): this {
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        // for (let listeners of Object.values(this.eventListeners)) {
        //     (listeners as any) = listeners.map(listener => listener.bind(copy));
        // }
        copy.channels = this.channels.map(_ => new Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>()); 
        copy._children = this._children.map(child => child.copy());
        return copy;
    }
}
