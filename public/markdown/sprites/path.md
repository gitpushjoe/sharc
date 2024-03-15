# Path

Draws a series of straight lines. Does **not** use bounds in its constructor, but properties such as `center`, `centerX` and `centerY` can still be accessed and modified. `bounds` can be accessed, but trying to set the `bounds` directly rather than modifying `path` will raise an error.

[[[sprites/path]]]

[]
### PathProperties

Inherited from [c:Sprite](): `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

Inherited from [c:StrokeableSprite](): `bl:stroke?`

`bl:path?: PositionType[]` - an array of [c:PositionType]() objects that represent the points of the path. Defaults to `[]`. Normal Property.

`bl:closePath?: boolean` - whether or not the path is closed. Defaults to `false`. Normal Property.

`bl:fillRule?: "nonzero"|"evenodd"` - the fill rule of the path. Defaults to `"nonzero"`. Normal Property.

`bl:startRatio?: number` - the ratio of the path's length at which the path begins. Defaults to `0`. Normal Property.

`bl:endRatio?: number` - the ratio of the path's length at which the path ends. Defaults to `1`. Normal Property.
