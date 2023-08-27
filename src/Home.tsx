import { useEffect, useRef, useState } from 'react'
import styles from './Home.module.css';
import { Stage } from '../src/sharc/Stage'
import { Ellipse, Line, NullSprite } from '../src/sharc/Sprites'
import { Animate, Color, Colors, Easing, addXCallback } from '../src/sharc/Utils'
import { renderIntoDocument } from 'react-dom/test-utils'
import { LinkContainer } from 'react-router-bootstrap';


function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [debug, setDebug] = useState('test');

    useEffect(() => {

        const stage = new Stage(canvasRef.current!, 'centered', Color(5, 10, 50, 1));
        const root = stage.root;

        for (let i = 1; i < 7; i++) {

            const parent = new NullSprite({});

            const ellipse = new Ellipse({
                bounds: Ellipse.Bounds(i * 75, 0, 30),
                color: {
                    red: Math.random() * 175 + 55,
                    green: Math.random() *  175 + 55,
                    blue: Math.random() *  175 + 55,
                    alpha: 1,
                },
                stroke: {
                    color: Colors.White,
                    lineWidth: 5,
                }
            }).setOnHover(() => {
                canvasRef.current!.style.cursor = 'pointer';
            }).setOnHoverEnd(() => {
                canvasRef.current!.style.cursor = 'default';
            }).setOnRelease((sprite) => {
                if (root.name !== 'animating') {
                    const randomEllipse = root.children[Math.floor(Math.random() * root.children.length)].children[0];
                    sprite.getChannel(0).push(Animate('centerX', sprite.get('centerX'), randomEllipse.get('centerX'), 20));
                    randomEllipse.getChannel(0).push(Animate('centerX', randomEllipse.get('centerX'), sprite.get('centerX'), 20));
                    root.set('name', 'animating');
                }
            });

            ellipse.onAnimationFinish = () => {
                root.set('name', '');
            }

            parent.addChild(ellipse);

            parent.getChannel(0).push(Animate('rotation', 0, -360, 300 * (i * 0.7)), {loop: true});

            root.addChild(parent);
        }

        stage.afterDraw = () => {
            stage.bgColor = Color(5, 10, 50, .01);
        }

        stage.loop(90);

        return () => {
            stage.stop();
        }
    }, [canvasRef]);
    return <>
        <div style={{height: '120dvh', backgroundColor: '#050a2a'}} className='justify-content-center'>
                <div className="container d-block d-md-flex col-12 col-md-10 justify-content-center">
                    <div className="col-12 col-md-6 py-0 py-md-5 align-middle mx-3"  >
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                        <img src='https://i.imgur.com/mXuQAt2.png' id='logo' className={styles.logo}/>
                        <div className="text-container">
                            <br />
                            <p className={`${styles.p} h4 my-3 d-md-none`}>An animation library for Javascript. </ p>
                            <p className={`${styles.p}  h4 my-2 d-md-none`}>with Typescript support </ p>
                            <p className={`${styles.p}  h4 my-2 d-md-none`}>and cross-browser support </ p>
                            <p className={`${styles.p}  h4 my-2 d-md-none`}>and mobile support! </ p>
                            <p className={`${styles.p}  h1 font-weight-bold my-3 d-none d-md-block`}>An animation library for Javascript </ p>
                            <p className={`${styles.p}  h1 my-2 d-none d-md-block`}>with Typescript support, </ p>
                            <p className={`${styles.p}  h2 my-2 d-none d-md-block`}>and cross-browser support, </ p>
                            <p className={`${styles.p}  h3 my-2 d-none d-md-block`}>and mobile support! </ p>
                            <br />
                                <LinkContainer to='/docs/getting-started'>
                            <button type="button" className="btn btn-info btn-lg ">
                                Read the Docs!
                                </button>
                                </LinkContainer>
                                
                        </div>
                    </div>
                    <div className={`col-12 col-md-6 d-md-flex d-block parent-container mx-0 ${styles.parentcontainer}`}>
                    {/* Right Column */}
                        <canvas className={styles.canvas} ref={canvasRef} width="1000" height="1000"></canvas>
                    </div>
            </div>
        </div>
    </>
}

export default App