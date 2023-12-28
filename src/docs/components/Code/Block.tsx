export default function CodeBlock(props: {code: string}) {
    return <div className='code-block rounded' style={{width: 'fit-content', height: 'fit-content', backgroundColor: '#f0f0f0', padding: '1em', minWidth: '50vw', marginBottom: '1em', filter: 'drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.25))'}}>
        <code style={{color: 'black', whiteSpace: 'pre-line'}}>
            {props.code.replaceAll('\t', '\u00A0\u00A0\u00A0\u00A0')}
        </code>
    </div>
}