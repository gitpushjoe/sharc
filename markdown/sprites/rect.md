# Rect 

Draws a rectangle based on the sprites' [bounds]().

[[[sprites/rect]]]

[]
### RectProperties 

Inherited from [c:Sprite](): `bl:bounds?` `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

Inherited from [c:StrokeableSprite](): `bl:stroke?`

`bl:radius?: RadiusType` - the radii length of the rectangle's corners. [c:RadiusType](). Defaults to `[0]`. Normal property.

[]
~~~ts-header
Rect.Bounds(x1: number, y1: number, x2: number, y2: number) -> BoundsType
~~~
Helper function. Returns a [c:BoundsType]() object with a corner at `(x, y)` and width `w` and height `h`.
