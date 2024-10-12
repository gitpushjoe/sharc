import { ColorType } from "./Common";
import { EventCollection } from "./Events";

export interface CanvasInterface {
    width: number;
    height: number;
    oncontextmenu: ((...args: any) => any) | null;
    style: {
        touchAction: string;
    };
    getContext: (
        type: "2d"
    ) => CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    offsetLeft: number;
    offsetTop: number;
    addEventListener: (type: string, callback: (...args: any) => any) => void;
    getBoundingClientRect: () => {
        left: number;
        top: number;
    };
    clientWidth: number;
    clientHeight: number;
    removeEventListener: (
        type: string,
        callback: (...args: any) => any
    ) => void;
    transferToImageBitmap?: () => ImageBitmap;
    focus?: () => void;
}

export type InitializeWorkerMessage = {
    type: "init";
    width: number;
    height: number;
    rootStyle: "centered" | "classic";
    bgColor: ColorType;
};

export type WorkerRenderMessage = {
    type: "render";
    img: ImageBitmap;
    lastRenderMs: number;
    currentFrame: number;
};

export type StageStateMessage = {
    type: "stageState";
    events: Omit<EventCollection<any>, "stage">;
    canvasProperties: {
        width: number;
        height: number;
        offsetLeft: number;
        offsetTop: number;
        boundingClientRect: {
            left: number;
            top: number;
        };
        clientWidth: number;
        clientHeight: number;
    };
};

export type BeginLoopMessage = {
    type: "beginLoop";
    frameRate: number;
    stageState: Omit<StageStateMessage, "type">;
};

export type WorkerReadyMessage = {
    type: "ready";
};

export type StopLoopMessage = {
    type: "stopLoop";
    source: "offscreen";
};

export type CustomMessage<MessageType = any> = {
    type: "custom";
    message: MessageType;
};

export type WorkerErrorMessage = {
    type: "error";
    error: string;
    stack: string;
};

export type WorkerStopLoopMessage = {
    type: "stopLoop";
    source: "worker";
};

export type AsyncMessage<MessageType = any> =
    | InitializeWorkerMessage
    | WorkerRenderMessage
    | BeginLoopMessage
    | WorkerReadyMessage
    | StageStateMessage
    | StopLoopMessage
    | WorkerErrorMessage
    | WorkerStopLoopMessage
    | CustomMessage<MessageType>;
