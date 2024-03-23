import { useEffect, useState } from "react";
import styles from './Showcase.module.css'
import { useRef } from "react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import oneLightTransparent from '../oneLightTransparent.ts';
import { OffscreenStage } from "sharc-js/async_stages/OffscreenStage";

export default function CodeShowcase(props: {code: string|Promise<string>, canvasRef: any, replaces?: ([string,string]|['regex',RegExp,string])[], tsOnly?: boolean}) {

    const copyButtonRef = useRef<HTMLButtonElement>(null);
    const [showcaseExpanded, setShowcaseExpanded] = useState(false);
    const tsOnly = props.tsOnly ?? false;
    const [tsEnabled, setTsEnabled] = useState(true);
    const [ text, setText ] = useState(typeof props.code === 'string' ? props.code : 'Loading...');

    useEffect(() => {
        if (typeof props.code !== 'string') {
            props.code.then(code => {
                setText(code);
            });
        }
    }, []);

    const jsReplaces = (props.replaces ?? []).concat([
        ['<HTMLCanvasElement>', ''],
        ['<string>', ''],
        [`from 'sharc/`, `from 'sharc-js/`],
        [' as HTMLCanvasElement;', ';'],
        ['as number[];', ';'],
        ['as number;', ';'],
        [`')!;`, `');`],
        [` as 'corner1'`, ``],
        [` as Line`, ``],
        [`)!`, `)`],
        [`as 'start'`, ``],
        [`]!`, `]`],
        [` as 'srcCorner1'`, ``],
        [`as PositionType`, ``],
        [`width!`, `width`],
        [`height!`, `height`],
        ['src: PositionType', 'src'],
        ['<PhysicsDetails>', ''],
        ['regex', /type \w+ = {(\n(.*?))*?};\n\n/g, ''],
        ['!.', '.'],
        [': PositionType', ''],
        [': Ellipse)', ')'],
        [': Ellipse,', ','],
        ['function (this)', 'function ()'],
        ['regex', /import {.*Type.*\n/g, ''],
        ['regex', /\((.*) as (\w*)\)/g, '$1'],
        ['(r as [number, number])', 'r'],
        [': Shape', ''],
        [' as const', ''],
        [' as any', ''],
        ['<any, CircleColors>', ''],
        ['<CircleColors>', ''],
        ['<any, "red"|"green"|"blue"|"yellow">', '']
    ])
    
    const tsReplaces = [
        [`from 'sharc/`, `from 'sharc-js/`],
    ] as ([string,string]|['regex',RegExp,string])[];

    const prepareCode = (code: string, replaces: ([string,string]|['regex',RegExp,string])[]) => {
        let newCode = code;
        replaces.forEach(replace => {
            if (replace.length === 3 && replace[1] instanceof RegExp) {
                newCode = newCode.replace(replace[1], replace[2]);
                return;
            }
            newCode = newCode.replaceAll(replace[0], replace[1] as string);
        });
    return newCode.replaceAll('\t', '\u00A0\u00A0\u00A0\u00A0');
    }

    return <div className="code-showcase d-flex flex-wrap flex-row align-content-around container align-items-left mw-100 p-0">
        <div style={showcaseExpanded ? {width: '100%', marginBottom: '.75vw'} : {marginRight: '.5vw', marginBottom: '.75vw'}}>
            <div className={showcaseExpanded ? styles.code_block_expanded : styles.code_block}>
                <SyntaxHighlighter
                    PreTag="span"
                    lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
                    wrapLines={true}
                    language={tsEnabled ? 'typescript' : 'javascript'}
                    style={{
                        ...oneLightTransparent,
                    }}
                >
                    {prepareCode(text, tsEnabled ? tsReplaces : jsReplaces) ?? ""}
                </SyntaxHighlighter>
            </div>
            <button className='btn btn-success m-1' ref={copyButtonRef} onClick={
                () => {
                    navigator.clipboard.writeText(prepareCode(text, tsEnabled ? tsReplaces : jsReplaces))
                    .then(() => {
                        copyButtonRef.current!.innerText = 'Copied!';
                    });
                    setTimeout(() => {
                        copyButtonRef.current!.innerText = 'Copy';
                    }, 1000);
                }
            }>Copy</button>
            <button className='btn btn-primary m-1 d-md-inline d-none' onClick={() => {
                setShowcaseExpanded(prev => !prev);
            }}>{showcaseExpanded ? 'Minimize' : 'Expand'}</button>
            {!tsOnly && <>
                {tsEnabled ?
                    <button className='btn btn-outline-info m-1' onClick={() => { setTsEnabled(false) } }>
                        Switch to <span className=' font-weight-bold' style={{color: '#FFA500'}}>JS</span>
                    </button>
                    :
                    <button className='btn btn-outline-warning m-1' onClick={() => { setTsEnabled(true) } }>
                        Switch to <span className=' font-weight-bold' style={{color: '#007ACC'}}>TS</span>
                    </button>
                }
            </>}
        </div>
        <div>
            <canvas className={styles.showcase} ref={props.canvasRef} width="600" height="400" style={{border: '5px solid black', marginLeft: '0em'}}></canvas>
        </div>
        
    </div>
}

export function AsyncCodeShowcase(props: {worker: Worker, prefix?: string, path: string, replaces?: ([string,string]|['regex',RegExp,string])[], tsOnly?: boolean}) {

    if (!props.worker) return;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let framerate = 60;
        const offscreenStage = new OffscreenStage(canvasRef.current!, props.worker);
        offscreenStage.on('message', (_, message) => {
            if (message.type === 'ready') {
                offscreenStage.loop(framerate);
            } else if (message.type === 'custom') {
                if (typeof message.message === 'string') {
                    alert(`${message.message} was clicked!`);
                } else if (message.message.alert) {
                    alert(message.message.alert);
                } else if (message.message.framerate) {
                    offscreenStage.loop(message.message.framerate);
                    framerate = message.message.framerate;
                } else if (message.message.clickable) {
                    canvasRef.current!.tabIndex = 0;
                }
            }
        });

        return () => {
            console.log('stopping offscreen stage');
            offscreenStage.stop();
        }
    }, []);

    const textPath = `${props.prefix ?? '/scripts/'}${props.path}.txt`;
    const codePromise = fetch(textPath).then(response => response.text());

    return <CodeShowcase code={codePromise} canvasRef={canvasRef} replaces={props.replaces} tsOnly={props.tsOnly} />
}
