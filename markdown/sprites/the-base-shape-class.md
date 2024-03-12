# The Base Shape Class

All sprites derive from a base class called `Sprite`. However, avoid using the `Sprite` class to describe a sprite of unknown properties (such as making an array that can contain `Line`s, `Rect`s, etc.). Typescript will throw an error, claiming that the sprite is not assignable to type `Sprite`, even if the `DetailsType`, `Properties` and `HiddenProperties` generics are all set to any.
Instead use the `Shape` class (or `Shape<any, any, any>`, to be more specific). This is the type used by functions like `sprite.getChildren()` and `sprite.findChild()`. It is also the type of the children property of every sprite. All of the universal sprite properties will be available. For example, here is a demo where a `Shape[]` array is used to store a `Rect`, a `Polygon`, and a `Star`, and a `(sprite: Shape) => void` function is used to rotate each sprite:

[[[sprites/the-base-shape-class]]]
