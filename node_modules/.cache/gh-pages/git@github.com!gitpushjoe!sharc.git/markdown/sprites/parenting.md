# Parenting

In sharc, you can make a sprite a child of another sprite. In order to understand what this means, it may be helpful to cover how sprites are actually drawn:

`bl:function draw(...):`
1.    The current state of the canvas is saved.
2.    The canvas context is translated so that the origin of the canvas is where the center of the sprite should be.
3.    The canvas is rotated according to the rotation property of the sprite.
4.    The canvas is scaled according to the scale property of the sprite.
5.    The sprite is drawn to the canvas.
6.    `draw()` is called on all the child sprites.
7.    The canvas context is restored to the state it was in at step 1.

As you can see, the children of a sprite inherit the transformations of their parent. `(0, 0)` for a child sprite is the center of the parent sprite. Furthermore, if you rotate or scale a parent sprite, all of its children will rotate or scale with it.

[]
## Parenting Functions

~~~ts-header
sprite.addChild(child: Shape) -> this
~~~
Adds one child to `sprite`'s children.

[]
~~~ts-header
sprite.addChildren(...children: Shape[]) -> this
~~~
Adds multiple children to `sprite`.

[]
~~~ts-header
sprite.removeChild(child: Shape) -> this
~~~
Tries to remove `child` from `sprite`'s children.

[]
~~~ts-header
sprite.removeChildren(...children: Shape[]) -> this
~~~
Tries to remove all of `children` from `sprite`'s children.

[]
~~~ts-header
sprite.children -> Shape[]
~~~
Returns a copy of `sprite`'s children array.

[]
~~~ts-header
sprite.r_getChildren() -> Shape[]
~~~
Returns all of `sprite`'s descendants. (Recursive)

[]
~~~ts-header
sprite.parent -> Shape|undefined
~~~
Returns `sprite`'s parent.

[]
~~~ts-header
sprite.root -> Shape
~~~
Returns the root of the tree that `sprite` is in. If `sprite` is the root, then it will return itself.

[]
~~~ts-header
sprite.logHierarchy() -> void
~~~
Logs `sprite` and all of its descendants to the console, including their positions, using the sprites' `name` properties and their colors.

[]
~~~ts-header
sprite.findChild(name: string) -> Shape|undefined
~~~
Returns the first child of `sprite` with the name `name`. Non-recursive.

[]
~~~ts-header
sprite.findChildren(name: string) -> Shape[]
~~~
Returns all of the children of `sprite` with the name `name`. Non-recursive.

[]
~~~ts-header
sprite.r_findChild(name: string) -> Shape|undefined
~~~
Returns the first descendant of `sprite` with the name `name`. If no descendant has that name, it returns `undefined`. Recursive.

[]
~~~ts-header
sprite.r_findChildren(name: string) -> Shape[]
~~~
Returns all of the descendants of `sprite` with the name `name`. If no descendant has that name, it returns an empty array. Recursive.
