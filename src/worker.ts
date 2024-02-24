import { Colors, Easing } from "./sharc/Utils";
import { WorkerStage } from "./sharc/async_stages/WorkerStage";
/// <reference path="./sharc/async_stages/WorkerStage.ts" />
import { Ellipse, Rect, Star, Polygon, Path, TextSprite, Line } from "./sharc/Sprites";
import { PositionType } from "./sharc/types/Common";

postMessage("Hello from worker!");

const stage: WorkerStage = new WorkerStage(postMessage.bind(null), "classic", Colors.White);

const test: string = "click";
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
    const rect = new Rect({
        bounds: Rect.Bounds(20, 20, 100, 100),
        color: Colors.Blue,
        rotation: 20
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
        stroke: { lineWidth: 5 }
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

    // const star = new Star({
    //     center: { x: 0, y: 0 },
    //     radius: 500,
    //     rotation: 180,
    //     color: Colors.Red,
    // }).on("click", function () {
    //     stage.postCustomMessage(`center: ${JSON.stringify(this.center)}`);
    //     stage.postCustomMessage(`bounds: ${JSON.stringify(this.bounds)}`);
    //     this.center = {x: 0, y: 0};
    //     stage.postCustomMessage(`center: ${JSON.stringify(this.center)}`);
    //     stage.postCustomMessage(`bounds: ${JSON.stringify(this.bounds)}`);
    //
    // });

    const cpy = circle.copy();
    cpy.centerX += 100;
    const cpy2 = rect.copy();
    cpy2.centerY += 200;
    stage.root.addChildren(circle, cpy, cpy2);

    stage.on("beforeDraw", function (frame) {
        if (frame > 60 * 10) this.stop();
    });
}

stage.on("beforeDraw", function () {
    this.currentFrame = this.currentFrame >= 60 * 10 ? 0 : this.currentFrame;
});

onmessage = stage.onmessage;
