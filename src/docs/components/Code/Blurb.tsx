export default function CodeBlurb(props: {blurb: string[]}) {
    return <>
        <span className='alert alert-secondary p-1' style={{width: 'fit-content'}}>
            <code className='p-1' style={{color: 'black'}}>
                <strong>{props.blurb[0]}</strong>
                {props.blurb[1]}
            </code>
        </span>
    </>
}