import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'

// pages
import Home from './pages/Home.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import ProductDetail from './pages/ProductDetails.jsx'
import Error from './pages/Error.jsx'

//layout
import RootLayout from './layouts/RootLayout.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path='cart' element={<Cart />} />
      <Route path='checkout' element={<Checkout />} />
      <Route path='product/:id' element={<ProductDetail />} />
      <Route path='*' element={<Error />} />
    </Route>
  ),
  { basename: import.meta.env.BASE_URL }
)

function App() {
  return <RouterProvider router={router} />
}

export default App