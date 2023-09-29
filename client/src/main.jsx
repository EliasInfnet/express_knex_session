import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@mantine/core/styles.css';
import { MantineProvider, MantineThemeProvider } from '@mantine/core'

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme='dark' theme={{ primaryColor: 'orange' }}>
    <App />
  </MantineProvider>
)
