import { useEffect, useRef } from "react";
import CodeBlock from "../../components/Code/Block";
import InlineCode from "../../components/Code/Inline";
import { Hyperlink } from "../../components/Sidebar/Hyperlink";
// import { Colors, Ellipse, Stage, addPositions, multiplyPositions } from "sharc-js";
import { Colors, addPositions, multiplyPositions } from "sharc-js/Utils";
import { Stage } from "sharc-js/Stage";
import { Ellipse } from "sharc-js/Sprites";
import CodeShowcase from "../../components/Code/Showcase";
import { PositionType } from "sharc-js/types/Common";
import { LabelSprite } from "sharc-js/Sprites";

export function Details() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);
        
        type PhysicsDetails = {
            velocity: PositionType,
            acceleration: PositionType,
        };
        
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
                const circle = new Ellipse<PhysicsDetails>({
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
        const simulatePhysics = function (this: Ellipse<PhysicsDetails>) {
            const acceleration: PositionType = {
                x: this.details!.acceleration.x + gravity.x,
                y: this.details!.acceleration.y + gravity.y,
            };
            const friction = {
                x: .95,
                y: .95,
            }
            const width = canvasRef.current!.width / 2 - this.radius[0];
            const height = canvasRef.current!.height / 2 - this.radius[1];
            this.details!.velocity = addPositions(this.details!.velocity, acceleration);
            this.details!.acceleration = multiplyPositions(this.details!.acceleration, friction);
            this.center = addPositions(this.center, this.details!.velocity);
            if (this.centerX > width || this.centerX < -width) {
                this.details!.velocity.x *= -friction.x;
                this.details!.acceleration.x *= -1;
                this.centerX = this.centerX > 0 ? width : -width;
            }
            if (this.centerY < -height) {
                this.centerY = -height;
                this.details!.velocity.x *= friction.x;
                this.details!.velocity.y *= -friction.y;
                this.details!.acceleration.y *= -1;
            }
        };
        
        label.on('click', reset);
        reset();
        stage.loop();
        
        return () => {
            stage.stop();
        }
    }, []);
    
    return <>
    <h1>Details</h1>
    <br />
    <p>
        Details is a way to store information directly on a sprite. Every sprite has a <InlineCode>details</InlineCode> property that is set to <InlineCode>undefined</InlineCode> by default.{' '}
        Also, in Typescript, the <InlineCode>details</InlineCode> property is typed as <InlineCode>any</InlineCode> by default, but this can also be changed.{' '}
        For example, imagine we wanted to store the following physics properties on an <InlineCode>Ellipse</InlineCode> sprite:
    </p>
    <CodeBlock code={
    `type PhysicsDetails = {
        \tvelocity: PositionType,
        \tacceleration: PositionType,
    };
    `} />
    <p>
        In Typescript, we can declare an <InlineCode>Ellipse</InlineCode> sprite with <InlineCode>PhysicsDetails</InlineCode> as its <InlineCode>details</InlineCode> type like so:
    </p>
    <CodeBlock code={
    `const ellipse = new Ellipse<PhysicsDetails>({
        \tcenter: { x: -100, y: 100 },
        \tradius: 15,
        \tcolor: Colors.Yellow,
        \tstroke: {
            \t\tlineWidth: 5,
        \t},
        \tdetails: {
            \t\tvelocity: { x: 0, y: 0 },
            \t\tacceleration: { x: 5, y: 0 },
        \t}
    });
    `} />
    <p>
        Then, we can access these details in any of our sprite's <Hyperlink to='sprites/event-listeners'>event listeners</Hyperlink>.
    </p>
    <CodeShowcase canvasRef={canvasRef} code={
        `import { Stage } from 'sharc-js/Stage';
        import { Ellipse, LabelSprite } from 'sharc-js/Sprites';
        import { Colors, addPositions, multiplyPositions } from 'sharc-js/Utils';
        import { PositionType } from 'sharc-js/types/Common';

        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

        type PhysicsDetails = {
            \tvelocity: PositionType,
            \tacceleration: PositionType,
        };

        const label = new LabelSprite({
            \ttext: 'Reset!',
            \tcolor: Colors.White,
            \tposition: { x: 0, y: 100 },
            \tpositionIsCenter: true,
            \tbackgroundColor: Colors.Blue,
            \tpadding: 10,
            \tfontSize: 50,
            \tstroke: { lineWidth: 5 },
        })

        stage.root.addChild(label);

        const reset = () => {
            \tstage.root.removeChildren(...stage.root.children.slice(1));
            \tfor (let i = 0; i < 7; i++) {
                \t\tconst circle = new Ellipse<PhysicsDetails>({
                    \t\t\tcenter: { 
                        \t\t\tx: -200 + i * 70, 
                        \t\t\ty: 100 - i * 20
                    \t\t},
                    \t\tradius: 20 + Math.random() * 35,
                    \t\tcolor: {
                        \t\t\tred: Math.random() * 180 + 55,
                        \t\t\tgreen: Math.random() *  180 + 55,
                        \t\t\tblue: Math.random() *  180 + 55,
                        \t\t\talpha: 1
                    \t\t},
                    \t\tstroke: {
                        \t\t\tlineWidth: 5,
                    \t\t},
                    \t\tdetails: {
                        \t\t\tvelocity: { x: 0, y: 0 },
                        \t\t\tacceleration: { x: Math.random(), y: 0 },
                    \t\t}
                \t\t});
                \t\tcircle.on('beforeDraw', simulatePhysics);
                \t\tstage.root.addChild(circle);
            \t}
        }

        const gravity = { x: 0, y: -.5 };

        // Note: I am not a physicist
        const simulatePhysics = function (this: Ellipse<PhysicsDetails>) {
            \tconst acceleration: PositionType = {
                \t\t\tx: this.details!.acceleration.x + gravity.x,
                \t\t\ty: this.details!.acceleration.y + gravity.y,
            \t};
            \tconst friction = {
                \t\tx: .95,
                \t\ty: .95,
            \t}
            \tconst width = canvas.width / 2 - this.radius[0];
            \tconst height = canvas.height / 2 - this.radius[1];
            \tthis.details!.velocity = addPositions(this.details!.velocity, acceleration);
            \tthis.details!.acceleration = multiplyPositions(this.details!.acceleration, friction);
            \tthis.center = addPositions(this.center, this.details!.velocity);
            \tif (this.centerX > width || this.centerX < -width) {
                \t\t\tthis.details!.velocity.x *= -friction.x;
                \t\t\tthis.details!.acceleration.x *= -1;
                \t\t\tthis.centerX = this.centerX > 0 ? width : -width;
            \t}
            \tif (this.centerY < -height) {
                \t\t\tthis.centerY = -height;
                \t\t\tthis.details!.velocity.x *= friction.x;
                \t\t\tthis.details!.velocity.y *= -friction.y;
                \t\t\tthis.details!.acceleration.y *= -1;
            \t}
        };

        label.on('click', reset);
        reset();
        stage.loop();
        `
    } />
    </>
}