import { AnimationCallback, AnimationType } from './types/Animation.ts';
import { ColorType, PositionType, BoundsType } from './types/Common.ts';
import { EasingType } from './types/Animation.ts';

/**
 * Returns (x, y) as a PositionType.
 */
export function Position(x: number, y: number): PositionType {
    return { x, y };
}

/**
 * Converts a ColorType to a string.
 */
export function ColorToString(color: ColorType) {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}

/**
 * Converts an RGBA value to a ColorType. Alpha defaults to 1.
 */
export function Color(red: number, green: number, blue: number, alpha: number = 1): ColorType {
    return { red, green, blue, alpha };
}

/**
 * Returns a BoundsType from (x1, y1) to (x2, y2).
 */
export function Corners(x1: number, y1: number, x2: number, y2: number): BoundsType {
    return { x1, y1, x2, y2 };
}

/**
 * Returns a BoundsType with a corner at (x, y) and a width and height of (width, height).
 */
export function Dimensions(x: number, y: number, width: number, height: number): BoundsType {
    return { x1: x, y1: y, x2: x + width, y2: y + height };
}

/**
 * Returns a BoundsType centered at (x, y) with a width of 2 * radius and a height of 2 * radiusY.
 * 
 * radiusY defaults to radius.
 */
export function CircleBounds(x: number, y: number, radius: number, radiusY?: number): BoundsType {
    return { x1: x - radius, y1: y - (radiusY ?? radius), x2: x + radius, y2: y + (radiusY ?? radius) };
}

/**
 * Returns a BoundsType centered at (x, y) with a specific width and height.
 */
export function CenterBounds(x: number, y: number, width: number, height?: number): BoundsType {
    return { x1: x - width / 2, y1: y - (height ?? width) / 2, x2: x + width / 2, y2: y + (height ?? width) / 2 };
}

/**
 * Returns a callback that takes in a number and returns that number + value.
 */
export function addCallback(value: number): AnimationCallback<number> {
    return (property: number) => property + value;
}

/**
 * Returns a callback that takes in a PositionType and returns that PositionType with x + value.
 */
export function addXCallback(value: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x + value, property.y);
}

/**
 * Returns a callback that takes in a PositionType and returns that PositionType with y + value.
 */
export function addYCallback(value: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x, property.y + value);
}

/**
 * Returns a callback that takes in a PositionType and adds (x, y) to it.
 */
export function addPositionCallback(x: number, y: number): AnimationCallback<PositionType> {
    return (property: PositionType) => Position(property.x + x, property.y + y);
}

/**
 * @param bounds BoundsType
 * @returns [x1, y1, width, height] where (x1, y1) is the top left corner of the bounds.
 */
export function getX1Y1WH(bounds: BoundsType): [number, number, number, number] {
    return [
        -Math.abs(bounds.x1 - bounds.x2) / 2,
        -Math.abs(bounds.y1 - bounds.y2) / 2,
        Math.abs(bounds.x1 - bounds.x2),
        Math.abs(bounds.y1 - bounds.y2)
    ]
}

/**
 * @param bounds BoundsType
 * @param position PositionType
 * @returns the position relative to the center of the bounds
 */
export function translatePosition(bounds: BoundsType, position: PositionType): PositionType {
    return Position(
        position.x - bounds.x1 - (bounds.x2 - bounds.x1) / 2,
        position.y - bounds.y1 - (bounds.y2 - bounds.y1) / 2
    )
}

/**
 * @param bounds BoundsType
 * @returns The bounds translated to (0, 0)
 */
export function translateBounds(bounds: BoundsType) : BoundsType {
    return Corners(
        translatePosition(bounds, Position(bounds.x1, bounds.y1)).x,
        translatePosition(bounds, Position(bounds.x1, bounds.y1)).y,
        translatePosition(bounds, Position(bounds.x2, bounds.y2)).x,
        translatePosition(bounds, Position(bounds.x2, bounds.y2)).y
    )
}

// <props> not needing to be defined is Typescript inference magic and I will not question it
/**
 * Creates an animation object that can be used with Sprites.
 * 
 * @param property The property to animate.
 * @param from The starting value of the property. If null, the current value of the property will be used.
 * @param to The ending value of the property or a callback. If a callback, the callback will be called with the current value of the property and the return value will be used as the ending value.
 * @param duration The duration of the animation in frames. (default: 60)
 * @param delay The delay before the animation starts in frames. (default: 0)
 * @param easing The easing function to use. (default: Easing.LINEAR)
 * @param name Optional. The name of the animation. (default: '')
 * @param details Optional. Details about the animation. (default: [])
 * @returns An animation object.
 */
export function Animate<props>(
    property: keyof props, 
    from: (props[keyof props] & (number|Record<string, number>))|null,
    to: (props[keyof props] & (number|Record<string, number>))|AnimationCallback<props[keyof props] & (number|Record<string, number>)>,
    duration: number = 60, 
    delay: number = 0, 
    easing: EasingType = Easing.LINEAR,
    name: string = '',
    details: (string|number)[] = []): AnimationType<props> {
    return { property, from, to, duration, delay, easing, name, details };
}

/**
 * Creates an animation object that can be used with Sprites.
 * 
 * The current value of the property will be used as the starting value.
 * 
 * @param property The property to animate.
 * @param to The ending value of the property or a callback. If a callback, the callback will be called with the current value of the property and the return value will be used as the ending value.
 * @param duration The duration of the animation in frames. (default: 60)
 * @param delay The delay before the animation starts in frames. (default: 0)
 * @param easing The easing function to use. (default: Easing.LINEAR)
 * @param name Optional. The name of the animation. (default: '')
 * @param details Optional. Details about the animation. (default: [])
 */
export function AnimateTo<props>(
    property: keyof props,
    to: (props[keyof props] & (number|Record<string, number>))|AnimationCallback<props[keyof props] & (number|Record<string, number>)>,
    duration: number = 60,
    delay: number = 0,
    easing: EasingType = Easing.LINEAR,
    name: string = '',
    details: (string|number)[] = []): AnimationType<props> {
        return { property, from: null, to, duration, delay, easing, name, details };
}

/**
 * Contains easing functions for use with animations.
 */
export const Easing = {
    LINEAR: (x: number) => x,
    EASE_IN: (x: number) => 1 - Math.pow(1 - x, 2),
    EASE_OUT: (x: number) => x * x,
    EASE_IN_OUT: (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    EASE_IN_CUBIC: (x: number) => 1 - Math.pow(1 - x, 3),
    EASE_OUT_CUBIC: (x: number) => x * x * x,
    EASE_IN_OUT_CUBIC: (x: number) => x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2,
    Bounce: (curve: EasingType) => {return (x: number) => x < 0.5 ? curve(x * 2) : curve(2 * (1 - x))},
}

/**
 * Contains all CSS colors as ColorTypes.
 */
export const Colors = {
    AliceBlue: Color(240, 248, 255),
    AntiqueWhite: Color(250, 235, 215),
    Aqua: Color(0, 255, 255),
    Aquamarine: Color(127, 255, 212),
    Azure: Color(240, 255, 255),
    Beige: Color(245, 245, 220),
    Bisque: Color(255, 228, 196),
    Black: Color(0, 0, 0),
    BlanchedAlmond: Color(255, 235, 205),
    Blue: Color(0, 0, 255),
    BlueViolet: Color(138, 43, 226),
    Brown: Color(165, 42, 42),
    BurlyWood: Color(222, 184, 135),
    CadetBlue: Color(95, 158, 160),
    Chartreuse: Color(127, 255, 0),
    Chocolate: Color(210, 105, 30),
    Coral: Color(255, 127, 80),
    CornflowerBlue: Color(100, 149, 237),
    Cornsilk: Color(255, 248, 220),
    Crimson: Color(220, 20, 60),
    Cyan: Color(0, 255, 255),
    DarkBlue: Color(0, 0, 139),
    DarkCyan: Color(0, 139, 139),
    DarkGoldenRod: Color(184, 134, 11),
    DarkGray: Color(169, 169, 169),
    DarkGreen: Color(0, 100, 0),
    DarkKhaki: Color(189, 183, 107),
    DarkMagenta: Color(139, 0, 139),
    DarkOliveGreen: Color(85, 107, 47),
    Darkorange: Color(255, 140, 0),
    DarkOrchid: Color(153, 50, 204),
    DarkRed: Color(139, 0, 0),
    DarkSalmon: Color(233, 150, 122),
    DarkSeaGreen: Color(143, 188, 143),
    DarkSlateBlue: Color(72, 61, 139),
    DarkSlateGray: Color(47, 79, 79),
    DarkTurquoise: Color(0, 206, 209),
    DarkViolet: Color(148, 0, 211),
    DeepPink: Color(255, 20, 147),
    DeepSkyBlue: Color(0, 191, 255),
    DimGray: Color(105, 105, 105),
    DodgerBlue: Color(30, 144, 255),
    FireBrick: Color(178, 34, 34),
    FloralWhite: Color(255, 250, 240),
    ForestGreen: Color(34, 139, 34),
    Fuchsia: Color(255, 0, 255),
    Gainsboro: Color(220, 220, 220),
    GhostWhite: Color(248, 248, 255),
    Gold: Color(255, 215, 0),
    GoldenRod: Color(218, 165, 32),
    Gray: Color(128, 128, 128),
    Green: Color(0, 128, 0),
    GreenYellow: Color(173, 255, 47),
    HoneyDew: Color(240, 255, 240),
    HotPink: Color(255, 105, 180),
    IndianRed: Color(205, 92, 92),
    Indigo: Color(75, 0, 130),
    Ivory: Color(255, 255, 240),
    Khaki: Color(240, 230, 140),
    Lavender: Color(230, 230, 250),
    LavenderBlush: Color(255, 240, 245),
    LawnGreen: Color(124, 252, 0),
    LemonChiffon: Color(255, 250, 205),
    LightBlue: Color(173, 216, 230),
    LightCoral: Color(240, 128, 128),
    LightCyan: Color(224, 255, 255),
    LightGoldenRodYellow: Color(250, 250, 210),
    LightGrey: Color(211, 211, 211),
    LightGreen: Color(144, 238, 144),
    LightPink: Color(255, 182, 193),
    LightSalmon: Color(255, 160, 122),
    LightSeaGreen: Color(32, 178, 170),
    LightSkyBlue: Color(135, 206, 250),
    LightSlateGray: Color(119, 136, 153),
    LightSteelBlue: Color(176, 196, 222),
    LightYellow: Color(255, 255, 224),
    Lime: Color(0, 255, 0),
    LimeGreen: Color(50, 205, 50),
    Linen: Color(250, 240, 230),
    Magenta: Color(255, 0, 255),
    Maroon: Color(128, 0, 0),
    MediumAquaMarine: Color(102, 205, 170),
    MediumBlue: Color(0, 0, 205),
    MediumOrchid: Color(186, 85, 211),
    MediumPurple: Color(147, 112, 216),
    MediumSeaGreen: Color(60, 179, 113),
    MediumSlateBlue: Color(123, 104, 238),
    MediumSpringGreen: Color(0, 250, 154),
    MediumTurquoise: Color(72, 209, 204),
    MediumVioletRed: Color(199, 21, 133),
    MidnightBlue: Color(25, 25, 112),
    MintCream: Color(245, 255, 250),
    MistyRose: Color(255, 228, 225),
    Moccasin: Color(255, 228, 181),
    NavajoWhite: Color(255, 222, 173),
    Navy: Color(0, 0, 128),
    OldLace: Color(253, 245, 230),
    Olive: Color(128, 128, 0),
    OliveDrab: Color(107, 142, 35),
    Orange: Color(255, 165, 0),
    OrangeRed: Color(255, 69, 0),
    Orchid: Color(218, 112, 214),
    PaleGoldenRod: Color(238, 232, 170),
    PaleGreen: Color(152, 251, 152),
    PaleTurquoise: Color(175, 238, 238),
    PaleVioletRed: Color(216, 112, 147),
    PapayaWhip: Color(255, 239, 213),
    PeachPuff: Color(255, 218, 185),
    Peru: Color(205, 133, 63),
    Pink: Color(255, 192, 203),
    Plum: Color(221, 160, 221),
    PowderBlue: Color(176, 224, 230),
    Purple: Color(128, 0, 128),
    Red: Color(255, 0, 0),
    RosyBrown: Color(188, 143, 143),
    RoyalBlue: Color(65, 105, 225),
    SaddleBrown: Color(139, 69, 19),
    Salmon: Color(250, 128, 114),
    SandyBrown: Color(244, 164, 96),
    SeaGreen: Color(46, 139, 87),
    SeaShell: Color(255, 245, 238),
    Sienna: Color(160, 82, 45),
    Silver: Color(192, 192, 192),
    SkyBlue: Color(135, 206, 235),
    SlateBlue: Color(106, 90, 205),
    SlateGray: Color(112, 128, 144),
    Snow: Color(255, 250, 250),
    SpringGreen: Color(0, 255, 127),
    SteelBlue: Color(70, 130, 180),
    Tan: Color(210, 180, 140),
    Teal: Color(0, 128, 128),
    Thistle: Color(216, 191, 216),
    Tomato: Color(255, 99, 71),
    Turquoise: Color(64, 224, 208),
    Violet: Color(238, 130, 238),
    Wheat: Color(245, 222, 179),
    White: Color(255, 255, 255),
    WhiteSmoke: Color(245, 245, 245),
    Yellow: Color(255, 255, 0),
    YellowGreen: Color(154, 205, 50),
    None: Color(0, 0, 0, 0),
    Transparent: Color(0, 0, 0, 0),
};
