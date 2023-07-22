import { CurveType } from "./types/Common";

export const Easing = {
    LINEAR: (x: number) => x,
    EASE_IN: (x: number) => 1 - Math.pow(1 - x, 2),
    EASE_OUT: (x: number) => x * x,
    EASE_IN_OUT: (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    EASE_IN_CUBIC: (x: number) => Math.pow(x, 3),
    EASE_OUT_CUBIC: (x: number) => 1 - Math.pow(1 - x, 3),
    EASE_IN_OUT_CUBIC: (x: number) => x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2,
    Bounce: (curve: CurveType) => {return (x: number) => x < 0.5 ? curve(x * 2) : curve(2 * (1 - x))},
}