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
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/3ec89edae46372e506e7d5b3703caa437b73ecee.zip">release v2.1.0</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/983f06c5a7b4dcf5072affab16ad7915b581ccbb.zip">release v2.0.2</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/c6563ff29efb4a7f72859ac561d053a1e850dbb8.zip">release v2.0.1</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/c6563ff29efb4a7f72859ac561d053a1e850dbb8.zip">release v2.0.0</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/456d01d3b91e6a0e46cd133cb2204d49a7ae12df.zip">release v1.4.0</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/d77a88d9561fb9d47103c221e7d03950b48b8f65.zip">release v1.3.2</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/eb02da45a0dc60d3cc8168c73467c915fc6eceb6.zip">release v1.3.1</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/e26470640b36dc067077da46c767c484a89467fc.zip">release v1.3.0</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/fd6aaf80dfdfb911f00067c816ef0e242a70d4c5.zip">release v1.2.0</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/f68f1a03a8adfff673732dfc96eb92a64ced3b58.zip">release v1.1.1</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/d80679e463b76e8c3c00a49d438bebed7456270d.zip">release v1.1.0</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/215b36ec5fc57e8403a4939019836c63b472a926.zip">release v1.0.0</a>
                    <a className="dropdown-item" href="https://github.com/gitpushjoe/sharc/archive/4f7d0d7b6ad8f1c9a9b8ef0a3e87a5f63b2fa4da.zip">beta v1.0.0</a>
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
