import { Stage } from "sharc/Stage";
import { PositionType } from "./Common";
import { DEFAULT_PROPERTIES, HIDDEN_SHAPE_PROPERTIES } from "./Sprites";
import { PrivateAnimationType } from "./Animation";

export type PointerEventCallback<CallerType, StageType = Stage> = (
    caller: CallerType,
    translatedPoint: PositionType,
    event: PointerEvent,
    stage: StageType
) => boolean | 0 | 1 | void;

export type ScrollEventCallback<CallerType, StageType = Stage> = (caller: CallerType, event: WheelEvent, stage: StageType) => boolean | 0 | 1 | void;

export type KeyboardEventCallback<CallerType, StageType = Stage> = (caller: CallerType, event: KeyboardEvent, stage: StageType) => boolean | 0 | 1 | void;

export type PositionedPointerEvent = {
    event: PointerEvent;
    translatedPoint: PositionType;
};

export type EventCollection<DetailsType = any> = {
    down?: PositionedPointerEvent;
    up?: PositionedPointerEvent;
    move?: PositionedPointerEvent;
    stage?: Stage<DetailsType>;
    keydown?: KeyboardEvent;
    keyup?: KeyboardEvent;
    scroll?: WheelEvent;
};

export type StageEventCallback<CallerType, StageType = Stage> = (
    caller: CallerType,
    frame: number,
    stage: StageType
) => boolean | 0 | 1 | void;

export type AnimationFinishCallback<CallerType, PrivateAnimationType> = (
    caller: CallerType,
    animation: PrivateAnimationType
) => boolean | 0 | 1 | void;

export type MessageCallback<CallerType, MessageType> = (
    caller: CallerType,
    message: MessageType
) => boolean | 0 | 1 | void;

export type SpriteEventListeners<CallerType = undefined, Properties = any> = {
    click: PointerEventCallback<CallerType>[];
    drag: PointerEventCallback<CallerType>[];
    release: PointerEventCallback<CallerType>[];
    hover: PointerEventCallback<CallerType>[];
    hoverEnd: PointerEventCallback<CallerType>[];
    hold: ((sprite: CallerType) => boolean | 0 | 1 | void)[];
    keydown: KeyboardEventCallback<CallerType>[];
    keyup: KeyboardEventCallback<CallerType>[];
    scroll: ScrollEventCallback<CallerType>[];
    beforeDraw: StageEventCallback<CallerType>[];
    animationFinish: AnimationFinishCallback<
        CallerType,
        PrivateAnimationType<Properties & DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>
    >[];
};

export type StageEventListeners<CallerType = Stage> = {
    click: PointerEventCallback<CallerType, CallerType>[];
    release: PointerEventCallback<CallerType, CallerType>[];
    move: PointerEventCallback<CallerType, CallerType>[];
    scroll: ScrollEventCallback<CallerType, CallerType>[];
    keydown: KeyboardEventCallback<CallerType, CallerType>[];
    keyup: KeyboardEventCallback<CallerType, CallerType>[];
    beforeDraw: StageEventCallback<CallerType, CallerType>[];
};

export type AsyncStageEventListeners<CallerType = any, MessageType = any> = StageEventListeners<CallerType> & {
    message: MessageCallback<CallerType, MessageType>[];
};
