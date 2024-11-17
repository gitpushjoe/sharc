import { Color } from "../Utils";
import { Sprite } from "../Sprite";
import {
    StrokeProperties,
    HiddenStrokeProperties,
    StrokeType,
    DEFAULT_PROPERTIES,
    DropShadowType
} from "../types/Sprites";
import { ColorType } from "sharc/types/Common";

export default class StrokeableSprite<DetailsType = any, Properties = object, HiddenProperties = object>
    extends Sprite<DetailsType, Properties & StrokeProperties, HiddenProperties & HiddenStrokeProperties>
    implements Required<StrokeProperties & HiddenStrokeProperties>
{
    constructor(
        props: { stroke?: StrokeType | null } & Properties & DEFAULT_PROPERTIES<DetailsType>,
        defaults?: { stroke?: StrokeType | null } & Properties & DEFAULT_PROPERTIES<DetailsType>
    ) {
        super(props, defaults);
        this.strokeRed = props.stroke?.color?.red ?? defaults?.stroke?.color?.red ?? this.strokeRed;
        this.strokeGreen = props.stroke?.color?.green ?? defaults?.stroke?.color?.green ?? this.strokeGreen;
        this.strokeBlue = props.stroke?.color?.blue ?? defaults?.stroke?.color?.blue ?? this.strokeBlue;
        this.strokeAlpha = props.stroke?.color?.alpha ?? defaults?.stroke?.color?.alpha ?? this.strokeAlpha;
        this.strokeWidth = props.stroke?.lineWidth ?? defaults?.stroke?.lineWidth ?? this.strokeWidth;
        this.strokeJoin = props.stroke?.lineJoin ?? defaults?.stroke?.lineJoin ?? this.strokeJoin;
        this.strokeCap = props.stroke?.lineCap ?? defaults?.stroke?.lineCap ?? this.strokeCap;
        this.strokeDash = props.stroke?.lineDash ?? defaults?.stroke?.lineDash ?? this.strokeDash;
        this.strokeDashGap =
            props.stroke?.lineDashGap ??
            props.stroke?.lineDash ??
            defaults?.stroke?.lineDashGap ??
            props.stroke?.lineDash ??
            this.strokeDashGap;
        this.strokeOffset = props.stroke?.lineDashOffset ?? defaults?.stroke?.lineDashOffset ?? this.strokeOffset;
        this.strokeEnabled =
            (props.stroke !== null && props.stroke !== undefined) ||
            (defaults?.stroke !== null && defaults?.stroke !== undefined);
    }

    // NORMAL PROPERTIES
    public strokeRed = 0;
    public strokeGreen = 0;
    public strokeBlue = 0;
    public strokeAlpha = 1;
    public strokeWidth = 1;
    public strokeJoin: CanvasLineJoin = "miter";
    public strokeCap: CanvasLineCap = "butt";
    public strokeDash = 0;
    public strokeDashGap = 0;
    public strokeOffset = 0;
    public strokeEnabled = false;

    // AGGREGATE PROPERTIES
    public get stroke(): StrokeType | null {
        return this.strokeEnabled
            ? {
                  color: {
                      red: this.strokeRed,
                      green: this.strokeGreen,
                      blue: this.strokeBlue,
                      alpha: this.strokeAlpha
                  },
                  lineWidth: this.strokeWidth,
                  lineJoin: this.strokeJoin,
                  lineCap: this.strokeCap,
                  lineDash: this.strokeDash,
                  lineDashGap: this.strokeDashGap,
                  lineDashOffset: this.strokeOffset
              }
            : null;
    }
    public set stroke(value: StrokeType | null) {
        this.strokeEnabled = value !== null;
        if (value !== null) {
            this.strokeRed = value.color?.red ?? 0;
            this.strokeGreen = value.color?.green ?? 0;
            this.strokeBlue = value.color?.blue ?? 0;
            this.strokeAlpha = value.color?.alpha ?? 1;
            this.strokeWidth = value.lineWidth ?? 1;
            this.strokeJoin = value.lineJoin ?? "miter";
            this.strokeCap = value.lineCap ?? "butt";
            this.strokeDash = value.lineDash ?? 0;
            this.strokeDashGap = value.lineDashGap ?? value.lineDash ?? 0;
            this.strokeOffset = value.lineDashOffset ?? 0;
        }
    }

    public get strokeColor(): ColorType {
        return {
            red: this.strokeRed,
            green: this.strokeGreen,
            blue: this.strokeBlue,
            alpha: this.strokeAlpha
        };
    }
    public set strokeColor(value: ColorType) {
        this.strokeRed = value.red;
        this.strokeGreen = value.green;
        this.strokeBlue = value.blue;
        this.strokeAlpha = value.alpha;
    }

    public static strokeRegion(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        stroke: StrokeType | null | undefined,
        region?: Path2D
    ) {
        if (stroke === null || stroke === undefined) {
            return;
        }
        if (stroke.lineWidth === 0) {
            return;
        }
        ctx.lineWidth = stroke.lineWidth ?? 1;
        ctx.lineJoin = stroke.lineJoin ?? "miter";
        ctx.lineCap = stroke.lineCap ?? "round";
        ctx.strokeStyle = `rgba(${stroke.color?.red ?? 0}, ${stroke.color?.green ?? 0}, ${stroke.color?.blue ?? 0}, ${stroke.color?.alpha ?? 1})`;
        ctx.setLineDash([stroke.lineDash ?? 0, stroke.lineDashGap ?? 0]);
        ctx.lineDashOffset = stroke.lineDashOffset ?? 0;
        if (region) {
            ctx.stroke(region);
        }
    }

    public static strokeDropShadow(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        dropShadow: DropShadowType | null | undefined,
        region: Path2D | undefined,
        stroke?: StrokeType | null,
        colorAlpha = 1,
        fillRule: CanvasFillRule = "evenodd",
        callback?: (
            ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
            dropshadow?: DropShadowType | null | undefined
        ) => void
    ) {
        if (!dropShadow) {
            return;
        }
        ctx.save();
        ctx.translate(dropShadow.offset?.x ?? 0, dropShadow.offset?.y ?? 0);
        ctx.scale(dropShadow.scale?.x ?? 1, dropShadow?.scale?.y ?? 1);
        ctx.fillStyle = Color.toString(
            Color(
                dropShadow.color?.red ?? 0,
                dropShadow.color?.green ?? 0,
                dropShadow.color?.blue ?? 0,
                (dropShadow.color?.alpha ?? 0) * (colorAlpha ?? 1) * (dropShadow.alpha ?? 1)
            )
        );
        if (dropShadow.blur) {
            ctx.filter = `blur(${dropShadow.blur}px)`;
        }
        if (callback) {
            callback(ctx, dropShadow);
        } else if (region) {
            ctx.fill(region, fillRule);
        }
        if (stroke) {
            const prevStrokeColor = stroke?.color ?? Color();
            const strokeColor = Color(
                dropShadow.color?.red ?? 0,
                dropShadow.color?.green ?? 0,
                dropShadow.color?.blue ?? 0,
                (dropShadow.color?.alpha ?? 0) * (stroke?.color?.alpha ?? 1) * (dropShadow.alpha ?? 1)
            );
            stroke ? (stroke.color = strokeColor) : 0;
            StrokeableSprite.strokeRegion(ctx, stroke, region);
            stroke ? (stroke.color = prevStrokeColor) : 0;
        }
        ctx.restore();
    }

    public draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, properties?: Required<Properties>) {
        super.draw(ctx, {
            ...properties!,
            stroke: this.strokeEnabled
                ? {
                      color: {
                          red: this.strokeRed,
                          green: this.strokeGreen,
                          blue: this.strokeBlue,
                          alpha: this.strokeAlpha
                      },
                      lineWidth: this.strokeWidth,
                      lineJoin: this.strokeJoin,
                      lineCap: this.strokeCap,
                      lineDash: this.strokeDash,
                      lineDashGap: this.strokeDashGap,
                      lineDashOffset: this.strokeOffset
                  }
                : null
        } as Required<Properties & StrokeProperties>);
    }
}
