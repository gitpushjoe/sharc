# Async Stages

_[ * Note: As of v2.0.0, this is no longer a beta feature. ]_

_[ * Also, this page will solely use Typescript for its examples, but this feature is also available in Javascript. ]_

[]

The `OffscreenStage` class and the `WorkerStage` class are used in tandem to render sprites off the main thread. This is useful for rendering complex scenes that would otherwise cause the main thread to lag, and often produces a more consistent framerate. Scroll to the bottom to see a simple example of how to use these stages.

[]
### OffscreenStage
~~~ts-header
new OffscreenStage<RootDetailsType, MessageType>(canvas: HTMLCanvasElement, worker: Worker, rootStyle: 'classic'|'centered')
~~~
The `OffscreenStage` class is a facade for the `WorkerStage` class. It takes in a `canvas` parameter and a `rootStyle` parameter, just like the `Stage` class. It also takes in a `worker` parameter, which should be a worker thread containing a `WorkerStage`. More information on how to properly instantiate a `WorkerStage` can be found below, as well as the use of the `MessageType` parameter. The `OffscreenStage` class has the same methods as the `Stage` class, with a few important changes.

[]
~~~ts-header
offscreenStage.root
~~~
Raises an error. The root sprite of an `OffscreenStage` is not accessible, because all of the rendering is done on a separate thread, by a `WorkerStage` instance.

[]
~~~ts-header
offscreenStage.draw()
~~~
Currenlty only works in conjunction with `offscreenStage.loop()`.

[]
~~~ts-header
offscreenStage.loop(framerate = 60)
~~~
Sends a message to the `WorkerStage` to start the animation loop. Upon creating an `OffscreenStage` instance, a message will immediately be sent to the worker parameter to ready the `WorkerStage` instance, which will send a ready message back. If, by the time the `offscreenStage.loop()` method is called, the `WorkerStage` instance is not ready, the method will print a warning to the console and return.

[]
~~~ts-header
offscreenStage.stop()
~~~
Similarly to the `loop()` method, this method sends a message to the WorkerStage to stop the animation loop.

[]
~~~ts-header
offscreenStage.currentFrame
~~~
Note that the current frame number is informed from the `WorkerStage` instance, and not from the `OffscreenStage` instance.

[]
~~~ts-header
offscreenStage.addEventListener(event, callback)
offscreenStage.on(event, callback)
~~~
Note that event listeners will not be transferred to the `WorkerStage` instance, as functions are not cloneable. Also, `"message"` is now a valid keyword for the event parameter. This will be explained in further depth below.

[]
~~~ts-header
offscreenStage.postCustomMessage(message: MessageType)
~~~
This method is unique to the `OffscreenStage` class, and will be explained in further depth below.

[]

### WorkerStage
~~~ts-header
new WorkerStage<RootDetailsType, MessageType>(_postMessage: (message: AsyncMessage<MessageType>) => void, rootStyle: 'classic'|'centered', bgColor: ColorType = Colors.White)
~~~
The `WorkerStage` class runs on a worker thread, and is used in conjunction with the `OffscreenStage` class. The `WorkerStage` class will use the `_postMessage` parameter to send messages to the main thread. As such, it makes sense to use the `postMessage` method of the worker thread as the `_postMessage` parameter. However, you could also pass a wrapper function that calls the `postMessage` method, if you want to add additional functionality or monitoring. The `WorkerStage` class also inherits from the Stage class, and is used much in the same way. However, there are a few important differences.

[]
~~~ts-header
workerStage.onmessage: (event: MessageEvent<AsyncMessage<MessageType>>) => void
~~~
This message is unique to the WorkerStage class. It is the event listener that will be called whenever the worker thread receives a message from the main thread. Be sure to set the onmessage property of the worker thread to this event listener, or to a function that calls this event listener.

[]
~~~ts-header
workerStage.addEventListener(event, callback)
workerStage.on(event, callback)
~~~
Note that `"message"` is now a valid keyword for the event parameter. This will be explained in further depth below.

[]
~~~ts-header
workerStage.postCustomMessage(message: MessageType)
~~~
This method is unique to the WorkerStage class, and will be explained in further depth below.

[]
~~~ts-header
workerStage.stop()
~~~
Note that this will stop the animation loop of the worker thread, as well as send a message to its associated `OffscreenStage` in the main thread to stop its animation loop.

[]
### How does it work?
You will need to create two separate files: one for the main thread and one for the worker thread. On the main thread, create a `Worker` instance, using the path to the worker thread. The worker thread should import the `WorkerStage` class, and create an instance of it. In order for the `WorkerStage` to communicate with the `OffscreenStage`, you will need to set the `onmessage` property of the `worker thread` to the `onmessage` property of the `WorkerStage` instance. Once the worker thread is ready, it will send the message `{ type: "ready" }` to the main thread, which can be tracked with the `OffscreenStage.on('message', callback)` method. Below is a minimal example of how to set up these two classes.

~~~ts
// main.ts 
import { OffscreenStage } from "sharc-js/async_stages/OffscreenStage";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
const stage = new OffscreenStage(canvas, worker);

// This check is often uneccesary; the worker thread is usually ready by the time the OffscreenStage is created.
stage.on("message", function (msg) {
        if (msg.type == "ready") { 
                stage.loop();
        }
});


// worker.ts
import { WorkerStage } from "sharc-js/async_stages/WorkerStage";

const stage = new WorkerStage(postMessage.bind(null));
onmessage = stage.onmessage;
~~~

Once the loop method is called on the `OffscreenStage` instance, it will send the current state of the canvas (including width, height, and events) to the worker thread. It does this three times per frame. The worker thread will then use this information to render the sprites on the canvas, and send the bitmap of the canvas back to the main thread, once per frame. Whenever the main thread receives this message, which will have its type parameter set to `"render"`, it will draw the bitmap to the canvas. The type of the `callback` parameter in both `OffscreenStage.on("message", callback)` and `WorkerStage.on("message", callback)` is `(message: AsyncMessage<MessageType>) => void`. The full specification of `AsyncMessage` can be found [here](https://github.com/gitpushjoe/sharc/blob/main/src/sharc/types/Stage.ts#L87).

[]
### What about PointerEvents?
For the main thread, the `OffscreenStage` class can handle pointer and wheel events just fine using its event listeners. However, `PointerEvent` objects are not cloneable. To get around this, copies of each pointer and wheel event (containing only the most pertinent information) are sent to the worker thread thrice per frame. That way, mouse- and wheel-related event listeners can be added to both sprites and the `WorkerStage` instance on the worker thread, and they will function just as if they were on the main thread.

However, you may run into the issue of wanting to detect a click on a specific sprite on the worker thread, and perform an action on the main thread. This is why both the `OffscreenStage` and `WorkerStage` classes take in a `MessageType` parameter (defaults to any). Both threads will assume that the other thread is using the same `MessageType` generic. You can pass messages from thread to thread with either class with `postCustomMessage(message: MessageType)`. The other thread will receive this message with the `"message"` event listener, and its type will be `"custom"`. Here is an example of how to use this feature:

[[[stage/async-stages]]]
