
<img src='https://i.imgur.com/mXuQAt2.png' alt='sharc logo' width=200>

## A graphics & animation library for Typescript.

**sharc**, short for **Sh**apes and **A**nimations **R**endered on a **C**anvas, is an object-oriented Typescript library that aims to make using the HTML Canvas API simpler and faster. It features:
- graphics primitives like lines, rounded rectangles, bezier curves, text, and more
- a `Stage` class that handles the animation loop for you
- shape nesting to build complex structures
- pointer event detection relative to a sprite's scaling, rotation, transformation
- a robust animation system that lets you add several animations to a sprite in a single line of code
- a vast properties system that makes modifying sprites a breeze
- type-safety!

---

### Getting Started

#### NPM

This is the simplest way to install sharc. Just run this command in your terminal:

~~~txt
$ npm install sharc-js
~~~

#### Github

If you're using Typescript, you can also just download the source code from Github. Just clone the repository into your project:

~~~txt
$ git clone https://github.com/gitpushjoe/sharc.git
$ cd sharc
$ git sparse-checkout set --no-cone sharc
$ git checkout
~~~

---

### Usage

sharc provides a Stage class that handles the animation loop, pointer events, and keypresses for you. Here's a simple example of creating a Stage with a blue background:

~~~ts
import { Stage } from 'sharc-js/Stage';
import { Colors } from 'sharc-js/Utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'classic', Colors.Blue);

stage.loop();
~~~

#### Sprites

Then, you can create sprites and add them to the stage. Every stage has a root sprite that you can add children to, creating a tree of sprites. Here's an example of creating a red circle with a dotted brown outline:

~~~ts
import { Ellipse } from 'sharc-js/Sprites'

const circle = new Ellipse({
    color: Colors.Red,
    radius: 100,
    center: { x: 50, y: -50 },
    stroke: {
        color: Colors.Pink,
        lineWidth: 10,
        lineDash: 30,
        lineDashGap: 20
    },
});

stage.root.addChild(circle);
~~~

#### Animations

Animations in sharc work using a "channels" system. Every sprite comes with any number of channels, which are basically parallel animation queues. All of the channels are initialized knowing the properties of the sprite it came from. Every time the sprite is rendered, all of its channels will advance by one step, and the sprite will be updated accordingly. Once the current animation in a channel completes, it will be removed from the queue. Here is an example of how you can make a simple [bouncing ball animation](https://www.sharcjs.org/#/docs/animation/distribute) using sharc:

~~~ts
circle.createChannels(1); // every sprite is created with 1 channel by default
circle.channels[0].push(
    [
        {
            property: 'centerX',
            from: -stage.width! / 2 + circle.radiusX / 2,
            to: stage.width! / 2 - circle.radiusX / 2,
            duration: 100,
            delay: 0,
            easing: Easing.Bounce(Easing.LINEAR),
        }
    ],
    {loop: true});
circle.channels[1].push(
    [ 
        {
            property: 'centerY',
            from: 20,
            to: -stage.height! / 2 + circle.radiusY / 2,
            duration: 40,
            delay: 0,
            easing: Easing.Bounce(Easing.EASE_OUT),
        }
    ],
    {loop: true});
~~~

#### Properties

sharc also supports a vast properties system that lets you modify sprites quickly and easily. For example, if you wanted to change the color of the circle to green, you could do this:

~~~ts
circle.color = Colors.Green;
~~~

or this:

~~~ts
circle.red = 0;
circle.green = 255;
circle.blue = 0;
~~~

Some properties are stored as-is, like `red`; some properties are collections of other properties, like `color`; and some properties are calculated from other properties, like `centerX` and `centerY`. All of these properties can be retrieved, modified, and animated in the exact same way! **sharc currently has more than 100 unique properties across eleven core sprite primitives.**

---

### Documentation

For more information on how to use sharc, check out the [official documentation](https://www.sharcjs.org).

---

### License

sharc is licensed under the MIT License. You can find the full license text [here](https://github.com/gitpushjoe/sharc/blob/main/LICENSE).


