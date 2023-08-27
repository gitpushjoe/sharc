import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home'
import Docs from './docs/main.tsx'
import './main.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(<>

  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/docs/:category?/:subcategory?/:section?" element={<Docs />} />
            <Route path="/" element={<Home />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
  </>
)
