import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse } from 'sharc-js/Sprites'
import { Colors, Easing } from 'sharc-js/Utils'
import { PositionType } from 'sharc-js/types/Common'

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const circle = new Ellipse({
    radius: 25,
    color: Colors.Aqua,
    stroke: {lineWidth: 5},
}).on('click', function () {
    this.channels[0].enqueue([
        {
            property: 'center',
            from: null,
            to: (src: PositionType) => {
                const dest = {
                    x: Math.round((Math.random() - 0.5) * stage.width!),
                    y: Math.round((Math.random() - 0.5) * stage.height!),
                }
                stage.postCustomMessage({alert: `Moving from (${src.x}, ${src.y}) to (${dest.x}, ${dest.y})`});
                return dest;
            },
            duration: 15,
            easing: Easing.EASE_IN_OUT,
        }
    ], 1);
});

stage.root.addChild(circle);
stage.loop();
