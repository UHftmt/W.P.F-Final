import { createContext, useContext, useState } from "react"

const CartData = createContext();

export function CartDataDealer({children}) {
    const [cart, setCart] = useState([]);

    const addToCart = ({productId, price, image}) => {
        setCart((prevCart) => {
            let found = false;
            const updatedCart = prevCart.map((item) => {
                if (item.Id === productId) {
                    found = true;
                    return {...item, Number: item.Number + 1 };
                }
                return item
            });
            return found ? updatedCart: [... updatedCart, {Id: productId, Price: price, Image: image, Number: 1}]
        });
    };

    const removeFromCart= ({productId}) => {
        setCart((prevCart) => {
            prevCart.map((item) => {
                if (item.Id === productId) {
                    return {...item, Number: item.Number - 1 };
                }
                return item
            })
            .filter((item) => item.Number > 0)
        });
    };

    return (
        <CartData.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartData.Provider>
    );
}

export const CartDataHook = () => useContext(CartData)