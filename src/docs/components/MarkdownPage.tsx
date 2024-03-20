import ReactMarkdown from 'react-markdown';
import { useEffect, useState, useMemo } from 'react';
import { Hyperlink } from './Sidebar/Hyperlink';
import InlineCode from './Code/Inline';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import oneLightTransparent from './oneLightTransparent.ts';
import styles from './MarkdownPage.module.css';
import { AsyncCodeShowcase } from './Code/Showcase';
import CodeBlurb from './Code/Blurb.tsx';

export default function MarkdownPage({ path }: {path: string}) {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(path);
                setMarkdown(await res.text());
            } catch (e) {
                console.error(e);
            }
        })();
    }, [path]);

    const insertNewlines = (children: any) => {
        const replaceNewlines = (str: string) => {
            return str.split(/(\[\d*\])/g).map((str, index) => {
                if (str.match(/(\[\d*\])/g)) {
                    const match = str.match(/\[(\d*)\]/)![1];
                    const count = parseInt(match);
                    console.log(`count: ${count}`);
                    if (count === 0) {
                        return <div style={{marginBottom: '1em'}} key={index} />;
                    }
                    return Array(1 && isNaN(count) || count).fill(0).map((_, i) => <br key={`${index} ${i}`} />);
                }
                return str;
            });
        }
        return children.map && children.map((child: any) => {
            if (typeof child === 'string') {
                return replaceNewlines(child);
            }
            return child;
        }) || (typeof children === 'string' ? replaceNewlines(children) : children);
    }

    const workers = { // am yet to find a better working solution; related to this issue: https://stackoverflow.com/questions/56517198/new-worker-will-only-be-bundled-if-passed-a-string
        'getting-started/blue': () => new Worker(new URL('../../scripts/getting-started/blue.ts', import.meta.url), { type: 'module' }),
        'getting-started/bounds': () => new Worker(new URL('../../scripts/getting-started/bounds.ts', import.meta.url), { type: 'module' }),
        'getting-started/starter': () => new Worker(new URL('../../scripts/getting-started/starter.ts', import.meta.url), { type: 'module' }),
        'getting-started/manual': () => new Worker(new URL('../../scripts/getting-started/manual.ts', import.meta.url), { type: 'module' }),
        'stage/usage': () => new Worker(new URL('../../scripts/stage/usage.ts', import.meta.url), { type: 'module' }),
        'stage/usage-centered': () => new Worker(new URL('../../scripts/stage/usage-centered.ts', import.meta.url), { type: 'module' }),
        'stage/rendering': () => new Worker(new URL('../../scripts/stage/rendering.ts', import.meta.url), { type: 'module' }),
        'stage/react': () => new Worker(new URL('../../scripts/stage/react.ts', import.meta.url), { type: 'module' }),
        'stage/angular': () => new Worker(new URL('../../scripts/stage/angular.ts', import.meta.url), { type: 'module' }),
        'stage/click': () => new Worker(new URL('../../scripts/stage/click.ts', import.meta.url), { type: 'module' }),
        'stage/scroll': () => new Worker(new URL('../../scripts/stage/scroll.ts', import.meta.url), { type: 'module' }),
        'stage/beforedraw': () => new Worker(new URL('../../scripts/stage/beforedraw.ts', import.meta.url), { type: 'module' }),
        'stage/keydown': () => new Worker(new URL('../../scripts/stage/keydown.ts', import.meta.url), { type: 'module' }),
        'stage/async-stages': () => new Worker(new URL('../../scripts/stage/async-stages.ts', import.meta.url), { type: 'module' }),
        'sprites/usage': () => new Worker(new URL('../../scripts/sprites/usage.ts', import.meta.url), { type: 'module' }),
        'sprites/details': () => new Worker(new URL('../../scripts/sprites/details.ts', import.meta.url), { type: 'module' }),
        'sprites/the-base-shape-class': () => new Worker(new URL('../../scripts/sprites/the-base-shape-class.ts', import.meta.url), { type: 'module' }),
        'sprites/line': () => new Worker(new URL('../../scripts/sprites/line.ts', import.meta.url), { type: 'module' }),
        'sprites/rect': () => new Worker(new URL('../../scripts/sprites/rect.ts', import.meta.url), { type: 'module' }),
        'sprites/ellipse': () => new Worker(new URL('../../scripts/sprites/ellipse.ts', import.meta.url), { type: 'module' }),
        'sprites/beziercurve': () => new Worker(new URL('../../scripts/sprites/beziercurve.ts', import.meta.url), { type: 'module' }),
        'sprites/path': () => new Worker(new URL('../../scripts/sprites/path.ts', import.meta.url), { type: 'module' }),
        'sprites/polygon': () => new Worker(new URL('../../scripts/sprites/polygon.ts', import.meta.url), { type: 'module' }),
        'sprites/star': () => new Worker(new URL('../../scripts/sprites/star.ts', import.meta.url), { type: 'module' }),
        'sprites/text': () => new Worker(new URL('../../scripts/sprites/text.ts', import.meta.url), { type: 'module' }),
        'sprites/label': () => new Worker(new URL('../../scripts/sprites/label.ts', import.meta.url), { type: 'module' }),
        'sprites/image': () => new Worker(new URL('../../scripts/sprites/image.ts', import.meta.url), { type: 'module' }),
        'sprites/nullsprite': () => new Worker(new URL('../../scripts/sprites/nullsprite.ts', import.meta.url), { type: 'module' }),
        'animation/channels': () => new Worker(new URL('../../scripts/animation/channels.ts', import.meta.url), { type: 'module' }),
        'animation/distribute': () => new Worker(new URL('../../scripts/animation/distribute.ts', import.meta.url), { type: 'module' }),
        'animation/from-null': () => new Worker(new URL('../../scripts/animation/from-null.ts', import.meta.url), { type: 'module' }),
        'animation/to-callback': () => new Worker(new URL('../../scripts/animation/to-callback.ts', import.meta.url), { type: 'module' }),
    } as Record<string, () => Worker>;

    const insertShowcase = (children: any) => { 
        const replaceShowcase = (str: string) => {
            return str.split(/\[\[\[(.*?)\]\]\]/g).map((str, index) => {
                if (index % 2 === 0) {
                    return str;
                }
                return <div style={{marginTop: '1em', filter: 'drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.25))'}} key={index}>
                    <AsyncCodeShowcase path={str} worker={(workers[str] ?? (() => {}))()} />
                </div>;
            });
        }
        return children.map && children.map((child: any) => {
            if (typeof child === 'string') {
                return replaceShowcase(child);
            }
            return child;
        }) || (typeof children === 'string' ? replaceShowcase(children) : children);
    }

    function textParse(text: any) { return insertNewlines(insertShowcase(text)); }

    const output = useMemo(() => { 
        return <div className={styles.markdown}>
        <ReactMarkdown components={{
            p({ className, children, ...props }) {
                    console.log(`children: ${children}`);
                return <p className={className} style={{marginBottom: "0"}} {...props}>{textParse(children)}</p>;
            },
            a({ href, children, ...props }) {
                return (!href) ? 
                    children!.toString().startsWith('c:') ?
                        <><InlineCode children={<Hyperlink children={children!.toString().slice(2)} {...props} /> as unknown as string} /></> :
                        <Hyperlink children={children!.toString()} {...props} /> :
                    children!.toString().startsWith('c:') ?
                        <InlineCode children={<Hyperlink to={href} children={children!.toString().slice(2)} {...props} /> as unknown as string} /> :
                        <Hyperlink to={href} children={children!.toString()} {...props} />;
            },
            code(props) {
                const {children, className, node, ...rest} = props;
                if (className === undefined) {
                    if (children!.toString().startsWith('bl:')) {
                        const blurb = [
                            children!.toString().slice(3).split(':')[0] + (children!.toString().slice(3).indexOf(':') !== -1 ? ':' : ''),
                            children!.toString().slice(3).split(':').slice(1).join("")
                        ];
                        return <CodeBlurb blurb={blurb} />;
                    }
                    const weight = children!.toString().startsWith('!b:') ? 500 : 600;
                    return <InlineCode {...rest} weight={weight} >{children!.toString().slice(weight === 500 ? 3 : 0)}</InlineCode>;
                }
                if (/language-(\w+)-header/.test(className)) {
                    return <span style={{fontSize: "1.25em", margin: "0", backgroundColor: "rgba(0, 0, 0, 0)", overflowWrap: "break-word", wordWrap: "break-word"}}>
                        <SyntaxHighlighter
                            {...rest}
                            PreTag="span"
                            lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
                            wrapLines={true}
                            children={String(children).replace(/\n$/, '')}
                            language={className.split('-')[1]}
                            style={{
                                ...oneLightTransparent,
                            }}
                        />
                    </span>;
                }
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                    <span style={{fontSize: "1.15em", fontWeight: "500", margin: "0", backgroundColor: "rgba(0, 0, 0, 0)", overflowWrap: "break-word", wordWrap: "break-word"}}>
                    <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            wrapLines={true}
                            style={{
                                ...oneLight,
                            }}
                        />
                    </span>
                ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    )
            }
        }}>
            {markdown}
        </ReactMarkdown>
    </div>;

    }, [markdown]);
           
    return output;

}
