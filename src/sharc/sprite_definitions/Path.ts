import { translatePosition, Position, Corners } from "../Utils";
import { PositionType, BoundsType } from "../types/Common";
import { PathProperties, PathNormalProperties, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class Path<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<PathProperties>, object, PathNormalProperties>
    implements Required<OmitBaseProps<PathProperties>>
{
    constructor(props: PathProperties<DetailsType>) {
        super(
            {
                path: props.path ?? [],
                closePath: props.closePath ?? false,
                fillRule: props.fillRule ?? "nonzero",
                startRatio: props.startRatio ?? 0,
                endRatio: props.endRatio ?? 1
            },
            props as typeof props & { bounds: BoundsType }
        );
        const bounds = Path.getBoundsFromPath(this.path);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
    }

    public get path(): PositionType[] {
        return this.properties.path;
    }
    public set path(path: PositionType[]) {
        this.properties.path = path;
    }

    public get closePath(): boolean {
        return this.properties.closePath;
    }
    public set closePath(closePath: boolean) {
        this.properties.closePath = closePath;
    }

    public get fillRule(): CanvasFillRule {
        return this.properties.fillRule;
    }
    public set fillRule(fillRule: CanvasFillRule) {
        this.properties.fillRule = fillRule;
    }

    public get startRatio(): number {
        return this.properties.startRatio;
    }
    public set startRatio(startRatio: number) {
        this.properties.startRatio = startRatio;
    }

    public get endRatio(): number {
        return this.properties.endRatio;
    }
    public set endRatio(endRatio: number) {
        this.properties.endRatio = endRatio;
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        const bounds = Path.getBoundsFromPath(this.path);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
        super.draw(ctx, {
            path: this.path,
            fillRule: this.fillRule,
            closePath: this.closePath,
            startRatio: this.startRatio,
            endRatio: this.endRatio
        });
    }

    public get bounds(): BoundsType {
        return Path.getBoundsFromPath(this.path);
    }
    public set bounds(_bounds: BoundsType) {
        throw new Error("Path bounds cannot be set");
    }

    public static readonly drawFunction = (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        properties: PathProperties
    ): Path2D => {
        let path =
            properties.path?.map(point => translatePosition(Path.getBoundsFromPath(properties.path ?? []), point)) ??
            [];
        path = Path.getPathSegment(path, properties.startRatio ?? 0, properties.endRatio ?? 1);
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
        ctx.fill(region, properties.fillRule ?? "nonzero");
        if (properties.stroke !== null && properties.stroke?.lineWidth !== 0) {
            const {
                color,
                lineWidth: width,
                lineJoin: join,
                lineCap: cap,
                lineDash,
                lineDashGap,
                lineDashOffset
            } = properties.stroke!;
            ctx.lineWidth = width ?? 1;
            ctx.lineJoin = join ?? "miter";
            ctx.lineCap = cap ?? "round";
            ctx.strokeStyle = `rgba(${color?.red ?? 0}, ${color?.green ?? 0}, ${color?.blue ?? 0}, ${
                color?.alpha ?? 1
            })`;
            ctx.setLineDash([lineDash ?? 0, lineDashGap ?? 0]);
            ctx.lineDashOffset = lineDashOffset ?? 0;
            ctx.stroke(region);
        }
        return region;
    };

    public readonly drawFunction = Path.drawFunction;

    public static getPathSegment(path: PositionType[], start: number, end: number): PositionType[] {
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
        const newPath = [] as PositionType[];
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

    public static interpolate(point1: PositionType, point2: PositionType, ratio: number): PositionType {
        return Position(point1.x + ratio * (point2.x - point1.x), point1.y + ratio * (point2.y - point1.y));
    }

    public static calculateDistance(point1: PositionType, point2: PositionType): number {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }

    public static getBoundsFromPath(path: PositionType[]): BoundsType {
        return Corners(
            Math.min(...path.map(point => point.x)),
            Math.min(...path.map(point => point.y)),
            Math.max(...path.map(point => point.x)),
            Math.max(...path.map(point => point.y))
        );
    }
}
