# Event Listeners

The `Stage` class provides event handling capabilities using event listeners. You can attach a callback function to the Stage using `stage.on(event, callback)` or `stage.addEventListener(event, callback)`. These functions are identical. In order to remove an event listener, use `stage.removeEventListener(event, callback?)`. If the callback parameter is omitted, all event listeners for the specified event will be removed. When the event is triggered, the Stage will call the callback function on itself, using the `Stage` itself as this. As a result, if you want to modify the Stage from within the callback, **you must use named functions and not anonymous/arrow functions**. Depending on which event was triggered, the callback will be passed different parameters. The following events are supported:

[]
~~~ts-header
stage.on('click', function (this: Stage, event: PointerEvent, position: PositionType) { ... })
~~~
This callback is called whenever the user presses down on the canvas with the left or right mouse button, or with a touch screen. The `Stage` will pass the `PointerEvent` object as `event` and the location of the click as `position`, **relative to the canvas**.
[[[stage/click]]]

[]
~~~ts-header
stage.on('move', function (this: Stage, event: PointerEvent, position: PositionType) { ... })
~~~
This callback is triggered whenever the user moves their pointer. The event listener works the same way as the one above, except that it is triggered on every frame that the pointer is moved.

[2]
~~~ts-header
stage.on('release', function (this: Stage, event: PointerEvent, position: PositionType) { ... })
~~~
This callback is triggered whenever the user releases their pointer. The event listener works the same way as the one above, except that it is triggered when the user releases their pointer.

[2]
~~~ts-header
stage.on('scroll', function (this: Stage, event: WheelEvent) { ... })
~~~
This callback is triggered whenever the user scrolls the mouse wheel. Unlike the previous two functions, this one only takes one parameters: a `WheelEvent` object.
[[[stage/scroll]]]

[]
~~~ts-header
stage.on('beforeDraw', function (this: Stage, frame: number) { ... })
~~~
This callback is triggered before the animation loop. The callback is passed the `Stage` object and the current frame number. This callback is useful for modifying the Stage before it is drawn. In the demo below, the background color is changed every other frame. The framerate is slowed down to 1 frame every 4 seconds to prevent flickering.
[[[stage/beforedraw]]]


[]
~~~ts-header
stage.on('keydown', function (this: Stage, event: KeyboardEvent) { ... })
~~~
This callback is triggered whenever a key is pressed down. The callback is passed a `KeyboardEvent` object. Note that the canvas needs to have a `tabIndex` attribute in order to receive keyboard events.
[[[stage/keydown]]]
