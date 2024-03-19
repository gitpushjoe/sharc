import type { ColorType } from "../types/Common";
import { AsyncStageEventListeners, EventCollection, PointerEventCallback, } from "../types/Events";
import { AsyncMessage, CanvasInterface, StageStateMessage } from "../types/Stage";
import { Stage } from "../Stage";
import { Colors, Position, callAndPrune } from "../Utils";

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

    private sendErrorString(e: string) {
        const error = new Error(e);
        this.onError(error);
    }

    public readonly onmessage = (event: MessageEvent<AsyncMessage<MessageType>>): void => {
        callAndPrune(this.eventListeners, "message", [this, event.data], this.sendErrorString.bind(this));
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
        callAndPrune(this.eventListeners, 'beforeDraw', [this, this.currentFrame, this], this.sendErrorString.bind(this));
        const { down, up, move, keydown, keyup, scroll } = this.drawEvents;
        down && callAndPrune(this.eventListeners, "click", [this, {
            x: down.translatedPoint.x - (this.rootStyle === "centered" ? this.canvas!.width / 2 : 0),
            y:
            (down.translatedPoint.y - (this.rootStyle === "centered" ? this.canvas!.height / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        }, down.event], this.sendErrorString.bind(this));
        up && callAndPrune(this.eventListeners, "release", [this, {
            x: up.translatedPoint.x - (this.rootStyle === "centered" ? this.canvas!.width / 2 : 0),
            y:
            (up.translatedPoint.y - (this.rootStyle === "centered" ? this.canvas!.height / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        }, up.event], this.sendErrorString.bind(this));
        move && callAndPrune(this.eventListeners, "move", [this, {
            x: move.translatedPoint.x - (this.rootStyle === "centered" ? this.canvas!.width / 2 : 0),
            y:
            (move.translatedPoint.y - (this.rootStyle === "centered" ? this.canvas!.height / 2 : 0)) *
                (this.rootStyle === "centered" ? -1 : 1)
        }, move.event], this.sendErrorString.bind(this));
        keydown && callAndPrune(this.eventListeners, "keydown", [this, keydown], this.sendErrorString.bind(this));
        keyup && callAndPrune(this.eventListeners, "keyup", [this, keyup], this.sendErrorString.bind(this));
        scroll && callAndPrune(this.eventListeners, "scroll", [this, scroll], this.sendErrorString.bind(this));
        if (this.resetKeyTargetOnClick && this.drawEvents.up && this.keyTarget !== "" && this.root.findDescendants(this.keyTarget).some(x => (x as Record<string, any>).pointerId === undefined)) {
            this.keyTarget = "";
        }
        if (this.resetScrollTargetOnClick && this.drawEvents.down && this.scrollTarget !== "" && this.root.findDescendants(this.scrollTarget).some(x => (x as Record<string, any>).pointerId === undefined)) {
            this.scrollTarget = "";
        }

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
