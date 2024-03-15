# Sprites

Sprites are the building blocks of sharc. They are the objects that are drawn to the canvas. Sprites can be added to the stage's root, or to other sprites. Sprites can be moved, rotated, scaled, animated, and more. For each Sprite subclass, there is a corresponding [c:Properties](sprites/properties) type. Each sprite supports these function:

[]
~~~ts-header
sprite.draw(ctx: CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D, properties?: Properties, isRoot?: boolean)
~~~
This function draws the sprite to the canvas. It is automatically called by the `Stage` class. `ctx` is the canvas context to draw the sprite to. `properties` is an object that contains the properties of the sprite you are trying to draw. Each subclass of `Sprite` has its own properties type, and will automatically fill this parameter with the sprite's properties. `isRoot` is a boolean that defaults to true. It's used for determining priority in pointer events.

[]
~~~ts-header
sprite.animate() -> this
~~~
Advances all of the sprite's [animation channels](animation/channels) by one frame.

[]
~~~ts-header
sprite.addChild(child: Shape) -> Shape
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.addChildren(children: Shape[]) -> Shape
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.removeChild(child: Shape) -> Shape
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.removeChildren(children: Shape[]) -> Shape
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.children -> Shape[]
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.r_getChildren() -> Shape[]
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.parent -> Shape|undefined
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.root -> Shape
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.logHierarchy() -> void
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.findChild(name: string) -> Shape|undefined
~~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.findChildren(name: string) -> Shape[]
~~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.r_findChild(name: string) -> Shape|undefined
~~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.r_findChildren(name: string) -> Shape[]
~~~
See [Sprites/Parenting](sprites/parenting).

[]
~~~ts-header
sprite.addEventListener(event: string, callback: Function) -> this
~~~
See [Sprites/Event Listeners](sprites/event-listeners).

[]
~~~ts-header
sprite.removeEventListener(event: string, callback?: Function) -> this
~~~
See [Sprites/Event Listeners](sprites/event-listeners).

[]
~~~ts-header
sprite.on(event: string, callback: Function) -> this
~~~
See [Sprites/Event Listeners](sprites/event-listeners).

[]
~~~ts-header
sprite.channels: Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[]
~~~
See [Animation/Channels](animation/channels).

[]
~~~ts-header
sprite.distribute(animations: AnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[][], params: AnimationParams = { loop: false, iterations: 1, delay: 0}) -> this
~~~
See [Animation/Distribute](animation/distribute).

[]
~~~ts-header
sprite.createChannels(count: number) -> this
~~~
Creates `count` new animation channels.

[]
~~~ts-header
sprite.copy() -> this
~~~
Returns a deep copy of the sprite.
