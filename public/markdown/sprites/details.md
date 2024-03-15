# Details

Details is a way to store information directly on a sprite. Every sprite has a `details` property that is set to `undefined` by default. Also, in Typescript, the details property is typed as `any` by default, but this can also be changed. For example, imagine we wanted to store the following physics properties on an `Ellipse` sprite:

~~~ts
type PhysicsDetails = {
    velocity: PositionType,
    acceleration: PositionType,
};
~~~

In Typescript, we can declare an `Ellipse` sprite with `PhysicsDetails` as its `details` type like so:

~~~ts
const ellipse = new Ellipse<PhysicsDetails>({
    center: { x: -100, y: 100 },
    radius: 15,
    color: Colors.Yellow,
    stroke: {
        lineWidth: 5,
    },
    details: {
        velocity: { x: 0, y: 0 },
        acceleration: { x: 5, y: 0 },
    }
});
~~~

Then, we can access the details in any of our sprite's [event listeners](sprite/event-listeners).

[[[sprites/details]]]
