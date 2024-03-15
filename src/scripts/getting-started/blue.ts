import { WorkerStage } from "sharc-js/async_stages/WorkerStage";

const stage = new WorkerStage(postMessage.bind(null), "centered", {red: 0, green: 0, blue: 255, alpha: 1});
onmessage = stage.onmessage;

