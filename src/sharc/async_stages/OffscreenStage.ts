import { AsyncStageEventListeners, PositionedPointerEvent, PointerEventCallback } from "../types/Events";
import { StageStateMessage, AsyncMessage } from "../types/Stage";
import { Stage } from "../Stage";
import { Colors, callAndPrune } from "../Utils";
import { NullSprite } from "../Sprites";

export class OffscreenStage<DetailsType = any, MessageType = any> extends Stage<DetailsType> {
    private workerReady = false;
    private lastEmittedStageState?: Omit<StageStateMessage, "type">;
    protected eventListeners: AsyncStageEventListeners<this, AsyncMessage<MessageType>> = {
        beforeDraw: [],
        click: [],
        release: [],
        move: [],
        scroll: [],
        message: [],
        keyup: [],
        keydown: []
    };
    protected onError = (e?: Error, stack?: string) => {
        stack = stack?.slice(0, stack?.indexOf("FrameRequestCallback*"));
        console.error(`WorkerStage: ${e?.message ?? "Error"}\n${stack ?? ""}`);
    };

    constructor(
        canvas: HTMLCanvasElement,
        private worker: Worker,
        rootStyle: "classic" | "centered" = "centered"
    ) {
        if (!canvas) {
            throw new Error("No canvas element provided");
        }
        super(canvas, rootStyle, Colors.None, undefined, true);
        void this.postMessage({
            type: "init",
            width: canvas.width,
            height: canvas.height,
            rootStyle,
            bgColor: Colors.None
        });
        worker.onmessage = (e: MessageEvent<AsyncMessage<MessageType>>) => this.onmessage(e.data);
        worker.onmessageerror = (e: MessageEvent<AsyncMessage<MessageType>>) => console.error(e);
    }

    private onmessage(e: AsyncMessage<MessageType>) {
        this.workerReady ||= e.type === "ready";
        callAndPrune(this.eventListeners, "message", [this, e]);
        switch (e.type) {
            case "render":
                if (this.active) {
                    this.currentFrame = e.currentFrame;
                    callAndPrune(this.eventListeners, "beforeDraw", [this, e.currentFrame, this]);
                    (this.canvas as HTMLCanvasElement)!.getContext("bitmaprenderer")!.transferFromImageBitmap(e.img);
                }
                break;
            case "ready":
                this.workerReady = true;
                break;
            case "stopLoop":
                this.workerReady = false;
                this.stop();
                this.workerReady = true;
                break;
            case "error":
                this.onError(new Error(e.error), e.stack);
                break;
        }
    }

    public get root(): NullSprite<DetailsType> {
        throw new Error("Cannot access root of offscreen stage");
    }

    protected drawLoop() {
        // sends mouse events and canvas size to worker 3 times per frame
        const start = performance.now();
        if (this.nextRenderTime && start < this.nextRenderTime) {
            setTimeout(this.drawLoop.bind(this), 10);
            return;
        }
        if (!this.active) {
            return;
        }
        this.draw();
        this.lastRenderMs = performance.now() - start;
        this.nextRenderTime = start + 900 / (this.frameRate * 3);
        setTimeout(this.drawLoop.bind(this), Math.min(100, this.nextRenderTime - start));
        return;
    }

    private getStageState(): Omit<StageStateMessage, "type"> {
        const makePointerEventCloneable = (e?: PositionedPointerEvent): PositionedPointerEvent | undefined => {
            return e === undefined
                ? undefined
                : {
                      event: {
                          altKey: e.event.altKey,
                          button: e.event.button,
                          buttons: e.event.buttons,
                          clientX: e.event.clientX,
                          clientY: e.event.clientY,
                          pointerId: e.event.pointerId,
                          pointerType: e.event.pointerType,
                          shiftKey: e.event.shiftKey,
                          type: e.event.type,
                          screenX: e.event.screenX,
                          screenY: e.event.screenY,
                          x: e.event.x,
                          y: e.event.y
                      } as unknown as PointerEvent,
                      translatedPoint: { ...e.translatedPoint }
                  };
        };
        const makeKeyboardEventCloneable = (e?: KeyboardEvent): KeyboardEvent | undefined => {
            return e === undefined
                ? undefined
                : ({
                      key: e.key,
                      code: e.code,
                      altKey: e.altKey,
                      ctrlKey: e.ctrlKey,
                      shiftKey: e.shiftKey,
                      metaKey: e.metaKey,
                      repeat: e.repeat,
                      isComposing: e.isComposing,
                      location: e.location
                  } as unknown as KeyboardEvent);
        };
        const makeWheelEventCloneable = (e?: WheelEvent): WheelEvent | undefined => {
            return e === undefined
                ? undefined
                : ({
                      deltaX: e.deltaX,
                      deltaY: e.deltaY,
                      deltaZ: e.deltaZ,
                      deltaMode: e.deltaMode,
                      altKey: e.altKey,
                      ctrlKey: e.ctrlKey,
                      shiftKey: e.shiftKey,
                      metaKey: e.metaKey
                  } as unknown as WheelEvent);
        };
        return {
            events: {
                down: makePointerEventCloneable(this.drawEvents.down),
                up: makePointerEventCloneable(this.drawEvents.up),
                move: makePointerEventCloneable(this.drawEvents.move),
                keydown: makeKeyboardEventCloneable(this.drawEvents.keydown),
                keyup: makeKeyboardEventCloneable(this.drawEvents.keyup),
                scroll: makeWheelEventCloneable(this.drawEvents.scroll)
            },
            canvasProperties: {
                width: this.canvas!.width,
                height: this.canvas!.height,
                offsetTop: this.canvas!.offsetTop,
                offsetLeft: this.canvas!.offsetLeft,
                clientWidth: this.canvas!.clientWidth,
                clientHeight: this.canvas!.clientHeight,
                boundingClientRect: this.canvas!.getBoundingClientRect()
            }
        };
    }

    public addEventListener<
        E extends keyof AsyncStageEventListeners<this, AsyncMessage<MessageType>> = keyof AsyncStageEventListeners<
            this,
            AsyncMessage<MessageType>
        >
    >(event: E, callback: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]): this {
        this.eventListeners[event as "click"].push(callback as unknown as PointerEventCallback<this, this>);
        return this;
    }

    public on<
        E extends keyof AsyncStageEventListeners<this, AsyncMessage<MessageType>> = keyof AsyncStageEventListeners<
            this,
            AsyncMessage<MessageType>
        >
    >(event: E, callback: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]): this {
        this.addEventListener(event, callback);
        return this;
    }

    public removeEventListener<
        E extends keyof AsyncStageEventListeners<this, AsyncMessage<MessageType>> = keyof AsyncStageEventListeners<
            this,
            AsyncMessage<MessageType>
        >
    >(event: E, callback?: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]): this {
        if (!callback) {
            this.eventListeners[event as "click"] = [];
            return this;
        }
        this.eventListeners[event as "click"] = this.eventListeners[event as "click"].filter(
            cb => cb !== (callback as unknown as PointerEventCallback<this, this>)
        );
        return this;
    }

    public includeEventListener<
        E extends keyof AsyncStageEventListeners<this, AsyncMessage<MessageType>> = keyof AsyncStageEventListeners<
            this,
            AsyncMessage<MessageType>
        >
    >(event: E, callback: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]): this {
        this.removeEventListener(event, callback);
        this.addEventListener(event, callback);
        return this;
    }

    public draw(): boolean {
        this.drawEvents.stage = undefined;
        const stageState: Omit<StageStateMessage, "type"> = this.getStageState();
        if (JSON.stringify(stageState) != JSON.stringify(this.lastEmittedStageState)) {
            this.lastEmittedStageState = JSON.parse(JSON.stringify(stageState)) as Omit<StageStateMessage, "type">;
            void this.postMessage({
                type: "stageState",
                ...stageState
            });
        }
        this.drawEvents = {};
        return true;
    }

    public async postCustomMessage(message: MessageType): Promise<AsyncMessage<MessageType>> {
        return this.postMessage({
            type: "custom",
            message
        });
    }

    private async postMessage(message: AsyncMessage<MessageType>): Promise<AsyncMessage<MessageType>> {
        if (!this.workerReady && !(message.type == "init")) {
            console.warn("Worker not ready");
        }
        const channel = new MessageChannel();
        this.worker.postMessage(message, [channel.port2]);
        return new Promise<AsyncMessage<MessageType>>((resolve, reject) => {
            channel.port1.onmessage = (e: MessageEvent<AsyncMessage>) => {
                resolve(e.data);
                channel.port1.close();
                channel.port2.close();
            };
            channel.port1.onmessageerror = reject;
            channel.port2.onmessageerror = reject;
        });
    }

    public loop(frameRate = 60): this {
        if (!this.workerReady) {
            console.warn("Worker not ready");
        }
        this.workerReady = false; // avoid stopping worker stage
        super.loop(frameRate);
        this.workerReady = true;
        void this.postMessage({
            type: "beginLoop",
            frameRate,
            stageState: this.getStageState()
        });
        return this;
    }

    public stop(): this {
        if (this.workerReady) {
            void this.postMessage({
                type: "stopLoop",
                source: "offscreen"
            });
        }
        return this;
    }
}
