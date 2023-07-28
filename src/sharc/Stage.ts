import { NullShape } from './Shapes'
import { Sprite } from './BaseShapes';
import { ColorToString, Colors, Position } from './Utils';
import { ColorType } from './types/Common';
import { PointerEventsCollection } from './types/MainStage';

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
    public root: Sprite;
    private ctx: CanvasRenderingContext2D = this.canvas?.getContext('2d')!;
    private active: boolean = false;
    private nextRenderTime?: number = undefined;
    private frameRate: number = 60;
    /**
     * The time it took to render the last frame.
     */
    public lastRenderMs: number = 0;
    private frameIndex: number = 0;
    private pointerEvents = {
        down: [] as PointerEvent[],
        up: [] as PointerEvent[],
        move: [] as PointerEvent[],
    } as PointerEventsCollection;
    /**
     * Callback that is run on the Stage when a pointerDown event is fired.
     * 
     * @param e The pointerDown event that was fired.
     * @param stage This stage.
     */
    public onPointerDown: (stage: Stage, event: PointerEvent) => void = () => {};
    /**
     * Callback that is run on the Stage when a pointerDown event is fired.
     * 
     * @param e The pointerUp event that was fired.
     * @param stage This stage.
     */
    public onPointerUp: (stage: Stage, event: PointerEvent) => void = () => {};
    /**
     * Callback that is run on the Stage when a pointerMove event is fired.
     * 
     * @param e The pointerMove event that was fired.
     * @param stage This stage.
     */
    public onPointerMove: (stage: Stage, event: PointerEvent) => void = () => {};
    /**
     * Callback that is run on the Stage when a scrollWheel event is fired.
     * 
     * @param e The WheelEvent that was fired.
     * @param stage This stage.
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
        rootStyle: 'classic'|'centered' = 'centered',
        public bgColor: ColorType = Colors.White,
    ) {
        if (!canvas) {
            throw new Error('No canvas element provided');
        }
        this.root = rootStyle === 'classic' ? 
            new NullShape({}) : 
            new NullShape({ position: Position(this.width! /2, this.height! / 2), scale: Position(1, -1) });
    }
    
    private pointerDownHandler(e: PointerEvent) {
        this.onPointerDown(this, e);
        this.pointerEvents.down.push(e);
        this.pointerEvents.down = this.pointerEvents.down.slice(0, 8);
    }

    private pointerUpHandler(e: PointerEvent) {
        this.onPointerUp(this, e);
        this.pointerEvents.down = this.pointerEvents.down.filter((event) => event.pointerId !== e.pointerId);
        this.pointerEvents.up.push(e);
        this.pointerEvents.up = this.pointerEvents.up.slice(0, 8);
    }

    private pointerMoveHandler(e: PointerEvent) {
        this.onPointerMove(this, e);
        this.pointerEvents.move = this.pointerEvents.move.filter((event) => event.pointerId !== e.pointerId);
        this.pointerEvents.move.push(e);
        this.pointerEvents.move = this.pointerEvents.move.slice(0, 32);
    }

    private wheelHandler(e: WheelEvent) {
        this.onScroll(this, e);
    }

    public get currentFrame() {
        return this.frameIndex;
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
        requestAnimationFrame(this.draw.bind(this));
    }

    /**
     * Draws the root sprite to the canvas.
     * 
     * Automatically called by the loop method.
     */
    public draw() {
        const start = performance.now();
        if (this.nextRenderTime && start < this.nextRenderTime) {
            requestAnimationFrame(this.draw.bind(this));
            return;
        }
        if (!this.active) {
            return;
        }
        this.root.r_setPointerEvents(this.pointerEvents);
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
        this.frameIndex++;
        this.lastRenderMs = performance.now() - start;
        this.nextRenderTime = start + 1000 / this.frameRate - this.lastRenderMs;
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

}