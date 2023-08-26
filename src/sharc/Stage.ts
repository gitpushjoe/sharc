import { NullSprite } from './Sprites'
import { ColorToString, Colors, Position } from './Utils';
import { ColorType, PositionType } from './types/Common';
import { PointerEventsCollection } from './types/Stage';

/**
 * A wrapper for the canvas element. 
 * 
 * Handles pointer events, scrollWheel events, and the main render loop.
 */
export class Stage {
    /**
     * The root sprite of the stage.
     * 
     * All sprites drawn to the canvas must descend from this sprite.
     */
    public root: NullSprite;
    private ctx: CanvasRenderingContext2D = this.canvas?.getContext('2d')!;
    private active: boolean = false;
    private nextRenderTime?: number = undefined;
    private frameRate: number = 60;
    /**
     * The time it took to render the last frame.
     */
    public lastRenderMs: number = 0;
    public currentFrame: number = 0;
    private pointerEvents = {
        down: [] as PointerEvent[],
        up: [] as PointerEvent[],
        move: [] as PointerEvent[],
    } as PointerEventsCollection;
    /**
     * Callback that is run on the Stage when a pointerDown event is fired.
     * 
     * @param stage This stage.
     * @param event The pointerDown event that was fired.
     */
    public onPointerDown: (stage: Stage, event: PointerEvent, position: PositionType) => void = () => {};
    /**
     * Callback that is run on the Stage when a pointerDown event is fired.
     * 
     * @param stage This stage.
     * @param event The pointerUp event that was fired.
     */
    public onPointerUp: (stage: Stage, event: PointerEvent, position: PositionType) => void = () => {};
    /**
     * Callback that is run on the Stage when a pointerMove event is fired.
     * 
     * @param stage This stage.
     * @param event The pointerMove event that was fired.
     */
    public onPointerMove: (stage: Stage, event: PointerEvent, position: PositionType) => void = () => {};
    /**
     * Callback that is run on the Stage when a scrollWheel event is fired.
     * 
     * @param stage This stage.
     * @param event The WheelEvent that was fired.
     */
    public onScroll: (stage: Stage, event: WheelEvent) => void = () => {};
    /**
     * Callback that is run on the Stage before the root sprite is drawn.
     * 
     * @param stage This stage.
     */
    public beforeDraw: (stage: Stage) => void = () => {};
    /**
     * Callback that is run on the Stage after the root sprite is drawn.
     * 
     * @param stage This stage.
     */
    public afterDraw: (stage: Stage) => void = () => {};

    constructor(
        private canvas?: HTMLCanvasElement,
        private readonly rootStyle: 'classic'|'centered' = 'centered',
        public bgColor: ColorType = Colors.White,
    ) {
        if (!canvas) {
            throw new Error('No canvas element provided');
        }
        this.root = rootStyle === 'classic' ? 
            new NullSprite({}) : 
            new NullSprite({ position: Position(this.width! /2, this.height! / 2), scale: Position(1, -1) });
        canvas.oncontextmenu = () => false;
        canvas.style.touchAction = 'none';
    }
    
    private pointerDownHandler(e: PointerEvent) {
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX - (this.rootStyle === 'centered' ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY - (this.rootStyle === 'centered' ? this.height! / 2: 0)) * (this.rootStyle === 'centered' ? -1 : 1),
        );
        this.onPointerDown(this, e, position as PositionType);
        this.pointerEvents.down.push(e);
        this.pointerEvents.down = this.pointerEvents.down.slice(0, 8);
    }

    private pointerUpHandler(e: PointerEvent) {
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX - (this.rootStyle === 'centered' ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY - (this.rootStyle === 'centered' ? this.height! / 2: 0)) * (this.rootStyle === 'centered' ? -1 : 1),
        );
        this.onPointerUp(this, e, position as PositionType);
        this.pointerEvents.down = this.pointerEvents.down.filter((event) => event.pointerId !== e.pointerId);
        this.pointerEvents.up.push(e);
        this.pointerEvents.up = this.pointerEvents.up.slice(0, 8);
    }

    private pointerMoveHandler(e: PointerEvent) {
        e.preventDefault();
        const position = Position(
            (e.offsetX || e.pageX - this.canvas!.offsetLeft) * this.scaleX - (this.rootStyle === 'centered' ? this.width! / 2 : 0),
            ((e.offsetY || e.pageY - this.canvas!.offsetTop) * this.scaleY - (this.rootStyle === 'centered' ? this.height! / 2: 0)) * (this.rootStyle === 'centered' ? -1 : 1),
        );
        this.onPointerMove(this, e, position as PositionType);
        this.pointerEvents.move = this.pointerEvents.move.filter((event) => event.pointerId !== e.pointerId);
        this.pointerEvents.move.push(e);
        this.pointerEvents.move = this.pointerEvents.move.slice(0, 32);
    }

    private wheelHandler(e: WheelEvent) {
        this.onScroll(this, e);
        e.preventDefault();
    }

    /**
     * Begins the main render loop.
     * 
     * @param frameRate The number of frames per second to render.
     */
    public loop(frameRate: number = 60) {
        this.stop();
        this.canvas!.addEventListener('pointerdown', this.pointerDownHandler.bind(this));
        this.canvas!.addEventListener('pointerup', this.pointerUpHandler.bind(this));
        this.canvas!.addEventListener('pointermove', this.pointerMoveHandler.bind(this));
        this.canvas!.addEventListener('wheel', this.wheelHandler.bind(this));
        this.active = true;
        this.frameRate = frameRate;
        this.nextRenderTime = performance.now();
        this.currentFrame = 0;
        requestAnimationFrame(this.draw.bind(this));
    }

    /**
     * Draws the root sprite to the canvas.
     * 
     * Automatically called by the loop method.
     */
    private draw() {
        const start = performance.now();
        if (this.nextRenderTime && start < this.nextRenderTime) {
            requestAnimationFrame(this.draw.bind(this));
            return;
        }
        if (!this.active) {
            return;
        }
        this.root.setPointerEvents(this.pointerEvents);
        this.ctx = this.canvas?.getContext('2d')!;
        this.ctx.fillStyle = ColorToString(this.bgColor);
        this.ctx.fillRect(0, 0, this.width ?? 0, this.height ?? 0);
        this.beforeDraw(this);
        try {
            this.root.draw(this.ctx);
        } catch (e) {
            this.stop();
            console.error(e);
        }
        this.afterDraw(this);
        this.pointerEvents.up = [];
        this.pointerEvents.move = [];
        this.pointerEvents.down = [];
        this.currentFrame++;
        this.lastRenderMs = performance.now() - start;
        this.nextRenderTime = start + (900 / this.frameRate); // using 900 instead of 1000 better accounts for skipped requestAnimationFrames
        requestAnimationFrame(this.draw.bind(this));
        return;
    }

    /**
     * Cancel the main render loop and remove all event listeners.
     */
    public stop() {
        this.canvas!.removeEventListener('pointerdown', this.pointerDownHandler.bind(this));
        this.canvas!.removeEventListener('pointerup', this.pointerUpHandler.bind(this));
        this.canvas!.removeEventListener('pointermove', this.pointerMoveHandler.bind(this));
        this.canvas!.removeEventListener('wheel', this.wheelHandler.bind(this));
        this.active = false;
    }

    /**
     * Width of the canvas element.
     */
    public get width() {
        return this.canvas?.width;
    }

    /**
     * Height of the canvas element.
     */
    public get height() {
        return this.canvas?.height;
    }

    /**
     * The ratio of the canvas width to the client width.
     */
    public get scaleX() {
        return (this.width! ?? 0) / this.canvas!.clientWidth;
    }

    /**
     * The ratio of the canvas height to the client height. 
     */
    public get scaleY() {
        return (this.height! ?? 0) / this.canvas!.clientHeight;
    }
}