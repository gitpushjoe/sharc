import { NullSprite } from "./Sprites";
import { ColorToString, Colors, Position } from "./Utils";
import { ColorType, PositionType } from "./types/Common";
import { PointerEventCallback, StageEventListeners } from "./types/Events";
import { DEFAULT_PROPERTIES } from "./types/Sprites";

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
    public root: NullSprite;
    private ctx: CanvasRenderingContext2D;
    private active = false;
    private nextRenderTime?: number = undefined;
    private frameRate = 60;
    public lastRenderMs = 0;
    public currentFrame = 0;
    private drawEvents = {
        down: [] as PointerEvent[],
        up: [] as PointerEvent[],
        move: [] as PointerEvent[],
        stage: undefined as Stage | undefined
    };

    public events = {
        beforeDraw: [] as StageEventListeners["beforeDraw"],
        click: [] as StageEventListeners["click"],
        release: [] as StageEventListeners["release"],
        move: [] as StageEventListeners["move"],
        scroll: [] as StageEventListeners["scroll"]
    } as StageEventListeners;

    constructor(
        private canvas?: HTMLCanvasElement,
        public readonly rootStyle: "classic" | "centered" = "centered",
        public bgColor: ColorType = Colors.White
    ) {
        if (!canvas) {
            throw new Error("No canvas element provided");
        }
        this.root =
            rootStyle === "classic"
                ? new StageRoot<RootDetailsType>(this, {})
                : new StageRoot<RootDetailsType>(this, {
                      position: Position(this.width! / 2, this.height! / 2),
                      scale: Position(1, -1)
                  });
        canvas.oncontextmenu = () => false;
        canvas.style.touchAction = "none";
        this.ctx = canvas.getContext("2d")!;
    }

    public addEventListener<E extends keyof StageEventListeners = keyof StageEventListeners>(
        event: E,
        callback: StageEventListeners[E][0]
    ) {
        this.events[event as "click"].push(callback as unknown as PointerEventCallback<Stage>);
    }

    public on<E extends keyof StageEventListeners = keyof StageEventListeners>(
        event: E,
        callback: StageEventListeners[E][0]
    ) {
        this.addEventListener(event, callback);
    }

    public removeEventListener<E extends keyof StageEventListeners = keyof StageEventListeners>(
        event: E,
        callback: StageEventListeners[E][0]
    ) {
        this.events[event as "click"] = this.events[event as "click"].filter(
            cb => cb !== (callback as unknown as PointerEventCallback<Stage>)
        );
    }

    private pointerDownHandler(e: PointerEvent) {
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX -
                (this.rootStyle === "centered" ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY -
                (this.rootStyle === "centered" ? this.height! / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        );
        this.events.click.forEach(callback => callback.call(this, e, position));
        this.drawEvents.down.push(e);
        this.drawEvents.down = this.drawEvents.down.slice(0, 8);
    }

    private pointerUpHandler(e: PointerEvent) {
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX -
                (this.rootStyle === "centered" ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY -
                (this.rootStyle === "centered" ? this.height! / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        );
        this.events.release.forEach(callback => callback.call(this, e, position));
        this.drawEvents.down = this.drawEvents.down.filter((event: PointerEvent) => event.pointerId !== e.pointerId);
        this.drawEvents.up.push(e);
        this.drawEvents.up = this.drawEvents.up.slice(0, 8);
    }

    private pointerMoveHandler(e: PointerEvent) {
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX -
                (this.rootStyle === "centered" ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY -
                (this.rootStyle === "centered" ? this.height! / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        );
        this.events.move.forEach(callback => callback.call(this, e, position));
        this.drawEvents.move = this.drawEvents.move.filter((event: PointerEvent) => event.pointerId !== e.pointerId);
        this.drawEvents.move.push(e);
        this.drawEvents.move = this.drawEvents.move.slice(0, 32);
    }

    private wheelHandler(e: WheelEvent) {
        this.events.scroll.forEach(callback => callback.call(this, e));
        e.preventDefault();
    }

    public loop(frameRate = 60) {
        this.stop();
        this.canvas!.addEventListener("pointerdown", this.pointerDownHandler.bind(this));
        this.canvas!.addEventListener("pointerup", this.pointerUpHandler.bind(this));
        this.canvas!.addEventListener("pointermove", this.pointerMoveHandler.bind(this));
        this.canvas!.addEventListener("wheel", this.wheelHandler.bind(this));
        this.active = true;
        this.frameRate = frameRate;
        this.nextRenderTime = performance.now();
        this.currentFrame = 0;
        requestAnimationFrame(this.drawLoop.bind(this));
    }

    private drawLoop() {
        const start = performance.now();
        if (this.nextRenderTime && start < this.nextRenderTime) {
            requestAnimationFrame(this.drawLoop.bind(this));
            return;
        }
        if (!this.active) {
            return;
        }
        this.draw(this.ctx);
        this.lastRenderMs = performance.now() - start;
        this.nextRenderTime = start + 900 / this.frameRate; // using 900 instead of 1000 better accounts for skipped requestAnimationFrames
        requestAnimationFrame(this.drawLoop.bind(this));
        return;
    }

    public draw(ctx?: CanvasRenderingContext2D) {
        ctx ??= this.ctx;
        this.events.beforeDraw.forEach(callback => callback.call(this, this, this.currentFrame));
        this.root.setPointerEvents(this.drawEvents);
        ctx = this.canvas!.getContext("2d")!;
        ctx.fillStyle = ColorToString(this.bgColor);
        ctx.fillRect(0, 0, this.width ?? 0, this.height ?? 0);
        this.drawEvents.stage = this;
        try {
            this.root.draw(ctx);
        } catch (e) {
            this.stop();
            console.error(e);
        }
        this.drawEvents.up = [];
        this.drawEvents.move = [];
        this.drawEvents.down = [];
        this.currentFrame++;
    }

    public stop() {
        this.canvas!.removeEventListener("pointerdown", this.pointerDownHandler.bind(this));
        this.canvas!.removeEventListener("pointerup", this.pointerUpHandler.bind(this));
        this.canvas!.removeEventListener("pointermove", this.pointerMoveHandler.bind(this));
        this.canvas!.removeEventListener("wheel", this.wheelHandler.bind(this));
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
