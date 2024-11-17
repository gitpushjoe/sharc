import { AnimationCallback, AnimationType, IsNumeric } from "./types/Animation";
import { EasingType } from "./types/Animation";
import { BoundsType, ColorType, PolarPositionType, PositionType, ScaleType } from "./types/Common";

function Position(x = 0, y = 0): PositionType {
    return { x, y };
}

Position.equals = (...positions: PositionType[]) => {
    for (let i = 1; i < positions.length; i++) {
        if (positions[i].x !== positions[i - 1].x || positions[i].y !== positions[i - 1].y) {
            return false;
        }
    }
    return true;
};

Position.sum = (...positions: PositionType[]): PositionType => {
    const result = Position();
    for (const position of positions) {
        result.x += position.x;
        result.y += position.y;
    }
    return result;
};

Position.diff = (position1: PositionType, position2: PositionType): PositionType => {
    return Position(position1.x - position2.x, position1.y - position2.y);
};

Position.wrtBounds = (position: PositionType, bounds: BoundsType): PositionType => {
    return Position(
        position.x - bounds.x1 - (bounds.x2 - bounds.x1) / 2,
        position.y - bounds.y1 - (bounds.y2 - bounds.y1) / 2
    );
};

Position.factor = (position: PositionType, factor: number): PositionType => {
    return Position(position.x * factor, position.y * factor);
};

Position.scale = (position: PositionType, scale: ScaleType): PositionType => {
    return Position(position.x * scale.x, position.y * scale.y);
};

Position.angle = (position1: PositionType, position2: PositionType): number => {
    return Math.atan2(position2.y - position1.y, position2.x - position1.x);
};

Position.distance = (position1: PositionType, position2: PositionType): number => {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
};

export { Position };

function Scale(x = 1, y = x ?? 1): ScaleType {
    return {x, y};
}

Scale.equals = Position.equals;
Scale.sum = Position.sum;
Scale.diff = Position.diff;
Scale.factor = Position.factor;
Scale.scale = Position.scale;

export { Scale };

function Bounds(x1: number, y1: number, x2: number, y2: number) {
    return { x1, y1, x2, y2 };
}

Bounds.equals = (...bounds: BoundsType[]) => {
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
};

Bounds.fromDimensions = (x: number, y: number, width: number, height: number): BoundsType => {
    return { x1: x, y1: y, x2: x + width, y2: y + height };
};

Bounds.Circle = (x: number, y: number, radius: number, radiusY?: number): BoundsType => {
    return {
        x1: x - radius,
        y1: y - (radiusY ?? radius),
        x2: x + radius,
        y2: y + (radiusY ?? radius)
    };
};

Bounds.Center = (x: number, y: number, width: number, height?: number): BoundsType => {
    return {
        x1: x - width / 2,
        y1: y - (height ?? width) / 2,
        x2: x + width / 2,
        y2: y + (height ?? width) / 2
    };
};

Bounds.wrtSelf = (bounds: BoundsType): BoundsType => {
    const width = bounds.x2 - bounds.x1;
    const height = bounds.y2 - bounds.y1;
    return Bounds(-width / 2, -height / 2, width / 2, height / 2);
};

Bounds.wrtBounds = (bounds: BoundsType, parent: BoundsType): BoundsType => {
    const p1 = Position.wrtBounds(Position(bounds.x1, bounds.y1), parent);
    const p2 = Position.wrtBounds(Position(bounds.x2, bounds.y2), parent);
    return Bounds(p1.x, p1.y, p2.x, p2.y);
};

Bounds.area = (bounds: BoundsType): number => {
    return Math.abs((bounds.x2 - bounds.x1) * (bounds.y2 - bounds.y1));
};

export { Bounds };

function Color(red = 0, green = 0, blue = 0, alpha = 1): ColorType {
    return {
        red,
        green,
        blue,
        alpha
    };
}

Color.toString = (color?: ColorType) => {
    color ??= Color();
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
};

export { Color };

function PolarPosition(angle = 0, radius = 0) {
    return { angle, radius };
}

PolarPosition.equals = (...positions: PolarPositionType[]): boolean => {
    for (let i = 1; i < positions.length; i++) {
        if (positions[i].angle !== positions[i - 1].angle || positions[i].radius !== positions[i - 1].radius) {
            return false;
        }
    }
    return true;
};

PolarPosition.sum = (...positions: PolarPositionType[]): PolarPositionType => {
    const result = PolarPosition();
    for (const position of positions) {
        result.angle += position.angle;
        result.radius += position.radius;
    }
    return result;
};

PolarPosition.diff = (position1: PolarPositionType, position2: PolarPositionType): PolarPositionType => {
    return PolarPosition(position1.angle - position2.angle, position1.radius - position2.radius);
};

PolarPosition.factor = (position: PolarPositionType, factor: number): PolarPositionType => {
    return PolarPosition(position.angle * factor, position.radius * factor);
};

PolarPosition.fromPosition = (position: PositionType, pole?: PositionType): PolarPositionType => {
    pole ??= Position();
    return PolarPosition(Position.angle(pole, position), Position.distance(pole, position));
};

PolarPosition.toPosition = (polarPosition: PolarPositionType, pole?: PositionType): PositionType => {
    return Position(
        pole?.x ?? 0 + polarPosition.radius * Math.cos(deg2rad(polarPosition.angle)),
        pole?.y ?? 0 + polarPosition.radius * Math.sin(deg2rad(polarPosition.angle))
    );
};

export { PolarPosition };

export function addCallback(value: number): AnimationCallback<number> {
    return (property: number) => property + value;
}

export function addXCallback(value: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x + value, property.y);
}

export function addYCallback(value: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x, property.y + value);
}

export function addPositionCallback(x: number, y: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x + x, property.y + y);
}

export function Animate<Properties extends Record<string, unknown>, Property extends keyof Properties>(
    property: true extends IsNumeric<Properties[Property]> ? Property : never,
    from: Properties[typeof property] | null,
    to: NonNullable<Properties[typeof property]> | AnimationCallback<NonNullable<Properties[typeof property]>>,
    duration = 60,
    easing: EasingType = Easing.LINEAR,
    delay = 0,
    name = "",
    clamp: Properties[typeof property] | null = null,
    minClamp: Properties[typeof property] | null = null
): AnimationType<Properties> {
    return {
        property,
        from,
        to,
        duration,
        delay,
        easing,
        name,
        clamp,
        minClamp
    } as unknown as AnimationType<Properties>;
}

export function AnimateTo<Properties extends Record<string, unknown>, Property extends keyof Properties>(
    property: true extends IsNumeric<Properties[Property]> ? Property : never,
    to: NonNullable<Properties[typeof property]> | AnimationCallback<NonNullable<Properties[typeof property]>>,
    duration = 60,
    easing: EasingType = Easing.LINEAR,
    delay = 0,
    name = "",
    clamp: Properties[typeof property] | null = null,
    minClamp: Properties[typeof property] | null = null
): AnimationType<Properties> {
    return {
        property,
        from: null,
        to,
        duration,
        delay,
        easing,
        name,
        clamp,
        minClamp
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
            log(`WARNING: Event listener ${key.toString()} returned non-meaningful value ${resultString}, ignored.
Event listeners should only return true (or 1), false (or 0), or undefined (including implicit return).`);
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
    AliceBlue: Object.freeze(Color(240, 248, 255)),
    AntiqueWhite: Object.freeze(Color(250, 235, 215)),
    Aqua: Object.freeze(Color(0, 255, 255)),
    Aquamarine: Object.freeze(Color(127, 255, 212)),
    Azure: Object.freeze(Color(240, 255, 255)),
    Beige: Object.freeze(Color(245, 245, 220)),
    Bisque: Object.freeze(Color(255, 228, 196)),
    Black: Object.freeze(Color(0, 0, 0)),
    BlanchedAlmond: Object.freeze(Color(255, 235, 205)),
    Blue: Object.freeze(Color(0, 0, 255)),
    BlueViolet: Object.freeze(Color(138, 43, 226)),
    Brown: Object.freeze(Color(165, 42, 42)),
    BurlyWood: Object.freeze(Color(222, 184, 135)),
    CadetBlue: Object.freeze(Color(95, 158, 160)),
    Chartreuse: Object.freeze(Color(127, 255, 0)),
    Chocolate: Object.freeze(Color(210, 105, 30)),
    Coral: Object.freeze(Color(255, 127, 80)),
    CornflowerBlue: Object.freeze(Color(100, 149, 237)),
    Cornsilk: Object.freeze(Color(255, 248, 220)),
    Crimson: Object.freeze(Color(220, 20, 60)),
    Cyan: Object.freeze(Color(0, 255, 255)),
    DarkBlue: Object.freeze(Color(0, 0, 139)),
    DarkCyan: Object.freeze(Color(0, 139, 139)),
    DarkGoldenRod: Object.freeze(Color(184, 134, 11)),
    DarkGray: Object.freeze(Color(169, 169, 169)),
    DarkGreen: Object.freeze(Color(0, 100, 0)),
    DarkKhaki: Object.freeze(Color(189, 183, 107)),
    DarkMagenta: Object.freeze(Color(139, 0, 139)),
    DarkOliveGreen: Object.freeze(Color(85, 107, 47)),
    Darkorange: Object.freeze(Color(255, 140, 0)),
    DarkOrchid: Object.freeze(Color(153, 50, 204)),
    DarkRed: Object.freeze(Color(139, 0, 0)),
    DarkSalmon: Object.freeze(Color(233, 150, 122)),
    DarkSeaGreen: Object.freeze(Color(143, 188, 143)),
    DarkSlateBlue: Object.freeze(Color(72, 61, 139)),
    DarkSlateGray: Object.freeze(Color(47, 79, 79)),
    DarkTurquoise: Object.freeze(Color(0, 206, 209)),
    DarkViolet: Object.freeze(Color(148, 0, 211)),
    DeepPink: Object.freeze(Color(255, 20, 147)),
    DeepSkyBlue: Object.freeze(Color(0, 191, 255)),
    DimGray: Object.freeze(Color(105, 105, 105)),
    DodgerBlue: Object.freeze(Color(30, 144, 255)),
    FireBrick: Object.freeze(Color(178, 34, 34)),
    FloralWhite: Object.freeze(Color(255, 250, 240)),
    ForestGreen: Object.freeze(Color(34, 139, 34)),
    Fuchsia: Object.freeze(Color(255, 0, 255)),
    Gainsboro: Object.freeze(Color(220, 220, 220)),
    GhostWhite: Object.freeze(Color(248, 248, 255)),
    Gold: Object.freeze(Color(255, 215, 0)),
    GoldenRod: Object.freeze(Color(218, 165, 32)),
    Gray: Object.freeze(Color(128, 128, 128)),
    Green: Object.freeze(Color(0, 128, 0)),
    GreenYellow: Object.freeze(Color(173, 255, 47)),
    HoneyDew: Object.freeze(Color(240, 255, 240)),
    HotPink: Object.freeze(Color(255, 105, 180)),
    IndianRed: Object.freeze(Color(205, 92, 92)),
    Indigo: Object.freeze(Color(75, 0, 130)),
    Ivory: Object.freeze(Color(255, 255, 240)),
    Khaki: Object.freeze(Color(240, 230, 140)),
    Lavender: Object.freeze(Color(230, 230, 250)),
    LavenderBlush: Object.freeze(Color(255, 240, 245)),
    LawnGreen: Object.freeze(Color(124, 252, 0)),
    LemonChiffon: Object.freeze(Color(255, 250, 205)),
    LightBlue: Object.freeze(Color(173, 216, 230)),
    LightCoral: Object.freeze(Color(240, 128, 128)),
    LightCyan: Object.freeze(Color(224, 255, 255)),
    LightGoldenRodYellow: Object.freeze(Color(250, 250, 210)),
    LightGrey: Object.freeze(Color(211, 211, 211)),
    LightGreen: Object.freeze(Color(144, 238, 144)),
    LightPink: Object.freeze(Color(255, 182, 193)),
    LightSalmon: Object.freeze(Color(255, 160, 122)),
    LightSeaGreen: Object.freeze(Color(32, 178, 170)),
    LightSkyBlue: Object.freeze(Color(135, 206, 250)),
    LightSlateGray: Object.freeze(Color(119, 136, 153)),
    LightSteelBlue: Object.freeze(Color(176, 196, 222)),
    LightYellow: Object.freeze(Color(255, 255, 224)),
    Lime: Object.freeze(Color(0, 255, 0)),
    LimeGreen: Object.freeze(Color(50, 205, 50)),
    Linen: Object.freeze(Color(250, 240, 230)),
    Magenta: Object.freeze(Color(255, 0, 255)),
    Maroon: Object.freeze(Color(128, 0, 0)),
    MediumAquaMarine: Object.freeze(Color(102, 205, 170)),
    MediumBlue: Object.freeze(Color(0, 0, 205)),
    MediumOrchid: Object.freeze(Color(186, 85, 211)),
    MediumPurple: Object.freeze(Color(147, 112, 216)),
    MediumSeaGreen: Object.freeze(Color(60, 179, 113)),
    MediumSlateBlue: Object.freeze(Color(123, 104, 238)),
    MediumSpringGreen: Object.freeze(Color(0, 250, 154)),
    MediumTurquoise: Object.freeze(Color(72, 209, 204)),
    MediumVioletRed: Object.freeze(Color(199, 21, 133)),
    MidnightBlue: Object.freeze(Color(25, 25, 112)),
    MintCream: Object.freeze(Color(245, 255, 250)),
    MistyRose: Object.freeze(Color(255, 228, 225)),
    Moccasin: Object.freeze(Color(255, 228, 181)),
    NavajoWhite: Object.freeze(Color(255, 222, 173)),
    Navy: Object.freeze(Color(0, 0, 128)),
    OldLace: Object.freeze(Color(253, 245, 230)),
    Olive: Object.freeze(Color(128, 128, 0)),
    OliveDrab: Object.freeze(Color(107, 142, 35)),
    Orange: Object.freeze(Color(255, 165, 0)),
    OrangeRed: Object.freeze(Color(255, 69, 0)),
    Orchid: Object.freeze(Color(218, 112, 214)),
    PaleGoldenRod: Object.freeze(Color(238, 232, 170)),
    PaleGreen: Object.freeze(Color(152, 251, 152)),
    PaleTurquoise: Object.freeze(Color(175, 238, 238)),
    PaleVioletRed: Object.freeze(Color(216, 112, 147)),
    PapayaWhip: Object.freeze(Color(255, 239, 213)),
    PeachPuff: Object.freeze(Color(255, 218, 185)),
    Peru: Object.freeze(Color(205, 133, 63)),
    Pink: Object.freeze(Color(255, 192, 203)),
    Plum: Object.freeze(Color(221, 160, 221)),
    PowderBlue: Object.freeze(Color(176, 224, 230)),
    Purple: Object.freeze(Color(128, 0, 128)),
    Red: Object.freeze(Color(255, 0, 0)),
    RosyBrown: Object.freeze(Color(188, 143, 143)),
    RoyalBlue: Object.freeze(Color(65, 105, 225)),
    SaddleBrown: Object.freeze(Color(139, 69, 19)),
    Salmon: Object.freeze(Color(250, 128, 114)),
    SandyBrown: Object.freeze(Color(244, 164, 96)),
    SeaGreen: Object.freeze(Color(46, 139, 87)),
    SeaShell: Object.freeze(Color(255, 245, 238)),
    Sienna: Object.freeze(Color(160, 82, 45)),
    Silver: Object.freeze(Color(192, 192, 192)),
    SkyBlue: Object.freeze(Color(135, 206, 235)),
    SlateBlue: Object.freeze(Color(106, 90, 205)),
    SlateGray: Object.freeze(Color(112, 128, 144)),
    Snow: Object.freeze(Color(255, 250, 250)),
    SpringGreen: Object.freeze(Color(0, 255, 127)),
    SteelBlue: Object.freeze(Color(70, 130, 180)),
    Tan: Object.freeze(Color(210, 180, 140)),
    Teal: Object.freeze(Color(0, 128, 128)),
    Thistle: Object.freeze(Color(216, 191, 216)),
    Tomato: Object.freeze(Color(255, 99, 71)),
    Turquoise: Object.freeze(Color(64, 224, 208)),
    Violet: Object.freeze(Color(238, 130, 238)),
    Wheat: Object.freeze(Color(245, 222, 179)),
    White: Object.freeze(Color(255, 255, 255)),
    WhiteSmoke: Object.freeze(Color(245, 245, 245)),
    Yellow: Object.freeze(Color(255, 255, 0)),
    YellowGreen: Object.freeze(Color(154, 205, 50)),
    None: Object.freeze(Color(0, 0, 0, 0)),
    Transparent: Object.freeze(Color(0, 0, 0))
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
