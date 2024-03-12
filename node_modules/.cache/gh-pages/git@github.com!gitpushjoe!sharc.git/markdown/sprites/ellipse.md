# Ellipse 

Draws an ellipse. Does **not** use bounds in its constructor, but properties such as `center`, `centerX` and `centerY` can still be accessed and modified.

[[[sprites/ellipse]]]

[]
### EllipseProperties

Inherited from [c:Sprite](): `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

Inherited from [c:StrokeableSprite](): `bl:stroke?`

`bl:center?: BoundsType` - the center of the ellipse. Defaults to `{x: 0, y: 0}`. Aggregate Property for `centerX` and `centerY`. Note that although `center` is a visible property for Ellipse, `centerX` and `centerY` are still calculated properties based off the circle's [bounds]().

`bl:radius?: number|[number, number]` - the radius of the ellipse. (If two numbers are provided, the first is the radius of the x-axis and the second is the radius of the y-axis.) Defaults to `[5, 5]`. Aggregate Property for `radiusX` and `radiusY`.

`bl:startAngle?: number` - the angle at which the ellipse's path begins in degrees. Defaults to `0`. Normal Property.

`bl:endAngle?: number` - the angle at which the ellipse's path ends in degrees. Defaults to `360`. Normal Property.

[]
#### HiddenEllipseProperties

`bl:radiusX: number` - the radius of the ellipse's x-axis. Calculated property (returns `ellipse.width / 2`).

`bl:radiusY: number` - the radius of the ellipse's y-axis. Calculated property (returns `ellipse.height / 2`).
