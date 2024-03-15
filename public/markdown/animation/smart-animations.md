# Smart Animations

A smart animation is a special [c:AnimationType]() where its `from` value (the starting value of the animation) or its `to` value (the ending value) is not hard-coded into the animation object. You can make a smart animation by setting the `from` to `null` and/or setting the `to` to a callback function.

[]
### From Null

You can set the `from` value of an animation to `null`. When the animation becomes active, the sprite will replace the `null` value with the current value of the property being animated. You can see a demo of this below; try clicking on the circles to see the difference between a smart animation and a normal animation.

[[[animation/from-null]]]

[]
### To Callback

You can set the `to` value of an animation to a callback function. When the animation becomes active, the sprite will call the function on the `from` value of the animation, and use the return value as the `to` value. You can see a demo of this below:

[[[animation/to-callback]]]
