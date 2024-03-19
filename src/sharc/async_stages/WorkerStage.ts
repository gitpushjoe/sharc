import type { ColorType } from "../types/Common";
import { AsyncStageEventListeners, EventCollection, PointerEventCallback } from "../types/Events";
import { AsyncMessage, CanvasInterface, StageStateMessage } from "../types/Stage";
import { Stage } from "../Stage";
import { Colors, Position } from "../Utils";

const DEFAULT_CANVAS_INTERFACE: CanvasInterface = {
    width: 0,
    height: 0,
    oncontextmenu: () => false,
    style: { touchAction: "none" },
    getContext: () => null,
    offsetLeft: 0,
    offsetTop: 0,
    addEventListener: () => {
        return;
    },
    clientWidth: 0,
    clientHeight: 0,
    getBoundingClientRect: () => {
        return { top: 0, left: 0 };
    },
    removeEventListener: () => {
        return;
    },
    transferToImageBitmap: () => undefined as unknown as ImageBitmap
};

export class WorkerStage<DetailsType = any, MessageType = any> extends Stage<DetailsType> {
    private offscreenCanvas: OffscreenCanvas;
    public eventListeners: AsyncStageEventListeners<this, AsyncMessage<MessageType>> = {
        beforeDraw: [],
        click: [],
        release: [],
        move: [],
        scroll: [],
        message: [],
        keyup: [],
        keydown: []
    };

    protected onError = function (this: WorkerStage, e?: Error) {
        this.postMessage({
            type: "error",
            error: e?.message ?? "Error",
            stack: e?.stack ?? "No stack"
        });
    };

    private informOffscreenOfStop = true;

    private nextDrawEvents?: EventCollection<DetailsType>;

    constructor(
        private readonly _postMessage: (message: AsyncMessage<MessageType>) => void,
        public readonly rootStyle: "classic" | "centered" = "centered",
        public bgColor: ColorType = Colors.White
    ) {
        const offscreen = new OffscreenCanvas(1, 1);
        super(DEFAULT_CANVAS_INTERFACE, rootStyle, bgColor, offscreen.getContext("2d")!);
        this.offscreenCanvas = offscreen;
    }

    public addEventListener<
        E extends keyof AsyncStageEventListeners<this, AsyncMessage<MessageType>> = keyof AsyncStageEventListeners<
            this,
            AsyncMessage<MessageType>
        >
    >(event: E, callback: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]): this {
        this.eventListeners[event as "click"].push(callback as unknown as PointerEventCallback<this>);
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
    >(event: E, callback: AsyncStageEventListeners<this, AsyncMessage<MessageType>>[E][0]): this {
        if (!callback) {
            this.eventListeners[event as "click"] = [];
            return this;
        }
        this.eventListeners[event as "click"] = this.eventListeners[event as "click"].filter(
            cb => cb !== (callback as unknown as PointerEventCallback<this>)
        );
        return this;
    }

    private setStageState(e: StageStateMessage) {
        this.nextDrawEvents ??= {};
        this.nextDrawEvents.up ??= e.events.up;
        this.nextDrawEvents.down ??= e.events.down;
        this.nextDrawEvents.move ??= e.events.move;
        this.nextDrawEvents.keydown ??= e.events.keydown;
        this.nextDrawEvents.keyup ??= e.events.keyup;
        this.nextDrawEvents.scroll ??= e.events.scroll;
        this.canvas!.width = e.canvasProperties.width;
        this.canvas!.height = e.canvasProperties.height;
        this.canvas!.offsetLeft = e.canvasProperties.offsetLeft;
        this.canvas!.offsetTop = e.canvasProperties.offsetTop;
        this.canvas!.clientWidth = e.canvasProperties.clientWidth;
        this.canvas!.clientHeight = e.canvasProperties.clientHeight;
        this.canvas!.getBoundingClientRect = () => e.canvasProperties.boundingClientRect;
    }

    public readonly onmessage = (event: MessageEvent<AsyncMessage<MessageType>>): void => {
        this.eventListeners.message.forEach(callback => callback(this, event.data));
        const e = event.data;
        switch (e.type) {
            case "init":
                this.canvas!.height = e.height;
                this.canvas!.offsetLeft = 0;
                this.canvas!.offsetTop = 0;
                this.offscreenCanvas.width = e.width;
                this.offscreenCanvas.height = e.height;
                this._root.position =
                    this.rootStyle === "centered" ? Position(e.width / 2, e.height / 2) : Position(0, 0);
                this.postMessage({ type: "ready" });
                this.loop();
                break;
            case "beginLoop":
                this.setStageState({ ...e.stageState, type: "stageState" });
                this.loop(e.frameRate * 1.25);
                break;
            case "stageState":
                this.setStageState(e);
                break;
            case "stopLoop":
                this.stop();
                break;
        }
    };

    public draw(ctx?: OffscreenCanvasRenderingContext2D): boolean {
        this.drawEvents = this.nextDrawEvents
            ? (JSON.parse(JSON.stringify(this.nextDrawEvents)) as EventCollection<DetailsType>)
            : this.drawEvents;
        this.eventListeners.beforeDraw.forEach(callback => callback(this, this.currentFrame));
        const { down, up, move, keydown, keyup, scroll } = this.drawEvents;
        if (down) {
            this.eventListeners.click.forEach(callback =>
                callback(this, {
                    x: down.translatedPoint.x - (this.rootStyle === "centered" ? this.canvas!.width / 2 : 0),
                    y:
                        (down.translatedPoint.y - (this.rootStyle === "centered" ? this.canvas!.height / 2 : 0)) *
                        (this.rootStyle === "centered" ? -1 : 1)
                }, down.event)
            );
        }
        if (up) {
            this.eventListeners.release.forEach(callback =>
                callback(this, {
                    x: up.translatedPoint.x - (this.rootStyle === "centered" ? this.canvas!.width / 2 : 0),
                    y:
                        (up.translatedPoint.y - (this.rootStyle === "centered" ? this.canvas!.height / 2 : 0)) *
                        (this.rootStyle === "centered" ? -1 : 1)
                }, up.event)
            );
        }
        if (move) {
            this.eventListeners.move.forEach(callback =>
                callback(this, {
                    x: move.translatedPoint.x - (this.rootStyle === "centered" ? this.canvas!.width / 2 : 0),
                    y:
                        (move.translatedPoint.y - (this.rootStyle === "centered" ? this.canvas!.height / 2 : 0)) *
                        (this.rootStyle === "centered" ? -1 : 1)
                }, move.event)
            );
        }
        if (keydown) {
            this.eventListeners.keydown.forEach(callback => callback(this, keydown));
        }
        if (keyup) {
            this.eventListeners.keyup.forEach(callback => callback(this, keyup));
        }
        if (scroll) {
            this.eventListeners.scroll.forEach(callback => callback(this, scroll));
        }
        this.eventListeners.beforeDraw.forEach(callback => callback(this, this.currentFrame));
        try {
            super.draw(ctx);
        } catch (e: unknown) {
            this.onError(e as Error);
            return false;
        }
        this.postMessage({
            type: "render",
            img: this.offscreenCanvas.transferToImageBitmap(),
            lastRenderMs: this.lastRenderMs,
            currentFrame: this.currentFrame
        });
        this.nextDrawEvents = undefined;
        return true;
    }

    public postCustomMessage(message: MessageType, port?: MessagePort): void {
        this.postMessage(
            {
                type: "custom",
                message
            },
            port
        );
    }

    private postMessage(message: AsyncMessage<MessageType>, port?: MessagePort) {
        if (!port) {
            this._postMessage(message);
            return;
        }
        port.postMessage(message);
    }

    public loop(frameRate = 60): this {
        this.informOffscreenOfStop = false;
        super.loop(frameRate);
        this.informOffscreenOfStop = true;
        return this;
    }

    public stop(): this {
        super.stop();
        if (this.informOffscreenOfStop) {
            this.postMessage({
                type: "stopLoop",
                source: "worker"
            });
        }
        return this;
    }
}
