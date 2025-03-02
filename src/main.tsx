
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the fonts - updated to use correct paths
import '@fontsource/inter/index.css'
import '@fontsource/playfair-display/index.css'
import '@fontsource/roboto-mono/index.css'
import '@fontsource/montserrat/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
