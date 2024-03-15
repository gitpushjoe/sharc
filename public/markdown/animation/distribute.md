# Distribute

~~~ts-header
sprite.distribute( animations: AnimationType<Properties>[][], params: AnimationParams = { loop: false, iterations: 1, delay: 0 } )
~~~

Another way you can push animations to a sprite is by using the sprite's `distribute` function. This function takes an array of animation arrays, and tries to push `animations[0]` to the sprite's first channel, `animations[1]` to the sprite's second channel, etc. It will also apply `params` to all of the animation packages it creates. If there are not enough channels to distribute all of the animations, an error will be raised.

[[[animation/distribute]]]
