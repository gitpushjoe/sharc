import { useRef, useState } from 'react'
import './main.css'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { GettingStarted, GS_Overview, GS_Terminology } from './pages/GettingStarted'
import Sidebar from './components/Sidebar/Sidebar'
import * as Stage from './pages/Stage'
import * as Sprites from './pages/Sprites'
import * as Animation from './pages/Animation'
import * as Types from './pages/Types'
import * as Utils from './pages/Utils'
import { LinkContainer } from 'react-router-bootstrap'

function Docs() {

    const [showSidebar, setShowSidebar] = useState(false);
    const [page, setPage] = useState('');
    
    const params = useParams() as {category: string, subcategory: string};

  return (
    
    <>
    <div className='container-fluid d-flex justify-content-center col-12 p-0 m-0'>
        <div className='row row-3 col-12 p-0 m-0'>
        <nav className="container navbar navbar-expand-lg navbar-light bg-light col-12 p-3">
        <div className='container col-10'>
            <a className="navbar-brand" href="#">
            <img src="/sharc.svg" className='fix-image' width="80" alt=""/>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" onClick={() => {setShowSidebar(prev => !prev)}} aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav  mr-auto">
            <li className="nav-item active">
                <LinkContainer to='/'>
                <a className="nav-link lead mx-1" href="#">Home</a>
                </LinkContainer>
            </li>
            <li className="nav-item active">
                <a className="nav-link lead mx-1" href="#"><strong>Documentation</strong></a>
            </li>
            {/* <li className="nav-item active">
                <a className="nav-link lead mx-1" href="#">Examples</a>
            </li> */}
            <li className="nav-item active">
                <a className="nav-link lead mx-1" href="https://github.com/gitpushjoe/sharc">Github</a>
            </li>
            <li className="nav-item active">
                <a className="nav-link lead mx-1" href="https://www.npmjs.com/package/sharc-js">NPM</a>
            </li>
            {/* <li>
                <div className='d-md-block d-none' style={{width: '50vw', height: '0'}}>

                </div>
            </li> */}
            </ul>
            <div className="dropdown mr-sm-2">
                <button className="btn btn-outline-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Download{'\u00A0\u00A0'}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/1DA7QlCm2AYLxfLz9NlM1DHVcrK1dIBqr?usp=drive_link">beta v1.0.0</a>
                </div>
                </div>
        </div></div>
    </nav>
    </div>
        </div>

        <div className='container-fluid d-flex justify-content-center col-12 p-0 m-0'>
        <div className='d-flex flex-row col-12 col-md-10 p-0 m-0'>
            <div className={`${showSidebar ? 'col-10' : 'd-none'} col-lg-2 d-lg-block m-0 p-0`}>
                <Sidebar category={params.category} subcategory={params.subcategory}/>
            </div>
        <div className='col-12 col-md-9 col-lg-9 d-block m-0 p-md-4 p-2 border-left'>
            {
                params.category === 'getting-started' ? 
                    params.subcategory === 'first-steps' ? <GS_Overview /> :
                    params.subcategory === 'terminology' ? <GS_Terminology /> :
                <GettingStarted /> : 
                params.category === 'stage' ? 
                    params.subcategory === 'usage' ? <Stage.Usage /> :
                    params.subcategory === 'react' ? <Stage.React /> :
                    params.subcategory === 'angular' ? <Stage.Angular /> :
                    params.subcategory === 'event-listeners' ? <Stage.EventListeners /> :
                    <Stage.DefaultPage /> :
                params.category === 'sprites' ?
                    params.subcategory === 'usage' ? <Sprites.Usage /> :
                    params.subcategory === 'properties' ? <Sprites.Properties /> :
                    params.subcategory === 'details' ? <Sprites.Details /> :
                    params.subcategory === 'parenting' ? <Sprites.Parenting /> :
                    params.subcategory === 'the-base-shape-class' ? <Sprites.Shape /> :
                    params.subcategory === 'event-listeners' ? <Sprites.EventListeners /> :
                    params.subcategory === 'strokeablesprite' ? <Sprites.Strokeable /> :
                    params.subcategory === 'line' ? <Sprites.LinePage /> :
                    params.subcategory === 'rect' ? <Sprites.RectPage /> :
                    params.subcategory === 'ellipse' ? <Sprites.EllipsePage /> :
                    params.subcategory === 'beziercurve' ? <Sprites.BezierCurvePage /> :
                    params.subcategory === 'path' ? <Sprites.PathPage /> :
                    params.subcategory === 'polygon' ? <Sprites.PolygonPage /> :
                    params.subcategory === 'star' ? <Sprites.StarPage /> :
                    params.subcategory === 'text' ? <Sprites.TextPage /> :
                    params.subcategory === 'label' ? <Sprites.LabelPage /> :
                    params.subcategory === 'image' ? <Sprites.ImagePage /> :
                    params.subcategory === 'nullsprite' ? <Sprites.NullSpritePage /> :
                    <Sprites.Sprites/> :
                params.category === 'animation' ?
                    params.subcategory === 'channels' ? <Animation.Channels /> :
                    params.subcategory === 'smart-animations' ? <Animation.SmartAnimations /> :
                    params.subcategory === 'distribute' ? <Animation.Distribute /> :
                    params.subcategory === 'easing' ? <Animation.EasingPage /> :
                    <Animation.DefaultPage /> :
                params.category === 'types' ?
                    params.subcategory === 'common' ? <Types.Common /> :
                    params.subcategory === 'animation' ? <Types.AnimationPage /> :
                    params.subcategory === 'events' ? <Types.EventsPage /> :
                    params.subcategory === 'sprites' ? <Types.SpritesPage /> :
                    <Types.Types /> :
                params.category === 'utils' ?
                    params.subcategory === 'animation' ? <Utils.AnimationUtils /> :
                    <Utils.default /> :
                <> </>
            }    
        </div>
        </div>
        </div>
    </>
  )
}

export default Docs
