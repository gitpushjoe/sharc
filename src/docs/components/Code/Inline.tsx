export default function InlineCode (props: {children: string}) {
    return <span className='p-0 code-block' style={{margin: '1em 0'}}>
        <code style={{color: 'black', padding: '0em', fontWeight: 600, fontSize: 16}}>
            {props.children}
        </code>
    </span>
}