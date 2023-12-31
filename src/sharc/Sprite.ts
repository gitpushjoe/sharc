import { Position, ColorToString, Corners, Color } from "./Utils";
import { PrivateAnimationType, AnimationParams, AnimationType, AnimationCallback } from "./types/Animation";
import { PositionType, BoundsType, ColorType } from "./types/Common";
import { SpriteEventCollection } from "./types/Events";
import {
    DEFAULT_PROPERTIES,
    DrawFunctionType,
    EffectsType,
    HIDDEN_SHAPE_PROPERTIES,
    MostlyRequired,
    NORMAL_SHAPE_PROPERTIES
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
    protected events?: SpriteEventCollection = undefined;
    public name = "";
    public details?: DetailsType = undefined;

    public abstract draw(_ctx: CanvasRenderingContext2D, _properties?: Properties, _isRoot?: boolean): void;

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

    public abstract pointIsInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean;
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
        HiddenProperties = object,
        NormalProps extends keyof (Properties & HiddenProperties) = never
    >
    extends Shape<Properties, HiddenProperties, DetailsType>
    implements MostlyRequired<DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>
{
    protected properties: Required<Omit<Pick<Properties & HiddenProperties, NormalProps>, keyof DEFAULT_PROPERTIES>> &
        Pick<Required<DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>, NORMAL_SHAPE_PROPERTIES>;
    // protected subclass_properties: Required<Omit<Pick<Properties & HiddenProperties, NormalProps>, keyof (DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES)>> = {} as any;
    public readonly drawFunction: DrawFunctionType<Properties> = () => {
        return;
    };
    protected rootPointerEventCallback: () => void = () => {
        return;
    };
    protected _region: Path2D = new Path2D();
    public channels: Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[]; // to-do: ensure that details can never be animated
    protected stage?: Stage;

    public enabled = true;

    public get effects() {
        return this.properties.effects;
    }
    public set effects(value: EffectsType) {
        this.properties.effects = value;
    }

    public get blur() {
        return this.properties.blur;
    }
    public set blur(value: number) {
        this.properties.blur = value;
    }

    public get gradient() {
        return this.properties.gradient;
    }
    public set gradient(value: CanvasGradient | null) {
        this.properties.gradient = value;
    }

    public get bounds() {
        return Corners(this.x1, this.y1, this.x2, this.y2);
    }
    public set bounds(value: BoundsType) {
        this.x1 = value.x1;
        this.y1 = value.y1;
        this.x2 = value.x2;
        this.y2 = value.y2;
    }

    public get red() {
        return this.properties.red;
    }
    public set red(value: number) {
        this.properties.red = value;
    }

    public get green() {
        return this.properties.green;
    }
    public set green(value: number) {
        this.properties.green = value;
    }

    public get blue() {
        return this.properties.blue;
    }
    public set blue(value: number) {
        this.properties.blue = value;
    }

    public get colorAlpha() {
        return this.properties.colorAlpha;
    }
    public set colorAlpha(value: number) {
        this.properties.colorAlpha = value;
    }

    public get color() {
        return Color(this.red, this.green, this.blue, this.colorAlpha);
    }
    public set color(value: ColorType) {
        this.red = value.red;
        this.green = value.green;
        this.blue = value.blue;
        this.colorAlpha = value.alpha;
    }

    public get alpha() {
        return this.properties.alpha;
    }
    public set alpha(value: number) {
        this.properties.alpha = value;
    }

    public get rotation() {
        return this.properties.rotation;
    }
    public set rotation(value: number) {
        this.properties.rotation = value;
    }

    public get scale() {
        return Position(this.scaleX, this.scaleY);
    }
    public set scale(value: PositionType) {
        this.properties.scaleX = value.x;
        this.properties.scaleY = value.y;
    }

    public get x1() {
        return this.properties.x1;
    }
    public set x1(value: number) {
        this.properties.x1 = value;
    }

    public get y1() {
        return this.properties.y1;
    }
    public set y1(value: number) {
        this.properties.y1 = value;
    }

    public get x2() {
        return this.properties.x2;
    }
    public set x2(value: number) {
        this.properties.x2 = value;
    }

    public get y2() {
        return this.properties.y2;
    }
    public set y2(value: number) {
        this.properties.y2 = value;
    }

    public get scaleX() {
        return this.properties.scaleX;
    }
    public set scaleX(value: number) {
        this.properties.scaleX = value;
    }

    public get scaleY() {
        return this.properties.scaleY;
    }
    public set scaleY(value: number) {
        this.properties.scaleY = value;
    }

    public get width() {
        return Math.abs(this.x2 - this.x1);
    }
    public set width(value: number) {
        const centerX = this.centerX;
        this.x1 = centerX - value / 2;
        this.x2 = centerX + value / 2;
    }

    public get height() {
        return Math.abs(this.y2 - this.y1);
    }
    public set height(value: number) {
        const centerY = this.centerY;
        this.y1 = centerY - value / 2;
        this.y2 = centerY + value / 2;
    }

    public get centerX() {
        return (this.x1 + this.x2) / 2;
    }
    public set centerX(value: number) {
        const width = this.width;
        this.x1 = value - width / 2;
        this.x2 = value + width / 2;
    }

    public get centerY() {
        return (this.y1 + this.y2) / 2;
    }
    public set centerY(value: number) {
        const height = this.height;
        this.y1 = value - height / 2;
        this.y2 = value + height / 2;
    }

    public get center() {
        return Position(this.centerX, this.centerY);
    }
    public set center(value: PositionType) {
        this.centerX = value.x;
        this.centerY = value.y;
    }

    public get corner1() {
        return Position(this.x1, this.y1);
    }
    public set corner1(value: PositionType) {
        this.x1 = value.x;
        this.y1 = value.y;
    }

    public get corner2() {
        return Position(this.x2, this.y2);
    }
    public set corner2(value: PositionType) {
        this.x2 = value.x;
        this.y2 = value.y;
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

    public name: string;

    public events?: SpriteEventCollection = {
        down: [] as PointerEvent[],
        up: [] as PointerEvent[],
        move: [] as PointerEvent[],
        stage: undefined
    };

    constructor(
        derived_props: Required<Omit<Pick<Properties & HiddenProperties, NormalProps>, keyof DEFAULT_PROPERTIES>>,
        props: Properties & DEFAULT_PROPERTIES<DetailsType>
    ) {
        super();
        // this.drawFunction = props.drawFunction ?? (() => { });
        this.name = props.name ?? "";
        this.enabled = props.enabled ?? true;
        this.properties = {
            ...derived_props,
            alpha: props.alpha ?? 1,
            rotation: props.rotation ?? 0,
            scaleX: props.scale?.x ?? 1,
            scaleY: props.scale?.y ?? 1,
            red: props.color?.red ?? 0,
            green: props.color?.green ?? 0,
            blue: props.color?.blue ?? 0,
            colorAlpha: props.color?.alpha ?? 1,
            effects:
                props.effects ??
                (() => {
                    return;
                }),
            gradient: props.gradient ?? null,
            blur: props.blur ?? 0,
            name: props.name ?? "",
            x1: props.bounds?.x1 ?? 0,
            y1: props.bounds?.y1 ?? 0,
            x2: props.bounds?.x2 ?? 0,
            y2: props.bounds?.y2 ?? 0,
            channelCount: props.channelCount ?? 1
        };
        this.channels = Array.from(
            { length: this.properties.channelCount },
            () => new Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>()
        );
        this.details = props.details;
    }

    public draw(ctx: CanvasRenderingContext2D, properties?: Required<Properties>, isRoot?: boolean) {
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
                callback.call(this, event, event.currentFrame);
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

    public handlePointerEvents(ctx: CanvasRenderingContext2D): boolean {
        let ctxRestored = false;

        if (this.events === undefined) return false;

        if (this.events.down.length === 0 && this.events.up.length === 0 && this.events.move.length === 0) return false;

        if (
            [
                this.eventListeners.click,
                this.eventListeners.drag,
                this.eventListeners.hover,
                this.eventListeners.hoverEnd,
                this.eventListeners.release
            ].every(listeners => listeners.length === 0)
        )
            return false;

        let pointInPath = false;
        const cursorPos: PositionType | null = Object.values(
            [this.events.down, this.events.up, this.events.move].flat()
        )
            .flat()
            .reduce((_: PositionType | null, e) => {
                const pos = Position(
                    ((e.offsetX || e.clientX - ctx.canvas.getBoundingClientRect().left) * ctx.canvas.width) /
                        ctx.canvas.clientWidth, // (Google Chrome) || (Firefox)
                    ((e.offsetY || e.clientY - ctx.canvas.getBoundingClientRect().top) * ctx.canvas.height) /
                        ctx.canvas.clientHeight // (Google Chrome) || (Firefox)
                );
                pointInPath = pointInPath || this.pointIsInPath(ctx, pos.x, pos.y);
                // console.log(ctx.canvas.getBoundingClientRect().top, ctx.canvas.offsetTop, ctx.canvas.getBoundingClientRect().left, ctx.canvas.offsetLeft);
                return pos;
            }, null);

        if (cursorPos === null && this.pointerId === undefined) return false;

        if (pointInPath && this.eventListeners.hover.length > 0 && !this.hovered && pointInPath) {
            this.eventListeners.hover.forEach(callback => callback.call(this, this.events!.move[0], Position(0, 0)));
            this.hovered = true;
        } else if (!pointInPath && this.hovered && this.eventListeners.hoverEnd.length > 0) {
            this.eventListeners.hoverEnd.forEach(callback => callback.call(this, this.events!.move[0], Position(0, 0)));
            this.hovered = false;
        }

        if (this.events.move.length > 0 && this.events.up.length === 0 && this.events.down.length === 0) {
            if (this.pointerId !== undefined && this.eventListeners.drag.length > 0) {
                ctx.restore();
                ctxRestored = true;
                const event = this.events.move[0];
                const transformedPos = ctx.getTransform().inverse().transformPoint(cursorPos!) as PositionType;
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
                    this.eventListeners.drag.forEach(callback => callback.call(this, event, transformedPos));
                    ctx.restore();
                };
                (this.root as Sprite).rootPointerEventCallback = callback.bind(this);
            }
        }

        if (this.events.up.length > 0) {
            ctx.restore();
            ctxRestored = true;
            if (this.eventListeners.release.length > 0 && this.pointerId !== undefined) {
                const event = this.events.up[0];
                const transformedPos = ctx.getTransform().inverse().transformPoint(cursorPos!) as PositionType;
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
                    this.eventListeners.release.forEach(callback => callback.call(this, event, transformedPos));
                    ctx.restore();
                };
                (this.root as Sprite).rootPointerEventCallback = callback.bind(this);
            }
            this.pointerId = undefined;
        } else if (this.events.down.length > 0) {
            if (this.pointIsInPath(ctx, cursorPos!.x, cursorPos!.y)) {
                ctx.restore();
                ctxRestored = true;
                const event = this.events.down[0];
                this.pointerId = event.pointerId;
                this.pointerButton = event.button;
                const transformedPos = ctx.getTransform().inverse().transformPoint(cursorPos!) as PositionType;
                const transformationMatrix = ctx.getTransform();
                if (this.eventListeners.click.length > 0) {
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
                        this.eventListeners.click.forEach(callback => callback.call(this, event, transformedPos));
                        ctx.restore();
                    };
                    (this.root as Sprite).rootPointerEventCallback = callback.bind(this);
                }
            }
        }
        return ctxRestored;
    }

    public pointIsInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
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

    /**
     * @returns A copy of the children array. (Not recursive)
     */
    public get children() {
        return [...this._children];
    }

    /**
     * @returns A copy of the children array. (Recursive)
     */

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
                // animation._from = Object.getOwnPropertyDescriptor(this, animation.property as keyof Properties)!.value;
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

    public setPointerEvents(collection: SpriteEventCollection) {
        this.events = collection;
        return this;
    }

    private r_setPointerEvents(collection: SpriteEventCollection) {
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
        const copy = new (this.constructor as new (...args: any) => this)({ ...this });
        for (let listeners of Object.values(this.eventListeners)) {
            (listeners as any) = listeners.map(listener => listener.bind(copy));
        }
        copy.properties = {
            ...structuredClone({
                ...this.properties,
                effects: null
            }),
            effects: this.properties.effects.bind(copy)
        } as Required<Omit<Pick<Properties & HiddenProperties, NormalProps>, keyof DEFAULT_PROPERTIES>> &
            Pick<Required<DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>, NORMAL_SHAPE_PROPERTIES>;
        copy.properties.effects = this.properties.effects.bind(copy);
        copy._children = this._children.map(child => child.copy());
        return copy;
    }
}
