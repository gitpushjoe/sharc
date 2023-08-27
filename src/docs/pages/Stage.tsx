import { useEffect, useRef } from "react";
import CodeBlock from "../components/Code/Block";
import CodeShowcase from "../components/Code/Showcase";
import { Stage } from '../../sharc/Stage';
import { BezierCurve, Ellipse, Line, Path, Rect, Star, TextSprite } from '../../sharc/Sprites';
import { useParams } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import CodeHeader from "../components/Code/Header";
import CodeBlurb from "../components/Code/Blurb";
import { Colors, Easing } from "../../sharc/Utils";
import InlineCode from "../components/Code/Inline";
import { Hyperlink } from "../components/Sidebar/Hyperlink";

export function DefaultPage() {
    const params = useParams<{category: string, subcategory: string, section: string}>();

    useEffect(() => {
        const element = document.getElementById(params.section!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }, [params]);

    return <>
        <div>
            <h1>Stage</h1>
            <p>
                {'The Stage class provides an interface for creating and managing an animation loop, as well as pointer events and scroll events on the canvas. ' +
                'Each stage has a root Sprite. The root is a '}
                <LinkContainer to='/docs/sprites/nullsprite'><a>NullSprite</a></LinkContainer>
                {', so it doesn\'t actually render anything. Instead, it serves as a container for all other sprites.'}
            </p>

            <br/>
            <CodeHeader header={'new Stage(canvas, rootStyle, bgColor)'} />
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['canvas: ', 'HTMLCanvasElement']} /><span> - the canvas to draw sprites to.</span>
            <br />
            <br />
            <CodeBlurb blurb={["rootStyle: ", "'classic'|'centered'"]} />
            <span> - If the root style is set to <em>'classic'</em>, then the root sprite will be positioned in the top-left corner of the canvas. If you've used the canvas API before, 
            coordinates will work much the way you would expect. Positive X correlates to moving right, and positive Y correlates to moving down. If the root style is set to <em>'centered'</em>, 
            then the root sprite will be positioned in the center of the canvas and its scaleY will be set to -1. In this case, positive X correlates to moving right, and positive Y correlates to moving up.
            </span>
            <br />
            <br />
            <CodeBlurb blurb={['bgColor: ', 'ColorType']} /><span> - the background color of the canvas.</span>
            <br />
           
            <br />
            <CodeHeader header={'stage.loop(framerate) -> void'} />
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <CodeBlurb blurb={['framerate: ', 'number']} /><span> - the framerate of the animation loop.</span>
            <div style={{'width': '1em', 'height': '.5em'}}></div>
            <div>
                Starts the animation loop at the specified framerate, resetting the frame counter to 0. If the animation loop is already running, it will be stopped and restarted.     
            </div>

            <br />
            <CodeHeader header={'stage.stop() -> void'} />
            <div>
                Stops the animation loop.
            </div>

            <br />
            <CodeHeader header={'stage.root -> NullSprite'} />
            <span>{'The root sprite. To draw sprites to the stage, they should be either added as '}
            <LinkContainer to='/docs/sprites/parenting'><a>children</a></LinkContainer>
            {' of the root sprite, or as children of those sprites, and so on and so on.'}</span>
            <br />
            
            <br />
            <CodeHeader header={'stage.width -> number'} />
            <div>
                Returns the width of the canvas in <Hyperlink>canvas units</Hyperlink>.
            </div>

            <br />
            <CodeHeader header={'stage.height -> number'} />
            <div>
                Returns the height of the canvas in canvas units.
            </div>

            <br />
            <CodeHeader header={'stage.lastRenderMs -> number'} />
            <div>
                The amount of time the last render took in milliseconds.
            </div>

            <br />
            <CodeHeader header={'stage.currentFrame: number'} />
            <div>
                The current frame of the animation loop.
            </div>

            <br />
            <CodeHeader header={'stage.bgColor: ColorType'} />
            <div>
                The color to clear the canvas to before each render. 
            </div>

            <br />
            <CodeHeader header={'stage.onPointerDown: (stage: Stage, event: PointerEvent, position: PositionType) => void'} />
            <div>
                {'See '}
                <Hyperlink to='stage/handling-user-input'>Handling User Input</Hyperlink>.
            </div>

            <br />
            <CodeHeader header={'stage.onPointerUp: (stage: Stage, event: PointerEvent, position: PositionType) => void'} />
            <div>
                {'See '}
                <Hyperlink to='stage/handling-user-input'>Handling User Input</Hyperlink>.
            </div>

            <br />
            <CodeHeader header={'stage.onPointerMove: (stage: Stage, event: PointerEvent, position: PositionType) => void'} />
            <div>
                {'See '}
                <Hyperlink to='stage/handling-user-input'>Handling User Input</Hyperlink>.
            </div>

            <br />
            <CodeHeader header={'stage.onScroll: (stage: Stage, event: WheelEvent) => void'} />
            <div>
                {'See '}
                <Hyperlink to='stage/handling-user-input'>Handling User Input</Hyperlink>.
            </div>

            <br />
            <CodeHeader header={'stage.beforeDraw: (stage: Stage) => void'} />
            <div>
                {'See '}
                <Hyperlink>Working with the Animation Loop</Hyperlink>.
            </div>

            <br />
            <CodeHeader header={'stage.afterDraw: (stage: Stage) => void'} />
            <div>
                {'See '}
                <Hyperlink>Working with the Animation Loop</Hyperlink>.
            </div>
        </div>
    </>;
}

export function Usage() {

    const canvasRef1 = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const canvasRef3 = useRef<HTMLCanvasElement>(null);
    const params = useParams<{category: string, subcategory: string, section: string}>();

    useEffect(() => {
        const element = document.getElementById(params.section!);
        element ? element.scrollIntoView() : window.scrollTo(0, 0);
    }), [params];

    useEffect(() => {

        const stage1 = new Stage(canvasRef1.current!, 'classic', Colors.LightSlateGray);

        const circle = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 10),
            color: Colors.Gold,
            stroke: {color: Colors.White, lineWidth: 3},
        });

        circle.addChild(
            new TextSprite({
                text: '(0, 0)',
                fontSize: 30,
                bold: true,
                color: Colors.Gold,
                position: {x: 10, y: 7},
            })
        )

        stage1.onPointerMove = (_stage, _event, position) => {
            circle.set('center', position);
            circle.children[0].set('text', `(${
                Math.round(position.x)}, ${
                Math.round(position.y)})`);
        }

        stage1.root.addChild(circle);
        stage1.loop();

        const stage2 = new Stage(canvasRef2.current!, 'centered', Colors.LightSlateGray);

        const circle2 = new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 10),
            color: Colors.Gold,
            stroke: {color: Colors.White, lineWidth: 3},
        });

        circle2.addChild(
            new TextSprite({
                text: '(0, 0)',
                fontSize: 30,
                bold: true,
                color: Colors.Gold,
                position: {x: 10, y: -40},
                scale: {x: 1, y: -1},
            })
        )

        stage2.onPointerMove = (_stage, _event, position) => {
            circle2.set('center', position);
            circle2.children[0].set('text', `(${
                Math.round(position.x)}, ${
                Math.round(position.y)})`);
        }

        stage2.root.addChildren(
            new Line({
                bounds: Line.Bounds(0, 300, 0, -300),
                color: Colors.LightGrey,
                lineWidth: 4,
            }),
            new Line({
                bounds: Line.Bounds(300, 0, -300, 0),
                color: Colors.LightGrey,
                lineWidth: 4,
            }),
        )

        stage2.root.addChild(circle2);
        stage2.loop();

        const stage3 = new Stage(canvasRef3.current!, 'centered', Colors.LightSlateGray);

        stage3.root.addChild(new Line({
            bounds: Line.Bounds(0, 0, 0, 80),
            color: Colors.Gold,
            lineWidth: 7,
            lineCap: 'round',
        }).addChild(new Path({
            path: [
                {x: -15, y: 40 - 15},
                {x: 0, y: 40},
                {x: 15, y: 40 - 15},
            ],
            stroke: {
                color: Colors.Gold,
                lineWidth: 7,
                lineCap: 'round',
            },
            color: Colors.Transparent,
        })));

        stage3.root.createChannels(1);

        stage3.root.distribute([
            [{property: 'rotation', from: 0, to: 360, duration: 180, delay: 0, easing: Easing.LINEAR}],
            [{property: 'scale', from: {x: 1, y: -1}, to: {x: 2, y: -2}, duration: 180, delay: 0, easing: Easing.LINEAR}],
        ], {loop: true, delay: 0});

        stage3.loop();

        return () => {
            stage1.stop();
            stage2.stop();
            stage3.stop();
        }
    }, [canvasRef1]);
    return <>
        <h1>Usage</h1>

        <br/>
        <h3>Choosing a Root Style</h3>
        <p>{'Every Stage comes with a root sprite that represents the center of the canvas. As explained in the '}
        <LinkContainer to='/docs/stage'><a>previous chapter</a></LinkContainer>
        {`, there are two root styles: `}<em>'classic'</em>{', and '}<em>'centered'</em>{'. With classic root nodes, the root is placed in the top-left corner. '}
        {'If there\'s no scaling, a positive y-value is lower on the canvas than a negative y-value. Move your mouse around in the canvas below to see a demo of how this works. To better understand how to make this demo, see '}
        <Hyperlink to='stage/handling-user-input'>Handling User Input</Hyperlink>
        {'.'}</p>
        <CodeShowcase canvasRef={canvasRef1} code={
            `import { Stage } from 'sharc/Stage';
            import { Ellipse, TextSprite } from 'sharc/Sprites';
            import { Colors } from 'sharc/Utils';

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'classic', Colors.LightSlateGray);

            const circle = new Ellipse({
                        \tbounds: Ellipse.Bounds(0, 0, 10),
            \tcolor: Colors.Gold,
            \tstroke: {color: Colors.White, lineWidth: 3},
            });

            circle.addChild(
            \tnew TextSprite({
            \t\ttext: '(0, 0)',
            \t\tfontSize: 30,
            \t\tbold: true,
            \t\tcolor: Colors.Gold,
            \t\tposition: {x: 10, y: 7},
            \t})
            )

            stage.root.addChild(circle);

            stage.onPointerMove = (_stage, _event, position) => {
                \tcircle.set('center', position);
                \tcircle.children[0].set('text', \`(
                    \t\t$\{Math.round(position.x)}, 
                    \t\t$\{Math.round(position.y)})
                \t\`); 
            }

            stage.loop();
        `} />

        <p>{'With centered root nodes, the origin of the canvas is placed in the center. The y-axis of the root node is also flipped, so that a positive y-value is higher on the canvas than a negative y-value. '}
        {'As a result, the canvas works more like a traditional Cartesian plane.'}</p>
        <CodeShowcase canvasRef={canvasRef2} code={
            `import { Stage } from 'sharc/Stage';
            import { Ellipse, TextSprite, Line } from 'sharc/Sprites';
            import { Colors } from 'sharc/Utils';

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const circle = new Ellipse({
                        \tbounds: Ellipse.Bounds(0, 0, 10),
            \tcolor: Colors.Gold,
            \tstroke: {color: Colors.White, lineWidth: 3},
            });

            circle.addChild(
            \tnew TextSprite({
            \t\ttext: '(0, 0)',
            \t\tfontSize: 30,
            \t\tbold: true,
            \t\tcolor: Colors.Gold,
            \t\tposition: {x: 10, y: -40},
            \t\tscale: {x: 1, y: -1},
            \t})
            )

            stage.root.addChildren(
                \tnew Line({
                    \t\tbounds: Line.Bounds(0, 300, 0, -300),
                    \t\tcolor: Colors.LightGrey,
                    \t\tlineWidth: 4,
                    \t}),
                    \tnew Line({
                        \t\t bounds: Line.Bounds(300, 0, -300, 0),
                        \t\t  color: Colors.LightGrey,
                        \t\t  lineWidth: 4,
                        \t  }),
            )    
            
            stage.root.addChild(circle);

            stage.onPointerMove = (_stage, _event, position) => {
                \tcircle.set('center', position);
                \tcircle.children[0].set('text', \`(
                    \t\t$\{Math.round(position.x)}, 
                    \t\t$\{Math.round(position.y)})
                \t\`);    
            }

            stage.loop();`} />

        <br/>
        <h3>Rendering Sprites</h3>
        <p>{'From now on, all canvases will be using the centered root style. To render sprites, you need to add them as descendants of the root sprite. Child sprites '}
        <Hyperlink to='sprites/parenting'>{'inherit the rotation, scaling, and translation*'}</Hyperlink>
        {' of their parent. So if you want to draw a square in the center of the canvas while using a centered root node, you would position it at (0, 0). '}
        {'Since the root node is a NullSprite itself, its properties can be modified just like any other sprite, which will affect all of its children. '}
        {'The following demo illustrates this, '} 
        <Hyperlink to='animation'>animating</Hyperlink>
        {' the rotation of the root from 0 to 360 and the scale from 1 to 2.'}
        <br/>
        {'Once you\'re done adding sprites, you can start the animation loop with '}
        <CodeBlurb blurb={['stage.loop()']} />
        {' and stop it with '}
        <CodeBlurb blurb={['stage.stop()']} />
        {'.'}
        </p>
        <p>
        <em>
            * The origin for a child sprite is the center of its parent. In the example below, the line is 80 units long, so the tip of the arrowhead is positioned at (0, 40).    
        </em></p>
        <CodeShowcase canvasRef={canvasRef3} code={
        `import { Stage } from 'sharc/Stage';
        import { Line, Path } from 'sharc/Sprites';
        import { Colors, Easing } from 'sharc/Utils';
        
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

        stage.root.addChild(new Line({
            \tbounds: Line.Bounds(0, 0, 0, 80),
            \tcolor: Colors.Gold,
            \tlineWidth: 7,
            \tlineCap: 'round',
        }).addChild(new Path({
            \tpath: [
                \t\t{x: -15, y: 40 - 15},
                \t\t{x: 0, y: 40},
                \t\t{x: 15, y: 40 - 15},
            \t],
            \tstroke: {
            \t\tcolor: Colors.Gold,
                \t\tlineWidth: 7,
                \t\tlineCap: 'round',
            \t},
            \tcolor: Colors.Transparent,
        })));

        stage.root.createChannels(1);

        stage.root.distribute([
            \t[{property: 'rotation', from: 0, to: 360, duration: 180, delay: 0, easing: Easing.LINEAR}],
            \t[{property: 'scale', from: {x: 1, y: -1}, to: {x: 2, y: -2}, duration: 180, delay: 0, easing: Easing.LINEAR}], // -1 and -2 since the root is flipped on the y-axis
        ], {loop: true, delay: 0});

        stage.loop();`
        } />
    </>
}

export function React() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        stage.root.addChild(new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 100),
            color: Colors.Aqua,
        }));

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>React</h1>
        <p>
            In order to use the Stage class with React, you will want the stage to load{' '}
            when a component mounts and unload when it unmounts. This can be achieved with a <InlineCode>useEffect</InlineCode> hook.{' '}
            Here is an example using functional components:
        </p>

        <br />
        <CodeShowcase code={`import { useEffect, useRef } from 'react';
            import { Stage } from 'sharc-js/Stage';
            import { Ellipse } from 'sharc-js/Sprits';
            import { Colors } from 'sharc-js/Utils';
            
            export function StageComponent() {
                \tconst canvasRef = useRef<HTMLCanvasElement>(null);
            
                \tuseEffect(() => {
                    \t\tconst stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

                    \t\tstage.root.addChild(new Ellipse({
                        \t\t\tbounds: Ellipse.Bounds(0, 0, 100),
                        \t\t\tcolor: Colors.Aqua,
                    \t\t}));

                    \t\tstage.loop();

                    \t\treturn () => {
                        \t\t\tstage.stop();
                    \t\t}
                \t}, []);
                \t                        
                \treturn <canvas ref={canvasRef} width={600} height={400} />
            }`} canvasRef={canvasRef} />
    </>
}

export function Angular() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stage = new Stage(canvasRef.current!, 'centered', Colors.LightSlateGray);

        stage.root.addChild(new Ellipse({
            bounds: Ellipse.Bounds(0, 0, 100),
            color: Colors.Aqua,
        }));

        stage.loop();

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Angular</h1>
        <p>
            In order to use the Stage class with Angular, you will want the stage to load{' '}
            when the component is initialized and unload when it is destroyed. This can be achieved with the <InlineCode>ngOnInit</InlineCode> and <InlineCode>ngOnDestroy</InlineCode> lifecycle hooks.
        </p>

        <br />
        <CodeShowcase code={
        `import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
        import { Stage } from 'sharc-js/Stage';
        import { Ellipse } from 'sharc-js/Sprites';
        import { Colors } from 'sharc-js/Utils';

        @Component({
            \tselector: 'app-stage',
            \ttemplate: '<canvas #canvasRef width="600" height="400"></canvas>',
        })
        export class StageComponent implements OnInit, OnDestroy {
            \t@ViewChild('canvasRef', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
            \tprivate stage!: Stage;

            \tngOnInit() {
                \t\tthis.stage = new Stage(this.canvasRef.nativeElement, 'centered', Colors.LightSlateGray);
                
                \t\tthis.stage.root.addChild(new Ellipse({
                    \t\t\tbounds: Ellipse.Bounds(0, 0, 100),
                    \t\t\tcolor: Colors.Aqua,
                \t\t}));

                \t\tthis.stage.loop();
            \t}

            \tngOnDestroy() {
                \t\tthis.stage.stop();
            \t}
        }`} canvasRef={canvasRef} tsOnly={true}/>
    </>
}

export function HandlingUserInput() {

    const canvasRef1 = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef1.current!, 'centered', Colors.LightSlateGray);
        const stage2 = new Stage(canvasRef2.current!, 'centered', Colors.LightSlateGray);

        const text = new TextSprite({
            text: 'Click me!',
            position: {x: -275, y: -175},
            color: Colors.White,
            scale: {x: 1, y: -1},
            fontSize: 35,
            bold: true,
        });
        
        
        stage.root.addChildren(
            new Line({
                bounds: Line.Bounds(0, 300, 0, -300),
                color: Colors.LightGrey,
                lineWidth: 4,
            }),
            new Line({
                bounds: Line.Bounds(300, 0, -300, 0),
                color: Colors.LightGrey,
                lineWidth: 4,
            }),
            )
            
            stage.root.addChildren(
                new Ellipse({
                    bounds: Ellipse.Bounds(0, 0, 10),
                    color: Colors.Gold,
                    stroke: {color: Colors.White, lineWidth: 3},
                })
                )
                
        stage.root.addChild(text);

        stage.onPointerDown = (stage, event, position) => {
            const button = event.button === 0 ? 'Left' : event.button === 1 ? 'Middle' : 'Right';
            stage.root.children[3].set('text', `${button} click at (${Math.round(position.x)}, ${Math.round(position.y)})`);
            stage.root.children[2].set('center', position);
        }
        
        stage.loop();
        
        const sliderText = new TextSprite({
            text: 'Slider',
            position: {x: -155, y: -15},
            scale: {x: 1, y: -1},
            color: Colors.White,
            fontSize: 40,
            textAlign: 'right',
        });

        const slider = new Ellipse({
            bounds: Ellipse.Bounds(-130, 0, 12),
            color: Colors.DarkBlue,
            stroke: {color: Colors.White, lineWidth: 4},
        });

        const sliderLine = new Line({
            bounds: Line.Bounds(-130, 0, 275, 0),
            color: Colors.LightGrey,
            lineWidth: 4,
            lineCap: 'round',
        });

        stage2.root.addChildren(sliderText, sliderLine, slider);

        stage2.onScroll = (stage, event) => {
            const delta = event.deltaY;
            const sliderX = slider.get('centerX');
            if (delta < 0) {
                slider.set('centerX', Math.min(sliderX + 10, 275));
            } else if (delta > 0) {
                slider.set('centerX', Math.max(sliderX - 10, -130));
            }
            const percentage = (slider.get('centerX') + 130) / 405;
            sliderText.set('red', (1 - percentage) * 200);
            sliderText.set('blue', (1 - percentage) * 200);
            sliderText.set('bold', percentage === 1);
            sliderText.set('text', `${Math.round(percentage * 100)}%`);
        }
        
        stage2.loop();
        
        return () => {
            stage.stop();
            stage2.stop();
        }
    }, [canvasRef1]);

    return <>
        <h1>Handling User Input</h1>
        <p>{'In order to detect user input like left clicks and scrolling, you can modify any of four of the stage\'s public variables. Detecting pointer events work like this: '}
        {'you change one of the Stage\'s variables to a function that take in three parameters: a Stage object, a PointerEvent object, and a '}
        <LinkContainer to='/docs/types/common/positiontype'><a>PositionType</a></LinkContainer>
        {' object. Then, whenever the user interacts the canvas, the stage will call the function with the Stage set to itself, the PointerEvent set to the event that triggered the function, '}
        {' and the PositionType set to the position of the pointer relative to the canvas. '}
        </p>

        <br />
        <CodeHeader header={'stage.onPointerDown: '} />
        <p>
            {'This callback is called whenever the user presses down on the canvas with the left or right mouse button, or with a touch screen. '}
            {'This demo also uses the data from the pointer event to display which button was pressed.'}
        </p>
        <CodeShowcase canvasRef={canvasRef1} code={
            `import { Stage } from 'sharc/Stage';
            import { Ellipse, TextSprite, Line } from 'sharc/Sprites';
            import { Colors } from 'sharc/Utils';
            import { PositionType } from 'sharc/types/Common';
            
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);

            const text = new TextSprite({
                \ttext: 'Click me!',
                \tposition: {x: -275, y: -175},
                \tcolor: Colors.White,
                \tscale: {x: 1, y: -1},
                \tfontSize: 35,
                \tbold: true,
            });
            
            stage.root.addChildren(
                \tnew Line({
                    \t\tbounds: Line.Bounds(0, 300, 0, -300),
                    \t\tcolor: Colors.LightGrey,
                    \t\tlineWidth: 4,
                    \t}),
                    \tnew Line({
                        \t\tbounds: Line.Bounds(300, 0, -300, 0),
                        \t\tcolor: Colors.LightGrey,
                        \t\tlineWidth: 4,
                        \t}),
                        \t)
                
            stage.root.addChildren(
                \tnew Ellipse({
                    \t\tbounds: Ellipse.Bounds(0, 0, 10),
                    \t\tcolor: Colors.Gold,
                    \t\tstroke: {color: Colors.White, lineWidth: 3},
                    \t})
            )
                    
            stage.root.addChild(text);
    
            stage.onPointerDown = (stage: Stage, event: PointerEvent, position: PositionType) => {
                \tconst button = event.button === 0 ? 'Left' : event.button === 1 ? 'Middle' : 'Right';
                \tstage.root.children[3].set('text', \`$\{button} click at (\
                    \t\t$\{Math.round(position.x)},
                    \t\t$\{Math.round(position.y)})
                \t\`);
                \tstage.root.children[2].set('center', position);
            }
            
            stage.loop();`
        } />

        <br />
        <CodeHeader header={'stage.onPointerUp'} />
        <p>
            {'This callback is triggered whenever the user releases the left or right mouse button, or lifts their finger from a touch screen. '}
            {'The syntax is the same as in the demo above.'}
        </p>

        <br />
        <CodeHeader header={'stage.onPointerMove'} />
        <p>
            {'This callback is triggered whenever the user releases the left or right mouse button, or lifts their finger from a touch screen. '}
            {'The syntax is the same as in the demo above.'}
        </p>

        <br />
        <CodeHeader header={'stage.onScroll'} />
        <p>
            {'This callback is triggered whenever the user scrolls the mouse wheel. Unlike the previous two functions, this one only takes two parameters: a Stage object and a '}
            {'WheelEvent object.'}
        </p>
        <CodeShowcase canvasRef={canvasRef2} code={
            `import { Stage } from 'sharc/Stage';
            import { Ellipse, TextSprite, Line } from 'sharc/Sprites';
            import { Colors } from 'sharc/Utils';

            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const stage = new Stage(canvas, 'centered', Colors.LightSlateGray);
            
            const sliderText = new TextSprite({
                \ttext: 'Slider',
                \tposition: {x: -155, y: -15},
                \tscale: {x: 1, y: -1},
                \tcolor: Colors.White,
                \tfontSize: 40,
                \ttextAlign: 'right',
            });
    
            const slider = new Ellipse({
                \tbounds: Ellipse.Bounds(-130, 0, 12),
                \tcolor: Colors.DarkBlue,
                \tstroke: {color: Colors.White, lineWidth: 4},
            });
    
            const sliderLine = new Line({
                \tbounds: Line.Bounds(-130, 0, 275, 0),
                \tcolor: Colors.LightGrey,
                \tlineWidth: 4,
                \tlineCap: 'round',
            });
    
            stage.root.addChildren(sliderText, sliderLine, slider);
    
            stage.onScroll = (stage, event) => {
                \tconst delta = event.deltaY;
                \tconst sliderX = slider.get('centerX');
                \tif (delta < 0) {
                    \t\tslider.set('centerX', Math.min(sliderX + 10, 275));
                    \t} else if (delta > 0) {
                    \t\tslider.set('centerX', Math.max(sliderX - 10, -130));
                    \t}
                    \tconst percentage = (slider.get('centerX') + 130) / 405;
                    \tsliderText.set('red', (1 - percentage) * 200);
                    \tsliderText.set('blue', (1 - percentage) * 200);
                    \tsliderText.set('bold', percentage === 1);
                    \tsliderText.set('text', \`$\{Math.round(percentage * 100)}%\`);
            }
            
            stage.loop();`
        } />
    </>
}

export function WorkingWithTheAnimationLoop() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Colors.DarkBlue);
        
        stage.beforeDraw = (stage) => {
            if (stage.currentFrame % 2 === 0) {
                stage.bgColor = Colors.DarkRed;
            } else {
                stage.bgColor = Colors.DarkBlue;
            }
        }

        stage.root.addChild(new TextSprite({
            text: 'even frame',
            color: Colors.White,
            positionIsCenter: true,
            position: {x: 0, y: 10},
            scale: {x: 1, y: -1},
            fontSize: 60,
            bold: true,
        }));

        stage.afterDraw = (stage) => {
            if (stage.currentFrame % 2 === 0) {
                stage.root.children[0].set('text', 'odd frame');
            } else {
                stage.root.children[0].set('text', 'even frame');
            }
        }

        stage.loop(0.25);

        return () => {
            stage.stop();
        }
    }, [canvasRef]);

    return <>
        <h1>Working with the Animation Loop</h1>
        <p>
            {'The animation loop is a function that is called every frame. It clears the canvas, '}
            <Hyperlink to='animation'>animates</Hyperlink>
            {' all of the sprites, and then renders them. The Stage class provides two public variables that allows you to add custom code before and after the animation loop. They are  '}
            <InlineCode> stage.beforeDraw </InlineCode>
            {' and '}
            <InlineCode> stage.afterDraw</InlineCode>
            {'. They both work the same way, you set them to a function that takes in a Stage object. The function will then be called before or after the animation loop, respectively.'}
            {'The following demo has its frame rate set all the way down to 1 frame every four seconds, and it changes the background color to red on odd frames and blue on even frames.'}
        </p>
        <CodeShowcase canvasRef={canvasRef} code={
            `import { Stage } from 'sharc/Stage';
        import { TextSprite } from 'sharc/Sprites';
        import { Colors } from 'sharc/Utils';

        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const stage = new Stage(canvas, 'centered', Colors.DarkBlue);
        
        stage.beforeDraw = (stage) => {
            \tif (stage.currentFrame % 2 === 0) {
                \t\tstage.bgColor = Colors.DarkRed;
                \t} else {
                    \t\tstage.bgColor = Colors.DarkBlue;
                    \t}
        }

        stage.root.addChild(new TextSprite({
            \ttext: 'even frame',
            \tcolor: Colors.White,
            \tpositionIsCenter: true,
            \tposition: {x: 0, y: 10},
            \tscale: {x: 1, y: -1},
            \tfontSize: 60,
            \tbold: true,
        }));

        stage.afterDraw = (stage) => {
            \tif (stage.currentFrame % 2 === 0) {
                \t\tstage.root.children[0].set('text', 'odd frame');
                \t} else {
                    \t\tstage.root.children[0].set('text', 'even frame');
                    \t}
        }

        stage.loop(0.25);`
        } />    
    </>
}