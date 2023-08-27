import HyperlinkMap from "./HyperlinkMap";
import { LinkContainer } from "react-router-bootstrap";

export const Hyperlink = (props: {to?: string, children: string}) => {
    let link = props.to ?? HyperlinkMap.get(props.children!.toString());
    if (!link) {
        if (props.to) {
            link = props.to;
        } else {
            throw new Error(`No link found for ${props.children}`);
        }
    }
    return (
        <span>
        <LinkContainer to={'/docs/' + link}>
            <a>{props.children}</a>
        </LinkContainer>
        </span>
    );
}