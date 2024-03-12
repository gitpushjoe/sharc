# Terminology

[]

## aggregate property

See [Sprites/Properties]()

[]
## animation
See [Animation]() and [Types/Animation/AnimationType]().

[]
## animation package
An object containing:
- An array of animations stored in an animation channel.
- [Animation params](https://github.com/gitpushjoe/sharc/blob/main/src/sharc/types/Animation.ts#L39).

[Animation channels](animation/channels) use animation packages to store and manage the animations you pass to them. See [Types/Animation/AnimationPackage]().

[]
## animation params
See [Types/Animation/AnimationParams]().

[]
### bounds
Bounds refers to the rectangular bounding box around a shape, usually represented with a [BoundsType]() object. The rotation and scale of a sprite is always relative to the center of a shape, so the shape's bounds are used to determine its center. For example, [Line](), [Rect](), and [Image]() require a BoundsType object in their constructor. For the other sprites, the bounds are calculated right before the sprite is drawn. In order to modify the bounds of a sprite, you can set the bounds like this:

~~~js
mySprite.bounds = {x1: 0, y1: 0, x2: 100, y2: 100};
~~~

[]
or set each property individually:

~~~js
mySprite.x1 = 0;
mySprite.y1 = 0;
mySprite.x2 = 100;
mySprite.y2 = 100;
~~~

[]
This demo visualizes the bounds of some sprites using a dotted line:
[[[getting-started/bounds]]]

[]
### calculated property
See [Sprites/Properties]().

[]
### canvas unit
The width and the height of the canvas is measured in canvas units. So, if the canvas was initialized with its width set to 500, then the right of the canvas would be 500 canvas units from the left. However, because of CSS scaling and the device pixel ratio, the canvas might not actually be 500 pixels wide. The canvas unit is used to measure the bounds of sprites, and the position of the mouse when handling user input.

[]
### channel
A queue of animation packages. See [Channels]().

[]
### descendant
The children of a sprite, the children of thos children, and so on. See [Sprites/Parenting]().

[]
### event listener
See [Stage/Event Listeners](stage/event-listeners) or [Sprites/Event Listeners](sprites/event-listeners).

[]
### hidden property
See [Sprites/Properties]().

[]
### normal property
See [Sprites/Properties]().

[]
### property
Any aspect of a sprite that can be modified is called a property. This includes things like `color`, `rotation`, `strokeColor`, `radius`, `details`, `alpha`, `center`, etc. See [Sprites]().

[]
### shape
See [Sprites/The Base Shape Class](sprites/the-base-shape-class).

[]
### sprite
See [Sprites]().

[]
### stage
See [Stage]().
