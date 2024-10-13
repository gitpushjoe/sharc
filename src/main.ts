import { Stage } from "./sharc/Stage";
import { OffscreenStage } from "./sharc/async_stages/OffscreenStage";
import { tests } from "./tests";

const useOffscreen = false;

let framerate = 60;

let stage: Stage | OffscreenStage<any, string> | undefined = undefined;

tests.forEach(test => {
    const canvasEl = document.createElement("canvas");
    canvasEl.width = 1200;
    canvasEl.height = 800;
    canvasEl.id = test.name;
    const detailsElement = document.createElement("details");
    const summaryElement = document.createElement("summary");
    summaryElement.appendChild(document.createTextNode(test.name));
    detailsElement.appendChild(summaryElement);
    document.getElementById("container")?.appendChild(detailsElement);
    detailsElement.appendChild(canvasEl);
    canvasEl.tabIndex = 1;
    detailsElement.addEventListener("toggle", () => {
        stage?.stop();
        if (detailsElement.open) {
            localStorage.setItem("lastTest", test.name);
            document.querySelectorAll("details").forEach(details => {
                if (details !== detailsElement) {
                    details.removeAttribute("open");
                }
            });
            if (useOffscreen) {
                const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
                stage = new OffscreenStage<any, string>(canvasEl, worker, "centered");
                stage.on("message", (stage: OffscreenStage<any, string>, msg) => {
                    if (msg.type == "ready") {
                        (stage as OffscreenStage).postCustomMessage(test.name);
                        stage.loop(framerate);
                    }
                });
            } else {
                stage = new Stage(canvasEl, "classic");
                test.apply(stage, useOffscreen);
                stage.loop(framerate);
            }
        }
    });
});

localStorage.getItem("lastTest") &&
    document.getElementById(localStorage.getItem("lastTest")!)?.parentElement?.setAttribute("open", "");
