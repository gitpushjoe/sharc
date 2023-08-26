import { Sprite } from './sharc/BaseShapes';
import * as Sprites from './sharc/Sprites';
import { Stage } from './sharc/Stage';
import { Animate, CenterBounds, CircleBounds, Color, Colors, Position, AnimateTo, Easing } from './sharc/Utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new Stage(canvas, 'centered', Color(75, 75, 80));
const root = stage.root;

const tests = {
    '*stage_load': 'Stage Loads',
    '*framerate': 'Framerate',
    '*addFindChildren': 'add & findChildren',
    '*stage.width': 'stage.width',
    '*stage.height': 'stage.height',
    '*aggregate': 'Aggregate Properties',
    '*calculated': 'Calculated Properties',
    '*delay': 'Animation Delay',
    '*duration': 'Animation Duration',
    '*delay2': 'Animation Package Delay',
    '*loop': 'Animation Package Loop',
    '*iterations': 'Animation Package Iterations',
    'onClick': 'onClick',
    'onDrag': 'onDrag',
    'onRelease': 'onRelease',
    'onHover': 'onHover',
    'onHoverEnd': 'onHoverEnd',
    'transform': 'Transformation Matrix',
    'scroll': 'Scroll',
    '*animateNullToValue': 'Animate Null -> Value',
    '*animateValueToCallback': 'Animate with Callback',
    '*animateNullToCallback': 'Animate Null -> Callback',
    '*onAnimationFinish': 'onAnimationFinish',
    '*rightClick': 'onRightClick',
}

const testsLayer = new Sprites.NullSprite({name: 'testLayer'});
root.addChildren(testsLayer);
testsLayer.set('position', {x: -stage.width! / 2 + 30, y: stage.height! / 2 - 50});

Object.entries(tests).forEach(([id, test], idx: number) => {
    const sprite = new Sprites.TextSprite({
        name: id.replace('*', ''),
        text: test,
        position: Position(0, 0),
        color: Colors.White,
        fontSize: 30,
        positionIsCenter: false,
        scale: {x: 1, y: -1},
        font: 'sans-serif',
        bold: true,
    });
    const container = new Sprites.NullSprite({name: `${id.replace('*', '')} - container`, position: Position(50, -idx * 50)});
    container.addChildren(sprite);
    container.addChildren(new Sprites.Rect({
        name: 'checkbox',
        bounds: CenterBounds(-35, 9, 40),
        stroke: {lineWidth: 5, color: Colors.Black},
        color: Color(80, 80, 80),
    }))
    testsLayer.addChildren(container);
});

const testPassed = (sprite: Sprite) => {
    const checkbox = sprite.r_findChild('checkbox');
    if (checkbox) {
        checkbox.addChildren(new Sprites.Path({
            path: [
                {x: -20, y: 0},
                {x: -5, y: -15},
                {x: 30, y: 25}
            ],
            stroke: {lineWidth: 8, color: Colors.LightGreen},
            color: Colors.None,
            end: 0,
        }).distribute([
            [AnimateTo('end', 1, 60)]
        ]))
    }
}

const testFailed = (sprite: Sprite) => {
    const checkbox = sprite.r_findChild('checkbox');
    if (checkbox) {
        checkbox.addChildren(new Sprites.Path({
            path: [
                {x: -20, y: 20},
                {x: 20, y: -20},
            ],
            stroke: {lineWidth: 8, color: Colors.Red},
            color: Colors.None,
            end: 0,
        }).distribute([
            [AnimateTo('end', 1, 60)]
        ]))
        checkbox.addChildren(new Sprites.Path({
            path: [
                {x: 20, y: 20},
                {x: -20, y: -20},
            ],
            stroke: {lineWidth: 8, color: Colors.Red},
            color: Colors.None,
            end: 0,
        }).distribute([
            [AnimateTo('end', 1, 60)]
        ]))
    }
}

testPassed(root.r_findChild('stage_load - container')!);

const frameRate = Math.floor(Math.random() * 60) + 40;

stage.loop(frameRate);

const evaluateTest = (test: string, result: boolean) => {
    const container = root.r_findChild(`${test} - container`);
    if (container) {
        if (result) {
            testPassed(container);
        } else {
            testFailed(container);
        }
    }
}

root.addChildren(new Sprites.Ellipse({
    bounds: Sprites.Ellipse.Bounds(50, 300, 50),
    color: Colors.None,
    stroke: {lineWidth: 7.5, color: Colors.White},
}))

root.addChildren(new Sprites.Ellipse({
    bounds: Sprites.Ellipse.Bounds(400, 300, 50),
    color: Colors.None,
    stroke: {lineWidth: 7.5, color: Colors.LightGreen},
}))

root.addChildren(new Sprites.Line({
    bounds: Sprites.Line.Bounds(125, 300, 325, 300),
    lineWidth: 7.5,
    color: Colors.LightGreen,
    lineCap: 'round',
}).addChildren(new Sprites.Path({
    path: [
        {x: 80, y: 20},
        {x: 100, y: 0},
        {x: 80, y: -20},
    ],
    stroke: {lineWidth: 7.5, color: Colors.LightGreen, lineCap: 'round', lineJoin: 'round'},
    color: Colors.None,
})))

root.addChildren(new Sprites.Ellipse({
    bounds: Sprites.Ellipse.Bounds(50, 300, 30),
    color: Colors.Green,
    stroke: {lineWidth: 3, color: Colors.White},
    name: 'dragCircle',
    effects: ctx => {
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'white';
    }
}))

root.findChild('dragCircle')!.onClick = () => {
    evaluateTest('onClick', true);
}

root.findChild('dragCircle')!.onDrag = (sprite, _, position) => {
    evaluateTest('onDrag', true);
    sprite.set('center', position);
}

root.findChild('dragCircle')!.onRelease = (sprite, _, position) => {
    evaluateTest('onRelease', true);
    if (Math.abs(position.x - 400) < 20 && Math.abs(position.y - 300) < 20) {
        evaluateTest('transform', true);
        sprite.set('center', Position(400, 300));
    }
}

stage.onScroll = (stage, event) => {
    if (event.deltaY < 0) {
        testsLayer.set('y1', testsLayer.get('y1') - 30);
    }
    if (event.deltaY > 0) {
        testsLayer.set('y1', testsLayer.get('y1') + 30);
    }
    testsLayer.set('y1', Math.min(testsLayer.get('y1'), stage.height! / 2 - 50 + (Object.keys(tests).length - 14) * 80));
    testsLayer.set('y1', Math.max(testsLayer.get('y1'), stage.height! / 2 - 50));
    evaluateTest('scroll', true);
}

function addHandles(spriteName: string) {
    const point1 = new Sprites.Ellipse({
        bounds: Sprites.Ellipse.Bounds(-50, 50, 12),
        color: Colors.Red,
        stroke: {lineWidth: 3, color: Colors.White},
        name: `${spriteName} - point1`
    });
    point1.onDrag = (_sprite, _event, position) => {
        const parent = root.findChild(spriteName)!.children[0]!;
        parent.set('x1', position.x);
        parent.set('y1', position.y);
        point1.set('center', position);
    }
    const point2 = point1.copy();
    point2.set('color', Colors.Green);
    point2.set('name', `${spriteName} - point2`);
    point2.set('center', Position(50, -50));
    point2.onDrag = (_sprite, _event, position) => {
        const parent = root.findChild(spriteName)!.children[0]!;
        parent.set('x2', position.x);
        parent.set('y2', position.y);
        point2.set('center', position);
    }
    root.findChild(spriteName)!.addChildren(point1, point2);
}

root.addChildren(new Sprites.NullSprite({
    position: Position(0, 100),
    name: 'line demo'
}).addChildren(new Sprites.Line({
    bounds: Sprites.Line.Bounds(-50, 50, 50, -50),
    lineWidth: 8,
    color: Color(200, 200, 200),
    name: 'line demo - sprite'
})));

root.addChildren(new Sprites.NullSprite({
    position: Position(250, 100),
    name: 'rect demo'
}).addChildren(new Sprites.Rect({
    bounds: Sprites.Line.Bounds(-50, 50, 50, -50),
    stroke: {lineWidth: 8, color: Color(200, 200, 200)},
    color: Colors.None,
    name: 'rect demo - sprite'
})));

root.addChildren(new Sprites.NullSprite({
    position: Position(500, 100),
    name: 'ellipse demo'
}).addChildren(new Sprites.Ellipse({
    bounds: Sprites.Line.Bounds(-50, 50, 50, -50),
    stroke: {lineWidth: 8, color: Color(200, 200, 200)},
    color: Colors.None,
    name: 'ellipse demo - sprite'
})));

root.addChildren(new Sprites.NullSprite({
    position: Position(0, -100),
    name: 'bezier demo'
}).addChildren(new Sprites.BezierCurve({
    start: Position(-50, 50),
    points: [
        {control1: Position(-50, 0), control2: Position(50, 0), end: Position(50, -50)},
    ],
    stroke: {lineWidth: 8, color: Color(200, 200, 200)},
    color: Colors.None,
    name: 'bezier demo - sprite'
})));

root.addChildren(new Sprites.NullSprite({
    position: Position(250, -100),
    name: 'polygon demo'
}).addChildren(new Sprites.Polygon({
    sides: 5,
    radius: 60,
    center: Position(0, 0),
    stroke: {lineWidth: 8, color: Color(200, 200, 200)},
    color: Colors.None,
    name: 'polygon demo - sprite',
    rotation: 18
})));

root.addChildren(new Sprites.NullSprite({
    position: Position(500, -100),
    name: 'star demo'
}).addChildren(new Sprites.Star({
    radius: 75,
    center: Position(0, 0),
    stroke: {lineWidth: 8, color: Color(200, 200, 200), lineJoin: 'round'},
    color: Colors.None,
    name: 'star demo - sprite',
})));

const image = new Image();
image.src = 'https://img.freepik.com/free-vector/shark-sign_1284-3703.jpg';
root.addChildren(new Sprites.NullSprite({
    position: Position(375, -300),
    name: 'image demo'
}).addChildren(new Sprites.ImageSprite({
    image: image,
    bounds: Sprites.Line.Bounds(-50, 50, 50, -50),
    stroke: {lineWidth: 8, color: Color(200, 200, 200), lineJoin: 'round'},
    scale: Position(1, -1),
    color: Colors.None,
    name: 'image demo - sprite',
})));

root.addChildren(new Sprites.NullSprite({
    position: Position(125, -300),
    name: 'path demo'
}).addChildren(new Sprites.Path({
    path: [
        {x: -50, y: 50},
        {x: -25, y: -25},
        {x: 25, y: 25},
        {x: 50, y: -50},
    ],
    stroke: {lineWidth: 8, color: Color(200, 200, 200), lineJoin: 'round'},
    color: Colors.None,
    name: 'path demo - sprite',
})));


{
    const point1 = new Sprites.Ellipse({
        bounds: Sprites.Ellipse.Bounds(-50, 50, 12),
        color: Colors.Red,
        stroke: {lineWidth: 3, color: Colors.White},
        name: `bezier demo - point1`
    }).setOnDrag((sprite, _event, position) => {
        const mainSprite = sprite.parent!.children[0]!;
        mainSprite.set('start', position);
        point1.set('center', position);
    });
    const point2 = point1.copy();
    point2.set('color', Colors.Green);
    point2.set('name', 'bezier demo - point2');
    point2.set('center', Position(50, -50));
    point2.onDrag = (sprite, _event, position) => {
        sprite.parent!.children[0].set('end-0', position);
        point2.set('center', position);
    }
    const point3 = point1.copy();
    point3.set('color', Colors.Aqua);
    point3.set('name', 'bezier demo - point3');
    point3.set('center', Position(-50, 0));
    point3.onDrag = (sprite, _event, position) => {
        sprite.parent!.children[0].set('control1-0', position);
        point3.set('center', position);
    }
    const point4 = point1.copy();
    point4.set('color', Colors.Blue);
    point4.set('name', 'bezier demo - point3');
    point4.set('center', Position(50, 0));
    point4.onDrag = (sprite, _event, position) => {
        sprite.parent!.children[0].set('control2-0', position);
        sprite.set('center', position);
    }
    root.findChild('bezier demo')!.addChildren(point1, point2, point3, point4);
}

{
    const point1 = new Sprites.Ellipse({
        bounds: Sprites.Ellipse.Bounds(-5, 0, 12),
        color: Colors.Red,
        stroke: {lineWidth: 3, color: Colors.White},
        name: `polygon demo - point1`
    }).setOnDrag((sprite, _event, position) => {
        const mainSprite = root.findChild(`${sprite.name.replace(' - point1', '')}`)!.children[0]!;
        const x = position.x - 5;
        mainSprite.set('center', Position(x, position.y));
        sprite.set('center', Position(x, position.y));
        sprite.parent!.children[2].set('center', Position(x, position.y + mainSprite.get('radius')));
    });
    const point2 = point1.copy();
    point2.set('color', Colors.Green);
    point2.set('name', 'polygon demo - point2');
    point2.set('center', Position(-5, 55));
    point2.onDrag = (sprite, _event, position) => {
        const mainSprite = root.findChild(`${sprite.name.replace(' - point2', '')}`)!.children[0]!;
        if (mainSprite.get('centerY') - position.y > -15) {
            return;
        }
        mainSprite.set('radius', Math.abs(mainSprite.get('centerY') - position.y));
        sprite.set('center', Position(mainSprite.get('centerX') - 5, position.y));
    };
    root.findChild('polygon demo')!.addChildren(point1, point2);
    const starPoint = point1.copy()
    starPoint.set('name', 'star demo - point1');
    const starPoint2 = point2.copy()
    starPoint2.set('centerY', 65);
    starPoint2.set('name', 'star demo - point2');
    root.findChild('star demo')!.addChildren(starPoint, starPoint2);
}

{
    const handles = [[-50, 50], [-25, -25], [25, 25], [50, -50]].map((point, idx) => {
        return new Sprites.Ellipse({
            bounds: Sprites.Ellipse.Bounds(point[0], point[1], 12),
            color: [Colors.Red, Colors.Purple, Colors.HotPink, Colors.Green][idx],
            stroke: {lineWidth: 3, color: Colors.White},
            name: `path demo - point${idx + 1}`
        }).setOnDrag((sprite, _event, position) => {
            const mainSprite = sprite.parent!.children[0]!;
            mainSprite.set(`point-${idx}`, position);
            sprite.set('center', position);
        });
    });
    root.findChild('path demo')!.addChildren(...handles);
}

addHandles('line demo');
addHandles('rect demo');
addHandles('ellipse demo');
addHandles('image demo');


const testSprite = new Sprites.Ellipse({
    name: 'testSprite',
    bounds: CircleBounds(0, 0, 100),
    color: Colors.None,
}, 10)

testSprite.getChannel(0).push([
    Animate('red', 50, 255, 60, 5, Easing.LINEAR, 'animate-red'),
]);

testSprite.getChannel(1).push([
    Animate('green', 0, 20, 10),
]);

testSprite.getChannel(2).push([
    {property: 'blue', from: 50, to: 255, duration: 10, delay: 5, easing: Easing.LINEAR},
], {delay: 5, loop: true});

testSprite.getChannel(3).push([
    Animate('alpha', 0, 50, 15),
], {iterations: 2});

testSprite.getChannel(4).push([
    Animate('strokeOffset', 0, 50, 15),
], {iterations: 1});

testSprite.getChannel(5).push([
    Animate('radiusX', null, 200, 15),
]);

testSprite.getChannel(6).push([
    Animate('scale', Position(.2, -.2), Position(.6, -.6), 10),
    Animate('scale', null, Position(.2, -.2), 10),
]);

testSprite.onAnimationFinish = (_, animation) => {
    if (animation!.name === 'animate-red') {
        evaluateTest('onAnimationFinish', true);
    }
}

root.addChildren(testSprite);

const demos = root.r_getChildren().filter(sprite => sprite.name.slice(-9) === ' - sprite');

demos.forEach((sprite, _) => {
    sprite.setOnRelease((sprite) => {
        if (sprite.pointerButton === 2) {
            sprite.parent!.set('rotation', sprite.parent!.get('rotation') + 10)
            evaluateTest('rightClick', true);
        }
    }).setOnHover((sprite) => {
        evaluateTest('onHover', true);
        sprite.parent!.set('effects', (ctx: any) => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'white';
        })
    }).setOnHoverEnd((sprite) => {
        evaluateTest('onHoverEnd', true);
        sprite.parent!.set('effects', () => {});
    });
})

root.logHierarchy();

let firstFrameTime = performance.now();
stage.beforeDraw = () => {
    if (stage.currentFrame === 0) {
        console.log('frameRate', frameRate);
        firstFrameTime = performance.now();
        
        // add & findChildren
        const test1 = root.r_findChild('addFindChildren - container')! !== undefined;
        const test2 = root.r_findChild('addFindChildren - container')!.findChild('addFindChildren')! !== undefined;
        const test3 = root.findChild('addFindChildren') === undefined;
        const test4 = root.r_findChild('no sprite has this name') === undefined;
        const test5 = root.r_findChild('addFindChildren - container')!.children.length === 2;
        evaluateTest('addFindChildren', test1 && test2 && test3 && test4 && test5);

        // stage.width
        evaluateTest('stage.width', stage.width === canvas.width);

        // stage.height
        evaluateTest('stage.height', stage.height === canvas.height);

        //aggregate properties
        evaluateTest('aggregate', testsLayer.get('x1') === -stage.width! / 2 + 30 && testsLayer.get('y2') === stage.height! / 2 - 50);

        //calculated properties
        testSprite.set('center', Position(25, 50));
        evaluateTest('calculated', testSprite.get('x1') === -75 && testSprite.get('y1') === -50 && testSprite.get('x2') === 125 && testSprite.get('y2') === 150);
    }
    if (stage.currentFrame === frameRate * 5) {
        console.log(((performance.now() - firstFrameTime) / 5))
        evaluateTest('framerate', Math.abs(1000 - ((performance.now() - firstFrameTime) / 5)) < 400);
    }

    if (stage.currentFrame === 5) {
        //animation delay
        evaluateTest('delay', testSprite.get('red') === 50);

        //animation duration
        evaluateTest('duration', testSprite.get('green') === 10);

        //animation package delay
        evaluateTest('delay2', testSprite.get('blue') === 0);

        //animate value to callback
        evaluateTest('animateValueToCallback', testSprite.get('scaleX') === .4 && testSprite.get('scaleY') === -.4);
    }

    if (stage.currentFrame < 64) {
    console.log(
        stage.currentFrame,
        testSprite.get('blue')
    )
    }
    if (stage.currentFrame === 16) {
        //animation package iterations
        evaluateTest('iterations', testSprite.get('alpha') === 0 && testSprite.get('strokeOffset') === 50);

        //animate null to value
        evaluateTest('animateNullToValue', testSprite.get('radiusX') === 200);

        //animate null to callback
        evaluateTest('animateNullToCallback', testSprite.get('scaleX') === .4 && testSprite.get('scaleY') === -.4);
    }
}