import { ShapeProperties, LineProperties, DEFAULT_PROPERTIES, StrokeProperties, HiddenStrokeProperties, StrokeType, EllipseProperties, HiddenEllipseProperties, BezierCurveProperties, PathProperties, PolygonProperties, StarProperties, RectProperties, RadiusType, TextProperties, BezierCurveType, HiddenBezierCurveProperties, ImageProperties, HiddenTextProperties } from './types/Shapes';
import { BoundsType, PositionType } from './types/Common';
import { ColorToString, Color, Position, Corners, Dimensions, Center as Center, getX1Y1WH, translateBounds, translatePosition, Circle } from './Utils';
import { HiddenLineProperties } from './types/Animation';
import { Sprite, Shape } from './BaseShapes';

/**
 * A shape that has no bounds and does not draw anything.
 * 
 * Consists of only a position, scale and rotation. (Posiiton defaults to (0, 0))
 * 
 * Useful for creating a parent for other shapes.
 */
export class NullShape extends Sprite {
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

export class Line<Properties = {}, HiddenProperties = {}> extends Sprite<Properties & LineProperties, HiddenProperties & HiddenLineProperties> {
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

    private static drawLine(ctx: CanvasRenderingContext2D, properties: LineProperties) {
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
 * DOES NOT actually draw the stroke. 
 * 
 * Aggrgate Properties: ['strokeColor']
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
        this.strokeWidth = props.stroke?.width ?? 1;
        this.strokeJoin = props.stroke?.join ?? 'miter';
        this.strokeCap = props.stroke?.cap ?? 'butt';
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
                width: this.strokeWidth,
                join: this.strokeJoin,
                cap: this.strokeCap,
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

    public static drawRect(ctx: CanvasRenderingContext2D, properties: StrokeProperties & RectProperties) {
        const coords = translateBounds(properties.bounds);
        if (properties.stroke === null || properties.stroke?.width === 0) {
            if (properties.radius && properties.radius[0] === 0 && properties.radius.length === 1) {
                ctx.fillRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
                return;
            } else {
                ctx.beginPath();
                ctx.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
                ctx.fill();
                return;
            }
        }
        const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
        ctx.lineWidth = width ?? 1;
        ctx.lineJoin = join ?? 'miter';
        ctx.lineCap = cap ?? 'round';
        ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
        ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
        ctx.lineDashOffset = lineDashOffset ?? 0;
        if (lineDash === 0) {
            ctx.beginPath();
            ctx.roundRect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1, properties.radius);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        } else {
            ctx.beginPath();
            ctx.moveTo(coords.x1, coords.y1);
            ctx.lineTo(coords.x2, coords.y1);
            ctx.lineTo(coords.x2, coords.y2);
            ctx.lineTo(coords.x1, coords.y2);
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
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
                getter: (self) => (self.width + self.height) / 4,
                setter: (self, value) => {
                    const centerX = Math.min(self.getProperty('x1'), self.getProperty('x2')) + self.width / 2;
                    const centerY = Math.min(self.getProperty('y1'), self.getProperty('y2')) + self.height / 2;
                    self.setProperty('x1', centerX - value);
                    self.setProperty('x2', centerX + value);
                    self.setProperty('y1', centerY - value);
                    self.setProperty('y2', centerY + value);
                }
            },
        );
        this.calculatedProperties.set(
            'radiusX',
            {
                getter: (self) => self.width / 2,
                setter: (self, value) => {
                    const centerX = Math.min(self.getProperty('x1'), self.getProperty('x2')) + self.width / 2;
                    self.setProperty('x1', centerX - value);
                    self.setProperty('x2', centerX + value);
                }
            },
        );
        this.calculatedProperties.set(
            'radiusY',
            {
                getter: (self) => self.height / 2,
                setter: (self, value) => {
                    const centerY = Math.min(self.getProperty('y1'), self.getProperty('y2')) + self.height / 2;
                    self.setProperty('y1', centerY - value);
                    self.setProperty('y2', centerY + value);
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

    public static drawEllipse(ctx: CanvasRenderingContext2D, properties: EllipseProperties) {
        const coords = getX1Y1WH(properties.bounds);
        if (coords[2] === coords[3] && (properties.stroke === null || properties.stroke?.width === 0) && properties.startAngle === 0 && properties.endAngle === 360) {
            ctx.lineWidth = coords[2];
            ctx.lineCap = 'round';
            ctx.strokeStyle = ColorToString(properties.color ?? Color(0, 0, 0));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.stroke();
            return;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, coords[2] / 2, coords[3] / 2, 0, (properties.startAngle ?? 0) * Math.PI / 180, (properties.endAngle ?? 0) * Math.PI / 180);
        ctx.fill();
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke();
        }
    }

    /**
     * Returns a BoundsType centered at (x, y) with a width of 2 * radius and a height of 2 * radiusY.
     * 
     * radiusY defaults to radius.
     * 
     * Identical to Bounds.Center.
     */
    public static Bounds(x: number, y: number, radius: number, radiusY?: number): BoundsType {
        return Circle(x, y, radius, radiusY);
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
    protected curves: BezierCurveType[];
    protected closePath: boolean;
    protected fillRule: CanvasFillRule;

    constructor(props: BezierCurveProperties, channels: number = 1) {
        super({
            drawFunction: BezierCurve.drawBezierCurve,
            stroke: props.stroke,
            ...Shape.initializeProps({
                ...props,
                bounds: BezierCurve.getBoundsFromCurves(Position(props.start.x, props.start.y), props.curves),
            }),
        }, channels);
        this.startX = props.start.x;
        this.startY = props.start.y;
        this.curves = props.curves;
        this.closePath = props.closePath ?? false;
        this.fillRule = props.fillRule ?? 'nonzero';
        this.aggregateProperties.set(
            'start', [['x', 'startX'], ['y', 'startY']]
        );
        for (const idx in this.curves) {
            for (const key of ['end', 'control1', 'control2']) {
                this.calculatedProperties.set(
                    `${key}-${parseInt(idx)}`,
                    {
                        getter: (self) => {
                            if (parseInt(idx) >= self.getProperty('curves')!.length) {
                                throw new Error(`Index ${idx} is out of bounds`);
                            } else {
                                return self.getProperty('curves')![parseInt(idx)][key];
                            }
                        },
                        setter: (self, value: BezierCurveType) => {
                            const curves = self.getProperty('curves')!;
                            if (parseInt(idx) >= curves.length) {
                                throw new Error(`Index ${idx} is out of bounds`);
                            } else {
                                curves[parseInt(idx)][key] = value;
                                self.setProperty('curves', curves);
                            }
                        }
                    }
                );
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const bounds = BezierCurve.getBoundsFromCurves(Position(this.startX, this.startY), this.curves);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
        super.draw(ctx, {
            start: Position(this.startX, this.startY),
            curves: this.curves,
            closePath: this.closePath,
            fillRule: this.fillRule,
        });
    }

    private static getBoundsFromCurves(start: PositionType, curves: BezierCurveType[]): BoundsType {
        let [x1, y1, x2, y2] = [start.x, start.y, start.x, start.y];
        curves.forEach(curve => {
            x1 = Math.min(x1, curve.end.x);
            y1 = Math.min(y1, curve.end.y);
            x2 = Math.max(x2, curve.end.x);
            y2 = Math.max(y2, curve.end.y);
        });
        return Corners(x1, y1, x2, y2);
    }

    public static drawBezierCurve(ctx: CanvasRenderingContext2D, properties: BezierCurveProperties) {
        let [x1, y1, x2, y2] = [properties.start.x, properties.start.y, properties.start.x, properties.start.y];
        properties.curves.forEach(curve => {
            x1 = Math.min(x1, curve.end.x);
            y1 = Math.min(y1, curve.end.y);
            x2 = Math.max(x2, curve.end.x);
            y2 = Math.max(y2, curve.end.y);
        });
        const bounds = Corners(x1, y1, x2, y2);
        ctx.beginPath();
        ctx.moveTo(translatePosition(bounds, Position(properties.start.x, properties.start.y)).x, translatePosition(bounds, Position(properties.start.x, properties.start.y)).y);
        properties.curves.forEach(curve => {
            ctx.bezierCurveTo(
                translatePosition(bounds, Position(curve.control1.x, curve.control1.y)).x,
                translatePosition(bounds, Position(curve.control1.x, curve.control1.y)).y,
                translatePosition(bounds, Position(curve.control2.x, curve.control2.y)).x,
                translatePosition(bounds, Position(curve.control2.x, curve.control2.y)).y,
                translatePosition(bounds, Position(curve.end.x, curve.end.y)).x,
                translatePosition(bounds, Position(curve.end.x, curve.end.y)).y,
            );
        });
        if (properties.closePath) {
            ctx.closePath();
        }
        ctx.fill(properties.fillRule ?? 'nonzero');
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke();
        }
    }
}

/**
 * Represents a linear path of points.
 * 
 * Inherits from StrokeableSprite.
 */
export class Path extends StrokeableSprite<PathProperties> {
    protected path: PositionType[];
    protected fillRule: CanvasFillRule;
    protected closePath: boolean;
    protected start: number;
    protected end: number;
    private region?: Path2D;

    constructor(props: PathProperties, channels: number = 1) {
        super({
            drawFunction: (ctx, properties) => {
                this.region = Path.drawPath(ctx, properties) ?? undefined;
            },
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
    }

    public isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
        if (this.region === undefined) {
            return false;
        }
        return ctx.isPointInPath(this.region, x, y, this.fillRule);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const bounds = this.getBounds();
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
        super.draw(ctx, {
            path: this.path,
            fillRule: this.fillRule,
            closePath: this.closePath,
            color: Color(this.red, this.green, this.blue, this.colorAlpha),
            start: this.start,
            end: this.end,
        });
    }

    public static drawPath(ctx: CanvasRenderingContext2D, properties: PathProperties): void|Path2D {
        ctx.beginPath();
        let path = properties.path.map(point => translatePosition(Path.getBoundsFromPath(properties.path), point)) as PositionType[];
        path = Path.getPathSegment(path, properties.start ?? 0, properties.end ?? 1);
        if (path.length === 0) {
            return;
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
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
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
        const totalDistance = distances.reduce((a, b) => a + b, 0);
        const newPath = [] as PositionType[];
        let pathRatio = 0;
        let startRatio = 0;
        let endRatio = 0;
        const startIdx = distances.findIndex((_, idx) => {
            const ratio = pathRatio + distances[idx] / totalDistance;
            if (ratio >= start) {
                startRatio = (start - pathRatio) / (distances[idx] / totalDistance);
                return true;
            }
            pathRatio = ratio;
            return false;
        });
        pathRatio = 0;
        const endIdx = distances.findIndex((_, idx) => {
            const ratio = pathRatio + distances[idx] / totalDistance;
            if (ratio >= end) {
                endRatio = (end - pathRatio) / (distances[idx] / totalDistance);
                return true;
            }
            pathRatio = ratio;
            return false;
        });
        if (startIdx === -1 || endIdx <= -1) {
            return [];
        }
        if (startIdx >= endIdx) {
            return [Path.interpolate(path[startIdx], path[startIdx + 1], startRatio), Path.interpolate(path[startIdx], path[startIdx + 1], endRatio)];
        }
        for (let idx = startIdx; idx <= endIdx + 1; idx++) {
            if (idx === startIdx) {
                newPath.push(Path.interpolate(path[idx], path[idx + 1], startRatio));
            } else if (idx === endIdx + 1) {
                newPath.push(Path.interpolate(path[idx - 1], path[Math.min(idx, path.length - 1)], endRatio));
            } else {
                newPath.push(path[idx]);
            }
        }
        return newPath;
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
    private region?: Path2D;

    constructor(props: PolygonProperties, channels: number = 1) {
        super({
            drawFunction: (ctx, properties) => {
                this.region = Polygon.drawPolygon(ctx, properties) ?? undefined;
            },
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

    public isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
        if (this.region === undefined) {
            return false;
        }
        return ctx.isPointInPath(this.region, x, y, this.fillRule);
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

    public static drawPolygon(ctx: CanvasRenderingContext2D, properties: PolygonProperties): void|Path2D {
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
    protected center: PositionType;
    protected radius: number;
    protected innerRadius: number;
    protected fillRule: CanvasFillRule;
    protected start: number;
    protected end: number;
    private region?: Path2D;

    constructor(props: StarProperties, channels: number = 1) {
        super({
            drawFunction: (ctx, properties) => {
                this.region = Star.drawStar(ctx, properties) ?? undefined;
            },
            stroke: props.stroke,
            ...Shape.initializeProps({
                bounds: Corners(props.center.x - props.radius, props.center.y - props.radius, props.center.x + props.radius, props.center.y + props.radius),
                ...props,
            }),
        }, channels);
        this.center = props.center;
        this.radius = props.radius;
        this.fillRule = props.fillRule ?? 'nonzero';
        this.innerRadius = props.innerRadius ?? props.radius * (3 - Math.sqrt(5)) / 2;
        this.start = props.start ?? 0;
        this.end = props.end ?? 1;
    }

    public isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
        if (this.region === undefined) {
            return false;
        }
        return ctx.isPointInPath(this.region, x, y, this.fillRule);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.x1 = this.center.x - this.radius;
        this.y1 = this.center.y - this.radius;
        this.x2 = this.center.x + this.radius;
        this.y2 = this.center.y + this.radius;
        super.draw(ctx, {
            center: this.center,
            radius: this.radius,
            innerRadius: this.innerRadius,
            color: Color(this.red, this.green, this.blue, this.colorAlpha),
            start: this.start,
            end: this.end,
        });
    }

    public static drawStar(ctx: CanvasRenderingContext2D, properties: StarProperties): void|Path2D {
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

    public static drawText(ctx: CanvasRenderingContext2D, properties: TextProperties) {
        const { text, fontSize, maxWidth, } = properties;
        const textWidth = ctx.measureText(text).width;
        const height = fontSize ?? 16;
        ctx.fillText(text, -textWidth / 2, height / 2, maxWidth ?? undefined);
        if (properties.stroke !== null && properties.stroke?.width !== 0) {
            const { color, width, join, cap, lineDash, lineDashGap, lineDashOffset } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? 'miter';
            ctx.lineCap = cap ?? 'round';
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${color?.alpha ?? 1})`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.strokeText(text, -textWidth / 2, height / 2, maxWidth ?? undefined);
        }

        // Bounding box for pointer events
        ctx.fillStyle = `rgba(0, 0, 0, 0)`
        ctx.moveTo(-textWidth / 2, -height / 2);
        ctx.lineTo(textWidth / 2, -height / 2);
        ctx.lineTo(textWidth / 2, height / 2);
        ctx.lineTo(-textWidth / 2, height / 2);
        ctx.closePath();
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
export class ImageShape extends StrokeableSprite<ImageProperties> {
    protected image: HTMLImageElement;
    protected srcX1: number;
    protected srcY1: number;
    protected srcX2: number;
    protected srcY2: number;
    protected useSrcBounds: boolean;

    constructor(props: ImageProperties, channels: number = 1) {
        super({
            drawFunction: ImageShape.drawImage,
            stroke: props.stroke,
            ...Shape.initializeProps(props),
        }, channels);
        this.image = props.image;
        this.srcX1 = props.srcBounds?.x1 ?? 0;
        this.srcY1 = props.srcBounds?.y1 ?? 0;
        this.srcX2 = props.srcBounds?.x2 ?? props.image.width;
        this.srcY2 = props.srcBounds?.y2 ?? props.image.height;
        this.useSrcBounds = props.srcBounds !== undefined;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx, {
            image: this.image,
            srcBounds: this.useSrcBounds ? Corners(this.srcX1, this.srcY1, this.srcX2, this.srcY2) : undefined,
            bounds: this.getBounds(),
        });
    }

    public static drawImage(ctx: CanvasRenderingContext2D, properties: ImageProperties) {
        const { image, srcBounds: sourceBounds, bounds } = properties;
        const width = bounds.x2 - bounds.x1;
        const height = bounds.y2 - bounds.y1;
        if (sourceBounds !== undefined) {
            ctx.drawImage(image, sourceBounds.x1, sourceBounds.y1, sourceBounds.x2 - sourceBounds.x1, sourceBounds.y2 - sourceBounds.y1, -width/2, -height/2, width, height);
        } else {
            ctx.drawImage(image, -width/2, -height/2, width, height);
        }
    }
}