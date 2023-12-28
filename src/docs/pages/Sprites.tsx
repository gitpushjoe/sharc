import { useEffect, useRef } from "react";
import CodeBlock from "../components/Code/Block";
import CodeBlurb from "../components/Code/Blurb";
import CodeHeader from "../components/Code/Header";
import InlineCode from "../components/Code/Inline";
import { Hyperlink } from "../components/Sidebar/Hyperlink";
import CodeShowcase from "../components/Code/Showcase";
import { Stage } from "sharc-js/Stage";
import { Animate, Colors, Easing } from "sharc-js/Utils";
import { BezierCurve, Ellipse, ImageSprite, Line, NullSprite, Path, Polygon, Rect, Star, TextSprite } from "sharc-js/Sprites";
import { useParams } from "react-router";

export { Usage } from "./Sprites/Usage"
export { Properties } from "./Sprites/Properties"
export { Parenting } from "./Sprites/Parenting"
export { HandlingUserInput } from "./Sprites/HandlingUserInput"
export { EventListeners } from "./Sprites/EventListeners"
export { Strokeable } from "./Sprites/Strokeable"
export { LinePage } from "./Sprites/Line"
export { RectPage } from "./Sprites/Rect"
export { EllipsePage } from "./Sprites/Ellipse"
export { BezierCurvePage } from "./Sprites/BezierCurve"
export { PathPage } from "./Sprites/Path"
export { PolygonPage } from "./Sprites/Polygon"
export { StarPage } from "./Sprites/Star"
export { TextPage } from "./Sprites/Text"
export { LabelPage } from "./Sprites/Label"
export { ImagePage } from "./Sprites/Image"
export { NullSpritePage } from "./Sprites/NullSprite"
export { Details } from "./Sprites/Details"
export { ShapePage as Shape } from "./Sprites/Shape"

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
            {'Sprites can be moved, rotated, scaled, animated, and more. '}
            {'For each Sprite subclass, there is a corresponding '} <Hyperlink to='sprites/properties'>Properties</Hyperlink> {' type. '}
            {'Each sprite supports these function:'}
        </p>

        <br />

        <CodeHeader header={`sprite.draw(ctx: CanvasRenderingContext2D, properties?: Properties, isRoot?: boolean)`} />
        <p>
            This function draws the sprite to the canvas. It is automatically called by the <InlineCode>Stage</InlineCode> class.{' '}
            <InlineCode>ctx</InlineCode> is the canvas context to draw the sprite to.{' '}
            <InlineCode>properties</InlineCode> is an object that contains the properties of the sprite you are trying to draw.{' '}
            Each subclass of <InlineCode>Sprite</InlineCode> has its own properties type, and will automatically fill this parameter with the sprite's properties.{' '}
            <InlineCode>isRoot</InlineCode> is a boolean that defaults to <InlineCode>true</InlineCode>. It's used for determining priority in pointer events.{' '}
        </p>

        <br />
        <CodeHeader header={`sprite.animate() -> this`} />
        <p>
            Advances all of the sprite's <Hyperlink to="animation/channels">animation channels</Hyperlink> by one frame.
        </p>

        <br />
        <CodeHeader header={`sprite.addChild(child: Shape) -> Shape`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.addChildren(children: Shape[]) -> Shape`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.removeChild(child: Shape) -> Shape`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.removeChildren(children: Shape[]) -> Shape`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.children -> Shape[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_getChildren() -> Shape[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.parent -> Shape|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.root -> Shape`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.logHierarchy() -> void`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.findChild(name: string) -> Shape|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.findChildren(name: string) -> Shape[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_findChild(name: string) -> Shape|undefined`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.r_findChildren(name: string) -> Shape[]`} />
        <p>See <Hyperlink to='sprites/parenting'>Sprites/Parenting</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.addEventListener(event: string, callback: Function) -> this`} />
        <p>See <Hyperlink to='sprites/event-listeners'>Sprites/Event Listeners</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.removeEventListener(event: string, callback?: Function) -> this`} />
        <p>See <Hyperlink to='sprites/event-listeners'>Sprites/Event Listeners</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.on(event: string, callback: Function) -> this`} />
        <p>See <Hyperlink to='sprites/event-listeners'>Sprites/Event Listeners</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.channels: Channel<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[]`} />
        <p>See <Hyperlink to='animation/channels'>Animation/Channels</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.distribute(animations: AnimationType<Properties & HiddenProperties & HIDDEN_SHAPE_PROPERTIES & DEFAULT_PROPERTIES>[][], params: AnimationParams = { loop: false, iterations: 1, delay: 0}) -> this`} />
        <p>See <Hyperlink to='animation/distribute'>Animation/Distribute</Hyperlink>.</p>

        <br />
        <CodeHeader header={`sprite.createChannels(count: number) -> this`} />
        <p>Creates <InlineCode>count</InlineCode> new animation channels.</p>

        <br />
        <CodeHeader header={`sprite.copy() -> this`} />
        <p>Returns a deep copy of the sprite.</p>
    </>
}