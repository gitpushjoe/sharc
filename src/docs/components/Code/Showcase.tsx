import { MutableRefObject, useEffect, useState } from "react";
import styles from './Showcase.module.css'
import { useRef } from "react";

export default function CodeShowcase(props: {code: string, canvasRef: any, replaces?: string[][], tsOnly?: boolean}) {

    const copyButtonRef = useRef<HTMLButtonElement>(null);
    const [showcaseExpanded, setShowcaseExpanded] = useState(false);
    const tsOnly = props.tsOnly ?? false;
    const [tsEnabled, setTsEnabled] = useState(tsOnly);

    const jsReplaces = (props.replaces ?? []).concat([
        ['<HTMLCanvasElement>', ''],
        [`from 'sharc/`, `from 'sharc-js/`],
        [' as HTMLCanvasElement;', ';'],
        [`from 'sharc-js/`, `from 'sharc-js/dist/`],
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
    ])
    
    const tsReplaces = [
        [`from 'sharc/`, `from 'sharc-js/`],
    ];

    const prepareCode = (code: string, replaces: string[][]) => {
        let newCode = code.replaceAll('\t', '\u00A0\u00A0\u00A0\u00A0');
        replaces.forEach(replace => {
            newCode = newCode.replaceAll(replace[0], replace[1]);
        });
        return newCode;
    }

    return <div className="code-showcase d-flex flex-wrap flex-row align-content-around container align-items-left mw-100 p-0">
        <div style={showcaseExpanded ? {width: '100%', marginBottom: '.75vw'} : {marginRight: '.5vw', marginBottom: '.75vw'}}>
        <div className={showcaseExpanded ? styles.code_block_expanded : styles.code_block}>
            <code style={{color: 'black', whiteSpace: 'pre-line'}}>
                {prepareCode(props.code, tsEnabled ? tsReplaces : jsReplaces)}
            </code>
        </div>
            <button className='btn btn-success m-1' ref={copyButtonRef} onClick={
                () => {
                    navigator.clipboard.writeText(prepareCode(props.code, tsEnabled ? tsReplaces : jsReplaces))
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
            <canvas className={styles.canvas} ref={props.canvasRef} width="600" height="400" style={{border: '5px solid black', marginLeft: '0em'}}></canvas>
        </div>
        
    </div>
}