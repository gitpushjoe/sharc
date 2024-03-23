import SidebarElement from "./SidebarElement";
import { SidebarItems } from "./SidebarItems";

export default function Sidebar(props: {category: string, subcategory: string|null}) {
    let {category, subcategory} = props;
    subcategory = subcategory === 'default' ? null : subcategory;
    return <>
            <div className='col-12 d-md-block p-2'>
            <br/>
            <h1 className='h5'> stable: 2.0.1 </h1>
            <hr/>
            <div className='nav flex-column nav-pills'  role='tablist' aria-orientation='vertical'>
                {[...Object.entries(SidebarItems)].map(([key, items], idx) => {
                    return <div key={idx}>
                        <SidebarElement category={key} key={idx} highlighted={(key.toLowerCase().replaceAll(' ','-') === category) && !subcategory} indented={false} disabled={false}/>
                        {items.map((item, idx2) => {
                            return <SidebarElement name={item} category={key} key={`${idx} ${idx2}`} highlighted={item.toLowerCase().replaceAll(' ','-') === subcategory && key.toLowerCase().replaceAll(' ','-') === category} indented={true} disabled={false}/>
                        })}
                    </div>
                })}
            </div>
        </div>
    </>
}
