import { BezierCurve, Ellipse, ImageSprite, LabelSprite, Line, Rect, TextSprite } from "./sharc/Sprites";
import { Stage } from "./sharc/Stage";
import { WorkerStage } from "./sharc/async_stages/WorkerStage";
import { Colors, Easing } from "./sharc/Utils";

export interface Test {
    name: string;
    apply: (stage: Stage | WorkerStage<any, string>, isOffscreen: boolean) => void;
}

export const tests : Test[] = [{
    name: "basic",
    apply: (stage: Stage | WorkerStage<any, string>) => {
        stage.bgColor = Colors.LightSlateGray;
    }
}, {
        name: "perf",
        apply: (stage: Stage | WorkerStage<any, string>) => {
            for (let i = 0; i < 70 * 30; i++) {
                const ellipse = new Ellipse({ color: Colors.Blue, radius: 10 });
                ellipse.centerX = 20 + (i % 70) * 15;
                ellipse.centerY = 65 + Math.floor(i / 70) * 25;

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
            const fps = new TextSprite<[number, number, number[]]>({
                text: "FPS: 0   Skipped: 0",
                color: Colors.Black,
                fontSize: 40,
                position: { x: 10, y: 10 },
                positionIsCenter: false,
                details: [performance.now(), 0, []],
                bold: true
            });
            stage.root.addChild(fps);

            (stage as Stage).on('beforeDraw', (_, frame) => {
                if ((frame % 5 !== 4)) {
                    return;
                }
                const now = performance.now();
                const fpsValue = 5000 / (now - fps.details![0]);
                if (fps.details![2].length > 99) {
                    fps.details![2].shift();
                }
                fps.details![2].push(fpsValue);
                const skipped = fps.details![1] + +(fpsValue < 40);
                const skippedPerc = (100 * skipped / frame).toFixed(2);
                const avg = fps.details![2].reduce((a, b) => a + b, 0) / fps.details![2].length;
                const stdev = Math.sqrt(fps.details![2].reduce((a, b) => a + (b - avg) ** 2, 0) / fps.details![2].length);
                fps.text = `FPS: ${fpsValue.toFixed(2)}  Skipped: ${skippedPerc}% (${skipped})   Avg: ${avg.toFixed(2)}  Stdev: ${stdev.toFixed(2)}`;
                // fps.text = `FPS: ${fpsValue.toFixed(2)}  Skipped: ${(100 * skipped / stage.currentFrame).toFixed(2)}% (${skipped})   Avg: ${(fps.details![2].reduce((a, b) => a + b, 0) / fps.details![2].length).toFixed(2)}`;
                // console.log(fps.details![2]);
                // console.log(now - fps.details![0], fpsValue, frame);
                fps.details = [now, skipped, fps.details![2]];
            });
        }
    }, {
        name: "click",
        apply: (stage: Stage | WorkerStage<any, string>) => {
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
    }, {
        name: "arrow",
        apply: (stage: Stage | WorkerStage<any, string>) => {
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
        } 
    }, {
        name: "image",
        apply: (stage: Stage | WorkerStage<any, string>) => {
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
                    image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/SIPI_Jelly_Beans_4.1.07.tiff/lossy-page1-800px-SIPI_Jelly_Beans_4.1.07.tiff.jpg";
                }
                if (frame === 180) {
                    image.src = "https://i.imgur.com/mXuQAt2.png";
                }
            });
            stage.root.addChild(image);
            stage.root.addChild(
                new Ellipse({ color: Colors.Blue, radius: 10 }).distribute([
                    [{ property: "centerX", from: 0, to: 1000, easing: Easing.Bounce(Easing.EASE_IN_OUT) }]
                ], { loop: true })
            );
            (stage as Stage).on('beforeDraw', (stage, frame) => {
                if (frame >= 240) {
                    stage.currentFrame = 0;
                }
            });

        }
    }, {
        name: "2.0-features",
        apply: (stage: Stage | WorkerStage<any, string>, isOffscreen: boolean) => {
            const ellipseCount = 20;
            const log = isOffscreen ? (stage as WorkerStage).postCustomMessage : console.log;
            for (let i = 0; i < ellipseCount; ++i) {
                const ellipse = new Ellipse({
                    color: (i % 2 && Colors.Red) || Colors.Blue,
                    radius: 50,
                    stroke: { lineWidth: 5 },
                    center: { x: 50 + (i + 2) * 40, y: 50 + (i % 2) * 40 },
                    name: `ellipse${i}`
                })
                .on("drag", (sprite, pos) => {
                    log(`${sprite.name}`);
                    sprite.center = pos;
                    sprite.radius = 20;
                    sprite.bringToFront();
                })
                .on("hold", sprite => {
                    sprite.strokeDash = 10;
                    sprite.strokeDashGap = 5;
                    if (!(stage.currentFrame % 30)) {
                        console.log("held!");
                    }
                })
                .on("release", (sprite, _, e) => {
                    sprite.radius = 50;
                    sprite.strokeDash = 0;
                    sprite.strokeDashGap = 0;
                    if (e.button === 0) {
                        sprite.sendToBack();
                    } else {
                        sprite.sendBackward();
                        return 1;
                    }
                    stage.root.logHierarchy();
                });
                stage.root.addChild(ellipse);

                const bounce = ellipse.whenStage(
                    stage => stage.currentFrame % 60 === 0,
                    (sprite, _, stage) => {
                        if (stage.currentFrame >= 240) {
                            return 1;
                        }
                        sprite.channels[0].push({
                            property: "scale",
                            from: { x: 1, y: 1 },
                            to: { x: 1.5, y: 1.5 },
                            duration: 30,
                            easing: Easing.Bounce(Easing.EASE_IN_OUT)
                        });
                    });

                ellipse.when(
                    sprite => sprite.currentFrame < 50,
                    (sprite, _, stage) => {
                        sprite.centerX += 2;
                        if (stage.currentFrame > 130) {
                            return 1;
                        }
                    }
                );

                ellipse.schedule(119, sprite => { 
                    sprite.currentFrame = 0;
                });

                ellipse.selfSchedule(120, sprite => {
                    sprite.removeEventListener("beforeDraw", bounce);
                });


            }
            const max = 100;
            const countup = function (sprite: TextSprite<number>, frame: number) {
                sprite.details! +=+ (frame % 4 == 3);
                sprite.text = `Counting up to ${max}: ${sprite.details}`;
                if (sprite.details! == max / 2) {
                    return "[intentionally invalid value]" as unknown as 1;
                }
                if (sprite.details! >= max) {
                    return 1;
                }
            };
            stage.root.addChild(new TextSprite<number>({
                text: `Counting up to ${max}: 0`,
                fontSize: 50,
                position: { x: 1175, y: 725 },
                textAlign: 'right',
                details: 0
            }).includeEventListener("beforeDraw", countup).includeEventListener("beforeDraw", countup).includeEventListener("beforeDraw", countup));

            [...Array(8).keys()].forEach(i => {
                stage.root.addChild(new LabelSprite({
                    text: "Click me and type!",
                    position: {x: 50, y: 200 + 72 * i},
                    fontSize: 50,
                    backgroundColor: Colors.LightBlue,
                    backgroundRadius: [10, 10],
                    stroke: {lineWidth: 5},
                    color: Colors.Black,
                    name: `label ${i % 49}`
                }).on("release", sprite => {
                        stage.keyTarget = sprite.name;
                        sprite.text = "";
                    }).on("keydown", (sprite, e) => {
                        if (e.key === "Backspace") {
                            sprite.text = sprite.text.slice(0, -1);
                        } else if (e.key.length === 1) {
                            sprite.text += e.key;
                        }
                    }));
            });
        }
    }, {
        name: "readme",
        apply: (stage: Stage | WorkerStage<any, string>) => {
            stage.root.center = { x: 600, y: 400 };
            stage.root.scaleY = -1;
            const circle = new Ellipse({
                color: Colors.Red,
                radius: 100,
                center: { x: 50, y: -50 },
                stroke: {
                    color: Colors.Pink,
                    lineWidth: 10,
                    lineDash: 30,
                    lineDashGap: 20
                },
            });
            stage.root.addChild(circle);
            circle.createChannels(1); // every sprite is created with 1 channel by default
            circle.channels[0].push(
                [
                    {
                        property: 'centerX',
                        from: -stage.width! / 2 + circle.radiusX / 2,
                        to: stage.width! / 2 - circle.radiusX / 2,
                        duration: 100,
                        delay: 0,
                        easing: Easing.Bounce(Easing.LINEAR),
                    }
                ],
                {loop: true});
            circle.channels[1].push(
                [ 
                    {
                        property: 'centerY',
                        from: 20,
                        to: -stage.height! / 2 + circle.radiusY / 2,
                        duration: 40,
                        delay: 0,
                        easing: Easing.Bounce(Easing.EASE_OUT),
                    }
                ],
                {loop: true});
        }
    }];

