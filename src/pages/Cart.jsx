import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './Cart.css'

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
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  // Update product quantity
  const updateQuantity = (productId, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (Number.isNaN(newQuantity) || newQuantity <= 0) {
      removeFromCart(productId);
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
  // 1. Destructure the necessary state and handlers from the integrated hook
  const {
    cart,
    updateQuantity: onUpdateQuantity,
    removeFromCart: onRemoveItem,
    getTotalPrice
  } = useCart();

  const navigate = useNavigate();

  // 2. Calculate total price once
  const totalPrice = getTotalPrice();

  // 3. Empty cart state
  if (cart.length === 0) {
    return (
      <div className="cart-page py-5">
        <div className="container text-center">
          <div className="empty-cart">
            <h2 className="mb-4">Your cart is empty</h2>
            <p className="text-muted mb-4">Start shopping to add items to your cart</p>
            <Link to="/" className="btn btn-primary btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Cart with items state
  return (
    <div className="cart-page py-5">
      <div className="container">
        <h1 className="mb-5">Shopping Cart</h1>

        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="cart-items">
              {cart.map(item => {
                const price = normalizePrice(item.price);
                const qty = Number(item.quantity) || 1;
                const lineTotal = price * qty;

                return (
                  <div key={item.productId} className="cart-item card mb-3">
                    <div className="card-body">
                      <div className="row align-items-center">
                        {/* Product Image */}
                        <div className="col-md-2">
                          <img
                            src={item.image}
                            alt={item.productId}
                            className="img-fluid rounded"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="col-md-4">
                          <h5>{item.productId}</h5>
                          <p className="text-muted small">{item.name}</p>
                          <p className="fw-bold">
                            Price: ${price.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-md-3">
                          <div className="quantity-controls">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => onUpdateQuantity(item.productId, qty - 1)}
                              disabled={qty <= 1}
                            >
                              −
                            </button>
                            <span className="quantity-display mx-2">{qty}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => onUpdateQuantity(item.productId, qty + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total Price */}
                        <div className="col-md-2 text-end">
                          <p className="fw-bold text-success">
                            ${lineTotal.toLocaleString()}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <div className="col-md-1 text-end">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onRemoveItem(item.productId)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="col-lg-4">
            <div className="cart-summary card sticky-top">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>

                <div className="summary-item d-flex justify-content-between mb-3">
                  <span>Subtotal ({cart.length} items):</span>
                  <strong>${totalPrice.toLocaleString()}</strong>
                </div>

                <div className="summary-item d-flex justify-content-between mb-3">
                  <span>Shipping:</span>
                  <strong>$0.00</strong>
                </div>

                <div className="summary-item d-flex justify-content-between mb-3">
                  <span>Tax:</span>
                  <strong>${(totalPrice * 0.1).toFixed(2)}</strong>
                </div>

                <hr />

                <div className="summary-item d-flex justify-content-between mb-4">
                  <strong>Total:</strong>
                  <strong className="text-success">
                    ${(totalPrice * 1.1).toFixed(2)}
                  </strong>
                </div>

                <button
                  className="btn btn-success btn-lg w-100 mb-3"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>

                <Link to="/" className="btn btn-outline-secondary w-100">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}