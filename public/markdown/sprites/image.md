# Image

Draws an image from the sprite's `bounds`. Available in both main and worker threads. Modifying the `src` property of the image will automatically update `srcCorner2` to the width and height of the new image. To override this behavior, simply add `'noresize:'` to the beginning of the `src` string. sharc makes no guarantees for race conditions related to image loading.

[[[sprites/image]]]

[]
### ImageProperties

Inherited from [c:Sprite](): `bl: bounds?` `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

Inherited from [c:StrokeableSprite](): `bl:stroke?`

`bl:src?: string` - the URL of the image to be drawn. Defaults to `''`. Calculated Property for `image`.

`bl:srcBounds?: BoundsType` - the bounds of the source image to draw from. Defaults to `{x1: 0, y1: 0, x2: image.width, y2: image.height}`. Aggregate Property for `srcX1`, `srcY1`, `srcX2` and `srcY2`. Normal Property.

[]
#### HiddenImageProperties

`bl:image: ImageBitmap|null` - the image bitmap that the Image is using. Returns `null` if the current `src` value is `''` or `"noresize:"`. Normal Property.*

`bl:useSrcBounds: boolean` - whether to use srcBounds or to draw the image in its entirety. Defaults to `true` if srcBounds is defined, `false` otherwise. Normal Property.

`bl:srcCorner1: PositionType` - Aggregate Property for `srcX1` and `srcY1`. Normal Property.

`bl:srcCorner2: PositionType` - Aggregate Property for `srcX2` and `srcY2`. Normal Property.

`bl:srcX1: number` - Normal Property.

`bl:srcY1: number` - Normal Property.

`bl:srcX2: number` - Normal Property.

`bl:srcY2: number` - Normal Property.

[]

_* `Image.image` functions as a Normal Property, but is technically a Calculated Property. Each image has an `Image._image` private member, which will always be an `ImageBitmap|null`. However, for convenience, `Image.image` can also be set to an `HTMLImageElement`. This will do two things: the `src` property will automatically be updated to the `src` of the image, and the private `Image._image` bitmap will be set to the image once it loads, so that calling `Image.image` will return that bitmap._
