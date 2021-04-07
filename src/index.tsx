import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'

import App from './pages/App'

import Web3Manager from './context/Web3Manager'

ReactDOM.render(
  <React.StrictMode>
    <Web3Manager>
      <HashRouter>
        <App />
      </HashRouter>
    </Web3Manager>
  </React.StrictMode>,
  document.getElementById('root')
)
