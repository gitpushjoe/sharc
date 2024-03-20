import { WorkerStage } from "sharc-js/async_stages/WorkerStage";
import { ImageSprite, Ellipse } from 'sharc-js/Sprites';
import { Colors } from 'sharc-js/Utils';

const stage = new WorkerStage(postMessage.bind(null), "centered", Colors.LightSlateGray);
onmessage = stage.onmessage;

const dims = { width: 954, height: 338 };

const image = new ImageSprite({
    src: 'noresize:https://i.imgur.com/mXuQAt2.png',
    bounds: ImageSprite.Bounds(-dims.width / 8, -dims.height / 8, dims.width / 4, dims.height / 4),
    srcBounds: ImageSprite.Bounds(0, dims.height, dims.width, -dims.height),
    scale: {x: 1, y: -1},
});

const sourceImage = new ImageSprite({
    src: 'https://i.imgur.com/mXuQAt2.png',
    bounds: ImageSprite.Bounds(-280, 120, dims.width / 5, dims.height / 5),
    scale: {x: 1, y: -1},
    alpha: 0.25,
})

const sourceImageSelected = new ImageSprite({
    src: 'noresize:https://i.imgur.com/mXuQAt2.png',
    bounds: ImageSprite.Bounds(-280, 120, dims.width / 5, dims.height / 5),
    srcBounds: ImageSprite.Bounds(0, dims.height, dims.width, -dims.height),
    stroke: {
        color: Colors.White,
        lineWidth: 5,
        lineDash: 10,
        lineCap: 'round'
    },
    scale: {x: 1, y: -1}
});

stage.root.addChildren(image, sourceImage, sourceImageSelected);

for (const idx in Array.from({length: 2})) {
    const property = (['corner1', 'corner2'] as const)[idx];
    const color = ([Colors.Red, Colors.Blue] as const)[idx];
    const sourceProperty = (['srcCorner1', 'srcCorner2'] as const)[idx];

    const demoPosition = image[property];
    stage.root.addChild(new Ellipse({
        center: demoPosition,
        radius: 12,
        color: color,
        stroke: {lineWidth: 3},
    }).on('drag', (sprite, position) => {
            sprite.center = position;
            image[property] = position;
        }));

    const sourceColor = sourceImage[property];
    stage.root.addChild(new Ellipse({
        center: sourceColor,
        radius: 12,
        color: color,
        stroke: {lineWidth: 3},
    }).on('drag', (sprite, position) => {
            if (sourceImage.x1 - 10 <= position.x &&
                position.x <= sourceImage.x2 + 10 &&
                sourceImage.y1 - 10 <= position.y &&
                position.y <= sourceImage.y2 + 10) {
                sprite.center = position;
                sourceImageSelected[property] = position;
                sourceImageSelected[sourceProperty] = {
                    x: (position.x - sourceImage.x1) * 5,
                    y: (sourceImage.height - (position.y - sourceImage.y1)) * 5
                };
                image[sourceProperty] = ({
                    x: (position.x - sourceImage.x1) * 5,
                    y: (sourceImage.height - (position.y - sourceImage.y1)) * 5
                });
            }
        }));
    }
