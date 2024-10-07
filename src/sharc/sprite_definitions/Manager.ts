import { Bounds, Position } from "../Utils";
import { Shape, Sprite } from "../Sprite";
import { Alignment, AnchorPosition, HiddenManagerProperties, ManagerProperties, OmitBaseProps } from "../types/Sprites";
import NullSprite from "./NullSprite";

class Transformation {
    constructor(
        public translation: Position,
        public scale: Position
    ) {
        return Transformation.new(translation, scale);
    }

    public static new(translation: Position, scale: Position): { translation: Position; scale: Position } {
        return { translation, scale };
    }

    public static equals(...transformations: Transformation[]): boolean {
        for (let i = 1; i < transformations.length; i++) {
            if (
                transformations[i].translation.x !== transformations[i - 1].translation.x ||
                transformations[i].translation.y !== transformations[i - 1].translation.y ||
                transformations[i].scale.x !== transformations[i - 1].scale.x ||
                transformations[i].scale.y !== transformations[i - 1].scale.y
            ) {
                return false;
            }
        }
        return true;
    }

    public static get Identity() {
        return new Transformation(new Position(0, 0), new Position(1, 1));
    }

    public static applyInverse(transformation: Transformation, position: Position): Position {
        return new Position(
            position.x * transformation.scale.x + transformation.translation.x,
            position.y * transformation.scale.y + transformation.translation.y
        );
    }

    public static applyInverseToBounds(transformation: Transformation, bounds: Bounds): Bounds {
        const p1 = Transformation.applyInverse(transformation, new Position(bounds.x1, bounds.y1));
        const p2 = Transformation.applyInverse(transformation, new Position(bounds.x2, bounds.y2));
        return new Bounds(p1.x, p1.y, p2.x, p2.y);
    }

    public static combine(a: Transformation, b: Transformation): Transformation {
        if (Transformation.equals(a, Transformation.Identity)) {
            return b;
        }
        if (Transformation.equals(b, Transformation.Identity)) {
            return a;
        }
        return {
            translation: Position.sum(a.translation, Position.scale(b.translation, a.scale)),
            scale: Position.scale(a.scale, b.scale)
        };
    }
}

export default class Manager<DetailsType = any>
    extends Sprite<DetailsType, OmitBaseProps<ManagerProperties>, HiddenManagerProperties>
    implements Required<OmitBaseProps<ManagerProperties & HiddenManagerProperties>>
{
    constructor(props: ManagerProperties<DetailsType>) {
        super(props);
        this.anchor = props.anchor ?? null;
        this.align = props.align ?? null;
        this.padding = props.padding ?? null;
    }

    // NORMAL PROPERTIES
    public anchor: AnchorPosition | null = null;
    public align: Alignment | null = null;
    public padding: number | null = null;

    private getTotalBounds(shape: Shape, transformation: Transformation = Transformation.Identity): Bounds {
        transformation = Transformation.combine(transformation, new Transformation(shape.center, shape.scale));
        const selfBounds = Transformation.applyInverseToBounds(transformation, Bounds.wrtSelf(shape.bounds));
        const bounds =
            shape.constructor.name === "NullSprite"
                ? new Bounds( // TODO(gitpushjoe): might be a problem?
                      Number.POSITIVE_INFINITY,
                      Number.POSITIVE_INFINITY,
                      Number.NEGATIVE_INFINITY,
                      Number.NEGATIVE_INFINITY
                  )
                : new Bounds(
                      Math.min(selfBounds.x1, selfBounds.x2),
                      Math.min(selfBounds.y1, selfBounds.y2),
                      Math.max(selfBounds.x1, selfBounds.x2),
                      Math.max(selfBounds.y1, selfBounds.y2)
                  );
        for (const child of shape.children) {
            const childBounds = this.getTotalBounds(child, transformation);
            bounds.x1 = Math.min(bounds.x1, childBounds.x1);
            bounds.y1 = Math.min(bounds.y1, childBounds.y1);
            bounds.x2 = Math.max(bounds.x2, childBounds.x2);
            bounds.y2 = Math.max(bounds.y2, childBounds.y2);
        }
        return bounds;
    }

    public update(updates: ("align" | "anchor" | "padding")[]) {
        updates = updates.filter(value => ["align", "anchor", "padding"].includes(value));
        if (updates.length === 0 || this.children.length === 0) {
            return;
        }
        const totalBounds = new Bounds(
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY
        );
        const childrenTotalBounds: Bounds[] = [];
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child.scale.x !== 1 || child.scale.y !== 1) {
                const nullSprite = new NullSprite({});
                this._children[i] = nullSprite;
                nullSprite.addChild(child);
                child = nullSprite;
            }
            const childBounds = this.getTotalBounds(child);
            childrenTotalBounds.push(childBounds);
            totalBounds.x1 = Math.min(totalBounds.x1, childBounds.x1);
            totalBounds.y1 = Math.min(totalBounds.y1, childBounds.y1);
            totalBounds.x2 = Math.max(totalBounds.x2, childBounds.x2);
            totalBounds.y2 = Math.max(totalBounds.y2, childBounds.y2);
        }
        if (updates.includes("padding") && this.padding !== null) {
            if (["row-center", "top", "bottom"].includes(this.align!)) {
                let x2 = childrenTotalBounds[0].x2;
                for (let i = 1; i < this.children.length; i++) {
                    const targetValue = childrenTotalBounds[i - 1].x2 + this.padding;
                    const offset = targetValue - childrenTotalBounds[i].x1;
                    this.children[i].centerX += offset;
                    childrenTotalBounds[i].x1 += offset;
                    childrenTotalBounds[i].x2 += offset;
                    x2 = childrenTotalBounds[i].x2;
                }
                totalBounds.x1 = Math.min(childrenTotalBounds[0].x1, x2);
                totalBounds.x2 = Math.max(childrenTotalBounds[0].x1, x2);
            } else if (["column-center", "left", "right"].includes(this.align!)) {
                let y2 = childrenTotalBounds[0].y2;
                for (let i = 1; i < this.children.length; i++) {
                    const targetValue = childrenTotalBounds[i - 1].y2 + this.padding;
                    const offset = targetValue - childrenTotalBounds[i].y1;
                    this.children[i].centerY += offset;
                    childrenTotalBounds[i].y1 += offset;
                    childrenTotalBounds[i].y2 += offset;
                    y2 = childrenTotalBounds[i].y2;
                }
                totalBounds.y1 = Math.min(childrenTotalBounds[0].y1, y2);
                totalBounds.y2 = Math.max(childrenTotalBounds[0].y1, y2);
            }
        }
        updates = updates.filter(value => value !== "padding");
        if (updates.includes("align") && this.align !== null) {
            const [prop1, prop2, propCenter] = ["row-center", "top", "bottom"].includes(this.align)
                ? (["y1", "y2", "centerY"] as const)
                : (["x1", "x2", "centerX"] as const);
            const compareProp =
                this.align === "row-center"
                    ? "centerY"
                    : this.align === "top"
                      ? "y1"
                      : this.align === "bottom"
                        ? "y2"
                        : this.align === "column-center"
                          ? "centerX"
                          : this.align === "left"
                            ? "x1"
                            : this.align === "right"
                              ? "x2"
                              : (() => {
                                    throw new Error("Invalid align value");
                                })();
            const targetValue = compareProp.startsWith("center")
                ? (totalBounds[prop1] + totalBounds[prop2]) / 2
                : totalBounds[compareProp as "x1" | "x2" | "y1" | "y2"];
            totalBounds[prop1] = Number.POSITIVE_INFINITY;
            totalBounds[prop2] = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                const childValue = compareProp.startsWith("center")
                    ? (childrenTotalBounds[i][prop1] + childrenTotalBounds[i][prop2]) / 2
                    : childrenTotalBounds[i][compareProp as "x1" | "x2" | "y1" | "y2"];
                const offset = targetValue - childValue;
                child[propCenter] += offset;
                childrenTotalBounds[i][prop1] += offset;
                childrenTotalBounds[i][prop2] += offset;
                totalBounds[prop1] = Math.min(totalBounds[prop1], childrenTotalBounds[i][prop1]);
                totalBounds[prop2] = Math.max(totalBounds[prop2], childrenTotalBounds[i][prop2]);
            }
        }
        updates = updates.filter(value => value !== "align");
        if (updates.includes("anchor") && this.anchor !== null) {
            const position =
                this.anchor === "top-left"
                    ? new Position(totalBounds.x1, totalBounds.y1)
                    : this.anchor === "top-center"
                      ? new Position((totalBounds.x1 + totalBounds.x2) / 2, totalBounds.y1)
                      : this.anchor === "top-right"
                        ? new Position(totalBounds.x2, totalBounds.y1)
                        : this.anchor === "center-left"
                          ? new Position(totalBounds.x1, (totalBounds.y1 + totalBounds.y2) / 2)
                          : this.anchor === "center"
                            ? new Position((totalBounds.x1 + totalBounds.x2) / 2, (totalBounds.y1 + totalBounds.y2) / 2)
                            : this.anchor === "center-right"
                              ? new Position(totalBounds.x2, (totalBounds.y1 + totalBounds.y2) / 2)
                              : this.anchor === "bottom-left"
                                ? new Position(totalBounds.x1, totalBounds.y2)
                                : this.anchor === "bottom-center"
                                  ? new Position((totalBounds.x1 + totalBounds.x2) / 2, totalBounds.y2)
                                  : this.anchor === "bottom-right"
                                    ? new Position(totalBounds.x2, totalBounds.y2)
                                    : (() => {
                                          throw new Error("Invalid anchor value");
                                      })();
            const offset = Position.diff(this.center, position);
            for (const child of this.children) {
                child.center = Position.sum(child.center, offset);
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, properties?: ManagerProperties) {
        super.draw(ctx, properties);
    }

    public readonly drawFunction = (): Path2D => {
        return new Path2D();
    };
}
