# Event Listeners

The `Stage` class provides event handling capabilities using event listeners. You can attach a callback function to the Stage using `stage.on(event, callback)` or `stage.addEventListener(event, callback)`. These functions are identical. When the event is triggered, the `Stage` will call the callback function on itself. Depending on which event was triggered, the callback will be passed different parameters.

[0]

In order to remove an event listener, use `stage.removeEventListener(event, callback?)`. If the callback parameter is omitted, all event listeners for the specified event will be removed. 

[0]

You can use the `stage.includeEventListener(event, callback)` method to add a callback to a stage, and remove all other instances of the callback, making sure that it will only be called once.

[0]

If an event listener returns `true` or `1`, then the event listener will automatically detach itself. This can be used to have a specific action occur only a specific number of times, or to ensure that a particular action is only executed under certain conditions. As a result, **event listeners should always return nothing** (implicit return) **, return `0`, return `1`, return `true`, return `false`, or return `undefined`.** Also, note that only `true` or `1` will trigger this automatic cleanup behavior, not just any truthy value.

[1]

The following events are supported:

[]

~~~ts-header
stage.on('click', (stage: Stage, position: PositionType, event: PointerEvent) => boolean | 0 | 1 | undefined)
~~~
This callback is called whenever the user presses down on the canvas with the left or right mouse button, or with a touch screen. The `Stage` will pass the `PointerEvent` object as `event` and the location of the click as `position`, **relative to the canvas**.
[[[stage/click]]]

[]
~~~ts-header
stage.on('move', (stage: Stage, position: PositionType, event: PointerEvent) => boolean | 0 | 1 | undefined)
~~~
This callback is triggered whenever the user moves their pointer. The event listener works the same way as the one above, except that it is triggered on every frame that the pointer is moved.

[2]
~~~ts-header
stage.on('release', (stage: Stage, event: PointerEvent, position: PositionType) => boolean | 0 | 1 | undefined)
~~~
This callback is triggered whenever the user releases their pointer. The event listener works the same way as the one above, except that it is triggered when the user releases their pointer.

[2]
~~~ts-header
stage.on('scroll', (stage: Stage, event: WheelEvent) => boolean | 0 | 1 | undefined)
~~~
This callback is triggered whenever the user scrolls the mouse wheel. Unlike the previous two functions, this one only takes one parameters: a `WheelEvent` object.
[[[stage/scroll]]]

[]
~~~ts-header
stage.on('beforeDraw', (stage: Stage, frame: number) => boolean | 0 | 1 | undefined)
~~~
This callback is triggered before the animation loop. The callback is passed the `Stage` object and the current frame number. This callback is useful for modifying the Stage before it is drawn. In the demo below, the background color is changed every other frame. The framerate is slowed down to 1 frame every 4 seconds to prevent flickering.
[[[stage/beforedraw]]]

[]
~~~ts-header
stage.on('keydown', (stage: Stage, event: KeyboardEvent) => boolean | 0 | 1 | undefined)
~~~
This callback is triggered whenever a key is pressed down. The callback is passed a `KeyboardEvent` object. Note that the canvas needs to have a `tabIndex` attribute in order to receive keyboard events.
[[[stage/keydown]]]

[]
~~~ts-header
stage.on('keyup', (stage: Stage, event: KeyboardEvent) => boolean | 0 | 1 | undefined)
~~~
This callback is triggered whenever a key is released. It works similary to the above `keydown` event.
