# Event Listeners

Like `Stage`s, sprites can also listen for events. You can attach a callback function to a sprite using `sprite.addEventListener(event, callback)` (or the identical `sprite.on(event, callback)`). You can also remove a callback function using `sprite.removeEventListener(event, callback?)` (if you don't pass a callback, all callbacks for that event will be removed). When the event is triggered, the callback function will be called with the sprite as the first argument, using the sprite itself as `this`. As a result, if you want to modify the sprite from within the callback, **you must use named functions and not anonymous/arrow functions.** Depending on which event was triggered, the callback will be passed different parameters. The following events are supported:

[]
~~~ts-header
sprite.on('click', function (this: Sprite, event: PointerEvent, position: Point) {...})
~~~
This callback is called whenever the user presses down their mouse on the sprite. The `Sprite` will pass the `PointerEvent` object as event and the location of the click as `position`, relative to the sprite.

[]
~~~ts-header
sprite.on('drag', function (this: Sprite, event: PointerEvent, position: Point) {...})
~~~
This callback is called if the sprite has been clicked on, and the user moves their mouse. The event listener works the same way as the one above, except that it is triggered only when the user moves their mouse.

[]
~~~ts-header
sprite.on('release', function (this: Sprite, event: PointerEvent, position: Point) {...})
~~~
This callback is called if the sprite has been clicked on, and the user releases their mouse.

[]
~~~ts-header
sprite.on('hover', function (this: Sprite, event: PointerEvent, position: Point) {...})
~~~
This callback is called on the first frame that a pointer hovers over the sprite. Note that the `PointerEvent` returned may or may not be a `mousemove` event.

[]
~~~ts-header
sprite.on('hoverEnd', function (this: Sprite, event: PointerEvent, position: Point) {...})
~~~
This callback is called when the pointer stops hovering over the sprite. Note that the `PointerEvent` returned may or may not be a `mousemove` event.

[]
~~~ts-header
sprite.on('scroll', function (this: Sprite, event: WheelEvent) {...})
~~~
This callback is called when the user scrolls while the pointer is hovering over the sprite.

[]
~~~ts-header
sprite.on('beforeDraw', function (this: Sprite, stage: Stage, frame: number) {...})
~~~
This callback is called before the sprite is drawn to the canvas. The `Stage` object is passed as stage and the current frame is passed as `frame`. This callback is useful for modifying the sprite's properties before it is drawn.

[]
~~~ts-header
sprite.on('animationFinish', function (this: Sprite, animation: PrivateAnimationType<Properties & DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>) {...})
~~~
This callback is called when an animation finishes. The animation object is passed as `animation`. It returns a [c:PrivateAnimationType](https://github.com/gitpushjoe/sharc/blob/main/src/sharc/types/Animation.ts#L5), which also contains the channel that the animation came from.
