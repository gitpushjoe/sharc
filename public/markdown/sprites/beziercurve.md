# BezierCurve

Draws one or more cubic Bézier curve. Does **not** use bounds in its constructor, but properties such as `center`, `centerX` and `centerY` can still be accessed and modified. `bounds` can be accessed, but trying to set the `bounds` directly rather than modifying `start` or `points` will raise an error.

[[[sprites/beziercurve]]]

[]
### BezierCurveProperties

Inherited from [c:Sprite](): `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

Inherited from [c:StrokeableSprite](): `bl:stroke?`

`bl:start?: PositionType` - the starting point of the curve. Defaults to `{x: 0, y: 0}`. Aggregate Property for `startX` and `startY`.

`bl:points?: BezierPoint[]` - an array of `BezierPoint` objects. Defaults to `[]`. Normal Property.

`bl:closePath?: boolean` - whether or not the curve is closed. Defaults to `false`. Normal Property.

`bl:fillRule?: "nonzero"|"evenodd"` - the fill rule of the curve. Defaults to `"nonzero"`. Normal Property.

`bl:arrow: ArrowType` - the arrow style of the line. Takes in an ArrowType object. Defaults to `{ side: 'none'}`. Aggregate property for `arrowLength`, `arrowSide`, `arrowAngle`, `arrowStroke`, `arrowClosed`, and `arrowColor`.

[]
#### HiddenBezierCurveProperties

`bl:startX: number` - the number of curves on the path. Normal property.

`bl:startY: number - the number of curves on the path. Normal property.arrowLength: number` - the length of the arrowhead. Defaults to `20`. Normal Property.

`bl:arrowSide: 'none' | 'start' | 'end' | 'both'` - the side of the line the arrowhead is on. Defaults to `'none'` if no arrow style is supplied, otherwise `'end'`. Normal Property.

See [c:Line](): `bl:arrowAngle: number` `bl:arrowStroke: StrokeType` `bl:arrowClosed: boolean` `bl:arrowColor: ColorType` `bl:arrowStrokeColor: ColorType` `bl:arrowStrokeJoin: 'bevel' | 'round' | 'miter'` `bl:arrowStrokeCap: 'butt' | 'round' | 'square'` `bl:arrowStrokeDash: number` `bl:arrowStrokeDashGap: number` `bl:arrowStrokeDashOffset: number` `bl:arrowRed: number` `bl:arrowGreen: number` `bl:arrowBlue: number` `bl:arrowAlpha: number` `bl:arrowStrokeRed: number` `bl:arrowStrokeGreen: number` `bl:arrowStrokeBlue: number` `bl:arrowStrokeAlpha: number`
