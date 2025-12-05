import { NavLink, Outlet } from "react-router-dom"
import "./RootLayout.css"

export default function RootLayout() {
    return (
        <div className="root-layout">
            <header>
                <p className="header-text left">MyShop</p>
                <nav className="header-text">
                    <NavLink to="/" className={"NavLink"}>Home</NavLink>
                    <NavLink to="cart" className={"NavLink"}>Cart</NavLink>
                    <NavLink to="checkout" className={"NavLink right"}>Checkout</NavLink>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <p className="footer-text">Contact us: support@myshop.com|Phone: +61 123 456 789</p>
                <p className="footer-text">Terms & Condition | Privacy Policy</p>
            </footer>
        </div>
    )
}