import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Line, Rect, Ellipse, Star, BezierCurve } from "sharc-js/Sprites";
import { Colors, Corners } from "sharc-js/Utils.js";

const stage = new WorkerStage(postMessage.bind(null), "classic", Colors.LightSlateGray);
onmessage = stage.onmessage;

const line = new Line({
    bounds: Line.Bounds(50, 50, 175, 150),
    color: Colors.Aqua,
    lineWidth: 5,
    lineCap: 'round',
});

const boundsStyle = {
    color: Colors.Transparent,
    stroke: {color: Colors.White, lineWidth: 5, lineDash: 5},
}

const lineBounds = new Rect({
    bounds: line.bounds,
    ...boundsStyle,
});

const rect = new Rect({
    bounds: Rect.Bounds(250, 50, 150, 100),
    color: Colors.Aqua,
});

const rectBounds = new Rect({
    bounds: rect.bounds,
    ...boundsStyle,
});

const ellipse = new Ellipse({
    center: {x: 525, y: 225},
    radius: 67.5,
    color: Colors.Aqua,
});

const ellipseBounds = new Rect({
    bounds: ellipse.bounds,
    ...boundsStyle,
});

const star = new Star({
    center: {x: 112.5, y: 275},
    radius: 67.5,
    color: Colors.Aqua,
});

const curve = new BezierCurve({
    start: {x: 250, y: 212.5},
    points: [
        {control1: {x: 300, y: 250}, control2: {x: 267.5, y: 325}, end: {x: 375, y: 380}},
        {control1: {x: 350, y: 280}, control2: {x: 225, y: 290}, end: {x: 400, y: 300}},
    ],
    color: Colors.Transparent,
    stroke: {color: Colors.Aqua, lineWidth: 5},
});

const curveBounds = new Rect({
    bounds: Corners(
        curve.x1,
        curve.y1,
        curve.x2,
        curve.y2,
    ),
    ...boundsStyle,
});

const starBounds = new Rect({
    bounds: star.bounds,
    ...boundsStyle,
});

stage.root.addChildren(line, lineBounds, rect, rectBounds, ellipse, ellipseBounds, star, starBounds, curve, curveBounds);
stage.draw();
