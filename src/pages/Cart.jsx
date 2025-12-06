import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const CART_STORAGE_KEY = "shopping_cart";

const normalizePrice = (value) => {
  const numericString = String(value).replace(/[^\d.]/g, "");
  const num = parseFloat(numericString);
  return Number.isNaN(num) ? 0 : num;
};

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading cart", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product || !product.productId) {
      console.error("Attempted to add invalid product to cart", product);
      return;
    }
    const normalizedProduct = {
      ...product,
      price: normalizePrice(product.price),
    };
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === normalizedProduct.productId
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === normalizedProduct.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...normalizedProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (Number.isNaN(newQuantity) || newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getTotalPrice = () =>
    cart.reduce((sum, item) => {
      const price = normalizePrice(item.price);
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice };
};

export default function Cart() {
  const {
    cart,
    updateQuantity: onUpdateQuantity,
    removeFromCart: onRemoveItem,
    getTotalPrice,
  } = useCart();
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();

  if (!cart || cart.length === 0) return (<h1 className="pop-up">Your cart is empty. Return Home to start shopping!</h1>);

  return (
    <div className="cart-page">
      <div className="title"><h1>Your Shopping Cart</h1></div>

          {/* Cart Items */}
          {cart.map(item => {
              const price = normalizePrice(item.price);
              const qty = Number(item.quantity) || 1;
              const lineTotal = price * qty;

              return (
                  <div key={item.productId} className="product-detail">
                      
                      <div className="product-left">
                        {/* Product Image */}
                         <img src={item.image} alt={item.productId}/>

                        {/* Product Info */}
                        <div className="product-info">
                          <p>Product ID: {item.productId}</p>
                          <p>Price: ${price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="product-right">
                        {/* Quantity Controls */}
                        <div className="quantity-control">
                          <button className="quantity-button" onClick={() => onUpdateQuantity(item.productId, qty - 1)} disabled={qty <= 0}>-</button>
                          <div className="quantity-count">{qty}</div>
                          <button className="quantity-button" onClick={() => onUpdateQuantity(item.productId, qty + 1)}>+</button>
                        </div>

                        {/* Total Price */}
                        <div className="price">${lineTotal.toLocaleString()}</div>
                      </div>
                  </div>
              )
          })}
          
          <div className="finish">
              <div>Total: ${totalPrice.toLocaleString()}</div>
              <button className="checkout-button" onClick={() => navigate('/checkout')}>Checkout</button>
          </div>
    </div>
  );
}