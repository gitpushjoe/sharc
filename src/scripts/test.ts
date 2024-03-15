import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, Rect, TextSprite } from "sharc-js/Sprites";
import { Colors } from "sharc-js/Utils";

type CircleColors = "red" | "green" | "blue" | "yellow";

const stage = new WorkerStage<any, CircleColors>(postMessage.bind(null), "centered", Colors.Aqua);
onmessage = stage.onmessage;
