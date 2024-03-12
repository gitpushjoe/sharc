# Stage
The Stage class provides an interface for creating and managing an animation loop, as well as pointer events and scroll events on the canvas. Each stage has a root `Sprite`. The root is a [c:NullSprite](), so it doesn't actually render anything. Instead, it serves as a container for all other sprites.

[]
[]
~~~ts-header
new Stage<RootDetailsType>(canvas, rootStyle, bgColor)
~~~

`bl:RootDetailsType` - this generic type parameter will set the details type of the root sprite.

`bl:canvas: HTMLCanvasElement` - the canvas to draw sprites to.

`bl:rootStyle: 'classic'|'centered'` - If the root style is set to `'classic'`, then the root sprite will be positioned in the top-left corner of the canvas. If you've used the canvas API before, coordinates will work much the way you would expect. Positive X correlates to moving right, and positive Y correlates to moving down. If the root style is set to `'centered'`, then the root sprite will be positioned in the center of the canvas and its scaleY will be set to -1. In this case, positive X correlates to moving right, and positive Y correlates to moving up.

`bl:bgColor: ColorType` - the background color of the canvas.

[]
~~~ts-header
stage.loop(framerate) -> void
~~~

`bl:framerate: number` - the framerate of the animation loop.
Starts the animation loop at the specified fra\merate, resetting the frame counter to 0. If the animation loop is already running, it will be stopped and restarted.

[]
~~~ts-header
stage.draw() -> void
~~~
Draws all sprites, advancing their [animation channels](). Called automatically by `stage.loop()`.

[]
~~~ts-header
stage.stop() -> void
~~~
Stops the animation loop.

[]
~~~ts-header
stage.root -> NullSprite
~~~
The root sprite. To draw sprites to the stage, they should be either added as [children](sprites/parenting) of the root sprite, or as children of those sprites, and so on and so on.

[]
~~~ts-header
stage.width -> number
~~~
Returns the width of the canvas in canvas units.

[]
~~~ts-header
stage.height -> number
~~~
Returns the height of the canvas in canvas units.

[]
~~~ts-header
stage.lastRenderMs -> number
~~~
The amount of time the last render took in milliseconds.

[]
~~~ts-header
stage.currentFrame: number
~~~
The current frame of the animation loop.

[]
~~~ts-header
stage.addEventListener(event: string, callback: Function)
~~~
See [Event Listeners](stage/event-listeners).

[]
~~~ts-header
stage.on(event: string, callback: Function)
~~~
See [Event Listeners](stage/event-listeners).

[]
~~~ts-header
stage.removeEventListener(event: string, callback?: Function)
~~~
See [Event Listeners](stage/event-listeners).
