# Channels

Every sprite comes with any number of channels, which are basically parallel animation queues. All of the channels are initialized knowing the properties of the sprite it came from. Every time the sprite is rendered, all of its channels will advance by one step, and the sprite will be updated accordingly. Once the current animation in a channel completes, it will be removed from the queue. In order to access a sprite's channels, use `sprite.channels`.

[]

_* Note: for simplicity, `AnimationType`, `PrivateAnimationType`, and `AnimationPackage` will refer to `AnimationType<Properties>`, `PrivateAnimationType<Properties>`, and `AnimationPackage<Properties>`, respectively, where `Properties` is the properties type of the sprite that the channel belongs to._

_Furthermore, `DEFAULT_PARAMS == {loop: false, iterations: 1, delay: 0}` ._

[]
### Channel Functions

~~~ts-header
channel.push(animations: AnimationType|AnimationType[], params: AnimationParams = DEFAULT_PARAMS) -> this
~~~
Adds an array of animations to the rear of the channel queue. If one animation is passed, it will be wrapped in an array. This function creates an [c:AnimationPackage]() from animations and params, and then adds it to the channel queue.

[]
~~~ts-header
channel.unshift(animations: AnimationType|AnimationType[], params: AnimationParams = DEFAULT_PARAMS) -> this
~~~
Adds an array of animations directly to the front of the channel queue. If one animation is passed, it will be wrapped in an array.

[]
~~~ts-header
channel.pop() -> AnimationPackage|undefined
~~~
Removes the animation at the rear of the channel queue and returns it.

[]
~~~ts-header
channel.shift() -> AnimationPackage|undefined
~~~
Removes the current animation at the front of the channel queue and returns it.

[]
~~~ts-header
channel.clear() -> this
~~~
Removes all animations from the channel queue.

[]
~~~ts-header
channel.shiftAnimation() -> AnimationType|undefined
~~~
Removes the current animation (NOT animation package) at the front of the channel queue and returns it. If the current animation package becomes empty, it will be removed from the queue.

[]
~~~ts-header
channel.popAnimation() -> AnimationType|undefined
~~~
Removes the animation (NOT animation package) at the rear of the channel queue and returns it. If the current animation package becomes empty, it will be removed from the queue.

[]
~~~ts-header
channel.stepForward() -> PrivateAnimationType|null
~~~
Steps the channel forward by one frame. If the current animation package becomes empty, it will be removed from the queue. Returns the current animation as a `PrivateAnimationType`, containing the current frame of the animation, as well as the index from which it came. Automatically called by sprites on all channels when they are drawn to advance their animations.

[]
~~~ts-header
channel.enqueue(animations: AnimationType|AnimationType[], index: number = 1, params: AnimationParams = DEFAULT_PARAMS) -> this
~~~
Creates an animation package, and tries to place it at position `index` of the current package. If the index is greater than or equal to the length of the package, the animation will be pushed to the rear of the package. This can be used to throttle several animations sent to a sprite over a short period of time to avoid overloading the channel queue.

You can see a demonstration of this below. Hover your mouse around the canvas. For every frame that a `pointerMove` event is detected, `enqueue` will be called on the red circle, however the circle will never have more than 2 animations in its queue at a time. Furthermore, you will notice that as long as your mouse stays still, the circle will arrive there within 20 frames, but no animation package will ever be interrupted by another animation package.

[[[animation/channels]]]
