import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import './Cart.css'
import { CartDataHook } from './CartData';
import CartCard from '../components/CartCard';

const CART_STORAGE_KEY = 'shopping_cart';

// Helper to normalize price into a number
const normalizePrice = (value) => {
  if (value == null) return 0;
  const num = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

/**
 * Custom hook to manage shopping cart with localStorage
 * @returns {Object} - { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }
 */
export const useCart = () => {
  // Initialize cart state from localStorage or an empty array
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  /**
   * Add product to cart or increase quantity
   * @param {Object} product - The product object to add. Must include a 'productId' and 'price' field.
   */
  const addToCart = (product) => {
    // Simple validation
    if (!product || !product.productId) {
      console.error('Attempted to add invalid product to cart:', product);
      return;
    }

    // Normalize price once here
    const normalizedProduct = {
      ...product,
      price: normalizePrice(product.price),
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === normalizedProduct.productId);

      if (existingItem) {
        // Increase quantity if already in cart
        return prevCart.map(item =>
          item.productId === normalizedProduct.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new item with quantity 1
      return [...prevCart, { ...normalizedProduct, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCarta = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  // Update product quantity
  const updateQuantity = (productId, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (Number.isNaN(newQuantity) || newQuantity <= 0) {
      removeFromCarta(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total price (with guards)
  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
      const price = normalizePrice(item.price);
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0);
  };

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice };
};

export default function Cart() {
  const { cart } = CartDataHook();

  // 3. Empty cart state
  if (!cart) {
    return (
      <div className="cart-page py-5">
        <h2 className="mb-4">Your cart is empty</h2>
        <p className="text-muted mb-4">Start shopping to add items to your cart</p>
        <Link to="/" className="btn btn-primary btn-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // 4. Cart with items state
  return (
    <div className="cart-page py-5">
      <div>
        {cart?.map((item, index) => (
          <CartCard
            key={index}
            name={item.Id}
            url={item.Image}
            price={item.Price}
            number={item.Number}
          />
        ))}
      </div>
      <Link to="/" className="btn btn-primary btn-lg">
        Continue Shopping
      </Link>
    </div>
  )
}