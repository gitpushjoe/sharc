import { NullSprite } from "./Sprites";
import { ColorToString, Colors, Position } from "./Utils";
import { ColorType, PositionType } from "./types/Common";
import { PointerEventCallback, EventCollection, StageEventListeners } from "./types/Events";
import { DEFAULT_PROPERTIES } from "./types/Sprites";
import { CanvasInterface } from "./types/Stage";

export class StageRoot<DetailsType = any> extends NullSprite {
    constructor(
        stage: Stage,
        props: { position?: PositionType } & Omit<DEFAULT_PROPERTIES<DetailsType>, "bounds" | "color">
    ) {
        super(props);
        this.stage = stage;
    }
}

export class Stage<RootDetailsType = any> {
    protected _root: NullSprite;
    protected ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    protected active = false;
    protected nextRenderTime?: number = undefined;
    protected frameRate = 60;
    public lastRenderMs = 0;
    public currentFrame = 0;
    protected drawEvents: EventCollection<RootDetailsType> = {};
    protected onError = (e?: Error) => {
        console.error(e);
    };

    public eventListeners = {
        beforeDraw: [] as StageEventListeners["beforeDraw"],
        click: [] as StageEventListeners["click"],
        release: [] as StageEventListeners["release"],
        move: [] as StageEventListeners["move"],
        keydown: [] as StageEventListeners["keydown"],
        keyup: [] as StageEventListeners["keyup"],
        scroll: [] as StageEventListeners["scroll"]
    } as StageEventListeners<this>;

    constructor(
        protected canvas?: CanvasInterface,
        public readonly rootStyle: "classic" | "centered" = "centered",
        public bgColor: ColorType = Colors.White,
        ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        noCtx = false
    ) {
        if (!canvas) {
            throw new Error("No canvas element provided");
        }
        this._root =
            rootStyle === "classic"
                ? new StageRoot<RootDetailsType>(this, {})
                : new StageRoot<RootDetailsType>(this, {
                      position: Position(this.width! / 2, this.height! / 2),
                      scale: Position(1, -1)
                  });
        canvas.oncontextmenu = () => false;
        canvas.style.touchAction = "none";
        this.ctx = ctx ?? (noCtx ? undefined : canvas.getContext("2d")!);
    }

    public get root() {
        return this._root;
    }

    public addEventListener<E extends keyof StageEventListeners<this> = keyof StageEventListeners<this>>(
        event: E,
        callback: StageEventListeners<this>[E][0]
    ) {
        this.eventListeners[event as "click"].push(callback as unknown as PointerEventCallback<Stage>);
    }

    public on<E extends keyof StageEventListeners<this> = keyof StageEventListeners<this>>(
        event: E,
        callback: StageEventListeners<this>[E][0]
    ) {
        this.addEventListener(event, callback);
    }

    public removeEventListener<E extends keyof StageEventListeners<this> = keyof StageEventListeners<this>>(
        event: E,
        callback: StageEventListeners<this>[E][0]
    ) {
        this.eventListeners[event as "click"] = this.eventListeners[event as "click"].filter(
            cb => cb !== (callback as unknown as PointerEventCallback<Stage>)
        );
    }

    protected pointerDownHandler(e: PointerEvent) {
        if (!this.active) {
            return;
        }
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX -
                (this.rootStyle === "centered" ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY -
                (this.rootStyle === "centered" ? this.height! / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        );
        this.eventListeners.click.forEach(callback => callback.call(this, e, position));
        this.drawEvents.down = { event: e, translatedPoint: this.positionOnCanvas(this.canvas!, e) };
        this.canvas?.focus && this.canvas.focus();
    }

    protected pointerUpHandler(e: PointerEvent) {
        if (!this.active) {
            return;
        }
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX -
                (this.rootStyle === "centered" ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY -
                (this.rootStyle === "centered" ? this.height! / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        );
        this.eventListeners.release.forEach(callback => callback.call(this, e, position));
        this.drawEvents.up = { event: e, translatedPoint: this.positionOnCanvas(this.canvas!, e) };
    }

    protected pointerMoveHandler(e: PointerEvent) {
        if (!this.active) {
            return;
        }
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX -
                (this.rootStyle === "centered" ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY -
                (this.rootStyle === "centered" ? this.height! / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        );
        this.eventListeners.move.forEach(callback => callback.call(this, e, position));
        this.drawEvents.move = { event: e, translatedPoint: this.positionOnCanvas(this.canvas!, e) };
    }

    protected async keydownHandler(e: KeyboardEvent) {
        if (!this.active) {
            return;
        }
        e.preventDefault();
        this.eventListeners.keydown.forEach(callback => callback.call(this, e));
        this.drawEvents.keydown = e;
    }

    protected keyupHandler(e: KeyboardEvent) {
        if (!this.active) {
            return;
        }
        e.preventDefault();
        this.eventListeners.keyup.forEach(callback => callback.call(this, e));
        this.drawEvents.keyup = e;
    }

    private wheelHandler(e: WheelEvent) {
        if (!this.active) {
            return;
        }
        this.eventListeners.scroll.forEach(callback => callback.call(this, e));
        this.drawEvents.scroll = e;
        e.preventDefault();
    }

    public positionOnCanvas(canvas: CanvasInterface, e: PointerEvent): PositionType {
        return Position(
            ((e.offsetX || e.clientX - canvas.getBoundingClientRect().left) * canvas.width) / canvas.clientWidth, // (Google Chrome) || (Firefox)
            ((e.offsetY || e.clientY - canvas.getBoundingClientRect().top) * canvas.height) / canvas.clientHeight // (Google Chrome) || (Firefox)
        );
    }

    public loop(frameRate = 60) {
        this.stop();
        this.canvas!.addEventListener("pointerdown", this.pointerDownHandler.bind(this));
        this.canvas!.addEventListener("pointerup", this.pointerUpHandler.bind(this));
        this.canvas!.addEventListener("pointermove", this.pointerMoveHandler.bind(this));
        this.canvas!.addEventListener("wheel", this.wheelHandler.bind(this));
        this.canvas!.addEventListener("keydown", this.keydownHandler.bind(this));
        this.canvas!.addEventListener("keyup", this.keyupHandler.bind(this));
        this.active = true;
        this.frameRate = frameRate;
        this.nextRenderTime = performance.now();
        this.currentFrame = 0;
        requestAnimationFrame(this.drawLoop.bind(this));
    }

    protected drawLoop() {
        const start = performance.now();
        if (this.nextRenderTime && start < this.nextRenderTime) {
            requestAnimationFrame(this.drawLoop.bind(this));
            return;
        }
        this.nextRenderTime = start + 800 / this.frameRate;
        if (!this.active) {
            return;
        }
        this.draw(this.ctx);
        this.lastRenderMs = performance.now() - start;
        requestAnimationFrame(this.drawLoop.bind(this));
        return;
    }

    public draw(ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        ctx ??= this.ctx;
        this.eventListeners.beforeDraw.forEach(callback => callback.call(this, this.currentFrame));
        this.root.setPointerEvents(this.drawEvents);
        ctx!.fillStyle = ColorToString(this.bgColor);
        ctx!.fillRect(0, 0, this.width ?? 0, this.height ?? 0);
        this.drawEvents.stage = this;
        try {
            this.root.draw(ctx!);
        } catch (e: unknown) {
            this.stop();
            this.onError(e as Error);
        }
        this.drawEvents = { stage: this };
        this.currentFrame++;
    }

    public stop() {
        this.canvas!.removeEventListener("pointerdown", this.pointerDownHandler.bind(this));
        this.canvas!.removeEventListener("pointerup", this.pointerUpHandler.bind(this));
        this.canvas!.removeEventListener("pointermove", this.pointerMoveHandler.bind(this));
        this.canvas!.removeEventListener("wheel", this.wheelHandler.bind(this));
        this.canvas!.removeEventListener("keydown", this.keydownHandler.bind(this));
        this.canvas!.removeEventListener("keyup", this.keyupHandler.bind(this));
        this.active = false;
    }

    public get width() {
        return this.canvas?.width;
    }

    public get height() {
        return this.canvas?.height;
    }

    public get scaleX() {
        return (this.width! ?? 0) / this.canvas!.clientWidth;
    }

    public get scaleY() {
        return (this.height! ?? 0) / this.canvas!.clientHeight;
    }
}
