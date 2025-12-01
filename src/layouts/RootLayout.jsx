import { NavLink, Outlet } from "react-router-dom"
import "./RootLayout.css"

export default function RootLayout() {
    return (
        <div className="root-layout">
            <header>
                <p>MyShop</p>
                <nav>
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="cart">Cart</NavLink>
                    <NavLink to="checkout">Checkout</NavLink>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <p>Contact us: support@myshop.com|Phone: +61 123 456 789</p>
                <p>Terms & Condition | Privacy Policy</p>
            </footer>
        </div>
    )
}