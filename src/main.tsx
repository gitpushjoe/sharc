import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home'
import Docs from './docs/main.tsx'
import './main.css'
import process from 'process'

import { HashRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(<>

  <>
    <HashRouter basename={process.env.PUBLIC_URL}>
        <Routes>
            <Route path="/docs/:category?/:subcategory?/:section?" element={<Docs />} />
            <Route path="/" element={<Home />} />
        </Routes>
    </HashRouter>
  </>
  </>
)
