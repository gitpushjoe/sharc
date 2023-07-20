import { ColorType, PositionType, BoundsType } from './types/Common.ts';
import { StrokeColorType } from './types/Shapes.ts';

export function Position(x: number, y: number): PositionType {
    return { x, y };
}

export function ColorToString(color: ColorType|StrokeColorType) {
    return 'red' in color ? `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})` :
        `rgba(${color.strokeRed}, ${color.strokeGreen}, ${color.strokeBlue}, ${color.strokeAlpha})`;
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