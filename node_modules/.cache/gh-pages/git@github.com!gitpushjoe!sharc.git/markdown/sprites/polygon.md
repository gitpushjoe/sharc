# Polygon

Draws a regular n-sided polygon. Does **not** use bounds in its constructor, but properties such as `center`, `centerX` and `centerY` can still be accessed and modified. `bounds` can be accessed, but trying to set the `bounds` directly rather than modifying `center` or `radius` will raise an error.

[[[sprites/polygon]]]

[]
### PolygonProperties 

Inherited from [c:Sprite](): `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

Inherited from [c:StrokeableSprite](): `bl:stroke?`

`bl:sides?: number` - the number of sides of the polygon. Defaults to `5`. Normal Property.

`bl:center?: PositionType` - the center of the polygon. Defaults to `{x: 0, y: 0}`. Aggregate Property for centerX and centerY.

`bl:radius: number` - the radius of the polygon. Normal Property.

`bl:fillRule?: CanvasFillRule` - the fill rule of the polygon. Defaults to `"nonzero"`. Normal Property.

`bl:startRatio?: number` - the ratio of the polygon's length at which the polygon begins. Defaults to `0`. Normal Property.

`bl:endRatio?: number` - the ratio of the polygon's length at which the polygon ends. Defaults to `1`. Normal Property.

[]
#### HiddenPolygonProperties

`bl:centerX?: number` - the x-coordinate of the center of the polygon. Normal Property. (Unlike other sprites, `centerX` is stored as a normal property, instead of being calculated from the bounds.)

`bl:centerY?: number` - the y-coordinate of the center of the polygon. Normal Property. (Unlike other sprites, `centerY` is stored as a normal property, instead of being calculated from the bounds.)
