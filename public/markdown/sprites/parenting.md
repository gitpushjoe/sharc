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
sprite.removeChild(child: Shape) -> Shape | undefined
~~~
Tries to remove `child` from `sprite`'s children, only if `child` is not a child of `sprite`. Returns `child` if it was removed, otherwise returns `undefined`.

[]
~~~ts-header
sprite.removeChildren(...children: Shape[]) -> Shape[]
~~~
Tries to remove all of `children` from `sprite`'s children. Returns an array of the children that were removed.

[]
~~~ts-header
sprite.removeAllChildren() -> this
~~~
Removes all of `sprite`'s children.

[]
~~~ts-header
sprite.removeSelf() -> this
~~~
Removes `sprite` from its parent. If `sprite` has no parent, then it does nothing.

[]
~~~ts-header
sprite.children -> Shape[]
~~~
Returns a copy of `sprite`'s children array.

[]
~~~ts-header
sprite.descendants -> Shape[]
~~~
Returns all of `sprite`'s descendants. (Recursive)

[]
~~~ts-header
sprite.parent -> Shape | undefined
~~~
Returns `sprite`'s parent, or `undefined` if `sprite` has no parent.

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
sprite.findChild(name: string) -> Shape | undefined
~~~
Returns the first child of `sprite` with the name `name`.

[]
~~~ts-header
sprite.findDescendant(name: string) -> Shape | undefined
~~~
Returns the first descendant of `sprite` with the name `name`. If no descendant has that name, it returns `undefined`. (Recursive.)

[]
~~~ts-header
sprite.findChildren(name: string) -> Shape[]
~~~
Returns all of the children of `sprite` with the name `name`.

[]
~~~ts-header
sprite.findDescendants(name: string) -> Shape[]
~~~
Returns all of the descendants of `sprite` with the name `name`. If no descendant has that name, it returns an empty array. (Recursive.)

[]
~~~ts-header
sprite.findChildWhere(filter: (child: Shape) => boolean) -> Shape | undefined
~~~
Returns the first child of `sprite` that satisfies the `filter` function. If no child satisfies the `filter` function, it returns `undefined`.

[]
~~~ts-header
sprite.findDescendantWhere(filter: (descendant: Shape) => boolean) -> Shape | undefined
~~~
Returns the first descendant of `sprite` that satisfies the `filter` function. If no descendant satisfies the `filter` function, it returns `undefined`. (Recursive.)

[]
~~~ts-header
sprite.findChildrenWhere(filter: (child: Shape) => boolean) -> Shape[]
~~~
Returns all of the children of `sprite` that satisfy the `filter` function.

[]
~~~ts-header
sprite.findDescendantsWhere(filter: (descendant: Shape) => boolean) -> Shape[]
~~~
Returns all of the descendants of `sprite` that satisfy the `filter` function. If no descendant satisfies the `filter` function, it returns an empty array. (Recursive.)

[]
~~~ts-header
sprite.removeChildWhere(filter: (child: Shape) => boolean) -> Shape | undefined
~~~
Removes the first child of `sprite` that satisfies the `filter` function. Returns the removed child if it was removed, otherwise returns `undefined`.

[]
~~~ts-header
sprite.removeDescendantWhere(filter: (descendant: Shape) => boolean) -> Shape | undefined
~~~
Calls `removeSelf()` on the first descendant of `sprite` that satisfies the `filter` function. Returns the removed descendant if it was removed, otherwise returns `undefined`. (Recursive.)

[]
~~~ts-header
sprite.removeChildrenWhere(filter: (child: Shape) => boolean) -> Shape[]
~~~
Removes all of the children of `sprite` that satisfy the `filter` function. Returns an array of the children that were removed.

[]
~~~ts-header
sprite.removeDescendantsWhere(filter: (descendant: Shape) => boolean) -> Shape[]
~~~
Calls `removeSelf()` on all of the descendants of `sprite` that satisfy the `filter` function. Returns an array of the descendants that were removed. (Recursive.)

[]
~~~ts-header
sprite.bringForward() -> this
~~~
Moves `sprite` forward one position in its parent's children array.

[]
~~~ts-header
sprite.sendBackward() -> this
~~~
Moves `sprite` backwards one position in its parent's children array.

[]
~~~ts-header
sprite.bringToFront() -> this
~~~
Moves `sprite` to the front of its parent's children array.

[]
~~~ts-header
sprite.sendToBack() -> this
~~~
Moves `sprite` to the back of its parent's children array.

