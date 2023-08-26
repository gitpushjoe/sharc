import { ShapeProperties, LineProperties, DEFAULT_PROPERTIES, StrokeProperties, HiddenStrokeProperties, StrokeType, EllipseProperties, HiddenEllipseProperties, BezierCurveProperties, PathProperties, PolygonProperties, StarProperties, RectProperties, RadiusType, TextProperties, BezierPoint, HiddenBezierCurveProperties, ImageProperties, HiddenTextProperties, HiddenPathProperties, HiddenImageProperties } from './types/Sprites';
import { BoundsType, PositionType } from './types/Common';
import { ColorToString, Color, Position, Corners, Dimensions, getX1Y1WH, translateBounds, translatePosition, CircleBounds } from './Utils';
import { Sprite, Shape } from './BaseShapes';

/**
 * A shape that has no bounds and does not draw anything.
 * 
 * Consists of only a position, scale and rotation. (Position defaults to (0, 0))
 * 
 * Useful for creating a parent for other shapes.
 */
export class NullSprite extends Sprite<DEFAULT_PROPERTIES, {position?: PositionType}> {
    constructor(props: { position?: PositionType } & Omit<DEFAULT_PROPERTIES, 'bounds'|'color'>, channels: number = 1) {
        props.position = props.position === undefined ? Position(0, 0) : props.position;
        super({
            drawFunction: () => {},
            ...Shape.initializeProps({
                bounds: Corners(props.position.x, props.position.y, props.position.x, props.position.y),
                ...props
            })
        }, channels);
        this.aggregateProperties.set(
            'position', [['x', 'x1'], ['y', 'y1'], ['x', 'x2'], ['y', 'y2']]
        );
    }

    public isPointInPath(): boolean {
        return false;
    }
}

export class Line<Properties = {}, HiddenProperties = {}> extends Sprite<Properties & LineProperties, HiddenProperties> {
    protected lineWidth: number;
    protected lineCap: CanvasLineCap;
    protected lineDash: number;
    protected lineDashGap: number;
    protected lineDashOffset: number;

    constructor(props: LineProperties, channels: number = 1) {
        super({
            drawFunction: Line.drawLine,
            ...Shape.initializeProps(props)
        }, channels);
        this.lineWidth = props.lineWidth ?? 1;
        this.lineCap = props.lineCap ?? 'butt';
        this.lineDash = props.lineDash ?? 0;
        this.lineDashGap = props.lineDashGap ?? props.lineDash ?? 0;
        this.lineDashOffset = props.lineDashOffset ?? 0;
    }

    public draw(ctx: CanvasRenderingContext2D, properties?: Properties) {
        super.draw(
            ctx,
            {
                ...properties!,
                bounds: this.getBounds(),
                lineWidth: this.lineWidth,
                lineCap: this.lineCap,
                lineDash: this.lineDash,
                lineDashGap: this.lineDashGap,
                lineDashOffset: this.lineDashOffset,
                color: Color(this.red, this.green, this.blue, this.colorAlpha)
            },
        );
    }

    private static drawLine(ctx: CanvasRenderingContext2D, properties: LineProperties): Path2D {
        const bounds = translateBounds(properties.bounds);
        ctx.lineWidth = properties.lineWidth ?? 1;
        ctx.lineCap = properties.lineCap ?? 'butt';
        ctx.strokeStyle = ColorToString(properties.color ?? Color(0, 0, 0));
        ctx.setLineDash([properties.lineDash ?? 0, properties.lineDashGap ?? 0]);
        ctx.lineDashOffset = properties.lineDashOffset ?? 0;
        ctx.beginPath();
        ctx.moveTo(bounds.x1, bounds.y1);
        ctx.lineTo(bounds.x2, bounds.y2);
        ctx.stroke();
        ctx.closePath();
        const path = new Path2D();
        path.moveTo(bounds.x1, bounds.y1);
        path.lineTo(bounds.x2, bounds.y2);
        return path;
    }

    /**
     * @returns A BoundsType object from (x1, y1) to (x2, y2).
     */
    public static Bounds(x1: number, y1: number, x2: number, y2: number): BoundsType {
        return Corners(x1, y1, x2, y2);
    }
}

/**
 * Abstract class for all shapes that can have an outline drawn around them.
 * 
 * Adds StrokeProperties to the properties type, and initializes the sprite with the hidden stroke properties.
 * 
 * Initializes the stroke properties as member variables. 
 * 
 * DOES NOT actually draw the stroke, that is left to the subclass' implementation of draw().
 * 
 * Aggregate Properties: ['strokeColor']
 * 
 * Hidden Properties: ['strokeRed', 'strokeGreen', 'strokeBlue', 'strokeAlpha', 'strokeWidth', 'strokeJoin', 'strokeCap', 'strokeDash', 'strokeDashGap', 'strokeOffset', 'strokeEnabled']
 */
export abstract class StrokeableSprite<Properties = {}, HiddenProperties = {}> extends Sprite<Properties & StrokeProperties, HiddenStrokeProperties & HiddenProperties> {
    protected strokeEnabled: boolean;
    protected strokeRed: number;
    protected strokeGreen: number;
    protected strokeBlue: number;
    protected strokeAlpha: number;
    protected strokeWidth: number;
    protected strokeJoin: CanvasLineJoin;
    protected strokeCap: CanvasLineCap;
    protected strokeDash: number;
    protected strokeDashGap: number;
    protected strokeOffset: number;

    constructor(props: { stroke: StrokeType|null|undefined } & ShapeProperties<Properties & StrokeProperties>, channels: number = 1) {
        super(props, channels);
        this.strokeEnabled = props.stroke !== undefined;
        this.strokeRed = props.stroke?.color?.red ?? 0;
        this.strokeGreen = props.stroke?.color?.green ?? 0;
        this.strokeBlue = props.stroke?.color?.blue ?? 0;
        this.strokeAlpha = props.stroke?.color?.alpha ?? 1;
        this.strokeWidth = props.stroke?.lineWidth ?? 1;
        this.strokeJoin = props.stroke?.lineJoin ?? 'miter';
        this.strokeCap = props.stroke?.lineCap ?? 'butt';
        this.strokeDash = props.stroke?.lineDash ?? 0;
        this.strokeDashGap = props.stroke?.lineDashGap ?? props.stroke?.lineDash ?? 0;
        this.strokeOffset = props.stroke?.lineDashOffset ?? 0;
        this.aggregateProperties.set(
            'strokeColor', [['red', 'strokeRed'], ['green', 'strokeGreen'], ['blue', 'strokeBlue'], ['alpha', 'strokeAlpha']]
        );
    }

    public draw(ctx: CanvasRenderingContext2D, properties?: Properties & StrokeProperties) {
        super.draw(ctx, {
            ...properties!,
            stroke: this.strokeEnabled ? {
                color: {red: this.strokeRed, green: this.strokeGreen, blue: this.strokeBlue, alpha: this.strokeAlpha},
                lineWidth: this.strokeWidth,
                lineJoin: this.strokeJoin,
                lineCap: this.strokeCap,
                lineDash: this.strokeDash,
                lineDashGap: this.strokeDashGap,
                lineDashOffset: this.strokeOffset
            } : null
        });
    }
}

/**
 * Inherits from StrokeableSprite.
 */
export class Rect extends StrokeableSprite<RectProperties> {
    protected radius: RadiusType;
    
    constructor(props: StrokeProperties & RectProperties, channels: number = 1) {
        super({
            drawFunction: Rect.drawRect,
            stroke: props.stroke,
            ...Shape.initializeProps(props),
        }, channels);
        this.radius = props.radius ?? [0];
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, { 
            bounds: this.getBounds(),
            radius: this.radius,
        });
    }

    public static drawRect(ctx: CanvasRenderingContext2D, properties: StrokeProperties & RectProperties): Path2D {
        const coords = translateBounds(properties.bounds);
        if (properties.stroke === null || properties.stroke?.lineWidth === 0) {
            if (properties.radius && properties.radius[0] === 0 && properties.radius.length === 1) {
                const region = new Path2D();
                region.rect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
                ctx.fill(region, 'nonzero');
                return region;
                // ctx.fillRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
            } else {
                const region = new Path2D();
                region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
                ctx.fill(region, 'nonzero');
                return region;
                // ctx.beginPath();
                // ctx.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
                // ctx.fill();
            }
        }
        const { color, lineWidth: width, lineJoin: join, lineCap: cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
        ctx.lineWidth = width ?? 1;
        ctx.lineJoin = join ?? 'miter';
        ctx.lineCap = cap ?? 'round';
        ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
        ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
        ctx.lineDashOffset = lineDashOffset ?? 0;
        if (lineDash === 0) {
            const region = new Path2D();
            region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
            ctx.fill(region, 'nonzero');
            ctx.stroke(region);
            return region;
            // ctx.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
            // ctx.fill();
            // ctx.stroke();
            // ctx.closePath();
        } else {
            const region = new Path2D();
            region.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
            ctx.fill(region, 'nonzero');
            ctx.stroke(region);
            return region;
            // ctx.beginPath();
            // ctx.moveTo(coords.x1, coords.y1);
            // ctx.lineTo(coords.x2, coords.y1);
            // ctx.lineTo(coords.x2, coords.y2);
            // ctx.lineTo(coords.x1, coords.y2);
            // ctx.fill();
            // ctx.closePath();
            // ctx.stroke();
        }
    }

    /**
     * Returns a BoundsType object with a corner at (x1, y1) and the specified width and height.
     * 
     * Identical to Bounds.Dimensions.
     */
    public static Bounds(x1: number, y1: number, width: number, height: number): BoundsType {
        return Dimensions(x1, y1, width, height);
    }
 }

 /**
  * Inherits from StrokeableSprite.
  * 
  * CalculatedProperties: ['radius', 'radiusX', 'radiusY']
  */
 export class Ellipse extends StrokeableSprite<EllipseProperties, HiddenEllipseProperties> {
    protected startAngle: number;
    protected endAngle: number;

    constructor(props: EllipseProperties, channels: number = 1) {
        super({
            drawFunction: Ellipse.drawEllipse,
            stroke: props.stroke,
            ...Shape.initializeProps(props),
        }, channels);
        this.startAngle = props.startAngle ?? 0;
        this.endAngle = props.endAngle ?? 360;
        this.calculatedProperties.set(
            'radius',
            {
                getter: (self) => (self.get('width') + self.get('height')) / 4,
                setter: (self, value) => {
                    const centerX = Math.min(self.get('x1'), self.get('x2')) + self.get('width') / 2;
                    const centerY = Math.min(self.get('y1'), self.get('y2')) + self.get('height') / 2;
                    self.set('x1', centerX - value);
                    self.set('x2', centerX + value);
                    self.set('y1', centerY - value);
                    self.set('y2', centerY + value);
                }
            },
        );
        this.calculatedProperties.set(
            'radiusX',
            {
                getter: (self) => self.get('width') / 2,
                setter: (self, value) => {
                    const centerX = Math.min(self.get('x1'), self.get('x2')) + self.get('height') / 2;
                    self.set('x1', centerX - value);
                    self.set('x2', centerX + value);
                }
            },
        );
        this.calculatedProperties.set(
            'radiusY',
            {
                getter: (self) => self.get('height') / 2,
                setter: (self, value) => {
                    const centerY = Math.min(self.get('y1'), self.get('y2')) + self.get('height') / 2;
                    self.set('y1', centerY - value);
                    self.set('y2', centerY + value);
                }
            },
        );
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, {
            color: Color(this.red, this.green, this.blue, this.colorAlpha),
            bounds: this.getBounds(),
            startAngle: this.startAngle,
            endAngle: this.endAngle,
        });
    }

    public static drawEllipse(ctx: CanvasRenderingContext2D, properties: EllipseProperties): Path2D {
        const coords = getX1Y1WH(properties.bounds);
        ctx.beginPath();
        const region = new Path2D();
        region.ellipse(0, 0, coords[2] / 2, coords[3] / 2, 0, (properties.startAngle ?? 0) * Math.PI / 180, (properties.endAngle ?? 0) * Math.PI / 180);
        region.closePath();
        ctx.fill(region,'nonzero');
        ctx.closePath();
        // ctx.ellipse(0, 0, coords[2] / 2, coords[3] / 2, 0, (properties.startAngle ?? 0) * Math.PI / 180, (properties.endAngle ?? 0) * Math.PI / 180);
        // ctx.fill();
        if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
            const { color, lineWidth: width, lineJoin: join, lineCap: cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke(region);
        }
        return region;

        // bounding box
        // ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        // ctx.ellipse(0, 0, coords[2] / 2, coords[3] / 2, 0, (properties.startAngle ?? 0) * Math.PI / 180, (properties.endAngle ?? 0) * Math.PI / 180);
        // ctx.fill();
    }

    /**
     * Returns a BoundsType centered at (x, y) with a width of 2 * radius and a height of 2 * radiusY.
     * 
     * radiusY defaults to radius.
     * 
     * Identical to Bounds.Center.
     */
    public static Bounds(x: number, y: number, radius: number, radiusY?: number): BoundsType {
        return CircleBounds(x, y, radius, radiusY);
    }
}

/**
 * Inherits from StrokeableSprite.
 * 
 * A bezier curve of several curves.
 * 
 * Aggregate Properties: ['start']
 * 
 * Calculated Properties: ['control1-0', 'control2-0', 'end-0', 'control1-1', ... ]
 * 
 */
export class BezierCurve extends StrokeableSprite<BezierCurveProperties, HiddenBezierCurveProperties> {
    protected startX: number;
    protected startY: number;
    protected points: BezierPoint[];
    protected closePath: boolean;
    protected fillRule: CanvasFillRule;

    constructor(props: BezierCurveProperties, channels: number = 1) {
        super({
            drawFunction: BezierCurve.drawBezierCurve,
            stroke: props.stroke,
            ...Shape.initializeProps({
                ...props,
                bounds: BezierCurve.getBoundsFromCurves(Position(props.start.x, props.start.y), props.points),
            }),
        }, channels);
        this.startX = props.start.x;
        this.startY = props.start.y;
        this.points = props.points;
        this.closePath = props.closePath ?? false;
        this.fillRule = props.fillRule ?? 'nonzero';
        this.aggregateProperties.set(
            'start', [['x', 'startX'], ['y', 'startY']]
        );
        this.aggregateProperties.delete('bounds');
        this.calculatedProperties.set(
            'points',
            {
                getter: (self) => Object.getOwnPropertyDescriptor(self, 'points')!.value,
                setter: (self, value: BezierPoint[]) => {
                    Object.defineProperty(self, 'points', { value });
                    BezierCurve.setCalculatedCurveProperties(this);
                    const bounds = BezierCurve.getBoundsFromCurves(Position(self.get('startX'), self.get('startY')), value);
                    self.set('x1', bounds.x1);
                    self.set('y1', bounds.y1);
                    self.set('x2', bounds.x2);
                    self.set('y2', bounds.y2);
                }
            }
        )
        this.calculatedProperties.set(
            'center',
            {
                getter: (self) => {
                    const bounds = BezierCurve.getBoundsFromCurves(Position(self.get('startX'), self.get('startY')), self.get('points')!);
                    return Position((bounds.x1 + bounds.x2) / 2, (bounds.y1 + bounds.y2) / 2);
                }, setter: (self, value: PositionType) => {
                    const bounds = BezierCurve.getBoundsFromCurves(Position(self.get('startX'), self.get('startY')), self.get('points')!);
                    const diff = Position(value.x - (bounds.x1 + bounds.x2) / 2, value.y - (bounds.y1 + bounds.y2) / 2);
                    self.set('startX', self.get('startX') + diff.x);
                    self.set('startY', self.get('startY') + diff.y);
                }
            }
        );
        this.calculatedProperties.set(
            'centerX',
            {
                getter: (self) => {
                    const bounds = BezierCurve.getBoundsFromCurves(Position(self.get('startX'), self.get('startY')), self.get('points')!);
                    return (bounds.x1 + bounds.x2) / 2;
                }, setter: (self, value: number) => {
                    const bounds = BezierCurve.getBoundsFromCurves(Position(self.get('startX'), self.get('startY')), self.get('points')!);
                    const diff = value - (bounds.x1 + bounds.x2) / 2;
                    self.set('startX', self.get('startX') + diff);
                    const points = self.get('points')!;
                    for (const point of points) {
                        point.control1.x += diff;
                        point.control2.x += diff;
                        point.end.x += diff;
                    }
                    self.set('points', points);
                }
            }
        );
        this.calculatedProperties.set(
            'centerY',
            {
                getter: (self) => {
                    const bounds = BezierCurve.getBoundsFromCurves(Position(self.get('startX'), self.get('startY')), self.get('points')!);
                    return (bounds.y1 + bounds.y2) / 2;
                }, setter: (self, value: number) => {
                    const bounds = BezierCurve.getBoundsFromCurves(Position(self.get('startX'), self.get('startY')), self.get('points')!);
                    const diff = value - (bounds.y1 + bounds.y2) / 2;
                    self.set('startY', self.get('startY') + diff);
                    const points = self.get('points')!;
                    for (const point of points) {
                        point.control1.y += diff;
                        point.control2.y += diff;
                        point.end.y += diff;
                    }
                    self.set('points', points);
                }
            }
        );
        BezierCurve.setCalculatedCurveProperties(this);
    }
        
        public draw(ctx: CanvasRenderingContext2D) {
        const bounds = BezierCurve.getBoundsFromCurves(Position(this.startX, this.startY), this.points);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
        super.draw(ctx, {
            start: Position(this.startX, this.startY),
            points: this.points,
            closePath: this.closePath,
            fillRule: this.fillRule,
        });
    }

    public static setCalculatedCurveProperties(beziercurve: BezierCurve) {
        const curveRelatedKeys = Array.from(beziercurve.calculatedProperties.keys()).filter(key => key.startsWith('point-') || key.startsWith('control1-') || key.startsWith('control2-') || key.startsWith('end-'));
        curveRelatedKeys.forEach(key => beziercurve.calculatedProperties.delete(key));

        for (const idx in beziercurve.points) {
            beziercurve.calculatedProperties.set(
                `point-${idx}`,
                {
                    getter: (self) => {
                        if (parseInt(idx) >= self.get('points')!.length) {
                            throw new Error(`Index ${idx} is out of bounds`);
                        } else {
                            return self.get('points')![parseInt(idx)];
                        }
                    },
                    setter: (self, value: BezierPoint) => {
                        const points = self.get('points')!;
                        if (parseInt(idx) >= points.length) {
                            throw new Error(`Index ${idx} is out of bounds`);
                        } else {
                            points[parseInt(idx)] = value;
                            self.set('points', points);
                        }
                    }
                }
                );
                for (const key of ['end', 'control1', 'control2']) {
                    beziercurve.calculatedProperties.set(
                        `${key}-${parseInt(idx)}`,
                        {
                            getter: (self) => {
                                if (parseInt(idx) >= self.get('points')!.length) {
                                    throw new Error(`Index ${idx} is out of bounds`);
                                } else {
                                    return self.get('points')![parseInt(idx)][key];
                                }
                            },
                        setter: (self, value: BezierPoint) => {
                            const points = self.get('points')!;
                            if (parseInt(idx) >= points.length) {
                                throw new Error(`Index ${idx} is out of bounds`);
                            } else {
                                points[parseInt(idx)][key] = value;
                                self.set('points', points);
                            }
                        }
                    }
                    );
                }
            }
        }


    private static getBoundsFromCurves(start: PositionType, points: BezierPoint[]): BoundsType {
        let [x1, y1, x2, y2] = [start.x, start.y, start.x, start.y];
        points.forEach(curve => {
            x1 = Math.min(x1, curve.end.x);
            y1 = Math.min(y1, curve.end.y);
            x2 = Math.max(x2, curve.end.x);
            y2 = Math.max(y2, curve.end.y);
        });
        return Corners(x1, y1, x2, y2);
    }

    public static drawBezierCurve(ctx: CanvasRenderingContext2D, properties: BezierCurveProperties): Path2D {
        let [x1, y1, x2, y2] = [properties.start.x, properties.start.y, properties.start.x, properties.start.y];
        properties.points.forEach(point => {
            x1 = Math.min(x1, point.end.x);
            y1 = Math.min(y1, point.end.y);
            x2 = Math.max(x2, point.end.x);
            y2 = Math.max(y2, point.end.y);
        });
        const bounds = Corners(x1, y1, x2, y2);
        const region = new Path2D();
        region.moveTo(translatePosition(bounds, Position(properties.start.x, properties.start.y)).x, translatePosition(bounds, Position(properties.start.x, properties.start.y)).y);
        properties.points.forEach(point => {
            region.bezierCurveTo(
                translatePosition(bounds, Position(point.control1.x, point.control1.y)).x,
                translatePosition(bounds, Position(point.control1.x, point.control1.y)).y,
                translatePosition(bounds, Position(point.control2.x, point.control2.y)).x,
                translatePosition(bounds, Position(point.control2.x, point.control2.y)).y,
                translatePosition(bounds, Position(point.end.x, point.end.y)).x,
                translatePosition(bounds, Position(point.end.x, point.end.y)).y,
            );
        });
        if (properties.closePath) {
            region.closePath();
        }
        ctx.fill(region, properties.fillRule ?? 'nonzero');
        if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
            const { color, lineWidth: width, lineJoin: join, lineCap: cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke(region);
        }
        return region;
    }
}

/**
 * Represents a linear path of points.
 * 
 * Inherits from StrokeableSprite.
 */
export class Path extends StrokeableSprite<PathProperties, HiddenPathProperties> {
    protected path: PositionType[];
    protected fillRule: CanvasFillRule;
    protected closePath: boolean;
    protected start: number;
    protected end: number;

    constructor(props: PathProperties, channels: number = 1) {
        super({
            drawFunction: Path.drawPath,
            stroke: props.stroke,
            ...Shape.initializeProps({
                bounds: Path.getBoundsFromPath(props.path),
                ...props,
            }),
        }, channels);
        this.path = props.path;
        this.fillRule = props.fillRule ?? 'nonzero';
        this.closePath = props.closePath ?? false;
        this.start = props.start ?? 0;
        this.end = props.end ?? 1;
        this.calculatedProperties.set(
            'path',
            {
                getter: (self) => Object.getOwnPropertyDescriptor(self, 'path')!.value,
                setter: (self, value: PositionType[]) => {
                    if (value.length !== self.get('path')!.length) {
                        throw new Error('Path length cannot be changed at runtime');
                    }
                    Object.getOwnPropertyDescriptor(self, 'path')!.value;
                }
            }
        );
        Array.from(Array(props.path.length).keys()).forEach(idx => {
            this.calculatedProperties.set(
                `point-${idx}`,
                {
                    getter: (self) => self.get('path')![idx],
                    setter: (self, value: PositionType) => {
                        const path = self.get('path')!;
                        path[idx] = value;
                        self.set('path', path);
                    }
                }
            );
            this.calculatedProperties.set(
                `x-${idx}`,
                {
                    getter: (self) => self.get('path')![idx].x,
                    setter: (self, value: number) => {
                        const path = self.get('path')!;
                        path[idx].x = value;
                        self.set('path', path);
                    }
                }
            );
            this.calculatedProperties.set(
                `y-${idx}`,
                {
                    getter: (self) => self.get('path')![idx].y,
                    setter: (self, value: number) => {
                        const path = self.get('path')!;
                        path[idx].y = value;
                        self.set('path', path);
                    }
                }
            );
        });
    }

    // public isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
    //     if (this.region === undefined) {
    //         return ctx.isPointInPath(x, y, this.fillRule);
    //     }
    //     return ctx.isPointInPath(this.region, x, y, this.fillRule);
    // }

    public draw(ctx: CanvasRenderingContext2D) {
        this.set('x1', Path.getBoundsFromPath(this.path).x1);
        this.set('y1', Path.getBoundsFromPath(this.path).y1);
        this.set('x2', Path.getBoundsFromPath(this.path).x2);
        this.set('y2', Path.getBoundsFromPath(this.path).y2);
        super.draw(ctx, {
            path: this.path,
            fillRule: this.fillRule,
            closePath: this.closePath,
            color: Color(this.red, this.green, this.blue, this.colorAlpha),
            start: this.start,
            end: this.end,
        });
    }

    public static drawPath(ctx: CanvasRenderingContext2D, properties: PathProperties): Path2D {
        ctx.beginPath();
        let path = properties.path.map(point => translatePosition(Path.getBoundsFromPath(properties.path), point)) as PositionType[];
        path = Path.getPathSegment(path, properties.start ?? 0, properties.end ?? 1);
        // console.log(path);
        if (path.length === 0) {
            return new Path2D();
        }
        const region = new Path2D();
        region.moveTo(path[0].x, path[0].y);
        for (const point of path.slice(1)) {
            region.lineTo(point.x, point.y);
        }
        if (properties.closePath) {
            region.closePath();
        }
        ctx.fill(region, properties.fillRule ?? 'nonzero');
        if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
            const { color, lineWidth: width, lineJoin: join, lineCap: cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke(region);
        }

        // // Bounding box for pointer events
        // ctx.fillStyle = `rgba(0, 0, 0, 0)`
        // const boundingBox = Path.getBoundsFromPath(path);
        // ctx.moveTo(boundingBox.x1, boundingBox.y1);
        // ctx.lineTo(boundingBox.x2, boundingBox.y1);
        // ctx.lineTo(boundingBox.x2, boundingBox.y2);
        // ctx.lineTo(boundingBox.x1, boundingBox.y2);

        return region;
    }

    public static getPathSegment(path: PositionType[], start: number, end: number): PositionType[] {
        if (start === 0 && end === 1) {
            return path;
        } else if (start === end) {
            return [];
        } else if (start > end) {
            return Path.getPathSegment(path, end, start).reverse();
        } else if (start < 0 || end > 1) {
            throw new Error('Start and end must be between 0 and 1');
        }
        const distances = path.map((point, idx) => Path.calculateDistance(point, path[idx + 1] ?? path[0]));
        distances.pop();
        const totalDistance = distances.reduce((a, b) => a + b, 0);
        const newPath = [] as PositionType[];
        let currentDistance = 0;
        let currentIdx = 0;
        let ratio = 0;
        for (const distance of distances) {
            const currentRatio = distance / totalDistance;
            if (ratio + currentRatio < start) {
                ratio += currentRatio;
                currentIdx++;
                continue;
            }
            let leftRatio = 0;
            if (ratio + currentRatio > start && ratio < start) {
                leftRatio = (start - ratio) * (1 / currentRatio);
            }
            let rightRatio = 1;
            if (ratio + currentRatio > end && ratio < end) {
                rightRatio = (end - ratio) * (1 / currentRatio);
            }
            // if (leftRatio < 0 || rightRatio < 0)
            //     console.log(leftRatio, rightRatio, ratio, currentRatio, start, end)
            if (ratio + currentRatio > start) {
                newPath.push(Path.interpolate(path[currentIdx], path[currentIdx + 1] ?? path[0], leftRatio));
            }
            // console.log(ratio + currentRatio, ratio + currentRatio >= end)
            if (ratio < end && ratio + currentRatio > end) {
                newPath.push(Path.interpolate(path[currentIdx], path[currentIdx + 1] ?? path[0], rightRatio));
                return newPath;
            }
            currentDistance += distance;
            ratio += currentRatio;
            currentIdx++;
        }
        return end === 1 ? newPath.concat(path[path.length - 1]) : newPath;
    }

    public static interpolate(point1: PositionType, point2: PositionType, ratio: number): PositionType {
        return Position(point1.x + ratio * (point2.x - point1.x), point1.y + ratio * (point2.y - point1.y));
    }

    public static calculateDistance(point1: PositionType, point2: PositionType): number {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }

    // Returns the bounds of the path, which can be used to do rotations, scaling, translations.
    public static getBoundsFromPath(path: PositionType[]): BoundsType {
        return Corners(
            Math.min(...path.map(point => point.x)),
            Math.min(...path.map(point => point.y)),
            Math.max(...path.map(point => point.x)),
            Math.max(...path.map(point => point.y)),
        )
    }
}

/**
 * An n-sided polygon.
 * 
 * Inherits from StrokeableSprite.
 * 
 */
export class Polygon extends StrokeableSprite<PolygonProperties> {
    protected sides: number;
    protected radius: number;
    protected centerX: number;
    protected centerY: number;
    protected start: number;
    protected end: number;
    protected fillRule: CanvasFillRule;

    constructor(props: PolygonProperties, channels: number = 1) {
        super({
            drawFunction: Polygon.drawPolygon,
            stroke: props.stroke,
            ...Shape.initializeProps({
                bounds: Corners(props.center.x - props.radius, props.center.y - props.radius, props.center.x + props.radius, props.center.y + props.radius),
                ...props,
            }),
        }, channels);
        this.sides = props.sides;
        this.radius = props.radius;
        this.centerX = props.center.x ?? 0;
        this.centerY = props.center.y ?? 0;
        this.start = props.start ?? 0;
        this.end = props.end ?? 1;
        this.fillRule = props.fillRule ?? 'nonzero';
        this.calculatedProperties.delete('center');
        this.calculatedProperties.delete('centerX');
        this.calculatedProperties.delete('centerY');
        this.aggregateProperties.set(
            'center', [['x', 'centerX'], ['y', 'centerY']]
        );
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.x1 = this.centerX - this.radius;
        this.y1 = this.centerY - this.radius;
        this.x2 = this.centerX + this.radius;
        this.y2 = this.centerY + this.radius;
        super.draw(ctx, {
            sides: this.sides,
            radius: this.radius,
            fillRule: this.fillRule,
            color: Color(this.red, this.green, this.blue, this.colorAlpha),
            center: Position(this.centerX, this.centerY),
            start: this.start,
            end: this.end,
        });
    }

    public static drawPolygon(ctx: CanvasRenderingContext2D, properties: PolygonProperties): Path2D {
        const sides = properties.sides;
        const radius = properties.radius;
        if (sides < 3 || radius <= 0) {
            throw new Error('Polygon must have at least 3 sides and a positive radius');
        }
        const path = Array.from({ length: parseInt(sides.toString()) }, (_, idx) => {
            const angle = 2 * Math.PI * idx / parseInt(sides.toString());
            return Position(radius * Math.cos(angle), radius * Math.sin(angle));
        });
        return Path.drawPath(ctx, {
            path,
            fillRule: properties.fillRule ?? 'nonzero',
            closePath: true,
            stroke: properties.stroke,
            start: properties.start ?? 0,
            end: properties.end ?? 1,
        });
    }
}

/**
 * A 5-pointed star.
 * 
 * Inherits from StrokeableSprite.
 */
export class Star extends StrokeableSprite<StarProperties> {
    protected radius: number;
    protected innerRadius: number;
    protected fillRule: CanvasFillRule;
    protected start: number;
    protected end: number;
    protected centerX: number;
    protected centerY: number;

    constructor(props: StarProperties, channels: number = 1) {
        super({
            drawFunction: Star.drawStar,
            stroke: props.stroke,
            ...Shape.initializeProps({
                bounds: Corners(props.center.x - props.radius, props.center.y - props.radius, props.center.x + props.radius, props.center.y + props.radius),
                ...props,
            }),
        }, channels);
        this.centerX = props.center.x ?? 0;
        this.centerY = props.center.y ?? 0;
        this.radius = props.radius;
        this.fillRule = props.fillRule ?? 'nonzero';
        this.innerRadius = props.innerRadius ?? props.radius * (3 - Math.sqrt(5)) / 2;
        this.start = props.start ?? 0;
        this.end = props.end ?? 1;
        this.calculatedProperties.delete('center');
        this.calculatedProperties.delete('centerX');
        this.calculatedProperties.delete('centerY');
        this.aggregateProperties.set(
            'center', [['x', 'centerX'], ['y', 'centerY']]
        );
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.x1 = this.centerX - this.radius;
        this.y1 = this.centerY - this.radius;
        this.x2 = this.centerX + this.radius;
        this.y2 = this.centerY + this.radius;
        super.draw(ctx, {
            center: Position(this.centerX, this.centerY),
            radius: this.radius,
            innerRadius: this.innerRadius,
            color: Color(this.red, this.green, this.blue, this.colorAlpha),
            start: this.start,
            end: this.end,
        });
    }

    public static drawStar(ctx: CanvasRenderingContext2D, properties: StarProperties): Path2D {
        const radius = properties.radius;
        const innerRadius = properties.innerRadius ?? radius * (3 - Math.sqrt(5)) / 2;

        const pointFromAngle = (angle: number, radius: number) => {
            return Position(radius * Math.cos(Math.PI / 2 + angle), radius * Math.sin(Math.PI / 2 + angle));
        }

        const path = [
            pointFromAngle(0, radius),
            pointFromAngle(2 * Math.PI / 10, innerRadius),
            pointFromAngle(2 * Math.PI / 5, radius),
            pointFromAngle(6 * Math.PI / 10, innerRadius),
            pointFromAngle(4 * Math.PI / 5, radius),
            pointFromAngle(10 * Math.PI / 10, innerRadius),
            pointFromAngle(6 * Math.PI / 5, radius),
            pointFromAngle(14 * Math.PI / 10, innerRadius),
            pointFromAngle(8 * Math.PI / 5, radius),
            pointFromAngle(18 * Math.PI / 10, innerRadius),
        ];

        return Path.drawPath(ctx, {
            path,
            fillRule: properties.fillRule ?? 'nonzero',
            closePath: true,
            stroke: properties.stroke,
            start: properties.start ?? 0,
            end: properties.end ?? 1,
        });
    }
}

/**
 * A text sprite.
 * 
 * Inherits from StrokeableSprite.
 * 
 * Uses position instead of bounds. positionIsCenter determines whether the position is the center of the text or the top left corner.
 * 
 * When drawing to a centered-style MainStage, Text must have its scale set to {x: 1, y: -1} to be right-side up.
 * 
 * Aggregate Properties: ['position']
 * 
 * Hidden Properties: ['positionX', 'positionY']
 */
export class TextSprite extends StrokeableSprite<TextProperties, HiddenTextProperties> {
    protected text: string;
    protected positionX: number;
    protected positionY: number;
    protected positionIsCenter: boolean;
    protected font: string;
    protected fontSize: number;
    protected textAlign: CanvasTextAlign;
    protected textBaseline: CanvasTextBaseline;
    protected textDirection: CanvasDirection;
    protected maxWidth: number|null;
    protected bold: boolean;
    protected italic: boolean;

    constructor(props: TextProperties, channels: number = 1) {
        super({
            drawFunction: TextSprite.drawText,
            stroke: props.stroke,
            ...Shape.initializeProps({
                bounds: Corners(props.position.x, props.position.y, props.position.x, props.position.y),
                ...props,
            }),
        }, channels);
        this.text = props.text;
        this.positionX = props.position.x;
        this.positionY = props.position.y;
        this.positionIsCenter = props.positionIsCenter ?? false;
        this.font = props.font ?? 'sans-serif';
        this.fontSize = props.fontSize ?? 16;
        this.textAlign = props.textAlign ?? 'start';
        this.textBaseline = props.textBaseline ?? 'alphabetic';
        this.textDirection = props.textDirection ?? 'inherit';
        this.maxWidth = props.maxWidth ?? null;
        this.bold = props.bold ?? false;
        this.italic = props.italic ?? false;
        this.aggregateProperties.set(
            'position', [['x', 'positionX'], ['y', 'positionY']]
        );
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.font = `${this.bold ? 'bold ' : ''}${this.italic ? 'italic ' : ''}${this.fontSize}px ${this.font}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.direction = this.textDirection;
        const width = ctx.measureText(this.text).width;
        const height = this.fontSize;
        if (this.positionIsCenter) {
            this.x1 = this.positionX - width / 2;
            this.y1 = this.positionY - height / 2;
            this.x2 = this.positionX + width / 2;
            this.y2 = this.positionY + height / 2;
        } else {
            this.x1 = this.positionX;
            this.y1 = this.positionY;
            this.x2 = this.positionX + width;
            this.y2 = this.positionY + height;
        }
        super.draw(ctx, {
            text: this.text,
            position: Position(this.positionX, this.positionY),
            font: this.font,
            fontSize: this.fontSize,
            textAlign: this.textAlign,
            textBaseline: this.textBaseline,
            textDirection: this.textDirection,
            maxWidth: this.maxWidth,
            bold: this.bold,
            italic: this.italic,
            color: Color(this.red, this.green, this.blue, this.colorAlpha),
        });
    }

    public static drawText(ctx: CanvasRenderingContext2D, properties: TextProperties): Path2D {
        const { text, fontSize, maxWidth, } = properties;
        const textWidth = ctx.measureText(text).width;
        const height = fontSize ?? 16;
        ctx.fillText(text, -textWidth / 2, height / 2, maxWidth ?? undefined);
        if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
            const { color, lineWidth: width, lineJoin: join, lineCap: cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.strokeText(text, -textWidth / 2, height / 2, maxWidth ?? undefined);
        }

        // Bounding box for pointer events
        const region = new Path2D();
        region.moveTo(-textWidth / 2, -height / 2);
        region.lineTo(textWidth / 2, -height / 2);
        region.lineTo(textWidth / 2, height / 2);
        region.lineTo(-textWidth / 2, height / 2);
        region.closePath();
        return region;
    }
}

/**
 * Image sprite.
 * 
 * Inherits from StrokeableSprite.
 * 
 * srcBounds can be used to specify a subregion of the image to draw.
 * 
 * Hidden Properties: ['srcX1', 'srcY1', 'srcX2', 'srcY2', 'useSrcBounds']
 */
export class ImageSprite extends StrokeableSprite<ImageProperties, HiddenImageProperties> {
    protected image: HTMLImageElement;
    protected srcX1: number;
    protected srcY1: number;
    protected srcX2: number;
    protected srcY2: number;
    protected useSrcBounds: boolean;

    constructor(props: ImageProperties, channels: number = 1) {
        super({
            drawFunction: ImageSprite.drawImage,
            stroke: props.stroke,
            ...Shape.initializeProps(props),
        }, channels);
        this.image = props.image;
        this.srcX1 = props.srcBounds?.x1 ?? 0;
        this.srcY1 = props.srcBounds?.y1 ?? 0;
        this.srcX2 = props.srcBounds?.x2 ?? props.image.width;
        this.srcY2 = props.srcBounds?.y2 ?? props.image.height;
        this.useSrcBounds = props.srcBounds !== undefined;
        this.aggregateProperties.set(
            'srcCorner1', [['x', 'srcX1'], ['y', 'srcY1']]
        );
        this.aggregateProperties.set(
            'srcCorner2', [['x', 'srcX2'], ['y', 'srcY2']]
        );
        this.aggregateProperties.set(
            'srcBounds', [['x1', 'srcX1'], ['y1', 'srcY1'], ['x2', 'srcX2'], ['y2', 'srcY2']]
        )
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, {
            image: this.image,
            srcBounds: this.useSrcBounds ? Corners(this.srcX1, this.srcY1, this.srcX2, this.srcY2) : undefined,
            bounds: this.getBounds(),
        });
    }

    public static drawImage(ctx: CanvasRenderingContext2D, properties: ImageProperties): Path2D {
        const { image, srcBounds: sourceBounds, bounds } = properties;
        const width = bounds.x2 - bounds.x1;
        const height = bounds.y2 - bounds.y1;
        if (sourceBounds !== undefined) {
            ctx.drawImage(image, sourceBounds.x1, sourceBounds.y1, sourceBounds.x2 - sourceBounds.x1, sourceBounds.y2 - sourceBounds.y1, -width/2, -height/2, width, height);
        } else {
            ctx.drawImage(image, -width/2, -height/2, width, height);
        }

        
        const region = new Path2D();
        region.moveTo(-width/2, -height/2);
        region.lineTo(width/2, -height/2);
        region.lineTo(width/2, height/2);
        region.lineTo(-width/2, height/2);
        region.closePath();

        if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
            const { color, lineWidth: width, lineJoin: join, lineCap: cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke(region);
        }

        return region;
    }

    /**
     * Returns a BoundsType object with a corner at (x1, y1) and the specified width and height.
     * 
     * Identical to Bounds.Dimensions.
     */
    public static Bounds(x1: number, y1: number, width: number, height: number): BoundsType {
        return Dimensions(x1, y1, width, height);
    }
}