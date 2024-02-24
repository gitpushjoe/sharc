import { ColorType } from "../types/Common";
import { Sprite } from "../Sprite";
import { StrokeProperties, HiddenStrokeProperties, StrokeType, DEFAULT_PROPERTIES } from "../types/Sprites";

export default class StrokeableSprite<DetailsType = any, Properties = object, HiddenProperties = object>
    extends Sprite<DetailsType, Properties & StrokeProperties, HiddenProperties & HiddenStrokeProperties>
    implements Required<StrokeProperties & HiddenStrokeProperties>
{
    constructor(props: { stroke?: StrokeType | null } & Properties & DEFAULT_PROPERTIES<DetailsType>) {
        super(props);
        this.strokeRed = props.stroke?.color?.red ?? 0;
        this.strokeGreen = props.stroke?.color?.green ?? 0;
        this.strokeBlue = props.stroke?.color?.blue ?? 0;
        this.strokeAlpha = props.stroke?.color?.alpha ?? 1;
        this.strokeWidth = props.stroke?.lineWidth ?? 1;
        this.strokeJoin = props.stroke?.lineJoin ?? "miter";
        this.strokeCap = props.stroke?.lineCap ?? "butt";
        this.strokeDash = props.stroke?.lineDash ?? 0;
        this.strokeDashGap = props.stroke?.lineDashGap ?? props.stroke?.lineDash ?? 0;
        this.strokeOffset = props.stroke?.lineDashOffset ?? 0;
        this.strokeEnabled = props.stroke !== null && props.stroke !== undefined;
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
