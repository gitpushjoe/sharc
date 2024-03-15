export default function CodeBlurb(props: {blurb: string[]}) {
    return <div style={{marginTop: '0.75em', display: 'inline-block'}}>
        <span className='alert alert-secondary p-1' style={{width: 'fit-content', whiteSpace: 'nowrap', margin: '0'}}>
            <code className='p-1' style={{color: 'black'}}>
                <strong>{props.blurb[0]}</strong>
                {props.blurb[1]}
            </code>
        </span>
    </div>
}
