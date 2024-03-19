import { Stage } from "./sharc/Stage";
import { OffscreenStage } from "./sharc/async_stages/OffscreenStage";
import { Ellipse, ImageSprite, Rect } from "./sharc/Sprites";
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
    const test: string = "click";

    switch (test) {
        case "perf": {
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
            break;
        }
        case "image":
            const image = new ImageSprite({
                src: "https://i.imgur.com/mXuQAt2.png",
                bounds: Rect.Bounds(100, 100, 200, 200)
            });
            image.on("beforeDraw", (_, frame) => {
                if (frame === 60) {
                    image.src =
                        "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg";
                }
                if (frame === 120) {
                    image.src = "https://www.w3schools.com/w3images/fjords.jpg";
                }
                if (frame === 240) {
                    const img = new Image();
                    img.src =
                        "https://www.nylabone.com/-/media/project/oneweb/nylabone/images/dog101/activities-fun/10-great-small-dog-breeds/maltese-portrait.jpg";
                    img.onload = function () {
                        image.image = img;
                    };
                }
            });
            stage.root.addChild(image);
            stage.root.addChild(
                new Ellipse({ color: Colors.Blue, radius: 10 }).distribute([
                    [{ property: "centerX", from: 0, to: 1000 }]
                ])
            );
            break;
        case "click":
            for (let i = 0; i < 20; ++i) {
                const ellipse = new Ellipse({
                    color: (i % 2 && Colors.Red) || Colors.Blue,
                    radius: 50,
                    stroke: { lineWidth: 5 },
                    center: { x: 50 + (i + 2) * 40, y: 50 + (i % 2) * 40 },
                    name: `ellipse${i}`
                })
                .on("drag", (sprite, pos, _) => {
                    console.log(pos);
                    sprite.center = pos;
                    sprite.bringToFront();
                })
                .on("release", (sprite, _, e) => {
                    sprite.root.logHierarchy();
                    if (e.button === 0) {
                        sprite.sendToBack();
                    } else {
                        sprite.sendBackward();
                    }
                });
                stage.root.addChild(ellipse);
            }
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
    (stage as Stage).on("beforeDraw", sprite => {
        // console.log(sprite.lastRenderMs);
        if (sprite.currentFrame >= 60 * 10) {
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

const cnv = document.getElementById("canvas") as HTMLCanvasElement;
cnv.tabIndex = 1;
cnv.addEventListener("keydown", function (e) {
    console.log(`${e.key} pressed`);
});
cnv.style.cursor = "default";

var interval =
    (updateDOM ? 0 : 1) ||
        setInterval(() => {
            document!
                .getElementById("container")!
                .appendChild(document!.createTextNode(stage.currentFrame.toString() + " "));
            document!.getElementById("canvas")!.style.transform =
                `rotate(${-Math.floor((stage.currentFrame % 20) + 10)}deg)`;
            document!.getElementsByClassName("title")![0]!.innerHTML =
                `${Math.floor((stage.currentFrame / 600) * 10000) / 100}% complete`;
        }, 20);

stage.loop(framerate);
