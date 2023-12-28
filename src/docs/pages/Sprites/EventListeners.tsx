import { useActionData } from "react-router";
import CodeBlurb from "../../components/Code/Blurb";
import CodeHeader from "../../components/Code/Header";
import InlineCode from "../../components/Code/Inline";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";
import { useEffect } from "react";

export function EventListeners() {

    useEffect(() => {window.scrollTo(0, 0)}, []);
    return <>
        <h1>Event Listeners</h1>
        <br />
        <p>
            <Hyperlink to='stage/event-listeners'>Like Stages</Hyperlink>, sprites can also listen for events.{' '}
            You can attach a callback function to a sprite using <CodeBlurb blurb={['sprite.addEventListener(event, callback)']} /> (or{' '}
            the equivalent function, <CodeBlurb blurb={['sprite.on(event, callback)']} />).{' '}
            You can also remove a callback function using <CodeBlurb blurb={['sprite.removeEventListener(event, callback?)']} /> (if you don't pass a callback,{' '}
            all callbacks for that event will be removed). When the event is triggered, the callback function will be called with the sprite as the first argument,{' '}
            using the sprite itself as <InlineCode>this</InlineCode>. As a result, if you want to modify the sprite from within the callback,{' '}
            <strong>you must use named functions and not anonymous/arrow functions.</strong>{' '}
            Depending on which event was triggered, the callback will be passed different parameters.{' '}The following events are supported:
        </p>
        <br />
        <CodeHeader header={"sprite.on('click', function (this: Sprite, event: PointerEvent, position: Point) {...})"} />
        <p>
            {'This callback is called whenever the user presses down their mouse on the sprite. '}
            {'The Sprite will pass the PointerEvent object as'} <InlineCode>event</InlineCode>{' and the location of the click as '} <InlineCode>position</InlineCode>{', '}
            <strong>relative to the sprite.</strong>
        </p>
        <br />
        <CodeHeader header={"sprite.on('drag', function (this: Sprite, event: PointerEvent, position: Point) {...})"} />
        <p>
            {'This callback is called if the sprite has been clicked on, and the user moves their mouse. '}
            {'The event listener works the same way as the one above, except that it is triggered only when the user moves their mouse. '}
        </p>
        <br />
        <CodeHeader header={"sprite.on('release', function (this: Sprite, event: PointerEvent, position: Point) {...})"} />
        <p>
            {'This callback is called if the sprite has been clicked on, and the user releases their mouse. '}
        </p>
        <br />
        <CodeHeader header={"sprite.on('hover', function (this: Sprite, event: PointerEvent, position: Point) {...})"} />
        <p>
            {'This callback is called on the first frame that a pointer hovers over the sprite. '}
        </p>
        <br />
        <CodeHeader header={"sprite.on('hoverEnd', function (this: Sprite, event: PointerEvent, position: Point) {...})"} />
        <p>
            {'This callback is called when the pointer stops hovering over the sprite. '}
        </p>
        <br />
        <CodeHeader header={"sprite.on('scroll', function (this: Sprite, event: WheelEvent) {...})"} />
        <p>
            {'This callback is called when the user scrolls while the pointer is hovering over the sprite. '}
        </p>
        <br />
        <CodeHeader header={"sprite.on('beforeDraw', function (this: Sprite, stage: Stage, frame: number) {...})"} />
        <p>
            {'This callback is called before the sprite is drawn to the canvas. '}
            {'The Stage object is passed as'} <InlineCode>stage</InlineCode>{' and the current frame is passed as'} <InlineCode>frame</InlineCode>{'. '}
            {'This callback is useful for modifying the sprite\'s properties before it is drawn. '}
        </p>
        <br />
        <CodeHeader header={"sprite.on('animationFinish', function (this: Sprite, animation: PrivateAnimationType<Properties & DEFAULT_PROPERTIES & HIDDEN_SHAPE_PROPERTIES>) {...})"} />
        <p>
            {'This callback is called when an animation finishes. '}
            {'The animation object is passed as'} <InlineCode>animation</InlineCode>{'. '}
            {'It returns a '}<InlineCode>PrivateAnimationType</InlineCode>, which also contains the channel that the animation came from.
        </p>
    </>
}