import { translatePosition, Position, Corners } from "../Utils";
import { PositionType, BoundsType } from "../types/Common";
import { PathProperties, OmitBaseProps } from "../types/Sprites";
import StrokeableSprite from "./StrokeableSprite";

export default class Path<DetailsType = any>
    extends StrokeableSprite<DetailsType, OmitBaseProps<PathProperties>, object>
    implements Required<OmitBaseProps<PathProperties>>
{
    constructor(props: PathProperties<DetailsType>) {
        super(props);
        this.path = props.path ?? [];
        this.closePath = props.closePath ?? false;
        this.fillRule = props.fillRule ?? "nonzero";
        this.startRatio = props.startRatio ?? 0;
        this.endRatio = props.endRatio ?? 1;
        const bounds = Path.getBoundsFromPath(this.path);
        this.x1 = bounds.x1;
        this.y1 = bounds.y1;
        this.x2 = bounds.x2;
        this.y2 = bounds.y2;
    }

    // NORMAL PROPERTIES
    public path: PositionType[] = [];
    public closePath: boolean = false;
    public fillRule: CanvasFillRule = "nonzero";
    public startRatio: number = 0;
    public endRatio: number = 1;

    // Bounds cannot be set, only get
    public set bounds(_value: BoundsType) {
        throw new Error("Bounds cannot be set on Path");
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
