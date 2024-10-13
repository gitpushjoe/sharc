import { AnimationCallback, AnimationType, IsNumeric } from "./types/Animation";
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

    static distance(position1: Position, position2: Position): number {
        return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
    }

    // returns degrees
    static angle(position1: Position, position2: Position): number {
        return Math.atan2(position2.y - position1.y, position2.x - position1.x);
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

export class PolarPosition {
    constructor(
        public angle = 0,
        public radius = 0
    ) {
        return PolarPosition.new(angle, radius);
    }

    static new(angle = 0, radius = 0): { angle: number; radius: number } {
        return { angle, radius };
    }

    static equals(...positions: PolarPosition[]): boolean {
        for (let i = 1; i < positions.length; i++) {
            if (positions[i].angle !== positions[i - 1].angle || positions[i].radius !== positions[i - 1].radius) {
                return false;
            }
        }
        return true;
    }

    static sum(...positions: PolarPosition[]): PolarPosition {
        const result = new PolarPosition(0, 0);
        for (const position of positions) {
            result.angle += position.angle;
            result.radius += position.radius;
        }
        return result;
    }

    static diff(position1: PolarPosition, position2: PolarPosition): PolarPosition {
        return new PolarPosition(position1.angle - position2.angle, position1.radius - position2.radius);
    }

    static factor(position: PolarPosition, factor: number): PolarPosition {
        return new PolarPosition(position.angle * factor, position.radius * factor);
    }

    static fromPosition(position: Position, pole?: Position): PolarPosition {
        pole ??= new Position();
        return new PolarPosition(Position.angle(pole, position), Position.distance(pole, position));
    }

    static toPosition(polarPosition: PolarPosition, pole?: Position): Position {
        return new Position(
            pole?.x ?? 0 + polarPosition.radius * Math.cos(deg2rad(polarPosition.angle)),
            pole?.y ?? 0 + polarPosition.radius * Math.sin(deg2rad(polarPosition.angle))
        );
    }
}

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

export function Animate<Properties extends Record<string, unknown>, Property extends keyof Properties>(
    property: true extends IsNumeric<Properties[Property]> ? Property : never,
    from: Properties[typeof property] | null,
    to: NonNullable<Properties[typeof property]> | AnimationCallback<NonNullable<Properties[typeof property]>>,
    duration = 60,
    easing: EasingType = Easing.LINEAR,
    delay = 0,
    name = ""
): AnimationType<Properties> {
    return {
        property,
        from,
        to,
        duration,
        delay,
        easing,
        name
    } as unknown as AnimationType<Properties>;
}

export function AnimateTo<Properties, P extends keyof Properties>(
    property: true extends IsNumeric<Properties[P]> ? P : never,
    to: NonNullable<Properties[typeof property]> | AnimationCallback<NonNullable<Properties[typeof property]>>,
    duration = 60,
    easing: EasingType = Easing.LINEAR,
    delay = 0,
    name = ""
): AnimationType<Properties> {
    return {
        property,
        from: null,
        to,
        duration,
        delay,
        easing,
        name
    } as unknown as AnimationType<Properties>;
}

export function deg2rad(degrees: number, wrap = false): number {
    return (!wrap ? degrees : ((degrees % 360) + 360) % 360) * (Math.PI / 180);
}

export function rad2deg(radians: number, wrap = false): number {
    const degrees = radians * (180 / Math.PI);
    return !wrap ? degrees : ((degrees % 360) + 360) % 360;
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

export const Colors = Object.freeze({
    AliceBlue: Object.freeze(new Color(240, 248, 255)),
    AntiqueWhite: Object.freeze(new Color(250, 235, 215)),
    Aqua: Object.freeze(new Color(0, 255, 255)),
    Aquamarine: Object.freeze(new Color(127, 255, 212)),
    Azure: Object.freeze(new Color(240, 255, 255)),
    Beige: Object.freeze(new Color(245, 245, 220)),
    Bisque: Object.freeze(new Color(255, 228, 196)),
    Black: Object.freeze(new Color(0, 0, 0)),
    BlanchedAlmond: Object.freeze(new Color(255, 235, 205)),
    Blue: Object.freeze(new Color(0, 0, 255)),
    BlueViolet: Object.freeze(new Color(138, 43, 226)),
    Brown: Object.freeze(new Color(165, 42, 42)),
    BurlyWood: Object.freeze(new Color(222, 184, 135)),
    CadetBlue: Object.freeze(new Color(95, 158, 160)),
    Chartreuse: Object.freeze(new Color(127, 255, 0)),
    Chocolate: Object.freeze(new Color(210, 105, 30)),
    Coral: Object.freeze(new Color(255, 127, 80)),
    CornflowerBlue: Object.freeze(new Color(100, 149, 237)),
    Cornsilk: Object.freeze(new Color(255, 248, 220)),
    Crimson: Object.freeze(new Color(220, 20, 60)),
    Cyan: Object.freeze(new Color(0, 255, 255)),
    DarkBlue: Object.freeze(new Color(0, 0, 139)),
    DarkCyan: Object.freeze(new Color(0, 139, 139)),
    DarkGoldenRod: Object.freeze(new Color(184, 134, 11)),
    DarkGray: Object.freeze(new Color(169, 169, 169)),
    DarkGreen: Object.freeze(new Color(0, 100, 0)),
    DarkKhaki: Object.freeze(new Color(189, 183, 107)),
    DarkMagenta: Object.freeze(new Color(139, 0, 139)),
    DarkOliveGreen: Object.freeze(new Color(85, 107, 47)),
    Darkorange: Object.freeze(new Color(255, 140, 0)),
    DarkOrchid: Object.freeze(new Color(153, 50, 204)),
    DarkRed: Object.freeze(new Color(139, 0, 0)),
    DarkSalmon: Object.freeze(new Color(233, 150, 122)),
    DarkSeaGreen: Object.freeze(new Color(143, 188, 143)),
    DarkSlateBlue: Object.freeze(new Color(72, 61, 139)),
    DarkSlateGray: Object.freeze(new Color(47, 79, 79)),
    DarkTurquoise: Object.freeze(new Color(0, 206, 209)),
    DarkViolet: Object.freeze(new Color(148, 0, 211)),
    DeepPink: Object.freeze(new Color(255, 20, 147)),
    DeepSkyBlue: Object.freeze(new Color(0, 191, 255)),
    DimGray: Object.freeze(new Color(105, 105, 105)),
    DodgerBlue: Object.freeze(new Color(30, 144, 255)),
    FireBrick: Object.freeze(new Color(178, 34, 34)),
    FloralWhite: Object.freeze(new Color(255, 250, 240)),
    ForestGreen: Object.freeze(new Color(34, 139, 34)),
    Fuchsia: Object.freeze(new Color(255, 0, 255)),
    Gainsboro: Object.freeze(new Color(220, 220, 220)),
    GhostWhite: Object.freeze(new Color(248, 248, 255)),
    Gold: Object.freeze(new Color(255, 215, 0)),
    GoldenRod: Object.freeze(new Color(218, 165, 32)),
    Gray: Object.freeze(new Color(128, 128, 128)),
    Green: Object.freeze(new Color(0, 128, 0)),
    GreenYellow: Object.freeze(new Color(173, 255, 47)),
    HoneyDew: Object.freeze(new Color(240, 255, 240)),
    HotPink: Object.freeze(new Color(255, 105, 180)),
    IndianRed: Object.freeze(new Color(205, 92, 92)),
    Indigo: Object.freeze(new Color(75, 0, 130)),
    Ivory: Object.freeze(new Color(255, 255, 240)),
    Khaki: Object.freeze(new Color(240, 230, 140)),
    Lavender: Object.freeze(new Color(230, 230, 250)),
    LavenderBlush: Object.freeze(new Color(255, 240, 245)),
    LawnGreen: Object.freeze(new Color(124, 252, 0)),
    LemonChiffon: Object.freeze(new Color(255, 250, 205)),
    LightBlue: Object.freeze(new Color(173, 216, 230)),
    LightCoral: Object.freeze(new Color(240, 128, 128)),
    LightCyan: Object.freeze(new Color(224, 255, 255)),
    LightGoldenRodYellow: Object.freeze(new Color(250, 250, 210)),
    LightGrey: Object.freeze(new Color(211, 211, 211)),
    LightGreen: Object.freeze(new Color(144, 238, 144)),
    LightPink: Object.freeze(new Color(255, 182, 193)),
    LightSalmon: Object.freeze(new Color(255, 160, 122)),
    LightSeaGreen: Object.freeze(new Color(32, 178, 170)),
    LightSkyBlue: Object.freeze(new Color(135, 206, 250)),
    LightSlateGray: Object.freeze(new Color(119, 136, 153)),
    LightSteelBlue: Object.freeze(new Color(176, 196, 222)),
    LightYellow: Object.freeze(new Color(255, 255, 224)),
    Lime: Object.freeze(new Color(0, 255, 0)),
    LimeGreen: Object.freeze(new Color(50, 205, 50)),
    Linen: Object.freeze(new Color(250, 240, 230)),
    Magenta: Object.freeze(new Color(255, 0, 255)),
    Maroon: Object.freeze(new Color(128, 0, 0)),
    MediumAquaMarine: Object.freeze(new Color(102, 205, 170)),
    MediumBlue: Object.freeze(new Color(0, 0, 205)),
    MediumOrchid: Object.freeze(new Color(186, 85, 211)),
    MediumPurple: Object.freeze(new Color(147, 112, 216)),
    MediumSeaGreen: Object.freeze(new Color(60, 179, 113)),
    MediumSlateBlue: Object.freeze(new Color(123, 104, 238)),
    MediumSpringGreen: Object.freeze(new Color(0, 250, 154)),
    MediumTurquoise: Object.freeze(new Color(72, 209, 204)),
    MediumVioletRed: Object.freeze(new Color(199, 21, 133)),
    MidnightBlue: Object.freeze(new Color(25, 25, 112)),
    MintCream: Object.freeze(new Color(245, 255, 250)),
    MistyRose: Object.freeze(new Color(255, 228, 225)),
    Moccasin: Object.freeze(new Color(255, 228, 181)),
    NavajoWhite: Object.freeze(new Color(255, 222, 173)),
    Navy: Object.freeze(new Color(0, 0, 128)),
    OldLace: Object.freeze(new Color(253, 245, 230)),
    Olive: Object.freeze(new Color(128, 128, 0)),
    OliveDrab: Object.freeze(new Color(107, 142, 35)),
    Orange: Object.freeze(new Color(255, 165, 0)),
    OrangeRed: Object.freeze(new Color(255, 69, 0)),
    Orchid: Object.freeze(new Color(218, 112, 214)),
    PaleGoldenRod: Object.freeze(new Color(238, 232, 170)),
    PaleGreen: Object.freeze(new Color(152, 251, 152)),
    PaleTurquoise: Object.freeze(new Color(175, 238, 238)),
    PaleVioletRed: Object.freeze(new Color(216, 112, 147)),
    PapayaWhip: Object.freeze(new Color(255, 239, 213)),
    PeachPuff: Object.freeze(new Color(255, 218, 185)),
    Peru: Object.freeze(new Color(205, 133, 63)),
    Pink: Object.freeze(new Color(255, 192, 203)),
    Plum: Object.freeze(new Color(221, 160, 221)),
    PowderBlue: Object.freeze(new Color(176, 224, 230)),
    Purple: Object.freeze(new Color(128, 0, 128)),
    Red: Object.freeze(new Color(255, 0, 0)),
    RosyBrown: Object.freeze(new Color(188, 143, 143)),
    RoyalBlue: Object.freeze(new Color(65, 105, 225)),
    SaddleBrown: Object.freeze(new Color(139, 69, 19)),
    Salmon: Object.freeze(new Color(250, 128, 114)),
    SandyBrown: Object.freeze(new Color(244, 164, 96)),
    SeaGreen: Object.freeze(new Color(46, 139, 87)),
    SeaShell: Object.freeze(new Color(255, 245, 238)),
    Sienna: Object.freeze(new Color(160, 82, 45)),
    Silver: Object.freeze(new Color(192, 192, 192)),
    SkyBlue: Object.freeze(new Color(135, 206, 235)),
    SlateBlue: Object.freeze(new Color(106, 90, 205)),
    SlateGray: Object.freeze(new Color(112, 128, 144)),
    Snow: Object.freeze(new Color(255, 250, 250)),
    SpringGreen: Object.freeze(new Color(0, 255, 127)),
    SteelBlue: Object.freeze(new Color(70, 130, 180)),
    Tan: Object.freeze(new Color(210, 180, 140)),
    Teal: Object.freeze(new Color(0, 128, 128)),
    Thistle: Object.freeze(new Color(216, 191, 216)),
    Tomato: Object.freeze(new Color(255, 99, 71)),
    Turquoise: Object.freeze(new Color(64, 224, 208)),
    Violet: Object.freeze(new Color(238, 130, 238)),
    Wheat: Object.freeze(new Color(245, 222, 179)),
    White: Object.freeze(new Color(255, 255, 255)),
    WhiteSmoke: Object.freeze(new Color(245, 245, 245)),
    Yellow: Object.freeze(new Color(255, 255, 0)),
    YellowGreen: Object.freeze(new Color(154, 205, 50)),
    None: Object.freeze(new Color(0, 0, 0, 0)),
    Transparent: Object.freeze(new Color(0, 0, 0))
});

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
