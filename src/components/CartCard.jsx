import { CartDataHook } from "../pages/CartData"
import "./CartCard.css"

export default function CartCard({url, name, price, number}) {
    const { addToCart } = CartDataHook();
    const { removeFromCart } = CartDataHook();
    return (
        <div className="CartCard">
            <img className="CartImage" src={url} alt="product image" />
            <p>{name}</p>
            <div>
                <button onClick={() => addToCart({productId: name, price: price, image: url})}>+</button>
                <p>Price: {price}</p>
                <button onClick={() => removeFromCart({productId: name})}>-</button>
            </div>
            
            <p>Number: {number}</p>
        </div>
    )
}