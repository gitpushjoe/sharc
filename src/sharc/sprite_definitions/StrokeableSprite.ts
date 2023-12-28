import { ColorType } from "../types/Common";
import { Sprite } from "../Sprite";
import {
    StrokeProperties,
    HiddenStrokeProperties,
    StrokeType,
    StrokeableSpriteNormalProperties,
    DEFAULT_PROPERTIES,
    HIDDEN_SHAPE_PROPERTIES
} from "../types/Sprites";

export default class StrokeableSprite<
        DetailsType = any,
        Properties = object,
        HiddenProperties = object,
        NormalProps extends keyof (Properties & HiddenProperties) = keyof (Properties & HiddenProperties)
    >
    extends Sprite<
        DetailsType,
        Properties & StrokeProperties,
        HiddenProperties & HiddenStrokeProperties,
        NormalProps | StrokeableSpriteNormalProperties
    >
    implements Required<StrokeProperties & HiddenStrokeProperties>
{
    constructor(
        derived_props: Required<
            Omit<Pick<Properties & HiddenProperties, NormalProps>, keyof (DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES)>
        >,
        props: { stroke?: StrokeType | null } & Properties & DEFAULT_PROPERTIES<DetailsType>
    ) {
        super(
            { // eslint-disable-line @typescript-eslint/no-unsafe-argument
                ...derived_props,
                strokeRed: (props.stroke?.color?.red ?? 0),
                strokeGreen: (props.stroke?.color?.green ?? 0),
                strokeBlue: props.stroke?.color?.blue ?? 0,
                strokeAlpha: props.stroke?.color?.alpha ?? 1,
                strokeWidth: props.stroke?.lineWidth ?? 1,
                strokeJoin: props.stroke?.lineJoin ?? "miter",
                strokeCap: props.stroke?.lineCap ?? "butt",
                strokeDash: props.stroke?.lineDash ?? 0,
                strokeDashGap: props.stroke?.lineDashGap ?? props.stroke?.lineDash ?? 0,
                strokeOffset: props.stroke?.lineDashOffset ?? 0,
                strokeEnabled: props.stroke !== null && props.stroke !== undefined
            } as any, 
            props
        );
    }

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

    public get strokeEnabled(): boolean {
        return this.properties.strokeEnabled;
    }
    public set strokeEnabled(value: boolean) {
        this.properties.strokeEnabled = value as HiddenProperties extends { strokeEnabled: any }
            ? HiddenProperties["strokeEnabled"]
            : never & boolean;
    }

    public get strokeRed(): number {
        return this.properties.strokeRed;
    }

    public set strokeRed(value: number) {
        this.properties.strokeRed = value as HiddenProperties extends { strokeRed: any }
            ? HiddenProperties["strokeRed"]
            : never & number;
    }

    public get strokeGreen(): number {
        return this.properties.strokeGreen;
    }

    public set strokeGreen(value: number) {
        this.properties.strokeGreen = value as HiddenProperties extends { strokeRed: any }
            ? HiddenProperties["strokeRed"]
            : never & number;
    }

    public get strokeBlue(): number {
        return this.properties.strokeBlue;
    }

    public set strokeBlue(value: number) {
        this.properties.strokeBlue = value as HiddenProperties extends { strokeBlue: any }
            ? HiddenProperties["strokeBlue"]
            : never & number;
    }

    public get strokeAlpha(): number {
        return this.properties.strokeAlpha;
    }
    public set strokeAlpha(value: number) {
        this.properties.strokeAlpha = value as HiddenProperties extends { strokeAlpha: any }
            ? HiddenProperties["strokeAlpha"]
            : never & number;
    }

    public get strokeWidth(): number {
        return this.properties.strokeWidth;
    }
    public set strokeWidth(value: number) {
        this.properties.strokeWidth = value as HiddenProperties extends { strokeWidth: any }
            ? HiddenProperties["strokeWidth"]
            : never & number;
    }

    public get strokeJoin(): CanvasLineJoin {
        return this.properties.strokeJoin;
    }
    public set strokeJoin(value: CanvasLineJoin) {
        this.properties.strokeJoin = value as HiddenProperties extends { strokeJoin: any }
            ? HiddenProperties["strokeJoin"]
            : never & CanvasLineJoin;
    }

    public get strokeCap(): CanvasLineCap {
        return this.properties.strokeCap;
    }
    public set strokeCap(value: CanvasLineCap) {
        this.properties.strokeCap = value as HiddenProperties extends { strokeCap: any }
            ? HiddenProperties["strokeCap"]
            : never & CanvasLineCap;
    }

    public get strokeDash(): number {
        return this.properties.strokeDash;
    }
    public set strokeDash(value: number) {
        this.properties.strokeDash = value as HiddenProperties extends { strokeDash: any }
            ? HiddenProperties["strokeDash"]
            : never & number;
    }

    public get strokeDashGap(): number {
        return this.properties.strokeDashGap;
    }
    public set strokeDashGap(value: number) {
        this.properties.strokeDashGap = value as HiddenProperties extends { strokeDashGap: any }
            ? HiddenProperties["strokeDashGap"]
            : never & number;
    }

    public get strokeOffset(): number {
        return this.properties.strokeOffset;
    }
    public set strokeOffset(value: number) {
        this.properties.strokeOffset = value as HiddenProperties extends { strokeOffset: any }
            ? HiddenProperties["strokeOffset"]
            : never & number;
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

    public draw(ctx: CanvasRenderingContext2D, properties?: Required<Properties>) {
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
