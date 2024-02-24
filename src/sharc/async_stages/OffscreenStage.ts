import { AsyncStageEventListeners, PositionedPointerEvent, PointerEventCallback } from "../types/Events";
import { StageStateMessage, AsyncMessage } from "../types/Stage";
import { Stage } from "../Stage";
import { Colors } from "../Utils";
import { NullSprite } from "../Sprites";

export class OffscreenStage<DetailsType = any, MessageType = any> extends Stage<DetailsType> {
    private workerReady = false;
    private lastEmittedStageState?: Omit<StageStateMessage, "type">;
    public eventListeners: AsyncStageEventListeners<this, AsyncMessage<MessageType>> = {
        beforeDraw: [],
        click: [],
        release: [],
        move: [],
        scroll: [],
        message: []
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
        this.eventListeners.message.forEach(callback => callback.call(this, e));
        switch (e.type) {
            case "render":
                if (this.active) {
                    this.currentFrame = e.currentFrame;
                    this.eventListeners.beforeDraw.forEach(callback => callback.call(this, this.currentFrame));
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
                this.onError(new Error(e.error));
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
        return {
            events: {
                down: makePointerEventCloneable(this.drawEvents.down),
                up: makePointerEventCloneable(this.drawEvents.up),
                move: makePointerEventCloneable(this.drawEvents.move)
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
    >(event: E, callback: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]) {
        this.eventListeners[event as "click"].push(callback as unknown as PointerEventCallback<this>);
    }

    public on<
        E extends keyof AsyncStageEventListeners<this, AsyncMessage<MessageType>> = keyof AsyncStageEventListeners<
            this,
            AsyncMessage<MessageType>
        >
    >(event: E, callback: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]) {
        this.addEventListener(event, callback);
    }

    public removeEventListener<
        E extends keyof AsyncStageEventListeners<this, AsyncMessage<MessageType>> = keyof AsyncStageEventListeners<
            this,
            AsyncMessage<MessageType>
        >
    >(event: E, callback: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]) {
        this.eventListeners[event as "click"] = this.eventListeners[event as "click"].filter(
            cb => cb !== (callback as unknown as PointerEventCallback<this>)
        );
    }

    public draw() {
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

    public loop(frameRate = 60) {
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
    }

    public stop() {
        if (this.workerReady) {
            void this.postMessage({
                type: "stopLoop",
                source: "offscreen"
            });
        }
    }
}