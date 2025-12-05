import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 
import './Checkout.css';
import { useCart } from './Cart'; 

const userSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, '* First name is required and must be at least 1 characters'),
  lastName: z.string().min(1, '* Last name is required and must be at least 1 characters'),
  email: z.string().email('* Invalid email address'),
  mobile: z.string().regex(/^\+?\d{10,15}$/, "* Invalid mobile number - must be 10-15 digits"),
  
  // Billing Address
  billingStreet: z.string().min(1, '* Street address is required and must be at least 1 characters'),
  billingCity: z.string().min(1, '* City name is required and must be at least 1 characters'),
  billingState: z.string().min(2, '* State name is required and must be at least 2 characters'),
  billingZipCode: z.string().regex(/^[0-9\-]*$/, '* Invalid Zip Code').min(1, '* Zip Code is required'),
  
  // Same as Billing checkbox
  sameAsBilling: z.boolean().default(false),
  
  // Delivery Address
  deliveryStreet: z.string().min(1, '* Street address is required and must be at least 1 characters'),
  deliveryCity: z.string().min(1, '* City name is required and must be at least 1 characters'),
  deliveryState: z.string().min(2, '* State name is required and must be at least 2 characters'),
  deliveryZipCode: z.string().regex(/^[0-9\-]*$/, '* Invalid Zip Code').min(1, '* Zip Code is required'),
  
  // Credit Card
  cardNumber: z.string().regex(/^\d{16}$/, '* Card number is required and must be 16 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, '* Expiry date format must be MM/YY'),
  cvv: z.string().regex(/^\d{3}$/, '* CVV must be 3 digits'),
  
  // Terms and Conditions
  termsAccepted: z.boolean().refine(val => val === true, '* You must accept the terms and conditions to continue'),
})

export default function Checkout() {
  const {cart, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, formState: {errors}, watch, reset, setValue } = useForm({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
  });

  const [isSame, street, city, state, zip] = ['sameAsBilling', 'billingStreet', 'billingCity', 'billingState', 'billingZipCode'].map(watch);

  useEffect(() => {
    if (isSame) {
      setValue('deliveryStreet', street || '');
      setValue('deliveryCity', city || '');
      setValue('deliveryState', state || '');
      setValue('deliveryZipCode', zip || '');
    }
  }, [isSame, street, city, state, zip, setValue]);

  const onSubmit = async (data) => {
    try {
      console.log('Checkout Data:', data);
      setShowSuccess(true);
      setTimeout(() => { clearCart(); reset(); }, 1000);
    } catch (e) {
      console.error('Checkout error:', e);
    }
  };

  if (showSuccess) return (<h1 className="pop-up pop-up-success" role="alert">🎉 Congratulations! 🎉<br/>Your order has been placed successfully.<br/>Thank you for shopping at MyShop!</h1>);

  if (cart.length === 0) return (<h1 className="pop-up" role="alert">Your cart is empty. Please add items before checkout.</h1>);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
    
          {/* Personal Information */}
          <div className="information-box">
            <div className="box-title"><h2>Personal Information</h2></div>
            <div className="box-body">
              <div className="box-row">
                <label className="label">First Name:</label>
                <input type="text" className={`type-box ${errors.firstName ? 'is-invalid' : ''}`} {...register('firstName')}/> 
              </div>
              {errors.firstName && <p className="invalid-text">{errors.firstName.message}</p>}
              <div className="box-row">
                <label className="label">Last Name:</label>
                <input type="text" className={`type-box ${errors.lastName ? 'is-invalid' : ''}`} {...register('lastName')}/>
              </div>
              {errors.lastName && <p className="invalid-text">{errors.lastName.message}</p>}
              <div className="box-row">
                <label className="label">Email:</label>
                <input type="email" className={`type-box ${errors.email ? 'is-invalid' : ''}`} {...register('email')}/>
              </div>
              {errors.email && <p className="invalid-text">{errors.email.message}</p>}
              <div className="box-row">
                <label className="label">Mobile:</label>
                <input type="tel" className={`type-box ${errors.mobile  ? 'is-invalid' : ''}`} {...register('mobile')}/>
              </div>
              {errors.mobile && <p className="invalid-text">{errors.mobile.message}</p>}
            </div>
          </div>

          {/* Billing Address */}
          <div className="information-box">
            <div className="box-title"><h2>Billing Address</h2></div>
            <div className="box-body">
              <div className="box-row">
                <label className="label">Street:</label>
                <input type="text" className={`type-box ${errors.billingStreet ? 'is-invalid' : ''}`} {...register('billingStreet')}/>
              </div>
              {errors.billingStreet && <p className="invalid-text">{errors.billingStreet.message}</p>}
              <div className="box-row">
                <label className="label">City:</label>
                <input type="text" className={`type-box ${errors.billingCity ? 'is-invalid' : ''}`} {...register('billingCity')}/>
              </div>
              {errors.billingCity && <p className="invalid-text">{errors.billingCity.message}</p>}
              <div className="box-row">
                <label className="label">State:</label>
                <input type="text" className={`type-box ${errors.billingState ? 'is-invalid' : ''}`} {...register('billingState')}/>
              </div>
              {errors.billingState && <p className="invalid-text">{errors.billingState.message}</p>}
              <div className="box-row">
                <label className="label">Zip Code:</label>
                <input type="text" className={`type-box ${errors.billingZipCode  ? 'is-invalid' : ''}`} {...register('billingZipCode')}/>
              </div>
              {errors.billingZipCode && <p className="invalid-text">{errors.billingZipCode.message}</p>}
            </div>
          </div>

          {/* Same as Billing Address Checkbox */}
          <div className="information-box">
            <input type="checkbox" className="checkbox" {...register('sameAsBilling')}/>
            <label className="label" htmlFor="sameAsBilling">Same as billing address</label>
          </div>
          
          {/* Delivery Address */}
          <div className="information-box">
            <div className="box-title"><h2>Delivery Address</h2></div>
            <div className="box-body">
              <div className="box-row">
                <label className="label">Street:</label>
                <input type="text" className={`type-box ${errors.deliveryStreet ? 'is-invalid' : ''}`} {...register('deliveryStreet')}/>
              </div>
              {errors.deliveryStreet && <p className="invalid-text">{errors.deliveryStreet.message}</p>}
              <div className="box-row">
                <label className="label">City:</label>
                <input type="text" className={`type-box ${errors.deliveryCity ? 'is-invalid' : ''}`} {...register('deliveryCity')}/>
              </div>
              {errors.deliveryCity && <p className="invalid-text">{errors.deliveryCity.message}</p>}
              <div className="box-row">
                <label className="label">State:</label>
                <input type="text" className={`type-box ${errors.deliveryState ? 'is-invalid' : ''}`} {...register('deliveryState')}/>
              </div>
              {errors.deliveryState && <p className="invalid-text">{errors.deliveryState.message}</p>}
              <div className="box-row">
                <label className="label">Zip Code:</label>
                <input type="text" className={`type-box ${errors.deliveryZipCode  ? 'is-invalid' : ''}`} {...register('deliveryZipCode')}/>
              </div>
              {errors.deliveryZipCode && <p className="invalid-text">{errors.deliveryZipCode.message}</p>}
            </div>
          </div>
            
          {/* Credit Card Information */}
          <div className="information-box">
            <div className="box-title"><h2>Credit Card Information</h2></div>
            <div className="box-body">
              <div className="box-row">
                <label className="label">Card Number:</label>
                <input type="text" className={`type-box ${errors.cardNumber ? 'is-invalid' : ''}`} {...register('cardNumber')}/>
              </div>
              {errors.cardNumber && <p className="invalid-text">{errors.cardNumber.message}</p>}
              <div className="box-row">
                <label className="label">Expiry Date:</label>
                <input type="text" placeholder=" MM/YY" className={`type-box ${errors.expiryDate ? 'is-invalid' : ''}`} {...register('expiryDate')}/>
              </div>
              {errors.expiryDate && <p className="invalid-text">{errors.expiryDate.message}</p>}
              <div className="box-row">
                <label className="label">CVV:</label>
                <input type="text" className={`type-box ${errors.cvv  ? 'is-invalid' : ''}`} {...register('cvv')}/>
              </div>
              {errors.cvv && <p className="invalid-text">{errors.cvv.message}</p>}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="information-box">
            <input type="checkbox" className="checkbox" {...register('termsAccepted')}/>
            <label className="label" htmlFor="termsAccepted">I agree to the Terms and Conditions</label>
            {errors.termsAccepted && <p className="invalid-text">{errors.termsAccepted.message}</p>}
          </div>
   
          {/* FINAL SUBMIT BUTTON */}
          <button type="submit" className="submit-button">Pay Now</button>
        </form>
    </div> 
  )}