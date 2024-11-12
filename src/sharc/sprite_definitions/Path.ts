import { Position, Bounds } from "../Utils";
import { PathProperties, OmitBaseProps, DropShadowType } from "../types/Sprites";
import SlidingStrokeableSprite from "./SlidingStrokeableSprite";
import StrokeableSprite from "./StrokeableSprite";

export default class Path<DetailsType = any>
    extends SlidingStrokeableSprite<DetailsType, OmitBaseProps<PathProperties>, object>
    implements Required<OmitBaseProps<PathProperties>>
{
    constructor(props: PathProperties<DetailsType>, defaults?: PathProperties<DetailsType>) {
        super(props, defaults);
        this.path = props.path ?? defaults?.path ?? this.path;
        this.closePath = props.closePath ?? defaults?.closePath ?? this.closePath;
        this.fillRule = props.fillRule ?? defaults?.fillRule ?? this.fillRule;
        this.startRatio = props.startRatio ?? defaults?.startRatio ?? this.startRatio;
        this.endRatio = props.endRatio ?? defaults?.endRatio ?? this.endRatio;
        this._bounds = Path.getBoundsFromPath(this.path);
    }

    // NORMAL PROPERTIES
    public path: Position[] = [];
    public closePath = false;
    public fillRule: CanvasFillRule = "nonzero";
    public startRatio = 0;
    public endRatio = 1;

    protected shiftX(value: number) {
        for (let i = 0; i < this.path.length; ++i) {
            this.path[i].x += value;
        }
        this._bounds = Path.getBoundsFromPath(this.path);
    }
    protected shiftY(value: number) {
        for (let i = 0; i < this.path.length; ++i) {
            this.path[i].y += value;
        }
        this._bounds = Path.getBoundsFromPath(this.path);
    }

    protected shift(value: Position) {
        for (let i = 0; i < this.path.length; ++i) {
            this.path[i].x += value.x;
            this.path[i].y += value.y;
        }
        this._bounds = Path.getBoundsFromPath(this.path);
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        super.draw(ctx, {
            path: this.path,
            closePath: this.closePath,
            fillRule: this.fillRule,
            startRatio: this.startRatio,
            endRatio: this.endRatio
        });
    }

    public static readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: PathProperties,
        dropShadow?: DropShadowType | null,
        colorAlpha?: number
    ): Path2D => {
        let path: Position[] = [];
        for (const point of (properties.path ?? [])) {
            path.push(Position.wrtBounds(point, Path.getBoundsFromPath(properties.path ?? [])));
        }
        path = Path.getPathSegment(path, properties.startRatio ?? 0, properties.endRatio ?? 1);
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
        StrokeableSprite.strokeDropShadow(ctx, dropShadow, region, properties.stroke, colorAlpha, properties.fillRule);
        ctx.fill(region, properties.fillRule ?? "nonzero");
        StrokeableSprite.strokeRegion(ctx, properties.stroke, region);
        return region;
    };

    public readonly drawFunction = Path.drawFunction;

    public static getPathSegment(path: Position[], start: number, end: number): Position[] {
        if (start === 0 && end === 1) {
            return path;
        } else if (start === end) {
            return [];
        } else if (start > end) {
            return Path.getPathSegment(path, end, start).reverse();
        } else if (start < 0 || end > 1) {
            throw new Error("Start and end must be between 0 and 1");
        }
        const distances = path.map((point, idx) => Path.calculateDistance(point, path[idx + 1] ?? path[0]));
        distances.pop();
        const totalDistance = distances.reduce((a, b) => a + b, 0);
        const newPath = [] as Position[];
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
            if (ratio + currentRatio > start) {
                newPath.push(Path.interpolate(path[currentIdx], path[currentIdx + 1] ?? path[0], leftRatio));
            }
            if (ratio < end && ratio + currentRatio > end) {
                newPath.push(Path.interpolate(path[currentIdx], path[currentIdx + 1] ?? path[0], rightRatio));
                return newPath;
            }
            ratio += currentRatio;
            currentIdx++;
        }
        return end === 1 ? newPath.concat(path[path.length - 1]) : newPath;
    }

    public static interpolate(point1: Position, point2: Position, ratio: number): Position {
        return new Position(point1.x + ratio * (point2.x - point1.x), point1.y + ratio * (point2.y - point1.y));
    }

    public static calculateDistance(point1: Position, point2: Position): number {
        return Position.distance(point1, point2);
    }

    public static getBoundsFromPath(path: Position[]): Bounds {
        const bounds = new Bounds(
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
        );
        for (let i = 0; i < path.length; ++i) {
            const point = path[i];
            bounds.x1 = Math.min(bounds.x1, point.x);
            bounds.y1 = Math.min(bounds.y1, point.y);
            bounds.x2 = Math.max(bounds.x2, point.x);
            bounds.y2 = Math.max(bounds.y2, point.y);
        }
        return bounds;
    }
}
