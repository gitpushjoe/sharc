import { Stage } from "./sharc/Stage";
import { OffscreenStage } from "./sharc/async_stages/OffscreenStage";
import { Ellipse } from "./sharc/Sprites";
import { Colors, Easing } from "./sharc/Utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const reps = 20;
const updateDOM = false;
const doPerfTest = false;
const useOffscreen = true;

let framerate = 60;

let stage: Stage | OffscreenStage;
if (!useOffscreen) {
    stage = new Stage(canvas, "classic");
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
} else {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    const stg = new OffscreenStage<any, Record<string, number>>(canvas, worker, "centered");
    stg.on("message", function (msg: any) {
        if (msg.type == "custom") {
            console.log(msg.message, msg.type);
        }
    });
    stg.on("click", function () {
        console.log(`click on ${Date.now()}`);
    });
    stage = stg;
    framerate /= updateDOM ? 1 : 1.25;
}

let start = performance.now();
const delays: number[] = [];

!doPerfTest ||
    (stage as Stage).on("beforeDraw", function () {
        // console.log(this.lastRenderMs);
        if (this.currentFrame >= 60 * 10) {
            const delay = (performance.now() - start - 10000) / 600;
            console.log(
                `Iteration #${delays.length + 1}:\nActual: ` +
                    (performance.now() - start) / 1000 +
                    `\n average frame drop time (in ms): ${delay}`
            );
            delays.push(delay);
            stage.currentFrame = 0;
            start = performance.now();
            if (delays.length == reps) {
                console.log(delays.join("\n"));
                console.log(`average frame drop time (in ms): ${delays.reduce((a, b) => a + b, 0) / delays.length}`);
                stage.stop();
                clearInterval(interval);
            }
        }
    });

var interval =
    (updateDOM ? 0 : 1) ||
    setInterval(() => {
        // for (let i = 0; i < 500; i++) {
        // 	document.getElementsByClassName('title')[0].innerHTML = `${Math.floor(stage.currentFrame / (600) * 10000) / 100}% complete`;
        // }
        document!
            .getElementById("container")!
            .appendChild(document!.createTextNode(stage.currentFrame.toString() + " "));
        document!.getElementById("canvas")!.style.transform =
            `rotate(${-Math.floor((stage.currentFrame % 20) + 10)}deg)`;
        document!.getElementsByClassName("title")![0]!.innerHTML =
            `${Math.floor((stage.currentFrame / 600) * 10000) / 100}% complete`;
    }, 20);

stage.loop(framerate);
