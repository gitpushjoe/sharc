import { useEffect, useRef } from "react";
import CodeBlock from "../components/Code/Block";
import CodeBlurb from "../components/Code/Blurb";
import CodeHeader from "../components/Code/Header";
import InlineCode from "../components/Code/Inline";
import { Hyperlink } from "../components/Sidebar/Hyperlink";
import CodeShowcase from "../components/Code/Showcase";
import { Stage } from "../../sharc/Stage";
import { Animate, Colors, Easing } from "../../sharc/Utils";
import { BezierCurve, Ellipse, ImageSprite, Line, NullSprite, Path, Polygon, Rect, Star, TextSprite } from "../../sharc/Sprites";
import { useParams } from "react-router";

export { Usage } from "./Sprites/Usage"
export { Properties } from "./Sprites/Properties"
export { Parenting } from "./Sprites/Parenting"
export { HandlingUserInput } from "./Sprites/HandlingUserInput"
export { Strokeable } from "./Sprites/Strokeable"
export { LinePage } from "./Sprites/Line"
export { RectPage } from "./Sprites/Rect"
export { EllipsePage } from "./Sprites/Ellipse"
export { BezierCurvePage } from "./Sprites/BezierCurve"
export { PathPage } from "./Sprites/Path"
export { PolygonPage } from "./Sprites/Polygon"
export { StarPage } from "./Sprites/Star"
export { TextPage } from "./Sprites/Text"
export { ImagePage } from "./Sprites/Image"
export { NullSpritePage } from "./Sprites/NullSprite"

export function Sprites() {

    const params = useParams() as {category: string, subcategory: string, section: string};
    const universalSpriteProperties = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const element = document.getElementById(params.section!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    return <>
        <h1>
            Sprites
        </h1>
        <p>
            {'Sprites are the building blocks of sharc. They are the objects that are drawn to the canvas. '}
            {'Sprites can be added to the stage\'s root, or to other sprites. '}
            {'Sprites can be moved, rotated, scaled, and more. '}
            {'Sprites are instantiated like so: '}
        </p>
        <br />
        <CodeHeader header={`new Sprite(props: Properties, channels: number = 1)`} />
        <p>
            <InlineCode>props</InlineCode>
            {' is an object that contains the properties of the sprite you are trying to create. '}
            {'Different sprites will have different '}
            <InlineCode>Properties</InlineCode> 
            {' types. You can read about the four different types of properties '}<Hyperlink to='sprites/properties'>here</Hyperlink>.{' '}
            {'The second parameter, '}
            <InlineCode>channels</InlineCode>
            {', is the number of '}
            <Hyperlink to='animation/channels'>animation channels</Hyperlink>
            {' that the sprite will have. It defaults to 1. '}
            <br />
            <br />
        </p>
        <CodeHeader header={`sprite.draw(ctx: CanvasRenderingContext2D, properties?: Properties, isRoot?: boolean)`} />
        <p>
            This function draws the sprite to the canvas. It is automatically called by the <InlineCode>Stage</InlineCode> class.{' '}
            <InlineCode>ctx</InlineCode> is the canvas context to draw the sprite to.{' '}
            <InlineCode>properties</InlineCode> is an object that contains the properties of the sprite you are trying to draw.{' '}
            (Each sprite is a subclass of the base <InlineCode>Sprite</InlineCode> class, so, for example, <InlineCode>Line</InlineCode> will set its <InlineCode>Properties</InlineCode> type to a special <InlineCode>LineProperties</InlineCode> type.){' '}
            <InlineCode>isRoot</InlineCode> is a boolean that defaults to <InlineCode>true</InlineCode>. It's used for determining priority in pointer events.{' '}
        </p>

        <br />
        <CodeHeader header={`sprite.animate() -> this`} />
        <p>
            Advances all of the sprite's <Hyperlink to="animation/channels">animation channels</Hyperlink> by one frame.
        </p>

        <br />
        <CodeHeader header={`sprite.get(property: KeysOf<Properties>|keyof HiddenProperties, raiseError = true) -> any`} />
        <p>
            See <Hyperlink to='sprites/usage/properties'>Sprites/Usage/Properties</Hyperlink>. (This function will be type-checked at runtime.)
        </p>
        <br />
        <CodeHeader header={`sprite.set(property: KeysOf<Properties>|keyof HiddenProperties, value: AcceptedTypesOf<Properties & HiddenProperties>, raiseError = true) -> boolean`} />
        <p>
            See <Hyperlink to='sprites/usage/properties'>Sprites/Properties</Hyperlink>. (This function will be type-checked at runtime, and <InlineCode>value</InlineCode> will be soft type-checked.)
        </p>

        <br />
        <CodeHeader header={`sprite.addChild(child: Sprite) -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.addChildren(children: Sprite[]) -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.removeChild(child: Sprite) -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.removeChildren(children: Sprite[]) -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.children -> Sprite[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_getChildren() -> Sprite[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.parent -> Sprite|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.root -> Sprite`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.logHierarchy() -> void`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.findChild(name: string) -> Sprite|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.findChildren(name: string) -> Sprite[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_findChild(name: string) -> Sprite|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_findChildren(name: string) -> Sprite[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onClick: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onDrag: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onRelease: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onHover: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.onHoverEnd: (sprite: Sprite, event: PointerEvent, position: PositionType) => void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnClick(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnDrag(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnRelease(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnHover(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.setOnHoverEnd(callback: (sprite: Sprite, event: PointerEvent, position: PositionType) => void) -> void`} />
        <p>See <Hyperlink to='sprites/handling-user-input'>Sprites/Handling User Input</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.getChannel(index: number) -> Channel`} />
        <p>See <Hyperlink to='animation/channels'>Animation/Channels</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.distribute(animations: AnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES>[][], params: AnimationParams = { loop: false, iterations: 1, delay: 0}) -> this`} />
        <p>See <Hyperlink to='animation/distribute'>Animation/Distribute</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.copy(): Sprite<Properties, HiddenProperties>`} />
        <p>Returns a deep copy of the sprite.</p>

        <br />
        <CodeHeader header={`sprite.createChannels(count: number) -> this`} />
        <p>Creates <InlineCode>count</InlineCode> new animation channels.</p>
    </>
}