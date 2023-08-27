import { LinkContainer } from 'react-router-bootstrap'
import { SidebarItems } from './SidebarItems';

export default function SidebarElement(props: {name?: string, category: string, highlighted: boolean, indented: boolean, disabled: boolean}) {
    const {name, category, highlighted, indented, disabled} = props;
    const path = name !== undefined ? `${category.toLowerCase().replaceAll(' ','-')}/${name.toLowerCase().replaceAll(' ','-')}` : `${category.toLowerCase().replaceAll(' ','-')}`;
    return <>
        <LinkContainer to={`/docs/${path}`}>
            <a className={`nav-link p-2 ${indented ? '' : 'm-2'} ${disabled ? 'disabled': ''} ${highlighted ? 'active' : ''} ${indented ? 'mx-4' : ''}`}  data-toggle='pill' role='tab'>{name ?? category}</a>
        </LinkContainer>
    </>
}