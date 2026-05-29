import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderApi';
import '../styles/createOrder.css';

export const CreateOrder: React.FC = () => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return setError('Product is required');
    if (quantity <= 0) return setError('Quantity must be greater than 0');
    
    try {
      await createOrder({ product, quantity });
      alert('Order created successfully!');
      setProduct('');
      navigate('/orders');
    } catch (err) {
      setError('Failed to create order. Please try again.');
    }
  };

  return (
    <div>
      <h2 style={{marginTop:0}}>Create New Order</h2>
      <form className="create-order-form" onSubmit={handleSubmit}>
        {error && <div style={{color: '#e74c3c', fontWeight: 'bold'}}>{error}</div>}
        <input type="text" placeholder="Product Name" value={product} onChange={e => setProduct(e.target.value)} required />
        <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" required />
        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};