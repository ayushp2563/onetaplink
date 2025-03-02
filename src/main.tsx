
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the fonts
import "@fontsource/inter/variable.css"
import "@fontsource/playfair-display/400.css"
import "@fontsource/playfair-display/700.css"
import "@fontsource/roboto-mono/400.css"
import "@fontsource/montserrat/variable.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
