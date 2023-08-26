import { Position, ColorToString, Corners, Color } from "./Utils";
import { AcceptedTypesOf, PointerEventCallback, PrivateAnimationType, AnimationType, AnimationParams } from "./types/Animation";
import { PositionType, BoundsType, ColorType } from "./types/Common";
import { PointerEventsCollection } from "./types/Stage";
import { DEFAULT_PROPERTIES, DrawFunctionType, EffectsType, HIDDEN_SHAPE_PROPERTIES, KeysOf, ShapeProperties } from "./types/Sprites";
import { Channel } from "./Channels";

/**
 * Base class for all shapes. 
 * It's probably best to use the Sprite base class in almost all instances.
 * The two classes are separated for organizational purposes.
 * 
 * @template Properties The properties of the shape that will be passed to the constructor, as well as the draw function.
 * @template HiddenProperties Properties that are either map to multiple other properties, are calculated based on other properties, or are member variables not passed to the constructor.
 * 
 * @property effects A function that will be called on the canvas context before the shape is drawn.
 * @property drawFunction The actual function used to draw the shape.
 * @property children An array of child shapes. Children inherit the context transformations ONLY of their parent. The origin of the child is the center of the parent.
 */
export abstract class Shape<Properties = DEFAULT_PROPERTIES, HiddenProperties = HIDDEN_SHAPE_PROPERTIES> {
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
    protected _children: Shape<any, any>[] = [];
    protected _parent?: Shape<any, any> = undefined;
    protected rootPointerEventCallback: Function = () => { };
    protected _region: Path2D = new Path2D();

    /**
     * A name for the shape. Optional, and does not need to be unique.
     */
    public name: string;

    /**
     * An array of strings or numbers. Used to store any additional information about the shape.
     */
    public details: (string|number)[];

    /**
     * This object will be used to determine if onClick, onDrag, and onRelease callbacks should be called when this sprite is drawn.
     */
    public pointerEvents?: PointerEventsCollection = {
        down: [] as PointerEvent[],
        up: [] as PointerEvent[],
        move: [] as PointerEvent[], 
    };

    /**
     * A map of all valid properties that consist of multiple other hidden properties.
     * For example, doing myShape.setProperty('color', {...} ) should actually set the properties 'red', 'green', 'blue', and 'colorAlpha'.
     * Used as follows:
     * 
     * propertyName -> [[prop1, actualProp1], [prop2, actualProp2], ...]
     * 
     * 'scale' -> [['x', 'scaleX'], ['y', 'scaleY']]
     * 
     * myShape.setProperty('scale', {x: 2, y: 3}) // is converted to
     * 
     * myShape.scaleX = 2;
     * 
     * myShape.scaleY = 3;
     */
    protected aggregateProperties = new Map<string, [string, string][]>([
        ['color', [['red', 'red'], ['green', 'green'], ['blue', 'blue'], ['alpha', 'colorAlpha']]],
        ['bounds', [['x1', 'x1'], ['y1', 'y1'], ['x2', 'x2'], ['y2', 'y2']]],
        ['scale', [['x', 'scaleX'], ['y', 'scaleY']]],
        ['corner1', [['x', 'x1'], ['y', 'y1']]],
        ['corner2', [['x', 'x2'], ['y', 'y2']]],
    ]);

    /**
     * A map of all valid properties that are calculated from other "basic" properties. 
     * For example, the center of a shape isn't stored as a property, but is instead calculated from the x1, x2, y1, and y2 properties.
     * Maps [property name] -> { getter: () => ..., setter: () => ...}
     */
    protected calculatedProperties = new Map<string, {getter: (self: Shape<Properties, HiddenProperties>) => any, setter: (self: Shape<Properties, HiddenProperties>, value: any) => void}>([
        ['center', {
                getter: (self) : PositionType => Position((self.x1 + self.x2) / 2, (self.y1 + self.y2) / 2),
                setter: (self, value: PositionType) => {
                    const width = self.get('width');
                    const height = self.get('height');
                    self.x1 = value.x - width / 2;
                    self.y1 = value.y - height / 2;
                    self.x2 = value.x + width / 2;
                    self.y2 = value.y + height / 2;
                }
            }
        ],
        [ 'centerX', {
                getter: (self) : number => (self.x1 + self.x2) / 2,
                setter: (self, value: number) => {
                    const width = self.get('width');
                    self.x1 = value - width / 2;
                    self.x2 = value + width / 2;
                }
            }
        ],
        [ 'centerY', {
                getter: (self) : number => (self.y1 + self.y2) / 2,
                setter: (self, value: number) => {
                    const height = self.get('height');
                    self.y1 = value - height / 2;
                    self.y2 = value + height / 2;
                }
            }
        ],
        ['scale', {
                getter: (self) : PositionType => Position(self.scaleX, self.scaleY),
                setter: (self, value: PositionType) => {
                    self.scaleX = value.x;
                    self.scaleY = value.y;
                }
            }
        ],
        [
            'width', {
                getter: (self) : number => Math.abs(self.x2 - self.x1),
                setter: (self, value: number) => {
                    const centerX = self.get('centerX');
                    self.x1 = centerX - value / 2;
                    self.x2 = centerX + value / 2;
                }
            },
        ],
        [
            'height', {
                getter: (self) : number => Math.abs(self.y2 - self.y1),
                setter: (self, value: number) => {
                    const centerY = self.get('centerY');
                    self.y1 = centerY - value / 2;
                    self.y2 = centerY + value / 2;
                }
            },
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
        this.effects = props.effects ?? (() => { });
        this.drawFunction = props.drawFunction ?? (() => { });
        this.name = props.name ?? '';
        this.details = props.details ?? [];
    }

    /**
     * Used to draw the shape to the canvas.
     * Rotations and scaling are done around the center of the shape.
     * 
     * @param ctx The canvas context to draw to.
     * @param properties The properties of the shape to pass to the drawFunction.
     */
    public draw(ctx: CanvasRenderingContext2D, properties?: Properties, isRoot?: boolean) {
        isRoot = isRoot ?? true;
        if (isRoot) {
            this.rootPointerEventCallback = () => { };
        }
        ctx.save();
        this.effects(ctx);
        ctx.globalAlpha = this.alpha;
        ctx.translate(Math.min(this.x1, this.x2) + this.get('width') / 2, Math.min(this.y1, this.y2) + this.get('height') / 2);
        ctx.fillStyle = ColorToString({ red: this.red, green: this.green, blue: this.blue, alpha: this.colorAlpha });
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scaleX, this.scaleY);
        const region = this.drawFunction(ctx, properties!);
        if (region !== undefined) {
            this._region = region;
        }
        this._children.forEach(child => {
            child.pointerEvents = this.pointerEvents;
            child.draw(ctx, null, false);
        });
        // need to determine pointInPath HERE
        if (!this.handlePointerEvents(ctx))
            ctx.restore();
        if (isRoot) {
            this.rootPointerEventCallback();
        }
    }

    /**
     * Returns an array of functions to be called based off of pointer events.
     */
    public abstract handlePointerEvents(ctx: CanvasRenderingContext2D): boolean;

    public isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
        return ctx.isPointInPath(this._region, x, y);
    }

    public getBounds() {
        return Corners(this.x1, this.y1, this.x2, this.y2);
    }

    /**
     * Initializes the undefined properties of the shape to their default values.
     * 
     * @param props an object containing the core Shape properties: color, alpha, rotation, scale, bounds, name, and effects.
     * @returns the same object, but with the undefined properties initialized to their default values.
     */
    static initializeProps(props: { color?: ColorType, alpha?: number, rotation?: number, scale?: PositionType, bounds: BoundsType, name?: string, details?: (number|string)[], effects?: EffectsType }) {
        return {
            color: props.color ?? Color(0, 0, 0),
            alpha: props.alpha ?? 1,
            rotation: props.rotation ?? 0,
            scale: props.scale ?? Position(1, 1),
            bounds: props.bounds,
            name: props.name ?? '',
            details: props.details ?? [],
            effects: props.effects ?? (() => { })
        };
    }

    /**
     * Accesses the protected/private member variables of the shape, as well as the calculated and aggregate properties.
     * 
     * @param property The property to get.
     * @returns The value of the property.
     */
    public get(property: KeysOf<Properties>|keyof HiddenProperties, raiseError = true): any { // to-do: get rid of any
        if (this.calculatedProperties.has(property as string)) {
            const getter = this.calculatedProperties.get(property as string)!.getter;
            return getter(this);
        } else if (this.aggregateProperties.has(property as string)) {
            const specialProps = this.aggregateProperties.get(property as string)!;
            let object : any = {};
            specialProps.forEach(prop => object[prop[0]] = this.get(prop[1] as KeysOf<Properties>));
            return object;
        }
        const out = Object.getOwnPropertyDescriptor(this, property)?.value;
        if (out === undefined && raiseError) throw new Error(`Property ${property as string} does not exist on ${this.constructor.name}`);
        return out;
    }

    /**
     * Sets the protected/private member variables of the shape, as well as the calculated and aggregate properties.
     * Tries to set it as a calculated property first, then an aggregate property, then a normal property.
     * 
     * @param property The property to set.
     * @param value The value to set the property to.
     * @param raiseError Whether or not to raise an error if the property is invalid or cannot be set.
     * @returns True if the property was set successfully.
     */
    public set(property: KeysOf<Properties>|keyof HiddenProperties, value: AcceptedTypesOf<Properties & HiddenProperties>, raiseError: boolean = true): boolean {
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
            const specialProps = this.aggregateProperties.get(property as string)!;
            if (typeof value !== 'object') {
                if (raiseError) throw new Error(`Value ${value} is not a valid value for property ${property as string}`);
                return false;
            }
            const attempts = specialProps.map(prop => this.set(prop[1] as KeysOf<Properties>, (value as any)[prop[0]], false));
            if (attempts.includes(false)) {
                if (raiseError) throw new Error(`Value ${value} is not a valid value for property ${property as string}`);
                return false;
            }
            return true;
        }
        if (Object.getOwnPropertyDescriptor(this, property)?.value === undefined) {
            if (raiseError) throw new Error(`Property ${property as string} does not exist on ${this.constructor.name}`);
            return false;
        }
        if (typeof value !== typeof this.get(property as KeysOf<Properties>)) {
            if (raiseError) throw new Error(`Value ${value} is not a valid value for property ${property as string}`);
            return false;
        }
        Object.defineProperty(this, property, { value });
        return true;
    }

    /**
     * @returns True if a property is a member variable with the type of number.
     */
    public isNumericProperty(property: KeysOf<Properties>|keyof HiddenProperties): boolean {
        return typeof this.get(property) === 'number';
    }

    public addChild(child: Shape<any, any>) {
        child._parent = this;
        this._children.push(child);
        return this;
    }

    public addChildren(...children: Shape<any, any>[]): this {
        children.forEach(child => child._parent = this);
        this._children.push(...children);
        return this;
    }

    public removeChild(child: Shape<any, any>): this {
        child._parent = undefined;
        this._children = this._children.filter(c => c !== child);
        return this;
    }

    public removeChildren(...children: Shape<any, any>[]) {
        children.forEach(child => child._parent = undefined);
        this._children = this._children.filter(child => !children.includes(child));
        return this;
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
    public r_getChildren() {
        const children = [...this._children];
        this._children.forEach(child => children.push(...child.r_getChildren()));
        return children as Sprite<any, any>[];
    }

    public get parent() {
        return this._parent;
    }

    public get root(): Shape<any, any> {
        if (this._parent === undefined) return this;
        return this._parent.root;
    }

    public logHierarchy(indent = 0) {
        const name = this.name === '' ? this.constructor.name : this.name;
        const red = [this.red, this.green, this.blue].every(color => color < 25) ? 125 : this.red;
        const green = [this.red, this.green, this.blue].every(color => color < 25) ? 125 : this.green;
        const blue = [this.red, this.green, this.blue].every(color => color < 25) ? 125 : this.blue;
        console.log(`%c${'\t'.repeat(indent)} ⌞${name} \t{ ${this.constructor.name} @ (${this.x1}, ${this.y1}) (${this.x2}, ${this.y2}) }`, `color: ${ColorToString(Color(red, green, blue))}; font-weight: bold;`);
        this._children.forEach(child => child.logHierarchy(indent + 1));
    }
};

/**
 * Base class for all shapes, text, and images.
 * Inherits from Shape.
 * Manages animations and pointer events.
 * 
 * @template Properties The properties of the shape that will be passed to the constructor, as well as the draw function.
 * @template HiddenProperties Properties that are either map to multiple other properties, are calculated based on other properties, or are member variables not passed to the constructor.
 * 
 * @property channels An array of channels. Each channel contains a queue of animation arrays, called animation packages. Multiple channels can be used to run animations in parallel.
 * 
 * @param channels The number of channels to use for animations. Defaults to 1.
 * @param _pointerID Private, used to determine if the shape is being "dragged". Undefined if not.
 * @param children An array of child shapes. Children inherit the context transformations ONLY of their parent. The origin of the child is the center of the parent.
 */
export abstract class Sprite<Properties = DEFAULT_PROPERTIES, HiddenProperties = {}> extends Shape<Properties, HiddenProperties & HIDDEN_SHAPE_PROPERTIES> {
    protected channels: Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>[];
    public pointerId?: number = undefined;
    public pointerButton?: number = undefined;
    public hovered: boolean = false;
    protected _children: Sprite<any, any>[] = [];

    /** Callback that will be run on this sprite when a pointerDown event occurs within the bounds of the shape.
     * 
     * @param shape This sprite.
     * @param event The pointer event.
     * @param translatedPoint The point where the pointer event occurred, relative to the shape.
     */
    public onClick?: PointerEventCallback<Properties, HiddenProperties> = undefined;

    /** Callback that will be run on this sprite every frame between the sprite being clicked on and the pointer being released.
     * 
     * @param shape This sprite.
     * @param event The pointer event.
     * @param translatedPoint The point where the pointer event occurred, relative to the shape.
     */
    public onDrag?: PointerEventCallback<Properties, HiddenProperties> = undefined;

    /** Callback that will be run on this sprite when the pointer is released after the sprite has been clicked on.
     * 
     * @param shape This sprite.
     * @param event The pointer event.
     * @param translatedPoint The point where the pointer event occurred, relative to the shape.
     */
    public onRelease?:PointerEventCallback<Properties, HiddenProperties> = undefined;

    /** Callback that will be run on this sprite once it is hovered over.
     * 
     * @param shape This sprite.
     * @param event The mousemove PointerEvent.
     * @param translatedPoint The point where the pointer event occurred, relative to the shape.
     */
    public onHover?: (sprite: Sprite<Properties, HiddenProperties>, event: PointerEvent, translatedPoint: PositionType) => void = undefined;

    /** Callback that will be run on this sprite once it is no longer hovered over.
     * 
     * @param shape This sprite.
     * @param translatedPoint The point where the pointer event occurred, relative to the shape.
     */
    public onHoverEnd?: (sprite: Sprite<Properties, HiddenProperties>, translatedPoint: PositionType) => void = undefined;

    /**
     * Callback that will be run on this sprite when an animation finishes.
     * 
     * @param shape This sprite.
     * @param animation The animation that finished.
     */
    public onAnimationFinish?: (shape: Sprite<Properties, HiddenProperties>, animation: PrivateAnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>) => void = undefined;

    constructor( props: ShapeProperties<Properties>, channels: number = 1) {
        super(props);
        this.channels = Array.from({ length: channels }, () => new Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>());
        return this;
    };

    /**
     * Steps forward all animations, then calls draw.
     * 
     * @param ctx 
     * @param properties 
     */
    public draw(ctx: CanvasRenderingContext2D, properties?: Properties): void {
        this.animate();
        super.draw(ctx, properties!);
    }

    public getChannel(index: number): Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES> {
        return this.channels[index];
    }

    /**
     * Spreads animation packages across multiple channels.
     * If there aren't enough channels to distribute the packages, an error will be thrown.
     * 
     * @param animations An array of animation arrays. The first animation array will go to channel 0, the second to channel 1, etc. 
     * @param params The parameters to be applied to all of the animation arrays (not the animations themselves).
     * @returns this
     */    
    public distribute(
        animations: AnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>[][], 
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
        ) {
            if (animations.length > this.channels.length) {
                throw new Error(`Cannot distribute ${animations.length} animations to ${this.channels.length} channels`);
            }
            for (const idx in animations) {
                const animation = animations[idx];
                this.channels[parseInt(idx) % this.channels.length].push(animation, params);
            }
        return this;
    }

    /**
     * Steps forward all animations.
     * 
     * @returns this
     */
    private animate() {
        const animations = this.channels.map(channel => channel.stepForward()).filter(animation => animation !== null);
        for (const animation of animations.reverse()) {
            this.animateProperty(animation!);
        }
        return this;
    };

    private animateProperty(animation: PrivateAnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>): void {
        if (animation._from === undefined || animation.frame === 0) {
            if (animation.from === null) {
                animation._from = this.get(animation.property);
            } else {
                animation._from = animation.from;
            }
        }
        if (animation._to === undefined || animation.frame === 0) {
            if (typeof animation.to === 'function') {
                const callback = animation.to as Function;
                animation._to = callback(animation._from as any);
            } else {
                animation._to = animation.to;
            }
        }
        const [from, to, frame, duration, easing] = [animation._from, animation._to, animation.frame ?? 0, animation.duration, animation.easing];
        if (this.isNumericProperty(animation.property) && typeof from === 'number' && typeof to === 'number') {
            const success = this.set(animation.property, 
                from + (easing(frame / duration)) * (to - from) as AcceptedTypesOf<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>
            );
            if (!success) {
                this.raiseAnimationError(from, to, animation.property as string);
            }
        } else if (this.calculatedProperties.has(animation.property as string)) {
            if (typeof from !== 'object' || typeof to !== 'object') {
                this.raiseAnimationError(from, to, animation.property as string);
            }
            const current = { ...(to as object) } as any;
            for (const key of Object.keys(to as object)) {
                const p_from = from![key as keyof typeof from] as number;
                const p_to = to![key as keyof typeof to] as number;
                if (p_from === undefined || p_to === undefined) {
                    this.raiseAnimationError(from, to, key as string);
                }
                current[key] = p_from + (easing(frame / duration)) * (p_to - p_from);
            }
            const success = this.set(animation.property as keyof Properties, current as any);
            if (!success) {
                this.raiseAnimationError(from, to, animation.property as string);
            }
        } else if (this.aggregateProperties.has(animation.property as string)) {
            for (const property of this.aggregateProperties.get(animation.property as string)!) {
                const [propertySrc, propertyDest] = property;
                const p_from = from![propertySrc as keyof typeof from] as any;
                const p_to = to![propertySrc as keyof typeof to] as any;
                if (p_from === undefined || p_to === undefined) {
                    throw new Error(`Value ${p_from} or ${p_to} is not a valid value for property ${propertyDest as string}`);
                }
                const success = this.set(propertyDest as keyof Properties, 
                    p_from + (easing(frame / duration)) * (p_to - p_from)
                , true);
                if (!success) {
                    this.raiseAnimationError(p_from, p_to, propertyDest as string);
                }
            }
        } else {
            throw new Error(`Property ${animation.property as string} is not a valid property`);
        }
        if (animation.frame === animation.duration && this.onAnimationFinish !== undefined) {
            this.onAnimationFinish(this, animation);
        }
    }

    private raiseAnimationError(from: any, to: any, property: string) {
        throw new Error(`${from} -> ${to} is not a valid animation for property ${property}`)
    }

    public handlePointerEvents(ctx: CanvasRenderingContext2D): boolean {
        
        let ctxRestored = false;

        if (this.pointerEvents === undefined) return false;
        
        if (this.pointerEvents.down.length === 0 && this.pointerEvents.up.length === 0 && this.pointerEvents.move.length === 0) return false;
        
        if (this.onHover === undefined && this.onHoverEnd === undefined && this.onClick === undefined && this.onDrag === undefined && this.onRelease === undefined) return false;
        
        let pointInPath = false;
        const cursorPos : PositionType|null = Object.values(this.pointerEvents)
        .flat()
        .reduce((_: PositionType|null, e) => {
            const pos = Position(
                (e.offsetX || e.clientX - ctx.canvas.getBoundingClientRect().left) * ctx.canvas.width / ctx.canvas.clientWidth, // (Google Chrome) || (Firefox)
                (e.offsetY || e.clientY - ctx.canvas.getBoundingClientRect().top) * ctx.canvas.height / ctx.canvas.clientHeight // (Google Chrome) || (Firefox)
            );
            pointInPath = pointInPath || this.isPointInPath(ctx, pos.x, pos.y);
            // console.log(ctx.canvas.getBoundingClientRect().top, ctx.canvas.offsetTop, ctx.canvas.getBoundingClientRect().left, ctx.canvas.offsetLeft);
            return pos;
        }, null);

        if (cursorPos === null && this.pointerId === undefined) return false;
        
        if (pointInPath && this.onHover !== undefined && !this.hovered && pointInPath) {
            const transformedPos = ctx.getTransform().inverse().transformPoint(cursorPos!) as PositionType;
            this.onHover(this, this.pointerEvents.move[0], transformedPos);
            this.hovered = true;
        } else if (!pointInPath && this.hovered && this.onHoverEnd !== undefined) {
            const transformedPos = ctx.getTransform().inverse().transformPoint(cursorPos!) as PositionType;
            this.onHoverEnd(this, transformedPos);
            this.hovered = false;
        }
        
        if (this.pointerEvents.move.length > 0 && this.pointerEvents.up.length === 0 && this.pointerEvents.down.length === 0) {
            if (this.pointerId !== undefined && this.onDrag !== undefined) {
                ctx.restore();
                ctxRestored = true;
                const event = this.pointerEvents.move[0];
                const transformedPos = ctx.getTransform().inverse().transformPoint(cursorPos!) as PositionType;
                const transformationMatrix = ctx.getTransform();
                const callback = () => {
                    ctx.save(); 
                    ctx.setTransform(transformationMatrix.a, transformationMatrix.b, transformationMatrix.c, transformationMatrix.d, transformationMatrix.e, transformationMatrix.f);
                    this.onDrag!(this, event, transformedPos); 
                    ctx.restore();
                };
                this.root.rootPointerEventCallback = callback.bind(this);
            }
        }
    
        if (this.pointerEvents.up.length > 0) {
            ctx.restore();
            ctxRestored = true;
            if (this.onRelease !== undefined && this.pointerId !== undefined) {
                const event = this.pointerEvents.up[0];
                const transformedPos = ctx.getTransform().inverse().transformPoint(cursorPos!) as PositionType;
                const transformationMatrix = ctx.getTransform();
                const callback = () => {
                    ctx.save();
                    ctx.setTransform(transformationMatrix.a, transformationMatrix.b, transformationMatrix.c, transformationMatrix.d, transformationMatrix.e, transformationMatrix.f);
                    this.onRelease!(this, event, transformedPos);
                    ctx.restore();
                };
                this.root.rootPointerEventCallback = callback.bind(this);
            }
            this.pointerId = undefined;
        } else if (this.pointerEvents.down.length > 0) {
            if (this.isPointInPath(ctx, cursorPos!.x, cursorPos!.y)) {
                ctx.restore();
                ctxRestored = true;
                const event = this.pointerEvents.down[0];
                this.pointerId = event.pointerId;
                this.pointerButton = event.button;
                const transformedPos = ctx.getTransform().inverse().transformPoint(cursorPos!) as PositionType;
                const transformationMatrix = ctx.getTransform();
                if (this.onClick !== undefined) {
                    const callback = () => {
                        ctx.save();
                        ctx.setTransform(transformationMatrix.a, transformationMatrix.b, transformationMatrix.c, transformationMatrix.d, transformationMatrix.e, transformationMatrix.f);
                        this.onClick!(this, event, transformedPos);
                        ctx.restore();
                    };
                    this.root.rootPointerEventCallback = callback.bind(this);
                }
            }
        }
        return ctxRestored;
    }

    public setOnClick(callback: PointerEventCallback<Properties, HiddenProperties>) {
        this.onClick = callback;
        return this;
    }

    public setOnDrag(callback: PointerEventCallback<Properties, HiddenProperties>) {
        this.onDrag = callback;
        return this;
    }

    public setOnRelease(callback: PointerEventCallback<Properties, HiddenProperties>) {
        this.onRelease = callback;
        return this;
    }

    public setOnHover(callback: (sprite: Sprite<Properties, HiddenProperties>, translatedPoint: PositionType) => void) {
        this.onHover = callback;
        return this;
    }

    public setOnHoverEnd(callback: (sprite: Sprite<Properties, HiddenProperties>, translatedPoint: PositionType) => void) {
        this.onHoverEnd = callback;
        return this;
    }

    public setPointerEvents(collection: PointerEventsCollection) {
        this.pointerEvents = collection;
        return this;
    }

    /**
     * Recursive version of setPointerEvents.
     */
    public r_setPointerEvents(collection: PointerEventsCollection) {
        this.setPointerEvents(collection);
        this._children.forEach(child => child.r_setPointerEvents(collection));
        return this;
    }

    public get children() {
        return super.children as Sprite<any, any>[];
    }

    /**
     * Returns the first child sprite with the given name. (Non-recursive)
     */
    public findChild(name: string): Sprite<any, any>|undefined {
        return this._children.find(child => child.name === name);
    }

    /**
     * Returns an array of all child sprites with the given name. (Non-recursive)
     */
    public findChildren(name: string): Sprite<any, any>[] {
        return this._children.filter(child => child.name === name);
    }

    /**
     * Returns the first child sprite with the given name. (Recursive)
     */
    public r_findChild(name: string): Sprite<any, any>|undefined {
        return this._children.find(child => child.name === name) ?? this._children.map(child => child.r_findChild(name)).find(child => child !== undefined);
    }
    
    /**
     * Returns an array of all child sprites with the given name. (Recursive)
     */
    public r_findChildren(name: string): Sprite<any, any>[] {
        return this._children.filter(child => child.name === name).concat(this._children.map(child => child.r_findChildren(name)).flat());
    }

    /**
     * @returns A deep copy of the shape.
     */
    public copy(): Sprite<Properties, HiddenProperties> {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    public get root(): Sprite<any, any> {
        if (this._parent === undefined) return this;
        return this._parent.root as Sprite<any, any>;
    }

    public createChannels(num: number) {
        this.channels.push(...Array.from({ length: num }, () => new Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>()));
        return this;
    }

    public get parent(): Sprite<any, any>|undefined {
        return this._parent as Sprite<any, any>|undefined;
    }
}