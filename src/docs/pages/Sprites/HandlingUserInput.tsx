import { useEffect, useRef } from "react";
import { Line, Ellipse, TextSprite } from "sharc-js/Sprites.js";
import { Stage } from "sharc-js/Stage.js";
import { Colors, Easing } from "sharc-js/Utils.js";
import CodeBlurb from "../../components/Code/Blurb";
import CodeHeader from "../../components/Code/Header";
import InlineCode from "../../components/Code/Inline";
import CodeShowcase from "../../components/Code/Showcase";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";

export function HandlingUserInput() {

    useEffect(() => {window.scrollTo(0, 0)}, []);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        stage.root.addChildren(new Line({
            bounds: Line.Bounds(-300, 200 - (400/3), 300, 200 - (400/3)),
            color: Colors.White,
            lineWidth: 5,
        }), new Line({
            bounds: Line.Bounds(-300, 200 - (800 / 3), 300, 200 - (800/3)),
            color: Colors.White,
            lineWidth: 5,   
        }))

        stage.root.addChildren(new Ellipse({
            bounds: Ellipse.Bounds(-225, 200 - (400 / 6), 40),
            color: Colors.FloralWhite,
            stroke: {lineWidth: 8},
            name: 'click-test',
            details: [0] // used to store number of clicks
        }).addChild(new TextSprite({
            text: 'Click Me!',
            color: Colors.FloralWhite,
            position: {x: 70, y: -23},
            scale: {x: 1, y: -1},
            fontSize: 60,
            bold: true,
        })));

        stage.root.addChildren(new Ellipse({
            bounds: Ellipse.Bounds(-225, 200 - (1200 / 6), 40),
            color: Colors.Yellow,
            stroke: {lineWidth: 8},
            name: 'drag-test',
        }).addChild(new TextSprite({
            text: 'Drag Me!',
            color: Colors.Yellow,
            position: {x: 70, y: -23},
            scale: {x: 1, y: -1},
            fontSize: 60,
            bold: true,
        })));

        stage.root.addChildren(new Ellipse({
            bounds: Ellipse.Bounds(-225, 200 - (2000 / 6), 40),
            color: Colors.Aqua,
            stroke: {lineWidth: 8},
            name: 'hover-test',
        }).addChild(new TextSprite({
            text: 'Hover Me!',
            color: Colors.Aqua,
            position: {x: 70, y: -23},
            scale: {x: 1, y: -1},
            fontSize: 60,
            bold: true,
        })));

        const clickTest = stage.root.findChild('click-test')!;
        const dragTest = stage.root.findChild('drag-test')!;
        const hoverTest = stage.root.findChild('hover-test')!;

        clickTest.setOnClick((sprite, event, position) => {
            const clickCount = sprite.get('details') as number[];
            sprite.set('details', [clickCount[0] + 1]);
            sprite.children[0].set('text', `${clickCount[0] + 1} clicks`);
            sprite.getChannel(0).enqueue( // bounce animation
                {property: 'scaleX', from: null, to: 0.8, duration: 10, delay: 0, easing: Easing.Bounce(Easing.EASE_IN_OUT), name: stage.currentFrame.toString()},
            )
        });

        dragTest.setOnDrag((sprite, event, position) => {
            sprite.getChannel(0).clear(); // clear animations
            const topBoundary = stage.root.children[0].get('centerY') - 40;
            const bottomBoundary = stage.root.children[1].get('centerY') + 40;
            if (position.y < topBoundary && position.y > bottomBoundary) {
                sprite.set('center', position);
            }
        });

        dragTest.setOnRelease((sprite, event, position) => {
            sprite.getChannel(0).enqueue( // return to original position
                {property: 'center', from: null, to: {x: -225, y: 200 - (1200 / 6)}, duration: 20, delay: 0, easing: Easing.LINEAR}
            );
        });

        hoverTest.setOnHover((sprite, position) => {
            sprite.set('color', Colors.Orange);
            sprite.children[0].set('text', 'Unhover Me!');
            sprite.children[0].set('color', Colors.Orange);
        });

        hoverTest.setOnHoverEnd((sprite, position) => {
            sprite.set('color', Colors.Aqua);
            sprite.children[0].set('text', 'Hover Me!');
            sprite.children[0].set('color', Colors.Aqua);
        });

        stage.loop();

        return () => {
            stage.stop();
        }

    }, [canvasRef]);

    return <>
        <h1>Handling User Input</h1>
        <p>
            {'Handling user input for sprites works much the same way as it does for the '}
            <Hyperlink to='stage/handling-user-input'>Stage</Hyperlink>
            {' class. Each sprite has a public '}
            <InlineCode>pointerEvents</InlineCode>
            {' variable. (See '}
            <Hyperlink to='types/stage/PointerEventsCollection'>types/stage/PointerEventsCollection</Hyperlink>
            {'.) This is what the sprite references each time it is drawn to determine if it should call its pointer event handlers. '}
            <strong>{'If you are using the '}<InlineCode>Stage</InlineCode>{' class, this is automated for you. '}</strong>
            {'Otherwise, you will need to manually update the pointer events collection of each root sprite. (Collections are cascaded down during rendering.) '}
            <strong>Note that for most sprites, the sprite's <Hyperlink>bounds</Hyperlink> (rectangular) are not used to determine whether or not a pointer event occurred on the sprite,{' '}
            rather the sprite's actual <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath">path</a> is used.{' '}
            Also, clicks on the sprite's children will register for the sprite.</strong>
        </p>

        <br />
        <CodeHeader header="sprite.onClick: (sprite: Sprite, event: PointerEvent, position: PositionType) => void" />
        <p>
            {'Assuming that the sprite\'s '}
            <InlineCode>pointerEvents</InlineCode>
            {' collection is properly set up, this callback will be called when a pointerDown event occurs on the sprite. '}
            {'The sprite will pass itself as the first argument, the pointer event as the second argument, and the position of the pointer event on the canvas as the third argument. '}
            <strong>For all point events, <InlineCode>position</InlineCode> is relative to the current canvas context when the sprite is rendered. </strong>
            {'So even if several parent sprites are scaled, rotated, or translated, both '}
            <InlineCode>position</InlineCode>
            {' and the sprite will agree on the origin, scale, and rotation of the canvas context. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnClick((sprite, event, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <CodeHeader header="sprite.onDrag: (sprite: Sprite, event: PointerEvent, position: PositionType) => void" />
        <p>
            {'This callback is called for each pointerMove event that occurs on the sprite after it has been clicked, before the pointer has been released. '}
            {'Note that the pointer does not have to be on the sprite for this function to be called. '}
            {'The sprite will pass itself as the first argument, the pointer event as the second argument, and the position of the pointer event on the canvas as the third argument. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnDrag((sprite, event, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <CodeHeader header="sprite.onRelease: (sprite: Sprite, event: PointerEvent, position: PositionType) => void" />
        <p>
            {'This callback is called when the pointer is released after the sprite has been clicked. '}
            {'The sprite will pass itself as the first argument, the pointer event as the second argument, and the position of the pointer event on the canvas as the third argument. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnRelease((sprite, event, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <CodeHeader header="sprite.onHover: (sprite: Sprite, position: PositionType) => void" />
        <p>
            {'This callback is called every frame a pointerMove event occurs over the sprite. '}
            {'The sprite will pass itself as the first argument and the position of the pointer event on the canvas as the second argument. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnHover((sprite, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <CodeHeader header="sprite.onHoverEnd: (sprite: Sprite, position: PositionType) => void" />
        <p>
            {'This callback is called once when the sprite transitions from being hovered to not being hovered. '}
            {'The sprite will pass itself as the first argument and the position of the pointer event on the canvas as the second argument. '}
            <p>
                {'This property can also be set using '}
                <CodeBlurb blurb={[`sprite.setOnHoverEnd((sprite, position) => {...})`]} />
                {'.'}
            </p>
        </p>

        <br />
        <p>
            Here is a demo of all five callbacks:
        </p>
        <CodeShowcase canvasRef={canvasRef} code={
`import { Stage } from 'sharc-js/Stage';
import { Line, Ellipse, TextSprite } from 'sharc-js/Sprites';
import { Colors, Easing } from 'sharc-js/Utils';
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

stage.root.addChildren(new Line({
    \tbounds: Line.Bounds(-300, 200 - (400/3), 300, 200 - (400/3)),
    \tcolor: Colors.White,
    \tlineWidth: 5,
}), new Line({
    \tbounds: Line.Bounds(-300, 200 - (800 / 3), 300, 200 - (800/3)),
    \tcolor: Colors.White,
    \tlineWidth: 5,
}))

stage.root.addChildren(new Ellipse({
    \tbounds: Ellipse.Bounds(-225, 200 - (400 / 6), 40),
    \tcolor: Colors.FloralWhite,
    \tstroke: {lineWidth: 8},
    \tname: 'click-test',
    \tdetails: [0] // used to store number of clicks
}).addChild(new TextSprite({
    \ttext: 'Click Me!',
    \tcolor: Colors.FloralWhite,
    \tposition: {x: 70, y: -23},
    \tscale: {x: 1, y: -1},
    \tfontSize: 60,
    \tbold: true,
})));

stage.root.addChildren(new Ellipse({
    \tbounds: Ellipse.Bounds(-225, 200 - (1200 / 6), 40),
    \tcolor: Colors.Yellow,
    \tstroke: {lineWidth: 8},
    \tname: 'drag-test',
}).addChild(new TextSprite({
    \ttext: 'Drag Me!',
    \tcolor: Colors.Yellow,
    \tposition: {x: 70, y: -23},
    \tscale: {x: 1, y: -1},
    \tfontSize: 60,
    \tbold: true,
})));

stage.root.addChildren(new Ellipse({
    \tbounds: Ellipse.Bounds(-225, 200 - (2000 / 6), 40),
    \tcolor: Colors.Aqua,
    \tstroke: {lineWidth: 8},
    \tname: 'hover-test',
}).addChild(new TextSprite({
    \ttext: 'Hover Me!',
    \tcolor: Colors.Aqua,
    \tposition: {x: 70, y: -23},
    \tscale: {x: 1, y: -1},
    \tfontSize: 60,
    \tbold: true,
})));

const clickTest = stage.root.findChild('click-test')!;
const dragTest = stage.root.findChild('drag-test')!;
const hoverTest = stage.root.findChild('hover-test')!;

clickTest.setOnClick((sprite, event, position) => {
    \tconst clickCount = sprite.get('details') as number[];
    \tsprite.set('details', [clickCount[0] + 1]);
    \tsprite.children[0].set('text', \`\${clickCount[0] + 1} clicks\`);
    \tsprite.getChannel(0).enqueue( // bounce animation
    \t\t{property: 'scaleX', from: 1, to: 0.8, duration: 10, delay: 0, easing: Easing.Bounce(Easing.EASE_IN_OUT)},
        \t\t1
        \t)
});

dragTest.setOnDrag((sprite, event, position) => {
    \tconst topBoundary = stage.root.children[0].get('centerY') - 40;
    \tconst bottomBoundary = stage.root.children[1].get('centerY') + 40;
    \tif (position.y < topBoundary && position.y > bottomBoundary) {
        \t\tsprite.set('center', position);
        \t}
});

dragTest.setOnRelease((sprite, event, position) => {
    \tsprite.getChannel(0).enqueue( // return to original position
    \t\t{property: 'center', from: null, to: {x: -225, y: 200 - (1200 / 6)}, duration: 20, delay: 0, easing: Easing.LINEAR},
        \t\t1
        \t);
});

hoverTest.setOnHover((sprite, position) => {
    \tsprite.set('color', Colors.Orange);
    \tsprite.children[0].set('text', 'Unhover Me!');
    \tsprite.children[0].set('color', Colors.Orange);
});

hoverTest.setOnHoverEnd((sprite, position) => {
    \tsprite.set('color', Colors.Aqua);
    \tsprite.children[0].set('text', 'Hover Me!');
    \tsprite.children[0].set('color', Colors.Aqua);
});

stage.loop();`} />
    </>
}