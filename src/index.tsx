import React from 'react'
import ReactDOM from 'react-dom/client'
import WebGLMap from './WebGLMap'
import reportWebVitals from './reportWebVitals'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <WebGLMap />
    </React.StrictMode>
)

reportWebVitals()
