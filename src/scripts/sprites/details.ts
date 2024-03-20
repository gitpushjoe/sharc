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
const simulatePhysics = (sprite: Ellipse) => {
    const acceleration = {
        x: sprite.details.acceleration.x + gravity.x,
        y: sprite.details.acceleration.y + gravity.y,
    };
    const friction = {
        x: .95,
        y: .95,
    }
    const width = 300 - sprite.radius[0];
    const height = 200 - sprite.radius[1];
    sprite.details.velocity = addPositions(sprite.details.velocity, acceleration);
    sprite.details.acceleration = multiplyPositions(sprite.details.acceleration, friction);
    sprite.center = addPositions(sprite.center, sprite.details.velocity);
    if (sprite.centerX > width || sprite.centerX < -width) {
        sprite.details.velocity.x *= -friction.x;
        sprite.details.acceleration.x *= -1;
        sprite.centerX = sprite.centerX > 0 ? width : -width;
    }
    if (sprite.centerY < -height) {
        sprite.centerY = -height;
        sprite.details.velocity.x *= friction.x;
        sprite.details.velocity.y *= -friction.y;
        sprite.details.acceleration.y *= -1;
    }
};

label.on('click', reset);
reset();
stage.loop();
