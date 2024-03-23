import InlineCode from "./Code/Inline";
import { Hyperlink } from "./Sidebar/Hyperlink";

export default function Changelog() {

    const changelog: { version: string, changes: React.ReactNode[] }[] = [
        {
            version: "v2.0.1",
            changes: [
                <>Fix <InlineCode>package.json</InlineCode> to support type definitions in Javascript files.</>,
                <>Fix main thread <InlineCode>Stage</InlineCode> showing errors as being from <InlineCode>WorkerStage</InlineCode>.</>,
                <>Fix bug with <InlineCode>resetKeyTargetOnClick</InlineCode> and <InlineCode>resetScrollTargetOnClick</InlineCode> not working on main thread <InlineCode>Stage</InlineCode>.</>,
                <>Fix bug with <InlineCode>WorkerStage</InlineCode> double-calling <InlineCode>beforeDraw</InlineCode> event listeners.</>,
                <>Improve stage framerate consistency.</>,
            ],
        },
        {
            version: "v2.0.0",
            changes: [
                <>Async stages are no longer a beta feature.</>,
                <>Implement new parenting methods for sprites.</>,
                <>Implement scroll targets and keypress targets to <InlineCode>Stage</InlineCode>, so that sprites can receive and handle keypress and scroll events.</>,
                <>Event listeners that return <InlineCode>true</InlineCode> (or <InlineCode>1</InlineCode>), will automatically remove/detach themselves.</>,
                <>Move <InlineCode>"event"</InlineCode> to last argument position in <InlineCode>PointerEventCallback</InlineCode>.</>,
                <>Event listeners are all now typed as returning <InlineCode>boolean | 0 | 1 | undefined</InlineCode>.</>,
                <>Refactor all event listeners to make caller pass themselves as first argument instead of using <InlineCode>"this"</InlineCode>.</>,
                <>Implement helpful wrappers around creating beforeDraw event listeners: <InlineCode>schedule</InlineCode>, <InlineCode>selfSchedule</InlineCode>, <InlineCode>scheduleExactly</InlineCode>, <InlineCode>selfScheduleExactly</InlineCode>, <InlineCode>delay</InlineCode>, <InlineCode>selfDelay</InlineCode>, <InlineCode>when</InlineCode>, <InlineCode>whenStage</InlineCode>.</>,
                <>Implement <InlineCode>includeEventListener()</InlineCode> for stages and sprites to add an event listener if and only if the event listener is not already present.</>,
                <>Implement <InlineCode>hold</InlineCode> event listener for sprites.</>,
                <>Create Sprite public <InlineCode>currentFrame</InlineCode> member variable that counts up with each draw call.</>,
                <>Remove <InlineCode>"r_"</InlineCode> in recursive sprite parenting functions, choosing to replace <InlineCode>"child"</InlineCode> with <InlineCode>"descendant"</InlineCode> and <InlineCode>"children"</InlineCode> with <InlineCode>"descendants"</InlineCode>.</>,
                <>Create Sprite public <InlineCode>currentFrame</InlineCode> member variable that counts up with each draw call.</>,
                <>Replace <InlineCode>r_getChildren()</InlineCode> with <InlineCode>descendants()</InlineCode> getter.</>,
                <>Update <InlineCode>WorkerStage</InlineCode> to use new ordering in pointer event listeners.</>,
                <>Include stack trace in <InlineCode>WorkerStage</InlineCode> error messages sent to <InlineCode>OffscreenStage</InlineCode>.</>,
                <>Fix bug where parent-child sprite relationships would not be properly updated after using parenting methods.</>,
                <>Update stages' <InlineCode>removeEventListener</InlineCode> methods to remove all event listenrers when a callback is not provided (improve parity with Sprite).</>,
            ],
        },
        {
            version: "v1.4.1",
            changes: [
                <>Fix <InlineCode>package.json</InlineCode> to support type definitions in Javascript files.</>,
            ],
        },
        {
            version: "v1.4.0",
            changes: [
                <>Rework <InlineCode>Image</InlineCode>:
                    <ul>
                        <li><InlineCode>src</InlineCode> is now a Calculated Hidden Property, and <InlineCode>src</InlineCode> is now a Calculated Visible Property.</li>
                        <li>Image bitmaps are stored atomically instead of <InlineCode>HTMLImageElement.</InlineCode></li>
                        <li><InlineCode>Image</InlineCode> now works in worker thread.</li>
                        <li>Images now automatically resize srcBounds when their <InlineCode>src</InlineCode>/<InlineCode>image</InlineCode> is changed (can be overridden).</li>
                    </ul>
                </>,
            ],
        },
        {
            version: "v1.3.2",
            changes: [
                <>Fix bug with <InlineCode>Stage</InlineCode> pointer events using incorrect <InlineCode>translatedPoint</InlineCode>.</>,
                <>Fix bug with <InlineCode>WorkerStage</InlineCode> miscalculating <InlineCode>translatedPoint</InlineCode>.</>,
                <>Add scroll events to <InlineCode>drawEvents</InlineCode> for <InlineCode>Stage</InlineCode>.</>,
            ],
        },
        {
            version: "v1.3.1",
            changes: [
                <>Re-publish of v1.3.0.</>
            ],
        },
        {
            version: "v1.3.0 (unpublished)",
            changes: [
                <>Implement keyboard events for <InlineCode>Stage</InlineCode>.</>,
                <>Implement arrows for <InlineCode>Line</InlineCode> and <InlineCode>BezierCurve</InlineCode>.</>,
                <>Implement <InlineCode>StrokeableSprite.strokeRegion</InlineCode> to get rid of repeated code.</>
            ],
        },
        {
            version: "v1.2.0",
            changes: [
                <>Remove properties object from <InlineCode>Sprite</InlineCode>, transitioning normal properties from getters and setters to class member variables.</>,
                <>Remove <InlineCode>derived_properties</InlineCode> from Sprite subclass initialization.</>,
                <>Rework <InlineCode>Sprite.copy()</InlineCode>.</>,
            ],
        },
        {
            version: "v1.1.1",
            changes: [
                <>Rework <InlineCode>EventCollection</InlineCode> to only store one <InlineCode>PointerEvent</InlineCode> per <InlineCode>PointerEvent</InlineCode> type.</>,
                <>Improve Sprite hover event detection.</>,
                <>Add translated point parameter back to <InlineCode>hover</InlineCode> and <InlineCode>hoverEnd</InlineCode> callbacks.</>,
                <>Fix bug with <InlineCode>Star</InlineCode> not being centered correctly after initialization.</>
            ],
        },
        {
            version: "v1.1.0",
            changes: [
                <>Create <InlineCode>OffscreenStage</InlineCode> and <InlineCode>WorkerStage</InlineCode> for asynchronous rendering.</>,
                <>Modify all Sprites to now support rendering to <InlineCode>OffscreenCanvasRenderingContext2D</InlineCode>.</>,
                <>Modify <InlineCode>StageEventListeners</InlineCode> to now include a generic type, for usei n async stages.</>,
                <>Remove translated point parameter from <InlineCode>hoverEnd</InlineCode> callbacks in <InlineCode>SpriteEventListeners</InlineCode> type.</>,
                <>Remove <InlineCode>Stage</InlineCode> parameter from <InlineCode>StageEventCallback</InlineCode> type.</>,
                <>Add <InlineCode>StageEventCallback</InlineCode> type to <InlineCode>StageEventListeners</InlineCode> type.</>,
                <>Modify the way Sprites process pointer events.</>,
                <>Create <InlineCode>types/Stage.ts</InlineCode> file containg types necessary for async stages.</>
            ],
        },
        {
            version: "v1.0.0",
            changes: [
                <>Completely rework sprite property access to use getters and setters.</>,
                <>Split Sprite definitions into separate files.</>,
                <>Add support for sprite gradients.</>,
                <>Modify <InlineCode>EllipseProperties</InlineCode> to use <InlineCode>radius</InlineCode> and <InlineCode>center</InlineCode> instead of <InlineCode>bounds</InlineCode>.</>,
                <>Create <Hyperlink>AnimationUtils</Hyperlink> file.</>
            ],
        },
        {
            version: "beta v1.0.0",
            changes: [
                <>Initial release.</>
            ],
        }
    ];

    return <>
        <h1>Changelog</h1>
        <br />
        {changelog.map((release, i) => {
            return <div key={i}>
                <h4> release {release.version} </h4>
                <ul>
                    {release.changes.map((change, j) => {
                        return <li key={j}>{change}</li>;
                    })}
                </ul>
            </div>;
        })}
    </>;
}
