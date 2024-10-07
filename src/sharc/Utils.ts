import { AnimationCallback, AnimationType } from "./types/Animation";
import { EasingType } from "./types/Animation";

export class Position {
    constructor(
        public x = 0,
        public y = 0
    ) {
        return Position.new(x, y);
    }

    static new(x = 0, y = 0): { x: number; y: number } {
        return { x, y };
    }

    static equals(...positions: Position[]): boolean {
        for (let i = 1; i < positions.length; i++) {
            if (positions[i].x !== positions[i - 1].x || positions[i].y !== positions[i - 1].y) {
                return false;
            }
        }
        return true;
    }

    static sum(...positions: Position[]): Position {
        const result = new Position(0, 0);
        for (const position of positions) {
            result.x += position.x;
            result.y += position.y;
        }
        return result;
    }

    static diff(position1: Position, position2: Position): Position {
        return new Position(position1.x - position2.x, position1.y - position2.y);
    }

    static wrtBounds(position: Position, bounds: Bounds): Position {
        return new Position(
            position.x - bounds.x1 - (bounds.x2 - bounds.x1) / 2,
            position.y - bounds.y1 - (bounds.y2 - bounds.y1) / 2
        );
    }

    static factor(position: Position, factor: number): Position {
        return new Position(position.x * factor, position.y * factor);
    }

    static scale(position: Position, scale: Position): Position {
        return new Position(position.x * scale.x, position.y * scale.y);
    }
}

export class Bounds {
    constructor(
        public x1 = 0,
        public y1 = 0,
        public x2 = 0,
        public y2 = 0
    ) {
        return Bounds.new(x1, y1, x2, y2);
    }

    static new(x1 = 0, y1 = 0, x2 = 0, y2 = 0): Bounds {
        return { x1, y1, x2, y2 };
    }

    static equals(...bounds: Bounds[]): boolean {
        for (let i = 1; i < bounds.length; i++) {
            if (
                bounds[i].x1 !== bounds[i - 1].x1 ||
                bounds[i].y1 !== bounds[i - 1].y1 ||
                bounds[i].x2 !== bounds[i - 1].x2 ||
                bounds[i].y2 !== bounds[i - 1].y2
            ) {
                return false;
            }
        }
        return true;
    }

    static fromDimensions(x: number, y: number, width: number, height: number): Bounds {
        return { x1: x, y1: y, x2: x + width, y2: y + height };
    }

    static fromCircle(x: number, y: number, radius: number, radiusY?: number): Bounds {
        return {
            x1: x - radius,
            y1: y - (radiusY ?? radius),
            x2: x + radius,
            y2: y + (radiusY ?? radius)
        };
    }

    static fromCenter(x: number, y: number, width: number, height?: number): Bounds {
        return {
            x1: x - width / 2,
            y1: y - (height ?? width) / 2,
            x2: x + width / 2,
            y2: y + (height ?? width) / 2
        };
    }

    static wrtSelf(bounds: Bounds): Bounds {
        const width = bounds.x2 - bounds.x1;
        const height = bounds.y2 - bounds.y1;
        return new Bounds(-width / 2, -height / 2, width / 2, height / 2);
    }

    static wrtBounds(bounds: Bounds, parent: Bounds): Bounds {
        const p1 = Position.wrtBounds(new Position(bounds.x1, bounds.y1), parent);
        const p2 = Position.wrtBounds(new Position(bounds.x2, bounds.y2), parent);
        return new Bounds(p1.x, p1.y, p2.x, p2.y);
    }

    static area(bounds: Bounds): number {
        return Math.abs((bounds.x2 - bounds.x1) * (bounds.y2 - bounds.y1));
    }
}

export class Color {
    constructor(
        public red = 0,
        public green = 0,
        public blue = 0,
        public alpha = 1
    ) {
        return Color.new(red, green, blue, alpha);
    }

    static new(red = 0, green = 0, blue = 0, alpha = 1): Color {
        return { red, green, blue, alpha };
    }

    static toString(color: Color): string {
        return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
    }
}

// export function ColorToString(color: Color) {
//     return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
// }
//
// export function Color(red: number, green: number, blue: number, alpha = 1): Color {
//     return { red, green, blue, alpha };
// }

// export function Corners(x1: number, y1: number, x2: number, y2: number): Bounds {
//     return { x1, y1, x2, y2 };
// }
//
// export function Dimensions(x: number, y: number, width: number, height: number): Bounds {
//     return { x1: x, y1: y, x2: x + width, y2: y + height };
// }
//
// export function CircleBounds(x: number, y: number, radius: number, radiusY?: number): Bounds {
//     return {
//         x1: x - radius,
//         y1: y - (radiusY ?? radius),
//         x2: x + radius,
//         y2: y + (radiusY ?? radius)
//     };
// }
//
// export function CenterBounds(x: number, y: number, width: number, height?: number): Bounds {
//     return {
//         x1: x - width / 2,
//         y1: y - (height ?? width) / 2,
//         x2: x + width / 2,
//         y2: y + (height ?? width) / 2
//     };
// }

export function addCallback(value: number): AnimationCallback<number> {
    return (property: number) => property + value;
}

export function addXCallback(value: number): AnimationCallback<Position> {
    return (property: Position) => new Position(property.x + value, property.y);
}

export function addYCallback(value: number): AnimationCallback<Position> {
    return (property: Position) => new Position(property.x, property.y + value);
}

export function addPositionCallback(x: number, y: number): AnimationCallback<Position> {
    return (property: Position) => new Position(property.x + x, property.y + y);
}

// export function getX1Y1WH(bounds: Bounds): [number, number, number, number] {
//     return [
//         -Math.abs(bounds.x1 - bounds.x2) / 2,
//         -Math.abs(bounds.y1 - bounds.y2) / 2,
//         Math.abs(bounds.x1 - bounds.x2),
//         Math.abs(bounds.y1 - bounds.y2)
//     ];
// }

// export function translatePosition(bounds: Bounds, position: Position): Position {
//     return p(
//         position.x - bounds.x1 - (bounds.x2 - bounds.x1) / 2,
//         position.y - bounds.y1 - (bounds.y2 - bounds.y1) / 2
//     );
// }
//
// export function translateBounds(bounds: Bounds): Bounds {
//     return Corners(
//         translatePosition(bounds, p(bounds.x1, bounds.y1)).x,
//         translatePosition(bounds, p(bounds.x1, bounds.y1)).y,
//         translatePosition(bounds, p(bounds.x2, bounds.y2)).x,
//         translatePosition(bounds, p(bounds.x2, bounds.y2)).y
//     );
// }

export function Animate<props>(
    property: keyof props,
    from: props[typeof property] | null,
    to: NonNullable<props[typeof property]> | AnimationCallback<NonNullable<props[typeof property]>>,
    duration = 60,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    name = ""
): AnimationType<props> {
    return { property, from, to, duration, delay, easing, name } as AnimationType<props>;
}

export function AnimateTo<props>(
    property: keyof props,
    to: NonNullable<props[typeof property]> | AnimationCallback<NonNullable<props[typeof property]>>,
    duration = 60,
    delay = 0,
    easing: EasingType = Easing.LINEAR,
    name = ""
): AnimationType<props> {
    return { property, from: null, to, duration, delay, easing, name } as AnimationType<props>;
}

export function callAndPrune<
    listeners extends Record<string, ((...args: any[]) => unknown)[]>,
    key extends keyof listeners
>(
    listeners: listeners,
    key: key,
    args: Parameters<listeners[key][number]>,
    log: (message: string) => any = console.error
) {
    const pruned: ((...args: any[]) => unknown)[] = [];
    for (let i = 0; i < listeners[key].length; i++) {
        const callback = listeners[key][i];
        const result = callback(...args);
        if (result !== undefined && result != 1 && result != 0) {
            const resultString = (() => {
                try {
                    return JSON.stringify(result);
                } catch (e) {
                    return result!.toString();
                }
            })();
            log(
                `WARNING: Event listener ${key.toString()} returned non-meaningful value ${resultString}, ignored.
Event listeners should only return true (or 1), false (or 0), or undefined (including implicit return).`
            );
        }
        if (result == 1) {
            pruned.push(callback);
        }
    }
    listeners[key] = listeners[key].filter(callback => !pruned.includes(callback)) as listeners[key];
}

export const Easing = {
    LINEAR: (x: number) => x,
    EASE_IN: (x: number) => 1 - Math.pow(1 - x, 2),
    EASE_OUT: (x: number) => x * x,
    EASE_IN_OUT: (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
    EASE_IN_CUBIC: (x: number) => 1 - Math.pow(1 - x, 3),
    EASE_OUT_CUBIC: (x: number) => x * x * x,
    EASE_IN_OUT_CUBIC: (x: number) => (x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2),
    Bounce: (curve: EasingType) => {
        return (x: number) => (x < 0.5 ? curve(x * 2) : curve(2 * (1 - x)));
    }
};

export const Colors = {
    AliceBlue: new Color(240, 248, 255),
    AntiqueWhite: new Color(250, 235, 215),
    Aqua: new Color(0, 255, 255),
    Aquamarine: new Color(127, 255, 212),
    Azure: new Color(240, 255, 255),
    Beige: new Color(245, 245, 220),
    Bisque: new Color(255, 228, 196),
    Black: new Color(0, 0, 0),
    BlanchedAlmond: new Color(255, 235, 205),
    Blue: new Color(0, 0, 255),
    BlueViolet: new Color(138, 43, 226),
    Brown: new Color(165, 42, 42),
    BurlyWood: new Color(222, 184, 135),
    CadetBlue: new Color(95, 158, 160),
    Chartreuse: new Color(127, 255, 0),
    Chocolate: new Color(210, 105, 30),
    Coral: new Color(255, 127, 80),
    CornflowerBlue: new Color(100, 149, 237),
    Cornsilk: new Color(255, 248, 220),
    Crimson: new Color(220, 20, 60),
    Cyan: new Color(0, 255, 255),
    DarkBlue: new Color(0, 0, 139),
    DarkCyan: new Color(0, 139, 139),
    DarkGoldenRod: new Color(184, 134, 11),
    DarkGray: new Color(169, 169, 169),
    DarkGreen: new Color(0, 100, 0),
    DarkKhaki: new Color(189, 183, 107),
    DarkMagenta: new Color(139, 0, 139),
    DarkOliveGreen: new Color(85, 107, 47),
    Darkorange: new Color(255, 140, 0),
    DarkOrchid: new Color(153, 50, 204),
    DarkRed: new Color(139, 0, 0),
    DarkSalmon: new Color(233, 150, 122),
    DarkSeaGreen: new Color(143, 188, 143),
    DarkSlateBlue: new Color(72, 61, 139),
    DarkSlateGray: new Color(47, 79, 79),
    DarkTurquoise: new Color(0, 206, 209),
    DarkViolet: new Color(148, 0, 211),
    DeepPink: new Color(255, 20, 147),
    DeepSkyBlue: new Color(0, 191, 255),
    DimGray: new Color(105, 105, 105),
    DodgerBlue: new Color(30, 144, 255),
    FireBrick: new Color(178, 34, 34),
    FloralWhite: new Color(255, 250, 240),
    ForestGreen: new Color(34, 139, 34),
    Fuchsia: new Color(255, 0, 255),
    Gainsboro: new Color(220, 220, 220),
    GhostWhite: new Color(248, 248, 255),
    Gold: new Color(255, 215, 0),
    GoldenRod: new Color(218, 165, 32),
    Gray: new Color(128, 128, 128),
    Green: new Color(0, 128, 0),
    GreenYellow: new Color(173, 255, 47),
    HoneyDew: new Color(240, 255, 240),
    HotPink: new Color(255, 105, 180),
    IndianRed: new Color(205, 92, 92),
    Indigo: new Color(75, 0, 130),
    Ivory: new Color(255, 255, 240),
    Khaki: new Color(240, 230, 140),
    Lavender: new Color(230, 230, 250),
    LavenderBlush: new Color(255, 240, 245),
    LawnGreen: new Color(124, 252, 0),
    LemonChiffon: new Color(255, 250, 205),
    LightBlue: new Color(173, 216, 230),
    LightCoral: new Color(240, 128, 128),
    LightCyan: new Color(224, 255, 255),
    LightGoldenRodYellow: new Color(250, 250, 210),
    LightGrey: new Color(211, 211, 211),
    LightGreen: new Color(144, 238, 144),
    LightPink: new Color(255, 182, 193),
    LightSalmon: new Color(255, 160, 122),
    LightSeaGreen: new Color(32, 178, 170),
    LightSkyBlue: new Color(135, 206, 250),
    LightSlateGray: new Color(119, 136, 153),
    LightSteelBlue: new Color(176, 196, 222),
    LightYellow: new Color(255, 255, 224),
    Lime: new Color(0, 255, 0),
    LimeGreen: new Color(50, 205, 50),
    Linen: new Color(250, 240, 230),
    Magenta: new Color(255, 0, 255),
    Maroon: new Color(128, 0, 0),
    MediumAquaMarine: new Color(102, 205, 170),
    MediumBlue: new Color(0, 0, 205),
    MediumOrchid: new Color(186, 85, 211),
    MediumPurple: new Color(147, 112, 216),
    MediumSeaGreen: new Color(60, 179, 113),
    MediumSlateBlue: new Color(123, 104, 238),
    MediumSpringGreen: new Color(0, 250, 154),
    MediumTurquoise: new Color(72, 209, 204),
    MediumVioletRed: new Color(199, 21, 133),
    MidnightBlue: new Color(25, 25, 112),
    MintCream: new Color(245, 255, 250),
    MistyRose: new Color(255, 228, 225),
    Moccasin: new Color(255, 228, 181),
    NavajoWhite: new Color(255, 222, 173),
    Navy: new Color(0, 0, 128),
    OldLace: new Color(253, 245, 230),
    Olive: new Color(128, 128, 0),
    OliveDrab: new Color(107, 142, 35),
    Orange: new Color(255, 165, 0),
    OrangeRed: new Color(255, 69, 0),
    Orchid: new Color(218, 112, 214),
    PaleGoldenRod: new Color(238, 232, 170),
    PaleGreen: new Color(152, 251, 152),
    PaleTurquoise: new Color(175, 238, 238),
    PaleVioletRed: new Color(216, 112, 147),
    PapayaWhip: new Color(255, 239, 213),
    PeachPuff: new Color(255, 218, 185),
    Peru: new Color(205, 133, 63),
    Pink: new Color(255, 192, 203),
    Plum: new Color(221, 160, 221),
    PowderBlue: new Color(176, 224, 230),
    Purple: new Color(128, 0, 128),
    Red: new Color(255, 0, 0),
    RosyBrown: new Color(188, 143, 143),
    RoyalBlue: new Color(65, 105, 225),
    SaddleBrown: new Color(139, 69, 19),
    Salmon: new Color(250, 128, 114),
    SandyBrown: new Color(244, 164, 96),
    SeaGreen: new Color(46, 139, 87),
    SeaShell: new Color(255, 245, 238),
    Sienna: new Color(160, 82, 45),
    Silver: new Color(192, 192, 192),
    SkyBlue: new Color(135, 206, 235),
    SlateBlue: new Color(106, 90, 205),
    SlateGray: new Color(112, 128, 144),
    Snow: new Color(255, 250, 250),
    SpringGreen: new Color(0, 255, 127),
    SteelBlue: new Color(70, 130, 180),
    Tan: new Color(210, 180, 140),
    Teal: new Color(0, 128, 128),
    Thistle: new Color(216, 191, 216),
    Tomato: new Color(255, 99, 71),
    Turquoise: new Color(64, 224, 208),
    Violet: new Color(238, 130, 238),
    Wheat: new Color(245, 222, 179),
    White: new Color(255, 255, 255),
    WhiteSmoke: new Color(245, 245, 245),
    Yellow: new Color(255, 255, 0),
    YellowGreen: new Color(154, 205, 50),
    None: new Color(0, 0, 0, 0),
    Transparent: new Color(0, 0, 0, 0)
};

export function invalidCallFor(spriteType: string) {
    return (_: any, key: string, descriptor: PropertyDescriptor) => {
        descriptor.value = (): never => {
            throw new Error(`Cannot call ${key} on ${spriteType}`);
        };
        return descriptor;
    };
}

export function invalidSetterFor(spriteType: string) {
    return (_: any, key: string, descriptor: PropertyDescriptor) => {
        descriptor.set = (): never => {
            throw new Error(`Cannot set ${key} for ${spriteType}`);
        };
        return descriptor;
    };
}
