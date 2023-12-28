import { useParams } from "react-router";
import CodeBlock from "../components/Code/Block";
import InlineCode from "../components/Code/Inline";
import { Hyperlink } from "../components/Sidebar/Hyperlink";
import { useEffect } from "react";

export function Types() {
    return <>
        <h1>Types</h1>
        <p style={{lineHeight: '2em'}}>
            These pages contain type definitions for sharc.
            <ul>
                <li><Hyperlink to='types/common'>Common</Hyperlink></li>
                <li><Hyperlink to='types/animation'>Animation</Hyperlink></li>
                <li><Hyperlink to='types/events'>Events</Hyperlink></li>
                <li><Hyperlink to='types/sprites'>Sprites</Hyperlink></li>
            </ul>
        </p>
    </>
}

export function Common() {
    const params = useParams();

    useEffect(() => {
        const element = document.getElementById(params.section!);
        if (element) 
            element.scrollIntoView();
        else
            window.scrollTo(0, 0);
    }, [params]);
    
    return <> <h1>Common Types</h1>
    <p>
        Found in <InlineCode>sharc-js/types/common</InlineCode>.
    </p>

    <br />
    <h4 id="positiontype">PositionType</h4>
    <CodeBlock code={
        `export type PositionType = {
            \t x: number,
            \t y: number
        }` } />

    <br />
    <h4 id="colortype">ColorType</h4>
    <CodeBlock code={
        `export type ColorType = {
            \tred: number,
            \tgreen: number,
            \tblue: number,
            \talpha: number
        }` } />

    <br />
    <h4 id="boundstype">BoundsType</h4>
    <CodeBlock code={
        `export type BoundsType = {
            \tx1: number,
            \ty1: number,
            \tx2: number,
            \ty2: number
        }` } />
    </>
   
}

export function AnimationPage () {

    const params = useParams();

    useEffect(() => {
        const element = document.getElementById(params.section!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    return <>
        <h1>Animation</h1>
        <p>
            Found in <InlineCode>sharc-js/types/animation</InlineCode>.
        </p>

        <br />
        <h4>EasingType</h4>
        <CodeBlock code={
        `export type EasingType = (x: number) => number;`
        } />

        <br />
        <h4>AnimationCallback</h4>
        <CodeBlock code={
            `export type AnimationCallback<PropertyType> = (property: PropertyType) => PropertyType`
        } />

        <br />
        <h4 id="animationtype">AnimationType</h4>
        <CodeBlock code={
            `export type AnimationType<Properties> = NonNullable<{
                \t[K in keyof Properties]: {
                    \t\tproperty: K, 
                    \t\tfrom: (Properties[K] & (number|Record<string, number>))|null,
                    \t\tto: (Properties[K] & (number|Record<string, number>))|AnimationCallback<Properties[K] & (number|Record<string, number>)>,
                    \t\tduration: number,
                    \t\tdelay: number,
                    \t\teasing: EasingType,
                    \t\tname?: string
                \t}
            }[keyof Properties]>` } />

        <br />
        <h4>PrivateAnimationType</h4>
        <p>
            Animations are converted to <InlineCode>PrivateAnimationType</InlineCode> by sprites in order to track their progress.
        </p>
        <CodeBlock code={
            `export type PrivateAnimationType<Properties> = {
                \t[K in keyof Properties]: {
                    \t\tproperty: K, 
                    \t\tfrom: (Properties[K] & (number|Record<string, number>))|null, 
                    \t\tto: (Properties[K] & (number|Record<string, number>))|AnimationCallback<Properties[K] & (number|Record<string, number>)>,
                    \t\tduration?: number,
                    \t\tdelay?: number,
                    \t\teasing?: EasingType,
                    \t\tframe?: number,
                    \t\tchannel?: number,
                    \t\tname?: string,
                    \t\t_from?: Properties[K] & (number|Record<string, number>), // used by sprites to store the original value
                    \t\t_to?: Properties[K] & (number|Record<string, number>),
                \t}
            }[keyof Properties] ` } />

        <br />
        <h4 id="animationparams">AnimationParams</h4>
        <CodeBlock code={
            `export type AnimationParams = {
                \tloop?: boolean,
                \titerations?: number,
                \tdelay?: string,
            }` } />

        <br />
        <h4 id="animationpackage">AnimationPackage</h4>
        <CodeBlock code={
        `export type AnimationPackage<Properties> = {
            \tanimations: PrivateAnimationType<Properties>[],
            \tparams: AnimationParams
        }` } />
    </>
}

export function EventsPage() {
    return <>
        <h1>Events</h1>
        <p>
            Found in <InlineCode>sharc-js/types/events</InlineCode>.
        </p>

        <br />
        <h4>PointerEventCallback</h4>
        <CodeBlock code={
`export type PointerEventCallback<thisType> = (this: thisType, event: PointerEvent, translatedPoint: PositionType) => void;` } />
    
        <br />
        <h4>ScrollEventCallback</h4>
        <CodeBlock code={`export type ScrollEventCallback<thisType> = (this: thisType, event: WheelEvent) => void;` } />

        <br />
        <h4>StageEventCallback</h4>
        <CodeBlock code={`export type StageEventCallback<thisType> = (this: thisType, stage: Stage, frame: number) => void;` } />

        <br />
        <h4>AnimationFinishCallback</h4>
        <CodeBlock code={`export type AnimationFinishCallback<thisType, PrivateAnimationType> = (this: thisType, animation: PrivateAnimationType) => void;` } />

        <br />
        <h4>SpriteEventListeners</h4>
        <CodeBlock code={`export type SpriteEventListeners<thisType=undefined, Properties=any> = {
            \tclick: PointerEventCallback<thisType>[],
            \tdrag: PointerEventCallback<thisType>[],
            \trelease: PointerEventCallback<thisType>[],
            \thover: PointerEventCallback<thisType>[],
            \thoverEnd: PointerEventCallback<thisType>[],
            \tscroll: ScrollEventCallback<thisType>[],
            \tbeforeDraw: StageEventCallback<thisType>[],
            \tanimationFinish: AnimationFinishCallback<thisType, PrivateAnimationType<Properties & DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>>[],
        };` } />

        <br />
        <h4>StageEventListeners</h4>
        <CodeBlock code={`export type StageEventListeners<thisType=Stage> = {
            \tclick: PointerEventCallback<thisType>[],
            \trelease: PointerEventCallback<thisType>[],
            \tmove: PointerEventCallback<thisType>[],
            \tscroll: ScrollEventCallback<thisType>[],
            \tbeforeDraw: StageEventCallback<thisType>[],
        }; ` } />

    </>
}

export function SpritesPage() {

    const params = useParams();

    useEffect(() => {
        const element = document.getElementById(params.section!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    return <>
        <h1>Sprites</h1>
        <p>
            Found in <InlineCode>sharc-js/types/sprites</InlineCode>.{' '}
            This is a subset of all sprite type definitions; the others can either be found in the Sprites section of the documentation or in the source code.
        </p>

        <br />
        <h4>EffectsType</h4>
        <CodeBlock code={
            `export type EffectsType = (ctx: CanvasRenderingContext2D) => void`
        } />

        <br />
        <h4 id="radiustype">RadiusType</h4>
        <CodeBlock code={
            `export type RadiusType = [number] | [number, number] | [number, number, number] | [number, number, number, number]`
        } />

        <br />
        <h4>BezierPoint</h4>
        <p>
            Represents a point along a bezier curve sprite.
        </p>
        <CodeBlock code={
            `export type BezierPoint = {
                \tcontrol1: PositionType,
                \tcontrol2: PositionType,
                \tend: PositionType,
            }` } />   
    </>
}