import { Position, ColorToString, Corners, Color } from "./Utils";
import { PrivateAnimationType, AnimationParams, AnimationType, AnimationCallback } from "./types/Animation";
import { PositionType, BoundsType, ColorType } from "./types/Common";
import { EventCollection, PositionedPointerEvent } from "./types/Events";
import {
    DEFAULT_PROPERTIES,
    DrawFunctionType,
    EffectsType,
    HIDDEN_SHAPE_PROPERTIES,
    MostlyRequired
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

    public addChild(child: Shape): this {
        this._children.push(child.removeSelf());
        child._parent = this;
        return this;
    }

    public addChildren(...children: Shape[]): this {
        children.forEach(child => this.addChild(child));
        return this;
    }

    public removeChild<S extends Shape>(child: S): S | undefined {
        const idx = this._children.indexOf(child);
        if (idx === -1) {
            return undefined;
        }
        this._children.splice(idx, 1);
        child._parent = undefined;
        return child;
    }

    public removeChildren(...children: Shape[]): Shape[] {
        const removed: Shape[] = [];
        children.forEach(child => {
            const idx = this._children.indexOf(child);
            if (idx !== -1) {
                this._children.splice(idx, 1);
                child._parent = undefined;
                removed.push(child);
            }
        });
        return removed;
    }

    public removeAllChildren(): Shape[] {
        return this.removeChildren(...this._children);
    }

    public removeSelf(): this {
        this._parent?.removeChild(this);
        return this;
    }

    public get children(): Shape[] {
        return [...this._children];
    }

    public get descendants(): Shape[] {
        return this._children.reduce<Shape[]>((acc, child) => acc.concat(child, child.descendants), []);
    }

    public get parent(): Shape | undefined {
        return this._parent;
    }

    public get root(): Shape {
        return this._parent ? this._parent.root : this;
    }

    public findChild(name: string): Shape | undefined {
        return this._children.find(child => child.name === name);
    }

    public findDescendant(name: string): Shape | undefined {
        return (
            this._children.find(child => child.name === name) ??
            this._children.reduce<Shape | undefined>((acc, child) => acc ?? child.findDescendant(name), undefined)
        );
    }

    public findChildren(name: string): Shape[] {
        return this._children.filter(child => child.name === name);
    }

    public findDescendants(name: string): Shape[] {
        return this._children.reduce<Shape[]>((acc, child) => {
            if (child.name === name) {
                acc.push(child);
            }
            return acc.concat(child.findDescendants(name));
        }, []);
    }

    public findChildWhere(filter: (child: Shape) => boolean): Shape | undefined {
        return this._children.find(filter);
    }

    public findDescendantWhere(filter: (child: Shape) => boolean): Shape | undefined {
        return (
            this._children.find(filter) ??
            this._children.reduce<Shape | undefined>((acc, child) => acc ?? child.findDescendantWhere(filter), undefined)
        );
    }

    public findChildrenWhere(filter: (child: Shape) => boolean): Shape[] {
        return this._children.filter(filter);
    }

    public findDescendantsWhere(filter: (child: Shape) => boolean): Shape[] {
        return this._children.reduce<Shape[]>((acc, child) => {
            if (filter(child)) {
                acc.push(child);
            }
            return acc.concat(child.findDescendantsWhere(filter));
        }, []);
    }

    public removeChildWhere(filter: (child: Shape) => boolean): Shape | undefined {
        return this._children.find(filter)?.removeSelf();
    }

    public removeDescendantWhere(filter: (child: Shape) => boolean): Shape | undefined {
        const child = this._children.find(filter);
        if (child) {
            this.removeChild(child);
            return child;
        }
        return this._children.reduce<Shape | undefined>(
            (acc, child) => acc ?? child.removeDescendantWhere(filter),
            undefined
        );
    }

    public removeChildrenWhere(filter: (child: Shape) => boolean): Shape[] {
        const removed: Shape[] = [];
        this._children = this._children.filter(child => {
            if (filter(child)) {
                removed.push(child);
                return false;
            }
            return true;
        });
        return removed;
    }

    public removeDescendantsWhere(filter: (child: Shape) => boolean): Shape[] {
        const removed: Shape[] = [];
        this._children = this._children.filter(child => {
            removed.push(...child.removeDescendantsWhere(filter));
            if (filter(child)) {
                removed.push(child);
                return false;
            }
            return true;
        });
        return removed;
    }

    public bringForward(): this {
        if (this._parent) {
            const idx = this._parent._children.indexOf(this);
            if (idx == this._parent._children.length - 1) {
                return this;
            }
            this._parent._children.splice(idx, 1);
            this._parent._children.splice(idx + 1, 0, this);
        }
        return this;
    }

    public sendBackward(): this {
        if (this._parent) {
            const idx = this._parent._children.indexOf(this);
            if (idx === 0) {
                return this;
            }
            this._parent._children.splice(idx, 1);
            this._parent._children.splice(idx - 1, 0, this);
        }
        return this;
    }

    public bringToFront(): this {
        this._parent?.addChild(this);
        return this;
    }

    public sendToBack(): this {
        const parent = this._parent;
        if (parent) {
            parent._children.unshift(this.removeSelf());
            this._parent = parent;
        }
        return this;
    }

    // future update:
    // public abstract schedule(frames: number, callback: (this: this) => void): this;
    // public abstract in(frames: number, callback: (this: this) => void): this;
    // public abstract unschedule(callback: (this: this) => void): this;
    // public abstract unscheduleAll(): this;

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

export abstract class Sprite<DetailsType = any, Properties = object, HiddenProperties = object>
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
    // future update:
    // protected schedulers: SpriteSchedulers<this> = [];

    // NORMAL PROPERTIES
    public rotation = 0;
    public alpha = 1;
    public gradient: CanvasGradient | null = null;
    public effects: EffectsType = () => {
        return;
    };
    public name = "";
    public enabled = true;
    public channelCount = 1;
    public details?: DetailsType = undefined;
    public red = 0;
    public green = 0;
    public blue = 0;
    public colorAlpha = 1;
    public x1 = 0;
    public y1 = 0;
    public x2 = 0;
    public y2 = 0;
    public scaleX = 1;
    public scaleY = 1;
    public blur = 0;

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
        if (!callback) {
            this.eventListeners[event as "click"] = [];
            return this;
        }
        this.eventListeners[event as "click"] = this.eventListeners[event as "click"].filter(
            cb => cb !== (callback as unknown as PointerEventCallback<this>)
        );
        return this;
    }

    public events?: EventCollection = {
        stage: undefined
    };

    constructor(props: Properties & DEFAULT_PROPERTIES<DetailsType>) {
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
            // future update:
            // this.schedulers = this.schedulers.filter(scheduler => {
            //     if (scheduler.remainingFrames-- <= 0) {
            //         schedulerback.call(this);
            //         return false;
            //     }
            //     return true;
            // });
            this.eventListeners.beforeDraw.forEach(callback => {
                callback(this, event.currentFrame);
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
                callback(
                    this,
                    this.events!.move?.translatedPoint ??
                        this.events!.down?.translatedPoint ??
                        this.events!.up!.translatedPoint,
                    this.events!.move?.event ?? this.events!.down?.event ?? this.events!.up!.event,
                )
            );
            this.hovered = true;
        } else if (!pointIsInPath && this.hovered) {
            if (this.eventListeners.hoverEnd.length > 0) {
                const unHoverEvent = [this.events.down, this.events.up, this.events.move].find(e => {
                    return e !== undefined && !this.pointIsInPath(ctx, e.translatedPoint.x, e.translatedPoint.y);
                });
                this.eventListeners.hoverEnd.forEach(callback => {
                    callback(this, unHoverEvent!.translatedPoint, unHoverEvent!.event);
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
            const callback = function() {
                ctx.save();
                ctx.setTransform(
                    transformationMatrix.a,
                    transformationMatrix.b,
                    transformationMatrix.c,
                    transformationMatrix.d,
                    transformationMatrix.e,
                    transformationMatrix.f
                );
                eventListeners.forEach(c => c(self, transformedPos, event));
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
            this.eventListeners.animationFinish.forEach(callback => callback(this, animation as never));
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

    // public findChild(name: string): Shape | undefined {
    //     return this._children.find(child => {
    //         return child.name === name;
    //     });
    // }
    //
    // public findChildren(name: string): Shape[] {
    //     return this._children.filter(child => child.name === name);
    // }
    //
    // public r_findChild(name: string): Shape | undefined {
    //     return (
    //         this._children.find(child => child.name === name) ??
    //             this._children.map(child => child.r_findChild(name)).find(child => child !== undefined)
    //     );
    // }
    //
    // public r_findChildren(name: string): Shape[] {
    //     return (
    //         this._children.filter(child => child.name === name) ??
    //             this._children.map(child => child.r_findChildren(name)).flat()
    //     );
    // }
    //
    // public r_getChildren() {
    //     const children = [...this._children];
    //     this._children.forEach(child => children.push(...child.r_getChildren()));
    //     return children;
    // }

    // public addChild(child: Shape) {
    //     super.addChild(child);
    //     return this;
    // }
    //
    // public addChildren(...children: Shape[]) {
    //     super.addChildren(...children);
    //     return this;
    // }
    //
    // public removeChild(child: Shape) {
    //     super.removeChild(child);
    //     return this;
    // }
    //
    // public removeChildren(...children: Shape[]) {
    //     super.removeChildren(...children);
    //     return this;
    // }
    //
    // public removeSelf() {
    //     super.removeSelf();
    //     return this;
    // }

    // public findChildWhere(filter: (child: Shape) => boolean): Shape | undefined {
    //     return this._children.find(filter);
    // }
    //
    // public findChildrenWhere(filter: (child: Shape) => boolean): Shape[] {
    //     return this._children.filter(filter);
    // }
    //
    // public r_findChildWhere(filter: (child: Shape) => boolean): Shape | undefined {
    //     return (
    //         this._children.find(filter) ??
    //             this._children.map(child => child.r_findChildWhere(filter)).find(child => child !== undefined)
    //     );
    // }
    //
    // public r_findChildrenWhere(filter: (child: Shape) => boolean): Shape[] {
    //     return (
    //         this._children.filter(filter) ??
    //             this._children.map(child => child.r_findChildrenWhere(filter)).flat()
    //     );
    // }
    //
    // public removeChildWhere(filter: (child: Shape) => boolean): Shape | undefined {
    //     const child = this._children.find(filter);
    //     if (child) {
    //         this.removeChild(child);
    //     }
    //     return child;
    // }
    //
    // public removeChildrenWhere(filter: (child: Shape) => boolean): Shape[] {
    //     const children = this._children.filter(filter);
    //     this.removeChildren(...children);
    //     return children;
    // }
    //
    // public r_removeChildWhere(filter: (child: Shape) => boolean): Shape | undefined {
    //     const child = this._children.find(filter);
    //     if (child) {
    //         this.removeChild(child);
    //         return child;
    //     }
    //     for (const child of this._children) {
    //         const removed = child.r_removeChildWhere(filter);
    //         if (removed) {
    //             return removed;
    //         }
    //     }
    //     return undefined;
    // }
    //
    // public r_removeChildrenWhere(filter: (child: Shape) => boolean): Shape[] {
    //     const removed: Shape[] = [];
    //     for (const child of this._children) {
    //         removed.push(...child.r_removeChildrenWhere(filter));
    //     }
    //     this.removeChildren(...removed);
    //     return removed;
    // }
    //
    // public bringForward() {
    //     super.bringForward();
    //     return this;
    // }
    //
    // public bringToFront() {
    //     super.bringToFront();
    //     return this;
    // }
    //
    // public sendBackward() {
    //     super.sendBackward();
    //     return this;
    // }
    //
    // public sendToBack() {
    //     super.sendToBack();
    //     return this;
    // }

    // future update:
    // public schedule(frames: number, callback: (this: this) => void) {
    //     this.schedulers.push({ remainingFrames: Math.max(frames, 0), callback });
    //     return this;
    // }
    //
    // public in(frames: number, callback: (this: this) => void) {
    //     return this.schedule(frames, callback);
    // }
    //
    // public unschedule(callback: (this: this) => void) {
    //     this.schedulers = this.schedulers.filter(scheduler => schedulerback !== callback);
    //     return this;
    // }
    //
    // public unscheduleAll() {
    //     this.schedulers = [];
    //     return this;
    // }

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
        const clone = structuredClone({
            ...this,
            _children: undefined,
            _parent: undefined,
            _region: undefined,
            events: undefined,
            rootPointerEventCallback: undefined,
            drawFunction: undefined,
            effects: undefined,
            channels: undefined,
            eventListeners: undefined
        }) as this;
        const copy = Object.create(
            Object.getPrototypeOf(this) as object,
            Object.getOwnPropertyDescriptors(clone)
        ) as this;
        copy.eventListeners = {} as SpriteEventListeners<this, Properties & HiddenProperties>;
        for (const [event, listeners] of Object.entries(this.eventListeners)) {
            copy.eventListeners[event as keyof SpriteEventListeners<this, Properties & HiddenProperties>] =
                listeners.map((listener: (...args: any) => any) => listener.bind(copy) as (...args: any) => any);
        }
        copy.channels = this.channels.map(function () {
            return new Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>();
        });
        copy._children = this._children.map(child => child.copy());
        copy._parent = undefined;
        copy.rootPointerEventCallback = () => {
            return;
        };
        (copy as Record<any, any>).drawFunction = this.drawFunction;
        copy.effects = this.effects.bind(copy);
        return copy;
    }
}
