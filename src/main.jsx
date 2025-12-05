import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartDataDealer } from './pages/CartData.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartDataDealer>
      <App />
    </CartDataDealer>
  </StrictMode>,
)
