import { ColorType, PositionType, BoundsType } from './types/Common.ts';

export function Position(x: number, y: number): PositionType {
    return { x, y };
}

export function ColorToString(color: ColorType) {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}

export function RGBA(red: number, green: number, blue: number, alpha: number = 1): ColorType {
    return { red, green, blue, alpha };
}

export function Corners(x1: number, y1: number, x2: number, y2: number): BoundsType {
    return { x1, y1, x2, y2 };
}

export function Bounds(x: number, y: number, width: number, height: number): BoundsType {
    return { x1: x, y1: y, x2: x + width, y2: y + height };
}

export function CircleBounds(x: number, y: number, radius: number, radiusY?: number): BoundsType {
    return { x1: x - radius, y1: y - (radiusY ?? radius), x2: x + radius, y2: y + (radiusY ?? radius) };
}

export function CenterBounds(x: number, y: number, width: number, height?: number): BoundsType {
    return { x1: x - width / 2, y1: y - (height ?? width) / 2, x2: x + width / 2, y2: y + (height ?? width) / 2 };
}

export const Colors = {
    none: RGBA(0, 0, 0, 0),
    black: RGBA(0, 0, 0),
    white: RGBA(255, 255, 255),
    red: RGBA(255, 0, 0),
    green: RGBA(0, 255, 0),
    blue: RGBA(0, 0, 255),
    yellow: RGBA(255, 255, 0),
    cyan: RGBA(0, 255, 255),
    magenta: RGBA(255, 0, 255),
    gray: RGBA(128, 128, 128),
    lightGray: RGBA(192, 192, 192),
    darkGray: RGBA(64, 64, 64),
    orange: RGBA(255, 200, 0),
    purple: RGBA(128, 0, 128),
    brown: RGBA(128, 64, 0),
    pink: RGBA(255, 175, 175),
};
