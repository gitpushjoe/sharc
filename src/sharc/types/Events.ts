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

export type SpriteEventCollection = {
    down: PointerEvent[];
    up: PointerEvent[];
    move: PointerEvent[];
    stage: Stage | undefined;
};

export type StageEventCallback<thisType> = (this: thisType, stage: Stage, frame: number) => void;

export type AnimationFinishCallback<thisType, PrivateAnimationType> = (
    this: thisType,
    animation: PrivateAnimationType
) => void;

export type SpriteEventListeners<thisType = undefined, Properties = any> = {
    click: PointerEventCallback<thisType>[];
    drag: PointerEventCallback<thisType>[];
    release: PointerEventCallback<thisType>[];
    hover: PointerEventCallback<thisType>[];
    hoverEnd: PointerEventCallback<thisType>[];
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
