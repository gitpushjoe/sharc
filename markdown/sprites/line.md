# Line

Draws a line from `(x1, y1)` to `(x2, y2)` based on the sprites' bounds.

[[[sprites/line]]]

[]
### LineProperties

Inherited from [c:Sprite](): `bl:bounds?` `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

`bl:lineWidth?: number` - the width of the line. Defaults to `1`. Normal Property.

`lineCap?: "butt"|"round"|"square"` - the style of the line's end caps. Defaults to `"butt"`. Normal Property.

`bl:lineDash?: number` - the length of the line's dashes. Defaults to `0`. Normal Property.

`bl:lineDashGap?: number` - the length of the line's gaps. Defaults to `lineDash ?? 0`. Normal Property.

`bl:lineDashOffset?: number` - the offset of the line's dashes. Defaults to `0`. Normal Property.

`bl:arrow: ArrowType` - the arrow style of the line. Takes in an ArrowType object. Defaults to `{ side: 'none'}`. Aggregate property for arrowLength, arrowSide, arrowAngle, arrowStroke, arrowClosed, and arrowColor.

[]
#### HiddenLineProperties

`bl:arrowLength: number` - the length of the arrowhead. Defaults to `20`. Normal Property.

`bl:arrowSide: 'none' | 'start' | 'end' | 'both'` - the side of the line the arrowhead is on. Defaults to `'none'` if no arrow style is supplied, otherwise `'end'`. Normal Property.

`bl:arrowAngle: number` - the angle the arrowhead makes with itself in degrees. Defaults to `90`. Normal Property.

`bl:arrowStroke: StrokeType` - the stroke of the arrowhead. Takes in a StrokeType object. See defaults here. Aggregate Property for arrowStrokeColor, arrowStrokeJoin, arrowStrokeCap, arrowStrokeDash, arrowStrokeDashGap, and arrowStrokeDashOffset.

`bl:arrowClosed: boolean` - whether the arrowhead is closed. Defaults to `false`. Normal Property.

`bl:arrowColor: ColorType` - the color of the arrowhead. Takes in a ColorType object. Defaults to `{ red: 0, green: 0, blue: 0, alpha: 1 }`. Aggregate Property for arrowRed, arrowGreen, arrowBlue, and arrowAlpha.

`bl:arrowStrokeColor: ColorType` - the color of the arrowhead's stroke. Takes in a ColorType object. Defaults to `{ red: 0, green: 0, blue: 0, alpha: 1 }`. Aggregate Property for arrowStrokeRed, arrowStrokeGreen, arrowStrokeBlue, and arrowStrokeAlpha.

`bl:arrowStrokeJoin: 'bevel' | 'round' | 'miter'` - the join style of the arrowhead's stroke. Defaults to `'miter'`. Normal Property.

`bl:arrowStrokeCap: 'butt' | 'round' | 'square'` - the cap style of the arrowhead's stroke. Defaults to `'butt'`. Normal Property.

`bl:arrowStrokeDash: number` - the length of the arrowhead's stroke's dashes. Defaults to `0`. Normal Property.

`bl:arrowStrokeDashGap: number` - the length of the arrowhead's stroke's gaps. Defaults to `arrowStrokeDash ?? 0`. Normal Property.

`bl:arrowStrokeDashOffset: number` - the offset of the arrowhead's stroke's dashes. Defaults to `0`. Normal Property.

`bl:arrowRed: number` - Defaults to `0`. Normal Property.

`bl:arrowGreen: number` - Defaults to `0`. Normal Property.

`bl:arrowBlue: number` - Defaults to `0`. Normal Property.

`bl:arrowAlpha: number` - Defaults to `1`. Normal Property.

`bl:arrowStrokeRed: number` - Defaults to `0`. Normal Property.

`bl:arrowStrokeGreen: number` - Defaults to `0`. Normal Property.

`bl:arrowStrokeBlue: number` - Defaults to `0`. Normal Property.

`bl:arrowStrokeAlpha: number` - Defaults to `1`. Normal Property.

[]
~~~ts-header
Line.Bounds(x1: number, y1: number, x2: number, y2: number) -> BoundsType
~~~
Helper function. Returns a [c:BoundsType]() object with the given values.
