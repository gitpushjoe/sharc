# Properties

`Properties` defines the attributes and attribute types that a sprite can have. For example, the type `LineProperties` contains `{lineWidth?: number}` and the type `Polygon` contains `{sides: number}`. Each sprite type [implements](https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses) its own `Properties` type (`Line` implements `LineProperties`, `Rect` implements `RectProperties`, etc.). This means you can access and modify these properties directly on the sprite, and if you're using Typescript, they will be typed correctly.

~~~ts
const circle = new Ellipse({});
circle.color = {red: 255, green: 0, blue: 0, alpha: 1};
const radius = circle.radius; 
circle.radius = radius + '10'; // Type 'string' is not assignable to type 'number | [number, number]'.
~~~

### Property Visibility and Type
Many of the properties seem to overlap with each other (for example, the `color` property and the `red` property) so it may be unclear how this information is actually stored or retrieved. Because of this, every property has been given a **visibility** and a **type**.

[]
#### Property Visibility
**Visible Properties** are passed into the constructor. For example, all of the properties in `TextProperties` are visible, since in order to make a `TextSprite`, you must first pass in a `TextProperties` object. For the rest of this documentation, **every property that is not explicitly stated as hidden is visible.**

[]

**Hidden Properties** are not passed into the constructor, but are still accessible. For example, if you want to make a `Rect`, you can specify the color by passing in a [c:ColorType]() object, which contains values for `red`, `green`, `blue`, and `alpha`. Then, if you want to change the `green` property specifically, you can do that as well.

~~~ts
const rect = new Rect({color: {red: 255, green: 0, blue: 0, alpha: 1}});
rect.green = 255;
~~~

[]
#### Property Type
**Normal Properties** are atomic. They are stored as-is, and do not affect any other normal properties. For example, here is the source code for the property `x1`:

~~~ts
public get x1(): number { return this.properties.x1; }
public set x1(value: number) { this.properties.x1 = value; }
~~~

[]

**Aggregate Properties** are properties that consist of other normal properties. Retrieving or modifying an aggregate property will retrieve or modify the normal properties that make it up. For example, here is the source code for the property bounds:

~~~ts
public get bounds(): BoundsType { return Corners(this.x1, this.y1, this.x2, this.y2); }
public set bounds(value: BoundsType) { 
    this.x1 = value.x1;
    this.y1 = value.y1;
    this.x2 = value.x2;
    this.y2 = value.y2;
}
~~~

[]

**Calculated Properties** are calculated from other properties. They aren't simply made up of other properties, but are calculated from them. For example, here is the source code for the property width:

~~~ts
public get width(): number { return Math.abs(this.x2 - this.x1); }
public set width(value: number) { 
    const centerX = this.centerX;
    this.x1 = centerX - value / 2;
    this.x2 = centerX + value / 2;
}
~~~

[]

#### Universal Sprite Properties

(Note: This correlates to the types DEFAULT_PROPERTIES and HIDDEN_SHAPE_PROPERTIES.)

`bl:bounds: BoundsType` - the bounds of the sprite. Defaults to {x1: 0, y1: 0, x2: 0, y2: 0}. Aggregate Property for x1, y1, x2, and y2.

_* Note that [c:BezierCurve](), [c:Path](), [c:Ellipse](), [c:Polygon](), and [c:TextSprite](), and [c:LabelSprite]() do not use bounds in their constructors, but instead calculate the bounds once instantiated. Bounds are explicitly required for all other sprites._

`bl:color?: ColorType` - the color of the sprite. Aggregate Property for `red`, `green`, `blue`, and `colorAlpha`. Defaults to `{red: 0, green: 0, blue: 0, alpha: 1}`.

`bl:scale?: PositionType` - the scale of the sprite with `x` being the scale on the x-axis and `y` being the scale on the y-axis. Defaults to `{x: 1, y: 1}`. Aggregate Property for `scaleX` and `scaleY`. The sprite is always scaled from its center.

`bl:rotation?: number` - the rotation of the sprite in degrees. Defaults to `0`. Normal Property. The sprite is always rotated around its center.

`bl:alpha?: number` - the opacity of the sprite from `0` to `1`. Defaults to `1`. Normal Property.

`bl:blur?: number` - the blur amount of the sprite in pixels. Defaults to `0`. Normal Property.

`bl:gradient?: CanvasGradient|null` - the gradient of the sprite. `ctx.fillStyle` will be set to this gradient if present, overwriting color. Defaults to `null`. Normal Property.

`bl:effects?: (ctx: CanvasRenderingContext2D) => void` - This function will be called on the canvas context before the sprite is drawn. Useful for things like blurs and drop shadows. Normal Property. Defaults to `() => {}`.

`bl:name?: string` - the name of the sprite. Does not need to be unique. It can be useful for debugging and finding specific child sprites. Defaults to `""`. Normal Property.

`bl:enabled?: boolean` - whether or not the sprite is enabled. If it is not enabled, it and its children will not be drawn. Defaults to `true`. Normal Property.

`bl:channelCount?: number` - the number of animation channels the sprite has. Defaults to `0`. Normal Property.

`bl:details?: DetailsType` - See [Sprites/Details](sprites/details). Defaults to `undefined`.

[]
#### Hidden Universal Properties
`bl:center: PositionType` - the center of the sprite. Calculated Property from `x1`, `y1`, `x2`, and `y2`.

`bl:corner1: PositionType` - the first corner of the sprite's bounds. Aggregate Property for `x1` and `y1`.

`bl:corner2: PositionType` - the second corner of the sprite's bounds. Aggregate Property for `x2` and `y2`.

`bl:width: number` - the width of the sprite. Calculated Property from `x1` and `x2`.

`bl:height: number` - the height of the sprite. Calculated Property from `y1` and `y2`.

`bl:red: number`

`bl:green: number`

`bl:blue: number`

`bl:colorAlpha: number`

`bl:x1: number`

`bl:y1: number`

`bl:x2: number`

`bl:y2: number`

`bl:scaleX: number`

`bl:scaleY: number`

`bl:centerX: number`

`bl:centerY: number`
