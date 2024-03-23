import { Colors } from "./sharc/Utils";
import { WorkerStage } from "./sharc/async_stages/WorkerStage";
import { tests } from "./tests";

postMessage("Hello from worker!");

const stage: WorkerStage = new WorkerStage(postMessage.bind(null), "classic", Colors.White);
onmessage = stage.onmessage;

stage.on("message", (stage, message) => {
    if (message.type === "custom") {
        const test = tests.find(test => test.name === message.message);
        if (!test) {
            stage.postCustomMessage(`Test ${test!.name} not found`);
            return;
        }
        test.apply(stage, false);
    }
});
