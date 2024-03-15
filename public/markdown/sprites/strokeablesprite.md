# Strokeable Sprites

Every sprite (except for `Line` and `NullSprite`) inherits from an abstract class called `StrokeableSprite`, which allows you to draw a stroke around the sprite. The `StrokeableSprite` class has the following properties:

[]

`bl:stroke?: StrokeType` - Aggregate Property. `stroke` is a `StrokeType` object, which means it has these keys:

[]

`bl:color?: ColorType` - the color of the stroke. Defaults to `{red: 0, green: 0, blue: 0, alpha: 1}`. Corresponds to the hidden aggregate property `strokeColor`, and the hidden properties `bl:strokeRed`, `bl:strokeGreen`, `bl:strokeBlue`, and `bl:strokeAlpha`.

`bl:lineWidth?: number` - the `width` of the stroke. Defaults to `1`. Corresponds to the hidden property `bl:strokeWidth`.

`bl:lineCap?: "butt"|"round"|"square"` - the style of the stroke's end caps. Defaults to `"butt"`. Corresponds to the hidden property `bl:strokeCap`.

`bl:lineDash?: number` - the length of the stroke's dashes. Defaults to `0`. Corresponds to the hidden property `bl:strokeDash`.

`bl:lineDashGap?: number` - the length of the stroke's gaps. Defaults to lineDash ?? `0`. Corresponds to the hidden property `bl:strokeDashGap`.

`bl:lineDashOffset?: number` - the offset of the stroke's dashes. Defaults to `0`. Corresponds to the hidden property `bl:strokeDashOffset`.

`bl:lineJoin?: "bevel"|"round"|"miter"` - the style of the stroke's corners. Defaults to `"miter"`. Corresponds to the hidden property `bl:strokeJoin`.
