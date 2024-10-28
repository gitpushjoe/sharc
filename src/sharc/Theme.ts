import * as Sprites from "./Sprites";
import { DefaultsType } from "./types/Theme";

export class Theme {
    public NullSprite = Sprites.NullSprite;
    public Line = Sprites.Line;
    public Rect = Sprites.Rect;
    public Ellipse = Sprites.Ellipse;
    public BezierCurve = Sprites.BezierCurve;
    public Path = Sprites.Path;
    public Polygon = Sprites.Polygon;
    public Star = Sprites.Star;
    public TextSprite = Sprites.TextSprite;
    public ImageSprite = Sprites.ImageSprite;
    public LabelSprite = Sprites.LabelSprite;
    public ManagerSprite = Sprites.ManagerSprite;
    public FactorySprite = Sprites.FactorySprite;
    public PolarWrapper = Sprites.PolarWrapper;
    public defaults: DefaultsType = {};

    constructor(defaults: DefaultsType) {
        return {
            NullSprite: class {
                constructor(props: ConstructorParameters<typeof Sprites.NullSprite>[0]) {
                    return new Sprites.NullSprite(props, defaults.NullSprite);
                }
            } as typeof this.NullSprite,
            Line: class {
                constructor(props: ConstructorParameters<typeof Sprites.Line>[0]) {
                    return new Sprites.Line(props, defaults.Line);
                }
            } as typeof this.Line,
            Rect: class {
                constructor(props: ConstructorParameters<typeof Sprites.Rect>[0]) {
                    return new Sprites.Rect(props, defaults.Rect);
                }
            } as typeof this.Rect,
            Ellipse: class {
                constructor(props: ConstructorParameters<typeof Sprites.Ellipse>[0]) {
                    return new Sprites.Ellipse(props, defaults.Ellipse);
                }
            } as typeof this.Ellipse,
            BezierCurve: class {
                constructor(props: ConstructorParameters<typeof Sprites.BezierCurve>[0]) {
                    return new Sprites.BezierCurve(props, defaults.BezierCurve);
                }
            } as typeof this.BezierCurve,
            Path: class {
                constructor(props: ConstructorParameters<typeof Sprites.Path>[0]) {
                    return new Sprites.Path(props, defaults.Path);
                }
            } as typeof this.Path,
            Polygon: class {
                constructor(props: ConstructorParameters<typeof Sprites.Polygon>[0]) {
                    return new Sprites.Polygon(props, defaults.Polygon);
                }
            } as typeof this.Polygon,
            Star: class {
                constructor(props: ConstructorParameters<typeof Sprites.Star>[0]) {
                    return new Sprites.Star(props, defaults.Star);
                }
            } as typeof this.Star,
            TextSprite: class {
                constructor(props: ConstructorParameters<typeof Sprites.TextSprite>[0]) {
                    return new Sprites.TextSprite(props, defaults.TextSprite);
                }
            } as typeof this.TextSprite,
            ImageSprite: class {
                constructor(props: ConstructorParameters<typeof Sprites.ImageSprite>[0]) {
                    return new Sprites.ImageSprite(props, defaults.ImageSprite);
                }
            } as typeof this.ImageSprite,
            LabelSprite: class {
                constructor(props: ConstructorParameters<typeof Sprites.LabelSprite>[0]) {
                    return new Sprites.LabelSprite(props, defaults.LabelSprite);
                }
            } as typeof this.LabelSprite,
            ManagerSprite: class {
                constructor(props: ConstructorParameters<typeof Sprites.ManagerSprite>[0]) {
                    return new Sprites.ManagerSprite(props, defaults.ManagerSprite);
                }
            } as typeof this.ManagerSprite,
            FactorySprite: class {
                constructor(props: ConstructorParameters<typeof Sprites.FactorySprite>[0]) {
                    return new Sprites.FactorySprite(props, defaults.FactorySprite as Sprites.FactorySprite<any>);
                }
            } as typeof this.FactorySprite,
            PolarWrapper: class {
                constructor(props: ConstructorParameters<typeof Sprites.PolarWrapper>[0]) {
                    return new Sprites.PolarWrapper(props, defaults.PolarWrapper);
                }
            } as typeof this.PolarWrapper,
            defaults
        };
    }
}
