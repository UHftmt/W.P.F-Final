import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 
import './Checkout.css';
import { useCart } from './Cart'; // adjust path as needed

// ---------------------------------------------------
// START: Logic from validation.js (Integrated)
// ---------------------------------------------------

// Checkout form validation schema
const checkoutSchema = z.object({
  // Personal Information
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: z.string()
    .email('Invalid email address'),
  phone: z.string()
    .regex(/^[0-9\-\+\(\)]*$/, 'Invalid phone number format'),
  
  // Billing Address
  billingStreet: z.string()
    .min(5, 'Street address must be at least 5 characters'),
  billingCity: z.string()
    .min(2, 'City name must be at least 2 characters'),
  billingState: z.string()
    .min(2, 'State is required'),
  billingPostalCode: z.string()
    .regex(/^[0-9\-]*$/, 'Postal code format is invalid'),
  
  // Same as Billing checkbox
  sameAsBilling: z.boolean().default(false),
  
  // Delivery Address
  deliveryStreet: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryState: z.string().optional(),
  deliveryPostalCode: z.string().optional(),
  
  // Credit Card
  cardholderName: z.string()
    .min(2, 'Cardholder name must be at least 2 characters'),
  cardNumber: z.string()
    .regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date format must be MM/YY'),
  cvv: z.string()
    .regex(/^\d{3}$/, 'CVV must be 3 digits'),
  
  // Terms
  termsAccepted: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(
  // The delivery address fields are required unless sameAsBilling is true.
  data => data.sameAsBilling || (data.deliveryStreet && data.deliveryCity && data.deliveryState && data.deliveryPostalCode),
  { 
    message: 'Delivery address is required unless "Same as billing" is checked.',
    path: ['deliveryStreet'] 
  } 
);

// ---------------------------------------------------
// END: Logic from validation.js (Integrated)
// ---------------------------------------------------


export default function Checkout() {
  const { cart, getTotalPrice, clearCart } = useCart(); 
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(checkoutSchema), 
    mode: 'onChange',
  })

  // Watch fields
  const isSameAsBilling = watch('sameAsBilling', false)
  const billingStreet = watch('billingStreet')
  const billingCity = watch('billingCity')
  const billingState = watch('billingState')
  const billingPostalCode = watch('billingPostalCode')

  const onSubmit = async (data) => {
    // If "Same as Billing" is checked, use billing address for delivery fields
    if (data.sameAsBilling) {
      data.deliveryStreet = billingStreet
      data.deliveryCity = billingCity
      data.deliveryState = billingState
      data.deliveryPostalCode = billingPostalCode
    }

    try {
      console.log('Checkout Data:', data)
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      setShowSuccess(true)
      
      // Clear cart after 2 seconds
      setTimeout(() => {
        clearCart();
        reset()
      }, 2000)
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  if (showSuccess) {
    return (
      <div className="checkout-page py-5">
        <div className="container">
          <div className="alert alert-success text-center" role="alert">
            <h3>🎉 Congratulations!</h3>
            <p>Your order has been placed successfully.</p>
            <p>Thank you for shopping at MyStore!</p>
          </div>
        </div>
      </div>
    )
  }

  // Uses the safe default value: cart = []
  if (cart.length === 0) {
    return (
      <div className="checkout-page py-5">
        <div className="container">
          <div className="alert alert-warning" role="alert">
            Your cart is empty. Please add items before checkout.
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = getTotalPrice()

  return (
    <div className="checkout-page py-5">
      <div className="container">
        <h1 className="mb-5">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Left Column - Forms */}
            <div className="col-lg-8">
              {/* Personal Information */}
              <div className="form-section card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Personal Information</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback d-block">
                          {errors.firstName.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback d-block">
                          {errors.lastName.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        {...register('email')}
                      />
                      {errors.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <div className="invalid-feedback d-block">
                          {errors.phone.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="form-section card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Billing Address</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.billingStreet ? 'is-invalid' : ''}`}
                      {...register('billingStreet')}
                    />
                    {errors.billingStreet && (
                      <div className="invalid-feedback d-block">
                        {errors.billingStreet.message}
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.billingCity ? 'is-invalid' : ''}`}
                        {...register('billingCity')}
                      />
                      {errors.billingCity && (
                        <div className="invalid-feedback d-block">
                          {errors.billingCity.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.billingState ? 'is-invalid' : ''}`}
                        {...register('billingState')}
                      />
                      {errors.billingState && (
                        <div className="invalid-feedback d-block">
                          {errors.billingState.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Postal Code *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.billingPostalCode ? 'is-invalid' : ''}`}
                        {...register('billingPostalCode')}
                      />
                      {errors.billingPostalCode && (
                        <div className="invalid-feedback d-block">
                          {errors.billingPostalCode.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Same as Billing Checkbox */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sameAsBilling"
                  {...register('sameAsBilling')} // Use RHF registration
                />
                <label className="form-check-label" htmlFor="sameAsBilling">
                  Use same address for delivery
                </label>
                {errors.deliveryStreet && isSameAsBilling === false && (
                  <div className="text-danger small d-block mt-1">
                    {errors.deliveryStreet.message}
                  </div>
                )}
              </div>

              {/* Delivery Address (hidden if same as billing) */}
              {!isSameAsBilling && (
                <div className="form-section card mb-4">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Delivery Address</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Street Address *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.deliveryStreet ? 'is-invalid' : ''}`}
                        {...register('deliveryStreet')}
                      />
                      {errors.deliveryStreet && (
                        <div className="invalid-feedback d-block">
                          {errors.deliveryStreet.message}
                        </div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.deliveryCity ? 'is-invalid' : ''}`}
                          {...register('deliveryCity')}
                        />
                        {errors.deliveryCity && (
                          <div className="invalid-feedback d-block">
                            {errors.deliveryCity.message}
                          </div>
                        )}
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.deliveryState ? 'is-invalid' : ''}`}
                          {...register('deliveryState')}
                        />
                        {errors.deliveryState && (
                          <div className="invalid-feedback d-block">
                            {errors.deliveryState.message}
                          </div>
                        )}
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Postal Code *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.deliveryPostalCode ? 'is-invalid' : ''}`}
                          {...register('deliveryPostalCode')}
                        />
                        {errors.deliveryPostalCode && (
                          <div className="invalid-feedback d-block">
                            {errors.deliveryPostalCode.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Card Information */}
              <div className="form-section card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Credit Card Information</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Cardholder Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardholderName ? 'is-invalid' : ''}`}
                      {...register('cardholderName')}
                    />
                    {errors.cardholderName && (
                      <div className="invalid-feedback d-block">
                        {errors.cardholderName.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Card Number *</label>
                    <input
                      type="text"
                      placeholder="1234567890123456"
                      className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                      {...register('cardNumber')}
                    />
                    {errors.cardNumber && (
                      <div className="invalid-feedback d-block">
                        {errors.cardNumber.message}
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Expiry Date (MM/YY) *</label>
                      <input
                        type="text"
                        placeholder="12/25"
                        className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                        {...register('expiryDate')}
                      />
                      {errors.expiryDate && (
                        <div className="invalid-feedback d-block">
                          {errors.expiryDate.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">CVV *</label>
                      <input
                        type="text"
                        placeholder="123"
                        className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                        {...register('cvv')}
                      />
                      {errors.cvv && (
                        <div className="invalid-feedback d-block">
                          {errors.cvv.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="termsAccepted"
                  {...register('termsAccepted')}
                />
                <label className="form-check-label" htmlFor="termsAccepted">
                  I agree to the terms and conditions *
                </label>
                {errors.termsAccepted && (
                  <div className="text-danger small d-block mt-1">
                    {errors.termsAccepted.message}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary card sticky-top">
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>

                  <div className="summary-items mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {cart.map(item => (
                      <div key={item.productId} className="summary-item d-flex justify-content-between mb-2 pb-2 border-bottom">
                        <span>{item.productId} x {item.quantity}</span>
                        <strong>${(item.price * item.quantity).toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="summary-total mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <strong>${totalPrice.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax (10%):</span>
                      <strong>${(totalPrice * 0.1).toFixed(2)}</strong>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total:</strong>
                      <strong className="text-success">${(totalPrice * 1.1).toFixed(2)}</strong>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-success btn-lg w-100">
                    Complete Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}