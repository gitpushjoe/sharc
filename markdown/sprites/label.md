# Label 

Draws text with a background. When a `LabelSprite` is drawn to a canvas with a centered root node, its scale is automatically flipped on the y-axis. Does **not** use bounds in its constructor, but properties such as `center`, `centerX` and `centerY` can still be accessed and modified. `bounds` can be accessed, but trying to set the `bounds` directly rather than modifying `path` will raise an error.

[[[sprites/label]]]

[]
### LabelProperties

Inherited from [c:Sprite](): `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

Inherited from [c:StrokeableSprite](): `bl:stroke?`

Inherited from [c:TextProperties]():   `bl:text?` `bl:position?` `bl:positionIsCenter?` `bl:font?` `bl:fontSize?` `bl:bold?` `bl:italic?` `bl:textAlign?` `bl:textBaseline?` `bl:textDirection?` `bl:maxWidth?`

`bl:padding?: string` - the inner padding of the label. Defaults to `10`. Normal property.

`bl:backgroundColor?: ColorType` - the background color of the label. Defaults to `{red: 0, green: 0, blue: 0, alpha: 0}`. Aggregate property for `backgroundRed`, `backgroundGreen`, `backgroundBlue` and `backgroundAlpha`.

`bl:textStroke?: StrokeType|null` - the stroke color of the text. Defaults to `null`.

`bl:backgroundRadius?: RadiusType` - the radius of the background corners. Defaults to `[0]`. Normal property.

[]
#### HiddenTextProperties

Inherited from [c:TextProperties]():   `bl:positionX` `bl:positionY`

`bl:backgroundRed: number`

`bl:backgroundGreen: number`

`bl:backgroundBlue: number`

`bl:backgroundAlpha: number`
