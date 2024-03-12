# Usage

[]
### Choosing a Root Style

Every `Stage` comes with a root sprite that represents the center of the canvas. As explained in the [previous page](stage), there are two root styles: `'classic'`, and `'centered'`. With classic root nodes, the root is placed in the top-left corner. If there's no scaling, a positive y-value is lower on the canvas than a negative y-value. Move your mouse around in the canvas below to see a demo of how this works. To better understand how to make this demo, see [Event Listeners](stage/event-listeners).

[[[stage/usage]]]

With centered root nodes, the origin of the canvas is placed in the center. The y-axis of the root node is also flipped, so that a positive y-value is higher on the canvas than a negative y-value. As a result, the canvas works more like a traditional Cartesian plane.

[[[stage/usage-centered]]]

[]
## Rendering Sprites
From now on, all canvases will be using the centered root style. To render sprites, you need to add them as descendants of the root sprite. Child sprites inherit the [rotation, scaling, and translation* of their parent](sprite/parenting). So if you want to draw a square in the center of the canvas while using a centered root node, you would position it at (0, 0). Since the root node is a NullSprite itself, its properties can be modified just like any other sprite, which will affect all of its children. The following demo illustrates this, [animating](animation) the rotation of the root from 0 to 360 and the scale from 1 to 2.
Once you're done adding sprites, you can start the animation loop with `stage.loop()` and stop it with `stage.stop()`.

[[[stage/rendering]]]
