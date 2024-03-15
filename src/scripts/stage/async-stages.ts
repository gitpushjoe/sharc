import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, TextSprite } from "sharc-js/Sprites";
import { Colors } from "sharc-js/Utils";

type CircleColors = "red" | "green" | "blue" | "yellow";

const stage = new WorkerStage<any, CircleColors>(postMessage.bind(null), "centered", Colors.DarkSlateGray);
onmessage = stage.onmessage;

const redCircle = new Ellipse<CircleColors>({
    color: Colors.Red,
    radius: 75,
    center: { x: -100, y: 100 },
    stroke: { lineWidth: 5 },
    details: "red"
});

const greenCircle = redCircle.copy();
greenCircle.color = Colors.Green;
greenCircle.center = { x: 100, y: 100 };
greenCircle.details = "green";

const yellowCircle = redCircle.copy();
yellowCircle.color = Colors.Yellow;
yellowCircle.center = { x: -100, y: -100 };
yellowCircle.details = "yellow";

const blueCircle = redCircle.copy();
blueCircle.color = Colors.Aqua;
blueCircle.center = { x: 100, y: -100 };
blueCircle.details = "blue";

const text =  new TextSprite({
    text: "Click a circle!",
    position: { x: 0, y: 0 },
    positionIsCenter: true,
    fontSize: 30,
    bold: true,
    color: Colors.White
});

[redCircle, greenCircle, yellowCircle, blueCircle].forEach(circle => {
    circle.on("click", function () {
        stage.postCustomMessage(this.details!);
        text.text = `You clicked the ${this.details} circle!`;
        text.color = this.color;
    });
    stage.root.addChild(circle);
});

stage.root.addChild(text);
