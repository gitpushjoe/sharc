import { Colors, Easing } from "./sharc/Utils";
import { WorkerStage } from "./sharc/async_stages/WorkerStage";
/// <reference path="./sharc/async_stages/WorkerStage.ts" />
import { Ellipse, Rect, Line, LabelSprite, BezierCurve, ImageSprite } from "./sharc/Sprites";
import { PositionType } from "./sharc/types/Common";

postMessage("Hello from worker!");

const stage: WorkerStage = new WorkerStage(postMessage.bind(null), "classic", Colors.White);

const test: string = "image";
if (test === "perf") {
    for (let i = 0; i < 70 * 31; i++) {
        const ellipse = new Ellipse({ color: Colors.Blue, radius: 10 });
        ellipse.centerX = 20 + (i % 70) * 15;
        ellipse.centerY = 20 + Math.floor(i / 70) * 25;

        ellipse.channels[0].push(
            {
                property: "centerX",
                from: null,
                to: x => x + 130 + Math.random() * 10,
                duration: 20,
                easing: Easing.Bounce(Easing.EASE_IN_OUT)
            },
            { loop: true }
        );

        ellipse.createChannels(2);

        ellipse.channels[1].push(
            {
                property: "color",
                from: {
                    red: Math.random() * 180 + 55,
                    green: Math.random() * 180 + 55,
                    blue: Math.random() * 180 + 55,
                    alpha: 1
                },
                to: () => {
                    return {
                        red: Math.random() * 180 + 55,
                        green: Math.random() * 180 + 55,
                        blue: Math.random() * 180 + 55,
                        alpha: 1
                    };
                },
                duration: 20,
                easing: Easing.Bounce(Easing.EASE_IN_OUT)
            },
            { loop: true }
        );

        ellipse.channels[2].push(
            {
                property: "rotation",
                from: 0,
                to: 360,
                duration: 20,
                easing: Easing.EASE_IN_OUT
            },
            { loop: true }
        );

        stage.root.addChild(ellipse);
    }
} else if (test == "click") {
    (stage as Record<"rootStyle", string>).rootStyle = "centered";
    const text = new LabelSprite({
        text: "(0, 0)",
        fontSize: 50,
        color: Colors.Black,
        positionIsCenter: true,
        scale: { x: 1, y: -1 },
        position: { x: -200, y: 100 }
    });
    const rect = new Rect({
        bounds: Rect.Bounds(20, 20, 100, 100),
        color: Colors.Blue,
        stroke: { lineWidth: 10 },
        rotation: 20
    });
    stage.on("move", function (_, pos) {
        text.text = `(${pos.x}, ${pos.y})`;
    });
    stage.root.addChild(rect);
    rect.on("hover", function () {
        this.color = Colors.Red;
    });
    rect.on("hoverEnd", function () {
        this.color = Colors.Blue;
    });
    rect.on("click", function () {
        stage.postCustomMessage(`click on ${performance.now()}`);
        this.channels[0].push({
            property: "rotation",
            from: null,
            to: x => x + 360,
            duration: 10,
            easing: Easing.Bounce(Easing.EASE_IN_OUT)
        });
    });
    const circle = new Ellipse<{ center: PositionType; click: PositionType }>({
        center: { x: 200, y: 200 },
        radius: 50,
        color: Colors.Green,
        details: { center: { x: 200, y: 200 }, click: { x: 0, y: 0 } },
        stroke: { lineWidth: 10 }
    });
    circle.on("click", function (_, pos) {
        this.details!.click = pos;
        this.details!.center = this.center;
    });
    circle.on("drag", function (_, pos) {
        if (!this.details) return;
        this.center = {
            x: this.details!.center.x + (pos.x - this.details!.click.x),
            y: this.details!.center.y + (pos.y - this.details!.click.y)
        };
    });
    circle.on("hover", function () {
        this.color = Colors.Red;
    });
    circle.on("hoverEnd", function () {
        this.color = Colors.Green;
    });
    circle.on("release", function () {
        console.log("released");
    });
    stage.on("click", function () {
        stage.postCustomMessage(`stage click on ${Date.now()}`);
    });

    const cpy = circle.copy();
    cpy.centerX += 100;
    const cpy2 = rect.copy();
    cpy2.centerY += 200;
    stage.root.addChildren(text, circle, cpy, cpy2);

    stage.on("beforeDraw", function (frame) {
        if (frame > 60 * 10) this.stop();
    });
} else if (test === "key") {
    const label = new LabelSprite({
        text: "Click me",
        fontSize: 50,
        backgroundColor: Colors.LightBlue,
        backgroundRadius: [10, 10],
        stroke: { lineWidth: 5 },
        color: Colors.Black,
        positionIsCenter: true,
        position: { x: 600, y: 300 }
    });
    stage.on("keydown", function (e) {
        if (e.key === "Backspace") {
            label.text = label.text.slice(0, -1);
        } else if (e.key.length === 1) {
            label.text += e.key;
        }
    });
    stage.root.addChild(label);
} else if (test === "arrow") {
    const line = new Line({
        bounds: Line.Bounds(100, 100, 400, 500),
        color: Colors.Black,
        lineWidth: 10,
        arrow: {
            side: "both",
            length: 50,
            closed: true,
            color: Colors.Black,
            stroke: {
                lineCap: "round",
                color: Colors.Gray,
                lineWidth: 10,
                lineJoin: "round"
            }
        }
    });
    const beziercurve = new BezierCurve({
        start: { x: 300, y: 300 },
        points: [
            {
                control1: { x: 400, y: 100 },
                control2: { x: 500, y: 500 },
                end: { x: 500, y: 300 }
            },
            {
                control1: { x: 500, y: 100 },
                control2: { x: 700, y: 400 },
                end: { x: 500, y: 600 }
            }
        ],
        color: Colors.None,
        stroke: {
            lineCap: "round",
            lineWidth: 10,
            color: Colors.Black
        },
        arrow: line.arrow
    });
    stage.root.addChildren(line, beziercurve);
} else if (test === "image") {
    const image = new ImageSprite({
        bounds: Rect.Bounds(100, 100, 200, 200)
    });
    image.on("beforeDraw", function (frame) {
        if (frame === 0) {
            fetch(
                "https://images.squarespace-cdn.com/content/v1/5b80290bee1759a50e3a86b3/1535916876568-9PPRFSDF7X6X1U5LC9LX/leatherback+art.png"
            )
                .then(response => response.blob())
                .then(blob => createImageBitmap(blob))
                .then(image => (this.image = image))
                .then(() => {
                    console.group("Image loaded");
                    console.log(image.src);
                    console.groupEnd();
                });
        }
        if (frame === 60) {
            image.src = "noresize:https://assets.petco.com/petco/image/upload/f_auto,q_auto/rabbit-care-sheet";
        }
        if (frame === 120) {
            image.src =
                "noresize:https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Eopsaltria_australis_-_Mogo_Campground.jpg/640px-Eopsaltria_australis_-_Mogo_Campground.jpg";
        }
    });
    stage.root.addChild(image);
    stage.root.addChild(
        new Ellipse({ color: Colors.Blue, radius: 10 }).distribute([[{ property: "centerX", from: 0, to: 1000 }]], {
            loop: true
        })
    );
}

stage.on("beforeDraw", function () {
    this.currentFrame = this.currentFrame >= 60 * 10 ? 0 : this.currentFrame;
});

onmessage = stage.onmessage;
