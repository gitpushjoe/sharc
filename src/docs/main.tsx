import { useRef, useState } from 'react'
import './main.css'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import { LinkContainer } from 'react-router-bootstrap'
import PageLoader from './components/PageLoader'

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
                <a className="nav-link lead mx-1" href="#/docs/getting-started">
                    {
                        params.category !== 'changelog' ?
                        <strong>Documentation</strong> :
                        'Documentation'
                    }
                </a>
            </li>
            <li className="nav-item active">
                <a className="nav-link lead mx-1" href="#/docs/changelog">
                {
                    params.category === 'changelog' ?
                    <strong>Changelog</strong> :
                    'Changelog'
                }</a>
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
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/1Z86cmklHfvaYNVcZGo6sxgOdJTU4KcbO?usp=sharing">release v2.0.0</a>
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/1I3s5xR4A5pxEHy0lEQv7sCiAUtmzfzYH?usp=drive_link">release v1.4.0</a>
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/1XnoScU9DRUdjcIN7HQ8wWjTRNkCASWUu?usp=drive_link">release v1.3.2</a>
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/11ZEeAiAO7F-YRpSgM08XcRuj8LUhCyr5?usp=sharing">release v1.3.1</a>
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/1wdG0XfqM10HLGGbW4ktO4uRbWwNI3Wy8?usp=drive_link">release v1.2.0</a>
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/1M_PzHl7_uyRRhZnGtiCiSXayV93i5Nnb?usp=sharing">release v1.1.1</a>
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/1bK432l4WjHF7pybB76sHIi5o-CjLFJbv?usp=sharing">release v1.1.0</a>
                    <a className="dropdown-item" href="https://drive.google.com/drive/folders/1xH-roxXxDQrMc1iRvsIAIIJp3tjaAM5L?usp=sharing">release v1.0.0</a>
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
            <PageLoader category={params.category} subcategory={params.subcategory}/>
        </div>
        </div>
        </div>
    </>
  )
}

export default Docs
