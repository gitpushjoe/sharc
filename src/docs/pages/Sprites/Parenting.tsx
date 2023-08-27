import { useEffect } from "react";
import CodeBlurb from "../../components/Code/Blurb";
import CodeHeader from "../../components/Code/Header";
import InlineCode from "../../components/Code/Inline";

export function Parenting() {

    useEffect(() => {window.scrollTo(0, 0)}, []);
    return <>
        <h1>Parenting</h1>
        <p>
            {'In sharc, you can make a sprite a child of another sprite. In order to understand what this means, '}
            {'it may be helpful to cover how sprites are actually drawn: '}
        </p>
        <CodeBlurb blurb={['function draw(...):']}></CodeBlurb>
        <ol>
            <li>The current state of the canvas is saved.</li>
            <li>The canvas context is translated so that the origin of the canvas is where the center of the sprite should be.</li>
            <li>The canvas is rotated according to the <InlineCode>rotation</InlineCode> property of the sprite.</li>
            <li>The canvas is scaled according to the <InlineCode>scale</InlineCode> property of the sprite.</li>
            <li>The sprite is drawn to the canvas.</li>
            <strong><li><CodeBlurb blurb={['draw()']} /> is called on all the child sprites.</li></strong>
            <li>The canvas context is restored to the state it was in at step 1.</li>
        </ol>
        <p>
            {'As you can see, the children of a sprite inherit the transformations of their parent. (0, 0) for a child sprite is the center of the parent sprite. '}
            {'Furthermore, if you rotate or scale a parent sprite, all of its children will rotate or scale with it. '}
        </p>
        <br />
        <h3>Parenting Functions</h3>
        <CodeHeader header={`sprite.addChild(child: Sprite) -> this`} />
        <p>
            Adds one child to <InlineCode>sprite</InlineCode>'s children.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.addChildren(children: Sprite[]) -> this`} />
        <p>
            Adds multiple children to <InlineCode>sprite</InlineCode>.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.removeChild(child: Sprite) -> this`} />
        <p>
            Tries to remove <InlineCode>child</InlineCode> from <InlineCode>sprite</InlineCode>'s children.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.removeChildren(children: Sprite[]) -> this`} />
        <p>
            Tries to remove all of <InlineCode>children</InlineCode> from <InlineCode>sprite</InlineCode>'s children.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.children -> Sprite[]`} />
        <p>
            Returns a copy of <InlineCode>sprite</InlineCode>'s children array.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.r_getChildren() -> Sprite[]`} />
        <p>
            Returns all of <InlineCode>sprite</InlineCode>'s descendants. (Recursive)
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.parent -> Sprite|undefined`} />
        <p>
            Returns <InlineCode>sprite</InlineCode>'s parent.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.root -> Sprite`} />
        <p>
            Returns the root of the tree that <InlineCode>sprite</InlineCode> is in. If <InlineCode>sprite</InlineCode> is the root, then it will return itself.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.logHierarchy() -> void`} />
        <p>
            Logs <InlineCode>sprite</InlineCode> and all of its descendants to the console, including their positions, using the sprites' <InlineCode>name</InlineCode> properties and their colors.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.findChild(name: string) -> Sprite|undefined`} />
        <p>
            Returns the first child of <InlineCode>sprite</InlineCode> with the name <InlineCode>name</InlineCode>. Non-recursive.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.findChildren(name: string) -> Sprite[]`} />
        <p>
            Returns all of the children of <InlineCode>sprite</InlineCode> with the name <InlineCode>name</InlineCode>. Non-recursive.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.r_findChild(name: string) -> Sprite|undefined`} />
        <p>
            Returns the first descendant of <InlineCode>sprite</InlineCode> with the name <InlineCode>name</InlineCode>. If no descendant has that name, it returns undefined. Recursive.
        </p>
        <div style={{'width': '1em', 'height': '.5em'}}></div>
        <CodeHeader header={`sprite.r_findChildren(name: string) -> Sprite[]`} />
        <p>
            Returns all of the descendants of <InlineCode>sprite</InlineCode> with the name <InlineCode>name</InlineCode>. If no descendant has that name, it returns an empty array. Recursive.
        </p>
    </>
}