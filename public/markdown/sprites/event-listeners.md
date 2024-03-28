# Event Listeners

Like `Stage`s, sprites can also listen for events. 

You can attach a callback function to the Stage using `sprite.on(event, callback)` or `sprite.addEventListener(event, callback)`. These functions are identical. When the event is triggered, the `Sprite` will call the callback function on itself. Depending on which event was triggered, the callback will be passed different parameters.

[0]

In order to remove an event listener, use `sprite.removeEventListener(event, callback?)`. If the callback parameter is omitted, all event listeners for the specified event will be removed. 

[0]

You can use the `sprite.includeEventListener(event, callback)` method to add a callback to a sprite, and remove all other instances of the callback, making sure that it will only be called once.

[0]

If an event listener returns `true` or `1`, then the event listener will automatically detach itself. This can be used to have a specific action occur only a specific number of times, or to ensure that a particular action is only executed under certain conditions. As a result, **event listeners should always return nothing** (implicit return) **, return `0`, return `1`, return `true`, return `false`, or return `undefined`.** Also, note that only `true` or `1` will trigger this automatic cleanup behavior, not just any truthy value.

[1]
~~~ts-header
sprite.on('click', callback: (sprite: Sprite, callback: PointerEvent, position: PositionType, stage: Stage) => boolean | 0 | 1 | undefined)
~~~
The `callback` is called whenever the user presses down their mouse on the sprite. The `Sprite` will pass the `PointerEvent` object as event and the location of the click as `position`, relative to the sprite. The `stage` that the sprite is being drawn to will also be passed to the callback.

[]
~~~ts-header
sprite.on('drag', callback: (sprite: Sprite, event: PointerEvent, position: PositionType, stage: Stage) => boolean | 0 | 1 | undefined)
~~~
The `callback` is called if the sprite has been clicked on, and the user moves their mouse. The event listener works the same way as the one above, except that it is triggered only when the user moves their mouse.

[]
~~~ts-header
sprite.on('hold', callback: (sprite: Sprite, event: PointerEvent | undefined, position: PositionType, stage: Stage) => boolean | 0 | 1 | undefined)
~~~
Unlike `sprite.on('drag')`, the `callback` is called on every frame the sprite is being held down (regardless of if the mouse is currently on the sprite, or moving). Whenever the mouse moves, any `hold` event listener will be passed the `mousemove` event, otherwise `event` will be `undefined`.

[]
~~~ts-header
sprite.on('release', callback: (sprite: Sprite, event: PointerEvent, position: PositionType, stage: Stage) => boolean | 0 | 1 | undefined)
~~~
The `callback` is called if the sprite has been clicked on, and the user releases their mouse.

[]
~~~ts-header
sprite.on('hover', callback: (sprite: Sprite, event: PointerEvent, position: PositionType, stage: Stage) => boolean | 0 | 1 | undefined)
~~~
The `callback` is called on the first frame that a pointer hovers over the sprite. Note that the `PointerEvent` returned may or may not be a `mousemove` event.

[]
~~~ts-header
sprite.on('hoverEnd', callback: (sprite: Sprite, event: PointerEvent, position: PositionType, stage: Stage) => boolean | 0 | 1 | undefined)
~~~
The `callback` is called when the pointer stops hovering over the sprite. Note that the `PointerEvent` returned may or may not be a `mousemove` event.

[]
~~~ts-header
sprite.on('beforeDraw', callback: (sprite: Sprite, frame: number, stage: Stage) => boolean | 0 | 1 | undefined)
~~~
The `callback` is called before the sprite is drawn to the canvas. The `Stage` object is passed as stage and the current frame is passed as `frame`. This callback is useful for modifying the sprite's properties before it is drawn.

[]
~~~ts-header
sprite.on('animationFinish', (sprite: Sprite, animation: PrivateAnimationType<Properties & DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>) => boolean | 0 | 1 | undefined)
~~~
This callback is called when an animation finishes. The animation object is passed as `animation`. It returns a [c:PrivateAnimationType](https://github.com/gitpushjoe/sharc/blob/main/src/sharc/types/Animation.ts#L5), which also contains the channel that the animation came from.

[2]

### Targets

The `keyup`, `keydown`, and `scroll` events work using a "target" system. Every `Stage` has a public `keyTarget` and `scrollTarget` property (not like sprite properties), both of which are strings that default to `""`. **Note that sprites with name `""` will never be considered valid targets.** Whenever a stage is drawn, every sprite's `keydown` and `keyup` event listeners will be called on any `keydown` and `keyup` events, respectively, **as long as the sprite has the same name as the stage's `keyTarget`.** The same is true for `scroll` events and `scrollTarget`.

[0]

`Stage`s also have a `resetKeyTargetOnClick` and `resetScrollTargetOnClick` public property, both of which default to `true`. If these properties are set to `true`, then the `keyTarget` and `scrollTarget` will be reset to `""` whenever the mouse is released over a part of the stage that does not cover the current key or scroll targets.


[]
~~~ts-header
sprite.on('keyup', (sprite: Sprite, event: KeyboardEvent, stage: Stage) => boolean | 0 | 1 | undefined)
~~~

[]
~~~ts-header
sprite.on('keydown', (sprite: Sprite, event: KeyboardEvent, stage: Stage) => boolean | 0 | 1 | undefined)
~~~

[]
~~~ts-header
sprite.on('scroll', (sprite: Sprite, event: WheelEvent, stage: Stage) => boolean | 0 | 1 | undefined)
~~~

[2]

### Wrappers

sharc supports a few helper functions for the `beforeDraw` event listener. They will add a new event listener that wraps around the callback agrument, and returns the attached listener. This means that if you wish to remove the event listener, you can call `sprite.removeEventListener("beforeDraw", callback)`.

~~~ts
type StageEventCallback = (sprite: Sprite, frame: number, stage: Stage) => boolean | 0 | 1 | undefined;
~~~


~~~ts-header
sprite.schedule(frame: number, callback: StageEventCallback) => StageEventCallback
~~~
This function will call `callback` when the sprite is drawn to a stage with a `currentFrame` greater than or equal to `stage`. When `callback` is run, the listener will immediately return `true`, so `callback` will only be called once, and the listener will detach itself.

[]
~~~ts-header
sprite.selfSchedule(frame: number, callback: StageEventCallback) => StageEventCallback
~~~
Works identically to `sprite.schedule`, but use's the sprite's `currentFrame` instead of the stage's.

[]
~~~ts-header
sprite.scheduleExactly(frame: number, callback: StageEventCallback) => StageEventCallback
~~~
This function will call `callback` when the sprite is drawn to a stage with a `currentFrame` equal to `stage`. When `callback` is run, the listener will immediately return `true`, so `callback` will only be called once, and the listener will detach itself.

[]
~~~ts-header
sprite.selfScheduleExactly(frame: number, callback: StageEventCallback) => StageEventCallback
~~~
Works identically to `sprite.scheduleExactly`, but use's the sprite's `currentFrame` instead of the stage's.

[]
~~~ts-header
sprite.delay(frame: number, callback: StageEventCallback) => StageEventCallback
~~~
This function will attempt to call `callback` in `frame` frames. It does this by trying to find the stage that the sprite is attached to, saving the current frame, and then adding a `beforeDraw` event listener that will call `callback` when the current frame is equal to the saved frame plus `frame`. As such, if the sprite is not attached to a frame, this function will throw an error. The resulting listener will also return `true` when `callback` is called, so it will only be called once.

[]
~~~ts-header
sprite.selfDelay(frame: number, callback: StageEventCallback) => StageEventCallback
~~~
Works identically to `sprite.delay`, but use's the sprite's `currentFrame` instead of the stage's.

[]
~~~ts-header
sprite.when(condition: (sprite: Sprite) => boolean, callback: StageEventCallback) => StageEventCallback
~~~
This function will call `callback` when `condition(sprite)` is `true`. Unlike the previous functions, the return value of `callback` will be returned, i.e., `condition` decides whether or not it should be detached.

[]
~~~ts-header
sprite.whenStage(condition: (stage: Stage) => boolean, callback: StageEventCallback) => StageEventCallback
~~~
Works identically to `sprite.when`, but the condition is checked against the stage instead of the sprite.

[]

