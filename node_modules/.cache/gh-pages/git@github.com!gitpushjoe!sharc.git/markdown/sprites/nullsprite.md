# NullSprite 

An empty sprite that draws nothing to the canvas. `NullSprite`s can be used in conjunction with the various [parenting](sprites/parenting) functions in order to group sprites together. `NullSprite`s have 0 width and 0 height. However, when it is their turn to be rendered, they still apply their `position`, `scale`, `rotation`, `alpha`, `blur` and `effects` properties to the canvas. `NullSprite`s, then, are useful for applying transformations to groups of sprites, like an adjustment layer in Photoshop. Examples of `NullSprite`s can be found all throughout this documentation, but a simple example is shown below. In order to make the sprite rotate around the mouse, we can create a `NullSprite` that is always positioned on the mouse, and then add the sprite to the `NullSprite`'s children. Then, we can rotate the `NullSprite`, and the sprite will rotate around the mouse.

[[[sprites/nullsprite]]]

[]
### NullSpriteProperties

Inherited from [c:Sprite](): `bl: bounds?` `bl:color?` `bl:scale?` `bl:rotation?` `bl:alpha?` `bl:blur?` `bl:gradient?` `bl:effects?` `bl:name?` `bl:enabled?` `bl:channelCount?` `bl:details?`

`bl:position?: PositionType` - the position of the `NullSprite`. Remember, `NullSprite`s have 0 width and 0 height. Defaults to `{x: 0, y: 0}`. Aggregate Property for `positionX` and `positionY`.

[]
#### HiddenNullSpriteProperties

`bl:positionX: number` - the x-coordinate of the `NullSprite`'s position. Normal Property.

`bl:positionY: number` - the y-coordinate of the `NullSprite`'s position. Normal Property.

