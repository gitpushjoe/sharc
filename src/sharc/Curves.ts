import { CurveType } from "./types/Common";

export const LINEAR = (x: number) => x;

export const EASE_IN = (x: number) => 1 - Math.pow(1 - x, 2);

export const EASE_OUT = (x: number) => x * x;

export const EASE_IN_OUT = (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

export const EASE_IN_CUBIC = (x: number) => Math.pow(x, 3);

export const EASE_OUT_CUBIC = (x: number) => 1 - Math.pow(1 - x, 3);

export const EASE_IN_OUT_CUBIC = (x: number) => x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2;

export const Bounce = (curve: CurveType) => {return (x: number) => x < 0.5 ? curve(x * 2) : curve(2 * (1 - x))};