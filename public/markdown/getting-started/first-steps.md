# First Steps

sharc (currently) supports eleven different graphics objects, called sprites, which store various properties like rotation, color, scale, etc. There are two main ways to draw sprites to a canvas. Let's go over the first method:

[]
## Creating a Stage (Recommended)
So the first step is to append a canvas element to the DOM. This can be done with HTML:

~~~html
<!DOCTYPE html>
<html lang="en">
    <head>
        ...
    </head>
    <body>
        <h1>Canvas: </h1>
        <canvas id="canvas" width="600" height="400"></canvas>
        </div>
</html>
~~~

[]
or with Javascript:

~~~js
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
canvas.width = 600;
canvas.height = 400;
document.body.appendChild(canvas);
~~~

[]

Now, that we have a canvas, we can create a stage. More details on how the Stage works can be found [here](stage), but basically a Stage is a container for sprites that automatically handles the animation loop, with a few other features. The first argument to the Stage constructor is the canvas we just created. The second argument is the rootStyle, which you can read more about [here](stage/usage/root-style). The third argument is the background color, which accepts a [c:ColorType](). Let's make the background blue to check if our stage works.

[[[getting-started/blue]]]

Okay, now let's draw two circles. Each Stage has a "root", which functions as an empty sprite. In order to draw sprites to the canvas, you have to append the sprites to the root as [children](sprites/parenting). And while we're at it, we'll import [c:Colors](utils/colors), which stores all of the CSS colors as ColorTypes.

[[[getting-started/starter]]]

[]
## Manual Drawing
Alternatively, you could also draw the sprites directly to the canvas without using a root. Every sprite has a draw() function that takes a `CanvasRenderingContext2D` or an `OffscreenCanvasRenderingContext2D` as its first argument. This is what the Stage class calls to draw the sprites each frame.

[[[getting-started/manual]]]
