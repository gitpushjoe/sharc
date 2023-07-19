export type PositionType = {
    x: number,
    y: number
};

export type ColorType = {
    red: number,
    green: number,
    blue: number,
    alpha: number
};

export type BoundsType = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

export type CurveType = (x: number) => number;