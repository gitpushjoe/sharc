import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { Ellipse, LabelSprite } from 'sharc-js/Sprites';
import { Colors, addPositions, multiplyPositions } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const label = new LabelSprite({
        text: 'Reset!',
        color: Colors.White,
        position: { x: 0, y: 100 },
        positionIsCenter: true,
        backgroundColor: Colors.Blue,
        padding: 10,
        fontSize: 50,
        stroke: { lineWidth: 5 },
})

stage.root.addChild(label);

const reset = () => {
        stage.root.removeChildren(...stage.root.children.slice(1));
        for (let i = 0; i < 7; i++) {
                const circle = new Ellipse({
                        center: { 
                                x: -200 + i * 70, 
                                y: 100 - i * 20
                        },
                        radius: 20 + Math.random() * 35,
                        color: {
                                red: Math.random() * 180 + 55,
                                green: Math.random() *  180 + 55,
                                blue: Math.random() *  180 + 55,
                                alpha: 1
                        },
                        stroke: {
                                lineWidth: 5,
                        },
                        details: {
                                velocity: { x: 0, y: 0 },
                                acceleration: { x: Math.random(), y: 0 },
                        }
                });
                circle.on('beforeDraw', simulatePhysics);
                stage.root.addChild(circle);
        }
}

const gravity = { x: 0, y: -.5 };

// Note: I am not a physicist
const simulatePhysics = function (this: Ellipse) {
        const acceleration = {
                x: this.details.acceleration.x + gravity.x,
                y: this.details.acceleration.y + gravity.y,
        };
        const friction = {
                x: .95,
                y: .95,
        }
        const width = 300 - this.radius[0];
        const height = 200 - this.radius[1];
        this.details.velocity = addPositions(this.details.velocity, acceleration);
        this.details.acceleration = multiplyPositions(this.details.acceleration, friction);
        this.center = addPositions(this.center, this.details.velocity);
        if (this.centerX > width || this.centerX < -width) {
                this.details.velocity.x *= -friction.x;
                this.details.acceleration.x *= -1;
                this.centerX = this.centerX > 0 ? width : -width;
        }
        if (this.centerY < -height) {
                this.centerY = -height;
                this.details.velocity.x *= friction.x;
                this.details.velocity.y *= -friction.y;
                this.details.acceleration.y *= -1;
        }
};

label.on('click', reset);
reset();
stage.loop();
