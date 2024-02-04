import { Stage } from "sharc/Stage";
import { PositionType } from "./Common";
import { DEFAULT_PROPERTIES, HIDDEN_SHAPE_PROPERTIES } from "./Sprites";
import { PrivateAnimationType } from "./Animation";

export type PointerEventCallback<thisType> = (
    this: thisType,
    event: PointerEvent,
    translatedPoint: PositionType
) => void;

export type ScrollEventCallback<thisType> = (this: thisType, event: WheelEvent) => void;

export type PositionedPointerEvent = {
    event: PointerEvent;
    translatedPoint: PositionType;
};

export type EventCollection<DetailsType = any> = {
    down: PositionedPointerEvent[];
    up: PositionedPointerEvent[];
    move: PositionedPointerEvent[];
    stage: Stage<DetailsType> | undefined;
};

export type StageEventCallback<thisType> = (this: thisType, frame: number) => void;

export type AnimationFinishCallback<thisType, PrivateAnimationType> = (
    this: thisType,
    animation: PrivateAnimationType
) => void;

export type MessageCallback<thisType, MessageType> = (this: thisType, message: MessageType) => void;

export type SpriteEventListeners<thisType = undefined, Properties = any> = {
    click: PointerEventCallback<thisType>[];
    drag: PointerEventCallback<thisType>[];
    release: PointerEventCallback<thisType>[];
    hover: PointerEventCallback<thisType>[];
    hoverEnd: ((this: thisType) => void)[];
    scroll: ScrollEventCallback<thisType>[];
    beforeDraw: StageEventCallback<thisType>[];
    animationFinish: AnimationFinishCallback<
        thisType,
        PrivateAnimationType<Properties & DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>
    >[];
};

export type StageEventListeners<thisType = Stage> = {
    click: PointerEventCallback<thisType>[];
    release: PointerEventCallback<thisType>[];
    move: PointerEventCallback<thisType>[];
    scroll: ScrollEventCallback<thisType>[];
    beforeDraw: StageEventCallback<thisType>[];
};

export type AsyncStageEventListeners<thisType = any, MessageType = any> = StageEventListeners<thisType> & {
    message: MessageCallback<thisType, MessageType>[];
};
//     [key in keyof StageEventListeners<thisType>]: StageEventListeners<thisType>[key];
// } & {message: MessageCallback<thisType, MessageType>[]};
