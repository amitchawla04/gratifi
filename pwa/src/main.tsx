import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { fitViewport } from './fit'

fitViewport()

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
