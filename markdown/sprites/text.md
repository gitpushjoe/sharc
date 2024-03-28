# Text

Draws text. When a `TextSprite` is drawn to a canvas with a centered root node, its scale is automatically flipped on the y-axis. Does **not** use bounds in its constructor, but properties such as `center`, `centerX` and `centerY` can still be accessed and modified. `bounds` can be accessed, but trying to set the `bounds` directly rather than modifying `position` or `fontSize` will raise an error.

[[[sprites/text]]]

[]
### TextProperties 

`bl:text?: string` - the text to be drawn. Defaults to `""`. Normal Property.

`bl:position?: PositionType` - the position of the text. See `positionIsCenter` below. Defaults to `{x: 0, y: 0}`. Aggregate Property for `positionX` and `positionY`.

`bl:positionIsCenter?: boolean` - If `true`, position will be the center of the text. If `false`, position will be the top-left, top-center, or top-right corner of the text (depending on `textAlign`). Defaults to `false`. Normal Property.

`bl:font?: string` - the font family of the text. [Uses CSS](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font). Defaults to `"sans-serif"`. Normal Property.

`bl:fontSize?: number` - the font size of the text. Defaults to `16`. Normal Property.

`bl:bold?: boolean` - whether the text is bold. Defaults to `false`. Normal Property.

`bl:italic?: boolean` - whether the text is italic. Defaults to `false`. Normal Property.

`bl:textAlign?: "center"|"end"|"left"|"right"|"start"` - the text alignment of the text. Defaults to `"start"`. Normal Property.

`bl:textBaseline?: "alphabetic"|"bottom"|"hanging"|"ideographic"|"middle"|"top"` - the text baseline of the text. Defaults to `"alphabetic"`. Normal Property.

`bl:textDirection?: "ltr"|"rtl"|"inherit"` - the text direction of the text. Defaults to `"ltr"`. Normal Property.

`bl:maxWidth?: number|null|undefined` - the maximum width of the text. Defaults to `null`. Normal Property.

[]
#### HiddenTextProperties

`bl:positionX: number` - the x-coordinate of the text position. Normal Property.

`bl:positionY: number` - the y-coordinate of the text position. Normal Property.
