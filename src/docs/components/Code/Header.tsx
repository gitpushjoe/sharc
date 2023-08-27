export default function CodeHeader(props: {header: string}) {
    return <div className="my-1">
        <code className='lead text-dark'><strong>{props.header}</strong></code>
    </div>
}